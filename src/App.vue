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
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/** 详情页显示返回按钮 */
const showBack = computed(() => route.name === 'element-detail')
</script>
