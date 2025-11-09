import { NextResponse } from 'next/server';
import {
  getTotalBalanceByUsername,
  getBalanceByUsernameAndType,
} from '@/db/queries/getTotalBalance';
import { validateRequest } from '@/lib/auth/validateRequest';

/**
 * API endpoint to get total balance for a user
 * GET /api/bank/total-balance?username=john
 * GET /api/bank/total-balance?username=john&type=checking
 * Requires: Bearer token (dev) OR session cookie (prod)
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
    let result;

    if (type) {
      result = await getBalanceByUsernameAndType(username, type);
    } else {
      result = await getTotalBalanceByUsername(username);
    }

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'No account found for the given username.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching total balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total balance' },
      { status: 500 }
    );
  }
}

