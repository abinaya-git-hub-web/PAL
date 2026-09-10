import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Brain, Search, User, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileAvatarRing from './ProfileAvatarRing';

// Search Modal
const SearchModal = ({ onClose }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 2000,
                background: 'rgba(15,23,42,0.5)',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem'
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '1.5rem',
                    padding: '3rem 2.5rem',
                    textAlign: 'center',
                    maxWidth: '420px',
                    width: '100%',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                    border: '1px solid #f1f5f9'
                }}
            >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Search size={28} color="#3b82f6" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Global Search</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Global Search <span style={{ fontWeight: 700, color: '#3b82f6' }}>Coming Soon</span>.<br />
                    We're building an intelligent search experience for you.
                </p>
                <button onClick={onClose} style={{ padding: '0.75rem 2rem', borderRadius: '99px', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                    Got it
                </button>
            </motion.div>
        </motion.div>
    </AnimatePresence>
);

const NAV_LINKS = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Features', id: 'features' },
    { name: 'Subjects', id: 'subjects' },
    { name: 'Learning Experiences', id: 'modes' },
    { name: 'AI Features', id: 'ai' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
];

const AUTH_NAV_LINKS = [
    { name: 'Dashboard', to: '/dashboard' },
];

const Navbar = () => {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const themeCtx = useTheme ? useTheme() : null;

    const handleQuickDemo = () => {
        login({
            token: 'demo_jwt_token_123',
            user: {
                id: 'demo_user_123',
                _id: 'demo_user_123',
                name: 'Class 12 Math Student',
                email: 'student@example.com',
                interest: 'professional',
                subTheme: 'corporate',
                points: 150,
                streak: 5,
                tokens: 10
            }
        });
        navigate('/dashboard');
    };
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const location = useLocation();
    const isLandingPage = location.pathname === '/';
    const drawerRef = useRef(null);

    // Scroll + active section tracking
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
            if (!isLandingPage) return;
            const sectionIds = NAV_LINKS.map(l => l.id);
            let current = 'home';
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 140) current = id;
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLandingPage]);

    // Close drawer on resize
    useEffect(() => {
        const onResize = () => { if (window.innerWidth > 900) setMobileMenuOpen(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // ESC key closes drawer/search
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') { setMobileMenuOpen(false); setSearchOpen(false); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Lock scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const scrollToSection = useCallback((id) => {
        setMobileMenuOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const navStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        height: '80px',
        transition: 'background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
        background: isScrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        boxShadow: isScrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(226,232,240,0.7)' : '1px solid transparent',
    };

    const textColor = isScrolled || !isLandingPage ? '#0f172a' : '#0f172a';
    const mutedColor = isScrolled || !isLandingPage ? '#64748b' : '#475569';

    return (
        <>
            {/* Search Modal */}
            {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

            <header style={navStyle} role="banner">
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

                    {/* ─── Logo ─── */}
                    <Link
                        to="/"
                        aria-label="DAZLearning Home"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.06, boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            style={{
                                width: '40px', height: '40px',
                                background: '#0f172a',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', flexShrink: 0
                            }}
                        >
                            <Brain size={22} color="#ffffff" />
                        </motion.div>
                        <div>
                            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: textColor, letterSpacing: '-0.03em', display: 'block', lineHeight: 1 }}>
                                DAZ<span style={{ color: '#3b82f6' }}>Learning</span>
                            </span>
                            <span style={{ fontSize: '0.65rem', color: mutedColor, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>AI-Powered Platform</span>
                        </div>
                    </Link>

                    {/* ─── Center Navigation (Landing, not logged in) ─── */}
                    {isLandingPage && !user && (
                        <nav aria-label="Main navigation" className="desktop-nav" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.15rem' }}>
                            {NAV_LINKS.map(link => {
                                const isActive = activeSection === link.id;
                                return (
                                    <motion.button
                                        key={link.id}
                                        onClick={() => scrollToSection(link.id)}
                                        whileHover={{ y: -2 }}
                                        aria-label={`Scroll to ${link.name}`}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            padding: '0.45rem 0.75rem', borderRadius: '0.4rem',
                                            fontSize: '0.875rem',
                                            fontWeight: isActive ? 700 : 500,
                                            color: isActive ? '#2563eb' : textColor,
                                            fontFamily: 'inherit',
                                            position: 'relative',
                                            transition: 'color 0.2s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {link.name}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.span
                                                    layoutId="active-underline"
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: 1 }}
                                                    exit={{ scaleX: 0 }}
                                                    style={{
                                                        position: 'absolute', bottom: '2px',
                                                        left: '0.75rem', right: '0.75rem',
                                                        height: '2px', borderRadius: '99px',
                                                        background: 'linear-gradient(90deg, #2563eb, #8b5cf6)',
                                                        display: 'block'
                                                    }}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </nav>
                    )}

                    {/* ─── Authenticated user nav (center) ─── */}
                    {user && (
                        <nav aria-label="App navigation" className="desktop-nav" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '1.25rem', alignItems: 'center' }}>
                            <Link to="/dashboard" className="nav-link" style={{ color: 'var(--text)', fontWeight: 600 }}>Dashboard</Link>
                            <Link to="/leaderboard" className="nav-link" style={{ color: 'var(--text)', fontWeight: 600 }}>Leaderboard</Link>
                        </nav>
                    )}

                    {/* ─── Right Section ─── */}
                    <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                        {/* Search Button */}
                        {!user && (
                            <motion.button
                                onClick={() => setSearchOpen(true)}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Open global search"
                                style={{
                                    width: '38px', height: '38px', borderRadius: '50%',
                                    border: `1.5px solid ${isScrolled ? '#e2e8f0' : 'rgba(0,0,0,0.12)'}`,
                                    background: 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: textColor,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Search size={16} />
                            </motion.button>
                        )}

                        {!user ? (
                            <>
                                {/* Instant Demo CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleQuickDemo}
                                    style={{
                                        padding: '0.6rem 1.25rem',
                                        borderRadius: '999px',
                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <Zap size={14} fill="currentColor" /> Quick Demo Access
                                </motion.button>
                                {/* Login */}
                                <Link
                                    to="/login"
                                    aria-label="Login to your account"
                                    style={{
                                        padding: '0.6rem 1.5rem',
                                        borderRadius: '999px',
                                        border: `1.5px solid ${isScrolled ? '#e2e8f0' : 'rgba(0,0,0,0.12)'}`,
                                        background: 'transparent',
                                        color: textColor,
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        display: 'inline-flex', alignItems: 'center',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Login
                                </Link>
                                {/* Register */}
                                <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                                    <Link
                                        to="/signup"
                                        aria-label="Create an account"
                                        style={{
                                            padding: '0.65rem 1.5rem',
                                            borderRadius: '999px',
                                            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #8b5cf6 100%)',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                            textDecoration: 'none',
                                            display: 'inline-flex', alignItems: 'center',
                                            boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
                                            transition: 'box-shadow 0.2s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Register
                                    </Link>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <Link to="/profile" className="nav-link" style={{ color: 'var(--text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    Profile
                                </Link>
                                <button onClick={logout} className="nav-link" aria-label="Logout" style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.9rem' }}>Logout</button>
                                <Link
                                    to="/profile"
                                    aria-label={`View profile for ${user.name}`}
                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                >
                                    <ProfileAvatarRing user={user} size={42} strokeWidth={3} showBadge={true} />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ─── Hamburger ─── */}
                    <motion.button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(v => !v)}
                        aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                        aria-expanded={mobileMenuOpen}
                        whileTap={{ scale: 0.9 }}
                        style={{ color: textColor, background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.5rem', display: 'none' }}
                    >
                        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </motion.button>
                </div>
            </header>

            {/* ─── Mobile Drawer ─── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(5px)', zIndex: 998 }}
                        />

                        {/* Drawer Panel */}
                        <motion.nav
                            key="drawer"
                            ref={drawerRef}
                            role="navigation"
                            aria-label="Mobile navigation"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                            style={{
                                position: 'fixed', top: 0, right: 0, bottom: 0,
                                width: 'min(320px, 100vw)',
                                background: 'rgba(255,255,255,0.97)',
                                backdropFilter: 'blur(20px)',
                                zIndex: 999,
                                display: 'flex', flexDirection: 'column',
                                boxShadow: '-20px 0 60px rgba(0,0,0,0.12)',
                                overflowY: 'auto',
                            }}
                        >
                            {/* Drawer Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                                    DAZ<span style={{ color: '#3b82f6' }}>Learning</span>
                                </span>
                                <motion.button
                                    onClick={() => setMobileMenuOpen(false)}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Close navigation"
                                    style={{ background: '#f1f5f9', border: 'none', borderRadius: '0.75rem', padding: '0.5rem', cursor: 'pointer', color: '#334155', display: 'flex' }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Drawer Nav Links */}
                            <div style={{ flex: 1, padding: '1rem 1rem' }}>
                                {isLandingPage && !user && NAV_LINKS.map((link, i) => (
                                    <motion.button
                                        key={link.id}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => scrollToSection(link.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', width: '100%',
                                            padding: '0.875rem 1rem', borderRadius: '0.75rem',
                                            border: 'none', background: activeSection === link.id ? '#eff6ff' : 'transparent',
                                            color: activeSection === link.id ? '#2563eb' : '#334155',
                                            fontWeight: activeSection === link.id ? 700 : 500,
                                            fontSize: '1rem', cursor: 'pointer',
                                            textAlign: 'left', fontFamily: 'inherit',
                                            marginBottom: '0.15rem',
                                            borderLeft: activeSection === link.id ? '3px solid #3b82f6' : '3px solid transparent',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {link.name}
                                    </motion.button>
                                ))}

                                {user && (
                                    <>
                                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Dashboard</Link>
                                        <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Leaderboard</Link>
                                        <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="mobile-nav-link">Logout</button>
                                    </>
                                )}
                            </div>

                            {/* Drawer CTA Buttons */}
                            {!user && (
                                <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ display: 'block', padding: '0.9rem', borderRadius: '0.75rem', border: '1.5px solid #e2e8f0', textAlign: 'center', fontWeight: 600, color: '#0f172a', textDecoration: 'none', transition: 'all 0.2s' }}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ display: 'block', padding: '0.9rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6, #8b5cf6)', textAlign: 'center', fontWeight: 700, color: 'white', textDecoration: 'none' }}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
