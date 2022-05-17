import { useHttpClient } from "../Hooks/HttpHook"

export const ReducerAction = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
    const sendAction = (conf) => {
        const { url, method, query, contentType, reducerType } = conf
        return async function (dispatch) {
            try {
                const response = await sendRequest(url, method, query, {
                    'Content-Type': contentType,
                    'access-token': localStorage.getItem('access-token')
                })
                
                dispatch({
                    type: reducerType,
                    data: response.data
                })
            }
            catch (error) {
                console.log(error);
            
            }
        }
    }
    
    
    
    return {
        sendAction
    }
}