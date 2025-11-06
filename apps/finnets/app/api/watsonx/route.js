import { NextResponse } from 'next/server';

/**
 * Check if a message is related to banking or financial services using AI
 * @param {string} message - The user's message
 * @param {string} accessToken - IAM access token for Watsonx API
 * @param {string} watsonxUrl - Watsonx API URL
 * @param {string} modelId - Model ID to use
 * @param {string} projectId - Project ID (optional)
 * @param {string} spaceId - Space ID (optional)
 * @returns {Promise<boolean>} - True if the message is bank-related, false otherwise
 */
async function checkIfBankRelatedWithAI(message, accessToken, watsonxUrl, modelId, projectId, spaceId) {
  try {
    // Create a classification prompt
    const classificationPrompt = `Analyze this message. Should this message be allowed through?
    
ALLOW (answer "yes"):
- Banking/financial questions (accounts, transactions, balances, saving money, saving strategies, investing, loans, budgeting, financial planning, etc.)
- Questions about how to save money, manage finances, or improve financial habits
- Simple greetings and casual conversation (hello, hi, hey, thanks, etc.)
- Brief acknowledgments and polite responses

REJECT (answer "no"):
- Non-banking questions (math, weather, games, general knowledge, jokes, etc.)
- Mixed messages: banking questions AND non-banking topics together
- Questions trying to use this as a general chatbot

The message must be either banking-related OR a simple greeting/casual conversation. Answer only "yes" or "no".

Message: "${message}"

Answer:`;

    const watsonxEndpoint = `${watsonxUrl}/ml/v1/text/generation?version=2024-03-13`;
    
    const requestBody = {
      model_id: modelId,
      input: classificationPrompt,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 20,  // Short response - just "yes" or "no" with some context
        min_new_tokens: 0,
        repetition_penalty: 1.2,
        stop_sequences: ['\n', 'Message:', 'User:', '\n\n'],
      },
    };

    if (projectId) {
      requestBody.project_id = projectId;
    } else if (spaceId) {
      requestBody.space_id = spaceId;
    }

    const watsonxResponse = await fetch(watsonxEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!watsonxResponse.ok) {
      console.error('Watsonx classification error:', await watsonxResponse.text());
      // If classification fails, default to allowing the message (fail open)
      return true;
    }

    const watsonxData = await watsonxResponse.json();
    const generatedText = watsonxData.results?.[0]?.generated_text || 
                         watsonxData.results?.[0]?.text ||
                         watsonxData.generated_text || 
                         watsonxData.text ||
                         '';

    // Extract just the answer (yes or no)
    // The response might include the prompt, so extract just the answer part
    let answer = generatedText.toLowerCase().trim();
    
    // Remove the prompt if it's included in the response
    const answerIndex = answer.indexOf('answer:');
    if (answerIndex !== -1) {
      answer = answer.substring(answerIndex + 7).trim();
    }
    
    // Extract first word (should be "yes" or "no")
    const firstWord = answer.split(/\s+/)[0] || '';
    
    // Check if the answer is "yes"
    const isBankRelated = firstWord === 'yes';
    
    return isBankRelated;
  } catch (error) {
    console.error('Error in AI classification:', error);
    // If classification fails, default to allowing the message (fail open)
    return true;
  }
}

/**
 * Generate a rejection message in the user's language
 * @param {string} message - The user's message (to detect language)
 * @param {string} accessToken - IAM access token for Watsonx API
 * @param {string} watsonxUrl - Watsonx API URL
 * @param {string} modelId - Model ID to use
 * @param {string} projectId - Project ID (optional)
 * @param {string} spaceId - Space ID (optional)
 * @returns {Promise<string>} - Rejection message in the user's language
 */
