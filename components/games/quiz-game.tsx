"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { RotateCcw, Trophy, CheckCircle2, XCircle, Timer } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Question {
  question: string
  options: string[]
  correct: number
  category: string
}

const questions: Question[] = [
  {
    question: "What is the tallest building in Dubai?",
    options: ["Burj Al Arab", "Burj Khalifa", "Emirates Towers", "Dubai Frame"],
    correct: 1,
    category: "Landmarks"
  },
  {
    question: "Which man-made island is shaped like a palm tree?",
    options: ["The World", "Palm Jumeirah", "Bluewaters Island", "Deira Islands"],
    correct: 1,
    category: "Geography"
  },
  {
    question: "What currency is used in Dubai?",
    options: ["Dollar", "Euro", "Dirham", "Riyal"],
    correct: 2,
    category: "General"
  },
  {
    question: "Which emirate is Dubai located in?",
    options: ["Abu Dhabi", "Sharjah", "Dubai", "Ajman"],
    correct: 2,
    category: "Geography"
  },
  {
    question: "What is the Dubai Mall famous for?",
    options: ["Oldest mall", "Largest mall", "Cheapest mall", "Tallest mall"],
    correct: 1,
    category: "Landmarks"
  },
  {
    question: "What is the official language of UAE?",
    options: ["English", "Hindi", "Arabic", "Urdu"],
    correct: 2,
    category: "General"
  },
  {
    question: "Which hotel is known as the only 7-star hotel?",
    options: ["Burj Khalifa", "Atlantis", "Burj Al Arab", "JW Marriott"],
    correct: 2,
    category: "Landmarks"
  },
  {
    question: "When was Dubai Metro opened?",
    options: ["2005", "2009", "2012", "2015"],
    correct: 1,
    category: "Transport"
  },
  {
    question: "What is the Dubai Creek?",
    options: ["River", "Saltwater inlet", "Lake", "Canal"],
    correct: 1,
    category: "Geography"
  },
  {
    question: "Which district is known as the financial center?",
    options: ["JBR", "DIFC", "Marina", "Downtown"],
    correct: 1,
    category: "Business"
  }
]

export function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [highScore, setHighScore] = useState(0)

  const initializeGame = useCallback(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5)
    setShuffledQuestions(shuffled)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setGameComplete(false)
    setTimeLeft(15)
  }, [])

  useEffect(() => {
    initializeGame()
    const saved = localStorage.getItem('quiz-high-score')
    if (saved) setHighScore(parseInt(saved))
  }, [initializeGame])

  useEffect(() => {
    if (gameComplete || showResult || shuffledQuestions.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleAnswer(-1) // Time's up
          return 15
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, gameComplete, showResult, shuffledQuestions.length])

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === shuffledQuestions[currentQuestion].correct
    if (isCorrect) {
      setScore((s) => s + 1)
    }

    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion((q) => q + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setTimeLeft(15)
      } else {
        setGameComplete(true)
        const finalScore = isCorrect ? score + 1 : score
        if (finalScore > highScore) {
          setHighScore(finalScore)
          localStorage.setItem('quiz-high-score', finalScore.toString())
        }
        if (finalScore >= 4) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        }
      }
    }, 1500)
  }

  if (shuffledQuestions.length === 0) {
    return <div className="text-center py-8">Loading...</div>
  }

  const question = shuffledQuestions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Progress and Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            Question {currentQuestion + 1}/{shuffledQuestions.length}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Trophy className="h-3 w-3 text-amber-500" />
              Score: {score}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Timer className="h-3 w-3" />
              {timeLeft}s
            </Badge>
          </div>
        </div>
        <Progress value={(currentQuestion / shuffledQuestions.length) * 100} />
      </div>

      {!gameComplete ? (
        <>
          {/* Question */}
          <Card className="p-6">
            <Badge variant="outline" className="mb-3">
              {question.category}
            </Badge>
            <h3 className="text-xl font-semibold">{question.question}</h3>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correct
              const showCorrectness = showResult

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "w-full h-auto py-4 px-4 justify-start text-left",
                    showCorrectness && isCorrect && "bg-green-500 text-white border-green-500",
                    showCorrectness && isSelected && !isCorrect && "bg-red-500 text-white border-red-500",
                    !showCorrectness && isSelected && "border-amber-500 bg-amber-500/10"
                  )}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {showCorrectness && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 ml-auto" />
                    )}
                    {showCorrectness && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 ml-auto" />
                    )}
                  </span>
                </Button>
              )
            })}
          </div>
        </>
      ) : (
        /* Game Complete */
        <Card className="p-6 text-center">
          <div className={cn(
            "text-6xl font-bold mb-4",
            score >= 4 ? "text-green-500" : score >= 2 ? "text-amber-500" : "text-red-500"
          )}>
            {score}/{shuffledQuestions.length}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {score >= 4 ? "Excellent!" : score >= 2 ? "Good Try!" : "Keep Learning!"}
          </h3>
          <p className="text-muted-foreground mb-4">
            You answered {score} out of {shuffledQuestions.length} questions correctly.
          </p>
          {score >= highScore && score > 0 && (
            <Badge className="mb-4 bg-amber-500">
              <Trophy className="h-3 w-3 mr-1" />
              New High Score!
            </Badge>
          )}
          <Button onClick={initializeGame} className="bg-amber-500 hover:bg-amber-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        </Card>
      )}

      {/* High Score */}
      {highScore > 0 && !gameComplete && (
        <div className="text-center text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 inline mr-1 text-amber-500" />
          High Score: {highScore}/{shuffledQuestions.length}
        </div>
      )}
    </div>
  )
}
