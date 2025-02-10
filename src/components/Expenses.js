import { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Tabs, Tab, ListGroup, Alert, Modal } from "react-bootstrap";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Expenses() {
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("daily");
    const [showModal, setShowModal] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const navigate = useNavigate();

    const apiUrl = "https://expense-tracker-b35a6-default-rtdb.firebaseio.com/expenses.json";

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(apiUrl);
            if (response.data) {
                const fetchedExpenses = Object.keys(response.data).map((key) => ({
                    id: key,
                    ...response.data[key],
                }));
                setExpenses(fetchedExpenses);
            }
        } catch (error) {
            setError("Failed to load expenses.");
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();

        if (!price || !description || !category) {
            setError("All fields are required.");
            return;
        }

        const expense = {
            price,
            description,
            category,
            date: dayjs().format("YYYY-MM-DD"),
        };

        try {
            const response = await axios.post(apiUrl, expense);
            if (response.status === 200) {
                setExpenses([...expenses, { id: response.data.name, ...expense }]);
                resetForm();
            }
        } catch (error) {
            setError("Failed to add expense.");
        }
    };

    const resetForm = () => {
        setPrice("");
        setDescription("");
        setCategory("");
        setError(null);
    };

    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`https://expense-tracker-b35a6-default-rtdb.firebaseio.com/expenses/${id}.json`);
            setExpenses(expenses.filter((expense) => expense.id !== id));
        } catch (error) {
            setError("Failed to delete expense.");
        }
    };

    const handleEditExpense = (expense) => {
        setCurrentExpense(expense);
        setPrice(expense.price);
        setDescription(expense.description);
        setCategory(expense.category);
        setShowModal(true);
    };

    const handleUpdateExpense = async () => {
        if (!price || !description || !category) {
            setError("All fields are required.");
            return;
        }

        const updatedExpense = {
            price,
            description,
            category,
            date: currentExpense.date,
        };

        try {
            await axios.put(`https://expense-tracker-b35a6-default-rtdb.firebaseio.com/expenses/${currentExpense.id}.json`, updatedExpense);
            setExpenses(expenses.map((exp) => (exp.id === currentExpense.id ? { id: exp.id, ...updatedExpense } : exp)));
            closeEditModal();
        } catch (error) {
            setError("Failed to update expense.");
        }
    };

    const closeEditModal = () => {
        setShowModal(false);
        setCurrentExpense(null);
        resetForm();
    };

    const filterExpenses = (type) => {
        const today = dayjs();
        return expenses.filter((expense) => {
            const expenseDate = dayjs(expense.date);
            switch (type) {
                case "daily":
                    return expenseDate.isSame(today, "day");
                case "monthly":
                    return expenseDate.isSame(today, "month");
                case "yearly":
                    return expenseDate.isSame(today, "year");
                default:
                    return true;
            }
        });
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Daily Expenses Tracker</h2>
            <button onClick={() => navigate(-1)}>Go Back</button>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleAddExpense} className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>price Spent</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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

            <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="mb-3">
                <Tab eventKey="daily" title="Daily">
                    <ExpenseList expenses={filterExpenses("daily")} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
                </Tab>
                <Tab eventKey="monthly" title="Monthly">
                    <ExpenseList expenses={filterExpenses("monthly")} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
                </Tab>
                <Tab eventKey="yearly" title="Yearly">
                    <ExpenseList expenses={filterExpenses("yearly")} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
                </Tab>
            </Tabs>

            <Modal show={showModal} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>price Spent</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Salary">Salary</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Others">Others</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateExpense}>
                        Update Expense
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

function ExpenseList({ expenses, onEdit, onDelete }) {
    if (expenses.length === 0) {
        return <Alert variant="info">No expenses found.</Alert>;
    }

    return (
        <ListGroup>
            {expenses.map((expense) => (
                <ListGroup.Item key={expense.id} className="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{expense.category}:</strong> ${expense.price} - {expense.description} on {expense.date}
                    </div>
                    <div>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit(expense)}>
                            Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => onDelete(expense.id)}>
                            Delete
                        </Button>
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default Expenses;
