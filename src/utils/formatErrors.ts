import { ValidationError } from "@/src/types/api";

export const formatFieldErrors = (errors?: ValidationError[]) => {
    if (!errors) return {};

    return errors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
    }, {} as Record<string, string>);
};