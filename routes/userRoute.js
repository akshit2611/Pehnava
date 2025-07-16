const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');

// Route to show all users who have logged in (for demonstration, shows all users)
// Get all login attempts from app.js
const app = require('../app');
router.get('/login/read', (req, res) => {
    // Use loginUsers array from app.js
    const users = app.loginUsers || [];
    res.render('loginRead', { users });
});

// Show all unmatched login attempts on /record
const LoginRecord = require('../models/loginrecord');
router.get('/record', async (req, res) => {
    try {
        const records = await LoginRecord.find().sort({ attemptedAt: -1 });
        res.render('record', { records });
    } catch (err) {
        res.status(500).send('Error reading login records');
    }
});

// Delete unmatched login attempt by ID
router.post('/record/delete/:id', async (req, res) => {
    try {
        await LoginRecord.findByIdAndDelete(req.params.id);
        res.redirect('/user/record');
    } catch (err) {
        res.status(500).send('Failed to delete record');
    }
});

// Show all users on /read
router.get('/read', async (req, res) => {
    try {
        const users = await User.find();
        res.render('read', { users });
    } catch (err) {
        res.status(500).send('Error reading users');
    }
});

router.get('/user', (req, res) => {
    res.send('user route is working');
});
module.exports = router;