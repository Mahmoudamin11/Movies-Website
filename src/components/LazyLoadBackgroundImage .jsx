import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyLoadBackgroundImage = ({ src, children, style, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
    });

    const backgroundStyle = loaded
        ? { backgroundImage: `url(${src})`, ...style }
        : style;

    if (inView && !loaded) {
        const img = new Image();
        img.src = src;
        img.onload = () => setLoaded(true);
    }

    return (
        <div ref={ref} style={backgroundStyle} {...props}>
            {children}
        </div>
    );
};

export default LazyLoadBackgroundImage;
