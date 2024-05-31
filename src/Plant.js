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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function Plant() {
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState(new Date());
    const [expTransId, setExpTransId] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [detailType, setDetailType] = useState("debit")
    useEffect(() => {
        async function getExpense() {
        let res = await axios.get(`https://accounts-manager-api.vercel.app/getExpDetails/plant`)
        let expenseArr = res.data.records;
        let expObj = expenseArr[expenseArr.length-1];
        setExpTransId(expObj['expTransId']+1);
        }
        getExpense();
        setExpenseName('');
        setExpenseAmount('');
    }, [open])
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={12}>
                        <h5>Enter the details below for Plant:</h5>
                    </Col>
                    <Col xs={12}>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue={detailType}
                                name="radio-buttons-group"
                                onChange={changeType}>
                                <FormControlLabel value="debit" control={<Radio />} label="Debit" />
                                <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                            </RadioGroup>
                        </FormControl>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Enter description here"
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
                                <p>Select the date:</p>
                                <Col>
                                    <DatePicker selected={expenseDate} onChange={(date) => setExpenseDate(date)} />
                                </Col>
                            </Row>
                        </Container>
                        <br />
                        <Button variant="primary" size="sm" onClick={submitExpense}>Submit</Button>
                    </Col>

                </Row>
            </Container>
            {open === true &&
                <div>
                    <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                        <Alert
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}>
                            Detail is successfully saved!
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
    function changeType(evt) {
        setDetailType(evt.target.value);
    }
    async function submitExpense() {
        if (expenseName && expenseName.length > 0
            && expenseAmount && expenseAmount.length > 0) {
            let isBackDateTrans = false
            if(moment(expenseDate).format('DD-MMM-yyyy') < moment(new Date()).format('DD-MMM-yyyy')){
                isBackDateTrans = true;
            }
            let expenseBody = {
                "expenseFor": "plant",
                "expenseType": detailType,
                "expenseName": expenseName,
                "expenseAmount": expenseAmount,
                "expenseDate": moment(expenseDate).format('DD-MMM-yyyy'),
                "expTransId": expTransId,
                "isBackDateTrans": isBackDateTrans
            }
            await axios.post(`https://accounts-manager-api.vercel.app/addExpense`, expenseBody).catch(err => console.log(err));
            setOpen(true)
            setTimeout(() => setOpen(false), 3000);
            setExpTransId(expTransId+1);
        }
    }
}
export default Plant;