import { useEffect, useState } from 'react';
import Mealmodal from '../modals/Mealmodal';
import { fetchMeals } from '../API/MealAPICalls';
import type { MealItem } from '../../types/mealtypes';
import Sidebar from '../sidebar/Sidebar';



export default function MealItemList() {
    const [mealModalCount, setMealModalCount] = useState(0);
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [data, setData] = useState<MealItem[]>([]);

    const openModal = () => setIsMealModalOpen(true);
    const closeModal = () => setIsMealModalOpen(false);

    function handleMealModalSubmits() {
        setMealModalCount(prev => prev + 1);
    }

    useEffect(() => {
        const getData = async () => {
            const fetchedData = await fetchMeals();
            setData(fetchedData);
        };
        console.log(mealModalCount);
        getData();
    }, [mealModalCount]);

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

                <div className="flex justify-center items-center w-full mb-6">
                    <h1 className="text-xl font-semibold">Meal Items</h1>
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