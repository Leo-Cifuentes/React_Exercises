import { useState, useEffect, useCallback } from 'react'

export interface User{
    id: number;
    name: string;
}

export function useUsers() {
    const [users, setUsers] =  useState<User[]>([]);
    const [error, setError] =  useState<Error | null>(null);
    const [isLoading, setIsloading] = useState(true);    

    useEffect(() => {
         let gettingData = async () => {
            try{
                const response = await fetch("https://jsonplaceholder.typicode.com/users");
                if(!response.ok){
                    throw new Error (`Error obteniendo los datos. Status : ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err){
                setError(err as Error);
            } finally{
                setIsloading(false);
            }
         }

         gettingData();         
    }, [])

    const addUser = useCallback((name : string) => {
        if(!name) return 
        const newUser : User = {
            id: Date.now(),
            name: name,
        }
        setUsers(currentUser => [...currentUser, newUser]);
    }, [users])

    return {users, error, isLoading, addUser}
}