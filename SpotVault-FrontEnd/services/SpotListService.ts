import API from "@/services/Axios";
import { SpotList } from "@/models/SpotList";

export async function getListById(listId: string): Promise<SpotList> {
    const { data } = await API.get<SpotList>(`/lists/${listId}`);
    return data;
}

export async function createList(spotList: SpotList): Promise<SpotList> {
    const { data } = await API.post<SpotList>(`/lists`, spotList);
    return data;
}