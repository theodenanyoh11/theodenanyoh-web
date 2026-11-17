import type { Project } from '@/payload-types'

import type { ProjectTileData } from './ProjectTile'

/** Maps a project document to what a tile needs. */
export const toTileData = (project: Project): ProjectTileData => ({
  href: `/projects/${project.slug}`,
  name: project.name,
  summary: project.summary,
  tint: project.tint,
  image: project.tileImage ?? project.mainImage,
  logo: project.logo,
  stage: project.stage,
  statusLabel: project.statusLabel,
  badge: project.badge,
  sampleRows: project.sampleRows,
  sampleNote: project.sampleNote,
})

export const tileSpan = (project: Project): 4 | 6 | 8 | 12 =>
  Number(project.tileSpan ?? 4) as 4 | 6 | 8 | 12
