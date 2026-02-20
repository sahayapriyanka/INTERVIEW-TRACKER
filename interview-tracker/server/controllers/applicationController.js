const Application = require('../models/Application');

// @desc    Get all applications for logged-in user
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    const { stage, search } = req.query;
    const filter = { user: req.user._id };

    if (stage && stage !== 'All') filter.stage = stage;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplication = async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
  try {
    const app = await Application.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get analytics
// @route   GET /api/applications/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const stageCounts = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]);

    const total = await Application.countDocuments({ user: userId });
    const offers = await Application.countDocuments({ user: userId, stage: 'Offer' });
    const rejected = await Application.countDocuments({ user: userId, stage: 'Rejected' });
    const active = await Application.countDocuments({ user: userId, stage: { $nin: ['Offer', 'Rejected'] } });

    const rejectionReasons = await Application.find(
      { user: userId, stage: 'Rejected', rejectionReason: { $exists: true, $ne: '' } },
      { company: 1, rejectionReason: 1 }
    );

    res.json({
      success: true,
      data: {
        total,
        offers,
        rejected,
        active,
        successRate: total ? Math.round((offers / total) * 100) : 0,
        stageCounts: stageCounts.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
        rejectionReasons,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getApplications, getApplication, createApplication, updateApplication, deleteApplication, getAnalytics };
