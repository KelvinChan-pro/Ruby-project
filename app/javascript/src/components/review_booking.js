import React, { useState } from 'react';
import { Modal, ErrorBox, Submit } from '../components';
import { withStuff } from '../hocs';

const Stars = ({ count=0, onClick }) => (
	<div className="flex body-light greyPool" style={{marginTop: '10px'}} >
		<div className="flex-between" style={{width: '150px', fontSize: '18px'}} >
			<i 
				onClick={() => onClick(1)}
				className={count >= 1 ? 'fas fa-star primaryPool' : 'far fa-star greyPool'} 
			/>
			<i 
				onClick={() => onClick(2)}
				className={count >= 2 ? 'fas fa-star primaryPool' : 'far fa-star greyPool'} 
			/>
			<i 
				onClick={() => onClick(3)}
				className={count >= 3 ? 'fas fa-star primaryPool' : 'far fa-star greyPool'} 
			/>
			<i 
				onClick={() => onClick(4)}
				className={count >= 4 ? 'fas fa-star primaryPool' : 'far fa-star greyPool'} 
			/>
			<i 
				onClick={() => onClick(5)}
				className={count >= 5 ? 'fas fa-star primaryPool' : 'far fa-star greyPool'} 
			/>
		</div>
		<div className="body-light greyPool" style={{marginLeft: '15px'}}>
			{count} Stars
		</div>
	</div>
);

const ReviewBooking = ({ api, state, ...props }) => {
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [rating, setRating] = useState();
	const { booking } = state;

	async function submitReview() {
		const res = await api.createReview({ 
			rating, message,
			booking_id: booking.id,
		});

		setSuccess(res);
	};

	return(
		<Modal {...props}>
			<div style={{padding: '30px'}}>
				<ErrorBox error={state.errors.reviews} />
			{
				success

				? 	<div className="text-center">
						<i className="fas fa-check-circle big-check" />
						<h2>Your review is complete!</h2>
						<div style={{margin: '20px 0px 20px 0px'}} className="body-light greyPool text-center">Thanks for leaving feedback!</div>
						<button className="btn-primary" style={{width: '100%', marginBottom: '20px'}} onClick={props.onClose}>Close</button>
					</div>

				: 	<div className="text-left" >
						<h2>Review your Trip</h2>
						<div className="body-light greyPool">
							{
								state.hosting

								? 	<div>
										Keep in mind that your review will be available under {booking.user.first_name}'s profile. Any reviews with inappropriate language will not be allowed.
									</div>

								: 	<div>
										Keep in mind that your review will be available under the listing for this trip. Any reviews with inappropriate language will not be allowed.
									</div>
							}
						</div>
						<div className="subheader-heavy" style={{marginTop: '15px'}} >
							Rate your experience
						</div>
						<div className="body-light greyPool">
							How would you rate your overall experience on a scale of 1-5 stars?
						</div>
						<Stars 
							count={rating}
							onClick={(count) => setRating(count)}
						/>
						<div className="subheader-heavy" style={{marginTop: '15px'}}>
							Write a public review
						</div>
						<div className="body-light greyPool">
							Tell future {state.hosting ? 'guests' : 'hosts'} about what they can expect on a trip {state.hosting ? `with ${booking.user.first_name}` : 'like this'}.
						</div>
						<div className="input-primary">
							<textarea
								value={message}
								onChange={({ target }) => setMessage(target.value)}
								placeholder={`What was your experience like? What is what you expected? ${state.hosting ? `Would you invite ${booking.user.first_name} to book with you again?` : 'How was your experience with the boat host?'}`}
								rows="5"
							/>
						</div>
						<div className="text-right">
							<Submit
								loading={state.loading.reviews}
								copy="Submit Review"
								onClick={submitReview}
							/>
						</div>
					</div>
			}
			</div>
		</Modal>
	);
};

export default withStuff(ReviewBooking, { state: true, api: true });
