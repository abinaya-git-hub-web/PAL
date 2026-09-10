import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Lock, CheckCircle, PlayCircle, BookOpen,
    Zap, Target, AlertCircle, Clock, ChevronRight, ShieldAlert, Award, Star, Flame, Sparkles
} from 'lucide-react';
import { normalizeId } from '../utils/progressionEngine';

// ─── Card shape → border-radius mapping (from experiences.js tokens) ──────────
const CARD_SHAPE_RADIUS = {
    sharp: '4px',
    rounded: '12px',
    'rounded-xl': '20px',
    pill: '32px',
};

// ─── Button style → border-radius mapping ───────────────────────────────────────
const BUTTON_SHAPE_RADIUS = {
    square: '4px',
    rounded: '8px',
    pill: '9999px',
};

// ─── Roman numeral helper for Cinematic Act numbers ───────────────────────────
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// ─── Theme-aware CTA labels ────────────────────────────────────────────────────
const ACTION_LABELS = {
    START_TOPIC:         { default: 'Start Topic', gamified: 'Begin Quest', cinematic: 'Enter Scene' },
    CONTINUE_LEARNING:   { default: 'Continue Learning', gamified: 'Resume Quest', cinematic: 'Continue Scene' },
    START_PRACTICE:      { default: 'Start Practice', gamified: 'Practice Skill', cinematic: 'Rehearse Scene' },
    TAKE_ASSESSMENT:     { default: 'Take Assessment', gamified: 'Challenge Boss Battle', cinematic: 'Enter Audition' },
    REVIEW_TOPIC:        { default: 'Review Topic', gamified: 'Review Quest Material', cinematic: 'Review Scene Notes' },
    RETRY_ASSESSMENT:    { default: 'Retry Assessment', gamified: 'Retry Boss Battle', cinematic: 'Retry Audition' },
    START_NEXT_TOPIC:    { default: 'Next Topic', gamified: 'Next Quest', cinematic: 'Next Scene' },
    START_NEXT_CHAPTER:  {
        professional: 'Start Next Chapter',
        gamified:     'Unlock Next Level',
        cinematic:    'Begin Next Act',
        default:      'Start Next Chapter',
    },
};

function getCtaLabel(actionType, experience) {
    const labels = ACTION_LABELS[actionType];
    if (!labels) return 'Continue';
    return labels[experience] || labels.default;
}

// ─── Topic state config (icons, colors, badges) ────────────────────────────────
function getTopicStateConfig(state, terminology = {}) {
    switch (state) {
        case 'PASSED':
            return {
                Icon: CheckCircle,
                color: '#10b981',
                badgeBg: 'rgba(16,185,129,0.12)',
                label: terminology.complete || 'Passed',
                borderColor: '#10b981'
            };
        case 'NEEDS_REVISION':
            return {
                Icon: ShieldAlert,
                color: '#ef4444',
                badgeBg: 'rgba(239,68,68,0.12)',
                label: 'Needs Revision',
                borderColor: '#ef4444'
            };
        case 'ASSESSMENT_READY':
            return {
                Icon: Target,
                color: '#f59e0b',
                badgeBg: 'rgba(245,158,11,0.15)',
                label: terminology.assessment || 'Assessment Ready',
                borderColor: '#f59e0b'
            };
        case 'PRACTICING':
            return {
                Icon: Zap,
                color: 'var(--primary)',
                badgeBg: 'rgba(37,99,235,0.12)',
                label: 'Practicing',
                borderColor: 'var(--primary)'
            };
        case 'LEARNING':
            return {
                Icon: BookOpen,
                color: 'var(--primary)',
                badgeBg: 'rgba(37,99,235,0.12)',
                label: 'Learning',
                borderColor: 'var(--primary)'
            };
        case 'LOCKED':
            return {
                Icon: Lock,
                color: 'var(--text-muted)',
                badgeBg: 'rgba(255,255,255,0.05)',
                label: terminology.locked || 'Locked',
                borderColor: 'transparent'
            };
        case 'NOT_STARTED':
        default:
            return {
                Icon: PlayCircle,
                color: 'var(--text-muted)',
                badgeBg: 'rgba(255,255,255,0.05)',
                label: 'Not Started',
                borderColor: 'transparent'
            };
    }
}

