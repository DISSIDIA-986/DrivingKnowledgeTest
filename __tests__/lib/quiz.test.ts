import { 
  shuffleArray, 
  generateQuiz, 
  calculateResults, 
  isPassingScore, 
  formatTime 
} from '@/lib/quiz'
import { QuizState, Question } from '@/lib/types'

// Mock the questions data
jest.mock('@/data/questions.json', () => [
  {
    id: 1,
    question: '测试问题1',
    options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
    correctAnswer: 'A',
    explanation: '测试解析1',
    category: '测试分类'
  },
  {
    id: 2,
    question: '测试问题2',
    options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
    correctAnswer: 'B',
    explanation: '测试解析2',
    category: '测试分类'
  },
  {
    id: 3,
    question: '测试问题3',
    options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
    correctAnswer: 'C',
    explanation: '测试解析3',
    category: '测试分类'
  }
])

describe('Quiz Logic Tests', () => {
  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)
      expect(shuffled).toHaveLength(original.length)
    })

    it('should contain all original elements', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)
      expect(shuffled.sort()).toEqual(original.sort())
    })

    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5]
      const originalCopy = [...original]
      shuffleArray(original)
      expect(original).toEqual(originalCopy)
    })

    it('should handle empty array', () => {
      const result = shuffleArray([])
      expect(result).toHaveLength(0)
    })

    it('should handle single element array', () => {
      const result = shuffleArray([42])
      expect(result).toEqual([42])
    })
  })

  describe('generateQuiz', () => {
    it('should return an array of questions', () => {
      const quiz = generateQuiz()
      expect(Array.isArray(quiz)).toBe(true)
      expect(quiz.length).toBeGreaterThan(0)
    })

    it('should return maximum 30 questions', () => {
      const quiz = generateQuiz()
      expect(quiz.length).toBeLessThanOrEqual(30)
    })

    it('should return all available questions if less than 30', () => {
      const quiz = generateQuiz()
      expect(quiz.length).toBe(3) // Based on our mock data
    })

    it('should return valid question objects', () => {
      const quiz = generateQuiz()
      quiz.forEach(question => {
        expect(question).toHaveProperty('id')
        expect(question).toHaveProperty('question')
        expect(question).toHaveProperty('options')
        expect(question).toHaveProperty('correctAnswer')
        expect(question).toHaveProperty('explanation')
        expect(Array.isArray(question.options)).toBe(true)
        expect(question.options.length).toBe(4)
      })
    })
  })

  describe('calculateResults', () => {
    const mockQuestions: Question[] = [
      {
        id: 1,
        question: '测试问题1',
        options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
        correctAnswer: 'A',
        explanation: '测试解析1',
        category: '测试分类'
      },
      {
        id: 2,
        question: '测试问题2',
        options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
        correctAnswer: 'B',
        explanation: '测试解析2',
        category: '测试分类'
      }
    ]

    it('should calculate score correctly for all correct answers', () => {
      const quizState: QuizState = {
        questions: mockQuestions,
        currentQuestionIndex: 0,
        answers: { 1: 'A', 2: 'B' },
        isCompleted: true,
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T10:05:00Z')
      }

      const results = calculateResults(quizState)
      expect(results.score).toBe(100)
      expect(results.correctAnswers).toBe(2)
      expect(results.incorrectAnswers).toBe(0)
    })

    it('should calculate score correctly for mixed answers', () => {
      const quizState: QuizState = {
        questions: mockQuestions,
        currentQuestionIndex: 0,
        answers: { 1: 'A', 2: 'C' }, // Second answer is wrong
        isCompleted: true,
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T10:05:00Z')
      }

      const results = calculateResults(quizState)
      expect(results.score).toBe(50)
      expect(results.correctAnswers).toBe(1)
      expect(results.incorrectAnswers).toBe(1)
    })

    it('should calculate time taken correctly', () => {
      const quizState: QuizState = {
        questions: mockQuestions,
        currentQuestionIndex: 0,
        answers: { 1: 'A', 2: 'B' },
        isCompleted: true,
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T10:05:00Z')
      }

      const results = calculateResults(quizState)
      expect(results.timeTaken).toBe(5) // 5 minutes
    })

    it('should handle missing answers', () => {
      const quizState: QuizState = {
        questions: mockQuestions,
        currentQuestionIndex: 0,
        answers: { 1: 'A' }, // Missing answer for question 2
        isCompleted: true,
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T10:05:00Z')
      }

      const results = calculateResults(quizState)
      expect(results.score).toBe(50)
      expect(results.correctAnswers).toBe(1)
      expect(results.incorrectAnswers).toBe(1)
    })

    it('should handle no end time', () => {
      const quizState: QuizState = {
        questions: mockQuestions,
        currentQuestionIndex: 0,
        answers: { 1: 'A', 2: 'B' },
        isCompleted: true,
        startTime: new Date('2024-01-01T10:00:00Z')
      }

      const results = calculateResults(quizState)
      expect(results.timeTaken).toBe(0)
    })
  })

  describe('isPassingScore', () => {
    it('should return true for scores 80 and above', () => {
      expect(isPassingScore(80)).toBe(true)
      expect(isPassingScore(85)).toBe(true)
      expect(isPassingScore(100)).toBe(true)
    })

    it('should return false for scores below 80', () => {
      expect(isPassingScore(79)).toBe(false)
      expect(isPassingScore(50)).toBe(false)
      expect(isPassingScore(0)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isPassingScore(79.9)).toBe(false)
      expect(isPassingScore(80.1)).toBe(true)
    })
  })

  describe('formatTime', () => {
    it('should format time correctly for various inputs', () => {
      expect(formatTime(0)).toBe('不到1分钟')
      expect(formatTime(0.5)).toBe('不到1分钟')
      expect(formatTime(1)).toBe('1分钟')
      expect(formatTime(5)).toBe('5分钟')
      expect(formatTime(30)).toBe('30分钟')
    })

    it('should handle negative numbers', () => {
      expect(formatTime(-1)).toBe('不到1分钟')
      expect(formatTime(-5)).toBe('不到1分钟')
    })

    it('should handle large numbers', () => {
      expect(formatTime(60)).toBe('60分钟')
      expect(formatTime(120)).toBe('120分钟')
    })
  })
})