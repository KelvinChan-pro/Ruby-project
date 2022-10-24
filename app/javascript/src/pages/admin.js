import React, { useMemo, useState } from 'react';
import { Table, Tabs, CustomCancellationPolicy } from '../components';
import { boatTypes } from '../params';
import { withStuff } from '../hocs';

const lakeSchema = {
    name: {
        textAlign: 'left',
        link: true,
    },
    approved: {
        textAlign: 'center',
        defaultSort: true,
        children: ({ datum }) => (
            <div>
                {
                    datum.approved

                    ?   <i className="fas fa-check-circle greenPool" />

                    :   <i className="fas fa-times-circle redPool" />
                }
            </div>
        ),
    },
    lat: {
        textAlign: 'left',
    },
    lng: {
        textAlign: 'left',
    },
};

const marinaSchema = {
    name: {
        textAlign: 'left',
        link: true
    },
    approved: {
        textAlign: 'center',
        defaultSort: true,
        children: ({ datum }) => (
            <div>
                {
                    datum.approved

                    ?   <i className="fas fa-check-circle greenPool" />

                    :   <i className="fas fa-times-circle redPool" />
                }
            </div>
        ),
    },
    boat_count: {
        label: 'Boats',
    },
    lake_name: {
        textAlign: 'left',
        label: 'Lake',
        children: ({ datum }) => (
            <a href={`/admin/lakes/${datum.lake.id}`}>{datum.lake.name}</a>
        ),
    },
    address: {
        textAlign: 'center',
    },
    city: {
        textAlign: 'right',
    },
    state: {
        textAlign: 'right',
    },
    lat: {
        textAlign: 'right',
    },
    lng: {
        textAlign: 'right',
    }
};

const discountsSchema = {
    code: {},
    string: {
        textAlign: 'center',
        label: 'Percentage',
    },
    admin: {
        textAlign: 'right',
    },
};

const ambassadorSchema = {
    email: {
        link: true,
    },
    name: {
        label: 'Name',
        link: true,
    },
    uid: {
        label: 'Id'
    },
    guest_count: {
        label: 'Guests',
        textAlign: 'center',
    },
    host_count: {
        label: 'Hosts',
        textAlign: 'center',
    },
    booking_count: {
        label: 'Bookings',
        textAlign: 'center',
    },
    guest_bookings_sum: {
        label: 'Guest Earnings',
        usd: true,
        textAlign: 'right',
    },
    host_bookings_sum: {
        label: 'Host Earnings',
        usd: true,
        textAlign: 'right',
    },
    guest_link: {
        label: ' ',
        textAlign: 'right',
        children: ({ datum }) => (
            <a href={datum.guest_link}>Guest link</a>
        ),
    },
    host_link: {
        label: ' ',
        textAlign: 'right',
        children: ({ datum }) => (
            <a href={datum.host_link}>Host Link</a>
        ),
    },
};



