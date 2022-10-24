import React, { useState, useEffect } from 'react';
import { parseDateString, observer } from '../utils';
import { 
	BoatCard, GoogleMap,
	DatePicker, LakeSearch,
	Filters, SortBy,
} from '../components';
import { querify } from '../utils';
import { withStuff } from '../hocs';
import { useWidth } from '../hooks';

const Search = ({ api, state }) => {	
	const [showFilters, setShowFilters] = useState(false);
	const [showSortBy, setShowSortBy] = useState(false);
	const width = useWidth();
	const [hoveredMarina, setHoveredMarina] = useState();

	useEffect(() => {
		const streamObserver = observer(() => {
			api.searchBoats(state.filters, true, state.boats.length);
		    streamObserver.unobserve(sb);

		});

		const sb = document.getElementById("search-bottom");

		if (sb) streamObserver.observe(sb);

		return () => streamObserver.unobserve(sb);

	}, [ state.boats.length, state.filters ]);
	
	function updateFilters(newFilters) {
		if (newFilters.lake_id) {
			newFilters.min_lat = null;
			newFilters.max_lat = null;
			newFilters.min_lng = null;
			newFilters.max_lng = null;
		};
		api.searchBoats({ ...state.filters, ...newFilters }, true);
		api.store.reduce({
			type: 'set_filters',
			filters: newFilters,
		});
	};

	return(
		<div>
			<div className="flex-start" >
				<div className="bsr-wrapper" >
					<div className="flex mobile-boat-header mobile-flex-between subheader-heavy">
						<div className="flex boat-back-btn subheader-heavy" onClick={() => window.history.back()} >
							<i className="fal fa-angle-left" />
							<div >{state.lake.name}</div>
						</div>
						<div className="flex">
							<i 
								className="fas fa-sliders-h" 
								style={{margin: '0px 15px'}}
								onClick={() => setShowFilters(true)}
							/>
							<i 
								className="fas fa-sort-amount-up" 
								style={{margin: '0px 15px'}}
								onClick={() => setShowSortBy(true)}
							/>
						</div>
					</div>
					<div className="bsr-top">
						<div className="nav-search-bar flex-grow" >
							<div className="nsb-lake">
								<LakeSearch 
									defaultValue={state.lake.name}
									placeholder="Where are you going?"
									onChange={lake_id => updateFilters({ lake_id })}
								/>
							</div>
							<div className="nsb-div flex-grow" />
							<div className="text-right nowrap" >
								<DatePicker onChange={date => updateFilters({ date })} >
									{({ date, setShow }) =>
										<div className="nsb-date">
											<input
												placeholder="Date"
												value={date && parseDateString(date)}
												onClick={() => setShow(true)}
											/>
											<button className="nav-btn-search" onClick={() => window.location.reload()} >
												<i className="fal fa-search" />
											</button>
										</div>
									}
								</DatePicker>
							</div>
						</div>
						<div className="boat-search-filters non-mobile-only">
							<div className="bsf" onClick={() => setShowFilters(true)} >
								<span>Filters</span>
								<i className="fas fa-sliders-h" />
							</div>
							<div className="bsf" onClick={() => setShowSortBy(true)} >
								<span>Sort by</span>
								<i className="fas fa-sort-amount-up" />
							</div>
						</div>
					</div>
					<Filters show={showFilters} onClose={() => setShowFilters(false)} />
					<SortBy show={showSortBy} onClose={() => setShowSortBy(false)} />
					<div className="boat-search-results">
						{state.boats.map((boat, i) =>
							<BoatCard 
								key={i} 
								{...boat}
								onMouseOver={() => setHoveredMarina(boat.locations[0].marina_name)}
								onMouseOut={() => setHoveredMarina(null)}
							/>
						)}
						{
							state.boats.length === 0

							?	<div 
									className="title-small" 
									style={{
										marginLeft: '30px', 
										marginTop: '10px', 
										width: '100%'
									}} 
								>
									No boats meeting your search criteria
								</div>

							: 	null
						}
						<div id="search-bottom" />
					</div>
				</div>
				{width > 950 &&
					<div style={{width: '40%'}} className="search-map">
						<GoogleMap
							hoveredMarina={hoveredMarina}
							id={state.lake.id}
							style={{
								width: '100%',
								height: "95vh"
							}}
							center={{
			                    lat: state.lake.lat,
			                    lng: state.lake.lng,
			                }}
			                zoom={state.lake.zoom}
							markers={state.marinas}
						/>
					</div>
				}
			</div>
		</div>
	);
};

export default withStuff(Search,
	{
		api: true, state: true, query: true,
		effect: ({ api, query, state }) => {
			api.setHosting(false, false);
			api.searchBoats({ ...query, date: state.date });
			api.store.reduce({ 
				type: 'set_filters', 
				filters: {
					...query,
					date: state.date,
					offset: 0,
				}
			});
		},
		loader: 'search_boats',
	}
);
