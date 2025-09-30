import Hero from "../components/Hero.jsx";
import Courses from "../components/Courses.jsx";
import About from "../components/About.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Skills from "../components/Skills.jsx";
import JoinCommunity from "../components/JoinCommunity.jsx";
import Testimonial from "../components/Testimonial.jsx";

import "../App.css";

const Website = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />

      <Courses />
      <Skills />
      <About />

      <JoinCommunity />
      <Testimonial />
      <ContactSection />
    </main>
  );
};

export default Website;
