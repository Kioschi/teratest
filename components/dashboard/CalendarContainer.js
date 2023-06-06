import React, {useEffect, useState} from 'react';
import {
    Alert,
    Backdrop,
    Button,
    Card,
    CardActions,
    CardContent, Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select, TextField, Tooltip,
    Typography
} from "@mui/material";
import selectUser from "../../scripts/dashboard/selectUser";
import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale'
import Link from "next/link";
import {decode} from "jsonwebtoken";
import Cookies from "js-cookie";
import CloseIcon from "@mui/icons-material/Close";
import sha256 from "crypto-js/sha256";
import deleteAppointment from "../../scripts/appointments/deleteAppointment";
import {useSnackbar} from "notistack";

const CalendarContainer = ({users}) => {

    const [hasPrivileges, setHasPrivileges] = useState(0)

    //cannot read property null of admin... -.-
    useEffect(()=>{
        setHasPrivileges(decode(Cookies.get('JWT')).admin)
    }, [])

    //states for deleting appointment
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [disabled, setDisabled] = useState(false)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [appointmentID, setAppointmentID] = useState('')

    const [data, setData] = useState([])

    const [array, setArray] = useState([])

    const [week, setWeek] = useState(0)
    const [userID, setUserID] = useState()
    const [send, setSend] = useState(false)

    useEffect(()=>{
        if(send)
            selectUser(userID, setData, week)
        else
            setSend(true)
    }, [week])

    const generalDate = dayjs().add(week, 'week')

    const dayOfWeek = dayjs().day()

    const todaysDate = `${dayjs().$y}-${dayjs().$M.toString().length === 1 ? `0${dayjs().$M+1}` : dayjs().$M+1}-${dayjs().$D.toString().length === 1 ? `0${dayjs().$D}` : dayjs().$D}`

    dayjs.extend(updateLocale)
    const weekDaysName = dayjs.updateLocale('en', {
        weekdays: [
            "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"
        ]
    })

    useEffect(()=>{
        setArray([])
        if(Object.keys(data).length){
            for(let x = 0; x<7; x++){

                const date = dayjs(generalDate).add((dayOfWeek-dayOfWeek*2+1)+x, 'day')

                const dateHelp = `${date.$y}-${date.$M.toString().length === 1 ? `0${date.$M+1}` : date.$M+1}-${date.$D.toString().length === 1 ? `0${date.$D}` : date.$D}`

                const appointments = []

                Object.keys(data.appointments).forEach( obj => {
                    if(obj==dateHelp){
                        appointments.push(data.appointments[obj])
                }
                })


                setArray(prevState => [...prevState,
                    <Grid item md={1.5} sx={{m: 1}} xs={12}>
                        <Typography sx={{fontWeight: dateHelp === todaysDate ? 'bold' : 'normal', textAlign: 'center !important', fontSize: '1.1rem'}}>{dateHelp}</Typography>
                        <Typography color={'text.secondary'} sx={{textAlign: 'center', fontSize: '0.8rem'}}>{weekDaysName.weekdays[x]}</Typography>
                        <Divider sx={{mb: 2, mt: 1}}/>
                        {
                            appointments[0] ? appointments[0].map( appointment =>
                                <Card variant={'outlined'} sx={{
                                    mb: 2,
                                    mr: 0.5,
                                    ml: 0.5,
                                    backgroundColor: appointment.color
                                }}>
                                    <CardContent>
                                        <Grid container justifyContent={'flex-end'}>
                                            <Button size="small" style={{justifyContent: "flex-end", display: hasPrivileges ? 'inital' : 'none'}} onClick={()=> setOpen(true) & setAppointmentID(appointment.id)}>usuń</Button>
                                        </Grid>
                                        <Typography sx={{fontSize: '1rem', fontWeight: 600, textAlign: 'right'}}>
                                            {appointment.hour.slice(0,-3)} - {appointment.hourEnd.slice(0,-3)}
                                        </Typography>
                                        <Typography gutterBottom variant="h7" component="div">
                                            {appointment.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {appointment.customerName}
                                        </Typography>
                                        <Tooltip title={appointment.info}>
                                            <Typography variant="body2" color="text.secondary" sx={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'wrap', mt: 1}}>
                                                {appointment.info !== null ? appointment.info : null}
                                            </Typography>
                                        </Tooltip>
                                    </CardContent>
                                    <CardActions sx={{alignSelf: 'flex-end', pt: 0, display: hasPrivileges ? 'inital' : 'none'}}>
                                        <Link href={{pathname: '/dashboard/appointments/edit', query: {id: appointment.id}}}><a><Button size="small">edytuj</Button></a></Link>
                                    </CardActions>
                                </Card>
                            ) : console.log('error')
                        }
                    </Grid>
                ])

            }
        }
    }, [data])

    return (
        <Grid
            container
            xs={12}
            padding={'20px'}
        >

            <FormControl fullWidth>
                <InputLabel id="ppl">Wybierz terapeute</InputLabel>
                <Select
                    labelId="ppl"
                    id="demo-simple-select"
                    label="Wybierz terapeute"
                    defaultValue={''}
                    onChange={e => selectUser(e.target.value, setData, week) & setUserID(e.target.value)}
                >
                    {
                        users.map((user, index) => <MenuItem key={index} value={user.id}>{user.name}</MenuItem>)
                    }
                </Select>
            </FormControl>

            <Grid item container xs={12} sx={{justifyContent: 'center', mt: 3}}>
                <Grid item xs={12} container sx={{justifyContent: 'space-between', mb: 2}}>
                    <Grid item md={1}>
                        <Button fullWidth variant={'outlined'} onClick={ () => setWeek(prevState => prevState-1)}>{'<'}</Button>
                    </Grid>
                    <Grid item md={1} sx={{display: hasPrivileges ? 'inital' : 'none'}}>
                        <Link href={'/dashboard/appointments/add'}><a><Button fullWidth variant={'outlined'}>dodaj wizyte</Button></a></Link>
                    </Grid>
                    <Grid item md={1}>
                        <Button fullWidth variant={'outlined'} onClick={ () => setWeek(prevState => prevState+1)}>{'>'}</Button>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sx={{justifyContent: 'center', flexWrap: 'wrap'}}>
                    {
                        array.map( col => col)
                    }
                </Grid>
                {/*BACKDROP*/}
                {/*BACKDROP*/}
                {/*BACKDROP*/}
                <Backdrop
                    open={open}
                >
                    <Grid container justifyContent={'center'} alignContent={'center'}>
                        <Grid item container xs={12} md={4} sx={{backgroundColor: 'white', padding: 2, m: 1, borderRadius: 1}}>
                            <Grid item xs={12} sx={{textAlign: 'right'}}>
                                <CloseIcon onClick={() => setOpen(prevState => !prevState)} sx={{cursor: 'pointer'}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Hasło" variant="outlined" type={'password'} size={'small'} onChange={ e => setPassword(sha256(e.target.value).toString())}/>
                            </Grid>
                            <Grid item xs={12} sx={{mt: 2}}>
                                <Alert severity="warning">Usunięcie pojedyńczej wizyty jeżeli jest to stała wizyta nie spowoduje usunięcia wszystkich!</Alert>
                            </Grid>
                            <Grid item xs={12} container justifyContent={'flex-end'} sx={{mt: 4}}>
                                <Grid item md={4} xs={12}>
                                    <Button fullWidth variant={'outlined'} size={'small'} onClick={e => deleteAppointment(appointmentID, setOpen, setDisabled, enqueueSnackbar, password)} disabled={disabled}>Usuń</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Backdrop>
                {/*EOT BACKDROP*/}
                {/*EOT BACKDROP*/}
                {/*EOT BACKDROP*/}
            </Grid>

        </Grid>
    );
};

export default CalendarContainer;