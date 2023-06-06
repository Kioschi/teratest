import React, {useState} from 'react';
import mysql from "mysql2/promise";
import autoComplete from "../../../scripts/dashboard/autocomplete";
import dayjs from "dayjs";
import {useSnackbar} from "notistack";
import NavBar from "../../../components/nav/NavBar";
import editAppointment from "../../../scripts/appointments/editAppointment";
import {
    Autocomplete,
    Button, Checkbox,
    FormControl, FormControlLabel,
    FormGroup, FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TimePicker} from "@mui/x-date-pickers";
import BackButton from "../../../components/nav/BackButton";

const Edit = ({dataStart, id, servicesStart, modifiers}) => {

    const [data, setData] = useState({userID: dataStart.userID, customerID: dataStart.customerID, serviceID: dataStart.serviceID, info: dataStart.info})

    const [multiplier, setMultiplier] = useState(dataStart.multiplier)

    const [users, setUsers] = useState([])
    const [usersText, setUsersText] = useState('')

    const [services, setServices] = useState(servicesStart)
    const [servicesState, setServicesState] = useState(false)

    const [isRecurring, setIsRecurring] = useState(dataStart.recurringID)
    const [editAll, setEditAll] = useState(false)

    const editUser = (inputValue, reason) => {

        switch (reason){
            case 'clear':
                dataStart.name=''
                break;
            default:
                inputValue.length > 2 ? autoComplete('users', usersText, setUsers) : null
        }

    }

    const selectServices = (value) => {
        if(value){
            autoComplete('services', value.id, setServices)
            setData({...data, userID: value.id })
            setServicesState(false)
        }
        else
            setServicesState(true)
    }

    const [customers, setCustomers] = useState([])
    const [customersText, setCustomersText] = useState('')

    const [date, setDate] = useState(dayjs(dataStart.date))
    const [dateParsed, setDateParsed] = useState(dataStart.date)

    const updateDate = (dateObj) => {

        const date = dayjs(dateObj)

        setDate(dateObj)

        setDateParsed(`${date.$y}-${(date.$M+1).toString().length<2 ? `0${date.$M+1}` : (date.$M+1)}-${date.$D.toString().length<2 ? `0${date.$D}` : date.$D}`)

    }

    const [time, setTime] = useState(dayjs().set('second', Number(dataStart.hour.split(':')[2])).set('hour', Number(dataStart.hour.split(':')[0])).set('minute', Number(dataStart.hour.split(':')[1])))
    const [timeParsed, setTimeParsed] = useState(dataStart.hour)

    const updateTime = (hour) => {

        setTime(hour)

        const time = dayjs(hour)

        setTimeParsed(`${time.$H.toString().length<2 ? `0${time.$H}` : time.$H}:${time.$m.toString().length<2 ? `0${time.$m}` : time.$m}:00`)

    }

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [disabled, setDisabled] = useState(false)

    return (
        <>
            <NavBar/>
            <form onSubmit={e => editAppointment(e, data, timeParsed, dateParsed, setDisabled, enqueueSnackbar, id, multiplier, isRecurring, isRecurring ? editAll : false, dataStart.recurringID)}>
                <Grid
                    container
                    alignContent={'center'}
                    justifyContent={'center'}
                >
                    <Grid item container xs={12} justifyContent={'center'}>
                        <Grid item md={8}>
                            <BackButton/>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        xs={12}
                        md={4}
                        spacing={2}
                        sx={{m: 1, mr: 3, p: 0}}
                    >
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                disablePortal
                                id="user"
                                options={users}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Terapeuta" />}
                                onInputChange={(e, inputValue, reason) => editUser(inputValue, reason)}
                                onChange={(e, value) => selectServices(value)}
                                defaultValue={dataStart.user}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                disablePortal
                                id="service"
                                options={services}
                                fullWidth
                                disabled={servicesState}
                                renderInput={(params) => <TextField {...params} label="Usługa" />}
                                onChange={(e, value) => setData({...data, serviceID: value?.id})}
                                defaultValue={dataStart.name}
                                key={dataStart.name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                disablePortal
                                id="customer"
                                options={customers}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Pacjent" />}
                                onInputChange={e => e == null || e.target.value == undefined ? null : e.target.value.length > 2 ? autoComplete('customers', customersText, setCustomers) : null}
                                onChange={(e, value) => setData({...data, customerID: value?.id})}
                                defaultValue={dataStart.customer}
                            />
                        </Grid>
                        <Grid item container xs={12} spacing={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} locale={'en'}>
                                <Grid item xs={12} md={6}>
                                    <DatePicker
                                        label="Data"
                                        value={date}
                                        onChange={(newValue) => {
                                            updateDate(newValue)
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth/>}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TimePicker
                                        label="Godzina"
                                        value={time}
                                        onChange={(newValue) => {
                                            updateTime(newValue)
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth/>}
                                        ampm={false}
                                    />
                                </Grid>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                multiline
                                fullWidth
                                label={'Dodatkowe informacje'}
                                rows={5}
                                onChange={e => setData({...data, info: e.target.value})}
                                defaultValue={dataStart.info}
                            />
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="reason">Powód zmiany</InputLabel>
                                    <Select
                                        labelId="reason"
                                        value={multiplier}
                                        label="Powód zmiany"
                                        onChange={e => setMultiplier(e.target.value)}
                                        defaultValue={dataStart.optionName}
                                    >
                                        <MenuItem value={0}>BRAK</MenuItem>
                                        {
                                            modifiers.map( option => <MenuItem value={option.id}>{option.name} - ODPŁATNOŚĆ {option.multiplier*100}%</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={isRecurring}/>} label="Stała wizyta" onChange={()=>setIsRecurring(prevState => !prevState)}/>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl error={editAll}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox disabled={!isRecurring}/>} label="Edytuj wszystkie" onChange={()=>setEditAll(prevState => !prevState)}/>
                                    <FormHelperText>UWAGA: zaznaczenie tego spowoduje nadpisanie wszystkich przyszłych wizyt!</FormHelperText>
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item container xs={12} justifyContent={'flex-end'}>
                            <Grid item xs={12} md={4}>
                                <Button fullWidth variant={'contained'} type={'submit'} disabled={disabled}>Dodaj</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
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

    const [rows] = await connection.execute('SELECT appointments.`id`, appointments.userID, appointments.customerID, appointments.serviceID, CONCAT(customers.name, \' \', customers.lastName) as customer, CONCAT(users.name, \' \', users.lastName)         as user, services.name, `hour`, DATE_FORMAT(`date`, \'%Y-%m-%d\')                 as date, `info`, appointments.multiplier, o.name as "optionName", appointments.recurringID FROM `appointments` INNER JOIN users ON appointments.userID = users.id INNER JOIN customers ON appointments.customerID = customers.id INNER JOIN services on appointments.serviceID = services.id left join options o on appointments.multiplier = o.id WHERE appointments.`id` = ?', [id])
    const [services] = await connection.execute('SELECT id, name as label FROM services WHERE userID = (SELECT userID from appointments where id = ? and deleted = 0)', [id])
    const [modifiers] = await connection.execute('SELECT id, name, multiplier FROM options WHERE deleted=0', [])

    await connection.end()


    return {
        props: {
            dataStart: rows[0],
            servicesStart: services,
            modifiers: modifiers,
            id: id
        }

    }
}

export default Edit;