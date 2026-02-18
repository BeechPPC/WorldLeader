export interface Badge {
  id: string
  name: string
  icon: string
  description: string
}

interface BadgeDefinition extends Badge {
  check: (user: { totalPositionsPurchased: number; currentGlobalRank: number }) => boolean
}

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-climb',
    name: 'First Climb',
    icon: '🥾',
    description: 'Purchased your first position',
    check: (u) => u.totalPositionsPurchased >= 1,
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    icon: '⭐',
    description: 'Purchased 10 or more positions',
    check: (u) => u.totalPositionsPurchased >= 10,
  },
  {
    id: 'power-player',
    name: 'Power Player',
    icon: '💪',
    description: 'Purchased 50 or more positions',
    check: (u) => u.totalPositionsPurchased >= 50,
  },
  {
    id: 'whale',
    name: 'Whale',
    icon: '🐋',
    description: 'Purchased 100 or more positions',
    check: (u) => u.totalPositionsPurchased >= 100,
  },
  {
    id: 'top-10',
    name: 'Top 10',
    icon: '🔟',
    description: 'Reached the global top 10',
    check: (u) => u.currentGlobalRank > 0 && u.currentGlobalRank <= 10,
  },
  {
    id: 'top-3',
    name: 'Top 3',
    icon: '🏅',
    description: 'Reached the global top 3',
    check: (u) => u.currentGlobalRank > 0 && u.currentGlobalRank <= 3,
  },
  {
    id: 'world-leader',
    name: 'World Leader',
    icon: '👑',
    description: 'Reached #1 globally',
    check: (u) => u.currentGlobalRank === 1,
  },
]

export function getUserBadges(user: {
  totalPositionsPurchased: number
  currentGlobalRank: number
}): Badge[] {
  return BADGE_DEFINITIONS
    .filter((b) => b.check(user))
    .map(({ id, name, icon, description }) => ({ id, name, icon, description }))
}

export function getAllBadgeDefinitions(): Badge[] {
  return BADGE_DEFINITIONS.map(({ id, name, icon, description }) => ({
    id,
    name,
    icon,
    description,
  }))
}
