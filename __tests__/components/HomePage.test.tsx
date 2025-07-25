import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('HomePage Component', () => {
  beforeEach(() => {
    render(<Home />)
  })

  it('should render the main heading', () => {
    const heading = screen.getByText('高效、简洁、专为华人设计')
    expect(heading).toBeInTheDocument()
  })

  it('should render the description text', () => {
    const description = screen.getByText(/Alberta 驾驶知识考试实际只有 30 题/)
    expect(description).toBeInTheDocument()
  })

  it('should render the start quiz button', () => {
    const startButton = screen.getByRole('link', { name: /开始考试/ })
    expect(startButton).toBeInTheDocument()
    expect(startButton).toHaveAttribute('href', '/quiz')
  })

  it('should render feature cards', () => {
    expect(screen.getByText('精选题库')).toBeInTheDocument()
    expect(screen.getByText('真实体验')).toBeInTheDocument()
    expect(screen.getByText('中文界面')).toBeInTheDocument()
  })

  it('should render feature descriptions', () => {
    expect(screen.getByText(/基于真实考试题目，筛选高频考点/)).toBeInTheDocument()
    expect(screen.getByText(/模拟真实考试，30题随机抽取/)).toBeInTheDocument()
    expect(screen.getByText(/简洁的中文界面，清晰的答案解析/)).toBeInTheDocument()
  })

  it('should render the learning tip section', () => {
    const tip = screen.getByText(/学习建议：/)
    expect(tip).toBeInTheDocument()
    expect(screen.getByText(/考试比您想象的简单，只需多练习高频题目即可/)).toBeInTheDocument()
  })

  it('should render the footer message', () => {
    const footer = screen.getByText('祝您考试顺利，早日拿到驾照！🚗')
    expect(footer).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    const mainContainer = screen.getByText('高效、简洁、专为华人设计').closest('div')
    expect(mainContainer).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg')
  })

  it('should render icons for features', () => {
    // Check that feature cards have icons (they should have svg elements)
    const featureCards = screen.getByText('精选题库').closest('div')
    expect(featureCards?.querySelector('svg')).toBeInTheDocument()
  })

  it('should have responsive design classes', () => {
    const grid = screen.getByText('精选题库').closest('.grid')
    expect(grid).toHaveClass('md:grid-cols-3')
  })
})