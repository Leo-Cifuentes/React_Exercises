import { useState } from "react";
import { Card, Container, Dropdown, Row,Col, Spinner } from "react-bootstrap";
import { useCountries, type Country } from "../../hooks/useCountries";

const TestCountry = () => {
    const {data, isLoading, error} = useCountries();
    const [selectedItem, setSelectedItem] = useState("Paises");

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedItem(eventKey);
        }
    }
     if(isLoading){
        return <div>Cargando...</div>
    }
    if(error){
        return <div>Error: {error.message}</div>
    }

    return(
        <>
        <Container fluid="lg">
            <Card border="dark" style={{minWidth:"600px"}}>
                <Card.Img variant="top" src="../../../src/assets/banner-mundo.png" />
                <Card.Body>
                    <Card.Title><h2>Lista de paises</h2></Card.Title>
                    <Card.Text>Seleciona un país de la lista:</Card.Text>


                        <Row>
                            <Col lg={{ span: 5, offset: 7 }}>
                                <Dropdown align={{lg: "start"}} onSelect={handleSelect}>
                                    <div className="">
                                    <Dropdown.Toggle variant="dark"> {selectedItem} </Dropdown.Toggle>
                                    </div>
                                    <Dropdown.Menu style={{ maxHeight: "240px", overflowY: "scroll" }}>
                                        {
                                            data && data.data.map((item: Country) =>
                                                <Dropdown.Item eventKey={item.country}>{item.country}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>                                    
                                </Dropdown>
                            </Col>
                        </Row>


                </Card.Body>               
            </Card>     
        </Container>   
        </>
    )
}
export default TestCountry