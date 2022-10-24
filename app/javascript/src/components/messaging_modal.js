import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal } from '../components';
import Context from './../context.js'
import { StreamChat } from 'stream-chat'
import { Checkbox } from '@mui/material';
import Button from 'react-bootstrap/Button';

const MessagingModal = (props) => {
	const self = useRef();
    const placeholder = "Search";
    const { state, api } = useContext(Context);
    const [term, setTerm] = useState("");
    const [chatUsers, setChatUsers] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState(() => []);

    const chatClient = StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });   

    async function connectUser(userInfo) {
        try {
            const res = await api.connectUserForGetStreamAndUnreadMessages(userInfo);
            return res;
        } catch (error) {
            console.log("Error occurred on Messaging Modal => ", error);
        }
    }

    async function handleSearch(val) {
        console.log("Messaging Modal input => ", val);
        setTerm(val);

        const queryChatUsers = await chatClient.queryUsers({ name: { $autocomplete: term }, role: { $in: ['user'] }});
        let users = queryChatUsers.users.filter((user) => user.id != state.user.id);
        setChatUsers(users);

    }

    async function submitMembers() {
        try {
            if(invitedUsers.length == 1) {
                const [first_name, last_name] = invitedUsers[0].name.split(" ");
                const newChannel = await api.channelWatchForGetStream(first_name, last_name, invitedUsers[0].email, invitedUsers[0].id, invitedUsers[0].image);
                console.log("Create a new Channel with one member => ", newChannel);
                props.onClose();
            } else if(invitedUsers.length > 1) {
                const invitedUserIds = invitedUsers.reduce((ids, user) => {
                    ids.push(user.id);
                    return ids;
                }, []);
                const newChannelWithSeveralMembers = await api.channelWatchForGetStreamWithSeveralIds(invitedUserIds);
                console.log("Created a new Channel with Several Members => ", newChannelWithSeveralMembers);
                props.onClose();
            }
        } catch (error) {
            console.log("Error on Create a Grup Chat => ", error);
        }
    }

    function handleChange(target, user) {
        if(target == true) {    
            api.addInvitedMember(user);
            setInvitedUsers(state.groupMembers);
            console.log("invited group members => ", invitedUsers);
        } else if(target == false) {
            let remove_id = user.id;
            let keep_members = state.groupMembers;
            const index = keep_members.findIndex((mem) => mem.id === remove_id);
            keep_members.splice(index, 1);
            api.removeInivitedUser(keep_members);
            setInvitedUsers(state.groupMembers);
            console.log("Remove Invited Group Members => ", invitedUsers);
        }
    }

    function removeUserWithId(id) {
        let remove_id = id;
        let keep_members = state.groupMembers;
        const index = keep_members.findIndex((mem) => mem.id === remove_id);
        keep_members.splice(index, 1);
        api.removeInivitedUser(keep_members);
        setInvitedUsers(state.groupMembers);
    }

	useEffect(() => {
        const userTmp = state.user;
        const userInfo = {
            "id" : userTmp.id,
            "name" : userTmp.full_name,
            "username" : userTmp.full_name,
            "email" : userTmp.email,
        }

        connectUser(userInfo).then((res) => {
            console.log("Connected User => ", res);
                let initial_chatUsers = [];
                res.map((channel) => {
                    const sort_for_members_channel = {user_id: -1};
                    channel.queryMembers({}, sort_for_members_channel, {}).then((users) => {
                        console.log("Messaging Modal Users on a channel ===================+++> ", users.members);
                        initial_chatUsers.push(users.members);
                        return initial_chatUsers;
                    });
                });        
                console.log("Initial Chat Users =< ", initial_chatUsers);
                initial_chatUsers = initial_chatUsers.flat(1);
                console.log("Flatted Chat Users =< ", initial_chatUsers);
                if(initial_chatUsers.length) {
                    const uniqueIds = [];
                    const filteredInitialChatUsers = initial_chatUsers.filter(element => {
                        const isDuplicate = uniqueIds.includes(element.user_id);
                        
                        if (!isDuplicate) {
                            uniqueIds.push(element.user_id);
                        
                            return true;
                        }
                        
                        return false;
                    });
    
                    const fpt = filteredInitialChatUsers.map((item) => item.user);
                    console.log("Filtered Chat Users ===> ", fpt);
                    if(fpt.length) setChatUsers(fpt);
                    console.log("InitialChat Users => ", chatUsers);  
                }                     
            console.log("Messaging Modal >>> All Stream Users ====================================>", state.streamUsers);
        });  

		if (props.show)
			self.current.scrollIntoView();

	}, [props.show]);

	return(
        <div className="login-modal" ref={self} >
    		<Modal {...props} >
                <div className="messaging-tab current-lt">Add New User</div>
                    <div>
                        <div>
                            <div className="lake-search">
                                <input
                                    className="form-control add-new-user-search"
                                    placeholder={placeholder}
                                    value={term} 
                                    onChange={({target}) => handleSearch(target.value)}
                                />
                                { chatUsers.length > 0 && <div className="new-chat-search-results new-user-seach-results">     
                                    <div className="invited-members">
                                            {invitedUsers.map((user) => 
                                                <div className="invited-users" key={user.id}>
                                                    <div className='invited_user-img-container'>
                                                        <img style={{maxWidth: "100%"}} src={user.image} />
                                                    </div>
                                                    <span className="removeMemberTag" onClick={() => removeUserWithId(user.id)}><i className="fal fa-times" /></span>
                                                    <div className="invitedMemberNameTag"><span>{user.name}</span></div>
                                                    
                                                </div>
                                            )}
                                    </div>                                  
                                    <div className="new-users-list">
                                        {chatUsers.map((user, i) =>
                                            <div className="body-light new-chat-search-item" key={i}>
                                                <div 
                                                    className="user-info"
                                                >
                                                    <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start"}}>
                                                        <div style={{maxWidth: "40px", marginRight: "20px"}}>
                                                            <img style={{width: "100%"}} src={user.image} />
                                                        </div>
                                                        <span>{user.username}</span>
                                                    </div>
                                                </div>
                                                <div className="checkbox-group">
                                                    <Checkbox id={user.id}                                                         
                                                        onChange={({target}) => handleChange(target.checked, user)}
                                                    />
                                                </div>
                                            </div>                                            
                                        )}
                                    </div>
                                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginTop: "15px"}}>
                                        <Button
                                            onClick={() => submitMembers()}
                                            className="complete-invite-user"
                                            variant="info"
                                        >
                                            Done
                                        </Button>
                                    </div></div>}
                            </div>
                    </div>
                </div>
    		</Modal>
        </div>
	);
};

export default MessagingModal;
