const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/ask', async (req, res) => {
  const { query } = req.body;
  
  try {
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query: query,
        response_mode: 'blocking',
        conversation_id: '',
        user: 'yogaguru-user'
      })
    });
    
    const data = await response.json();
    res.json({ answer: data.answer });
  } catch (error) {
    res.status(500).json({ error: 'エラーが発生しました' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
