import { AppBar, Toolbar, IconButton, Typography, Stack, Button, Tooltip, Box } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import type { PaletteMode } from '../App'
import logo from '../../public/LogoEnhancedV2.png';

export default function Header({ mode, onToggleMode, onLogoClick }: { mode: PaletteMode, onToggleMode: () => void, onLogoClick?: () => void }) {
  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
      <Toolbar sx={{ py: 1, gap: 1, justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1} onClick={onLogoClick} sx={{ cursor: 'pointer' }}>
          <Box
            component="img"
            src={logo}
            alt="Enhanced logo"
            sx={{ height: 28, width: 28, display: 'block', borderRadius: 1 }}
            />
          <Typography variant="h6" fontWeight={800}>Enhanced</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button href="/" color="inherit">Home</Button>
          <Button href="#projects" color="inherit">Projects</Button>
          <Button href="#contact" color="inherit">Contact</Button>
          <Tooltip title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
            <IconButton onClick={onToggleMode} color="inherit" aria-label="toggle theme">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <IconButton color="inherit" aria-label="github" href="https://github.com/" target="_blank" rel="noreferrer">
            <GitHubIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}