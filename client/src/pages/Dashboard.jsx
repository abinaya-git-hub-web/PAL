import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, CheckCircle, BarChart2 } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [subjects, setSubjects] = useState([]);
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subRes = await axios.get('http://localhost:5000/api/subjects');
                setSubjects(subRes.data);
                const progRes = await axios.get(`http://localhost:5000/api/progress/${user.id}`);
                setProgress(progRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user.id]);

    const passedTopics = progress.filter(p => p.status === 'pass').length;
    const totalTopicsCount = progress.length > 0 ? Math.max(progress.length, 10) : 10;
    const progressPercentage = Math.min(Math.round((passedTopics / totalTopicsCount) * 100), 100);

    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 className="heading-gradient" style={{ fontSize: '2.5rem' }}>Welcome, {user.name}!</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Ready to advance your learning today?</p>
                </div>
                <button onClick={logout} className="btn" style={{ color: 'var(--error)' }}>Logout</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    {subjects.map((subject, idx) => (
                        <Link key={subject._id} to={`/subject/${subject._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ height: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(99, 102, 241, 0.2)' }}>
                                        <Book color="var(--primary)" />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem' }}>{subject.name}</h3>
                                </div>
                                <p style={{ color: 'var(--text-muted)' }}>Explore chapters and unlock topics in {subject.name}.</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="glass-card" style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <BarChart2 color="var(--secondary)" />
                        <h3>Your Progress</h3>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>{passedTopics}</div>
                        <p style={{ color: 'var(--text-muted)' }}>Topics Completed</p>
                    </div>
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))', transition: 'width 0.4s ease' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <span>{progressPercentage}% Completed</span>
                            <span>{passedTopics} Passed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
