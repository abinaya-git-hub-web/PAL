import apiClient from '../api/apiClient';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Book, BarChart2, Flame, Award, Ticket, Star, Zap, X, Check,
    HelpCircle, Brain, Target, Clock, TrendingUp, Palette, RefreshCw, ShoppingBag, Trophy
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ThemeSelectModal from '../components/ThemeSelectModal';
import RecommendationPanel from '../components/RecommendationPanel';
import StudyPlanWidget from '../components/StudyPlanWidget';
import WeakAreaPanel from '../components/WeakAreaPanel';
import AchievementShowcase from '../components/AchievementShowcase';
import RewardStoreModal from '../components/RewardStoreModal';
import LeaderboardPreview from '../components/LeaderboardPreview';
import AiTutorWidget from '../components/AiTutorWidget';
import FlashcardDeck from '../components/FlashcardDeck';
import CertificateModal from '../components/CertificateModal';
import MockTestGeneratorModal from '../components/MockTestGeneratorModal';
import { getAvatarIcon, getFrameStyle, getAccentColor } from '../config/cosmeticsConfig';

/* ─── Daily Quest Modal ─── */
const DailyQuestModal = ({ quest, onClose, onSubmit, submitted, result }) => {
    const [selected, setSelected] = useState(null);
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '540px', position: 'relative' }}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Zap size={20} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--primary)', textTransform: 'uppercase' }}>
                        GATE-Level Daily Challenge
                    </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.5, color: 'var(--text)' }}>
                    {quest.questionText}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {quest.options.map((opt, i) => {
                        let border = '1px solid var(--card-border)';
                        let bg = 'rgba(255,255,255,0.03)';
                        if (submitted && result) {
                            if (i === result.correctAnswer) { border = '1px solid #22c55e'; bg = 'rgba(34,197,94,0.1)'; }
                            else if (i === selected && i !== result.correctAnswer) { border = '1px solid #ef4444'; bg = 'rgba(239,68,68,0.1)'; }
                        } else if (selected === i) {
                            border = '1px solid var(--primary)'; bg = 'rgba(99,102,241,0.1)';
                        }
                        return (
                            <button key={i} disabled={submitted} onClick={() => !submitted && setSelected(i)}
                                style={{ padding: '0.85rem 1rem', textAlign: 'left', cursor: submitted ? 'default' : 'pointer', background: bg, border, borderRadius: '0.6rem', color: 'var(--text)', fontSize: '0.95rem', transition: 'all 0.2s', width: '100%' }}
                            >
                                <span style={{ fontWeight: 700, marginRight: '0.5rem', color: 'var(--primary)' }}>{String.fromCharCode(65 + i)}.</span>
                                {opt}
                                {submitted && result && i === result.correctAnswer && <Check size={14} style={{ float: 'right', color: '#22c55e', marginTop: '3px' }} />}
                            </button>
                        );
                    })}
                </div>
                {submitted && result ? (
                    <div style={{ padding: '1rem', borderRadius: '0.6rem', textAlign: 'center', background: result.isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: result.isCorrect ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)' }}>
                        {result.isCorrect
                            ? <p style={{ color: '#22c55e', fontWeight: 700 }}>✅ Correct! You earned +1 daily reward!</p>
                            : <p style={{ color: '#ef4444', fontWeight: 700 }}>❌ Incorrect. Better luck tomorrow!</p>}
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={() => selected !== null && onSubmit(selected)} disabled={selected === null} style={{ width: '100%', opacity: selected === null ? 0.5 : 1 }}>
                        Submit Answer
                    </button>
                )}
            </motion.div>
        </div>
    );
};

