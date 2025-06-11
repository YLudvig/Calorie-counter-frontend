import { useEffect, useState } from 'react';
import Mealmodal, { mealTypes } from '../modals/Mealmodal';
import { fetchMealsByUserAndDate } from '../API/MealAPICalls';
import type { MealItem } from '../../types/mealtypes';
import Sidebar from '../sidebar/Sidebar';

export default function MealItemList() {
    //Används för att hålla koll när mål skapas så att vi refetchar från backend då och förblir uppdaterade
    const [mealModalCount, setMealModalCount] = useState(0);
    //Håller koll på om popup för att skapa mål är öppen eller inte
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    //State som har datan vi hämtar från backend
    const [data, setData] = useState<MealItem[]>([]);
    //State som håller koll på valt datum i select och som vi sedan använder för att fetcha 
    //från backend och att köra om vår useEffect för att förbli uppdaterad
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));


    //Detta är bra för testning, men ska tas bort när userId korrekt hanteras
    const userId = "f3b107d4-80f9-4a92-9403-71f6d2518d99";

    //Funktioner för att öppna och stänga popupen, kanske skulle kunna ta bort den ena och köra 
    //en logik med ! istället för att minska kod, hade dock skadat läsbarheten
    const openModal = () => setIsMealModalOpen(true);
    const closeModal = () => setIsMealModalOpen(false);

    //Håller koll på när nya mål läggs till och ändrar mealmodal count vilket i sig trackas av useEffect
    function handleMealModalSubmits() {
        setMealModalCount(prev => prev + 1);
    }

    //Hämtar data baserat på valt datum och om mål läggs till så att den ska uppdatera dynamiskt och snyggt 
    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchMealsByUserAndDate(userId, selectedDate);
            setData(fetchedData);
        };
        console.log(mealModalCount);
        console.log(selectedDate);
        getData();
    }, [mealModalCount, selectedDate]);

    //Skapar en kombinations array av mål och måltidstyper så att vi sedan kan 
    //mappa kombinationen för att få önskat utseende på dagsöversynen
    const grouped = mealTypes.map(type => ({
        type,
        items: data.filter(item => item.mealtype === type)
    }));


    //Räknar ihop summan för dagens intag av macros
    const dailyTotals = data.reduce(
        (acc, item) => ({
            calories: acc.calories + item.calories * item.weight,
            protein: acc.protein + item.protein * item.weight,
            carbs: acc.carbs + item.carbs * item.weight,
            fats: acc.fats + item.fats * item.weight,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    return (
        <div className="flex h-screen w-screen">
            <Sidebar />

            <div className="flex-grow p-6 overflow-auto rounded-lg flex flex-col items-center">
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
                >
                    Open Popup
                </button>

                <Mealmodal
                    isOpen={isMealModalOpen}
                    onClose={closeModal}
                    onAction={handleMealModalSubmits}
                />

                <div className="flex justify-center items-center w-full mb-6 flex-col">
                    <h1 className="text-xl font-semibold">Meal Items</h1>
                    <label className="flex items-center gap-2 ml-2">
                        <p className="font-normal">Date:</p>
                        <input
                            type="date"
                            className="w-full max-w-xs rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                        />
                    </label>
                </div>

                <div className="w-full max-w-xl">
                    {grouped.map(group =>
                        group.items.length > 0 && (
                            <div key={group.type} className="mb-6">
                                <h2 className="text-lg font-bold capitalize mb-2">{group.type}</h2>
                                <ul>
                                    {group.items.map(item => (
                                        <li key={item.mealId} className="mb-2">
                                            <strong>{item.name} </strong> — {item.calories * item.weight} kcal | {item.protein * item.weight}g protein | {item.carbs * item.weight}g carbs | {item.fats * item.weight}g fat
                                        </li>
                                    ))}
                                </ul>
                                {(() => {
                                    const totals = group.items.reduce(
                                        (acc, item) => ({
                                            calories: acc.calories + item.calories * item.weight,
                                            protein: acc.protein + item.protein * item.weight,
                                            carbs: acc.carbs + item.carbs * item.weight,
                                            fats: acc.fats + item.fats * item.weight,
                                        }),
                                        { calories: 0, protein: 0, carbs: 0, fats: 0 }
                                    );
                                    return (
                                        <div className="mt-2 font-semibold">
                                            Totals: {totals.calories} kcal | {totals.protein}g protein | {totals.carbs}g carbs | {totals.fats}g fat
                                        </div>
                                    );
                                })()}
                            </div>
                        )
                    )}
                    <div className="mt-8 p-4 font-semibold text-lg ">
                        Day Total: {dailyTotals.calories} kcal | {dailyTotals.protein}g protein | {dailyTotals.carbs}g carbs | {dailyTotals.fats}g fat
                    </div>
                </div>
            </div>
        </div>
    );
}