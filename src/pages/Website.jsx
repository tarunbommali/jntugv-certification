import Hero from "../components/Hero.jsx";
import CourseCarousel from "../components/CourseCarousel.jsx";
import CourseOverview from "../components/CourseOverview.jsx";
import ModulesSection from "../components/ModulesSection.jsx";
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
      <CourseCarousel />
      <CourseOverview />
      <Skills/>
      <CapstoneSection/>
      <ModulesSection />
      <JoinCommunity/>
      <Testimonial/>
      <ContactSection />
      <Footer />
      <WhatsAppChat />
    </main>
  );
};

export default Website;
