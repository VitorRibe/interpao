import { Box, Paper, Skeleton } from '@mui/material';
import { useTrail, animated, useSpring } from '@react-spring/web';

const AnimatedPaper = animated(Paper);
const AnimatedBox = animated(Box);

const KnowledgeTrailSkeleton: React.FC = () => {
  const headerProps = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  });

  const trail = useTrail(8, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 200, friction: 20 },
  });

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, pt: 3, px: { xs: 2, md: 4 } }}>
        {/* Header Skeleton */}
        <AnimatedPaper
          style={headerProps}
          sx={{
            p: 3, mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', lg: 'center' },
            gap: 2,
            bgcolor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(212,195,190,0.3)',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="text" width="100%" height={20} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" width={80} height={32} sx={{ borderRadius: '12px' }} />
            ))}
          </Box>
        </AnimatedPaper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: '24px',
          }}
        >
          {trail.map((style, i) => (
            <AnimatedPaper key={i} style={style} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
              <Skeleton variant="rectangular" height={160} />
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={18} />
                <Skeleton variant="text" width="60%" height={18} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="30%" height={16} />
                  <Skeleton variant="text" width="20%" height={16} />
                </Box>
              </Box>
            </AnimatedPaper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default KnowledgeTrailSkeleton;
