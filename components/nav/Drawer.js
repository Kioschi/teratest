import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import NavLink from "./NavLink";
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HomeIcon from '@mui/icons-material/Home';
import {useEffect, useState} from "react";
import {decode} from "jsonwebtoken";
import Cookies from "js-cookie";

export default function TemporaryDrawer({visible, setVisible}) {

    const [hasPrivileges, setHasPrivileges] = useState(0)

    //cannot read property null of admin... -.-
    useEffect(()=>{
        setHasPrivileges(decode(Cookies.get('JWT')).admin)
    }, [])

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setVisible(open);
    };

    const list = () => (
        <Box
            sx={{ width:  250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List sx={{display: hasPrivileges ? 'inital' : 'none'}}>
                <NavLink text={'STRONA GŁÓWNA'} url={'/dashboard/'} icon={<HomeIcon/>}/>
                <NavLink text={'Umów wizytę'} url={'/dashboard/appointments/add'} icon={<BookOnlineIcon/>}/>
            </List>
            <Divider sx={{display: hasPrivileges ? 'inital' : 'none'}}/>
            <List sx={{display: hasPrivileges ? 'inital' : 'none'}}>
                <NavLink text={'Lista użytkowników'} url={'/dashboard/users/'} icon={<FormatListBulletedIcon/>}/>
                <NavLink text={'Lista klientów'} url={'/dashboard/customers/'} icon={<FormatListBulletedIcon/>}/>
            </List>
            <Divider sx={{display: hasPrivileges ? 'inital' : 'none'}}/>
            <List sx={{display: hasPrivileges ? 'inital' : 'none'}}>
                <NavLink text={'Dodaj klienta'} url={'/dashboard/customers/add'} icon={<AddIcon/>}/>
                <NavLink text={'Dodaj użytkownika'} url={'/dashboard/users/add'} icon={<AddIcon/>}/>
            </List>
            <Divider sx={{display: hasPrivileges ? 'inital' : 'none'}}/>
            <List sx={{display: hasPrivileges ? 'inital' : 'none'}}>
                <NavLink text={'EDYTUJ OPCJE'} url={'/dashboard/options/'} icon={<EditIcon/>}/>
            </List>
            <Divider sx={{display: hasPrivileges ? 'inital' : 'none'}}/>
            <List>
                {/*for a weird issue it cannot be a simple on click function but instead redirecting to logout page...*/}
                <NavLink text={'WYLOGUJ'} url={'/dashboard/logout/'} icon={<LogoutIcon/>}/>
            </List>
        </Box>
    );

    return (
        <Drawer
            anchor={'left'}
            open={visible}
            onClose={toggleDrawer(false)}
        >
            {list()}
        </Drawer>
    );
}