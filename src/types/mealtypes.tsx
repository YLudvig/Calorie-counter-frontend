export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'evening snack';

export interface MealItem {
    mealid?: string;
    userid: string;
    date: string;
    name: string;
    weight: number;
    mealtype: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
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
