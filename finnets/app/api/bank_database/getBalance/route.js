import { NextResponse } from 'next/server';

/**
 * Proxy endpoint to get balance from mock_bank
 * GET /api/bank_database/getBalance?username=john&account_number=1001
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const account_number = searchParams.get('account_number');

  if (!username || !account_number) {
    return NextResponse.json(
      { error: 'Missing required parameters.' },
      { status: 400 }
    );
  }

  try {
    const bankApiUrl = process.env.BANK_API_URL;

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

    const response = await fetch(
      `${bankApiUrl}/api/bank/balance?username=${username}&account_number=${account_number}`,
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
    console.error('Error proxying balance request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance.' },
      { status: 500 }
    );
  }
}
