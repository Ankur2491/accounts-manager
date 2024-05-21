import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from "react-datepicker";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import moment from 'moment';

function Plant() {
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState(new Date());
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        setExpenseName('');
        setExpenseAmount('');
    }, [])
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <h5>Enter the expense below for Plant:</h5>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Enter expense name here"
                                aria-label="expenseName" onChange={changeExpenseName} value={expenseName}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>₹</InputGroup.Text>
                            <Form.Control type="number" onChange={changeExpenseAmount} value={expenseAmount}
                                placeholder='Enter the amount here' />
                        </InputGroup>
                        <Container fluid>
                            <Row>
                                <p>Select the date of expense:</p>
                                <Col>
                                    <DatePicker selected={expenseDate} onChange={(date) => setExpenseDate(date)} />
                                </Col>
                            </Row>
                        </Container>
                        <br />
                        <Button variant="primary" size="sm" onClick={submitExpense}>Submit Expense</Button>
                    </Col>

                </Row>
            </Container>
            { open === true &&
            <div>
                <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{vertical:'bottom', horizontal: 'center'}}>
                    <Alert
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}>
                        Expense is successfully saved!
                    </Alert>
                </Snackbar>
            </div>
}
        </div>
    )
    function changeExpenseName(evt) {
        setExpenseName(evt.target.value)
    }
    function changeExpenseAmount(evt) {
        setExpenseAmount(evt.target.value)
    }
    async function submitExpense() {
        if (expenseName && expenseName.length > 0
            && expenseAmount && expenseAmount.length > 0) {
            let expenseBody = {
                "expenseFor": "plant",
                "expenseName": expenseName,
                "expenseAmount": expenseAmount,
                "expenseDate": moment(expenseDate).format('DD-MMM-yyyy')
            }
            console.log(expenseBody);
            let res = await axios.post(`https://accounts-manager-api.vercel.app/addExpense`, expenseBody).catch(err => console.log(err));
            setOpen(true)
            setTimeout(()=>setOpen(false), 3000);
            console.log(res)
        }
    }
}
export default Plant;