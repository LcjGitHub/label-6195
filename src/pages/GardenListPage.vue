<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-primary q-mb-xs">江南名园一览</div>
      <div class="text-body2 text-grey-7">
        拙政园、留园、网师园……探索江南古典名园的造园艺术典范
      </div>
    </div>

    <div class="q-mb-md">
      <div class="text-subtitle2 text-grey-8 q-mb-sm">城市筛选</div>
      <q-btn-toggle
        v-model="city"
        spread
        no-caps
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="cityOptions"
        class="category-toggle"
        @update:model-value="onCityChange"
      />
    </div>

    <div v-if="filteredGardens.length" class="row q-col-gutter-md">
      <div
        v-for="garden in filteredGardens"
        :key="garden.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card
          flat
          bordered
          class="garden-card cursor-pointer"
          @click="goDetail(garden.id)"
        >
          <q-img
            :src="garden.image"
            :ratio="16 / 9"
            class="garden-card__img"
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

          <q-card-section>
            <div class="row items-center no-wrap q-mb-xs">
              <div class="text-h6 text-primary">{{ garden.name }}</div>
              <q-space />
              <q-chip dense color="secondary" text-color="white" size="sm">
                {{ garden.city }}
              </q-chip>
            </div>
            <div class="text-body2 text-grey-8 ellipsis-2-lines">
              {{ garden.description }}
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              color="primary"
              label="查看详情"
              icon-right="chevron_right"
              @click.stop="goDetail(garden.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else class="flex flex-center q-pa-xl text-grey-6">
      <div class="text-center">
        <q-icon name="search_off" size="64px" class="q-mb-md" />
        <div class="text-h6">暂无该城市下的名园</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useFamousGardenStore } from '@/stores/famousGarden'

const router = useRouter()
const famousGardenStore = useFamousGardenStore()
const { filteredGardens, cities, selectedCity } = storeToRefs(famousGardenStore)

const city = ref(selectedCity.value)

/** 城市按钮选项 */
const cityOptions = computed(() =>
  cities.value.map((c) => ({ label: c, value: c }))
)

watch(selectedCity, (val) => {
  city.value = val
})

/**
 * 切换城市筛选
 * @param value - 选中的城市
 */
function onCityChange(value: string): void {
  famousGardenStore.setCity(value)
}

/**
 * 跳转至名园详情页
 * @param id - 名园 id
 */
function goDetail(id: string): void {
  router.push({ name: 'garden-detail', params: { id } })
}
</script>

<style scoped lang="scss">
.page-header {
  border-left: 4px solid var(--q-primary);
  padding-left: 12px;
}

.category-toggle {
  border: 1px solid rgba(46, 125, 111, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.garden-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(46, 125, 111, 0.18);
    transform: translateY(-2px);
  }

  &__img {
    background: #e8f0ec;
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
