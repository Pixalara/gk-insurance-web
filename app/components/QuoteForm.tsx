'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { saveLead } from '@/app/utils/storage';
import { useToast } from '@/app/context/ToastContext';
import { sendQuoteEmail } from '@/app/actions/email-actions';

interface QuoteFormProps {
    productType?: string;
    onClose?: () => void;
}

export default function QuoteForm({ productType, onClose }: QuoteFormProps) {
    const { success, error: errorToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        insurance_type: productType || '',
        vehicle_number: '',
        dob: '', // Added DOB to state
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    // Custom Dropdown State
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const insuranceTypes = [
        'Two-Wheeler Insurance',
        'Car Insurance',
        'Commercial Vehicle Insurance',
        'Travel Insurance',
        'Shopkeeper Insurance',
        'Commercial Business Insurance',
        'Health Insurance',
        'Life Insurance',
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, boolean> = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.insurance_type) newErrors.insurance_type = true;

        // Added validation for DOB if required products are selected
        if ((formData.insurance_type === 'Travel Insurance' || 
             formData.insurance_type === 'Health Insurance' || 
             formData.insurance_type === 'Life Insurance') && !formData.dob) {
            newErrors.dob = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            errorToast('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const leadPayload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                insurance_type: formData.insurance_type,
                vehicle_number: formData.vehicle_number || undefined,
                dob: formData.dob || undefined, // Include DOB in payload
                message: formData.message || undefined,
                status: 'new',
                source: 'website',
            };

            saveLead(leadPayload as any);

            await sendQuoteEmail({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                insurance_type: formData.insurance_type,
                vehicle_number: formData.vehicle_number,
                dob: formData.dob, // Added to email action
                message: formData.message,
            });

            try {
                await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email,
                        insurance_type: formData.insurance_type,
                        vehicle_number: formData.vehicle_number,
                        dob: formData.dob, // Added to Web3Forms submission
                        message: formData.message,
                        subject: `New Quote Request: ${formData.insurance_type} - ${formData.name}`,
                        from_name: "Gk Insurance Website"
                    }),
                });
            } catch (error) {
                console.error("Web3Forms submission failed:", error);
            }

            setSubmitted(true);
            success('Quote request submitted successfully!');

        } catch (error) {
            console.error('Critical error submitting form:', error);
            errorToast('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <i className="fas fa-check text-green-500 text-4xl"></i>
                    </motion.div>
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                    Thank You!
                </h3>
                
                <p className="text-lg text-slate-500 font-medium mb-10 max-w-xs mx-auto leading-relaxed">
                    Your quote request has been received. Our advisory team will contact you shortly.
                </p>

                <button
                    onClick={() => {
                        window.location.href = "/";
                    }}
                    className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#004aad] transition-all duration-500 shadow-lg group mx-auto"
                >
                    Return to Site
                    <i className="fas fa-rotate-right ml-3 text-[10px] group-hover:rotate-180 transition-transform duration-500"></i>
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase tracking-tight">
                Request <span className="text-[#004aad]">Premium</span> Quote
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Full Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}
                        placeholder="e.g. Dileep Kumar"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Phone Number *</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}
                        placeholder="+91 90524 33444"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Email Address (Optional)</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold"
                    placeholder="name@example.com"
                />
            </div>

            <div className="space-y-2" ref={dropdownRef}>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Insurance Type *</label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-2 rounded-2xl transition-all font-bold text-left outline-none ${errors.insurance_type ? 'border-red-500' : 'border-slate-100'} ${isOpen ? 'border-[#004aad] bg-white ring-4 ring-[#004aad]/5 shadow-lg' : ''}`}
                    >
                        <span className={formData.insurance_type ? 'text-slate-900' : 'text-slate-400'}>
                            {formData.insurance_type || "Select insurance type"}
                        </span>
                        <i className={`fas fa-chevron-down text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#004aad]' : 'text-slate-400'}`}></i>
                    </button>

                    {isOpen && (
                        <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="max-h-[250px] overflow-y-auto">
                                {insuranceTypes.map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => {
                                            setFormData({ ...formData, insurance_type: type });
                                            setIsOpen(false);
                                            if (errors.insurance_type) setErrors({ ...errors, insurance_type: false });
                                        }}
                                        className={`px-6 py-4 cursor-pointer transition-colors flex items-center justify-between ${formData.insurance_type === type ? 'bg-blue-50/50 text-[#004aad] font-bold' : 'text-slate-700 font-semibold hover:bg-slate-50'}`}
                                    >
                                        {type}
                                        {formData.insurance_type === type && <i className="fas fa-check text-xs"></i>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CONDITIONAL DOB FIELD */}
            {(formData.insurance_type === 'Travel Insurance' || 
              formData.insurance_type === 'Health Insurance' || 
              formData.insurance_type === 'Life Insurance') && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => {
                            setFormData({ ...formData, dob: e.target.value });
                            if (errors.dob) setErrors({ ...errors, dob: false });
                        }}
                        className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold
                            ${errors.dob ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}
                    />
                </div>
            )}

            {(formData.insurance_type.includes('Vehicle') || formData.insurance_type.includes('Wheeler') || formData.insurance_type.includes('Car')) && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Vehicle Registration Number</label>
                    <input
                        type="text"
                        value={formData.vehicle_number}
                        onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold"
                        placeholder="AP 01 AB 1234"
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Special Requirements</label>
                <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold resize-none"
                    placeholder="Tell us more about your needs..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full py-5 bg-[#004aad] text-white font-black text-lg uppercase tracking-widest rounded-2xl hover:bg-[#003580] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#004aad]/20 flex items-center justify-center gap-3"
            >
                {isSubmitting ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                    <>
                        Get My Quote
                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </>
                )}
            </button>
        </form>
    );
}