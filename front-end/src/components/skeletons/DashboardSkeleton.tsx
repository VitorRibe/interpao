import { Box, Paper, Skeleton, Stack } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

const AnimatedPaper = animated(Paper);

const DashboardSkeleton: React.FC = () => {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 120, friction: 14 },
  });

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', display: 'flex' }}>
      <AnimatedPaper
        style={props}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf9f8 100%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 8,
          boxShadow: '0px 32px 64px -12px rgba(68, 42, 34, 0.04)',
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Skeleton 
              variant="text" 
              width="80%" 
              height={60} 
              sx={{ mx: 'auto', mb: 1, borderRadius: 2 }} 
            />
            <Skeleton 
              variant="text" 
              width="40%" 
              height={24} 
              sx={{ mx: 'auto', borderRadius: 1 }} 
            />
          </Box>
        </Stack>
      </AnimatedPaper>
    </Box>
  );
};

export default DashboardSkeleton;
