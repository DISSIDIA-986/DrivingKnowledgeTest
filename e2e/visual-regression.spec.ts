import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('should match home page visual design', async ({ page }) => {
    await page.goto('/')
    
    // Wait for content to load
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match home page on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    
    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match quiz page layout', async ({ page }) => {
    await page.goto('/quiz')
    
    // Wait for quiz to load
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Take screenshot of quiz interface
    await expect(page).toHaveScreenshot('quiz-page.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match quiz page with selected answer', async ({ page }) => {
    await page.goto('/quiz')
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Select first answer
    const firstOption = page.locator('button:has-text("A.")').first()
    if (await firstOption.isVisible()) {
      await firstOption.click()
    }
    
    // Wait for selection to be applied
    await page.waitForTimeout(500)
    
    await expect(page).toHaveScreenshot('quiz-page-selected.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match results page for passing score', async ({ page }) => {
    // Set up mock results for consistent testing
    await page.goto('/results')
    
    // Inject mock results into localStorage
    await page.evaluate(() => {
      const mockResults = {
        score: 85,
        totalQuestions: 2,
        correctAnswers: 2,
        incorrectAnswers: 0,
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
        userAnswers: { 1: 'A', 2: 'B' }
      }
      localStorage.setItem('quizResults', JSON.stringify(mockResults))
    })
    
    // Reload to pick up the mock data
    await page.reload()
    
    // Wait for results to load
    await expect(page.getByText('85%')).toBeVisible()
    
    await expect(page).toHaveScreenshot('results-page-pass.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match results page for failing score', async ({ page }) => {
    await page.goto('/results')
    
    // Inject mock failing results
    await page.evaluate(() => {
      const mockResults = {
        score: 50,
        totalQuestions: 2,
        correctAnswers: 1,
        incorrectAnswers: 1,
        timeTaken: 3,
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
      localStorage.setItem('quizResults', JSON.stringify(mockResults))
    })
    
    await page.reload()
    await expect(page.getByText('50%')).toBeVisible()
    
    await expect(page).toHaveScreenshot('results-page-fail.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match results page with answer review expanded', async ({ page }) => {
    await page.goto('/results')
    
    // Set up mock results
    await page.evaluate(() => {
      const mockResults = {
        score: 85,
        totalQuestions: 2,
        correctAnswers: 2,
        incorrectAnswers: 0,
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
        userAnswers: { 1: 'A', 2: 'B' }
      }
      localStorage.setItem('quizResults', JSON.stringify(mockResults))
    })
    
    await page.reload()
    
    // Expand answer review
    const reviewButton = page.getByText('查看答题详情')
    await reviewButton.click()
    
    // Wait for content to expand
    await expect(page.getByText('第1题: 测试问题1')).toBeVisible()
    
    await expect(page).toHaveScreenshot('results-page-expanded.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match error state on results page', async ({ page }) => {
    await page.goto('/results')
    
    // Clear localStorage to simulate no results
    await page.evaluate(() => {
      localStorage.clear()
    })
    
    await page.reload()
    
    // Wait for error message
    await expect(page.getByText('未找到考试结果')).toBeVisible()
    
    await expect(page).toHaveScreenshot('results-page-error.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match component focus states', async ({ page }) => {
    await page.goto('/')
    
    // Focus on the start button
    const startButton = page.getByRole('link', { name: '开始考试' })
    await startButton.focus()
    
    await expect(page).toHaveScreenshot('home-page-focused.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match tablet layout', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    
    await expect(page).toHaveScreenshot('home-page-tablet.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })

  test('should match quiz progress states', async ({ page }) => {
    await page.goto('/quiz')
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Take screenshot of initial state
    await expect(page).toHaveScreenshot('quiz-initial-state.png', {
      threshold: 0.2,
      animations: 'disabled',
      clip: { x: 0, y: 0, width: 800, height: 200 }
    })
    
    // Select an answer to show progress
    const firstOption = page.locator('button:has-text("A.")').first()
    if (await firstOption.isVisible()) {
      await firstOption.click()
    }
    
    // Take screenshot showing progress update
    await expect(page).toHaveScreenshot('quiz-progress-updated.png', {
      threshold: 0.2,
      animations: 'disabled',
      clip: { x: 0, y: 0, width: 800, height: 200 }
    })
  })

  test('should match dark mode styles if supported', async ({ page }) => {
    // Test dark color scheme preference
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    
    await expect(page).toHaveScreenshot('home-page-dark.png', {
      fullPage: true,
      threshold: 0.3, // Higher threshold for color differences
      animations: 'disabled'
    })
  })

  test('should match print styles', async ({ page }) => {
    await page.goto('/results')
    
    // Set up results for print test
    await page.evaluate(() => {
      const mockResults = {
        score: 85,
        totalQuestions: 2,
        correctAnswers: 2,
        incorrectAnswers: 0,
        timeTaken: 5,
        questions: [
          {
            id: 1,
            question: '测试问题1',
            options: ['A. 选项1', 'B. 选项2', 'C. 选项3', 'D. 选项4'],
            correctAnswer: 'A',
            explanation: '测试解析1',
            category: '测试分类'
          }
        ],
        userAnswers: { 1: 'A' }
      }
      localStorage.setItem('quizResults', JSON.stringify(mockResults))
    })
    
    await page.reload()
    
    // Emulate print media
    await page.emulateMedia({ media: 'print' })
    
    await expect(page.getByText('85%')).toBeVisible()
    
    await expect(page).toHaveScreenshot('results-page-print.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    })
  })
})