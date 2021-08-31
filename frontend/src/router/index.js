import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About.vue'
import User from '../views/User.vue'


Vue.use(VueRouter)
const routes = [
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    meta: {
      isAuth: true
    },

  },
  {
    path: '/register',
    component: () => import('../components/register/register.vue'),
  },
  // {
  //   path: '/user',
  //   component: () => import('../views/User.vue'),
  // },
  {
    path: '/about',
    component: About,
    // redirect: "/about/user",
    children: [
      {
        path: '/user',
        name: 'user',
        component: User,
      },
      {
        path: '/right',
        component: () => import('../components/power/Right.vue'),
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles.vue'),
      },
    ]
  },


  {
    path: '/login',
    component: () => import('../components/login/login.vue'),
  },
  {
    path: '/',
    component: () => import('../components/login/login.vue'),
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})



router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (to.path === '/register') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    alert("非法访问！！请先登录或者注册之后再访问")
    return next('/login')
  }
  next()
})

export default router