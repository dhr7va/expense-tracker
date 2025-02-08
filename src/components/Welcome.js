import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function Welcome() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };




    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6} className="text-center">
                    <h1>Welcome to Expense Tracker!!!</h1>
                    <Alert variant="warning" className="mt-3">
                        Your profile is incomplete: please complete your profile{" "}
                        <Link to="/update-profile">here</Link>.
                    </Alert>
                    <Button variant="danger" onClick={handleLogout} className="mt-3">
                        Logout
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Welcome;
