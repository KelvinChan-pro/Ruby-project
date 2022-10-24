import React from 'react';
import { states, lakeConfig, } from './utils';

export const boatTypes = {
   wake_boat: 'Wake Boat',
   pontoon: 'Pontoon',
   cabin_cruiser: 'Cabin Cruiser',
   fishing_boat: 'Fishing Boat',
   ski_boat: 'Ski Boat',
   deck_boat: 'Deck Boat',
   jet_boat: 'Jet Boat',
   personal_watercraft: 'Personal Watercraft',
   bow_rider_boat: 'Bow Rider Boat',
   house_boat: 'House Boat',
   air_boat: 'Air Boat',
   yacht: 'Yacht',
   performance_boat: 'Performance Boat',
};

export function userParams(user={}) {
    return [
        {
            label: 'First Name',
            type: 'text',
            key: 'first_name',
            defaultValue: user.first_name,
        },
        {
            label: 'Last Name',
            type: 'text',
            key: 'last_name',
            defaultValue: user.last_name,
        },
        {
            label: 'Email',
            type: 'email',
            key: 'email',
            defaultValue: user.email,
        },
        {
            label: 'Phone Number',
            type: 'text',
            key: 'phone_number',
            defaultValue: user.phone_number,
        }
    ]
};

export function guestBoatParams(boat={}) {
    return [
        {
            label: 'Boat Type',
            type: 'select',
            key: 'boat_type',
            name: 'boat_type',
            defaultValue: boat.boat_type,
            options: boatTypes,
            editShow: true,
        },
        {
            label: 'Year',
            type: 'text',
            key: 'year',
            defaultValue: boat.year,
            col: '6',
            editShow: true,
        },
        {
            label: 'Make',
            type: 'text',
            key: 'make',
            defaultValue: boat.make,
            col: '6',
            editShow: true,
        },
        {
            label: 'Model',
            type: 'text',
            key: 'model',
            defaultValue: boat.model,
            editShow: true,
            col: '6',
        },
        {
            label: 'Length',
            type: 'number',
            key: 'length',
            defaultValue: boat.length,
            col: '6',
        }
    ];
};

export function guestLocationParams(marina={}) {
    return [
        {
            label: 'Lake',
            placeholder: 'Enter lake name',
            key: 'lake_name',
            name: 'lake_name',
            type: 'text',
            defaultValue: marina.lake_name,
        },
        {
            label: 'Address',
            placeholder: 'Enter marina address',
            key: 'address',
            name: 'address',
            type: 'text',
            defaultValue: marina.address,
        },
        {
            label: 'City/Town',
            type: 'text',
            key: 'city',
            name: 'city',
            placeholder: 'Enter city',
            defaultValue: marina.city,
            col: '6',
        },
        {
            label: 'State',
            type: 'select',
            key: 'state',
            name: 'state',
            placeholder: 'Select state',
            options: states,
            defaultValue: marina.state,
            col: '6',
        },
        {
            label: 'Zip',
            placeholder: 'Enter zip',
            key: 'zip',
            name: 'zip',
            type: 'text',
            defaultValue: marina.zip,
            col: '6',
        }
    ];
};

export function specificationsParams(boat={}) {
    return [
        {
            label: 'Boat Type',
            type: 'select',
            key: 'boat_type',
            name: 'boat_type',
            defaultValue: boat.boat_type,
            options: boatTypes,
            editShow: true,
        },
        {
            label: 'Year',
            type: 'text',
            key: 'year',
            defaultValue: boat.year,
            col: '6',
            editShow: true,
        },
        {
            label: 'Make',
            type: 'text',
            key: 'make',
            defaultValue: boat.make,
            col: '6',
            editShow: true,
        },
        {
            label: 'Model',
            type: 'text',
            key: 'model',
            defaultValue: boat.model,
            editShow: true,
        },
        {
            label: 'Length',
            type: 'number',
            key: 'length',
            defaultValue: boat.length,
            col: '6',
        },
        {
            label: 'Guest Count',
            type: 'number',
            key: 'guest_count',
            defaultValue: boat.guest_count,
            col: '6',
            editShow: true,
            editSuffix: ' Guests',
        },
        {
            label: 'Rideshare or Rental?',
            type: 'radio',
            key: 'rental',
            name: 'rental',
            defaultValue: (boat.rental || 0).toString(),
            labels: {
                0: 'Rideshare',
                1: 'Rental',
            },
            editShow: true,
            options: {
                0: () => (
                    <div>
                        <div className="subheader-heavy">Rideshare</div>
                        <div className="small-light">You will operate your own boat.</div>
                    </div>
                ),
                1: () => (
                    <div>
                        <div className="subheader-heavy">Rental</div>
                        <div className="small-light">The renter will operate your boat.</div>
                    </div>
                ),
            }
        }
    ]
};

