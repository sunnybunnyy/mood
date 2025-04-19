const express = require('express');
const MoodEntry = require('../models/MoodEntry');
const router = express.Router();
const auth = require('../middleware/auth');

// Add mood entry
router.post('/', auth, async(req, res) => {
    try {
        const { mood, dayRating, habitsPracticed, notes } = req.body;
        const entry = new MoodEntry({
            user: req.user.id,
            mood,
            dayRating,
            habitsPracticed,
            notes
        });
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all mood entries for a user
router.get('/', auth, async (req, res) => {
    try {
        const entries = await MoodEntry.find({ user: req.user.id }).sort({ date: -1});
        res.json(entries);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get mood analytics
router.get('/analytics', auth, async (req, res) => {
    try {
        const entries = await MoodEntry.find({ user: req.user.id });

        // Calculate average mood rating
        const avgRating = entries.reduce((sum, entry) => sum + entry.dayRating, 0) / entries.length;

        // Calculate mood frequency
        const moodFrequency = entries.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});

        // Calculate habit impact
        const habitImpact = {};
        const userHabits = req.user.habits || [];

        userHabits.forEach(habit => {
            const entriesWithHabit = entries.filter(e => e.habitsPracticed.includes(habit));
            const avgRatingWithHabit = entriesWithHabit.reduce((sum, e) => sum + e.dayRating, 0) / (entriesWithHabit.length || 1);
            habitImpact[habit] = avgRatingWithHabit;
        });

        res.json({
            avgRating,
            moodFrequency,
            habitImpact,
            totalEntries: entries.length
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;