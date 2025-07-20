import { useEffect, useState } from "react";
import type { User } from "../../types/AuthTypes";
import Sidebar from "../sidebar/Sidebar";
import {
  addWeightTrackingItem,
  fetchAverages,
  fetchCurrentWeek,
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
  const [editedCalories, setEditedCalories] = useState<{
    [key: string]: string;
  }>({});

  const [editedWeights, setEditedWeights] = useState<{ [key: string]: string }>(
    {}
  );

  const [wtData, setWtData] = useState<WeightTrackingInfo[]>([]);

  const [currWeek, setCurrentWeek] = useState<number>();

  const weeksArray = Array.from({ length: 53 }, (_, i) => i + 1);

  const [avgData, setAvgData] = useState<avgData[]>([]);

  const handleWeightKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    entry: WeightTrackingInfo
  ) => {
    if (e.key !== "Enter") return;

    const key = `${entry.week}-${entry.inputWeekDay}`;
    const value = editedWeights[key];
    if (!value) return;

    const body: WeightTrackingInfo = {
      ...entry,
      weight: parseFloat(value),
      dailycalories: entry.dailycalories ?? 0,
    };

    try {
      const isNewEntry = !wtData.some(
        (e) => e.week === entry.week && e.inputWeekDay === entry.inputWeekDay
      );

      if (isNewEntry) {
        await addWeightTrackingItem(body);
      } else {
        await patchWeightTrackingItem(body);
      }

      setEditedWeights((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } catch (err) {
      console.error("Error submitting weight:", err);
    }
  };

  const handleCaloriesKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    entry: WeightTrackingInfo
  ) => {
    if (e.key !== "Enter") return;

    const key = `${entry.week}-${entry.inputWeekDay}`;
    const value = editedCalories[key];
    if (!value) return;

    const body: WeightTrackingInfo = {
      ...entry,
      dailycalories: parseFloat(value),
      weight: entry.weight ?? 0,
    };

    try {
      const isNewEntry = !wtData.some(
        (e) => e.week === entry.week && e.inputWeekDay === entry.inputWeekDay
      );

      if (isNewEntry) {
        await addWeightTrackingItem(body);
        console.log("You goofed up");
        console.log(body);
      } else {
        await patchWeightTrackingItem(body);
        console.log("Patched calories");
      }

      setEditedCalories((prev) => {
        const updated = { ...prev };
        delete updated[key];
        console.log("You goofed up");
        console.log(body);
        return updated;
      });
    } catch (err) {
      console.error("Error submitting calories:", err);
    }
  };

  useEffect(() => {
    fetchCurrentWeek().then(setCurrentWeek).catch(console.error);
    fetchWeightTrackingByUser(user.userId).then(setWtData).catch(console.error);
    fetchAverages(user.userId).then(setAvgData).catch(console.error);
    console.log(currWeek); //Funkar inte riktigt
  }, [user.userId, addWeightTrackingItem, patchWeightTrackingItem]);

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
                    const value = editedWeights[key] ?? entry?.weight ?? "";

                    return (
                      <td
                        key={key}
                        className="border border-gray-400 px-2 py-1 text-center"
                      >
                        <input
                          type="number"
                          className="w-full p-0 text-center"
                          value={value}
                          onChange={(e) =>
                            setEditedWeights((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            handleWeightKeyDown(
                              e,
                              entry ?? {
                                weightTrackingId: "",
                                userId: user.userId,
                                week,
                                inputWeekDay: day,
                                weight: 0,
                                dailycalories: 0,
                              }
                            )
                          }
                        />
                      </td>
                    );
                  })}
                  <td className="border border-gray-400 align-middle text-center px-2 py-1">
                    {avgData
                      .find((avg) => avg.week === week)
                      ?.avg_weight?.toFixed(1) ?? ""}
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
                    const value =
                      editedCalories[key] ?? entry?.dailycalories ?? "";

                    return (
                      <td
                        key={key}
                        className="border border-gray-400 px-2 py-1 text-center"
                      >
                        <input
                          type="number"
                          className="w-full p-0 text-center"
                          value={value}
                          onChange={(e) =>
                            setEditedCalories((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            handleCaloriesKeyDown(
                              e,
                              entry ?? {
                                weightTrackingId: "",
                                userId: user.userId,
                                week,
                                inputWeekDay: day,
                                weight: 0,
                                dailycalories: 0,
                              }
                            )
                          }
                        />
                      </td>
                    );
                  })}
                  <td className="border border-gray-400 px-2 py-1 text-center">
                    {avgData.find((avg) => avg.week === week)?.avg_calories ??
                      ""}
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
