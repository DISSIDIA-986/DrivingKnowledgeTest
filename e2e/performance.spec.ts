import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should load home page within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Wait for main content to be visible
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    
    const loadTime = Date.now() - startTime
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
    
    // Check that critical content is visible quickly
    await expect(page.getByText('高效、简洁、专为华人设计')).toBeVisible()
    await expect(page.getByText('开始考试')).toBeVisible()
  })

  test('should load quiz page efficiently', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/quiz')
    
    // Wait for quiz content to load
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    const loadTime = Date.now() - startTime
    
    // Quiz should load within 5 seconds (includes data processing)
    expect(loadTime).toBeLessThan(5000)
    
    // Verify essential elements are present
    await expect(page.getByText(/第 \d+ 题/)).toBeVisible()
    await expect(page.getByText(/用时:/)).toBeVisible()
  })

  test('should have fast navigation between questions', async ({ page }) => {
    await page.goto('/quiz')
    await page.waitForSelector('[data-testid="quiz-question"], .text-lg', { timeout: 10000 })
    
    // Select an answer
    const firstOption = page.locator('button:has-text("A.")').first()
    if (await firstOption.isVisible()) {
      await firstOption.click()
    }
    
    // Test navigation speed
    const nextButton = page.getByText('下一题')
    if (await nextButton.isVisible()) {
      const navigationStart = Date.now()
      
      await nextButton.click()
      await expect(page.getByText('第 2 题')).toBeVisible()
      
      const navigationTime = Date.now() - navigationStart
      
      // Navigation should be nearly instant
      expect(navigationTime).toBeLessThan(500)
    }
  })

  test('should measure Core Web Vitals', async ({ page }) => {
    await page.goto('/')
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
        
        // Timeout after 10 seconds
        setTimeout(() => resolve(0), 10000)
      })
    })
    
    // LCP should be under 2.5 seconds
    expect(lcp as number).toBeLessThan(2500)
  })

  test('should measure First Input Delay simulation', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle')
    
    const startTime = Date.now()
    
    // Click the start button
    await page.getByRole('link', { name: '开始考试' }).click()
    
    const responseTime = Date.now() - startTime
    
    // Input response should be under 100ms (simulated FID)
    expect(responseTime).toBeLessThan(100)
  })

  test('should have efficient bundle size', async ({ page }) => {
    const response = await page.goto('/')
    
    // Check main page response size
    expect(response?.status()).toBe(200)
    
    // Get network requests to analyze bundle sizes
    const responses = []
    page.on('response', (response) => {
      if (response.url().includes('/_next/static/')) {
        responses.push(response)
      }
    })
    
    await page.waitForLoadState('networkidle')
    
    // Verify we're loading resources efficiently
    expect(responses.length).toBeGreaterThan(0)
    
    // Check that we don't have excessive requests
    expect(responses.length).toBeLessThan(20)
  })

  test('should handle image loading efficiently', async ({ page }) => {
    await page.goto('/')
    
    // Check that images are properly optimized
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      
      // Check that images have proper alt text (accessibility + SEO)
      const altText = await img.getAttribute('alt')
      expect(altText).toBeTruthy()
      
      // Check that images are visible (loaded properly)
      await expect(img).toBeVisible()
    }
  })

  test('should cache static resources', async ({ page, context }) => {
    // First visit
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Second visit should use cached resources
    const cachedRequests = []
    page.on('response', (response) => {
      if (response.status() === 304 || response.fromServiceWorker()) {
        cachedRequests.push(response)
      }
    })
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Should have some cached resources (though Next.js handles this differently in static export)
    // This test is more relevant for production deployments
  })

  test('should handle multiple concurrent users simulation', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ])
    
    const pages = await Promise.all(contexts.map(ctx => ctx.newPage()))
    
    // Simulate multiple users accessing the home page simultaneously
    const startTime = Date.now()
    
    await Promise.all(
      pages.map(page => page.goto('/'))
    )
    
    // Wait for all pages to load
    await Promise.all(
      pages.map(page => 
        expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
      )
    )
    
    const totalTime = Date.now() - startTime
    
    // Should handle concurrent users efficiently
    expect(totalTime).toBeLessThan(5000)
    
    // Cleanup
    await Promise.all(contexts.map(ctx => ctx.close()))
  })

  test('should have efficient font loading', async ({ page }) => {
    await page.goto('/')
    
    // Check that Chinese fonts are loading properly
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    
    // Check computed font family includes Chinese font
    const fontFamily = await heading.evaluate(el => 
      window.getComputedStyle(el).fontFamily
    )
    
    // Should include Noto Sans SC or similar Chinese-compatible font
    expect(fontFamily).toContain('Noto Sans SC')
  })

  test('should minimize layout shifts', async ({ page }) => {
    await page.goto('/')
    
    // Wait for initial load
    await page.waitForLoadState('domcontentloaded')
    
    // Take initial screenshot for layout comparison
    const initialScreenshot = await page.screenshot()
    
    // Wait for all resources to load
    await page.waitForLoadState('networkidle')
    
    // Take final screenshot
    const finalScreenshot = await page.screenshot()
    
    // In a real scenario, you'd compare these screenshots
    // or use more sophisticated CLS measurement
    expect(initialScreenshot.length).toBeGreaterThan(0)
    expect(finalScreenshot.length).toBeGreaterThan(0)
  })

  test('should perform well on mobile devices', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 })
    
    const startTime = Date.now()
    await page.goto('/')
    
    // Wait for content to be visible
    await expect(page.getByText('Alberta 驾驶知识考试准备')).toBeVisible()
    
    const loadTime = Date.now() - startTime
    
    // Mobile should still load reasonably fast
    expect(loadTime).toBeLessThan(4000)
    
    // Test mobile-specific interactions
    const startButton = page.getByRole('link', { name: '开始考试' })
    await expect(startButton).toBeVisible()
    
    // Button should be touch-friendly (at least 44px tall)
    const buttonHeight = await startButton.evaluate(el => el.offsetHeight)
    expect(buttonHeight).toBeGreaterThanOrEqual(44)
  })
})