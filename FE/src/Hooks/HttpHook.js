import { useState, useCallback, useRef, useEffect } from 'react';
import axios from "axios"
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true);
            const httpAbortCtrl = axios.CancelToken.source();
            activeHttpRequests.current.push(httpAbortCtrl);
            let axiosOptions={
                url: url,
                method: method,
                headers: headers,
                cancelToken: httpAbortCtrl.token,
                withCredentials: true
            }
            if(body!==null){
                axiosOptions.data=body
            }
            
            try {
                const response = await axios(axiosOptions); 
                activeHttpRequests.current = activeHttpRequests.current.filter(
                    reqCtrl => reqCtrl !== httpAbortCtrl
                );
                console.log(response);
                if (response.status !== 200) {
                    console.log(response);
                    throw new Error(response);

                }

                setIsLoading(false);
                return response;
            } catch (err) {
                setError(err);
                setIsLoading(false);
                throw err;
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
        
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.cancel());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};
