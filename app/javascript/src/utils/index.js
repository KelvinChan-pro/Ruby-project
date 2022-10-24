import React from 'react';

export {default as lakeConfig} from './lake_config.js';

export {default as observer} from './observer.js';

export function parseQuery(queryString) {
    if (queryString) {
        const paramStrings = queryString.substring(1).split('&');
        return paramStrings.reduce((params, paramString) => {
            const [key, value] = paramString.split('=');
            params[key] = value;
            return params;
        }, {});
    } else {
        return {};
    }
};

export function querify(query) {
    const pairs = Object.keys(query).map(key => {
        if (!!query[key])
            return key + '=' + query[key];
    }).filter(Boolean);

    return '?' + pairs.join('&');
};

export function capitalize(string="") {
    if (Array.isArray(string)) {
        return string.map(s => capitalize(s));
    } else {
        const split = string.split('');
        split[0] = split[0].toUpperCase();
        return split.join('');
    };
};

export const states = [
    'AK', 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI',
    'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI',
    'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC',
    'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
    'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const months = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
];

export function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

export function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

export function toUSD(int) {
  if (int) {
    return parseInt(int).toLocaleString(undefined, { style: 'currency', currency: 'USD', currencyDisplay: 'symbol', minimumFractionDigits: 0, maximumFractionDigits: 0}).replace('US', '');
  } else {
    return "$0";
  };
}

export function isWeekend(dateString) {
    if (dateString) {
        const date = new Date(dateString);
        return [0, 6].includes(date.getDay());
    } else {
        return false;
    }
};

export function isToday(someDate) {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear();
};

export function isYesterday(someDate) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return someDate.getDate() == yesterday.getDate() &&
    someDate.getMonth() == yesterday.getMonth() &&
    someDate.getFullYear() == yesterday.getFullYear();
};

export function parseDateString(dateString) {
    if (!!dateString) {
        const date = new Date(dateString);
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };
};

export function parseTimeStamp(timestamp) {
    const date = new Date(timestamp);
    let day;
    if (isToday(date)) {
        day = 'Today';
    } else if (isYesterday(date)) { 
        day = 'Yesterday';
    } else {
        day = `${date.getMonth() + 1} / ${date.getDate()}`;
    };

    const time = `${getHours(date)}:${getMinutes(date)}`;
    return day + ' at ' + time;
};

export function getMinutes(date) {
    const minutes = date.getMinutes();
    return minutes < 10 ? '0' + minutes : minutes;
};

export function getHours(date) {
    const hour = date.getHours() % 12;
    return hour === 0 ? 12 : hour;
};

export function parseActivities(params) {
    return Object.keys(params).reduce((res, key) => {
        res[key] = params[key] === "1";
        return res;
    }, {});
};


export const Anchor = () => (
    <div className="anchor-icon">
        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.72727 5.13647V13.6365C8.72727 14.1439 8.62734 14.6463 8.43317 15.115C8.23901 15.5838 7.95441 16.0097 7.59564 16.3685C7.23687 16.7272 6.81094 17.0118 6.34219 17.206C5.87343 17.4002 5.37102 17.5001 4.86364 17.5001C3.83894 17.5001 2.85621 17.0931 2.13163 16.3685C1.40706 15.6439 1 14.6612 1 13.6365V10.5456L3.31818 12.091" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M14.1366 12.0909L16.4548 10.5454V13.6363C16.4548 14.1437 16.3549 14.6461 16.1607 15.1149C15.9665 15.5836 15.682 16.0096 15.3232 16.3683C14.9644 16.7271 14.5385 17.0117 14.0697 17.2059C13.601 17.4 13.0986 17.5 12.5912 17.5V17.5C11.5665 17.5 10.5837 17.0929 9.85917 16.3683C9.1346 15.6438 8.72754 14.661 8.72754 13.6363" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M8.72736 5.13636C10.0077 5.13636 11.0455 4.09848 11.0455 2.81818C11.0455 1.53789 10.0077 0.5 8.72736 0.5C7.44706 0.5 6.40918 1.53789 6.40918 2.81818C6.40918 4.09848 7.44706 5.13636 8.72736 5.13636Z" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
        </svg>
    </div>

);

