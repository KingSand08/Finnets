import { NextResponse } from "next/server";
import { getBalanceByAccount } from "../../../datacenter/queries/getBalanceByAccount.js";

export const GET = async (request) => {
  console.log("API Route /api/getBalance called.");
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const account_number = searchParams.get("account-number");

  if (!username || !account_number) {
    return NextResponse.json(
      { error: "Missing username and account_number parameters." },
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
    const result = await getBalanceByAccount(username, account_number);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found for the given username.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch balance." },
      { status: 500 }
    );
  }
};
