import { useState } from 'react';
import type { MealItem } from '../../types/mealtypes';
import Mealmodal from '../modals/Mealmodal';


interface MealItemListProps {
    items: MealItem[];
}

export default function MealItemList({ items }: MealItemListProps) {
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);

    const openModal = () => setIsMealModalOpen(true);
    const closeModal = () => setIsMealModalOpen(false);

    return (
        <div>
            <div className="p-4">
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Open Popup
                </button>

                <Mealmodal isOpen={isMealModalOpen} onClose={closeModal} MealItem={[]}>
                </Mealmodal>
            </div>
            <h3>Meal Items</h3>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <strong>{item.name}</strong> — {item.calories} kcal | {item.protein}g protein | {item.carbs}g carbs | {item.fat}g fat
                    </li>
                ))}
            </ul>
        </div>
    );
}