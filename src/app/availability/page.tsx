"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/features/business/context/BusinessContext";
import { useAvailability } from "@/features/availability/hooks/useAvailabilty";
import { upsertAvailability } from "@/features/availability/services/upsertAvailabilty";

const days = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

type DaySchedule = {
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
};

export default function AvailabilityPage() {
  const { activeBusinessId } = useBusiness();
  const { availability, loading, refetchAvailability } =
    useAvailability(activeBusinessId);

  const [schedule, setSchedule] = useState<DaySchedule[]>(
    days.map((day) => ({
      dayOfWeek: day.value,
      isAvailable: false,
      startTime: "09:00",
      endTime: "17:00",
    }))
  );

  useEffect(() => {
    if (!availability.length) return;

    setSchedule((currentSchedule) =>
      currentSchedule.map((day) => {
        const savedDay = availability.find(
          (item) => item.day_of_week === day.dayOfWeek
        );

        if (!savedDay) return day;

        return {
          dayOfWeek: savedDay.day_of_week,
          isAvailable: savedDay.is_available,
          startTime: savedDay.start_time.slice(0, 5),
          endTime: savedDay.end_time.slice(0, 5),
        };
      })
    );
  }, [availability]);

  function updateDay(
    dayOfWeek: number,
    changes: Partial<DaySchedule>
  ) {
    setSchedule((current) =>
      current.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, ...changes }
          : day
      )
    );
  }

  async function handleSave(day: DaySchedule) {
    if (!activeBusinessId) return;

    await upsertAvailability(
      activeBusinessId,
      day.dayOfWeek,
      day.startTime,
      day.endTime,
      day.isAvailable
    );

    await refetchAvailability();
  }

  if (loading) {
    return <main>Loading availability...</main>;
  }

  return (
    <main>
      <h1>Availability</h1>

      {schedule.map((day) => (
        <div key={day.dayOfWeek}>
          <h2>
            {days.find((item) => item.value === day.dayOfWeek)?.label}
          </h2>

          <label>
            <input
              type="checkbox"
              checked={day.isAvailable}
              onChange={(event) =>
                updateDay(day.dayOfWeek, {
                  isAvailable: event.target.checked,
                })
              }
            />
            Available
          </label>

          {day.isAvailable && (
            <>
              <input
                type="time"
                value={day.startTime}
                onChange={(event) =>
                  updateDay(day.dayOfWeek, {
                    startTime: event.target.value,
                  })
                }
              />

              <input
                type="time"
                value={day.endTime}
                onChange={(event) =>
                  updateDay(day.dayOfWeek, {
                    endTime: event.target.value,
                  })
                }
              />
            </>
          )}

          <button
            type="button"
            onClick={() => handleSave(day)}
          >
            Save
          </button>
        </div>
      ))}
    </main>
  );
}