export const Boat = () => (
    <div className="boat-icon">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.9541 4.36364V0.5H11.045V4.36364" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M4.09082 10.4683V4.36377H14.909V10.4683" stroke="white" strokeMiterlimit="10"/>
            <path d="M1 14.4863C1 16.1863 2.39091 17.5772 4.09091 17.5772C5.25 17.5772 6.25455 16.8818 6.79545 15.9545C7.33636 16.8818 8.34091 17.5772 9.5 17.5772C10.6591 17.5772 11.6636 16.8818 12.2045 15.9545C12.7455 16.8818 13.75 17.5772 14.9091 17.5772C16.6091 17.5772 18 16.1863 18 14.4863" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M4.09135 14.4089L2.5459 11.318L9.50044 7.45435L16.455 11.318L14.9095 14.4089" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
        </svg>
    </div>
);

export const Sport = () => (
    <div className="sport-icon">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.7506 0.749268L3.40039 15.0995" stroke="white" strokeMiterlimit="10"/>
            <path d="M17.7507 0.749278C14.23 -0.370932 7.4813 2.05696 1 12.6991C1.78036 13.4794 2.60898 14.308 3.40047 15.0995C4.19196 15.891 5.02058 16.7196 5.80094 17.5C16.443 11.0187 18.8709 4.26996 17.7507 0.749278Z" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
        </svg>
    </div>
);

export const Celeb = () => (
    <div className="celeb-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.3338 10.9483C7.03254 10.9483 5.16711 8.26351 5.16711 5.97416V5.14513C5.16711 2.85577 7.03254 1 9.3338 1C11.6351 1 13.5005 2.85577 13.5005 5.14513V5.97416C13.5005 8.26351 11.6351 10.9483 9.3338 10.9483Z" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M9.33337 13.0186C6.71336 13.0186 4.55127 13.4737 3.08626 13.9073C1.8475 14.2737 1 15.4041 1 16.6895V18.4072H10.1667" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
            <path d="M15.1666 12.1924L16.1966 14.2687L18.4999 14.6015L16.8333 16.2177L17.2266 18.5L15.1666 17.4227L13.1066 18.5L13.4999 16.2177L11.8333 14.6015L14.1366 14.2687L15.1666 12.1924Z" stroke="white" strokeMiterlimit="10" strokeLinecap="square"/>
        </svg>
    </div>
)

export function listingType({ pro_hopper, rental }) {
    return pro_hopper
        ?   'Pro Hopper'
        :   rental
                ?   'Rental - Boat only'
                :   'Rideshare - Driver included';
};

export const activities = {
    fishing: {
        title: 'Fishing',
        subtitle: 'You will provide basic fishing equipment (gear & bait)',
        icon: Anchor,
        checkboxes: {
            bass: 'Bass Fishing',
            crappie: 'Crappie Fishing',
            walleye: 'Walleye Fishing',
            trout: 'Trout Fishing',
            catfish: 'Catfish Fishing',
            striper: 'Striper Fishing',
            bow: 'Bow Fishing',
        },
    },
    leisure: {
        title: 'Leisure',
        subtitle: 'You will provide safety equipment',
        icon: Boat,
        checkboxes: {
            tubing: 'Tubing',
            swimming: 'Swimming',
            floating: 'Floating',
            cruising: 'Cruising',
            sunset_cruise: 'Sunset Cruise',
            special_moments: 'Special Moments',
            bachelor: 'Bachelor / Bachelorette Party',
        },
    },
    watersports: {
        title: 'Watersports',
        subtitle: 'You will provide basic watersports & safety equipment',
        icon: Sport,
        checkboxes: {
            wake_surfing: 'Wake Surfing',
            wakeboarding: 'Wakeboarding',
            foiling: 'Foiling',
            skiing: 'Skiing',
        },
    },
    celebrity_requested: {
        title: 'Pro-athlete',
        subtitle: '',
        icon: Celeb,
        checkboxes: {},
        hideOnFilter: true,
        hideOnProHopper: true,
        checkboxes: {
            celebrity_watersports: 'Watersports',
            celebrity_fishing: 'Fishing',
        },
    },
    celebrity: {
        title: 'Pro-athlete',
        subtitle: '',
        icon: Celeb,
        checkboxes: {
            celebrity_watersports: 'Watersports',
            celebrity_fishing: 'Fishing',
        },
        hideOnIndex: true,
    },
};

