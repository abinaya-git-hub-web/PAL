const express = require('express');
const router = express.Router();
const {
    getChapterAdaptiveData,
    getAdaptiveProgress,
    submitInitialAssessment,
    updateAdaptiveStep,
    completeTopic,
    submitFinalAssessment
} = require('../controllers/adaptiveController');

router.get('/chapter-data/:chapterId', getChapterAdaptiveData);
router.get('/progress/:userId/:chapterId', getAdaptiveProgress);
router.post('/initial-assessment/submit', submitInitialAssessment);
router.post('/step/update', updateAdaptiveStep);
router.post('/topic/complete', completeTopic);
router.post('/final-assessment/submit', submitFinalAssessment);

module.exports = router;
