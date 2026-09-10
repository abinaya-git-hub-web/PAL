import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, Target, BarChart3, Activity, Shield, ArrowDown, Zap } from 'lucide-react';
import useAnimatedCounter from '../../hooks/useAnimatedCounter';
import { AuthContext } from '../../context/AuthContext';

const Hero = () => {
    const [startAnim, setStartAnim] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

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

    useEffect(() => {
        setStartAnim(true);
    }, []);

    const s1 = useAnimatedCounter(50000, 2000, startAnim);
    const s2 = useAnimatedCounter(1000000, 2500, startAnim);
    const s3 = useAnimatedCounter(250, 2000, startAnim);
    const s4 = useAnimatedCounter(95, 1800, startAnim);

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <section id="home" className="landing-section" style={{ minHeight: '850px', display: 'flex', alignItems: 'center', paddingTop: '80px', position: 'relative' }}>
            <div className="landing-container">
                <div className="landing-hero-grid">
                    {/* Left Content */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        {/* AI Badge */}
                        <motion.div variants={fadeUp} className="badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.1)', padding: '0.5rem 1rem', borderRadius: '99px', color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', marginBottom: '2rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <Sparkles size={14} />
                            <span>AI‑Powered Personalized Learning</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1 variants={fadeUp} className="landing-heading" style={{ fontSize: 'clamp(2.8rem,5vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0f172a', marginBottom: '1.5rem' }}>
                            Learn Smarter,<br />
                            Not Harder,<br />
                            <span className="gradient-text">AI‑Powered</span> Personalized Learning.
                        </motion.h1>

                        {/* Description */}
                        <motion.p variants={fadeUp} className="landing-text" style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.75, maxWidth: '580px', marginBottom: '2.5rem' }}>
                            Master Mathematics, Physics, and Chemistry through adaptive learning paths, intelligent assessments, AI tutoring, personalized study plans, and immersive experiences.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            <button 
                                onClick={handleQuickDemo} 
                                className="btn-premium" 
                                style={{ 
                                    padding: '1rem 2rem', 
                                    borderRadius: '9999px', 
                                    background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
                                    color: 'white', 
                                    fontWeight: 800, 
                                    fontSize: '1.05rem', 
                                    boxShadow: '0 8px 25px rgba(99,102,241,0.5)', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem' 
                                }}
                            >
                                <Zap size={20} fill="currentColor" /> Instant Demo Access (Dashboard)
                            </button>
                            <Link to="/signup" className="btn-premium-outline" style={{ padding: '1rem 2rem', borderRadius: '9999px', background: 'transparent', color: '#0f172a', fontWeight: 600, border: '2px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                Register Account <ArrowRight size={18} />
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div variants={fadeUp} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {[
                                ['AI Tutor', Brain],
                                ['Personalized Roadmap', Target],
                                ['Smart Assessments', BarChart3],
                                ['Progress Analytics', Activity],
                                ['Secure Learning', Shield]
                            ].map(([label, IconComponent], i) => (
                                <span key={i} className="badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', borderRadius: '99px', fontSize: '0.82rem', fontWeight: 600, color: '#475569', border: '1px solid #e2e8f0', padding: '0.4rem 0.85rem' }}>
                                    <IconComponent size={14} /> {label}
                                </span>
                            ))}
                        </motion.div>

                        {/* Mini Statistics */}
                        <motion.div variants={fadeUp} className="hero-mini-stats" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                            {[
                                { num: s1, label: 'Students', suffix: '+' },
                                { num: s2, label: 'Questions', suffix: '+' },
                                { num: s3, label: 'Modules', suffix: '+' },
                                { num: s4, label: 'Success', suffix: '%' }
                            ].map((stat, i) => (
                                <div key={i} className="glass-panel" style={{ padding: '0.75rem 1rem', borderRadius: '1rem', minWidth: '120px', textAlign: 'center', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', display: 'block' }}>
                                        {stat.num >= 1000000 ? `${(stat.num/1000000).toFixed(1)}M` : stat.num >= 1000 ? `${Math.floor(stat.num/1000)}k` : stat.num}{stat.suffix}
                                    </span>
                                    <span className="sr-only">{stat.label}</span>
                                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Illustration */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }} style={{ position: 'relative', height: '580px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="landing-hero-illustration" style={{ width: '340px', height: '380px', borderRadius: '2rem', background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', border: '1px solid #e0e7ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxShadow: '0 30px 60px rgba(59,130,246,0.1)' }}>
                            <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                                <Brain size={90} color="#3b82f6" strokeWidth={1.5} />
                            </motion.div>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e3a8a', margin: 0 }}>AI Learning Engine</p>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem', margin: 0 }}>Adapting to your pace</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} onClick={() => { const el = document.getElementById('stats'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#94a3b8' }}>
                <div style={{ width: '28px', height: '44px', border: '2px solid #cbd5e1', borderRadius: '99px', display: 'flex', justifyContent: 'center', paddingTop: '6px' }}>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: '4px', height: '8px', background: '#94a3b8', borderRadius: '99px' }} />
                </div>
                <ArrowDown size={14} />
            </motion.div>
        </section>
    );
};

export default Hero;
