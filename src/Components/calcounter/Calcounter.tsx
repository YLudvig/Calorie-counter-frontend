import { useEffect, useState } from 'react';
import Mealmodal from '../modals/Mealmodal';
import { fetchMeals } from '../API/MealAPICalls';
import type { MealItem } from '../../types/mealtypes';



export default function MealItemList() {
    const [mealModalCount, setMealModalCount] = useState(0);
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [data, setData] = useState<MealItem[]>([]);

    const openModal = () => setIsMealModalOpen(true);
    const closeModal = () => setIsMealModalOpen(false);

    function handleMealModalSubmits(){
        setMealModalCount(prev => prev +1);
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
        <div>
            <div className="p-4">
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Open Popup
                </button>

                <Mealmodal isOpen={isMealModalOpen} onClose={closeModal} onAction={handleMealModalSubmits}>
                </Mealmodal>
            </div>
            <h3>Meal Items</h3>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        <strong>{item.name}</strong> — {item.calories} kcal | {item.protein}g protein | {item.carbs}g carbs | {item.fat}g fat
                    </li>
                ))}
            </ul>
        </div>
    );
}