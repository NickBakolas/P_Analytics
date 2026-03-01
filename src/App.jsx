import React, { useState, useEffect } from 'react';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowRight, BarChart2, Activity, Shield, Menu, X, CheckCircle, ChevronRight, Settings, AlertTriangle, Globe, Database, Cpu, FileText, UserCheck, Wrench, HardHat, GraduationCap, Layers, Cog, Binary, Zap, MessageSquare, Cookie, Scale, ArrowUpRight, User, Mail, Cloud, Terminal, BarChart4, FileSearch, Calendar, Clock, ChevronLeft, Loader2, Linkedin, Github } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { client } from './lib/sanity'; // Εισαγωγή του Sanity Client

// --- Brand Colors & Assets ---
const BrandColors = {
  yellow: '#FCD116', 
  darkGrey: '#0A0A0A', 
  surface: '#121212', 
  textLight: '#FAFAFA', 
  textGrey: '#A1A1AA', 
  border: 'rgba(255, 255, 255, 0.06)' 
};

// ... (Τα components Logo, Button, InfoCard, BookingCalendar παραμένουν ίδια)
const Logo = ({ className = "", size = "lg" }) => {
  const handleClick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const baseFontSize = size === "sm" ? "1rem" : size === "md" ? "1.5rem" : "2rem";
  const fontSize = className && className.includes('text-') ? undefined : baseFontSize;
  return (
    <div onClick={handleClick} className={className} style={{ fontFamily: "'Space Grotesk', sans-serif", ...(fontSize && { fontSize }), fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'baseline', cursor: 'pointer', transition: 'opacity 0.2s ease' }}>
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
  return (<button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>{children}</button>);
};

const InfoCard = ({ icon: Icon, title, description, onClick, className = "", ctaLabel = "Learn more" }) => (
  <div onClick={onClick} className={`group relative p-6 md:p-8 rounded-2xl bg-[#121212]/60 border border-white/5 hover:border-[#FCD116]/30 hover:bg-[#121212]/90 backdrop-blur-md transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full ${className}`}>
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"><ArrowUpRight className="w-5 h-5 text-[#FCD116]" /></div>
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#FCD116] transition-colors duration-300 border border-white/5 group-hover:border-[#FCD116] shrink-0"><Icon className="w-6 h-6 text-[#FCD116] group-hover:text-black transition-colors" /></div>
    <div className="flex-1 flex flex-col"><h3 className="text-lg md:text-xl font-semibold text-white mb-3 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{title}</h3><p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{description}</p></div>
    <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs text-[#FCD116] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium tracking-wider">{ctaLabel} <ArrowRight className="w-3 h-3 ml-1" /></div>
  </div>
);

// --- (Υπόλοιπα helper functions & translations παραμένουν ως είχαν) ---
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
const safeParseBookings = (value) => { if (!value) return {}; try { const parsed = JSON.parse(value); return parsed && typeof parsed === 'object' ? parsed : {}; } catch { return {}; } };
const AVAILABLE_SLOTS = ["17:00", "18:00", "19:00", "20:00"];

const BookingCalendar = ({ onSelectSlot, lang }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookedSlots, setBookedSlots] = useState({});
    useEffect(() => { const stored = safeParseBookings(localStorage.getItem('panalytics_bookings')); if (Object.keys(stored).length) { setBookedSlots(stored); } }, []);
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); 
    const canGoToPrevMonth = () => { const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1); const today = new Date(); today.setHours(0, 0, 0, 0); const lastDayOfPrevMonth = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0); lastDayOfPrevMonth.setHours(0, 0, 0, 0); return lastDayOfPrevMonth >= today; };
    const handlePrevMonth = () => { if (!canGoToPrevMonth()) return; setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); };
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleDateClick = (day) => { const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day); const today = new Date(); today.setHours(0, 0, 0, 0); const clickedDate = new Date(newDate); clickedDate.setHours(0, 0, 0, 0); if (clickedDate < today) return; setSelectedDate(newDate); };
    const isDateDisabled = (day) => { const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day); const today = new Date(); today.setHours(0, 0, 0, 0); const checkDate = new Date(date); checkDate.setHours(0, 0, 0, 0); return checkDate < today; };
    const handleSlotClick = (time) => { if (!selectedDate) return; const dateKey = selectedDate.toISOString().split('T')[0]; onSelectSlot(dateKey, time); };
    const isSlotBooked = (time) => { if (!selectedDate) return false; const dateKey = selectedDate.toISOString().split('T')[0]; return bookedSlots[dateKey]?.includes(time); };
    return ( <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/10 h-full flex flex-col"> <div className="flex justify-between items-center mb-4"> <button onClick={handlePrevMonth} disabled={!canGoToPrevMonth()} className={`p-1 transition-colors ${canGoToPrevMonth() ? 'hover:text-[#FCD116] cursor-pointer' : 'opacity-30 cursor-not-allowed text-zinc-600'}`} > <ChevronLeft size={16} /> </button> <span className="font-bold text-sm tracking-widest"> {currentDate.toLocaleString(lang === 'en' ? 'default' : 'el-GR', { month: 'long', year: 'numeric' })} </span> <button onClick={handleNextMonth} className="p-1 hover:text-[#FCD116] transition-colors cursor-pointer"><ChevronRight size={16} /></button> </div> <div className="grid grid-cols-7 gap-1 mb-2 text-center"> {(lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ', 'Κ']).map((d, i) => ( <div key={i} className="text-[10px] text-zinc-600 font-bold">{d}</div> ))} </div> <div className="grid grid-cols-7 gap-1 mb-6"> {blanks.map((_, i) => <div key={`blank-${i}`} className="h-8"></div>)} {days.map(day => { const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day); const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString(); const isToday = new Date().toDateString() === date.toDateString(); const isDisabled = isDateDisabled(day); return ( <button key={day} onClick={() => handleDateClick(day)} disabled={isDisabled} className={`h-8 rounded-md text-xs font-medium transition-all duration-200 ${isDisabled ? 'opacity-30 cursor-not-allowed text-zinc-600' : 'cursor-pointer'} ${isSelected ? 'bg-[#FCD116] text-black shadow-[0_0_10px_#FCD116]' : isDisabled ? '' : 'hover:bg-white/10 text-zinc-400'} ${isToday && !isSelected && !isDisabled ? 'border border-[#FCD116] text-[#FCD116]' : ''} `} > {day} </button> ); })} </div> <div className="flex-1 border-t border-white/10 pt-4"> <p className="text-xs text-zinc-500 mb-3 flex items-center gap-2"> <Clock size={12} /> {lang === 'en' ? 'Available time slots' : 'Διαθέσιμες ώρες'} </p> <div className="grid grid-cols-2 gap-2"> {AVAILABLE_SLOTS.map(time => { const booked = isSlotBooked(time); const isDisabled = !selectedDate || booked; return ( <button key={time} disabled={isDisabled} onClick={() => handleSlotClick(time)} className={`py-2 rounded text-[10px] font-mono border transition-all ${booked ? 'bg-red-500/10 border-red-500/20 text-red-500 cursor-not-allowed line-through' : isDisabled ? 'border-white/5 text-zinc-600 cursor-not-allowed opacity-50' : 'border-white/10 hover:border-[#FCD116] hover:text-[#FCD116] text-zinc-300 cursor-pointer' } `} > {time} </button> ) })} </div> </div> </div> );
};

// --- (Translations & Static Data - όπως τα είχες) ---
const translations = {
  en: {
    common: { learnMore: "Learn more" },
    nav: { methodology: "Methodology", background: "Profile", expertise: "Expertise", contact: "Contact" },
    hero: { badge: "Data Analyst • Mechanical & Fleet Systems", title: "Specialized analysis for fleet management & mechanical data", subtitle: "Bridging 10 years of hands-on mechanical experience with data science. Focused on Fleet Management Systems (FMS), FFT signal analysis, and the development of Digital Twins.", primary: "Initiate contact", secondary: "View profile", report: { name: "Report_Q4_Opt.pdf", updated: "Last updated: Just now", status: "Verified" }, insight: { title: "Optimization opportunity", value: "+8.4% Efficiency", quote: "\"Analysis indicates idle time reduction potential in Haul Truck #42 during shift changeovers.\"" } },
    bio: { title: "Professional background", subtitle: "Experience forged in the depths, refined by data.", steps: [ { title: "10 Years field experience", desc: "Mechanical technician & underground mining operator.", details: "Extensive hands-on experience in underground mining operations." }, { title: "Technical diploma", desc: "Machinery & automotive systems.", details: "Certified technician." }, { title: "CS student", desc: "Data Science focus.", details: "Currently pursuing a degree in CS." }, { title: "Domain expert", desc: "Understanding the machine.", details: "Dual background." } ] },
    bento: { title: "Core competencies", subtitle: "Delivering actionable intelligence.", cards: { predictive: { title: "Predictive maintenance", desc: "Algorithm development." }, integration: { title: "System agnostic", desc: "Compatible with all OEMs." }, optimization: { title: "Fleet data analysis", desc: "Operational efficiency." }, reporting: { title: "Digital Twins", desc: "Virtual replicas." }, fft: { title: "FFT signal analysis", desc: "Frequency diagnostics." }, automotive: { title: "Automotive security", desc: "CAN bus anomaly detection." } } },
    stats: { title: "Assets monitored", value: "12k+" },
    cta: { title: "Initiate technical engagement", subtitle: "Discuss requirements.", btn: "Schedule briefing", status: "Status: Available" },
    footer: { copyright: "© 2026 Panalytics. Independent Technical Consultancy." },
    legal: { close: "Close document" },
    contactForm: { title: "Schedule a briefing", desc: "Select a date.", selectDate: "Select Date", selectedSlot: "Selected Slot", name: "Full Name", email: "Email Address", message: "Message", submit: "Confirm Booking", success: "Booking confirmed!", error: "Error sending request." },
    techStack: { title: "Technologies & standards", items: [ { name: "Python / R", icon: Terminal }, { name: "SQL / NoSQL", icon: Database }, { name: "TensorFlow", icon: Cpu }, { name: "AWS / Azure", icon: Cloud }, { name: "PowerBI / Tableau", icon: BarChart4 } ] }
  },
  el: {
    common: { learnMore: "Μάθετε περισσότερα" },
    nav: { methodology: "Μεθοδολογία", background: "Προφίλ", expertise: "Εξειδίκευση", contact: "Επικοινωνία" },
    hero: { badge: "Αναλυτής δεδομένων • Μηχανολογικά συστήματα", title: "Εξειδικευμένη ανάλυση μηχανολογικών δεδομένων & διαχείρισης στόλου", subtitle: "Συνδυάζω 10ετή εμπειρία πεδίου με την επιστήμη δεδομένων. Εστίαση στα συστήματα διαχείρισης στόλου (FMS), στην ανάλυση FFT και στην ανάπτυξη ψηφιακών διδύμων (Digital Twins).", primary: "Επικοινωνία", secondary: "Βιογραφικό", report: { name: "Αναφορά_Q4_Βελτιστοποίηση.pdf", updated: "Τελευταία ενημέρωση: μόλις τώρα", status: "Επιβεβαιωμένο" }, insight: { title: "Ευκαιρία βελτιστοποίησης", value: "+8.4% Αποδοτικότητα", quote: "\"Η ανάλυση δείχνει δυνατότητα μείωσης του χρόνου αδράνειας στο φορτηγό μεταφοράς #42 κατά τις αλλαγές βάρδιας.\"" } },
    bio: { title: "Επαγγελματικό υπόβαθρο", subtitle: "Εμπειρία που σφυρηλατήθηκε στο πεδίο, τελειοποιημένη με δεδομένα.", steps: [ { title: "10 έτη εμπειρίας", desc: "Μηχανολόγος τεχνίτης & χειριστής μηχανημάτων.", details: "Εκτενής εμπειρία πεδίου σε υπόγεια μεταλλεία." }, { title: "Τεχνική κατάρτιση", desc: "Δίπλωμα μηχανολογίας & οχημάτων.", details: "Πιστοποιημένος τεχνικός." }, { title: "Φοιτητής CS", desc: "Εστίαση στην επιστήμη δεδομένων.", details: "Σπουδές στην Πληροφορική." }, { title: "Domain expertise", desc: "Κατανόηση της μηχανής.", details: "Η μοναδική αξία." } ] },
    bento: { title: "Τομείς εξειδίκευσης", subtitle: "Παράδοση αξιοποιήσιμης ευφυΐας.", cards: { predictive: { title: "Προληπτική συντήρηση", desc: "Ανάπτυξη αλγορίθμων." }, integration: { title: "Ανεξαρτησία συστημάτων", desc: "Συμβατότητα με όλα τα OEM." }, optimization: { title: "Ανάλυση δεδομένων στόλου", desc: "Βέλτιστη λειτουργία." }, reporting: { title: "Ψηφιακά δίδυμα", desc: "Προσομοίωση σεναρίων." }, fft: { title: "Ανάλυση FFT", desc: "Διαγνωστική συχνοτήτων." }, automotive: { title: "Automotive security", desc: "Ανάλυση CAN bus." } } },
    stats: { title: "Πάγια υπό επίβλεψη", value: "12k+" },
    cta: { title: "Έναρξη τεχνικής συνεργασίας", subtitle: "Συζητήστε τις απαιτήσεις.", btn: "Αίτημα συνάντησης", status: "Κατάσταση: Διαθέσιμος" },
    footer: { copyright: "© 2026 Panalytics. Ανεξάρτητη Τεχνική Συμβουλευτική." },
    legal: { close: "Κλείσιμο εγγράφου" },
    contactForm: { title: "Αίτημα συνάντησης", desc: "Επιλέξτε ημερομηνία.", selectDate: "Επιλογή ημερομηνίας", selectedSlot: "Επιλεγμένο ραντεβού", name: "Ονοματεπώνυμο", email: "Email", message: "Μήνυμα", submit: "Επιβεβαίωση", success: "Η κράτηση επιβεβαιώθηκε!", error: "Σφάλμα αποστολής." },
    techStack: { title: "Τεχνολογίες & πρότυπα", items: [ { name: "Python / R", icon: Terminal }, { name: "SQL / NoSQL", icon: Database }, { name: "TensorFlow", icon: Cpu }, { name: "AWS / Azure", icon: Cloud }, { name: "PowerBI / Tableau", icon: BarChart4 } ] }
  }
};

const chartData = [{ name: 'W1', kpi: 82 }, { name: 'W2', kpi: 85 }, { name: 'W3', kpi: 84 }, { name: 'W4', kpi: 91 }, { name: 'W5', kpi: 89 }, { name: 'W6', kpi: 94 }];

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [legalContext, setLegalContext] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [detailContext, setDetailContext] = useState(null);
  const [lang, setLang] = useState('el');
  const [bookingSelection, setBookingSelection] = useState({ date: null, time: null });
  const [isSending, setIsSending] = useState(false); 

  // --- ΣΥΝΔΕΣΗ ΜΕ SANITY ---
  const [dynamicBio, setDynamicBio] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "bio"] | order(order asc)`)
      .then((data) => setDynamicBio(data))
      .catch(console.error);
  }, []);
  // -------------------------

  const t = translations[lang];
  const infoCardCta = t.common.learnMore;
  
  // Υπολογισμός των βιογραφικών στοιχείων (Sanity ή Static)
  const displayBioSteps = dynamicBio.length > 0 ? dynamicBio : t.bio.steps;

  const openDetail = (items, index) => setDetailContext({ items, index });
  const goToPrevDetail = () => { if (!detailContext) return; const nextIndex = (detailContext.index - 1 + detailContext.items.length) % detailContext.items.length; setDetailContext({ ...detailContext, index: nextIndex }); };
  const goToNextDetail = () => { if (!detailContext) return; const nextIndex = (detailContext.index + 1) % detailContext.items.length; setDetailContext({ ...detailContext, index: nextIndex }); };

  useEffect(() => {
    const handleScroll = () => { setScrollY(window.scrollY); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'el' : 'en');
  const isScrolled = scrollY > 20;

  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (id === 'contact') { setIsContactModalOpen(true); return; }
    const element = document.getElementById(id);
    if (element) { element.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!bookingSelection.date || !bookingSelection.time) { alert("Please select a slot."); return; }
    setIsSending(true);
    // ... (Υπόλοιπο EmailJS logic)
    setIsSending(false);
    setIsContactModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#FCD116] selection:text-black overflow-x-hidden text-gray-200 font-mono relative">
      {/* Backgrounds & Navigation (όπως τα είχες) */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#050505]/90 backdrop-blur-md border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Logo className="text-lg md:text-2xl" />
          <div className="hidden lg:flex items-center gap-8">
            {['methodology', 'profile', 'expertise'].map(id => (
              <a key={id} href={`#${id}`} onClick={(e) => handleNavClick(e, id)} className="text-sm hover:text-[#FCD116] transition-colors">{t.nav[id === 'profile' ? 'background' : id]}</a>
            ))}
            <button onClick={toggleLang} className="text-sm font-bold border border-white/20 px-2 py-1 rounded">{lang.toUpperCase()}</button>
            <Button onClick={() => setIsContactModalOpen(true)} className="py-2 text-xs">{t.nav.contact}</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-20 container mx-auto px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center min-h-0">
        <div className="space-y-5 sm:space-y-8">
          <div className="inline-block px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FCD116] text-xs">{t.hero.badge}</div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight break-words">{t.hero.title}</h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button onClick={() => setIsContactModalOpen(true)}>{t.hero.primary} <ArrowRight size={16}/></Button>
            <Button variant="secondary" onClick={(e) => handleNavClick(e, 'profile')}>{t.hero.secondary}</Button>
          </div>
        </div>
        {/* Chart Visualization */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group min-w-0">
            <div className="h-48 sm:h-56 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs><linearGradient id="colorKpi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FCD116" stopOpacity={0.3}/><stop offset="95%" stopColor="#FCD116" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" stroke="#444" fontSize={12} />
                        <Tooltip contentStyle={{backgroundColor: '#111', border: 'none'}} />
                        <Area type="monotone" dataKey="kpi" stroke="#FCD116" fillOpacity={1} fill="url(#colorKpi)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </section>

      {/* Profile Section (ΔΥΝΑΜΙΚΟ) */}
      <section id="profile" className="py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 border-l-4 border-[#FCD116] pl-6">{t.bio.title}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {displayBioSteps.map((step, idx) => {
              const icons = [HardHat, Wrench, GraduationCap, UserCheck];
              return (
                <InfoCard 
                  key={idx}
                  icon={icons[idx] || HardHat}
                  title={step.title}
                  description={step.description || step.desc} // Υποστήριξη Sanity field name
                  onClick={() => openDetail(displayBioSteps, idx)}
                  ctaLabel={infoCardCta}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-right border-r-4 border-[#FCD116] pr-6">{t.bento.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(t.bento.cards).map((card, idx) => {
                const expertiseIcons = [AlertTriangle, Settings, BarChart2, Layers, Activity, Shield];
                return (
                    <InfoCard 
                        key={idx}
                        icon={expertiseIcons[idx]}
                        title={card.title}
                        description={card.desc}
                        ctaLabel={infoCardCta}
                    />
                )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-zinc-600 text-sm">
        <p>{t.footer.copyright}</p>
      </footer>

      {/* Detail Modal */}
      {detailContext && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-[#111] border border-white/10 rounded-3xl p-10 relative">
            <button onClick={() => setDetailContext(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X/></button>
            <h3 className="text-2xl font-bold text-[#FCD116] mb-6">{detailContext.items[detailContext.index].title}</h3>
            <p className="text-zinc-300 leading-relaxed text-lg">{detailContext.items[detailContext.index].details}</p>
            <div className="mt-10 flex justify-between">
                <button onClick={goToPrevDetail} className="text-zinc-500 hover:text-white flex items-center gap-2"><ChevronLeft/> Prev</button>
                <button onClick={goToNextDetail} className="text-zinc-500 hover:text-white flex items-center gap-2">Next <ChevronRight/></button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal (Placeholder) */}
      {isContactModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
              <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold">Contact P_Analytics</h2>
                  <p className="text-zinc-400">Booking system initialized...</p>
                  <Button onClick={() => setIsContactModalOpen(false)}>Close</Button>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;