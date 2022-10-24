import React, { useState } from 'react';
import Logo from '../assets/nav_logo.png';
import { withStuff } from '../hocs';
import { Drawer } from '../components';

const MobileNav = ({ api, state }) => {
	const [show, setShow] = useState(false);

	return(
		<div className="mobile-only">
			<i className="mobile-hamburger fas fa-bars" onClick={() => setShow(true)} />
			<Drawer show={show} onClose={() => setShow(false)}>
				{state.loggedIn &&
					<a href="/profile" className="pn-profile pn-link" >
					    <img src={state.user.profile_picture_url} />
					    <div>
					        <div className="subheader-heavy" >
					            {state.user.full_name}
					        </div>
					        <div className="very-small-light greyPool">View my profile</div>
					    </div>
					</a>
				}
				<a href="https://lake-hop.myshopify.com/" className="pn-link subheader-light" >
			    	<i className="fal fa-tshirt" style={{marginRight: '10px'}} />
			    	<span>Apparel</span>
				</a>
				{state.user.admin &&
			    	<a href="/admin" className="pn-link subheader-light" >
			        	<i className="fal fa-user-crown" style={{marginRight: '10px'}} />
			        	<span>Admin</span>
			    	</a>
				}
				{state.hosting && 
					<a href="#" className="pn-link subheader-light pn-switch" onClick={() => api.setHosting(false)} >
						<i className="fal fa-exchange" />
						<span>Switch to traveling</span>
			        </a>
			    }
			    {
			    	!state.hosting && state.loggedIn &&

			    	<a href="#" className="pn-link subheader-light pn-switch" onClick={() => api.setHosting(true)} >
						<i className="fal fa-exchange" />
						<span>Switch to hosting</span>
			        </a>
			    }
				{
			  		!state.user.host

				   		? 	
			   				<a className="pn-link subheader-light" href="/share-your-boat">
								<i className="fal fa-ship" style={{marginRight: '10px'}}/>
							  	<span>Share your boat</span>
							</a>
							

						: 	state.hosting

							?	<div>
									<a href="/manage-boat/dashboard" className="pn-link subheader-light" >
							            <i className="fal fa-house" />
							            <span>Dashboard</span>
							        </a>
						    		<a href="/manage-boat/listings" className="pn-link subheader-light" >
						                <i className="fal fa-ship" />
						                <span>Listing</span>
						            </a>
						            <a href="/manage-boat/bookings" className="pn-link subheader-light" >
						                <i className="fal fa-tasks" />
						                <span>Bookings</span>
						            </a>
						            <a href="/manage-boat/calendar" className="pn-link subheader-light" >
						                <i className="fal fa-calendar" />
						                <span>Calendar</span>
						            </a>
								</div>

							: 	null
							
				}
			    {
			    	!state.user.has_pro_hopper &&
			    	
			    	<a className="pn-link subheader-light" href="/pro-hopper">
						<i className="fal fa-star" style={{marginRight: '10px'}}/>
					  	<span>Become a Pro Hopper</span>
					</a>
			    }
				{state.loggedIn && <a className="pn-link pn-logout subheader-light" onClick={() => {
				    api.signOut();
				      	setShowHam(false);
				}}>
			      	<i className="fal fa-sign-out" style={{marginRight: '10px'}} />
			      	<span>Sign Out</span>
			  	</a>}
			  	{!state.loggedIn && <a className="pn-link subheader-light" onClick={() => { setShow(false); api.openLoginModal(); }}>
			      	<i className="fal fa-user" style={{marginRight: '10px'}} />
			      	<span>Login/Signup</span>
				  	</a>}
			</Drawer>
		</div>
	);
};

export default withStuff(MobileNav, { state: true, api: true });