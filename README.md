## Example Client

The rest of the client spec can be found in [/app/javascript/src/api.js](app/javascript/src/api.js).

All authenticated requests must be accompanied by a bearer JWT.</br>
JWT's are obtained by the following unauthenticated requests:</br>

#### POST /sign_up
#### POST /login
#### POST /refresh_token
<br/>

```js
class Api {
    baseUrl = '/api/v1/'
    authToken = localStorage.getItem('authToken')
    railsToken = document.getElementsByName('csrf-token')[0].content
    store = store

    get = async (path, { params={}, url=this.baseUrl, method='GET', checkRefresh=true, errorType='standard' } = {}) => {
        if (checkRefresh) await this.maybeRefreshToken();

        const json = await fetch(url  + path + this.querify(params), {
            method,
            headers: {
                'Authorization': 'Bearer ' + this.authToken,
                'X-CSRF-Token': this.railsToken // TODO: figure how to handle (or not handle) CORS policy for native applications
            }
        });

        return await this.handleResponse(json, errorType);
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

        const json = await fetch(url + path, {
            method,
            headers: {
                'Authorization': 'Bearer ' + this.authToken,
                'X-CSRF-Token': this.railsToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        });

        return await this.handleResponse(json, errorType);
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
}
```

 ## Server Documentation
 
 ### Standard Params
 #### UserParams
 ```
 {
    email: string,
    password: string,
    full_name: string, (optional in place of first_name, last_name)
    first_name: string,
    last_name: string,
    phone_number: string,
    story: string,
    headline: string,
    license_number: string,
    host: boolean,
    address: string,
    address_two: string,
    city: string,
    state: string,
    zip: string,
    ssn: string,
    date_of_birth: string,
    hear_about_us: string,
    sms_enabled: boolean,
    available_weekdays: boolean,
    weekday_start: integer (0-23),
    weekday_end: integer (0-23),
    available_weekends: boolean,
    weekend_start: integer (0-23),
    weekend_end: integer (0-23),
    pro_hopper_onboard: boolean,
    dates: [Date] (response format from js date.toDateString() is valid, ex: Wed Feb 16 2022),
 }
 ```
 #### BoatParams
 ```
 {
    boat_type: string, (types:  wake_boat, pontoon, cabin_cruiser, fishing_boat, ski_boat, deck_boat, jet_boat, personal_watercraft, bow_rider_boat, house_boat, air_boat, yacht, performance_boat),
    make: string,
    model: string,
    year: string,
    length: string,
    guest_count: integer,
    marina_id: string,
    rental: boolean,
    title: string,
    description: string,
    fishing: boolean,
    leisure: boolean,
    watersports: boolean,
    price: integer,
    guest_should_bring: string,
    filet_package: boolean,
    filet_package_price: integer,
    media_package: boolean,
    media_package_price: integer,
    security_deposit_amount: integer,
    public: boolean,
    bass: boolean,
    crappie: boolean,
    walleye: boolean,
    trout: boolean,
    catfish: boolean,
    striper: boolean,
    bow: boolean,
    tubing: boolean,
    swimming: boolean,
    floating: boolean,
    cruising: boolean,
    sunset_cruise: boolean,
    special_moments: boolean,
    bachelor: boolean,
    wake_surfing: boolean,
    wakeboarding: boolean,
    foiling: boolean,
    skiing: boolean,
    celebrity_requested: boolean,
    pro_hopper: boolean,
    pro_hopper_approved: boolean,
    celebrity_fishing: boolean,
    celebrity_watersports: boolean,
    features: hash/object: { string: boolean } (ex: { anchor: true, bathroom: true }) (features: air_conditioning, refridgerator, anchor, rod_holders, bathroom, shower, bluetooth_radio, stereo, cooler, aux_input, swim_ladder, fish_finder, wifi, livewell, bow_thruster, depth_finder, sonar, gps),
    rules: hash/object: { string: boolean } (rules: alcohol, shoes, swimming, kids_under_12, smoking, glass_bottles, pets),
    extra_features: string (comma-seperated values),
    extra_rules: string (comma-seperated values),
    time_increments: hash/object: { string: boolean } (ex: {2: true, 6: true}) (increments: 2,3,4,6,8),
 }
```
 
