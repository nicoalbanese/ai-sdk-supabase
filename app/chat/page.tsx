import { db } from "@/lib/db";
import { Chat } from "./chat";
import { Message } from "ai";

const Page = async () => {
  const { data: chats } = await db
    .from("chats")
    .select("*")
    .eq("id", "3")
    .limit(1);

  const chat: { messages: Message[] } | undefined = chats?.at(0);
  let messages: Message[] = chat?.messages ?? [];
  if (chat?.messages === undefined) {
    await db.from("chats").insert({ messages: [] });
  }
  return (
    <Chat messages={messages.map((m, i) => ({ ...m, id: i.toString() }))} />
  );
};

export default Page;
