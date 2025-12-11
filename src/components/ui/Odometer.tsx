import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface OdometerProps {
  value: number;
  className?: string;
}

export const Odometer: React.FC<OdometerProps> = ({ value, className }) => {
  const springValue = useSpring(value, {
    damping: 30,
    stiffness: 100,
    mass: 1
  });

  const displayValue = useTransform(springValue, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return <motion.span className={className}>{displayValue}</motion.span>;
};
