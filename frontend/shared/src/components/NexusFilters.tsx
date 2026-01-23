import React from 'react';

export const NexusFilters: React.FC = () => {
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" focusable="false">
            <defs>
                <filter id="nexus-gooey">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
                    <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
                </filter>
                <filter id="nexus-grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="linear" slope="0.1" />
                        <feFuncG type="linear" slope="0.1" />
                        <feFuncB type="linear" slope="0.1" />
                    </feComponentTransfer>
                </filter>
            </defs>
        </svg>
    );
};
