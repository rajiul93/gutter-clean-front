"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export function toLocalDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDateISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Monday = 0 … Sunday = 6 */
function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type MonthCalendarProps = {
  valueISO: string | null;
  onChange: (iso: string) => void;
};

export function MonthCalendar({ valueISO, onChange }: MonthCalendarProps) {
  const today = useMemo(() => {
    const n = new Date();
    n.setHours(0, 0, 0, 0);
    return n;
  }, []);

  const initialMonth = valueISO ? parseLocalDateISO(valueISO) : today;
  const [cursor, setCursor] = useState(() => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const padStart = mondayIndex(first);
  const daysInMonth = last.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < padStart; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);

  const title = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  function prevMonth() {
    setCursor(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCursor(new Date(year, month + 1, 1));
  }

  return (
    <div
      className={cn(
        "mx-auto box-border w-full max-w-[min(100%,25rem)] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)]",
        "min-h-[17.5rem] max-h-[31.25rem] h-[min(31.25rem,calc(100svh-12rem))] sm:h-[31.25rem]",
      )}
    >
      <div className="flex h-full min-h-0 w-full min-w-0 flex-col p-3 sm:p-4">
        <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="shrink-0 rounded-lg p-2 text-primary hover:bg-slate-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-center font-heading text-sm font-semibold text-primary-container sm:text-base">
            {title}
          </p>
          <button
            type="button"
            onClick={nextMonth}
            className="shrink-0 rounded-lg p-2 text-primary hover:bg-slate-100"
            aria-label="Next month"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mb-2 grid shrink-0 grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500 sm:text-xs">
          {WEEK_LABELS.map((w) => (
            <span key={w} className="truncate">
              {w}
            </span>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1">
          {cells.map((cell, i) => {
            if (!cell) {
              return <div key={`e-${i}`} className="min-h-0" />;
            }
            const iso = toLocalDateISO(cell);
            const isPast = cell < today;
            const isToday = toLocalDateISO(cell) === toLocalDateISO(today);
            const isSelected = valueISO === iso;
            return (
              <button
                key={iso}
                type="button"
                disabled={isPast}
                onClick={() => onChange(iso)}
                className={cn(
                  "relative flex min-h-0 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  isPast && "cursor-not-allowed text-slate-300",
                  !isPast && !isSelected && "text-slate-800 hover:bg-slate-100",
                  isSelected && "bg-primary-container text-white shadow-md",
                  isToday && !isSelected && "ring-2 ring-primary/35",
                )}
              >
                {isToday && (
                  <span className="absolute top-0.5 text-[8px] font-bold uppercase leading-none tracking-wide text-primary">
                    Today
                  </span>
                )}
                <span className={cn(isToday && !isSelected && "mt-2.5")}>{cell.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
