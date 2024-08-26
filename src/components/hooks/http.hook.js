import { useState, useCallback} from "react";

//СОБСТВЕННЫЙ ХУК ЧТОБЫ НЕ ДУБЛИРОВАТЬ КОД В КОМПОНЕНТАХ И УМЕНЬШИТ ЕГО В ОБЪЁМЕ
//В нём отслеживание ошибки, загрузки, и работа с получением данных с сервера
//Теперь не нужно в каждом компоненте прописывать логику с ошибкой и загрузкой (и лишние стэйты)

export const UseHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = "GET", body = null, headers = {"Content-type": "application/json"}) => {

        setLoading(true);

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            setLoading(false);
            return data;

        } catch(e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError};
}