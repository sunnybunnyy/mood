const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    mood: { type: String, enum: ['happy', 'neutral', 'sad'], required: true },
    dayRating: { type: Number, min: 1, max: 10, required: true },
    habitsPracticed: [{ type: String }],
    notes: { type: String }
});

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);