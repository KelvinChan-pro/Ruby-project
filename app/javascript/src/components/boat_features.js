import React, { useState } from 'react';
import { CheckboxList, ListInput, CheckInput } from '../components';
import { boatFeatures } from '../utils';

const BoatFeatures = ({ features, extra_features, ...boat }) => {
    const [filet, setFilet] = useState(boat.filet_package);
    const [media, setMedia] = useState(boat.media_package);

	return(
		<div>
			<div className="subheader-heavy">Features</div>
			<CheckboxList
				prefix='features.'
				list={boatFeatures}
				defaultValue={features}
			/>
            <div style={{margin: '30px 0px'}}>
                <CheckInput
                    defaultValue={boat.filet_package}
                    name="filet_package"
                    copy="Clean/Filet Fish"
                    onChange={v => setFilet(v)}
                />
                {
                    filet && <div className="input-primary" style={{marginTop: '10px'}} >
                                <label>How much do you want to charge for this feature? ($)</label>
                                <input 
                                    defaultValue={boat.filet_package_price}
                                    type="number" 
                                    name="filet_package_price"
                                    placeholder="Enter the price you would like to charge for this feature."
                                />
                            </div>
                }
            </div>
            <div style={{margin: '30px 0px'}}>
                <CheckInput
                    defaultValue={boat.media_package}
                    name="media_package"
                    copy="Photo/Video Package"
                    onChange={v => setMedia(v)}
                />
                {
                    media && <div className="input-primary" style={{marginTop: '10px'}} >
                                <label>How much do you want to charge for this feature? ($)</label>
                                <input 
                                    defaultValue={boat.media_package_price}
                                    type="number" 
                                    name="media_package_price"
                                    placeholder="Enter the price you would like to charge for this feature."
                                />
                            </div>
                }
            </div>
            <ListInput
                key={1}
                name="extra_features"
                placeholder="Enter additional features here"
                defaultValue={extra_features}
            >
                {(value, removeItem) =>
                    <div className="flex" style={{marginBottom: '20px'}}>
                        <i className="primaryPool fas fa-check-square check-input"  />
                        <div className="flex-grow">{value}</div>
                        <i className="fal fa-trash-alt" style={{marginRight: '10px'}} onClick={removeItem} />
                    </div>
                }
            </ListInput>
		</div>
	);
};

export default BoatFeatures;
