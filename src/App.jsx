import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import Home from './pages/Home'
import HomesPage from './pages/HomesPage'
import DesignDetail from './pages/DesignDetail'
import Projects from './pages/Projects'
import ContactSection from './components/ContactSection'

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollToContact) {
      const timer = setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 600)
      return () => clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.state])
  return null
}

const Page = ({ children }) => (
  <motion.main id="top" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
    {children}
  </motion.main>
)

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/2bhk-homes" element={<Page><HomesPage catKey="home2" /></Page>} />
          <Route path="/3bhk-homes" element={<Page><HomesPage catKey="home3" /></Page>} />
          <Route path="/duplex-villas" element={<Page><HomesPage catKey="villa" /></Page>} />
          <Route path="/private-villas" element={<Navigate to="/duplex-villas" replace />} />
          <Route path="/:slug/:id" element={<Page><DesignDetail /></Page>} />
          <Route path="/our-projects" element={<Page><Projects /></Page>} />
          <Route path="/contact" element={<Page><ContactSection standalone /></Page>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
