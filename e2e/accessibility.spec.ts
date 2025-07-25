import { test, expect } from '@playwright/test'

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy on home page', async ({ page }) => {
    await page.goto('/')
    
    // Check main heading exists and is properly structured
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('Alberta 驾驶知识考试准备')
    
    // Check feature headings are h3 elements
    const h3Elements = page.locator('h3')
    await expect(h3Elements).toHaveCount(3)
    
    const headingTexts = ['精选题库', '真实体验', '中文界面']
    for (const text of headingTexts) {
      await expect(page.locator(`h3:has-text("${text}")`)).toBeVisible()
    }
  })

  test('should have proper aria labels and roles', async ({ page }) => {
    await page.goto('/')
    
    // Check main navigation link has proper role
    const startButton = page.getByRole('link', { name: '开始考试' })
    await expect(startButton).toBeVisible()
    await expect(startButton).toHaveAttribute('href', '/quiz')
  })

  test('should support keyboard navigation on home page', async ({ page }) => {
    await page.goto('/')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    
    // The start quiz button should be focusable
    const startButton = page.getByRole('link', { name: '开始考试' })
    await expect(startButton).toBeFocused()
    
    // Test Enter key activation
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/quiz')
  })

  test('should have accessible quiz interface', async ({ page }) => {
    await page.goto('/quiz')
    
    // Wait for quiz to load
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Check that question is in a proper heading
    const questionElement = page.locator('.text-lg, .text-xl').first()
    await expect(questionElement).toBeVisible()
    
    // Check that answer buttons are keyboard accessible
    const answerButtons = page.locator('button:has-text("A.")')
    if (await answerButtons.count() > 0) {
      // Focus first answer button
      await answerButtons.first().focus()
      await expect(answerButtons.first()).toBeFocused()
      
      // Test keyboard selection
      await page.keyboard.press('Enter')
      await expect(answerButtons.first()).toHaveClass(/border-blue-500|bg-blue-50/)
    }
  })

  test('should have proper focus management in quiz navigation', async ({ page }) => {
    await page.goto('/quiz')
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Test navigation button focus
    const nextButton = page.getByText('下一题')
    if (await nextButton.isVisible()) {
      await nextButton.focus()
      await expect(nextButton).toBeFocused()
    }
    
    const prevButton = page.getByText('上一题')
    if (await prevButton.isVisible()) {
      await prevButton.focus()
      await expect(prevButton).toBeFocused()
    }
  })

  test('should have accessible results page', async ({ page }) => {
    // Complete a quiz first
    await page.goto('/quiz')
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Quick completion
    const option = page.locator('button:has-text("A.")').first()
    if (await option.isVisible()) {
      await option.click()
    }
    
    const submitButton = page.getByText('提交答案')
    if (await submitButton.isVisible()) {
      await submitButton.click()
    }
    
    await page.waitForURL('/results')
    
    // Check score is announced properly
    const scoreElement = page.getByText(/\d+%/).first()
    await expect(scoreElement).toBeVisible()
    
    // Check action buttons are accessible
    const retakeButton = page.getByRole('link', { name: /重新考试/ })
    const homeButton = page.getByRole('link', { name: '返回首页' })
    
    await expect(retakeButton).toBeVisible()
    await expect(homeButton).toBeVisible()
    
    // Test keyboard navigation
    await retakeButton.focus()
    await expect(retakeButton).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(homeButton).toBeFocused()
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Check that text elements have sufficient contrast
    // This is a basic check - in real scenarios you'd use axe-playwright
    const mainHeading = page.locator('h1')
    await expect(mainHeading).toHaveCSS('color', 'rgb(31, 41, 55)') // text-gray-800
    
    const startButton = page.getByRole('link', { name: '开始考试' })
    await expect(startButton).toHaveCSS('color', 'rgb(255, 255, 255)') // white text
    await expect(startButton).toHaveCSS('background-color', 'rgb(37, 99, 235)') // bg-blue-600
  })

  test('should handle screen reader announcements', async ({ page }) => {
    await page.goto('/')
    
    // Check that images have proper alt text
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const altText = await img.getAttribute('alt')
      expect(altText).toBeTruthy()
      expect(altText?.length).toBeGreaterThan(0)
    }
  })

  test('should support high contrast mode', async ({ page }) => {
    // Test with forced-colors media query
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' })
    await page.goto('/')
    
    // Verify key elements are still visible
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    await expect(page.getByRole('link', { name: '开始考试' })).toBeVisible()
  })

  test('should be responsive for different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Verify content is still accessible on mobile
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    await expect(page.getByRole('link', { name: '开始考试' })).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    await expect(page.getByRole('link', { name: '开始考试' })).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.reload()
    
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    await expect(page.getByRole('link', { name: '开始考试' })).toBeVisible()
  })

  test('should have proper language attributes', async ({ page }) => {
    await page.goto('/')
    
    // Check html lang attribute
    const htmlElement = page.locator('html')
    await expect(htmlElement).toHaveAttribute('lang', 'zh-CN')
  })

  test('should provide clear error messages', async ({ page }) => {
    // Test results page without quiz data
    await page.goto('/results')
    
    // Should show clear message about missing results
    await expect(page.getByText('未找到考试结果')).toBeVisible()
    await expect(page.getByRole('link', { name: '返回首页' })).toBeVisible()
  })
})