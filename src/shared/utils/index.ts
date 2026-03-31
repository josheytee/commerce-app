// Utility helpers for common operations
export class StringUtils {
    static capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static slugify(str: string): string {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

export class DateUtils {
    static now(): Date {
        return new Date();
    }

    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}

export class ArrayUtils {
    static chunk<T>(array: T[], size: number): T[][] {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
