import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import gardenElementsData from '@/mock/garden-elements.json'
import type { GardenElement } from '@/types/garden'

/**
 * 造园要素数据 Store
 */
export const useGardenStore = defineStore('garden', () => {
  const elements = ref<GardenElement[]>(gardenElementsData as GardenElement[])
  const selectedCategory = ref<string>('全部')

  /** 所有分类（含「全部」） */
  const categories = computed(() => {
    const unique = [...new Set(elements.value.map((el) => el.category))]
    return ['全部', ...unique]
  })

  /** 按当前分类筛选后的要素列表 */
  const filteredElements = computed(() => {
    if (selectedCategory.value === '全部') {
      return elements.value
    }
    return elements.value.filter((el) => el.category === selectedCategory.value)
  })

  /**
   * 根据 id 获取单个要素
   * @param id - 要素 id
   */
  function getElementById(id: string): GardenElement | undefined {
    return elements.value.find((el) => el.id === id)
  }

  /**
   * 设置当前筛选分类
   * @param category - 分类名称
   */
  function setCategory(category: string): void {
    selectedCategory.value = category
  }

  return {
    elements,
    selectedCategory,
    categories,
    filteredElements,
    getElementById,
    setCategory,
  }
})
