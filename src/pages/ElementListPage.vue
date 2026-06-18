<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <div class="row items-start no-wrap">
        <div>
          <div class="text-h5 text-primary q-mb-xs">造园要素一览</div>
          <div class="text-body2 text-grey-7">
            借景、对景、框景……探索江南古典园林的空间造境手法
          </div>
        </div>
        <q-space />
        <div class="row q-gutter-sm">
          <q-btn
            label="去对照"
            icon="compare_arrows"
            color="primary"
            @click="goCompare"
          />
          <q-btn
            label="开始测验"
            icon="school"
            color="secondary"
            @click="goQuiz"
          />
        </div>
      </div>
    </div>

    <div class="q-mb-md">
      <div class="text-subtitle2 text-grey-8 q-mb-sm">分类筛选</div>
      <q-btn-toggle
        v-model="category"
        spread
        no-caps
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="categoryOptions"
        class="category-toggle"
        @update:model-value="onCategoryChange"
      />
    </div>

    <div v-if="filteredElements.length" class="row q-col-gutter-md">
      <div
        v-for="element in filteredElements"
        :key="element.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <ElementCard :element="element" />
      </div>
    </div>

    <div v-else class="flex flex-center q-pa-xl text-grey-6">
      <div class="text-center">
        <q-icon name="search_off" size="64px" class="q-mb-md" />
        <div class="text-h6">暂无该分类下的要素</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import ElementCard from '@/components/ElementCard.vue'
import { useGardenStore } from '@/stores/garden'
import { useQuizStore } from '@/stores/quiz'

const router = useRouter()
const gardenStore = useGardenStore()
const quizStore = useQuizStore()
const { filteredElements, categories, selectedCategory } = storeToRefs(gardenStore)

const category = ref(selectedCategory.value)

/** 分类按钮选项 */
const categoryOptions = computed(() =>
  categories.value.map((cat) => ({ label: cat, value: cat }))
)

watch(selectedCategory, (val) => {
  category.value = val
})

/**
 * 切换分类筛选
 * @param value - 选中的分类
 */
function onCategoryChange(value: string): void {
  gardenStore.setCategory(value)
}

/**
 * 跳转至对照页面
 */
function goCompare(): void {
  router.push({ name: 'compare' })
}

/**
 * 跳转至知识测验页面并直接开始答题
 */
function goQuiz(): void {
  quizStore.startQuiz()
  router.push({ name: 'quiz' })
}
</script>

<style scoped lang="scss">
.page-header {
  border-left: 4px solid var(--q-primary);
  padding-left: 12px;
}

.category-toggle {
  border: 1px solid rgba(46, 125, 111, 0.3);
  border-radius: 8px;
  overflow: hidden;
}
</style>
