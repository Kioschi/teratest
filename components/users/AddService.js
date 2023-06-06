import React from 'react';
import {FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";

const AddService = ({set, get}) => {

    return (
        <>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label="Nazwa usługi" variant="outlined" onChange={e => set({...get, name: e.target.value})} value={get.name}/>
            </Grid>
            <Grid item xs={6} md={3}>
                <FormControl fullWidth>
                    <InputLabel id="dddd">Czas</InputLabel>
                    <OutlinedInput
                        variant="outlined"
                        labelID={'dddd'}
                        label="Czas"
                        type={'number'}
                        endAdornment={<InputAdornment position="end">MIN</InputAdornment>}
                        onChange={e => set({...get, time: e.target.value})}
                        value={get.time}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
                <FormControl fullWidth>
                    <InputLabel id="ddd">Kwota</InputLabel>
                    <OutlinedInput
                        variant="outlined"
                        labelID={'ddd'}
                        label="Kwota"
                        type={'number'}
                        inputProps={{
                            step: "0.01"
                        }}
                        endAdornment={<InputAdornment position="end">PLN</InputAdornment>}
                        onChange={e => set({...get, price: e.target.value})}
                        value={get.price}
                    />
                </FormControl>
            </Grid>
            <Grid item container xs={12} sx={{alignItems: 'center', justifyContent: 'center'}}>
                <input type={'color'} onChange={(e)=> set({...get, color: e.target.value})} value={get.color}/>
            </Grid>
        </>
    );
};

export default AddService;