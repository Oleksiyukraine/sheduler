
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/Home.vue'),
        meta: { auth: true }
      }
    ]
  },
  {
    path: '/board/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        name: 'board',
        component: () => import('pages/Board.vue'),
        meta: { auth: true }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/Auth/Login.vue'),
        meta: { auth: false }
      }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('pages/Auth/Registration.vue'),
        meta: { auth: false }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