export function locationParams(boat={}, { marinas, lakes }, onLakeChange, lake) {
    return [
        {
            label: 'Select a Lake',
            type: 'select',
            key: 'lake_id',
            name: 'lake_id',
            defaultValue: boat.lake && boat.lake.id,
            placeholder: 'Select Lake',
            options: lakes,
            onChange: onLakeChange,
            editShow: true,
        },
        {
            label: 'Select a Marina / Boat ramp',
            type: 'select',
            key: 'marina_id',
            name: 'marina_id',
            defaultValue: boat.marina && boat.marina.id,
            placeholder: 'Select Marina',
            options: marinas[lake] || {},
            editShow: true,
        },
    ]
};

export function newMarinaParams(lakes, lake_id=null, index=null) {
    return [
        {
            type: 'hidden',
            name: 'new_marina',
            defaultValue: '1',
        },
        {
            type: 'hidden',
            name: 'index',
            defaultValue: index,
        },
        {
            label: 'Select an existing Lake',
            type: 'select',
            key: 'lake_id',
            name: 'lake_id',
            defaultValue: lake_id,
            placeholder: 'Select Lake',
            options: lakes,
        },
        {
            label: 'Or add a new Lake',
            placeholder: 'Enter lake name',
            key: 'lake_name',
            name: 'lake_name',
            type: 'text',
        },
        {
            label: 'Marina Name',
            placeholder: 'Enter marina / boat ramp name',
            key: 'name',
            name: 'name',
            type: 'text',
        },
        {
            label: 'Marina Address',
            placeholder: 'Enter marina address',
            key: 'address',
            name: 'address',
            type: 'text',
        },
        {
            label: 'Address Line Two',
            key: 'address_two',
            name: 'address_two',
            type: 'text',
        },
        {
            label: 'City/Town',
            type: 'text',
            key: 'city',
            name: 'city',
            placeholder: 'Enter city',
            col: '6',
        },
        {
            label: 'State',
            type: 'select',
            key: 'state',
            name: 'state',
            placeholder: 'Select state',
            options: states,
            col: '6',
        },
        {
            label: 'Zip',
            placeholder: 'Enter zip',
            key: 'zip',
            name: 'zip',
            type: 'text',
        },
    ];
};

export function marinaParams(marina={}) {
    return [
        {
            label: 'Name',
            placeholder: 'Enter marina name',
            key: 'name',
            name: 'name',
            type: 'text',
            defaultValue: marina.name,
        },
        {
            label: 'Marina Address',
            placeholder: 'Enter marina address',
            key: 'address',
            name: 'address',
            type: 'text',
            defaultValue: marina.address,
        },
        {
            label: 'City/Town',
            type: 'text',
            key: 'city',
            name: 'city',
            placeholder: 'Enter city',
            defaultValue: marina.city,
        },
        {
            label: 'State',
            type: 'select',
            key: 'state',
            name: 'state',
            placeholder: 'Select state',
            options: states,
            defaultValue: marina.state,
        },
        {
            label: 'Zip',
            placeholder: 'Enter zip',
            key: 'zip',
            name: 'zip',
            type: 'text',
            defaultValue: marina.zip,
        },
        {
            label: 'Approved',
            type: 'radio',
            key: 'approved',
            name: 'approved',
            options: {
                0: 'No',
                1: 'Yes',
            },
            defaultValue: marina.approved ? '1' : '0',
        }
    ];
};

