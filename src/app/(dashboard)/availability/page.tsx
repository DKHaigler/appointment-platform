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
  const [error, setError] = useState("");

  const {
    availability,
    loading,
    refetchAvailability,
  } = useAvailability(activeBusinessId);

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
  
    setError("");
  
    try {
      await upsertAvailability(
        activeBusinessId,
        day.dayOfWeek,
        day.startTime,
        day.endTime,
        day.isAvailable
      );
  
      await refetchAvailability();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  if (loading) {
    return <p>Loading availability...</p>;
  }

  return (
    <section className="availability-page">
      <header className="page-header">
        <div>
          <h1>Availability</h1>
          <p>
            Set the hours when customers can book appointments.
          </p>
        </div>
      </header>
      {error && <p className="form-error">{error}</p>}
      <div className="schedule-list">
        {schedule.map((day) => {
          const dayName = days.find(
            (item) => item.value === day.dayOfWeek
          )?.label;

          return (
            <article
              key={day.dayOfWeek}
              className="schedule-card"
            >
              <div className="schedule-day">
                <h2>{dayName}</h2>

                <label className="availability-toggle">
                  <input
                    type="checkbox"
                    checked={day.isAvailable}
                    onChange={(event) =>
                      updateDay(day.dayOfWeek, {
                        isAvailable: event.target.checked,
                      })
                    }
                  />

                  <span>
                    {day.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </label>
              </div>

              {day.isAvailable && (
                <div className="schedule-times">
                  <div>
                    <label htmlFor={`start-${day.dayOfWeek}`}>
                      Start
                    </label>

                    <input
                      id={`start-${day.dayOfWeek}`}
                      type="time"
                      value={day.startTime}
                      onChange={(event) =>
                        updateDay(day.dayOfWeek, {
                          startTime: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor={`end-${day.dayOfWeek}`}>
                      End
                    </label>

                    <input
                      id={`end-${day.dayOfWeek}`}
                      type="time"
                      value={day.endTime}
                      onChange={(event) =>
                        updateDay(day.dayOfWeek, {
                          endTime: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                className="schedule-save"
                onClick={() => handleSave(day)}
              >
                Save
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}