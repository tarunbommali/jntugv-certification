import { useState, useEffect } from "react";

const OfferModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coupon, setCoupon] = useState("");
  const [isCouponGenerated, setIsCouponGenerated] = useState(false);

  useEffect(() => {
    const storedCoupon = localStorage.getItem("offerCoupon");
    if (storedCoupon) {
      setCoupon(storedCoupon);
      setIsCouponGenerated(true);
    }
  }, []);

  const generateCoupon = () => {
    const randomCode = `EDU${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem("offerCoupon", randomCode);
    setCoupon(randomCode);
    setIsCouponGenerated(true);
  };

  const whatsappLink = `https://wa.me/7780351078?text=Hi,%20I%20want%20to%20avail%20the%20offer.%20My%20Email:%20${encodeURIComponent(
    email
  )}%20Phone:%20${encodeURIComponent(phone)}%20Coupon:%20${coupon}`;

  const offerTime = "00h42m10s";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-blue-500 opacity-55"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white text-[#192f60] rounded-lg shadow-lg max-w-md w-full p-6 z-10 transition-transform transform animate-scale-in">
        <h2 className="text-xl font-bold mb-4">Avail Offer</h2>

        <p className="mb-4">
          Career level Up Offer - Flat 10% + Buy 1 Get 1 Offer ending in{" "}
          {offerTime}
        </p>

        <div className="mb-3">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email Id"
            className="w-full p-2 border border-[#c5cad3] rounded outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="block mb-1 font-medium">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Phone Number"
            className="w-full p-2 border border-[#c5cad3] rounded outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {!isCouponGenerated ? (
          <button
            className={`w-full bg-blue-600 text-white p-2 rounded ${
              email && phone ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!email || !phone}
            onClick={generateCoupon}
          >
            Avail Offer Now
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p>
              <strong>Your Coupon:</strong> {coupon}
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-500 text-white p-2 rounded text-center"
            >
              Send via WhatsApp
            </a>
          </div>
        )}

        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default OfferModal;
