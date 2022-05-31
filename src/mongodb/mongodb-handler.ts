import { Db, Document, MongoClient } from "mongodb";
import Matches from "./models/matches";
import Results from "./models/results";

export interface MongoDBHandlerProps {
  user: string,
  password: string
  url: string
  port: number
  db: string
}

export class MongoDBHandler {
  private connectionString: string
  public client?: MongoClient
  public resultDB?: Db
  constructor(props: MongoDBHandlerProps) {
    this.connectionString = `mongodb://${props.user}:${props.password}@${props.url}:${props.port}/${props.db}?retryWrites=true&w=majority`
  }

  async connect() {
    console.log("Connecting to db")
    this.client = await MongoClient.connect(this.connectionString)
  }

  async GetDatabase() {
    if (!this.client) {
      await this.connect()
    }
    console.log("Getting DB")
    this.resultDB = await this.client!.db("tftmatchleaderboard")
  }

  async GetNerds() {
    if (!this.resultDB) {
      await this.GetDatabase()
    }
    const col = this.resultDB!.collection("results")
    return await col.find({}).toArray() as Document[] as Results[]
  }

  async GetMatches(): Promise<Matches[]> {
    if (!this.resultDB) {
      await this.GetDatabase()
    }
    const col = this.resultDB!.collection("matches")
    return await col.find({}).toArray() as Document[] as Matches[]
  }


  async AddMatch(match: string) {
    if (!this.resultDB) {
      await this.GetDatabase()
    }
    console.log("Adding matches")
    const col = this.resultDB!.collection("matches")
    const options = {
      upsert: true
    }
    const filter = {
      matchId: match
    }
    const update = {
      $set: {
        matchId: match
      }
    }
    await col.updateOne(filter, update, options)
  }

  async UpdateNerd(result: Results) {
    if (!this.resultDB) {
      await this.GetDatabase()
    }
    console.log("Updating nerds")
    const col = this.resultDB!.collection("results")
    const options = {
      upsert: true
    }
    const filter = {
      nerd: result.nerd
    }
    const update = {
      $set: {
        nerd: result.nerd,
      },
      $inc: {
        points: result.points,
        matches: result.matches
      }
    }
    const response = await col.updateOne(filter, update, options)
  }
}