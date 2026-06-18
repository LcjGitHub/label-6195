import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'element-list',
      component: () => import('@/pages/ElementListPage.vue'),
      meta: { title: '造园要素列表' },
    },
    {
      path: '/element/:id',
      name: 'element-detail',
      component: () => import('@/pages/ElementDetailPage.vue'),
      meta: { title: '要素详情' },
    },
    {
      path: '/gardens',
      name: 'garden-list',
      component: () => import('@/pages/GardenListPage.vue'),
      meta: { title: '江南名园列表' },
    },
    {
      path: '/garden/:id',
      name: 'garden-detail',
      component: () => import('@/pages/GardenDetailPage.vue'),
      meta: { title: '名园详情' },
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/pages/ComparePage.vue'),
      meta: { title: '要素对照' },
    },
  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · 江南园林造园要素` : '江南园林造园要素'
})

export default router