// ─── Progress Renderers ────────────────────────────────────────────────────────
function ProgressBar({ progressPercentage, statusColor }) {
    return (
        <div style={{
            height: '8px', background: 'rgba(128,128,128,0.2)',
            borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem',
        }}>
            <div style={{
                width: `${progressPercentage}%`, height: '100%',
                background: statusColor, borderRadius: '4px',
                transition: 'width 0.5s ease',
            }} />
        </div>
    );
}

function ProgressOrbs({ topics, getTopicState, chapter, terminology }) {
    return (
        <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
            marginBottom: '1.5rem', alignItems: 'center',
            background: 'var(--input-bg)', padding: '0.6rem 1rem', borderRadius: '12px',
            border: '1px solid var(--card-border)'
        }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.5rem' }}>
                {terminology.progress || 'XP'} Nodes:
            </span>
            {topics.map((topic) => {
                const state = getTopicState(topic, chapter);
                const { color } = getTopicStateConfig(state, terminology);
                const isEmpty = state === 'NOT_STARTED' || state === 'LOCKED';
                return (
                    <div
                        key={normalizeId(topic._id || topic.id)}
                        title={`${topic.topicName || topic.title}: ${state}`}
                        style={{
                            width: '14px', height: '14px', borderRadius: '50%',
                            background: isEmpty ? 'rgba(128,128,128,0.25)' : color,
                            border: `2px solid ${color}`,
                            boxShadow: isEmpty ? 'none' : `0 0 8px ${color}`,
                            flexShrink: 0, transition: 'all 0.3s',
                        }}
                    />
                );
            })}
        </div>
    );
}

function ProgressFilmStrip({ topics, getTopicState, chapter, terminology }) {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
                display: 'flex', gap: '3px', borderRadius: '4px', overflow: 'hidden',
                background: '#000', padding: '3px', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {topics.map((topic) => {
                    const state = getTopicState(topic, chapter);
                    const { color } = getTopicStateConfig(state, terminology);
                    const isEmpty = state === 'NOT_STARTED' || state === 'LOCKED';
                    return (
                        <div
                            key={normalizeId(topic._id || topic.id)}
                            title={`${topic.topicName || topic.title}: ${state}`}
                            style={{
                                flex: 1, height: '12px',
                                background: isEmpty ? 'rgba(255,255,255,0.15)' : color,
                                transition: 'all 0.3s',
                            }}
                        />
                    );
                })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Scene 1</span>
                <span>Scene {topics.length}</span>
            </div>
        </div>
    );
}

