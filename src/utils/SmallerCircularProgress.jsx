import React from 'react';
import '../CircularProgressBar.css';

const SmallCircularProgressBar = ({ percentage }) => {
  const radius = 25; // Smaller radius for the circle
  const stroke = 4; // Smaller thickness of the circle
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg className='cursor-pointer absolute top-0 left-full trans hover:scale-105 w-[50px] h-[50px] flex items-start justify-start z-40' height={radius * 2} width={radius * 2}>
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
        dy="2.8em"
        dx="-25px"
        fontSize="10px" // Smaller font size
        fontWeight="bold"
        fill="var(--main-color)"
      >
        {`${percentage}%`}
      </text>
    </svg>
  );
};

export default SmallCircularProgressBar;