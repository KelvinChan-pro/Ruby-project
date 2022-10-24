import React from 'react';
import { withStuff } from '../hocs';
import { BookmarkedBoatCard } from '../components';

const SavedListings = ({ state }) => {
	return(
		<div className="container" style={{margin: '40px auto'}}>
			<h1>Saved Listings</h1>
			<div className="row" style={{marginTop: '25px'}} >
				{state.boats.map((boat, i) =>
					<BookmarkedBoatCard key={i} {...boat} />
				)}
			</div>
		</div>
	);
};

export default withStuff(SavedListings,
	{
		state: true,
		api: true,
		effect: ({ api }) => {
			api.getBookmarks();
			api.setHosting(false, false);
		},
		loader: 'boats',
	}
	
);