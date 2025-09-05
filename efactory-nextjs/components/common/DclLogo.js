export default function DclLogo({ className = '', title = 'DCL Logistics' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 56"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dclBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2FA4D7" />
          <stop offset="100%" stopColor="#0B5E8E" />
        </linearGradient>
      </defs>

      {/* Icon: rounded square with isometric cube */}
      <g transform="translate(0,8)">
        <rect x="0" y="0" width="40" height="40" rx="8" fill="url(#dclBlue)" />
        <path d="M12 14 L20 10 L28 14 L20 18 Z" fill="#ffffff" opacity="0.95" />
        <path d="M12 14 L20 18 L20 28 L12 24 Z" fill="#E6F2F8" />
        <path d="M28 14 L20 18 L20 28 L28 24 Z" fill="#CFE6F3" />
        <path d="M12 24 L20 28 L28 24" fill="none" stroke="#ffffff" strokeOpacity="0.6" />
      </g>

      {/* Wordmark: DCL Logistics */}
      <g transform="translate(56,12)">
        <text x="0" y="26" fontFamily="ui-sans-serif, system-ui, Segoe UI, Roboto" fontSize="24" fontWeight="600" fill="#333333" letterSpacing="1">
          DCL
        </text>
        <text x="62" y="26" fontFamily="ui-sans-serif, system-ui, Segoe UI, Roboto" fontSize="22" fontWeight="500" fill="#2FA4D7">
          Logistics
        </text>
      </g>
    </svg>
  )
}


