const mongoose = require('mongoose');

const AdaptiveProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },

    // Trailer state
    trailerWatched: { type: Boolean, default: false },

    // Initial assessment
    initialScore: { type: Number, default: 0 },
    initialMaxScore: { type: Number, default: 0 },
    initialPercentage: { type: Number, default: 0 },
    initialCompletedAt: { type: Date },

    // Classification level: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNASSIGNED'
    level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'UNASSIGNED'], default: 'UNASSIGNED' },

    // Topic performance breakdown map { [topicId]: { score: Number, maxScore: Number, percentage: Number } }
    topicPerformance: { type: Map, of: Object, default: {} },

    // Active step in student journey:
    // 'TRAILER' | 'INITIAL_ASSESSMENT' | 'LEVEL_RESULT' | 'MICRO_CONTENT' | 'TOPIC_MCQ' | 'MAIN_PPT' | 'FINAL_ASSESSMENT' | 'COMPLETED'
    currentStep: { type: String, default: 'TRAILER' },

    // Topic index (for LOW/MEDIUM pathway, 0-based)
    currentTopicIndex: { type: Number, default: 0 },

    // Array of completed topic IDs
    completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],

    // Main PPT viewed (for HIGH level)
    mainPptViewed: { type: Boolean, default: false },

    // Final Assessment results
    finalScore: { type: Number, default: 0 },
    finalMaxScore: { type: Number, default: 0 },
    finalPercentage: { type: Number, default: 0 },
    finalCompletedAt: { type: Date }
}, { timestamps: true });

AdaptiveProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

module.exports = mongoose.model('AdaptiveProgress', AdaptiveProgressSchema);
