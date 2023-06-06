import React, {useState} from 'react';
import NavBar from "../../../components/nav/NavBar";
import {
    Button,
    Divider,
    FormControl,
    Grid, IconButton,
    InputLabel,
    MenuItem, Paper,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Tooltip, Typography
} from "@mui/material";
import passwordValidation from "../../../scripts/users/passwordValidation";
import AddService from "../../../components/users/AddService";
import AddIcon from "@mui/icons-material/Add";
import mysql from "mysql2/promise";
import editUser from "../../../scripts/users/editUser";
import sha256 from "crypto-js/sha256";
import {useSnackbar} from "notistack";
import BackButton from "../../../components/nav/BackButton";
import SquareIcon from "@mui/icons-material/Square";

const Edit = ({dataStart, servicesStart, id}) => {


    const [data, setData] = useState({})
    const [services, setServices] = useState(servicesStart)

    const [disabled, setDisabled] = useState(!dataStart.admin)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [passMsg, setPassMsg] = useState('')
    const [passError, setPassError] = useState(false)

    const [serviceAdd, setServiceAdd] = useState({})

    const [buttonDisabled, setButtonDisabled] = useState(false)

    const [servicesDelete, setServicesDelete] = useState([])
    const [servicesToAdd, setServicesToAdd] = useState([])

    const [password, setPassword] = useState('')

    const removeItem = (item) => {

        setServices(() => services.filter(obj => obj.id !== item))

        setServicesDelete(prevState => [...prevState, {id: item}])

    }

    const removeItemToAdd = (name) => {

        setServicesToAdd(() => servicesToAdd.filter(obj => obj.name !== name))

    }

    const addService = () => {
        if(serviceAdd.name || serviceAdd.price || serviceAdd.time){
            setServicesToAdd(prevState => [...prevState, serviceAdd])
            setServiceAdd({name: '', price: '', time: ''})
        }
    }

    return (
        <>
            <NavBar/>
            <form onSubmit={e => editUser(data, servicesDelete, servicesToAdd, e, setButtonDisabled, id, password, enqueueSnackbar)}>
                <Grid container spacing={2} justifyContent={'center'}>
                    <Grid item container xs={12} justifyContent={'center'}>
                        <Grid item md={8}>
                            <BackButton/>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} md={4} spacing={2} sx={{m: 1, mr: 3, p: 0}}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Login" variant="outlined" onChange={e => setData({...data, login: e.target.value})} defaultValue={dataStart.login}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Hasło"
                                variant="outlined"
                                onChange={e => passwordValidation(e.target.value, setData, data, setPassError)}
                                onFocus={() => setPassMsg('Hasło musi zawierać 8 znaków, 1 dużą litere, znak specjalny i cyfrę')}
                                onBlur={()=> setPassMsg('')}
                                helperText={passMsg}
                                error={passError}
                            />
                        </Grid>
                        {
                            disabled && <>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Imie" variant="outlined" onChange={e => setData({...data, name: e.target.value})} defaultValue={dataStart.name}/>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Nazwisko" variant="outlined" onChange={e => setData({...data, lastName: e.target.value})} defaultValue={dataStart.lastName}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="shiftStartlabel">Praca od:</InputLabel>
                                        <Select
                                            labelId="shiftStartlabel"
                                            id={'shiftStart'}
                                            value={data.dayStart}
                                            defaultValue={dataStart.dayStart}
                                            label="Praca od:"
                                            onChange={e => setData({...data, dayStart: e.target.value})}
                                        >
                                            <MenuItem value={0}>Poniedziałek</MenuItem>
                                            <MenuItem value={1}>Wtorek</MenuItem>
                                            <MenuItem value={2}>Środa</MenuItem>
                                            <MenuItem value={3}>Czwartek</MenuItem>
                                            <MenuItem value={4}>Piątek</MenuItem>
                                            <MenuItem value={5}>Sobota</MenuItem>
                                            <MenuItem value={6}>Niedziela</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="shiftendlabel">Praca do:</InputLabel>
                                        <Select
                                            labelId="shiftendlabel"
                                            id={'shiftend'}
                                            value={data.dayEnd}
                                            defaultValue={dataStart.dayEnd}
                                            label="Praca do:"
                                            onChange={e => setData({...data, dayEnd: e.target.value})}
                                        >
                                            <MenuItem value={0}>Poniedziałek</MenuItem>
                                            <MenuItem value={1}>Wtorek</MenuItem>
                                            <MenuItem value={2}>Środa</MenuItem>
                                            <MenuItem value={3}>Czwartek</MenuItem>
                                            <MenuItem value={4}>Piątek</MenuItem>
                                            <MenuItem value={5}>Sobota</MenuItem>
                                            <MenuItem value={6}>Niedziela</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="hourstartlabel">Godzina od:</InputLabel>
                                        <Select
                                            labelId="hourstartlabel"
                                            id={'hourstart'}
                                            value={data.shiftStart}
                                            defaultValue={dataStart.shiftStart}
                                            label="Godzina od:"
                                            onChange={e => setData({...data, shiftStart: e.target.value})}
                                        >
                                            <MenuItem value={'06:00'}>06:00</MenuItem>
                                            <MenuItem value={'07:00'}>07:00</MenuItem>
                                            <MenuItem value={'08:00'}>08:00</MenuItem>
                                            <MenuItem value={'09:00'}>09:00</MenuItem>
                                            <MenuItem value={'10:00'}>10:00</MenuItem>
                                            <MenuItem value={'11:00'}>11:00</MenuItem>
                                            <MenuItem value={'12:00'}>12:00</MenuItem>
                                            <MenuItem value={'13:00'}>13:00</MenuItem>
                                            <MenuItem value={'14:00'}>14:00</MenuItem>
                                            <MenuItem value={'15:00'}>15:00</MenuItem>
                                            <MenuItem value={'16:00'}>16:00</MenuItem>
                                            <MenuItem value={'17:00'}>17:00</MenuItem>
                                            <MenuItem value={'18:00'}>18:00</MenuItem>
                                            <MenuItem value={'19:00'}>19:00</MenuItem>
                                            <MenuItem value={'20:00'}>20:00</MenuItem>
                                            <MenuItem value={'21:00'}>21:00</MenuItem>
                                            <MenuItem value={'22:00'}>22:00</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="hoursendlabel">Godzina do:</InputLabel>
                                        <Select
                                            labelId="hoursendlabel"
                                            id={'hoursend'}
                                            value={data.shiftEnd}
                                            defaultValue={dataStart.shiftEnd}
                                            label="Godzina do:"
                                            onChange={e => setData({...data, shiftEnd: e.target.value})}
                                        >
                                            <MenuItem value={'06:00'}>06:00</MenuItem>
                                            <MenuItem value={'07:00'}>07:00</MenuItem>
                                            <MenuItem value={'08:00'}>08:00</MenuItem>
                                            <MenuItem value={'09:00'}>09:00</MenuItem>
                                            <MenuItem value={'10:00'}>10:00</MenuItem>
                                            <MenuItem value={'11:00'}>11:00</MenuItem>
                                            <MenuItem value={'12:00'}>12:00</MenuItem>
                                            <MenuItem value={'13:00'}>13:00</MenuItem>
                                            <MenuItem value={'14:00'}>14:00</MenuItem>
                                            <MenuItem value={'15:00'}>15:00</MenuItem>
                                            <MenuItem value={'16:00'}>16:00</MenuItem>
                                            <MenuItem value={'17:00'}>17:00</MenuItem>
                                            <MenuItem value={'18:00'}>18:00</MenuItem>
                                            <MenuItem value={'19:00'}>19:00</MenuItem>
                                            <MenuItem value={'20:00'}>20:00</MenuItem>
                                            <MenuItem value={'21:00'}>21:00</MenuItem>
                                            <MenuItem value={'22:00'}>22:00</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider orientation="horizontal" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'p'}>Obecne usługi</Typography>
                                </Grid>
                                {/*TABLE*/}
                                {/*TABLE*/}
                                {/*TABLE*/}

                                <Grid item xs={12}>
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="a dense table" sx={{fontWeight: 700}}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Nazwa</TableCell>
                                                    <TableCell align="right">Czas</TableCell>
                                                    <TableCell align="right">Cena</TableCell>
                                                    <TableCell align="right">Kolor</TableCell>
                                                    <TableCell align="right">Usuń</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {services.map((row) => (
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="right">{row.time} MIN</TableCell>
                                                        <TableCell align="right">{row.price} PLN</TableCell>
                                                        <TableCell align="right"><SquareIcon sx={{color: row.color}}/></TableCell>
                                                        <TableCell align="right" sx={{fontWeight: 700, cursor: 'pointer'}} onClick={()=> removeItem(row.id)}>USUŃ</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                {/*EOT TABLE*/}
                                {/*EOT TABLE*/}
                                {/*EOT TABLE*/}

                                <Grid item xs={12}>
                                    <Divider orientation="horizontal" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant={'p'}>Dodaj nową usługe</Typography>
                                </Grid>

                                {/*TABLE FOR ADD*/}
                                {/*TABLE FOR ADD*/}
                                {/*TABLE FOR ADD*/}
                                <Grid item xs={12}>
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="a dense table" sx={{fontWeight: 700}}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Nazwa</TableCell>
                                                    <TableCell align="right">Czas</TableCell>
                                                    <TableCell align="right">Cena</TableCell>
                                                    <TableCell align="right">Kolor</TableCell>
                                                    <TableCell align="right">Usuń</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {servicesToAdd.map((row) => (
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="right">{row.time} MIN</TableCell>
                                                        <TableCell align="right">{row.price} PLN</TableCell>
                                                        <TableCell align="right"><SquareIcon sx={{color: row.color}}/></TableCell>
                                                        <TableCell align="right" sx={{fontWeight: 700, cursor: 'pointer'}} onClick={()=> removeItemToAdd(row.name)}>USUŃ</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <AddService set={setServiceAdd} get={serviceAdd}/>
                                <Grid item xs={12}>
                                    <Tooltip title={'Dodaj usługe'}>
                                        <IconButton
                                            variant="solid"
                                            sx={{left: '50%', transform: 'translateX(-50%)'}}
                                            onClick={()=> addService()}
                                        >
                                            <AddIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </>
                        }
                        <Grid item container xs={12} justifyContent={'flex-end'}>
                            <Grid item xs={12} container justifyContent={'flex-end'}>
                                <Grid item xs={12} md={4} sx={{mb: 2, mt: 8}}>
                                    <TextField fullWidth label="Hasło" variant="outlined" type={'password'} size={'small'} onChange={ e => setPassword(sha256(e.target.value).toString())}/>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button fullWidth variant="contained" type={'submit'} disabled={buttonDisabled}>Edytuj</Button>
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

    const [rows] = await connection.execute('SELECT `id`, `name`, `lastName`, `login`, `admin` , DATE_FORMAT(`shiftStart`, \'%H:%i\') AS `shiftStart`, DATE_FORMAT(`shiftEnd`, \'%H:%i\') AS `shiftEnd`, `dayStart`, `dayEnd` FROM `users` WHERE `id` = ?', [id])

    const [servicesStart] = await connection.execute('SELECT `id`, `name`, `price`, `time`, color FROM `services` WHERE `userID` = ? AND `deleted` = 0', [id])

    await connection.end()

    return {
        props: {
            dataStart: rows[0],
            servicesStart: servicesStart,
            id: id
        }

    }
}

export default Edit;