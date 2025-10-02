import Hero from "../components/Hero.jsx";
import CourseList from "../components/CourseList.jsx";
import About from "../components/About.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Skills from "../components/Skills.jsx";
import JoinCommunity from "../components/JoinCommunity.jsx";
import Testimonial from "../components/Testimonial.jsx";

import "../App.css";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      {/* Section Heading */}
      <h2
        className="text-2xl sm:text-4xl font-bold md:text-center text-primary mb-10"
        // style={{ color: PRIMARY_BLUE }}
      >
        Explore Our Courses
      </h2>

      <CourseList />
      <Skills />
      <About />

      <JoinCommunity />
      <Testimonial />
      <ContactSection />
    </main>
  );
};

export default LandingPage;