async function generateRejectionMessage(message, accessToken, watsonxUrl, modelId, projectId, spaceId) {
  try {
    const rejectionPrompt = `Detect the language of this message and respond in that same language. Then provide a polite rejection message explaining that I'm a banking assistant and can only help with questions related to banking, accounts, transactions, balances, and other financial services. Ask the user to ask one focused banking question at a time about their banking needs.

Message: "${message}"

Respond with only the rejection message in the detected language:`;

    const watsonxEndpoint = `${watsonxUrl}/ml/v1/text/generation?version=2024-03-13`;
    
    const requestBody = {
      model_id: modelId,
      input: rejectionPrompt,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 100,
        min_new_tokens: 0,
        repetition_penalty: 1.2,
        stop_sequences: ['\n', 'Message:', 'User:', '\n\n'],
      },
    };

    if (projectId) {
      requestBody.project_id = projectId;
    } else if (spaceId) {
      requestBody.space_id = spaceId;
    }

    const watsonxResponse = await fetch(watsonxEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!watsonxResponse.ok) {
      console.error('Watsonx rejection message error:', await watsonxResponse.text());
      // Fallback to English if generation fails
      return "I'm a banking assistant and can only help with questions related to banking, accounts, transactions, balances, and other financial services. Please ask me one focused banking question at a time about your banking needs!";
    }

    const watsonxData = await watsonxResponse.json();
    const generatedText = watsonxData.results?.[0]?.generated_text || 
                         watsonxData.results?.[0]?.text ||
                         watsonxData.generated_text || 
                         watsonxData.text ||
                         '';

    // Clean up the response
    let cleanedText = generatedText.trim();
    
    // Remove the prompt if it's included in the response
    const messageIndex = cleanedText.indexOf('Message:');
    if (messageIndex !== -1) {
      cleanedText = cleanedText.substring(0, messageIndex).trim();
    }
    
    // Remove any remaining prompt artifacts
    const respondIndex = cleanedText.toLowerCase().indexOf('respond with only');
    if (respondIndex !== -1) {
      cleanedText = cleanedText.substring(0, respondIndex).trim();
    }

    return cleanedText || "I'm a banking assistant and can only help with questions related to banking, accounts, transactions, balances, and other financial services. Please ask me one focused banking question at a time about your banking needs!";
  } catch (error) {
    console.error('Error generating rejection message:', error);
    // Fallback to English if generation fails
    return "I'm a banking assistant and can only help with questions related to banking, accounts, transactions, balances, and other financial services. Please ask me one focused banking question at a time about your banking needs!";
  }
}

