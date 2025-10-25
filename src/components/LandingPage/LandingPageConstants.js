// LandingPageConstants.js

// Features data
export const features = [
  {
    icon: 'GraduationCap',
    title: "Industry-Recognized Certificates",
    description: "Get certified by JNTU-GV with credentials recognized by top companies worldwide.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: 'Users',
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of real-world experience and proven expertise.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: 'Award',
    title: "Hands-On Projects",
    description: "Build real projects and portfolios that showcase your skills to employers and clients.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: 'Globe',
    title: "Global Community",
    description: "Join thousands of learners from around the world in our supportive and collaborative community.",
    gradient: "from-orange-500 to-red-500",
  },
];

// Stats data
export const stats = [
  { number: "100+", label: "Students Enrolled" },
  { number: "95%", label: "Completion Rate" },
  { number: "50+", label: "Industry Partners" },
  { number: "24/7", label: "Support Available" },
];

// Contact information
export const contactInfo = [
  {
    icon: 'Phone',
    title: "Phone",
    details: "+91 7780351078",
    description: "Mon-Fri 9AM-6PM IST",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: 'Mail',
    title: "Email",
    details: "support@jntugv.edu.in",
    description: "We respond within 24 hours",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: 'MapPin',
    title: "Address",
    details: "JNTU-GV, Vizianagaram",
    description: "Andhra Pradesh, India",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: 'Clock',
    title: "Office Hours",
    details: "9:00 AM - 6:00 PM",
    description: "Monday to Friday",
    gradient: "from-orange-500 to-red-500",
  },
];

// FAQ items
export const faqItems = [
  {
    question: "How long does it take to complete a course?",
    answer: "Most courses are self-paced and can be completed in 3-6 months depending on your schedule and commitment level.",
  },
  {
    question: "Are the certificates recognized by employers?",
    answer: "Yes, our certificates are industry-recognized and accepted by top companies worldwide including Google, Microsoft, and Amazon.",
  },
  {
    question: "Do you provide job placement assistance?",
    answer: "We offer comprehensive career guidance, resume building workshops, and direct connections with our industry partners for placement opportunities.",
  },
  {
    question: "What if I need help during the course?",
    answer: "Our support team is available 24/7, and you can also get help from instructors and the community forum for quick assistance.",
  },
];

// Courses data
export const courses = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description: "Master artificial intelligence and machine learning concepts with hands-on projects.",
    duration: "6 months",
    students: "2.5k",
    rating: 4.9,
    level: "Advanced",
    category: "AI/ML",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
    gradient: "from-purple-500 to-pink-500",
    price: "₹24,999",
    originalPrice: "₹34,999",
    featured: true,
  },
  {
    id: 8,
    title: "Quantum Computing",
    description: "Explore quantum algorithms, quantum gates, and programming quantum computers.",
    duration: "7 months",
    students: "600",
    rating: 4.9,
    level: "Expert",
    category: "Quantum",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
    gradient: "from-violet-500 to-purple-500",
    price: "₹34,999",
    originalPrice: "₹44,999",
    featured: true,
  },
];

// Hero stats
export const heroStats = [
  {
    text: "Projected 2.5 Million+ new jobs globally in AI & Emerging Tech by 2027",
    value: 2500000,
    icon: 'TrendingUp',
    color: "from-red-500 to-orange-500",
  },
  {
    text: "80% of enterprises expected to adopt AI-driven solutions by 2026",
    value: 80,
    icon: 'Zap',
    color: "from-blue-500 to-cyan-500",
  },
];

// Community features
export const communityFeatures = [
  {
    icon: 'Users',
    title: "100+ Active Learners",
    description: "Join a vibrant community of students and professionals",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: 'MessageCircle',
    title: "24/7 Support",
    description: "Get help from peers and instructors anytime from private discord channels",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: 'Calendar',
    title: "Live Sessions",
    description: "Attend interactive workshops and Q&A sessions",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: 'Award',
    title: "Peer Recognition",
    description: "Showcase your projects and get feedback",
    gradient: "from-orange-500 to-red-500",
  },
];

// Skills data
export const skillsData = [
  { 
    category: "Artificial Intelligence", 
    skills: ["Intelligent Systems", "Search Techniques", "NLP", "Chatbots"],
    icon: 'Brain',
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    category: "AI Tools", 
    skills: ["OpenAI", "IBM Watson", "Google AI", "Microsoft Azure AI"],
    icon: 'Cpu',
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    category: "Machine Learning & Deep Learning", 
    skills: ["Classification", "Clustering", "Neural Networks", "CNN", "RNN", "LSTM"],
    icon: 'Brain',
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    category: "ML Tools", 
    skills: ["TensorFlow", "Keras", "PyTorch", "Scikit-learn"],
    icon: 'Code',
    gradient: "from-orange-500 to-red-500"
  },
  { 
    category: "Internet of Things (IoT)", 
    skills: ["IoT Architecture", "Protocols", "Sensors", "Actuators", "Arduino", "Raspberry Pi", "MQTT"],
    icon: 'Network',
    gradient: "from-indigo-500 to-purple-500"
  },
  { 
    category: "Quantum Computing", 
    skills: ["Qubits", "Superposition", "Quantum Gates", "Grover's Algorithm", "Shor's Algorithm", "Qiskit", "IBM Q"],
    icon: 'Cloud',
    gradient: "from-violet-500 to-purple-500"
  },
  { 
    category: "Cybersecurity", 
    skills: ["Cryptography", "Hashing", "Encryption", "Firewalls", "VPNs", "Wireshark", "Metasploit", "Burp Suite"],
    icon: 'Shield',
    gradient: "from-red-500 to-pink-500"
  },
];
 

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const floatVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200
    }
  }
};