import API from "@/services/Axios";
import { Account } from "@/models/Account";

export async function getAccountById(accountId: string): Promise<Account> {
    const { data } = await API.get<Account>(`/accounts/${accountId}`);
    return data;
}

export async function createAccount(account: Account): Promise<Account> {
    const { data } = await API.post<Account>(`/accounts`, account);
    return data;
}

export async function deleteAccount(accountId: string): Promise<Account> {
    const { data } = await API.delete<Account>(`/accounts/${accountId}`);
    return data;
}