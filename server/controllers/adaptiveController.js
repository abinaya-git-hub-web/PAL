const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Assessment = require('../models/Assessment');
const AdaptiveProgress = require('../models/AdaptiveProgress');
const mongoose = require('mongoose');

// File mapping helper for Chapter 2 materials
const TOPIC_MATERIAL_MAP = {
    'Complex Numbers Fundamentals': {
        pdf: '/slides/Mathematics/Chapter 2/Complex Numbers Fundamentals.pdf',
        video: '/videos/Mathematics/Chapter 2/Complex Numbers Fundamentals.mp4'
    },
    'Basic Algebraic Properties of Complex Numbers': {
        pdf: '/slides/Mathematics/Chapter 2/Basic Algebraic Properties of Complex Numbers.pdf',
        video: '/videos/Mathematics/Chapter 2/Basic Algebraic Properties of Complex Numbers.mp4'
    },
    'Conjugates and Modulus of Complex Numbers': {
        pdf: '/slides/Mathematics/Chapter 2/Conjugates and Modulus of Complex Numbers.pdf',
        video: '/videos/Mathematics/Chapter 2/Conjugates and Modulus of Complex Numbers.mp4'
    },
    'Square Root of a Complex Number': {
        pdf: '/slides/Mathematics/Chapter 2/Square Root of a Complex Number.pdf',
        video: '/videos/Mathematics/Chapter 2/Square Root of a Complex Number.mp4'
    },
    'Polar Form and Euler Form': {
        pdf: '/slides/Mathematics/Chapter 2/Polar Form and Euler Form.pdf',
        video: '/videos/Mathematics/Chapter 2/Polar Form and Euler Form.mp4'
    },
    'De Moivre Theorem and Applications': {
        pdf: '/slides/Mathematics/Chapter 2/De Moivre Theorem and Applications.pdf',
        video: '/videos/Mathematics/Chapter 2/De Moivre Theorem and Applications.mp4'
    }
};

const MAIN_CHAPTER_PPT = '/slides/Mathematics/Chapter 2/02_ComplexNumbers_ppt_Ex 2.3.pdf';
const TRAILER_VIDEO = '/videos/Mathematics/Chapter 2/Complex Numbers Fundamentals.mp4';

// Configurable level thresholds
const LEVEL_THRESHOLDS = {
    LOW_MAX: 39,
    MEDIUM_MAX: 69,
    HIGH_MIN: 70
};

