import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal } from '.';
import Context from '../context.js'
import { StreamChat } from 'stream-chat'
import {Edit, SuccessBox, ErrorBox, Submit, BtnSpinner} from '../components';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const ProfileModal = (props) => {
	const self = useRef();
    const { state, api } = useContext(Context);
    const {user} = state;
    const [avatar, setAvatar] = useState(null);
    const [firstName, setFirstName] = useState(() => localStorage.getItem("first_name"));
    const [lastName, setLastName] = useState(() => localStorage.getItem("last_name"));
    const [fileUrl, setFileUrl] = useState('')
    const chatClient = StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 }); 
    let avatarURI = '';
    
    const save = async () => {
        try {
            const file = avatar;
            const userInfo = {
                "id" : state.user.id,
                "first_name" : state.user.first_name,
                "last_name" : state.user.last_name,
                "name" : state.user.name,
                "username" : state.user.full_name,
                "email" : state.user.email,
            }
            api.connectUserForGetStreamAndUnreadMessages(userInfo).then((channels) => {
                console.log("Channels Profile Modal => ", channels);
                if(!channels.length) return ;
                console.log("Channel => ", channels[0]);
                console.log("FIle => ", file)
                channels[0].sendImage(file).then((response) => {
                    avatarURI = response.file;
                    console.log("Response Send Image Profile Modal => ", avatarURI);
                    const updatedUserInfo = {
                        "id" : state.user.id,
                        "first_name" : state.user.first_name,
                        "last_name" : state.user.last_name,
                        "name" : state.user.name,
                        "username" : state.user.full_name,
                        "email" : state.user.email,
                        "image" : avatarURI
                    }
                    chatClient.upsertUser({ 
                        id: state.user.id, 
                        first_name : state.user.first_name,
                        last_name : state.user.last_name,
                        name : state.user.first_name + " " + state.user.last_name,
                        username : state.user.full_name,
                        email : state.user.email,
                        image : avatarURI,
                    }).then((updateResponse) => {
                        console.log("Updatd Response Profile MOdal => ", updateResponse);
                    })
                })
            })
            const name = firstName + " " + lastName;
            console.log("..................", name);
            let resUpdateUser = await api.updateUser(user.id, { full_name: name }, false, true)
            console.log("Update User status => ", resUpdateUser);
            props.onClose();
        } catch (error) {
            console.log("Error occurred in update profile messaging profile modal => ", error);
            props.onClose();
        }  
    }
    
	return(
        <div className="login-modal" ref={self} >
    		<Modal {...props} >
                <div style={{marginTop: '50px', height: "300px", padding: "0px 20px 20px 20px", display: "flex", alignItems: "center", justifyContent: "space-between"}} >
                    <div style={{maxWidth: '600px'}}>
                        <div className="title-small">Profile Settings</div>
                        <ErrorBox error={state.errors.update_user} />
                        <div style={{display: "flex", alignItems: "flex-start", justifyContent: "center", flexDirection: "column", marginTop: "30px"}}>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}> 
                                <div style={{
                                    padding: "0.375rem 0.75rem",
                                    backgroundColor: "#e9ecef",
                                    border: "1px solid #ced4da",
                                    color: "#383f46",
                                    lineHeight: "1.5",
                                    fontWeight: "400",
                                    height: "38px",
                                    borderRadius: "4px"
                                    }}>
                                    <label>Avatar</label>
                                </div>
                                <input
                                    style={{
                                        backgroundColor: "whitePool",
                                        border: "1px solid #ced4da",
                                        padding: "3px 5px",
                                        borderLeft: "0px",
                                        borderRadius: "3px",
                                        position: "relative"
                                    }}
                                    type="file"
                                    onChange={ (e) => {
                                        console.log("Files => ", e.target.files)
                                        setAvatar(e.target.files[0])
                                    } }
                                />
                                <div style={{maxWidth: "600px"}}>
                                    {
                                        fileUrl && (
                                        <img src={fileUrl} style={{width: "100%"}} />
                                        )
                                    }
                                </div>
                            </div>
                            <div style={{marginTop: "50px"}}></div>
                            <InputGroup className="mb-3" >
                                <InputGroup.Text>First and Last name</InputGroup.Text>
                                <Form.Control aria-label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <Form.Control aria-label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </InputGroup>
                        </div>                        
                        <div style={{marginBottom: '50px'}} />
                        <SuccessBox success={state.success.update_address} />
                        {
							state.loading["update_user"]

							? 	<BtnSpinner />

							: 	<div className="flex">
									<div style={{margin: '0px 10px'}} className="subheader-heavy link-btn" onClick={() => {save()}} >Save</div>
								</div>
						}                   
                    </div>
                </div>
    		</Modal>
        </div>
	);
};

export default ProfileModal;
