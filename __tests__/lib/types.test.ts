import { Question, QuizState, QuizResults } from '@/lib/types'

describe('Type Definitions', () => {
  describe('Question interface', () => {
    it('should accept valid question object', () => {
      const question: Question = {
        id: 1,
        question: '测试问题',
        options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
        correctAnswer: 'A',
        explanation: '测试解析',
      }

      expect(question.id).toBe(1)
      expect(question.question).toBe('测试问题')
      expect(question.options).toHaveLength(4)
      expect(question.correctAnswer).toBe('A')
      expect(question.explanation).toBe('测试解析')
    })

    it('should accept question with optional properties', () => {
      const question: Question = {
        id: 1,
        question: '测试问题',
        options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
        correctAnswer: 'A',
        explanation: '测试解析',
        imageUrl: 'https://example.com/image.jpg',
        category: '交通标志'
      }

      expect(question.imageUrl).toBe('https://example.com/image.jpg')
      expect(question.category).toBe('交通标志')
    })
  })

  describe('QuizState interface', () => {
    it('should accept valid quiz state', () => {
      const questions: Question[] = [
        {
          id: 1,
          question: '测试问题1',
          options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
          correctAnswer: 'A',
          explanation: '测试解析1',
        },
        {
          id: 2,
          question: '测试问题2',
          options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
          correctAnswer: 'B',
          explanation: '测试解析2',
        }
      ]

      const quizState: QuizState = {
        questions,
        currentQuestionIndex: 0,
        answers: { 1: 'A', 2: 'B' },
        isCompleted: false,
        startTime: new Date('2024-01-01T10:00:00Z')
      }

      expect(quizState.questions).toHaveLength(2)
      expect(quizState.currentQuestionIndex).toBe(0)
      expect(quizState.answers[1]).toBe('A')
      expect(quizState.isCompleted).toBe(false)
      expect(quizState.startTime).toBeInstanceOf(Date)
    })

    it('should accept quiz state with optional properties', () => {
      const questions: Question[] = [
        {
          id: 1,
          question: '测试问题',
          options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
          correctAnswer: 'A',
          explanation: '测试解析',
        }
      ]

      const quizState: QuizState = {
        questions,
        currentQuestionIndex: 0,
        answers: {},
        isCompleted: true,
        startTime: new Date('2024-01-01T10:00:00Z'),
        score: 85,
        endTime: new Date('2024-01-01T10:05:00Z')
      }

      expect(quizState.score).toBe(85)
      expect(quizState.endTime).toBeInstanceOf(Date)
    })
  })

  describe('QuizResults interface', () => {
    it('should accept valid quiz results', () => {
      const questions: Question[] = [
        {
          id: 1,
          question: '测试问题1',
          options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
          correctAnswer: 'A',
          explanation: '测试解析1',
        },
        {
          id: 2,
          question: '测试问题2',
          options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
          correctAnswer: 'B',
          explanation: '测试解析2',
        }
      ]

      const quizResults: QuizResults = {
        score: 85,
        totalQuestions: 2,
        correctAnswers: 1,
        incorrectAnswers: 1,
        timeTaken: 5,
        questions,
        userAnswers: { 1: 'A', 2: 'C' }
      }

      expect(quizResults.score).toBe(85)
      expect(quizResults.totalQuestions).toBe(2)
      expect(quizResults.correctAnswers).toBe(1)
      expect(quizResults.incorrectAnswers).toBe(1)
      expect(quizResults.timeTaken).toBe(5)
      expect(quizResults.questions).toHaveLength(2)
      expect(quizResults.userAnswers[1]).toBe('A')
      expect(quizResults.userAnswers[2]).toBe('C')
    })
  })

  describe('Type consistency', () => {
    it('should maintain type consistency across interfaces', () => {
      const question: Question = {
        id: 1,
        question: '测试问题',
        options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
        correctAnswer: 'A',
        explanation: '测试解析',
      }

      const quizState: QuizState = {
        questions: [question],
        currentQuestionIndex: 0,
        answers: { 1: 'A' },
        isCompleted: true,
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T10:05:00Z')
      }

      const quizResults: QuizResults = {
        score: 100,
        totalQuestions: 1,
        correctAnswers: 1,
        incorrectAnswers: 0,
        timeTaken: 5,
        questions: quizState.questions,
        userAnswers: quizState.answers
      }

      // Verify that the same question structure works across all interfaces
      expect(quizResults.questions[0].id).toBe(question.id)
      expect(quizResults.userAnswers[1]).toBe(quizState.answers[1])
    })
  })
})