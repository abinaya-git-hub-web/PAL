import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { motion } from 'framer-motion';
import { BookOpen, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProgression } from '../hooks/useProgression';
import { normalizeId } from '../utils/progressionEngine';
import ChapterCard from '../components/ChapterCard';

const SubjectPage = () => {
    const { id } = useParams();
    const { themeConfig } = useTheme();

    const terminology = themeConfig?.terminology || {
        chapter: 'Chapter',
        topic: 'Topic',
        complete: 'Completed',
        locked: 'Locked',
        progress: 'Progress',
    };

    // Subject metadata fetched separately (hook does not expose it)
    const [subject, setSubject] = useState({ name: 'Subject' });
    useEffect(() => {
        if (!id) return;
        apiClient.get('/api/subjects')
            .then(res => {
                const found = Array.isArray(res.data) && res.data.find(s => normalizeId(s._id || s.id) === normalizeId(id));
                if (found) setSubject(found);
            })
            .catch(() => {});
    }, [id]);

    // Progression engine integration
    const {
        loading,
        error,
        chapters,
        currentChapter,
        nextAction,
        getChapterState,
        getChapterProgress,
        getTopicState,
    } = useProgression(id);

    const isSubjectComplete = nextAction?.type === 'SUBJECT_COMPLETE';

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '6rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                            {/* Skeleton node */}
                            <div style={{
                                width: '4rem', height: '4rem', borderRadius: '50%',
                                background: 'rgba(128,128,128,0.15)',
                                flexShrink: 0, marginTop: '1rem',
                                animation: 'pulse 1.5s ease-in-out infinite',
                            }} />
                            {/* Skeleton card */}
                            <div className="glass-card" style={{
                                flexGrow: 1, height: '160px', borderRadius: '12px',
                                animation: 'pulse 1.5s ease-in-out infinite',
                                opacity: 0.5,
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Error state ────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
                <div className="glass-card" style={{ padding: '2rem', maxWidth: '420px', margin: '0 auto' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Failed to load roadmap. Please try again.
                    </p>
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
                </div>
            </div>
        );
    }

    const currentChapterId = currentChapter ? normalizeId(currentChapter._id || currentChapter.id) : null;

    return (
        <div className="container" style={{ paddingTop: '6rem' }}>

            {/* ── Page header ── */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(37,99,235,0.1)', borderRadius: '1rem', color: 'var(--primary)' }}>
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <h2 className="heading-gradient" style={{ fontSize: '2.5rem' }}>
                            {subject.name} Roadmap
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Master each {terminology.chapter.toLowerCase()} to unlock the next.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Subject Complete banner ── */}
            {isSubjectComplete && (
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{
                        marginBottom: '2rem',
                        padding: '1.5rem 2rem',
                        border: '2px solid #10b981',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        background: 'rgba(16,185,129,0.07)',
                    }}
                >
                    <Trophy size={28} style={{ color: '#10b981', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#10b981' }}>
                            Subject Complete!
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            You have mastered all {terminology.chapter.toLowerCase()}s in this subject.
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── Empty state ── */}
            {chapters.length === 0 ? (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        No {terminology.chapter.toLowerCase()}s found for this subject.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', position: 'relative' }}>
                    {/* Visual connection line */}
                    <div style={{
                        position: 'absolute', left: '2rem', top: '2rem', bottom: '2rem',
                        width: '2px', background: 'var(--card-border)', zIndex: 0,
                    }} />

                    {chapters.map((chapter, index) => {
                        const chapterIdStr   = normalizeId(chapter._id || chapter.id);
                        const chapterState   = getChapterState(chapter);
                        const chapterProgress = getChapterProgress(chapter);
                        const isCurrent      = currentChapterId !== null && currentChapterId === chapterIdStr;

                        return (
                            <ChapterCard
                                key={chapterIdStr}
                                chapter={chapter}
                                chapterIndex={index}
                                chapterState={chapterState}
                                chapterProgress={chapterProgress}
                                getTopicState={getTopicState}
                                nextAction={nextAction}
                                terminology={terminology}
                                themeConfig={themeConfig}
                                isCurrentChapter={isCurrent}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SubjectPage;

