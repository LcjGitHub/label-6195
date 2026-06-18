<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          v-if="showBack"
          flat
          round
          dense
          icon="arrow_back"
          aria-label="返回"
          @click="router.back()"
        />
        <q-toolbar-title class="text-weight-medium">
          江南园林造园要素
        </q-toolbar-title>
        <q-btn-toggle
          v-model="activeTab"
          :options="tabOptions"
          no-caps
          toggle-color="white"
          text-color="white"
          flat
          @update:model-value="onTabChange"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGardenStore } from '@/stores/garden'

const route = useRoute()
const router = useRouter()
const gardenStore = useGardenStore()

/** 详情页显示返回按钮 */
const showBack = computed(() => route.name === 'element-detail' || route.name === 'garden-detail')

/** 当前激活的标签页 */
const activeTab = ref(
  route.name === 'garden-list' || route.name === 'garden-detail'
    ? 'gardens'
    : route.name === 'quiz'
    ? 'quiz'
    : route.name === 'category-overview'
    ? 'categories'
    : 'elements'
)

watch(
  () => route.name,
  (name) => {
    if (name === 'garden-list' || name === 'garden-detail') {
      activeTab.value = 'gardens'
    } else if (name === 'quiz') {
      activeTab.value = 'quiz'
    } else if (name === 'category-overview') {
      activeTab.value = 'categories'
    } else {
      activeTab.value = 'elements'
    }
  }
)

const tabOptions = [
  { label: '造园要素', value: 'elements' },
  { label: '分类概览', value: 'categories' },
  { label: '江南名园', value: 'gardens' },
  { label: '知识测验', value: 'quiz' },
]

function onTabChange(value: string): void {
  if (value === 'elements') {
    gardenStore.resetFilters()
    router.push({ name: 'element-list', query: {} })
  } else if (value === 'categories') {
    router.push({ name: 'category-overview' })
  } else if (value === 'gardens') {
    router.push({ name: 'garden-list' })
  } else if (value === 'quiz') {
    router.push({ name: 'quiz' })
  }
}
</script>
