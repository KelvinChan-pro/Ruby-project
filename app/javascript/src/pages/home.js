import React, { useState } from 'react';
import backgroundImage from '../assets/home_background.jpeg';
import girl from '../assets/girl.png';
import boatdriver from '../assets/boatdriver.png';
import captains from '../assets/captains.png';
import boatowner from '../assets/boatowner.png';
import boatownerSmall from '../assets/boatowner_small.png';
import leafBackground from '../assets/leaf-background.png';
import dj from '../assets/dj-boggs.png';
import wave from '../assets/wave.png';
import wakesurf from '../assets/wakesurf.png';
import orangewater from '../assets/orangewater.png';
import lakeLikeALocal from '../assets/lake_like_a_local.png';
import { 
	LakeSearch, DatePicker,
} from '../components';
import { querify, parseDateString } from '../utils';
import { withStuff } from '../hocs';

const Home = () => {
	const [lakeId, setLakeId] = useState(null);
	
	function search(date=null) {
		
		const query = querify({
			date: new Date(date).getTime(), 
			lake_id: lakeId,
		});

		window.location.href = `/s${query}`;
	};

	return(
		<div>
			<div id="main">
				<div className="home-search-background" style={{backgroundImage: `url(${backgroundImage}`}} >
					<img src={lakeLikeALocal} alt="Lake like a local" className="lake-like-a-local" />
					<div className="home-search-bar">
						<LakeSearch 
							onChange={setLakeId} 
							label="Where"
							placeholder="Search by lake or state"
						/>
						<div className="home-search-div" />
						<DatePicker>
							{({ date, setShow }) =>
								<div className="home-search-input">
									<label>
										When
									</label>
									<input
										placeholder="Dates (optional)"
										value={parseDateString(date)}
										onClick={() => setShow(true)}
									/>
									<button className="btn-search" onClick={() => search(date)} >
										<i className="fal fa-search" />
									</button>
								</div>
							}
						</DatePicker>
					</div>
					<div className="mobile-search-bar" >
						<LakeSearch 
							onChange={setLakeId}
							placeholder="Where are you going?"
						/>
						<button onClick={search} className="mobile-btn-search" >
							<i className="fal fa-search" />
						</button>
					</div>
				</div>
			</div>
            <div id="light-blue-div" />
            <div className="interest-box text-center">
            	<div className="title-small-heavy navyPool">What are you interested in?</div>
            	<div className="row">
            		<div className="col-lg-3 col-6">
            			<a href="/s?watersports=true">
	            			<div className="interest-card">
	            				<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
	            					<path d="M36.486 1.51294L6.94141 31.0576" stroke="#113B4C" strokeWidth="2" strokeMiterlimit="10"/>
	            					<path d="M36.4868 1.51298C29.2383 -0.79334 15.3439 4.20526 2 26.1155C3.60662 27.7221 5.3126 29.4281 6.94215 31.0576C8.57169 32.6872 10.2777 34.3931 11.8843 35.9998C33.7945 22.6559 38.7931 8.76144 36.4868 1.51298Z" stroke="#113B4C" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square"/>
	            				</svg>
	            				<div className="subheader-heavy navyPool">Watersports</div>
	            			</div>
	            		</a>
            		</div>
            		<div className="col-lg-3 col-6">
            			<a href="/s?fishing=true">
	            			<div className="interest-card">
	            				<svg width="32" height="35" viewBox="0 0 32 35" fill="none" xmlns="http://www.w3.org/2000/svg">
	            					<path d="M26.104 23.225H29.0044V26.1255C29.0044 27.6639 28.3932 29.1394 27.3054 30.2273C26.2175 31.3152 24.742 31.9263 23.2035 31.9263C21.665 31.9263 20.1896 31.3152 19.1017 30.2273C18.0138 29.1394 17.4026 27.6639 17.4026 26.1255V11.4173C18.7697 11.0643 19.9611 10.2249 20.7535 9.05635C21.5459 7.88779 21.885 6.47035 21.7071 5.0697C21.5292 3.66906 20.8465 2.38138 19.7871 1.44803C18.7278 0.514689 17.3643 -0.000244141 15.9524 -0.000244141C14.5405 -0.000244141 13.1771 0.514689 12.1177 1.44803C11.0583 2.38138 10.3757 3.66906 10.1978 5.0697C10.0199 6.47035 10.3589 7.88779 11.1513 9.05635C11.9437 10.2249 13.1351 11.0643 14.5022 11.4173V26.1255C14.5022 27.6639 13.891 29.1394 12.8032 30.2273C11.7153 31.3152 10.2398 31.9263 8.70132 31.9263C7.16283 31.9263 5.68736 31.3152 4.59948 30.2273C3.5116 29.1394 2.90044 27.6639 2.90044 26.1255V23.225H5.80088L0 15.9739V26.1255C0.00206127 27.9939 0.605488 29.812 1.72101 31.3109C2.83653 32.8098 4.40489 33.9097 6.19406 34.4481C7.98324 34.9865 9.89819 34.9347 11.6556 34.3003C13.4131 33.6659 14.9196 32.4827 15.9524 30.9257C16.9852 32.4827 18.4918 33.6659 20.2492 34.3003C22.0067 34.9347 23.9216 34.9865 25.7108 34.4481C27.5 33.9097 29.0683 32.8098 30.1838 31.3109C31.2994 29.812 31.9028 27.9939 31.9049 26.1255V15.9739L26.104 23.225ZM13.052 5.82237C13.052 5.24871 13.2221 4.68794 13.5408 4.21097C13.8595 3.73399 14.3125 3.36224 14.8425 3.14271C15.3725 2.92318 15.9556 2.86574 16.5183 2.97766C17.0809 3.08957 17.5977 3.36581 18.0033 3.77145C18.409 4.17708 18.6852 4.69389 18.7971 5.25652C18.909 5.81915 18.8516 6.40233 18.6321 6.93232C18.4126 7.4623 18.0408 7.91529 17.5638 8.23399C17.0868 8.5527 16.5261 8.72281 15.9524 8.72281C15.1832 8.72281 14.4454 8.41723 13.9015 7.87329C13.3576 7.32935 13.052 6.59161 13.052 5.82237Z" fill="#113B4C"/>
	            				</svg>
	            				<div className="subheader-heavy navyPool">Fishing</div>
	            			</div>
	            		</a>
            		</div>
            		<div className="col-lg-3 col-6">
            			<a href="/s?leisure=true">
	            			<div className="interest-card">
	            				<svg width="37" height="35" viewBox="0 0 37 35" fill="none" xmlns="http://www.w3.org/2000/svg">
		            				<path d="M1.5 22.7273H35.25" stroke="#113B4C" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
		            				<path d="M6.10156 28.8635H30.647" stroke="#113B4C" strokeWidth="2" stroke-miterlimit="10" strokeLinecap="square"/>
		            				<path d="M10.7051 35H26.046" stroke="#113B4C" strokeWidth="2" stroke-miterlimit="10" strokeLinecap="square"/>
		            				<path d="M3.0332 16.5909C3.0332 8.15341 9.93661 1.25 18.3741 1.25C26.8116 1.25 33.715 8.15341 33.715 16.5909" stroke="#113B4C" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
	            				</svg>
	            				<div className="subheader-heavy navyPool">Leisure</div>
	            			</div>
	            		</a>
            		</div>
            		<div className="col-lg-3 col-6">
            			<a href="/s?celebrity=true">
	            			<div className="interest-card">
	            				<svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
		            				<path d="M18.1754 21.7038C13.6234 21.7038 9.93359 16.3656 9.93359 11.8137V10.1653C9.93359 5.61342 13.6234 1.92358 18.1754 1.92358C22.7273 1.92358 26.4171 5.61342 26.4171 10.1653V11.8137C26.4171 16.3656 22.7273 21.7038 18.1754 21.7038Z" stroke="#113B4C" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
		            				<path d="M18.1749 25.8247C12.9925 25.8247 8.71586 26.7297 5.81805 27.5917C3.36778 28.3203 1.69141 30.5678 1.69141 33.1236V36.539H19.8233" stroke="#113B4C" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
		            				<path d="M29.7125 24.1765L31.7499 28.3048L36.306 28.9666L33.0093 32.1801L33.7873 36.718L29.7125 34.576L25.6378 36.718L26.4158 32.1801L23.1191 28.9666L27.6752 28.3048L29.7125 24.1765Z" stroke="#113B4C" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
	            				</svg>
	            				<div className="subheader-heavy navyPool">Pro-athlete Experience</div>
	            			</div>
	            		</a>
            		</div>
            	</div>
            </div>
            <div className="home-section section-a">
            	<div className="row flex" style={{margin: 'auto'}} >
            		<div className="col-md-5 col-sm-12">
            			<img src={boatdriver} loading="lazy" sizes="100vw" alt="" className="home-image image-1" />
            		</div>
            		<div className="col-md-6 col-sm-12 section-text">
            			<div className="title-small primaryPool">A little about us...</div>
            			<h1 className="whitePool">We don’t just rent boats,<br/>we host experiences.</h1>
            			<div className="title-small whitePool">No boat, no experience, no problem. Whether it’s wake surfing, bass fishing, or chilling in party cove, you get to enjoy the lake life like a local.</div>
            		</div>
            	</div>
			</div>
			<div className="home-section section-b">
				<div className="row flex">
					<div className="col-sm-12 small-only">
						<img src={girl} loading="lazy" alt="" className="home-image image-2" />
					</div>
            		<div className="col-md-6 col-sm-12 section-text">
	            		<h1 className="navyPool">What're you waiting for?</h1>
						<div className="title-small navyPool">
							It’s girls-on-strangers’-boats season, and those claws’ aren’t going to drink themselves. Make sure you’ve got a designated captain.
						</div>
					</div>
					<div className="col-md-5 medium-only">
						<img src={girl} loading="lazy" alt="" className="home-image image-2" />
					</div>
				</div>
			</div>
			<div className="home-section section-c">
				<div className="row flex">
					<div className="col-md-5 col-sm-12">
						<img src={captains} loading="lazy" alt="captains" className="home-image image-2" />
					</div>
					<div className="col-md-6 col-sm-12 section-text">
						<h1 className="navyPool">Our captains know where to catch ‘em.</h1>
						<div className="title-small">Our captains are true locals and know their lakes like the back of a beer can. They will give you an experience you'll never forget, but remember to keep the honey hole a secret.</div>
						<div className="featured-captain">
							<div className="title-small-heavy primaryPool">FEATURED CAPTAIN</div>
							<div className="title-small-heavy navyPool">Brandon Lester</div>
							<div className="title-small navyPool">Pro Bass Fisherman</div>
							<div className="subheader-heavy primaryPool">Member since 2021</div>
						</div>
					</div>	
				</div>
			</div>
			<div className="home-section section-d" style={{backgroundImage: `url(${leafBackground}`}}>
				<div className="text-center">
					<img 
						src={boatowner}
						loading="lazy" 
						alt="boat owner" 
						className="image-3 medium-only"
					/>
					<img 
						src={boatownerSmall}
						loading="lazy" 
						alt="boat owner" 
						className="image-3 small-only"
					/>
					<div className="section-text">
						<div className="title-small orangePool">CALLIN' ALL CAP'NS</div>
						<h1 className="whitePool medium-only">On the banks<strong> → </strong>In your bank.</h1>
						<h1 className="whitePool small-only">
							On the banks
							<div style={{margin: '-20px 0px'}} >
								<svg width="13" height="33" viewBox="0 0 13 33" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M10.3125 23.0833L6.4844 28.75M6.4844 28.75L2.65626 23.0833M6.4844 28.75V3.25" stroke="#FFFAED" stroke-width="5" stroke-linecap="round"/>
								</svg>
							</div>
							In your bank.
						</h1>
						<div style={{marginBottom: '25px'}} className="title-small whitePool">We both know you’re goin’ out on the water anyway, so why not make some extra $$$ doing it? Whether you’re a born entertainer who loves meeting new people, or you know all the best spots on your lake, Lake Hop wouldn’t be possible without our captains. Don’t miss the boat, join the crew today.</div>
						<a style={{padding: '12px 30px'}} className="btn-orange" href="/share-your-boat">List Your Boat</a>
					</div>
				</div>
			</div>
			{<div className="home-section section-e" style={{backgroundImage: `url(${orangewater}`}}>
				<div className="row flex">
					<div className="col-md-4 medium-only">
						<img src={dj} loading="lazy" alt="" className="image-4"/>
					</div>
					<div className="col-sm-12 small-only">
						<img src={wakesurf} loading="lazy" alt="" className="image-5"/>
					</div>
					<div className="col-md-4 col-sm-12 section-text">
						<h2 className="whitePool">&quot;</h2>
						<h2 className="whitePool">I had never been wake surfing before, but DJ got me up on a board my first time.</h2>
						<div className="title-small whitePool" style={{margin: '30px 0px'}}>Wade, Lake Hop User</div>
						<img src={wave} loading="lazy" className="wave-img" alt="wave" />
					</div>
					<div className="col-md-4 medium-only">
						<img src={wakesurf} loading="lazy" alt="" className="image-5"/>
					</div>
					<div className="col-sm-12 small-only">
						<img src={dj} loading="lazy" alt="" className="image-4"/>
					</div>
				</div>
			</div>}
		</div>
	);
};

export default withStuff(Home,
	{
		api: true,
		effect: ({ api, location }) => {
			if (location.pathname === '/login') {
				api.openLoginModal();
			};
		},
	}
);
