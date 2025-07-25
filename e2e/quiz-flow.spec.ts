import { test, expect } from '@playwright/test'

test.describe('Complete Quiz Flow', () => {
  test('should complete full quiz workflow from home to results', async ({ page }) => {
    // Start from home page
    await page.goto('/')
    
    // Verify home page elements
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    await expect(page.getByText('高效、简洁、专为华人设计')).toBeVisible()
    await expect(page.getByText('开始考试')).toBeVisible()
    
    // Click start quiz button
    await page.getByRole('link', { name: '开始考试' }).click()
    
    // Verify quiz page loaded
    await expect(page).toHaveURL('/quiz')
    await expect(page.getByText(/第 \d+ 题 \/ 共 \d+ 题/)).toBeVisible()
    
    // Wait for questions to load
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Answer all questions
    let currentQuestion = 1
    const maxQuestions = 10 // Limit iterations to prevent infinite loops
    
    while (currentQuestion <= maxQuestions) {
      try {
        // Check if we're on the last question by looking for submit button
        const submitButton = page.getByText('提交答案')
        const nextButton = page.getByText('下一题')
        
        if (await submitButton.isVisible()) {
          // This is the last question
          const options = page.locator('button:has-text("A.")')
          if (await options.count() > 0) {
            await options.first().click()
          }
          await submitButton.click()
          break
        } else if (await nextButton.isVisible()) {
          // This is not the last question
          const options = page.locator('button:has-text("A.")')
          if (await options.count() > 0) {
            await options.first().click()
          }
          await nextButton.click()
          currentQuestion++
        } else {
          // No navigation buttons found, exit
          break
        }
        
        // Short wait between questions
        await page.waitForTimeout(500)
      } catch (error) {
        console.log(`Error on question ${currentQuestion}:`, error)
        break
      }
    }
    
    // Verify results page
    await expect(page).toHaveURL('/results')
    await expect(page.getByText(/\d+%/)).toBeVisible()
    await expect(page.getByText(/考试通过|继续努力/)).toBeVisible()
  })

  test('should navigate between questions correctly', async ({ page }) => {
    await page.goto('/quiz')
    
    // Wait for quiz to load
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Verify initial state
    await expect(page.getByText('第 1 题')).toBeVisible()
    await expect(page.getByText('已答题: 0')).toBeVisible()
    
    // Select first answer
    const firstOption = page.locator('button:has-text("A.")').first()
    await firstOption.click()
    
    // Verify answer was selected and progress updated
    await expect(page.getByText('已答题: 1')).toBeVisible()
    
    // Navigate to next question if available
    const nextButton = page.getByText('下一题')
    if (await nextButton.isVisible()) {
      await nextButton.click()
      await expect(page.getByText('第 2 题')).toBeVisible()
      
      // Navigate back to previous question
      const prevButton = page.getByText('上一题')
      await prevButton.click()
      await expect(page.getByText('第 1 题')).toBeVisible()
      
      // Verify answer is still selected
      await expect(firstOption).toHaveClass(/border-blue-500|bg-blue-50/)
    }
  })

  test('should show timer and progress correctly', async ({ page }) => {
    await page.goto('/quiz')
    
    // Wait for quiz to load
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Verify timer is present
    await expect(page.getByText(/用时:/)).toBeVisible()
    
    // Verify progress bar exists
    await expect(page.locator('.bg-blue-600')).toBeVisible()
    
    // Wait a bit and verify timer updates
    await page.waitForTimeout(2000)
    await expect(page.getByText(/用时: 0:[0-9]{2}/)).toBeVisible()
  })

  test('should handle answer review on results page', async ({ page }) => {
    // Complete a quick quiz first
    await page.goto('/quiz')
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Answer first question and submit
    const firstOption = page.locator('button:has-text("A.")').first()
    await firstOption.click()
    
    // Try to submit (might need to navigate to last question)
    const submitButton = page.getByText('提交答案')
    if (await submitButton.isVisible()) {
      await submitButton.click()
    } else {
      // Navigate through questions quickly to reach submit
      for (let i = 0; i < 5; i++) {
        const nextButton = page.getByText('下一题')
        if (await nextButton.isVisible()) {
          await nextButton.click()
          await page.waitForTimeout(300)
          
          // Select answer
          const option = page.locator('button:has-text("A.")').first()
          if (await option.isVisible()) {
            await option.click()
          }
          
          // Check for submit button
          if (await page.getByText('提交答案').isVisible()) {
            await page.getByText('提交答案').click()
            break
          }
        } else {
          break
        }
      }
    }
    
    // Wait for results page
    await expect(page).toHaveURL('/results')
    
    // Test answer review toggle
    const reviewButton = page.getByText('查看答题详情')
    await reviewButton.click()
    
    // Verify detailed answers are shown
    await expect(page.getByText(/第\d+题:/)).toBeVisible()
    await expect(page.getByText(/您的答案:/)).toBeVisible()
    await expect(page.getByText(/解析：/)).toBeVisible()
  })

  test('should support retaking quiz', async ({ page }) => {
    // Go directly to results (simulate completed quiz)
    await page.goto('/results')
    
    // If no results found, complete a quiz first
    if (await page.getByText('未找到考试结果').isVisible()) {
      await page.goto('/quiz')
      await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
      
      // Quick completion
      const option = page.locator('button:has-text("A.")').first()
      await option.click()
      
      const submitButton = page.getByText('提交答案')
      if (await submitButton.isVisible()) {
        await submitButton.click()
      }
      
      await page.waitForURL('/results')
    }
    
    // Click retake quiz
    await page.getByRole('link', { name: /重新考试/ }).click()
    
    // Verify back to quiz page
    await expect(page).toHaveURL('/quiz')
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
  })

  test('should return to home from results', async ({ page }) => {
    // Complete quiz flow to get to results
    await page.goto('/quiz')
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Quick answer and submit
    const option = page.locator('button:has-text("A.")').first()
    await option.click()
    
    const submitButton = page.getByText('提交答案')
    if (await submitButton.isVisible()) {
      await submitButton.click()
    }
    
    await page.waitForURL('/results')
    
    // Click return home
    await page.getByRole('link', { name: '返回首页' }).click()
    
    // Verify back to home page
    await expect(page).toHaveURL('/')
    await expect(page.getByText('高效、简洁、专为华人设计')).toBeVisible()
  })
})