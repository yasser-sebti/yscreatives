import { useRef, useState, useEffect, useCallback, memo } from 'react';
import { useTransition } from '../context/TransitionContext';
import { gsap, useGSAP, SplitText, ScrollTrigger, ScrollSmoother } from '../gsap';
import Newsletter from '../components/Newsletter/Newsletter';
import MessageSentOverlay from '../components/MessageSentOverlay/MessageSentOverlay';
import '../styles/Contact.css';

// --- Smart Tooltip Component ---
// Encapsulates its own animation logic and keeps message visible during fade-out
const Tooltip = memo(({ message, isVisible }) => {
    const tooltipRef = useRef(null);
    const [displayMessage, setDisplayMessage] = useState(message);

    useEffect(() => {
        if (message) setDisplayMessage(message);
    }, [message]);

    useGSAP(() => {
        if (!tooltipRef.current) return;
        if (isVisible) {
            gsap.to(tooltipRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "back.out(1.7)",
                overwrite: "auto"
            });
        } else {
            gsap.to(tooltipRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: "power2.in",
                overwrite: "auto"
            });
        }
    }, { dependencies: [isVisible], scope: tooltipRef });

    return (
        <div ref={tooltipRef} className="ys-contact__tooltip">
            {message || displayMessage}
        </div>
    );
});


const countries = [
    "Algeria", "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Spain", "Italy", "Netherlands", "Belgium", "Switzerland",
    "Sweden", "Norway", "Denmark", "Finland", "Japan", "South Korea",
    "China", "India", "Brazil", "Mexico", "Argentina", "South Africa",
    "United Arab Emirates", "Saudi Arabia", "Singapore", "Malaysia",
    "Indonesia", "Thailand", "Vietnam", "Philippines", "New Zealand",
    "Ireland", "Portugal", "Austria", "Poland", "Czech Republic",
    "Greece", "Turkey", "Egypt", "Morocco", "Nigeria", "Kenya", "Other"
];

const budgetData = {
    "Logo design": {
        USD: ["Less than $120", "$120 - $300", "$300 - $650", "$650 - $1,100", "$1,100+"],
        EUR: ["Less than €110", "€110 - €280", "€280 - €600", "€600 - €1,000", "€1,000+"],
        DZD: ["Less than 15,000 DZD", "15,000 - 30,000 DZD", "30,000 - 65,000 DZD", "65,000 - 110,000 DZD", "110,000 DZD+"]
    },
    "Full Branding": {
        USD: ["Less than $600", "$600 - $1,500", "$1,500 - $3,500", "$3,500 - $7,000", "$7,000+"],
        EUR: ["Less than €550", "€550 - €1,380", "€1,380 - €3,220", "€3,220 - €6,450", "€6,450+"],
        DZD: ["Less than 65,000 DZD", "65,000 - 150,000 DZD", "150,000 - 350,000 DZD", "350,000 - 700,000 DZD", "700,000 DZD+"]
    },
    "Social Media packages": {
        USD: ["Less than $250", "$250 - $600", "$600 - $1,200", "$1,200 - $2,500", "$2,500+"],
        EUR: ["Less than €230", "€230 - €550", "€550 - €1,100", "€1,100 - €2,300", "€2,300+"],
        DZD: ["Less than 25,000 DZD", "25,000 - 60,000 DZD", "60,000 - 120,000 DZD", "120,000 - 250,000 DZD", "250,000 DZD+"]
    },
    "Other": {
        USD: ["Less than $300", "$300 - $1,000", "$1,000 - $5,000", "$5,000+"],
        EUR: ["Less than €280", "€280 - €920", "€920 - €4,600", "€4,600+"],
        DZD: ["Less than 30,000 DZD", "30,000 - 100,000 DZD", "100,000 - 500,000 DZD", "500,000 DZD+"]
    }
};

const referralOptions = [
    "Social Media (Instagram, LinkedIn)",
    "Google Search",
    "Recommendation / Word of Mouth",
    "Portfolio Website (Awwwards, Behance)",
    "Previous Client",
    "Other"
];

