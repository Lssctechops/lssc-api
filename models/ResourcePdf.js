const mongoose = require('mongoose');

const ResourcePdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImage: { type: String, required: true }, // thumbnail shown in UI
  pdfUrl: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'News Letter',
      'Books',
      'Model Curriculum',
      'Apprenticeship Curriculum',
      'Study Report'
    ],
    required: true,
  },
}, {
  timestamps: true,
});

// Indexing for search functionality
ResourcePdfSchema.index({ title: 'text', category: 'text' });

module.exports = mongoose.model('ResourcePdf', ResourcePdfSchema);
