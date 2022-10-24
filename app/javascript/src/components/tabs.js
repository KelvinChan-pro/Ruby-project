import React, { useState, useEffect } from 'react';
import { capitalize } from '../utils';

const Tabs = ({ tabs, defaultTab, tabClass, compClass, path, onChange, ...props }) => {
    const keys = Object.keys(tabs);
    if (!keys.includes(defaultTab))
        defaultTab = keys[0];

    const [current, setCurrent] = useState(defaultTab);

    const Current = tabs[current].child;

    useEffect(() => {
        onChange && onChange(defaultTab);
    }, []);

    useEffect(() => {

        const changeTab = () => {

            const split = window.location.pathname.split('/');
            const tab = split[split.length - 1];
            if (tab) {
                if (keys.includes(tab)) {
                    setCurrent(tab);
                } else {
                    setCurrent(keys[0]);
                }
            }
            window.removeEventListener('popstate', changeTab);

        }

        if (path) {
            window.addEventListener('popstate', changeTab);
            return () => window.removeEventListener('popstate', changeTab);
        };

    }, [current]);

    function onClick(key) {
        return () => {
            if (path)
                history.pushState({}, key,  path + '/' + key);
            setCurrent(key);
            onChange && onChange(key);
        };
    }

    return(
        <div>
            <div className={tabClass} >
                <div className="tabs">
                    {keys.map(((key, i) =>
                        <div
                            key={i}
                            className={`tab ${key === current ? 'current-tab' : null}`}
                            onClick={onClick(key)}
                        >
                            {tabs[key].icon && <i className={tabs[key].icon} style={{marginRight: '10px'}} />}
                            {tabs[key].name || capitalize(key)}
                        </div>
                    ))}
                </div>
            </div>
            <div className={compClass}>
                <Current {...props} />
            </div>
        </div>
    );
}

export default Tabs;
