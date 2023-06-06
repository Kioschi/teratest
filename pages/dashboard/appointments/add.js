import React, {useState} from 'react';
import NavBar from "../../../components/nav/NavBar";
import {Autocomplete, Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import {TimePicker} from "@mui/x-date-pickers";
import autoComplete from "../../../scripts/dashboard/autocomplete";
import {useSnackbar} from "notistack";
import addAppointment from "../../../scripts/appointments/addAppointment";
import BackButton from "../../../components/nav/BackButton";

const Add = () => {

    const [data, setData] = useState({})

    const [users, setUsers] = useState([])
    const [usersText, setUsersText] = useState('')

    const [services, setServices] = useState([])
    const [servicesText, setServicesText] = useState('')
    const [servicesState, setServicesState] = useState(true)

    const [recurrentVisit, setRecurrentVisit] = useState(false)

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

    const [date, setDate] = useState(dayjs())
    const [dateParsed, setDateParsed] = useState(`${dayjs().$y}-${(dayjs().$M+1).toString().length<2 ? `0${dayjs().$M+1}` : (dayjs().$M+1)}-${dayjs().$D.toString().length<2 ? `0${dayjs().$D}` : dayjs().$D}`)

    const updateDate = (dateObj) => {

        const date = dayjs(dateObj)

        setDate(dateObj)

        setDateParsed(`${date.$y}-${(date.$M+1).toString().length<2 ? `0${date.$M+1}` : (date.$M+1)}-${date.$D.toString().length<2 ? `0${date.$D}` : date.$D}`)

    }

    const [time, setTime] = useState(dayjs())
    const [timeParsed, setTimeParsed] = useState(`${dayjs().$H.toString().length<2 ? `0${dayjs().$H}` : dayjs().$H}:${dayjs().$m.toString().length<2 ? `0${dayjs().$m}` : dayjs().$m}`)

    const updateTime = (hour) => {

        setTime(hour)

        const time = dayjs(hour)

        setTimeParsed(`${time.$H.toString().length<2 ? `0${time.$H}` : time.$H}:${time.$m.toString().length<2 ? `0${time.$m}` : time.$m}`)

    }

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [disabled, setDisabled] = useState(false)

    return (
        <>
            <NavBar/>
            <form onSubmit={e => addAppointment(e, data, timeParsed, dateParsed, setDisabled, recurrentVisit, enqueueSnackbar)}>
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
                                onInputChange={e => e.target.value !== undefined ? e.target.value.length > 2 ? autoComplete('users', usersText, setUsers) : null : null}
                                onChange={(e, value) => selectServices(value)}
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
                                onChange={(e, value) => setData({...data, serviceID: value.id})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                disablePortal
                                id="customer"
                                options={customers}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Pacjent" />}
                                onInputChange={e => e.target.value !== undefined ? e.target.value.length > 2 ? autoComplete('customers', customersText, setCustomers) : null: null}
                                onChange={(e, value) => setData({...data, customerID: value.id})}
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />} label="Stała wizyta" onChange={()=>setRecurrentVisit(prevState => !prevState)}/>
                            </FormGroup>
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

export default Add;