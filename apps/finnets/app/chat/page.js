import Chat from '@/components/Chat';

const chat_history = [['Hi, how are you?', false]];

export default async function ChatPage() {
  return (
    <>
      <Chat initial_messages={chat_history} />
    </>
  );
}