export const boatFeatures = {
    air_conditioning: 'Air conditioning',
    refridgerator: 'Refridgerator',
    anchor: 'Anchor',
    rod_holders: 'Rod holders',
    bathroom: 'Bathroom',
    shower: 'Shower',
    bluetooth_radio: 'Bluetooth Radio',
    stereo: 'Stereo',
    cooler: 'Cooler / Ice chest',
    aux_input: 'Stereo Aux Input',
    swim_ladder: 'Swim Ladder',
    fish_finder: 'Fish Finder',
    wifi: 'WiFi',
    livewell: 'Livewell / Baitwell',
    bow_thruster: 'Bow thruster',
    depth_finder: 'Depth finder',
    sonar: 'Sonar',
    gps: 'GPS',
};

export const boatRules = {
    alcohol: 'Alcohol',
    shoes: 'Shoes',
    swimming: 'Swimming',
    kids_under_12: 'Kids under 12',
    smoking: 'Smoking',
    glass_bottles: 'Glass bottles',
    pets: 'Pets',
};

export const cancellationPolicies = {
    flexible: '100% payout for cancellations made within 24 hours of the booking start time.',
    moderate: '100% payout for cancellations made within 2 days of the booking start time. 50% payout for cancellations made within 2-5 days of the booking start time.',
    strict: '100% payout for cancellations made within 14 days of the booking start time. 50% payout for cancellations made within 14-30 days of the booking start time.',
};

export const timeOptions = {
    0: '12AM',
    1: '1AM',
    2: '2AM',
    3: '3AM',
    4: '4AM',
    5: '5AM',
    6: '6AM',
    7: '7AM',
    8: '8AM',
    9: '9AM',
    10: '10AM',
    11: '11AM',
    12: '12PM',
    13: '1PM',
    14: '2PM',
    15: '3PM',
    16: '4PM',
    17: '5PM',
    18: '6PM',
    19: '7PM',
    20: '8PM',
    21: '9PM',
    22: '10PM',
    23: '11PM',
};

export const fancyTimeOptions = {
    0: '12:00 AM',
    1: '1:00 AM',
    2: '2:00 AM',
    3: '3:00 AM',
    4: '4:00 AM',
    5: '5:00 AM',
    6: '6:00 AM',
    7: '7:00 AM',
    8: '8:00 AM',
    9: '9:00 AM',
    10: '10:00 AM',
    11: '11:00 AM',
    12: '12:00 PM',
    13: '1:00 PM',
    14: '2:00 PM',
    15: '3:00 PM',
    16: '4:00 PM',
    17: '5:00 PM',
    18: '6:00 PM',
    19: '7:00 PM',
    20: '8:00 PM',
    21: '9:00 PM',
    22: '10:00 PM',
    23: '11:00 PM',
};

export const bookingStatus = Object.freeze({
    unconfirmed: 'unconfirmed',
    requested: 'requested',
    payment_required: 'payment_required',
    declined: 'declined',
    approved: 'approved',
    cancelled_by_host: 'cancelled_by_host',
    cancelled_by_guest: 'cancelled_by_guest',
    completed: 'completed',
    cancellation_requested: 'cancellation_requested',
});

export function buildStatus(status, className="subheader-heavy", icon=true) {
    if (status === bookingStatus.requested)
        return(
            <div className={`${className} redPool`}>
                {icon && <i className="far fa-clock" style={{marginRight: '10px'}} />}
                Pending
            </div>
        );

    if (status === bookingStatus.declined)
        return(
            <div className={`${className} redPool`}>
                {icon && <i className="fas fa-times-circle" style={{marginRight: '10px'}} />}
                Declined
            </div>
        );

    if (status === bookingStatus.approved)
        return(
            <div className={`${className} greenPool`}>
                {icon && <i className="fas fa-check-circle" style={{marginRight: '10px'}} />}
                Confirmed
            </div>
        );

    if (status === bookingStatus.cancelled_by_guest || status === bookingStatus.cancelled_by_host)
        return(
            <div className={`${className} redPool`}>
                {icon && <i className="fas fa-times-circle" style={{marginRight: '10px'}} />}
                Cancelled
            </div>
        );

    if (status === bookingStatus.completed)
        return(
            <div className={`${className} greenPool`}>
                {icon && <i className="fas fa-check-circle" style={{marginRight: '10px'}} />}
                Completed
            </div>
        );
};
