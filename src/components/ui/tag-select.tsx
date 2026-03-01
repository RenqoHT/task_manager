'use client';

import { Input } from '@/components/ui/input';
import { Tag } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Api } from '@/components/shared/services/api-client';
import { useClickAway } from 'react-use';
import { X } from 'lucide-react';
import { getRandomColor, getColorFromString } from '@/lib/tag-colors';

interface TagSelectProps {
    value?: Tag[];
    onChange?: (tags: Tag[]) => void;
    placeholder?: string;
    className?: string;
}

export const TagSelect: React.FC<TagSelectProps> = ({
    value = [],
    onChange,
    placeholder = 'Добавить тег...',
    className
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(value);

    // Load all tags on mount
    useEffect(() => {
        Api.tags.getTags().then(setAllTags).catch(console.error);
    }, []);

    // Sync with external value
    useEffect(() => {
        setSelectedTags(value);
    }, [value]);

    useClickAway(containerRef, () => setIsOpen(false));

    // Filter tags based on input and exclude already selected
    const filteredTags = useMemo(() => {
        const lowerQuery = inputValue.toLowerCase().trim();
        return allTags
            .filter(t => {
                // Exclude already selected tags (by ID or name)
                const isSelected = selectedTags.some(
                    st => st.tag_id === t.tag_id || st.name.toLowerCase() === t.name.toLowerCase()
                );
                if (isSelected) return false;
                // Filter by search query
                if (!lowerQuery) return true;
                return t.name.toLowerCase().includes(lowerQuery);
            })
            .slice(0, 10);
    }, [allTags, inputValue, selectedTags]);

    // Check if we should show "Create new" option
    const canCreateNew = useMemo(() => {
        if (!inputValue.trim()) return false;
        const lowerInput = inputValue.toLowerCase().trim();
        return !allTags.some(t => t.name.toLowerCase() === lowerInput);
    }, [allTags, inputValue]);

    const handleSelectTag = useCallback((tag: Tag) => {
        // Check if tag is already selected (by ID or by name for new tags)
        const isAlreadySelected = selectedTags.some(
            t => t.tag_id === tag.tag_id || t.name.toLowerCase() === tag.name.toLowerCase()
        );
        if (isAlreadySelected) {
            setInputValue('');
            return;
        }
        const newTags = [...selectedTags, tag];
        setSelectedTags(newTags);
        onChange?.(newTags);
        setInputValue('');
        inputRef.current?.focus();
    }, [selectedTags, onChange]);

    const handleCreateNewTag = useCallback(() => {
        const trimmedName = inputValue.trim();
        if (!trimmedName) return;

        // Check if a tag with this name is already selected
        const isAlreadySelected = selectedTags.some(
            t => t.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (isAlreadySelected) {
            setInputValue('');
            setIsOpen(false);
            return;
        }

        // Use deterministic color based on tag name for consistency
        const tagColor = getColorFromString(trimmedName);

        // Create a temporary tag object (will be created on server when post is saved)
        const newTag: Tag = {
            tag_id: 0, // Will be assigned by server
            name: trimmedName,
            color: tagColor,
            created_at: new Date()
        };

        const newTags = [...selectedTags, newTag];
        setSelectedTags(newTags);
        onChange?.(newTags);
        setInputValue('');
        setIsOpen(false);
        inputRef.current?.focus();
    }, [inputValue, selectedTags, onChange]);

    const handleRemoveTag = useCallback((tagToRemove: Tag) => {
        const newTags = selectedTags.filter(t => 
            t.tag_id !== tagToRemove.tag_id || t.name !== tagToRemove.name
        );
        setSelectedTags(newTags);
        onChange?.(newTags);
    }, [selectedTags, onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredTags.length > 0) {
                handleSelectTag(filteredTags[0]);
            } else if (canCreateNew) {
                handleCreateNewTag();
            }
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            handleRemoveTag(selectedTags[selectedTags.length - 1]);
        }
    }, [filteredTags, canCreateNew, inputValue, selectedTags, handleSelectTag, handleCreateNewTag, handleRemoveTag]);

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Selected tags display */}
            <div 
                className="min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors flex flex-wrap gap-2 cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {selectedTags.map((tag, index) => (
                    <span
                        key={`${tag.tag_id}-${tag.name}-${index}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: tag.color }}
                    >
                        {tag.name}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTag(tag);
                            }}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedTags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[80px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-6"
                />
            </div>

            {/* Dropdown */}
            {isOpen && (filteredTags.length > 0 || canCreateNew) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {/* Create new option */}
                    {canCreateNew && (
                        <div
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 flex items-center gap-2"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleCreateNewTag}
                        >
                            <span className="text-gray-500">Создать тег:</span>
                            <span 
                                className="px-2 py-0.5 rounded text-xs font-medium text-white"
                                style={{ backgroundColor: getColorFromString(inputValue.trim()) }}
                            >
                                {inputValue.trim()}
                            </span>
                        </div>
                    )}
                    
                    {/* Existing tags */}
                    {filteredTags.map(tag => (
                        <div
                            key={tag.tag_id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectTag(tag)}
                        >
                            <span 
                                className="px-2 py-0.5 rounded text-xs font-medium text-white"
                                style={{ backgroundColor: tag.color }}
                            >
                                {tag.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
