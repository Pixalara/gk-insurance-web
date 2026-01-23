'use client';

import { useState, FormEvent } from 'react';
import { saveLead } from '@/app/utils/storage';
import { useToast } from '@/app/context/ToastContext';

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
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});

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

    const validateForm = () => {
        const newErrors: Record<string, boolean> = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.insurance_type) newErrors.insurance_type = true;

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
            // 1. Save to LocalStorage (Priority for Admin Dashboard)
            saveLead({
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                insurance_type: formData.insurance_type,
                vehicle_number: formData.vehicle_number || undefined,
                message: formData.message || undefined,
                status: 'new',
                source: 'website',
            });

            // 2. Try Email Sending (Web3Forms) if key exists
            const apiKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

            if (apiKey) {
                try {
                    // Conditional payload construction
                    const emailPayload: any = {
                        access_key: apiKey,
                        subject: `New Insurance Quote Request - ${formData.insurance_type}`,
                        from_name: 'GK Insurance Website',
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email,
                        insurance_type: formData.insurance_type,
                        message: formData.message,
                    };

                    // Only include vehicle number if provided
                    if (formData.vehicle_number) {
                        emailPayload.vehicle_number = formData.vehicle_number;
                    }

                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(emailPayload),
                    });

                    const data = await response.json();
                    if (!data.success) console.warn('Web3Forms submission failed:', data);
                } catch (emailError) {
                    console.warn('Email sending skipped/failed:', emailError);
                }
            } else {
                console.log('Web3Forms API Key missing - Simulating email submission');
            }

            // 3. Show Success State
            setSubmitted(true);
            success('Quote request submitted successfully!');

            // Reset form logic
            setTimeout(() => {
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    insurance_type: '',
                    vehicle_number: '',
                    message: '',
                });
                if (onClose) onClose();
            }, 50000);

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
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check text-green-600 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                <p className="text-slate-600 mb-4">Your quote request has been received.</p>
                <div className="flex flex-col gap-3 justify-center">
                    <p className="text-sm text-slate-500">We'll contact you shortly. For faster response:</p>
                    <button
                        onClick={() => {
                            const details = [
                                `*New Quote Request*`,
                                `Name: ${formData.name}`,
                                `Phone: ${formData.phone}`,
                                formData.email ? `Email: ${formData.email}` : '',
                                `Type: ${formData.insurance_type}`,
                                formData.vehicle_number ? `Vehicle: ${formData.vehicle_number}` : '',
                                formData.message ? `Message: ${formData.message}` : ''
                            ].filter(Boolean).join('%0a');

                            window.open(`https://wa.me/919573322990?text=${details}`, '_blank');
                        }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors mx-auto"
                    >
                        <i className="fab fa-whatsapp text-xl"></i>
                        Send via WhatsApp
                    </button>
                    <button
                        onClick={onClose}
                        className="text-sm text-slate-400 hover:text-slate-600 mt-2 hover:underline"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Get Your Insurance Quote
            </h2>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: false });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] transition-all
                        ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    placeholder="Enter your full name"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: false });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] transition-all
                        ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    placeholder="Enter your phone number"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Insurance Type <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.insurance_type}
                    onChange={(e) => {
                        setFormData({ ...formData, insurance_type: e.target.value });
                        if (errors.insurance_type) setErrors({ ...errors, insurance_type: false });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] transition-all
                        ${errors.insurance_type ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                >
                    <option value="">Select insurance type</option>
                    {insuranceTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {(formData.insurance_type.includes('Vehicle') || formData.insurance_type.includes('Wheeler') || formData.insurance_type.includes('Car')) && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Vehicle Number
                    </label>
                    <input
                        type="text"
                        value={formData.vehicle_number}
                        onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                        placeholder="e.g., AP 01 AB 1234"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Message
                </label>
                <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent resize-none"
                    placeholder="Any specific requirements..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#004aad] text-white font-bold rounded-lg hover:bg-[#003580] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
                {isSubmitting ? 'Submitting...' : 'Get Quote'}
            </button>
        </form>
    );
}
