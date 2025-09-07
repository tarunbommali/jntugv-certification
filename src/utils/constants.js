import { Clock, Globe, Briefcase } from "lucide-react";
import { Brain, Cpu, Shield, Wifi, Zap, } from "lucide-react";

export const cardList = [
  { title: "3 Months", icon: Clock, subtitle: "Intensive Program" },
  { title: "Hybrid Mode", icon: Globe, subtitle: "Online & Offline" },
  { title: "Industry Ready", icon: Briefcase, subtitle: "Practical Projects" },
];

export const website = "http://nxtgencertificationbyjntugv.com"

export const capstoneProjects = [
  {
    title: "Smart Health Prediction System",
    imageUrl:
      "http://greaterkashmir.imagibyte.sortdcdn.net/wp-content/uploads/2023/08/smartphone_gd68cdcc68_1920.png",
    description: "ML model + IoT vitals data",
  },
  {
    title: "AI Chatbot with Sentiment Analysis",
    imageUrl:
      "http://chatgen.ai/wp-content/uploads/2023/04/AI-chat-5-1200x675.png",
    description: "NLP + Deep Learning integration",
  },
  {
    title: "Autonomous Irrigation System",
    imageUrl:
      "http://hashstudioz.com/images/dashboard/irrigation-management-dashboard-1.webp",
    description: "Predict crop water needs (IoT + ML)",
  },
  {
    title: "Cyber Threat Detection",
    imageUrl:
      "http://slideteam.net/wp/wp-content/uploads/2022/12/Dashboard-for-Threat-Tracking-in-Cyber-Security.png",
    description: "Network log classification using ML",
  },
  {
    title: "Quantum-Enhanced Classifier",
    imageUrl:
      "https://physics.aps.org/assets/63cae50d-acbd-427d-93c7-a2876b30390c/e79_2.png",
    description: "Compare classical vs quantum ML",
  },
  {
    title: "Emotion Detection from Images",
    imageUrl:
      "https://visagetechnologies.com/app/uploads/2023/05/Emotion-AI-picture-2-copy.webp",
    description: "CNN-based Deep Learning model",
  },
  {
    title: "Stock Price Prediction",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW13FKI087t-Qv5JaeEatuiiAEHyqt_34o020U3FA7NYyfGQuqmgS68LtxDhvjoCjLM9k&usqp=CAU",
    description: "LSTM with time-series data",
  },
  {
    title: "Fake News Detection",
    imageUrl:
      "https://cdn.labmanager.com/assets/articleNo/477/iImg/858/039150cb-8848-45d5-898f-c9b50e1120bd-nov18-2019-pennstate-istock-fakenews-640x360.png",
    description: "NLP + Classification pipeline",
  },
  {
    title: "E-commerce Recommender System",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLLQx6PRUml8r0I6ZsEiIDFBtYlKDKNUdEbg&s",
    description: "Collaborative filtering using ML",
  },
  {
    title: "Disease Diagnosis Assistant",
    imageUrl:
      "https://www.sermo.com/wp-content/uploads/2025/03/seo-blog-header-ai-superhuman-calculator.png",
    description: "ML + Raspberry Pi health sensors",
  },
];

export const testimonials = [
  {
    name: "Priya Reddy",
    image: "https://img.freepik.com/premium-photo/young-smiling-indian-female-student_776674-1120363.jpg",
    text: "The Emerging Technologies course by JNTU-GV is amazing! It helped me understand AI, IoT, and Cybersecurity in a simple and practical way. Highly recommended for beginners.",
  },
  {
    name: "Tarun Kumar",
    image: "https://res.cloudinary.com/drdgj0pch/image/upload/v1730514872/Screenshot_2024-11-02_080335_zokmgr.png",
    text: "Hands-on projects and peer discussions helped me gain real-world skills. The instructors are supportive and knowledgeable.",
  },
  {
    name: "MOHAMMED SHAIK",
    image: "https://media.licdn.com/dms/image/v2/D5603AQF9rSl1bARhZQ/profile-displayphoto-crop_800_800/B56Zh_GE2gHUAM-/0/1754478988567?e=1759968000&v=beta&t=DwUAq-rHtiL8DFYHM819NsbcUDa4SBVXDfLVW8uW--8",
    text: "Joining the course was the best decision. The community is vibrant, and the content is very well structured.",
  },
];

export const modules = [
    {
      id: "ai",
      icon: Brain,
      title: "Artificial Intelligence",
      description: "Foundations of AI, neural networks, and intelligent systems",
      content: [
        "Introduction to AI and its applications",
        "Machine Learning algorithms and implementation",
        "Deep Learning with TensorFlow and PyTorch",
        "Natural Language Processing (NLP)",
        "Computer Vision and Image Processing",
        "AI Ethics and Responsible AI Development",
        "Project: Building an AI-powered chatbot",
      ],
    },
    {
      id: "ml",
      icon: Cpu,
      title: "Machine Learning",
      description: "Advanced ML techniques, algorithms, and practical implementations",
      content: [
        "Supervised and Unsupervised Learning",
        "Feature Engineering and Selection",
        "Model Evaluation and Validation",
        "Ensemble Methods and Boosting",
        "Time Series Analysis and Forecasting",
        "MLOps and Model Deployment",
        "Project: Predictive Analytics Dashboard",
      ],
    },
    {
      id: "iot",
      icon: Wifi,
      title: "Internet of Things (IoT)",
      description: "Connected devices, sensors, and IoT ecosystem development",
      content: [
        "IoT Architecture and Protocols",
        "Sensor Networks and Data Collection",
        "Arduino and Raspberry Pi Programming",
        "Cloud Integration and Data Storage",
        "IoT Security and Privacy",
        "Industrial IoT (IIoT) Applications",
        "Project: Smart Home Automation System",
      ],
    },
    {
      id: "cybersecurity",
      icon: Shield,
      title: "Cybersecurity",
      description: "Information security, threat analysis, and defense strategies",
      content: [
        "Network Security Fundamentals",
        "Cryptography and Digital Signatures",
        "Vulnerability Assessment and Penetration Testing",
        "Incident Response and Forensics",
        "Cloud Security and DevSecOps",
        "Compliance and Risk Management",
        "Project: Security Audit and Implementation",
      ],
    },
    {
      id: "quantum",
      icon: Zap,
      title: "Quantum Computing",
      description: "Quantum principles, algorithms, and future applications",
      content: [
        "Quantum Mechanics for Computing",
        "Quantum Gates and Circuits",
        "Quantum Algorithms (Shor's, Grover's)",
        "Quantum Programming with Qiskit",
        "Quantum Cryptography and Security",
        "Current Limitations and Future Prospects",
        "Project: Quantum Algorithm Implementation",
      ],
    },
  ];