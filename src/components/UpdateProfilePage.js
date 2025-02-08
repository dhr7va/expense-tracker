import React, { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import axios from "axios";

export default function UpdateProfilePage() {
    const [fullName, setFullName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [message, setMessage] = useState(null);

    const handleUpdate = async () => {
        const idToken = "YOUR_USER_ID_TOKEN";
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=YOUR_API_KEY`;

        try {
            const response = await axios.post(url, {
                idToken,
                displayName: fullName,
                photoUrl,
                returnSecureToken: true,
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            setMessage({
                type: "danger",
                text: "Failed to update profile. Please try again.",
            });
        }
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

                <Button variant="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </Form>
        </Container>
    );
}
