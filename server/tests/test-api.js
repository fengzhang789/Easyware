async function testAPI() {
  const fetch = (await import('node-fetch')).default;
  const baseURL = 'http://localhost:3001';
  
  try {
    console.log('🚀 Making POST request to /perplexity/components...');
    
    // Step 1: Make POST request
    const postResponse = await fetch(`${baseURL}/perplexity/components`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!postResponse.ok) {
      throw new Error(`POST request failed: ${postResponse.status} ${postResponse.statusText}`);
    }
    
    const postData = await postResponse.json();
    console.log('✅ POST request successful');
    console.log('📝 Response ID:', postData.response_id);
    console.log('📊 Status Code:', postData.status_code);
    
    // Step 2: Make GET request with the response ID
    console.log('\n🔄 Making GET request to retrieve formatted JSON...');
    
    const getResponse = await fetch(`${baseURL}/perplexity/components/${postData.response_id}`);
    
    if (!getResponse.ok) {
      throw new Error(`GET request failed: ${getResponse.status} ${getResponse.statusText}`);
    }
    
    const getData = await getResponse.json();
    console.log('✅ GET request successful');
    console.log('📝 Response ID:', getData.response_id);
    console.log('📊 Status Code:', getData.status_code);
    console.log('\n📋 Formatted JSON Data:');
    console.log(getData.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testAPI(); 