export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'evening snack';

export interface MealItem {
    id?: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}

export interface Meal {
    id: string;
    type: MealType;
    items: MealItem[];
}

export interface Meals {
    date: string;
    meals: Meal[];
}

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'evening snack'];

export const sampleMealItems: MealItem[] = [
    {
        id: 'item1',
        name: 'Scrambled Eggs',
        calories: 200,
        protein: 12,
        carbs: 2,
        fat: 15,
        fiber: 2
    },
    {
        id: 'item2',
        name: 'Whole Wheat Toast',
        calories: 120,
        protein: 4,
        carbs: 20,
        fat: 2,
        fiber: 2
    },
    {
        id: 'item3',
        name: 'Greek Yogurt',
        calories: 100,
        protein: 10,
        carbs: 6,
        fat: 0,
        fiber: 2
    },
    {
        id: 'item4',
        name: 'Banana',
        calories: 90,
        protein: 1,
        carbs: 23,
        fat: 0.3,
        fiber: 2
    }
];