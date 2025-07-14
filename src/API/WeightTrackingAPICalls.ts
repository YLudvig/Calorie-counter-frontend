import type { WeightTrackingInfo } from '../types/WeightTrackingTypes';
import { fetchApi } from './FetchAPI';

export async function fetchWeightTrackingByUser(userId: string) {
    try {
        const response = await fetchApi(
            `/weighttracking/getAllWeightTrackingItemsByUserId?userId=${encodeURIComponent(userId)}`
        );
        if (!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        return await response.json();
    } catch (error) {
        console.error('Det blev ett problem med fetchen', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function fetchCurrentWeek() {
    try {
        const response = await fetchApi(
            `/calendardate/getCurrentWeek`
        );
        if (!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        return await response.json();
    } catch (error) {
        console.error('Det blev ett problem med fetchen', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function addWeightTrackingItem(weightTrackingInfo : WeightTrackingInfo) {
    try {
        const response = await fetchApi('/weighttracking/addWeightAndCalories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(weightTrackingInfo),
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

export async function patchWeightTrackingItem(weightTrackingInfo : WeightTrackingInfo) {
    try {
        const response = await fetchApi('/weighttracking/patchWeightAndCalories', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(weightTrackingInfo),
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

export async function fetchAverages(userId: string) {
    try {
        const response = await fetchApi(
            `/weighttracking/getAveragesByUserId?userId=${encodeURIComponent(userId)}`
        );
        if (!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        return await response.json();
    } catch (error) {
        console.error('Det blev ett problem med fetchen', error);
        return { success: false, error: (error as Error).message };
    }
}