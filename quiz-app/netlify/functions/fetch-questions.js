const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  try {
    const { topic } = JSON.parse(event.body);

    const apiKey = process.env.OPENAI_API_KEY; // Securely access the API key
    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: `
          Create 10 multiple-choice questions about ${topic}. Each question should include:
          - A "question" string
          - An "answers" array with 4 options (including 1 correct answer). The position of the correct answer in the array should vary.
          - A "correct" key indicating the index of the correct answer.
          Format your response as JSON like this:
          [
            {
              "question": "What is JavaScript?",
              "answers": ["A programming language", "A database", "An operating system", "A text editor"],
              "correct": 0
            },
            ...
          ]
        `,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Ensure `questions` is parsed correctly
    const rawQuestions = data.choices[0].message.content;
    const parsedQuestions = JSON.parse(rawQuestions);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ questions: parsedQuestions }), // Send an array directly
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Failed to fetch questions" }),
    };
  }
};
