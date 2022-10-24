import { store } from './store';
import { StreamChat } from 'stream-chat'

class Api {
    baseUrl = '/api/v1/'
    authToken = localStorage.getItem('authToken')
    railsToken = document.getElementsByName('csrf-token')[0].content
    store = store

    makeid = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    getInstanceOfGetStream = async () => {
        const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
        return chatClient;
    }

    connectUserForGetStreamAndUnreadMessages = async (user) => {
        const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
        const userInfo = {
            "id" : user.id,
            "first_name" : user.first_name,
            "last_name" : user.last_name,
            "name" : user.name,
            "username" : user.full_name,
            "email" : user.email,
        }
        const connectedUser = await chatClient.connectUser(userInfo, chatClient.devToken(userInfo.id));
        console.log("Dev Token => ", chatClient.devToken(userInfo.id));
        const getChannelsOfUser = await this.getChannelsOfUserFromGetStream(userInfo.id);
        return getChannelsOfUser;
    }

    getAllUnreadMessages =  async () => {
        const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
        const userInfo = {
            "id" : localStorage.getItem("id"),
            "name" : localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"),
            "username" : localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"),
            "email" : localStorage.getItem("email"),
        }
        const connectedUser = await chatClient.connectUser(userInfo, chatClient.devToken(userInfo.id));
        let numberOfUnreadMessages;
        numberOfUnreadMessages = connectedUser.me.total_unread_count;
        this.keepUnreadMessagesToStore(numberOfUnreadMessages);
        chatClient.on((event) => {
            if (event.total_unread_count !== undefined) {
                this.keepUnreadMessagesToStore(event.total_unread_count);
            }
        });
        return numberOfUnreadMessages;
    }

    getChannelsOfUserFromGetStream = async (id) => {
        const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
        // const chatClient = await this.getInstanceOfGetStream();
        const filter = { type: 'messaging', members: { $in: [id] } };
        const sort = [{ last_message_at: -1 }];
        const channels = await chatClient.queryChannels(filter, sort, {
            watch: true, // this is the default
            state: true,
        });
        channels.forEach((channel, index) => {
            channel.on("message.new", async (event) => {
                var originalMessage = event.message.text;

                console.log("Original Message => ", originalMessage);

                var emailExp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/img;
                var phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/img;
                
                originalMessage = originalMessage.replace(emailExp, '*** *** ***').replace(phoneExp, '### ### ###');
                
                const text = `${originalMessage}`;
                
                const updated = await chatClient.partialUpdateMessage(event.message.id, {
                    set: {
                        text
                    }
                });

                console.log("Update Message => ", updated);
            })
        });
        console.log("API Channels of User => ", channels);
        const number_of_channels = channels.length;
        this.keepNumberOfChannels(number_of_channels);
        return channels;
    }

    searchUsersWithName = async (term) => {
        const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
        // const chatClient = await this.getInstanceOfGetStream();
        // const queryChatUsers = await chatClient.queryUsers({ name: { $autocomplete: term } });
        const queryChatUsers = await chatClient.queryUsers({ name: { $autocomplete: term }, role: { $in: ['user'] }});
        return queryChatUsers;
    }

    channelWatchForGetStream = async (first_name, last_name, email, id, image) => {
        const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
        // const chatClient= await this.getInstanceOfGetStream();
        const hostId = store.state.user.id;
        const newChannel = await chatClient.channel('messaging', this.makeid(32), {
            image: image,
            name: first_name + " " + last_name,
            members: [hostId, id]});
        newChannel.on("message.new", async (event) => {
            var originalMessage = event.message.text;

            console.log("Original Message => ", originalMessage);

            var emailExp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/img;
            var phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/img;
            
            originalMessage = originalMessage.replace(emailExp, '*** *** ***').replace(phoneExp, '### ### ###');
            
            const text = `${originalMessage}`;
            
            const updated = await chatClient.partialUpdateMessage(event.message.id, {
                set: {
                    text
                }
            });

            console.log("Update Message => ", updated);
        });
        const new_channel_state = await newChannel.watch();
        return new_channel_state
    }

