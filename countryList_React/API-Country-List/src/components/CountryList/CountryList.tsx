import { useEffect, useState } from "react";
import { Card, Container, Dropdown } from "react-bootstrap"


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
    const [selectedItem, setSelectedItem] = useState("Paises")

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

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedItem(eventKey);
        }
    }
                
    return(
        <>
        <Container fluid="lg">
            <Card border="dark" style={{minWidth:"600px"}}>
                <Card.Img variant="top" src="../../../src/assets/banner-mundo.png" />
                <Card.Body>
                    <Card.Title><h2>Lista de paises</h2></Card.Title>
                    <Card.Text>Seleciona un país de la lista:</Card.Text>             
                    <Dropdown onSelect={handleSelect}>
                        <Dropdown.Toggle variant="dark"> {selectedItem} </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight:"240px", overflowY:"scroll"}}>
                        {
                            data && data.data.map((item: Country) => 
                            <Dropdown.Item eventKey={item.country}>{item.country}</Dropdown.Item>)
                        }
                        </Dropdown.Menu>
                    </Dropdown>
                </Card.Body>               
            </Card>     
        </Container>   
        </>
    )
}
export default CountryList;

