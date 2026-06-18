import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import famousGardensData from '@/mock/famous-gardens.json'
import type { FamousGarden } from '@/types/garden'

/**
 * 江南名园数据 Store
 */
export const useFamousGardenStore = defineStore('famousGarden', () => {
  const gardens = ref<FamousGarden[]>(famousGardensData as FamousGarden[])
  const selectedCity = ref<string>('全部')

  /** 所有城市（含「全部」） */
  const cities = computed(() => {
    const unique = [...new Set(gardens.value.map((g) => g.city))]
    return ['全部', ...unique]
  })

  /** 按当前城市筛选后的名园列表 */
  const filteredGardens = computed(() => {
    if (selectedCity.value === '全部') {
      return gardens.value
    }
    return gardens.value.filter((g) => g.city === selectedCity.value)
  })

  /**
   * 根据 id 获取单个名园
   * @param id - 名园 id
   */
  function getGardenById(id: string): FamousGarden | undefined {
    return gardens.value.find((g) => g.id === id)
  }

  /**
   * 设置当前筛选城市
   * @param city - 城市名称
   */
  function setCity(city: string): void {
    selectedCity.value = city
  }

  return {
    gardens,
    selectedCity,
    cities,
    filteredGardens,
    getGardenById,
    setCity,
  }
})
