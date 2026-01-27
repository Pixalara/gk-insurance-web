'use client';

import Link from 'next/link';
import { useState } from 'react';

// Added interface to match the props being passed in app/page.tsx
interface NavbarProps {
    onGetQuoteClick: () => void;
    brandName: string;
}

export default function Navbar({ onGetQuoteClick, brandName }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
            <div className="container-custom">
                <div className="flex items-center justify-between py-5">
                    {/* Updated to use dynamic brandName prop */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#004aad]">
                            {brandName}
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-[#004aad] transition-colors">
                            Home
                        </Link>
                        <Link href="/#products" className="text-sm font-semibold text-slate-700 hover:text-[#004aad] transition-colors">
                            Products
                        </Link>
                        <Link href="/#about" className="text-sm font-semibold text-slate-700 hover:text-[#004aad] transition-colors">
                            About Us
                        </Link>
                        <Link href="/#contact" className="text-sm font-semibold text-slate-700 hover:text-[#004aad] transition-colors">
                            Contact
                        </Link>

                        {/* Updated to use onGetQuoteClick function */}
                        <button
                            onClick={onGetQuoteClick}
                            className="px-6 py-2.5 bg-[#004aad] text-white font-bold text-sm rounded-full hover:bg-[#003580] transition-all duration-300 hover:shadow-lg"
                        >
                            Get Quote
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-700 p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-100">
                        <div className="flex flex-col gap-4 items-center">
                            <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-[#004aad] transition-colors">
                                Home
                            </Link>
                            <Link href="/#products" className="text-sm font-semibold text-slate-700 hover:text-[#004aad] transition-colors">
                                Products
                            </Link>
                            <Link href="/#about" className="text-sm font-semibold text-slate-700 hover:text-[#004aad] transition-colors">
                                About Us
                            </Link>
                            <Link href="/#contact" className="text-sm font-semibold text-slate-700 hover:text-[#004aad] transition-colors">
                                Contact
                            </Link>
                            <button
                                onClick={() => {
                                    onGetQuoteClick();
                                    setMobileMenuOpen(false);
                                }}
                                className="px-6 py-2.5 bg-[#004aad] w-[80%] text-white font-bold text-sm rounded hover:bg-[#003580] transition-all text-center"
                            >
                                Get Quote
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}