import React, { useState } from 'react';
import { CheckInput } from '../components';
import { isFunction } from '../utils';

const CheckboxList = ({ prefix='', col='6', list, defaultValue={}, checkedIcon, uncheckedIcon, children }) => {
	const [listState, setListState] = useState(list);

	return(
		<div className="row">
			{Object.keys(listState).map((key, i) =>
				<div key={i} className={`col-sm-${col}`} style={{marginTop: '15px'}} >
					{
						isFunction(listState[key])

						?	<CheckInput
								name={prefix + key}
								defaultValue={defaultValue[key]}
								checkedIcon={checkedIcon}
								uncheckedIcon={uncheckedIcon}
		                        children={children}
		                        checkChild={!!children}
							>
								{listState[key]()}
							</CheckInput>

						: 	<CheckInput
								name={prefix + key}
								copy={listState[key]}
								defaultValue={defaultValue[key]}
								checkedIcon={checkedIcon}
								uncheckedIcon={uncheckedIcon}
		                        children={children}
		                        checkChild={!!children}
							/>
					}
				</div>
			)}
		</div>
	);
};

export default CheckboxList;
