/**
 * frameScroll.js — scroll-controlled frame animation (vanilla JS, no libraries)
 *
 * HOW IT WORKS (the short version)
 *  1. The hero <section> is very tall (500vh). Inside it, a "sticky" box stays glued
 *     to the screen while you scroll through the tall section.
 *  2. Your scroll position becomes a number from 0 (top) to 1 (bottom) = TARGET progress.
 *  3. A second number, CURRENT progress, glides toward the target a little each
 *     animation frame (9% of the gap). That glide is what makes it feel smooth.
 *  4. CURRENT progress picks a picture from your frames. If it lands between two
 *     frames, both are drawn on the <canvas> and blended (globalAlpha).
 *
 * Everything you are likely to edit is in CONFIG just below.
 */

// ─────────────────────────────  CONFIG  ──────────────────────────────
export const CONFIG = {
  folder: 'frames/',          // folder inside /public that holds the pictures
  prefix: 'ezgif-frame-',     // start of every file name
  extension: '.jpg',          // end of every file name
  totalFrames: 120,           // how many pictures you have
  digits: 3,                  // 001, 002 … (3 digits)
  firstFrame: 1,              // the number in the FIRST file name (ezgif-frame-001 → 1)

  smoothing: 0.09,            // how fast "current" chases "target" (0.09 = 9% per frame)
  heroHeight: '500vh',        // total scroll length of the hero
  concurrency: 6,             // how many pictures download at the same time
  maxPixelRatio: 2,           // cap for sharp (retina) screens

  mobileBreakpoint: 820,      // screens narrower than this (px) are treated as "small"
  mobileStep: 3,              // small screens load every 3rd frame (saves data + memory)
  mobileMaxPixelRatio: 1.5,   // phones draw a little softer, but use far less memory
  mobileFit: 0.6,             // phones: 0 = fill the screen (crops the sides, zoomed in)
                              //         1 = show the WHOLE picture (smaller, blurred bars above/below)
                              //         0.6 = a good middle. Try 0.4 – 0.8 to taste.
  mobileFocusX: 0.5,          // phones: which part of the picture stays in view when sides are cut
                              //         0 = left edge, 0.5 = centre, 1 = right edge
  mobileFocusY: 0.45,         // phones: vertical position of the picture when bars are shown

  textFadeEnd: 0.10,          // hero text is fully faded after the first 10% of scroll
  reducedMotionFrame: 'last', // picture shown if the visitor turned off animations
                              //   ('last', or a frame number like 60)

  showProgress: true,         // thin progress bar with stage labels
  stages: ['Consult', 'Design', 'Build', 'Finish', 'Handover'], // split evenly along the bar
}
// ───────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.BASE_URL || '/'
const imageCache = new Map() // url → loaded image. Survives page changes, so coming back is instant.

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))

/** 7 → "007" */
const pad = (n) => String(n).padStart(CONFIG.digits, '0')

/** 7 → "/frames/ezgif-frame-007.jpg" */
const frameUrl = (n) => `${BASE}${CONFIG.folder}${CONFIG.prefix}${pad(n)}${CONFIG.extension}`

/** Sets a height that works on phones too (100svh ignores the moving address bar). */
function setHeight(el, value) {
  if (value === '100svh') el.style.height = '100vh' // fallback for old browsers
  el.style.height = value
}

/**
 * Which frame NUMBERS to load. Big screens: all of them.
 * Small screens: every 2nd one (plus the very last, so the ending is always there).
 */
function buildFrameNumbers(isSmallScreen) {
  const step = isSmallScreen ? CONFIG.mobileStep : 1
  const nums = []
  for (let i = 0; i < CONFIG.totalFrames; i += step) nums.push(CONFIG.firstFrame + i)
  const last = CONFIG.firstFrame + CONFIG.totalFrames - 1
  if (nums[nums.length - 1] !== last) nums.push(last)
  return nums
}

/**
 * Starts the animation. Pass in the page elements it should control.
 * Returns a function that stops everything (called when the page is left).
 */
