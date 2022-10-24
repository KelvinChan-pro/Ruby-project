import React from 'react';
import { ReviewCard } from '.';

const Reviews = ({ reviews }) => reviews.map((review, i) =>
	<ReviewCard key={i} {...review} />
);

export default Reviews;