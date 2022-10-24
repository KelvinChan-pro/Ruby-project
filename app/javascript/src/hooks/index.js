import React, { useEffect, useState } from 'react';

export function useWidth() {
	const [width, setWidth] = useState(window.innerWidth);

	useState(() => {
		window.onresize = () => {
	        setWidth(window.innerWidth);
	    };

	    return () => {
	    	window.onresize = null;
	    }
	});

	return width;
}