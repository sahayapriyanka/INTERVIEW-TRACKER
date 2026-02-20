const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getAnalytics,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

router.get('/analytics', getAnalytics);
router.route('/').get(getApplications).post(createApplication);
router.route('/:id').get(getApplication).put(updateApplication).delete(deleteApplication);

module.exports = router;
