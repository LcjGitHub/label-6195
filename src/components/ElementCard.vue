<template>
  <q-card
    flat
    bordered
    class="element-card cursor-pointer"
    @click="goDetail"
  >
    <q-img
      :src="element.image"
      :ratio="16 / 9"
      class="element-card__img"
    >
      <template #loading>
        <div class="absolute-full flex flex-center bg-grey-3">
          <q-spinner color="primary" size="32px" />
        </div>
      </template>
      <template #error>
        <div class="absolute-full flex flex-center bg-grey-2 text-grey-7">
          <q-icon name="image" size="48px" />
        </div>
      </template>
    </q-img>

    <q-btn
      :icon="isFavorited ? 'favorite' : 'favorite_border'"
      :color="isFavorited ? 'red' : 'white'"
      round
      dense
      size="sm"
      class="element-card__favorite-btn"
      @click.stop="onToggleFavorite"
    />

    <q-card-section>
      <div class="row items-center no-wrap q-mb-xs">
        <div class="text-h6 text-primary">{{ element.name }}</div>
        <q-space />
        <q-chip dense color="secondary" text-color="white" size="sm">
          {{ element.category }}
        </q-chip>
      </div>
      <div class="text-body2 text-grey-8 ellipsis-2-lines">
        {{ element.desc }}
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat color="primary" label="查看详情" icon-right="chevron_right" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { GardenElement } from '@/types/garden'
import { useFavoriteStore } from '@/stores/favorite'

const props = defineProps<{
  element: GardenElement
}>()

const router = useRouter()
const favoriteStore = useFavoriteStore()

const isFavorited = computed(() => favoriteStore.isFavorite(props.element.id))

function onToggleFavorite(): void {
  favoriteStore.toggleFavorite(props.element.id)
}

/** 跳转至要素详情页 */
function goDetail(): void {
  router.push({ name: 'element-detail', params: { id: props.element.id } })
}
</script>

<style scoped lang="scss">
.element-card {
  position: relative;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(46, 125, 111, 0.18);
    transform: translateY(-2px);
  }

  &__img {
    background: #e8f0ec;
  }

  &__favorite-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
