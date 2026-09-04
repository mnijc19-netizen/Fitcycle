<template>
  <div
    :data-skin="store.settings.uiSkin"
    :data-theme="store.settings.themeMode || 'dark'"
    :data-mode="store.settings.themeMode || 'dark'"
    class="min-h-[100dvh] bg-[var(--fc-bg)] text-[var(--fc-text-primary)] flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-300"
  >
    <!-- Sticky Top Navbar -->

    <Navbar />

    <!-- Main Dynamic Content Views -->
    <main class="flex-1 w-full max-w-md mx-auto relative pt-1">
      <TodayView v-show="store.activeTab === 'today'" />
      <CycleView v-show="store.activeTab === 'cycle'" />
      <CalendarView v-show="store.activeTab === 'calendar'" />
      <ExercisesView v-show="store.activeTab === 'exercises'" />
      <StatsView v-show="store.activeTab === 'stats'" />
    </main>


    <!-- Floating Rest Timer Overlay -->
    <RestTimerFloat />

    <!-- Session-only mobile AI assistant; existing views stay mounted behind it. -->
    <AIAssistantDrawer />

    <!-- First-Time User Guided Onboarding Tour Modal -->
    <UserOnboardingModal
      :visible="!store.settings.hasSeenOnboarding"
      @close="store.settings.hasSeenOnboarding = true"
    />

    <!-- Full-Screen Cinematic Skin Game-Entry Splash Transition -->
    <SkinSplashTransition />

    <!-- Fixed Bottom Mobile Navigation Bar -->
    <TabBar />
  </div>
</template>

<script setup>
import { store } from "./store/fitnessStore.js";
import Navbar from "./components/Navbar.vue";
import TabBar from "./components/TabBar.vue";
import RestTimerFloat from "./components/RestTimerFloat.vue";
import AIAssistantDrawer from "./components/AIAssistantDrawer.vue";
import UserOnboardingModal from "./components/UserOnboardingModal.vue";
import SkinSplashTransition from "./components/SkinSplashTransition.vue";

import TodayView from "./views/TodayView.vue";
import CycleView from "./views/CycleView.vue";
import CalendarView from "./views/CalendarView.vue";
import ExercisesView from "./views/ExercisesView.vue";
import StatsView from "./views/StatsView.vue";
</script>

