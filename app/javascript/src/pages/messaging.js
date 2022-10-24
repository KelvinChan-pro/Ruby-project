import React, { useEffect, useState, useContext } from 'react'
import {
    Chat,
    Channel,
    Window,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    LoadingIndicator,
    ChannelList,
    useChatContext,
} from 'stream-chat-react'
import Context from './../context';
import 'stream-chat-react/dist/css/index.css'
import { MDBBtn } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown'
import { MessagingModal } from '../components'
import { ProfileModal } from '../components'
import { StreamChat } from 'stream-chat'
import iconDelete from '../assets/icons8-delete-100.png';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

let channels = [];

function CustomChannelPreview(props) {
    const {channel, setActiveChannel} = props;
    console.log("Channel Details => ", channel);
    const {messages} = channel.state;
    const lastMessage = messages[messages.length - 1]
    const [active, setActive] = useState(null);
    const [channelId, setChannelId] = useState(() => channel.cid);
    channels.push(channelId);
    channels = [...new Set(channels)];
    console.log("Channels => ", channels);
    // if(channels.length) {
    //     document.getElementById(channels[0]).classList.add("active");
    // }

    const activeSetting = (channel) => {
        setActiveChannel(channel);
        console.log("Channel Update => ", channel);
        setActive(channel.cid);
        setChannelId(channel.cid);
        channels.forEach((cn) => {
            if(cn == active) {
                document.getElementById(cn).classList.add("active");
            } else {
                document.getElementById(cn).classList.remove("active");
            }
        })
    }
    const deleteChannel = async (channel) => {
        const resForRemoveChannel = await channel.delete();
        console.log("DeleteChannel => ", resForRemoveChannel);
        channels = channels.filter((item) => item != channel.cid);
    }
    return (    
        // <div id={channelId} className={`channel-list-item ${active ? 'active' : 'nonactive'}`} onClick={() => activeSetting(channel)}>
           <div id={channelId} className="channel-list-item" onClick={() => activeSetting(channel)}>
            <div className="list-item-left">
                <div className="item-img-container">
                    { channel.data.created_by.id == channel.state.membership.user.id && <img src={channel.data.image} /> }
                    { channel.data.created_by.id != channel.state.membership.user.id && <img src={channel.data.created_by.image} /> }
                </div>
                <div>
                    <div>                        
                        { channel.data.created_by.id == channel.state.membership.user.id && <span style={{fontSize: "16px", fontWeight: "700"}}>{channel.data.name || 'Unnamed Channel'}</span> }
                        { channel.data.created_by.id != channel.state.membership.user.id && <span style={{fontSize: "16px", fontWeight: "700"}}>{channel.data.created_by.name || 'Unnamed Channel'}</span> }
                    </div>
                    <div style={{fontSize: '14px', textAlign: 'left', padding: '0px 5px'}}>
                        {lastMessage ? lastMessage.text : ''}
                    </div>
                </div>
            </div>
            <div>
                <div className="delete_channel" onClick={() => deleteChannel(channel)}>
                    <img src={iconDelete} alt="delete channel" />
                </div>
            </div>
        </div>
    )
}

// function CustomChannelHeader() {
//     const {channel} = useChatContext();
//     const [show, setShow] = useState(() => false);
//     const {data} = channel

//     const toggleMenu = () => {
//         setShow(!show);
//         console.log("Show Status => ", show);
//         if(show == true) {
//             var matches = document.getElementsByClassName('str-chat-channel-list');
//             console.log("Matches => ", matches);
//             while (matches.length > 0) {
//                 matches.item(0).classList.add('str-chat-channel-list-open');
//             }
//         } else if(show == false) {
//             var matches = document.getElementsByClassName('str-chat-channel-list');
//             console.log("Matches => ", matches);
//             while (matches.length > 0) {
//                 matches.item(0).classList.remove('str-chat-channel-list-open');
//             }
//         }
//     }
  
