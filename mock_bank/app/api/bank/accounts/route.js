import { NextResponse } from 'next/server';
import { getAccounts } from '@/db/queries/getAccounts';
import { validateRequest } from '@/lib/auth/validateRequest';

/**
 * API endpoint to get all accounts for a specific user
 * GET /api/bank/accounts?username=john
 * Requires: Bearer token (dev) OR session cookie (prod)
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
    const result = await getAccounts(username);

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No accounts found for the given username.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts.' },
      { status: 500 }
    );
  }
}

