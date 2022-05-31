import { Nerd, NerdInfo } from "../nerd/nerd";
import * as dotenv from "dotenv";
import { TftApi, } from 'twisted'
import { RegionGroups, Regions } from "twisted/dist/constants";
import { GetRankObject, GetTierObject, I, IRON, TierRank } from "./ranks";
import { LeagueEntryDTO } from "twisted/dist/models-dto/league/tft-league";
import { MatchTFTDTO } from "twisted/dist/models-dto";
dotenv.config({ path: __dirname+'../../.env' })

export interface MatchAnalyzerProps {
  nerds: NerdInfo[]
}

export interface Ranking {
  nerd: Nerd
  tier: TierRank,
  rank: TierRank,
  points: number
  totalPoints: number
  winRate: number
  matches: number
}

interface HandleBug extends LeagueEntryDTO {
  losses: number
}

interface NerdAgainstNerdPoints {
  nerd: Nerd
  points: number
}

interface NerdPointTotal extends NerdAgainstNerdPoints {
  matches: number
}

interface GetAllMatchDataResult {
  matches: string[],
  nerdPoints: NerdPointTotal[]
}

export class MatchAnalyzer {
  private client: TftApi
  readonly regionGroups: RegionGroups
  constructor() {
    this.client = new TftApi({
      key: process.env.TOKEN
    })
    this.regionGroups = RegionGroups.AMERICAS
  }

  async GetAllMatchData(nerds: Nerd[], matchFilter: string[]): Promise<GetAllMatchDataResult> {
    const all: string[] = []
    for (const nerd of nerds) {
      let matches = await this.getMatches(nerd)
      all.push(...matches)
    }

    const duplicates = all.filter(function(value,index,self){ return (self.indexOf(value) !== index )})
    const filtered = duplicates.filter(d => {
      return !matchFilter.includes(d)
    })
    const matchesDetails = []
    for (const match of filtered) {
      try {
        let details = await this.getMatchDetails(match)
        matchesDetails.push(details)
      } catch (e) {
        console.log(`Error getting details on match: ${match}`)
        continue
      }
    }

    const crunchPromises: Promise<NerdAgainstNerdPoints[]>[] = []
    for (let m of matchesDetails) {
      crunchPromises.push(this.crunchMatchData(nerds, m))
    }

    const crunchedData = await Promise.all(crunchPromises)

    const nerdPlacements = new Map<string, NerdPointTotal>()
    crunchedData.forEach((result, i) => {
      result.forEach(r => {
        if (nerdPlacements.has(r.nerd.puuid)) {
          let point = nerdPlacements.get(r.nerd.puuid)!
          point.points = r.points + point.points
          point.matches = point.matches + 1
          nerdPlacements.set(r.nerd.puuid, point)
        } else {
          nerdPlacements.set(r.nerd.puuid, {
            ...r,
            matches: 1
          })
        }
      })
    })

    const nerdPointTotals = Array.from(nerdPlacements.values())
    return {
      matches: filtered,
      nerdPoints: nerdPointTotals,
    }
  }

  async BuildNerdDetails(nerds: NerdInfo[]): Promise<Nerd[]> {
    const newNerds: Nerd[] = []
    for (const n of nerds) {
      const summoner = await this.client.Summoner.getByName(n.name, n.region as Regions)
      let newNerd = {
        ...n,
        puuid: summoner.response.puuid,
        summonerId: summoner.response.id
      }
      newNerds.push(newNerd)
    }
    return newNerds
  }

  private async getMatches(nerd: Nerd): Promise<string[]> {
    const matches = await this.client.Match.list(nerd.puuid, this.regionGroups)
    return matches.response
  }

  private async getMatchDetails(match: string): Promise<MatchTFTDTO> {
    const details = await this.client.Match.get(match, RegionGroups.AMERICAS)
    return details.response
  }

  private async crunchMatchData(nerds: Nerd[], details: MatchTFTDTO): Promise<NerdAgainstNerdPoints[]> {
    const nerdRanks: NerdAgainstNerdPoints[] = []
    const placements = []
    for (let nerd of nerds) {
      const participants = details.info.participants
      if (details.metadata.participants.includes(nerd.puuid)) {
        const player = participants.filter(p => p.puuid == nerd.puuid)[0]
        const placement = {
          nerd: nerd,
          placement: player.placement
        }
        placements.push(placement)
      } 
    }
    placements.sort((a, b) => a.placement > b.placement ? 1 : -1)
    
    const nerdsInMatch = placements.length
    let differential = 0
    for (let placement of placements) {
      differential++
      let rank = ({
        nerd: placement.nerd,
        points: nerdsInMatch - differential
      })
      nerdRanks.push(rank)
    }

    return nerdRanks
  }

  async GetNerdRankings(nerds: Nerd[]): Promise<Ranking[]> {
    const ranks: Ranking[] = []
    for (const nerd of nerds) {
      let rank = await this.getRankings(nerd)
      ranks.push(rank)
    }
    return ranks
  }

  private async getRankings(nerd: Nerd): Promise<Ranking> {
    let ranking = {
      nerd: nerd,
      tier: IRON,
      rank: I,
      points: 0,
      totalPoints: 0,
      winRate: 0,
      matches: 0
    }
    const league = await this.client.League.get(nerd.summonerId, nerd.region as Regions)
    league.response.forEach(r => {
      const tier = GetTierObject(r.tier)
      const rank = GetRankObject(r.rank)
      let fix = this.handleBug(r)
      const matches = Number(r.wins) + Number(fix.losses)
      const winRate = (r.wins / matches)  * 100
      let total = tier.points + rank.points + r.leaguePoints
      ranking.tier = tier
      ranking.rank = rank
      ranking.points = r.leaguePoints
      ranking.totalPoints = total
      ranking.matches = matches
      ranking.winRate = Math.round(winRate * 100) / 100
    })
    return ranking
  }

  // Bug in data type. Handle til PR
  private handleBug(entry: LeagueEntryDTO): HandleBug {
    const convert = JSON.stringify(entry)
    const obj = JSON.parse(convert)
    const n: HandleBug = {
      ...entry,
      losses: Number(obj["losses"])
    }
    n.losses = Number(obj["losses"])
    return n
  }
}