import React from 'react';

const RiyalSymbol = ({ className = '', style = {}, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 250"
    style={{ width: '1.3em', height: '1em', verticalAlign: 'middle', display: 'inline-block', marginLeft: 4, ...style }}
    className={className}
  >
    <path fill={color} stroke={color} strokeWidth="8" d="M70 0h30v120h40V0h30v120h60v30h-60v40h60v30h-60v60h-30v-60h-40v60h-30v-60H0v-30h70v-40H0v-30h70V0zm30 150v40h40v-40h-40z"/>
  </svg>
);

export default RiyalSymbol; 