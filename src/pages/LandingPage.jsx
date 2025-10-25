/* eslint-disable no-unused-vars */
import "react";
import PageContainer from "../components/layout/PageContainer";
import Hero from "../components/LandingPage/Hero";
import About from "../components/LandingPage/About";
import ContactSection from "../components/LandingPage/ContactSection";
import Skills from "../components/LandingPage/Skills";
import JoinCommunity from "../components/LandingPage/JoinCommunity";
import Testimonial from "../components/LandingPage/Testimonial";
import { useRealtime } from "../contexts/RealtimeContext";
import FeaturedCourses from "../components/LandingPage/FeaturedCourses";

const LandingPage = () => {
  const { courses, coursesLoading } = useRealtime();

  return (
    <main className="min-h-screen bg-app text-high">
      <Hero />
      <About />
      <FeaturedCourses />
      <Skills />
      <Testimonial />
      <JoinCommunity />
      <ContactSection />
    </main>
  );
};

export default LandingPage;