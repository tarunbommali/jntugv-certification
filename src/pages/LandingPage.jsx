/* eslint-disable no-unused-vars */
import Hero from "../components/LandingPage/Hero/Hero";
import PlatformOverview from "../components/LandingPage/PlatformOverview";
import FeaturedCourses from "../components/LandingPage/FeaturedCourses/FeaturedCourses";
import Faq from "../components/LandingPage/Faq/FAQSection.jsx";
import CTASection from "../components/LandingPage/CTASection";
import Contact from "../components/LandingPage/Contact/Contact";
import { useRealtime } from "../contexts/RealtimeContext";

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
      <PlatformOverview />
      <FeaturedCourses courses={featuredCourses} />
      <Faq />
      <CTASection />
      <Contact />
    </main>
  );
};

export default LandingPage;
