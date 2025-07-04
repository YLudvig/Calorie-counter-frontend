import { useEffect, useState } from 'react';
import Mealmodal, { mealTypes } from '../modals/Mealmodal';
import { deleteMealItem, fetchMealsByUserAndDate, getDailyTotals, getTypeTotals, patchMealItem } from '../../API/MealAPICalls';
import type { DailyTotal, MealItem, TypeTotal } from '../../types/mealtypes';
import Sidebar from '../sidebar/Sidebar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { User } from '../../types/AuthTypes';
import React from 'react';
import { FaEdit } from 'react-icons/fa';

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
        console.log(typeData)
    }, [mealModalCount, selectedDate]);

    //Funktion för att deleta item
    async function deleteMealItemById(mealId: string, userId: string) {
        if (confirm("Do you want to delete this item?")) {
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

                <div className="overflow-x-auto rounded-sm border border-blue-100 shadow-sm">
                    <table className="min-w-full table-fixed border border-blue-100 text-sm">
                        <tbody>
                            {mealTypes.map(type => {
                                const typeTotals = typeData.find(item => item.mealType === type);

                                const items = data.filter(item => item.mealtype === type);

                                if (items.length === 0) return null;

                                return (
                                    <React.Fragment key={type}>
                                        <tr>
                                            <td colSpan={7} className="border bg-gray-200 font-bold px-4 py-2 capitalize text-center">
                                                {type}
                                            </td>
                                        </tr>
                                        {items.map(item => (
                                            <tr key={item.mealId} className="border bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out">
                                                <td className="border px-4 py-2">{item.name}
                                                    <div className="flex justify-between items-center overflow-x-auto whitespace-nowrap">
                                                        <button className="text-red-500 pl-2" onClick={() => { if (item.mealId) deleteMealItemById(item.mealId, user.userId) }}>[X]</button>
                                                    </div>
                                                </td>
                                                <td className="border px-4 py-2 text-center">
                                                    {editingMealId === item.mealId ? (
                                                        <form
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                if (item.mealId && editedWeight) {
                                                                    const updatedItem = {
                                                                        ...item,
                                                                        weight: parseFloat(editedWeight) / 100, // divide by 100 to convert from g to portion
                                                                    };
                                                                    patchMealItemById(updatedItem);
                                                                    setEditingMealId(null);
                                                                }
                                                            }}
                                                        >
                                                            <input
                                                                type="number"
                                                                value={editedWeight}
                                                                autoFocus
                                                                onChange={(e) => setEditedWeight(e.target.value)}
                                                                className="w-16 border border-gray-400 rounded px-1"
                                                            />
                                                            <button type="submit" className="ml-1 text-green-600">✔</button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditingMealId(null)}
                                                                className="ml-1 text-red-600"
                                                            >
                                                                ✖
                                                            </button>
                                                        </form>
                                                    ) : (
                                                        <>
                                                            {item.weight * 100}g
                                                            <button
                                                                onClick={() => {
                                                                    setEditingMealId(item.mealId || '');
                                                                    setEditedWeight((item.weight * 100).toString());
                                                                }}
                                                                className="ml-2 text-blue-600"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="border px-4 py-2 text-center">{(item.calories * item.weight).toFixed(0)} kcal</td>
                                                <td className="border px-4 py-2 text-center">{(item.protein * item.weight).toFixed(0)}g protein</td>
                                                <td className="border px-4 py-2 text-center">{(item.carbs * item.weight).toFixed(0)}g carbs</td>
                                                <td className="border px-4 py-2 text-center">{(item.fats * item.weight).toFixed(0)}g fats</td>
                                                <td className="border px-4 py-2 text-center">{(item.fiber * item.weight).toFixed(0)}g fiber</td>
                                            </tr>
                                        ))}
                                        <tr className="border bg-gray-200">
                                            <td className="border px-4 py-2 text-center font-bold" colSpan={2}>Total {type}</td>
                                            <td className="border px-4 py-2 text-center">{(typeTotals?.totalCalories ?? 0).toFixed(0)} kcal</td>
                                            <td className="border px-4 py-2 text-center">{(typeTotals?.totalProtein ?? 0).toFixed(0)}g protein</td>
                                            <td className="border px-4 py-2 text-center">{(typeTotals?.totalCarbs ?? 0).toFixed(0)}g carbs</td>
                                            <td className="border px-4 py-2 text-center">{(typeTotals?.totalFats ?? 0)?.toFixed(0)}g fats</td>
                                            <td className="border px-4 py-2 text-center">{(typeTotals?.totalFiber ?? 0).toFixed(0)}g fiber</td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                            {dailyData && (
                                <tr className="border bg-gray-300">
                                    <td className="border px-4 py-2 text-center font-bold" colSpan={2}>Daily total</td>
                                    <td className="border px-4 py-2 text-center">{(dailyData.sumcalories ?? 0).toFixed(0)} kcal</td>
                                    <td className="border px-4 py-2 text-center">{(dailyData.sumprotein ?? 0).toFixed(0)}g protein</td>
                                    <td className="border px-4 py-2 text-center">{(dailyData.sumcarbs ?? 0).toFixed(0)}g carbs</td>
                                    <td className="border px-4 py-2 text-center">{(dailyData.sumfats ?? 0).toFixed(0)}g fats</td>
                                    <td className="border px-4 py-2 text-center">{(dailyData.sumfiber ?? 0).toFixed(0)}g fiber</td>
                                </tr>
                            )}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="border px-4 py-2 text-center">
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