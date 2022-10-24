import { querify } from './utils';

class Store {
    constructor() {
        this.state = {
            apiKey: "",
            // streamUsers: [],
            streamAvatar: null,
            groupMembers: [],
            user: {
                username: localStorage.getItem('username'),
                unreadMessages: null,
                unreadChannels: null,
                numberOfChannels: null
            },
            users: [],
            profile: {},
            account: {},
            users: [],
            loggedIn: false,
            date: null,
            hosting: localStorage.getItem('hosting') == 'true',
            loading: {
                user: true,
                admin: true,
                lakes: true,
                boats: true,
                search_boats: true,
                bookings: true,
                profile: true,
                ambassadors: true,
                configs: true,
            },
            boat: {},
            boat_times: [],
            boats: [],
            marinas: {},
            lakes: [],
            states: [],
            celebs: [],
            pro_hoppers: [],
            lake: {},
            marina: [],
            marinas: [],
            booking: {},
            bookings: [],
            gifts: [],
            discounts: [],
            ambassadors: [],
            discount: {},
            ambassador_profile: {},
            filters: {},
            ambassador: localStorage.getItem('ambassador'),
            errors: {},
            success: {},
            searchResults: {},
            configs: {},
            // setQuestionModal: false,
        }

        this.setState = () => {};
    }

    setStateHandler(setState) {
        this.setState = setState;
    }

