import React, { useState, useEffect } from 'react';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowRight, BarChart2, Activity, Shield, Menu, X, CheckCircle, ChevronRight, Settings, AlertTriangle, Globe, Database, Cpu, FileText, UserCheck, Wrench, HardHat, GraduationCap, Layers, Cog, Binary, Zap, MessageSquare, Cookie, Scale, ArrowUpRight, User, Mail, Cloud, Terminal, BarChart4, FileSearch, Calendar, Clock, ChevronLeft, Loader2, Linkedin, Github } from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- Brand Colors & Assets ---
const BrandColors = {
  yellow: '#FCD116', 
  darkGrey: '#0A0A0A', 
  surface: '#121212', 
  textLight: '#FAFAFA', 
  textGrey: '#A1A1AA', 
  border: 'rgba(255, 255, 255, 0.06)' 
};

const Logo = ({ className = "", size = "lg" }) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const baseFontSize = size === "sm" ? "1rem" : size === "md" ? "1.5rem" : "2rem";
  const fontSize = className && className.includes('text-') ? undefined : baseFontSize;

  return (
    <div 
      onClick={handleClick}
      className={className}
      style={{ 
        fontFamily: "'Space Grotesk', sans-serif",
        ...(fontSize && { fontSize }),
        fontWeight: 700,
        letterSpacing: '-0.05em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'baseline',
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
      <span style={{ color: '#ffffff' }}>P</span>
      <span style={{ color: BrandColors.yellow, fontWeight: 400, marginRight: '2px' }}>_</span>
      <span style={{ color: '#ffffff' }}>Analytics</span>
      <span style={{ color: BrandColors.yellow }}>.</span>
    </div>
  );
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 text-sm w-full sm:w-auto";
  const variants = {
    primary: `bg-[#FCD116] text-black hover:bg-[#FFE066] shadow-[0_0_15px_rgba(252,209,22,0.15)] hover:shadow-[0_0_25px_rgba(252,209,22,0.3)]`,
    secondary: `bg-white/5 text-[#FCD116] border border-[#FCD116]/20 hover:bg-[#FCD116]/10 hover:border-[#FCD116]/50 backdrop-blur-sm`,
    ghost: `text-zinc-400 hover:text-white hover:bg-white/5`
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Unified Card Component ---
const InfoCard = ({ icon: Icon, title, description, onClick, className = "", ctaLabel = "Learn more" }) => (
  <div 
    onClick={onClick}
    className={`group relative p-6 md:p-8 rounded-2xl bg-[#121212]/60 border border-white/5 hover:border-[#FCD116]/30 hover:bg-[#121212]/90 backdrop-blur-md transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full ${className}`}
  >
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <ArrowUpRight className="w-5 h-5 text-[#FCD116]" />
    </div>
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#FCD116] transition-colors duration-300 border border-white/5 group-hover:border-[#FCD116] shrink-0">
      <Icon className="w-6 h-6 text-[#FCD116] group-hover:text-black transition-colors" />
    </div>
    <div className="flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-3 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{description}</p>
    </div>
    <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs text-[#FCD116] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium tracking-wider">
        {ctaLabel} <ArrowRight className="w-3 h-3 ml-1" />
    </div>
  </div>
);

// --- Booking Helper Logic ---
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
const safeParseBookings = (value) => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const AVAILABLE_SLOTS = ["17:00", "18:00", "19:00", "20:00"];

const BookingCalendar = ({ onSelectSlot, lang }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookedSlots, setBookedSlots] = useState({});

    // Load booked slots from local storage on mount
    useEffect(() => {
        const stored = safeParseBookings(localStorage.getItem('panalytics_bookings'));
        if (Object.keys(stored).length) {
            setBookedSlots(stored);
        }
    }, []);

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); 

    const canGoToPrevMonth = () => {
        const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastDayOfPrevMonth = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0);
        lastDayOfPrevMonth.setHours(0, 0, 0, 0);
        return lastDayOfPrevMonth >= today;
    };

    const handlePrevMonth = () => {
        if (!canGoToPrevMonth()) return;
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const clickedDate = new Date(newDate);
        clickedDate.setHours(0, 0, 0, 0);
        
        // Prevent selection of past dates
        if (clickedDate < today) return;
        
        setSelectedDate(newDate);
    };
    
    const isDateDisabled = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    };

    const handleSlotClick = (time) => {
        if (!selectedDate) return;
        const dateKey = selectedDate.toISOString().split('T')[0];
        onSelectSlot(dateKey, time);
    };

    const isSlotBooked = (time) => {
        if (!selectedDate) return false;
        const dateKey = selectedDate.toISOString().split('T')[0];
        return bookedSlots[dateKey]?.includes(time);
    };

    return (
        <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={handlePrevMonth} 
                    disabled={!canGoToPrevMonth()}
                    className={`p-1 transition-colors ${canGoToPrevMonth() ? 'hover:text-[#FCD116] cursor-pointer' : 'opacity-30 cursor-not-allowed text-zinc-600'}`}
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="font-bold text-sm tracking-widest">
                    {currentDate.toLocaleString(lang === 'en' ? 'default' : 'el-GR', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={handleNextMonth} className="p-1 hover:text-[#FCD116] transition-colors cursor-pointer"><ChevronRight size={16} /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {(lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ']).map((d, i) => (
                    <div key={i} className="text-[10px] text-zinc-600 font-bold">{d}</div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-6">
                {blanks.map((_, i) => <div key={`blank-${i}`} className="h-8"></div>)}
                {days.map(day => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isDisabled = isDateDisabled(day);
                    
                    return (
                        <button 
                            key={day} 
                            onClick={() => handleDateClick(day)}
                            disabled={isDisabled}
                            className={`h-8 rounded-md text-xs font-medium transition-all duration-200 
                                ${isDisabled ? 'opacity-30 cursor-not-allowed text-zinc-600' : 'cursor-pointer'}
                                ${isSelected ? 'bg-[#FCD116] text-black shadow-[0_0_10px_#FCD116]' : isDisabled ? '' : 'hover:bg-white/10 text-zinc-400'}
                                ${isToday && !isSelected && !isDisabled ? 'border border-[#FCD116] text-[#FCD116]' : ''}
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 border-t border-white/10 pt-4">
                <p className="text-xs text-zinc-500 mb-3 flex items-center gap-2">
                    <Clock size={12} /> {lang === 'en' ? 'Available time slots' : 'Διαθέσιμες ώρες'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_SLOTS.map(time => {
                        const booked = isSlotBooked(time);
                        const isDisabled = !selectedDate || booked;
                        return (
                            <button 
                                key={time} 
                                disabled={isDisabled}
                                onClick={() => handleSlotClick(time)}
                                className={`py-2 rounded text-[10px] font-mono border transition-all
                                    ${booked 
                                        ? 'bg-red-500/10 border-red-500/20 text-red-500 cursor-not-allowed line-through' 
                                        : isDisabled
                                        ? 'border-white/5 text-zinc-600 cursor-not-allowed opacity-50'
                                        : 'border-white/10 hover:border-[#FCD116] hover:text-[#FCD116] text-zinc-300 cursor-pointer'
                                    }
                                `}
                            >
                                {time}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Legal Docs Content ---
const legalDocsContent = [
  { 
    id: 'privacy', 
    icon: Shield, 
    titleEn: "Privacy Policy",
    titleEl: "Πολιτική απορρήτου",
    contentEn: `Panalytics is committed to protecting the privacy of its visitors. This Privacy Policy explains how personal information is collected, used, and protected.\n\nData Collection:\nOnly data necessary for communication and service provision is collected (Name, Email). Data is not sold or shared with third parties.\n\nSecurity:\nStrict security measures are implemented to protect your data from unauthorized access.`,
    contentEl: `Η Panalytics δεσμεύεται να προστατεύει το ιδιωτικό απόρρητο των επισκεπτών της. Η παρούσα Πολιτική Απορρήτου εξηγεί πώς συλλέγονται, χρησιμοποιούνται και προστατεύονται οι προσωπικές πληροφορίες.\n\nΣυλλογή δεδομένων:\nΣυλλέγονται μόνο τα δεδομένα που είναι απαραίτητα για την επικοινωνία και την παροχή υπηρεσιών (όνομα, email). Τα δεδομένα δεν πωλούνται ούτε διαμοιράζονται σε τρίτους.\n\nΑσφάλεια:\nΕφαρμόζονται αυστηρά μέτρα ασφαλείας για την προστασία των δεδομένων από μη εξουσιοδοτημένη πρόσβαση.`
  },
  { 
    id: 'cookies', 
    icon: Cookie, 
    titleEn: "Cookies Policy",
    titleEl: "Πολιτική cookies",
    contentEn: `This website uses cookies to improve browsing experience and analyze traffic.\n\nWhat are Cookies?\nCookies are small text files stored on your device.\n\nCookie Categories:\n1. Essential: For site operation.\n2. Analytics: For traffic statistics (anonymous).\n3. Preferences: To store your choices.`,
    contentEl: `Αυτή η ιστοσελίδα χρησιμοποιεί cookies για να βελτιώσει την εμπειρία περιήγησης και να αναλύσει την επισκεψιμότητα.\n\nΤι είναι τα cookies;\nΤα cookies είναι μικρά αρχεία κειμένου που αποθηκεύονται στη συσκευή σας.\n\nΚατηγορίες cookies:\n1. Απαραίτητα: Για τη λειτουργία του site.\n2. Ανάλυσης: Για στατιστικά επισκεψιμότητας (ανώνυμα).\n3. Προτιμήσεων: Για αποθήκευση των επιλογών σας.`
  },
  { 
    id: 'terms', 
    icon: Scale, 
    titleEn: "Terms of Use",
    titleEl: "Όροι χρήσης",
    contentEn: `Welcome to the Panalytics website. Use of this site implies acceptance of the following terms:\n\n1. Intellectual Property: All content (text, images, code) belongs to Panalytics and is protected.\n2. Limitation of Liability: Panalytics is not liable for damages arising from site use.\n3. Modifications: The right to change terms without notice is reserved.`,
    contentEl: `Καλώς ήρθατε στην ιστοσελίδα της Panalytics. Η χρήση της ιστοσελίδας συνεπάγεται την αποδοχή των κάτωθι όρων:\n\n1. Πνευματική ιδιοκτησία: Όλο το περιεχόμενο (κείμενα, εικόνες, κώδικας) ανήκει στην Panalytics και προστατεύεται.\n2. Περιορισμός ευθύνης: Η Panalytics δεν ευθύνεται για τυχόν ζημιές από τη χρήση του site.\n3. Τροποποιήσεις: Διατηρείται το δικαίωμα αλλαγής των όρων χωρίς προειδοποίηση.`
  },
  { 
    id: 'gdpr', 
    icon: FileText, 
    titleEn: "Personal data (GDPR)",
    titleEl: "Προσωπικά δεδομένα (GDPR)",
    contentEn: `In full compliance with Regulation (European Union) 2016/679 (GDPR), you have the following rights:\n\n1. Right of Access to your data.\n2. Right to Rectification of inaccurate data.\n3. Right to Erasure ("Right to be Forgotten").\n4. Right to Data Portability.\n\nFor any request, contact info@panalytics.gr`,
    contentEl: `Σε πλήρη συμμόρφωση με τον Κανονισμό (Ευρωπαϊκή Ένωση) 2016/679 (GDPR), έχετε τα εξής δικαιώματα:\n\n1. Δικαίωμα πρόσβασης στα δεδομένα σας.\n2. Δικαίωμα διόρθωσης ανακριβών στοιχείων.\n3. Δικαίωμα διαγραφής ("Δικαίωμα στη λήθη").\n4. Δικαίωμα φορητότητας.\n\nΓια οποιοδήποτε αίτημα, επικοινωνήστε στο info@panalytics.gr`
  }
];

// --- Translations ---
const translations = {
  en: {
    common: {
      learnMore: "Learn more"
    },
    nav: { methodology: "Methodology", background: "Profile", expertise: "Expertise", contact: "Contact" },
    hero: {
      badge: "Data Analyst • Mechanical & Fleet Systems",
      title: "Specialized analysis for fleet management & mechanical data",
      subtitle: "Bridging 10 years of hands-on mechanical experience with data science. Focused on Fleet Management Systems (FMS), FFT signal analysis, and the development of Digital Twins.",
      primary: "Initiate contact",
      secondary: "View profile",
      report: {
        name: "Report_Q4_Opt.pdf",
        updated: "Last updated: Just now",
        status: "Verified"
      },
      insight: {
        title: "Optimization opportunity",
        value: "+8.4% Efficiency",
        quote: "\"Analysis indicates idle time reduction potential in Haul Truck #42 during shift changeovers.\""
      }
    },
    bio: {
      title: "Professional background",
      subtitle: "Experience forged in the depths, refined by data.",
      steps: [
        { 
            title: "10 Years field experience", 
            desc: "Mechanical technician & underground mining operator.",
            details: "Extensive hands-on experience in underground mining operations. Responsible for the maintenance and operation of heavy machinery (LHDs, drill rigs, haul trucks). Developed a deep understanding of mechanical failure modes, hydraulic systems, and the harsh realities of industrial environments."
        },
        { 
            title: "Technical diploma", 
            desc: "Machinery & automotive systems. Dispatch field technician.",
            details: "Certified technician in machinery and automotive systems. Gained specialized experience as a Dispatch Field Technician, installing and calibrating sensors, troubleshooting telemetry hardware, and bridging the gap between physical equipment and digital monitoring systems."
        },
        { 
            title: "CS student", 
            desc: "Data Science with a strong focus on Digital Twins & IoT.",
            details: "Currently pursuing a degree in Computer Science to formalize analytical skills. Academic focus includes Machine Learning, Database Management, and Industrial IoT protocols (MQTT, OPC UA). Researching the application of Digital Twins for predictive maintenance in heavy industry. Also completed an IEK diploma in Web Development, reinforcing front-end foundations and UI architecture."
        },
        { 
            title: "Domain expert", 
            desc: "Understanding the machine behind the data.",
            details: "The unique value proposition: I don't just see numbers; I see the machine. This dual background allows me to distinguish between sensor noise and actual mechanical degradation, providing insights that pure data scientists often miss."
        }
      ]
    },
    methodology: {
      title: "Analysis pipeline",
      subtitle: "From raw sensor logs to strategic maintenance decisions.",
      steps: [
        { title: "Ingestion", desc: "Secure streaming of telematics data (SQL/API) from fleet management systems." },
        { title: "Pre-processing", desc: "Cleaning, normalization, and outlier detection using Python (Pandas/NumPy)." },
        { title: "Modeling", desc: "Applying ML algorithms to detect mechanical degradation patterns." },
        { title: "Strategy", desc: "Delivering actionable PDF reports and maintenance schedules." }
      ]
    },
    bento: {
      title: "Core competencies",
      subtitle: "Delivering actionable intelligence, not just raw data.",
      cards: {
        predictive: { 
            title: "Predictive maintenance", 
            desc: "Algorithm development for failure prediction based on sensor anomalies.",
            details: "Advanced machine learning algorithms are utilized to analyze sensor data in real-time. By detecting subtle anomalies in vibration, temperature, and pressure, component failures can be predicted weeks in advance, allowing for scheduled maintenance and zero unplanned downtime."
        },
        optimization: { 
            title: "Fleet data analysis", 
            desc: "Deep analysis of FMS and dispatch data for operational efficiency.",
            details: "Analysis goes beyond basic tracking. Dispatch data, load cycles, and fuel consumption are correlated to identify bottlenecks. Actionable insights are provided to optimize routes, reduce idle time, and improve overall fleet operational efficiency."
        },
        reporting: { 
            title: "Digital Twins", 
            desc: "Creating virtual replicas for simulation and scenario analysis.",
            details: "High-fidelity digital replicas of physical assets are created. These digital twins allow for risk-free simulation of operational scenarios, stress testing, and predictive modeling, enabling data-driven decisions without disrupting actual operations."
        },
        integration: { 
            title: "System agnostic", 
            desc: "Compatible with all major OEM telematics & ERP systems.",
            details: "Seamless integration with existing infrastructure is provided. Whether using CAT, Komatsu, Volvo, or mixed fleets, and ERPs like SAP or Oracle, the data pipeline normalizes and unifies disparate data sources into a single source of truth."
        },
        fft: {
            title: "FFT signal analysis",
            desc: "Frequency-domain diagnostics for vibration and sensor data.",
            details: "FFT transforms time-series signals into the frequency domain to identify harmonics, bearing defects, imbalance, and resonance. This enables early detection of mechanical issues and precise root-cause analysis."
        },
        automotive: {
            title: "Automotive security (CAN bus)",
            desc: "Threat modeling and anomaly detection for in-vehicle networks.",
            details: "Experience with CAN bus message analysis, ECU communication patterns, and security considerations. Focus on identifying abnormal frames, spoofing risks, and designing monitoring strategies for safer automotive systems."
        }
      }
    },
    stats: { title: "Assets monitored", value: "12k+" },
    cta: { title: "Initiate technical engagement", subtitle: "Discuss your specific project requirements.", btn: "Schedule briefing", status: "Status: Available" },
    footer: { copyright: "© 2024 Panalytics. Independent Technical Consultancy." },
    legal: { close: "Close document" },
    contactForm: {
      title: "Schedule a briefing",
      desc: "Select a date and time slot for the initial consultation.",
      selectDate: "Select Date",
      selectedSlot: "Selected Slot",
      name: "Full Name",
      email: "Email Address",
      message: "Project Details / Message",
      submit: "Confirm Booking",
      success: "Booking confirmed! You have secured your slot.",
      error: "Error sending request. Please try again."
    },
    techStack: {
        title: "Technologies & standards",
        items: [
            { name: "Python / R", icon: Terminal },
            { name: "SQL / NoSQL", icon: Database },
            { name: "TensorFlow", icon: Cpu },
            { name: "AWS / Azure", icon: Cloud },
            { name: "PowerBI / Tableau", icon: BarChart4 }
        ]
    }
  },
  el: {
    common: {
      learnMore: "Μάθετε περισσότερα"
    },
    nav: { methodology: "Μεθοδολογία", background: "Προφίλ", expertise: "Εξειδίκευση", contact: "Επικοινωνία" },
    hero: {
      badge: "Αναλυτής δεδομένων • Μηχανολογικά συστήματα",
      title: "Εξειδικευμένη ανάλυση μηχανολογικών δεδομένων & διαχείρισης στόλου",
      subtitle: "Συνδυάζω 10ετή εμπειρία πεδίου με την επιστήμη δεδομένων. Εστίαση στα συστήματα διαχείρισης στόλου (FMS), στην ανάλυση FFT και στην ανάπτυξη ψηφιακών διδύμων (Digital Twins).",
      primary: "Επικοινωνία",
      secondary: "Βιογραφικό",
      report: {
        name: "Αναφορά_Q4_Βελτιστοποίηση.pdf",
        updated: "Τελευταία ενημέρωση: μόλις τώρα",
        status: "Επιβεβαιωμένο"
      },
      insight: {
        title: "Ευκαιρία βελτιστοποίησης",
        value: "+8.4% Αποδοτικότητα",
        quote: "\"Η ανάλυση δείχνει δυνατότητα μείωσης του χρόνου αδράνειας στο φορτηγό μεταφοράς #42 κατά τις αλλαγές βάρδιας.\""
      }
    },
    bio: {
      title: "Επαγγελματικό υπόβαθρο",
      subtitle: "Εμπειρία που σφυρηλατήθηκε στο πεδίο, τελειοποιημένη με δεδομένα.",
      steps: [
        { 
            title: "10 έτη εμπειρίας", 
            desc: "Μηχανολόγος τεχνίτης & χειριστής μηχανημάτων σε υπόγεια έργα.",
            details: "Εκτενής εμπειρία πεδίου σε υπόγεια μεταλλεία. Υπεύθυνος για τη συντήρηση και λειτουργία βαρέων μηχανημάτων (LHDs, διατρητικά, φορτηγά). Ανέπτυξα βαθιά κατανόηση των μηχανικών βλαβών, των υδραυλικών συστημάτων και των σκληρών συνθηκών του βιομηχανικού περιβάλλοντος."
        },
        { 
            title: "Τεχνική κατάρτιση", 
            desc: "Δίπλωμα μηχανολογίας & οχημάτων. Dispatch field technician.",
            details: "Πιστοποιημένος τεχνικός οχημάτων και μηχανολογικών συστημάτων. Εξειδικευμένη εμπειρία ως τεχνικός πεδίου σε συστήματα Dispatch, με εγκατάσταση και βαθμονόμηση αισθητήρων, επίλυση προβλημάτων τηλεμετρίας και γεφύρωση του χάσματος μεταξύ φυσικού εξοπλισμού και ψηφιακής παρακολούθησης."
        },
        { 
            title: "Φοιτητής CS", 
            desc: "Εστίαση στην επιστήμη δεδομένων, IoT και Digital Twins.",
            details: "Σπουδές στην Πληροφορική για την επισημοποίηση των αναλυτικών δεξιοτήτων. Ακαδημαϊκή εστίαση στη Μηχανική Μάθηση, τη Διαχείριση Βάσεων Δεδομένων και τα πρωτόκολλα Industrial IoT (MQTT, OPC UA). Έρευνα στην εφαρμογή Ψηφιακών Διδύμων για προληπτική συντήρηση. Παράλληλα, ολοκλήρωσα πτυχίο ΙΕΚ στο Web Development, με έμφαση στις βάσεις του front-end και τη δομή UI."
        },
        { 
            title: "Domain expertise", 
            desc: "Κατανόηση της μηχανής πίσω από τα δεδομένα.",
            details: "Η μοναδική αξία: Πέρα από τους αριθμούς, υπάρχει η κατανόηση της μηχανής. Το διπλό αυτό υπόβαθρο επιτρέπει τη διάκριση του 'θορύβου' των αισθητήρων από την πραγματική μηχανική φθορά, προσφέροντας συμπεράσματα που συχνά διαφεύγουν από τους αμιγείς επιστήμονες δεδομένων."
        }
      ]
    },
    methodology: {
      title: "Μεθοδολογία ανάλυσης",
      subtitle: "Από τα ακατέργαστα logs στις στρατηγικές αποφάσεις συντήρησης.",
      steps: [
        { title: "Συλλογή", desc: "Ασφαλής λήψη δεδομένων τηλεμετρίας (SQL/API) από συστήματα διαχείρισης." },
        { title: "Επεξεργασία", desc: "Καθαρισμός, ομαλοποίηση και εντοπισμός outliers με Python (Pandas/NumPy)." },
        { title: "Μοντελοποίηση", desc: "Εφαρμογή αλγορίθμων ML για εντοπισμό μοτίβων μηχανικής φθοράς." },
        { title: "Στρατηγική", desc: "Παράδοση αξιοποιήσιμων αναφορών PDF και χρονοδιαγραμμάτων συντήρησης." }
      ]
    },
    bento: {
      title: "Τομείς εξειδίκευσης",
      subtitle: "Παράδοση αξιοποιήσιμης ευφυΐας, όχι απλώς δεδομένων.",
      cards: {
        predictive: { 
            title: "Προληπτική συντήρηση", 
            desc: "Ανάπτυξη αλγορίθμων για πρόβλεψη βλαβών βάσει ανωμαλιών αισθητήρων.",
            details: "Χρησιμοποιούνται προηγμένοι αλγόριθμοι μηχανικής μάθησης για την ανάλυση δεδομένων αισθητήρων σε πραγματικό χρόνο. Εντοπίζοντας ανεπαίσθητες ανωμαλίες σε δονήσεις, θερμοκρασία και πίεση, μπορούν να προβλεφθούν βλάβες εξαρτημάτων εβδομάδες νωρίτερα, επιτρέποντας προγραμματισμένη συντήρηση και μηδενικό απρόβλεπτο χρόνο διακοπής."
        },
        optimization: { 
            title: "Ανάλυση δεδομένων στόλου", 
            desc: "Εις βάθος ανάλυση FMS και dispatch δεδομένων για βέλτιστη λειτουργία.",
            details: "Η ανάλυση υπερβαίνει την απλή παρακολούθηση. Συσχετίζονται δεδομένα αποστολής, κύκλοι φορτίου και κατανάλωση καυσίμου για τον εντοπισμό σημείων συμφόρησης. Παρέχονται προτάσεις για βελτιστοποίηση διαδρομών, μείωση χρόνου αδράνειας και βελτίωση της συνολικής αποδοτικότητας του στόλου."
        },
        reporting: { 
            title: "Ψηφιακά δίδυμα (Digital Twins)", 
            desc: "Δημιουργία ψηφιακών αντιγράφων για προσομοίωση και ανάλυση σεναρίων.",
            details: "Δημιουργούνται πιστά ψηφιακά αντίγραφα των φυσικών παγίων. Αυτά τα ψηφιακά δίδυμα επιτρέπουν την προσομοίωση σεναρίων λειτουργίας χωρίς ρίσκο, δοκιμές κόπωσης και προγνωστική μοντελοποίηση, επιτρέποντας τη λήψη αποφάσεων βάσει δεδομένων χωρίς διακοπή των πραγματικών λειτουργιών."
        },
        integration: { 
            title: "Ανεξαρτησία συστημάτων", 
            desc: "Συμβατότητα με όλα τα συστήματα τηλεμετρίας OEM & ERP.",
            details: "Παρέχεται άψογη ενσωμάτωση στην υπάρχουσα υποδομή. Είτε χρησιμοποιούνται CAT, Komatsu, Volvo ή μικτοί στόλοι, και ERP όπως SAP ή Oracle, η ροή δεδομένων ομαλοποιεί και ενοποιεί ανόμοιες πηγές δεδομένων σε μία ενιαία πηγή αλήθειας."
        },
        fft: {
            title: "Ανάλυση FFT",
            desc: "Διαγνωστική συχνοτήτων σε δονήσεις και αισθητήρες.",
            details: "Η FFT μετασχηματίζει σήματα χρόνου σε συχνότητες για εντοπισμό αρμονικών, φθορών ρουλεμάν, ανισορροπίας και συντονισμού. Επιτρέπει έγκαιρη διάγνωση και ακριβή ανάλυση αιτίων."
        },
        automotive: {
            title: "Automotive security (CAN bus)",
            desc: "Ανάλυση κινδύνων και ανωμαλιών σε in-vehicle δίκτυα.",
            details: "Εμπειρία σε ανάλυση μηνυμάτων CAN bus, μοτίβων επικοινωνίας ECU και θεμάτων ασφάλειας. Εστίαση σε ανίχνευση ανώμαλων frames, κινδύνους spoofing και στρατηγικές παρακολούθησης για ασφαλέστερα συστήματα."
        }
      }
    },
    stats: { title: "Πάγια υπό επίβλεψη", value: "12k+" },
    cta: { title: "Έναρξη τεχνικής συνεργασίας", subtitle: "Συζητήστε τις απαιτήσεις του έργου σας.", btn: "Αίτημα συνάντησης", status: "Κατάσταση: Διαθέσιμος" },
    footer: { copyright: "© 2024 Panalytics. Ανεξάρτητη Τεχνική Συμβουλευτική." },
    legal: { close: "Κλείσιμο εγγράφου" },
    contactForm: {
      title: "Αίτημα συνάντησης",
      desc: "Επιλέξτε ημερομηνία και ώρα για την αρχική επικοινωνία.",
      selectDate: "Επιλογή ημερομηνίας",
      selectedSlot: "Επιλεγμένο ραντεβού",
      name: "Ονοματεπώνυμο",
      email: "Διεύθυνση Email",
      message: "Λεπτομέρειες έργου / Μήνυμα",
      submit: "Επιβεβαίωση Κράτησης",
      success: "Η κράτηση επιβεβαιώθηκε! Θα λάβετε email με λεπτομέρειες.",
      error: "Σφάλμα αποστολής. Παρακαλώ δοκιμάστε ξανά."
    },
    techStack: {
        title: "Τεχνολογίες & πρότυπα",
        items: [
            { name: "Python / R", icon: Terminal },
            { name: "SQL / NoSQL", icon: Database },
            { name: "TensorFlow", icon: Cpu },
            { name: "AWS / Azure", icon: Cloud },
            { name: "PowerBI / Tableau", icon: BarChart4 }
        ]
    }
  }
};

const chartData = [
  { name: 'W1', kpi: 82 },
  { name: 'W2', kpi: 85 },
  { name: 'W3', kpi: 84 },
  { name: 'W4', kpi: 91 },
  { name: 'W5', kpi: 89 },
  { name: 'W6', kpi: 94 },
];

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [legalContext, setLegalContext] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [detailContext, setDetailContext] = useState(null);
  const [lang, setLang] = useState('el');
  const [bookingSelection, setBookingSelection] = useState({ date: null, time: null });
  const [isSending, setIsSending] = useState(false); 

  const t = translations[lang];
  const bioDetailItems = t.bio.steps;
  const expertiseDetailItems = [
    t.bento.cards.predictive,
    t.bento.cards.integration,
    t.bento.cards.optimization,
    t.bento.cards.reporting,
    t.bento.cards.fft,
    t.bento.cards.automotive,
  ];
  const activeDetailItem = detailContext ? detailContext.items[detailContext.index] : null;
  const activeLegalDoc = legalContext ? legalContext.items[legalContext.index] : null;
  const openDetail = (items, index) => setDetailContext({ items, index });
  const openLegal = (items, index) => setLegalContext({ items, index });
  const goToPrevDetail = () => {
    if (!detailContext) return;
    const nextIndex = (detailContext.index - 1 + detailContext.items.length) % detailContext.items.length;
    setDetailContext({ ...detailContext, index: nextIndex });
  };
  const goToNextDetail = () => {
    if (!detailContext) return;
    const nextIndex = (detailContext.index + 1) % detailContext.items.length;
    setDetailContext({ ...detailContext, index: nextIndex });
  };
  const goToPrevLegal = () => {
    if (!legalContext) return;
    const nextIndex = (legalContext.index - 1 + legalContext.items.length) % legalContext.items.length;
    setLegalContext({ ...legalContext, index: nextIndex });
  };
  const goToNextLegal = () => {
    if (!legalContext) return;
    const nextIndex = (legalContext.index + 1) % legalContext.items.length;
    setLegalContext({ ...legalContext, index: nextIndex });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'el' : 'en');
  const isScrolled = scrollY > 20;

  const navLinks = [
    { id: 'methodology', label: t.nav.methodology },
    { id: 'profile', label: t.nav.background },
    { id: 'expertise', label: t.nav.expertise },
    { id: 'contact', label: t.nav.contact }
  ];
  const infoCardCta = t.common.learnMore;

  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (id === 'contact') {
        setIsContactModalOpen(true);
        setIsMobileMenuOpen(false); 
        return; 
    }
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!bookingSelection.date || !bookingSelection.time) {
        alert(lang === 'en' ? "Please select a date and time slot." : "Παρακαλώ επιλέξτε ημερομηνία και ώρα.");
        return;
    }
    if (!AVAILABLE_SLOTS.includes(bookingSelection.time)) {
        alert(lang === 'en' ? "Invalid time slot selected." : "Μη έγκυρη επιλογή ώρας.");
        return;
    }

    setIsSending(true);
    
    const formData = new FormData(e.target);
    const userName = formData.get('user_name') || (lang === 'en' ? 'Not provided' : 'Δεν δόθηκε');
    const userEmail = formData.get('user_email') || '';
    const message = formData.get('message') || (lang === 'en' ? 'No additional message' : 'Χωρίς επιπλέον μήνυμα');

    // EmailJS template parameters
    const templateParams = {
        to_email: 'bakolasn@gmail.com',
        from_name: userName,
        from_email: userEmail,
        booking_date: bookingSelection.date,
        booking_time: bookingSelection.time,
        message: message,
        reply_to: userEmail,
    };

    try {
        // EmailJS Configuration
        // Get these credentials from https://www.emailjs.com/
        // Create account -> Add Email Service (Gmail) -> Create Email Template
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

        // Send email via EmailJS
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

        // Save booking to localStorage
        const stored = safeParseBookings(localStorage.getItem('panalytics_bookings'));
        const dateKey = bookingSelection.date;
        if (!stored[dateKey]) stored[dateKey] = [];
        stored[dateKey].push(bookingSelection.time);
        localStorage.setItem('panalytics_bookings', JSON.stringify(stored));

        alert(t.contactForm.success);
        setIsContactModalOpen(false);
        setBookingSelection({ date: null, time: null });
        if (e.target && e.target.reset) e.target.reset();
    } catch (error) {
        console.error('EmailJS error:', error);
        alert(t.contactForm.error);
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#FCD116] selection:text-black overflow-x-hidden text-gray-200 font-mono relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        body, html { font-family: 'JetBrains Mono', monospace; scroll-behavior: smooth; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-in.fade-in { animation: fadeIn 0.3s ease-out forwards; }

        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }
        .animate-scroll {
            animation: scroll 30s linear infinite;
        }
        .group:hover .animate-scroll {
            animation-play-state: paused;
        }
      `}</style>

      {/* --- Technical Grid Background Pattern --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff08 1px, transparent 1px), linear-gradient(to bottom, #ffffff08 1px, transparent 1px)',
          backgroundSize: '32px 32px'
      }}></div>

      {/* --- Contact Form Modal --- */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#121212] border border-white/10 w-full max-w-4xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                <button 
                    onClick={() => setIsContactModalOpen(false)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-[#FCD116] transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="md:w-5/12 bg-[#0F0F0F] border-r border-white/10 p-6 md:p-8 flex flex-col">
                    {/* Removed uppercase here as requested */}
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm tracking-wide">
                        <Calendar size={16} className="text-[#FCD116]" /> {t.contactForm.selectDate}
                    </h3>
                    <div className="flex-1">
                        <BookingCalendar onSelectSlot={(date, time) => setBookingSelection({ date, time })} lang={lang} />
                    </div>
                    {bookingSelection.date && bookingSelection.time && (
                        <div className="mt-4 p-3 bg-[#FCD116]/10 border border-[#FCD116]/20 rounded-lg">
                            <p className="text-xs text-[#FCD116] font-bold tracking-wide">{t.contactForm.selectedSlot}</p>
                            <p className="text-white text-sm mt-1">{bookingSelection.date} @ {bookingSelection.time}</p>
                        </div>
                    )}
                </div>

                <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">{t.contactForm.title}</h2>
                        <p className="text-sm text-zinc-400">{t.contactForm.desc}</p>
                    </div>
                    
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 ml-1">
                                {t.contactForm.email} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                <input 
                                    type="email" 
                                    name="user_email" 
                                    required 
                                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#FCD116] transition-colors placeholder:text-zinc-700" 
                                    placeholder={lang === 'en' ? 'john@example.com' : 'onoma@paradeigma.gr'} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 ml-1">{t.contactForm.name} <span className="text-zinc-600 text-[10px]">({lang === 'en' ? 'optional' : 'προαιρετικό'})</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                <input 
                                    type="text" 
                                    name="user_name" 
                                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#FCD116] transition-colors placeholder:text-zinc-700" 
                                    placeholder={lang === 'en' ? 'John Doe' : 'Γιάννης Παπαδόπουλος'} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 ml-1">
                                {t.contactForm.message} <span className="text-zinc-600 text-[10px]">({lang === 'en' ? 'optional' : 'προαιρετικό'})</span>
                            </label>
                            <textarea 
                                name="message" 
                                rows="3" 
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-[#FCD116] transition-colors placeholder:text-zinc-700 resize-none" 
                                placeholder={lang === 'en' ? 'Any additional details...' : 'Τυχόν επιπλέον λεπτομέρειες...'}
                            ></textarea>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={!bookingSelection.time || isSending}
                            className={`w-full font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 mt-4 shadow-lg
                                ${bookingSelection.time && !isSending
                                    ? 'bg-[#FCD116] text-black hover:bg-[#FFE066] cursor-pointer' 
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                }`
                            }
                        >
                            {isSending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {bookingSelection.time 
                                        ? t.contactForm.submit 
                                        : bookingSelection.date 
                                        ? (lang === 'en' ? 'Select time' : 'Επιλέξτε ώρα')
                                        : (lang === 'en' ? 'Select date, then select time' : 'Επιλέξτε ημέρα, μετά επιλέξτε ώρα')
                                    } 
                                    {bookingSelection.time && <CheckCircle className="w-4 h-4" />}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      )}

      {/* --- Detail Modal --- */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative p-6 md:p-10">
                <button 
                    onClick={() => setDetailContext(null)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-[#FCD116] transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                <button
                    onClick={goToPrevDetail}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#FCD116] transition-colors"
                    aria-label={lang === 'en' ? 'Previous card' : 'Προηγούμενη κάρτα'}
                >
                    <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                    onClick={goToNextDetail}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#FCD116] transition-colors"
                    aria-label={lang === 'en' ? 'Next card' : 'Επόμενη κάρτα'}
                >
                    <ChevronRight className="w-7 h-7" />
                </button>
                <div className="mb-6 flex items-center gap-4 text-[#FCD116] px-8 md:px-10">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <FileSearch className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                          {activeDetailItem.title}
                      </h2>
                </div>
                <div className="text-zinc-300 space-y-4 text-sm leading-relaxed font-sans border-t border-white/5 pt-4 px-8 md:px-10">
                    {activeDetailItem.details}
                </div>
            </div>
        </div>
      )}

      {/* --- Legal Modal --- */}
      {activeLegalDoc && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#121212] border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl relative p-6 md:p-12">
                <button 
                    onClick={() => setLegalContext(null)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-[#FCD116] transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                <button
                    onClick={goToPrevLegal}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#FCD116] transition-colors"
                    aria-label={lang === 'en' ? 'Previous document' : 'Προηγούμενο έγγραφο'}
                >
                    <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                    onClick={goToNextLegal}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#FCD116] transition-colors"
                    aria-label={lang === 'en' ? 'Next document' : 'Επόμενο έγγραφο'}
                >
                    <ChevronRight className="w-7 h-7" />
                </button>
                <div className="mb-6 flex items-center gap-3 text-[#FCD116] px-8 md:px-10">
                      {React.createElement(activeLegalDoc.icon, { size: 24 })}
                      <h2 className="text-xl font-bold tracking-tight text-white">
                          {lang === 'en' ? activeLegalDoc.titleEn : activeLegalDoc.titleEl}
                      </h2>
                </div>
                <div className="text-zinc-400 space-y-4 text-sm leading-relaxed whitespace-pre-line font-sans px-8 md:px-10">
                    {lang === 'en' ? activeLegalDoc.contentEn : activeLegalDoc.contentEl}
                </div>
                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                    <button 
                        onClick={() => setLegalContext(null)}
                        className="text-zinc-500 hover:text-white text-xs font-medium transition-colors"
                    >
                        {t.legal.close}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- Subtle Background Gradients --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FCD116]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3"></div>
      </div>

      {/* --- Rotating Gears Background --- */}
      <div className="fixed bottom-[-100px] right-[-100px] z-0 opacity-[0.03] pointer-events-none">
        <div style={{ transform: `rotate(${scrollY * 0.2}deg)` }} className="transition-transform duration-[50ms] ease-linear">
           <Cog size={500} strokeWidth={0.5} />
        </div>
      </div>
       <div className="fixed bottom-[150px] right-[200px] z-0 opacity-[0.02] pointer-events-none">
        <div style={{ transform: `rotate(-${scrollY * 0.3}deg)` }} className="transition-transform duration-[50ms] ease-linear">
           <Settings size={300} strokeWidth={0.5} />
        </div>
      </div>

      {/* --- Navigation --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#050505]/90 backdrop-blur-md border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo className="text-lg md:text-2xl lg:text-3xl" size="lg" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-8">
              {navLinks.map((item) => (
                <a 
                    key={item.id} 
                    href={`#${item.id}`} 
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="text-sm font-medium text-white hover:text-[#FCD116] transition-colors"
                >
                    {item.label}
                </a>
              ))}
            </div>
            <div className="h-5 w-px bg-white/10" />
            <button onClick={toggleLang} className="text-sm font-medium text-white hover:text-[#FCD116] flex items-center gap-1.5 transition-colors">
              <Globe className="w-4 h-4" /> {lang.toUpperCase()}
            </button>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/nick-g-bakolas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white hover:text-[#FCD116] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/bakolasn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-white hover:text-[#FCD116] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Mobile Toggles */}
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={toggleLang} className="text-xs font-bold text-white">{lang.toUpperCase()}</button>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/nick-g-bakolas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white hover:text-[#FCD116] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/bakolasn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-white hover:text-[#FCD116] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-[#0A0A0A] transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden flex flex-col pt-24 px-6`}>
        {navLinks.map((item) => (
            <a 
                key={item.id} 
                href={`#${item.id}`} 
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-xl font-medium text-white border-b border-white/10 py-4 hover:text-[#FCD116]"
            >
            {item.label}
            </a>
        ))}
        <Button className="mt-8 w-full" onClick={(e) => handleNavClick(e, 'contact')}>{t.hero.primary}</Button>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left order-1 lg:order-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FCD116] text-[10px] md:text-xs font-medium backdrop-blur-sm mx-auto lg:mx-0">
              <Database className="w-3.5 h-3.5" /> {t.hero.badge}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight break-words" style={{ overflowWrap: 'break-word' }}>
              {t.hero.title}
            </h1>
            <p className="text-base md:text-lg text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light break-words" style={{ overflowWrap: 'break-word' }}>
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 w-full">
              <Button onClick={() => setIsContactModalOpen(true)}>
                {t.hero.primary} <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="secondary" onClick={(e) => handleNavClick(e, 'profile')}>
                {t.hero.secondary}
              </Button>
            </div>
            
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-white/5 mt-8">
               <div>
                  <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">{t.stats.value}</p>
                  <p className="text-xs text-zinc-500 font-medium mt-1">{t.stats.title}</p>
               </div>
               <div className="h-8 w-px bg-white/10"></div>
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1A1A1A] border-2 border-[#0A0A0A] flex items-center justify-center text-[8px] md:text-[9px] text-zinc-500 font-bold shadow-lg">
                        {i === 1 ? 'CAT' : i === 2 ? 'JCB' : i === 3 ? 'VOL' : 'KOM'}
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Abstract Data Visualization */}
          <div className="relative order-2 lg:order-2 min-w-0 w-full">
             <div className="absolute -inset-1 bg-gradient-to-r from-[#FCD116]/20 to-transparent opacity-30 blur-3xl rounded-3xl"></div>
             <div className="relative bg-[#121212]/80 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
                {/* Header of "Software" */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-white/5 rounded-lg text-[#FCD116] shrink-0"><FileText className="w-4 h-4" /></div>
                        <div className="min-w-0">
                            <span className="block font-medium text-white text-sm truncate">{t.hero.report.name}</span>
                            <span className="block text-[10px] text-zinc-500">{t.hero.report.updated}</span>
                        </div>
                    </div>
                    <div className="font-mono text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1.5 w-fit shrink-0 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                        <span>{t.hero.report.status}</span>
                    </div>
                </div>

                {/* Live Chart - fixed size, same in all languages */}
                <div className="h-48 md:h-64 min-h-[12rem] md:min-h-[16rem] w-full mb-6">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gradLoad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FCD116" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FCD116" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525B" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                      />
                      <Area type="monotone" dataKey="kpi" stroke="#FCD116" strokeWidth={2} fill="url(#gradLoad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Insight Snippet */}
                <div className="bg-white/5 rounded-xl p-4 text-xs space-y-2 text-zinc-400 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[#FCD116] font-medium flex items-center gap-1.5"><Zap className="w-3 h-3" /> {t.hero.insight.title}</span>
                        <span className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px]">{t.hero.insight.value}</span>
                    </div>
                    <p className="leading-relaxed">
                        {t.hero.insight.quote}
                    </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- Tech Stack Strip (Seamless Loop) --- */}
      <div className="w-full border-y border-white/5 bg-[#080808]/50 backdrop-blur-sm overflow-hidden group">
          <div className="py-8 relative">
              <p className="text-center text-xs text-zinc-500 mb-6 font-medium z-10 relative tracking-wide">{t.techStack.title}</p>
              
              {/* Gradient Masks */}
              <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

              {/* Infinite Scroll Wrapper - Dual Render */}
              <div className="flex overflow-hidden">
                  <div className="flex min-w-full shrink-0 animate-scroll gap-16 items-center justify-around px-8">
                      {t.techStack.items.map((tech, idx) => (
                          <div key={idx} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
                              {React.createElement(tech.icon, { className: "w-6 h-6 text-zinc-500 hover:text-[#FCD116] transition-colors" })}
                              <span className="text-sm font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap">{tech.name}</span>
                          </div>
                      ))}
                  </div>
                  {/* Duplicate List for Seamless Loop */}
                  <div className="flex min-w-full shrink-0 animate-scroll gap-16 items-center justify-around px-8" aria-hidden="true">
                      {t.techStack.items.map((tech, idx) => (
                          <div key={`dup-${idx}`} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
                              {React.createElement(tech.icon, { className: "w-6 h-6 text-zinc-500 hover:text-[#FCD116] transition-colors" })}
                              <span className="text-sm font-mono text-zinc-400 hover:text-white transition-colors whitespace-nowrap">{tech.name}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* --- Methodology Section --- */}
      <section id="methodology" className="py-16 md:py-24 bg-[#0A0A0A] relative">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16 md:mb-20">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">{t.methodology.title}</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto text-sm">{t.methodology.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FCD116]/20 to-transparent border-t border-dashed border-white/10"></div>
                
                {/* Mobile Connecting Line (Vertical) */}
                <div className="md:hidden absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#FCD116]/10 to-transparent border-l border-dashed border-white/10 -translate-x-1/2"></div>

                {t.methodology.steps.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center text-center group bg-[#0A0A0A] md:bg-transparent py-4 md:py-0">
                         {/* Process Node */}
                         <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center mb-4 md:mb-8 shadow-xl group-hover:-translate-y-2 transition-transform duration-300 ring-1 ring-white/5">
                                {idx === 0 && <Database className="w-6 h-6 md:w-8 md:h-8 text-[#FCD116]" />}
                                {idx === 1 && <Binary className="w-6 h-6 md:w-8 md:h-8 text-[#FCD116]" />}
                                {idx === 2 && <Cpu className="w-6 h-6 md:w-8 md:h-8 text-[#FCD116]" />}
                                {idx === 3 && <Zap className="w-6 h-6 md:w-8 md:h-8 text-[#FCD116]" />}
                            </div>
                            {/* Step Number Badge */}
                            <div className="absolute -top-3 -right-3 w-6 h-6 md:w-7 md:h-7 bg-[#FCD116] text-black font-bold text-[10px] md:text-xs flex items-center justify-center rounded-full border-4 border-[#0A0A0A]">
                                {idx + 1}
                            </div>
                        </div>

                        <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">{step.title}</h3>
                        <p className="text-xs md:text-sm text-zinc-500 px-2 leading-relaxed max-w-xs">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- Bio / Background Section (Using Unified InfoCard) --- */}
      <section id="profile" className="py-16 md:py-24 bg-[#050505]">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 border-b border-white/5 pb-8">
                 <div className="max-w-xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">{t.bio.title}</h2>
                    <p className="text-zinc-400 text-sm">{t.bio.subtitle}</p>
                 </div>
                 <div className="hidden md:block">
                    <div className="h-1 w-20 bg-[#FCD116] rounded-full"></div>
                 </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 relative">
                {t.bio.steps.map((step, idx) => {
                    const icons = [HardHat, Wrench, GraduationCap, UserCheck];
                    return (
                        <InfoCard 
                            key={idx}
                            icon={icons[idx]}
                            title={step.title}
                            description={step.desc}
                            onClick={() => openDetail(bioDetailItems, idx)}
                            ctaLabel={infoCardCta}
                        />
                    );
                })}
            </div>
        </div>
      </section>

      {/* --- Bento Grid Competencies (Using Unified InfoCard) --- */}
      <section id="expertise" className="py-16 md:py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
             <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">{t.bento.title}</h2>
                <p className="text-zinc-400 text-sm">{t.bento.subtitle}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard 
                    icon={AlertTriangle} 
                    title={t.bento.cards.predictive.title} 
                    description={t.bento.cards.predictive.desc}
                    onClick={() => openDetail(expertiseDetailItems, 0)}
                    ctaLabel={infoCardCta}
                    className="lg:col-span-2" 
                />
                 <InfoCard 
                    icon={Settings} 
                    title={t.bento.cards.integration.title} 
                    description={t.bento.cards.integration.desc}
                    onClick={() => openDetail(expertiseDetailItems, 1)}
                    ctaLabel={infoCardCta}
                    className="lg:col-span-1" 
                />
                 <InfoCard 
                    icon={BarChart2} 
                    title={t.bento.cards.optimization.title} 
                    description={t.bento.cards.optimization.desc}
                    onClick={() => openDetail(expertiseDetailItems, 2)}
                    ctaLabel={infoCardCta}
                    className="lg:col-span-1" 
                />
                 <InfoCard 
                    icon={Layers} 
                    title={t.bento.cards.reporting.title} 
                    description={t.bento.cards.reporting.desc}
                    onClick={() => openDetail(expertiseDetailItems, 3)}
                    ctaLabel={infoCardCta}
                    className="lg:col-span-2" 
                />
                <InfoCard 
                    icon={Activity} 
                    title={t.bento.cards.fft.title} 
                    description={t.bento.cards.fft.desc}
                    onClick={() => openDetail(expertiseDetailItems, 4)}
                    ctaLabel={infoCardCta}
                    className="lg:col-span-1" 
                />
                <InfoCard 
                    icon={Shield} 
                    title={t.bento.cards.automotive.title} 
                    description={t.bento.cards.automotive.desc}
                    onClick={() => openDetail(expertiseDetailItems, 5)}
                    ctaLabel={infoCardCta}
                    className="lg:col-span-2" 
                />
             </div>
        </div>
      </section>

      {/* --- Redesigned Professional CTA --- */}
      <section id="contact" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#050505] pointer-events-none"></div>
         
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto bg-[#121212] p-8 md:p-16 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FCD116]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FCD116]/10 transition-colors duration-700"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-emerald-500 text-[10px] font-bold tracking-wider">{t.cta.status}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                            {t.cta.title}
                        </h2>
                        <p className="text-zinc-400 text-sm max-w-md mx-auto md:mx-0">
                            {t.cta.subtitle}
                        </p>
                    </div>
                    
                    <div className="flex-shrink-0 w-full md:w-auto">
                        <Button className="px-8 py-4 text-sm shadow-xl hover:scale-105 w-full md:w-auto" onClick={() => setIsContactModalOpen(true)}>
                            {t.cta.btn} <MessageSquare className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#050505] pt-12 pb-12 border-t border-white/5">
         <div className="container mx-auto px-6 flex flex-col items-center gap-8">
             {/* Contact & Social Links */}
             <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <a 
                    href="mailto:bakolasn@gmail.com"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsContactModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-zinc-400 hover:text-[#FCD116] text-sm transition-colors group"
                >
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>bakolasn@gmail.com</span>
                </a>
                <a 
                    href="https://www.linkedin.com/in/nick-g-bakolas" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-zinc-400 hover:text-[#FCD116] text-sm transition-colors group"
                >
                    <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>LinkedIn</span>
                </a>
                <a 
                    href="https://github.com/bakolasn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-zinc-400 hover:text-[#FCD116] text-sm transition-colors group"
                >
                    <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>GitHub</span>
                </a>
             </div>

             <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                 {legalDocsContent.map((doc, idx) => (
                     <button
                        key={doc.id}
                        onClick={() => openLegal(legalDocsContent, idx)}
                        className="text-zinc-500 hover:text-[#FCD116] text-xs font-medium transition-colors cursor-pointer"
                      >
                        {lang === 'en' ? doc.titleEn : doc.titleEl}
                      </button>
                 ))}
             </div>
             <div className="flex items-baseline gap-2 opacity-30">
                <Logo className="text-base md:text-lg" size="sm" />
                <span className="text-zinc-500 text-[10px] tracking-widest font-medium leading-none">
                    © {new Date().getFullYear()}
                </span>
                <a
                    href="https://www.pcreators.gr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 text-[10px] tracking-widest font-medium leading-none hover:text-[#FCD116] transition-colors"
                >
                    Powered by{' '}
                    <span className="text-[#3B82F6]">P</span>
                    <span className="text-[#3B82F6] font-normal">_</span>
                    <span className="text-[#3B82F6]">Creators</span>
                    <span className="text-[#3B82F6]">.</span>
                </a>
             </div>
         </div>
      </footer>
    </div>
  );
};

export default App;