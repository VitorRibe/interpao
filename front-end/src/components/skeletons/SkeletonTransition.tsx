import React, { ReactNode } from 'react';
import { useTransition, animated } from '@react-spring/web';
import { Box } from '@mui/material';

interface SkeletonTransitionProps {
  showSkeleton: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

const SkeletonTransition: React.FC<SkeletonTransitionProps> = ({ showSkeleton, skeleton, children }) => {
  const transitions = useTransition(showSkeleton, {
    from: { opacity: 0, transform: 'scale(0.98)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(1.02)' },
    config: {
      tension: 280,
      friction: 20,
    },
    // This ensures that the skeleton and children don't overlap awkwardly during the exit/enter
    exitBeforeEnter: true,
  });

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {transitions((style, item) => (
        item ? (
          <animated.div style={{ 
            ...style, 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%',
            zIndex: 1 
          }}>
            {skeleton}
          </animated.div>
        ) : (
          <animated.div style={{ 
            ...style,
            width: '100%',
            height: '100%'
          }}>
            {children}
          </animated.div>
        )
      ))}
    </Box>
  );
};

export default SkeletonTransition;
