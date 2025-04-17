"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { askQuestion } from "@/lib/actions"
import { Loader2, Send, FileText, ExternalLink } from "lucide-react"

interface Source {
  title: string
  content: string
  relevance: number
}

interface Answer {
  question: string
  answer: string
  sources: Source[]
  timestamp: string
}

export function QAInterface() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null)
  const [history, setHistory] = useState<Answer[]>([])

  const handleAskQuestion = async () => {
    if (!question.trim()) return

    setIsLoading(true)
    try {
      const result = await askQuestion(question)

      const newAnswer: Answer = {
        question,
        answer: result.answer,
        sources: result.sources,
        timestamp: new Date().toISOString(),
      }

      setCurrentAnswer(newAnswer)
      setHistory([newAnswer, ...history])
      setQuestion("")
    } catch (error) {
      console.error("Error asking question:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAskQuestion} disabled={!question.trim() || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Ask Question
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {currentAnswer && (
          <Card>
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-line">{currentAnswer.answer}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Sources</h4>
                  <div className="space-y-2">
                    {currentAnswer.sources.map((source, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium">{source.title}</span>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {Math.round(source.relevance * 100)}% match
                          </span>
                        </div>
                        <p className="text-sm mt-2 text-gray-600 line-clamp-2">{source.content}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View document
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Question History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Your question history will appear here</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setCurrentAnswer(item)}
                  >
                    <p className="font-medium line-clamp-1">{item.question}</p>
                    <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