const serviceOptions = [
    "Logo design",
    "Full Branding",
    "Social Media packages"
];

// --- Validation Helpers ---
const isMashing = (val) => {
    if (!val || val.length < 4) return false;
    const repeated = /(.)\1{3,}/.test(val);
    const noVowels = /^[^aeiouy]{5,}$/i.test(val);
    const qwerty = /asdf|sdfg|dfgh|fghj|ghjk|hjkl|qwerty|qwer|asdfgh|zxcvbn/i.test(val);
    return repeated || noVowels || qwerty;
};

const validateEmail = (val) => {
    if (!val) return "Enter your email..";
    if (val.includes(' ')) return "No spaces allowed";
    const parts = val.split('@');
    if (parts.length === 1) return "Missing '@' symbol";
    if (parts.length > 2) return "Multiple '@' symbols detected";
    const local = parts[0];
    const domain = parts[1];
    if (!local) return "Missing local part before '@'";
    if (!domain) return "Missing provider after '@'";
    if (val.startsWith('.') || val.endsWith('.')) return "Cannot start or end with a dot";
    if (val.includes('..')) return "Consecutive dots not allowed";
    if (!domain.includes('.')) return "Missing domain (e.g. .com)";
    const domainDots = domain.split('.');
    if (domainDots.length > 0 && domainDots[domainDots.length - 1].length < 2) return "Domain extension too short";
    return null;
};

const validateField = (name, value, selectedCountry) => {
    switch (name) {
        case 'name':
            if (!value.trim()) return "Full name is required";
            if (value.length < 2) return "Name is too short";
            if (isMashing(value)) return "Looks like a typo / mashing";
            return null;
        case 'company':
            if (!value.trim()) return "Company is required";
            if (value.length < 2) return "Company is too short";
            if (isMashing(value)) return "Looks like a typo / mashing";
            return null;
        case 'email':
            return validateEmail(value);
        case 'phone':
            if (!value.trim()) return "Phone is required";
            const digits = value.replace(/\D/g, '');
            if (digits.length < 7) return "Phone number too short";
            if (selectedCountry === 'Algeria' && digits.startsWith('0') && digits.length !== 10) return "Algerian numbers: 10 digits";
            return null;
        default:
            return null;
    }
};

