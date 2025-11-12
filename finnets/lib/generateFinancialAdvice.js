/**
 * Generate financial advice messages using WatsonX API
 * @param {Array} accounts - Array of account objects with account_number, account_type, balance
 * @param {string} username - Username of the user
 * @returns {Promise<Array<string>>} - Array of 3 financial advice messages
 */
export async function generateFinancialAdvice(accounts, username) {
  try {
    // Calculate totals and account types
    const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const checkingAccounts = accounts.filter(acc => acc.account_type?.toLowerCase() === 'checking');
    const savingsAccounts = accounts.filter(acc => acc.account_type?.toLowerCase() === 'savings');
    const checkingBalance = checkingAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const savingsBalance = savingsAccounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);

    // Build account context for the AI
    const accountContext = accounts.length > 0
      ? accounts.map(acc => 
          `- ${acc.account_type?.toUpperCase() || 'ACCOUNT'} Account #${acc.account_number}: $${parseFloat(acc.balance || 0).toFixed(2)}`
        ).join('\n')
      : 'No accounts available';

    const context = `
Customer Financial Profile:
- Total Balance: $${totalBalance.toFixed(2)}
- Checking Balance: $${checkingBalance.toFixed(2)}
- Savings Balance: $${savingsBalance.toFixed(2)}
- Number of Accounts: ${accounts.length}

Accounts:
${accountContext}

You are a friendly financial assistant. Based on this customer's account information, provide helpful financial advice, observations about their spending/saving habits, or suggestions for financial improvement. Keep messages concise (1-2 sentences), friendly, and actionable.
`;

    // Get IAM access token
    const apiKey = process.env.IBM_CLOUD_API_KEY;
    if (!apiKey) {
      throw new Error('IBM Cloud API key not configured');
    }

    const tokenResponse = await fetch(
      'https://iam.cloud.ibm.com/identity/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
          apikey: apiKey,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to obtain IAM access token');
    }

    const { access_token } = await tokenResponse.json();

    const watsonxUrl = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
    const projectId = process.env.PROJECT_ID;
    const spaceId = process.env.SPACE_ID;
    const modelId = process.env.WATSONX_MODEL_ID || 'ibm/granite-3-3-8b-instruct';

    if (!projectId && !spaceId) {
      throw new Error('PROJECT_ID or SPACE_ID must be configured');
    }

    const watsonxEndpoint = `${watsonxUrl}/ml/v1/text/generation?version=2024-03-13`;

    // Generate 3 different financial advice messages
    const prompts = [
      `Based on the customer's financial profile, provide ONE brief observation or tip about their saving habits or account balance. Keep it friendly and under 2 sentences.\n\n${context}\n\nObservation/Tip:`,
      `Based on the customer's financial profile, provide ONE brief piece of financial advice or suggestion for improvement. Keep it friendly and under 2 sentences.\n\n${context}\n\nAdvice:`,
      `Based on the customer's financial profile, provide ONE brief comment about their financial health or a helpful reminder. Keep it friendly and under 2 sentences.\n\n${context}\n\nComment:`,
    ];

    const messages = [];

    for (const prompt of prompts) {
      const requestBody = {
        model_id: modelId,
        input: prompt,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: 100,
          min_new_tokens: 10,
          repetition_penalty: 1.2,
          stop_sequences: ['\n\n', '\nObservation', '\nAdvice', '\nComment'],
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
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!watsonxResponse.ok) {
        const errorText = await watsonxResponse.text();
        console.error('Watsonx API error:', errorText);
        // Fallback message if API fails
        messages.push('Keep up the great work managing your finances!');
        continue;
      }

      const watsonxData = await watsonxResponse.json();
      const generatedText =
        watsonxData.results?.[0]?.generated_text ||
        watsonxData.results?.[0]?.text ||
        watsonxData.generated_text ||
        watsonxData.text ||
        '';

      // Clean up the response
      let cleanedText = generatedText.trim();
      // Remove any prompt remnants
      if (cleanedText.includes('Observation/Tip:')) {
        cleanedText = cleanedText.split('Observation/Tip:')[1]?.trim() || cleanedText;
      }
      if (cleanedText.includes('Advice:')) {
        cleanedText = cleanedText.split('Advice:')[1]?.trim() || cleanedText;
      }
      if (cleanedText.includes('Comment:')) {
        cleanedText = cleanedText.split('Comment:')[1]?.trim() || cleanedText;
      }
      // Take first sentence or two
      const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
      cleanedText = sentences.slice(0, 2).join('. ').trim();
      if (cleanedText && !cleanedText.endsWith('.') && !cleanedText.endsWith('!') && !cleanedText.endsWith('?')) {
        cleanedText += '.';
      }

      messages.push(cleanedText || 'Keep up the great work managing your finances!');
    }

    return messages;
  } catch (error) {
    console.error('Error generating financial advice:', error);
    // Return fallback messages if generation fails
    return [
      'Keep up the great work managing your finances!',
      'Consider setting aside a portion of your income for savings each month.',
      'Review your account balances regularly to stay on top of your financial health.',
    ];
  }
}

