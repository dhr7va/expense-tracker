import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Button, Container, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function Welcome() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            localStorage.removeItem('authToken');
            navigate("/.");
        } catch (error) {
            alert("Failed to logout. Please try again.");
        }
    };

    return (
        <Container className="mt-5 text-center">
            <Alert variant="success">Welcome to the Dashboard!</Alert>
            <Alert variant="warning" className="mt-3">
                Your profile is incomplete: please complete your profile{" "}
                <Link to="/update-profile">here</Link>.
            </Alert>
            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
        </Container>
    );
}

export default Welcome;
