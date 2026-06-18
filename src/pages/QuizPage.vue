<template>
  <q-page class="q-pa-md">
    <!-- 未开始：欢迎界面 -->
    <div v-if="quizStore.phase === 'not-started'" class="quiz-welcome">
      <div class="text-center">
        <q-icon
          name="school"
          color="primary"
          size="80px"
          class="q-mb-lg"
        />
        <div class="text-h5 text-primary q-mb-sm">园林知识小测验</div>
        <div class="text-body1 text-grey-8 q-mb-md">
          共 {{ quizStore.totalCount }} 道单选题，测一测你对江南园林的了解程度吧！
        </div>
        <q-btn
          color="primary"
          label="开始测验"
          icon-right="arrow_forward"
          size="lg"
          unelevated
          @click="quizStore.startQuiz()"
        />
      </div>
    </div>

    <!-- 答题中 -->
    <div v-else-if="quizStore.phase === 'answering' && quizStore.currentQuestion">
      <div class="page-header q-mb-lg">
        <div class="row items-center no-wrap">
          <div class="text-h5 text-primary">园林知识小测验</div>
          <q-space />
          <q-chip dense color="primary" text-color="white" size="sm">
            {{ quizStore.currentIndex + 1 }} / {{ quizStore.totalCount }}
          </q-chip>
        </div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          逐题作答，答完后可查看得分与详细解析
        </div>
      </div>

      <q-linear-progress
        :value="progressPercent"
        color="primary"
        class="q-mb-lg progress-bar"
      />

      <q-card flat bordered class="question-card q-mb-md">
        <q-card-section>
          <div class="row items-start no-wrap">
            <q-badge
              color="primary"
              text-color="white"
              class="q-mr-md question-number"
            >
              {{ quizStore.currentIndex + 1 }}
            </q-badge>
            <div class="text-h6 question-text">
              {{ quizStore.currentQuestion.question }}
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-list bordered padding class="option-list">
            <q-item
              v-for="option in quizStore.currentQuestion.options"
              :key="option.id"
              clickable
              v-ripple
              :active="quizStore.currentSelectedId === option.id"
              @click="quizStore.selectAnswer(option.id)"
            >
              <q-item-section avatar>
                <q-radio
                  :model-value="quizStore.currentSelectedId"
                  :val="option.id"
                  size="md"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="option-label">
                  <span class="option-id">{{ optionLabel(option.id) }}.</span>
                  {{ option.text }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <div class="row items-center no-wrap q-mt-lg">
        <q-btn
          :disable="quizStore.isFirstQuestion"
          flat
          color="primary"
          label="上一题"
          icon="arrow_back"
          @click="quizStore.prevQuestion()"
        />
        <q-space />
        <q-btn
          v-if="!quizStore.isLastQuestion"
          color="primary"
          label="下一题"
          icon-right="arrow_forward"
          :disable="quizStore.currentSelectedId === null"
          unelevated
          @click="quizStore.nextQuestion()"
        />
        <q-btn
          v-else
          color="secondary"
          label="提交答卷"
          icon-right="check_circle"
          :disable="!allAnswered"
          unelevated
          @click="onSubmit"
        />
      </div>

      <div v-if="!allAnswered && quizStore.isLastQuestion" class="text-caption text-orange-8 q-mt-md text-center">
        <q-icon name="info" size="14px" class="q-mr-xs" />
        还有 {{ unansweredCount }} 道题未作答，请返回完成
      </div>
    </div>

    <!-- 测验结束：结果展示 -->
    <div v-else-if="quizStore.phase === 'finished'">
      <div class="page-header q-mb-lg">
        <div class="text-h5 text-primary">测验结果</div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          感谢你的参与，一起来看看成绩与解析吧
        </div>
      </div>

      <q-card flat bordered class="result-card q-mb-lg">
        <q-card-section>
          <div class="row items-center">
            <div class="col-auto result-score-wrap">
              <div class="result-score text-primary">
                {{ quizStore.score }}
              </div>
              <div class="text-caption text-grey-7">分</div>
            </div>
            <q-separator vertical inset class="q-mx-md" />
            <div class="col">
              <div class="row q-mb-xs">
                <div class="col-6 text-body2 text-grey-7">总题数</div>
                <div class="col-6 text-body2 text-right">
                  <span class="text-weight-medium">{{ quizStore.totalCount }}</span> 道
                </div>
              </div>
              <div class="row q-mb-xs">
                <div class="col-6 text-body2 text-grey-7">答对</div>
                <div class="col-6 text-body2 text-right">
                  <q-badge color="positive" text-color="white" class="q-mr-xs">
                    {{ quizStore.correctCount }}
                  </q-badge>
                  道
                </div>
              </div>
              <div class="row q-mb-xs">
                <div class="col-6 text-body2 text-grey-7">答错</div>
                <div class="col-6 text-body2 text-right">
                  <q-badge color="negative" text-color="white" class="q-mr-xs">
                    {{ quizStore.wrongAnswers.length }}
                  </q-badge>
                  道
                </div>
              </div>
              <div class="row">
                <div class="col-6 text-body2 text-grey-7">正确率</div>
                <div class="col-6 text-body2 text-right">
                  <span class="text-weight-medium">{{ accuracyPercent }}%</span>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="around" class="q-py-sm">
          <q-btn
            flat
            color="primary"
            label="再测一次"
            icon="refresh"
            @click="onRestart"
          />
          <q-btn
            v-if="quizStore.wrongAnswers.length"
            color="primary"
            label="查看错题"
            icon="error_outline"
            unelevated
            @click="scrollToWrongAnswers"
          />
        </q-card-actions>
      </q-card>

      <!-- 错题列表与解析 -->
      <div v-if="quizStore.wrongAnswers.length" ref="wrongSectionRef">
        <div class="section-header q-mb-md">
          <q-icon name="error_outline" color="negative" size="20px" class="q-mr-xs" />
          <div class="text-h6 text-negative">错题回顾</div>
        </div>

        <q-card
          v-for="(item, index) in quizStore.wrongAnswers"
          :key="item.question.id"
          flat
          bordered
          class="wrong-card q-mb-md"
        >
          <q-card-section>
            <div class="row items-start no-wrap q-mb-sm">
              <q-badge
                color="negative"
                text-color="white"
                class="q-mr-md"
              >
                {{ index + 1 }}
              </q-badge>
              <div class="text-subtitle1 text-weight-medium">
                {{ item.question.question }}
              </div>
            </div>

            <div class="wrong-options">
              <div
                v-for="option in item.question.options"
                :key="option.id"
                class="row items-center no-wrap option-row"
                :class="{
                  'option-row--correct': option.id === item.question.correctId,
                  'option-row--wrong':
                    option.id === item.answer.selectedId &&
                    option.id !== item.question.correctId,
                }"
              >
                <q-icon
                  :name="
                    option.id === item.question.correctId
                      ? 'check_circle'
                      : option.id === item.answer.selectedId
                      ? 'cancel'
                      : 'radio_button_unchecked'
                  "
                  :color="
                    option.id === item.question.correctId
                      ? 'positive'
                      : option.id === item.answer.selectedId
                      ? 'negative'
                      : 'grey-5'
                  "
                  size="18px"
                  class="q-mr-sm"
                />
                <div
                  class="text-body2"
                  :class="{
                    'text-positive text-weight-medium':
                      option.id === item.question.correctId,
                    'text-negative':
                      option.id === item.answer.selectedId &&
                      option.id !== item.question.correctId,
                  }"
                >
                  <span class="option-id">{{ optionLabel(option.id) }}.</span>
                  {{ option.text }}
                  <span
                    v-if="option.id === item.question.correctId"
                    class="q-ml-sm text-caption"
                  >
                    · 正确答案
                  </span>
                  <span
                    v-else-if="
                      option.id === item.answer.selectedId &&
                      option.id !== item.question.correctId
                    "
                    class="q-ml-sm text-caption"
                  >
                    · 你的选择
                  </span>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="explanation-section">
            <div class="row items-start no-wrap">
              <q-icon
                name="lightbulb_outline"
                color="amber"
                size="20px"
                class="q-mr-sm q-mt-xs"
              />
              <div>
                <div class="text-subtitle2 text-amber-9 text-weight-medium q-mb-xs">
                  解析
                </div>
                <div class="text-body2 text-grey-9 explanation-text">
                  {{ item.question.explanation }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 全部答对 -->
      <div v-else class="text-center q-pa-xl">
        <q-icon name="mood" color="positive" size="80px" class="q-mb-md" />
        <div class="text-h6 text-positive q-mb-sm">太棒了！全部答对！</div>
        <div class="text-body1 text-grey-7 q-mb-md">
          你对江南园林知识了如指掌，真是造园达人～
        </div>
        <q-btn
          color="primary"
          label="再测一次"
          icon="refresh"
          unelevated
          @click="onRestart"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useQuizStore } from '@/stores/quiz'

