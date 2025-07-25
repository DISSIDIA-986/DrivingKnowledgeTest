import { render, screen, fireEvent } from '@testing-library/react'
import ResultsPage from '@/app/results/page'
import { QuizResults } from '@/lib/types'

const mockResults: QuizResults = {
  score: 85,
  totalQuestions: 2,
  correctAnswers: 1,
  incorrectAnswers: 1,
  timeTaken: 5,
  questions: [
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
  ],
  userAnswers: { 1: 'A', 2: 'C' }
}

const mockFailingResults: QuizResults = {
  ...mockResults,
  score: 50,
  correctAnswers: 1,
  incorrectAnswers: 1
}

describe('ResultsPage Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('when no results are found', () => {
    it('should show no results message', () => {
      render(<ResultsPage />)
      expect(screen.getByText('未找到考试结果')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '返回首页' })).toBeInTheDocument()
    })
  })

  describe('when results are found', () => {
    beforeEach(() => {
      localStorage.setItem('quizResults', JSON.stringify(mockResults))
    })

    it('should display the score prominently', () => {
      render(<ResultsPage />)
      expect(screen.getByText('85%')).toBeInTheDocument()
    })

    it('should show passing status for passing score', () => {
      render(<ResultsPage />)
      expect(screen.getByText('🎉 考试通过！')).toBeInTheDocument()
      expect(screen.getByText(/恭喜您！您已通过Alberta驾驶知识考试/)).toBeInTheDocument()
    })

    it('should show failing status for failing score', () => {
      localStorage.setItem('quizResults', JSON.stringify(mockFailingResults))
      render(<ResultsPage />)
      
      expect(screen.getByText('继续努力！')).toBeInTheDocument()
      expect(screen.getByText(/不要灰心，继续练习就能通过考试/)).toBeInTheDocument()
    })

    it('should display statistics correctly', () => {
      render(<ResultsPage />)
      
      expect(screen.getAllByText('1')).toHaveLength(2) // Both correct (1) and incorrect (1) answers
      expect(screen.getByText('85%')).toBeInTheDocument() // Accuracy
      expect(screen.getByText('5分钟')).toBeInTheDocument() // Time taken
    })

    it('should render action buttons', () => {
      render(<ResultsPage />)
      
      expect(screen.getByRole('link', { name: /重新考试/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '返回首页' })).toBeInTheDocument()
    })

    it('should have correct href attributes for action buttons', () => {
      render(<ResultsPage />)
      
      const retakeButton = screen.getByRole('link', { name: /重新考试/ })
      const homeButton = screen.getByRole('link', { name: '返回首页' })
      
      expect(retakeButton).toHaveAttribute('href', '/quiz')
      expect(homeButton).toHaveAttribute('href', '/')
    })

    it('should toggle answer review section', () => {
      render(<ResultsPage />)
      
      const toggleButton = screen.getByText('查看答题详情')
      
      // Initially, detailed answers should not be visible
      expect(screen.queryByText('第1题: 测试问题1')).not.toBeInTheDocument()
      
      // Click to expand
      fireEvent.click(toggleButton)
      
      // Now detailed answers should be visible
      expect(screen.getByText('第1题: 测试问题1')).toBeInTheDocument()
      expect(screen.getByText('第2题: 测试问题2')).toBeInTheDocument()
    })

    it('should show correct and incorrect answers in review', () => {
      render(<ResultsPage />)
      
      const toggleButton = screen.getByText('查看答题详情')
      fireEvent.click(toggleButton)
      
      // Question 1: User answered A (correct)
      expect(screen.getByText(/您的答案: 选项1/)).toBeInTheDocument()
      
      // Question 2: User answered C (incorrect), correct is B
      expect(screen.getByText(/正确答案: 选项2/)).toBeInTheDocument()
    })

    it('should display explanations for each question', () => {
      render(<ResultsPage />)
      
      const toggleButton = screen.getByText('查看答题详情')
      fireEvent.click(toggleButton)
      
      expect(screen.getByText('测试解析1')).toBeInTheDocument()
      expect(screen.getByText('测试解析2')).toBeInTheDocument()
    })

    it('should style correct and incorrect answers differently', () => {
      render(<ResultsPage />)
      
      const toggleButton = screen.getByText('查看答题详情')
      fireEvent.click(toggleButton)
      
      const question1 = screen.getByText('第1题: 测试问题1').closest('.border-green-200')
      const question2 = screen.getByText('第2题: 测试问题2').closest('.border-red-200')
      
      expect(question1).toBeInTheDocument()
      expect(question2).toBeInTheDocument()
    })

    it('should show appropriate pass/fail message', () => {
      render(<ResultsPage />)
      
      expect(screen.getByText(/Alberta驾驶知识考试的通过分数是80%/)).toBeInTheDocument()
      expect(screen.getByText(/现在可以预约road test了/)).toBeInTheDocument()
    })

    it('should handle missing user answers gracefully', () => {
      const resultsWithMissingAnswer = {
        ...mockResults,
        userAnswers: { 1: 'A' } // Missing answer for question 2
      }
      
      localStorage.setItem('quizResults', JSON.stringify(resultsWithMissingAnswer))
      render(<ResultsPage />)
      
      const toggleButton = screen.getByText('查看答题详情')
      fireEvent.click(toggleButton)
      
      expect(screen.getByText('未作答')).toBeInTheDocument()
    })
  })

  describe('responsive design', () => {
    beforeEach(() => {
      localStorage.setItem('quizResults', JSON.stringify(mockResults))
    })

    it('should have responsive grid classes', () => {
      render(<ResultsPage />)
      
      const statsGrid = screen.getByText('答对题数').closest('.grid')
      expect(statsGrid).toHaveClass('md:grid-cols-4')
    })

    it('should have responsive button layout', () => {
      render(<ResultsPage />)
      
      const buttonContainer = screen.getByRole('link', { name: /重新考试/ }).closest('.flex')
      expect(buttonContainer).toHaveClass('sm:flex-row')
    })
  })
})