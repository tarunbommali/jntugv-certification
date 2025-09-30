import { Mail, Phone, MapPin } from "lucide-react";
import { global_classnames } from "../utils/classnames";
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const textColor = global_classnames.button.primary.text;

  return (
    <footer className="bg-[#004080] text-white text-sm">
      <div className="border-t border-gray-600 py-4">
        <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center `}>
          <p style={{ color: textColor }}>
            © {new Date().getFullYear()} JNTU-GV, Vizianagaram. All rights
            reserved.
          </p>

          <div className="flex space-x-4 mt-3 md:mt-0">
            {[
              { text: "Privacy Policy", href: "#" },
              { text: "Terms of Service", href: "#" },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                style={{ color: textColor }}
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
