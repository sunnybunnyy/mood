const express = require('express');
const MoodEntry = require('../models/MoodEntry');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Add mood entry
router.post('/', auth, async(req, res) => {
    try {
        const { mood, dayRating, habitsPracticed = [], notes } = req.body;
        
        // Validate habits exist in user's habit list
        const user = await User.findById(req.user.id);
        const validHabits = habitsPracticed.filter(habit => 
            user.habits.includes(habit)
        );

        const entry = new MoodEntry({
            user: req.user.id,
            mood,
            dayRating,
            habitsPracticed: validHabits, // Only save valid habits
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
        console.log('\n=== ANALYTICS REQUEST STARTED ===');
        const user = await User.findById(req.user.id);
        console.log('[DEBUG] User habits:', user.habits);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const entries = await MoodEntry.find({ user: req.user.id });
        console.log(`[DEBUG] Found ${entries.length} entries`);
        const userHabits = req.user.habits || [];

        entries.forEach((entry, index) => {
            console.log(`Entry ${index + 1}:`, {
                habitsPracticed: entry.habitsPracticed,
                dayRating: entry.dayRating
            });
        });

        if ((entries.length === 0)) {
            return res.json({
                moodFrequency: {},
                habitImpact: {},
                avgRating: 0,
                totalEntries: 0
            });
        }

        // Mood frequency count
        const moodFrequency = {};
        // Day rating stats
        let totalRating = 0;

        // Initialize habit impact object with all possible habits
        const habitImpact = {};
        user.habits.forEach(habit => {
            habitImpact[habit] = {
                count: 0,
                totalRating: 0
            };
        });

        // Process each entry
        entries.forEach(entry => {
            // Count mood frequencies
            moodFrequency[entry.mood] = (moodFrequency[entry.mood] || 0) + 1;
            
            // Sum ratings for average
            totalRating += entry.dayRating;

            // Track habit impact
            if (entry.habitsPracticed && entry.habitsPracticed.length > 0) {
                entry.habitsPracticed.forEach(habit => {
                    if (habitImpact[habit]) {
                        habitImpact[habit].count += 1;
                        habitImpact[habit].totalRating += entry.dayRating;
                    }
                });
            }
        });

        // Format for frontend
        const habitImpactFormatted = {};
        Object.keys(habitImpact).forEach(habit => {
            habitImpactFormatted[habit] = habitImpact[habit].count > 0
                ? habitImpact[habit].totalRating / habitImpact[habit].count
                : 0;
        });
        console.log("Habit Impact Data:", habitImpactFormatted);

        res.json({
            moodFrequency,
            habitImpact: habitImpactFormatted,
            avgRating: totalRating / entries.length,
            totalEntries: entries.length
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;