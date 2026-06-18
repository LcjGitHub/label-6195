import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useGardenStore } from '@/stores/garden'
import type { CompareSlot, GardenElement, CompareTableRow } from '@/types/garden'

export const useCompareStore = defineStore('compare', () => {
  const leftId = ref<string | null>(null)
  const rightId = ref<string | null>(null)

  const gardenStore = useGardenStore()

  const leftElement = computed<GardenElement | undefined>(() =>
    leftId.value ? gardenStore.getElementById(leftId.value) : undefined
  )

  const rightElement = computed<GardenElement | undefined>(() =>
    rightId.value ? gardenStore.getElementById(rightId.value) : undefined
  )

  const canCompare = computed(() => leftId.value !== null && rightId.value !== null)

  const compareTableRows = computed<CompareTableRow[]>(() => {
    if (!leftElement.value || !rightElement.value) return []

    const leftSections = leftElement.value.sections
    const rightSections = rightElement.value.sections

    const allTitles = new Set<string>()
    leftSections.forEach((s) => allTitles.add(s.title))
    rightSections.forEach((s) => allTitles.add(s.title))

    const rows: CompareTableRow[] = []

    leftSections.forEach((section) => {
      const rightSection = rightSections.find((s) => s.title === section.title)
      rows.push({
        title: section.title,
        leftContent: section.content,
        rightContent: rightSection?.content ?? null,
      })
    })

    rightSections.forEach((section) => {
      if (!leftSections.find((s) => s.title === section.title)) {
        rows.push({
          title: section.title,
          leftContent: null,
          rightContent: section.content,
        })
      }
    })

    return rows
  })

  function setElement(slot: CompareSlot, id: string | null): void {
    if (slot === 'left') {
      leftId.value = id
    } else {
      rightId.value = id
    }
  }

  function clearSelection(): void {
    leftId.value = null
    rightId.value = null
  }

  function swapElements(): void {
    const temp = leftId.value
    leftId.value = rightId.value
    rightId.value = temp
  }

  function isSelected(id: string): boolean {
    return leftId.value === id || rightId.value === id
  }

  function getSlotById(id: string): CompareSlot | null {
    if (leftId.value === id) return 'left'
    if (rightId.value === id) return 'right'
    return null
  }

  return {
    leftId,
    rightId,
    leftElement,
    rightElement,
    canCompare,
    compareTableRows,
    setElement,
    clearSelection,
    swapElements,
    isSelected,
    getSlotById,
  }
})