/* ─── Progress visualizer — style adapts to progressStyle token ─── */
const ProgressViz = ({ value, max, style: progressStyle }) => {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    if (progressStyle === 'xp-ring') {
        const r = 36, circ = 2 * Math.PI * r;
        return (
            <div className="progress-ring-wrap" style={{ width: 90, height: 90 }}>
                <svg className="progress-ring-svg" width={90} height={90}>
                    <circle className="progress-ring-bg" cx={45} cy={45} r={r} strokeWidth={7} />
                    <circle className="progress-ring-fg" cx={45} cy={45} r={r} strokeWidth={7}
                        strokeDasharray={circ}
                        strokeDashoffset={circ - (pct / 100) * circ}
                    />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{value}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/{max}</span>
                </div>
            </div>
        );
    }
    if (progressStyle === 'film-strip') {
        const frames = Math.min(max, 10);
        const filled = Math.round((value / max) * frames);
        return (
            <div className="progress-filmstrip">
                {Array.from({ length: frames }, (_, i) => (
                    <div key={i} className={`progress-frame ${i < filled ? 'filled' : 'empty'}`} />
                ))}
            </div>
        );
    }
    if (progressStyle === 'orbs') {
        const orbs = Math.min(max, 10);
        const filled = Math.round((value / max) * orbs);
        return (
            <div className="progress-orbs">
                {Array.from({ length: orbs }, (_, i) => (
                    <div key={i} className={`progress-orb ${i < filled ? 'filled' : ''}`} />
                ))}
            </div>
        );
    }
    if (progressStyle === 'stardust') {
        const stars = Math.min(max, 7);
        const filled = Math.round((value / max) * stars);
        return (
            <div className="progress-stardust">
                {Array.from({ length: stars }, (_, i) => (
                    <span key={i} className={`progress-star ${i < filled ? 'filled' : ''}`}>⭐</span>
                ))}
            </div>
        );
    }
    // Default: bar
    return (
        <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
    );
};

