import React, {useState} from 'react';
import dayjs from "dayjs";
import NavBar from "../../../components/nav/NavBar";
import {
    Backdrop,
    Button,
    Grid, TextField
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import generateSingleSummary from "../../../scripts/customers/generateSingleSummary";
import {CSVDownload} from "react-csv";
import mysql from "mysql2/promise";
import {useSnackbar} from "notistack";
import BackButton from "../../../components/nav/BackButton";
import Link from "next/link";
import getMoreRows from "../../../scripts/getMoreRows";

const Details = ({data, history, id}) => {

    const [appointments, setAppointments] = useState(history)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [count, setCount] = useState(0)

    const loadRows = async () => {

        setCount(prevState => prevState + 25)

        const rows = await getMoreRows(id, 'users', count, setAppointments)

        setAppointments(prevState => [...prevState, ...rows])
    }

    const [open, setOpen] = useState(false)

    const editButton = (params) => {
        return (
            <Link href={{pathname: '/dashboard/appointments/edit', query: {id: params.id}}}><a><Button size="small" variant={'outlined'}>edytuj</Button></a></Link>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', type: 'number', width: 50},
        { field: 'customerName', headerName: 'Pacjent'},
        { field: 'serviceName', headerName: 'Usługa'},
        { field: 'date', headerName: 'Data'},
        { field: 'hour', headerName: 'Godzina'},
        { field: 'edit', headerName: 'Edytuj', renderCell: editButton}
    ]

    const [fromDate, setFromDate] = useState(dayjs())
    const [toDate, setToDate] = useState(dayjs())

    const [buttonDisabled, setButtonDisabled] = useState(false)

    const [summaryData, setSummaryData] = useState([])

    return (
        <>
            <NavBar/>
            <Grid container justifyContent={'center'}>
                <Grid item container xs={12} md={8} sx={{mt: 5, m: 1}}>
                    <BackButton/>
                    <Grid item xs={12} sx={{mb: 1}}>
                        <h1 style={{margin: 0}}>{data.name} {data.lastName}</h1>
                    </Grid>
                    <Grid item xs={12} sx={{mb:1}}>
                        Tel: {data.tel}
                    </Grid>
                    <Grid item xs={12}>
                        Email: {data.email}
                    </Grid>
                    <Grid item xs={12} sx={{mt: 5}}>
                        <Button variant={'outlined'} size={'small'} onClick={() => setOpen(prevState => !prevState)}>Generuj podsumowanie miesiąca</Button>
                    </Grid>
                    <DataGrid
                        sx={{mt: 5}}
                        autoHeight
                        rows={appointments}
                        columns={columns}
                        getRowId={(row) => row.id}
                        disableSelectionOnClick={true}
                        disableColumnFilter
                        pageSize={25}
                        rowsPerPageOptions={[25]}
                        onPageChange={()=> loadRows()}
                    />
                </Grid>
                {/*BACKDROP*/}
                {/*BACKDROP*/}
                {/*BACKDROP*/}
                <Backdrop
                    open={open}
                >
                    <Grid container justifyContent={'center'} alignContent={'center'}>
                        <Grid item container xs={12} md={8} sx={{backgroundColor: 'white', padding: 2, m: 1, borderRadius: 1}}>
                            <Grid item xs={12} sx={{textAlign: 'right'}}>
                                <CloseIcon onClick={() => setOpen(prevState => !prevState) & setSummaryData([])} sx={{cursor: 'pointer'}}/>
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
                                <Button variant={'outlined'} onClick={()=> generateSingleSummary(setButtonDisabled, {fromDate, toDate, id}, setSummaryData, enqueueSnackbar)} disabled={buttonDisabled}>Generuj</Button>
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
        </>
    );
};

export async function getServerSideProps(context){

    const {id} = context.query

    const connection = await mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })

    const [rows] = await connection.execute('SELECT `id`, `tel`, `name`, `lastName`, `email` FROM `customers` WHERE `id` = ?', [id])

    const [appointments] = await connection.execute('SELECT `appointments`.`id` AS `id`, CONCAT(`customers`.`name`, \' \', `customers`.lastName) AS \'customerName\', `services`.`name` AS \'serviceName\', `appointments`.`hour`, DATE_FORMAT(`appointments`.`date`, \'%d-%m-%Y\') AS \'date\' from `appointments` INNER JOIN `customers` ON `appointments`.`customerID` = `customers`.`id` INNER JOIN `services` ON `appointments`.`serviceID` = `services`.`id` WHERE `appointments`.`deleted` = 0 AND `appointments`.`customerID` = ? AND `appointments`.date < ADDDATE(NOW(), INTERVAL 1 MONTH) AND (`appointments`.`refId`, `appointments`.`lastChangedDate`) IN (SELECT `appointments`.`refId`, MAX(`appointments`.`lastChangedDate`) FROM `appointments` GROUP BY `appointments`.`refID`) ORDER BY `appointments`.`date` DESC LIMIT 0, 26', [id])

    await connection.end()

    const appointmentsSerialized = []

    appointments.forEach( x => {

        let obj = {}

        for(const pair of Object.entries(x)){
            obj = {...obj, [pair[0]]: pair[1].toString()}
        }

        appointmentsSerialized.push(obj)
    })

    return {
        props: {
            data: rows[0],
            history: appointmentsSerialized,
            id: id,
        }

    }
}

export default Details;