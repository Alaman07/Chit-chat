import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({});

export const handleAiReq = async (req, res) => {
    const { text } = req.body;
    const user = req.user._id;
    const allowedUserId = process.env.ADMIN_OBJ_ID; // <-- put the allowed user's ObjectId here

    try {
        // Create user's message object
        const userMsg = {
            _id: Date.now().toString() + "-user",
            text: text,
            senderId: user,
            receiverId: "ai",
            createdAt: new Date(),
            image: null
        };

        if (user != allowedUserId) {
            // Hardcoded AI response for unauthorized users
            const aiMsg = {
                _id: Date.now().toString() + "-ai",
                text: "Don't text me, only aman can text me.",
                senderId: "ai",
                receiverId: user,
                createdAt: new Date(),
                image: null
            };
            return res.status(200).json([userMsg, aiMsg]);
        }

        // Get AI response for allowed user
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text }] }],
            config: {
                systemInstruction: "You are my girlfriend.",
            },
        });
        const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
        const aiMsg = {
            _id: Date.now().toString() + "-ai",
            text: aiText,
            senderId: "ai",
            receiverId: user,
            createdAt: new Date(),
            image: null
        };
        res.status(200).json([userMsg, aiMsg]);
    } catch (err) {
        console.error("AI error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}