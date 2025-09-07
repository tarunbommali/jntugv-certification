import { Mail, Phone, MapPin } from "lucide-react";
import { global_classnames } from "../utils/classnames";

const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: global_classnames.button.primary.bg }}
      className="text-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* University Info */}
        <div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: global_classnames.button.primary.text }}
          >
            JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY - GURAJADA VIZIANAGARAM
          </h3>
          <p style={{ color: global_classnames.button.primary.text }}>
            Committed to excellence in technical education and research.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: global_classnames.button.primary.text }}
          >
            Quick Links
          </h3>
          <ul className="space-y-1">
            {[
              { text: "Course Overview", href: "#overview" },
              { text: "Modules", href: "#modules" },
              { text: "Practical Experiments", href: "#practicals" },
              { text: "Capstone Projects", href: "#capstone" },
              { text: "Contact Us", href: "#contact" },
            ].map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  style={{ color: global_classnames.button.primary.text }}
                  className="hover:underline"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: global_classnames.button.primary.text }}
          >
            Contact Information
          </h3>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail
                className="h-4 w-4"
                style={{ color: global_classnames.button.primary.text }}
              />
              <span style={{ color: global_classnames.button.primary.text }}>
                certifications@jntugv.edu.in
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Phone
                className="h-4 w-4"
                style={{ color: global_classnames.button.primary.text }}
              />
              <span style={{ color: global_classnames.button.primary.text }}>
                +91-8922-248001
              </span>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin
                className="h-4 w-4 mt-1"
                style={{ color: global_classnames.button.primary.text }}
              />
              <span style={{ color: global_classnames.button.primary.text }}>
                Dwarapudi, Vizianagaram, AP - 535003
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        className="border-t py-4"
        style={{ borderColor: `${global_classnames.button.primary.text}33` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p style={{ color: global_classnames.button.primary.text }}>
            © {new Date().getFullYear()} JNTU-GV, Vizianagaram. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-3 md:mt-0">
            {[
              { text: "Privacy Policy", href: "#" },
              { text: "Terms of Service", href: "#" },
              
            ].map((link, index) => (
              <a
                key={index}
                href={link.href}
                style={{ color: global_classnames.button.primary.text }}
                className="hover:underline"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
