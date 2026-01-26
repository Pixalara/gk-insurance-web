"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import QuoteForm from "./components/QuoteForm";

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

      {/* Partner Logos Slider */}
      <section className="py-12 bg-white border-y border-slate-200  ">
        <div className="container-custom">
          <p className="text-center text-sm font-semibold text-slate-600 uppercase tracking-wide mb-6">
            Trusted Insurance Partners
          </p>
          <div className="relative overflow-hidden w-full ">
            <div className="flex w-max animate-scroll gap-12 hover:pause">
              {[...insurancePartners.general, ...insurancePartners.health, ...insurancePartners.life, ...insurancePartners.general, ...insurancePartners.health, ...insurancePartners.life].map(
                (partner, idx) => (
                  <div
                    key={idx}
                    className="h-20 min-w-[120px] rounded-lg flex items-center justify-center p-4 bg-white "
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain transition-all duration-300"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  ">
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

      {/* Why Choose Us */}
      <section id="about" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Why Choose GK Insurance?
            </h2>
            <p className="text-lg text-slate-600">
              Your trusted insurance partner in Visakhapatnam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fa-award', title: '20+ Years', subtitle: 'Experience' },
              { icon: 'fa-users', title: '1500+', subtitle: 'Happy Customers' },
              { icon: 'fa-handshake', title: '10+', subtitle: 'Insurance Partners' },
              { icon: 'fa-star', title: 'Best Rates', subtitle: 'in Vizag' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`fas ${item.icon} text-3xl text-[#004aad]`}></i>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-600 font-medium">{item.subtitle}</p>
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
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-slate-600">
              Visit our office or reach out to us
            </p>
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
        <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-4 backdrop-blur-sm">
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
