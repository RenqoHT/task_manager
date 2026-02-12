'use client';

import { Input } from '@/components/ui/input';
import { User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import { Api } from '@/components/shared/services/api-client';
import { useClickAway } from 'react-use';

interface UserSelectProps {
    value?: number | null;
    onChange?: (userId: number | null) => void;
    placeholder?: string;
    className?: string;
    resetTrigger?: any; // Используется для сброса состояния при изменении
}

export const UserSelect: React.FC<UserSelectProps> = ({
    value,
    onChange,
    placeholder = 'Поиск пользователя...',
    className,
    resetTrigger
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    
    // Загрузка пользователей при монтировании компонента
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await Api.users.getUsers();
                setUsers(userData);
            } catch (err) {
                console.error('Ошибка при загрузке пользователей:', err);
            }
        };
        
        fetchUsers();
    }, []);
    
    // Закрытие выпадающего списка при клике вне его области
    useClickAway(dropdownRef, () => {
        setShowUserDropdown(false);
    });
    
    // Если значение передано, но не совпадает с текущим термином поиска, установим его
    useEffect(() => {
        if (value !== undefined && value !== null) {
            const user = users.find(u => u.user_id === value);
            if (user && user.user_login !== searchTerm) {
                setSearchTerm(user.user_login);
            }
        } else if (value === null) {
            setSearchTerm('');
        }
    }, [value, users]);

    // Сброс состояния при изменении resetTrigger
    useEffect(() => {
        if (value === null) {
            setSearchTerm('');
        }
    }, [resetTrigger, value]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        setShowUserDropdown(true);
        
        // Если поле очищено, сбрасываем выбранного пользователя
        if (!newValue) {
            onChange?.(null);
        }
    };
    
    const handleUserSelect = (user: User) => {
        onChange?.(user.user_id);
        setSearchTerm(user.user_login);
        setShowUserDropdown(false);
    };
    
    const filteredUsers = users.filter(user =>
        user.user_login.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="relative" ref={dropdownRef}>
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setShowUserDropdown(true)}
                className={cn('pr-10', className)}
            />
            {filteredUsers.length > 0 && searchTerm && showUserDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredUsers.map(user => (
                        <div
                            key={user.user_id}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                value === user.user_id ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => handleUserSelect(user)}
                        >
                            {user.user_login}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};