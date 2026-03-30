export const REGEX_PATTERNS = {
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    PHONE_NIGERIA: /^(\+234|0)[789][01]\d{8}$/,
    BUSINESS_REG_NUMBER: /^[A-Z]{2}\d{6}$/,
    STRONG_PASSWORD:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
} as const;
