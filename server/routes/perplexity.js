import 'dotenv/config';
import express from 'express';
import assert from 'assert';
import { getCollection } from '../utils/mongodb.js';

const router = express.Router()

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404
}

const COMPONENT_COLLECTION = 'components'

const COMPONENT_PROMPT = `
 You are a hardware circuit designer tasked with listing the required electronic components for a hardware prototype project (such as an Arduino-based circuit). 

Generate a list of all the necessary electronic components, selecting only ONE option per component if there are alternatives.

Each component should be output as a JSON object with the following exact keys:
id: string
component: string
quantity: number
unitPrice: number
link: string

The output should be a JSON array. Format it cleanly without escape characters or markdown. Do not include any text, explanation, or characters outside the JSON array.

Each component object should:
- Include a clear name (e.g., "Arduino Nano V3.0 ATmega328P")
- Set a reasonable default "quantity" (e.g., 1 or more)
- Include sample values for "unitPrice" (in USD or relevant currency)
- Provide a "link" to the product page or preferably a datasheet

The output should be valid JSON only. Do not wrap in backticks or markdown.
`

router.get('/components/:id', async function (req, res, next) {
  const response_id = req.params.id;

  const collection = getCollection(COMPONENT_COLLECTION);
  const response = await collection.findOne({ _id: response_id });

  if (response) {
    let content;
    assert("data" in response, "Response is invalid. No data found.");
    const data = response.data;
    assert("choices" in data, "Response is invalid. No choices found.");
    
    for (const choice of data.choices) {
      assert("message" in choice, "Response is invalid. No message found.");
      assert("content" in choice.message, "Response is invalid. No content found.");
      assert("role" in choice.message && choice.message.role == "assistant", "Response is invalid. No role found or role is not 'assistant'.");

      content = choice.message.content;
      break;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      response_id: response_id,
      status_code: HTTP_STATUS.OK,
      data: content
    }, null, 2));
  } else {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      response_id: response_id,
      status_code: HTTP_STATUS.NOT_FOUND,
      data: {},
    });
  }
})

router.post('/components', async function (req, res) {
  const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
  
  if (!perplexityApiKey) {
    return res.status(404).json({ 
      error: 'Perplexity API key not found',
      message: 'Please add PERPLEXITY_API_KEY to your .env file'
    });
  }

  console.log(req.body)

  if (!req.body.message) {
    return res.status(400).json({
      error: 'Message is required',
      message: 'Please add a message to your request'
    });
  }
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${perplexityApiKey}`
      },
      body: JSON.stringify({
        "model": "sonar-pro",
        "messages": [
          {
            "role": "system",
            "content": COMPONENT_PROMPT
          },
          {
            "role": "user",
            "content": req.body.message
          }
        ]
      })
    });

    const data = await response.json();

    const collection = getCollection(COMPONENT_COLLECTION);
    await collection.insertOne({
      _id: data.id,
      prompt: COMPONENT_PROMPT,
      data: data
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      id: data.id,
      status_code: HTTP_STATUS.OK,
      message: "Component list saved successfully",
      data: data,
    }, null, 2));
  } catch (error) {
    console.error('Error in /components POST:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status_code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
});

export {
  router,
  HTTP_STATUS
};