import { Box, Container, Skeleton, Stack, Paper } from '@mui/material';
import { useTrail, animated } from '@react-spring/web';

const AnimatedPaper = animated(Paper);

const HomeSkeleton: React.FC = () => {
  const trail = useTrail(6, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { mass: 1, tension: 280, friction: 60 },
  });

  return (
    <Container maxWidth="lg" sx={{ px: 3 }}>
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Stack spacing={2} sx={{ mb: 10, alignItems: 'center' }}>
          <Skeleton variant="text" width="60%" height={80} sx={{ borderRadius: 2 }} />
        </Stack>

        <Box 
          sx={{ 
            display: 'grid', 
            gap: 3, 
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr'
            },
            mb: 10
          }}
        >
        {trail.map((style, i) => (
          <AnimatedPaper key={i} style={style} sx={{ p: 4, borderRadius: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Skeleton variant="circular" width={64} height={64} sx={{ mb: 3 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </AnimatedPaper>
        ))}
        </Box>

        <Box sx={{ p: { xs: 5, md: 8 }, borderRadius: 8, border: '1px solid #eee' }}>
          <Skeleton variant="text" width="50%" height={48} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
        </Box>
      </Box>
    </Container>
  );
};

export default HomeSkeleton;
