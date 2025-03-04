import { NextResponse } from "next/server"
import { togetherClient } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  try {
    const { machines } = await req.json()

    const response = await togetherClient.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        { role: "system", content: "You are a production line optimization expert." },
        { role: "user", content: `Suggest optimizations for this production line layout: ${JSON.stringify(machines)}` },
      ],
      max_tokens: 300,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
    })

    let suggestion = ""
    for await (const token of response) {
      if (token.choices && token.choices[0].delta.content) {
        suggestion += token.choices[0].delta.content
      }
    }

    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error("Error optimizing production:", error)
    return NextResponse.json({ error: "Failed to optimize production" }, { status: 500 })
  }
}

