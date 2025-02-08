import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
                    <Button variant="danger" onClick={handleLogout} className="mt-3">
                        Logout
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Welcome;
