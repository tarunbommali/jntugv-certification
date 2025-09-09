import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { global_classnames } from "../utils/classnames";
 
const ContactSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "certifications@jntugv.edu.in",
      action: "mailto:certifications@jntugv.edu.in",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91-7780351078",
      action: "tel:+918922248001",
    },
    {
      icon: Globe,
      title: "Website",
      details: "www.jntugv.edu.in",
      action: "https://www.jntugv.edu.in",
    },
  ];

  const locationInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: "JNTU-GV, Dwarapudi, Vizianagaram, Andhra Pradesh - 535003",
      action: "https://maps.google.com/?q=JNTU-GV,Vizianagaram",
    },
  ];

  return (
    <section
      id="contact"
      className="py-12 lg:py-20"
      style={{
        backgroundColor: global_classnames.background.secondary,
        
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: global_classnames.heading.primary }}
          >
            Contact Us
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: global_classnames.text.secondary }}
          >
            Get in touch with our admissions team for more information about the
            certification program, eligibility requirements, or registration
            process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3
              className="text-2xl font-semibold mb-6"
              style={{ color: global_classnames.heading.primary }}
            >
              Get in Touch
            </h3>

            <div className="grid gap-4">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="rounded-lg border shadow-sm p-6 transition-shadow hover:shadow-lg"
                    style={{ borderColor: global_classnames.container.border }}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className="p-3 rounded-full"
                        style={{
                          backgroundColor: global_classnames.button.primary.bg,
                        }}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4
                          className="text-lg font-semibold mb-1"
                          style={{ color: global_classnames.text.primary }}
                        >
                          {item.title}
                        </h4>
                        <p style={{ color: global_classnames.text.secondary }}>
                          {item.details}
                        </p>
                        <a
                          href={item.action}
                          className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                          target={
                            item.title === "Website" ? "_blank" : undefined
                          }
                          rel={
                            item.title === "Website"
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {item.title === "Email"
                            ? "Send Email"
                            : item.title === "Phone"
                            ? "Call Now"
                            : item.title === "Website"
                            ? "Visit Website"
                            : "View on Map"}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map and Location Info */}
          <div className="space-y-6">
            <h3
              className="text-2xl font-semibold mb-6"
              style={{ color: global_classnames.heading.primary }}
            >
              Campus Location
            </h3>

            <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3793.687399949673!2d83.37684691488562!3d18.038890987687836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3be4f57b255555%3A0x46b127529193b01d!2sJNTU-GV%20COLLEGE%20OF%20ENGINEERING%20VIZIANAGARAM!5e0!3m2!1sen!2sin!4v1662541012345!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JNTU-GV Campus Location"
              />
            </div>

            {locationInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-lg border shadow-sm p-6 transition-shadow hover:shadow-lg"
                  style={{ borderColor: global_classnames.container.border }}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className="p-3 rounded-full"
                      style={{
                        backgroundColor: global_classnames.button.primary.bg,
                      }}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-lg font-semibold mb-1"
                        style={{ color: global_classnames.text.primary }}
                      >
                        {item.title}
                      </h4>
                      <p style={{ color: global_classnames.text.secondary }}>
                        {item.details}
                      </p>
                      <a
                        href={item.action}
                        className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Map
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
