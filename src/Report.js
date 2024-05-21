import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from 'axios';
import DataTable from 'react-data-table-component';

export default function Report() {
    const [selectedCategory, setSelectedCategory] = useState('Select a category');
    const [selectedMonth, setSelectedMonth] = useState('View graph for');
    const [selectedReport, setSelectedReport] = useState('View report for');
    const [categories, setCategories] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [consolidatedExpense, setConsolidatedExpense] = useState(null);
    const [graphData, setGraphData] = useState([]);
    const [xLabel, setXlabel] = useState([]);
    const [showGraph, setShowGraph] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [allExpense, setAllExpense] = useState([]);
    const tableColumns = [
        {
            name: 'Expense Date',
            selector: row => row.expenseDate,
            sortable: true,
        },
        {
            name: 'Expense Name',
            selector: row => row.expenseName,
            sortable: true,
        },
        {
            name: 'Expense Amount',
            selector: row => row.expenseAmount,
            sortable: true,
        },
    ];
    useEffect(() => {
        async function getAllCat() {
            let res = await axios.get(`https://accounts-manager-api.vercel.app/getAllCat`).catch(err => console.log(err));
            setCategories(res.data);
        }
        getAllCat();
    }, [])
    return (
        <div style={{ marginTop: '10px' }}>
            <Container fluid>
                <Row>
                    <Col md={{ span: 2 }}>
                        <DropdownButton id="dropdown-basic-button" title={selectedCategory} onSelect={changeCategory}>
                            {categories.map(cat => <Dropdown.Item eventKey={cat} key={cat}>{cat}</Dropdown.Item>)}
                        </DropdownButton>
                    </Col>
                    {monthList.length > 0 &&
                        <Col md={{ span: 2 }}>
                            <DropdownButton id="dropdown-basic-button" title={selectedMonth} onSelect={changeMonth}>
                                {monthList.map(month => <Dropdown.Item eventKey={month} key={month}>{month}</Dropdown.Item>)}
                            </DropdownButton>
                        </Col>
                    }
                    {
                        monthList.length > 0 &&
                        <Col md={{ span: 2 }}>
                            <DropdownButton id="dropdown-basic-button" variant="success" title={selectedReport} onSelect={changeReport}>
                                {monthList.map(month => <Dropdown.Item eventKey={month} key={month}>{month}</Dropdown.Item>)}
                            </DropdownButton>
                        </Col>
                    }
                </Row>
                {showGraph &&
                    <Row>
                        <BarChart
                            width={1000}
                            height={400}
                            series={[
                                { data: graphData, label: selectedMonth, id: 'pvId' },
                            ]}
                            xAxis={[{ data: xLabel, scaleType: 'band' }]}
                        />
                    </Row>
                }
                {
                    showTable &&
                    <div>
                        <br/>
                        <h5>Showing data for {selectedReport}:</h5>
                        <hr />
                        <DataTable
                            columns={tableColumns}
                            data={tableData}
                            pagination
                        />
                        </div>
                }
            </Container>
        </div>
    )
    async function changeCategory(evt) {
        setSelectedCategory(evt)
        let res = await axios.get(`https://accounts-manager-api.vercel.app/getExpDetails/${evt}`)
        let expenseArr = res.data;
        setAllExpense(expenseArr);
        let consolidatedObject = {};
        for (let expObj of expenseArr) {
            if (consolidatedObject[expObj['expenseDate']]) {
                consolidatedObject[expObj['expenseDate']] += parseFloat(expObj['expenseAmount']);
            }
            else {
                consolidatedObject[expObj['expenseDate']] = parseFloat(expObj['expenseAmount']);
            }
        }
        setConsolidatedExpense(consolidatedObject);
        let keys = Object.keys(consolidatedObject);
        let months = new Set();
        for (let key of keys) {
            months.add(key.substring(key.indexOf('-') + 1));
        }
        setMonthList(Array.from(months));

    }
    function changeMonth(evt) {
        setSelectedReport('View report for')
        setSelectedMonth(evt);
        let gData = [];
        let labelArr = [];
        let conKeys = Object.keys(consolidatedExpense);
        for (let key of conKeys) {
            if (key.includes(evt)) {
                labelArr.push(key)
                gData.push(consolidatedExpense[key]);
            }
        }
        setGraphData([...gData])
        setXlabel([...labelArr])
        setShowTable(false)
        setShowGraph(true)
    }

    function changeReport(evt) {
        setSelectedMonth('View graph for')
        setSelectedReport(evt);
        let tData = [];
        for(let expObj of allExpense) {
            if(expObj["expenseDate"].includes(evt)) {
                tData.push(expObj);
            }
        }
        setTableData([...tData]);
        setShowGraph(false)
        setShowTable(true)   
    }

}