// ─── ChapterCard Component ─────────────────────────────────────────────────────
const ChapterCard = ({
    chapter,
    chapterIndex,
    chapterState,
    chapterProgress,
    getTopicState,
    nextAction,
    terminology,
    themeConfig,
    isCurrentChapter,
}) => {
    const topics          = chapter.topics || [];
    const isLocked        = chapterState === 'LOCKED';
    const isCompleted     = chapterState === 'COMPLETED';
    const experience      = themeConfig?.experience    || 'professional';
    const cardShape       = themeConfig?.cardShape     || 'rounded';
    const cardBorder      = themeConfig?.cardBorder    || 'subtle';
    const progressStyle   = themeConfig?.progressStyle || 'bar';
    const buttonStyle     = themeConfig?.buttonStyle   || 'rounded';
    const microClass      = themeConfig?.micro ? `micro-${themeConfig.micro}` : '';
    const borderRadius    = CARD_SHAPE_RADIUS[cardShape] || '12px';
    const btnRadius       = BUTTON_SHAPE_RADIUS[buttonStyle] || '8px';
    const { progressPercentage, completedTopics } = chapterProgress;

    // Node & accent status colors
    let statusColor = 'var(--primary)';
    if (isCompleted) statusColor = '#10b981';
    else if (isLocked) statusColor = 'var(--text-muted)';

    // Card border evaluation
    let cardBorderValue = `1px solid var(--card-border)`;
    if (isCurrentChapter) {
        cardBorderValue = `2px solid ${statusColor}`;
    } else if (cardBorder === 'glow' || cardBorder === 'accent') {
        cardBorderValue = `1px solid ${statusColor}`;
    } else if (cardBorder === 'none') {
        cardBorderValue = '1px solid transparent';
    }

    const cardBoxShadow = isCurrentChapter
        ? `0 0 0 2px var(--primary), 0 0 24px var(--theme-accent-glow, rgba(37,99,235,0.2))`
        : undefined;

    // Check if this chapter holds the next action
    const chapterIdStr = normalizeId(chapter._id || chapter.id);
    const isNextActionChapter =
        nextAction &&
        nextAction.type !== 'SUBJECT_COMPLETE' &&
        normalizeId(nextAction.chapterId) === chapterIdStr;

    // Display chapter heading based on experience
    const chapterNumberStr = experience === 'cinematic'
        ? `ACT ${ROMAN_NUMERALS[chapterIndex] || (chapterIndex + 1)}`
        : experience === 'gamified'
            ? `${terminology.chapter || 'LEVEL'} ${chapterIndex + 1}`
            : `${terminology.chapter || 'Chapter'} ${chapterIndex + 1}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: chapterIndex * 0.07 }}
            style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1.5rem' }}
        >
            {/* ── Roadmap Node Icon ── */}
            <div style={{
                width: '4rem', height: '4rem', borderRadius: experience === 'gamified' ? '1rem' : '50%',
                background: isCompleted
                    ? 'rgba(16,185,129,0.15)'
                    : isLocked
                        ? 'var(--surface)'
                        : 'rgba(37,99,235,0.15)',
                border: `2px solid ${statusColor}`,
                boxShadow: isCurrentChapter ? `0 0 12px ${statusColor}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: statusColor, flexShrink: 0, marginTop: '1rem',
            }}>
                {isCompleted ? (
                    experience === 'gamified' ? <Award size={24} /> : <CheckCircle size={24} />
                ) : isLocked ? (
                    <Lock size={22} />
                ) : (
                    experience === 'cinematic' ? <Sparkles size={24} /> : <PlayCircle size={24} />
                )}
            </div>

            {/* ── Chapter Main Card ── */}
            <div
                className={`glass-card ${microClass}`}
                style={{
                    flexGrow: 1,
                    padding: '1.75rem',
                    border: cardBorderValue,
                    borderRadius,
                    opacity: isLocked ? 0.55 : 1,
                    boxShadow: cardBoxShadow,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Visual accent bar for Gamified / Cinematic modes */}
                {experience === 'gamified' && isCurrentChapter && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                        background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
                    }} />
                )}
                {experience === 'cinematic' && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
                        background: isCurrentChapter ? statusColor : 'transparent',
                    }} />
                )}

                {/* Current Chapter Badge */}
                {isCurrentChapter && (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        fontSize: '0.72rem', fontWeight: 700,
                        color: statusColor,
                        background: 'rgba(37,99,235,0.12)',
                        padding: '4px 12px', borderRadius: '20px',
                        marginBottom: '0.85rem',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        border: `1px solid ${statusColor}`,
                    }}>
                        {experience === 'gamified' && <Flame size={12} />}
                        {experience === 'cinematic' && <Star size={12} />}
                        Current {terminology.chapter || 'Chapter'}
                    </div>
                )}

                {/* Header Row */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', flexWrap: 'wrap',
                    gap: '1rem', marginBottom: '1.5rem',
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                            <span style={{
                                fontSize: '0.82rem', fontWeight: 700,
                                color: statusColor,
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                            }}>
                                {chapterNumberStr}
                            </span>
                            {isLocked && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    background: 'rgba(255,255,255,0.06)',
                                    padding: '2px 8px', borderRadius: '4px',
                                    color: 'var(--text-muted)',
                                }}>
                                    {terminology.locked || 'Locked'}
                                </span>
                            )}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text)' }}>
                            {chapter.chapterName}
                        </h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem', justifyContent: 'flex-end'
                        }}>
                            <Clock size={15} /> {topics.length * 1.5}h
                        </div>
                        <div style={{ fontWeight: 700, color: statusColor, fontSize: '0.95rem' }}>
                            {isCompleted
                                ? (terminology.complete || 'Completed')
                                : `${completedTopics}/${topics.length} ${terminology.topic}s (${progressPercentage}%)`}
                        </div>
                    </div>
                </div>

                {/* Progress Visualizer */}
                {progressStyle === 'orbs' ? (
                    <ProgressOrbs topics={topics} getTopicState={getTopicState} chapter={chapter} terminology={terminology} />
                ) : progressStyle === 'film-strip' ? (
                    <ProgressFilmStrip topics={topics} getTopicState={getTopicState} chapter={chapter} terminology={terminology} />
                ) : (
                    <ProgressBar progressPercentage={progressPercentage} statusColor={statusColor} />
                )}

                {/* Topics Grid */}
                {topics.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No topics available.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '0.85rem',
                        marginBottom: isNextActionChapter ? '1.5rem' : 0,
                    }}>
                        {topics.map((topic, i) => {
                            const topicState = getTopicState(topic, chapter);
                            const { Icon, color, badgeBg, label, borderColor } = getTopicStateConfig(topicState, terminology);
                            const isTopicLocked = topicState === 'LOCKED';
                            const topicIdStr = normalizeId(topic._id || topic.id);
                            const topicTitle = topic.topicName || topic.title || 'Topic';

                            return (
                                <Link
                                    key={topicIdStr}
                                    to={isTopicLocked ? '#' : `/topic/${topicIdStr}`}
                                    aria-disabled={isTopicLocked}
                                    tabIndex={isTopicLocked ? -1 : undefined}
                                    style={{
                                        textDecoration: 'none',
                                        pointerEvents: isTopicLocked ? 'none' : 'auto',
                                    }}
                                >
                                    <div style={{
                                        padding: '0.9rem 1rem',
                                        background: 'var(--input-bg)',
                                        borderRadius: '0.6rem',
                                        display: 'flex', flexDirection: 'column', gap: '0.5rem',
                                        border: `1px solid ${borderColor}`,
                                        transition: 'all 0.2s ease',
                                        cursor: isTopicLocked ? 'not-allowed' : 'pointer',
                                        opacity: isTopicLocked ? 0.6 : 1,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ color, flexShrink: 0 }}>
                                                <Icon size={18} />
                                            </div>
                                            <span style={{
                                                color: isTopicLocked ? 'var(--text-muted)' : 'var(--text)',
                                                fontSize: '0.92rem', fontWeight: 600, flex: 1,
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                            }}>
                                                {i + 1}. {topicTitle}
                                            </span>
                                        </div>

                                        {/* Topic state pill tag */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 600,
                                                padding: '2px 8px', borderRadius: '4px',
                                                background: badgeBg, color,
                                                display: 'inline-block'
                                            }}>
                                                {label}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Adaptive Learning Journey CTA Banner for Chapter 2 */}
                {(chapter.order === 2 || chapterIndex === 1) && !isLocked && (
                    <div style={{
                        marginTop: '1.5rem',
                        borderTop: '1px solid var(--card-border)',
                        paddingTop: '1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '1rem',
                        background: 'rgba(37,99,235,0.06)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(37,99,235,0.2)'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Sparkles size={14} /> Adaptive Learning Experience
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                                Trailer → Diagnostic MCQ → Level Analysis (LOW/MED/HIGH) → Adaptive Path
                            </div>
                        </div>
                        <Link
                            to={`/chapter/${chapterIdStr}/adaptive`}
                            className="btn btn-primary"
                            style={{
                                borderRadius: btnRadius,
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.8rem 1.6rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                                color: '#fff', textDecoration: 'none'
                            }}
                        >
                            Start Adaptive Learning Flow <ChevronRight size={18} />
                        </Link>
                    </div>
                )}

                {/* NextAction CTA Banner */}
                {isNextActionChapter && !isLocked && nextAction.route && (chapter.order !== 2 && chapterIndex !== 1) && (
                    <div style={{
                        marginTop: '1.5rem',
                        borderTop: '1px solid var(--card-border)',
                        paddingTop: '1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '1rem',
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                                Recommended Next Action
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                                {nextAction.title}
                            </div>
                        </div>
                        <Link
                            to={nextAction.route}
                            className="btn btn-primary"
                            style={{
                                borderRadius: btnRadius,
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.75rem 1.4rem', fontWeight: 700
                            }}
                        >
                            {getCtaLabel(nextAction.type, experience)}
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChapterCard;
