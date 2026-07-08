"use client";

import React, { useState } from "react";
import { AreaChart } from "lucide-react";

export function MetricVisualizer() {
  const [activeFilter, setActiveFilter] = useState("24J");

  // Chart coordinate points for standard execution path visualization
  const chartPoints = [
    { x: 0, y: 120 },
    { x: 50, y: 100 },
    { x: 100, y: 140 },
    { x: 150, y: 80 },
    { x: 200, y: 110 },
    { x: 250, y: 60 },
    { x: 300, y: 90 },
    { x: 350, y: 40 },
    { x: 400, y: 70 },
    { x: 450, y: 30 },
    { x: 500, y: 50 },
  ];

  const svgWidth = 500;
  const svgHeight = 150;

  // Compile points into SVG path format
  const pointsString = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPointsString = `0,${svgHeight} ${pointsString} ${svgWidth},${svgHeight}`;

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/10 text-purple-400">
            <AreaChart size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Throughput Token
            </h3>
            <span className="text-[9px] text-muted-foreground/60">
              Kecepatan eksekusi instance jaringan saraf AI
            </span>
          </div>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1.5 bg-[#111113] p-1 border border-[#27272A] rounded-lg">
          {["1J", "24J", "7H", "30H"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider transition-all cursor-pointer ${
                activeFilter === filter
                  ? "bg-purple-600 text-white"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart area */}
      <div className="flex-1 w-full relative flex items-center justify-center py-4">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible z-10 relative"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1="0"
            y1={svgHeight * 0.25}
            x2={svgWidth}
            y2={svgHeight * 0.25}
            stroke="#27272A"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <line
            x1="0"
            y1={svgHeight * 0.5}
            x2={svgWidth}
            y2={svgHeight * 0.5}
            stroke="#27272A"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <line
            x1="0"
            y1={svgHeight * 0.75}
            x2={svgWidth}
            y2={svgHeight * 0.75}
            stroke="#27272A"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />

          {/* Filled Area */}
          <polygon points={areaPointsString} fill="url(#chartGlow)" />

          {/* Stroke Line */}
          <polyline
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2.5"
            points={pointsString}
            className="drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
          />

          {/* Glowing node at the latest end point */}
          <circle
            cx={svgWidth}
            cy={chartPoints[chartPoints.length - 1].y}
            r="4"
            fill="#7C3AED"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#27272A]/70 bg-[#18181B] items-center">
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
            Total Token
          </span>
          <span className="text-sm font-bold text-foreground mt-0.5">
            582,042
          </span>
          <span className="text-[8px] text-muted-foreground/40 mt-0.5 leading-none">
            token diproses
          </span>
        </div>
        <div className="flex flex-col text-left border-l border-[#27272A] pl-4">
          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
            Agen Aktif
          </span>
          <span className="text-sm font-bold text-foreground mt-0.5">
            4 / 4
          </span>
          <span className="text-[8px] text-muted-foreground/40 mt-0.5 leading-none">
            proses konkuren
          </span>
        </div>
        <div className="flex flex-col text-left border-l border-[#27272A] pl-4">
          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
            Latensi Rata-rata
          </span>
          <span className="text-sm font-bold text-purple-400 mt-0.5">
            1.24s
          </span>
          <span className="text-[8px] text-muted-foreground/40 mt-0.5 leading-none">
            waktu respons agen
          </span>
        </div>
      </div>
    </div>
  );
}