//     return (
//         <header 
//             style={{
//             height: '55px',
//             backgroundColor: 'white',
//             marginBottom: '20px',
//             borderRadius: '10px',
//             padding: '10px',
//             display: 'flex',
//             alignItems: 'center'
//         }}>
//             {/* {data.image && (
//                 <img
//                     style={{
//                     width: 20,
//                     height: 20,
//                     borderRadius: '50%',
//                     marginRight: 10
//                     }}
//                     src={data.image}
//                     alt=""
//                 />
//             )} */}
//             <div className="toggle-menu-message" onClick={() => toggleMenu()}><img src={iconBar} /></div>
//             { channel.data.created_by.id == channel.state.membership.user.id && <img src={channel.data.image} style={{width: 30,height: 30,borderRadius: '50%',marginRight: 10}} /> }
//             { channel.data.created_by.id != channel.state.membership.user.id && <img src={channel.data.created_by.image} style={{width: 30,height: 30,borderRadius: '50%',marginRight: 10}}  /> }
//             { channel.data.created_by.id == channel.state.membership.user.id && <span style={{fontSize: "16px", fontWeight: "700"}}>{channel.data.name || 'Unnamed Channel'}</span> }
//             { channel.data.created_by.id != channel.state.membership.user.id && <span style={{fontSize: "16px", fontWeight: "700"}}>{channel.data.created_by.name || 'Unnamed Channel'}</span> }
//             {/* {data.name} */}
//             {/* <TypingIndicator /> */}
//         </header>
//     )
// }

