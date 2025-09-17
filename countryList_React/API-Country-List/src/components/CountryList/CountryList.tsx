import { useEffect, useState } from "react";

const REST_COUNTRIES_API_URL : string = ("https://countriesnow.space/api/v0.1/countries");

type Country = {
    country: string;
    cities: string[];
};

type ApiResponse = {
    error: boolean;
    msg: string;
    data: Country[];
};

const CountryList = () => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                let response = await fetch(REST_COUNTRIES_API_URL);
                if(!response.ok){
                    throw new Error (`Error fetching data. Status: ${response.status}`);
                }
                let result = await response.json();
                setData(result);
            }catch (err){
                setError(err as Error);
            }
            finally{
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])
    
    if(isLoading){
        return <div>Loading...</div>
    }
    if (error){
        return <div>Error: ${error.message}</div>
    }
                
    return(
        <>
            <main>
                <h1>Lista de paises</h1>
                <p>Seleciona un país de la lista:</p>                
                <select name="countriesList" id="countrie-list">
                    {
                    data && data.data.map((item: Country) => 
                    <option key={item.country} value={item.country}>{item.country}</option>)
                    }
                </select>
                
            </main>        
        </>
    )
}
export default CountryList;

