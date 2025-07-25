import { Question, QuizState, QuizResults } from './types'
import questionsData from '@/data/questions.json'

// Fisher-Yates shuffle algorithm for fair randomization
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Select 30 random questions from the question pool
export function generateQuiz(): Question[] {
  const allQuestions = questionsData as Question[]
  const shuffledQuestions = shuffleArray(allQuestions)
  return shuffledQuestions.slice(0, Math.min(30, allQuestions.length))
}

// Calculate quiz score and results
export function calculateResults(quizState: QuizState): QuizResults {
  const { questions, answers, startTime, endTime } = quizState
  
  let correctAnswers = 0
  
  questions.forEach((question) => {
    const userAnswer = answers[question.id]
    if (userAnswer === question.correctAnswer) {
      correctAnswers++
    }
  })
  
  const totalQuestions = questions.length
  const incorrectAnswers = totalQuestions - correctAnswers
  const score = Math.round((correctAnswers / totalQuestions) * 100)
  
  // Calculate time taken in minutes
  const timeTaken = endTime && startTime ? 
    Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) : 0
  
  return {
    score,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    timeTaken,
    questions,
    userAnswers: answers
  }
}

// Get passing status (Alberta typically requires 80% to pass)
export function isPassingScore(score: number): boolean {
  return score >= 80
}

// Format time display
export function formatTime(minutes: number): string {
  if (minutes < 1) {
    return '不到1分钟'
  } else if (minutes === 1) {
    return '1分钟'
  } else {
    return `${minutes}分钟`
  }
}