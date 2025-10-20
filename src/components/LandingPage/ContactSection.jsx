import React from "react";
import { Mail, Phone, MapPin, Globe, ArrowRight } from "lucide-react";
// Assuming global_classnames provides primary colors for branding consistency
import { global_classnames } from "../../utils/classnames"; 

const ContactSection = () => {
  // Define the primary color for icons/buttons using a fallback
  const PRIMARY_COLOR = global_classnames.button?.primary?.bg || 'bg-blue-600';
  const HEADING_COLOR = global_classnames.heading?.primary || 'text-gray-900';
  const TEXT_SECONDARY_COLOR = global_classnames.text?.secondary || 'text-gray-600';

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "certifications@jntugv.edu.in",
      action: "mailto:certifications@jntugv.edu.in",
    },
    {
      icon: Phone,
      title: "Admissions Helpline",
      details: "+91-7780351078",
      action: "tel:+917780351078", // Corrected action URL to match details
    },
    {
      icon: Globe,
      title: "University Website",
      details: "www.jntugv.edu.in",
      action: "https://www.jntugv.edu.in",
    },
  ];

  const locationDetails = {
    icon: MapPin,
    title: "Campus Address",
    details: "JNTU-GV, Dwarapudi, Vizianagaram, Andhra Pradesh - 535003",
    // NOTE: This should be a genuine Google Maps embed code src
    mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1024.1614214227788!2d83.39864700000001!3d18.118991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4ee048d08c84d7%3A0x67392658c70d4722!2sJawaharlal%20Nehru%20Technological%20University%20Gura%20jada%20Vizianagaram!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    mapLink: "https://maps.app.goo.gl/YourActualMapLinkHere", // Placeholder for actual link
  };
  

  const ContactCard = ({ item }) => {
    const IconComponent = item.icon;
    const isExternal = item.title === "University Website";
    
    // Determine button text based on title
    let buttonText = "Go";
    if (item.title.includes("Email")) buttonText = "Send Email";
    else if (item.title.includes("Phone")) buttonText = "Call Now";
    else if (item.title.includes("Website")) buttonText = "Visit Website";

    return (
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-md p-6 transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]"
      >
        <div className="flex items-center space-x-4">
          {/* Icon Circle */}
          <div className={`p-4 rounded-full text-black ${PRIMARY_COLOR} flex-shrink-0`}>
            <IconComponent className="h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <h4 className={`text-xl font-bold mb-1 ${HEADING_COLOR}`}>
              {item.title}
            </h4>
            <p className={`text-base ${TEXT_SECONDARY_COLOR} mb-2 break-words`}>
              {item.details}
            </p>
            
            {/* Action Link Button */}
            <a
              href={item.action || item.mapLink}
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              {buttonText} 
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="contact"
      className="py-16 lg:py-28 bg-gray-50"
      // Using solid color for better contrast and professionalism
    >
      <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl sm:text-5xl font-extrabold mb-4 ${HEADING_COLOR}`}
          >
            Connect with Our Admissions Team
          </h2>
          <p
            className={`text-xl max-w-4xl mx-auto ${TEXT_SECONDARY_COLOR}`}
          >
            Get in touch for details on the certification program, eligibility, or the registration process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* 1. Contact Information Cards */}
          <div className="space-y-6">
            <h3 className={`text-3xl font-bold mb-8 ${HEADING_COLOR} border-b-2 border-yellow-500 pb-2`}>
              Quick Contacts
            </h3>

            <div className="grid gap-6">
              {contactInfo.map((item, index) => (
                <ContactCard key={index} item={item} />
              ))}
            </div>
          </div>

          {/* 2. Map and Location Info */}
          <div className="space-y-6">
            <h3 className={`text-3xl font-bold mb-8 ${HEADING_COLOR} border-b-2 border-yellow-500 pb-2`}>
              Our University Campus
            </h3>

            {/* Google Map Embed Container */}
            <div className="relative w-full h-[300px] aspect-video rounded-xl overflow-hidden ">
              <iframe
                src={locationDetails.mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JNTU-GV Campus Location"
                className="absolute inset-0"
              />
            </div>

            {/* Location Details Card */}
            <div
              className="bg-white rounded-xl border border-gray-200 shadow-md p-6 transition-shadow hover:shadow-xl hover:scale-[1.01]"
            >
              <div className="flex items-start space-x-4">
                {/* Icon Circle */}
                <div className={`p-4 rounded-full text-black ${PRIMARY_COLOR} flex-shrink-0`}>
                  <MapPin className="h-6 w-6" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`text-xl font-bold mb-1 ${HEADING_COLOR}`}>
                    {locationDetails.title}
                  </h4>
                  <p className={`text-base ${TEXT_SECONDARY_COLOR} mb-2`}>
                    {locationDetails.details}
                  </p>
                  <a
                    href={locationDetails.mapLink}
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;