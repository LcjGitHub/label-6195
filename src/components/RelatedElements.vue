<template>
  <div v-if="items.length" class="related-elements q-mt-lg">
    <div class="text-subtitle1 text-primary q-mb-sm">相关要素推荐</div>
    <div class="row q-col-gutter-sm no-wrap related-elements__scroll">
      <div
        v-for="item in items"
        :key="item.id"
        class="col-4 col-sm-3 col-md-3"
      >
        <q-card
          flat
          bordered
          class="related-elements__card cursor-pointer"
          @click="goDetail(item.id)"
        >
          <q-card-section class="q-pa-sm">
            <div class="text-subtitle2 text-primary ellipsis">{{ item.name }}</div>
            <div class="text-caption text-grey-7 ellipsis-2-lines q-mt-xs">
              {{ item.desc }}
            </div>
          </q-card-section>
        </q-card>
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
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  &__card {
    min-width: 160px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(46, 125, 111, 0.18);
      transform: translateY(-2px);
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
