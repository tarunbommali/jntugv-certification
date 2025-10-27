/* eslint-disable no-unused-vars */
import Hero from "../components/LandingPage/Hero/Hero";
import About from "../components/LandingPage/About/About";
import Contact from "../components/LandingPage/Contact/Contact";
import Skills from "../components/LandingPage/Skills/Skills";
import Faq from "../components/LandingPage/Faq/FAQSection.jsx";
import JoinCommunity from "../components/LandingPage/JoinCommunity/JoinCommunity";
import Testimonial from "../components/LandingPage/Testimonial/Testimonial";
import { useRealtime } from "../contexts/RealtimeContext";
import FeaturedCourses from "../components/LandingPage/FeaturedCourses/FeaturedCourses";

const LandingPage = () => {
  const { courses } = useRealtime();

  const featuredCourses = Array.isArray(courses)
    ? courses.filter(
        (course) => course?.isFeatured === true || course?.featured === true
      )
    : [];

  return (
    <main className="min-h-screen bg-app text-high">
      <Hero />
      <About />
      <FeaturedCourses courses={featuredCourses} />
      <Skills />
      <Testimonial />
      <Faq />
      <JoinCommunity />
      <Contact />
    </main>
  );
};

export default LandingPage;
