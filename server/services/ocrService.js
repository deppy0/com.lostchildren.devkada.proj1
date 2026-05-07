require('dotenv').config({ quiet: true });

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ai2 = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_2 });

function extractJsonFromResponse(responseText) {
    if (!responseText) throw new Error('Empty response from Gemini');

    let trimmed = responseText.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        trimmed = trimmed.slice(1, -1);
    }

    try {
        return JSON.parse(trimmed);
    } catch (parseErr) {
        const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Could not parse JSON from Gemini response: ' + parseErr.message);
    }
}

async function generatePrescriptionJson(client, prompt) {
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ]
    });

    // compatible extraction for different SDK response shapes
    let text = typeof response.text === 'string' ? response.text : undefined;
    if (!text) {
        // fallback: some SDKs put generated content in candidates
        const cand = response?.candidates?.[0];
        text = cand?.message?.content?.[0]?.text || cand?.content?.[0]?.text || cand?.text;
    }

    return extractJsonFromResponse(text);
}

/**
 * Parse a prescription image buffer using Gemini-3-Flash and return structured JSON.
 * The image is not stored; it's encoded and submitted only in the request payload.
 * @param {Buffer|string} imageBuffer - Buffer or base64 string of the image
 * @returns {Promise<Object>} parsed JSON object matching the prescription template
 */
async function parsePrescriptionFromImage(imageBuffer) {
    if (!imageBuffer) throw new Error('imageBuffer is required');

    // Accept either Buffer or base64 string
    const base64 = Buffer.isBuffer(imageBuffer) ? imageBuffer.toString('base64') : String(imageBuffer);

    const prompt = `Extract the data from this prescription into the following JSON format. Ensure all values match the database types (e.g., TIME should be HH:MM:SS). If a field is not present, use null. The image is provided as a base64 string under the key "image_base64". Produce ONLY valid JSON that exactly matches the template; do not include any explanation or surrounding text.

JSON Template:
{
  "doctor_name": "string or null",
  "date_issued": "YYYY-MM-DD or null",
  "medications": [
    {
      "name": "string or null",
      "strength": "string or null",
      "total_amount_prescribed": integer or null,
      "hourly_gap": integer or null,
      "max_per_day": integer or null,
      "schedules": [
        {
          "time_of_day": "HH:MM:SS or null",
          "is_after_meal": boolean or null,
          "frequency": "string or null"
        }
      ]
    }
  ]
}

Here is the image payload (base64):\n${base64}`;

    try {
        return await generatePrescriptionJson(ai, prompt);
    } catch (err) {
        console.warn('Primary Gemini OCR failed, retrying with backup:', err.message || err);

        try {
            return await generatePrescriptionJson(ai2, prompt);
        } catch (backupErr) {
            console.error('Gemini OCR error:', backupErr.message || backupErr);
            throw backupErr;
        }
    }
}

module.exports = {
    parsePrescriptionFromImage
};