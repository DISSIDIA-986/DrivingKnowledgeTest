import type { Metadata } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import './globals.css'

const notoSansCN = Noto_Sans_SC({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Alberta 驾驶知识考试准备',
  description: '帮助中国新移民高效准备 Alberta 驾驶知识考试，缩短学习时间，提升通过率。',
  keywords: 'Alberta, 驾驶考试, 中国移民, 练习题, 驾照',
  authors: [{ name: 'Alberta Driving Test Prep' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Alberta 驾驶知识考试准备',
    description: '帮助中国新移民高效准备 Alberta 驾驶知识考试',
    type: 'website',
    locale: 'zh_CN',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSansCN.className} antialiased bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <header className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Alberta 驾驶知识考试准备
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              专为中国新移民设计的高效学习工具
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
