import { type NextRequest, NextResponse } from "next/server"
import { searchDocuments } from "@/lib/embeddings"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    // 1. Retrieve relevant documents based on the question
    const relevantDocuments = await searchDocuments(question)

    // 2. Format the context from retrieved documents
    const context = relevantDocuments.map((doc) => `Document: ${doc.title}\nContent: ${doc.content}`).join("\n\n")

    // 3. Generate an answer using RAG with AI SDK
    const prompt = `
      You are a helpful assistant that answers questions based on the provided documents.
      
      Context from documents:
      ${context}
      
      Question: ${question}
      
      Answer the question based only on the provided context. If the context doesn't contain relevant information to answer the question, say "I don't have enough information to answer this question."
    `

    // In a real implementation, you would use a real model
    // This is a mock implementation for demonstration
    const { text: answer } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      maxTokens: 500,
    })

    return NextResponse.json({
      answer,
      sources: relevantDocuments,
    })
  } catch (error) {
    console.error("Error in RAG API:", error)
    return NextResponse.json({ error: "Failed to process your question" }, { status: 500 })
  }
}
