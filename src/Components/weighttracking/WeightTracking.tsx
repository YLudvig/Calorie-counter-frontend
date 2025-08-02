import { useEffect, useState } from "react";
import type { User } from "../../types/AuthTypes";
import Sidebar from "../sidebar/Sidebar";
import {
  addWeightTrackingItem,
  fetchAverages,
  fetchWeightTrackingByUser,
  patchWeightTrackingItem,
} from "../../API/WeightTrackingAPICalls";
import React from "react";
import type {
  avgData,
  WeightTrackingInfo,
} from "../../types/WeightTrackingTypes";

type WeightTrackingProps = {
  user: User;
  setUser: (user: User | null) => void;
};

export default function WeightTracking({ user, setUser }: WeightTrackingProps) {
  const [localWeights, setLocalWeights] = useState<{ [key: string]: string }>(
    {}
  );

  const [localCalories, setLocalCalories] = useState<{ [key: string]: string }>(
    {}
  );

  const getKey = (week: number, day: string) => `${week}-${day}`;

  const [wtData, setWtData] = useState<WeightTrackingInfo[]>([]);

  const weeksArray = Array.from({ length: 53 }, (_, i) => i + 1);

  const [avgData, setAvgData] = useState<avgData[]>([]);

  const handleWeightKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    week: number,
    day: string
  ) => {
    if (e.key !== "Enter") return;
    await saveWeightToBackend(week, day);
  };

  const handleWeightBlur = async (week: number, day: string) => {
    await saveWeightToBackend(week, day);
  };

  const saveWeightToBackend = async (week: number, day: string) => {
    const key = getKey(week, day);
    const value = localWeights[key];
    const weightNum = parseFloat(value);

    if (!value || isNaN(weightNum)) return;

    const existingEntry = wtData.find(
      (e) => e.week === week && e.inputWeekDay === day
    );

    const body: WeightTrackingInfo = existingEntry
      ? { ...existingEntry, weight: weightNum }
      : {
          weightTrackingId: "",
          userId: user.userId,
          week,
          inputWeekDay: day,
          weight: weightNum,
          dailycalories: 0,
        };

    try {
      if (existingEntry) {
        await patchWeightTrackingItem(body);
      } else {
        await addWeightTrackingItem(body);
      }

      const freshData = await fetchWeightTrackingByUser(user.userId);
      setWtData(freshData);

      setLocalWeights((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } catch (err) {
      console.error("Error saving weight:", err);
    }
  };

  const handleCaloriesKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    week: number,
    day: string
  ) => {
    if (e.key !== "Enter") return;
    await saveCaloriesToBackend(week, day);
    (e.target as HTMLInputElement).blur();
  };

  const handleCaloriesBlur = async (week: number, day: string) => {
    await saveCaloriesToBackend(week, day);
  };

  const saveCaloriesToBackend = async (week: number, day: string) => {
    const key = getKey(week, day);
    const value = localCalories[key];
    const calNum = parseFloat(value);

    if (!value || isNaN(calNum)) return;

    const existingEntry = wtData.find(
      (e) => e.week === week && e.inputWeekDay === day
    );

    const body: WeightTrackingInfo = existingEntry
      ? { ...existingEntry, dailycalories: calNum }
      : {
          weightTrackingId: "",
          userId: user.userId,
          week,
          inputWeekDay: day,
          weight: 0,
          dailycalories: calNum,
        };

    try {
      if (existingEntry) {
        await patchWeightTrackingItem(body);
      } else {
        await addWeightTrackingItem(body);
      }

      const freshData = await fetchWeightTrackingByUser(user.userId);
      setWtData(freshData);

      setLocalCalories((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } catch (err) {
      console.error("Error saving calories:", err);
    }
  };

  useEffect(() => {
    fetchWeightTrackingByUser(user.userId).then(setWtData).catch(console.error);
    fetchAverages(user.userId).then(setAvgData).catch(console.error);
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar user={user} setUser={setUser} />
      <div className="flex-grow p-6 overflow-auto rounded-lg flex flex-col items-center">
        <div className="max-h-200 overflow-y-auto overflow-x-auto rounded-sm border border-blue-100 shadow-sm w-[1000px]">
          <table className="table-fixed min-w-full border-collapse border border-gray-400">
            <thead className="bg-gray-200">
              <tr>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Week
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Stats
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Mon.
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Tues.
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Wen.
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Thurs.
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Fri.
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Sat.
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Sun.
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  Avg.
                </th>
                <th className="w-1/14 border border-gray-400 text-center px-2 py-1 sticky z-10 top-0 bg-gray-200">
                  ∆
                </th>
              </tr>
            </thead>
            {weeksArray.map((week) => (
              <tbody key={week}>
                <tr>
                  <td
                    rowSpan={2}
                    className="border border-gray-400 align-middle text-center px-2 py-1"
                  >
                    {week}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-center">
                    Weight
                  </td>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => {
                    const key = `${week}-${day}`;
                    const entry = wtData.find(
                      (e) => e.week === week && e.inputWeekDay === day
                    );

                    return (
                      <td
                        key={key}
                        className="border border-gray-400 px-2 py-1 text-center"
                      >
                        <input
                          type="number"
                          className="w-full p-0 text-center"
                          value={
                            localWeights[getKey(week, day)] ??
                            (entry?.weight === 0 || entry?.weight == null
                              ? ""
                              : entry.weight)
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalWeights((prev) => ({
                              ...prev,
                              [getKey(week, day)]: val,
                            }));
                          }}
                          onKeyDown={(e) => handleWeightKeyDown(e, week, day)}
                          onBlur={() => handleWeightBlur(week, day)}
                        />
                      </td>
                    );
                  })}
                  <td className="border border-gray-400 align-middle text-center px-2 py-1">
                    {avgData.find((avg) => avg.week === week)?.avg_weight === 0
                      ? ""
                      : avgData.find((avg) => avg.week === week)?.avg_weight ??
                        ""}
                  </td>
                  <td
                    rowSpan={2}
                    className="border border-gray-400 align-middle text-center px-2 py-1"
                  >
                    {avgData
                      .find((avg) => avg.week === week)
                      ?.delta_weight?.toFixed(2) ?? ""}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-2 py-1 text-center">
                    Cal.
                  </td>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => {
                    const key = `${week}-${day}`;
                    const entry = wtData.find(
                      (e) => e.week === week && e.inputWeekDay === day
                    );

                    return (
                      <td
                        key={key}
                        className="border border-gray-400 px-2 py-1 text-center"
                      >
                        <input
                          type="number"
                          className="w-full p-0 text-center"
                          value={
                            localCalories[getKey(week, day)] ??
                            (entry?.dailycalories === 0 ||
                            entry?.dailycalories == null
                              ? ""
                              : entry.dailycalories)
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalCalories((prev) => ({
                              ...prev,
                              [getKey(week, day)]: val,
                            }));
                          }}
                          onKeyDown={(e) => handleCaloriesKeyDown(e, week, day)}
                          onBlur={() => handleCaloriesBlur(week, day)}
                        />
                      </td>
                    );
                  })}
                  <td className="border border-gray-400 px-2 py-1 text-center">
                    {avgData.find((avg) => avg.week === week)?.avg_calories ===
                    0
                      ? ""
                      : avgData.find((avg) => avg.week === week)
                          ?.avg_calories ?? ""}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
