import Chat from '@/components/Chat';
import LanguageButton from '@/components/LanguageButton';
import welcomeMessage from '@/lib/chat/welcomeMessage';
import supportedLangs from '@/data/supportedLangs.json';

export default async function ChatPage() {
  const { chat_history, username } = await welcomeMessage();
  const basePath =
    process.env.NODE_ENV === 'production'
      ? process.env.FINNETS_URL_PROD
      : process.env.FINNETS_URL_DEV;
  return (
    <>
      <LanguageButton supportedLangs={supportedLangs} />

      <Chat
        initial_messages={chat_history}
        username={username}
        basePath={basePath}
      />
    </>
  );
}
