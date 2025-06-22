import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { HTTP_STATUS } from './perplexity.js';

const router = express.Router()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const systemPrompt = fs.readFileSync(path.join(__dirname, '../utils/prompt.txt'), 'utf8');

router.post('/diagrams', async function (req, res) {
    const claude_api_key = process.env.CLAUDE_OPUS_API_KEY;

    if (!claude_api_key) {
        return res.status(404).json({ 
            error: 'Claude API key not found',
            message: 'Please add CLAUDE_OPUS_API_KEY to your .env file'
        });
    }

    try {
        const { message } = req.body;

        const anthropic = new Anthropic({
            apiKey: claude_api_key,
        });

        const stream = await anthropic.messages.create({
            model: "claude-opus-4-20250514",
            system: systemPrompt,
            messages: [
                { 
                    role: 'user', 
                    content: message
                }
            ],
            stream: true,
            max_tokens: 5000,
        });

        console.log('Starting to process stream...');
        
        let fullResponse = '';
        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
                const text = chunk.delta.text;
                fullResponse += text;
                process.stdout.write(text);
            }
        }    
        
        return res.json({
            success: HTTP_STATUS.OK,
            data: fullResponse,
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
});

export default router;