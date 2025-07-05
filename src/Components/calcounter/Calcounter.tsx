import { useEffect, useState } from 'react';
import Mealmodal, { mealTypes } from '../modals/Mealmodal';
import { deleteMealItem, fetchMealsByUserAndDate, getDailyTotals, getTypeTotals, patchMealItem } from '../../API/MealAPICalls';
import type { DailyTotal, MealItem, TypeTotal } from '../../types/mealtypes';
import Sidebar from '../sidebar/Sidebar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { User } from '../../types/AuthTypes';
import React from 'react';


type CalcounterProps = {
    user: User;
    setUser: (user: User | null) => void;
}

export default function Calcounter({ user, setUser }: CalcounterProps) {
    //Används för att hålla koll när mål skapas så att vi refetchar från backend då och förblir uppdaterade
    const [mealModalCount, setMealModalCount] = useState(0);

    //Håller koll på om popup för att skapa mål är öppen eller inte
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);

    //State som har datan vi hämtar från backend
    const [data, setData] = useState<MealItem[]>([]);

    //State som har datan vi hämtar från backend
    const [dailyData, setDailyData] = useState<DailyTotal>();

    //State som har datan vi hämtar från backend
    const [typeData, setTypeData] = useState<TypeTotal[]>([]);

    //State som håller koll på valt datum i select och som vi sedan använder för att fetcha 
    //från backend och att köra om vår useEffect för att förbli uppdaterad
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

    //Funktioner för att öppna och stänga popupen, kanske skulle kunna ta bort den ena och köra 
    //en logik med ! istället för att minska kod, hade dock skadat läsbarheten
    const openModal = () => setIsMealModalOpen(true);
    const closeModal = () => setIsMealModalOpen(false);

    const [editingMealId, setEditingMealId] = useState<string | null>(null);
    const [editedWeight, setEditedWeight] = useState<string>('');

    //Håller koll på när nya mål läggs till och ändrar mealmodal count vilket i sig trackas av useEffect
    function handleMealModalSubmits() {
        setMealModalCount(prev => prev + 1);
    }

    //Hämtar data baserat på valt datum och om mål läggs till så att den ska uppdatera dynamiskt och snyggt 
    useEffect(() => {
        fetchMealsByUserAndDate(user.userId, selectedDate)
            .then(setData)
            .catch(console.error);
        getDailyTotals(user.userId, selectedDate)
            .then(setDailyData)
            .catch(console.error);
        getTypeTotals(user.userId, selectedDate)
            .then(setTypeData)
            .catch(console.error)
    }, [mealModalCount, selectedDate]);

    //Funktion för att deleta item
    async function deleteMealItemById(mealId: string, userId: string, name: string, mealtype: string) {
        if (confirm("Do you want to delete " + name + " from " + (mealtype.toLowerCase()) + "?")) {
            //Kallar funktionen för att ta bort det 
            await deleteMealItem(mealId, userId);
            //För att trigga rerender efter tas bort 
            setMealModalCount(prev => prev + 1);
        } else {
            return;
        }
    }

    //Funktion för att patcha vikten på mat 
    async function patchMealItemById(mealItem: MealItem) {
        //Kallar funktionen för att ta bort det 
        await patchMealItem(mealItem);
        //För att trigga rerender efter tas bort 
        setMealModalCount(prev => prev + 1);
    }

    return (
        <div className="flex h-screen w-screen">
            <Sidebar user={user} setUser={setUser} />

            <div className="flex-grow p-6 overflow-auto rounded-lg flex flex-col items-center">
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 transition duration-300 ease-in-out"
                >
                    Add food
                </button>

                <Mealmodal
                    isOpen={isMealModalOpen}
                    onClose={closeModal}
                    onAction={handleMealModalSubmits}
                    user={user}
                    selectedDate={selectedDate}
                />

                <div className="flex justify-center items-center w-full mb-6 flex-col">
                    <h1 className="text-xl font-semibold">Meal Items</h1>
                    <div className="flex items-center gap-2 ml-16">
                        <p className="font-normal">Date:</p>
                        <DatePicker
                            selected={selectedDate ? new Date(selectedDate) : new Date()}
                            onChange={date => setSelectedDate(date ? date.toISOString().slice(0, 10) : "")}
                            dateFormat="yyyy-MM-dd"
                            className="w-26/50 max-w-xs rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-sm border border-blue-100 shadow-sm w-[800px]">
                    <table className="min-w-full table-fixed text-sm border-collapse">
                        <tbody>
                            {mealTypes.map(type => {
                                const typeTotals = typeData.find(item => item.mealType === type);
                                const items = data.filter(item => item.mealtype === type);

                                if (items.length === 0) return null;

                                return (
                                    <React.Fragment key={type}>
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="border border-gray-200 bg-gray-100 font-bold px-4 py-2 capitalize text-center"
                                            >
                                                {type}
                                            </td>
                                        </tr>
                                        {items.map(item => (
                                            <tr
                                                key={item.mealId}
                                                className="border border-gray-200 bg-white hover:bg-gray-50 transition duration-200"
                                            >
                                                <td className="border border-gray-200 px-4 py-2">
                                                    {item.name}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-center">
                                                    {(item.calories * item.weight).toFixed(0)} kcal
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-center">
                                                    {(item.protein * item.weight).toFixed(0)}g protein
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-center">
                                                    {(item.carbs * item.weight).toFixed(0)}g carbs
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-center">
                                                    {(item.fats * item.weight).toFixed(0)}g fats
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-center">
                                                    {(item.fiber * item.weight).toFixed(0)}g fiber
                                                </td>
                                                <td className="border border-gray-200 px-4 py-2 text-center">
                                                    {editingMealId === item.mealId ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <input
                                                                type="number"
                                                                value={editedWeight}
                                                                onChange={(e) => setEditedWeight(e.target.value)}
                                                                className="w-20 border border-gray-300 rounded text-center"
                                                            />
                                                            <button
                                                                onClick={async () => {
                                                                    if (!editedWeight || isNaN(Number(editedWeight))) return alert("Invalid weight");

                                                                    const updatedItem = {
                                                                        ...item,
                                                                        weight: Number(editedWeight) / 100,
                                                                    };

                                                                    await patchMealItemById(updatedItem);
                                                                    setEditingMealId(null);
                                                                    setEditedWeight('');
                                                                }}
                                                            >
                                                                ✅
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingMealId(null);
                                                                    setEditedWeight('');
                                                                }}
                                                            >
                                                                ❌
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        (() => {
                                                            let value = "";
                                                            let label = "";
                                                            if (item.weight !== 0) {
                                                                value = (item.weight * 100).toFixed(0);
                                                                label = "g";
                                                            } else if (item.volume !== 0) {
                                                                value = (item.volume * 100).toFixed(0);
                                                                label = "ml";
                                                            } else if (item.pieces !== 0) {
                                                                value = item.pieces.toFixed(0);
                                                                label = "pcs";
                                                            }
                                                            return value ? `${value} ${label}` : "";
                                                        })()
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-4">
                                                        <button onClick={() => {
                                                            if (item.mealId) {
                                                                deleteMealItemById(item.mealId, user.userId, item.name, item.mealtype);
                                                            }
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-6 w-6" x-tooltip="tooltip">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => {
                                                            if (item.mealId) {
                                                                if (editingMealId === item.mealId) {
                                                                    setEditingMealId(null);
                                                                    setEditedWeight('');
                                                                } else {
                                                                    setEditingMealId(item.mealId);
                                                                    setEditedWeight((item.weight * 100).toFixed(0));
                                                                }
                                                            }
                                                        }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-6 w-6" x-tooltip="tooltip">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-200 border border-gray-300">
                                            <td colSpan={9} className="px-4 py-3 text-left font-medium text-gray-800">
                                                <div className="grid grid-cols-6 gap-x-8 pl-4">
                                                    <span className="font-bold">{typeTotals?.mealType} Total</span>
                                                    <span>{(typeTotals?.totalCalories ?? 0).toFixed(0)} kcal</span>
                                                    <span>{(typeTotals?.totalProtein ?? 0).toFixed(0)}g protein</span>
                                                    <span>{(typeTotals?.totalCarbs ?? 0).toFixed(0)}g carbs</span>
                                                    <span>{(typeTotals?.totalFats ?? 0).toFixed(0)}g fats</span>
                                                    <span>{(typeTotals?.totalFiber ?? 0).toFixed(0)}g fiber</span>
                                                </div>
                                            </td>
                                        </tr>

                                    </React.Fragment>
                                );
                            })}

                            {dailyData && (
                                <tr className="bg-gray-200 border border-gray-300">
                                    <td colSpan={9} className="px-4 py-3 text-left font-medium text-gray-800">
                                        <div className="grid grid-cols-6 gap-x-8 pl-4">
                                            <span className="font-bold">Daily Total</span>
                                            <span>{(dailyData.sumcalories ?? 0).toFixed(0)} kcal</span>
                                            <span>{(dailyData.sumprotein ?? 0).toFixed(0)}g protein</span>
                                            <span>{(dailyData.sumcarbs ?? 0).toFixed(0)}g carbs</span>
                                            <span>{(dailyData.sumfats ?? 0).toFixed(0)}g fats</span>
                                            <span>{(dailyData.sumfiber ?? 0).toFixed(0)}g fiber</span>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="border border-gray-200 px-4 py-2 text-center text-gray-500">
                                        No meals added for this day
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}