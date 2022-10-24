import React from 'react';
import Logo from '../assets/nav_logo.png';

const Footer = () => (
	<footer>
    	<div id="footer-top">
    		<div className="row">
	    		<div className="col-md-3 col-sm-12">
	    			<div className="subheader-heavy footer-subheader text-left">
	    				Contact Us
	    			</div>
	    			<div className="body-light footer-pair" >
	    				<i className="fal fa-map-marker-alt" />
	    				790 Kings Lane Suite 100, Tullahoma, TN 37388
	    			</div>
	    			<div className="body-light footer-pair" >
	    				<i className="fal fa-phone-alt" />
	    				<a href="tel:931-563-7743">931.563.7743</a>
	    			</div>
	    			<div className="body-light footer-pair" >
	    				<i className="fal fa-envelope" />
	    				<a href="mailto:support@golakehop.com">support@golakehop.com</a>
	    			</div>
	    		</div>
	    		<div className="col-md-2 col-sm-12">
	    			<div className="subheader-heavy footer-subheader text-left">
	    				Company
	    			</div>
	    			<a href="/privacy_policy">Privacy Policy</a>
	    			<a href="/terms_of_service">Terms of Service</a>
	    			<a href="/how_it_works">How it Works</a>
	    			<a href="/faq">FAQ</a>
	    		</div>
	    		<div className="col-md-2 col-sm-12">
	    			<div className="subheader-heavy footer-subheader text-left">
	    				Community
	    			</div>
	    			<a href="https://blog.golakehop.com/">Blog</a>
	    			<a href="https://forms.gle/eiH8zpCLDunmTmBv7">Brand Ambassador</a>
	    		</div>
	    		<div className="col-md-2 col-sm-12">
	    			<div className="subheader-heavy footer-subheader text-left">
	    				Discover
	    			</div>
	    			<a href="/s?lake_id=a0ffa699-6934-4ec6-a812-475e2e764a79">Tims Ford Lake</a>
	    			<a href="/s?lake_id=5e1e68c2-ef10-4021-a65f-6904e8b72cbd">Cherokee Lake</a>
	    			<a href="/s?lake_id=4ac4ed73-7878-44e6-a5cb-dea20ac1ca36">Guntersville Lake</a>
	    		</div>
	    		<div className="col-md-3 col-sm-12">
	    			<div className="subheader-heavy footer-subheader text-left">
	    				Newsletter
	    			</div>
	    			<div className="body-light text-left">
	    				We don’t send spam so don’t worry.
	    			</div>
	    			<div className="footer-sub text-left" style={{marginTop: '20px'}} >
	    				<a href="http://eepurl.com/hvHFj5"className="btn-primary" style={{width: '100px'}} >Subscribe</a>
	    			</div>
	    		</div>
	    	</div>
    	</div>
    	<div id="footer-bottom">
    		<div id="fbi">
    			<div className="row">
    				<div className="col-md-4 fbs body-light footer-cr">
    					© Lake Hop - All rights reserved
    				</div>
    				<div className="col-md-4 fbs">
    					<img
                            className="nav-logo"
                            src={Logo}
                            alt="lakehop logo"
                        />
    				</div>
    				<div className="col-md-4 fbs footer-icons">
    					<i className="fab fa-facebook-f" />
    					<i className="fab fa-twitter" />
    					<i className="fab fa-instagram" />
    					<i className="fab fa-linkedin-in" />
    				</div>
    			</div>
    		</div>
    	</div>
    </footer>
);

export default Footer;
