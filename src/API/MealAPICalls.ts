import type { MealItem } from '../types/mealtypes';
import { fetchApi } from './FetchAPI';

//Denna lär behöva göras om senare så att den enbart gettar användarens mål och inte allas, 
//kanske till och med specificera till användarens mål för just den dagen om API callsen blir för tunga 
//Bör tas bort inom kort då den är utdaterad, ska vid den punkten ta bort på backend också 
export async function fetchMeals() {
    try {
        const response = await fetchApi('/meal/getAll');
        if (!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Det blev ett problem med fetchen', error);
        return [];
    }
}

export async function fetchMealsByUserAndDate(userId: string, date: string) {
    try {
        const response = await fetchApi(
            `/meal/getByUserIdAndDate?userId=${encodeURIComponent(userId)}&date=${encodeURIComponent(date)}`
        );
        if (!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        return await response.json();
    } catch (error) {
        console.error('Det blev ett problem med fetchen', error);
        return [];
    }
}

export async function addMealItem(mealItem: MealItem) {
    try {
        const response = await fetchApi('/meal/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealItem),
        });
        if (!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        return null;
    } catch (error) {
        console.error('Problem med att lägga till målet', error);
        throw error;
    }
}

