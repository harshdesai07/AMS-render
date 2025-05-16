import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  );
}
