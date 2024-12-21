<template>
  <aside class="w-72 bg-fitness-card border-r border-fitness-muted p-4 flex flex-col gap-6">
    <div>
      <h2 class="text-xl font-semibold text-fitness-text mb-4">Staff</h2>
      <div class="space-y-3">
        <div v-for="staff in staffMembers" :key="staff.id" class="flex items-center justify-between p-3 bg-fitness-inner rounded-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-fitness-accent rounded-full flex items-center justify-center text-white font-semibold">
              {{ staff.avatar }}
            </div>
            <div>
              <p class="text-fitness-text font-medium">{{ staff.name }}</p>
              <p class="text-sm text-gray-400">{{ staff.role }}</p>
            </div>
          </div>
          <Plus class="w-5 h-5 text-fitness-accent cursor-pointer" />
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-semibold text-fitness-text mb-4">Approved Time Off</h2>
      <div class="space-y-3">
        <div v-for="(item, index) in approvedTimeOff" :key="index" class="p-3 bg-fitness-inner rounded-md text-fitness-text">
          <p class="font-medium">{{ item.name }}</p>
          <p class="text-sm text-gray-400">Approved: {{ item.approver }}</p>
        </div>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-fitness-text">Time Off Request</h2>
        <button class="flex items-center gap-1 text-fitness-accent">
          <Plus class="w-4 h-4" />
          Ask
        </button>
      </div>
      <div class="space-y-3">
        <div v-for="(request, index) in timeOffRequests" :key="index" class="flex items-center justify-between p-3 bg-fitness-inner rounded-md">
          <span class="text-fitness-text">{{ request.name }}</span>
          <div class="flex gap-2">
            <Check class="w-5 h-5 text-green-500 cursor-pointer" />
            <X class="w-5 h-5 text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Plus, Check, X } from 'lucide-vue-next'

const staffMembers = [
  { id: 1, name: "Heath Graham", role: "Coach", avatar: "HG" },
  { id: 2, name: "Ted Gonder", role: "Coach", avatar: "TG" },
  { id: 3, name: "Jay Duquette", role: "Coach", avatar: "JD" },
  { id: 4, name: "Jane Doe", role: "Personal Trainer", avatar: "JD" },
]

const approvedTimeOff = [
  { name: "Heath Graham", approver: "Manager Name" },
  { name: "Jay Duquette", approver: "Manager Name" },
]

const timeOffRequests = [
  { name: "Heath Graham", status: "pending" },
  { name: "Jay Duquette", status: "pending" },
]
</script>