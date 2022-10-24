import React from 'react';
import { BookmarkBtn } from '../components';

const BookmarkedBoatCard = ({ id, title, cover_photo, user, lake_name }) => {

	function go() {
		window.location.href = `/boats/${id}`;
	};

	return(
		<div className="col-md-4 col-sm-6 col-xs-12">
			<div className="booking-card pointer" onClick={go} >
				<BookmarkBtn id={id} bookmarked={true} style={{ top: '25px', right: '25px'}} />
				<img src={cover_photo} className="bc-cover" />
				<div className="bc-description">
					<div className="body-light greyPool">{lake_name}</div>
					<div className="subheader-heavy" style={{marginBottom: '5px'}} >{title}</div>
					<div className="bc-host-info">
						<img className="bc-host-avatar" src={user.profile_picture_url} />
						<div>
							<div className="body-heavy">{user.first_name}</div>
							<div className="body-light greyPool">{user.headline}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookmarkedBoatCard;