import Vue from "vue";
import VueRouter from "vue-router";

import Login from "../views/Login";
import Home from "../views/Home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "login",
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/home",
    name: "home",
    component: Home
  }
];


const router = new VueRouter({
  routes
});

//全局路由守卫,确认是否已登录
router.beforeEach((to, from, next)=>{
  const token = window.sessionStorage.getItem('token');

  if (to.path === '/login') {
    return next();
  };
  if (!token) {
    return next('/login')
  } else {
    next();
  }
  
});





export default router;
