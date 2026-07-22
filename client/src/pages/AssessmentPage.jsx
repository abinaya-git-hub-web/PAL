import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HelpCircle, Award, CheckCircle2, ChevronRight, Check, ExternalLink, FileText } from 'lucide-react';
import assessmentMetadataData from '../data/assessmentMetadata.json';

const AssessmentPage = () => {
    const { topicId } = useParams();
    const { user } = useContext(AuthContext);
    const [assessment, setAssessment] = useState(null);
    const [topicDetails, setTopicDetails] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [hoveredOption, setHoveredOption] = useState(null); // format: "qIdx-oIdx"
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssessmentAndTopic = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/assessment/${topicId}`);
                setAssessment(res.data);
                
                try {
                    const topRes = await axios.get(`http://localhost:5000/api/topics/detail/${topicId}`);
                    setTopicDetails(topRes.data);
                } catch (tErr) {
                    console.log("Topic detail fetch optional:", tErr);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssessmentAndTopic();
    }, [topicId]);

    const handleOptionSelect = (qIdx, oIdx) => {
        setAnswers({ ...answers, [qIdx]: oIdx });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/assessment/submit', {
                userId: user.id,
                topicId,
                answers: Object.values(answers)
            });

            if (res.data.status === 'pass') {
                alert(`Congratulations! You passed with ${res.data.score}%`);
                navigate('/dashboard');
            } else {
                alert(`Score: ${res.data.score}%. You need 70% to pass. Let's review the remedial materials.`);
                try {
                    const topDetails = topicDetails || (await axios.get(`http://localhost:5000/api/topics/detail/${topicId}`)).data;
                    const subjectName = topDetails?.chapterId?.subjectId?.name || 'Mathematics';
                    const chapterName = topDetails?.chapterId?.chapterName || 'Chapter 1';
                    const topicName = topDetails?.topicName || 'Topic';
                    navigate(`/slides/${encodeURIComponent(subjectName)}/${encodeURIComponent(chapterName)}/${encodeURIComponent(topicName)}`);
                } catch (err) {
                    console.error("Failed to fetch topic details for redirect:", err);
                    navigate(`/slides/Mathematics/Chapter/Topic`);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Loading assessment...</div>
            </div>
        );
    }

    if (!assessment || !assessment.questions || assessment.questions.length === 0) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <HelpCircle size={60} color="var(--error)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                    <h3>No assessment found</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                        This topic does not have an assessment configured yet.
                    </p>
                    <a 
                        href={assessmentMetadataData.driveAssessmentFolderUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-primary"
                    >
                        <ExternalLink size={16} /> View Assessment Files on Google Drive
                    </a>
                </div>
            </div>
        );
    }

    const totalQuestions = assessment.questions.length;
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = (answeredCount / totalQuestions) * 100;

    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];

    return (
        <div className="container" style={{ paddingTop: '3rem', maxWidth: '900px', paddingBottom: '5rem' }}>
            
            {/* Header & Progress Indicator */}
            <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="heading-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
                            {topicDetails?.topicName || 'Diagnostic Topic Assessment'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Complete all questions to prove topic mastery.
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Drive Assessment Link */}
                        <a 
                            href={assessmentMetadataData.driveAssessmentFolderUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn" 
                            style={{ 
                                gap: '0.5rem', 
                                background: 'rgba(99, 102, 241, 0.15)', 
                                border: '1px solid var(--primary)', 
                                color: '#a5b4fc',
                                fontSize: '0.85rem'
                            }}
                        >
                            <FileText size={16} /> Assessment PDF on Drive
                        </a>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                                {answeredCount} of {totalQuestions} answered
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Pass score: &ge; 70%
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                        style={{ 
                            width: `${progressPercentage}%`, 
                            height: '100%', 
                            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
                            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} 
                    />
                </div>
            </div>

            {/* Questions List */}
            {assessment.questions.map((q, qIdx) => {
                const isQuestionAnswered = answers[qIdx] !== undefined;

                return (
                    <motion.div 
                        key={qIdx} 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: qIdx * 0.05 }}
                        className="glass-card" 
                        style={{ 
                            marginBottom: '2rem', 
                            padding: '2rem',
                            border: isQuestionAnswered ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: isQuestionAnswered ? '0 8px 30px rgba(99, 102, 241, 0.05)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {/* Question Title */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ 
                                background: isQuestionAnswered ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                                color: '#ffffff',
                                minWidth: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}>
                                {qIdx + 1}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', lineHeight: '1.5', marginTop: '0.2rem' }}>
                                {q.questionText}
                            </h3>
                        </div>

                        {/* Options Grid */}
                        <div style={{ display: 'grid', gap: '0.85rem' }}>
                            {q.options.map((opt, oIdx) => {
                                const isSelected = answers[qIdx] === oIdx;
                                const isHovered = hoveredOption === `${qIdx}-${oIdx}`;

                                return (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleOptionSelect(qIdx, oIdx)}
                                        onMouseEnter={() => setHoveredOption(`${qIdx}-${oIdx}`)}
                                        onMouseLeave={() => setHoveredOption(null)}
                                        className="btn"
                                        style={{
                                            justifyContent: 'flex-start',
                                            padding: '1rem 1.25rem',
                                            borderRadius: '0.75rem',
                                            width: '100%',
                                            fontFamily: 'inherit',
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            border: isSelected 
                                                ? '1px solid transparent' 
                                                : isHovered 
                                                ? '1px solid var(--primary)' 
                                                : '1px solid rgba(255,255,255,0.08)',
                                            background: isSelected
                                                ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                                                : isHovered
                                                ? 'rgba(255,255,255,0.08)'
                                                : 'rgba(255,255,255,0.03)',
                                            color: '#ffffff',
                                            boxShadow: isSelected ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                                            transform: isHovered && !isSelected ? 'translateY(-1px)' : 'none',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}
                                    >
                                        {/* Option Letter indicator */}
                                        <div style={{
                                            width: '1.8rem',
                                            height: '1.8rem',
                                            borderRadius: '50%',
                                            background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                                            color: '#ffffff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {alphabet[oIdx]}
                                        </div>
                                        <span style={{ flex: 1 }}>{opt}</span>
                                        {isSelected && <Check size={18} color="#ffffff" style={{ marginLeft: 'auto' }} />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            })}

            {/* Submit Button */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: '3rem' }}
            >
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={answeredCount < totalQuestions}
                    style={{ 
                        width: '100%', 
                        padding: '1.25rem', 
                        fontSize: '1.2rem',
                        borderRadius: '0.75rem',
                        fontWeight: 700,
                        gap: '0.75rem',
                        background: answeredCount < totalQuestions 
                            ? 'rgba(255,255,255,0.05)' 
                            : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        color: answeredCount < totalQuestions ? 'var(--text-muted)' : '#ffffff',
                        border: 'none',
                        cursor: answeredCount < totalQuestions ? 'not-allowed' : 'pointer',
                        boxShadow: answeredCount < totalQuestions ? 'none' : '0 8px 25px rgba(99, 102, 241, 0.4)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <CheckCircle2 size={22} />
                    Submit Diagnostic Assessment
                </button>
            </motion.div>

        </div>
    );
};

export default AssessmentPage;

