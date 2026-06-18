import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'garden-favorites'

export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteIds = ref<string[]>(loadFromStorage())

  function loadFromStorage(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value))
  }

  watch(favoriteIds, saveToStorage, { deep: true })

  function isFavorite(id: string): boolean {
    return favoriteIds.value.includes(id)
  }

  function toggleFavorite(id: string): void {
    const index = favoriteIds.value.indexOf(id)
    if (index === -1) {
      favoriteIds.value.push(id)
    } else {
      favoriteIds.value.splice(index, 1)
    }
  }

  function addFavorite(id: string): void {
    if (!isFavorite(id)) {
      favoriteIds.value.push(id)
    }
  }

  function removeFavorite(id: string): void {
    const index = favoriteIds.value.indexOf(id)
    if (index !== -1) {
      favoriteIds.value.splice(index, 1)
    }
  }

  function clearFavorites(): void {
    favoriteIds.value = []
  }

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
  }
})
