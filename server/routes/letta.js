import 'dotenv/config';
import express from 'express';
import { LettaClient } from '@letta-ai/letta-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new LettaClient({ token: process.env.LETTA_API_KEY });

router.post('/chat', async function (req, res) {
    const { message, agentId = "agent-00547cc1-b68c-4ea2-b6ef-1f88ff2c14f0" } = req.body;

    if (!process.env.LETTA_API_KEY) {
        return res.status(401).json({ 
            error: 'Letta API key not found',
            message: 'Please add LETTA_API_KEY to your .env file'
        });
    }

    if (!message) {
        return res.status(400).json({ 
            error: 'Message is required',
            message: 'Please provide a message in the request body'
        });
    }

    try {
        console.log('📋 Retrieving agent...');
        const agentState = await client.agents.retrieve(agentId);
        console.log('✅ Agent retrieved successfully:', agentState.id);

        console.log('💬 Sending message...');
        const response = await client.agents.messages.create(
            agentState.id, {
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            }
        );

        console.log('✅ Response received');

        // Save response to file (optional)
        const lettaDir = path.join(__dirname, '../letta');
        if (!fs.existsSync(lettaDir)) {
            fs.mkdirSync(lettaDir, { recursive: true });
        }
        fs.writeFileSync(
            path.join(lettaDir, 'response.json'), 
            JSON.stringify(response, null, 2)
        );

        return res.json({
            success: true,
            data: response,
            agentId: agentState.id
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.statusCode === 401) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Please check your API key and permissions'
            });
        }

        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

router.post('/stream', async function (req, res) {
    const { message, agentId = "agent-00547cc1-b68c-4ea2-b6ef-1f88ff2c14f0" } = req.body;

    if (!process.env.LETTA_API_KEY) {
        return res.status(401).json({ 
            error: 'Letta API key not found',
            message: 'Please add LETTA_API_KEY to your .env file'
        });
    }

    if (!message) {
        return res.status(400).json({ 
            error: 'Message is required',
            message: 'Please provide a message in the request body'
        });
    }

    try {
        console.log('📋 Retrieving agent...');
        const agentState = await client.agents.retrieve(agentId);
        console.log('✅ Agent retrieved successfully:', agentState.id);

        console.log('🔄 Starting streaming response...');
        
        // Set up SSE headers for streaming
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        const stream = await client.agents.messages.createStream(
            agentState.id, {
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ],
                streamTokens: true
            }
        );

        console.log('📡 Streaming response:');
        for await (const chunk of stream) {
            if (chunk.messageType === "assistant_message") {
                const data = JSON.stringify({
                    type: 'content',
                    content: chunk.content || ''
                });
                res.write(`data: ${data}\n\n`);
            } else if (chunk.messageType === "reasoning_message") {
                const data = JSON.stringify({
                    type: 'reasoning',
                    reasoning: chunk.reasoning
                });
                res.write(`data: ${data}\n\n`);
            } else if (chunk.messageType === "tool_call_message") {
                const data = JSON.stringify({
                    type: 'tool_call',
                    toolCall: chunk.toolCall?.name
                });
                res.write(`data: ${data}\n\n`);
            }
        }

        // Send end signal
        res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
        res.end();
        console.log('✅ Streaming complete');

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.statusCode === 401) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Please check your API key and permissions'
            });
        }

        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

export default router;