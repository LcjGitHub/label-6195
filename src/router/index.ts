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
  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · 江南园林造园要素` : '江南园林造园要素'
})

export default router
