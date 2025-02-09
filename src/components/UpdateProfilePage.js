import React, { useState, useEffect } from "react";
import { Button, Form, Container, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
    const [fullName, setFullName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [message, setMessage] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const idToken = await user.getIdToken();
                const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAkZ5_k7xtuob1y7lly0zFobPUCnKwI-KU`;

                try {
                    const response = await axios.post(url, { idToken });
                    const userData = response.data.users[0];

                    setFullName(userData.displayName || "");
                    setPhotoUrl(userData.photoUrl || "");

                    setProfileData({
                        displayName: userData.displayName || "Not set",
                        photoUrl: userData.photoUrl || "https://via.placeholder.com/150",
                    });
                } catch (error) {
                    setMessage({ type: "danger", text: "Failed to load profile data." });
                }
            } else {
                setMessage({ type: "danger", text: "User not logged in." });
            }
        };

        fetchProfileData();
    }, []);

    const handleUpdate = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setMessage({ type: "danger", text: "User not logged in." });
            return;
        }

        const idToken = await user.getIdToken();
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAkZ5_k7xtuob1y7lly0zFobPUCnKwI-KU`;

        try {
            await axios.post(url, {
                idToken,
                displayName: fullName,
                photoUrl,
                returnSecureToken: true,
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });

            setProfileData({
                displayName: fullName,
                photoUrl: photoUrl || "https://via.placeholder.com/150",
            });

            setFullName("");
            setPhotoUrl("");
        } catch (error) {
            setMessage({ type: "danger", text: "Failed to update profile." });
        }
    };
    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <Container className="mt-5">
            <h2>Update Profile</h2>
            {message && <Alert variant={message.type}>{message.text}</Alert>}

            {profileData && (
                <Card className="mb-4">
                    <Card.Body className="text-center">
                        <Card.Img
                            variant="top"
                            src={profileData.photoUrl}
                            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                        />
                        <Card.Title className="mt-3">{profileData.displayName}</Card.Title>
                        <Card.Text>Your profile is currently displayed as shown above.</Card.Text>
                    </Card.Body>
                    <Button variant="primary" onClick={() => navigate("/expenses")}>
                        Track Daily Expenses
                    </Button>
                </Card>
            )}

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
