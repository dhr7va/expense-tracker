import { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Tabs, Tab, ListGroup, Alert } from "react-bootstrap";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function Expenses() {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("daily");
    const navigate = useNavigate();

    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) setActiveTab(savedTab);
    }, []);

    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTab", tab);
    };

    const handleAddExpense = (e) => {
        e.preventDefault();

        if (!amount || !description || !category) {
            setError("Please fill out all fields to add an expense.");
            return;
        }

        const expense = {
            amount: parseFloat(amount).toFixed(2),
            description,
            category,
            date: dayjs().format("YYYY-MM-DD"),
        };

        setExpenses([...expenses, expense]);
        setAmount("");
        setDescription("");
        setCategory("");
        setError(null);
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
            <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
                Go Back
            </Button>

            {error && <Alert variant="danger">{error}</Alert>}

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

            <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
                <Tab eventKey="daily" title="Daily">
                    <ExpenseList expenses={filterExpenses("daily")} />
                </Tab>
                <Tab eventKey="monthly" title="Monthly">
                    <ExpenseList expenses={filterExpenses("monthly")} />
                </Tab>
                <Tab eventKey="yearly" title="Yearly">
                    <ExpenseList expenses={filterExpenses("yearly")} />
                </Tab>
            </Tabs>
        </Container>
    );
}

function ExpenseList({ expenses }) {
    if (expenses.length === 0) {
        return <Alert variant="info">No expenses found.</Alert>;
    }

    return (
        <ListGroup>
            {expenses.map((expense, index) => (
                <ListGroup.Item key={index}>
                    <strong>{expense.category}:</strong> ${expense.amount} - {expense.description} on {expense.date}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default Expenses;
