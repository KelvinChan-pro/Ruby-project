import React from 'react';

const ListingCard = ({ onClick, ...boat }) => {

	return(
		<div className="col-md-4 col-sm-6 col-xs-12">
			<div className="booking-card pointer" onClick={onClick} >
				<img className="bc-cover" src={boat.cover_photo} />
				<div className="bc-description">
					<div className="body-heavy greyPool"></div>
					<div className="subheader-heavy" style={{margin: '5px 0px'}} >{boat.title}</div>
				</div>
			</div>
		</div>
	);
};

export default ListingCard;