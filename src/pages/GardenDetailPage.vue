<template>
  <q-page v-if="garden" class="q-pa-md">
    <div class="detail-hero q-mb-lg">
      <q-img
        :src="garden.image"
        :ratio="21 / 9"
        class="rounded-borders detail-hero__img"
      >
        <template #loading>
          <div class="absolute-full flex flex-center bg-grey-3">
            <q-spinner color="primary" size="40px" />
          </div>
        </template>
        <template #error>
          <div class="absolute-full flex flex-center bg-grey-2 text-grey-7">
            <div class="text-center">
              <q-icon name="image" size="64px" />
              <div class="q-mt-sm">示意图占位</div>
            </div>
          </div>
        </template>
        <div class="absolute-bottom detail-hero__overlay q-pa-md">
          <div class="text-h4 text-white">{{ garden.name }}</div>
          <q-chip dense color="white" text-color="primary" class="q-mt-xs">
            {{ garden.city }}
          </q-chip>
        </div>
      </q-img>
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle1 text-primary q-mb-sm">名园简介</div>
        <div class="text-body1 text-grey-9">{{ garden.description }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle1 text-primary q-mb-sm">所用造园手法</div>
        <div class="text-body2 text-grey-7 q-mb-sm">
          点击下方手法名称，可查看该造园手法的详细说明
        </div>
        <div class="technique-tags">
          <q-chip
            v-for="technique in techniques"
            :key="technique.id"
            clickable
            color="primary"
            text-color="white"
            class="q-mr-sm q-mb-sm"
            @click="goTechniqueDetail(technique.id)"
          >
            {{ technique.name }}
            <q-icon right name="chevron_right" size="14px" />
          </q-chip>
        </div>
      </q-card-section>
    </q-card>

    <div class="text-subtitle1 text-primary q-mb-sm">名园示意图</div>
    <q-card flat bordered class="q-mb-lg">
      <q-img
        :src="garden.image"
        :ratio="16 / 9"
        class="rounded-borders"
      >
        <template #loading>
          <div class="absolute-full flex flex-center bg-grey-3">
            <q-spinner color="primary" size="40px" />
          </div>
        </template>
        <template #error>
          <div class="absolute-full flex flex-center bg-grey-2 text-grey-7">
            <div class="text-center">
              <q-icon name="image" size="64px" />
              <div class="q-mt-sm">示意图占位</div>
            </div>
          </div>
        </template>
      </q-img>
    </q-card>

    <div class="q-mt-lg">
      <q-btn
        outline
        color="primary"
        icon="arrow_back"
        label="返回列表"
        @click="router.push({ name: 'garden-list' })"
      />
    </div>
  </q-page>

  <q-page v-else class="flex flex-center">
    <div class="text-center text-grey-7">
      <q-icon name="error_outline" size="64px" class="q-mb-md" />
      <div class="text-h6 q-mb-md">未找到该名园</div>
      <q-btn
        color="primary"
        label="返回列表"
        @click="router.push({ name: 'garden-list' })"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamousGardenStore } from '@/stores/famousGarden'
import { useGardenStore } from '@/stores/garden'
import type { GardenElement } from '@/types/garden'

const route = useRoute()
const router = useRouter()
const famousGardenStore = useFamousGardenStore()
const gardenStore = useGardenStore()

/** 当前名园详情 */
const garden = computed(() =>
  famousGardenStore.getGardenById(route.params.id as string)
)

/** 名园所用造园手法详情列表 */
const techniques = computed<GardenElement[]>(() => {
  if (!garden.value) return []
  return garden.value.techniqueIds
    .map((id) => gardenStore.getElementById(id))
    .filter((t): t is GardenElement => t !== undefined)
})

/**
 * 跳转至造园手法详情页
 * @param id - 造园手法 id
 */
function goTechniqueDetail(id: string): void {
  router.push({ name: 'element-detail', params: { id } })
}
</script>

<style scoped lang="scss">
.detail-hero {
  &__img {
    background: #e8f0ec;
    overflow: hidden;
  }

  &__overlay {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  }
}

.technique-tags {
  display: flex;
  flex-wrap: wrap;
}
</style>
