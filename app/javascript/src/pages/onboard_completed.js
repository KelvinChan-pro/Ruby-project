import React from 'react';
import { withStuff } from '../hocs';

const OnboardCompleted = ({ state }) => {
	const { user, boat } = state;

	return(
		<div className="row onboard-completed flex">
			<div className="col-md-6 col-sm-12" style={{marginBottom: '50px'}} >
				<h1>Welcome to the family!</h1>
				<div className="title-small-light" style={{marginBottom: '40px'}}>Your experience page has been published. Go check it out!</div>
				<div className="flex">
					<a href={`/boats/${boat.id}`} className="btn-secondary-teal">View my Listing</a>
					<a href='/manage-boat' className="btn-primary" style={{marginLeft: '20px'}} >Mange my Listing</a>
				</div>
			</div>
			<div className="col-md-6 col-sm-12">
				<div className="boat-card-big">
					<div className="boat-photos">
						<div className="cover-photo boat-photo">
							<img src={boat.cover_photo}/>
						</div>
						<div className="preview-photos">
							<div className="preview-photo boat-photo non-mobile-only">
								<img src={boat.preview_photo_1}/>
							</div>
							<div className="preview-photo boat-photo non-mobile-only">
								<img src={boat.preview_photo_2}/>
							</div>
						</div>
					</div>
					<h2 >{boat.title}</h2>
					<div className="subheader-heavy">{boat.marina.name, boat.lake.name}</div>
					<div className="host-info">
						<img className="host-avatar" src={user.profile_picture_url} />
						<div>
							<div className="subheader-heavy">Meet your Host, {user.first_name}</div>
							<div className="body-light greyPool">{user.headline}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withStuff(OnboardCompleted,
	{ 
		state: true, api: true,
		effect: ({ api, match }) => api.getBoat(match.params.id),
		loader: 'boats',
	}
);
