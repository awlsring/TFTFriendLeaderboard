import { ObjectId } from "mongodb";

export default class Matches {
  constructor(public matchId: string, public id?: ObjectId) {}
}