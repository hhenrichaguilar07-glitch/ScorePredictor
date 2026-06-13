import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import PredictForm from './components/PredictForm.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Features from './components/Features.jsx'
import Statistics from './components/Statistics.jsx'
import Footer from './components/Footer.jsx'

// App stitches together every section in the order they appear in the screenshots.
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <PredictForm />
      <HowItWorks />
      <Features />
      <Statistics />
      <Footer />
    </div>
  )
}