export default function Messaging() {
    const { state, api, google_key } = useContext(Context);
    const [ modalStatus, setModalStatus] = useState(false)
    const [ theme, setTheme ] = useState("messaging light")
    const [ lightTheme, setLightTheme ] = useState(false)
    const [ term, setTerm ] = useState("");
    const [ msgTerm, setMsgTerm ] = useState(() => "");
    const [ chatUsers, setChatUsers ] = useState([]);
    const [ open, setOpen ] = useState(false);
    const [ profileModalStatus, setProfileModalStatus ] = useState(false);
    const [ show, setShow ] = useState(false);
  

    console.log("State --- => ", state);

    const filters = { type: "messaging", members: { $in: [state.user.id] } }
    const sort = { last_message_at: -1 }

    // ****************************** Create a new Channel ************************************
    const chatClient = StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });

    console.log("Messaging Chat Client ===================================> ", chatClient);

    async function searchUser(val) {
        try {
            setShow(true);
            setTerm(val);
            console.log("Search Term => ", val);
            const queryChatUsers = await api.searchUsersWithName(val);
            let users = queryChatUsers.users.filter((user) => user.id != state.user.id);
            console.log("Query Chat users => ", users);
            setChatUsers(users);
        } catch(error) {
            console.log("error => ", error);
        }
    }

    async function searchMessage() {
        try {
            console.log("Value => ", msgTerm);
            // console.log("MST Term => ", msgTerm);
            // setMsgTerm(val);
            // console.log("MSG Term -< ", msgTerm);
            // const filters = { members: { $in: [state.user.id] } };
            const search = await chatClient.search(
                filters,
                msgTerm,
                { limit: 100, offset: 0 },
            );
            console.log("Search result => ", search);
            // if(!search.results.length) {
            //     const demoClasses = document.querySelectorAll('.str-chat__message-text');
            //     demoClasses.forEach((element) => {
            //         element.classList.remove("searchResults");
            //     })
            // }
            search.results.forEach((result) => {
                const demoClasses = document.querySelectorAll('.str-chat__message-text');
                demoClasses.forEach((element, index) => {
                    const innerClass = element.querySelector(".str-chat__message-text-inner");
                    const innClass = innerClass.querySelector("div")
                    const innerText = innClass.innerText;
                    console.log("Result Message Ttttttttttttttext => ", result.message.text);
                    console.log("Element Inner HTML => ", innerText);
                    if(innerText.toString() === result.message.text.toString()) {
                        console.log("innerText.toString() == result.message.text", innerText.toString());
                        console.log("innerText.toString() == result.message.text", result.message.text);
                        console.log("Element => ", element)
                        element.classList.add("searchResults");
                    } else {
                        element.classList.remove("searchResults");
                    }
                });
            });
        } catch (error) {
            console.log("Error occurred in search messaging => ", error);
        }
    }

    async function select(name, email, id, image) {
        try {
            const [first_name, last_name] = name.split(" ");
            const newChannel = await api.channelWatchForGetStream(first_name, last_name, email, id, image);
            console.log("New Channel State => ", newChannel);
            setShow(false);
        } catch (error) {
            console.log("error on select User => ", error);
        }
    }

    useEffect(() => {
        console.log("Google Map Key => ", google_key.toString())
        const userTmp = state.user;

        const init = async (userOne) => {
            if (!userOne) {
                return;
            }
            const userInfo = {
                "id" : userOne.id,
                "name" : userOne.full_name,
                "username" : userOne.full_name,
                "email" : userOne.email,
            }
            const channelsOfUser = await api.connectUserForGetStreamAndUnreadMessages(userInfo);
            console.log("User Connected => ", channelsOfUser);

            const number_of_channels = state.user.numberOfChannels;
            console.log("Messaging >>> Number of Channels => ", number_of_channels);
            if(number_of_channels) {
                setModalStatus(false);
            } else if(!number_of_channels) {
                setModalStatus(true);
            }
        };

        init(userTmp).catch(console.error);

        if(chatClient) return () => chatClient.disconnectUser();

    }, [])

    useEffect(() => {
        console.log("Staet Question Modal Status => ", localStorage.getItem("set_question"));
        if (localStorage.getItem("set_question") == "true") {
            api.setQuestionModal(false);
            console.log("State Question Modal Status => ", localStorage.getItem("set_question"));
        }
    }, [window.location.pathname])

    if(!chatClient) return <LoadingIndicator />

    return (
        <>
            <MessagingModal show={modalStatus} onClose={() => setModalStatus(false)} />
            <ProfileModal show={profileModalStatus} onClose={() => setProfileModalStatus(false)} />
            <div className={`messaging-header ${open ? 'messaging-header-height' : ''}`}>
                <div className="header-left">
                    <div className="search-left">
                        <MDBBtn color="info" rounded size="sm" type="button" className="mr-auto search-left-mdb">
                            <i className="fal fa-search" />
                        </MDBBtn>
                        <div className="user-search">
                            <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" value={term} onChange={({ target }) => searchUser(target.value)} />
                            { show && <div className="user-search-results">
                                {chatUsers.map((user, i) =>
                                    <div 
                                        className="body-light new-chat-search-item" 
                                        key={i} 
                                        onClick={() => select(user.name, user.email, user.id, user.image)}
                                    >
                                        <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start"}}><div style={{maxWidth: "40px", marginRight: "20px"}}><img style={{width: "100%"}} src={user.image} /></div><span>{user.username}</span></div>
                                    </div>
                                )}
                            </div> }   
                        </div> 
                    </div>
                    <Dropdown>
                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                            <i className="fal fa-cog" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="customized_dropdownMenu">
                            <Dropdown.Item className="customized_dropdown_item" onClick={() => setTheme("messaging light")}>Light<i className="fas fa-sun sun_mod" /></Dropdown.Item>
                            <Dropdown.Item className="customized_dropdown_item" onClick={() => setTheme("messaging dark")}>Dark<i className="fas fa-moon moon_mod" /></Dropdown.Item>
                            <Dropdown.Item className="customized_dropdown_item" onClick={() => setProfileModalStatus(true)}>Profile<i className="fas fa-user pro_mod" /></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="header-right">
                    <div className="content-search">
                        {/* <Button
                            onClick={() => setOpen(!open)}
                            className="search-right-content"
                            variant="info"
                        >
                            <i className="fal fa-search" />
                        </Button> */}
                        <Button
                            onClick={() => setModalStatus(true)}
                            className="create-new-chat"
                            variant="info"
                        >
                            <i className="fas fa-user-plus" />
                        </Button>
                    </div>  
                </div>
                {/* { open && 
                    <div className={`header-search-content ${open ? 'header-search-content_displayShow' : ''}`}>   
                        <input className="form-control" type="text" placeholder="Search" aria-label="Search Message" value={msgTerm} onChange={({target}) => setMsgTerm(target.value)} />
                        <button className="search_content" onClick={() => searchMessage()}><i className="fal fa-search" /></button>
                    </div> 
                }                     */}
            </div>
            <Chat client={chatClient} theme={theme}>
                <ChannelList 
                    filters={filters}
                    sort={sort}
                    // Preview={CustomChannelPreview}
                />
                <Channel>
                    <Window>
                        <ChannelHeader />
                        {/* <CustomChannelHeader /> */}

                        <MessageList />

                        <MessageInput />    
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </>
    )
}