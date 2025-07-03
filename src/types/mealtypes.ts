export type MealType = 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner' | 'Evening snack';

export interface MealItem {
    mealId?: string;
    userId: string;
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

export interface DailyTotal {
    sumcalories: number; 
    sumcarbs: number; 
    sumfats: number; 
    sumfiber: number; 
    sumprotein: number; 
}

export interface OFFMealItem {
    _id: string;
    countries?: string;
    product_name: string;
    nutriments?: {
    ["energy-kcal_100g"]?: number;
    ["proteins_100g"]?: number;
    ["carbohydrates_100g"]?: number;
    ["fat_100g"]?: number;
    ["fiber_100g"]?: number;
    }
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
