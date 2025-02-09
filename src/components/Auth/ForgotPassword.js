import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent. Check your inbox.");
            setError(null);
        } catch (error) {
            setError("Failed to send reset email. Please check the email address.");
            setMessage(null);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Reset Your Password</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handlePasswordReset}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Enter your registered email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Send Reset Link
                </Button>
            </Form>

            <p className="mt-3 text-center">
                Remembered your password?{" "}
                <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    Login
                </span>
            </p>
        </Container>
    );
}

export default ForgotPassword;
