import React from 'react';
import { Tooltip } from 'react-tippy';

const InfoTooltip = ({ copy, pad=false }) => (
    <Tooltip
        title={copy}
        position= "right"
        trigger= "mouseenter"
        inertia= "true"
        transitionFlip= "true"
        delay='0'

    >
        <span>
           {pad ? <span>&nbsp;&nbsp;</span> : null}
           <i className="fas fa-info-circle icon-small" />
        </span>
    </Tooltip>
);

export default InfoTooltip;