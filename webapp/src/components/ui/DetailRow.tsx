import React from 'react';

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-row-label">{label}</span>
    <span className="detail-row-value">{value}</span>
  </div>
);

export default DetailRow;
