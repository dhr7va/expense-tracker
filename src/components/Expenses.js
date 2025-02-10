import { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Tabs, Tab, ListGroup, Alert } from "react-bootstrap";
import dayjs from "dayjs";
import axios from "axios";

function Expenses() {
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("daily");

    const FIREBASE_URL = "https://expense-tracker-b35a6-default-rtdb.firebaseio.com/expenses.json";

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(FIREBASE_URL);
            if (response.data) {
                const fetchedExpenses = Object.keys(response.data).map(key => ({
                    id: key,
                    ...response.data[key],
                }));
                setExpenses(fetchedExpenses);
            }
        } catch (err) {
            console.error("Error fetching expenses:", err);
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
            const response = await axios.post(FIREBASE_URL, expense);
            if (response.status === 200) {
                setExpenses([...expenses, { ...expense, id: response.data.name }]);
                setPrice("");
                setDescription("");
                setCategory("");
                setError(null);
            }
        } catch (err) {
            console.error("Error adding expense:", err);
            setError("Failed to add expense.");
        }
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
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleAddExpense} className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount Spent</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Amount"
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
            {expenses.map((expense) => (
                <ListGroup.Item key={expense.id}>
                    <strong>{expense.category}:</strong> ${expense.price} - {expense.description} on {expense.date}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default Expenses;
