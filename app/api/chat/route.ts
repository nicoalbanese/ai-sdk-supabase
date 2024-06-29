import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/utils/supabase/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const db = createClient();

  const { messages } = await req.json();

  await db.from("chats").update({ messages }).eq("id", "3");

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
    onFinish: async ({ text }) => {
      await db
        .from("chats")
        .update({
          messages: [...messages, { role: "assistant", content: text }],
        })
        .eq("id", "3");
    },
  });

  return result.toAIStreamResponse();
}
