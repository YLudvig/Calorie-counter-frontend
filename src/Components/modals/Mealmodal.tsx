import { useEffect, useState } from "react";
import { type MealItem, type MealType, type OFFMealItem } from "../../types/mealtypes";
import { addMealItem, fetchMealsByUser, getFoodFromFoodFactsAPI } from "../../API/MealAPICalls";
import type { User } from "../../types/AuthTypes";

interface MealModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onAction: () => void;
    user: User;
    selectedDate: string;
}

export const mealTypes: MealType[] = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack'
];

export const amount = [
    'ml',
    'g',
    'pieces'
]

export default function Mealmodal({ isOpen, onClose, onAction, user, selectedDate }: MealModalProps) {
    const initialInput: MealItem = {
        userId: user.userId,
        name: "",
        date: new Date().toISOString().slice(0, 10),
        mealtype: "",
        weight: 0,
        volume: 0,
        pieces: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0
    }

    const [input, setInput] = useState<MealItem>(initialInput);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    //State som har datan vi hämtar från backend
    const [data, setData] = useState<MealItem[]>([]);

    const [OFFdata, setOFFdata] = useState<OFFMealItem[]>([]);

    const [selectedMealId, setSelectedMealId] = useState<string>("");

    const [selectedOFFMealId, setSelectedOFFMealId] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [selectedUnit, setSelectedUnit] = useState<string>("g");


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
        if (!input.name.trim() && !input.mealtype && !input.weight) {
            setFeedback({ message: 'Please fill in  name, weight and mealtype before submitting', type: 'error' })
        } else if (!input.name.trim() && !input.mealtype) {
            setFeedback({ message: 'Please fill in name and mealtype before submitting', type: 'error' })
        } else if (!input.name.trim() && !input.weight) {
            setFeedback({ message: 'Please fill in name and weight before submitting', type: 'error' })
        } else if (!input.name.trim()) {
            setFeedback({ message: 'Please fill in name before submitting', type: 'error' })
        } else if (!input.weight && !input.mealtype) {
            setFeedback({ message: 'Please fill in mealtype and weight before submitting', type: 'error' })
        } else if (
            (selectedUnit === 'g' && !input.weight) ||
            (selectedUnit === 'ml' && !input.volume) ||
            (selectedUnit === 'pieces' && !input.pieces)
        ) {
            setFeedback({ message: `Please fill in ${selectedUnit === 'g' ? 'weight' : selectedUnit === 'ml' ? 'volume' : 'pieces'} before submitting`, type: 'error' })
        } else if (!input.mealtype) {
            setFeedback({ message: 'Please fill in mealtype before submitting', type: 'error' })
        } else {
            try {
                // Vill justera vikten innan den skickas till backend så att den blir lättare att räkna med senare, 
                // är dock fortfarande logiskt att skicka i gram för tillfället
                const weightAdjustedInput = {
                    ...input,
                    pieces: selectedUnit === 'pieces' ? input.pieces : 0,
                    volume: selectedUnit === 'ml' ? input.volume / 100 : 0,
                    weight: selectedUnit === 'g' ? input.weight / 100 : 0,
                    userId: user.userId,
                    date: selectedDate,
                };
                await addMealItem(weightAdjustedInput);
                setFeedback({ message: 'MealItem added successfully!', type: 'success' });
                setSelectedMealId("");
                setInput(initialInput);
                onAction();
            } catch (error) {
                setFeedback({ message: 'Submission failed', type: 'error' });
                console.error(error);
            }
        }

    };

    const filterOFFDataByCountry = (productlist: OFFMealItem[], countries: string[]) => {
        return productlist.filter((product) => {
            if (!product.countries) return false;

            // Normalize for consistent comparison
            const productCountries = product.countries.toLowerCase();
            return countries.some(country =>
                productCountries.includes(country.toLowerCase())
            );
        });
    };

    const relevantCountries = ["Sweden", "Denmark", "Finland", "Sverige", "Tyskland", "Germany", "Deutschland", "Untied States", "United Kingdom"];

    const handleSubmitInputOFFAPI = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm != null) {
            getFoodFromFoodFactsAPI(searchTerm)
                .then(data => filterOFFDataByCountry(data.products || [], relevantCountries))
                .then(filtered => setOFFdata(filtered))
                .catch(console.error);
            console.log(OFFdata);
        }
    }

    useEffect(() => {
        if (selectedOFFMealId !== "") {
            setSelectedMealId("");
        }
    }, [selectedOFFMealId]);

    useEffect(() => {
        if (selectedMealId !== "") {
            setSelectedOFFMealId("");
        }
    }, [selectedMealId]);

    useEffect(() => {
        if (selectedMealId === "" && selectedOFFMealId === "") {
            setInput(initialInput);
        }
    }, [selectedOFFMealId, selectedMealId]);

    useEffect(() => {
        fetchMealsByUser(user.userId)
            .then(setData)
            .catch(console.error);
        console.log(data);
        if (!isOpen) {
            setFeedback({ message: '', type: null });
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    function handleClose() {
        setInput(initialInput);
        setSelectedMealId("");
        setSelectedOFFMealId("");
        setSearchTerm("");
        setSelectedUnit("g");
        setOFFdata([]);
        onClose();
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/1 flex items-center justify-center z-50" onClick={handleOverlayClick}>
            <div className="bg-white rounded-lg p-6 relative shadow-lg min-w-[300px] max-w-[35vw] w-full">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                >
                    ×
                </button>
                <form onSubmit={handleSubmitInputOFFAPI}>
                    <div className="relative mt-2">
                        <input type="text"
                            className="peer block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder=""
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            required
                        />
                        <label
                            htmlFor="search-food"
                            className="absolute left-2 top-0 z-10 -translate-y-2 transform bg-white px-1 text-xs text-gray-500 transition-all 
                                       peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-sm 
                                       peer-focus:-translate-y-2 peer-focus:text-xs peer-disabled:bg-transparent"
                        >
                            Search for food
                        </label>

                    </div>
                    <button type="submit" className="px-4 py-2 p-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600">Search</button>
                </form>
                <div className="mb-4 flex flex-col space-y-4 font-bold font-serif text-sm">
                    <form action="">
                        <select className="mt-2 p-2 border rounded w-full"
                            value={selectedOFFMealId}

                            onChange={(e) => {
                                const id = e.target.value;
                                setSelectedOFFMealId(id);

                                const selected = OFFdata.find(item => item._id === id);
                                if (selected) {
                                    console.log(selected);
                                    setInput(prev => ({
                                        ...prev,
                                        name: selected.product_name,
                                        calories: selected.nutriments?.["energy-kcal_100g"] ?? 0,
                                        protein: selected.nutriments?.["proteins_100g"] ?? 0,
                                        carbs: selected.nutriments?.["carbohydrates_100g"] ?? 0,
                                        fats: selected.nutriments?.["fat_100g"] ?? 0,
                                        fiber: selected.nutriments?.["fiber_100g"] ?? 0
                                    }))
                                }
                            }}
                        >

                            <option value="">
                                Select from food you searched for
                            </option>
                            {OFFdata.map((food) => <option value={food._id} key={food._id}>
                                {food.product_name + ' (' + (food.brands) + ')'}
                            </option>)}
                        </select>
                        <select className="mt-2 p-2 border rounded w-full"
                            value={selectedMealId}

                            onChange={(e) => {
                                const mealId = e.target.value;
                                setSelectedMealId(mealId);

                                const selected = data.find(item => item.mealId === mealId);
                                if (selected) {
                                    console.log(selected);
                                    setInput(prev => ({
                                        ...prev,
                                        name: selected.name,
                                        calories: selected.calories,
                                        protein: selected.protein,
                                        carbs: selected.carbs,
                                        fats: selected.fats,
                                        fiber: selected.fiber
                                    }))
                                }
                            }}
                        >

                            <option value="">
                                Select from food you previously added
                            </option>
                            {data.map((food) => <option value={food.mealId} key={food.mealId}>
                                {food.name} ({food.date})
                            </option>)}
                        </select>
                        <div className="relative mt-6">
                            <input
                                id="meal-name"
                                type="text"
                                placeholder=" "
                                className="peer block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                value={input.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                            <label
                                htmlFor="meal-name"
                                className="absolute left-2 top-0 z-10 -translate-y-2 transform bg-white px-1 text-xs italic font-bold text-gray-500 transition-all
                                           peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-sm
                                           peer-focus:-translate-y-2 peer-focus:text-xs"
                            >
                                Name:
                            </label>
                        </div>

                        <div className="relative mt-4">
                            <select
                                id="meal-type"
                                className="peer block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                                value={input.mealtype}
                                onChange={(e) => handleChange('mealtype', e.target.value)}
                            >
                                <option value="">Select meal</option>
                                {mealTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <label
                                htmlFor="meal-type"
                                className="absolute left-2 top-0 z-10 -translate-y-2 transform bg-white px-1 text-xs text-gray-500 transition-all
                                           peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-sm
                                           peer-focus:-translate-y-2 peer-focus:text-xs peer-disabled:bg-transparent"
                            >
                                Meal
                            </label>
                        </div>

                        <div className="relative mt-4">
                            <select
                                id="unit-selector"
                                className="peer block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                            >
                                {amount.map(unit => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                            <label
                                htmlFor="unit-selector"
                                className="absolute left-2 top-0 z-10 -translate-y-2 transform bg-white px-1 text-xs text-gray-500 transition-all
                                            peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-sm
                                            peer-focus:-translate-y-2 peer-focus:text-xs peer-disabled:bg-transparent"
                            >
                                Unit
                            </label>
                        </div>


                        <div className="grid grid-cols-12 gap-4 mt-6">
                            {[
                                { label: 'Calories (kcal)', field: 'calories' },
                                { label: 'Protein (g)', field: 'protein' },
                                { label: 'Carbs (g)', field: 'carbs' },
                                { label: 'Fats (g)', field: 'fats' },
                                { label: 'Fiber (g)', field: 'fiber' },
                                { label: 'Weight', field: 'weight' } // Base label will be replaced below
                            ].map(({ label, field }) => {
                                // Dynamically adjust the label for weight based on selectedUnit
                                if (field === 'weight') {
                                    label =
                                        selectedUnit === 'g'
                                            ? 'Weight (g)'
                                            : selectedUnit === 'ml'
                                                ? 'Volume (ml)'
                                                : selectedUnit === 'pieces'
                                                    ? 'Pieces'
                                                    : 'Weight';
                                }

                                return (
                                    <div key={field} className="col-span-6 relative">
                                        <input
                                            id={field}
                                            type="number"
                                            placeholder=""
                                            className="peer block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                            value={
                                                field === "weight"
                                                    ? selectedUnit === "g"
                                                        ? input.weight
                                                        : selectedUnit === "ml"
                                                            ? input.volume
                                                            : selectedUnit === "pieces"
                                                                ? input.pieces
                                                                : input.weight
                                                    : (input[field as keyof MealItem] as number)
                                            }
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                if (field === "weight") {
                                                    if (selectedUnit === "g") handleChange("weight", val);
                                                    else if (selectedUnit === "ml") handleChange("volume", val);
                                                    else if (selectedUnit === "pieces") handleChange("pieces", val);
                                                } else {
                                                    handleChange(field as keyof MealItem, val);
                                                }
                                            }}
                                            required
                                        />
                                        <label
                                            htmlFor={field}
                                            className="absolute left-2 top-0 z-10 -translate-y-2 transform bg-white px-1 text-xs italic font-bold text-gray-500 transition-all
                                                        peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-sm
                                                        peer-focus:-translate-y-2 peer-focus:text-xs"
                                        >
                                            {label}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
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
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}