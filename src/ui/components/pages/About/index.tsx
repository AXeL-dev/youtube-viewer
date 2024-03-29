import React from 'react';
import { Layout, Logo } from 'ui/components/shared';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Link,
} from '@mui/material';
import Credit from './Credit';
import SocialLink from './SocialLink';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import ForumIcon from '@mui/icons-material/Forum';

interface AboutProps {}

export function About(props: AboutProps) {
  return (
    <Layout>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? '#f4f4f4' : 'transparent',
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
            <Typography
              sx={{ fontSize: '1.25rem', mb: 1 }}
              variant="h5"
              color="text.primary"
            >
              YouTube viewer
            </Typography>
            <Credit author="AXeL" />
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'grey.800' : 'grey.100',
                mt: 4,
              }}
            >
              <SocialLink
                tooltip="Gmail"
                href="mailto:contact.axel.dev@gmail.com"
              >
                <MailIcon />
              </SocialLink>
              <SocialLink
                tooltip="Discord"
                href="https://discord.gg/rpD4fgxBgj"
              >
                <ForumIcon />
              </SocialLink>
              <SocialLink
                tooltip="Github"
                href="https://github.com/AXeL-dev/youtube-viewer"
              >
                <GitHubIcon />
              </SocialLink>
            </Box>
          </CardContent>
          <CardActions sx={{ borderTop: 1, borderColor: 'divider', px: 1.5 }}>
            <Link
              sx={{ textDecoration: 'none' }}
              href="https://www.paypal.me/axeldev"
              target="_blank"
              rel="noopener"
            >
              <Button
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  textTransform: 'capitalize',
                }}
                size="small"
                color="secondary"
              >
                Donate
              </Button>
            </Link>
          </CardActions>
          <CardActions sx={{ borderTop: 1, borderColor: 'divider', px: 1.5 }}>
            <Link
              sx={{ textDecoration: 'none' }}
              href="https://github.com/AXeL-dev/youtube-viewer/graphs/contributors"
              target="_blank"
              rel="noopener"
            >
              <Button
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  textTransform: 'capitalize',
                }}
                size="small"
                color="secondary"
              >
                Contributors
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Box>
    </Layout>
  );
}
