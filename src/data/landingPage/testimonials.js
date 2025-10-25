// data/testimonials.js
import { Linkedin, Twitter, Globe } from "lucide-react";

const PROFILE_URL =
  "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg";
export const testimonialsData = [
  {
    id: 1,
    name: "Priya Sharma",
    title: "Software Developer at Tech Solutions Inc.",
    quote:
      "The Full Stack Web Development course completely transformed my career. The hands-on projects and industry-relevant curriculum helped me land a job at a top tech company within 2 months of completion.",
    image: PROFILE_URL,
    source: "https://linkedin.com/in/priyasharma",
    sourceIcon: Linkedin,
    rating: 5,
  },
  {
    id: 2,
    name: "Rahul Kumar",
    title: "Data Scientist at Analytics Pro",
    quote:
      "As someone from a non-technical background, I was skeptical about switching to data science. But this certification program made the journey smooth. The practical assignments and mentor guidance were exceptional.",
    image: PROFILE_URL,
    source: "https://linkedin.com/in/rahulkumar",
    sourceIcon: Linkedin,
    rating: 5,
  },
  {
    id: 3,
    name: "Ananya Patel",
    title: "Cloud Engineer at CloudTech Solutions",
    quote:
      "The AWS certification course provided me with in-depth knowledge and hands-on experience. The lab sessions were particularly helpful. I received multiple job offers even before completing the course!",
    image: PROFILE_URL,
    source: "https://linkedin.com/in/ananyapatel",
    sourceIcon: Linkedin,
    rating: 4,
  },
  {
    id: 4,
    name: "Vikram Singh",
    title: "Cybersecurity Analyst at SecureNet Systems",
    quote:
      "This cybersecurity program gave me the practical skills needed in today's threat landscape. The capstone project was real-world focused and helped me build a strong portfolio.",
    image: PROFILE_URL,
    source: "https://linkedin.com/in/vikramsingh",
    sourceIcon: Linkedin,
    rating: 5,
  },
  {
    id: 5,
    name: "Sneha Reddy",
    title: "Mobile App Developer at AppInnovate",
    quote:
      "The React Native course was comprehensive and up-to-date with industry standards. I built 3 real apps during the course that became talking points in my interviews.",
    image: PROFILE_URL,
    source: "https://twitter.com/snehareddy",
    sourceIcon: Twitter,
    rating: 4,
  },
  {
    id: 6,
    name: "Arjun Mehta",
    title: "DevOps Engineer at ScaleFast Technologies",
    quote:
      "The DevOps program completely changed my approach to software development. Learning Docker, Kubernetes, and CI/CD pipelines in a practical environment was invaluable.",
    image: PROFILE_URL,
    source: "https://linkedin.com/in/arjunmehta",
    sourceIcon: Linkedin,
    rating: 5,
  },
  {
    id: 7,
    name: "Neha Gupta",
    title: "UI/UX Designer at DesignCraft Studio",
    quote:
      "Coming from a graphic design background, this course helped me transition into UI/UX seamlessly. The design thinking approach and portfolio-building projects were exceptional.",
    image: PROFILE_URL,
    source: "https://neha-gupta-portfolio.com",
    sourceIcon: Globe,
    rating: 5,
  },
  {
    id: 8,
    name: "Rajesh Nair",
    title: "AI Engineer at AI Innovations Lab",
    quote:
      "The AI course provided a perfect blend of theory and practical implementation. Working on real-world AI projects under expert guidance prepared me for industry challenges.",
    image: PROFILE_URL,
    source: "https://linkedin.com/in/rajeshnair",
    sourceIcon: Linkedin,
    rating: 4,
  },
  {
    id: 9,
    name: "Pooja Desai",
    title: "Digital Marketing Specialist at Growth Hackers",
    quote:
      "This digital marketing program covered everything from SEO to social media marketing. The live campaigns we ran during the course gave me practical experience that impressed employers.",
    image: PROFILE_URL,
    source: "https://twitter.com/poojadesai",
    sourceIcon: Twitter,
    rating: 5,
  },
  {
    id: 10,
    name: "Amit Joshi",
    title: "Blockchain Developer at ChainTech Solutions",
    quote:
      "The blockchain course was ahead of its time. Learning smart contracts and DApp development with hands-on projects made me industry-ready.",
    image: PROFILE_URL,
    source: "https://linkedin.com/in/amitjoshi",
    sourceIcon: Linkedin,
    rating: 5,
  },
];

// Helper functions
export const featuredTestimonials = testimonialsData.filter(
  (testimonial) => testimonial.rating === 5
);

export const getTestimonialsByRating = (minRating = 4) => {
  return testimonialsData.filter(
    (testimonial) => testimonial.rating >= minRating
  );
};

export default testimonialsData;
