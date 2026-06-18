import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import gardenElementsData from '@/mock/garden-elements.json'
import type { GardenElement } from '@/types/garden'

export interface CategoryStat {
  category: string
  count: number
  summary: string
  topElements: Pick<GardenElement, 'id' | 'name'>[]
}

const categorySummaries: Record<string, string> = {
  '取景技法': '通过巧妙取景拓展空间层次',
  '空间处理': '运用分隔与遮障营造空间节奏',
  '植物配置': '以植物点配烘托主景氛围',
  '水景要素': '借水之动静态增添园林灵气',
}

export const useGardenStore = defineStore('garden', () => {
  const elements = ref<GardenElement[]>(gardenElementsData as GardenElement[])
  const selectedCategory = ref<string>('全部')

  const categories = computed(() => {
    const unique = [...new Set(elements.value.map((el) => el.category))]
    return ['全部', ...unique]
  })

  const filteredElements = computed(() => {
    if (selectedCategory.value === '全部') {
      return elements.value
    }
    return elements.value.filter((el) => el.category === selectedCategory.value)
  })

  const categoryStats = computed<CategoryStat[]>(() => {
    const map = new Map<string, GardenElement[]>()
    for (const el of elements.value) {
      const list = map.get(el.category) ?? []
      list.push(el)
      map.set(el.category, list)
    }
    const result: CategoryStat[] = []
    for (const [category, els] of map) {
      result.push({
        category,
        count: els.length,
        summary: categorySummaries[category] ?? '',
        topElements: els.slice(0, 3).map((e) => ({ id: e.id, name: e.name })),
      })
    }
    return result
  })

  function getElementById(id: string): GardenElement | undefined {
    return elements.value.find((el) => el.id === id)
  }

  function setCategory(category: string): void {
    selectedCategory.value = category
  }

  return {
    elements,
    selectedCategory,
    categories,
    filteredElements,
    categoryStats,
    getElementById,
    setCategory,
  }
})
