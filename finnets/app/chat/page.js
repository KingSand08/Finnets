import Chat from '@/components/Chat';
import {
  getSessionFromCookie,
  decodeJWT,
} from '@/lib/cookies/getSessionFromCookie';

export default async function ChatPage() {
  let chat_history = [['Hi, how can I help you today?', false]];
  let username = null;

  // Get session from cookie (works in both dev and prod with SameSite=None)
  const sessionCookie = await getSessionFromCookie();

  if (sessionCookie) {
    const payload = await decodeJWT(sessionCookie);
    if (payload?.user?.username) {
      username = payload.user.username;
      chat_history = [
        [
          `Welcome back, ${username}! How can I assist you with your banking today?`,
          false,
        ],
      ];
    }
  }

  return (
    <>
      <Chat initial_messages={chat_history} username={username} />
    </>
  );
}
