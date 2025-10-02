// src/utils/fallbackData.js

// --- 🚨 Video Mapping Data 🚨 ---
// Maps topics from your original list to structured video objects.
const VIDEO_MAP = {
    // AI Module (Module 1)
    "Introduction to AI and its applications": { url: "https://www.youtube.com/embed/J_tN-pXhLAs?autoplay=0&mute=0", duration: 25 },
    "Machine Learning algorithms and implementation": { url: "https://www.youtube.com/embed/nixF0r0y26A?autoplay=0&mute=0", duration: 35 },
    "Deep Learning with TensorFlow and PyTorch": { url: "https://www.youtube.com/embed/6g40Q13jC8U?autoplay=0&mute=0", duration: 30 },
    // ML Module (Module 2) - Using AI/ML placeholders since specific videos aren't given
    "Supervised and Unsupervised Learning": { url: "https://www.youtube.com/embed/nixF0r0y26A?autoplay=0&mute=0", duration: 20 }, 
    "Feature Engineering and Selection": { url: "https://www.youtube.com/embed/J_tN-pXhLAs?autoplay=0&mute=0", duration: 30 },
    "Model Evaluation and Validation": { url: "https://www.youtube.com/embed/6g40Q13jC8U?autoplay=0&mute=0", duration: 30 },
    // IoT Module (Module 3)
    "IoT Architecture and Protocols": { url: "https://www.youtube.com/embed/g2D_f9d2Lz8?autoplay=0&mute=0", duration: 20 },
    "Sensor Networks and Data Collection": { url: "https://www.youtube.com/embed/Q4X-3zJg9vI?autoplay=0&mute=0", duration: 25 },
    "Arduino and Raspberry Pi Programming": { url: "https://www.youtube.com/embed/T6Ea-Kx7F9g?autoplay=0&mute=0", duration: 40 },
    // Cybersecurity Module (Module 4)
    "Network Security Fundamentals": { url: "https://www.youtube.com/embed/p9yP8B5s9Qc?autoplay=0&mute=0", duration: 45 },
    "Vulnerability Assessment and Penetration Testing": { url: "https://www.youtube.com/embed/bI3YqM0Wc1E?autoplay=0&mute=0", duration: 55 },
    // Quantum Module (Module 5)
    "Quantum Mechanics for Computing": { url: "https://www.youtube.com/embed/p-d0mD91uN8?autoplay=0&mute=0", duration: 30 },
    "Quantum Gates and Circuits": { url: "https://www.youtube.com/embed/example-quantum-gates?autoplay=0&mute=0", duration: 30 },
};

// Function to convert topic strings to video objects
const createVideos = (topics) => {
    return topics
        .filter(topic => VIDEO_MAP[topic])
        .map((topic, index) => ({
            id: `v${index + 1}-${topic.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}`,
            title: topic,
            url: VIDEO_MAP[topic].url,
            duration: VIDEO_MAP[topic].duration,
        }));
};

// --- 🚨 Original Course Structure (for conversion) 🚨 ---
export const originalCourses = [
    {
        id: 1, // Note: Use string "ai-ml-cert" in routing to match FALLBACK_COURSE_ID
        title: "Emerging Technologies",
        modules: [
            { id: "ai", title: "Artificial Intelligence", description: "Foundations of AI...", content: ["Introduction to AI and its applications", "Machine Learning algorithms and implementation", "Deep Learning with TensorFlow and PyTorch"] },
            { id: "ml", title: "Machine Learning", description: "Advanced ML techniques...", content: ["Supervised and Unsupervised Learning", "Feature Engineering and Selection", "Model Evaluation and Validation"] },
            { id: "iot", title: "Internet of Things (IoT)", description: "Connected devices, sensors...", content: ["IoT Architecture and Protocols", "Sensor Networks and Data Collection", "Arduino and Raspberry Pi Programming"] },
            { id: "cybersecurity", title: "Cybersecurity", description: "Information security...", content: ["Network Security Fundamentals", "Vulnerability Assessment and Penetration Testing"] },
            { id: "quantum", title: "Quantum Computing", description: "Quantum principles...", content: ["Quantum Mechanics for Computing", "Quantum Gates and Circuits"] },
        ],
    },
];

// --- 🚨 Final Structured Fallback Data 🚨 ---
export const EMERGING_TECH_COURSE_CONTENT = [
    {
        id: "ai",
        order: 1,
        title: "Module 1: Artificial Intelligence",
        description: "Foundations of AI, neural networks, and intelligent systems. (Serving OFFLINE demo content.)",
        duration: 90, 
        videos: createVideos(originalCourses[0].modules[0].content),
        objectives: ["Understand AI/ML basics.", "Set up a deep learning environment."],
        unlockCondition: 'none', // Always unlocked
    },
    {
        id: "ml",
        order: 2,
        title: "Module 2: Machine Learning",
        description: "Advanced ML techniques, algorithms, and practical implementations.",
        duration: 80,
        videos: createVideos(originalCourses[0].modules[1].content),
        objectives: ["Implement ensemble methods.", "Perform time series analysis."],
        unlockCondition: 'complete_previous', 
    },
    {
        id: "iot",
        order: 3,
        title: "Module 3: Internet of Things (IoT)",
        description: "Connected devices, sensors, and IoT ecosystem development.",
        duration: 100,
        videos: createVideos(originalCourses[0].modules[2].content),
        objectives: ["Design IoT architecture.", "Program sensor networks."],
        unlockCondition: 'complete_previous', 
    },
    {
        id: "cybersecurity",
        order: 4,
        title: "Module 4: Cybersecurity",
        description: "Information security, threat analysis, and defense strategies.",
        duration: 110,
        videos: createVideos(originalCourses[0].modules[3].content),
        objectives: ["Identify vulnerabilities.", "Execute penetration tests."],
        unlockCondition: 'complete_previous', 
    },
    {
        id: "quantum",
        order: 5,
        title: "Module 5: Quantum Computing",
        description: "Quantum principles, algorithms, and future applications.",
        duration: 60,
        videos: createVideos(originalCourses[0].modules[4].content),
        objectives: ["Grasp quantum mechanics basics.", "Write quantum circuits in Qiskit."],
        unlockCondition: 'complete_previous', 
    },
];

// Fallback enrollment status for the demo
export const FALLBACK_ENROLLMENT_STATUS = {
    isEnrolled: true,
    enrollment: { courseTitle: "Emerging Technologies (Offline)" },
    loading: false,
    error: null
};

// Backward-compat alias (some files may import FALLBACK_ENROLLMENT)
export const FALLBACK_ENROLLMENT = FALLBACK_ENROLLMENT_STATUS;

// Fallback course ID that triggers the hardcoded content
// Assuming 'ai-ml-cert' is the slug used in your /learn/ route
export const FALLBACK_COURSE_ID = originalCourses[0].id;


export const courses = originalCourses;
