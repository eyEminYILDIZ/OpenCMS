import { cn } from '../../lib/utils';
import React from 'react';

interface DetailCardProps {
  children: React.ReactNode;
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ children, className }) => (
  <div className={cn('detail-card', className)}>{children}</div>
);

export default DetailCard;
