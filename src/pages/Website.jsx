import Hero from "../components/Hero.jsx";
import Courses from "../components/Courses.jsx";
import About from "../components/About.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppChat from "../components/WhatsAppChat.jsx";
import Skills from '../components/Skills.jsx'
import CapstoneSection from '../components/CapstoneSection.jsx'
import Hero2 from '../components/Hero2.jsx'
import JoinCommunity from '../components/JoinCommunity.jsx'
import Testimonial from '../components/Testimonial.jsx'

import '../App.css'

const Website = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
       <Hero />
      <Hero2/>
      <Courses />
      <Skills/>
      <CapstoneSection/>
            <About />

       <JoinCommunity/>
      <Testimonial/>
      <ContactSection />
      
    </main>
  );
};

export default Website;
