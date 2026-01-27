import Link from 'next/link';

// Define the interface to accept the brandName prop passed from page.tsx
interface FooterProps {
    brandName: string;
}

export default function Footer({ brandName }: FooterProps) {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-20 py-12">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        {/* Dynamic Brand Name based on props */}
                        <div className="text-2xl font-black uppercase tracking-tight text-[#004aad] mb-4">
                            {brandName}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            With over 20 years of experience, we serve 1500+ customers annually across Visakhapatnam,
                            providing comprehensive general, health, and life insurance solutions.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-[#004aad] transition-colors">
                                <i className="fab fa-facebook text-xl"></i>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-[#004aad] transition-colors">
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-[#004aad] transition-colors">
                                <i className="fab fa-linkedin text-xl"></i>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-[#004aad] transition-colors">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-slate-600 hover:text-[#004aad] transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/#products" className="text-sm text-slate-600 hover:text-[#004aad] transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/#about" className="text-sm text-slate-600 hover:text-[#004aad] transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/#contact" className="text-sm text-slate-600 hover:text-[#004aad] transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <i className="fas fa-map-marker-alt text-[#004aad] mt-1"></i>
                                <span>Peejay Plaza, # 10-1-44/9, 3rd Floor, VIP Road, CBM Compound, Visakhapatnam - 530 003</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <i className="fas fa-phone text-[#004aad] mt-1"></i>
                                <span>+91 90524 33444</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <i className="fas fa-envelope text-[#004aad] mt-1"></i>
                                <span>gkinsurance1478@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <div className="text-center md:text-left">
                        {/* Dynamic Copyright Section */}
                        <p>© 2026 {brandName}. All rights reserved.</p>
                        <p>Insurance is the subject matter of solicitation.</p>
                    </div>
                    <div className="font-semibold">
                        Powered by{' '}
                        <a
                            href="https://pixalara.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#004aad] hover:underline"
                        >
                            pixalara.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}