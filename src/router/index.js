import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import HomeViewUser from "../views/users/HomeViewUser.vue";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/Login.vue"),
      meta: { requiresAuth: false },
    },
    //homeadmin
    {
      path: "/home",
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          component: () => import("../views/Home.vue"),
        },
        {
          path: "/classmanager",
          component: () => import("../views/ClassManager.vue"),
        },
        {
          path: "/accountmanager",
          name: "homeadmin",
          component: () => import("../views/AccountManager.vue"),
        },
        {
          path: "/studentmanager",
          component: () => import("../views/StudentManager.vue"),
        },
        {
          path: "/listdoan",
          component: () => import("../views/ListDoan.vue"),
        },

        {
          path: "/list/graduation/:id",
          name: "listStudentPass",
          component: () => import("../views/ListStudentPass.vue"),
        },
        {
          path: "/list/internship/:id",
          name: "listStudent",
          component: () => import("../views/ListStudent.vue"),
        },
        {
          path: "/statistic/internship",
          name: "statisticTT",
          component: () => import("../views/StatisticTT.vue"),
        },
        {
          path: "/statistic/graduation",
          name: "statisticDA",
          component: () => import("../views/StatisticDA.vue"),
        },
        {
          path: "/statistic/internship/:id",
          name: "statisticStudentTT",
          component: () => import("../views/StatisticStudentTT.vue"),
        },
        {
          path: "/statistic/graduation/:id",
          name: "statisticStudentDA",
          component: () => import("../views/StatisticStudentDA.vue"),
        },
      ],
    },
    //homeuser
    {
      path: "/homeuser",
      name: "homeuser",
      component: HomeViewUser,
      children: [
        {
          path: "/evaluationtt",
          name: "evaluationtt",
          component: () => import("../views/users/EvaluationTT.vue"),
        },
        {
          path: "/evaluationtt/:id",
          name: "EvaluationStudentTT",
          component: () => import("../views/users/EvaluationStudentTT.vue"),
        },
        {
          path: "/evaluationda",
          name: "evaluationda",
          component: () => import("../views/users/EvaluationDA.vue"),
        },
        {
          path: "/evaluationda/:id",
          name: "EvaluationStudentDA",
          component: () => import("../views/users/EvaluationStudentDA.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (getData(ACCESS_TOKEN, "")) {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
