import { useState, useEffect} from "react";

type ApiResponse = {
    error: boolean;
    msg: string;
    data: Country[];
};

export type Country = {
    country: string;
    cities: string[];
};

export function useCountries () {
    const URL_API_REQUEST : string = ("https://countriesnow.space/api/v0.1/countries");
  
    const [data, setData] = useState<ApiResponse | null>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async() => {
            try{
                const response = await fetch(URL_API_REQUEST);
                if(!response.ok){
                    throw new Error (`Error con la información. Código de estado: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err as Error);
            } finally{
                setIsLoading(false);
            }
        }
        fetchData();        
    }, [])  

    return {data, isLoading, error}     
}