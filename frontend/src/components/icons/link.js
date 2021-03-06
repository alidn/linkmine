import React from 'react';

export default function LinkIcon({width = 15, height = 15, dark}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}>
      className={`fill-current ${dark ? 'text-gray-200' : 'text-gray-800'}`}
      <path d="M0 0h24v24H0z" fill={'none'} />
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  );
}
