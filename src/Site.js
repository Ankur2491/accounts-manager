import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useEffect, useState } from 'react';
import allSites from './mockData/sites';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function editSite() {
    console.log("Hello");
}

function Site() {
    const [siteList, setSiteList] = useState(allSites.sites);
    const [selectedSite, setSelectedSite] = useState('Select Site');
    const [expenseType, setExpenseType] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState(new Date());

    useEffect(() => {
        setExpenseType('');
        setExpenseAmount('');
    }, [selectedSite])
    return (
        <div>
            <br />
            <Container fluid>
                <Row>
                    <Col md={{ span: 2 }}>
                        <DropdownButton id="dropdown-basic-button" title={selectedSite} onSelect={changeSite}>
                            {siteList.map(site => <Dropdown.Item eventKey={site} key={site}>{site}</Dropdown.Item>)}

                        </DropdownButton>
                    </Col>
                    <Col md={{ span: 2 }}>
                        <Button variant="warning" size="sm" onClick={editSite}>Edit/Add Site</Button>
                    </Col>
                </Row>
                <hr />
                {selectedSite !== 'Select Site' &&
                    <Row>
                        <Col xs={12}>
                            <h5>Enter the expense below for {selectedSite}:</h5>
                        </Col>
                        <Col>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Enter expense type here"
                                    aria-label="expenseType" onChange={changeExpenseType} value={expenseType}
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

                }

            </Container>
        </div>
    )
    function changeSite(evt) {
        setSelectedSite(evt)
    }
    function changeExpenseType(evt) {
        setExpenseType(evt.target.value)
    }
    function changeExpenseAmount(evt) {
        setExpenseAmount(evt.target.value)
    }
    function submitExpense() {
        if (expenseType && expenseType.length > 0
            && expenseAmount && expenseAmount.length > 0) {
            console.log(expenseType)
            console.log(expenseAmount)
            console.log(expenseDate.toLocaleDateString())
        }
    }
}
export default Site;