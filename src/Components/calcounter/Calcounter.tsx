import { useEffect, useState } from 'react';
import Mealmodal from '../modals/Mealmodal';
import { fetchMealsByUserAndDate } from '../API/MealAPICalls';
import type { MealItem } from '../../types/mealtypes';
import Sidebar from '../sidebar/Sidebar';

export default function MealItemList() {
    const [mealModalCount, setMealModalCount] = useState(0);
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [data, setData] = useState<MealItem[]>([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

    //Detta är bra för testning, men ska tas bort när userId korrekt hanteras
    const userId = "f3b107d4-80f9-4a92-9403-71f6d2518d99";

    const openModal = () => setIsMealModalOpen(true);
    const closeModal = () => setIsMealModalOpen(false);

    function handleMealModalSubmits() {
        setMealModalCount(prev => prev + 1);
    }

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchMealsByUserAndDate(userId, selectedDate);
            setData(fetchedData);
        };
        console.log(mealModalCount);
        console.log(selectedDate);
        getData();
    }, [mealModalCount, selectedDate]);

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
                            className="p-2 border rounded"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                        />
                    </label>
                </div>

                <ul className="w-full max-w-xl">
                    {data.map((item) => (
                        <li key={item.mealid} className="mb-2">
                            <strong>{item.name}</strong> — {item.calories} kcal | {item.protein}g protein | {item.carbs}g carbs | {item.fats}g fat
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}