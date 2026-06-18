<template>
  <q-page v-if="element" class="q-pa-md">
    <div class="detail-hero q-mb-lg">
      <q-img
        :src="element.image"
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
          <div class="row items-center no-wrap">
            <div class="text-h4 text-white">{{ element.name }}</div>
            <q-btn
              :icon="isFavorited ? 'favorite' : 'favorite_border'"
              :color="isFavorited ? 'red' : 'white'"
              round
              dense
              size="md"
              class="q-ml-sm detail-hero__favorite-btn"
              @click="onToggleFavorite"
            />
          </div>
          <q-chip dense color="white" text-color="primary" class="q-mt-xs">
            {{ element.category }}
          </q-chip>
        </div>
      </q-img>
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle1 text-primary q-mb-sm">简要说明</div>
        <div class="text-body1 text-grey-9">{{ element.desc }}</div>
      </q-card-section>
    </q-card>

    <div class="text-subtitle1 text-primary q-mb-sm">详细说明</div>
    <q-list bordered separator class="rounded-borders">
      <q-expansion-item
        v-for="(section, index) in element.sections"
        :key="section.title"
        expand-separator
        :icon="sectionIcons[index % sectionIcons.length]"
        :label="section.title"
        :caption="index === 0 ? '点击展开阅读' : undefined"
        header-class="text-weight-medium"
        :default-opened="index === 0"
      >
        <q-card flat>
          <q-card-section class="text-body1 text-grey-9">
            {{ section.content }}
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div class="q-mt-lg">
      <q-btn
        outline
        color="primary"
        icon="arrow_back"
        label="返回列表"
        @click="router.push({ name: 'element-list' })"
      />
    </div>
  </q-page>

  <q-page v-else class="flex flex-center">
    <div class="text-center text-grey-7">
      <q-icon name="error_outline" size="64px" class="q-mb-md" />
      <div class="text-h6 q-mb-md">未找到该造园要素</div>
      <q-btn
        color="primary"
        label="返回列表"
        @click="router.push({ name: 'element-list' })"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGardenStore } from '@/stores/garden'
import { useFavoriteStore } from '@/stores/favorite'

const route = useRoute()
const router = useRouter()
const gardenStore = useGardenStore()
const favoriteStore = useFavoriteStore()

/** 折叠面板图标 */
const sectionIcons = ['menu_book', 'landscape', 'architecture']

/** 当前要素详情 */
const element = computed(() =>
  gardenStore.getElementById(route.params.id as string)
)

const isFavorited = computed(() =>
  element.value ? favoriteStore.isFavorite(element.value.id) : false
)

function onToggleFavorite(): void {
  if (element.value) {
    favoriteStore.toggleFavorite(element.value.id)
  }
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

  &__favorite-btn {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}
</style>
