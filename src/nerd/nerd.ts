import { Regions } from "twisted/dist/constants"

export interface NerdInfo {
  name: string
  region: string
  summonerId?: string
  puuid?: string
}
export interface Nerd extends NerdInfo {
  summonerId: string
  puuid: string
}