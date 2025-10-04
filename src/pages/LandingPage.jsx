import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import Hero from '../components/landing/Hero';
import CourseList from '../components/course/CourseList';
import About from '../components/landing/About';
import ContactSection from '../components/landing/ContactSection';
import Skills from '../components/landing/Skills';
import JoinCommunity from '../components/landing/JoinCommunity';
import Testimonial from '../components/landing/Testimonial';
import { useRealtime } from '../contexts/RealtimeContext';

const LandingPage = () => {
  const { courses, coursesLoading } = useRealtime();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      
      {/* Featured Courses Section */}
      <section className="py-16">
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Explore Our Courses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover industry-relevant certification programs designed to advance your career
            </p>
          </div>
          
          <CourseList 
            courses={courses.slice(0, 8)} // Show only first 8 courses on landing page
            loading={coursesLoading}
            className="mb-8"
          />
        </PageContainer>
      </section>

      <Skills />
      <About />
      <JoinCommunity />
      <Testimonial />
      <ContactSection />
    </main>
  );
};

export default LandingPage;