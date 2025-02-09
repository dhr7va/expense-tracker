import React, { useState, useEffect } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";

export default function UpdateProfilePage() {
    const [fullName, setFullName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [message, setMessage] = useState(null);
    const [idToken, setIdToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIdToken = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const token = await user.getIdToken();
                    setIdToken(token);
                } else {
                    setMessage({ type: "danger", text: "User not logged in." });
                }
            } catch (error) {
                setMessage({ type: "danger", text: "Failed to retrieve token." });
            }
        };
        fetchIdToken();
    }, []);

    const handleUpdate = async () => {
        if (!idToken) {
            setMessage({ type: "danger", text: "Invalid user session." });
            return;
        }

        const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAkZ5_k7xtuob1y7lly0zFobPUCnKwI-KU`;

        try {
            await axios.post(url, {
                idToken,
                displayName: fullName,
                photoUrl,
                returnSecureToken: true,
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            setMessage({
                type: "danger",
                text: error.response?.data?.error?.message || "Failed to update profile. Please try again.",
            });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <Container className="mt-5">
            <h2>Update Profile</h2>
            {message && <Alert variant={message.type}>{message.text}</Alert>}
            <Form>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="photoUrl">
                    <Form.Label>Profile Photo URL</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter profile photo URL"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                    />
                </Form.Group>

                <div className="d-flex justify-content-between">
                    <Button variant="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Container>
    );
}
