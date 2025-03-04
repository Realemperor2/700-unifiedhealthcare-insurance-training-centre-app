import { NextResponse } from "next/server"
import { togetherClient } from "@/lib/supabaseClient"

export async function POST(req: Request) {
  try {
    const { prediction, modelConfig } = await req.json()

    const response = await togetherClient.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        { role: "system", content: "You are an AI model interpretation expert." },
        {
          role: "user",
          content: `Explain this prediction: ${prediction}, given the model configuration: ${JSON.stringify(modelConfig)}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
    })

    let explanation = ""
    for await (const token of response) {
      if (token.choices && token.choices[0].delta.content) {
        explanation += token.choices[0].delta.content
      }
    }

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error("Error explaining prediction:", error)
    return NextResponse.json({ error: "Failed to explain prediction" }, { status: 500 })
  }
}

