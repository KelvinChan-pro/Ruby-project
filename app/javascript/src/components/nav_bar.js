import React, { useContext, useState, Fragment, useEffect } from 'react';
import Logo from '../assets/nav_logo.png';
import Context from '../context';

const NavBar = ({ location, children }) => {
    const { api, state } = useContext(Context);
    const [showHam, setShowHam] = useState(false);
    const [count, setCount] = useState(0);

    function current(path, match=null) {
        if (path == '/') {
            return location.pathname ==  path;
        } else {
            return location.pathname.includes(match || path);
        }
    }

    async function getUnreadMessages() {
        const number_of_unread = await api.getAllUnreadMessages();
        console.log("Number of unread............", number_of_unread);
        return number_of_unread;
    }

    useEffect(() => {
        if(!state.loggedIn) return;
        getUnreadMessages().then((res) => {
            setCount(res);
        });
    }, [window.performance, state.loggedIn]);

    useEffect(() => {
        setCount(state.user.unreadMessages);
    }, [state.user.unreadMessages]);

    useEffect(() => {
        if(window.location.pathname.includes("/message")) {
            getUnreadMessages().then((res) => {
                setCount(res);
            });
        }
    }, [window.location.pathname])

    return(
        <div className="nav-bg non-mobile-only">
            <div className="nav">
                <div className="nav-logo">
                    <a href="/" >
                        <img
                            className="nav-logo"
                            src={Logo}
                            alt="lakehop logo"
                        />
                    </a>
                </div>
                {children}
                <div className="navlinks">
                    {state.loggedIn && 
                        <a href="/message">
                            <i className="fal fa-paper-plane" style={{marginRight: '5px'}} />
                            <span style={{position:"relative"}}>Chat { count > 0 && count < 10 ? <span className="unread-messages">{count}</span> : count > 9 ? <span className="unread-messages">+9</span> : ''}</span>
                        </a>
                    }
                    <a href="https://lake-hop.myshopify.com/">
                        <i className="fal fa-tshirt" style={{marginRight: '5px'}} />
                        Apparel
                    </a>
                    {!state.hosting && state.loggedIn &&
                        <a href="/bookings" className={current("/bookings") ? "nav-current" : ""}>
                            <i className="fal fa-calendar-plus" style={{marginRight: '5px'}} />
                            Bookings
                        </a>
                    }
                    {!state.hosting && state.loggedIn &&
                        <a href="/saved" className={current("/saved") ? "nav-current" : ""}>
                            <i className="fal fa-heart" style={{marginRight: '5px'}} />
                            Saved
                        </a>
                    }
                    {
                        !!state.user.host

                        ?   <a href="/manage-boat" className={current("/manage-boat") ? "nav-current" : ""}>
                                <i className="fal fa-ship" style={{marginRight: '5px'}} />
                                Manage my listings
                            </a>

                        :   <a href="/share-your-boat" className={current("/share-your-boat") ? "nav-current" : ""}>
                                <i className="fal fa-ship" style={{marginRight: '5px'}} />
                                Share your boat
                            </a>
                    }
                    {
                        !state.user.has_pro_hopper &&
                        
                        <a href="/pro-hopper" className={current("/pro-hopper") ? "nav-current" : ""}>
                            <i className="fal fa-star" style={{marginRight: '5px'}} />
                            Become a Pro Hopper
                        </a>
                    }
                    {
                        state.loggedIn

                        ?   <a href="#" onClick={() => setShowHam(prev => !prev)} >
                                Welcome, {state.user.first_name}
                                <i
                                    className="fal fa-user"
                                    style={{marginLeft: '5px'}}
                                />
                            </a>

                        :   <a href="#" onClick={api.openLoginModal} >
                                Login/Signup
                                <i
                                    className="fal fa-user"
                                    id="nav-user-icon"
                                />
                            </a>
                    }
                </div>
                <div className="nav-profile">
                    <div
                        className="hamburger-menu"
                        style={{
                            display: showHam ? "" : "none",
                        }}
                    >
                        <a href="/profile" id="profile-link" >
                            <img src={state.user.profile_picture_url} />
                            <div>
                                <div className="subheader-heavy" >
                                    {state.user.full_name}
                                </div>
                                <div className="very-small-light greyPool">View my profile</div>
                            </div>
                        </a>
                        <a href="/account" >
                            <i className="fal fa-user" />
                            <span>Account</span>
                        </a>
                        {state.user && state.user.ambassador &&
                            <a href="/ambassador" >
                                <i className="fal fa-megaphone" />
                                <span>Ambassador</span>
                            </a>
                        }
                        {state.user && state.user.admin &&
                            <a href="/admin" >
                                <i className="fal fa-user-crown" />
                                <span>Admin</span>
                            </a>
                        }
                        {
                            state.hosting

                            ?   <a href="#" onClick={() => api.setHosting(false)} >
                                    <i className="fal fa-exchange" />
                                    <span>Switch to traveling</span>
                                </a>

                            :   <a href="#" onClick={() => api.setHosting(true)} >
                                    <i className="fal fa-exchange" />
                                    <span>Switch to hosting</span>
                                </a>
                        }
                        <a id="logout" onClick={() => {
                            api.signOut();
                            setShowHam(false);
                        }}>
                            <i className="fal fa-sign-out" />
                            <span>Sign Out</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
