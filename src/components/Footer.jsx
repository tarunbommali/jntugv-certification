import { Mail, Phone, MapPin } from "lucide-react";
import { global_classnames } from "../utils/classnames";
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const textColor = global_classnames.button.primary.text;

  return (
    <footer className="bg-[#004080] text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: textColor }}>
          JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY - GURAJADA VIZIANAGARAM
        </h3>
        <p className="mb-6" style={{ color: textColor }}>
          Committed to excellence in technical education and research.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              Quick Links
            </h4>
            <ul className="space-y-1">
              {[
                { text: "Course Overview", href: "#overview" },
                { text: "Modules", href: "#modules" },
                { text: "Practical Experiments", href: "#practicals" },
                { text: "Capstone Projects", href: "#capstone" },
                { text: "Contact Us", href: "#contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} style={{ color: textColor }} className="hover:underline">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Administration Wing */}
          <div>
            <h4 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              Administration Wing
            </h4>
            <div className="flex flex-col space-y-1">
              {["Chancellor", "Vice Chancellor", "Registrar", "Program Offered", "Affiliated Colleges"].map((item, idx) => (
                <a key={idx} href="#" className="hover:underline" style={{ color: textColor }}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" style={{ color: textColor }} />
                <span style={{ color: textColor }}>certifications@jntugv.edu.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" style={{ color: textColor }} />
                <span style={{ color: textColor }}>+91-7780351078</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-1" style={{ color: textColor }} />
                <span style={{ color: textColor }}>
                  Dwarapudi, Vizianagaram, AP - 535003
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              Social Links
            </h4>
            <div className="flex space-x-4 text-xl">
              {[FaLinkedin, FaFacebook, FaTwitter, FaInstagram].map((Icon, idx) => (
                <a key={idx} href="https://www.jntugv.edu.in" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p style={{ color: textColor }}>
            © {new Date().getFullYear()} JNTU-GV, Vizianagaram. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-3 md:mt-0">
            {[
              { text: "Privacy Policy", href: "#" },
              { text: "Terms of Service", href: "#" },
            ].map((link, idx) => (
              <a key={idx} href={link.href} style={{ color: textColor }} className="hover:underline">
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
