'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuizState } from '@/lib/types'
import { generateQuiz, calculateResults } from '@/lib/quiz'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function QuizPage() {
  const router = useRouter()
  const [quizState, setQuizState] = useState<QuizState | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Initialize quiz on component mount
  useEffect(() => {
    const questions = generateQuiz()
    setQuizState({
      questions,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      startTime: new Date()
    })
  }, [])

  // Timer effect
  useEffect(() => {
    if (!quizState || quizState.isCompleted) return

    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - quizState.startTime.getTime()) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [quizState])

  const handleAnswerSelect = (answer: string) => {
    if (!quizState) return

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
    setQuizState(prev => ({
      ...prev!,
      answers: {
        ...prev!.answers,
        [currentQuestion.id]: answer
      }
    }))
  }

  const handleNext = () => {
    if (!quizState) return

    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev!,
        currentQuestionIndex: prev!.currentQuestionIndex + 1
      }))
    }
  }

  const handlePrevious = () => {
    if (!quizState) return

    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev!,
        currentQuestionIndex: prev!.currentQuestionIndex - 1
      }))
    }
  }

  const handleSubmit = () => {
    if (!quizState) return

    const completedQuiz = {
      ...quizState,
      isCompleted: true,
      endTime: new Date()
    }

    const results = calculateResults(completedQuiz)
    
    // Store results in localStorage for results page
    localStorage.setItem('quizResults', JSON.stringify(results))
    router.push('/results')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!quizState) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">正在加载题目...</span>
      </div>
    )
  }

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
  const currentAnswer = quizState.answers[currentQuestion.id]
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100
  const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1
  const answeredQuestions = Object.keys(quizState.answers).length

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>用时: {formatTime(timeElapsed)}</span>
          </div>
          <span className="text-sm text-gray-600">
            第 {quizState.currentQuestionIndex + 1} 题 / 共 {quizState.questions.length} 题
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-center text-sm text-gray-600">
          已答题: {answeredQuestions} / {quizState.questions.length}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
        {/* Question Image */}
        {currentQuestion.imageUrl && (
          <div className="mb-6 text-center">
            <div className="relative inline-block">
              <Image
                src={currentQuestion.imageUrl}
                alt="题目相关图片"
                width={300}
                height={200}
                className="rounded-lg shadow-sm"
                onError={(e) => {
                  // Hide image if loading fails
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const optionKey = option.charAt(0) // A, B, C, D
            const isSelected = currentAnswer === optionKey
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(optionKey)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-base">
                  {option}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={quizState.currentQuestionIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            quizState.currentQuestionIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5" />
          上一题
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            下一题
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}