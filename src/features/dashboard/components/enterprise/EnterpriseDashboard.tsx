"use client";

import React from "react";
import { MetricVisualizer } from "../MetricVisualizer";
import { NeuralNodes } from "../NeuralNodes";
import { SystemConnectivity } from "../SystemConnectivity";
import { ResourceAllocation } from "../ResourceAllocation";
import { OperationalUptime } from "../OperationalUptime";
import { EfficiencyIndex } from "../EfficiencyIndex";

export function EnterpriseDashboard() {
  return (
    <div className="flex flex-col gap-8 w-full select-none text-left">
      {/* Title & Description Header */}
      <div className="flex flex-col gap-1.5 animate-fadeIn">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Ikhtisar Enterprise
        </h1>
        <p className="text-sm text-muted-foreground">
          Metrik kinerja real-time dan status operasional sistem AI.
        </p>
      </div>

      {/* Top Grid Area (Chart and stacked cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">
        {/* Main Large Visualizer Chart - takes 2 cols on lg screens */}
        <div className="lg:col-span-2 w-full">
          <MetricVisualizer />
        </div>

        {/* Right Column containing Neural Nodes and Connectivity */}
        <div className="flex flex-col gap-5 w-full">
          <NeuralNodes />
          <SystemConnectivity />
        </div>
      </div>

      {/* Bottom Grid Area (3 statistics cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
        <ResourceAllocation />
        <OperationalUptime />
        <EfficiencyIndex />
      </div>
    </div>
  );
}
