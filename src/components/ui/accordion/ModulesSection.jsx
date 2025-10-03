// src/components/ModulesSection.jsx (ENHANCED)

import React, { useMemo, useState } from "react";
import { ChevronDown, BookOpen, PlayCircle } from "lucide-react"; // Using Lucide icons for consistency

const ModulesSection = ({ modules }) => {
    const safeModules = Array.isArray(modules) ? modules : [];
    // Keep the first module open by default
    const [openAccordions, setOpenAccordions] = useState(
        safeModules.length > 0 ? [safeModules[0]?.id] : []
    );

    const toggleAccordion = (id) => {
        setOpenAccordions((prev) =>
            prev.includes(id) ? prev?.filter((item) => item !== id) : [...prev, id]
        );
    };

    const PRIMARY_COLOR = 'var(--color-primary)';
    const ACCENT_BG = 'var(--color-card)';

    const getItems = useMemo(() => (
        (mod) => {
            if (!mod) return [];
            if (Array.isArray(mod.content) && mod.content.length > 0) return mod.content;
            if (Array.isArray(mod.videos) && mod.videos.length > 0) return mod.videos.map(v => v?.title || 'Video');
            return [];
        }
    ), []);

    if (!safeModules || safeModules.length === 0) {
        return (
            <div className="text-center py-10 text-muted border rounded-lg card shadow-sm">
                <p>Course outline coming soon!</p>
            </div>
        );
    }

    return (
        <section
            id="modules"
            className="py-6"
        >
            <div className="max-w-7xl md:mx-auto px-4 lg:px-0">
                {/* Section Heading */}
                <div className="mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6" style={{ color: PRIMARY_COLOR }} />
                    <h2
                        className="text-2xl font-bold"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        Curriculum
                    </h2>
                </div>

                {/* Modules List */}
                <div className="grid grid-cols-1 rounded-xl overflow-hidden shadow-lg" style={{ border: '1px solid var(--color-border)' }}>
                    {safeModules.map((module, index) => {
                        const isOpen = openAccordions.includes(module.id);
                        const isLast = index === safeModules.length - 1;
                        const items = getItems(module);

                        return (
                            <div
                                key={module.id}
                                className={`transition-all duration-300 ${isLast ? '' : ''}`}
                                style={{ borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}
                            >
                                {/* Header */}
                                <button
                                    onClick={() => toggleAccordion(module.id)}
                                    className={`flex items-center justify-between w-full p-4 sm:p-5 transition-colors`}
                                    style={{ background: 'var(--color-card)' }}
                                > 
                                    <div className="flex items-center gap-2">
                                        <PlayCircle className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                                        <h3 className={`text-lg font-semibold`} style={{ color: 'var(--color-text)' }}>
                                            {module.title}
                                        </h3>
                                    </div>

                                    <ChevronDown
                                        className={`h-5 w-5 transition-transform duration-300 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                        style={{ color: isOpen ? PRIMARY_COLOR : 'var(--color-muted)' }}
                                    />
                                </button>

                                {/* Accordion Content */}
                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden`}
                                    style={{
                                        // Calculate max-height based on item length for smooth transition
                                        maxHeight: isOpen ? `${Math.max(1, items.length) * 3 + 10}rem` : "0",
                                        // Set inner background for contrast
                                        backgroundColor: ACCENT_BG,
                                    }}
                                >
                                    {items.map((title, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex items-start text-sm sm:text-base py-2.5 w-full`}
                                            style={{ borderBottom: idx === items.length - 1 && !isLast ? 'none' : '1px solid var(--color-border)' }}
                                        >
                                            {/* Course Content Item */}
                                            <span className="ml-4" style={{ color: 'var(--color-text)' }}>{title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ModulesSection;