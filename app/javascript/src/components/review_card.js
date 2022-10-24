import React from 'react';
import { parseDateString } from '../utils';

const Stars = ({ count=0 }) => (
	<div className="flex body-light greyPool" style={{marginTop: '10px'}} >
		<div className="flex-between" style={{width: '100px', fontSize: '14px'}} >
			<i 
				className={count >= 1 ? 'fas fa-star yellowPool' : 'far fa-star yellowPool'} 
			/>
			<i 
				className={count >= 2 ? 'fas fa-star yellowPool' : 'far fa-star yellowPool'} 
			/>
			<i 
				className={count >= 3 ? 'fas fa-star yellowPool' : 'far fa-star yellowPool'} 
			/>
			<i 
				className={count >= 4 ? 'fas fa-star yellowPool' : 'far fa-star yellowPool'} 
			/>
			<i 
				className={count >= 5 ? 'fas fa-star yellowPool' : 'far fa-star yellowPool'} 
			/>
		</div>
		<div className="body-light greyPool" style={{marginLeft: '15px'}}>
			{count} Stars
		</div>
	</div>
);

const ReviewCard = ({ user, rating, message, time, i }) => (
	<div className="review-card" style={{marginTop: '20px'}} >
		{
			user.profile_picture_url

			?	<img src={user.profile_picture_url} />

			: 	<i className="fas fa-user-circle avatar" />
		}
		<div className="flex-grow text-left">
			<div className="body-heavy">
				{user.review_name}
			</div>
			<div className="flex-between body-light greyPool">
				<div>
					{parseDateString(time)}
				</div>
				<Stars count={rating} />
			</div>
			<div className="body-light greyPool rc-message">
				{message}
			</div>
		</div>
	</div>
);

export default ReviewCard;