const Contact = () => {
    const containerRef = useRef(null);
    const starsRef = useRef(null);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [currency, setCurrency] = useState('USD');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [customCountry, setCustomCountry] = useState('');
    const [selectedReferral, setSelectedReferral] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [message, setMessage] = useState('');
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [isReferralOpen, setIsReferralOpen] = useState(false);
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const dropdownRef = useRef(null);
    const referralRef = useRef(null);
    const serviceRef = useRef(null);
    const subtitleRef = useRef(null);
    const { isAnimating, revealPage } = useTransition();

    useEffect(() => {
        // Global Reveal is handled by TransitionContext
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        budget: ''
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const charLimit = 1000;

    // 1. Initial Load Animations
    useGSAP((context, contextSafe) => {
        if (isAnimating) return;

        // Decorative Lines handled via data-ys-reveal="scale-x"

        // Magnetic Elements
        const magneticElements = gsap.utils.toArray(".ys-magnetic");
        magneticElements.forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
            const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

            const onMove = contextSafe((e) => {
                const { clientX, clientY } = e;
                const { height, width, left, top } = el.getBoundingClientRect();
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);
                xTo(x * 0.5);
                yTo(y * 0.5);
            });

            const onLeave = contextSafe(() => {
                xTo(0);
                yTo(0);
            });

            el.addEventListener("mousemove", onMove);
            el.addEventListener("mouseleave", onLeave);
        });

    }, { scope: containerRef, dependencies: [isAnimating] });

    // 2. Error Tooltip logic moved into the Tooltip component for advanced state persistence.




    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // Validate inputs
        ['name', 'company', 'email', 'phone'].forEach(field => {
            const err = validateField(field, formData[field], selectedCountry);
            if (err) newErrors[field] = err;
        });

        // Validate dropdowns
        if (!selectedCountry) newErrors.country = "Please select your country";
        if (selectedCountry === 'Other' && !customCountry.trim()) newErrors.customCountry = "Please type your country";
        if (!selectedReferral) newErrors.referral = "Please tell us how you heard about us";
        if (!selectedService) newErrors.service = "Please choose a service";
        if (selectedService && !formData.budget) newErrors.budget = "Please select a budget range";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setStatus('error');

            // Shake effect on form
            gsap.to(".ys-contact__form", {
                x: 'random(-4, 4)',
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                ease: "none",
                onComplete: () => gsap.set(".ys-contact__form", { x: 0 })
            });

            // Auto-clear after 4 seconds
            setTimeout(() => setStatus('idle'), 4000);
        } else {
            setStatus('submitting');

            try {
                // --- 1. DATA ENRICHMENT (Invisible to user) ---

                // Fetch Geolocation (IP, City, Country) with Dual Fallback
                const getGeoData = async () => {
                    const FALLBACK = { ip: "Unknown", city: "Unknown", region: "Unknown", country: "Unknown" };

                    try {
                        // 1. Get Absolute IP first (Most reliable)
                        const ipRes = await fetch('https://api.ipify.org?format=json').catch(() => null);
                        const ipData = ipRes ? await ipRes.json() : null;
                        const ip = ipData?.ip || "Unknown";

                        // 2. Get Location Mapping (ipwho.is is very reliable for free tier)
                        const geoRes = await fetch(`https://ipwho.is/${ip === 'Unknown' ? '' : ip}`).catch(() => null);
                        const geoData = geoRes ? await geoRes.json() : null;

                        if (geoData && geoData.success) {
                            return {
                                ip: ip,
                                city: geoData.city || "Unknown",
                                region: geoData.region || "Unknown",
                                country: geoData.country || "Unknown"
                            };
                        }

                        // 3. Last Resort Fallback to ipapi.co
                        const backupRes = await fetch('https://ipapi.co/json/').catch(() => null);
                        const backupData = backupRes ? await backupRes.json() : null;

                        return {
                            ip: ip,
                            city: backupData?.city || "Unknown",
                            region: backupData?.region || "Unknown",
                            country: backupData?.country_name || "Unknown"
                        };
                    } catch (e) {
                        console.warn("Geo lookup failed:", e);
                        return FALLBACK;
                    }
                };

                const geo = await getGeoData();

                // Calculate Real-Time Local Context
                const now = new Date();
                const localTime = new Intl.DateTimeFormat('en-US', {
                    weekday: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).format(now);

                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                const enrichedLead = {
                    ...formData,
                    country: selectedCountry === 'Other' ? customCountry : selectedCountry,
                    service: selectedService,
                    referral: selectedReferral,
                    message,
                    ip: geo.ip,
                    location: `${geo.city}, ${geo.region}, ${geo.country}`,
                    localTime,
                    timezone
                };

                // --- 2. DISPATCH TO DISCORD ---
                const { sendToDiscord } = await import('../utils/discord');
                await sendToDiscord(enrichedLead);

                // --- 3. UI SUCCESS FLOW ---
                setStatus('success');
                setShowSuccessOverlay(true);

                const container = containerRef.current;
                if (container) {
                    const rect = container.getBoundingClientRect();
                    container.style.minHeight = `${rect.height}px`;
                }

                setTimeout(() => {
                    setFormData({ name: '', company: '', email: '', phone: '', budget: '' });
                    setSelectedCountry('');
                    setCustomCountry('');
                    setSelectedReferral('');
                    setSelectedService('');
                    setMessage('');

                    ScrollTrigger.refresh();
                }, 600);
            } catch (err) {
                console.error("Submission error:", err);
                setStatus('success');
                setShowSuccessOverlay(true);
            }
        }
    };

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCountryOpen(false);
            }
            if (referralRef.current && !referralRef.current.contains(event.target)) {
                setIsReferralOpen(false);
            }
            if (serviceRef.current && !serviceRef.current.contains(event.target)) {
                setIsServiceOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleCurrency = useCallback((cur) => {
        setCurrency(cur);
    }, []);

    const handleCountrySelect = useCallback((country) => {
        setSelectedCountry(country);
        setIsCountryOpen(false);
    }, []);

    const handleServiceSelect = useCallback((service) => {
        setSelectedService(service);
        setIsServiceOpen(false);
    }, []);

    return (
        <>
            <main className="ys-contact" ref={containerRef}>
                {/* Decorative Lines */}
                <div className="ys-contact__line ys-contact__line--top" data-ys-reveal="scale-x"></div>

                <div className="ys-contact__container">
                    {/* Header Section */}
                    <header className="ys-contact__header">
                        <h1 className="ys-contact__title" data-ys-reveal="text">
                            Tell us more about your project
                        </h1>
                        <p className="ys-contact__subtitle" ref={subtitleRef} data-ys-reveal="text">
                            We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                        </p>
                    </header>

                    <div className="ys-contact__line ys-contact__line--middle" data-ys-reveal="scale-x" data-ys-delay="0.2"></div>

                    {/* Contact Form */}
                    <form className="ys-contact__form" onSubmit={handleSubmit} noValidate>
                        <div className="ys-contact__form-row">
                            <div className="ys-contact__form-group" data-ys-reveal="fade-up">
                                <label className="ys-contact__label" htmlFor="name">Full Name</label>
                                <Tooltip message={errors.name} isVisible={status === 'error' && !!errors.name} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`ys-contact__input ${errors.name ? 'has-error' : ''}`}
                                    placeholder="John Doe"
                                    required
                                    spellCheck="false"
                                />
                            </div>

                            <div className="ys-contact__form-group" data-ys-reveal="fade-up">
                                <label className="ys-contact__label" htmlFor="company">Company / Business Name</label>
                                <Tooltip message={errors.company} isVisible={status === 'error' && !!errors.company} />
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    autoComplete="organization"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className={`ys-contact__input ${errors.company ? 'has-error' : ''}`}
                                    placeholder="Your company or business name"
                                    spellCheck="false"
                                />
                            </div>
                        </div>

                        <div className="ys-contact__form-row">
                            <div className="ys-contact__form-group" data-ys-reveal="fade-up">
                                <label className="ys-contact__label" htmlFor="email">Email Address</label>
                                <Tooltip message={errors.email} isVisible={status === 'error' && !!errors.email} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`ys-contact__input ${errors.email ? 'has-error' : ''}`}
                                    placeholder="email@example.com"
                                    required
                                    spellCheck="false"
                                />
                            </div>

                            <div className="ys-contact__form-group" data-ys-reveal="fade-up">
                                <label className="ys-contact__label" htmlFor="phone">Phone Number</label>
                                <Tooltip message={errors.phone} isVisible={status === 'error' && !!errors.phone} />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`ys-contact__input ${errors.phone ? 'has-error' : ''}`}
                                    placeholder="+1 (555) 000-0000"
                                    spellCheck="false"
                                />
                            </div>
                        </div>

                        <div className="ys-contact__form-row">
                            {/* Custom Country Dropdown */}
                            <div className="ys-contact__form-group" ref={dropdownRef} data-ys-reveal="fade-up">
                                <label className="ys-contact__label">Country</label>
                                <Tooltip message={errors.country} isVisible={status === 'error' && !!errors.country} />
                                <div className={`ys-contact__custom-dropdown ${isCountryOpen ? 'is-open' : ''} ${errors.country ? 'has-error' : ''}`}>
                                    <div
                                        className="ys-contact__dropdown-trigger"
                                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                                    >
                                        <span>{selectedCountry || "Select your country"}</span>
                                        <svg className="ys-contact__dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="ys-contact__dropdown-menu">
                                        {countries.map((country) => (
                                            <div
                                                key={country}
                                                className={`ys-contact__dropdown-item ${selectedCountry === country ? 'is-selected' : ''}`}
                                                onClick={() => {
                                                    handleCountrySelect(country);
                                                    if (errors.country) setErrors(prev => {
                                                        const newErrs = { ...prev };
                                                        delete newErrs.country;
                                                        return newErrs;
                                                    });
                                                }}
                                            >
                                                {country}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <input type="hidden" id="contact-country" name="country" value={selectedCountry} required />
                            </div>

                            {/* Custom Country Input (Appears only if "Other" is selected) */}
                            {selectedCountry === 'Other' && (
                                <div className="ys-contact__form-group ys-contact__form-group--full" data-ys-reveal="fade-up">
                                    <label className="ys-contact__label" htmlFor="customCountry">Type your country</label>
                                    <Tooltip message={errors.customCountry} isVisible={status === 'error' && !!errors.customCountry} />
                                    <input
                                        type="text"
                                        id="customCountry"
                                        name="customCountry"
                                        value={customCountry}
                                        onChange={(e) => {
                                            setCustomCountry(e.target.value);
                                            if (errors.customCountry) setErrors(prev => {
                                                const n = { ...prev };
                                                delete n.customCountry;
                                                return n;
                                            });
                                        }}
                                        className={`ys-contact__input ${errors.customCountry ? 'has-error' : ''}`}
                                        placeholder="Enter your country name"
                                        required
                                        spellCheck="false"
                                    />
                                </div>
                            )}

                            {/* Referral Dropdown */}
                            <div className="ys-contact__form-group" ref={referralRef} data-ys-reveal="fade-up">
                                <label className="ys-contact__label">How did you hear about us?</label>
                                <Tooltip message={errors.referral} isVisible={status === 'error' && !!errors.referral} />
                                <div className={`ys-contact__custom-dropdown ${isReferralOpen ? 'is-open' : ''} ${errors.referral ? 'has-error' : ''}`}>
                                    <div
                                        className="ys-contact__dropdown-trigger"
                                        onClick={() => setIsReferralOpen(!isReferralOpen)}
                                    >
                                        <span>{selectedReferral || "Choose one..."}</span>
                                        <svg className="ys-contact__dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="ys-contact__dropdown-menu">
                                        {referralOptions.map((opt) => (
                                            <div
                                                key={opt}
                                                className={`ys-contact__dropdown-item ${selectedReferral === opt ? 'is-selected' : ''}`}
                                                onClick={() => {
                                                    setSelectedReferral(opt);
                                                    setIsReferralOpen(false);
                                                    if (errors.referral) setErrors(prev => {
                                                        const newErrs = { ...prev };
                                                        delete newErrs.referral;
                                                        return newErrs;
                                                    });
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <input type="hidden" id="contact-referral" name="referral" value={selectedReferral} />
                            </div>
                        </div>

                        {/* Services Section - Full Width Row */}
                        <div className="ys-contact__form-row ys-contact__form-row--single">
                            <div className="ys-contact__form-group" ref={serviceRef} data-ys-reveal="fade-up">
                                <label className="ys-contact__label">What do you need?</label>
                                <Tooltip message={errors.service} isVisible={status === 'error' && !!errors.service} />
                                <div className={`ys-contact__custom-dropdown ${isServiceOpen ? 'is-open' : ''} ${errors.service ? 'has-error' : ''}`}>
                                    <div
                                        className="ys-contact__dropdown-trigger"
                                        onClick={() => setIsServiceOpen(!isServiceOpen)}
                                    >
                                        <span>{selectedService || "Choose a service"}</span>
                                        <svg className="ys-contact__dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="ys-contact__dropdown-menu">
                                        {serviceOptions.map((opt) => (
                                            <div
                                                key={opt}
                                                className={`ys-contact__dropdown-item ${selectedService === opt ? 'is-selected' : ''}`}
                                                onClick={() => {
                                                    handleServiceSelect(opt);
                                                    if (errors.service) setErrors(prev => {
                                                        const newErrs = { ...prev };
                                                        delete newErrs.service;
                                                        return newErrs;
                                                    });
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                        <div
                                            className={`ys-contact__dropdown-item ${selectedService === 'Other' ? 'is-selected' : ''}`}
                                            onClick={() => {
                                                handleServiceSelect('Other');
                                                if (errors.service) setErrors(prev => {
                                                    const newErrs = { ...prev };
                                                    delete newErrs.service;
                                                    return newErrs;
                                                });
                                            }}
                                        >
                                            Other
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" id="contact-service" name="service" value={selectedService} required />
                            </div>
                        </div>

                        {/* Budget & Currency Toggles Column - Hidden until service selected */}
                        {selectedService && (
                            <div className="ys-contact__form-group ys-contact__form-group--budget">
                                <div className="ys-contact__label-row">
                                    <div className="ys-contact__label-group">
                                        <label className="ys-contact__label">Budget Range</label>
                                        {currency === 'DZD' && (
                                            <span className="ys-contact__label-note">(Algerian locals only)</span>
                                        )}
                                    </div>
                                    <Tooltip message={errors.budget} isVisible={status === 'error' && !!errors.budget} />
                                    <div className="ys-contact__currency-selector">
                                        {['USD', 'EUR', 'DZD'].map((cur) => (
                                            <button
                                                key={cur}
                                                type="button"
                                                className={`ys-contact__currency-btn ${currency === cur ? 'is-active' : ''}`}
                                                onClick={() => toggleCurrency(cur)}
                                            >
                                                {cur}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="ys-contact__budget-options">
                                    {budgetData[selectedService][currency].map((option, index) => (
                                        <label key={`${currency}-${index}`} className="ys-contact__budget-option">
                                            <input
                                                type="radio"
                                                name="budget"
                                                value={option}
                                                checked={formData.budget === option}
                                                onChange={handleInputChange}
                                                className="ys-contact__radio"
                                            />
                                            <span className="ys-contact__budget-label">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="ys-contact__form-group" data-ys-reveal="fade-up">
                            <label className="ys-contact__label" htmlFor="contact-message">Additional Message</label>
                            <div className="ys-contact__textarea-wrapper">
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    autoComplete="off"
                                    className="ys-contact__textarea"
                                    placeholder="Tell us about your project, goals, and any specific requirements..."
                                    rows="5"
                                    maxLength={charLimit}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <div className="ys-contact__char-counter">
                                    {message.length} / {charLimit}
                                </div>
                            </div>
                        </div>

                        <div className="ys-contact__line ys-contact__line--bottom" data-ys-reveal="scale-x"></div>

                        <div className="ys-contact__submit-container">
                            <button
                                type="submit"
                                className={`ys-contact__submit ys-magnetic ${status === 'submitting' ? 'is-submitting' : ''}`}
                                disabled={status === 'submitting'}
                                data-ys-reveal="fade-up"
                            >
                                <span>{status === 'submitting' ? 'SENDING...' : 'Send Message'}</span>
                                {status !== 'submitting' && (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                            <p className="ys-contact__response-time">
                                Typically responds within 24 hours.
                            </p>
                        </div>
                    </form>

                    <div className="ys-contact__footer-spacer"></div>
                </div>
            </main>

            {/* Message Sent Overlay */}
            <MessageSentOverlay
                isVisible={showSuccessOverlay}
                onClose={() => {
                    // 1. Immediately signal the UI change
                    setShowSuccessOverlay(false);
                    setStatus('idle');

                    // 2. Clear height lock while shutters are still 100% height (now covered)
                    const container = containerRef.current;
                    if (container) {
                        container.style.minHeight = '0';
                    }

                    // 3. Trigger the refresh IMMEDIATELY while shutters are closed
                    // This updates the footer position before they start opening
                    ScrollTrigger.refresh();
                    const smoother = ScrollSmoother.get();
                    if (smoother) smoother.refresh();

                    // 4. Final safety refresh after they should be mostly open
                    setTimeout(() => {
                        ScrollTrigger.refresh();
                        if (smoother) smoother.refresh();
                    }, 500); // Wait for the 0.5s uncovering animation
                }}
            />
        </>
    );
};

export default memo(Contact);
