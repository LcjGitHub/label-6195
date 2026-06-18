/** 选项 */
export interface QuizOption {
  id: number
  text: string
}

/** 题目 */
export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  correctId: number
  explanation: string
}

/** 用户作答记录 */
export interface QuizAnswer {
  questionId: string
  selectedId: number | null
  isCorrect: boolean
}

/** 测验状态阶段 */
export type QuizPhase = 'not-started' | 'answering' | 'finished'
