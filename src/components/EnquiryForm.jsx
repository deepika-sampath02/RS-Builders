import { useState } from 'react'
import { waLink } from '../data/content'
import { WhatsAppIcon } from './Reveal'

/**
 * Sends the enquiry straight to RS Builders' WhatsApp as a pre-written message.
 * No backend needed.
 */
export default function EnquiryForm({ interest = 'a home', defaultBudget = '' }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const msg =
      `Hello RS Builders,\n` +
      `I'm interested in ${interest}${defaultBudget ? ` (${defaultBudget})` : ''}.\n` +
      (name ? `Name: ${name}\n` : '') +
      (phone ? `Phone: ${phone}\n` : '') +
      (note ? `Message: ${note}\n` : '') +
      `Please share designs, availability and the next steps.`
    window.open(waLink(msg), '_blank', 'noopener')
  }

  const field =
    'w-full border-b border-ivory/20 bg-transparent py-3 text-[15px] text-ivory placeholder:text-ivory/35 outline-none transition focus:border-champagne'

  return (
    <form onSubmit={submit} className="space-y-6" aria-label="Enquire on WhatsApp">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Your name</span>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Raman" autoComplete="name" />
        </label>
        <label className="block">
          <span className="eyebrow">Phone</span>
          <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" inputMode="tel" autoComplete="tel" />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow">Tell us about your dream</span>
        <textarea className={`${field} resize-none`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Preferred design, plot, timeline…" />
      </label>
      <button type="submit" className="btn-whatsapp">
        <WhatsAppIcon className="h-4 w-4" /> Send on WhatsApp
      </button>
    </form>
  )
}
