require('dotenv').config();
const express = require('express')
const cors = require('cors')
const assert = require('assert')
const app = express()
const PORT = process.env.PORT || 3001;

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500
}
  
memory_responses = {}

COMPONENT_PROMPT = `
  You are an expert AI assistant for hardware prototyping. 
  Your task is to take a user's idea and generate all the 
  necessary information to build it. Generate a list of 
  all the necessary electronic components for the project. 
  Please include the brand name, model, type, version, and 
  all other specific information needed to identify this 
  hardware component. (i.e. Arduino Mini Nano V3.0 ATmega328P). 
  Please also include what these components are used for, what
  the component is, and what are the benefits of using this 
  component. If there are two possible hardware components, 
  please list ONE. This should be done in Markdown format.
  Structure your entire response with this block. Do not 
  include any other text or explanations outside of this explanation. 
  Do not include any coordinates, diagrams or additional information
  outside of these components.
`

DIAGRAM_PROMPT = `
You are an expert AI assistant for hardware prototyping. 
Please generate a basic connection diagram in Markdown 
or basic txt format. This will include the basic names 
of all the components in the component list and how 
they interact with each other. Please also provide 
a JSON of these components - include their name, 
the type of component, what it's used for and 
its coordinates on the diagram relative to other 
components. Structure your entire response with this 
block. Do not include any other text or explanations 
outside of these tags.
`

app.use(cors())
app.use(express.json())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.get('/perplexity/components/:id', function (req, res, next) {
  const response_id = req.params.id;

  if (response_id in memory_responses) {
    const data = memory_responses[response_id];
    let content = "";
    assert("choices" in data, "Response is invalid. No choices found.");
    
    for (const choice of data.choices) {
      assert("message" in choice, "Response is invalid. No message found.");
      assert("content" in choice.message, "Response is invalid. No content found.");
      assert("role" in choice.message && choice.message.role == "assistant", "Response is invalid. No role found or role is not 'assistant'.");
      
      content = choice.message.content;
      break;
    }

    res.json(
      {
        response_id: response_id,
        status_code: HTTP_STATUS.OK,
        data: content
      }
    );
  } else {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      response_id: response_id,
      status_code: HTTP_STATUS.NOT_FOUND,
      data: {},
    });
  }
})

app.post('/perplexity/components', async function (req, res) {
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
            "content": "Can you help me build a bluetooth controlled door knob?"
          }
        ]
      })
    });

    const data = await response.json();
    memory_responses[data.id] = data;
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      response_id: data.id,
      status_code: HTTP_STATUS.OK,
      prompt: COMPONENT_PROMPT,
      data: data
    }, null, 2)); 

  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      response_id: response_id,
      prompt: COMPONENT_PROMPT,
      status_code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
