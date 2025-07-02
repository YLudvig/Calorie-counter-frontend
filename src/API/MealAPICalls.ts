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

//Denna nyttjas för att populera tabellen med dagens inputade mat för användaren 
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

//Denna nyttjas för att populera dropdown med ens tidigare val (gör det bättre för användare)
export async function fetchMealsByUser(userId: string) {
    try {
        const response = await fetchApi(
            `/meal/getByUserId?userId=${encodeURIComponent(userId)}`
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

//Denna nyttjas för att lägga till mat 
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

//Denna nyttjas för att ta bort mat från dagen 
export async function deleteMealItem(mealId: string, userId: string) {
    console.log("Deleting meal", mealId, userId);
    try {
        const response = await fetchApi(
            `/meal/delete?mealId=${encodeURIComponent(mealId)}&userId=${encodeURIComponent(userId)}`,
            { method: 'DELETE' }
        );
        if (!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        return null;
    } catch (error) {
        console.error('Problem med att lägga till målet', error);
        throw error;
    }
}

//Nyttjas för att patcha (för tillfället kan enbart vikten av ett mål patchas)
export async function patchMealItem(mealItem: MealItem) {
    console.log("Patching meal", mealItem);
    try {
        const response = await fetchApi(`/meal/patchWeight`, {
            method: 'PATCH',
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

export async function getFoodFromFoodFactsAPI(searchTerm: string) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          searchTerm
        )}&fields=product_name,_id,countries,nutriments,brands,code&json=1`);
        if (!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Det blev ett problem med fetchen', error);
        return [];
    }
}

