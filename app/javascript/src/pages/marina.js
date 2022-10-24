import React, { useEffect, useState } from 'react';
import { GoogleMap, Form } from '../components';
import { marinaParams } from '../params';
import { withStuff } from '../hocs';

const Marina = ({ api, state }) => {
    const { marina } = state;

    const [marker, setMarker] = useState({});

    function handleSubmit(params) {
        params.approved = params.approved == "1";
        api.updateMarina(marina.id, { ...params, ...marker });
    };

    useEffect(() => {
        setMarker({ lat: marina.lat, lng: marina.lng });
    }, [ marina ]);

    return(
        <div className="container" style={{marginTop: '50px'}} >
            <a className="back-btn" href="/admin/marinas" style={{marginBottom: '15px', display: 'block'}} >
                <i className="fal fa-chevron-left" /> Back
            </a>
            <h2>{marina.name}</h2>
            <Form
                type="update_marina"
                submitCopy="Save"
                inputs={marinaParams(marina)}
                onSubmit={handleSubmit}
            >
                <GoogleMap
                    query={!marina.lat ? marina.address_query : null}
                    center={{ lat: marina.lat, lng: marina.lng }}
                    zoom={15}
                    onClick={e => setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                    style={{
                        height: '400px',
                        width: '400px',
                        margin: '10px 20px',
                    }}
                    markers={[marker]}
                />
            </Form>
        </div>
    );
};

export default withStuff(Marina,
    {
        api: true, state: true,
        effect: ({ api, match }) => api.getMarina(match.params.id),
        loader: 'marinas',
    }
);
