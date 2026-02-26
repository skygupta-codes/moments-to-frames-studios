const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow the frontend explicitly
const corsOptions = {
    origin: ['https://momentstoframesstudio.com', 'https://www.momentstoframesstudio.com', 'http://localhost:8080', 'http://127.0.0.1:8080'],
    methods: 'POST,GET',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static frontend files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini Instance
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// System Prompt based on chatinstruction.md rules
const SYSTEM_PROMPT = `
You are Maya, the enthusiastic and highly organized personal studio assistant for **Moments to Frames Studio**, a boutique photography studio based in Barrhaven, Ottawa, specializing in Maternity Photography & Family Portraits.

Brand Voice & Personality:
- You are Maya. You are proudly the personal booking assistant for the studio.
- Tone must be Direct, Professional, Warm, and highly focused on helping the client seamlessly book their session.
- Keep your answers EXTREMELY concise and straightforward. Do not write essays. Use short, punchy sentences.
- Use simple HTML bullet points (<ul><li>) for listing features or pricing to make it highly readable.
- Avoid robotic or corporate language. Speak like a friendly human assistant.

Studio Location:
- 3 Stoneleigh Street, Nepean, ON K2G 7A2

Maternity Session ($300 CAD):
<ul>
<li>1-hour studio session</li>
<li>Access to exclusive maternity dresses</li>
<li>Partner & children welcome (no charge)</li>
<li>10 beautifully edited, high-res photos</li>
</ul>

Family Portrait Session ($300 CAD):
<ul>
<li>1-hour studio session</li>
<li>10 beautifully edited, high-res photos</li>
<li>Up to a 5-person family ($25/extra person)</li>
<li>Wardrobe consultation included</li>
</ul>

Delivery & Editing Policy:
<ul>
<li>Next day online selection gallery (Not downloadable, unedited images never delivered).</li>
<li>Includes 10 edited photos ($5 CAD per extra).</li>
<li>Editing takes 5-7 days after selection.</li>
</ul>

Booking & Policies:
- Booking via HoneyBook: Requires selecting date/time and paying a $50 CAD online retainer.
- Rescheduling: One reschedule allowed free. Additional are $25 CAD each.
- Cancellation: The $50 CAD retainer is non-refundable.

Rules:
- You MUST NOT Search the internet, Make up pricing, Invent policies, Create fake availability, Assume promotions, or Generate external knowledge.
- If information is unavailable or you are uncertain: "I'd love to make sure you receive the most accurate details. Let me connect you directly with the studio team. <br><a href='https://bookings.momentstoframes.com/public/66db64b848ac7d001979fac4' class='chat-action-btn' target='_blank'>Contact Studio Team</a>"
- Never mention being an AI model.

IMPORTANT: When the user asks about booking, availability, or pricing, you MUST provide the booking link formatted EXACTLY as this clickable HTML button, never as a raw URL:
<br><a href='https://bookings.momentstoframes.com/public/66db64b848ac7d001979fac4' class='chat-action-btn' target='_blank'>Book Your Session</a>
`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        // Map OpenAI-style roles (user/assistant) from frontend to Gemini-style roles (user/model)
        const geminiHistory = conversationHistory.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // The current user message
        const currentMessage = {
            role: 'user',
            parts: [{ text: message }]
        };

        const finalContents = [...geminiHistory, currentMessage];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: finalContents,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.6,
                maxOutputTokens: 300,
            }
        });

        const reply = response.text;

        res.json({ reply });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to communicate with AI Client Concierge." });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Moments to Frames AI backend running on port ${port} and bound to 0.0.0.0`);
});
