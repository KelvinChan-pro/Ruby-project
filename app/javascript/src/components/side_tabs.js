import React, { useState, useRef } from 'react';

const SideTabs = ({ tabs, onChange }) => {
    const sideNav = useRef();

    const [tab, setTab] = useState(0);
    const [subTab, setSubTab] = useState(0);

    const current = tabs[tab].tabs[subTab];

    function openNav() {
        sideNav.current.focus();
        sideNav.current.style.width = "70%";
        sideNav.current.style.padding = '28px';
    }

    function closeNav() {
        sideNav.current.style.width = "0";
        sideNav.current.style.padding = '0px';
    }

    function changeTab(i, ii) {
        return () => {
            setTab(i); 
            setSubTab(ii); 
            closeNav();
            onChange();
        };
    }

    function buildTabs() {
        return tabs.map((t, i) =>
            <div key={i}>
                <div className={'side-tab title-small' + (i === tab ? ' current-side-tab' : '')} >
                    {t.name}
                </div>
                <div className="side-tab-children">
                    {t.tabs.map((st, ii) =>
                        <div className={'sst subheader-light' + (ii === subTab && i === tab ? ' csst' : '')} onClick={changeTab(i, ii)} key={ii} >
                            {st.name}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return(
        <div className="flex-start">
            <div className="side-tabs non-mobile-only">
                {buildTabs()}
            </div>
            <div className="mobile-side-tabs mobile-only" ref={sideNav}>
                {buildTabs()}
            </div>
            <div className='side-tab-comp'>
                <div className="title-small flex" style={{marginBottom: '30px'}} >
                    <i onClick={openNav} className="far fa-bars blackPool mobile-only pointer" style={{marginRight: '15px'}} />
                    {current.name}
                </div>
                <div onClick={closeNav}>
                    {current.child(subTab)}
                </div>
            </div>
        </div>
    );
}

export default SideTabs;