import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { HelpCircle, Play, BookOpen, Video } from 'lucide-react';

const TopicPage = () => {
    const { id } = useParams();
    const [topicDetails, setTopicDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/topics/detail/${id}`);
                setTopicDetails(res.data);
            } catch (err) {
                console.error("Error fetching topic detail:", err);
            }
        };
        fetchTopic();
    }, [id]);

    const subjectName = topicDetails?.chapterId?.subjectId?.name || 'Mathematics';
    const chapterName = topicDetails?.chapterId?.chapterName || 'Chapter 1: Applications of Matrices and Determinants';
    const topicName = topicDetails?.topicName || 'Row Echelon Form';

    return (
        <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ maxWidth: '650px', margin: '0 auto', padding: '2.5rem' }}>
                <HelpCircle size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{topicName}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                    Prove your mastery of this topic through a diagnostic test (score $\ge 70\%$ to pass and unlock the next topic), or review remedial PPT presentations and video lectures first.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to={`/assessment/${id}`} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', gap: '0.5rem' }}>
                        Start Assessment <Play size={18} fill="currentColor" />
                    </Link>
                    <Link 
                        to={`/slides/${encodeURIComponent(subjectName)}/${encodeURIComponent(chapterName)}/${encodeURIComponent(topicName)}`} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.85rem 1.75rem', gap: '0.5rem' }}
                    >
                        <BookOpen size={18} /> PPT Slides & Videos <Video size={16} color="var(--secondary)" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default TopicPage;


