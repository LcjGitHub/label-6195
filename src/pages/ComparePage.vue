<template>
  <q-page class="q-pa-md">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-primary q-mb-xs">造园要素对照学习</div>
      <div class="text-body2 text-grey-7">
        并列对比两项造园手法，深入理解其异同与应用场景
      </div>
    </div>

    <template v-if="showResult && leftElement && rightElement">
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6">
          <div class="element-panel left-panel">
            <div class="panel-header q-mb-sm">
              <q-chip dense color="primary" text-color="white" size="sm">
                左侧
              </q-chip>
            </div>
            <q-img :src="leftElement.image" :ratio="16 / 9" class="panel-img" />
            <div class="q-pa-sm">
              <div class="row items-center q-mb-xs">
                <div class="text-h5 text-primary q-mr-sm">{{ leftElement.name }}</div>
                <q-chip dense color="secondary" text-color="white" size="sm">
                  {{ leftElement.category }}
                </q-chip>
              </div>
              <div class="text-body2 text-grey-8">
                {{ leftElement.desc }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6">
          <div class="element-panel right-panel">
            <div class="panel-header q-mb-sm">
              <q-chip dense color="primary" text-color="white" size="sm">
                右侧
              </q-chip>
            </div>
            <q-img :src="rightElement.image" :ratio="16 / 9" class="panel-img" />
            <div class="q-pa-sm">
              <div class="row items-center q-mb-xs">
                <div class="text-h5 text-primary q-mr-sm">{{ rightElement.name }}</div>
                <q-chip dense color="secondary" text-color="white" size="sm">
                  {{ rightElement.category }}
                </q-chip>
              </div>
              <div class="text-body2 text-grey-8">
                {{ rightElement.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-center q-gutter-md q-mb-lg">
        <q-btn
          label="交换位置"
          icon="swap_horiz"
          color="primary"
          outline
          @click="onSwap"
        />
        <q-btn
          label="重新选择"
          icon="refresh"
          color="primary"
          outline
          @click="onReSelect"
        />
        <q-btn
          label="返回列表"
          icon="arrow_back"
          color="grey"
          text-color="primary"
          @click="onBack"
        />
      </div>

      <div class="compare-table-container">
        <div class="text-subtitle1 text-primary q-mb-md">详细说明对比</div>
        <q-table
          :rows="compareTableRows"
          :columns="columns"
          row-key="title"
          hide-bottom
          dense
          class="compare-table"
          wrap-cells
        >
          <template #header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="table-header-cell"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template #body-cell-title="props">
            <q-td :props="props" class="title-cell">
              <div class="text-subtitle2 text-primary break-words">
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template #body-cell-leftContent="props">
            <q-td :props="props" class="content-cell left-content">
              <template v-if="props.value">
                <div class="text-body2 text-grey-8 content-text break-words">
                  {{ props.value }}
                </div>
              </template>
              <template v-else>
                <div class="text-body2 text-grey-4 italic">
                  — 无此项说明 —
                </div>
              </template>
            </q-td>
          </template>

          <template #body-cell-rightContent="props">
            <q-td :props="props" class="content-cell right-content">
              <template v-if="props.value">
                <div class="text-body2 text-grey-8 content-text break-words">
                  {{ props.value }}
                </div>
              </template>
              <template v-else>
                <div class="text-body2 text-grey-4 italic">
                  — 无此项说明 —
                </div>
              </template>
            </q-td>
          </template>
        </q-table>
      </div>
    </template>

    <template v-else>
      <div class="empty-state">
        <CompareSelector @start-compare="onStartCompare" />
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCompareStore } from '@/stores/compare'
import CompareSelector from '@/components/CompareSelector.vue'

const compareStore = useCompareStore()
const router = useRouter()

const showResult = ref(false)

const {
  leftElement,
  rightElement,
  compareTableRows,
} = storeToRefs(compareStore)

const columns = computed(() => [
  {
    name: 'title',
    label: '说明段落',
    field: 'title',
    align: 'left' as const,
    style: 'width: 18%; min-width: 100px',
  },
  {
    name: 'leftContent',
    label: leftElement.value?.name ?? '左侧',
    field: 'leftContent',
    align: 'left' as const,
    style: 'width: 41%; min-width: 200px',
  },
  {
    name: 'rightContent',
    label: rightElement.value?.name ?? '右侧',
    field: 'rightContent',
    align: 'left' as const,
    style: 'width: 41%; min-width: 200px',
  },
])

function onStartCompare(): void {
  showResult.value = true
}

function onSwap(): void {
  compareStore.swapElements()
}

function onReSelect(): void {
  showResult.value = false
}

function onBack(): void {
  router.push({ name: 'element-list' })
}
</script>

<style scoped lang="scss">
.page-header {
  border-left: 4px solid var(--q-primary);
  padding-left: 12px;
}

.element-panel {
  border: 2px solid rgba(46, 125, 111, 0.3);
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(46, 125, 111, 0.15);
  }

  &.left-panel {
    border-color: rgba(46, 125, 111, 0.4);
  }

  &.right-panel {
    border-color: rgba(46, 125, 111, 0.4);
  }
}

.panel-header {
  padding: 8px 12px 0;
}

.panel-img {
  background: #e8f0ec;
}

.compare-table-container {
  background: white;
  border: 1px solid rgba(46, 125, 111, 0.2);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.compare-table {
  :deep(.q-table) {
    border-radius: 8px;
    table-layout: fixed;
    width: 100%;
  }

  :deep(.table-header-cell) {
    background: rgba(46, 125, 111, 0.1);
    font-weight: 600;
    color: #2e7d6f;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  :deep(.title-cell) {
    background: rgba(46, 125, 111, 0.05);
    border-right: 1px solid rgba(46, 125, 111, 0.15);
    vertical-align: top;
  }

  :deep(.content-cell) {
    vertical-align: top;
    padding: 12px;
    border-right: 1px solid rgba(46, 125, 111, 0.1);
    word-break: break-word;
    overflow-wrap: break-word;

    &.left-content {
      background: rgba(46, 125, 111, 0.02);
    }

    &.right-content {
      background: rgba(46, 125, 111, 0.02);
      border-right: none;
    }
  }

  :deep(.content-text) {
    line-height: 1.7;
    white-space: normal;
  }

  :deep(tr:hover td) {
    background: rgba(46, 125, 111, 0.06) !important;
  }

  :deep(td),
  :deep(th) {
    word-break: break-word;
    overflow-wrap: break-word;
  }
}

.break-words {
  word-break: break-word;
  overflow-wrap: break-word;
}

.empty-state {
  margin-top: 16px;
}
</style>
