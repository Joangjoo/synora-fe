"use client";

import React from "react";
import { WelcomeCard } from "./WelcomeCard";
import { Statistics } from "./Statistics";
import { RecentProjects } from "./RecentProjects";
import { QuickAction } from "./QuickAction";
import { RecentActivity } from "./RecentActivity";

export function ClientDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full select-none text-left">
      {/* Welcome Greeting Banner */}
      <WelcomeCard />

      {/* Statistics Grid (Active, Completed, Waiting Review) */}
      <Statistics />

      {/* Quick Action & Double-column Project/Activity list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left side takes 2 cols for Recent Projects */}
        <div className="lg:col-span-2 w-full">
          <RecentProjects />
        </div>

        {/* Right side takes 1 col for Quick Actions */}
        <div className="w-full flex flex-col gap-6">
          <QuickAction />
        </div>
      </div>

      {/* Bottom row: Recent Activity timeline logs */}
      <div className="w-full">
        <RecentActivity />
      </div>
    </div>
  );
}