/* ─── Main Dashboard Component ─── */
const Dashboard = () => {
    const { user, logout, updateUserStats } = useContext(AuthContext);
    const { themeConfig, experience, subTheme, savePreference, isChanging } = useTheme();

    const { terminology, reward, progressStyle } = themeConfig;

    const [subjects, setSubjects] = useState([]);
    const [progress, setProgress] = useState([]);
    const [dailyQuest, setDailyQuest] = useState(null);
    const [questModalOpen, setQuestModalOpen] = useState(false);
    const [questSubmitted, setQuestSubmitted] = useState(false);
    const [questResult, setQuestResult] = useState(null);
    const [experienceModalOpen, setExperienceModalOpen] = useState(false);
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [isMockTestModalOpen, setIsMockTestModalOpen] = useState(false);

    const rewardValue = user?.[reward.key] || 0;
    const passedTopics = progress.filter(p => p.status === 'pass').length;
    const totalTopicsCount = progress.length > 0 ? Math.max(progress.length, 10) : 10;
    const progressPercentage = Math.min(Math.round((passedTopics / totalTopicsCount) * 100), 100);

    useEffect(() => {
        const userId = user?.id || user?._id;
        if (!userId) return;

        const fetchDashboardData = async () => {
            try {
                const [subRes, progRes] = await Promise.all([
                    apiClient.get('/api/subjects'),
                    apiClient.get(`/api/progress/${userId}`),
                ]);

                setSubjects(subRes.data);
                setProgress(progRes.data);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            }
        };

        const fetchDailyQuest = async () => {
            try {
                const questRes = await apiClient.get(
                    `/api/assessment/daily-quest/${userId}`
                );

                setDailyQuest(questRes.data);
            } catch (err) {
                console.error(
                    'Failed to load Daily Quest:',
                    err.response?.status,
                    err.response?.data || err.message
                );

                setDailyQuest(null);
            }
        };

        fetchDashboardData();
        fetchDailyQuest();
    }, [user?.id, user?._id]);

    const handleDailyQuestSubmit = async (answerIndex) => {
        try {
            const res = await apiClient.post('/api/assessment/daily-quest/submit', {
                userId: user.id, questionId: dailyQuest.question.id, answer: answerIndex,
            });
            setQuestResult(res.data);
            setQuestSubmitted(true);
            if (res.data.isCorrect && res.data.userStats) {
                updateUserStats(res.data.userStats);
                setDailyQuest(prev => ({ ...prev, alreadyCompleted: true }));
            }
        } catch (err) { console.error(err); }
    };

    const handleExperienceSave = async (exp, sub) => {
        await savePreference(exp, sub);
        setExperienceModalOpen(false);
    };

    return (
        <div className="container" style={{ paddingTop: '6rem' }}>
            <AnimatePresence>
                {questModalOpen && dailyQuest?.question && (
                    <DailyQuestModal
                        quest={dailyQuest.question}
                        onClose={() => setQuestModalOpen(false)}
                        onSubmit={handleDailyQuestSubmit}
                        submitted={questSubmitted || dailyQuest.alreadyCompleted}
                        result={questResult}
                    />
                )}
            </AnimatePresence>

            {/* Theme Select Modal */}
            <ThemeSelectModal
                isOpen={experienceModalOpen}
                mode="edit"
                initialExp={experience}
                initialSub={subTheme}
                onSave={handleExperienceSave}
                onDismiss={() => setExperienceModalOpen(false)}
                isSaving={isChanging}
            />

            {/* ─── Header ─── */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {/* Equipped Avatar inside Profile Frame Wrapper */}
                    <div
                        className="profile-frame-wrap"
                        style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.9rem', flexShrink: 0,
                            position: 'relative',
                            ...getFrameStyle(user.equipped?.profile_frame)
                        }}
                    >
                        {getAvatarIcon(user.equipped?.avatar)}
                    </div>
                    <div>
                        <h2 className="heading-gradient" style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>Welcome back, {user.name}!</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Here is your learning progress and performance insights for today.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Reward Store button */}
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setIsStoreModalOpen(true)}
                        style={{
                            padding: '0.6rem 1.2rem', borderRadius: '9999px',
                            background: getAccentColor(user.equipped?.theme_accent) ? `${getAccentColor(user.equipped?.theme_accent)}1a` : 'rgba(234,179,8,0.12)',
                            border: `1px solid ${getAccentColor(user.equipped?.theme_accent) || 'rgba(234,179,8,0.3)'}`,
                            color: getAccentColor(user.equipped?.theme_accent) || '#eab308', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s',
                        }}
                    >
                        <ShoppingBag size={15} /> {experience === 'gamified' ? 'Reward Shop' : experience === 'cinematic' ? 'Costumes & Effects' : 'Reward Store'}
                    </motion.button>

                    {/* Leaderboard CTA Button */}
                    <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            style={{
                                padding: '0.6rem 1.2rem', borderRadius: '9999px',
                                background: 'rgba(59,130,246,0.12)',
                                border: '1px solid rgba(59,130,246,0.3)',
                                color: 'var(--primary)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s',
                            }}
                        >
                            <Trophy size={15} /> {experience === 'gamified' ? 'Champions Board' : experience === 'cinematic' ? 'Hall of Fame' : 'Leaderboard'}
                        </motion.button>
                    </Link>

                    {/* Mock Test Generator CTA */}
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setIsMockTestModalOpen(true)}
                        style={{
                            padding: '0.6rem 1.2rem', borderRadius: '9999px',
                            background: 'rgba(168,85,247,0.12)',
                            border: '1px solid rgba(168,85,247,0.3)',
                            color: '#a855f7', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s',
                        }}
                    >
                        <Target size={15} /> Mock Test Practice
                    </motion.button>

                    {/* Certificate CTA */}
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setIsCertModalOpen(true)}
                        style={{
                            padding: '0.6rem 1.2rem', borderRadius: '9999px',
                            background: 'rgba(34,197,94,0.12)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            color: '#22c55e', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s',
                        }}
                    >
                        <Award size={15} /> View Certificate
                    </motion.button>

                    {/* Change Experience button */}
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setExperienceModalOpen(true)}
                        style={{
                            padding: '0.6rem 1.2rem', borderRadius: '9999px',
                            background: 'var(--surface)',
                            border: '1px solid var(--card-border)',
                            color: 'var(--text-muted)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s',
                        }}
                    >
                        <Palette size={15} /> Change Experience
                    </motion.button>
                    <button
                        onClick={logout}
                        style={{
                            padding: '0.6rem 1.2rem', borderRadius: '9999px',
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                            color: '#ef4444', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* ─── Experience Banner ─── */}
            <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                    marginBottom: '2rem', padding: '1rem 1.4rem',
                    borderRadius: '1rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                    {themeConfig.experienceCfg?.emoji}
                </div>
                <div>
                    <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.98rem' }}>
                        {themeConfig.experienceCfg?.label}
                    </span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', marginLeft: '0.5rem', background: 'rgba(99,102,241,0.1)', padding: '2px 10px', borderRadius: '99px' }}>
                        {themeConfig.subThemeCfg?.label}
                    </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 'auto', fontWeight: 500 }}>
                    {terminology.chapter}s · {terminology.topic}s · {terminology.assessment}s
                </span>
            </motion.div>

            {/* ─── Stats Row ─── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '1rem', color: '#8b5cf6' }}>
                        <Book size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{terminology.topic}s Mastered</p>
                        <h3 style={{ fontSize: '1.5rem' }}>{passedTopics}</h3>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid var(--primary)` }}>
                    <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '1rem', color: 'var(--primary)', fontSize: '1.4rem' }}>
                        {reward.emoji}
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{reward.label}</p>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{rewardValue}</h3>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{terminology.progress}</p>
                    <ProgressViz value={passedTopics} max={Math.max(passedTopics, 10)} style={progressStyle} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{passedTopics} of {Math.max(passedTopics, 10)} {terminology.topic}s</p>
                </div>
            </div>

            {/* ─── Main Grid ─── */}
            <div className="dashboard-grid">

                {/* Analytics & Achievements & Subjects */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Featured Class 12 Mathematics Chapter 2 Adaptive Learning Banner */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="glass-card"
                        style={{
                            padding: '1.75rem',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.12) 100%)',
                            border: '1.5px solid rgba(37,99,235,0.3)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'var(--primary)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Featured MVP • Class 12 Math
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                                        Adaptive Engine Active
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.6rem', margin: '0 0 0.4rem', color: 'var(--text)' }}>
                                    Chapter 2: Complex Numbers
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0, maxWidth: '540px', lineHeight: 1.5 }}>
                                    Your learning path adapts dynamically based on your diagnostic assessment performance (LOW, MEDIUM, or HIGH level).
                                </p>
                            </div>

                            <Link
                                to="/chapter/chapter_2_complex_numbers/adaptive"
                                className="btn btn-primary"
                                style={{
                                    padding: '0.85rem 1.6rem',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 6px 20px rgba(37,99,235,0.3)'
                                }}
                            >
                                Launch Adaptive Learning Journey <Zap size={18} />
                            </Link>
                        </div>
                    </motion.div>

                    <RecommendationPanel userId={user?.id || user?._id} />
                    <StudyPlanWidget userId={user?.id || user?._id} />
                    <WeakAreaPanel userId={user?.id || user?._id} />
                    <AchievementShowcase userId={user?.id || user?._id} />
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your {terminology.chapter}s</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {subjects.map(subject => (
                                <Link key={subject._id} to={`/subject/${subject._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`glass-card micro-${themeConfig.micro}`}
                                        style={{ height: '100%' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(99,102,241,0.15)' }}>
                                                <Book color="var(--primary)" />
                                            </div>
                                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text)' }}>{subject.name}</h3>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            Explore {terminology.chapter.toLowerCase()}s and unlock {terminology.topic.toLowerCase()}s in {subject.name}.
                                        </p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Leaderboard Preview Widget */}
                    <LeaderboardPreview />

                    {/* Daily Quest */}
                    <motion.div className="glass-card" style={{ padding: '1.5rem' }} whileHover={{ scale: 1.01 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <Zap size={20} color="var(--primary)" />
                            <h3 style={{ color: 'var(--text)' }}>Daily {terminology.assessment}</h3>
                            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'rgba(99,102,241,0.15)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GATE</span>
                        </div>
                        {dailyQuest?.alreadyCompleted ? (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                                <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{terminology.complete}!</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Come back tomorrow for a new challenge!</p>
                            </div>
                        ) : dailyQuest?.question ? (
                            <div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                    🔬 {dailyQuest.question.topic} · Hard level
                                </p>
                                <p style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.6, marginBottom: '1rem' }}>
                                    {dailyQuest.question.questionText.length > 80
                                        ? dailyQuest.question.questionText.substring(0, 80) + '...'
                                        : dailyQuest.question.questionText}
                                </p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => { setQuestModalOpen(true); setQuestSubmitted(false); setQuestResult(null); }}
                                    style={{ width: '100%' }}
                                >
                                    <Star size={16} style={{ marginRight: '0.4rem' }} />
                                    Attempt (+1 {reward.label})
                                </button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0', fontSize: '0.9rem' }}>
                                <HelpCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p>Loading today's challenge…</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Reward Streak card */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.4rem' }}>{reward.emoji}</span>
                            <h3 style={{ color: 'var(--text)', fontSize: '1rem' }}>{terminology.streak}</h3>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                            {user?.streak || 0}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
                            consecutive study days
                        </p>
                    </div>

                    {/* Interactive Flashcards */}
                    <FlashcardDeck topicName="Linear Algebra & Maths" />
                </div>

                {/* Reward Store Modal */}
                <RewardStoreModal
                    isOpen={isStoreModalOpen}
                    onClose={() => setIsStoreModalOpen(false)}
                    userId={user?.id || user?._id}
                />

                {/* Certificate Modal */}
                <CertificateModal
                    isOpen={isCertModalOpen}
                    onClose={() => setIsCertModalOpen(false)}
                    userName={user?.name || 'Learner'}
                    subjectName="Linear Algebra & Engineering Mathematics"
                    score={100}
                />

                {/* Mock Test Generator Modal */}
                <MockTestGeneratorModal
                    isOpen={isMockTestModalOpen}
                    onClose={() => setIsMockTestModalOpen(false)}
                    topicName="Linear Algebra"
                />

                {/* Floating AI Tutor Chat Assistant */}
                <AiTutorWidget topicName="Linear Algebra & GATE Maths" />
            </div>
        </div>
    );
};

export default Dashboard;
