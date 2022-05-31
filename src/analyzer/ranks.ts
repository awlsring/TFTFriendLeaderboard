export enum TIER_POINT {
  IRON = 0,
  BRONZE = 400 * 1,
  SILVER = 400 * 2,
  GOLD = 400 * 3,
  PLATINUM = 400 * 4,
  DIAMOND = 400 * 5,
  MASTER = 400 * 6,
  GRANDMASTER = 400 * 7,
  CHALLENGER = 400 * 8
}

export enum TIER_NAME {
  IRON = "IRON",
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
  DIAMOND = "DIAMOND",
  MASTER = "MASTER",
  GRANDMASTER = "GRANDMASTER",
  CHALLENGER = "CHALLENGER"
}

export enum RANK_POINT {
  IV = 0,
  III = 100,
  II = 200,
  I = 300
}
export enum RANK_NAME {
  I = "I",
  II = "II",
  III = "III",
  IV = "IV"
}

export interface TierRank {
  name: string
  points: number
}

export const IRON: TierRank = {
  name: TIER_NAME.IRON,
  points: TIER_POINT.IRON
}
export const BRONZE: TierRank = {
  name: TIER_NAME.BRONZE,
  points: TIER_POINT.BRONZE
}
export const SILVER: TierRank = {
  name: TIER_NAME.SILVER,
  points: TIER_POINT.SILVER
}
export const GOLD: TierRank = {
  name: TIER_NAME.GOLD,
  points: TIER_POINT.GOLD
}
export const PLATINUM: TierRank = {
  name: TIER_NAME.PLATINUM,
  points: TIER_POINT.PLATINUM
}
export const DIAMOND: TierRank = {
  name: TIER_NAME.DIAMOND,
  points: TIER_POINT.DIAMOND
}
export const MASTER: TierRank = {
  name: TIER_NAME.MASTER,
  points: TIER_POINT.MASTER
}
export const GRANDMASTER: TierRank = {
  name: TIER_NAME.GRANDMASTER,
  points: TIER_POINT.GRANDMASTER
}
export const CHALLENGER: TierRank = {
  name: TIER_NAME.CHALLENGER,
  points: TIER_POINT.CHALLENGER
}

export const I: TierRank = {
  name: RANK_NAME.I,
  points: RANK_POINT.I
}
export const II: TierRank = {
  name: RANK_NAME.II,
  points: RANK_POINT.II
}
export const III: TierRank = {
  name: RANK_NAME.III,
  points: RANK_POINT.III
}
export const IV: TierRank = {
  name: RANK_NAME.IV,
  points: RANK_POINT.IV
}

export function GetRankObject(rank: string) {
  switch (rank) {
    case RANK_NAME.I:
      return I
    case RANK_NAME.II:
      return II
    case RANK_NAME.III:
      return III
    case RANK_NAME.IV:
      return IV
    default:
      throw Error("Rank doesnt exist")
  }
}

export function GetTierObject(tier: string) {
  switch (tier) {
    case TIER_NAME.BRONZE:
      return BRONZE
    case TIER_NAME.CHALLENGER:
      return CHALLENGER
    case TIER_NAME.DIAMOND:
      return DIAMOND
    case TIER_NAME.GOLD:
      return GOLD
    case TIER_NAME.GRANDMASTER:
      return GRANDMASTER
    case TIER_NAME.IRON:
      return IRON
    case TIER_NAME.MASTER:
      return MASTER
    case TIER_NAME.PLATINUM:
      return PLATINUM
    case TIER_NAME.SILVER:
      return SILVER
    default:
      throw Error("Tier doesnt exist")
  }
}