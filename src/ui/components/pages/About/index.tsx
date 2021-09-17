import React from 'react';
import { Layout, Logo } from 'ui/components/shared';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Credit from './Credit';
import Socials from './Socials';

interface AboutProps {}

export function About(props: AboutProps) {
  return (
    <Layout>
      <Box
        sx={{
          bgcolor: 'custom.grey',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card variant="outlined">
          <CardContent
            sx={{
              pt: 6,
              pb: 12,
              px: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Logo size={60} sx={{ mb: 3 }} />
            <Typography sx={{ fontSize: '1.25rem', mb: 1 }} variant="h5" color="text.primary">
              Youtube viewer
            </Typography>
            <Credit author="AXeL" />
            <Socials sx={{ mt: 4 }} />
          </CardContent>
          <CardActions sx={{ borderTop: 1, borderColor: 'divider', px: 1.5 }}>
            <Link href="https://github.com/AXeL-dev/youtube-viewer/graphs/contributors" target="_blank" rel="noopener">
              <Button
                sx={{ fontSize: '0.875rem', fontWeight: 400, textTransform: 'capitalize' }}
                size="small"
                color="secondary"
              >
                Contributors
              </Button>
            </Link>
          </CardActions>
          <CardActions sx={{ borderTop: 1, borderColor: 'divider', px: 1.5 }}>
            <Button
              sx={{ fontSize: '0.875rem', fontWeight: 400, textTransform: 'capitalize' }}
              size="small"
              color="secondary"
            >
              Privacy policy
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Layout>
  );
}
