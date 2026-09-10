import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, CheckCircle, ArrowRight, ArrowLeft, Award, HelpCircle,
    BookOpen, Sparkles, Target, RefreshCw, Star, Layers, Video, FileText, ChevronRight
} from 'lucide-react';

const ChapterAdaptivePage = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { themeConfig } = useTheme();

    const [loading, setLoading] = useState(true);
    const [chapterData, setChapterData] = useState(null);
    const [progress, setProgress] = useState(null);

    // Initial assessment local state
    const [initialAnswers, setInitialAnswers] = useState({});
    const [initialQuestionIdx, setInitialQuestionIdx] = useState(0);
    const [isSubmittingInitial, setIsSubmittingInitial] = useState(false);

    // Topic MCQ local state
    const [topicAnswers, setTopicAnswers] = useState({});
    const [topicQuestionIdx, setTopicQuestionIdx] = useState(0);
    const [topicSubmitted, setTopicSubmitted] = useState(false);
    const [topicResult, setTopicResult] = useState(null);

    // Final Assessment local state
    const [finalAnswers, setFinalAnswers] = useState({});
    const [finalQuestionIdx, setFinalQuestionIdx] = useState(0);
    const [finalSubmitted, setFinalSubmitted] = useState(false);
    const [finalResult, setFinalResult] = useState(null);

    const targetUserId = user?._id || user?.id || 'demo_student';
    const targetChapterId = chapterId || 'chapter_2_complex_numbers';

    // ── Fetch Chapter Data and Student Adaptive Progress ────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dataRes, progRes] = await Promise.all([
                    apiClient.get(`/api/adaptive/chapter-data/${targetChapterId}`),
                    apiClient.get(`/api/adaptive/progress/${targetUserId}/${targetChapterId}`)
                ]);

                setChapterData(dataRes.data);
                setProgress(progRes.data);
            } catch (err) {
                console.error('Failed to load adaptive data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [targetUserId, targetChapterId]);

    if (loading || !chapterData) {
        return (
            <div className="container" style={{ paddingTop: '7rem', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
                    <RefreshCw className="animate-spin" size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                    <h3 style={{ color: 'var(--text-main)' }}>Loading Adaptive Learning Portal...</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Preparing personalized Mathematics Chapter 2 pathway...</p>
                </div>
            </div>
        );
    }

    const { trailer, mainPpt, topics, initialAssessment, finalAssessment, thresholds } = chapterData;
    const currentStep = progress?.currentStep || 'TRAILER';
    const studentLevel = progress?.level || 'UNASSIGNED';
    const currentTopicIdx = progress?.currentTopicIndex || 0;
    const currentTopic = topics[currentTopicIdx] || topics[0];

    // Helper to update progress step on server & local state
    const saveStep = async (newStep, newTopicIdx = currentTopicIdx) => {
        try {
            const res = await apiClient.post('/api/adaptive/step/update', {
                userId: targetUserId,
                chapterId: targetChapterId,
                step: newStep,
                topicIndex: newTopicIdx
            });
            setProgress(res.data);
        } catch (err) {
            console.error('Error saving step:', err);
        }
    };

    // ── STEP 1: Watch Trailer ──
    const handleTrailerComplete = () => {
        saveStep('INITIAL_ASSESSMENT');
    };

    // ── STEP 2: Initial Assessment ──
    const handleSelectInitialOption = (qIdx, optionIdx) => {
        setInitialAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
    };

    const handleSubmitInitialAssessment = async () => {
        setIsSubmittingInitial(true);
        try {
            const processedAnswers = initialAssessment.questions.map((q, idx) => {
                const selected = initialAnswers[idx];
                return {
                    questionIndex: idx,
                    topicId: q.topicId,
                    selectedOption: selected,
                    isCorrect: selected === q.correctAnswer
                };
            });

            const res = await apiClient.post('/api/adaptive/initial-assessment/submit', {
                userId: targetUserId,
                chapterId: targetChapterId,
                answers: processedAnswers
            });

            setProgress(res.data.progress);
        } catch (err) {
            console.error('Error submitting initial assessment:', err);
        } finally {
            setIsSubmittingInitial(false);
        }
    };

    // ── STEP 3: Level Result -> Start Path ──
    const handleStartPersonalizedPath = () => {
        if (studentLevel === 'HIGH') {
            saveStep('MAIN_PPT');
        } else {
            saveStep('MICRO_CONTENT', 0);
        }
    };

    // ── STEP 4: Micro Content Completed -> Take Topic MCQ ──
    const handleCompleteMicroContent = () => {
        setTopicAnswers({});
        setTopicQuestionIdx(0);
        setTopicSubmitted(false);
        setTopicResult(null);
        saveStep('TOPIC_MCQ');
    };

    // ── STEP 5: Topic MCQ Submission ──
    const handleSelectTopicOption = (qIdx, optionIdx) => {
        setTopicAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
    };

    const handleSubmitTopicAssessment = async () => {
        const questions = currentTopic.questions || [];
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (topicAnswers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });

        const scorePercentage = Math.round((correctCount / (questions.length || 1)) * 100);
        setTopicResult({ score: correctCount, max: questions.length, percentage: scorePercentage });
        setTopicSubmitted(true);
    };

    const handleNextTopic = async () => {
        try {
            const res = await apiClient.post('/api/adaptive/topic/complete', {
                userId: targetUserId,
                chapterId: targetChapterId,
                topicId: currentTopic._id,
                totalTopics: topics.length
            });
            setProgress(res.data);
            setTopicAnswers({});
            setTopicQuestionIdx(0);
            setTopicSubmitted(false);
            setTopicResult(null);
        } catch (err) {
            console.error('Error proceeding to next topic:', err);
        }
    };

    // ── STEP 6: Main PPT Complete (HIGH Level) ──
    const handleCompleteMainPpt = () => {
        saveStep('FINAL_ASSESSMENT');
    };

    // ── STEP 7: Final Assessment Submission ──
    const handleSelectFinalOption = (qIdx, optionIdx) => {
        setFinalAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
    };

    const handleSubmitFinalAssessment = async () => {
        const questions = finalAssessment.questions || [];
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (finalAnswers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });

        const scorePercentage = Math.round((correctCount / (questions.length || 1)) * 100);
        setFinalResult({ score: correctCount, max: questions.length, percentage: scorePercentage });
        setFinalSubmitted(true);

        try {
            const res = await apiClient.post('/api/adaptive/final-assessment/submit', {
                userId: targetUserId,
                chapterId: targetChapterId,
                score: correctCount,
                maxScore: questions.length
            });
            setProgress(res.data);
        } catch (err) {
            console.error('Error submitting final assessment:', err);
        }
    };

    // ── Stepper Indicator ──
    const getStepBadge = (stepKey) => {
        if (currentStep === stepKey) return { background: 'var(--primary)', color: '#fff', fontWeight: 700 };
        return { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' };
    };

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            
            {/* Header Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', fontWeight: 600 }}>
                        Class 12 • Mathematics
                    </span>
                    {studentLevel !== 'UNASSIGNED' && (
                        <span style={{
                            fontSize: '0.85rem', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 700,
                            background: studentLevel === 'HIGH' ? 'rgba(16,185,129,0.15)' : studentLevel === 'MEDIUM' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                            color: studentLevel === 'HIGH' ? '#10b981' : studentLevel === 'MEDIUM' ? '#f59e0b' : '#ef4444',
                            border: `1px solid ${studentLevel === 'HIGH' ? '#10b981' : studentLevel === 'MEDIUM' ? '#f59e0b' : '#ef4444'}55`
                        }}>
                            Level: {studentLevel}
                        </span>
                    )}
                </div>
            </div>

            {/* Title Banner */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(168,85,247,0.08) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--primary)', borderRadius: '14px', color: '#fff' }}>
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h2 className="heading-gradient" style={{ fontSize: '2rem', margin: 0 }}>
                            {chapterData.chapterName || 'Chapter 2: Complex Numbers'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                            Adaptive Learning Path • Initial Diagnostic → Level Classification → Personalized Content
                        </p>
                    </div>
                </div>
            </div>

            {/* ── STEP 1: CHAPTER TRAILER VIDEO ── */}
            {currentStep === 'TRAILER' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(37,99,235,0.15)', color: 'var(--primary)' }}>
                            <Video size={22} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{trailer.title}</h3>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>5-Minute Essential Overview</span>
                        </div>
                    </div>

                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        {trailer.description}
                    </p>

                    {/* Video Player */}
                    <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#000', marginBottom: '2rem', boxShadow: '0 12px 30px rgba(0,0,0,0.3)', border: '1px solid var(--card-border)' }}>
                        <video controls style={{ width: '100%', maxHeight: '420px', display: 'block' }} src={trailer.videoUrl}>
                            Your browser does not support HTML5 video playback.
                        </video>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleTrailerComplete} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 1.8rem', fontSize: '1rem', borderRadius: '12px' }}>
                            Complete Trailer & Take Initial Assessment <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── STEP 2: INITIAL ASSESSMENT ── */}
            {currentStep === 'INITIAL_ASSESSMENT' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{initialAssessment.title}</h3>
                            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                                Question {initialQuestionIdx + 1} of {initialAssessment.questions.length} • Evaluates Topic Knowledge
                            </p>
                        </div>
                        <span style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                            Diagnostic Assessment
                        </span>
                    </div>

                    {/* Question Card */}
                    {(() => {
                        const currentQ = initialAssessment.questions[initialQuestionIdx];
                        if (!currentQ) return null;

                        return (
                            <div>
                                <div style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'inline-block', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                                    Mapped Topic: {currentQ.topicName}
                                </div>

                                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                    {initialQuestionIdx + 1}. {currentQ.questionText}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                                    {currentQ.options.map((opt, optIdx) => {
                                        const isSelected = initialAnswers[initialQuestionIdx] === optIdx;
                                        return (
                                            <div
                                                key={optIdx}
                                                onClick={() => handleSelectInitialOption(initialQuestionIdx, optIdx)}
                                                style={{
                                                    padding: '1rem 1.25rem',
                                                    borderRadius: '12px',
                                                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--card-border)'}`,
                                                    background: isSelected ? 'rgba(37,99,235,0.12)' : 'rgba(255,255,255,0.02)',
                                                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                                    cursor: 'pointer',
                                                    fontWeight: isSelected ? 600 : 400,
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem'
                                                }}
                                            >
                                                <div style={{
                                                    width: '24px', height: '24px', borderRadius: '50%',
                                                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.8rem', fontWeight: 700
                                                }}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </div>
                                                <span>{opt}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Stepper Navigation */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button
                                        disabled={initialQuestionIdx === 0}
                                        onClick={() => setInitialQuestionIdx(prev => prev - 1)}
                                        style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', border: '1px solid var(--card-border)', cursor: initialQuestionIdx === 0 ? 'not-allowed' : 'pointer', opacity: initialQuestionIdx === 0 ? 0.5 : 1 }}
                                    >
                                        Previous
                                    </button>

                                    {initialQuestionIdx < initialAssessment.questions.length - 1 ? (
                                        <button
                                            onClick={() => setInitialQuestionIdx(prev => prev + 1)}
                                            className="btn-primary"
                                            style={{ padding: '0.6rem 1.4rem', borderRadius: '10px' }}
                                        >
                                            Next Question <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            disabled={isSubmittingInitial || Object.keys(initialAnswers).length < initialAssessment.questions.length}
                                            onClick={handleSubmitInitialAssessment}
                                            className="btn-primary"
                                            style={{ padding: '0.75rem 1.6rem', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                        >
                                            {isSubmittingInitial ? 'Evaluating Performance...' : 'Submit Assessment & Analyze'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </motion.div>
            )}

            {/* ── STEP 3: LEVEL & TOPIC-LEVEL ANALYSIS ── */}
            {currentStep === 'LEVEL_RESULT' && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 1rem',
                            background: studentLevel === 'HIGH' ? 'rgba(16,185,129,0.15)' : studentLevel === 'MEDIUM' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: studentLevel === 'HIGH' ? '#10b981' : studentLevel === 'MEDIUM' ? '#f59e0b' : '#ef4444'
                        }}>
                            <Award size={36} />
                        </div>

                        <h3 style={{ fontSize: '1.8rem', margin: 0 }}>Initial Assessment Complete!</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Overall Score: <strong style={{ color: 'var(--text-main)' }}>{progress?.initialScore} / {progress?.initialMaxScore} ({progress?.initialPercentage}%)</strong>
                        </p>

                        <div style={{
                            display: 'inline-block', margin: '1rem 0', padding: '0.5rem 1.5rem', borderRadius: '999px', fontWeight: 800, fontSize: '1.1rem',
                            background: studentLevel === 'HIGH' ? 'rgba(16,185,129,0.2)' : studentLevel === 'MEDIUM' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                            color: studentLevel === 'HIGH' ? '#10b981' : studentLevel === 'MEDIUM' ? '#f59e0b' : '#ef4444',
                            border: `2px solid ${studentLevel === 'HIGH' ? '#10b981' : studentLevel === 'MEDIUM' ? '#f59e0b' : '#ef4444'}`
                        }}>
                            Performance Level: {studentLevel}
                        </div>

                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {studentLevel === 'HIGH'
                                ? 'Outstanding performance! You have unlocked the Fast-Track Pathway. You will review the Complete Chapter Master PPT and proceed directly to the Final Assessment.'
                                : 'We have generated a personalized topic-by-topic micro-learning pathway for you. You will complete each topic’s micro-content PPT followed by its topic assessment.'}
                        </p>
                    </div>

                    {/* Topic-Level Performance Breakdown */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                            Topic-Level Performance Breakdown
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {topics.map((t, idx) => {
                                const topicPerf = progress?.topicPerformance?.[t._id] || progress?.topicPerformance?.get?.(t._id) || { score: 0, maxScore: 1, percentage: 0 };
                                const pct = topicPerf.percentage !== undefined ? topicPerf.percentage : 0;

                                return (
                                    <div key={t._id} style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                            <span>Topic {idx + 1}: {t.topicName}</span>
                                            <span style={{ color: pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444' }}>{pct}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', background: pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444', transition: 'width 0.5s ease' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button onClick={handleStartPersonalizedPath} className="btn-primary" style={{ padding: '1rem 2.2rem', fontSize: '1.05rem', borderRadius: '12px' }}>
                            Start My Personalized Learning Path <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── STEP 4: MICRO CONTENT (LOW & MEDIUM FLOW) ── */}
            {currentStep === 'MICRO_CONTENT' && currentTopic && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Topic {currentTopicIdx + 1} of {topics.length}
                            </span>
                            <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.5rem' }}>{currentTopic.topicName}</h3>
                        </div>
                        <span style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                            Micro Content PPT
                        </span>
                    </div>

                    {/* PPT / Document Viewer */}
                    <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--card-border)', background: '#111', height: '480px', marginBottom: '2rem' }}>
                        <iframe
                            src={currentTopic.microPptUrl}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title={currentTopic.topicName}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <a href={currentTopic.microPptUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'underline', fontSize: '0.9rem' }}>
                            Open PPT in full screen
                        </a>

                        <button onClick={handleCompleteMicroContent} className="btn-primary" style={{ padding: '0.85rem 1.8rem', borderRadius: '12px', fontSize: '1rem' }}>
                            Complete Topic & Take Assessment <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── STEP 5: TOPIC MCQ (LOW & MEDIUM FLOW) ── */}
            {currentStep === 'TOPIC_MCQ' && currentTopic && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                            Topic {currentTopicIdx + 1} Assessment
                        </span>
                        <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.4rem' }}>{currentTopic.topicName}</h3>
                    </div>

                    {!topicSubmitted ? (
                        (() => {
                            const questions = currentTopic.questions || [];
                            const currentQ = questions[topicQuestionIdx];
                            if (!currentQ) return <p>No questions available for this topic.</p>;

                            return (
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                                        Question {topicQuestionIdx + 1} of {questions.length}: {currentQ.questionText}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                                        {currentQ.options.map((opt, optIdx) => {
                                            const isSelected = topicAnswers[topicQuestionIdx] === optIdx;
                                            return (
                                                <div
                                                    key={optIdx}
                                                    onClick={() => handleSelectTopicOption(topicQuestionIdx, optIdx)}
                                                    style={{
                                                        padding: '1rem 1.25rem',
                                                        borderRadius: '12px',
                                                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--card-border)'}`,
                                                        background: isSelected ? 'rgba(37,99,235,0.12)' : 'rgba(255,255,255,0.02)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {String.fromCharCode(65 + optIdx)}. {opt}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button
                                            disabled={topicQuestionIdx === 0}
                                            onClick={() => setTopicQuestionIdx(prev => prev - 1)}
                                            style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', border: '1px solid var(--card-border)', opacity: topicQuestionIdx === 0 ? 0.5 : 1 }}
                                        >
                                            Previous
                                        </button>

                                        {topicQuestionIdx < questions.length - 1 ? (
                                            <button onClick={() => setTopicQuestionIdx(prev => prev + 1)} className="btn-primary" style={{ padding: '0.6rem 1.4rem', borderRadius: '10px' }}>
                                                Next
                                            </button>
                                        ) : (
                                            <button onClick={handleSubmitTopicAssessment} className="btn-primary" style={{ padding: '0.75rem 1.6rem', borderRadius: '10px', background: '#10b981' }}>
                                                Submit Topic Assessment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                            <h3>Topic Assessment Complete!</h3>
                            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                                Score: {topicResult?.score} / {topicResult?.max} ({topicResult?.percentage}%)
                            </p>

                            <button onClick={handleNextTopic} className="btn-primary" style={{ marginTop: '1.5rem', padding: '0.85rem 2rem', borderRadius: '12px' }}>
                                {currentTopicIdx + 1 < topics.length ? 'Continue to Next Topic →' : 'Proceed to Final Assessment →'}
                            </button>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ── STEP 6: MAIN CHAPTER PPT (HIGH FLOW) ── */}
            {currentStep === 'MAIN_PPT' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                                HIGH Level Fast-Track Pathway
                            </span>
                            <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.5rem' }}>{mainPpt.title}</h3>
                        </div>
                        <span style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                            Complete Master PPT
                        </span>
                    </div>

                    <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--card-border)', background: '#111', height: '520px', marginBottom: '2rem' }}>
                        <iframe
                            src={mainPpt.pdfUrl}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title={mainPpt.title}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleCompleteMainPpt} className="btn-primary" style={{ padding: '0.9rem 2rem', borderRadius: '12px', fontSize: '1rem', background: '#10b981' }}>
                            Proceed to Final Chapter Assessment <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ── STEP 7: FINAL ASSESSMENT (ALL FLOWS) ── */}
            {(currentStep === 'FINAL_ASSESSMENT' || currentStep === 'COMPLETED') && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{finalAssessment.title}</h3>
                        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                            Comprehensive Chapter 2 Assessment • Covers All 6 Topics
                        </p>
                    </div>

                    {!finalSubmitted && currentStep !== 'COMPLETED' ? (
                        (() => {
                            const questions = finalAssessment.questions || [];
                            const currentQ = questions[finalQuestionIdx];
                            if (!currentQ) return null;

                            return (
                                <div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                                        Question {finalQuestionIdx + 1} of {questions.length}: {currentQ.questionText}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                                        {currentQ.options.map((opt, optIdx) => {
                                            const isSelected = finalAnswers[finalQuestionIdx] === optIdx;
                                            return (
                                                <div
                                                    key={optIdx}
                                                    onClick={() => handleSelectFinalOption(finalQuestionIdx, optIdx)}
                                                    style={{
                                                        padding: '1rem 1.25rem',
                                                        borderRadius: '12px',
                                                        border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--card-border)'}`,
                                                        background: isSelected ? 'rgba(37,99,235,0.12)' : 'rgba(255,255,255,0.02)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {String.fromCharCode(65 + optIdx)}. {opt}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button
                                            disabled={finalQuestionIdx === 0}
                                            onClick={() => setFinalQuestionIdx(prev => prev - 1)}
                                            style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', border: '1px solid var(--card-border)', opacity: finalQuestionIdx === 0 ? 0.5 : 1 }}
                                        >
                                            Previous
                                        </button>

                                        {finalQuestionIdx < questions.length - 1 ? (
                                            <button onClick={() => setFinalQuestionIdx(prev => prev + 1)} className="btn-primary" style={{ padding: '0.6rem 1.4rem', borderRadius: '10px' }}>
                                                Next Question
                                            </button>
                                        ) : (
                                            <button onClick={handleSubmitFinalAssessment} className="btn-primary" style={{ padding: '0.75rem 1.8rem', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                                Submit Final Assessment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <Award size={64} style={{ color: '#10b981', marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>Chapter 2 Mastered! 🏆</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                Final Score: <strong style={{ color: '#10b981' }}>{progress?.finalScore || finalResult?.score} / {progress?.finalMaxScore || finalResult?.max} ({progress?.finalPercentage || finalResult?.percentage}%)</strong>
                            </p>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <Link to="/dashboard" className="btn-primary" style={{ padding: '0.85rem 2rem', borderRadius: '12px', textDecoration: 'none' }}>
                                    Return to Dashboard
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

        </div>
    );
};

export default ChapterAdaptivePage;
