import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import quizQuestionsData from '@/mock/quiz-questions.json'
import type { QuizAnswer, QuizPhase, QuizQuestion } from '@/types/quiz'

/**
 * 园林知识测验 Store
 */
export const useQuizStore = defineStore('quiz', () => {
  const questions = ref<QuizQuestion[]>(quizQuestionsData as QuizQuestion[])

  const phase = ref<QuizPhase>('not-started')

  const currentIndex = ref(0)

  const answers = ref<QuizAnswer[]>([])

  /** 总题数 */
  const totalCount = computed(() => questions.value.length)

  /** 当前题目 */
  const currentQuestion = computed(
    () => questions.value[currentIndex.value] ?? null
  )

  /** 是否第一题 */
  const isFirstQuestion = computed(() => currentIndex.value === 0)

  /** 是否最后一题 */
  const isLastQuestion = computed(
    () => currentIndex.value === totalCount.value - 1
  )

  /** 当前进度（当前题目的已选答案 */
  const currentSelectedId = computed(() => {
    const current = currentQuestion.value
    if (!current) return null
    const record = answers.value.find((a) => a.questionId === current.id)
    return record?.selectedId ?? null
  })

  /** 答对题数 */
  const correctCount = computed(
    () => answers.value.filter((a) => a.isCorrect).length
  )

  /** 得分（百分制） */
  const score = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.round((correctCount.value / totalCount.value) * 100)
  })

  /** 错题列表 */
  const wrongAnswers = computed(() => {
    return answers.value
      .filter((a) => !a.isCorrect)
      .map((answer) => {
        const question = questions.value.find(
          (q) => q.id === answer.questionId
        )
        return {
          question,
          answer,
        }
      })
      .filter(
        (item): item is { question: QuizQuestion; answer: QuizAnswer } =>
          item.question !== undefined
      )
  })

  /**
   * 开始测验
   */
  function startQuiz(): void {
    phase.value = 'answering'
    currentIndex.value = 0
    answers.value = questions.value.map((q) => ({
      questionId: q.id,
      selectedId: null,
      isCorrect: false,
    }))
  }

  /**
   * 选择答案
   * @param optionId - 选项 id
   */
  function selectAnswer(optionId: number): void {
    const current = currentQuestion.value
    if (!current) return
    const record = answers.value.find(
      (a) => a.questionId === current.id
    )
    if (record) {
      record.selectedId = optionId
      record.isCorrect = optionId === current.correctId
    }
  }

  /**
   * 前往上一题
   */
  function prevQuestion(): void {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  /**
   * 前往下一题
   */
  function nextQuestion(): void {
    if (currentIndex.value < totalCount.value - 1) {
      currentIndex.value++
    }
  }

  /**
   * 提交测验
   */
  function submitQuiz(): void {
    phase.value = 'finished'
  }

  /**
   * 重置测验（回到未开始状态）
   */
  function resetQuiz(): void {
    phase.value = 'not-started'
    currentIndex.value = 0
    answers.value = []
  }

  return {
    questions,
    phase,
    currentIndex,
    answers,
    totalCount,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    currentSelectedId,
    correctCount,
    score,
    wrongAnswers,
    startQuiz,
    selectAnswer,
    prevQuestion,
    nextQuestion,
    submitQuiz,
    resetQuiz,
  }
})
