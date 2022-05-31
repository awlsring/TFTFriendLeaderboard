import { ObjectId } from "mongodb";

export interface Nerd {
  name: string,
  region: string,
  puuid: string,
  summonerId: string
}

export default class Results {
  constructor(public nerd: Nerd, public matches: number, public points: number, public id?: ObjectId) {}
}