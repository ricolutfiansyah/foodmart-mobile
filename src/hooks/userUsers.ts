import { useState, useEffect } from "react";
import { getUsers } from "../services/userService";
import { User } from "../types/user";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            setError('Gagal memuat data user');
        } finally {
            setLoading(false);
        }
    };

    return { users, loading, error, refetch: fetchUsers };
}