import React from 'react';
import ShareBoat1 from '../assets/share_boat_1.png';
import ShareBoat2 from '../assets/share_boat_2.png';
import { withStuff } from '../hocs';

const ShareYourBoat = ({ api, state }) => {

    async function shareBoat() {
        const res = await api.updateUser(state.user.id, { host: true });
        if (res) window.location.reload();
    };

    return(
        <div>
            <div id="share-your-boat">
                <div className="syb-text">
                    <h1>Share Your Boat</h1>
                    <div className="subheader-heavy">
                        Join Lake Hop today and become a local host. 
                        Share your love for the outdoors with others so
                        they too can "lake like a local."
                    </div>
                    <button className="btn-primary" onClick={shareBoat} >
                        Get Started
                    </button>
                </div>
                <div className="sb-images non-mobile-only">
                    <img src={ShareBoat1} />
                    <img src={ShareBoat2} />
                </div>
            </div>
            <div className="syb-hiw">
                <h1 className="primaryPool">How does it work?</h1>
                <div className="subheader-light">
                    Lake Hop provides a way for boat owners to easily monetize the use of their boat. The best part is, it's free to get started by clicking <a href="#" onClick={shareBoat}>"share my boat"</a> and creating a boat profile.
                    <br/><br/>
                    When a boat owner creates a profile, they will choose to ride-share their boat or choose to offer their boat as a bareboat rental. Ridesharing means the guests are renting the boat and assigning the owner of the boat to be the designated driver during the booked time frame. This provides additional safety for the guests by having a designated driver that is knowledgeable of the lake and has experience operating their own boat. Bareboat rental means the guest operates the boat and returns it at the end of the booked time frame. When someone requests to go out in your boat, you will receive a notification to accept or deny the booking request.
                    <br/><br/>
                    It's a win-win for everyone! Boat owners can now make money sharing their boat with others, while those who don't own a boat can still experience the adventures of boating safely with a designated driver and focus on the stress free fun!
                    <br/><br/>
                    <button onClick={shareBoat} className="btn-primary">Get Started</button>
                </div>
            </div>
        </div>
    );
};

export default withStuff(ShareYourBoat, { state: true, api: true });
