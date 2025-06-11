import { useEffect, useState } from "react";
import type { MealItem, MealType } from "../../types/mealtypes";
import { addMealItem } from "../API/MealAPICalls";
import DatePicker from "react-datepicker";

interface MealModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onAction: () => void;
}

export const mealTypes: MealType[] = [
    'breakfast',
    'lunch',
    'snack',
    'dinner',
    'evening snack'
];

const USER_ID = "f3b107d4-80f9-4a92-9403-71f6d2518d99"

const initialInput: MealItem = {
    userId: USER_ID,
    name: "",
    date: new Date().toISOString().slice(0, 10),
    mealtype: "",
    weight: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0
}

export default function Mealmodal({ isOpen, onClose, onAction }: MealModalProps) {
    const [input, setInput] = useState<MealItem>(initialInput);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });


    const handleChange = <K extends keyof MealItem>(
        field: K,
        value: MealItem[K]
    ) => {
        setInput(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!input.name.trim() || !input.mealtype || !input.date) {
            setFeedback({ message: 'Please fill in date, name and mealtype before submitting', type: 'error' })
        } else {
            try {
                //Vill justera vikten innan den skickas till backend så att den blir lättare att räkna med senare, 
                // är dock fortfarande logiskt att skicka i gram för tillfället
                const weightAdjustedInput = {
                    ...input,
                    weight: input.weight / 100,
                };
                await addMealItem(weightAdjustedInput);
                setFeedback({ message: 'MealItem added successfully!', type: 'success' });
                setInput(initialInput);
                onAction();
            } catch (error) {
                setFeedback({ message: 'Submission failed', type: 'error' });
                console.error(error);
            }
        }

    };

    useEffect(() => {
        if (!isOpen) {
            setFeedback({ message: '', type: null });
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/1 flex items-center justify-center z-50" onClick={handleOverlayClick}>
            <div className="bg-white rounded-lg p-6 relative shadow-lg min-w-[300px] max-w-[50vw] w-full">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    ×
                </button>
                <div className="mb-4 flex flex-col space-y-4 font-bold font-serif text-sm">
                    <form action="">
                        <label className="font-bold italic" htmlFor="meal-name">Name:</label>
                        <input
                            id="meal-name"
                            type="text"
                            placeholder="Enter item name"
                            className="mt-2 p-2 border rounded w-full"
                            value={input.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <label className="font-bold italic" htmlFor="date">Date:</label> <br/>
                        <DatePicker
                            id="date"
                            selected={input.date ? new Date(input.date) : new Date()}
                            onChange={date => handleChange('date', date ? (date as Date).toISOString().slice(0, 10) : "")}
                            dateFormat="yyyy-MM-dd"
                            className="mt-2 p-2 border rounded w-full"
                        /> <br/>
                        <label className="font-bold italic" htmlFor="meal-type">Meal type:</label>
                        <select
                            id="meal-type"
                            className="mt-2 p-2 border rounded w-full"
                            value={input.mealtype}
                            onChange={(e) => handleChange('mealtype', e.target.value)}
                        >
                            <option value="">Select meal type</option>
                            {mealTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                        <label className="font-bold italic" htmlFor="calories">Calories per 100g:</label>
                        <input
                            id="calories"
                            type="number"
                            placeholder="Enter amount of calories"
                            className="mt-2 p-2 border rounded w-full"
                            value={input.calories}
                            onChange={(e) => handleChange('calories', Number(e.target.value))}
                        />
                        <label className="font-bold italic" htmlFor="protein">Protein per 100g:</label>
                        <input
                            id="protein"
                            type="number"
                            placeholder="Enter amount of protein"
                            className="mt-2 p-2 border rounded w-full"
                            value={input.protein}
                            onChange={(e) => handleChange('protein', Number(e.target.value))}
                        />
                        <label className="font-bold italic" htmlFor="carbs">Carbs per 100g:</label>
                        <input
                            id="carbs"
                            type="number"
                            placeholder="Enter amount of carbs"
                            className="mt-2 p-2 border rounded w-full"
                            value={input.carbs}
                            onChange={(e) => handleChange('carbs', Number(e.target.value))}
                        />
                        <label className="font-bold italic" htmlFor="fat">Fat per 100g:</label>
                        <input
                            id="fat"
                            type="number"
                            placeholder="Enter amount of fat"
                            className="mt-2 p-2 border rounded w-full"
                            value={input.fats}
                            onChange={(e) => handleChange('fats', Number(e.target.value))}
                        />
                        <label className="font-bold italic" htmlFor="fiber">Fiber per 100g:</label>
                        <input
                            id="fiber"
                            type="number"
                            placeholder="Enter amount of fiber"
                            className="mt-2 p-2 border rounded w-full"
                            value={input.fiber}
                            onChange={(e) => handleChange('fiber', Number(e.target.value))}
                        />
                        <label className="font-bold italic" htmlFor="weight">Weight (g):</label>
                        <input
                            id="weight"
                            type="number"
                            placeholder="Enter weight in grams"
                            className="mt-2 p-2 border rounded w-full"
                            value={input.weight}
                            onChange={(e) => handleChange('weight', Number(e.target.value))}
                        />
                    </form>
                    {feedback.type === 'success' && (
                        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-center font-semibold">
                            {feedback.message}
                        </div>
                    )}
                    {feedback.type === 'error' && (
                        <div className="mt-2 p-2 bg-red-100 text-red-800 rounded text-center font-semibold">
                            {feedback.message}
                        </div>
                    )}
                </div>
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}