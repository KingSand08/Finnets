import { NextResponse } from 'next/server';

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

    // Build the prompt for chatbot conversation
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
      prompt = `You are a helpful assistant. Respond in plain text only, without any markdown formatting (no bold, italics, bullet points, or numbered lists). Use simple sentences and paragraphs.\n\n${historyText}\nUser: ${message}\nAssistant:`;
    } else {
      // plain text instruction
      prompt = `You are a helpful assistant. Respond in plain text only, without any markdown formatting (no bold, italics, bullet points, or numbered lists). Use simple sentences and paragraphs.\n\nUser: ${message}\nAssistant:`;
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
        repetition_penalty: 1,
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
    const cleanedText = typeof generatedText === 'string' 
      ? generatedText.trim() 
      : String(generatedText).trim();
    
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
      .replace(/\n{3,}/g, '\n\n')          // Normalize multiple newlines to double (remove later, this might be weird)
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

