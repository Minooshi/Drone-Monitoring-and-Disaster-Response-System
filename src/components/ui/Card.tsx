import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
}

export function Card({ children, className, title, subtitle, icon: Icon }: CardProps) {
  return (
    <div className={cn("glass-panel rounded-xl p-6", className)}>
      {(title || Icon) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && <h3 className="text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant">{title}</h3>}
            {subtitle && <p className="text-xs text-on-surface-variant mt-1">{subtitle}</p>}
          </div>
          {Icon && <Icon className="w-4 h-4 text-primary opacity-50" />}
        </div>
      )}
      {children}
    </div>
  );
}
