const express = require('express');
const fs = require('fs');
const cors = require('cors');
const router = express.Router();

const DATA_FILE = './site_structure.json';

// שליפת מבנה האתר
router.get('/get-site', (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
        res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
    } else {
        res.json({ pages: { "index": { html: "<h1>Welcome</h1>", styles: {} } } });
    }
});

// שמירת שינויים מהעורך
router.post('/save-site', (req, res) => {
    const { password, data } = req.body;
    if (password === "admin123") {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ status: "success" });
    } else {
        res.status(403).json({ status: "error" });
    }
});

module.exports = router;
