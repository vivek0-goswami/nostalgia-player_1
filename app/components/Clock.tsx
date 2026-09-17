"use client";

import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Set initial time
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const parts = formatter.formatToParts(now);
      const hour = parts.find((p) => p.type === "hour")?.value || "";
      const minute = parts.find((p) => p.type === "minute")?.value || "";
      const period = parts.find((p) => p.type === "dayPeriod")?.value || "";
      setTime(`${hour}:${minute} ${period}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="text-xs text-white/50 font-tabular-nums">--:-- --</div>;

  const [timePart, period] = time.split(" ");
  const [hour, minute] = timePart.split(":");

  return (
    <div className="text-xs text-white/50 font-tabular-nums">
      {hour}
      <span className="blink-colon">:</span>
      {minute} <span className="text-[0.7em]">{period}</span>
    </div>
  );
}