export function createFrameScroll({ section, sticky, canvas, text, scrim, hint, loader, loaderFill, loaderLabel, story, progress, progressFill }) {
  const ctx = canvas.getContext('2d')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isSmallScreen = window.innerWidth < CONFIG.mobileBreakpoint
  // On phones every picture is shrunk + cropped to the screen the moment it arrives, and the
  // big original is thrown away. Without this a phone holds ~60 full-size photos in memory
  // and the browser silently gives up (blank / frozen hero).
  const lowMemory = isSmallScreen
  let generation = 0 // bumped when we must reload the pictures (phone rotated)
  let layoutKey = ''

  // ── Which pictures do we need? ──────────────────────────────────────
  let nums = buildFrameNumbers(isSmallScreen)
  if (reducedMotion) {
    // Visitor wants less motion: show ONE still picture, no scrubbing.
    const wanted = CONFIG.reducedMotionFrame === 'last' ? Infinity : CONFIG.reducedMotionFrame
    const pick = nums.find((n) => n >= wanted) ?? nums[nums.length - 1]
    nums = [pick]
  }
  const urls = nums.map(frameUrl)
  const total = urls.length
  const frames = new Array(total).fill(null) // loaded pictures (null = not loaded / failed)

  // ── State ───────────────────────────────────────────────────────────
  let target = 0 // where the scroll bar says we are (0 → 1)
  let current = 0 // where the animation really is (chases target)
  let rafId = 0 // id of the pending animation frame (0 = loop is asleep)
  let destroyed = false
  let cssW = 0
  let cssH = 0
  let loadedCount = 0 // pictures finished (loaded OR failed) — drives the % bar
  let anyFrameLoaded = false
  let canvasShown = false
  let lastStage = -1

  setHeight(sticky, '100svh')
  setHeight(section, reducedMotion ? '100svh' : CONFIG.heroHeight)

  const stageEls = progress ? Array.from(progress.querySelectorAll('[data-stage]')) : []
  const storyEls = story ? Array.from(story.querySelectorAll('[data-story-stage]')) : []
  if (progress && (!CONFIG.showProgress || reducedMotion)) progress.style.display = 'none'

  // ── Scroll → progress ───────────────────────────────────────────────
  /** How far through the hero are we? 0 = top of hero, 1 = end of hero. */
  function readScrollProgress() {
    const top = section.getBoundingClientRect().top
    const scrollableDistance = section.offsetHeight - sticky.offsetHeight
    return scrollableDistance > 0 ? clamp(-top / scrollableDistance) : 0
  }

  // ── Drawing ─────────────────────────────────────────────────────────
  /** If a picture is missing, borrow the closest one that DID load. Never returns junk. */
  function nearestLoadedFrame(index) {
    if (frames[index]) return frames[index]
    for (let d = 1; d < total; d++) {
      if (frames[index - d]) return frames[index - d]
      if (frames[index + d]) return frames[index + d]
    }
    return null
  }

  /** Draws one picture so it FILLS the screen without stretching ("cover"), centred. */
  function drawCover(img) {
    if (img.prepared) { // already cropped to the screen (phones)
      ctx.drawImage(img, 0, 0, cssW, cssH)
      return
    }
    const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (cssW - w) / 2, (cssH - h) / 2, w, h)
  }

  /** Phones only: shrink + crop a picture to exactly what the screen shows ("cover"). */
  function prepare(img) {
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.mobileMaxPixelRatio)
    const pw = Math.max(1, Math.round(cssW * dpr))
    const ph = Math.max(1, Math.round(cssH * dpr))
    const cover = Math.max(pw / img.naturalWidth, ph / img.naturalHeight) // fills the screen
    const whole = Math.min(pw / img.naturalWidth, ph / img.naturalHeight) // whole picture visible
    const scale = cover + (whole - cover) * clamp(CONFIG.mobileFit) // somewhere in between
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    const c = document.createElement('canvas')
    c.width = pw
    c.height = ph
    const g = c.getContext('2d')
    if (scale < cover - 0.001) {
      // The picture is smaller than the screen → fill the leftover space with a soft blurred
      // copy of itself (shrink to a tiny image, then stretch it back = cheap blur on every phone).
      const tiny = document.createElement('canvas')
      tiny.width = 24
      tiny.height = Math.max(1, Math.round((24 * ph) / pw))
      const t = tiny.getContext('2d')
      const cs = Math.max(tiny.width / img.naturalWidth, tiny.height / img.naturalHeight)
      t.drawImage(img, (tiny.width - img.naturalWidth * cs) / 2, (tiny.height - img.naturalHeight * cs) / 2, img.naturalWidth * cs, img.naturalHeight * cs)
      g.imageSmoothingQuality = 'high'
      g.drawImage(tiny, 0, 0, pw, ph)
    }
    g.drawImage(img, (pw - w) * clamp(CONFIG.mobileFocusX), (ph - h) * clamp(CONFIG.mobileFocusY), w, h)
    c.prepared = true
    return c
  }

  /** Paints the canvas for the current progress (blends two neighbouring frames). */
  function render() {
    if (!cssW || !cssH) return
    const position = reducedMotion ? 0 : current * (total - 1) // e.g. 41.3
    const indexA = Math.floor(position) // frame 41
    const indexB = Math.min(indexA + 1, total - 1) // frame 42
    const blend = position - indexA // 0.3 → 30% of frame 42 on top of frame 41
    const frameA = nearestLoadedFrame(indexA)
    const frameB = nearestLoadedFrame(indexB)

    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, cssW, cssH)
    if (frameA) drawCover(frameA)
    if (frameA && frameB && frameB !== frameA && blend > 0.001 && !reducedMotion) {
      ctx.globalAlpha = blend
      drawCover(frameB)
      ctx.globalAlpha = 1
    }

    if (!canvasShown && frameA) {
      canvasShown = true
      canvas.style.opacity = '1' // fade the canvas in over the fallback background
    }
    updateOverlay()
  }

  /** Hero text, "Scroll" hint and progress bar react to progress. */
  function updateOverlay() {
    const fade = clamp(current / CONFIG.textFadeEnd) // 0 → 1 during the first 10%
    if (text) {
      text.style.opacity = String(1 - fade)
      text.style.transform = reducedMotion ? 'none' : `translate3d(0, ${-fade * 48}px, 0)`
      text.style.visibility = fade >= 1 ? 'hidden' : 'visible' // not clickable once invisible
    }
    // The dark side-gradient only exists to keep the text readable, so it fades with the text
    if (scrim) scrim.style.opacity = String(1 - fade)
    if (hint) hint.style.opacity = String(1 - clamp(current / (CONFIG.textFadeEnd * 0.6)))

    if (story && storyEls.length && !reducedMotion) {
      story.style.opacity = String(clamp((current - CONFIG.textFadeEnd) / 0.04))
      const storyStage = Math.min(storyEls.length - 1, Math.floor(clamp((current - CONFIG.textFadeEnd) / (1 - CONFIG.textFadeEnd)) * storyEls.length))
      storyEls.forEach((el, i) => el.setAttribute('data-active', String(i === storyStage)))
    }

    if (progress && CONFIG.showProgress && !reducedMotion) {
      progress.style.opacity = String(clamp(current / 0.06))
      progressFill.style.transform = `scaleX(${current})`
      const stage = Math.min(CONFIG.stages.length - 1, Math.floor(current * CONFIG.stages.length))
      if (stage !== lastStage) {
        lastStage = stage
        stageEls.forEach((el, i) => el.setAttribute('data-active', String(i === stage)))
      }
    }
  }

  // ── The smoothing loop (only runs while catching up) ────────────────
  function tick() {
    rafId = 0
    const gap = target - current
    if (Math.abs(gap) < 0.0004) {
      current = target // arrived: draw the final picture and let the loop sleep
      render()
      return
    }
    current += gap * CONFIG.smoothing // move 9% of the remaining distance
    render()
    rafId = requestAnimationFrame(tick) // not there yet → ask for another frame
  }

  /** Wakes the loop up if it is asleep. */
  function wake() {
    if (!rafId && !destroyed) rafId = requestAnimationFrame(tick)
  }

  function onScroll() {
    target = readScrollProgress()
    if (reducedMotion) {
      current = target
      render()
    } else {
      wake()
    }
  }

  // ── Sizing (sharp on retina screens, capped at 2×) ──────────────────
  function resize() {
    const w = sticky.clientWidth
    const h = sticky.clientHeight
    if (w === cssW && h === cssH) return
    cssW = w
    cssH = h
    const dpr = Math.min(window.devicePixelRatio || 1, lowMemory ? CONFIG.mobileMaxPixelRatio : CONFIG.maxPixelRatio)
    canvas.width = Math.round(cssW * dpr)
    canvas.height = Math.round(cssH * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // from now on we draw in normal CSS pixels
    target = readScrollProgress()
    if (reducedMotion) current = target
    render()
    // Phone rotated (new shape)? The cropped pictures no longer fit → fetch them again
    // (they come from the browser cache, so it is fast).
    const key = `${cssW}x${cssH}`
    if (lowMemory && layoutKey && key !== layoutKey && !destroyed) {
      layoutKey = key
      generation++
      loadedCount = 0
      preload(generation)
    }
    layoutKey = key
  }

  // ── Loading ─────────────────────────────────────────────────────────
  /** Loads picture number `index`. Always resolves (true = ok, false = failed). Never throws. */
  function loadFrame(index) {
    return new Promise((resolve) => {
      const url = urls[index]
      const cached = lowMemory ? null : imageCache.get(url)
      if (cached) {
        frames[index] = cached
        return resolve(true)
      }
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (lowMemory) {
          frames[index] = prepare(img) // keep only the small cropped copy
        } else {
          imageCache.set(url, img)
          frames[index] = img
        }
        resolve(true)
      }
      img.onerror = () => {
        console.warn(`[frame-scroll] Could not load ${url}. Showing the nearest loaded frame instead.`)
        resolve(false)
      }
      img.src = url
    })
  }

  function updateLoader() {
    if (!loader) return
    const done = loadedCount / total
    loaderFill.style.transform = `scaleX(${done})`
    loaderLabel.textContent = `Loading ${Math.round(done * 100)}%`
    if (loadedCount >= total) {
      loader.style.opacity = '0' // fade out…
      setTimeout(() => {
        if (!destroyed) loader.style.display = 'none' // …then remove
      }, 700)
    }
  }

  /** Frame 1 first (shown at once), then everything else, 6 at a time, in order. */
  async function preload(gen = generation) {
    anyFrameLoaded = await loadFrame(0)
    if (gen !== generation || destroyed) return
    loadedCount++
    render() // show frame 1 immediately
    updateLoader()

    let next = 1
    const worker = async () => {
      while (!destroyed && gen === generation && next < total) {
        const index = next++
        const ok = await loadFrame(index)
        if (gen !== generation) return
        loadedCount++
        if (ok) anyFrameLoaded = true
        if (!rafId) render() // pick up newly arrived pictures while the loop is asleep
        updateLoader()
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONFIG.concurrency, total) }, worker))
    if (destroyed || gen !== generation) return

    if (!anyFrameLoaded) {
      // Nothing loaded at all (wrong folder or file names?). Don't leave a long empty scroll.
      console.warn(`[frame-scroll] No frames found at ${BASE}${CONFIG.folder}. Check CONFIG (folder, prefix, extension, digits).`)
      setHeight(section, '100svh')
      canvas.style.display = 'none'
      if (progress) progress.style.display = 'none'
      if (loader) loader.style.display = 'none'
      target = current = 0
      updateOverlay()
    }
  }

  // ── Start ───────────────────────────────────────────────────────────
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(sticky)
  window.addEventListener('scroll', onScroll, { passive: true })

  target = current = readScrollProgress() // if the page was reloaded mid-scroll, start there
  resize()
  preload()

  // ── Stop (cleanup) ──────────────────────────────────────────────────
  return function destroy() {
    destroyed = true
    cancelAnimationFrame(rafId)
    window.removeEventListener('scroll', onScroll)
    resizeObserver.disconnect()
  }
}
