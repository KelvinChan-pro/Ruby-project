import React, { useState } from 'react';
import { GoogleMap, Form } from '../components';
import { lakeParams } from '../params';
import { withStuff } from '../hocs';

const Lake = ({ state, api }) => {
    const { lake } = state;

    const [mapSpecs, setMapSpecs] = useState({
        lat: lake.lat,
        lng: lake.lng,
        zoom: lake.zoom,
    });

    const [lakeName, setLakeName] = useState(lake.name);

    function handleSubmit(params) {
        params.approved = params.approved == "1";
        lake.id
        ?   api.updateLake(lake.id, { ...params, ...mapSpecs })
        :   api.createLake({ ...params, ...mapSpecs });
        
    };

    return(
        <div className="container" style={{marginTop: '50px'}} >
            <a className="back-btn" href="/admin/lakes" style={{marginBottom: '15px', display: 'block'}} >
                <i className="fal fa-chevron-left" /> Back
            </a>
            <h2>{lake.name ? lake.name : 'New Lake'}</h2>
            <Form
                type="update_lake"
                submitCopy="Save"
                inputs={lakeParams(lake, ({ target }) => setLakeName(target.value))}
                onSubmit={handleSubmit}
            >
                <GoogleMap
                    setBounds={true}
                    query={!lake.zoom ? lakeName : null}
                    center={{ lat: lake.lat, lng: lake.lng }}
                    zoom={lake.zoom || 10}
                    onChange={e => setMapSpecs(e)}
                    style={{
                        height: '400px',
                        width: '400px',
                        margin: '10px 20px',
                    }}
                />
            </Form>
        </div>
    );
};

export default withStuff(Lake,
    {
        api: true, state: true,
        effect: ({ api, match }) => match.params.id ? api.getLake(match.params.id) : api.stopLoading('lakes'),
        loader: 'lakes',
    }
);
