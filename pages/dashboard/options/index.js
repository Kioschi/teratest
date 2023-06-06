import React, {useState} from 'react';
import NavBar from "../../../components/nav/NavBar";
import {
    Button, Divider,
    Grid, Icon, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip, Typography
} from "@mui/material";
import mysql from "mysql2/promise";
import AddIcon from "@mui/icons-material/Add";
import {useSnackbar} from "notistack";
import setOptions from "../../../scripts/options/setOptions";
import BackButton from "../../../components/nav/BackButton";
import SquareIcon from '@mui/icons-material/Square';

const Index = ({options}) => {

    const [table, setTable] = useState(options)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [toDelete, setToDelete] = useState([])

    const [deleting, setDeleting] = useState(false)

    const [toAdd, setToAdd] = useState([])

    const [data, setData] = useState({name: '', multiplier: '', color: ''})

    const [disabled, setDisabled] = useState(false)

    const deleteItem = (id) => {

        setDeleting(true)

        setToDelete(prevState => [...prevState, {id: id}])
        setTable(() => table.filter(obj => obj.id !== id))

    }

    const deleteItemToAdd = (name) => {

        setToAdd(() => toAdd.filter(obj => obj.name !== name))

    }

    const addItem = () => {
        if(data.name && data.multiplier && data.multiplier <= 1){
            setToAdd(prevState => [...prevState, {name: data.name, multiplier: data.multiplier, color: data.color}])
            setData({name: '', multiplier: '', color: ''})
            setDeleting(true)
        }

    }

    return (
        <>
            <NavBar/>
            <Grid container justifyContent={'center'}>
                <Grid item container xs={12} justifyContent={'center'}>
                    <Grid item md={8}>
                        <BackButton/>
                    </Grid>
                </Grid>
                <Grid item container xs={12} md={8} sx={{mt: 5}}>
                    <Grid item xs={12} sx={{textAlign: 'center', fontWeight: 700, pb: 4}} color={'red'}>
                        <Typography variant={'subtitle1'}>PAMIETAJ O ZAPISANIU ZMIAN PRZED ZAMKNIĘCIEM OKNA</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/*TABLE*/}
                        {/*TABLE*/}
                        {/*TABLE*/}
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table" sx={{fontWeight: 700}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nazwa</TableCell>
                                        <TableCell align="right">Mnożnik</TableCell>
                                        <TableCell align="right">Kolor</TableCell>
                                        <TableCell align="right">USUŃ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.multiplier} ({Number(row.multiplier*100)}%)</TableCell>
                                            <TableCell align="right"><SquareIcon sx={{color: row.color}}/></TableCell>
                                            <TableCell align="right" sx={{fontWeight: 700, cursor: 'pointer'}} onClick={()=> deleteItem(row.id)}>USUŃ</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/*EOT TABLE*/}
                        {/*EOT TABLE*/}
                        {/*EOT TABLE*/}
                    </Grid>
                    {/*ADDING SECTION*/}
                    {/*ADDING SECTION*/}
                    {/*ADDING SECTION*/}
                    <Divider sx={{mt:5, mb: 5, width: '100%'}}/>
                    <Grid item container xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant={'h5'}>Dodaj opcje</Typography>
                        </Grid>
                        <Grid item container xs={12} md={6} spacing={2}>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    label="Nazwa"
                                    variant="outlined"
                                    size={'small'}
                                    onChange={e => setData({...data, name: e.target.value})}
                                    value={data.name}
                                />
                            </Grid>
                            <Grid item xs={4} md={3}>
                                <TextField
                                    label="Mnożnik"
                                    type={'number'}
                                    inputProps={{
                                        step: "0.01",
                                        max: '1'
                                    }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                    onChange={e => setData({...data, multiplier: e.target.value})}
                                    value={data.multiplier}
                                />
                            </Grid>
                            <Grid item container xs={12} md={1} sx={{alignItems: 'center', justifyContent: 'center'}}>
                                <input type={'color'} onChange={(e)=> setData({...data, color: e.target.value})} value={data.color}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title={'Dodaj'}>
                                    <IconButton
                                        variant="solid"
                                        sx={{left: '50%', transform: 'translateX(-50%)'}}
                                        onClick={()=> addItem()}
                                    >
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/*TABLE*/}
                            {/*TABLE*/}
                            {/*TABLE*/}
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" sx={{fontWeight: 700}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nazwa</TableCell>
                                            <TableCell align="right">Mnożnik</TableCell>
                                            <TableCell align="right">Kolor</TableCell>
                                            <TableCell align="right">USUŃ</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {toAdd.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.multiplier} ({Number(row.multiplier*100)}%)</TableCell>
                                                <TableCell align="right"><SquareIcon sx={{color: row.color}}/></TableCell>
                                                <TableCell align="right" sx={{fontWeight: 700, cursor: 'pointer'}} onClick={()=> deleteItemToAdd(row.name)}>USUŃ</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/*EOT TABLE*/}
                            {/*EOT TABLE*/}
                            {/*EOT TABLE*/}
                        </Grid>
                        <Grid item xs={12} container justifyContent={'flex-end'} sx={{mt: 10}}>
                            <Grid item xs={12} md={2}>
                                <Button fullWidth variant={'contained'} onClick={()=>setOptions(setDisabled, {delete: toDelete, add: toAdd}, enqueueSnackbar)} disabled={disabled}>Zapisz</Button>
                                <Typography sx={{color: 'red', fontSize: '0.8rem', mt: 1, textAlign: 'center'}}>{deleting ? 'Masz niezapisane zmiany!' : null}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
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

    const [options] = await connection.execute('SELECT * FROM `options` WHERE `deleted` = 0', [])

    return {
        props: {
            options: options
        }

    }
}

export default Index;