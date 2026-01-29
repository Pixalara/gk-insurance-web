'use client';

import { FaWhatsapp } from "react-icons/fa";

type WhatsAppButtonProps = {
  phone?: string;
  message?: string;
  position?: "bottom-right" | "bottom-left";
};

export default function WhatsAppButton({
  phone = "919052433444",
  // UPDATED MESSAGE BELOW
  message = "Hello GK Insurance Team, I’m looking to get a quotation for insurance coverage. Please let me know the required details to proceed.",
  position = "bottom-right",
}: WhatsAppButtonProps) {

  const buildWhatsAppUrl = (phone: string, message: string): string => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleClick = (): void => {
    const url = buildWhatsAppUrl(phone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const positionClass: string =
    position === "bottom-left"
      ? "bottom-6 left-6"
      : "bottom-6 right-6";

  return (
    <button
      onClick={handleClick}
      aria-label="Contact on WhatsApp"
      className={`group fixed ${positionClass} z-50 flex items-center gap-2
        transition-all duration-300 focus-visible:ring-4 
        focus-visible:ring-green-400 rounded-full`}
    >
      {/* Screen reader only */}
      <span className="sr-only">Open WhatsApp chat</span>

      {/* Tooltip */}
      <div
        className="hidden md:block bg-green-200/90 backdrop-blur-md 
                   border border-slate-200 px-4 py-2 rounded-full shadow-lg
                   translate-x-4 opacity-0 group-hover:translate-x-0 
                   group-hover:opacity-100 transition-all duration-300"
      >
        <p className="text-sm font-bold text-slate-800">Chat with us 👋</p>
        <p className="text-xs text-slate-500">Online now</p>
      </div>

      {/* Button */}
      <div className="relative hover:scale-110 transition-transform duration-300">
        <div
          className="w-14 h-14 bg-[#25D366] text-white rounded-full
                     flex items-center justify-center shadow-xl
                     border-4 border-white/30"
        >
          <FaWhatsapp className="text-3xl" />
        </div>
      </div>
    </button>
  );
}