    channelWatchForGetStreamWithSeveralIds = async (ids) => {
        const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
        // const channelId = ids.reduce((channelId, id) => {
        //     channelId += id + "-";
        //     return channelId;
        // }, "")
        const hostId = store.state.user.id;
        const newChannel = await chatClient.channel('messaging', this.makeid(32), {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDCJr3Iilc5vBe45AVzYP4sMmxf8UkdxUxTQ&usqp=CAU',
            name: "Chat Group For " + store.state.user.first_name + " " + store.state.user.last_name,
            members: [hostId, ...ids]
        });
        newChannel.on("message.new", async (event) => {
            var originalMessage = event.message.text;

            console.log("Original Message => ", originalMessage);

            var emailExp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/img;
            var phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/img;
            
            originalMessage = originalMessage.replace(emailExp, '*** *** ***').replace(phoneExp, '### ### ###');
            
            const text = `${originalMessage}`;
            
            const updated = await chatClient.partialUpdateMessage(event.message.id, {
                set: {
                    text
                }
            });

            console.log("Update Message => ", updated);
        });
        const new_group_channel_state = newChannel.watch();
        return new_group_channel_state;
    }

    getAllUsersFromGetStream = async () => {
        const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
        // const chatClient = await this.getInstanceOfGetStream();
        const allUsers = await chatClient.queryUsers(
            { role: 'user' },
        );
        store.reduce({
            type: 'stream_users',
            streamUsers: allUsers,
        });
    }

    keepUnreadMessagesToStore = (count) => {
        store.reduce({
            type: "unread_messages_getStream",
            count: count
        });
    }

    keepUnreadChannelsToStore = (count) => {
        store.reduce({
            type: "unread_channels_getStream",
            count: count
        })
    }

    keepNumberOfChannels = (count) => {
        store.reduce({
            type: "number_of_channels_getStream",
            count: count
        })
    }

    addInvitedMember = (user) => {
        store.reduce({
            type: "add_member_group",
            info: user
        })
    }

    removeInivitedUser = (users) => {
        store.reduce({
            type: "remove_member_group",
            info: users
        })
    }

    get = async (path, { params={}, url=this.baseUrl, method='GET', checkRefresh=true, errorType='standard' } = {}) => {
        if (checkRefresh) await this.maybeRefreshToken();

        console.log("Request path =>>>>> ", url + path);

        console.log("Queryfiy Params => ", this.querify(params));

        const json = await fetch(url  + path + this.querify(params), {
            method,
            headers: {
                'Authorization': 'Bearer ' + this.authToken,
            }
        });

        return await this.handleResponse(json, errorType);
    }

    getConf = async(path, { url=this.baseUrl, method='GET', errorType='standard'} = {}) => {
        const json = await fetch(url + path, {
            method,
        });

        return await this.handleResponse(json, errorType)
    }

    querify = (query) => {
        const pairs = Object.keys(query).map(key => {
            if (!!query[key])
                return key + '=' + query[key];
        }).filter(Boolean);

        return '?' + pairs.join('&');
    }