const $q = useQuasar()
const quizStore = useQuizStore()

const wrongSectionRef = ref<HTMLElement | null>(null)

/** 进度百分比 */
const progressPercent = computed(() => {
  if (quizStore.totalCount === 0) return 0
  return (quizStore.currentIndex + 1) / quizStore.totalCount
})

/** 正确率百分比 */
const accuracyPercent = computed(() => {
  if (quizStore.totalCount === 0) return 0
  return Math.round((quizStore.correctCount / quizStore.totalCount) * 100)
})

/** 未作答题数 */
const unansweredCount = computed(
  () => quizStore.answers.filter((a) => a.selectedId === null).length
)

/** 是否已全部作答 */
const allAnswered = computed(() => unansweredCount.value === 0)

/**
 * 将选项 id 转换为 A/B/C/D 标签
 * @param id - 选项 id
 */
function optionLabel(id: number): string {
  return String.fromCharCode(64 + id)
}

/**
 * 提交答卷
 */
function onSubmit(): void {
  if (!allAnswered.value) {
    $q.notify({
      type: 'warning',
      message: `还有 ${unansweredCount.value} 道题未作答`,
      position: 'top',
    })
    return
  }
  quizStore.submitQuiz()
}

/**
 * 重新开始测验
 */
function onRestart(): void {
  quizStore.resetQuiz()
  quizStore.startQuiz()
}

