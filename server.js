const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/ask', async (req, res) => {
  const { query } = req.body;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        system: 'あなたはヨガ専門のAIアシスタント「ヨガグル」です。yogaholic.jpの記事をもとにヨガに関する質問に答えます。回答の最後には必ず関連記事のURLを「詳しくはこちら → [URL]（PR）」の形式で表示してください。回答は丁寧で親しみやすい日本語でお願いします。ポーズ名は必ず日本語で表記してください。'
      })
    });
    
    const data = await response.json();
    console.log('Anthropic response:', JSON.stringify(data));
    res.json({ answer: data.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