// GET /api/adaptive/chapter-data/:chapterId
exports.getChapterAdaptiveData = async (req, res) => {
    try {
        const { chapterId } = req.params;

        let chapter = null;
        let topics = [];
        let assessments = [];

        try {
            chapter = await Chapter.findById(chapterId) || await Chapter.findOne({ order: 2 }) || await Chapter.findOne();
            if (chapter) {
                topics = await Topic.find({ chapterId: chapter._id }).sort({ order: 1 });
                const topicIds = topics.map(t => t._id);
                assessments = await Assessment.find({ topicId: { $in: topicIds } });
            }
        } catch (dbErr) {
            console.warn('Database query fallback triggered:', dbErr.message);
        }

        // If topics are empty (e.g. DB not seeded yet), construct robust static Chapter 2 structure
        if (!topics || topics.length === 0) {
            const staticTopicsData = [
                {
                    _id: 'topic_2_1',
                    topicName: 'Complex Numbers Fundamentals',
                    order: 1,
                    microPptUrl: '/slides/Mathematics/Chapter 2/Complex Numbers Fundamentals.pdf',
                    videoUrl: '/videos/Mathematics/Chapter 2/Complex Numbers Fundamentals.mp4',
                    questions: [
                        { questionText: 'What is the imaginary unit i defined as?', options: ['Square root of 1', 'Square root of -1', '-1', '0'], correctAnswer: 1, explanation: 'i = √(-1)', conceptTag: 'Complex Fundamentals' },
                        { questionText: 'What is the value of i²?', options: ['1', '-1', 'i', '-i'], correctAnswer: 1, explanation: 'i² = -1', conceptTag: 'Complex Fundamentals' },
                        { questionText: 'If z = 3 + 4i, what is the real part Re(z)?', options: ['4', '3i', '3', '7'], correctAnswer: 2, explanation: 'Re(z) = 3', conceptTag: 'Complex Fundamentals' },
                        { questionText: 'If z = -2 + 5i, what is the imaginary part Im(z)?', options: ['-2', '5', '5i', '-5'], correctAnswer: 1, explanation: 'Im(z) = 5', conceptTag: 'Complex Fundamentals' },
                        { questionText: 'What is the value of i⁴?', options: ['i', '-1', '1', '-i'], correctAnswer: 2, explanation: 'i⁴ = 1', conceptTag: 'Complex Fundamentals' }
                    ]
                },
                {
                    _id: 'topic_2_2',
                    topicName: 'Basic Algebraic Properties of Complex Numbers',
                    order: 2,
                    microPptUrl: '/slides/Mathematics/Chapter 2/Basic Algebraic Properties of Complex Numbers.pdf',
                    videoUrl: '/videos/Mathematics/Chapter 2/Basic Algebraic Properties of Complex Numbers.mp4',
                    questions: [
                        { questionText: 'Which statement shows commutative property of addition?', options: ['z₁ + z₂ = z₁ − z₂', 'z₁ · z₂ = z₂ + z₁', 'z₁ + z₂ = z₂ + z₁', 'z₁ + z₂ = z₁ · z₂'], correctAnswer: 2, explanation: 'Order does not matter in addition.', conceptTag: 'Algebraic Properties' },
                        { questionText: 'What is the additive identity for complex numbers?', options: ['1', 'i', '0 + 0i', '1 + 0i'], correctAnswer: 2, explanation: 'z + 0 = z.', conceptTag: 'Algebraic Properties' },
                        { questionText: 'What is the multiplicative identity for complex numbers?', options: ['0', 'i', '0 + i', '1 = 1 + 0i'], correctAnswer: 3, explanation: 'z · 1 = z.', conceptTag: 'Algebraic Properties' },
                        { questionText: 'For which z does multiplicative inverse z⁻¹ NOT exist?', options: ['Purely real', 'z = 0', 'Purely imaginary', 'Negative real part'], correctAnswer: 1, explanation: 'Division by zero is undefined.', conceptTag: 'Algebraic Properties' },
                        { questionText: 'If z = 3 + 4i, what is the denominator used in computing z⁻¹?', options: ['7', '12', '25', '1'], correctAnswer: 2, explanation: '|z|² = 3² + 4² = 25.', conceptTag: 'Algebraic Properties' }
                    ]
                },
                {
                    _id: 'topic_2_3',
                    topicName: 'Conjugates and Modulus of Complex Numbers',
                    order: 3,
                    microPptUrl: '/slides/Mathematics/Chapter 2/Conjugates and Modulus of Complex Numbers.pdf',
                    videoUrl: '/videos/Mathematics/Chapter 2/Conjugates and Modulus of Complex Numbers.mp4',
                    questions: [
                        { questionText: 'If z = 3 + 4i, what is its conjugate z̄?', options: ['3 + 4i', '3 - 4i', '-3 + 4i', '-3 - 4i'], correctAnswer: 1, explanation: 'Conjugate flips imaginary sign.', conceptTag: 'Conjugates & Modulus' },
                        { questionText: 'What is the modulus |z| of z = 3 + 4i?', options: ['7', '5', '25', '12'], correctAnswer: 1, explanation: '√(3² + 4²) = 5.', conceptTag: 'Conjugates & Modulus' },
                        { questionText: 'What is z · z̄ equal to?', options: ['|z|', '|z|²', '2z', '0'], correctAnswer: 1, explanation: 'z · z̄ = |z|².', conceptTag: 'Conjugates & Modulus' },
                        { questionText: 'What is the conjugate of z̄?', options: ['z', '-z', '1/z', '|z|'], correctAnswer: 0, explanation: 'Double conjugation yields z.', conceptTag: 'Conjugates & Modulus' },
                        { questionText: 'If |z| = 1, what is z⁻¹ equal to?', options: ['z', '-z', 'z̄', '1/z̄'], correctAnswer: 2, explanation: 'z⁻¹ = z̄ when |z| = 1.', conceptTag: 'Conjugates & Modulus' }
                    ]
                },
                {
                    _id: 'topic_2_4',
                    topicName: 'Square Root of a Complex Number',
                    order: 4,
                    microPptUrl: '/slides/Mathematics/Chapter 2/Square Root of a Complex Number.pdf',
                    videoUrl: '/videos/Mathematics/Chapter 2/Square Root of a Complex Number.mp4',
                    questions: [
                        { questionText: 'How many square roots does a non-zero complex number have?', options: ['1', '2', '3', 'Infinitely many'], correctAnswer: 1, explanation: 'Exactly two distinct square roots.', conceptTag: 'Square Roots' },
                        { questionText: 'What are the square roots of -9?', options: ['±3', '±3i', '3i only', '-3i only'], correctAnswer: 1, explanation: '√(-9) = ±3i.', conceptTag: 'Square Roots' },
                        { questionText: 'In √(a + ib), what determines the sign of the imaginary part?', options: ['Sign of a', 'Sign of b', 'Magnitude of a', 'Always positive'], correctAnswer: 1, explanation: 'Sign of b determines sign of y.', conceptTag: 'Square Roots' },
                        { questionText: 'What are the square roots of i?', options: ['±(1 + i)/√2', '±(1 - i)/√2', '±(1 + i)', '±i'], correctAnswer: 0, explanation: '((1+i)/√2)² = i.', conceptTag: 'Square Roots' },
                        { questionText: 'If √(a + ib) = ±(x + iy), what is x² - y² equal to?', options: ['a', 'b', 'a² + b²', '√(a² + b²)'], correctAnswer: 0, explanation: 'x² - y² = a.', conceptTag: 'Square Roots' }
                    ]
                },
                {
                    _id: 'topic_2_5',
                    topicName: 'Polar Form and Euler Form',
                    order: 5,
                    microPptUrl: '/slides/Mathematics/Chapter 2/Polar Form and Euler Form.pdf',
                    videoUrl: '/videos/Mathematics/Chapter 2/Polar Form and Euler Form.mp4',
                    questions: [
                        { questionText: 'What is the polar form of a complex number z?', options: ['r(cos θ + i sin θ)', 'r(cos θ - sin θ)', 'r cos θ + sin θ', 'cos θ + i sin θ'], correctAnswer: 0, explanation: 'z = r(cos θ + i sin θ).', conceptTag: 'Polar & Euler Form' },
                        { questionText: 'In polar form z = r(cos θ + i sin θ), what does r represent?', options: ['Real part', 'Imaginary part', 'Modulus |z|', 'Argument'], correctAnswer: 2, explanation: 'r is the modulus.', conceptTag: 'Polar & Euler Form' },
                        { questionText: "What is Euler's formula for cos θ + i sin θ?", options: ['e^(iθ)', 'e^(-iθ)', 'ln(iθ)', 'i e^θ'], correctAnswer: 0, explanation: 'e^(iθ) = cos θ + i sin θ.', conceptTag: 'Polar & Euler Form' },
                        { questionText: 'What is the principal argument Arg(z) range?', options: ['0 ≤ θ < 2π', '-π < θ ≤ π', '-π/2 ≤ θ ≤ π/2', '0 ≤ θ ≤ π'], correctAnswer: 1, explanation: 'Interval (-π, π].', conceptTag: 'Polar & Euler Form' },
                        { questionText: 'If z = 1 + i, what is r and principal argument θ?', options: ['r = √2, θ = π/4', 'r = 2, θ = π/4', 'r = √2, θ = π/2', 'r = 1, θ = π/4'], correctAnswer: 0, explanation: 'r = √2, θ = π/4.', conceptTag: 'Polar & Euler Form' }
                    ]
                },
                {
                    _id: 'topic_2_6',
                    topicName: 'De Moivre Theorem and Applications',
                    order: 6,
                    microPptUrl: '/slides/Mathematics/Chapter 2/De Moivre Theorem and Applications.pdf',
                    videoUrl: '/videos/Mathematics/Chapter 2/De Moivre Theorem and Applications.mp4',
                    questions: [
                        { questionText: "What does De Moivre's Theorem state for (cos θ + i sin θ)ⁿ?", options: ['cos(nθ) + i sin(nθ)', 'n cos θ + i n sin θ', 'cosⁿθ + i sinⁿθ', 'cos θ + i sin(nθ)'], correctAnswer: 0, explanation: 'cos(nθ) + i sin(nθ).', conceptTag: 'De Moivre Theorem' },
                        { questionText: 'What are the cube roots of unity?', options: ['1, -1, i', '1, ω, ω²', '1, i, -i', '0, 1, 2'], correctAnswer: 1, explanation: '1, ω, ω².', conceptTag: 'De Moivre Theorem' },
                        { questionText: 'What is 1 + ω + ω² equal to?', options: ['1', '0', '-1', '3'], correctAnswer: 1, explanation: 'Sum of n-th roots is 0.', conceptTag: 'De Moivre Theorem' },
                        { questionText: 'What is 1 · ω · ω² = ω³ equal to?', options: ['0', '-1', '1', 'i'], correctAnswer: 2, explanation: 'ω³ = 1.', conceptTag: 'De Moivre Theorem' },
                        { questionText: 'What is (cos θ - i sin θ)ⁿ equal to?', options: ['cos(nθ) - i sin(nθ)', 'cos(nθ) + i sin(nθ)', '-cos(nθ) - i sin(nθ)', 'cosⁿθ - i sinⁿθ'], correctAnswer: 0, explanation: 'cos(nθ) - i sin(nθ).', conceptTag: 'De Moivre Theorem' }
                    ]
                }
            ];

            const initialQ = staticTopicsData.map((top, idx) => ({
                questionIndex: idx,
                topicId: top._id,
                topicName: top.topicName,
                questionText: top.questions[0].questionText,
                options: top.questions[0].options,
                correctAnswer: top.questions[0].correctAnswer,
                explanation: top.questions[0].explanation,
                conceptTag: top.questions[0].conceptTag
            }));

            const finalQ = [];
            staticTopicsData.forEach(top => {
                top.questions.slice(0, 2).forEach(q => {
                    finalQ.push({
                        topicId: top._id,
                        topicName: top.topicName,
                        questionText: q.questionText,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        conceptTag: q.conceptTag
                    });
                });
            });

            return res.json({
                chapterId: chapterId || 'chapter_2_complex_numbers',
                chapterName: 'Chapter 2: Complex Numbers',
                trailer: {
                    title: 'Chapter 2 Overview Trailer',
                    description: 'A 5-minute foundational overview covering Complex Numbers, Algebraic Properties, Modulus, Polar Form, and De Moivre Theorem.',
                    videoUrl: TRAILER_VIDEO
                },
                mainPpt: {
                    title: 'Complete Chapter 2 Master PPT',
                    pdfUrl: MAIN_CHAPTER_PPT
                },
                topics: staticTopicsData,
                initialAssessment: {
                    title: 'Chapter 2 — Initial Diagnostic Assessment',
                    description: 'Evaluates your understanding across all 6 topics to generate your adaptive learning path.',
                    questions: initialQ
                },
                finalAssessment: {
                    title: 'Chapter 2 — Final Comprehensive Assessment',
                    description: 'Evaluates your overall mastery of Complex Numbers.',
                    questions: finalQ
                },
                thresholds: LEVEL_THRESHOLDS
            });
        }

        const assessmentMap = {};
        assessments.forEach(a => {
            assessmentMap[a.topicId.toString()] = a;
        });

        // Map topic data with materials and assessments
        const formattedTopics = topics.map(t => {
            const mat = TOPIC_MATERIAL_MAP[t.topicName] || {
                pdf: '/slides/Mathematics/Chapter 2/Complex Numbers Fundamentals.pdf',
                video: '/videos/Mathematics/Chapter 2/Complex Numbers Fundamentals.mp4'
            };

            const ass = assessmentMap[t._id.toString()] || { questions: [] };

            return {
                _id: t._id,
                topicName: t.topicName,
                order: t.order,
                microPptUrl: mat.pdf,
                videoUrl: mat.video,
                questions: ass.questions || []
            };
        });

        // Build Initial Assessment (1 question per topic)
        const initialQuestions = [];
        formattedTopics.forEach((top, idx) => {
            if (top.questions && top.questions.length > 0) {
                const q = top.questions[0];
                initialQuestions.push({
                    questionIndex: idx,
                    topicId: top._id,
                    topicName: top.topicName,
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    conceptTag: q.conceptTag || top.topicName
                });
            }
        });

        // Build Final Assessment (up to 2 questions per topic)
        const finalQuestions = [];
        formattedTopics.forEach((top) => {
            if (top.questions && top.questions.length > 0) {
                top.questions.slice(0, 2).forEach((q, qIdx) => {
                    finalQuestions.push({
                        topicId: top._id,
                        topicName: top.topicName,
                        questionText: q.questionText,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        conceptTag: q.conceptTag || top.topicName
                    });
                });
            }
        });

        return res.json({
            chapterId: chapter._id,
            chapterName: chapter.chapterName,
            trailer: {
                title: 'Chapter 2 Overview Trailer',
                description: 'A 5-minute foundational video overview covering Complex Numbers, Algebraic Properties, Modulus, Polar Form, and De Moivre Theorem.',
                videoUrl: TRAILER_VIDEO
            },
            mainPpt: {
                title: 'Complete Chapter 2 Master PPT',
                pdfUrl: MAIN_CHAPTER_PPT
            },
            topics: formattedTopics,
            initialAssessment: {
                title: 'Chapter 2 — Initial Diagnostic Assessment',
                description: 'Covering key concepts across all 6 topics to determine your personalized learning path.',
                questions: initialQuestions
            },
            finalAssessment: {
                title: 'Chapter 2 — Final Comprehensive Assessment',
                description: 'Evaluates your overall mastery of Complex Numbers.',
                questions: finalQuestions
            },
            thresholds: LEVEL_THRESHOLDS
        });
    } catch (err) {
        console.error('Error fetching chapter adaptive data:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /api/adaptive/progress/:userId/:chapterId
exports.getAdaptiveProgress = async (req, res) => {
    try {
        const { userId, chapterId } = req.params;

        let progress = await AdaptiveProgress.findOne({ userId, chapterId });
        if (!progress) {
            progress = new AdaptiveProgress({
                userId,
                chapterId,
                currentStep: 'TRAILER',
                level: 'UNASSIGNED'
            });
            await progress.save();
        }

        return res.json(progress);
    } catch (err) {
        console.error('Error fetching adaptive progress:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST /api/adaptive/initial-assessment/submit
exports.submitInitialAssessment = async (req, res) => {
    try {
        const { userId, chapterId, answers } = req.body;
        // answers: Array of { topicId, questionIndex, selectedOption, isCorrect }

        if (!userId || !chapterId || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        let progress = await AdaptiveProgress.findOne({ userId, chapterId });
        if (!progress) {
            progress = new AdaptiveProgress({ userId, chapterId });
        }

        let totalCorrect = 0;
        const totalQuestions = answers.length;
        const topicStats = {};

        answers.forEach(ans => {
            const tIdStr = ans.topicId ? ans.topicId.toString() : 'general';
            if (!topicStats[tIdStr]) {
                topicStats[tIdStr] = { score: 0, maxScore: 0, percentage: 0 };
            }
            topicStats[tIdStr].maxScore += 1;
            if (ans.isCorrect) {
                totalCorrect += 1;
                topicStats[tIdStr].score += 1;
            }
        });

        // Calculate percentages
        Object.keys(topicStats).forEach(key => {
            const item = topicStats[key];
            item.percentage = item.maxScore > 0 ? Math.round((item.score / item.maxScore) * 100) : 0;
        });

        const overallPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        // Classify Level
        let classifiedLevel = 'MEDIUM';
        if (overallPercentage <= LEVEL_THRESHOLDS.LOW_MAX) {
            classifiedLevel = 'LOW';
        } else if (overallPercentage >= LEVEL_THRESHOLDS.HIGH_MIN) {
            classifiedLevel = 'HIGH';
        }

        progress.initialScore = totalCorrect;
        progress.initialMaxScore = totalQuestions;
        progress.initialPercentage = overallPercentage;
        progress.initialCompletedAt = new Date();
        progress.level = classifiedLevel;
        progress.topicPerformance = topicStats;
        progress.currentStep = 'LEVEL_RESULT';

        await progress.save();

        return res.json({
            message: 'Initial assessment evaluated successfully',
            progress
        });
    } catch (err) {
        console.error('Error submitting initial assessment:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST /api/adaptive/step/update
exports.updateAdaptiveStep = async (req, res) => {
    try {
        const { userId, chapterId, step, topicIndex } = req.body;

        let progress = await AdaptiveProgress.findOne({ userId, chapterId });
        if (!progress) {
            progress = new AdaptiveProgress({ userId, chapterId });
        }

        if (step) progress.currentStep = step;
        if (typeof topicIndex === 'number') progress.currentTopicIndex = topicIndex;

        await progress.save();
        return res.json(progress);
    } catch (err) {
        console.error('Error updating adaptive step:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST /api/adaptive/topic/complete
exports.completeTopic = async (req, res) => {
    try {
        const { userId, chapterId, topicId, score, maxScore, totalTopics } = req.body;

        let progress = await AdaptiveProgress.findOne({ userId, chapterId });
        if (!progress) {
            progress = new AdaptiveProgress({ userId, chapterId });
        }

        if (topicId && !progress.completedTopics.includes(topicId)) {
            progress.completedTopics.push(topicId);
        }

        const nextTopicIndex = progress.currentTopicIndex + 1;
        const total = totalTopics || 6;

        if (nextTopicIndex >= total) {
            progress.currentStep = 'FINAL_ASSESSMENT';
        } else {
            progress.currentTopicIndex = nextTopicIndex;
            progress.currentStep = 'MICRO_CONTENT';
        }

        await progress.save();
        return res.json(progress);
    } catch (err) {
        console.error('Error completing topic:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST /api/adaptive/final-assessment/submit
exports.submitFinalAssessment = async (req, res) => {
    try {
        const { userId, chapterId, score, maxScore } = req.body;

        let progress = await AdaptiveProgress.findOne({ userId, chapterId });
        if (!progress) {
            progress = new AdaptiveProgress({ userId, chapterId });
        }

        const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

        progress.finalScore = score;
        progress.finalMaxScore = maxScore;
        progress.finalPercentage = percentage;
        progress.finalCompletedAt = new Date();
        progress.currentStep = 'COMPLETED';

        await progress.save();
        return res.json(progress);
    } catch (err) {
        console.error('Error submitting final assessment:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};
