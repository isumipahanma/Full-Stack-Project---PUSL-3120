import React from 'react';

const Lottie = ({ options, height, width, ...props }) => {
  return React.createElement('div', {
    'data-testid': 'lottie-mock',
    style: { width, height, backgroundColor: '#f0f0f0' },
    ...props
  });
};

export default Lottie;

