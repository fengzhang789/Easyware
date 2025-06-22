import { LettaClient } from '@letta-ai/letta-client'

const client = new LettaClient({ token: process.env.LETTA_API_KEY });

const agentState = await client.agents.create({
    model: "openai/gpt-4.1",
    embedding: "openai/text-embedding-3-small",
    memoryBlocks: [
        {
            label: "human",
            value: "The human's name is Chad. They like vibe coding."
        },
        {
            label: "persona",
            value: "My name is Sam, the all-knowing sentient AI."
        }
    ],
    tools: ["web_search", "run_code"]
});

console.log(agentState.id);
