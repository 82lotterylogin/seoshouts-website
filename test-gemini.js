const testGemini = async () => {
  const API_KEY = 'AIzaSyBFVdYwnfp6yUozxWdzVRO_rN1YlutK3cw'
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say hello world'
            }]
          }]
        })
      }
    )
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testGemini()
