type ApiErrorResponse = {
    message?: string
    errors?: Record<string, string[]>
}

export function getAuthErrorMessage(errorResponse: ApiErrorResponse | null, fallbackMessage: string) {
    if (!errorResponse) {
        return fallbackMessage
    }

    const validationMessages = errorResponse.errors
        ? Object.values(errorResponse.errors).flat()
        : []

    if (validationMessages.length > 0) {
        return validationMessages.join(" ")
    }

    return errorResponse.message ?? fallbackMessage
}
