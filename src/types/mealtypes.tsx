export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'evening snack';

export interface MealItem {
    id?: string;
    name: string;
    mealtype: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}

export interface Meal {
    id?: string;
    type: MealType;
    items: MealItem[];
}

export interface Meals {
    date: string;
    meals: Meal[];
}
