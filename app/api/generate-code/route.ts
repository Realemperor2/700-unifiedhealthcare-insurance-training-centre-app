import { NextResponse } from "next/server"
import { togetherClient } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  try {
    const { prompt, codeType } = await req.json()

    const response = await togetherClient.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert ${codeType} developer. Generate valid ${codeType} code based on the user's prompt.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
    })

    let code = ""
    for await (const token of response) {
      if (token.choices && token.choices[0].delta.content) {
        code += token.choices[0].delta.content
      }
    }

    return NextResponse.json({ code })
  } catch (error) {
    console.error("Error generating code:", error)
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 })
  }
}

