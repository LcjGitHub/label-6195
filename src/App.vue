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

const route = useRoute()
const router = useRouter()

/** 详情页显示返回按钮 */
const showBack = computed(() => route.name === 'element-detail' || route.name === 'garden-detail')

/** 当前激活的标签页 */
const activeTab = ref(
  route.name === 'garden-list' || route.name === 'garden-detail'
    ? 'gardens'
    : route.name === 'quiz'
    ? 'quiz'
    : 'elements'
)

/** 监听路由变化，同步更新标签高亮 */
watch(
  () => route.name,
  (name) => {
    if (name === 'garden-list' || name === 'garden-detail') {
      activeTab.value = 'gardens'
    } else if (name === 'quiz') {
      activeTab.value = 'quiz'
    } else {
      activeTab.value = 'elements'
    }
  }
)

/** 标签页选项 */
const tabOptions = [
  { label: '造园要素', value: 'elements' },
  { label: '江南名园', value: 'gardens' },
  { label: '知识测验', value: 'quiz' },
]

/**
 * 切换标签页
 * @param value - 选中的标签页
 */
function onTabChange(value: string): void {
  if (value === 'elements') {
    router.push({ name: 'element-list' })
  } else if (value === 'gardens') {
    router.push({ name: 'garden-list' })
  } else if (value === 'quiz') {
    router.push({ name: 'quiz' })
  }
}
</script>
