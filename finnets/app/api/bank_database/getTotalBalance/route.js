import { NextResponse } from 'next/server';

/**
 * Proxy endpoint to get total balance from mock_bank
 * GET /api/bank_database/getTotalBalance?username=john
 * GET /api/bank_database/getTotalBalance?username=john&type=checking
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const type = searchParams.get('type');

  if (!username) {
    return NextResponse.json(
      { error: 'Missing username parameter.' },
      { status: 400 }
    );
  }

  try {
    const bankApiUrl = process.env.BANK_API_URL;
    
    // Build URL with optional type parameter
    let url = `${bankApiUrl}/api/bank/total-balance?username=${username}`;
    if (type) {
      url += `&type=${type}`;
    }
    
    // Forward cookies from client request to mock_bank
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying total balance request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total balance.' },
      { status: 500 }
    );
  }
}

