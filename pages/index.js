import sha256 from 'crypto-js/sha256';
import {Box, Grid, TextField, Button} from "@mui/material";
import {useState} from "react";
import login from "../scripts/login";

export default function Home() {

    const [error, setError] = useState(false)

    const [data, setData] = useState({})

    return (
    <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', marginLeft: 'auto', marginRight: "auto" }}
        xs={10}
        md={2}
    >
        <Grid item container xs={12} md={12} direction={'column'} rowSpacing={10}>
            <form onSubmit={e => login(setError, data, e)}>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Login"
                        variant="standard"
                        required error={error}
                        onChange={e => setData({...data, login: e.target.value})}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Hasło"
                        fullWidth
                        variant="standard"
                        type={"password"}
                        required error={error}
                        helperText={error ? 'Złe hasło' : null}
                        onChange={e => setData({...data, password: sha256(e.target.value).toString()})}
                    />
                </Box>
                <Box mb={2} width={'100%'}>
                    <Button
                        variant="contained"
                        xs={12}
                        md={4}
                        fullWidth={true}
                        type={'submit'}
                    >
                        Login
                    </Button>
                </Box>
            </form>
        </Grid>
    </Grid>
  )
}
