import React from "react";

const PlatformOverview = () => {
  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for the Digital Age
          </h2>
          <p className="text-lg text-muted">
            Our Learning Management System is powered by Node.js, leveraging non-blocking I/O and an event-driven architecture to deliver educational content seamlessly.
          </p>
        </div>

        <div className="space-y-12">
          {/* Core Concepts */}
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-4 border-b border-border pb-2">
              Core Platform Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                <h4 className="text-lg font-bold text-foreground mb-2">Course Management</h4>
                <p className="text-muted text-sm leading-relaxed">
                  Easily create, edit, and organize courses. Includes syllabus creation and rich content uploading.
                </p>
              </div>
              <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                <h4 className="text-lg font-bold text-foreground mb-2">User Management</h4>
                <p className="text-muted text-sm leading-relaxed">
                  Handles secure registration, logins, and strict role-based access control (RBAC) for students, instructors, and admins.
                </p>
              </div>
              <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                <h4 className="text-lg font-bold text-foreground mb-2">Content Delivery</h4>
                <p className="text-muted text-sm leading-relaxed">
                  Smooth delivery of videos, documents, and interactive modules to support high volumes of concurrent students.
                </p>
              </div>
              <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                <h4 className="text-lg font-bold text-foreground mb-2">Assessments & Progress</h4>
                <p className="text-muted text-sm leading-relaxed">
                  Built-in quizzes, grading, and progress tracking so students can monitor their completed modules and scores.
                </p>
              </div>
            </div>
          </div>

          {/* Usage Scenarios */}
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-4 border-b border-border pb-2">
              Who is this for?
            </h3>
            <ul className="space-y-4 text-muted">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                <p><strong>Educational Institutions:</strong> Manage in-person and online courses, conduct discussions, and grade assignments easily.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                <p><strong>Corporate Training:</strong> Streamline employee onboarding, teach company policies, and support continuous upskilling initiatives.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                <p><strong>Online Course Platforms:</strong> Handle high-traffic loads for niche courses and interactive communities seamlessly.</p>
              </li>
            </ul>
          </div>

          {/* Best Practices Built-In */}
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-4 border-b border-border pb-2">
              Enterprise-Grade Foundation
            </h3>
            <div className="bg-surface-elevated p-6 rounded-xl border border-border text-muted">
              <p className="mb-3">
                <strong>Security First:</strong> We utilize robust JSON Web Tokens (JWT) for authentication, encrypt sensitive data, and validate all inputs to prevent vulnerabilities.
              </p>
              <p className="mb-3">
                <strong>Performance Optimized:</strong> By utilizing asynchronous Node.js operations and separation of concerns, the platform is capable of handling multiple requests without blocking.
              </p>
              <p>
                <strong>Scalable Architecture:</strong> The application enforces strict separation of front-end and back-end logic through clean RESTful APIs, ensuring maintainability as the platform grows.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;
