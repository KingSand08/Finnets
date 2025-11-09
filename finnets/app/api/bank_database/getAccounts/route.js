import { NextResponse } from 'next/server';
import { getAccounts } from '@/db/queries/getAccounts';

export const GET = async (request) => {
  console.log('I GET HERE SOMEHOW');

  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Missing username parameter.' },
      { status: 400 }
    );
  }
  /** Verify the access authorization before execute the query
   *
   * Example codes if we use auth and session
   * const session = await getServerSession(authOptions);
   * if (!session) {
   *    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
   * }
   *
   * if (session.user.username !== new URL(request.url).get("username") {
   *    return NextResponse.json({ message: "Forbidden" }, {status: 403 });
   * }
   * */

  try {
    const result = await getAccounts(username);

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
    return NextResponse.json(
      { error: 'Failed to fetch balance.' },
      { status: 500 }
    );
  }
};
