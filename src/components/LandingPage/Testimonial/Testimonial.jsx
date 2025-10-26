/* eslint-disable no-unused-vars */
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
 import { InfiniteMovingCards } from "./InfiniteMovingCards.jsx";
import AnimatedSectionHeader from "../ui/AnimatedSectionHeader.jsx";
import { testimonialsData } from '../../../data/landingPage/testimonials.js';
import PageContainer from "../../layout/PageContainer.jsx";

const Testimonial = () => {
  // Map the data to match your TestimonialCard component structure
  const testimonialItems = testimonialsData.map((testimonial) => ({
    name: testimonial.name,
    title: testimonial.title,
    quote: testimonial.quote,
    image: testimonial.image,
    source: testimonial.source,
    sourceIcon: testimonial.sourceIcon,
  }));

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <PageContainer className={` mx-auto px-4 relative`}>
        <AnimatedSectionHeader
          badge={{
            icon: Quote,
            text: "Success Stories",
          }}
          title="What Our Students Say"
          description="Discover how our certification programs have transformed careers and opened new opportunities"
        />
        
        <InfiniteMovingCards
          items={testimonialItems}
          direction="left"
          speed="normal"
          pauseOnHover={true}
          className="mt-8"
        />
      </PageContainer>
    </section>
  );
};

export default Testimonial;