// Predefined colors for tags - shared across the application
export const TAG_COLORS = [
    '#EF4444', // red
    '#F97316', // orange
    '#F59E0B', // amber
    '#84CC16', // lime
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#3B82F6', // blue
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#F43F5E', // rose
    '#14B8A6', // teal
] as const;

export function getRandomColor(): string {
    return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}

// Generate a deterministic color based on string (for consistent colors)
export function getColorFromString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % TAG_COLORS.length;
    return TAG_COLORS[index];
}
