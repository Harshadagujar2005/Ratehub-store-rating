import React, { useState } from 'react';

const StarRating = ({ value, onChange, readOnly = false, size = '1.3rem' }) => {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? value ?? 0;

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${display >= star ? 'active' : ''}`}
          style={{ fontSize: size, cursor: readOnly ? 'default' : 'pointer' }}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(null)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
