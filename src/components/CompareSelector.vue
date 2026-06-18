<template>
  <div class="compare-selector">
    <div class="text-subtitle1 text-primary q-mb-md">选择对照要素</div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6">
        <div class="slot-label q-mb-xs">
          <q-icon name="swap_horiz" size="sm" class="q-mr-xs" />
          <span class="text-subtitle2 text-grey-8">左侧</span>
        </div>
        <q-select
          v-model="leftSelected"
          :options="leftOptions"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          clearable
          label="选择左侧要素"
          filled
          dense
          class="selector-input"
          @update:model-value="onLeftChange"
        >
          <template #option="scope">
            <div class="row items-center no-wrap">
              <q-avatar size="24px" class="q-mr-sm">
                <q-img :src="scope.opt.image" />
              </q-avatar>
              <div>
                <div class="text-body2">{{ scope.opt.name }}</div>
                <div class="text-caption text-grey-6">{{ scope.opt.category }}</div>
              </div>
            </div>
          </template>
        </q-select>
      </div>

      <div class="col-6">
        <div class="slot-label q-mb-xs">
          <q-icon name="swap_horiz" size="sm" class="q-mr-xs" />
          <span class="text-subtitle2 text-grey-8">右侧</span>
        </div>
        <q-select
          v-model="rightSelected"
          :options="rightOptions"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          clearable
          label="选择右侧要素"
          filled
          dense
          class="selector-input"
          @update:model-value="onRightChange"
        >
          <template #option="scope">
            <div class="row items-center no-wrap">
              <q-avatar size="24px" class="q-mr-sm">
                <q-img :src="scope.opt.image" />
              </q-avatar>
              <div>
                <div class="text-body2">{{ scope.opt.name }}</div>
                <div class="text-caption text-grey-6">{{ scope.opt.category }}</div>
              </div>
            </div>
          </template>
        </q-select>
      </div>
    </div>

    <q-alert
      v-if="hasSameSelection"
      class="q-mb-md"
      type="warning"
      icon="warning"
      dense
      bordered
    >
      左右两侧不能选择同一要素，请重新选择
    </q-alert>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-6">
        <div v-if="leftElement" class="preview-card">
          <q-img :src="leftElement.image" :ratio="16 / 9" class="preview-img" />
          <div class="q-pa-sm">
            <div class="row items-center no-wrap q-mb-xs">
              <div class="text-h6 text-primary">{{ leftElement.name }}</div>
              <q-space />
              <q-chip dense color="secondary" text-color="white" size="sm">
                {{ leftElement.category }}
              </q-chip>
            </div>
            <div class="text-body2 text-grey-8 ellipsis-2-lines">
              {{ leftElement.desc }}
            </div>
          </div>
        </div>
        <div v-else class="preview-card empty-preview flex flex-center">
          <div class="text-center text-grey-5">
            <q-icon name="image_not_supported" size="32px" class="q-mb-sm" />
            <div class="text-caption">请选择左侧要素</div>
          </div>
        </div>
      </div>

      <div class="col-6">
        <div v-if="rightElement" class="preview-card">
          <q-img :src="rightElement.image" :ratio="16 / 9" class="preview-img" />
          <div class="q-pa-sm">
            <div class="row items-center no-wrap q-mb-xs">
              <div class="text-h6 text-primary">{{ rightElement.name }}</div>
              <q-space />
              <q-chip dense color="secondary" text-color="white" size="sm">
                {{ rightElement.category }}
              </q-chip>
            </div>
            <div class="text-body2 text-grey-8 ellipsis-2-lines">
              {{ rightElement.desc }}
            </div>
          </div>
        </div>
        <div v-else class="preview-card empty-preview flex flex-center">
          <div class="text-center text-grey-5">
            <q-icon name="image_not_supported" size="32px" class="q-mb-sm" />
            <div class="text-caption">请选择右侧要素</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-center q-gutter-md">
      <q-btn
        label="交换位置"
        icon="swap_horiz"
        :disable="!canCompare"
        color="grey"
        text-color="primary"
        @click="onSwap"
      />
      <q-btn
        label="清除选择"
        icon="clear"
        :disable="!hasSelection"
        color="grey"
        text-color="primary"
        @click="onClear"
      />
      <q-btn
        label="开始对照"
        icon="compare_arrows"
        :disable="!canStartCompare"
        color="primary"
        @click="onCompare"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGardenStore } from '@/stores/garden'
import { useCompareStore } from '@/stores/compare'
import type { GardenElement } from '@/types/garden'

const emit = defineEmits<{
  (e: 'start-compare'): void
}>()

const gardenStore = useGardenStore()
const compareStore = useCompareStore()

const { elements } = storeToRefs(gardenStore)
const { leftId, rightId, canCompare } = storeToRefs(compareStore)

const leftSelected = ref<string | null>(leftId.value)
const rightSelected = ref<string | null>(rightId.value)

watch(leftId, (val) => {
  leftSelected.value = val
})

watch(rightId, (val) => {
  rightSelected.value = val
})

const leftOptions = computed<GardenElement[]>(() =>
  elements.value.filter((el) => el.id !== rightSelected.value)
)

const rightOptions = computed<GardenElement[]>(() =>
  elements.value.filter((el) => el.id !== leftSelected.value)
)

const leftElement = computed(() =>
  leftSelected.value ? gardenStore.getElementById(leftSelected.value) : undefined
)

const rightElement = computed(() =>
  rightSelected.value ? gardenStore.getElementById(rightSelected.value) : undefined
)

const hasSelection = computed(() => leftSelected.value !== null || rightSelected.value !== null)

const hasSameSelection = computed(
  () =>
    leftSelected.value !== null &&
    rightSelected.value !== null &&
    leftSelected.value === rightSelected.value
)

const canStartCompare = computed(() => canCompare.value && !hasSameSelection.value)

watch(leftSelected, (val) => {
  compareStore.setElement('left', val)
})

watch(rightSelected, (val) => {
  compareStore.setElement('right', val)
})

function onLeftChange(): void {
  if (
    leftSelected.value !== null &&
    rightSelected.value !== null &&
    leftSelected.value === rightSelected.value
  ) {
    rightSelected.value = null
    compareStore.setElement('right', null)
  }
}

function onRightChange(): void {
  if (
    leftSelected.value !== null &&
    rightSelected.value !== null &&
    leftSelected.value === rightSelected.value
  ) {
    leftSelected.value = null
    compareStore.setElement('left', null)
  }
}

function onSwap(): void {
  compareStore.swapElements()
}

function onClear(): void {
  compareStore.clearSelection()
}

function onCompare(): void {
  emit('start-compare')
}
</script>

<style scoped lang="scss">
.compare-selector {
  padding: 16px;
  background: #f8faf9;
  border-radius: 8px;
}

.selector-input {
  :deep(.q-field__control-container) {
    padding-top: 6px;
    padding-bottom: 6px;
  }
}

.slot-label {
  display: flex;
  align-items: center;
}

.preview-card {
  border: 1px solid rgba(46, 125, 111, 0.2);
  border-radius: 8px;
  overflow: hidden;
  background: white;
  min-height: 180px;

  &.empty-preview {
    border: 1px dashed rgba(46, 125, 111, 0.3);
    background: #fafafa;
  }
}

.preview-img {
  background: #e8f0ec;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
