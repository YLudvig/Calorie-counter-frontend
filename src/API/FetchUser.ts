import { fetchApi } from "./FetchAPI";
import type { User } from "../types/AuthTypes";

//Enbart för testning, måste tas bort senare 
export async function FetchAllUsers(): Promise<User[]> {
  const response = await fetchApi("/user/getAll", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users: " + response.statusText);
  }

  const data: User[] = await response.json();
  //Ytterst temporär användning 
  localStorage.setItem("allUsers", JSON.stringify(data));
  return data;
}