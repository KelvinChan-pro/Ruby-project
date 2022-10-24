import React, { useContext } from 'react';
import { activities, toUSD, listingType } from '../utils';
import Context from '../context';
import { BookmarkBtn } from '../components';

const BoatCard = ({ user, onMouseOver, onMouseOut, ...boat }) => {
	const { state } = useContext(Context);
	const times = Object.keys(boat.time_increments).filter(key => boat.time_increments[key]).sort();
	const first = times[0];
	const last = times[times.length - 1];


	function go() {
		if (state.date) {
			const date = new Date(state.date).getTime();
			window.location.href = `/boats/${boat.id}?date=${date}`;
		} else {
			window.location.href = `/boats/${boat.id}`;
		}
	};

	return(
		<div onMouseOver={onMouseOver} onMouseOut={onMouseOut} >
			<div className="boat-card pointer non-mobile-only" onClick={go} >
				<div className="bc-cover" style={{backgroundImage: `url(${boat.cover_photo}`}}>
					<BookmarkBtn
						id={boat.id}
						bookmarked={boat.bookmarked}
					/>
					<span className="body-light bc-type">{listingType(boat)}</span>
				</div>
				<div className="bc-right">
					<div className="bc-host-info">
						<img className="bc-host-avatar" src={user.profile_picture_url} />
						<div>
							<div className="subheader-heavy">{user.first_name}</div>
							<div className="body-light greyPool bc-headline">{user.headline}</div>
						</div>
					</div>
					<h3>{boat.title}</h3>
					{[0,1,2].map(i =>
						<div style={{marginBottom: '5px'}} className="body-light greyPool">{boat.locations[i] && `${boat.locations[i].lake_name}, ${boat.locations[i].marina_name}`}</div>
					)}
					<div style={{marginBottom: '5px'}} className="body-light greyPool">{first} - {last} Hours {!boat.pro_hopper && `· Up to ${boat.guest_count} Passengers`}</div>
					<div className="body-light">What we'll do:</div>
					<div className="body-light greyPool bc-description">{boat.description}</div>
					<div className="flex bc-activities" style={{margin: '5px 0px'}}>
						{Object.keys(boat.activities).filter(key => boat.activities[key] && !activities[key].hideOnFilter).map((key, i) =>
							<div key={i} className="flex" style={{marginRight: '15px'}} >
								{activities[key].icon()}
								<div style={{marginLeft: '10px'}}>{activities[key].title}</div>
							</div>
						)}
					</div>
					<div className="flex-between subheader-light">
						<div>From {toUSD(boat.price)} <span className="body-light greyPool">/hour</span></div>
						<div className="flex">
							<i className="fas fa-star yellowPool" style={{fontSize: '16px'}} />
							<span style={{margin: '0px 10px'}} >{boat.review_meta.rating}</span>
							<span className="greyPool">({boat.review_meta.count})</span>
						</div>
					</div>
				</div>
			</div>
			<div className="mobile-only pointer mb-boat-card" onClick={go}>
				<img className="mb-cover" src={boat.cover_photo} />
				<BookmarkBtn
					id={boat.id}
					bookmarked={boat.bookmarked}
					style={{
						top: '25px',
						right: '25px',
					}}
				/>
				<div className="flex-between">
					<div className="flex">
						<i className="fas fa-star yellowPool" />
						<div className="subheader-light" style={{margin: '0px 5px'}}>{boat.review_meta.rating}</div>
						<div className="subheader-light greyPool">({boat.review_meta.count})</div>
					</div>
					<div className="subheader-light" style={{marginTop: '10px'}} >From {toUSD(boat.price)} / hour</div>
				</div>
				<div className="title-small" style={{marginTop: '5px'}}>{boat.title}</div>
				<div className="bc-host-info" style={{marginTop: '10px'}}>
					<img className="bc-host-avatar" src={user.profile_picture_url} />
					<div>
						<div className="subheader-heavy">{user.first_name}</div>
						<div className="body-light greyPool bc-headline">{user.headline}</div>
					</div>
				</div>
			</div>
			
		</div>
	);
};

export default BoatCard;
