import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Lock, Unlock, CheckCircle, BookOpen } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SubjectPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [chapters, setChapters] = useState([]);
    const [expandedChapter, setExpandedChapter] = useState(null);
    const [userProgress, setUserProgress] = useState([]);

    useEffect(() => {
        const fetchChaptersAndProgress = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/chapters/${id}`);
                setChapters(res.data);
                if (user?.id) {
                    const progRes = await axios.get(`http://localhost:5000/api/progress/${user.id}`);
                    setUserProgress(progRes.data || []);
                }
            } catch (err) {
                console.error("Error fetching subject data:", err);
            }
        };
        fetchChaptersAndProgress();
    }, [id, user?.id]);

    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
            <Link to="/dashboard" className="btn" style={{ marginBottom: '2rem', paddingLeft: 0 }}>← Back to Dashboard</Link>
            <h2 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Chapters</h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {chapters.map((chapter) => (
                    <div key={chapter._id}>
                        <div
                            onClick={() => setExpandedChapter(expandedChapter === chapter._id ? null : chapter._id)}
                            className="glass-card"
                            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        >
                            <h3 style={{ fontSize: '1.25rem' }}>{chapter.chapterName}</h3>
                            {expandedChapter === chapter._id ? <ChevronDown /> : <ChevronRight />}
                        </div>
                        <AnimatePresence>
                            {expandedChapter === chapter._id && (
                                <TopicsList chapterId={chapter._id} chapterName={chapter.chapterName} userProgress={userProgress} />
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TopicsList = ({ chapterId, chapterName, userProgress }) => {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/topics/${chapterId}`);
                setTopics(res.data);
            } catch (err) {
                console.error("Error fetching topics:", err);
            }
        };
        fetchTopics();
    }, [chapterId]);

    // Check if topic is passed or unlocked
    const isTopicPassed = (tId) => {
        return userProgress.some(p => (p.topicId?._id === tId || p.topicId === tId) && p.status === 'pass');
    };

    const isTopicUnlocked = (index) => {
        if (index === 0) return true; // First topic in chapter is always unlocked
        const prevTopic = topics[index - 1];
        return prevTopic ? isTopicPassed(prevTopic._id) : false;
    };

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', padding: '0.5rem 1rem' }}
        >
            {topics.map((topic, i) => {
                const unlocked = isTopicUnlocked(i);
                const passed = isTopicPassed(topic._id);

                return (
                    <div 
                        key={topic._id} 
                        style={{ 
                            padding: '1rem', 
                            borderBottom: '1px solid rgba(255,255,255,0.05)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            opacity: unlocked ? 1 : 0.5 
                        }}
                    >
                        <Link 
                            to={unlocked ? `/topic/${topic._id}` : '#'} 
                            onClick={(e) => { if (!unlocked) e.preventDefault(); }}
                            style={{ 
                                textDecoration: 'none', 
                                color: 'inherit',
                                cursor: unlocked ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                flex: 1
                            }}
                        >
                            <div style={{ 
                                width: '2rem', 
                                height: '2rem', 
                                borderRadius: '50%', 
                                background: passed ? 'var(--success)' : 'rgba(255,255,255,0.05)', 
                                color: passed ? '#fff' : 'inherit',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>
                                {i + 1}
                            </div>
                            <span>{topic.topicName}</span>
                        </Link>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {unlocked && (
                                <Link 
                                    to={`/slides/Mathematics/${encodeURIComponent(chapterName || 'Chapter 1')}/${encodeURIComponent(topic.topicName)}`}
                                    title="View Topic PPT Slides"
                                    style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', textDecoration: 'none', background: 'rgba(99, 102, 241, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.3rem' }}
                                >
                                    <BookOpen size={15} /> Slides
                                </Link>
                            )}
                            {passed ? (
                                <CheckCircle size={18} color="var(--success)" />
                            ) : unlocked ? (
                                <Unlock size={18} color="var(--primary)" />
                            ) : (
                                <Lock size={18} color="var(--text-muted)" />
                            )}
                        </div>
                    </div>
                );
            })}
        </motion.div>
    );
};

export default SubjectPage;

