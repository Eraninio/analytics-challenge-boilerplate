import React from "react";
import { get } from "lodash/fp";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { InfiniteLoader, List, Index } from "react-virtualized";
import "react-virtualized/styles.css";
import { Event } from '../../../models/event'
import EventItem from "./EventItem";
import { EventPagination } from "../../../models";
import { useMediaQuery, Divider } from "@material-ui/core";

export interface EventListProps {
    events: Event[];
    loadNextPage: Function;
    pagination: EventPagination;
}

const useStyles = makeStyles((theme) => ({
    eventList: {
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
}));

const EventInfiniteList: React.FC<EventListProps> = ({
    events,
    loadNextPage,
    pagination,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isXsBreakpoint = useMediaQuery(theme.breakpoints.down("xs"));
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const itemCount = pagination.hasNextPages ? events.length + 1 : events.length;

    const loadMoreItems = () => {
        return new Promise((resolve) => {
            return resolve(pagination.hasNextPages && loadNextPage(pagination.page + 1));
        });
    };

    const isRowLoaded = (params: Index) =>
        !pagination.hasNextPages || params.index < events.length;

    // @ts-ignore
    function rowRenderer({ key, index, style }) {
        const event = get(index, events);

        if (index < events.length) {
            return (
                <div key={key} style={style}>
                    <EventItem event={event} num={index % 5} />
                    <Divider variant={isMobile ? "fullWidth" : "inset"} />
                </div>
            );
        }
    }

    return (
        <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreItems}
            rowCount={itemCount}
            threshold={2}
        >
            {({ onRowsRendered, registerChild }) => (
                <div data-test="event-list" className={classes.eventList}>
                    <List
                        rowCount={itemCount}
                        ref={registerChild}
                        onRowsRendered={onRowsRendered}
                        height={isXsBreakpoint ? theme.spacing(74) : theme.spacing(88)}
                        width={isXsBreakpoint ? theme.spacing(38) : theme.spacing(110)}
                        rowHeight={isXsBreakpoint ? theme.spacing(28) : theme.spacing(16)}
                        rowRenderer={rowRenderer}
                    />
                </div>
            )}
        </InfiniteLoader>
    );
};

export default EventInfiniteList;