import { Globe, Briefcase, Computer } from "lucide-react";
import { Brain, Cpu, Shield, Zap, Atom } from "lucide-react";

export const cardList = [
  { title: "Industry Ready", icon: Briefcase, subtitle: "Practical Projects" },
  { title: "Hybrid Mode", icon: Globe, subtitle: "Online & Offline" },
  { title: "Labs", icon: Computer, subtitle: "Campus Labs" },
];

export const DISCORD_SERVER_URL = "https://discord.gg/E9dckgdNKw";

export const website = "http://nxtgencertificationbyjntugv.com";

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
    image:
      "https://img.freepik.com/premium-photo/young-smiling-indian-female-student_776674-1120363.jpg",
    text: "The Emerging Technologies course by JNTU-GV is amazing! It helped me understand AI, IoT, and Cybersecurity in a simple and practical way. Highly recommended for beginners.",
  },
  {
    name: "Tarun Bommali",
    image:
      "https://res.cloudinary.com/drdgj0pch/image/upload/v1730514872/Screenshot_2024-11-02_080335_zokmgr.png",
    text: "Hands-on projects and peer discussions helped me gain real-world skills. The instructors are supportive and knowledgeable.",
  },
  {
    name: "MOHAMMED SHAIK",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQF9rSl1bARhZQ/profile-displayphoto-crop_800_800/B56Zh_GE2gHUAM-/0/1754478988567?e=1759968000&v=beta&t=DwUAq-rHtiL8DFYHM819NsbcUDa4SBVXDfLVW8uW--8",
    text: "Joining the course was the best decision. The community is vibrant, and the content is very well structured.",
  },
];

