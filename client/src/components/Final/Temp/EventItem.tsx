import React from "react";
import {
    ListItem,
    Typography,
    Grid,
    Paper,
    ListItemAvatar,
    Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { Event } from '../../../models'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(0),
        margin: "auto",
        width: "100%",
    },
    avatar: {
        width: theme.spacing(2),
    },
    socialStats: {
        [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(2),
        },
    },
    countIcons: {
        color: theme.palette.grey[400],
    },
    countText: {
        color: theme.palette.grey[400],
        marginTop: 2,
        height: theme.spacing(2),
        width: theme.spacing(2),
    },
    red: {
        backgroundColor: 'red'
    },
    blue: {
        backgroundColor: 'blue'
    },
    green: {
        backgroundColor: 'green'
    },
    brown: {
        backgroundColor: 'brown'
    },
    purple: {
        backgroundColor: 'purple'
    },
    gray: {
        backgroundColor: 'gray'
    },
}));
const colors = ['red', 'blue', 'green', 'brown', 'purple', 'gray'];

const rnd = () => {
    return Math.floor(Math.random() * 5);
}
type EventProps = {
    event: Event;
    num: number;
};

const EventItem: React.FC<EventProps> = ({ event, num }) => {
    const classes: any = useStyles();
    const history = useHistory();

    const showEventDetail = (eventId: string) => {
        history.push(`/event/${eventId}`);
    };

    return (
        <ListItem
            data-test={`event-item-${event._id}`}
            alignItems="flex-start"
            onClick={() => showEventDetail(event._id)}
        >
            <Paper className={classes.paper} elevation={0}>
                <Grid container spacing={2}>
                    <Grid item>
                        <ListItemAvatar>
                            <Avatar className={classes[colors[num]]}> {event.distinct_user_id[0]} </Avatar>
                        </ListItemAvatar>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="row" spacing={2}>
                            <Grid item xs>
                                <Typography variant="body1" color="primary" gutterBottom>
                                    <strong><u>UserId:</u></strong> {event.distinct_user_id}
                                </Typography>
                                <Typography variant="body2" color="textPrimary" gutterBottom>
                                    <strong><u>Date:</u></strong> {new Date(event.date).toDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body2" color="textPrimary" gutterBottom>
                                    <strong><u>Operating System:</u></strong> {event.os}
                                </Typography>
                                <Typography variant="body2" color="textPrimary" gutterBottom>
                                    <strong><u>Browser:</u></strong> {event.browser}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body2" color="textPrimary" gutterBottom>
                                    <strong><u>Event Type:</u></strong> {event.name}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </ListItem >

    );
};

export default EventItem;