const Admin = ({ match, api, state }) => {
    const [userTerm, setUserTerm] = useState(null);
    const [boatTerm, setBoatTerm] = useState(null);

    const boatSchema = {
        created: {
            label: 'Created',
            textAlign: 'left',
        },
        user: {
            textAlign: 'left',
            children: ({ datum }) => (
                <a href={`/profile/${datum.user_id}`}>{datum.user}</a>
            ),
        },
        completed: {
            textAlign: 'center',
            children: ({ datum }) => (
                <div>
                    {
                        datum.completed

                        ?   <i className="fas fa-check-circle greenPool" />

                        :   <i className="fas fa-times-circle redPool" />
                    }
                </div>
            ),
        },
        onboard_steps_completed: {
            label: 'Steps / 16',
        },
        email: {
            textAlign: 'left',
            children: ({ datum }) => (
                <a href={`mailto:${datum.email}`}>{datum.email}</a>
            ),
        },
        boat_type: {
            label: 'Type',
            textAlign: 'left',
            children: ({ datum }) => (
                <div>{boatTypes[datum.boat_type]}</div>
            ),
        },
        locations: {
            textAlign: 'left',
            children: ({ datum }) => (
                <div>
                    {(datum.locations || []).map((location, i) =>
                        <div  key={i}>
                            <a href={`/admin/marinas/${location.marina_id}`}>{location.marina_name}</a> - <a href={`/admin/lakes/${location.lake_id}`}>{location.lake_name}</a>
                        </div>
                    )}
                </div>
            ),
        },
        insurance: {
            textAlign: 'center',
            children: ({ datum }) => (
                <div>
                    {
                        datum.insurance

                        ?   <i className="fas fa-check-circle greenPool" />

                        :   <i className="fas fa-times-circle redPool" />
                    }
                </div>
            ),
        },
        edit: {
            label: '  ',
            textAlign: 'right',
            children: ({ datum }) => (
                <a href={`/boats/${datum.user_id}/edit/listings`}>Edit</a>
            ),
        },
        view: {
            label: '  ',
            textAlign: 'right',
            children: ({ datum }) => (
                <a href={`/boats/${datum.id}`}>View</a>
            ),
        },
        custom_cancellation_policy: {
            label: ' ',
            textAlign: 'right',
            children: ({ datum }) => (
                <CustomCancellationPolicy
                    key={datum.id}
                    id={datum.id}
                    custom_cancellation_policy={datum.custom_cancellation_policy}
                >
                    {({ setShow }) =>
                        <div
                            className="link-btn"
                            onClick={() => setShow(true)}
                        >
                            Cancellation Policy
                        </div>
                    }
                </CustomCancellationPolicy>
            )
        },
    };

    const userSchema = {
        created: {},
        type: {}, 
        email: {
            link: true,
        },
        full_name: {
            label: 'Name',
            link: true,
        },
        hear_about_us: {
            label: 'Heard About Us',
            textAlign: 'right',
        },
        account: {
            label: ' ',
            textAlign: 'right',
            children: ({ datum }) => (
                <a href={`/admin/users/${datum.id}`}>Account</a>
            ),
        },
        is_ambassador: {
            label: ' ',
            textAlign: 'right',
            children: ({ datum }) => (
                <div>
                    {
                        !!datum.is_ambassador

                        ?   <div
                                className="link-btn"
                                onClick={() => api.destroyAmbassador(datum.id)}
                            >
                                Remove ambassor
                            </div>

                        :  <div
                                className="link-btn"
                                onClick={() => api.makeAmbassador(datum.id)}
                            >
                                Make ambassor
                            </div>
                    }
                </div>
            )
        },
    }

    const giftsSchema = {
        user: {},
        gift_type: {
            label: 'Gift',
        },
        size: {},
        full_address: {
            label: 'Address',
            textAlign: 'right',
        },
        shipped: {
            textAlign: 'center',
            label: 'Shipped',
            children: ({ datum }) => (
                <div>
                    {
                        datum.shipped

                        ?   <i 
                                className="fas fa-check-circle greenPool pointer"
                                onClick={() => api.updateGift(datum.id, { shipped: false })}
                            />

                        :   <i 
                                className="fas fa-times-circle redPool pointer"
                                onClick={() => api.updateGift(datum.id, { shipped: true })}
                            />
                    }
                </div>
            )
        }
    };

    async function updateCelebBoat({ boat_id }, params) {
        const res = await api.updateBoat(boat_id, params);
        if (res) api.getCelebs();
    };

    const celebSchema = {
        title: {},
        created: {},
        email: {
            link: true,
        },
        name: {
            link: true,
        },
        approve: {
            label: ' ',
            textAlign: 'right',
            children: ({ datum }) => (
                datum.celebrity

                ?   null

                :   <button 
                        className="btn-secondary-teal"
                        onClick={() => updateCelebBoat(datum, { celebrity: true, celebrity_requested: false })}
                    >
                        Approve
                    </button>
            )
        },
        decline: {
            label: ' ',
            textAlign: 'left',
            children: ({ datum }) => (
                datum.celebrity

                ?   <button 
                        className="btn-secondary-teal"
                        onClick={() => updateCelebBoat(datum, { celebrity: false })}
                    >
                        Remove
                    </button>

                :   <button 
                        className="btn-secondary-teal"
                        onClick={() => updateCelebBoat(datum, { celebrity: false, celebrity_requested: false })}
                    >
                        Delcine
                    </button>
            )
        }
    };

    async function approveProHopper({ boat_id }, params) {
        let res = false;
        if (params.pro_hopper_approved) {
            res = await api.updateBoat(boat_id, params);
        } else {
            res = await api.destroyBoat(boat_id);
        };
        if (res) api.getAdminIndex('pro_hoppers');
    };

    const proHopperSchema = {
        created: {},
        email: {
            link: true,
        },
        name: {
            link: true,
        },
        approve: {
            label: ' ',
            textAlign: 'right',
            children: ({ datum }) => (
                datum.pro_hopper_approved

                ?   null

                :   <button 
                        className="btn-secondary-teal"
                        onClick={() => approveProHopper(datum, { pro_hopper_approved: true, celebrity: true })}
                    >
                        Approve
                    </button>
            )
        },
        decline: {
            label: ' ',
            textAlign: 'left',
            children: ({ datum }) => (
                datum.pro_hopper_approved

                ?   <button 
                        className="btn-secondary-teal"
                        onClick={() => approveProHopper(datum, { pro_hopper_approved: false })}
                    >
                        Remove
                    </button>

                :   <button 
                        className="btn-secondary-teal"
                        onClick={() => approveProHopper(datum, { pro_hopper_approved: false })}
                    >
                        Delcine
                    </button>
            )
        }
    };

    return(
        <Tabs
            tabClass="nav-secondary"
            compClass="container"
            path="/admin"
            defaultTab={match.params.tab}
            onChange={tab => {
                if (!state[tab].length) {
                    api.getAdminIndex(tab);
                }
            }}
            tabs={{
                users: useMemo(() => ({
                    name: 'Users',
                    icon: 'fal fa-users',
                    child: () => {
                        return(
                            <div style={{marginTop: '20px'}} >
                                <h2>Users ({state.user_count})</h2>
                                <Table
                                    schema={userSchema} 
                                    data={state.users} 
                                    onLinkClick={(id) =>  window.location.href = `/profile/${id}`}
                                    reverseSort={true} 
                                    fetchMore={({ offset }) => !userTerm && api.getAdminIndex('users', offset, userTerm)}
                                    onSearch={(v) => {
                                        api.getAdminIndex('users', 0, v);
                                        setUserTerm(v);
                                    }}
                                    term={userTerm}
                                />
                            </div>
                        );
                    },
                }), [ state.users ]),
                boats: useMemo(() => ({
                    name: 'Boats',
                    icon: 'fal fa-ship',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <h2>Boats ({state.boat_count})</h2>
                            <Table 
                                schema={boatSchema} 
                                data={state.boats} 
                                onLinkClick={(id) =>  window.location.href = `/admin/marinas/${id}`}
                                reverseSort={true} 
                                fetchMore={({ offset }) => !boatTerm && api.getAdminIndex('boats', offset, boatTerm)}
                                onSearch={(v) => {
                                    api.getAdminIndex('boats', 0, v);
                                    setBoatTerm(v);
                                }}
                                term={boatTerm}
                            />
                        </div>
                    ),
                }), [ state.boats ]),
                lakes: {
                    name: 'Lakes',
                    icon: 'fal fa-water',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <div className="flex-between">
                                <h2>Lakes ({state.lakes.length})</h2>
                                <a className="btn-primary" href="/admin/lakes/new">
                                    New Lake
                                </a>
                            </div>
                            <Table 
                                schema={lakeSchema} 
                                data={state.lakes} 
                                onLinkClick={(id) =>  window.location.href = `/admin/lakes/${id}`}
                                onDestroy={api.destroyLake}
                                destroyCondition={({ boat_count }) => !boat_count}
                            />
                        </div>
                    ),
                },
                states: {
                    name: 'States',
                    icon: 'fal fa-flag-usa',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <h2>States</h2>
                            <Table 
                                schema={lakeSchema} 
                                data={state.states} 
                                onLinkClick={(id) =>  window.location.href = `/admin/lakes/${id}`} 
                            />
                        </div>
                    ),
                },
                marinas: {
                    name: 'Marinas',
                    icon: 'fal fa-anchor',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <div className="flex-between">
                                <h2>Marinas ({state.marinas.length})</h2>
                                <a className="btn-primary" href="/admin/marinas/new">
                                    New Marina
                                </a>
                            </div>
                            <Table 
                                schema={marinaSchema} 
                                data={state.marinas} 
                                onLinkClick={(id) =>  window.location.href = `/admin/marinas/${id}`}
                                onDestroy={api.destroyMarina}
                            />
                        </div>
                    ),
                },
                ambassadors: {
                    name: 'Ambassadors',
                    icon: 'fal fa-megaphone',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <h2>Ambassadors ({state.ambassadors.length})</h2>
                            <Table 
                                schema={ambassadorSchema} 
                                data={state.ambassadors}
                                onDestroy={api.destroyAmbassador}
                            />
                        </div>
                    ),
                },
                celebs: {
                    name: 'Celebs',
                    icon: 'fal fa-star',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <h2>Celebs ({state.celebs.length})</h2>
                            <Table 
                                schema={celebSchema} 
                                data={state.celebs} 
                                onLinkClick={(id) =>  window.location.href = `/profile/${id}`}
                            />
                        </div>
                    ),
                },
                pro_hoppers: {
                    name: 'Pro Hoppers',
                    icon: 'fal fa-badge-check',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <h2>Pro Hoppers ({state.pro_hoppers.length})</h2>
                            <Table 
                                schema={proHopperSchema} 
                                data={state.pro_hoppers} 
                                onLinkClick={(id) =>  window.location.href = `/profile/${id}`}
                            />
                        </div>
                    ),
                },
                discounts: {
                    name: 'Discounts',
                    icon: 'fal fa-gift',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <div className="flex-between">
                                <h2>Discounts</h2>
                                <a className="btn-primary" href="/admin/discounts/new">
                                    New Discount
                                </a>
                            </div>
                            <Table 
                                schema={discountsSchema} 
                                data={state.discounts}
                                onDestroy={api.destroyDiscount}
                            />
                        </div>
                    ),
                },
                gifts: {
                    name: 'Gifts',
                    icon: 'fal fa-gift',
                    child: () => (
                        <div style={{marginTop: '20px'}} >
                            <h2>Gifts</h2>
                            <Table 
                                schema={giftsSchema} 
                                data={state.gifts} 
                            />
                        </div>
                    ),
                },
            }}
        />
    );
};

export default withStuff(Admin,
    {
        api: true,
        state: true,
        error: { clearable: false },
    }
);
