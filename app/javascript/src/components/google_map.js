import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';
import Context from '../context';

const GMarker = ({ lat, lng, name, boat_count, hoveredMarina }) => {
    const [tooltip, setTooltip] = useState(false);

    return(
        <Marker
            position={{ lat, lng }}
            onMouseOver={() => setTooltip(true)}
            onMouseOut={() => setTooltip(false)}
            labelContent={`<div className="map-marker">${boat_count}</div>`}
        >
            {
                name == hoveredMarina  || tooltip

                ?   <InfoWindow onCloseClick={() => setTooltip(false)} > 
                        <div style={{padding: '0px 8px'}}>
                            <div className="title-small">{name}</div>
                            <div className="caption-light greyPool">{boat_count} listings available</div>
                        </div>
                    </InfoWindow>

                :   null
            }
        </Marker>
    );
};

const GMap = ({ id, setBounds, style, markers=[], lake, query, center, zoom, onChange, onClick, hoveredMarina }) => {
    const { state, api, google_key } = useContext(Context);
    const [centerState, setCenter] = useState(center || {});
    const [zoomState, setZoom] = useState(zoom);
	const [map, setMap] = useState(null);
    const [timeout, saveTimeout] = useState(null);

    console.log("Google Key => ", `${google_key}`)

    useEffect(() => {
        setCenter(center || {});
        setZoom(zoom);
    }, [ id ]);

    useEffect(() => {
        if (query) {
            (async function() {
                const res = await api.geocode(query);
                setCenter({ ...res.location });

                if (setBounds && map && res.bounds) {
                    map.fitBounds({
                        north: res.bounds.northeast.lat,
                        east: res.bounds.northeast.lng,
                        south: res.bounds.southwest.lat,
                        west: res.bounds.southwest.lng,
                    });
                };
            })();
        }
    }, [ !map, query ]);


    function handleRequest() {
        if (onChange) {
            if (timeout) clearTimeout(timeout);

            saveTimeout(
                setTimeout(() => onChange(getCenterAndZoom()), 250)
            );
        };
    };

	function getCenterAndZoom() {
		if (map) {
            return {
                lat: map.getCenter().lat(),
                lng: map.getCenter().lng(),
                zoom: map.getZoom(),
                bounds: {
                    lat: {
                        min: map.getBounds().getSouthWest().lat(),
                        max: map.getBounds().getNorthEast().lat(),
                    },
                    lng: {
                        min: map.getBounds().getSouthWest().lng(),
                        max: map.getBounds().getNorthEast().lng(),
                    },
                },
            }
		} else {
            return {};
        }
	};

    if (!(centerState.lat && centerState.lng)) return <div/>;

    return <LoadScript
        googleMapsApiKey={`${google_key}`}
    >
        <div style={style} >
            <GoogleMap
                mapContainerStyle={style}
                center={centerState}
                zoom={zoomState}
                onLoad={m => setMap(m)}
                onClick={onClick}
                onBoundsChanged={handleRequest}
                onCenterChanged={handleRequest}
            >
                <div>
                    {markers.map((props, i) =>
                        <GMarker {...props} key={i} hoveredMarina={hoveredMarina} />
                    )}
                </div>
            </GoogleMap>
        </div>
    </LoadScript>
};

export default GMap;