### Standard Responses
#### UserResponse
```
{
    id: uuid,
    admin: boolean,
    ambassador: boolean,
    host: boolean,
    pro_hopper_onboard: boolean,
    has_pro_hopper: boolean,
    year_joined: string (year),
    full_name: string,
    first_name: string,
    last_name: string,
    email: string,
    sms_enabled: boolean,
    requires_onboarding: boolean,
    boat_only_onboard: boolean,
    phone_number: string,
    email_confirmed: boolean,
    profile_picture_url: string,
    onboard_step: integer,
    onboard_sub_step: integer,
    onboard_metadata: hash/object: { string: boolean }, (onboard steps: specifications, location, insurance, bank_information, verify_identity, gift, about_you, experience_overview, activities, boat_features, boat_rules, guests_should_bring, pricing, cancellation_policy, photos, availability, review, identity_information, stripe_terms_of_service),
    stripe_link: string,
    payouts_enabled: boolean,
    gift: GiftResponse,
    story: string,
    headline: string,
    license_number: string,
    date_of_birth: date,
    address: string,
    address_two: string,
    city: string,
    state: string,
    zip: string,
    ssn: string,
    full_address: string,
    payment_methods: [
        {
            id: string (stripe payment method id),
            object: "payment_method",
            billing_details: {...}, (see stripe payment method docs),
            card: {...}, (see stripe payment method docs),
            customer: string (stripe customer id),
            type: string,
        }
    ],
    host_review_meta: {
        rating: string,
        count: integer,
    },
    host_reviews: [ReviewIndexResponse],
    monthly_earnings: integer,
    total_earnings: integer,
    dates: [date],
    pro_hopper_dates: [date],
    available_weekends: boolean,
    available_weekdays: boolean,
    weekday_start: integer (0-23),
    weekday_end: integer (0-23),
    weekend_start: integer (0-23),
    weekend_end: integer (0-23),
}
```
#### BoatResponse
```
{
    id: uuid,
    boat_type: string (types:  wake_boat, pontoon, cabin_cruiser, fishing_boat, ski_boat, deck_boat, jet_boat, personal_watercraft, bow_rider_boat, house_boat, air_boat, yacht, performance_boat),
    make: string,
    model: string,
    year: string,
    length: integer,
    guest_count: integer,
    lake: LakeResponse,
    marina: MarinaResponse,
    city: string (deprecated),
    state: string (deprecated),
    insurance_url: string,
    insurance_file_name: string,
    title: string,
    description: string,
    sub_activities: {
        fishing: {
            bass: boolean,
            crappie: boolean,
            walleye: boolean,
            trout: boolean,
            catfish: boolean,
            striper: boolean,
            bow: boolean,
        },
        leisure: {
            tubing: boolean,
            swimming: boolean,
            floating: boolean,
            cruising: boolean,
            sunset_cruise: boolean,
            special_moments: boolean,
            bachelor: boolean,
        },
        watersports: {
            wake_surfing: boolean,
            wakeboarding: boolean,
            foiling: boolean,
            skiing: boolean,
        },
        celebrity_requested: {
            celebrity_watersports: boolean,
            celebrity_fishing: boolean,
        },
        celebrity: {
            celebrity_watersports: boolean,
            celebrity_fishing: boolean,
        },
    },
    pro_hopper: boolean,
    activities: {
        fishing: boolean,
        leisure: boolean,
        watersports: boolean,
        celebrity: boolean,
        celebrity_requested: boolean,
    },
    features: { string: boolean } (see BoatParams for feature types),
    extra_features: [ string ],
    rules: { string: boolean } (see BoatParams for rules),
    extra_rules: [ string ],
    guests_should_bring: string,
    price: integer,
    time_increments: { string: boolean } (see BoatParams for time increments),
    rental: (1 | 0),
    cover_photo: string,
    preview_photo_1: string,
    preview_photo_2: string,
    misc_photos: [ string ],
    dates: [ Date ],
    available_weekends: boolean,
    available_weekdays: boolean,
    weekday_start: integer (0-23),
    weekday_end: integer (0-23),
    weekend_start: integer (0-23),
    weekend_end: integer (0-23),
    security_deposit_amount: integer
    user: UserIndexResponse,
    public: boolean,
    monthly_earnings: integer,
    total_earnings: integer,
    review_meta: {
        rating: string,
        count: integer,
    },
    reviews: [ReviewResponse],
    bookmarked: boolean,
    marinas: [MarinaResponse],
    custom_cancellation_policy: string,
    filet_package: boolean,
    media_package: boolean,
    filet_package_price: integer,
    media_package_price: integer,
}
```
### Auth Requests
 
