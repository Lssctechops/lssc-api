const BaseController = require('../core/BaseController');
const Batch = require('../models/Batch');
const config = require('../config');
const User = require('../models/User');
const BatchPerformance = require('../models/BatchPerformance');
const BatchAssessment = require('../models/BatchAssessment');
const mongoose = require('mongoose');

const reportController = new BaseController(Batch, {
  name: 'batch',
  access: 'Admin',
  get: {
    pagination: config.pagination,
  },
});

reportController.trainerReport = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    // Get current user
    const currentUser = await User.findById(req.user.id).lean();
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let trainerFilter = { role: 'trainer' };

    if (currentUser.role === 'trainer') {
      // Only include their own ID
      trainerFilter._id = currentUser._id;
    } else if (search) {
      // Admin can use search
      trainerFilter.name = { $regex: search, $options: 'i' };
    }

    // Fetch trainers
    const trainers = await User.find(trainerFilter)
      .select('_id name')
      .lean();

    const trainerIds = trainers.map(t => t._id);

    // Fetch batches linked to these trainers
    const batches = await BatchPerformance.find({
      trainer: { $in: trainerIds }
    })
      .populate({ path: 'trainer', select: 'name employeeId' })
      .populate({ path: 'batchId', select: 'name startAt endAt successfullyPlaced' })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    // Format report
    const report = batches.map(item => ({
      batchName: item.batchId?.name || '---',
      trainerName: item.trainer?.name || '---',
      trainerId: item.trainer?.employeeId || '---',
      startDate: item.batchId?.startAt ? new Date(item.batchId.startAt).toDateString() : '---',
      endDate: item.batchId?.endAt ? new Date(item.batchId.endAt).toDateString() : '--------',
      students: item.totalBatchStrength || 0,
      certified: item.certificationStatus || '0%',
      successfullyPlaced: item.batchId?.successfullyPlaced || 0,
      avgScore: item.avgScoreTheory || '---',
    }));

    const total = await BatchPerformance.countDocuments({
      trainer: { $in: trainerIds }
    });

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: report
    });

  } catch (error) {
    console.error("trainerReport error:", error);
    res.status(500).json({ error: error.message });
  }
};


reportController.assessorReport = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    // Get current user from token
    const currentUser = await User.findById(req.user.id).lean();
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let assessorFilter = { role: 'assessor' };

    if (currentUser.role === 'assessor') {
      // Restrict to only the logged-in assessor
      assessorFilter._id = currentUser._id;
    } else if (search) {
      // Admin can use search by name
      assessorFilter.name = { $regex: search, $options: 'i' };
    }

    // Find matching assessors
    const assessors = await User.find(assessorFilter)
      .select('_id name')
      .lean();

    const assessorIds = assessors.map(a => a._id);

    // Fetch assessments
    const assessments = await BatchAssessment.find({
      assessor: { $in: assessorIds }
    })
      .populate({
        path: 'batchId',
        select: 'name centerId',
        populate: {
          path: 'centerId',
          match: { title: { $exists: true } },
          select: 'title'
        }
      })
      .populate('assessor', 'name employeeId')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();
      
    // Build report response
    const report = assessments.map(item => ({
      batchName: item.batchId?.name || '---',
      assessorName: item.assessor?.name || '---',
      assessorId: item.assessor?.employeeId || '---',
      durations: item.assessmentTime || '---',
      date: item.assessmentDate
        ? new Date(item.assessmentDate).toDateString()
        : '---',
      candidates: item.totalCandidatesAppeared || 0,
      passed: item.candidatesPassed || 0,
      center: item.centre|| '---',
      avgScore: item.avgScore ? `${item.avgScore} %` : '---',
    }));

    const total = await BatchAssessment.countDocuments({
      assessor: { $in: assessorIds }
    });

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: report
    });

  } catch (error) {
    console.error("assessorReport error:", error);
    res.status(500).json({ error: error.message });
  }
};