    post = async (path, { params={}, url=this.baseUrl, method='POST', checkRefresh=true, errorType='standard' } = {}) => {
        if (checkRefresh) await this.maybeRefreshToken();

        console.log("Post Request URL => ", url + path);

        const json = await fetch(url + path, {
            method,
            headers: {
                'Authorization': 'Bearer ' + this.authToken,
                // 'X-CSRF-Token': this.railsToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        });

        console.log("JSON JSON => ", json);

        return await this.handleResponse(json, errorType);
    }

    getHerokuConfigurations = async () => {
        const res = await this.getConf('configs', {
            errorType: 'configs',
        })

        if (!res.error) {
            store.reduce({
                type: 'set_configs',
                configs: res.Configs || {},
            });

            return true;

        } else {

            return false;

        }
    }

    maybeRefreshToken = async () => {
        const tokenExpires = new Date(localStorage.getItem('tokenExpires'));
        const now = new Date();

        if (tokenExpires && now > tokenExpires) {

            const res = await this.get('refresh_token', {
                errorType: 'login',
                checkRefresh: false,
            });

            if (!res.error) {

                this.authToken = res.auth_token;

                store.reduce({
                    type: 'login',
                    ...res,
                });

                return true;

            } else {

                return false;

            }

        }
    }

    handleResponse = async (json, errorType) => {
        if (json.status === 401) {

            this.openLoginModal();

            return {
                error: true
            };

        } else {

            const res = await json.json();
            console.log("Login Response => ", res);
            if (res.error) {
                store.reduce({
                    type: 'error',
                    errorType,
                    error: res.error,
                });
                return { error: true };
            }
            return res;

        }
    }

//////////////////////////////////////////////////////////////
///// USERS /////////////////////////////////////////////////
////////////////////////////////////////////////////////////

    createUser = async (user) => {
        this.setLoading('login');

        const res = await this.post('sign_up', {
            params: { user, ambassador: store.state.ambassador },
            errorType: 'login',
            checkRefresh: false,
        });

        if (!res.error) {

            this.authToken = res.auth_token;

            store.reduce({
                type: 'login',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    updateUser = async (id, user, changing_email=false, changing_account=false, type='update_user') => {
        this.setLoading(type);

        const res = await this.post(`users/${id}`, {
            params: { user, changing_email, changing_account },
            errorType: type,
            method: 'PATCH',
        });

        console.log("Update User Res => ", res);

        if (!res.error) {

            store.reduce({
                type: 'set_user',
                user: res.user, loggedIn: true,
            });

            if (type === 'update_password') {

                store.reduce({
                    type: 'success',
                    successType: 'update_password',
                    success: 'Password updated sucessfully!',
                });

            };

            return true;

        } else {

            return false;

        }
    }

    updateProfilePicture = async (id, image, type='profile_picture') => {
        this.setLoading(type);

        const res = await this.post(`users/${id}/profile_picture`, {
            params: { image },
            errorType: type,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_user',
                ...res, loggedIn: true,
            });

            return true;

        } else {

            return false;

        }
    }

    attachExternalAccount = async (id, token) => {
        this.setLoading('external_account');

        const res = await this.post(`users/${id}/external_account`, {
            params: { token },
            errorType: 'external_account',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_user',
                ...res, loggedIn: true,
            });

            store.reduce({
                type: 'success',
                successType: 'external_account',
                success: 'Successfully updated your bank information!',
            });

            return true;

        } else {

            return false;

        }
    }

    login = async (user, redirectTo="/") => {
        this.setLoading('login');

        const res = await this.post('login', {
            params: { user },
            errorType: 'login',
            checkRefresh: false,
        });

        console.log("Response for Login => ", res);

        if (!res.error) {

            this.authToken = res.auth_token;

            store.reduce({
                type: 'login',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getUser = async () => {
        this.setLoading('user');

        const res = await this.get('current_user', {
            errorType: 'user',
            checkRefresh: !!this.authToken,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_user',
                user: res.user || {},
                loggedIn: !!res.user,
            });

            return true;

        } else {

            return false;

        }
    }

    getProfile = async (id) => {
        this.setLoading('profile');

        const res = await this.get(`users/${id}`, {
            errorType: 'profile',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_profile',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getAccount = async (id) => {
        this.setLoading('account');

        const res = await this.get(`users/${id}/account`, {
            errorType: 'account',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_account',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getUserById = async (id) => {
        this.setLoading('user');

        const res = await this.get(`users/${id}`, {
            errorType: 'user',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_user',
                user: res.user || {},
                loggedIn: !!res.user,
            });

            return true;

        } else {

            return false;

        }
    }

    createPasswordReset = async (email) => {
        this.setLoading('password_reset');

        const res = await this.post('reset_password', {
            params: { email },
            errorType: 'login',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'success',
                successType: 'password_reset',
                success: 'An email for resetting your password has been sent!'
            });

            return true;

        } else {

            return false;

        }

    }

    changePassword = async (params) => {
        this.setLoading('login');

        return await this.post('change_password', {
            params,
            errorType: 'login',
            checkRefresh: false,
        });

    }

    sendConfirmationEmail = async () => {
        const res = await this.post('users/send_confirmation_email', {
            errorType: 'confirmation_email',
        });

        if (!res.error) {

            store.reduce({
                type: 'success',
                successType: 'confirmation_email',
                success: 'Confirmation email resent!',
            });

            return true;

        } else {

            return false;

        }

    }

    confirmEmail = async (token) => {
        const res = await this.post('users/confirm_email', {
            params: { token },
            errorType: 'confirm_email',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'login',
                ...res,
            });

            return true;

        } else {

            return false;
        }
    }

    makeAmbassador = async (id) => {
        const res = await this.post(`users/${id}/ambassador`, {
            errorType: 'ambassador',
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        }
    }

    destroyAmbassador = async (id) => {
        const res = await this.post(`users/${id}/destroy_ambassador`, {
            errorType: 'ambassador',
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        }
    }

    backgroundCheck = async (id, image) => {
        this.setLoading('update_user');
        
        const res = await this.post(`users/${id}/background_check`, {
            errorType: 'update_user',
            params: { image },
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        }
    }

    createEmail = async (email) => {
        this.setLoading('email');
        
        const res = await this.post(`users/email`, {
            errorType: 'email',
            params: { email },
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        }
    }


    updateBoatDates = async (id, user) => {
        this.setLoading('update_user');

        const res = await this.post(`users/${id}/dates`, {
            params: { user },
            errorType: 'update_user',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_user',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

//////////////////////////////////////////////////////////////
///// BOATS /////////////////////////////////////////////////
////////////////////////////////////////////////////////////

    createBoat = async (boat) => {
        this.setLoading('create_boat');

        const res = await this.post('boats', {
            params: {  boat },
            errorType: 'create_boat',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boat',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getBoats = async (user_id) => {
        this.setLoading('boats');

        const res = await this.get('boats', {
            params: { user_id },
            errorType: 'boats',
            checkRefresh: false,
        });

        console.log("Get Boats Response => ", res);

        if (!res.error) {

            store.reduce({
                type: 'set_boats',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getMyBoats = async () => {
        this.setLoading('boats');

        const res = await this.get('boats', {
            errorType: 'boats',
            checkRefresh: false,
        });

        console.log("Get MyBoats ===> ", res);

        if (!res.error) {

            store.reduce({
                type: 'set_boats',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getBoat = async (id, params) => {
        this.setLoading('boats');

        const res = await this.get(`boats/${id}`, {
            params,
            errorType: 'boats',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boat',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getBoatTimes = async (id, date) => {
        this.setLoading('boat_times');

        const res = await this.get(`boats/${id}/times`, {
            params: { date },
            errorType: 'boat_times',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boat_times',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    updateBoat = async (id, boat) => {
        this.setLoading('update_boat');

        const res = await this.post(`boats/${id}`, {
            params: { boat },
            errorType: 'update_boat',
            method: 'PATCH',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boat',
                ...res,
            });

            store.reduce({
                type: 'success',
                successType: 'update_boat',
                success: 'Your boat has been updated!',
            });

            return true;

        } else {

            return false;

        }
    }

    destroyBoat = async (id) => {

        const res = await this.get(`boats/${id}`, {
            method: 'DELETE',
            errorType: 'destroy_boat',
        });

        if (!res.error) {
            
            return true;

        } else {

            return false;
        };

    }

    uploadBoatInsurance = async (id, file, name) => {
        this.setLoading('upload_insurance');


        const res = await this.post(`boats/${id}/upload_insurance`, {
            params: { file, name },
            errorType: 'upload_insurance',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boat',
                ...res,
            });

            return true;

        } else {

            return false;
        }
    }

    updateBoatImage = async (id, image, image_type) => {
        this.setLoading('update_boat');

        const res = await this.post(`boats/${id}/images`, {
            params: { image, image_type },
            errorType: 'update_boat',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boat',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    updateBoatLocations = async (id, marinas) => {
        this.setLoading('update_boat');

        const res = await this.post(`boats/${id}/locations`, {
            params: { marinas },
            errorType: 'update_boat',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boat',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    searchBoats = async (params, filter=false, offset=0) => {
        if (filter) this.setLoading('filter_boats');

        const res = await this.get('boats/search', {
            params: { ...params, offset },
            errorType: filter ? 'filter_boats' : 'search_boats',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boats',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    createCancellationPolicy = async (id, custom_cancellation_policy) => {
        this.setLoading('update_boat');

        const res = await this.post(`boats/${id}/custom_cancellation_policy`, {
            params: { custom_cancellation_policy },
            errorType: 'update_boat',
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        }
    }

    askQuestion = async (boat_id, user_id, question) => {
        this.setLoading('question');

        const res = await this.post(`boats/${boat_id}/question`, {
            errorType: 'question',
            params: { question, user_id },
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        };
    }

//////////////////////////////////////////////////////////////
///// ONBOARD ///////////////////////////////////////////////
////////////////////////////////////////////////////////////

    updateOnboard = async (params) => {
        const res = await this.post('onboard', {
            params,
        });

        console.log('Update OnBoard Response => ', res);

        if (!res.error) {

            store.reduce({
                type: 'set_onboard_metadata',
                ...res,
            });

            return true;

        } else {

            return false;
        }
    }

    getOnboardBoat = async () => {
        this.setLoading('boats');

        const res = await this.get('onboard', {
            errorType: 'boats',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boat',
                ...res,
            });

            return true;

        } else {

            return false;
            
        }
    }

//////////////////////////////////////////////////////////////
///// MARINAS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////

    createMarina = async (marina, boat_id=null) => {
        this.setLoading('update_boat');

        const res = await this.post('marinas', {
            params: {  marina, boat_id },
            errorType: 'update_boat',
        });

        if (!res.error) {

            if (boat_id) {

                // if boat id present return marina id

                return res.marina.id;

            } else {
                
                window.location.href = `/admin/marinas/${res.marina.id}`;

            }

        } else {

            return false;

        }
    }

    getMarinas = async () => {
        this.setLoading('marinas');

        const res = await this.get('marinas');

        if (!res.error) {

            store.reduce({
                type: 'set_marinas',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getMarina = async (id) => {
        this.setLoading('marinas');

        const res = await this.get(`marinas/${id}`, {
            errorType: 'marinas',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_marina',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    updateMarina = async (id, marina) => {
        this.setLoading('update_marina');

        const res = await this.post(`marinas/${id}`, {
            params: { marina },
            errorType: 'update_marina',
            method: 'PATCH',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_marina',
                ...res,
            });

            store.reduce({
                type: 'success',
                successType: 'update_marina',
                success: 'Successfully updated this marina!',
            });

            return true;

        } else {

            return false;

        }
    }

    destroyMarina = async (id) => {

        const res = await this.get(`marinas/${id}`, {
            method: 'DELETE',
            errorType: 'destroy_marina',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_marinas',
                ...res,
            });
            
            return true;

        } else {

            return false;
        };

    }

//////////////////////////////////////////////////////////////
///// ADMIN /////////////////////////////////////////////////
////////////////////////////////////////////////////////////

    getAdminIndex = async (type, offset=0, term=null) => {

        const res = await this.get('admin/' + type, {
            params: { offset, term },
            errorType: type,
        });

        if (!res.error) {

            store.reduce({
                type: 'admin_index',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getCelebs = async () => {
        this.setLoading('admin');

        const res = await this.get('admin/celebs', {
            errorType: 'admin',
        });

        if (!res.error) {

            store.reduce({
                type: 'celeb_index',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    geocode = async (query) => {
        this.setLoading('geocode');

        const res = await this.get('admin/geocode', {
            errorType: 'geocode',
            params: { query }
        });

        if (!res.error) {

            return res.res;

            return true;

        } else {

            return false;

        }
    }

//////////////////////////////////////////////////////////////
///// LAKES /////////////////////////////////////////////////
////////////////////////////////////////////////////////////

    getLake = async (id) => {
        this.setLoading('lakes');

        const res = await this.get(`lakes/${id}`, {
            errorType: 'lakes',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_lake',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    createLake = async (lake) => {
        this.setLoading('update_lake');

        const res = await this.post('lakes', {
            params: { lake },
            errorType: 'update_lake',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_lake',
                ...res,
            });

            store.reduce({
                type: 'success',
                successType: 'update_lake',
                success: 'Successfully created this lake!',
            });

            return true;

        } else {

            return false;

        }
    }

    updateLake = async (id, lake) => {
        this.setLoading('update_lake');

        const res = await this.post(`lakes/${id}`, {
            params: { lake },
            errorType: 'update_lake',
            method: 'PATCH',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_lake',
                ...res,
            });

            store.reduce({
                type: 'success',
                successType: 'update_lake',
                success: 'Successfully updated this lake!',
            });

            return true;

        } else {

            return false;

        }
    }

    destroyLake = async (id) => {

        const res = await this.get(`lakes/${id}`, {
            method: 'DELETE',
            errorType: 'destroy_lake',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_marinas',
                ...res,
            });
            
            return true;

        } else {

            return false;
        };

    }

    searchLakes = async (term) => {
        this.setLoading('lakes');

        const res = await this.get('lakes/search', {
            params: { term },
            errorType: 'lakes',
            checkRefresh: false,
        });

        if (!res.error) {

            store.reduce({
                type: 'set_lakes',
                ...res,
            });

            return true;

        } else {

            return false;
            
        }
    }

//////////////////////////////////////////////////////////////
///// GIFTS /////////////////////////////////////////////////
////////////////////////////////////////////////////////////    

    createGift = async (gift) => {
        this.setLoading('gifts');

        const res = await this.post('gifts', {
            params: {  gift },
            errorType: 'gifts',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_gift',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    updateGift = async (id, gift) => {
        this.setLoading('gifts');

        const res = await this.post(`gifts/${id}`, {
            params: { gift },
            errorType: 'gifts',
            method: 'PATCH',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_gift',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getGifts = async () => {
        this.setLoading('gifts');

        const res = await this.get('gifts');

        if (!res.error) {

            store.reduce({
                type: 'set_gifts',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

//////////////////////////////////////////////////////////////
///// LAKE QUERIES //////////////////////////////////////////
////////////////////////////////////////////////////////////

    createLakeQuery = async (lake_query) => {
        this.setLoading('lake_queries');

        const res = await this.post('lake_queries', {
            params: {  lake_query },
            errorType: 'lake_queries',
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        }
    }

//////////////////////////////////////////////////////////////
///// BOOKINGS //////////////////////////////////////////////
////////////////////////////////////////////////////////////

    createBooking = async (booking) => {
        this.setLoading('create_booking');

        const res = await this.post('bookings', {
            params: {  booking },
            errorType: 'bookings',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_booking',
                ...res,
            });

            window.location.href = `/bookings/${res.booking.id}/new`;

            return true;

        } else {

            return false;

        }
    }

    updateBooking = async (id, booking) => {
        this.setLoading('update_booking');

        const res = await this.post(`bookings/${id}`, {
            params: { 
                booking,
                hosting: store.state.hosting ? 1 : 0,
            },
            errorType: 'update_booking',
            method: 'PATCH',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_booking',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getBooking = async (id) => {
        this.setLoading('bookings');

        const res = await this.get(`bookings/${id}`, {
            errorType: 'bookings',
            checkRefresh: false,
            params: { hosting: store.state.hosting ? 1 : 0 },
        });

        if (!res.error) {

            store.reduce({
                type: 'set_booking',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    getBookings = async (profile_id=null) => {
        this.setLoading('bookings');

        const res = await this.get('bookings', {
            errorType: 'bookings',
            checkRefresh: false,
            params: { 
                profile_id,
                hosting: store.state.hosting ? 1 : 0,
            },
        });

        if (!res.error) {

            store.reduce({
                type: 'set_bookings',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    customRefund = async (id, params) => {
        this.setLoading('update_booking');

        const res = await this.post(`bookings/${id}/custom_refund`, {
            errorType: 'update_booking',
            params,
        });

        if (!res.error) {

            store.reduce({
                type: 'success',
                successType: 'bookings',
                success: 'Successfully refunded guest and cancelled booking!',
            });

            store.reduce({
                type: 'set_booking',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

    message = async (id, message, reply=false) => {
        this.setLoading('message');

        const res = await this.post(`bookings/${id}/message`, {
            errorType: 'message',
            params: { 
                message, reply,
                hosting: store.state.hosting ? 1 : 0,
            },
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        };
    }

    sendTip = async (id, amount) => {
        this.setLoading('tips');

        const res = await this.post(`bookings/${id}/tip`, {
            errorType: 'tips',
            params: { amount },
        });

        if (!res.error) {

            return true;

        } else {

            return false;

        };
    }


//////////////////////////////////////////////////////////////
///// REVIEWS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////

    createReview = async (review) => {
        this.setLoading('reviews');

        const res = await this.post('reviews', {
            params: {  
                review,
                hosting: store.state.hosting ? 1 : 0,
            },
            errorType: 'reviews',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_review',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

////////////////////////////////////////////////////////////////
///// BOOKMARKS ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////

    createBookmark = async (id) => {
        const res = await this.post('bookmarks', {
            params: { bookmark: { boat_id: id } },
            errorType: 'bookmarks',
        });

        if (!res.error) {

            return res.bookmarked;

        } else {

            return false;

        }
    }

    destroyBookmark = async (id) => {
        const res = await this.get(`bookmarks/${id}`, {
            method: 'DELETE',
            errorType: 'bookmarks',
        });

        if (!res.error) {

            return res.bookmarked;

        } else {

            return true;

        }
    }

    getBookmarks = async () => {
        this.setLoading('boats');

        const res = await this.get('bookmarks', {
            errorType: 'boats',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_boats',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

////////////////////////////////////////////////////////////////
///// DISCOUNTS ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////

    createDiscount = async (discount) => {
        const res = await this.post('discounts', {
            params: { discount },
            errorType: 'discounts',
        });

        return !res.error;
    }

    destroyDiscount = async (id) => {
        const res = await this.get(`discounts/${id}`, {
            method: 'DELETE',
            errorType: 'discounts',
        });

        return !res.error;
    }

    getDiscount = async (code) => {
        const res = await this.get(`discounts/${code}`, {
            errorType: 'discounts',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_discount',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

//////////////////////////////////////////////////////////////
///// AMBASSADORS ///////////////////////////////////////////
////////////////////////////////////////////////////////////
    
    getAmbassadorProfile = async (id) => {
        this.setLoading('ambassadors');

        const res = await this.get(`ambassadors/${id}`, {
            errorType: 'ambassadors',
        });

        if (!res.error) {

            store.reduce({
                type: 'set_ambassador_profile',
                ...res,
            });

            return true;

        } else {

            return false;

        }
    }

//////////////////////////////////////////////////////////////
///// DATES /////////////////////////////////////////////////
////////////////////////////////////////////////////////////  

    setDate = (date) => {
        if (date && date != 'null') {

            date = new Date(parseInt(date)).toDateString();
            
            this.setDateString(date);
        }
    }

    setDateString = (date) => {
        store.reduce({
            type: 'set_date',
            date,
        });
    };

    setAmbassador = (ambassador) => {
        store.reduce({
            type: 'set_ambassador',
            ambassador,
        });
    }

    signOut = async () => {
        const res = await this.post('sign_out', {
            checkRefresh: false
        });

        if (!res.error) {
            const chatClient = await StreamChat.getInstance(localStorage.getItem("getstream_api_key"), { timeout: 60000 });
            if(chatClient) chatClient.disconnectUser();

            store.reduce({ type: 'sign_out', user: {} })
            localStorage.clear();
            window.location.reload();
            return res.success;

        } else {

            return false;

        }
    }

    openLoginModal = () => (
        store.reduce({
            type: 'set_login_modal',
            open: true,
        })
    )

    closeLoginModal = () => (
        store.reduce({
            type: 'set_login_modal',
            open: false,
        })
    )

    setHosting = (hosting, redirect=true) => {
        store.reduce({
            type: 'set_hosting',
            hosting,
        });

        if (redirect)
            window.location.href = hosting ? '/manage-boat' : '/';
    }

    setError = (errorType, error) => (
        store.reduce({
            type: 'error',
            errorType,
            error,
        })
    )

    clearErrors  = () => (
        store.reduce({
            type: 'clear_errors',
        })
    )

    clearSuccess  = () => (
        store.reduce({
            type: 'clear_success',
        })
    )

    setLoading = (loadingType) => (
        store.reduce({
            type: 'loading',
            loadingType,
        })
    )

    stopLoading = (loadingType) => (
        store.reduce({
            type: 'stop_loading',
            loadingType,
        })
    )

    setQuestionModal = (val) => {
        // store.reduce({
        //     type: "set_question",
        //     value: val
        // })
        localStorage.setItem("set_question", val);
    }
}

export let api = new Api();
window.api = api;
