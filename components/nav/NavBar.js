import React, {useState} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import TemporaryDrawer from "./Drawer";

const NavBar = () => {

    const [visible, setVisible] = useState(false)

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={()=> setVisible(prevState => !prevState)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
                <TemporaryDrawer visible={visible} setVisible={setVisible}/>
            </AppBar>
        </Box>
    );
};

export default NavBar;