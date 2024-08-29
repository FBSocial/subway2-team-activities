import React from 'react';

export default function Button({
  loading,
  children,
  ...props
}: {
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props}>
      {loading ? (
        <svg
          viewBox="0 0 24 24"
          width={24}
          height={24}
          className={'m-auto animate-spin text-white'}
        >
          <defs>
            <linearGradient
              id="a"
              y2="3.277%"
              x2="106.665%"
              y1="3.277%"
              x1="-3.887%"
            >
              <stop offset="0%" stopOpacity=".6" stopColor="currentColor" />
              <stop offset="100%" stopColor="currentColor" />
              <stop offset="100%" stopColor="#979797" />
            </linearGradient>
            <linearGradient
              id="b"
              y2="3.277%"
              x2="107.374%"
              y1="3.277%"
              x1="-3.887%"
            >
              <stop offset="0%" stopOpacity=".6" stopColor="currentColor" />
              <stop offset="100%" stopOpacity="0" stopColor="currentColor" />
              <stop offset="100%" stopColor="#979797" />
            </linearGradient>
          </defs>
          <g fillRule="evenodd" fill="none">
            <path d="M0 24h24V0H0z" />
            <path
              strokeWidth="2"
              stroke="url(#a)"
              d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10"
            />
            <path
              transform="matrix(1 0 0 -1 0 14)"
              strokeWidth="2"
              stroke="url(#b)"
              d="M2 2c0 5.523 4.477 10 10 10S22 7.523 22 2"
            />
            <path
              data-follow-fill="currentColor"
              fillRule="nonzero"
              fill="currentColor"
              d="M22 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
            />
          </g>
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
