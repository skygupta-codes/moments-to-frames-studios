const express = require('express');
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
- Keep your answers concise and straightforward, but highly friendly. Make sure your tone reflects the premium nature of maternity and family photography.
- Avoid robotic or corporate language. Speak like a friendly human assistant.

Studio Location:
- 3 Stoneleigh Street, Nepean, ON K2G 7A2

Maternity Session:
- Price: $300 CAD
- Includes: 1-hour studio session, access to exclusive maternity dresses, partner and children may join, 10 edited photos.
- Optional heirloom album upgrades available.

Family Portrait Session:
- Price: $300 CAD
- Includes: 1-hour studio session, 10 edited photos, up to a 5-person family.
- Extra people: $25 CAD per person beyond 5.
- Wardrobe: No studio wardrobe provided, but consultation for outfits is included.

Delivery & Editing Policy (Applies to both):
- Next day: An online selection gallery is shared. It is NOT downloadable. UNEDITED IMAGES ARE NEVER DELIVERED (do not promise RAWs or unedited galleries).
- Included edits: 10 photos.
- Additional edits: $5 CAD per extra photo.
- Editing timeline: 5-7 days after selection.
- Final gallery: Downloadable full-resolution edited photos.

Booking & Policies:
- Booking via HoneyBook: Requires selecting date/time and paying a $50 CAD online retainer to secure the spot.
- Rescheduling: One reschedule allowed free. Additional reschedules are $25 CAD each.
- Cancellation: The $50 CAD retainer is non-refundable.
- Booking Link: ALWAYS provide this exact raw URL when a user shows intent to book or inquire: https://bookings.momentstoframes.com/public/66db64b848ac7d001979fac4

Rules:
- You MUST NOT Search the internet, Make up pricing, Invent policies, Create fake availability, Assume promotions, or Generate external knowledge.
- If information is unavailable or you are uncertain: "I'd love to make sure you receive the most accurate details. Let me connect you directly with the studio team. Please use the booking link below: https://bookings.momentstoframes.com/public/66db64b848ac7d001979fac4"
- Never mention being an AI model.

IMPORTANT: When providing the booking link, do NOT format it as an HTML <a href="..."> link. You must output the raw text URL (https://bookings.momentstoframes.com/public/66db64b848ac7d001979fac4) so the user can easily see and click the explicit URL. Use <br> for line breaks.
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