/**
 * 滚动至错题区域
 */
function scrollToWrongAnswers(): void {
  if (wrongSectionRef.value) {
    wrongSectionRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
</script>

<style scoped lang="scss">
.quiz-welcome {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-header {
  border-left: 4px solid var(--q-primary);
  padding-left: 12px;
}

.progress-bar {
  border-radius: 4px;
  height: 6px;
}

.question-card {
  border-radius: 8px;
}

.question-number {
  min-width: 28px;
  justify-content: center;
  border-radius: 50%;
  height: 28px;
}

.question-text {
  line-height: 1.6;
}

.option-list {
  border-radius: 8px;
  overflow: hidden;

  .option-label {
    line-height: 1.6;

    .option-id {
      font-weight: 500;
      margin-right: 6px;
    }
  }
}

.result-card {
  border-radius: 8px;
}

.result-score-wrap {
  text-align: center;
  padding-right: 16px;
}

.result-score {
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
}

.section-header {
  display: flex;
  align-items: center;
  border-left: 4px solid var(--q-negative);
  padding-left: 12px;
}

.wrong-card {
  border-radius: 8px;
}

.option-row {
  padding: 6px 0;
  border-radius: 6px;
  padding-left: 8px;
  margin-left: -8px;
  transition: background 0.15s ease;

  &--correct {
    background: rgba(23, 157, 82, 0.08);
  }

  &--wrong {
    background: rgba(229, 57, 53, 0.08);
  }

  .option-id {
    font-weight: 500;
    margin-right: 6px;
  }
}

.explanation-section {
  background: rgba(255, 193, 7, 0.08);
}

.explanation-text {
  line-height: 1.7;
}
</style>
