<template>
  <div class="bg-fitness-grid rounded-lg p-4">
    <div class="grid grid-cols-8 gap-2 mb-4">
      <div class="text-fitness-text font-medium p-2">Avail. Times</div>
      <div v-for="(day, index) in days" :key="day" 
        :class="[
          'text-fitness-text font-medium p-2 text-center rounded-md',
          index === 6 ? 'bg-red-900/20' : 'bg-fitness-muted'
        ]"
      >
        {{ day }}
      </div>
    </div>

    <div class="space-y-2">
      <div v-for="timeSlot in timeSlots" :key="timeSlot" class="grid grid-cols-8 gap-2">
        <div class="text-fitness-text p-2">{{ timeSlot }}</div>
        <div v-for="day in days" :key="`${timeSlot}-${day}`" class="bg-fitness-muted rounded-md p-2">
          <div class="bg-fitness-inner p-2 rounded flex items-center justify-between">
            <div>
              <p class="text-fitness-text text-sm">Heath Graham</p>
              <p class="text-xs text-gray-400">CrossFit</p>
            </div>
            <Trash2 class="w-4 h-4 text-fitness-danger cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

const timeSlots = [
  "5:00am - 6:00am",
  "6:00am - 7:00am",
  "8:00am - 9:00am",
  "3:00pm - 4:00pm",
  "4:00pm - 5:00pm",
  "5:00pm - 6:00pm",
  "6:00pm - 7:00pm",
]

const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"]
</script>