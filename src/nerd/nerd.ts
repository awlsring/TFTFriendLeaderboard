import { Regions } from "twisted/dist/constants"

export interface NerdInfo {
  name: string
  region: Regions
  summonerId?: string
  puuid?: string
}
export interface Nerd extends NerdInfo {
  summonerId: string
  puuid: string
}