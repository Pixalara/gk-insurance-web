'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveLead } from '@/app/utils/storage';
import { useToast } from '@/app/context/ToastContext';
import { sendQuoteEmail } from '@/app/actions/email-actions';

// Premium Date Picker Integration
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface QuoteFormProps {
    productType?: string;
    onClose?: () => void;
}

export default function QuoteForm({ productType, onClose }: QuoteFormProps) {
    const { success, error: errorToast } = useToast();
    
    // Country List for Search
    const popularCountries = ["Schengen", "USA/Canada", "Thailand", "United Arab Emirates", "Vietnam", "Australia", "Singapore", "United Kingdom", "Within India"];
    const allCountries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        insurance_type: productType || '',
        vehicle_number: '',
        dob: null as Date | null,
        destinations: [] as string[],
        start_date: null as Date | null,
        end_date: null as Date | null,
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    
    const [searchTerm, setSearchTerm] = useState('');
    const [showCountryList, setShowCountryList] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const countryRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
            if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
                setShowCountryList(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // AUTO-COMPLETE LOGIC
    const filteredCountries = allCountries.filter(c => 
        c.toLowerCase().includes(searchTerm.toLowerCase()) && !formData.destinations.includes(c)
    );

    const toggleDestination = (country: string) => {
        setFormData(prev => ({
            ...prev,
            destinations: prev.destinations.includes(country) 
                ? prev.destinations.filter(d => d !== country)
                : [...prev.destinations, country]
        }));
        setSearchTerm('');
    };

    const validateForm = () => {
        const newErrors: Record<string, boolean> = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.insurance_type) newErrors.insurance_type = true;

        if (['Travel Insurance', 'Health Insurance', 'Life Insurance'].includes(formData.insurance_type) && !formData.dob) {
            newErrors.dob = true;
        }

        if (formData.insurance_type === 'Travel Insurance') {
            if (formData.destinations.length === 0) newErrors.destinations = true;
            if (!formData.start_date) newErrors.start_date = true;
            if (!formData.end_date) newErrors.end_date = true;
        }

        const isMotorProduct = formData.insurance_type.includes('Vehicle') || 
                               formData.insurance_type.includes('Wheeler') || 
                               formData.insurance_type.includes('Car');
        
        if (isMotorProduct && !formData.vehicle_number.trim()) {
            newErrors.vehicle_number = true;
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
            const formattedDate = formData.dob ? formData.dob.toLocaleDateString('en-GB') : '';
            const travelDates = formData.insurance_type === 'Travel Insurance' 
                ? `${formData.start_date?.toLocaleDateString('en-GB')} to ${formData.end_date?.toLocaleDateString('en-GB')}`
                : '';

            const leadPayload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                insurance_type: formData.insurance_type,
                vehicle_number: formData.vehicle_number || undefined,
                dob: formattedDate || undefined,
                destinations: formData.destinations.join(', ') || undefined,
                travel_dates: travelDates || undefined,
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
                dob: formattedDate,
                message: formData.insurance_type === 'Travel Insurance' 
                    ? `Destinations: ${leadPayload.destinations}\nDates: ${travelDates}\n\n${formData.message}`
                    : formData.message,
            });

            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
                    ...leadPayload,
                    subject: `New Quote Request: ${formData.insurance_type} - ${formData.name}`,
                    from_name: "Gk Insurance Website"
                }),
            });

            setSubmitted(true);
            success('Quote request submitted successfully!');
        } catch (error) {
            console.error('Critical submission error:', error);
            errorToast('Failed to submit form.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                        <i className="fas fa-check text-green-500 text-4xl"></i>
                    </motion.div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Thank You!</h3>
                <p className="text-lg text-slate-500 font-medium mb-10 max-w-xs mx-auto leading-relaxed">Your request has been received. Our team will contact you shortly.</p>
                <button onClick={() => window.location.href = "/"} className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#004aad] transition-all duration-500 shadow-lg group mx-auto">
                    Return to Site <i className="fas fa-rotate-right ml-3 text-[10px] group-hover:rotate-180 transition-transform duration-500"></i>
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 mb-8 text-center uppercase tracking-tight">Request <span className="text-[#004aad]">Premium</span> Quote</h2>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Full Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-100'}`} placeholder="e.g. Dileep Kumar" />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Phone Number *</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-100'}`} placeholder="+91 90524 33444" />
                </div>
            </div>

            {/* Insurance Dropdown */}
            <div className="space-y-2" ref={dropdownRef}>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Insurance Type *</label>
                <div className="relative">
                    <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-2 rounded-2xl transition-all font-bold text-left outline-none ${errors.insurance_type ? 'border-red-500' : 'border-slate-100'} ${isOpen ? 'border-[#004aad] bg-white ring-4 ring-[#004aad]/5 shadow-lg' : ''}`}>
                        <span className={formData.insurance_type ? 'text-slate-900' : 'text-slate-400'}>{formData.insurance_type || "Select insurance type"}</span>
                        <i className={`fas fa-chevron-down text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#004aad]' : 'text-slate-400'}`}></i>
                    </button>
                    {isOpen && (
                        <div className="absolute z-[110] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="max-h-[250px] overflow-y-auto">
                                {insuranceTypes.map((type) => (
                                    <div key={type} onClick={() => { setFormData({ ...formData, insurance_type: type }); setIsOpen(false); }} className={`px-6 py-4 cursor-pointer transition-colors flex items-center justify-between ${formData.insurance_type === type ? 'bg-blue-50/50 text-[#004aad] font-bold' : 'text-slate-700 font-semibold hover:bg-slate-50'}`}>
                                        {type} {formData.insurance_type === type && <i className="fas fa-check text-xs"></i>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* TRAVEL INSURANCE PREMIUM UI WITH AUTO-COMPLETE */}
            {formData.insurance_type === 'Travel Insurance' && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    
                    {/* Destination Search */}
                    <div className="space-y-2" ref={countryRef}>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Add destination countries *</label>
                        <div className={`relative w-full min-h-[64px] p-2 bg-slate-50 border-2 rounded-2xl flex flex-wrap gap-2 items-center transition-all ${errors.destinations ? 'border-red-500 bg-red-50' : 'border-slate-100'} ${showCountryList ? 'border-[#004aad] bg-white shadow-lg' : ''}`}>
                            {formData.destinations.map(dest => (
                                <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={dest} className="bg-[#004aad]/10 text-[#004aad] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-[#004aad]/20">
                                    {dest}
                                    <button onClick={() => toggleDestination(dest)} type="button" className="hover:text-red-500 transition-colors"><i className="fas fa-times"></i></button>
                                </motion.span>
                            ))}
                            <div className="relative flex-grow min-w-[150px]">
                                <input 
                                    type="text"
                                    placeholder={formData.destinations.length === 0 ? "Search for countries..." : "Add more..."} 
                                    className="w-full bg-transparent outline-none p-2 text-sm font-bold"
                                    value={searchTerm}
                                    onFocus={() => setShowCountryList(true)}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && filteredCountries.length > 0) {
                                            e.preventDefault();
                                            toggleDestination(filteredCountries[0]);
                                        }
                                    }}
                                />
                                {/* AUTO-COMPLETE SUGGESTION SHADOW */}
                                {searchTerm && filteredCountries.length > 0 && (
                                    <span className="absolute left-2 top-2 text-slate-300 pointer-events-none text-sm font-bold opacity-50">
                                        {searchTerm}
                                        <span className="text-slate-400">{filteredCountries[0].substring(searchTerm.length)}</span>
                                    </span>
                                )}
                            </div>
                            
                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {showCountryList && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-[120] left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden max-h-[400px] flex flex-col">
                                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Popular Destinations</p>
                                            <div className="flex flex-wrap gap-2">
                                                {popularCountries.map(pc => (
                                                    <button key={pc} type="button" onClick={() => toggleDestination(pc)} className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${formData.destinations.includes(pc) ? 'bg-[#004aad] text-white border-[#004aad]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#004aad] hover:text-[#004aad]'}`}>
                                                        {pc}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto flex-grow">
                                            {filteredCountries.length > 0 ? (
                                                filteredCountries.map((c, index) => (
                                                    <button key={c} type="button" onClick={() => toggleDestination(c)} className={`w-full text-left px-6 py-4 transition-colors flex items-center justify-between border-b border-slate-50 last:border-none ${index === 0 && searchTerm ? 'bg-blue-50/50 text-[#004aad] font-black' : 'hover:bg-slate-50 text-sm font-bold text-slate-700'}`}>
                                                        {c}
                                                        {index === 0 && searchTerm ? <span className="text-[10px] uppercase tracking-tighter opacity-60">Press Enter</span> : <i className="fas fa-plus text-[10px] text-slate-300"></i>}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-slate-400 font-bold text-sm italic">No countries found matching "{searchTerm}"</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Trip Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Departure date</label>
                            <div className="relative">
                                <DatePicker selected={formData.start_date} onChange={(date) => setFormData({...formData, start_date: date})} selectsStart startDate={formData.start_date} endDate={formData.end_date} minDate={new Date()} placeholderText="Select departure" className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-sm ${errors.start_date ? 'border-red-500 bg-red-50' : 'border-slate-100'}`} />
                                <i className="fas fa-plane-departure absolute right-6 top-1/2 -translate-y-1/2 text-[#004aad]"></i>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Return date</label>
                            <div className="relative">
                                <DatePicker selected={formData.end_date} onChange={(date) => setFormData({...formData, end_date: date})} selectsEnd startDate={formData.start_date} endDate={formData.end_date} minDate={formData.start_date || new Date()} placeholderText="Select return" className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl font-bold text-sm ${errors.end_date ? 'border-red-500 bg-red-50' : 'border-slate-100'}`} />
                                <i className="fas fa-plane-arrival absolute right-6 top-1/2 -translate-y-1/2 text-[#004aad]"></i>
                            </div>
                        </div>
                    </div>

                    {/* Traveller DOB Section */}
                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Traveller's Date of birth</span>
                        </div>
                        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <span className="font-bold text-slate-800 flex items-center gap-3"><i className="fas fa-user-circle text-slate-300"></i> Self</span>
                            <DatePicker
                                selected={formData.dob}
                                onChange={(date) => setFormData({...formData, dob: date})}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                showYearDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                                className="text-right font-black text-[#004aad] outline-none w-[120px] bg-transparent cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Standard DOB Field */}
            {(formData.insurance_type === 'Health Insurance' || formData.insurance_type === 'Life Insurance') && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Date of Birth <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DatePicker selected={formData.dob} onChange={(date: Date | null) => { setFormData({ ...formData, dob: date }); if (errors.dob) setErrors({ ...errors, dob: false }); }} dateFormat="dd/MM/yyyy" placeholderText="DD/MM/YYYY" showMonthDropdown showYearDropdown dropdownMode="select" minDate={new Date(1940, 0, 1)} maxDate={new Date()} yearDropdownItemNumber={86} scrollableYearDropdown={true} className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold ${errors.dob ? 'border-red-500 bg-red-50' : 'border-slate-100'}`} />
                        <i className="fas fa-calendar-alt absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                    </div>
                </div>
            )}

            {/* Motor Fields */}
            {(formData.insurance_type.includes('Vehicle') || formData.insurance_type.includes('Wheeler') || formData.insurance_type.includes('Car')) && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Vehicle Registration Number <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.vehicle_number} onChange={(e) => { setFormData({ ...formData, vehicle_number: e.target.value }); if (errors.vehicle_number) setErrors({ ...errors, vehicle_number: false }); }} className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold ${errors.vehicle_number ? 'border-red-500 bg-red-50' : 'border-slate-100'}`} placeholder="AP 01 AB 1234" />
                </div>
            )}

            {/* Message Field */}
            <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Special Requirements</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#004aad]/5 focus:bg-white transition-all font-semibold resize-none" placeholder="Tell us more about your needs..." />
            </div>

            <button type="submit" disabled={isSubmitting} className="group w-full py-5 bg-[#004aad] text-white font-black text-lg uppercase tracking-widest rounded-2xl hover:bg-[#003580] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#004aad]/20 flex items-center justify-center gap-3">
                {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : <><span className="hidden sm:inline">Get My Quote</span><i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i></>}
            </button>
        </form>
    );
}