// This file is shared across the demos.
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import StarIcon from '@material-ui/icons/Star';
import ReportIcon from '@material-ui/icons/Report';

import { Link } from 'react-router-dom'

export const mailFolderListItems = (
    <div>
        <ListItem button component={Link} to="/dailyinput">
            <ListItemIcon>
                <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="新增每日戰情" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
                <StarIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>
    </div>
);

export const otherMailFolderListItems = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="YINLCHEN" />
        </ListItem>
    </div>
);
