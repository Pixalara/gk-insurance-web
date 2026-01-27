import Link from 'next/link';

interface FooterProps {
    brandName: string;
}

export default function Footer({ brandName }: FooterProps) {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-20 py-12">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info - Centered on Mobile */}
                    <div className="col-span-1 md:col-span-2 text-center md:text-left">
                        <div className="text-2xl font-black uppercase tracking-tight text-[#004aad] mb-4">
                            {brandName}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-md mx-auto md:mx-0">
                            With over 20 years of experience, we serve 1500+ customers annually across Visakhapatnam,
                            providing comprehensive general, health, and life insurance solutions.
                        </p>
                    </div>

                    {/* Quick Links - Centered on Mobile */}
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-sm text-slate-600 hover:text-[#004aad]">Home</Link></li>
                            <li><Link href="/#products" className="text-sm text-slate-600 hover:text-[#004aad]">Products</Link></li>
                            <li><Link href="/#about" className="text-sm text-slate-600 hover:text-[#004aad]">About Us</Link></li>
                            <li>
                                <a 
                                    href="https://admin.insurica.in" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-slate-600 hover:text-[#004aad] transition-colors font-semibold"
                                >
                                    Admin Dashboard <i className="fas fa-external-link-alt text-[10px] ml-1"></i>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info - Flex items centered on mobile */}
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start justify-center md:justify-start gap-2 text-sm text-slate-600">
                                <i className="fas fa-map-marker-alt text-[#004aad] mt-1"></i>
                                <span className="max-w-[200px] md:max-w-none">VIP Road, CBM Compound, Visakhapatnam - 530 003</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-600">
                                <i className="fas fa-phone text-[#004aad]"></i>
                                <span>+91 90524 33444</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar - Already responsive */}
                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <div className="text-center md:text-left">
                        <p>© 2026 {brandName}. All rights reserved.</p>
                        <p>Insurance is the subject matter of solicitation.</p>
                    </div>
                    <div className="font-semibold">
                        Powered by <a href="https://pixalara.com" target="_blank" className="text-[#004aad] hover:underline">pixalara.com</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}