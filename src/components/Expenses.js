import { useState } from "react";
import { Container, Form, Button, Row, Col, ListGroup, Alert } from "react-bootstrap";

function Expenses() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    const handleAddExpense = (e) => {
        e.preventDefault();

        if (!amount || !description || !category) {
            setError("All fields are required.");
            return;
        }

        setExpenses([
            ...expenses,
            { amount, description, category }
        ]);
        setAmount('');
        setDescription('');
        setCategory('');
        setError(null);
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Daily Expenses Tracker</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Expense Form */}
            <Form onSubmit={handleAddExpense} className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount Spent</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Salary">Salary</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Others">Others</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100">
                    Add Expense
                </Button>
            </Form>

            {/* Expense List */}
            {expenses.length > 0 && (
                <ListGroup>
                    {expenses.map((expense, index) => (
                        <ListGroup.Item key={index}>
                            <strong>{expense.category}:</strong> ${expense.amount} - {expense.description}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
}

export default Expenses;
