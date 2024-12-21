<template>
  <header class="flex items-center justify-between px-6 py-4 bg-fitness-card border-b border-fitness-muted">
    <nav class="flex gap-4">
      <button class="px-4 py-2 rounded-md bg-[#15e7fb] text-white">Schedule</button>
      <button class="px-4 py-2 rounded-md hover:bg-fitness-muted text-fitness-text">Hrs/ Payroll</button>
      <button class="px-4 py-2 rounded-md hover:bg-fitness-muted text-fitness-text">Reports</button>
      <router-link 
        to="/settings" 
        class="px-4 py-2 rounded-md hover:bg-fitness-muted text-fitness-text flex items-center gap-2"
      >
        <Settings class="w-4 h-4" />
        Settings
      </router-link>
    </nav>
    <div class="flex items-center gap-6">
      <Sun class="w-5 h-5 text-fitness-text cursor-pointer" />
      <div class="flex items-center gap-4">
        <span class="text-fitness-text">Messages</span>
        <MessageSquare class="w-5 h-5 text-fitness-text" />
      </div>
      <Bell class="w-5 h-5 text-fitness-text" />
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-[#15e7fb] rounded-full flex items-center justify-center text-white font-semibold">
          HG
        </div>
        <span class="text-fitness-text">Heath Graham</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Settings, Sun, MessageSquare, Bell } from 'lucide-vue-next'
</script>