import React from 'react';

function Illustration(props) {
  return (
    <svg
      width={486}
      height={534}
      viewBox="0 0 486 534"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Glowing circle */}
      <circle
        cx={167}
        cy={60}
        r={60}
        fill="url(#gradientGlow)"
        filter="url(#glow)"
      />

      {/* Technology elements */}
      <g className="tech-elements">
        {/* Code brackets */}
        <path
          d="M120 180L90 210L120 240"
          stroke="#61DAFB"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M200 180L230 210L200 240"
          stroke="#61DAFB"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data nodes */}
        <circle cx={37.5} cy={215.5} r={15} fill="url(#dataNodeGradient)" />
        <circle cx={87.5} cy={315.5} r={8} fill="url(#dataNodeGradient)" opacity="0.7" />
        <circle cx={157.5} cy={275.5} r={12} fill="url(#dataNodeGradient)" opacity="0.8" />
        <circle cx={227.5} cy={335.5} r={10} fill="url(#dataNodeGradient)" opacity="0.6" />

        {/* Connection lines */}
        <path
          d="M37.5 215.5L87.5 315.5L157.5 275.5L227.5 335.5"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="5,5"
          strokeLinecap="round"
        />
      </g>

      {/* Main shape */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M486 144.469c-38.145-31.86-87.255-51.033-140.842-51.033-121.415 0-219.842 98.427-219.842 219.842 0 14.167 1.34 28.02 3.9 41.441 47.414-86.154 91.678-142.17 146.717-170.767 56.069-29.132 121.816-29.08 210.067-6.68v-32.803zm0 48.288v289.33c-38.145 31.86-87.255 51.033-140.842 51.033-100.321 0-184.947-67.197-211.325-159.037l1.502.805c49.937-93.22 94.046-149.844 147.514-177.625 52.014-27.025 114.411-27.498 203.151-4.506z"
        fill="url(#mainGradient)"
      />

      {/* Digital circuit lines */}
      <g className="circuit-lines">
        <path
          d="M400 200L450 200L450 250"
          stroke="#00ADB5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M420 220L420 280L380 280"
          stroke="#00ADB5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M380 310L450 310L450 380"
          stroke="#00ADB5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={420} cy={220} r={3} fill="#00ADB5" />
        <circle cx={380} cy={280} r={3} fill="#00ADB5" />
        <circle cx={450} cy={310} r={3} fill="#00ADB5" />
      </g>

      {/* Binary data */}
      <g className="binary-data" opacity="0.5">
        <text x="330" y="180" fill="#61DAFB" fontSize="10">01001</text>
        <text x="360" y="195" fill="#61DAFB" fontSize="10">10110</text>
        <text x="390" y="210" fill="#61DAFB" fontSize="10">01101</text>
        <text x="350" y="225" fill="#61DAFB" fontSize="10">10010</text>
      </g>

      {/* Pulse animation */}
      <circle cx={345} cy={260} r={40} fill="url(#pulseGradient)" opacity="0.2">
        <animate
          attributeName="r"
          values="30;50;30"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.1;0.3;0.1"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Definitions for gradients and filters */}
      <defs>
        <linearGradient id="gradientGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D7F484" />
          <stop offset="100%" stopColor="#61DAFB" />
        </linearGradient>

        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ADB5" />
          <stop offset="100%" stopColor="#61DAFB" />
        </linearGradient>

        <linearGradient id="dataNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#61DAFB" />
          <stop offset="100%" stopColor="#00ADB5" />
        </linearGradient>

        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#61DAFB" />
          <stop offset="100%" stopColor="#00ADB5" />
        </linearGradient>

        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ADB5" />
          <stop offset="100%" stopColor="#61DAFB" />
        </linearGradient>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export default Illustration;