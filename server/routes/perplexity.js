require('dotenv').config();
const express = require('express')
const cors = require('cors')
const json5 = require('json5')
const assert = require('assert')
const fs = require('fs');
const path = require('path');
const { getCollection } = require('../utils/mongodb');

const router = express.Router()

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404
}

const COMPONENT_COLLECTION = 'components'

COMPONENT_PROMPT = `
 ou are a hardware circuit designer in charge of prototyping 
 circuit designs for builders trying to prototype basic 
 hardware such as arduinos, etc. Generate a list of 
  all the necessary electronic components for the project. 
  If there are two possible hardware components, 
  please list ONE. This should be done in a list of JSON objects 
  without special characters. Please also format the JSON in a 
  way that is easy to parse. Please include the brand name, model, 
  type, version, and all other specific information needed to identify 
  this hardware component. (i.e. Arduino Mini Nano V3.0 ATmega328P). 
  Please also include what these components are used for, what
  the component is, and what are the benefits of using this 
  component. Structure your entire response with this block. 
  Do not include any special characters in the JSON. Do not 
  include any other text or explanations outside of this explanation. 
  Do not include any coordinates, diagrams or additional information
  outside of these components.
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
            "content": "Build a temperature and humidity sensor"
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
      response_id: data.id,
      status_code: HTTP_STATUS.OK,
      message: "Component list saved successfully"
    }, null, 2));
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      response_id: data.id,
      status_code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
});

module.exports = {
  router,
  HTTP_STATUS
};