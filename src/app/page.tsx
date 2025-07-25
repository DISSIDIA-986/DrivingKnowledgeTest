'use client'

import Link from 'next/link'
import { BookOpenIcon, PlayIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center max-w-2xl mb-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <AcademicCapIcon className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          高效、简洁、专为华人设计
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Alberta 驾驶知识考试实际只有 30 题，难度远低于中国驾考。
          我们精选高频考题，帮助您快速掌握重点，节省学习时间。
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            💡 <strong>学习建议：</strong>考试比您想象的简单，只需多练习高频题目即可！
          </p>
        </div>
        
        <Link 
          href="/quiz"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-lg"
        >
          <PlayIcon className="h-5 w-5" />
          开始考试
        </Link>
      </div>
      
      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
            <BookOpenIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">精选题库</h3>
          <p className="text-gray-600 text-sm">
            基于真实考试题目，筛选高频考点，提高学习效率
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
            <div className="h-8 w-8 flex items-center justify-center text-green-600 font-bold text-lg">
              30
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">真实体验</h3>
          <p className="text-gray-600 text-sm">
            模拟真实考试，30题随机抽取，完全还原考试流程
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
            <div className="h-8 w-8 flex items-center justify-center text-blue-600 font-bold">
              中
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">中文界面</h3>
          <p className="text-gray-600 text-sm">
            简洁的中文界面，清晰的答案解析，降低语言障碍
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>祝您考试顺利，早日拿到驾照！🚗</p>
      </footer>
    </div>
  )
}
