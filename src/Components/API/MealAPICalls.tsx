//Denna lär behöva göras om senare så att den enbart gettar användarens mål och inte allas, 
// kanske till och med specificera till användarens mål för just den dagen om API callsen blir för tunga 
export async function fetchMeals(){
    try {
        const response = await fetch('http://localhost:8080/api/meal/getAll'); 
        if(!response.ok) {
            throw new Error('Problem med nätverksresponsen');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Det blev ett problem med fetchen', error); 
        return [];
    }
}