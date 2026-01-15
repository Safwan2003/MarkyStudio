import React from 'react';

export const Cursor: React.FC<{
    x: number;
    y: number;
    click?: boolean; // Show click effect
}> = ({ x, y, click }) => {
    return (
        <div
            className="absolute z-50 pointer-events-none drop-shadow-xl"
            style={{
                left: x,
                top: y,
                transform: `translate(-5px, -2px)` // Offset tip
            }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                    fill="#000000"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </svg>

            {click && (
                <div className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 bg-white/50 rounded-full animate-ping" />
            )}
        </div>
    );
};
