import { NextResponse } from 'next/server';
import { getBalanceByAccount } from '@/db/queries/getBalanceByAccount';
import { validateRequest } from '@/lib/auth/validateRequest';

/**
 * API endpoint to get balance for a specific account
 * GET /api/bank/balance?username=john&account_number=1001
 * Requires: Bearer token (dev) OR session cookie (prod)
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const account_number = searchParams.get('account_number');

  if (!username || !account_number) {
    return NextResponse.json(
      { error: 'Missing username and/or account_number parameters.' },
      { status: 400 }
    );
  }

  // Validate request (accepts Bearer token or session cookie)
  const authenticatedUsername = await validateRequest(request);

  if (!authenticatedUsername) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  // Verify the authenticated username matches the requested username
  if (authenticatedUsername !== username) {
    return NextResponse.json(
      { error: 'Forbidden. You can only access your own account data.' },
      { status: 403 }
    );
  }

  try {
    const result = await getBalanceByAccount(username, account_number);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'No account found for the given username and account number.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance.' },
      { status: 500 }
    );
  }
}

