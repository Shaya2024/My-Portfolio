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

    const apiKey = process.env.OPENAI_API_KEY;
    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant that creates quiz questions. Always respond with valid JSON arrays containing questions.",
      },
      {
        role: "user",
        content: `Generate 10 multiple-choice questions about ${topic}. Return ONLY a JSON array with no additional text or formatting. Each object in the array should have exactly this format: {"question": "string", "answers": ["string", "string", "string", "string"], "correct": number}`,
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
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI API");
    }

    // Add error handling for JSON parsing
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(data.choices[0].message.content.trim());
      
      // Validate the structure of the parsed questions
      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Response is not an array");
      }

      // Validate each question object
      parsedQuestions.forEach((q, index) => {
        if (!q.question || !Array.isArray(q.answers) || q.answers.length !== 4 || typeof q.correct !== 'number') {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });
    } catch (parseError) {
      console.error("JSON parsing error:", parseError, "Raw content:", data.choices[0].message.content);
      throw new Error("Failed to parse questions from API response");
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ questions: parsedQuestions }),
    };
  } catch (error) {
    console.error("Error details:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ 
        error: "Failed to fetch questions",
        details: error.message 
      }),
    };
  }
};