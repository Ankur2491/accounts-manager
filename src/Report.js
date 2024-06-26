import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Container, Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Badge from 'react-bootstrap/Badge';

export default function Report() {
    const [selectedCategory, setSelectedCategory] = useState('Select a category');
    const [selectedMonth, setSelectedMonth] = useState('View graph for');
    const [selectedReport, setSelectedReport] = useState('View report for');
    const [categories, setCategories] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [consolidatedExpense, setConsolidatedExpense] = useState(null);
    const [consolidatedCredit, setConsolidatedCredit] = useState(null);
    const [graphData, setGraphData] = useState([]);
    const [crdData, setCrdData] = useState([]);
    const [xLabel, setXlabel] = useState([]);
    const [showGraph, setShowGraph] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [allExpense, setAllExpense] = useState([]);
    const [plantBalance, setPlantBalance] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackNote, setSnackNote] = useState(null);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [hitWords, setHitWords] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    // const handleRowSelected = useCallback(state => {
    //     setSelectedRows(state.selectedRows);
    // }, []);
    const tableColumns = [
        {
            name: 'Date',
            selector: row => row.expenseDate,
            sortable: true,
            wrap: true
        },
        {
            name: 'Description',
            selector: row => row.expenseName,
            sortable: true,
            wrap: true
        },
        {
            name: 'Type',
            selector: row => row.expenseType
        },
        {
            name: 'Amount',
            selector: row => row.expenseAmount,
            sortable: true,
        },
        {
            name: 'Balance',
            selector: row => row.balance
        }
    ];


    const conditionalRowStyles = [
        {
            when: row => row.expenseType === 'credit',
            style: {
                backgroundColor: '#1CAC78',
                color: 'white',
                fontWeight: 'bold'
            },
        },
        {
            when: row => row.expenseType === 'debit',
            style: {
                backgroundColor: '#B31B1B',
                color: 'white',
                fontWeight: 'bold'
            },
        }
    ];

    const paginationComponentOptions = {
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All'
    }
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
                            series={[{ data: graphData, label: 'debit', color:'#B31B1B' }, { data: crdData, label: 'credit', color:'#1CAC78' }]}
                            xAxis={[{ scaleType: 'band', data: xLabel}]}
                        />
                    </Row>
                }
                {
                    showTable &&
                    <div>
                        <br />
                        <h5>Showing data for {selectedReport}:</h5>
                        <h6>Plant Balance: {plantBalance}</h6>  
                        <hr />
                            {
                                hitWords && hitWords.length > 0 &&
                                <div>
                                    <h6>Top Words: </h6>
                                    <Row>
                                        <Col md={12}>
                                            {hitWords.map(hitWord => <Badge style={{ cursor: 'pointer', marginLeft: '5px' }} bg={selectedItem === hitWord ? "secondary" : "primary"} onClick={() => showHitWordData(hitWord)} key={hitWord}>{hitWord}</Badge>)}
                                        </Col>
                                    </Row>
                                    <hr />
                                </div>
                            }
                        <Row>
                            {
                                selectedRows.length>0 && selectedRows.length===1 ?
                                <Col>
                                <Container fluid style={{backgroundColor:'lightblue'}}>
                                <Row>
                                    <Col md={2}>
                                        <h5 style={{marginTop:'20px'}}> Selected {selectedRows.length} record: </h5>
                                   </Col>
                                   <Col md={3}>
                                    <Button variant="danger" style={{marginTop:'10px'}} onClick={deleteRecords}>Delete</Button>
                                   </Col>
                                </Row>
                                <hr/>
                                </Container>
                                </Col>:
                                 selectedRows.length>0 && selectedRows.length>1 &&
                                 <Col>
                                 <Container fluid style={{backgroundColor:'lightblue'}}>
                                 <Row>
                                     <Col md={2}>
                                         <h5 style={{marginTop:'20px'}}> Selected {selectedRows.length} records: </h5>
                                    </Col>
                                    <Col md={3}>
                                     <Button variant="danger" style={{marginTop:'10px'}} onClick={deleteRecords}>Delete</Button>
                                    </Col>
                                 </Row>
                                 <hr/>
                                 </Container>
                                 </Col>
                            }
                            <Col md={{span: 1, offset: 11}}>
                            <Button onClick={() => downloadCSV(tableData)}>Export</Button>
                            </Col>
                            <Col>
                                <DataTable
                                    columns={tableColumns}
                                    data={tableData}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                    conditionalRowStyles={conditionalRowStyles}
                                />
                            </Col>
                        </Row>
                    </div>
                }
            </Container>
            {open === true &&
                <div>
                    <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                        <Alert
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}>
                            {snackNote}
                        </Alert>
                    </Snackbar>
                </div>
            }
        </div>
    )
    async function changeCategory(evt) {
        setSelectedCategory(evt)
        let res = await axios.get(`https://accounts-manager-api.vercel.app/getExpDetails/${evt}`)
        let expenseArr = res.data.records;
        if (evt === "plant") {
            setPlantBalance(res.data.plantBalance)
        }
        setAllExpense(expenseArr);
        let consolidatedObject = {};
        let consolidatedCredit = {};
        for (let expObj of expenseArr) {
            if (expObj['expenseType'] === 'debit') {
                if (consolidatedObject[expObj['expenseDate']]) {
                    consolidatedObject[expObj['expenseDate']] += parseFloat(expObj['expenseAmount']);
                }
                else {
                    consolidatedObject[expObj['expenseDate']] = parseFloat(expObj['expenseAmount']);
                }
            }
            else {
                if (consolidatedCredit[expObj['expenseDate']]) {
                    consolidatedCredit[expObj['expenseDate']] += parseFloat(expObj['expenseAmount']);
                }
                else {
                    consolidatedCredit[expObj['expenseDate']] = parseFloat(expObj['expenseAmount']);
                }
            }
        }
        setConsolidatedExpense(consolidatedObject);
        setConsolidatedCredit(consolidatedCredit);
        let keys;
        if (Object.keys(consolidatedObject).length<1) {
            keys = Object.keys(consolidatedCredit);
        }
        else {
            keys = Object.keys(consolidatedObject);
        }
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
        let crdData = [];
        let labelArr = [];
        let conKeys;
        conKeys = Object.keys(consolidatedExpense);
        conKeys.join(Object.keys(consolidatedCredit));
        // if (Object.keys(consolidatedCredit).length<1) {
        //     conKeys = Object.keys(consolidatedExpense);
        // }
        // else {
        //     conKeys = Object.keys(consolidatedCredit);
        // }
        conKeys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        for (let key of conKeys) {
            if (key.includes(evt)) {
                labelArr.push(key)
                if(consolidatedExpense[key] && consolidatedCredit[key]){
                    gData.push(consolidatedExpense[key]);
                    crdData.push(consolidatedCredit[key])
                }
                else if (consolidatedCredit[key] && !consolidatedExpense[key]) {
                    crdData.push(consolidatedCredit[key])
                    gData.push(0);
                }
                else if(!consolidatedCredit[key] && consolidatedExpense[key]) {
                    gData.push(consolidatedExpense[key]);
                    crdData.push(0)
                }
            }
        }
        setGraphData([...gData])
        setCrdData([...crdData])
        setXlabel([...labelArr])
        setShowTable(false)
        setShowGraph(true)
    }

    async function changeReport(evt) {
        setSelectedMonth('View graph for')
        setSelectedReport(evt);
        let tData = [];
        let allDescription = [];
        for (let expObj of allExpense) {
            if (expObj["expenseDate"].includes(evt)) {
                expObj['expenseAmount'] = parseFloat(expObj['expenseAmount'])
                tData.push(expObj);
                allDescription.push(expObj['expenseName']);
            }
        }
        let res = await axios.post('https://accounts-manager-api.vercel.app/retrieveHitWords',{"allDescription": allDescription})
        let freqMap = res.data;
        let sortedEntries = Object.entries(freqMap).sort((a,b)=>b[1]-a[1]).map(el=>el[0]);
        setHitWords(sortedEntries.slice(0,30));
        tData.sort((a, b) => b.expTransId-a.expTransId)
        setTableData([...tData]);
        setShowGraph(false)
        setShowTable(true)
    }

    function downloadCSV(array) {
        let newArray = [];
        for(let obj of array) {
            delete obj['expTransId']
            delete obj['isBackDateTrans']
            newArray.push(obj);
        }
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(newArray);
        if (csv == null) return;

        const filename = 'data.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }
    function convertArrayOfObjectsToCSV(array) {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(tableData[0]);
        let showKeys = ["Category", "Type", "Description", "Amount", "Date", "Balance"]        
        result = '';
        result += showKeys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }
    async function deleteRecords() {
        let expTransArr = new Set();
        for(let row of selectedRows) {
            expTransArr.add(row.expTransId);
        }
        let postBody = {
            "items": Array.from(expTransArr)
        }
        let res = await axios.post("https://accounts-manager-api.vercel.app/deleteRecords", postBody).catch(err => console.log(err));
        let tData = tableData.filter(td=>!expTransArr.has(td.expTransId))
        setTableData([...tData]);
        setToggleCleared(!toggleCleared);
        setSelectedRows([]);
        setPlantBalance(res.data.plantBalance);
        setSnackNote(res.data.message);
        setOpen(true)
        setTimeout(() => setOpen(false), 3000);
    }
    function showHitWordData(hitWord) {
       if(selectedItem === hitWord) {
        setSelectedItem(null)
        reloadReport('')
       }
       else {
       setSelectedItem(hitWord)
       reloadReport(hitWord);
       }
    }
    function reloadReport(hitWord) {
        let tData = [];
        for (let expObj of allExpense) {
            if (expObj["expenseDate"].includes(selectedReport) && expObj['expenseName'].includes(hitWord)) {
                expObj['expenseAmount'] = parseFloat(expObj['expenseAmount'])
                tData.push(expObj);
            }
        }
        tData.sort((a, b) => b.expTransId-a.expTransId)
        setTableData([...tData]);
        setShowGraph(false)
        setShowTable(true)
    }
}
