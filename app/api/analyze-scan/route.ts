import { NextResponse } from "next/server"
import { togetherClient } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  try {
    const { scanResult } = await req.json()

    const response = await togetherClient.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        { role: "system", content: "You are a medical scan analysis expert." },
        { role: "user", content: `Provide a detailed analysis of this scan result: ${scanResult}` },
      ],
      max_tokens: 300,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
    })

    let analysis = ""
    for await (const token of response) {
      if (token.choices && token.choices[0].delta.content) {
        analysis += token.choices[0].delta.content
      }
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing scan:", error)
    return NextResponse.json({ error: "Failed to analyze scan" }, { status: 500 })
  }
}

