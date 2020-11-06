import { Event } from '../../models/event'
import React, { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { EventPagination } from "../../models";
import EventList from "./Temp/EventList";
import { eventMachine } from "../../machines/eventMachine";

const EventsPagedlList: React.FC = () => {
    const [current, send] = useMachine(eventMachine);
    const { pageData, results } = current.context;
    console.log(results);

    const [searchWord, setSearchWord] = useState<string>('')
    const search = (e: any) => {
        setSearchWord(e.target.value)
    }

    useEffect(() => {
        send("FETCH", { search: searchWord });
    }, [send, searchWord]);

    const loadNextPage = (page: number) =>
        send("FETCH", { page, search: searchWord });

    return (
        <>
            <EventList
                header="All Filtered Events"
                events={results as Event[]}
                isLoading={current.matches("loading")}
                loadNextPage={loadNextPage}
                pagination={pageData as EventPagination}
                search={search}
            />
        </>
    );
};

export default EventsPagedlList;