import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Global test utilities
global.createMockQuizState = () => ({
  questions: [
    {
      id: 1,
      question: '测试问题1',
      options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
      correctAnswer: 'A',
      explanation: '这是测试解析',
      category: '测试分类'
    },
    {
      id: 2,
      question: '测试问题2',
      options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
      correctAnswer: 'B',
      explanation: '这是测试解析2',
      category: '测试分类'
    }
  ],
  currentQuestionIndex: 0,
  answers: {},
  isCompleted: false,
  startTime: new Date('2024-01-01T10:00:00Z')
})

// Suppress console warnings during tests
const originalWarn = console.warn
beforeAll(() => {
  console.warn = (...args) => {
    if (
      args[0]?.includes?.('Warning: ReactDOM.render is no longer supported') ||
      args[0]?.includes?.('Warning: React.createFactory')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
})