export function lakeParams(lake={}, onLakeChange=null) {
    return [
        {
            label: 'Name',
            placeholder: 'Enter lake name',
            key: 'name',
            name: 'name',
            type: 'text',
            defaultValue: lake.name,
            onChange: onLakeChange,
        },
        (
            lake.id

            ?   {
                    label: 'Approved',
                    type: 'radio',
                    key: 'approved',
                    name: 'approved',
                    options: {
                        0: 'No',
                        1: 'Yes',
                    },
                    defaultValue: lake.approved ? '1' : '0',
                }

            :   {
                    type: 'hidden',
                    key: 'approved',
                    name: 'approved',
                    defaultValue: '1',
                }
        )
    ];
};

export function externalAccountParams() {
    return [
        {
            type: 'text',
            label: 'Account Holder Name',
            placeholder: 'Account Holder Name',
            key: 'account_holder_name',
        },
        {
            type: 'text',
            label: 'Routing Number',
            placeholder: 'Enter Routing Number',
            key: 'routing_number',
            col: '6',
        },
        {
            type: 'text',
            label: 'Confirm Routing Number',
            placeholder: 'Enter Routing Number',
            key: 'routing_number_copy',
            col: '6',
        },
        {
            type: 'text',
            label: 'Account Number',
            placeholder: 'Enter Account Number',
            key: 'account_number',
            col: '6',
        },
        {
            type: 'text',
            label: 'Confirm Account Number',
            placeholder: 'Enter Account Number',
            key: 'account_number_copy',
            col: '6',
        },
    ]
};

export function identityParams(user={}) {
    return [
        {
            type: 'date',
            name: 'date_of_birth',
            key: 'date_of_birth',
            label: 'Date of Birth',
            defaultValue: user.date_of_birth,
        },
        {
            type: 'text',
            name: 'phone_number',
            key: 'phone_number',
            label: 'Phone Number',
            placeholder: 'Enter phone number',
            defaultValue: user.phone_number,
        },
        {
            label: 'Social Security Number',
            placeholder: '123-45-6789',
            key: 'ssn',
            name: 'ssn',
            type: 'text',
            defaultValue: user.ssn,
        },
        {
            label: 'Address',
            placeholder: 'Enter address',
            key: 'address',
            name: 'address',
            type: 'text',
            defaultValue: user.address,
        },
        {
            label: 'Address Line Two',
            key: 'address_two',
            name: 'address_two',
            type: 'text',
            defaultValue: user.address_two,
        },
        {
            label: 'City/Town',
            type: 'text',
            key: 'city',
            name: 'city',
            placeholder: 'Enter city',
            col: '6',
            defaultValue: user.city,
        },
        {
            label: 'State',
            type: 'select',
            key: 'state',
            name: 'state',
            placeholder: 'Select state',
            options: states,
            col: '6',
            defaultValue: user.state,
        },
        {
            label: 'Zip',
            placeholder: 'Enter zip',
            key: 'zip',
            name: 'zip',
            type: 'text',
            defaultValue: user.zip,
        }
    ];
};

export function addressParams(object={}) {
    return [
        {
            label: 'Address',
            placeholder: 'Enter address',
            key: 'address',
            name: 'address',
            type: 'text',
            defaultValue: object.address,
        },
        {
            label: 'Address Line Two',
            key: 'address_two',
            name: 'address_two',
            type: 'text',
            defaultValue: object.address_two,
        },
        {
            label: 'City/Town',
            type: 'text',
            key: 'city',
            name: 'city',
            placeholder: 'Enter city',
            col: '6',
            defaultValue: object.city,
        },
        {
            label: 'State',
            type: 'select',
            key: 'state',
            name: 'state',
            placeholder: 'Select state',
            options: states,
            col: '6',
            defaultValue: object.state,
        },
        {
            label: 'Zip',
            placeholder: 'Enter zip',
            key: 'zip',
            name: 'zip',
            type: 'text',
            defaultValue: object.zip,
        },
    ];
}


