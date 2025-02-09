import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, sendEmailVerification } from "firebase/auth";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";

function Welcome() {
    const [isVerified, setIsVerified] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            setIsVerified(user.emailVerified);
        }
    }, [user]);

    const handleSendVerificationEmail = async () => {
        try {
            if (user && !user.emailVerified) {
                await sendEmailVerification(user);
                setEmailSent(true);
                setError(null);
            }
        } catch (err) {
            setError("Error sending verification email. Please try again later.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (error) {
            alert("Failed to logout. Please try again.");
        }
    };

    return (
        <Container className="mt-5 text-center">
            {user && (
                <Alert variant="success">
                    Welcome, <strong>{user.email}</strong>
                </Alert>
            )}

            {!isVerified ? (
                <>
                    <Alert variant="warning">
                        Your profile is incomplete. Please verify your email.
                    </Alert>
                    {emailSent && <Alert variant="info">Verification email sent. Check your inbox.</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                </>
            ) : (
                <Alert variant="success">Your profile is complete. Thank you!</Alert>
            )}

            <Row className="mt-4">
                {!isVerified && (
                    <Col>
                        <Button variant="primary" onClick={handleSendVerificationEmail}>
                            Send Verification Email
                        </Button>
                    </Col>
                )}
                <Col>
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Welcome;
