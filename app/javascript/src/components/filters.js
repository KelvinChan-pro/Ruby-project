import React from 'react';
import { 
	Modal, Inputs, Toggler,
	CheckboxList, SimpleForm,
	Submit, ErrorBox, Incrementer,
} from '../components';
import { activities, querify } from '../utils';
import { withStuff } from '../hocs';
import { boatTypes } from '../params';

const Filters = ({ api, state, show, onClose }) => {

	async function onSubmit(params) {
		const np = Object.keys(params).reduce((np, key) => {
			const [a, b, c] = key.split('.');

			if (a === 'activities') {
				if (c === b) {
					np[b] = params[key] == '1';
				} else {
					np[c] = params[key] == '1';
				}
			} else if (a === 'boat_type') {
				if (params[key] === '1') {
					np.boat_type.push(b);
				}
			} else {
				np[a] = params[key];
			};
			return np;
		}, { boat_type: [] });

		np.boat_type = np.boat_type.join(',');
		np.offset = 0;
		const nf = { ...state.filters, ...np };
		const nnf = Object.keys(nf).reduce((mem, key) => {
			if (nf[key] != false) {
				mem[key] = nf[key];
			};
			return mem;
		}, {});

		if (nnf.celebrity_fishing || nnf.celebrity_watersports) {
			nnf.celebrity = true;
		};

		const res = await api.searchBoats(nnf, true);
		api.store.reduce({
			type: 'set_filters',
			filters: nnf,
			replace: true,
		});

		if (res) onClose();
	};

	return(
		<Modal show={show} onClose={onClose} style={{top: '50px'}} >
			<div className="filters-modal">
				<h2>Filters</h2>
				<SimpleForm onSubmit={onSubmit}>
					<div className="text-left" style={{padding: '20px 40px',height: '400px', overflowY: 'scroll'}} >
						<div className="fm-section">
							<div className="title-small">Price Range</div>
							<Inputs
								inputs={[
									{
										label: 'min price ($)',
										type: 'number',
										name: 'min_price',
										col: '6',
										defaultValue: state.filters.min_price,
									},
									{
										label: 'max price ($)',
										type: 'number',
										name: 'max_price',
										col: '6',
										defaultValue: state.filters.max_price,
									}
								]}
							/>
						</div>
						<div className="fm-section">
							<div className="title-small">Activities</div>
							{Object.keys(activities).filter(key => !activities[key].hideOnFilter).map((key, i) =>
								<div className="activity-filter" key={i}>
									<Toggler
										Head={({ show }) => (
											<div className="subheader-heavy">
												<div className="flex-between">
													<div className="flex">
														{activities[key].icon()}
														<div style={{marginLeft: '15px'}}>{activities[key].title}</div>
													</div>
													<i className={`greyPool fal fa-angle-${show ? 'up' : 'down'}`} />
												</div>
											</div>
										)}
										Body={() => (
											<CheckboxList
												prefix={`activities.${key}.`}
												list={{
													[key]: 'All',
													...activities[key].checkboxes,
												}}
												defaultValue={state.filters}
											/>
										)}
									/>
								</div>
							)}
						</div>
						<div className="fm-section flex-between">
							<div className="title-small">Passengers</div>
							<Incrementer 
								name="guest_count"
								defaultValue={state.filters.guest_count}
							/>
						</div>
						<div className="fm-section">
							<div className="title-small">Type of Boat</div>
							<CheckboxList
								prefix={'boat_type.'}
								list={boatTypes}
								defaultValue={(state.filters.boat_type || '').split(',').reduce((df, key) => {
									df[key] = true;
									return df;
								}, {})}
							/>
						</div>
						<ErrorBox error={state.errors.filter_boats} />
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

export default withStuff(Filters, { state: true, api: true });
