<template>
  <div :data-skin="store.settings.uiSkin" class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-200">
    <!-- Sticky Top Navbar -->

    <Navbar />

    <!-- Main Dynamic Content Views -->
    <main class="flex-1 w-full max-w-md mx-auto relative pt-2">
      <TodayView v-show="store.activeTab === 'today'" />
      <CycleView v-show="store.activeTab === 'cycle'" />
      <CalendarView v-show="store.activeTab === 'calendar'" />
      <ExercisesView v-show="store.activeTab === 'exercises'" />
      <StatsView v-show="store.activeTab === 'stats'" />
    </main>

    <!-- Floating Rest Timer Overlay -->
    <RestTimerFloat />

    <!-- Fixed Bottom Mobile Navigation Bar -->
    <TabBar />
  </div>
</template>

<script setup>
import { store } from "./store/fitnessStore.js";
import Navbar from "./components/Navbar.vue";
import TabBar from "./components/TabBar.vue";
import RestTimerFloat from "./components/RestTimerFloat.vue";

import TodayView from "./views/TodayView.vue";
import CycleView from "./views/CycleView.vue";
import CalendarView from "./views/CalendarView.vue";
import ExercisesView from "./views/ExercisesView.vue";
import StatsView from "./views/StatsView.vue";
</script>

