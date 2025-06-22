import { LettaClient } from '@letta-ai/letta-client'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables from .env file
dotenv.config();

// Check if API key is set
if (!process.env.LETTA_API_KEY) {
    console.error('❌ LETTA_API_KEY environment variable is not set!');
    console.log('Please check your .env file and make sure LETTA_API_KEY is defined.');
    process.exit(1);
}

console.log('🔑 API Key found:', process.env.LETTA_API_KEY.substring(0, 10) + '...');

const client = new LettaClient({ token: process.env.LETTA_API_KEY });

// const agentList = await client.agents.list();

// console.log(agentList);

try {
    console.log('📋 Retrieving agent...');
    const agentState = await client.agents.retrieve("agent-00547cc1-b68c-4ea2-b6ef-1f88ff2c14f0");
    console.log('✅ Agent retrieved successfully:', agentState.id);

    console.log('💬 Sending message...');
    const response = await client.agents.messages.create(
        agentState.id, {
            messages: [
                {
                    role: "user",
                    content: "Can you make a schematic for a firefighting robot that traverses through a maze?"
                }
            ]
        }
    );

    console.log('✅ Response received:');
    console.log(JSON.parse(JSON.stringify(response, null, 2)));

    fs.writeFileSync('letta/response.json', JSON.stringify(response, null, 2));

    // // Send a follow-up message to get the complete circuit design
    // console.log('\n💬 Sending follow-up message...');
    // const followUpResponse = await client.agents.messages.create(
    //     agentState.id, {
    //         messages: [
    //             {
    //                 role: "user",
    //                 content: "Please continue and show me the complete circuit diagram and code for the air quality sensor."
    //             }
    //         ]
    //     }
    // );

    // console.log('✅ Follow-up response received:');
    // console.log(followUpResponse);

    // Alternative: Use streaming to see responses in real-time
    // console.log('\n🔄 Testing streaming response...');
    // const stream = await client.agents.messages.createStream(
    //     agentState.id, {
    //         messages: [
    //             {
    //                 role: "user",
    //                 content: "Show me the complete Arduino code for the air quality sensor circuit."
    //             }
    //         ],
    //         streamTokens: true
    //     }
    // );

    // console.log('📡 Streaming response:');
    // for await (const chunk of stream) {
    //     if (chunk.messageType === "assistant_message") {
    //         process.stdout.write(chunk.content || '');
    //     } else if (chunk.messageType === "reasoning_message") {
    //         console.log('\n🤔 Reasoning:', chunk.reasoning);
    //     } else if (chunk.messageType === "tool_call_message") {
    //         console.log('\n🔧 Tool call:', chunk.toolCall?.name);
    //     }
    // }
    // console.log('\n✅ Streaming complete');
} catch (error) {
    console.error('❌ Error:', error.message);
    if (error.statusCode === 401) {
        console.log('\n🔑 Authentication failed. Please check:');
        console.log('  1. Your API key is correct and complete');
        console.log('  2. You\'re connecting to the right server (cloud vs self-hosted)');
        console.log('  3. Your API key has the necessary permissions');
        console.log('  4. If self-hosting, make sure your server is running');
    }
    throw error;
}

// for (const message of response.messages) {
//     console.log(message);
// }