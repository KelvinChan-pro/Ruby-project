import React, { useState } from 'react';
import { CheckInput, CheckboxList } from '../components';
import { activities } from '../utils';

const ActivityChecks = ({ defaultChecked={}, sub_activities={}, pro_hopper }) => {
	const [checked, setChecked] = useState(defaultChecked);

	function chek(key) {
		return () => {
			setChecked(prev => {
				const n = prev;
				n[key] = !n[key];
				return {
					...prev, ...n,
				};
			});
		};
	};

	function proHopper(key) {
		return pro_hopper && key === 'celebrity_requested';
	};

	return(
		<div>
			{Object.keys(activities).filter(key => !activities[key].hideOnIndex).map((key, i) =>
				<div key={i} style={{marginBottom: '25px'}} >
					<div className={`activity-check ${checked[key] || proHopper(key) ? 'activity-checked' : ''}`} onClick={chek(key)} >
						<CheckInput
							name={key}
							forceCheck={true} 
							defaultValue={checked[key] || proHopper(key)}
							controlled={proHopper(key)}
							forceCheck={proHopper(key)}
						>
							<div className="flex">
								{activities[key].icon()}
								<div style={{marginLeft: '15px'}} >
									<div className="body-heavy">
										{activities[key].title}
									</div>
									<div className="small-light">
										{activities[key].subtitle}
									</div>
								</div>
							</div>
						</CheckInput>
					</div>
					{checked[key] &&
						<div>
							{Object.keys(activities[key].checkboxes).length != 0 && <div className="subheader-heavy" style={{margin: '20px 0px 10px 0px'}}>Select any activities you offer below</div>}
							<CheckboxList
								list={activities[key].checkboxes}
								defaultValue={sub_activities[key]}
							/>
						</div>
					}
				</div>
			)}
		</div>
	);
};

export default ActivityChecks;