reportController.getTrainerStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const trainerObjectId = new mongoose.Types.ObjectId(userId);

    // Confirm trainer role
    const user = await User.findById(userId).lean();
    if (!user || user.role !== 'trainer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get today and yesterday boundaries
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // This and last month boundaries
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Helper for percent difference
    const pct = (curr, prev) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

    // Total students
    const totalStudentsAgg = await Batch.aggregate([
      { $match: { trainer: trainerObjectId } },
      { $group: { _id: null, sum: { $sum: "$strength" } } }
    ]);
    const totalStudents = totalStudentsAgg[0]?.sum || 0;

    // Total batches
    const totalBatches = await Batch.countDocuments({ trainer: trainerObjectId });

    // Students today and yesterday
    const dayStudents = async (start, end) =>
      (await Batch.aggregate([
        { $match: { trainer: trainerObjectId, startAt: { $gte: start, $lt: end } } },
        { $group: { _id: null, sum: { $sum: "$strength" } } }
      ]))[0]?.sum || 0;

    const studentsToday = await dayStudents(today, tomorrow);
    const studentsYesterday = await dayStudents(yesterday, today);
    const studentsPctChange = pct(studentsToday, studentsYesterday);

    // Batches this month and last month
    const batchesThisMonth = await Batch.countDocuments({
      trainer: trainerObjectId, startAt: { $gte: thisMonth, $lt: nextMonth }
    });
    const batchesLastMonth = await Batch.countDocuments({
      trainer: trainerObjectId, startAt: { $gte: lastMonth, $lt: thisMonth }
    });
    const batchPctChange = pct(batchesThisMonth, batchesLastMonth);

    res.status(200).json({
      totalStudentsTrained: totalStudents,
      studentsPctChange: studentsPctChange.toFixed(1) + '%',
      totalBatchesConducted: totalBatches,
      batchPctChange: batchPctChange.toFixed(1) + '%'
    });

  } catch (err) {
    console.error("getTrainerStats error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

reportController.getTrainerStatsAdmin = async (req, res) => {
  try {
    // 1. Total Trainers
    const totalTrainers = await User.countDocuments({ role: 'trainer' });

    // 2. Total Batches
    const totalBatches = await Batch.countDocuments();

    // 3. Total Assessments
    const totalAssessments = await BatchAssessment.countDocuments();

    // 4. Pending Approval (example: users with status === 'pending')
    const pendingApprovals = await User.countDocuments({ isApproved: false });

    return res.status(200).json({
      totalTrainers,
      totalBatches,
      totalAssessments,
      pendingApprovals
    });
  } catch (error) {
    console.error('Error fetching trainer stats:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

reportController.getAssessorStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Confirm user is assessor
    const user = await User.findById(userId).lean();
    if (!user || user.role !== 'assessor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Date boundaries
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Month boundaries
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Helper percent function
    const pctChange = (curr, prev) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

    // ---- Totals (all-time) ----
    const assessments = await BatchAssessment.find({ assessor: userId }).lean();

    let totalStudentsAssessed = 0;
    let totalBatchesAssessed = assessments.length;
    let totalTheorySum = 0, totalTheoryCount = 0;
    let totalPracSum = 0, totalPracCount = 0;
    let totalVivaSum = 0, totalVivaCount = 0;

    for (const a of assessments) {
      totalStudentsAssessed += a.totalCandidatesAppeared || 0;
      if (typeof a.avgScoreTheory === 'number') {
        totalTheorySum += a.avgScoreTheory;
        totalTheoryCount++;
      }
      if (typeof a.avgScorePractical === 'number') {
        totalPracSum += a.avgScorePractical;
        totalPracCount++;
      }
      if (typeof a.avgScoreViva === 'number') {
        totalVivaSum += a.avgScoreViva;
        totalVivaCount++;
      }
    }

    // ---- Totals (sub-periods) ----
    // Students assessed today vs yesterday
    const studentsToday = (await BatchAssessment.aggregate([
      { $match: { assessor: new mongoose.Types.ObjectId(userId), assessmentDate: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, count: { $sum: "$totalCandidatesAppeared" } } }
    ]))[0]?.count || 0;

    const studentsYesterday = (await BatchAssessment.aggregate([
      { $match: { assessor: new mongoose.Types.ObjectId(userId), assessmentDate: { $gte: yesterday, $lt: today } } },
      { $group: { _id: null, count: { $sum: "$totalCandidatesAppeared" } } }
    ]))[0]?.count || 0;

    // Batch count this month vs last month
    const batchCountThisMonth = await BatchAssessment.countDocuments({
      assessor: userId,
      assessmentDate: { $gte: thisMonthStart, $lt: nextMonthStart }
    });
    const batchCountLastMonth = await BatchAssessment.countDocuments({
      assessor: userId,
      assessmentDate: { $gte: lastMonthStart, $lt: thisMonthStart }
    });

    // Average scores for this month vs last month (for % change cards)
    // Helper to calculate period averages:
    async function getPeriodAverages(start, end) {
      const assessments = await BatchAssessment.find({
        assessor: userId,
        assessmentDate: { $gte: start, $lt: end }
      }).lean();

      let theorySum = 0, theoryCount = 0;
      let pracSum = 0, pracCount = 0;
      let vivaSum = 0, vivaCount = 0;

      for (const a of assessments) {
        if (typeof a.avgScoreTheory === 'number') { theorySum += a.avgScoreTheory; theoryCount++; }
        if (typeof a.avgScorePractical === 'number') { pracSum += a.avgScorePractical; pracCount++; }
        if (typeof a.avgScoreViva === 'number') { vivaSum += a.avgScoreViva; vivaCount++; }
      }
      return {
        theory: theoryCount ? theorySum / theoryCount : 0,
        practical: pracCount ? pracSum / pracCount : 0,
        viva: vivaCount ? vivaSum / vivaCount : 0
      };
    }

    const avgThisMonth = await getPeriodAverages(thisMonthStart, nextMonthStart);
    const avgLastMonth = await getPeriodAverages(lastMonthStart, thisMonthStart);

    // ---- Calculate percent changes ----
    const studentsPctChange = pctChange(studentsToday, studentsYesterday);
    const batchPctChange = pctChange(batchCountThisMonth, batchCountLastMonth);
    const theoryPctChange = pctChange(avgThisMonth.theory, avgLastMonth.theory);
    const pracPctChange = pctChange(avgThisMonth.practical, avgLastMonth.practical);
    const vivaPctChange = pctChange(avgThisMonth.viva, avgLastMonth.viva);

    // ---- Build Response ----
    res.status(200).json({
      totalStudentsAssessed,
      totalStudentsPctChange: studentsPctChange.toFixed(2) + '%',
      totalBatchesAssessed,
      totalBatchesPctChange: batchPctChange.toFixed(2) + '%',
      averageMarksTheory: totalTheoryCount ? (totalTheorySum / totalTheoryCount).toFixed(2) + '%' : '0%',
      theoryPctChange: theoryPctChange.toFixed(2) + '%',
      averageMarksPractical: totalPracCount ? (totalPracSum / totalPracCount).toFixed(2) + '%' : '0%',
      practicalPctChange: pracPctChange.toFixed(2) + '%',
      averageMarksViva: totalVivaCount ? (totalVivaSum / totalVivaCount).toFixed(2) + '%' : '0%',
      vivaPctChange: vivaPctChange.toFixed(2) + '%'
    });
  } catch (error) {
    console.error("getAssessorStats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

reportController.getAssessorStatsAdmin = async (req, res) => {
  try {
    // 1. Active Assessors
    const activeAssessors = await User.countDocuments({ role: 'assessor' });

    // 2. Pending Assignments (assumed: assignmentStatus === 'pending')
    const pendingAssignments = 10;

    // 3. Reports Under Review (assumed: status === 'under_review')
    const reportsUnderReview = await BatchAssessment.countDocuments();

    // 4. Approval Pending (assumed: approvalStatus === 'pending')
    const approvalPending = await User.countDocuments({ role: 'assessor', isApproved: false });

    return res.status(200).json({
      activeAssessors,
      pendingAssignments,
      reportsUnderReview,
      approvalPending
    });
  } catch (error) {
    console.error("Error in getAssessorAdminStats:", error);
    return res.status(500).json({ error: 'Server error' });
  }
};


module.exports = reportController;
