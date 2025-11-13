import { NextResponse } from 'next/server';

/**
 * Proxy endpoint to get accounts from mock_bank
 * GET /api/bank_database/getAccounts?username=john
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Missing username parameter.' },
      { status: 400 }
    );
  }

  try {
    const bankApiUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.BANK_API_URL_PROD
        : process.env.BANK_API_URL_DEV;
    // Forward cookies from client request to mock_bank
    const headers = {
      'Content-Type': 'application/json',
    };

    const cookieHeader = request.headers.get('cookie');
    // Block when user disabled DB access
    if (
      cookieHeader &&
      /(?:^|;\s*)chat_privacy=disabled(?:;|$)/.test(cookieHeader)
    ) {
      return NextResponse.json(
        { error: 'Privacy mode is enabled. Database access is disabled.' },
        { status: 403 }
      );
    }
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    console.log(
      'BANK API TEST: ',
      `${bankApiUrl}/api/bank/accounts?username=${username}`
    );
    const response = await fetch(
      `${bankApiUrl}/api/bank/accounts?username=${username}`,
      {
        cache: 'no-store',
        headers,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying accounts request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts.' },
      { status: 500 }
    );
  }
}
