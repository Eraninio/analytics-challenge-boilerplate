import React, { ReactNode, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { Button, ListSubheader, Grid } from "@material-ui/core";
import { isEmpty } from "lodash/fp";
import { Event } from '../../../models'
import SkeletonList from "../../SkeletonList";
import { EventPagination } from "../../../models";
import EventInfiniteList from "./EventInfiniteList";

export interface EventListProps {
    header: string;
    events: Event[];
    isLoading: Boolean;
    loadNextPage: Function;
    pagination: EventPagination;
    search: any;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        paddingLeft: theme.spacing(1),
    },
}));

const EventList: React.FC<EventListProps> = ({
    header,
    events,
    isLoading,
    loadNextPage,
    pagination,
    search
}) => {
    const classes = useStyles();

    const showSkeleton = isLoading && isEmpty(pagination);

    return (
        <Paper className={classes.paper}>
            <ListSubheader component="div">
                {header}
                <input onChange={search} />
            </ListSubheader>
            {showSkeleton && <SkeletonList />}
            {events.length > 0 && (
                <EventInfiniteList
                    events={events}
                    loadNextPage={loadNextPage}
                    pagination={pagination}
                />
            )}
        </Paper>
    );
};

export default EventList;