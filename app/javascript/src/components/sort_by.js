import React, { useState } from 'react';
import { 
	Modal,
	CheckboxList, SimpleForm,
	Submit, ErrorBox,
} from '../components';
import { activities, querify } from '../utils';
import { withStuff } from '../hocs';
import { boatTypes } from '../params';

const SortToggle = ({ name, copy, defaultValue }) => {
	const [value, setValue] = useState(defaultValue);

	function onClick(v) {
		return () => {
			if (v === value) {
				setValue(null);
			} else {
				setValue(v);
			}
		};
	};

	return(
		<div className="flex-between" style={{marginBottom: '15px'}} >
			<div className="subheader-heavy">
				{copy}
			</div>
			<div className="flex-between">
				<i 
					style={{ fontSize: '30px'}}
					className={`fal fa-arrow-circle-up pointer ${value === 'ASC' ? 'primaryPool' : 'light-grey'}`}
					onClick={onClick('ASC')}
				/>
				<i 
					style={{ fontSize: '30px', marginLeft: '15px'}}
					className={`fal fa-arrow-circle-down pointer ${value === 'DESC' ? 'primaryPool' : 'light-grey'}`}
					onClick={onClick('DESC')} 
				/>
			</div>
			<input type="hidden" name={name} value={value} />
		</div>
	);
};

const sorts = {
	price: 'Price',
	rating: 'Rating',
	guest_count: 'Guest Count',
	trip_count: 'Number of Trips',
};

const SortBy = ({ api, state, show, onClose }) => {

	async function onSubmit(sort_by) {
		const res = await api.searchBoats({ ...state.filters, ...sort_by }, true);
		api.store.reduce({
			type: 'set_filters',
			filters: sort_by,
		});

		if (res) onClose();
	};

	return(
		<Modal show={show} onClose={onClose} style={{top: '50px'}} >
			<div className="filters-modal">
				<h2>Sort by</h2>
				<SimpleForm onSubmit={onSubmit}>
					<div className="text-left" style={{padding: '20px 40px',height: '300px', overflowY: 'scroll'}} >
						{Object.keys(sorts).map((key, i) =>
							<SortToggle
								key={i}
								name={'sort_by.' + key}
								copy={sorts[key]}
								defaultValue={state.filters['sort_by.' + key]}
							/>
						)}
					</div>
					<div className="fm-submit" >
						<Submit
							copy="Filter experiences"
							loading={state.loading.filter_boats}
						/>
					</div>
				</SimpleForm>
			</div>
		</Modal>
	);
};

export default withStuff(SortBy, { state: true, api: true });
