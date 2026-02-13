'use client';

import { Input } from '@/components/ui/input';
import { User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Api } from '@/components/shared/services/api-client';
import { useClickAway } from 'react-use';

interface UserSelectProps {
    value?: number | null;
    onChange?: (userId: number | null) => void;
    placeholder?: string;
    className?: string;
}

export const UserSelect: React.FC<UserSelectProps> = ({
    value,
    onChange,
    placeholder = 'Поиск пользователя...',
    className
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Загрузка данных один раз
    useEffect(() => {
        Api.users.getUsers().then(setUsers).catch(console.error);
    }, []);

    // Синхронизация инпута с внешним value (например, при сбросе формы)
    useEffect(() => {
        if (value === null || value === undefined) {
            setInputValue('');
        } else {
            const user = users.find(u => u.user_id === value);
            if (user) setInputValue(user.user_login);
        }
    }, [value, users]);

    useClickAway(containerRef, () => setIsOpen(false));

    // Мемоизированная фильтрация
    const filteredUsers = useMemo(() => {
        if (!inputValue) return [];
        const lowerQuery = inputValue.toLowerCase();
        return users.filter(u => u.user_login.toLowerCase().includes(lowerQuery));
    }, [users, inputValue]);

    const handleSelect = (user: User) => {
        setInputValue(user.user_login);
        onChange?.(user.user_id);
        setIsOpen(false);
    };

    const handleBlur = () => {
        // Проверяем, есть ли точное совпадение введенного текста
        const matchedUser = users.find(u => u.user_login.toLowerCase() === inputValue.toLowerCase());
        
        if (matchedUser) {
            // Если совпадение есть, фиксируем его (нормализация регистра)
            if (matchedUser.user_login !== inputValue) setInputValue(matchedUser.user_login);
            if (matchedUser.user_id !== value) onChange?.(matchedUser.user_id);
        } else {
            // Если совпадения нет, сбрасываем
            setInputValue('');
            onChange?.(null);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <Input
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={className}
            />

            {isOpen && inputValue && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredUsers.map(user => (
                        <div
                            key={user.user_id}
                            className={cn(
                                "px-4 py-2 cursor-pointer hover:bg-gray-100",
                                value === user.user_id && "bg-blue-50 font-medium"
                            )}
                            // Предотвращаем blur инпута при клике на пункт списка
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelect(user)}
                        >
                            {user.user_login}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};