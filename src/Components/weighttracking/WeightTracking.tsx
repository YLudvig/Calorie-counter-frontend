import { useEffect, useState } from "react";
import type { User } from "../../types/AuthTypes";
import Sidebar from "../sidebar/Sidebar";
import { addWeightTrackingItem, fetchWeeks, fetchWeightTrackingByUser, patchWeightTrackingItem } from "../../API/WeightTrackingAPICalls";
import React from "react";
import type { WeightTrackingInfo } from '../../types/WeightTrackingTypes';;

type WeightTrackingProps = {
    user: User;
    setUser: (user: User | null) => void;
}

export default function WeightTracking({ user, setUser }: WeightTrackingProps) {

    const [editedCalories, setEditedCalories] = useState<{ [key: string]: string }>({});

    const [editedWeights, setEditedWeights] = useState<{ [key: string]: string }>({});

    const [wtData, setWtData] = useState<WeightTrackingInfo[]>([]);

    const [wData, setWData] = useState<[]>([]);



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
                console.log("Patched weight");
            }

            setEditedWeights((prev) => {
                const updated = { ...prev };
                delete updated[key];
                console.log("You goofed up");
                console.log(entry.weightTrackingId);
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
        fetchWeightTrackingByUser(user.userId)
            .then(setWtData)
            .catch(console.error)
        fetchWeeks()
            .then(setWData)
            .catch(console.error)
    }, [user.userId]);

    return (
        <div className="flex h-screen w-screen">
            <Sidebar user={user} setUser={setUser} />
            <div className="flex-grow p-6 overflow-auto rounded-lg flex flex-col items-center">
                <div className="overflow-x-auto rounded-sm border border-blue-100 shadow-sm w-[1000px]">
                    <table className="table-fixed w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Week</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Stats</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Mon.</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Tues.</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Wen.</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Thurs.</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Fri.</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Sat.</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Sun.</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">Avg.</th>
                                <th className="w-1/14 border border-gray-300 text-center px-2 py-1">∆</th>
                            </tr>
                        </thead>
                        {wData.map(week => (
                            <tbody key={week}>
                                <tr>
                                    <td rowSpan={2} className="border border-gray-300 align-middle text-center px-2 py-1">{week}</td>
                                    <td className="border border-gray-300 px-2 py-1 text-center">Weight</td>
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                                        const key = `${week}-${day}`;
                                        const entry = wtData.find(e => e.week === week && e.inputWeekDay === day);
                                        const value = editedWeights[key] ?? entry?.weight ?? "";

                                        return (
                                            <td key={key} className="border border-gray-300 px-2 py-1 text-center">
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
                                                        handleWeightKeyDown(e, entry ?? {
                                                            weightTrackingId: "",
                                                            userId: user.userId,
                                                            week,
                                                            inputWeekDay: day,
                                                            weight: 0,
                                                            dailycalories: 0,
                                                        })
                                                    }
                                                />
                                            </td>
                                        );
                                    })}
                                    <td rowSpan={2} className="border border-gray-300 align-middle text-center px-2 py-1"></td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-2 py-1 text-center">Cal.</td>
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                                        const key = `${week}-${day}`;
                                        const entry = wtData.find(e => e.week === week && e.inputWeekDay === day);
                                        const value = editedCalories[key] ?? entry?.dailycalories ?? "";

                                        return (
                                            <td key={key} className="border border-gray-300 px-2 py-1 text-center">
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
                                                        handleCaloriesKeyDown(e, entry ?? {
                                                            weightTrackingId: "",
                                                            userId: user.userId,
                                                            week,
                                                            inputWeekDay: day,
                                                            weight: 0,
                                                            dailycalories: 0,
                                                        })
                                                    }
                                                />
                                            </td>
                                        );
                                    })}
                                    <td className="border border-gray-300 px-2 py-1 text-center"></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </div >
    );
}
