<template>
  <div v-if="items.length" class="related-elements q-mt-lg">
    <div class="text-subtitle1 text-primary q-mb-sm">相关要素推荐</div>
    <div class="related-elements__scroll no-wrap" role="list">
      <div
        v-for="item in items"
        :key="item.id"
        role="listitem"
        class="related-elements__item"
      >
        <div
          tabindex="0"
          role="link"
          :aria-label="`查看${item.name}详情，${item.desc}`"
          class="related-elements__card cursor-pointer"
          @click="goDetail(item.id)"
          @keydown.enter="goDetail(item.id)"
          @keydown.space.prevent="goDetail(item.id)"
        >
          <div class="text-subtitle2 text-primary ellipsis">{{ item.name }}</div>
          <div class="text-caption text-grey-7 ellipsis-2-lines q-mt-xs">
            {{ item.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RelatedElementItem } from '@/types/garden'

defineProps<{
  items: RelatedElementItem[]
}>()

const router = useRouter()

function goDetail(id: string): void {
  router.push({ name: 'element-detail', params: { id } })
}
</script>

<style scoped lang="scss">
.related-elements {
  &__scroll {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  &__item {
    flex: 0 0 auto;
  }

  &__card {
    min-width: 180px;
    max-width: 220px;
    padding: 12px;
    border: 1px solid var(--q-color-grey-3);
    border-radius: 8px;
    background: #fff;
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover,
    &:focus-visible {
      box-shadow: 0 4px 16px rgba(46, 125, 111, 0.18);
      transform: translateY(-2px);
      outline: 2px solid var(--q-color-primary);
      outline-offset: 2px;
    }
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
