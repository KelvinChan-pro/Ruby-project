import React from 'react';
import ProHopperSrc from '../assets/pro_hopper.png';
import { withStuff } from '../hocs';

const ProHopper = ({ api, state }) => {

    async function shareBoat() {
        const res = await api.updateOnboard({ 
            host: true, pro_hopper_onboard: true,
            completed: false,
            step: 0, sub_step: 0,
            boat_only_onboard: !!state.user.host,
        });
        if (res) window.location.reload();
    };

    return(
        <div>
            <div id="share-your-boat">
                <div className="syb-text">
                    <h1>Become a Pro Hopper</h1>
                    <div className="subheader-heavy">Join the only platform designed for professional athletes!</div>
                    <br/><br/>
                    <div className="subheader-light">
                        Become a Pro Hopper today to get paid for your skills! We are always growing our team of
                        professional athletes who want to share their passion for the water with others.
                        <br/><br/>
                        If you offer lessons when you&#39;re not competing, you should get the most out of your time by
                        joining Lake Hop’s pro athlete experiences! Lake Hop is a booking platform that promotes your
                        services and skills, manage booking requests, and secure more clients!
                    </div>
                    <button className="btn-primary" onClick={shareBoat} >
                        Get Started
                    </button>
                </div>
                <div className="sb-images non-mobile-only">
                    <img src={ProHopperSrc} />
                </div>
            </div>
            <div className="syb-hiw">
                <h1 className="primaryPool">How does it work?</h1>
                <div className="subheader-light">
                    As s professional athlete, you can either provide your own boat, hop on a guests’ boat, or do
                    both for lessons. If you travel, this makes booking clients even easier than before! If you’re a pro
                    that has your own boat, click “Share My Boat” and create a profile on your hometown lake. If
                    you’re a pro that doesn’t own a boat, click “Become a Pro Hopper” so guests can request for you to hop on their boat for lessons. It’s a win-win for everyone!
                    <br/><br/>
                    Start earning more money by teaching your skills today!
                    <br/><br/>
                    <button onClick={shareBoat} className="btn-primary">Become a Pro Hopper</button>
                </div>
            </div>
        </div>
    );
};

export default withStuff(ProHopper, { state: true, api: true });
