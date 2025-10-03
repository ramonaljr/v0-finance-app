import { generateObject } from "ai"
import { z } from "zod"

export const dynamic = 'force-dynamic'

const transactionSchema = z.object({
  merchant: z.string().describe("The name of the merchant or store"),
  amount: z.number().positive().describe("The amount spent"),
  category: z
    .enum([
      "Food & Drink",
      "Groceries",
      "Shopping",
      "Transportation",
      "Utilities",
      "Health Care",
      "Entertainment",
      "Housing",
      "Other",
    ])
    .describe("The category of the expense"),
  date: z.string().describe("The date of the transaction in YYYY-MM-DD format"),
  notes: z.string().optional().describe("Any additional context or notes"),
})

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json()

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini", // Using GPT-4o-mini for best cost/performance
      schema: transactionSchema,
      prompt: `Extract transaction information from this voice input: "${transcript}".
      If the date is not mentioned, use today's date.
      Infer the most appropriate category based on the merchant and context.
      Examples:
      - "I spent $12.50 at Starbucks" → merchant: Starbucks, amount: 12.50, category: Food & Drink
      - "Paid $45 for gas at Shell yesterday" → merchant: Shell, amount: 45, category: Transportation
      - "Bought groceries for $87.32 at Whole Foods" → merchant: Whole Foods, amount: 87.32, category: Groceries`,
    })

    return Response.json({ extractedData: object })
  } catch (error) {
    console.error("[v0] Voice extraction error:", error)
    return Response.json({ error: "Failed to extract transaction data" }, { status: 500 })
  }
}
