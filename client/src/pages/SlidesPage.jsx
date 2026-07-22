import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, RefreshCcw, Download, Globe, Video, BookOpen, ExternalLink, Layers, PlayCircle, Film } from 'lucide-react';
import learningMaterialsData from '../data/learningMaterials.json';
import videoMetadataData from '../data/videoMetadata.json';

const SlidesPage = () => {
    const { subject, chapter, topic } = useParams();
    const navigate = useNavigate();

    const decodedSubject = decodeURIComponent(subject || 'Mathematics');
    const decodedChapter = decodeURIComponent(chapter || 'Chapter 1');
    const decodedTopic = decodeURIComponent(topic || 'Row Echelon Form');

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
    const [language, setLanguage] = useState('en'); // 'en' | 'ta'

    const currentMetaTopic = learningMaterialsData.topics.find(t => t.id === Number(selectedTopicId)) || learningMaterialsData.topics[0];
    const currentVideoMeta = videoMetadataData.videos.find(v => v.id === Number(selectedVideoId)) || videoMetadataData.videos[0];
    const currentSupp = learningMaterialsData.supplementaryResources.find(s => s.id === selectedSuppId);

    const folderChapter = decodedChapter.includes(':') ? decodedChapter.split(':')[0].trim() : decodedChapter;

    // Slide & Video URLs
    const topicTitle = currentMetaTopic ? currentMetaTopic.title : decodedTopic;
    
    // Primary & Fallback Asset Paths
    const pdfUrl = `/slides/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(folderChapter)}/${encodeURIComponent(topicTitle)}.pdf`;
    const altPdfUrl = currentMetaTopic ? `/${currentMetaTopic.relativePath}${currentMetaTopic.pdfFile}` : '';
    const pptxUrl = `/slides/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(folderChapter)}/${encodeURIComponent(topicTitle)}.pptx`;
    const altPptxUrl = currentMetaTopic ? `/${currentMetaTopic.relativePath}${currentMetaTopic.pptFile}` : '';
    const tamilUrl = `/slides/${encodeURIComponent(decodedSubject)}/${encodeURIComponent(folderChapter)}/${encodeURIComponent(topicTitle)}_Tamil.pdf`;
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

    const activeSlideUrl = selectedSuppId 
        ? suppUrl 
        : (language === 'ta' && hasTamil ? activeTamilPath : activePdfPath);

    return (
        <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '1400px', paddingBottom: '4rem' }}>
            
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <Link to="/dashboard" className="btn btn-secondary" style={{ gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)' }}>
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>

                <div style={{ textAlign: 'center' }}>
                    <h2 className="heading-gradient" style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Chapter 1 Remedial Learning Hub</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {decodedChapter} &bull; {selectedSuppId ? currentSupp?.title : currentMetaTopic?.title} (15 Video Lectures Available)
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Google Drive PPT Link Button */}
                    <a 
                        href={driveFolderUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn" 
                        style={{ 
                            gap: '0.5rem', 
                            background: 'rgba(16, 185, 129, 0.15)', 
                            border: '1px solid #10b981', 
                            color: '#34d399',
                            fontWeight: 500
                        }}
                    >
                        <ExternalLink size={16} /> PPTs Drive
                    </a>

                    {/* Google Drive Video Link Button */}
                    <a 
                        href={driveVideoFolderUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn" 
                        style={{ 
                            gap: '0.5rem', 
                            background: 'rgba(245, 158, 11, 0.15)', 
                            border: '1px solid #f59e0b', 
                            color: '#fbbf24',
                            fontWeight: 500
                        }}
                    >
                        <PlayCircle size={16} /> Videos Drive (15 Videos)
                    </a>

                    {/* Language Toggle */}
                    {!selectedSuppId && hasTamil && (
                        <button 
                            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')} 
                            className="btn" 
                            style={{ 
                                gap: '0.5rem', 
                                background: 'rgba(99, 102, 241, 0.15)', 
                                border: '1px solid var(--primary)', 
                                color: 'var(--text)' 
                            }}
                        >
                            <Globe size={16} color="var(--primary)" />
                            {language === 'en' ? 'Tamil Slides' : 'English Slides'}
                        </button>
                    )}
                </div>
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
                                        This subtopic is formatted as a native PowerPoint presentation. Download the presentation file to view slides locally or open the Google Drive folder.
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <h4 style={{ fontSize: '0.95rem', color: 'var(--secondary)' }}>Video Notes ({currentVideoMeta?.topicCode})</h4>
                                    <a 
                                        href={driveVideoFolderUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        style={{ color: '#fbbf24', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                                    >
                                        <ExternalLink size={14} /> View All 15 Videos on Drive
                                    </a>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                    {currentVideoMeta?.description || 'Watch the video lecture to reinforce formulas and methods before re-attempting the assessment.'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            )}

            {/* Try Assessment Again Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                <button 
                    onClick={() => window.history.back()} 
                    className="btn btn-primary" 
                    style={{ 
                        gap: '0.75rem', 
                        padding: '1rem 2.5rem', 
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)' 
                    }}
                >
                    <RefreshCcw size={20} /> Re-Attempt Assessment
                </button>
            </div>
        </div>
    );
};

export default SlidesPage;



