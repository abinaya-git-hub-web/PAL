import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Download, Globe, Video, BookOpen, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProgression } from '../hooks/useProgression';

const SlidesPage = () => {
    const { subject, chapter, topic } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { themeConfig } = useTheme();

    // Extract topicId safely from location.state or query parameter
    const queryParams = new URLSearchParams(location.search);
    const topicId = location.state?.topicId || queryParams.get('topicId');

    const decodedSubject = decodeURIComponent(subject || 'Mathematics');
    const decodedChapter = decodeURIComponent(chapter || 'Chapter 1');
    const decodedTopic   = decodeURIComponent(topic || 'Row Echelon Form');

    // Find topic from metadata or fallback
    const matchedMetaTopic = learningMaterialsData.topics.find(
        t => t.title.toLowerCase() === decodedTopic.toLowerCase() || decodedTopic.toLowerCase().includes(t.title.toLowerCase())
    ) || learningMaterialsData.topics[0];

    const [selectedTopicId, setSelectedTopicId] = useState(matchedMetaTopic ? matchedMetaTopic.id : 1);
    const [selectedVideoId, setSelectedVideoId] = useState(matchedMetaTopic ? matchedMetaTopic.id : 1);
    const [selectedSuppId, setSelectedSuppId] = useState('');
    const [hasPdf, setHasPdf] = useState(false);
    const [hasPptx, setHasPptx] = useState(false);
    const [hasTamil, setHasTamil] = useState(false);
    const [hasVideo, setHasVideo] = useState(true);
    const [loadingAssets, setLoadingAssets] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [language, setLanguage] = useState('en'); // 'en' | 'ta'

    const currentMetaTopic = learningMaterialsData.topics.find(t => t.id === Number(selectedTopicId)) || learningMaterialsData.topics[0];
    const currentVideoMeta = videoMetadataData.videos.find(v => v.id === Number(selectedVideoId)) || videoMetadataData.videos[0];
    const currentSupp = learningMaterialsData.supplementaryResources.find(s => s.id === selectedSuppId);

    const folderChapter = decodedChapter.includes(':') ? decodedChapter.split(':')[0].trim() : decodedChapter;

    // Gate state
    const [topicDetail, setTopicDetail] = useState(null);
    const [subjectIdStr, setSubjectIdStr] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [isGateResolved, setIsGateResolved] = useState(false);

    const { getTopicState, loading: progressionLoading, progressRecords } = useProgression(subjectIdStr);
    
    const pdfUrl   = `/slides/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(folderChapter)}/${encodeURIComponent(decodedTopic)}.pdf`;
    const pptxUrl  = `/slides/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(folderChapter)}/${encodeURIComponent(decodedTopic)}.pptx`;
    const tamilUrl = `/slides/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(folderChapter)}/${encodeURIComponent(decodedTopic)}_Tamil.pdf`;
    const videoUrl = `/videos/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(folderChapter)}/${encodeURIComponent(decodedTopic)}.mp4`;
    const altTamilUrl = currentMetaTopic && currentMetaTopic.tamilPdfFile ? `/${currentMetaTopic.relativePath}${currentMetaTopic.tamilPdfFile}` : '';
    
    const primaryVideoUrl = `/videos/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(folderChapter)}/${encodeURIComponent(topicTitle)}.mp4`;
    const altVideoUrl = currentVideoMeta ? `/${currentVideoMeta.relativePath}${currentVideoMeta.videoFile}` : '';

    const suppUrl = currentSupp ? `/learning-materials/mathematics/chapter-1/supplementary/${currentSupp.file}` : '';

    const driveFolderUrl = currentMetaTopic?.driveUrl || learningMaterialsData.driveFolderUrl;
    const driveVideoFolderUrl = currentVideoMeta?.videoDriveUrl || videoMetadataData.driveVideoFolderUrl;

    const [activePdfPath, setActivePdfPath] = useState(pdfUrl);
    const [activePptxPath, setActivePptxPath] = useState(pptxUrl);
    const [activeTamilPath, setActiveTamilPath] = useState(tamilUrl);
    const [activeVideoPath, setActiveVideoPath] = useState(primaryVideoUrl);

    useEffect(() => {
        const checkAssets = async () => {
            setLoadingAssets(true);
            const checkExists = async (url) => {
                if (!url) return false;
                try {
                    const res = await fetch(url, { method: 'HEAD' });
                    return res.status === 200;
                } catch (e) {
                    return false;
                }
            };

            let pdfExists = await checkExists(pdfUrl);
            let finalPdf = pdfUrl;
            if (!pdfExists && altPdfUrl) {
                pdfExists = await checkExists(altPdfUrl);
                if (pdfExists) finalPdf = altPdfUrl;
            }

            let pptxExists = await checkExists(pptxUrl);
            let finalPptx = pptxUrl;
            if (!pptxExists && altPptxUrl) {
                pptxExists = await checkExists(altPptxUrl);
                if (pptxExists) finalPptx = altPptxUrl;
            }

            let tamilExists = await checkExists(tamilUrl);
            let finalTamil = tamilUrl;
            if (!tamilExists && altTamilUrl) {
                tamilExists = await checkExists(altTamilUrl);
                if (tamilExists) finalTamil = altTamilUrl;
            }

            let videoExists = await checkExists(primaryVideoUrl);
            let finalVideo = primaryVideoUrl;
            if (!videoExists && altVideoUrl) {
                videoExists = await checkExists(altVideoUrl);
                if (videoExists) finalVideo = altVideoUrl;
            }

            setHasPdf(pdfExists);
            setHasPptx(pptxExists);
            setHasTamil(tamilExists);
            setHasVideo(true);
            setActivePdfPath(finalPdf);
            setActivePptxPath(finalPptx);
            setActiveTamilPath(finalTamil);
            setActiveVideoPath(finalVideo);
            setLoadingAssets(false);
        };

        if (!selectedSuppId) {
            checkAssets();
        } else {
            setLoadingAssets(false);
        }
    }, [selectedTopicId, selectedVideoId, selectedSuppId, pdfUrl, altPdfUrl, pptxUrl, altPptxUrl, tamilUrl, altTamilUrl, primaryVideoUrl, altVideoUrl]);

    // Phase 1: Resolve topic identity
    useEffect(() => {
        if (!topicId) {
            setIsGateResolved(true); // Fallback: allow if no stable ID
            return;
        }

        const verifyAccess = async () => {
            try {
                const res = await apiClient.get(`/api/topics/detail/${topicId}`);
                const detail = res.data;
                setTopicDetail(detail);
                if (detail?.chapterId?.subjectId?._id) {
                    setSubjectIdStr(String(detail.chapterId.subjectId._id));
                } else {
                    setIsGateResolved(true);
                }
            } catch (e) {
                console.error('SlidesPage: Error verifying access', e);
                setIsGateResolved(true);
            }
        };
        verifyAccess();
    }, [topicId]);

    // Phase 2: Evaluate lock
    useEffect(() => {
        if (!topicDetail || progressionLoading) return;

        const state = getTopicState(topicDetail, topicDetail.chapterId);
        const hasPassed = progressRecords?.find(p => p.topicId === topicId)?.status === 'pass';
        
        if (state === 'LOCKED' && !hasPassed) {
            setIsLocked(true);
        }
        
        setIsGateResolved(true);
    }, [topicDetail, progressionLoading, getTopicState, progressRecords, topicId]);

    const activeSlideUrl = language === 'ta' && hasTamil ? tamilUrl : pdfUrl;

    const handleCompleteLearning = async () => {
        if (!topicId || !user?.id) {
            // Fallback navigation if no topicId
            navigate('/dashboard');
            return;
        }

        setIsCompleting(true);
        try {
            await apiClient.post('/api/progress/complete-learning', {
                userId: user.id,
                topicId
            });
        } catch (err) {
            console.error('SlidesPage: Error completing learning stage', err);
        } finally {
            setIsCompleting(false);
            navigate(`/topic/${topicId}?tab=practice`);
        }
    };

    if (!isGateResolved || (topicId && progressionLoading)) {
        return (
            <div className="container" style={{ paddingTop: '6rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Verifying access...</div>
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
                    <Lock size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.6 }} />
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text)' }}>Materials Locked</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                        You must complete the required earlier {themeConfig?.terminology?.chapter?.toLowerCase() || 'chapter'}s to unlock this topic's learning materials.
                    </p>
                    <Link to={subjectIdStr ? `/subject/${subjectIdStr}` : '/dashboard'} className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.85rem 2rem', fontWeight: 600 }}>
                        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Return to Roadmap
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '3rem', maxWidth: '1400px', paddingBottom: '4rem' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <Link
                    to={topicId ? `/topic/${topicId}` : '/dashboard'}
                    className="btn btn-secondary"
                    style={{ gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)' }}
                >
                    <ArrowLeft size={18} /> Back to Topic
                </Link>

                <div style={{ textAlign: 'center' }}>
                    <h2 className="heading-gradient" style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Chapter 1 Remedial Learning Hub</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {decodedChapter} &bull; {selectedSuppId ? currentSupp?.title : currentMetaTopic?.title} (15 Video Lectures Available)
                    </p>
                </div>
                
                {/* Language Toggle */}
                {hasTamil ? (
                    <button 
                        onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')} 
                        className="btn" 
                        style={{ 
                            gap: '0.5rem', 
                            background: 'rgba(16, 185, 129, 0.15)', 
                            border: '1px solid #10b981', 
                            color: '#34d399',
                            fontWeight: 500
                        }}
                    >
                        <Globe size={18} color="var(--primary)" />
                        {language === 'en' ? 'Switch to Tamil Slides' : 'Switch to English Slides'}
                    </button>
                ) : <div style={{ width: '150px' }} />}
            </div>

            {/* Selection & Toolbar Bar */}
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                
                {/* Topic PPT Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Layers size={20} color="var(--primary)" />
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Subtopic PPT Presentation
                        </label>
                        <select 
                            value={selectedSuppId ? `supp-${selectedSuppId}` : selectedTopicId}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.startsWith('supp-')) {
                                    setSelectedSuppId(val.replace('supp-', ''));
                                } else {
                                    setSelectedSuppId('');
                                    const idNum = Number(val);
                                    setSelectedTopicId(idNum);
                                    setSelectedVideoId(idNum);
                                    const tObj = learningMaterialsData.topics.find(t => t.id === idNum);
                                    if (tObj) {
                                        navigate(`/slides/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(decodedChapter)}/${encodeURIComponent(tObj.title)}`, { replace: true });
                                    }
                                }
                            }}
                            style={{ 
                                width: '100%', 
                                padding: '0.55rem 0.8rem', 
                                borderRadius: '0.5rem', 
                                background: 'rgba(0,0,0,0.4)', 
                                border: '1px solid rgba(255,255,255,0.15)', 
                                color: '#fff',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        >
                            <optgroup label="Chapter 1 Subtopic PPTs">
                                {learningMaterialsData.topics.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        Topic {t.topicCode}: {t.title}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Supplementary Practice & Review PPTs">
                                {learningMaterialsData.supplementaryResources.map((s) => (
                                    <option key={s.id} value={`supp-${s.id}`}>
                                        [Ext] {s.title} ({s.type})
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                </div>

                {/* Video Selector Dropdown (15 Videos) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Film size={20} color="var(--secondary)" />
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Video Lecture (15 Chapter 1 Videos)
                        </label>
                        <select 
                            value={selectedVideoId}
                            onChange={(e) => setSelectedVideoId(Number(e.target.value))}
                            style={{ 
                                width: '100%', 
                                padding: '0.55rem 0.8rem', 
                                borderRadius: '0.5rem', 
                                background: 'rgba(0,0,0,0.4)', 
                                border: '1px solid rgba(255,255,255,0.15)', 
                                color: '#fff',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        >
                            {videoMetadataData.videos.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.title} ({v.duration})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Direct PPT Download Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {!selectedSuppId && hasPptx && (
                        <a 
                            href={activePptxPath} 
                            download 
                            className="btn btn-secondary" 
                            style={{ gap: '0.5rem', fontSize: '0.85rem' }}
                        >
                            <Download size={16} /> Download .PPTX
                        </a>
                    )}
                    {selectedSuppId && currentSupp && (
                        <a 
                            href={suppUrl} 
                            download 
                            className="btn btn-secondary" 
                            style={{ gap: '0.5rem', fontSize: '0.85rem' }}
                        >
                            <Download size={16} /> Download Presentation
                        </a>
                    )}
                </div>
            </div>

            {/* Main Presentation & Video Workspace */}
            {loadingAssets ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Loading remedial learning materials...</div>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '7fr 5fr', 
                    gap: '2rem',
                    alignItems: 'stretch'
                }}>
                    
                    {/* Left Column: Slides View */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="glass-card" 
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            height: '75vh',
                            padding: '1.5rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                <BookOpen size={22} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                                    {selectedSuppId ? currentSupp?.title : currentMetaTopic?.title}
                                    {language === 'ta' && ' (Tamil)'}
                                </h3>
                            </div>
                            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '1rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                                {selectedSuppId ? currentSupp?.type : (hasPdf ? 'PDF / PPT Presentation' : 'PowerPoint (.pptx)')}
                            </span>
                        </div>

                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {hasPdf || selectedSuppId ? (
                                <object data={activeSlideUrl} type="application/pdf" width="100%" height="100%">
                                    <embed src={activeSlideUrl} type="application/pdf" width="100%" height="100%" />
                                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                            PDF presentation cannot be embedded directly in your browser.
                                        </p>
                                        <a href={activeSlideUrl} download className="btn btn-primary">
                                            <Download size={18} /> Download Slide Document
                                        </a>
                                    </div>
                                </object>
                            ) : hasPptx ? (
                                <div style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
                                    <FileText size={70} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                                    <h4 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>PowerPoint Presentation (.pptx)</h4>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                        This topic slide is formatted as a PowerPoint presentation (PPTX). Download it to study.
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <a href={activePptxPath} download className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
                                            <Download size={18} /> Download .PPTX File
                                        </a>
                                        <a href={driveFolderUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.8rem 1.8rem' }}>
                                            <ExternalLink size={18} /> Open PPTs on Drive
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <FileText size={60} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.4 }} />
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No local slide preview found for this topic.</p>
                                    <a href={driveFolderUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        <ExternalLink size={18} /> Access Slides on Google Drive
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Column: Video Lecture View */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="glass-card" 
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            height: '75vh',
                            padding: '1.5rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                <Video size={22} color="var(--secondary)" />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                    {currentVideoMeta?.title}
                                </h3>
                            </div>
                            {currentVideoMeta?.duration && (
                                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '1rem', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                    ⏱ {currentVideoMeta.duration}
                                </span>
                            )}
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
                            <div style={{ flex: 1, background: 'black', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                                <video 
                                    src={activeVideoPath} 
                                    controls 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                >
                                    Your browser does not support HTML5 video playback.
                                </video>
                            </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Video Notes</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                        Watch the lecture video for <strong>{decodedTopic}</strong> carefully before advancing to practice.
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', marginTop: '0.5rem' }}>
                                        {currentVideoMeta?.description || 'Watch the video lecture to reinforce formulas and methods before re-attempting the assessment.'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                </div>
            )}

            {/* Complete Learning & Continue CTA */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                <button 
                    onClick={handleCompleteLearning}
                    disabled={isCompleting}
                    className="btn btn-primary" 
                    style={{ 
                        gap: '0.75rem', 
                        padding: '1rem 2.5rem', 
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                        opacity: isCompleting ? 0.7 : 1
                    }}
                >
                    <CheckCircle size={20} />
                    {isCompleting ? 'Saving Progress...' : 'Complete Learning & Continue to Practice'}
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default SlidesPage;



