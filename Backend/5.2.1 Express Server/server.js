// Import express module
import express from "express";

// All middleware that allows you to send request files and parse documents
import multer from 'multer';
import cors from 'cors';
import officeParser from 'officeparser';
import path from "path";
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import bodyParser from "body-parser";
const require = createRequire(import.meta.url);
const {PDFParse} = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Use OpenAI
import { OpenAI } from 'openai';

// Include .env file for API key
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });


// Initialize Express app and use JSON in your project
const app = express();
app.use(express.json());
app.use(cors());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Post Request for generating Questions Via ChatGPT
const upload = multer({ storage: multer.memoryStorage() });
app.post('/generate-quiz', upload.single('file'), async (req, res) => {

    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded.' });

        let text = '';

        // Detailed error tracking for file parsing
        try {
            if (file.originalname.endsWith('.pdf')) {
                // FIXED FOR V2: Instantiate the class using the uploaded memory buffer
                const parser = new PDFParse({ data: file.buffer });
                
                // Extract document text content
                const result = await parser.getText();
                text = result.text;
                
                // CRITICAL V2 REQUIRED STEP: Destroy the instance to prevent memory leaks
                await parser.destroy();
                
            } else if (file.originalname.endsWith('.docx')) {
                text = await officeParser.parseUndefinedBufferAsync(file.buffer);
            } else {
                return res.status(400).json({ error: 'Unsupported file extension.' });
            }
        } catch (parseError) {
            return res.status(500).json({
                error: 'Failed during file parsing step',
                message: parseError.message,
                stack: parseError.stack
            });
        }
        
        // ... (Rest of your OpenAI endpoint logic remains exactly the same)


        if (!text.trim()) return res.status(400).json({ error: 'The uploaded file contains no readable text.' });

        // Detailed error tracking for OpenAI API call
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a teacher crafting exam prep tools. Analyze the document context to build comprehensive test questions." },
                    { role: "user", content: `Generate EXACTLY 30 (Exactly 30, nothing more nothing less) unique questions where the answer is only ONE WORD. ONLY ONE WORD!!!\n\nContext:\n${text}` }
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "quiz_generation",
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                questions: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            question: { type: "string" },
                                            correctAnswer: { type: "string", description: "The one-word answer to the question." }
                                        },
                                        required: ["question", "correctAnswer"],
                                        additionalProperties: false
                                    }
                                }
                            },
                            required: ["questions"],
                            additionalProperties: false
                        }
                    }
                }
            });

            // FIXED HERE: Double-checked array positioning structure
            const quizData = JSON.parse(completion.choices[0].message.content);
            console.log(completion);
            res.json(quizData);
           

           

        } catch (openAiError) {
            return res.status(500).json({
                error: 'Failed during OpenAI API communication step',
                message: openAiError.message,
                stack: openAiError.stack
            });
        }

    } catch (globalError) {
        console.error("Global crash:", globalError);
        res.status(500).json({
            error: 'Global server exception caught',
            message: globalError.message,
            stack: globalError.stack
        });
    }
});

// Requests for the Gameboard
app.get("/Frontend/GameBoard.html", (req,res)=>{
    res.sendFile(__dirname + "Jeopard_Game_/Frontend/GameBoard.html")
})

// Listen on Local Host Port 5000
app.listen(5000, () => console.log('Quiz Server running on port 5000'));