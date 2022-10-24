import React from 'react';
import { CheckboxList, BoolListInput, ErrorBox } from '../components';
import { boatRules } from '../utils';
import { withStuff } from '../hocs';

const BoatRules = ({ rules={}, extra_rules=[], api, state }) => {
	return(
        <div>
    		<CheckboxList
                col="12"
    			list={boatRules}
    			defaultValue={rules || {}}
    		>
                {(checked, setChecked) =>
                    checked

                    ?   <div className="boat-rule flex-between">
                            <i className="fas fa-check-circle greenPool" onClick={() => setChecked(true)} />
                            <i className="fal fa-times-circle light-grey" onClick={() => setChecked(false)} />
                        </div>

                    :   <div className="boat-rule flex-between">
                            <i className="fal fa-check-circle light-grey" onClick={() => setChecked(true)} />
                            <i className="fas fa-times-circle redPool" onClick={() => setChecked(false)} />
                        </div>
                }
            </CheckboxList>
            <BoolListInput
                name="extra_rules"
                placeholder="Enter additional rules here"
                defaultValue={extra_rules}
                onChange={v => {
                    if (v.split(' ').length > 10) {

                        api.setError('boat_rules', 'Rules cannot exceed 10 words.');
                        return false;

                    } else {

                        return true;

                    }
                }}
            >
                {(value, removeItem, checked, setChecked) =>
                    <div className="flex" style={{marginBottom: '20px'}}>
                        {
                            checked

                            ?   <div className="boat-rule flex-between">
                                    <i className="fas fa-check-circle greenPool" onClick={() => setChecked(true)} />
                                    <i className="fal fa-times-circle light-grey" onClick={() => setChecked(false)} />
                                </div>

                            :   <div className="boat-rule flex-between">
                                    <i className="fal fa-check-circle light-grey" onClick={() => setChecked(true)} />
                                    <i className="fas fa-times-circle redPool" onClick={() => setChecked(false)} />
                                </div>
                        }
                        <div className="flex-grow">{value}</div>
                        <i className="fal fa-trash-alt" style={{marginRight: '10px'}} onClick={removeItem} />
                    </div>
                }
            </BoolListInput>
            <ErrorBox error={state.errors.boat_rules} />
        </div>
	);
};

export default withStuff(BoatRules, { api: true, state: true });
