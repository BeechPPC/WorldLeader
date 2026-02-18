import { describe, it, expect } from 'vitest'
import { getUserBadges, getAllBadgeDefinitions } from '@/lib/badges'

describe('getUserBadges', () => {
  it('returns empty badges for 0 positions and rank 0', () => {
    const badges = getUserBadges({ totalPositionsPurchased: 0, currentGlobalRank: 0 })
    expect(badges).toEqual([])
  })

  it('returns First Climb badge at 1 position', () => {
    const badges = getUserBadges({ totalPositionsPurchased: 1, currentGlobalRank: 0 })
    expect(badges).toHaveLength(1)
    expect(badges[0].id).toBe('first-climb')
  })

  it('returns Rising Star badge at 10 positions', () => {
    const badges = getUserBadges({ totalPositionsPurchased: 10, currentGlobalRank: 0 })
    const ids = badges.map(b => b.id)
    expect(ids).toContain('first-climb')
    expect(ids).toContain('rising-star')
  })

  it('returns Power Player badge at 50 positions', () => {
    const badges = getUserBadges({ totalPositionsPurchased: 50, currentGlobalRank: 0 })
    const ids = badges.map(b => b.id)
    expect(ids).toContain('power-player')
  })

  it('returns Whale badge at 100 positions', () => {
    const badges = getUserBadges({ totalPositionsPurchased: 100, currentGlobalRank: 0 })
    const ids = badges.map(b => b.id)
    expect(ids).toContain('whale')
    expect(badges).toHaveLength(4) // first-climb, rising-star, power-player, whale
  })

  it('returns Top 10 badge only when rank > 0 and <= 10', () => {
    const noRank = getUserBadges({ totalPositionsPurchased: 1, currentGlobalRank: 0 })
    expect(noRank.map(b => b.id)).not.toContain('top-10')

    const ranked = getUserBadges({ totalPositionsPurchased: 1, currentGlobalRank: 5 })
    expect(ranked.map(b => b.id)).toContain('top-10')
  })

  it('returns Top 3 badge when rank <= 3', () => {
    const badges = getUserBadges({ totalPositionsPurchased: 1, currentGlobalRank: 2 })
    const ids = badges.map(b => b.id)
    expect(ids).toContain('top-3')
    expect(ids).toContain('top-10')
  })

  it('returns World Leader badge when rank is 1', () => {
    const badges = getUserBadges({ totalPositionsPurchased: 100, currentGlobalRank: 1 })
    const ids = badges.map(b => b.id)
    expect(ids).toContain('world-leader')
    expect(ids).toContain('top-3')
    expect(ids).toContain('top-10')
    expect(badges).toHaveLength(7)
  })
})

describe('getAllBadgeDefinitions', () => {
  it('returns 7 badge definitions', () => {
    const all = getAllBadgeDefinitions()
    expect(all).toHaveLength(7)
  })

  it('each badge has id, name, icon, description', () => {
    const all = getAllBadgeDefinitions()
    for (const badge of all) {
      expect(badge).toHaveProperty('id')
      expect(badge).toHaveProperty('name')
      expect(badge).toHaveProperty('icon')
      expect(badge).toHaveProperty('description')
    }
  })
})
