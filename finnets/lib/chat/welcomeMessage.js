import {
  decodeJWT,
  getSessionFromCookie,
} from '../cookies/getSessionFromCookie';

export default async function welcomeMessage() {
  let chat_history = [['Hi, how can I help you today?', false]];
  let username = null;

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
  return { chat_history, username };
}
