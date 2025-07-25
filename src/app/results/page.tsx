'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { QuizResults } from '@/lib/types'
import { isPassingScore, formatTime } from '@/lib/quiz'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  TrophyIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function ResultsPage() {
  const [results, setResults] = useState<QuizResults | null>(null)
  const [showAnswerReview, setShowAnswerReview] = useState(false)

  useEffect(() => {
    const savedResults = localStorage.getItem('quizResults')
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    }
  }, [])

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">未找到考试结果</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const passed = isPassingScore(results.score)
  const accuracy = Math.round((results.correctAnswers / results.totalQuestions) * 100)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Score Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          passed ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {passed ? (
            <TrophyIcon className="h-8 w-8 text-green-600" />
          ) : (
            <XCircleIcon className="h-8 w-8 text-red-600" />
          )}
        </div>

        <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
          passed ? 'text-green-600' : 'text-red-600'
        }`}>
          {results.score}%
        </h1>

        <h2 className={`text-xl md:text-2xl font-semibold mb-4 ${
          passed ? 'text-green-800' : 'text-red-800'
        }`}>
          {passed ? '🎉 考试通过！' : '继续努力！'}
        </h2>

        <p className="text-gray-600 mb-6">
          {passed 
            ? '恭喜您！您已通过Alberta驾驶知识考试。' 
            : '不要灰心，继续练习就能通过考试。'
          }
        </p>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800">{results.correctAnswers}</div>
            <div className="text-sm text-gray-600">答对题数</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800">{results.incorrectAnswers}</div>
            <div className="text-sm text-gray-600">答错题数</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
            <div className="text-sm text-gray-600">正确率</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <ClockIcon className="h-6 w-6 mx-auto mb-1 text-gray-600" />
            <div className="text-sm text-gray-600">{formatTime(results.timeTaken)}</div>
          </div>
        </div>
      </div>

      {/* Pass/Fail Message */}
      <div className={`rounded-lg p-6 mb-8 ${
        passed 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            {passed ? (
              <CheckCircleIcon className="h-6 w-6" />
            ) : (
              <ChartBarIcon className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className={`font-semibold mb-2 ${
              passed ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {passed ? '考试通过说明' : '继续学习建议'}
            </h3>
            <p className={`text-sm ${passed ? 'text-green-700' : 'text-yellow-700'}`}>
              {passed 
                ? 'Alberta驾驶知识考试的通过分数是80%，您的成绩已达到要求。现在可以预约road test了！'
                : '建议您继续复习错题，重点掌握交通法规和安全驾驶知识。Alberta驾驶知识考试需要达到80%才能通过。'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Answer Review Toggle */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <button
          onClick={() => setShowAnswerReview(!showAnswerReview)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            查看答题详情
          </h3>
          <ChartBarIcon className={`h-5 w-5 transition-transform ${
            showAnswerReview ? 'rotate-180' : ''
          }`} />
        </button>

        {showAnswerReview && (
          <div className="mt-6 space-y-4">
            {results.questions.map((question, index) => {
              const userAnswer = results.userAnswers[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              
              return (
                <div key={question.id} className={`border rounded-lg p-4 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex-shrink-0 ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">
                        第{index + 1}题: {question.question}
                      </h4>
                      
                      <div className="text-sm space-y-1">
                        <div className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          您的答案: {question.options.find(opt => opt.startsWith(userAnswer || ''))?.substring(3) || '未作答'}
                        </div>
                        {!isCorrect && (
                          <div className="text-green-700">
                            正确答案: {question.options.find(opt => opt.startsWith(question.correctAnswer))?.substring(3)}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>解析：</strong>{question.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5" />
          重新考试
        </Link>
        
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}