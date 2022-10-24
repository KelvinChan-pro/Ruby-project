import React from 'react';

const HowItWorks = () => {
	return(
		<div className="container" style={{marginTop: '50px'}} >
        	<h2 style={{marginBottom: '15px'}}>What is Lake Hop</h2>
        	<div className="title-small-light">Lake Hop is a ride-share marketplace that connects people that want to have fun on the lake with local boat owners that host experiences, so you can "lake like a local" with a designated captain.</div>
            <br/><br/>
            <h2 style={{marginBottom: '15px'}}>How it Works</h2>
            <div className="title-small-light">
            	Lake Hop provides a way for boat owners to easily monetize the use of their boat. The best part is, it's free to get started by clicking "share my boat" and creating a boat profile.
            	<br/><br/>
            	When a boat owner creates a profile, they will choose to ride-share their boat or choose to offer their boat as a bareboat rental. Ridesharing means the owner of the boat is the captain during the booked time frame. Bareboat rental means the guest operates the boat and returns it at the end of the booked time frame. When someone requests to go out in your boat, you will receive a notification to accept or deny the booking request.
            	<br/><br/>
            	It's a win-win for everyone! Boat owners can now make money sharing their passions with others, while those who don't own a boat can still experience the adventures of boating safely with a local captain.
            </div>
        </div>
	);
};

export default HowItWorks;