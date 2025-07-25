import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import QuizPage from '@/app/quiz/page'

// Mock the quiz utility functions
jest.mock('@/lib/quiz', () => ({
  generateQuiz: jest.fn(() => [
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
  ]),
  calculateResults: jest.fn(() => ({
    score: 85,
    totalQuestions: 2,
    correctAnswers: 1,
    incorrectAnswers: 1,
    timeTaken: 5,
    questions: [],
    userAnswers: {}
  }))
}))

const mockPush = jest.fn()
const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>

beforeEach(() => {
  mockRouter.mockReturnValue({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  } as any)
  
  // Clear localStorage before each test
  localStorage.clear()
  mockPush.mockClear()
})

describe('QuizPage Component', () => {
  it('should show loading state initially', () => {
    render(<QuizPage />)
    expect(screen.getByText('正在加载题目...')).toBeInTheDocument()
  })

  it('should render quiz interface after loading', async () => {
    render(<QuizPage />)
    
    await waitFor(() => {
      expect(screen.getByText('测试问题1')).toBeInTheDocument()
    })

    expect(screen.getByText('第 1 题 / 共 2 题')).toBeInTheDocument()
    expect(screen.getByText('已答题: 0 / 2')).toBeInTheDocument()
  })

  it('should display question options correctly', async () => {
    render(<QuizPage />)
    
    await waitFor(() => {
      expect(screen.getByText('A. 选项1')).toBeInTheDocument()
      expect(screen.getByText('B. 选项2')).toBeInTheDocument()
      expect(screen.getByText('C. 选项3')).toBeInTheDocument()
      expect(screen.getByText('D. 选项4')).toBeInTheDocument()
    })
  })

  it('should allow answer selection', async () => {
    render(<QuizPage />)
    
    await waitFor(() => {
      const optionA = screen.getByText('A. 选项1')
      fireEvent.click(optionA)
    })

    const selectedOption = screen.getByText('A. 选项1').closest('button')
    expect(selectedOption).toHaveClass('border-blue-500', 'bg-blue-50')
  })

  it('should update progress when answer is selected', async () => {
    render(<QuizPage />)
    
    await waitFor(() => {
      const optionA = screen.getByText('A. 选项1')
      fireEvent.click(optionA)
    })

    await waitFor(() => {
      expect(screen.getByText('已答题: 1 / 2')).toBeInTheDocument()
    })
  })

  it('should navigate to next question', async () => {
    render(<QuizPage />)
    
    await waitFor(() => {
      // Select an answer first
      const optionA = screen.getByText('A. 选项1')
      fireEvent.click(optionA)
    })

    const nextButton = screen.getByText('下一题')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('测试问题2')).toBeInTheDocument()
      expect(screen.getByText('第 2 题 / 共 2 题')).toBeInTheDocument()
    })
  })

  it('should navigate to previous question', async () => {
    render(<QuizPage />)
    
    // Navigate to second question first
    await waitFor(() => {
      const optionA = screen.getByText('A. 选项1')
      fireEvent.click(optionA)
    })

    const nextButton = screen.getByText('下一题')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('测试问题2')).toBeInTheDocument()
    })

    // Go back to previous question
    const prevButton = screen.getByText('上一题')
    fireEvent.click(prevButton)

    await waitFor(() => {
      expect(screen.getByText('测试问题1')).toBeInTheDocument()
    })
  })

  it('should disable previous button on first question', async () => {
    render(<QuizPage />)
    
    await waitFor(() => {
      const prevButton = screen.getByText('上一题')
      expect(prevButton).toHaveClass('cursor-not-allowed')
    })
  })

  it('should show submit button on last question', async () => {
    render(<QuizPage />)
    
    // Navigate to last question
    await waitFor(() => {
      const optionA = screen.getByText('A. 选项1')
      fireEvent.click(optionA)
    })

    const nextButton = screen.getByText('下一题')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('提交答案')).toBeInTheDocument()
      expect(screen.queryByText('下一题')).not.toBeInTheDocument()
    })
  })

  it('should submit quiz and navigate to results', async () => {
    render(<QuizPage />)
    
    // Navigate to last question and submit
    await waitFor(() => {
      const optionA = screen.getByText('A. 选项1')
      fireEvent.click(optionA)
    })

    const nextButton = screen.getByText('下一题')
    fireEvent.click(nextButton)

    await waitFor(() => {
      const optionB = screen.getByText('B. 选项2')
      fireEvent.click(optionB)
    })

    const submitButton = screen.getByText('提交答案')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/results')
      expect(localStorage.setItem).toHaveBeenCalledWith('quizResults', expect.any(String))
    })
  })

  it('should show elapsed time', async () => {
    render(<QuizPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/用时:/)).toBeInTheDocument()
    })
  })

  it('should update progress bar correctly', async () => {
    render(<QuizPage />)
    
    await waitFor(() => {
      const progressBar = document.querySelector('.bg-blue-600')
      expect(progressBar).toHaveStyle('width: 50%') // First question is 50% of 2 questions
    })
  })

  it('should preserve selected answers when navigating', async () => {
    render(<QuizPage />)
    
    // Select answer on first question
    await waitFor(() => {
      const optionA = screen.getByText('A. 选项1')
      fireEvent.click(optionA)
    })

    // Navigate to second question
    const nextButton = screen.getByText('下一题')
    fireEvent.click(nextButton)

    // Navigate back to first question
    await waitFor(() => {
      const prevButton = screen.getByText('上一题')
      fireEvent.click(prevButton)
    })

    // Check that the answer is still selected
    await waitFor(() => {
      const selectedOption = screen.getByText('A. 选项1').closest('button')
      expect(selectedOption).toHaveClass('border-blue-500', 'bg-blue-50')
    })
  })
})