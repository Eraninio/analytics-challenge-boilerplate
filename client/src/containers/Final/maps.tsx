import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, MarkerClusterer, Marker } from '@react-google-maps/api';
import { Event } from '../../models/event';
import axios from 'axios';

const containerStyle = {
    width: '800px',
    height: '700px'
};

const center = {
    lat: 0,
    lng: 0
};

const Map: React.FC = () => {
    const [events, setEvents] = useState<Event[]>();

    useEffect(() => {
        (async () => {
            const { data } = await axios.get('http://localhost:3001/events/all')
            setEvents(data);
            console.log(data)
        })()
    }, []);

    //     const [map, setMap] = React.useState(null)

    //     const onLoad = React.useCallback(function callback(map) {
    //         const bounds = new window.google.maps.LatLngBounds();
    //         map.fitBounds(bounds);
    //         setMap(map)
    //     }, [])

    //     const onUnmount = React.useCallback(function callback(map) {
    //         setMap(null)
    //     }, [])

    return (
        <div>
            <LoadScript googleMapsApiKey="AIzaSyAEMP6kieesS5cRLG8dV_1_nyHdNeUxi7M">
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={1.5}>
                    <MarkerClusterer averageCenter enableRetinaIcons gridSize={80} >
                        {(cluterer) => events ? events.map(event => (
                            <Marker key={event._id} clusterer={cluterer} position={event.geolocation.location} />
                        )) : <div>loading</div>
                        }
                    </MarkerClusterer>
                </GoogleMap>
            </LoadScript>
        </div>
    )
}

export default Map;