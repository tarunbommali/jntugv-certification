// import Hero from "../components/LandingPage/Hero.jsx";
import CourseList from "../components/Course/CourseList.jsx";
// import About from "../components/LandingPage/About.jsx";
// import ContactSection from "../components/LandingPage/ContactSection.jsx";
// import Skills from "../components/LandingPage/Skills.jsx";
// import JoinCommunity from "../components/LandingPage/JoinCommunity.jsx";
// import Testimonial from "../components/LandingPage/Testimonial.jsx";

import "../App.css";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* <Hero /> */}
      <h2
        className="text-2xl sm:text-4xl font-bold md:text-center text-primary my-10"
        // style={{ color: PRIMARY_BLUE }}
      >
        Explore Our Courses
      </h2>

      <CourseList courses={"courses"}/>
      {/*
      <Skills />
      <About />
      <JoinCommunity />
      <Testimonial />
      <ContactSection /> 
      */}
    </main>
  );
};

export default LandingPage;
