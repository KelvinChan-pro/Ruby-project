import React, { useState, useRef, Fragment } from 'react';
import { 
    Form, PasswordConditions, ImageUpload, 
    Submit, ErrorBox, Reviews,
} from '../components';
import { userParams } from '../params';
import { withStuff } from '../hocs';

const Profile = ({ api, state }) => {
    const { user, profile } = state;
    const { boats } = profile;
    const story = useRef();
    const headline = useRef();
    const canEdit = profile.id === user.id || user.admin;
    const [edit, setEdit] = useState(false);

    async function save() {
        const res = await api.updateUser(profile.id, { 
            story: story.current.value,
            headline: headline.current.value,
        });
        setEdit(!res);
    }

    return(
        <div className="container profile" >
           <div className="row">
                <div className="profile-box-left col-md-4 col-sm-12">
                    <div style={{padding: '0px 50px', marginBottom: '10px'}} >
                        {
                            canEdit

                            ?   <ImageUpload
                                    defaultValue={profile.profile_picture_url}
                                    imageClass="big-prof-p"
                                    edit={true}
                                    updateCopy="Update Photo"
                                    type='profile_picture'
                                    onRequestUpload={(image) => api.updateProfilePicture(profile.id, image)}
                                />

                            :   <img className="big-prof-p" src={profile.profile_picture_url} />

                        }
                    </div>
                    <div className="flex" style={{marginTop: '10px'}}>
                        <i className="far fa-star" style={{marginRight: '10px'}} />
                        <div className="subheader-heavy">{profile.review_meta.count} Review{profile.review_meta.count == 1 ? '' : 's'}</div>
                    </div>
                    {
                        profile.payouts_enabled

                        ?   <div className="flex" style={{marginTop: '10px'}}>
                                <i className="far fa-badge-check" style={{marginRight: '10px'}} />
                                <div className="subheader-heavy">Identity Verified</div>
                            </div>

                        :   null // show link to stripe form ???
                    }
                    <div className="profile-confirmed">
                        <div className="subheader-heavy">{profile.first_name} confirmed</div>
                        <div className="flex" style={{marginTop: '10px'}}>
                            {
                                profile.payouts_enabled

                                ?   <i className="far fa-check" style={{marginRight: '10px'}} />

                                : <i className="far fa-times" style={{marginRight: '10px'}} />
                            }
                            Identity
                        </div>
                        <div className="flex" style={{marginTop: '10px'}}>
                            {
                                profile.email_confirmed

                                ?   <i className="far fa-check" style={{marginRight: '10px'}} />

                                : <i className="far fa-times" style={{marginRight: '10px'}} />
                            }
                            Email Address
                        </div>
                    </div>
                </div>
                <div className="col-md-8 col-sm-12 profile-right">
                    <h2>Hi, I'm {profile.first_name}</h2>
                    <div className="subheader-light greyPool" style={{marginBottom: '20px'}} >Joined in {profile.year_joined}</div>
                    {
                        canEdit

                        ?
                            edit

                            ?   <div className="link-btn" style={{marginBottom: '20px'}} onClick={() => setEdit(false)} >Cancel</div>

                            :   <div className="link-btn" style={{marginBottom: '20px'}} onClick={() => setEdit(true)} >Edit profile</div>

                        :   null
                    }
                    {
                        canEdit && edit

                        ?   <div style={{marginBottom: '40px', marginTop: '10px'}}>
                                <div className="input-primary" >
                                    <ErrorBox error={state.errors.update_user} />
                                    <div className="subheader-heavy">Headline</div>
                                    <input
                                        type="text"
                                        defaultValue={profile.headline}
                                        ref={headline}
                                    />
                                    <div className="subheader-heavy" style={{marginTop: '15px'}} >About</div>
                                    <textarea
                                        defaultValue={profile.story}
                                        ref={story}
                                    />
                                </div>
                                <Submit copy="Save" style={{width: '125px'}} loading={state.loading.update_user} onClick={save} />
                            </div>

                        :   <div>
                                <div className="subheader-heavy">Headline</div>
                                <div className="subheader-light greyPool" style={{marginBottom: '40px', marginTop: '10px'}}>
                                    {profile.headline}
                                </div>
                                <div className="subheader-heavy">About</div>
                                <div className="subheader-light greyPool" style={{marginBottom: '40px', marginTop: '10px'}}>
                                    {profile.story}
                                </div>
                            </div>
                    }
                    <div className="subheader-heavy">My Listings</div>
                    {boats.map(boat =>
                        <a href={`/boats/${boat.id}`} key={boat.id} >
                            <div className="profile-boat-card">
                                <img src={boat.cover_photo} />
                                <div className="pbc-title subheader-heavy">{boat.title}</div>
                            </div>
                        </a>
                    )}
                    {(canEdit || state.user.host) &&
                        <Fragment>
                            <div 
                                style={{marginTop: '40px'}} 
                                className="subheader-heavy"
                            >
                                <i className="fas fa-star" style={{marginRight: '7px'}} />
                                {profile.review_meta.count} Reviews
                            </div>
                            <Reviews reviews={profile.reviews} />
                        </Fragment>
                    }
                </div>
           </div>
        </div>
    );
}

export default withStuff(Profile,
    { 
        state: true, api: true,
        effect: ({ state, api, match }) => {
            api.setHosting(false, false);
            api.getProfile(match.params.id || state.user.id)
        },
        loader: 'profile',
    }
);
