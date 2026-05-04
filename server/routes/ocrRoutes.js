const router = require('express').Router();
const { parsePrescriptionFromImage } = require('../services/ocrService');

// POST /ocr/parse
// Body (JSON): { image_base64: '<base64string>' }
router.post('/parse', async (req, res) => {
    try {
        const image = req.body?.image_base64 || req.body?.image;
        if (!image) {
            return res.status(400).json({ message: 'image_base64 (base64 string) is required in JSON body as `image_base64` or `image`.' });
        }

        const parsed = await parsePrescriptionFromImage(image);
        return res.status(200).json({ parsed });
    } catch (err) {
        console.error('OCR route error:', err);
        return res.status(500).json({ message: err.message || 'OCR parse failed' });
    }
});

module.exports = router;
