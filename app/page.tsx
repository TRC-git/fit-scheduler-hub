'use client';

import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"
import ScheduleHeader from "@/components/schedule/ScheduleHeader"
import ScheduleGrid from "@/components/schedule/ScheduleGrid"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-fitness-background">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <h1 className="text-2xl font-bold text-fitness-text mb-6">
              Scheduling
            </h1>
            <ScheduleHeader />
            <ScheduleGrid />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  )
}