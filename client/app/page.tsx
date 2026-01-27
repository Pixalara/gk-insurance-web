"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import QuoteForm from "./components/QuoteForm";
import StatCounter from "./components/StatCounter";

const insuranceProducts = [
  {
    id: 'two-wheeler',
    name: 'Two-Wheeler Insurance',
    image: '/bike.jpg',
    description: 'Comprehensive coverage for your bike with affordable premiums',
    features: ['Third-party coverage', 'Own damage', 'Personal accident'],
  },
  {
    id: 'car',
    name: 'Car Insurance',
    image: '/car.jpg',
    description: 'Complete protection for your car against all risks',
    features: ['Comprehensive coverage', 'Zero depreciation', '24/7 roadside assistance'],
  },
  {
    id: 'commercial-vehicle',
    name: 'Commercial Vehicle',
    image: '/commercial.jpg',
    description: 'Tailored insurance for commercial vehicles',
    features: ['Goods in transit', 'Driver coverage', 'Liability protection'],
  },
  {
    id: 'travel',
    name: 'Travel Insurance',
    image: '/travel.jpg',
    description: 'Travel worry-free with comprehensive coverage',
    features: ['Medical emergencies', 'Trip cancellation', 'Lost baggage'],
  },
  {
    id: 'shopkeeper',
    name: 'Shopkeeper Insurance',
    image: '/shop.jpg',
    description: 'Protect your business premises and inventory',
    features: ['Fire coverage', 'Theft protection', 'Public liability'],
  },
  {
    id: 'business',
    name: 'Business Insurance',
    image: '/bussiness.png',
    description: 'Comprehensive coverage for your business operations',
    features: ['Property damage', 'Business interruption', 'Liability coverage'],
  },
  {
    id: 'health',
    name: 'Health Insurance',
    image: '/Health.jpg',
    description: 'Quality healthcare coverage for you and your family',
    features: ['Cashless hospitalization', 'Pre & post hospitalization', 'Day care procedures'],
  },
  {
    id: 'life',
    name: 'Life Insurance',
    image: '/life1.jpg',
    description: 'Secure your family\'s future with life coverage',
    features: ['Life coverage', 'Maturity benefits', 'Tax benefits'],
  },
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

const handleClickWhatsApp = () => {
  const message = encodeURIComponent('Hi GK Insurance, I need help with insurance quotes');
  const phone = '919573322990';
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
};

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const handleGetQuote = (productName: string) => {
    setSelectedProduct(productName);
    setShowQuoteModal(true);
  };

  return (
    <main className="relative min-h-screen bg-white text-slate-900">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-50 to-slate-50 py-20 md:py-32">
        <div className="absolute right-[-10%] top-[10%] text-[25vw] font-black text-slate-100 -z-10 select-none hidden lg:block">
          GK
        </div>

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Compare & Get the <span className="text-[#004aad]">Best Insurance Quote</span> in Vizag
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium mb-8">
              20+ Years Experience | Serving 1500+ Customers Every Year
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#quote"
                className="px-8 py-4 bg-[#004aad] text-white font-bold text-lg rounded-md hover:bg-[#003580] transition-all duration-300 hover:shadow-xl inline-flex items-center gap-2"
              >
                Get Quote <i className="fas fa-arrow-right"></i>
              </a>
              <button
                onClick={() => { handleClickWhatsApp() }}
                className="px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-md hover:bg-green-600 transition-all duration-300 hover:shadow-xl inline-flex items-center gap-2"
              >
                <i className="fab fa-whatsapp"></i> WhatsApp Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Infinite Partner Slider */}
      <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
              Our Strategic Claims & Insurance Partners
            </h3>
          </div>
          
          <div className="relative flex overflow-hidden group">
            <div className="flex py-4 animate-scroll whitespace-nowrap gap-16 pause">
              {[...insurancePartners.general, ...insurancePartners.health, ...insurancePartners.life, 
                ...insurancePartners.general, ...insurancePartners.health, ...insurancePartners.life].map(
                (partner, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center w-40 h-20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Products */}
      <section id="products" className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Our Insurance Products
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive insurance solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#004aad] cursor-pointer"
                onClick={() => handleGetQuote(product.name)}
              >
                <div className="w-full h-40 bg-white rounded-lg flex items-center justify-center mb-4 p-4 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{product.description}</p>
                <ul className="space-y-2 mb-4">
                  {product.features.map((feature, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                      <i className="fas fa-check text-green-500"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 bg-slate-100 text-[#004aad] font-semibold rounded-lg group-hover:bg-[#004aad] group-hover:text-white transition-all duration-300">
                  Get Quote
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Bento Grid & Animated Counters */}
      <section id="about" className="py-24 bg-linear-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[#004aad] font-bold tracking-widest uppercase text-sm mb-3 block"
            >
              The GK Advantage
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-linear-to-r from-[#004aad] to-blue-600">GK Insurance?</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Trusted by thousands in Visakhapatnam. We don't just sell policies; we engineer peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fa-award', target: 20, suffix: '+', label: 'Years', subtitle: 'Industry Experience' },
              { icon: 'fa-users', target: 1500, suffix: '+', label: 'Clients', subtitle: 'Happy Customers Yearly' },
              { icon: 'fa-handshake', target: 10, suffix: '+', label: 'Partners', subtitle: 'Insurance Carriers' },
              { icon: 'fa-star', target: null, title: 'Best Rates', subtitle: 'Guaranteed in Vizag' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group cursor-default"
              >
                <div className="h-full bg-white/70 backdrop-blur-md border border-slate-100 p-8 rounded-3xl shadow-sm group-hover:shadow-2xl group-hover:border-[#004aad]/20 transition-all duration-500">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#004aad] transition-all duration-500">
                    <i className={`fas ${item.icon} text-2xl text-[#004aad] group-hover:text-white`}></i>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black text-slate-900 flex items-baseline gap-1">
                      {item.target ? (
                        <>
                          <StatCounter to={item.target} />
                          <span className="text-[#004aad] text-2xl">{item.suffix}</span>
                          {item.label && <span className="text-lg font-bold text-slate-400 ml-1">{item.label}</span>}
                        </>
                      ) : (
                        <span className="text-3xl">{item.title}</span>
                      )}
                    </h3>
                    <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">{item.subtitle}</p>
                  </div>
                  <div className="absolute bottom-0 left-8 right-8 h-1 bg-linear-to-r from-[#004aad] to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote" className="py-20 bg-linear-to-br from-[#004aad] to-[#003580]">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <QuoteForm productType={selectedProduct || undefined} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-slate-600">Visit our office or reach out to us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: 'fa-map-marker-alt', title: 'Location', info: 'Peejay Plaza, # 10-1-44/9, 3rd Floor, VIP Road, CBM Compound, Visakhapatnam - 530 003' },
              { icon: 'fa-phone', title: 'Phone', info: '+91 90524 33444' },
              { icon: 'fa-envelope', title: 'Email', info: 'gkinsurance1478@gmail.com' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <i className={`fas ${item.icon} text-3xl text-[#004aad] mb-4`}></i>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85dvh] overflow-y-auto p-4 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <QuoteForm
              productType={selectedProduct || undefined}
              onClose={() => setShowQuoteModal(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}