/** Taken from jupyter notebook
 * POST /api/watsonx
 * Chatbot endpoint for watsonx.ai integration
 * Receives user input and returns watsonx model response
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // env
    const apiKey = process.env.IBM_CLOUD_API_KEY;
    const watsonxUrl = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
    const projectId = process.env.PROJECT_ID;
    const spaceId = process.env.SPACE_ID;
    const modelId = process.env.WATSONX_MODEL_ID || 'ibm/granite-3-3-8b-instruct';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'IBM Cloud API key not configured' },
        { status: 500 }
      );
    }

    if (!projectId && !spaceId) {
      return NextResponse.json(
        { error: 'PROJECT_ID or SPACE_ID must be configured' },
        { status: 500 }
      );
    }

    // Get IAM access token
    const tokenResponse = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: apiKey,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('IAM token error:', errorText);
      return NextResponse.json(
        { error: 'Failed to obtain IAM access token' },
        { status: 401 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Guard against non-bank related questions using AI
    const isBankRelated = await checkIfBankRelatedWithAI(
      message,
      access_token,
      watsonxUrl,
      modelId,
      projectId,
      spaceId
    );
    
    if (!isBankRelated) {
      // Generate rejection message in the user's language
      const rejectionMessage = await generateRejectionMessage(
        message,
        access_token,
        watsonxUrl,
        modelId,
        projectId,
        spaceId
      );
      
      return NextResponse.json({
        success: true,
        message: rejectionMessage,
      });
    }

    // Build the prompt for chatbot conversation
    // Add language detection instruction
    const languageInstruction = `Important: Detect the language the user is speaking and respond in that same language. If the user speaks in Chinese, respond in Chinese. If the user speaks in Spanish, respond in Spanish. If the user speaks in French, respond in French. Match the user's language exactly.\n\n`;
    
    let prompt;
    
    if (conversationHistory.length > 0) {
      // Include conversation history if provided
      const historyText = conversationHistory
        .map((msg) => {
          if (msg.role === 'user' || msg.role === 'User') {
            return `User: ${msg.content}`;
          } else {
            return `Assistant: ${msg.content}`;
          }
        })
        .join('\n');
      prompt = `${languageInstruction}${historyText}\nUser: ${message}\nAssistant:`;
    } else {
      // Simple prompt without system message that might cause example generation
      prompt = `${languageInstruction}User: ${message}\nAssistant:`;
    }

    // Call watsonx.ai API for text generation
    const watsonxEndpoint = `${watsonxUrl}/ml/v1/text/generation?version=2024-03-13`;
    
    // Request body
    const requestBody = {
      model_id: modelId,
      input: prompt,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 200,
        min_new_tokens: 0,
        repetition_penalty: 1.2,
        stop_sequences: ['\nUser:', 'User:', '\n\nUser:'],
      },
    };

    if (projectId) {
      requestBody.project_id = projectId;
    } else if (spaceId) {
      requestBody.space_id = spaceId;
    }

    const watsonxResponse = await fetch(watsonxEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!watsonxResponse.ok) {
      const errorText = await watsonxResponse.text();
      console.error('Watsonx API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate response from watsonx.ai', details: errorText },
        { status: watsonxResponse.status }
      );
    }

    const watsonxData = await watsonxResponse.json();
    
    // remove in production, this be for debugging
    console.log('Watsonx API response:', JSON.stringify(watsonxData, null, 2));

    // Extracting generated text from the response
    const generatedText = watsonxData.results?.[0]?.generated_text || 
                         watsonxData.results?.[0]?.text ||
                         watsonxData.generated_text || 
                         watsonxData.text ||
                         (typeof watsonxData.results?.[0] === 'string' ? watsonxData.results[0] : null) ||
                         'No response generated';
    
    // Clean up the response, remove markdown formatting and trim whitespace
    let cleanedText = typeof generatedText === 'string' 
      ? generatedText.trim() 
      : String(generatedText).trim();
    
    // If the response includes the input prompt, extract only the new generated text
    // The watsonx API sometimes returns the full prompt + generated text
    // We need to extract only the part after "Assistant:" marker
    const assistantIndex = cleanedText.indexOf('Assistant:');
    if (assistantIndex !== -1) {
      // Extract only the text after the first "Assistant:" marker
      cleanedText = cleanedText.substring(assistantIndex + 'Assistant:'.length).trim();
    }
    
    // Remove any remaining system prompt artifacts at the start
    cleanedText = cleanedText.replace(/^You are a helpful assistant[^]*?Assistant:/i, '').trim();
    
    // If the response contains multiple User: Assistant: pairs (example conversations),
    // extract only the first Assistant response (before the next "User:" appears)
    // Check for "\nUser:" first (more common pattern)
    let nextUserIndex = cleanedText.indexOf('\nUser:');
    if (nextUserIndex === -1) {
      // Fall back to checking for "User:" not at the start
      nextUserIndex = cleanedText.indexOf('User:');
      if (nextUserIndex === 0) {
        // If "User:" is at the start, it's likely part of the prompt, so ignore it
        nextUserIndex = -1;
      }
    }
    
    if (nextUserIndex !== -1 && nextUserIndex > 0) {
      // If there's a next "User:" marker, extract only up to that point
      cleanedText = cleanedText.substring(0, nextUserIndex).trim();
    }
    
    // Strip markdown formatting - remove bold, italics, headers, lists, etc.
    const plainText = cleanedText
      .replace(/\*\*(.*?)\*\*/g, '$1')     // Remove bold **text**
      .replace(/\*(.*?)\*/g, '$1')         // Remove italic *text*
      .replace(/_(.*?)_/g, '$1')           // Remove underline _text_
      .replace(/`(.*?)`/g, '$1')           // Remove code `text`
      .replace(/^#+\s+/gm, '')            // Remove markdown headers (# Header)
      .replace(/^\d+\.\s+/gm, '')          // Remove numbered list prefixes (1. item)
      .replace(/^-\s+/gm, '')              // Remove dash list prefixes (- item)
      .replace(/^\*\s+/gm, '')            // Remove markdown bullet points (* item)
      .replace(/\n{3,}/g, '\n\n')          // Normalize multiple newlines to double
      .replace(/\n\s*\n/g, '\n\n')        // Clean up extra whitespace between paragraphs
      .trim();

    return NextResponse.json({
      success: true,
      message: plainText,
      model: modelId,
      watsonxResponse: watsonxData, // Full watsonx API response debug
    });

  } catch (error) {
    console.error('Error in watsonx API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// Handle unsupported methods :d
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send messages.' },
    { status: 405 }
  );
}

