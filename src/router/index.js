import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About.vue'
import User from '../views/User.vue'
import Welcome from '../views/Welcome.vue'


Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    component: () => import('../components/login/login.vue'),
  },
  {
    path: '/',
    component: () => import('../components/login/login.vue'),
  },


  {
    path: '/success',
    component: About,
    meta: {
      isAuth: true
    },

  },
  {
    path: '/register',
    component: () => import('../components/register/register.vue'),
  },
  

  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    redirect: '/Welcome',
    // redirect: "/about/user",
    children: [
      { path: '/home', component: Welcome },
      {
        path: '/users',
        name: 'user',
        component: User,
      },
      {
        path: '/rights',
        component: () => import('../components/power/Right.vue'),
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles.vue'),
      },
      {
        path: '/categories',
        component: () => import('../components/goods/Cate.vue'),
      },
      {
        path: '/params',
        component: () => import('../components/goods/Params.vue'),
      },
      {
        path: '/goods',
        component: () => import('../components/goods/List.vue'),
      },
      {
        path: '/add.do',
        component: () => import('../components/goods/Add.vue'),
      },{
        path: '/orders',
        component: () => import('../components/order/Order.vue'),
      },
    ]
  },

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