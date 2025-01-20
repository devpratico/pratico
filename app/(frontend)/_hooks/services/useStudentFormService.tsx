"use client"
import { set } from "lodash"
import { useState, useCallback } from "react"



export default function useStudentFormService():{
    submit: (event: any) => void
    isLoading: boolean
    error: string | null
} {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback((event: any) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

    }, []);

    return {
        submit: (event: any) => {
            event.preventDefault();
        },
        isLoading: false,
        error: null
    }
}



// TODO: Create a mutation hook (or replace this whole mess with a server action)
