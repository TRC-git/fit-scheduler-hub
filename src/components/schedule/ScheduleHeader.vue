<template>
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-4">
      <select class="bg-fitness-card text-fitness-text border border-fitness-muted rounded-md px-4 py-2">
        <option>CrossFit</option>
        <option>Personal Training</option>
        <option>Yoga</option>
      </select>
      <button class="px-4 py-2 bg-fitness-muted text-fitness-text rounded-md">
        Post Schedule
      </button>
    </div>
    
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 bg-fitness-card px-4 py-2 rounded-md">
        <ChevronLeft class="w-5 h-5 text-fitness-text cursor-pointer" />
        <span class="text-fitness-text">Week of May 29th 2023</span>
        <ChevronRight class="w-5 h-5 text-fitness-text cursor-pointer" />
      </div>
      <button class="px-4 py-2 bg-fitness-muted text-fitness-text rounded-md">
        Clone Week
      </button>
    </div>
    
    <button class="px-4 py-2 bg-fitness-accent text-white rounded-md">
      Clock-In
    </button>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
</script>