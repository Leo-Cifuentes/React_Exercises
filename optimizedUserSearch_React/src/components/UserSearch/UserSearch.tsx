import { useState, useEffect, useRef, useMemo } from 'react'
import { useUsers } from '../../hooks/useUsers';

function UserSearch() {    
    const {users, error, isLoading, addUser} = useUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef <HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    const filteredUsers = useMemo(() => {
        console.log("Calculando usuarios filtrados...");
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm])

    const handleAddClick = () => {
        addUser(searchTerm);
        setSearchTerm("");
    }

    if(error){
        return <div>Error:{error.message}</div>
    }
    if(isLoading){
        return <div>Cargando...</div>
    }

    return(
        <>
            <h2>Buscador de Usuarios</h2>
            <input
                ref={inputRef}
                type="text"
                placeholder="Escribe un nomnbre para buscar o añadir..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <button onClick={handleAddClick}>Añadir usuario</button>
            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </>
    )

}

export default UserSearch;