export const modules = [
  {
    id: "ai",

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
    title: "Machine Learning",
    description:
      "Advanced ML techniques, algorithms, and practical implementations",
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
    title: "Cybersecurity",
    description:
      "Information security, threat analysis, and defense strategies",
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

export const courses = [
  {
    id: 1,
    title: "Emerging Technologies",
    subtitle: "Comprehensive overview of AI, ML, IoT, Cybersecurity, Quantum",
    duration: "3 Months / 120 Hours",
    mode: "Hybrid Mode",
    icon: Brain,
    language: "English",
    rating: "4.8",
    validity: "Lifetime Access",
    features: [
      "Private Discord community for peer learning",
      "Lifetime access including all future updates",
      "High-quality notes & interview preparation",
      "Project-based teaching to gain hands-on experience",
    ],
    price: 9999,
    originalPrice: 14999,
    discountPercent: 33,
    thumbnail:
      "https://thumbs.dreamstime.com/b/image-carousel-line-icon-photo-thumbnail-sign-album-picture-placeholder-symbol-quality-design-element-linear-style-editable-stroke-219079383.jpg",
    specialDiscount: "₹1000 OFF",
    description:
      "This course provides in-depth knowledge of emerging technologies including AI, Machine Learning, IoT, Cybersecurity, and Quantum Computing. Gain practical experience and industry-relevant skills to accelerate your career.",
    mission:
      "Our mission is to equip you with cutting-edge skills in Emerging Technologies. The course offers deep insights into AI, ML, IoT, Cybersecurity, and Quantum Computing through hands-on projects, high-quality notes, and industry-relevant knowledge. The goal isn’t just to make you pass exams, but to make you confident in applying real-world solutions. With lifetime access, private community support, and continuous updates, you will stay ahead in your career. Are you ready to transform your career? 🚀",
    modules: [
      {
        id: "ai",

        title: "Artificial Intelligence",
        description:
          "Foundations of AI, neural networks, and intelligent systems",
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
        title: "Machine Learning",
        description:
          "Advanced ML techniques, algorithms, and practical implementations",
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
        title: "Internet of Things (IoT)",
        description:
          "Connected devices, sensors, and IoT ecosystem development",
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
        title: "Cybersecurity",
        description:
          "Information security, threat analysis, and defense strategies",
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
    ],
  },

  {
    id: 2,
    title: "Artificial Intelligence & Tools",
    subtitle: "AI concepts and popular AI tools",
    duration: "1 Month / 40 Hours",
    mode: "Online",
    icon: Cpu,
    language: "English",
    rating: "4.7",
    validity: "Lifetime Access",
    features: [
      "Comprehensive AI theory and applications",
      "Hands-on experience with popular AI tools",
      "Interview preparation material included",
      "Private discussion forum support",
    ],
    price: 4999,
    originalPrice: 7999,
    discountPercent: 37,
    specialDiscount: "₹500 OFF",
    description:
      "Learn the fundamentals of Artificial Intelligence, including machine learning algorithms, neural networks, and AI tools like TensorFlow and PyTorch. Apply real-world examples to build AI-powered applications.",
    mission:
      "Our mission is to make AI accessible for everyone by providing clear explanations, hands-on projects, and industry-relevant applications. Become confident in using AI tools to solve real-world problems and prepare for competitive roles in the tech industry.",
    modules: [],
  },

  {
    id: 3,
    title: "Machine Learning & Deep Learning",
    subtitle: "ML models, Deep Learning frameworks",
    duration: "1 Month / 40 Hours",
    mode: "Online",
    icon: Zap,
    language: "English",
    rating: "4.9",
    validity: "Lifetime Access",
    features: [
      "End-to-end ML pipeline development",
      "Deep learning using frameworks like Keras & PyTorch",
      "Real-world projects with datasets",
      "Expert mentor support for doubt resolution",
    ],
    price: 6999,
    originalPrice: 10999,
    discountPercent: 36,
    specialDiscount: "₹800 OFF",
    description:
      "Master machine learning concepts, build predictive models, and work with deep learning frameworks like Keras and PyTorch. Learn how to clean data, train models, and deploy ML applications.",
    mission:
      "Our mission is to provide hands-on learning that prepares you for a career in Machine Learning and Deep Learning. Focused on practice and real-world projects, this course ensures you get the skills employers look for in AI-related roles.",
    modules: [],
  },
  {
    id: 4,
    title: "Internet of Things (IoT)",
    subtitle: "IoT devices, protocols and applications",
    duration: "1 Month / 40 Hours",
    mode: "Online",
    icon: Atom,
    language: "English",
    rating: "4.6",
    validity: "Lifetime Access",
    features: [
      "Learn IoT architecture and protocols",
      "Hands-on projects with sensors and microcontrollers",
      "IoT applications in smart homes, agriculture, healthcare",
      "Peer learning in private community",
    ],
    price: 5999,
    originalPrice: 8999,
    discountPercent: 33,
    specialDiscount: "₹700 OFF",
    description:
      "Explore the architecture of IoT systems, working with devices like Arduino and Raspberry Pi. Learn how to connect devices, collect data, and apply IoT solutions in various industries.",
    mission:
      "Our mission is to teach practical IoT applications, enabling you to design and deploy IoT solutions. From sensors to cloud integration, this course focuses on real projects to build job-ready skills.",
    modules: [],
  },
  {
    id: 5,
    title: "Cyber Security",
    subtitle: "Network security, ethical hacking fundamentals",
    duration: "1 Month / 40 Hours",
    mode: "Hybrid Mode",
    icon: Shield,
    language: "English",
    rating: "4.8",
    validity: "Lifetime Access",
    features: [
      "Fundamentals of cybersecurity and ethical hacking",
      "Network penetration testing",
      "Real-time lab practice",
      "Guided preparation for cybersecurity certifications",
    ],
    price: 7999,
    originalPrice: 11999,
    discountPercent: 33,
    specialDiscount: "₹1000 OFF",
    description:
      "Learn the basics of cybersecurity, how to ethically hack networks, and prevent attacks. Gain practical experience through labs and hands-on exercises covering firewalls, vulnerabilities, and threat mitigation.",
    mission:
      "Our mission is to make you proficient in network security and ethical hacking techniques through practical labs and real-world projects. Prepare for industry certifications and careers in cybersecurity with confidence.",
    modules: [],
  },
  {
    id: 6,
    title: "Quantum Computing",
    subtitle: "Quantum principles and computing basics",
    duration: "1 Month / 40 Hours",
    mode: "Online",
    icon: Atom,
    language: "English",
    rating: "4.5",
    validity: "Lifetime Access",
    features: [
      "Quantum computing basics",
      "Working with quantum circuits",
      "Hands-on projects using IBM Quantum Experience",
      "Guided mentorship support",
    ],
    price: 8999,
    originalPrice: 12999,
    discountPercent: 31,
    specialDiscount: "₹1200 OFF",
    description:
      "Dive into quantum computing fundamentals, explore quantum algorithms, and practice using real quantum computers via IBM Quantum Experience platform. Learn qubits, gates, and superposition principles.",
    mission:
      "Our mission is to help you explore quantum computing from scratch through hands-on projects and expert guidance. Build an understanding of quantum mechanics and develop skills that set you apart in the future of computing.",
    modules: [],
  },
];
