import { Brain, Code, Shield, Database, Zap } from "lucide-react";
import InfiniteMovingCards from "./ui/InfiniteMovingCards";

const courses = [
  {
    id: 1,
    title: "Certification in Emerging Technologies",
    subtitle: "AI, ML, IoT, Cybersecurity, Quantum",
    duration: "3 Months",
    mode: "Hybrid Mode",
    icon: Brain,
  },
  {
    id: 2,
    title: "Advanced Web Development",
    subtitle: "React, Node.js, Full Stack",
    duration: "4 Months",
    mode: "Online",
    icon: Code,
  },
  {
    id: 3,
    title: "Cybersecurity Fundamentals",
    subtitle: "Network Security, Ethical Hacking",
    duration: "2 Months",
    mode: "Hybrid",
    icon: Shield,
  },
  {
    id: 4,
    title: "Data Science & Analytics",
    subtitle: "Python, Machine Learning, Statistics",
    duration: "5 Months",
    mode: "Online",
    icon: Database,
  },
  {
    id: 5,
    title: "Digital Marketing",
    subtitle: "SEO, Social Media, Analytics",
    duration: "2 Months",
    mode: "Online",
    icon: Zap,
  },
];

export default function CourseCarousel() {
  return (
    <InfiniteMovingCards
      items={courses}
      direction="left"
      speed="normal"
      pauseOnHover={true}
    />
  );
}
