import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import gardenElementsData from '@/mock/garden-elements.json'
import type { GardenElement, RelatedElementItem } from '@/types/garden'

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
  const searchKeyword = ref<string>('')

  const categories = computed(() => {
    const unique = [...new Set(elements.value.map((el) => el.category))]
    return ['全部', ...unique]
  })

  const filteredElements = computed(() => {
    let result = elements.value
    if (selectedCategory.value !== '全部') {
      result = result.filter((el) => el.category === selectedCategory.value)
    }
    if (searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.trim().toLowerCase()
      result = result.filter(
        (el) =>
          el.name.toLowerCase().includes(keyword) ||
          el.desc.toLowerCase().includes(keyword)
      )
    }
    return result
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

  function getRelatedElements(id: string, limit = 3): RelatedElementItem[] {
    const current = getElementById(id)
    if (!current) return []
    return elements.value
      .filter((el) => el.id !== id && el.category === current.category)
      .slice(0, limit)
      .map((el) => ({ id: el.id, name: el.name, desc: el.desc, category: el.category }))
  }

  function setCategory(category: string): void {
    selectedCategory.value = category
  }

  function setSearchKeyword(keyword: string): void {
    searchKeyword.value = keyword
  }

  function resetFilters(): void {
    selectedCategory.value = '全部'
    searchKeyword.value = ''
  }

  return {
    elements,
    selectedCategory,
    searchKeyword,
    categories,
    filteredElements,
    categoryStats,
    getElementById,
    getRelatedElements,
    setCategory,
    setSearchKeyword,
    resetFilters,
  }
})