#### POST /sign_up
##### request
```
 {
    user: {
        email: string,
        password: string,
        first_name: string,
        last_name: string,
        full_name: string, //(optional, in place of first_name, last_name),
        host: boolean //("0"|"1"),
        ambassador: string //(optional, ambassador uid),
    }
}
```
##### response
```
{
  auth_token: string (JSON web token),
  user: UserResponse (see Standard Responses section),
}
```
 #### POST /refresh_token
 ##### request
 ```
 {
    user: {
        email: string,
        password: string,
    }
}
```
##### response
```
{
  auth_token: string (JSON web token),
  user: UserResponse (see response section),
}
```
#### GET /refresh_token
##### request
Encoded refresh token cookie (need to discuss how to handle with native applications).
```ruby
refresh_token = JsonWebToken.encode({
  user_id: user.id,
  expires: Time.now + 2.weeks,
})
cookies[:refresh_token] = {
  value: refresh_token,
  expires: Time.now + 2.weeks,
  httponly: true,
}
```
##### response
```
{
  auth_token: string (JSON web token),
  user: UserResponse (see response section),
}
```
#### POST /reset_password
##### request
```
{
  email: string
}
```
##### response
```
{
  success: true
}
```
Reset password email triggered.

#### POST /change_password
##### request
```
{
  token: string,
  password: string
}
```
##### response
```
{
  success: true
}
```
#### POST /change_password
##### response
```
{
  success: true
}
```
#### GET /current_user
##### response
```
{
  user: UserResponse (see Standard Responses section)
}
```
### User Requests
#### GET /users/:id
##### response
```
{
  profile: UserProfileResponse (see Standard Responses section)
}
```
#### POST /users
Updates a user. All request parameters optional.
##### request
```
{
  changing_email: Boolean, (triggers confirmation email)
  changing_account: Boolean, (triggers stripe update)
  user: UserParams,
}
```
##### response
```
{
  user: UserResponse,
}
```
#### GET /users/:id/account
##### response
```
{
  account: UserResponse
}
```
#### POST /users/:id/profile_picture
##### request
```
{
  image: string (Base64 Encoded image)
}
```
##### response
```
{
  user: UserResponse
}
```
#### DELETE /users/:id
##### response
```
{
  success: true
}
```
#### POST /users/send_confirmation_email
##### response
Sends confirmation email
```
{
  success: true
}
```
#### POST /users/confirm_email
##### request
```
{
  token: string
}
```
##### response
```
{
  auth_token: string (JWT),
  user: UserResponse,
}
```
#### POST /users/:id/external_account
##### request
```
{
  token: string (stripe token)
}
```
##### response
```
{
  user: UserResponse
}
```
#### POST /users/:id/dates
##### request
```
{
  pro_hopper: boolean, (determines whether to update boat or pro hopper dates),
  dates: dates: [Date], (response format from js date.toDateString() is valid, ex: Wed Feb 16 2022),
}
```
##### response
```
{
  user: UserResponse
}
```
#### POST /users/:id/background_check
##### request
```
{
  image: string, (Base64 encoded image of user signature),
}
```
##### response
```
{
  success: true
}
```
### Boat Requests
#### GET /boats
##### response
```
{
    boats: [BoatIndexResponse],
}
```
#### GET /boats/:id
##### response
```
{
    boat: BoatResponse,
}
```
#### POST /boats
Creates a boat. (boat_type, make, model, year and guest_count are required)
##### request
```
{
    boat: BoatParams
}
```
##### response
```
{
    boat: BoatResponse,
}
```
