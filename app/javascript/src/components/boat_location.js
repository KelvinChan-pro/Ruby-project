import React, { useState } from 'react';
import { newMarinaParams } from '../params';
import { Inputs, Select, SearchSelect } from '../components';
import { withStuff } from '../hocs';

const BoatLocation = ({ index, state, hideNewLocationBtn, decreaseN, removeLocation, newLocation, ...location }) => {
    const [lake, setLake] = useState(location.lake_id);
    const [add, setAdd] = useState(false);

    return(
        <div>
            <div className="flex" style={{margin: '30px 0px 10px 0px'}} >
                <div className="title-small">Location {index + 1}</div>
                <i style={{marginLeft: '25px'}} onClick={newLocation ? decreaseN : () => removeLocation(index)} className="fal fa-trash-alt pointer redPool" />
            </div>
            <SearchSelect
                label="Select a lake"
                name={'lake.' + index}
                placeholder="Select lake"
                options={state.lakes}
                defaultValue={location.lake_id}
                onChange={(value) => setLake(value)}
            />
            <SearchSelect
                label="Select a marina / ramp meeting location"
                name={'marina.' + index}
                placeholder="Select marina / ramp meeting location"
                options={state.marinas[lake] || {}}
                defaultValue={location.marina_id}
            />
            {!hideNewLocationBtn &&
                <div className="subheader-light" style={{margin: '20px 0px'}}>
                    Don't see the lake or marina you are looking for? <span className="link-btn" onClick={() => setAdd(prev => !prev)} >Add a new one.</span>
                </div>
            }
            {add && <Inputs inputs={newMarinaParams(state.lakes, lake, index)} />}
        </div>
    );
};

export default withStuff(BoatLocation, { state: true });
