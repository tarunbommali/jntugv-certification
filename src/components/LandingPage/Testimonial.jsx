/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Quote, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { global_classnames } from "../../utils/classnames.js";
import { InfiniteMovingCards } from "./InfiniteMovingCards.jsx";

const testimonialsData = [
  {
    name: "Priya Sharma",
    title: "Student of JNTU-GV, CSE Department",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    quote:
      "The AI/ML certification from NxtGen helped me secure internships at top tech companies. The practical approach and industry-relevant curriculum made all the difference in my campus placements.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/priya-sharma",
  },
  {
    name: "Rajesh Kumar",
    title: "Student of Gayatri Vidya Parishad",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote:
      "As an electronics student, the cybersecurity program gave me the cross-domain skills needed to transition into IT security. The hands-on labs and capstone project were exceptional.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/rajesh-kumar",
  },
  {
    name: "Anita Patel",
    title: "Student of JNTU-GV, IT Department",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote:
      "The full-stack development certification complemented my college curriculum perfectly. I built real projects that became talking points in my interviews and helped me get multiple job offers.",
    sourceIcon:  Linkedin,
    source: "https://linkedin.com/in/anita-patel",
  },
  {
    name: "Vikram Singh",
    title: "Student of Andhra University",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote:
      "Coming from a statistics background, the data science program helped me bridge the gap between theory and industry applications. The mentorship from industry experts was invaluable.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/vikram-singh",
  },
  {
    name: "Sneha Reddy",
    title: "Student of JNTU-GV, ECE Department",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    quote:
      "The product management certification helped me think beyond technical skills. I learned user-centric design and product strategy that helped me lead college tech projects effectively.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/sneha-reddy",
  },
  {
    name: "Arjun Mehta",
    title: "Student of Gayatri College of Engineering",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote:
      "The cloud computing program gave me practical AWS experience that directly helped in my final year project. I deployed scalable applications that impressed my professors and recruiters alike.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/arjun-mehta",
  },
  {
    name: "Divya Nair",
    title: "Student of JNTU-GV, AIML Department",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
    quote:
      "The specialized AI certification enhanced my college learning with real-world implementations. I worked on live projects that are now part of my portfolio and helped me secure a research internship.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/divya-nair",
  },
  {
    name: "Karthik Malhotra",
    title: "Student of Vishnu Institute of Technology",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    quote:
      "As a mechanical engineering student, the programming foundations course opened up new career paths for me. I successfully transitioned to software development roles thanks to the comprehensive curriculum.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/karthik-malhotra",
  },
  {
    name: "Meera Iyer",
    title: "Student of JNTU-GV, CSE Department",
    image:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150&h=150&fit=crop&crop=face",
    quote:
      "The blockchain certification provided cutting-edge knowledge that wasn't covered in my college syllabus. I developed a decentralized application for my final year project that received special recognition.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/meera-iyer",
  },
  {
    name: "Sanjay Joshi",
    title: "Student of Gayatri Vidya Parishad College",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    quote:
      "The IoT specialization helped me combine my electronics knowledge with software skills. I built smart campus solutions that were implemented in our college, giving me practical experience beyond textbooks.",
    sourceIcon: Linkedin,
    source: "https://linkedin.com/in/sanjay-joshi",
  },
];
const Testimonial = () => {
  const testimonialItems = testimonialsData.map((testimonial) => ({
    name: testimonial.name,
    title: testimonial.title,
    quote: testimonial.quote,
    image: testimonial.image,
    sourceIcon: "",
    source: testimonial.source,
    sourceIcon: testimonial.sourceIcon,
  }));

  return (
    <section className="py-12 md:py-20 relative overflow-hidden ">
      <div
        className={`${global_classnames.width.container} mx-auto px-4 relative`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full  text-primary mb-4"
          >
            <Quote className="h-4 w-4" />
            <span className="text-sm font-medium">Success Stories</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text  mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how our certification programs have transformed careers and
            opened new opportunities
          </p>
        </motion.div>

        <InfiniteMovingCards
          items={testimonialItems}
          direction="left"
          speed="normal"
          pauseOnHover={true}
          className="mt-8"
        />
      </div>
    </section>
  );
};

export default Testimonial;
