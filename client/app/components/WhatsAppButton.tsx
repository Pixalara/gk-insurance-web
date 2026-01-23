'use client';

export default function WhatsAppButton() {
    const handleClick = () => {
        const message = encodeURIComponent('Hi GK Insurance, I need help with insurance quotes');
        const phone = '919573322990';
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 transition-all duration-300 focus:outline-none"
            aria-label="Contact us on WhatsApp"
        >
            {/* Tooltip / Label - Expands on Hover */}
            <div className="bg-green-200/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-lg transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                <p className="text-sm font-bold text-slate-800">Chat with us 👋</p>
                <p className="text-xs text-slate-500">Online now</p>
            </div>

            {/* Main Button */}
            <div className="relative hover:scale-110 transition-transform duration-300">
                {/* Ping Animation */}
                <span className="absolute md:hidden inset-0 w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></span>

                {/* Icon Container */}
                <div className="relative z-10 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/30 backdrop-blur-sm">
                    <i className="fab fa-whatsapp text-3xl"></i>

                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        1
                    </span>
                </div>
            </div>
        </button>
    );
}