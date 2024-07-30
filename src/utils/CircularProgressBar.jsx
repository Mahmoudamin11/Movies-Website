import React from 'react';
import '../CircularProgressBar.css';

const CircularProgressBar = ({ percentage }) => {
  const radius = 40; // radius of the circle
  const stroke = 6; // thickness of the circle
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg className='cursor-pointer trans hover:scale-105 -mt-3  ' height={radius * 2} width={radius * 2}>
            <circle
                stroke="#018749"
                fill="white"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke="#17B169"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <text 
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".8em"
                dx="-8px"
                fontSize="18px"
                fontWeight="bold"
                fill="var(--main-color)"
            >
                {`${percentage}%`}
            </text>
        </svg>
    );
};

export default CircularProgressBar;
