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
            label="分类概览"
            icon="category"
            outline
            color="primary"
            @click="goOverview"
          />
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
      <q-input
        v-model="searchKeyword"
        outlined
        dense
        placeholder="搜索要素名称或简介…"
        clearable
        class="search-input"
        @update:model-value="onSearchInput"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
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
        <div class="text-h6">{{ emptyMessage }}</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import ElementCard from '@/components/ElementCard.vue'
import { useGardenStore } from '@/stores/garden'
import { useQuizStore } from '@/stores/quiz'

const route = useRoute()
const router = useRouter()
const gardenStore = useGardenStore()
const quizStore = useQuizStore()
const { filteredElements, categories, selectedCategory, searchKeyword } = storeToRefs(gardenStore)

const category = ref(selectedCategory.value)

const categoryOptions = computed(() =>
  categories.value.map((cat) => ({ label: cat, value: cat }))
)

watch(selectedCategory, (val) => {
  category.value = val
})

onMounted(() => {
  const cat = route.query.category as string | undefined
  if (cat && categories.value.includes(cat)) {
    gardenStore.setCategory(cat)
  } else {
    gardenStore.setCategory('全部')
  }
})

watch(() => route.query.category, (cat) => {
  if (cat && categories.value.includes(cat as string)) {
    gardenStore.setCategory(cat as string)
  } else if (!cat) {
    gardenStore.setCategory('全部')
  }
})

function onCategoryChange(value: string): void {
  gardenStore.setCategory(value)
}

function onSearchInput(value: string | number | null): void {
  gardenStore.setSearchKeyword((value ?? '').toString())
}

const emptyMessage = computed(() => {
  if (searchKeyword.value.trim()) {
    return selectedCategory.value === '全部'
      ? `未找到与"${searchKeyword.value.trim()}"相关的要素`
      : `"${selectedCategory.value}"分类下未找到与"${searchKeyword.value.trim()}"相关的要素`
  }
  return '暂无该分类下的要素'
})

function goOverview(): void {
  router.push({ name: 'category-overview' })
}

function goCompare(): void {
  router.push({ name: 'compare' })
}

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

.search-input {
  max-width: 400px;
}
</style>
