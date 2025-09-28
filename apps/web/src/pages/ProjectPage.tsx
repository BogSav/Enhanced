import { useParams, Link as RouterLink } from 'react-router-dom'
import { Box, Breadcrumbs, Chip, Container, Link, Paper, Stack, Typography } from '@mui/material'

const content: Record<string, { title: string, desc: string, tags: string[] }> = {
  'quantum-hybrid-arch': { title: 'Hybrid Quantum–Classical Architecture', desc: 'Placeholder page for deep‑dive notes, diagrams, and code samples. You can replace this with your markdown or docs renderer.', tags: ['Quantum', 'Systems'] },
  'enhanced-ai-platform': { title: 'Enhanced AI Platform', desc: 'Service mesh, model gateways, embeddings, retrieval, and observability. Coming soon.', tags: ['AI', 'LLM', 'DevOps'] },
  'cnc-linking': { title: 'CNC Linking Algorithms', desc: 'Advanced toolpath research — arc trimming, leads, smoothing.', tags: ['C++', 'CNC'] },
  'unconventional-research': { title: 'Unconventional Research Blog', desc: 'Crazy ideas, careful methods. Drafts and references go here.', tags: ['Writing'] },
}

export default function ProjectPage() {
  const { slug } = useParams()
  const data = content[slug ?? '']

  if (!data) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mb: 2 }}>Project not found</Typography>
        <Link component={RouterLink} to="/">Back to Home</Link>
      </Container>
    )
  }

  return (
    <Stack spacing={3}>
      <Breadcrumbs>
        <Link component={RouterLink} to="/">Home</Link>
        <Typography color="text.primary">{data.title}</Typography>
      </Breadcrumbs>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h3" fontWeight={800}>{data.title}</Typography>
          <Stack direction="row" spacing={1}>
            {data.tags.map(t => <Chip key={t} label={t} size="small" />)}
          </Stack>
          <Typography variant="body1" color="text.secondary">{data.desc}</Typography>
          <Box sx={{ height: 280, borderRadius: 3, bgcolor: 'action.hover', display: 'grid', placeItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">Hero image / chart / code preview placeholder</Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  )
}