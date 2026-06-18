<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-primary q-mb-xs">分类概览</div>
      <div class="text-body2 text-grey-7">
        按造园手法分类纵览四大要素体系
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div
        v-for="stat in categoryStats"
        :key="stat.category"
        class="col-12 col-sm-6"
      >
        <q-card
          flat
          bordered
          class="category-card cursor-pointer"
          @click="goList(stat.category)"
        >
          <q-card-section>
            <div class="row items-center no-wrap q-mb-sm">
              <div class="text-h6 text-primary">{{ stat.category }}</div>
              <q-space />
              <q-chip dense color="primary" text-color="white" size="sm">
                {{ stat.count }} 项
              </q-chip>
            </div>
            <div class="text-body2 text-grey-7 q-mb-md">
              {{ stat.summary }}
            </div>
            <div class="text-caption text-grey-6 q-mb-xs">代表要素</div>
            <div class="row q-gutter-xs">
              <q-chip
                v-for="el in stat.topElements"
                :key="el.id"
                clickable
                dense
                outline
                color="secondary"
                text-color="secondary"
                size="sm"
                @click.stop="goDetail(el.id)"
              >
                {{ el.name }}
              </q-chip>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              color="primary"
              label="查看全部"
              icon-right="chevron_right"
              size="sm"
              @click.stop="goList(stat.category)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useGardenStore } from '@/stores/garden'

const router = useRouter()
const gardenStore = useGardenStore()
const { categoryStats } = storeToRefs(gardenStore)

function goList(category: string): void {
  gardenStore.setCategory(category)
  router.push({ name: 'element-list', query: { category } })
}

function goDetail(id: string): void {
  router.push({ name: 'element-detail', params: { id } })
}
</script>

<style scoped lang="scss">
.page-header {
  border-left: 4px solid var(--q-primary);
  padding-left: 12px;
}

.category-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(46, 125, 111, 0.18);
    transform: translateY(-2px);
  }
}
</style>
