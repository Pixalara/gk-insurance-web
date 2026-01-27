"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import QuoteForm from "./components/QuoteForm";
import StatCounter from "./components/StatCounter";

const insuranceProducts = [
  { id: 'two-wheeler', name: 'Two-Wheeler Insurance', image: '/bike.jpg', description: 'Comprehensive coverage for your bike with affordable premiums' },
  { id: 'car', name: 'Car Insurance', image: '/car.jpg', description: 'Complete protection for your car against all risks' },
  { id: 'commercial-vehicle', name: 'Commercial Vehicle', image: '/commercial.jpg', description: 'Tailored insurance for commercial vehicles' },
  { id: 'travel', name: 'Travel Insurance', image: '/travel.jpg', description: 'Travel worry-free with comprehensive coverage' },
  { id: 'shopkeeper', name: 'Shopkeeper Insurance', image: '/shop.jpg', description: 'Protect your business premises and inventory' },
  { id: 'business', name: 'Business Insurance', image: '/bussiness.png', description: 'Comprehensive coverage for your business operations' },
  { id: 'health', name: 'Health Insurance', image: '/Health.jpg', description: 'Quality healthcare coverage for you and your family' },
  { id: 'life', name: 'Life Insurance', image: '/life1.jpg', description: 'Secure your family\'s future with life coverage' },
];

const insurancePartners = {
  general: [
    { name: 'Bajaj General Insurance', logo: '/Bajaj.png' },
    { name: 'Tata AIG', logo: '/tata.png' },
    { name: 'ICICI Lombard', logo: '/icic.png' },
    { name: 'Go Digit', logo: '/Godigit.png' },
    { name: 'Liberty General Insurance', logo: '/Liberty.png' },
  ],
  health: [
    { name: 'Star Health', logo: '/starhealth.png' },
    { name: 'Bajaj Health', logo: '/Bajaj.png' },
  ],
  life: [
    { name: 'LIC', logo: '/lic.png' },
    { name: 'Bajaj Life', logo: '/bajajlife.png' },
  ],
};

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const handleGetQuote = (productName: string) => {
    setSelectedProduct(productName);
    setShowQuoteModal(true);
  };

  const scrollToQuote = () => {
    const element = document.getElementById("quote");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen bg-white text-slate-900">
      {/* Updated Navbar brand name */}
      <Navbar onGetQuoteClick={scrollToQuote} brandName="GK INSURANCE SOLUTIONS" />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-28 pb-4">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-50/50 to-transparent -z-10" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-50 border border-slate-100 mb-8 shadow-xs">
                <i className="fas fa-shield-check text-[#004aad] text-sm"></i>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Authorized Insurance Advisory</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[1.05] mb-8 text-slate-900 tracking-tighter">
                Protecting Your <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#004aad] to-blue-500">Greatest Assets.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 font-medium mb-12 leading-relaxed max-w-xl">
                Vizag's premier destination for bespoke insurance solutions. 20+ years of expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <button 
                  onClick={scrollToQuote}
                  className="w-full sm:w-auto px-12 py-6 bg-[#004aad] text-white font-bold text-lg rounded-2xl hover:bg-[#003580] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,74,173,0.25)] flex items-center justify-center gap-4 group"
                >
                  Request Private Consultation
                  <i className="fas fa-arrow-right-long group-hover:translate-x-2 transition-transform duration-300"></i>
                </button>
                <div className="flex items-center gap-4 py-4 px-2 border-l border-slate-200 ml-2">
                  <div className="text-left">
                    <p className="text-2xl font-black text-slate-900 leading-none">
                      <StatCounter to={1500} suffix="+" />
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Customers Secured</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-slate-50/50 backdrop-blur-xl border border-slate-200/50 p-4 rounded-[48px] shadow-2xl overflow-hidden">
                <div className="aspect-[4/5] relative rounded-[36px] overflow-hidden group">
                  {/* Updated image alt text */}
                  <img src="/Hero-Vizag-Premium.png" alt="GK Insurance Solutions Premium Services" className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-60" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Slider */}
      <section className="py-6 bg-white border-y border-slate-50 overflow-hidden">
        <div className="container-custom">
          <div className="relative flex overflow-hidden group">
            <div className="flex py-2 animate-scroll whitespace-nowrap gap-12 pause">
              {[...insurancePartners.general, ...insurancePartners.health, ...insurancePartners.life, 
                ...insurancePartners.general, ...insurancePartners.health, ...insurancePartners.life].map(
                (partner, idx) => (
                  <div key={idx} className="flex items-center justify-center w-40 h-12 opacity-100">
                    <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain scale-110" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Products */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Bespoke Insurance Solutions</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Comprehensive coverage plans designed to protect every aspect of your life and business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {insuranceProducts.map((product, idx) => (
              <motion.div key={product.id} whileHover={{ y: -8 }} className="group bg-white rounded-[32px] p-8 shadow-xs hover:shadow-2xl border border-slate-200 transition-all cursor-pointer flex flex-col h-full" onClick={() => handleGetQuote(product.name)}>
                <div className="h-40 flex items-center justify-center mb-6"><img src={product.image} alt={product.name} className="h-full object-contain" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{product.name}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{product.description}</p>
                <div className="mt-auto">
                  <button className="w-full py-3 bg-slate-50 text-[#004aad] font-bold rounded-xl group-hover:bg-[#004aad] group-hover:text-white transition-all">View Details</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - GK Advantage */}
      <section id="about" className="py-24 bg-white relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">The <span className="text-[#004aad]">GK Advantage</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fa-shield-halved', target: 20, suffix: '+', subtitle: 'Advisory Experience' },
              { icon: 'fa-heart', target: 1500, suffix: '+', subtitle: 'Customers Secured' },
              { icon: 'fa-building-columns', target: 10, suffix: '+', subtitle: 'Direct Partnerships' },
              { icon: 'fa-gem', target: null, title: 'Elite Rates', subtitle: 'Best-in-Class Pricing' },
            ].map((item, idx) => (
              <motion.div key={idx} whileHover={{ y: -10 }} className="group p-10 bg-slate-50/50 rounded-[40px] border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xs group-hover:bg-[#004aad] transition-colors"><i className={`fas ${item.icon} text-2xl text-[#004aad] group-hover:text-white`}></i></div>
                <h3 className="text-4xl font-black text-slate-900 mb-2 flex items-baseline gap-1">
                  {item.target ? <StatCounter to={item.target} suffix={item.suffix} /> : item.title}
                </h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{item.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote" className="py-24 bg-[#004aad]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-[48px] p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <QuoteForm productType={selectedProduct || undefined} />
          </div>
        </div>
      </section>

      {/* Updated Footer brand name */}
      <Footer brandName="GK INSURANCE SOLUTIONS" />

      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] max-w-xl w-full max-h-[85vh] overflow-y-auto p-12 relative shadow-2xl">
            <button onClick={() => setShowQuoteModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><i className="fas fa-times text-2xl"></i></button>
            <QuoteForm productType={selectedProduct || undefined} onClose={() => setShowQuoteModal(false)} />
          </div>
        </div>
      )}
    </main>
  );
}