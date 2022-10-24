import React, { useState } from 'react';
import { BoatLocation } from '../components';
import { withStuff } from '../hocs';

const BoatLocations = ({ state }) => {
    const { boat } = state;
    const [n, setN] = useState(boat && boat.locations && boat.locations.length ? 0 : 1);
    const [deleting, setDeleting] = useState([]);

    function removeLocation(i) {
        setDeleting(prev => {
            prev.push(i);
            return [...prev];
        })
    };

    function decreaseN() {
        setN(prev => prev - 1);
    };

    const a = new Array(n);


    return(
        <div>
            <div className="title-small" style={{margin: '20px 0px 10px 0px'}}>Where are you sharing your boat?</div>
            {boat.locations.map((location, i) => {
            	return !deleting.includes(i) && <BoatLocation
                		key={i}
                		index={i}
                        hideNewLocationBtn={true}
                        removeLocation={removeLocation}
                		{...location}
                	/>
            }
            )}
            {[1,2,3,4,5,6,7,8,9,10].map(i =>
                i <= n &&
                <BoatLocation
                    key={boat.locations.length + i - 1}
                    index={boat.locations.length + i - 1}
                    newLocation={true}
                    decreaseN={decreaseN}
                />
            )}
            <button 
                className="btn-primary" 
                style={{margin: '20px 0px'}}
                onClick={(e) => {
                    setN(prev => prev + 1);
                    e.preventDefault();
                    return false;
                }}
            >
                Add another location
            </button>
        </div>
    );
};

export default withStuff(BoatLocations,
	{
		state: true, api: true,
		effect: ({ api }) => api.getMarinas(),
		loader: 'marinas',
	}
);