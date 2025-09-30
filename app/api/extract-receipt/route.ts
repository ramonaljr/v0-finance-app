import { generateObject } from "ai"
import { z } from "zod"

const receiptSchema = z.object({
  merchant: z.string().describe("The name of the merchant or store"),
  amount: z.number().positive().describe("The total amount of the transaction"),
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
  notes: z.string().optional().describe("Any additional notes or item details from the receipt"),
})

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    const base64Data = image.split(",")[1] || image

    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4.5",
      schema: receiptSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the transaction information from this receipt image. Identify the merchant name, total amount, appropriate category, date, and any relevant item details.",
            },
            {
              type: "image",
              image: base64Data,
            },
          ],
        },
      ],
    })

    return Response.json({ extractedData: object })
  } catch (error) {
    console.error("[v0] Receipt extraction error:", error)
    return Response.json({ error: "Failed to extract receipt data" }, { status: 500 })
  }
}
