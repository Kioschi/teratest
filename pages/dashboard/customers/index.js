import React, {useMemo, useState} from 'react';
import NavBar from "../../../components/nav/NavBar";
import {Backdrop, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import mysql from "mysql2/promise";
import Link from "next/link";
import Filters from "../../../components/customers/Filters";
import CloseIcon from "@mui/icons-material/Close";
import sha256 from "crypto-js/sha256";
import deleteUser from "../../../scripts/users/deleteUser";
import {useSnackbar} from "notistack";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {CSVDownload} from "react-csv";
import generateSummary from "../../../scripts/customers/generateSummary";
import BackButton from "../../../components/nav/BackButton";

const Index = ({tableData}) => {

    const [tableState, setTableState] = useState(tableData)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [summaryOpen, setSummaryOpen] = useState(false)

    const [password, setPassword] = useState('')
    const [id, setId] = useState('')

    const [disabled, setDisabled] = useState(false)

    const [fromDate, setFromDate] = useState(dayjs())
    const [toDate, setToDate] = useState(dayjs())

    const [buttonDisabled, setButtonDisabled] = useState(false)

    const [summaryData, setSummaryData] = useState([])

    const columns = [
        { field: 'id', headerName: 'ID', type: 'number', width: 50},
        { field: 'name', headerName: 'Imie', flex: 1, minWidth: 100},
        { field: 'lastName', headerName: 'Nazwisko', flex: 1, minWidth: 100},
        {
            field: 'details',
            headerName: '',
            renderCell: (params) => (
                <Link href={{ pathname: '/dashboard/customers/details', query: { id: params.id } }}>
                    <a>
                        <Button
                            variant="outlined"
                            size="small"
                            style={{marginLeft: 'auto', marginRight:'auto'}}
                            tabIndex={params.hasFocus ? 0 : -1}
                        >
                            Detale
                        </Button>
                    </a>
                </Link>
            ),
            sortable: false,
        },
        {
            field: 'edit',
            headerName: '',
            renderCell: (params) => (
                <Link href={{ pathname: '/dashboard/customers/edit', query: { id: params.id } }}>
                    <a>
                        <Button
                            variant="outlined"
                            size="small"
                            style={{marginLeft: 'auto', marginRight:'auto'}}
                            tabIndex={params.hasFocus ? 0 : -1}
                        >
                            Edytuj
                        </Button>
                    </a>
                </Link>
            ),
            sortable: false,
        },
    ]

    const tableRows = useMemo(()=> tableState, [tableState])

    return (
        <>
            <NavBar/>
            <Grid container justifyContent={'center'}>
                <Grid item container xs={12} md={8} sx={{m: 1}}>
                    <BackButton/>
                    <Filters setTableState={setTableState}/>
                    <Grid item xs={12} sx={{mt: 5}} container justifyContent={'flex-end'}>
                        <Link href={'/dashboard/customers/add'}><a><Button variant={'outlined'} size={'small'}>Dodaj pacjenta</Button></a></Link>
                    </Grid>
                    <DataGrid
                        sx={{mt: 5}}
                        autoHeight
                        rows={tableRows}
                        columns={columns}
                        getRowId={(row) => row.id}
                        disableSelectionOnClick={true}
                        disableColumnFilter
                        rowsPerPageOptions={[25]}
                    />
                    {/*BACKDROP*/}
                    {/*BACKDROP*/}
                    {/*BACKDROP*/}
                    <Backdrop
                        open={open}
                    >
                        <Grid container justifyContent={'center'} alignContent={'center'}>
                            <Grid item container xs={12} md={4} sx={{backgroundColor: 'white', padding: 2, m: 1, borderRadius: 1}}>
                                <Grid item xs={12} sx={{textAlign: 'right'}}>
                                    <CloseIcon onClick={() => setOpen(prevState => !prevState)}/>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField fullWidth label="Hasło" variant="outlined" type={'password'} size={'small'} onChange={ e => setPassword(sha256(e.target.value).toString())}/>
                                </Grid>
                                <Grid item xs={12} container justifyContent={'flex-end'}>
                                    <Grid item md={4} xs={12}>
                                        <Button fullWidth variant={'outlined'} size={'small'} onClick={e => deleteUser(e, password, id, setDisabled, setOpen, tableState, setTableState, enqueueSnackbar)} disabled={disabled}>Usuń</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Backdrop>
                    {/*EOT BACKDROP*/}
                    {/*EOT BACKDROP*/}
                    {/*EOT BACKDROP*/}
                    <Grid item xs={12} sx={{mt: 2}} container justifyContent={'flex-start'}>
                        <Button variant={'outlined'} size={'small'} onClick={()=> setSummaryOpen(prevState => !prevState)}>Generuj podsumowanie miesiąca</Button>
                    </Grid>
                    {/*BACKDROP*/}
                    {/*BACKDROP*/}
                    {/*BACKDROP*/}
                    <Backdrop
                        open={summaryOpen}
                    >
                        <Grid container justifyContent={'center'} alignContent={'center'}>
                            <Grid item container xs={12} md={8} sx={{backgroundColor: 'white', padding: 2, m: 1, borderRadius: 1}}>
                                <Grid item xs={12} sx={{textAlign: 'right'}}>
                                    <CloseIcon onClick={() => setSummaryOpen(prevState => !prevState) & setSummaryData([])} sx={{cursor: 'pointer'}}/>
                                </Grid>
                                <Grid item xs={12} md={4} sx={{mr: 2, mt: 1}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Data od"
                                            value={fromDate}
                                            maxDate={new Date()}
                                            renderInput={(params) => <TextField {...params} helperText={null} />}
                                            onChange={e => setFromDate(dayjs(e))}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={4} sx={{mr: 1, mt: 1}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                                        <DatePicker
                                            label="Data do"
                                            maxDate={new Date()}
                                            value={toDate}
                                            renderInput={(params) => <TextField {...params} helperText={null} />}
                                            onChange={e => setToDate(dayjs(e))}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sx={{mt: 2, mb:3}}>
                                    <Button variant={'outlined'} onClick={()=> generateSummary(setButtonDisabled, {fromDate, toDate}, setSummaryData, enqueueSnackbar)} disabled={buttonDisabled}>Generuj</Button>
                                </Grid>
                                {
                                    summaryData.length !== 0 && <CSVDownload
                                        data={summaryData}
                                        target="_blank"
                                    />
                                }
                            </Grid>
                        </Grid>
                    </Backdrop>
                    {/*EOT BACKDROP*/}
                    {/*EOT BACKDROP*/}
                    {/*EOT BACKDROP*/}
                </Grid>
            </Grid>
        </>
    );
};

export async function getServerSideProps(context){

    const connection = await mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })

    const [rows] = await connection.execute('SELECT `id`, `name`, `lastName` FROM `customers` WHERE `deleted` = 0', [])

    await connection.end()

    return {
        props: {tableData: rows}
    }
}

export default Index;