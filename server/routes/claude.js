require('dotenv').config();
const express = require('express')
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { HTTP_STATUS } = require('./perplexity');

const router = express.Router()
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
        
        const tsCodeMatch = fullResponse.match(/```tsx\s*([\s\S]*?)\s*```/);
        let tsCode = '';
        
        if (tsCodeMatch) {
            tsCode = tsCodeMatch[1];
            console.log('TypeScript code extracted successfully');
        } else {
            const codeMatch = fullResponse.match(/```\s*([\s\S]*?)\s*```/);
            if (codeMatch) {
                tsCode = codeMatch[1];
                console.log('Code block extracted (may not be TSX)');
            } else {
                const jsxMatch = fullResponse.match(/(<board[\s\S]*?<\/board>)/);
                if (jsxMatch) {
                    tsCode = `export default () => (\n  ${jsxMatch[1]}\n)`;
                    console.log('JSX content extracted and wrapped in export function');
                } else {
                    console.log('No code block or JSX content found in response');
                }
            }
        }

        if (tsCode) {
            const responsePath = path.join(__dirname, '../../frontend/public/responses/response.txt');
            fs.writeFileSync(responsePath, tsCode, 'utf8');
            console.log('TypeScript code saved to response.txt');
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

module.exports = router;