    async reduce(event) {
        console.log(">>> reduce() -> event", event);
        console.log(event);

        switch (event.type) {
        case 'set_login_modal':
            this.state.loginModal = event.open;
            if (event.open)
                Object.keys(this.state.loading).forEach(key => {
                    this.state.loading[key] = false;
                });
            break;
        case 'login':
            this.state.loading.login = false;
            localStorage.setItem('id', event.user && event.user.id);
            localStorage.setItem('first_name', event.user && event.user.first_name);
            localStorage.setItem('last_name', event.user && event.user.last_name)
            localStorage.setItem('authToken', event.auth_token);
            localStorage.setItem('email', event.user && event.user.email);
            localStorage.setItem('tokenExpires', this.tenMinFromNow());
            this.state.user = event.user;
            console.log("Logged In User Info => ", this.state.user);
            this.state.loggedIn = true;
            break;
        case 'set_hosting':
            localStorage.setItem('hosting', event.hosting);
            this.state.hosting = event.hosting;
            break;
        case 'set_user':
            this.state.loading.login = false;
            this.state.loading.user = false;
            this.state.loading.update_user = false;
            this.state.loading.update_password = false;
            this.state.loading.profile_picture = false;
            this.state.loading.external_account = false;
            localStorage.setItem('first_name', event.user && event.user.first_name);
            localStorage.setItem('last_name', event.user && event.user.last_name);
            localStorage.setItem('email', event.user && event.user.email);
            this.state.user = { ...this.state.user, ...event.user };
            this.state.loggedIn = event.loggedIn;
            break;
        case 'update_avatar':
            this.state.streamAvatar = event.uri;
            console.log("State Avatar Update => ", this.state.streamAvatar);
            break;
        // case "stream_users":
        //     this.state.streamUsers = event.streamUsers;
        //     console.log("Stream Users => ", this.state.streamUsers);
        //     break;
        case "unread_messages_getStream":
            this.state.user.unreadMessages = event.count;
            console.log("Store unread messages keep => ", this.state.user.unreadMessages);
            break;
        case "unread_channels_getStream":
            this.state.user.unreadChannels = event.count;
            console.log("Store unread channels keep => ", this.state.user.unreadChannels);
            break;
        case "number_of_channels_getStream":
            this.state.user.numberOfChannels = event.count;
            console.log("Store Number of Channels for a user => ", this.state.user.numberOfChannels);
            break;
        case "sign_out":
            this.state.loading.login = false;
            this.state.loading.user = false;
            this.state.loading.update_user = false;
            this.state.loading.update_password = false;
            this.state.loading.profile_picture = false;
            this.state.loading.external_account = false;
            localStorage.setItem('first_name', event.user && event.user.first_name);
            localStorage.clear()
            this.state.user = { ...this.state.user, ...event.user };
            this.state.loggedIn = false;
            break;
        case 'set_profile':
            this.state.loading.profile = false;
            this.state.profile = event.profile;
            break;
        case 'set_account':
            this.state.loading.account = false;
            this.state.account = event.account;
            break;
        case 'set_onboard_metadata':
            this.state.user.onboard_metadata = event.onboard_metadata;
            break;
        case 'set_boat':
            this.state.loading.boats = false;
            this.state.loading.update_boat = false;
            this.state.loading.create_boat = false;
            this.state.loading.upload_insurance = false;
            if (event.force) {
                this.state.boat = event.boat;
            } else {
                this.state.boat = { ...this.state.boat, ...event.boat };
            };
            break;
        case 'set_boat_times':
            this.state.loading.boat_times = false;
            this.state.boat_times = event.times;
            break;
        case 'set_boats':
            this.state.loading.boats = false;
            this.state.loading.search_boats = false;
            this.state.loading.filter_boats = false;
            console.log("Event Push => ", event.push);
            if (event.push) {
                this.state.boats = this.state.boats.concat(event.boats);
                event.marinas.forEach(m1 => {
                    const m = this.state.marinas.find(m2 => m1.id === m2.id);
                    if (!m) this.state.marinas.push(m1);
                });

            } else {
                this.state.boats = event.boats;
                this.state.marinas = event.marinas;
            }
            this.state.lake = event.lake;
            if (event.lake)
                this.state.filters.lake = event.lake.id;
            break;
        case 'set_marinas':
            this.state.loading.marinas = false;
            if (event.marinas)
                this.state.marinas = event.marinas;
            if (event.lakes)
                this.state.lakes = event.lakes;
            break;
        case 'set_marina':
            this.state.loading.marinas = false;
            this.state.loading.update_marina = false;
            this.state.marina = event.marina;
            break;
        case 'set_lakes':
            this.state.loading.lakes = false;
            this.state.lakes = event.lakes;
            break;
        case 'set_lake':
            this.state.loading.lakes = false;
            this.state.loading.update_lake = false;
            this.state.lake = event.lake;
            this.state.filters.lake = event.lake.id;
            break;
        case 'set_booking':
            this.state.loading.create_booking = false;
            this.state.loading.bookings = false;
            this.state.loading.update_booking = false;
            this.state.booking = event.booking;
            if (event.booking.boat)
                this.reduce({
                    type: 'set_boat',
                    boat: event.booking.boat,
                });
            break;
        case 'set_bookings':
            this.state.loading.bookings = false;
            this.state.bookings = event.bookings;
            break;
        case 'set_date':
            this.state.date = event.date;
            this.state.filters.date = event.date;
            break;
        case 'set_filters':
            if (event.replace) {
                this.state.filters = event.filters;
            } else {
                this.state.filters = { 
                    ...this.state.filters, 
                    ...event.filters,
                };
            };
            history.replaceState(this.state.filters, '', this.getSearchString());
            break;
        case 'admin_index':
            if (event.replace) {
                this.state.users = event.users || this.state.users;
                this.state.boats = event.boats || this.state.boats;
            } else {
                this.state.users = this.state.users.concat(event.users).filter(Boolean);
                this.state.boats = this.state.boats.concat(event.boats).filter(Boolean);
            };
            this.state.user_count = event.user_count || this.state.user_count;
            this.state.boat_count = event.boat_count || this.state.boat_count;
            this.state.lakes = this.state.lakes.concat(event.lakes).filter(Boolean);
            this.state.states = this.state.states.concat(event.states).filter(Boolean);
            this.state.marinas = this.state.marinas.concat(event.marinas).filter(Boolean);
            this.state.ambassadors = this.state.ambassadors.concat(event.ambassadors).filter(Boolean);
            this.state.pro_hoppers = event.pro_hoppers ? event.pro_hoppers.filter(Boolean) : [];
            this.state.celebs = this.state.celebs.concat(event.celebs).filter(Boolean);
            this.state.discounts = this.state.discounts.concat(event.discounts).filter(Boolean);
            this.state.gifts = this.state.gifts.concat(event.gifts).filter(Boolean);
            break;
        case 'celeb_index':
            this.state.loading.admin = false;
            this.state.celebs = event.celebs;
            break;
        case 'set_gift':
            const index = this.state.gifts.findIndex(gift => gift.id === event.gift.id);
            this.state.gifts[index] = { ...this.state.gifts[index], ...event.gift }; 
            break;
        case 'set_discount':
            this.state.loading.discounts = false;
            this.state.discount = event.discount;
            break;
        case 'search_results':
            this.state.searchResults[event.searchType] = event.results;
            break;
        case 'set_ambassador':
            localStorage.setItem('ambassador', event.ambassador);
            this.state.ambassador = event.ambassador;
            break;
        case 'set_ambassador_profile':
            this.state.loading.ambassadors = false;
            this.state.ambassador_profile = event.ambassador;
            break;
        case 'error':
            this.state.loading[event.errorType] = null;
            this.state.success[event.errorType] = null;
            this.state.errors[event.errorType] = event.error;
            break;
        case 'clear_errors':
            this.state.errors = {};
            break;
        case 'loading':
            this.state.success[event.loadingType] = null;
            this.state.errors[event.loadingType] = null;
            this.state.loading[event.loadingType] = true;
            break;
        case 'stop_loading':
            this.state.loading[event.loadingType] = false;
            break;
        case 'success':
            this.state.errors[event.successType] = null;
            this.state.loading[event.successType] = null;
            this.state.success[event.successType] = event.success;
            break;
        case 'clear_success':
            this.state.success = {};
            break;
        case 'add_member_group':
            this.state.groupMembers.push(event.info);
            console.log("Group Members on Store => ", this.state.groupMembers);
            break;
        case 'remove_member_group':
            this.state.groupMembers = event.info;
            console.log("Removed Group Member on Store => ", this.state.groupMembers);
            break;
        case 'set_configs':
            this.state.configs = event.configs;
            localStorage.setItem("google_map_key", this.state.configs.Google_Map_Key);
            localStorage.setItem("stripe_public_key", this.state.configs.Stripe_Public_Key);
            localStorage.setItem("getstream_api_key", this.state.configs.GetStream_Api_Key);
            console.log("Set Heroku Configs on Store => ", this.state.configs);
            break;
        // case 'set_question':
        //     this.state.setQuestionModal = event.value;
        default:
            break;
        };
        this.setState(this.state);
    }

    tenMinFromNow() {
        return new Date(new Date().getTime() + 600000);
    }

    getSearchString = () => {
        const nf = { ...this.state.filters };

        if (nf.date)
            nf.date = new Date(nf.date).getTime();

        return `/s${querify(nf)}`;
    };
}

export let store = new Store();
