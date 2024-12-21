<template>
  <div class="flex flex-col min-h-screen bg-fitness-background">
    <Header />
    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 p-6">
        <h1 class="text-2xl font-bold text-fitness-text mb-6">
          Scheduling
        </h1>
        <ScheduleHeader />
        <ScheduleGrid />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import ScheduleHeader from '@/components/schedule/ScheduleHeader.vue'
import ScheduleGrid from '@/components/schedule/ScheduleGrid.vue'
</script>