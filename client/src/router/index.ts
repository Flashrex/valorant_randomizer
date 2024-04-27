import { createRouter, createWebHistory } from "vue-router";

import Agentview from "@/views/Agentview.vue";
import MapView from "@/views/MapView.vue";
import StrategyView from "@/views/StrategyView.vue";
import SettingsView from "@/views/SettingsView.vue";
import AboutView from "@/views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/agent",
    },
    {
      path: "/agent",
      name: "agent",
      component: Agentview,
    },
    {
      path: "/map",
      name: "map",
      component: MapView,
    },
    {
      path: "/strategy",
      name: "strategy",
      component: StrategyView,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
  ],
});

export default router;
