/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Quote, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { global_classnames } from "../../utils/classnames.js";
import { InfiniteMovingCards } from "./InfiniteMovingCards.jsx";

const testimonialsDummy = [
  {
    name: "Priya Sharma",
    title: "Software Engineer at Google",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    quote:
      "The AI/ML certification from JNTU-GV completely transformed my career. The hands-on projects and industry mentorship helped me land my dream job at Google.",
    rating: 5,
    course: "AI & Machine Learning",
    linkedin: "https://linkedin.com/in/priya-sharma",
  },
  {
    name: "Rajesh Kumar",
    title: "Cybersecurity Analyst at Microsoft",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote:
      "The cybersecurity program was incredibly comprehensive. I learned practical skills that I use every day in my role. The instructors were industry experts who really knew their stuff.",
    rating: 5,
    course: "Cybersecurity",
    linkedin: "https://linkedin.com/in/rajesh-kumar",
  },
  {
    name: "Anita Patel",
    title: "Full-Stack Developer at Amazon",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote:
      "The web development course gave me the confidence to switch careers. The curriculum was up-to-date with the latest technologies and the community support was amazing.",
    rating: 5,
    course: "Full-Stack Development",
    linkedin: "https://linkedin.com/in/anita-patel",
  },
  {
    name: "Vikram Singh",
    title: "Data Scientist at Netflix",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote:
      "The data science program exceeded my expectations. The real-world projects and industry connections helped me understand how to apply concepts in actual business scenarios.",
    rating: 5,
    course: "Data Science",
    linkedin: "https://linkedin.com/in/vikram-singh",
  },
  {
    name: "Sneha Reddy",
    title: "Product Manager at Meta",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    quote:
      "The product management certification gave me the strategic thinking framework I needed to excel in my role. The case studies were incredibly relevant.",
    rating: 5,
    course: "Product Management",
    linkedin: "https://linkedin.com/in/sneha-reddy",
  },
  {
    name: "Arjun Mehta",
    title: "Cloud Architect at AWS",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote:
      "The cloud computing program provided hands-on experience with real AWS projects. The instructors were current industry practitioners.",
    rating: 5,
    course: "Cloud Computing",
    linkedin: "https://linkedin.com/in/arjun-mehta",
  },
];

const Testimonial = () => {
  const handleLinkedInClick = (e, url) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Transform testimonialsDummy to match InfiniteMovingCards format
  const testimonialItems = testimonialsDummy.map((testimonial) => ({
    name: testimonial.name,
    title: testimonial.role || testimonial.title,
    quote: testimonial.content || testimonial.quote,
    image: testimonial.image,
    rating: testimonial.rating,
    course: testimonial.course,
    linkedin: testimonial.linkedin,
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
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
