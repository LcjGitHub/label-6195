<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <div class="row items-start no-wrap">
        <div>
          <div class="text-h5 text-primary q-mb-xs">我的收藏</div>
          <div class="text-body2 text-grey-7">
            已收藏 {{ favoriteElements.length }} 个造园要素
          </div>
        </div>
        <q-space />
        <div v-if="favoriteElements.length" class="row q-gutter-sm">
          <q-btn
            label="清空收藏"
            icon="delete_sweep"
            outline
            color="negative"
            @click="onClearFavorites"
          />
        </div>
      </div>
    </div>

    <div v-if="favoriteElements.length" class="row q-col-gutter-md">
      <div
        v-for="element in favoriteElements"
        :key="element.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <ElementCard :element="element" />
      </div>
    </div>

    <div v-else class="flex flex-center q-pa-xl text-grey-6">
      <div class="text-center">
        <q-icon name="favorite_border" size="64px" class="q-mb-md" />
        <div class="text-h6 q-mb-sm">暂无收藏</div>
        <div class="text-body2 q-mb-md">点击要素卡片或详情页的心形按钮收藏喜欢的造园要素</div>
        <q-btn
          label="去浏览要素"
          color="primary"
          @click="router.push({ name: 'element-list' })"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import ElementCard from '@/components/ElementCard.vue'
import { useGardenStore } from '@/stores/garden'
import { useFavoriteStore } from '@/stores/favorite'

const router = useRouter()
const gardenStore = useGardenStore()
const favoriteStore = useFavoriteStore()
const { favoriteIds } = storeToRefs(favoriteStore)

const favoriteElements = computed(() =>
  favoriteIds.value
    .map((id) => gardenStore.getElementById(id))
    .filter((el) => el !== undefined)
)

function onClearFavorites(): void {
  favoriteStore.clearFavorites()
}
</script>

<style scoped lang="scss">
.page-header {
  border-left: 4px solid var(--q-primary);
  padding-left: 12px;
}
</style>
