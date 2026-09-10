import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Check, BookOpen, Sparkles, Film, ChevronLeft, ArrowRight } from 'lucide-react';
import { EXPERIENCE_CONFIG } from '../config/experiences';

// Canonical experience IDs (Phase 2)
const EXPERIENCES = [
    {
        id: 'professional',
        label: 'Professional',
        icon: <BookOpen size={28} />,
        emoji: '💼',
        desc: 'Clean, focused learning environment. Earn Points.',
        gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
        reward: '⭐ Points',
    },
    {
        id: 'gamified',
        label: 'Gamified',
        icon: <Sparkles size={28} />,
        emoji: '🎮',
        desc: 'Level up your skills with streaks and challenges.',
        gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
        reward: '🔥 Streaks',
    },
    {
        id: 'cinematic',
        label: 'Cinematic',
        icon: <Film size={28} />,
        emoji: '🎬',
        desc: 'Immersive dark UI with story-like progression.',
        gradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
        reward: '🎟️ Tokens',
    },
];

const Signup = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        interest: 'professional',
        subTheme: 'corporate',
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            alert('Please fill in all fields before moving to the next step');
            return;
        }
        setStep(2);
    };

    const handleExpSelect = (id) => {
        const defaultSub = EXPERIENCE_CONFIG[id]?.defaultSubTheme || 'corporate';
        setFormData({ ...formData, interest: id, subTheme: defaultSub });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const cleanedData = {
                ...formData,
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase()
            };
            const res = await apiClient.post('/api/auth/register', cleanedData);
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await apiClient.post('/api/auth/google', {
                idToken: credentialResponse.credential,
            });
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || err.message || 'Google Signup failed');
        }
    };

    const handleGoogleError = () => {
        alert('Google Sign-In was unsuccessful. Please try again.');
    };

    const subThemes = formData.interest ? Object.entries(EXPERIENCE_CONFIG[formData.interest]?.subThemes || {}) : [];

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '4rem', paddingBottom: '4rem' }}>
            <AnimatePresence mode="wait">
                {/* ─── Step 1: Credentials ─── */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                        className="glass-card"
                        style={{ width: '100%', maxWidth: '420px' }}
                    >
                        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Step 1 of 3 — Your details
                        </p>
                        <form onSubmit={handleNextStep}>
                            <label>Full Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <label>Email</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            <label>Password</label>
                            <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Continue <ArrowRight size={16} style={{ marginLeft: 4 }} />
                            </button>
                        </form>

                        <div style={{ margin: '1.25rem 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        </div>

                        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap theme="filled_blue" shape="rectangular" width="350" />
                            </div>
                        ) : null}

                        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                        </p>
                    </motion.div>
                )}

                {/* ─── Step 2: Choose Main Experience ─── */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                        className="glass-card"
                        style={{ width: '100%', maxWidth: '780px' }}
                    >
                        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.95rem', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ChevronLeft size={16} /> Back
                        </button>
                        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '2rem' }}>Choose Your Learning Experience</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                            Step 2 of 3 — You can change this anytime from your Dashboard.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {EXPERIENCES.map(exp => (
                                <motion.div
                                    key={exp.id}
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => handleExpSelect(exp.id)}
                                    style={{
                                        cursor: 'pointer', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center',
                                        border: formData.interest === exp.id ? '2px solid white' : '2px solid rgba(255,255,255,0.08)',
                                        background: formData.interest === exp.id ? exp.gradient : 'rgba(255,255,255,0.03)',
                                        position: 'relative', transition: 'all 0.2s ease',
                                        boxShadow: formData.interest === exp.id ? '0 10px 25px rgba(0,0,0,0.2)' : 'none',
                                        color: '#fff',
                                    }}
                                >
                                    {formData.interest === exp.id && (
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Check size={16} color="#000" />
                                        </div>
                                    )}
                                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{exp.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.75rem' }}>{exp.emoji} {exp.label}</div>
                                    <div style={{ fontSize: '0.85rem', color: formData.interest === exp.id ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>{exp.desc}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.9 }}>Reward: {exp.reward}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                            {formData.interest !== 'professional' && (
                                <button type="button" onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    Customize Style (Optional) <ArrowRight size={14} />
                                </button>
                            )}
                            <button type="button" onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ borderRadius: '9999px', padding: '0.85rem 2.5rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                                {loading ? 'Registering...' : '🚀 Complete Registration'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ─── Step 3: Choose Sub-theme ─── */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
                        className="glass-card"
                        style={{ width: '100%', maxWidth: '820px' }}
                    >
                        <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.95rem', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ChevronLeft size={16} /> Back
                        </button>
                        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '1.8rem' }}>
                            {EXPERIENCE_CONFIG[formData.interest]?.emoji} {EXPERIENCE_CONFIG[formData.interest]?.label} — Choose Your Style
                        </h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
                            Step 3 of 3 — Pick the visual atmosphere that feels right.
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '0.85rem',
                            marginBottom: '2.5rem',
                            maxHeight: '380px',
                            overflowY: 'auto',
                            paddingRight: '4px',
                        }}>
                            {subThemes.map(([subKey, cfg]) => {
                                const isSelected = formData.subTheme === subKey;
                                const primaryColor = cfg.palette['--primary'] || '#6366f1';
                                return (
                                    <motion.button
                                        key={subKey}
                                        whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setFormData({ ...formData, subTheme: subKey })}
                                        style={{
                                            cursor: 'pointer',
                                            borderRadius: '0.85rem',
                                            padding: '0.85rem 1rem', textAlign: 'left',
                                            border: isSelected ? `2px solid ${primaryColor}` : '1.5px solid rgba(255,255,255,0.12)',
                                            background: isSelected ? `linear-gradient(135deg, rgba(30,41,59,0.95), ${primaryColor}44)` : 'rgba(255,255,255,0.06)',
                                            position: 'relative', transition: 'all 0.2s ease',
                                            boxShadow: isSelected ? `0 0 16px ${primaryColor}66, 0 4px 12px rgba(0,0,0,0.5)` : 'none',
                                            height: '82px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                        }}
                                    >
                                        {isSelected && (
                                            <div style={{ position: 'absolute', top: '8px', right: '8px', background: primaryColor, borderRadius: '50%', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', boxShadow: `0 0 8px ${primaryColor}` }}>
                                                <Check size={12} color="#fff" strokeWidth={3} />
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            {[cfg.palette['--primary'], cfg.palette['--secondary'], cfg.palette['--accent']].filter(Boolean).map((c, i) => (
                                                <div key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.3)', boxShadow: `0 0 6px ${c}88` }} />
                                            ))}
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.label}</div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center' }}>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '9999px', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                                {loading ? 'Registering...' : '🚀 Complete Registration'}
                            </button>
                        </form>

                        {/* Step indicator */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1.5rem' }}>
                            {[1, 2, 3].map(s => (
                                <div key={s} style={{
                                    width: step === s ? '24px' : '8px', height: '8px', borderRadius: '99px',
                                    background: step === s ? 'var(--primary, #6366f1)' : 'rgba(255,255,255,0.2)',
                                    transition: 'all 0.3s ease',
                                }} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Signup;
