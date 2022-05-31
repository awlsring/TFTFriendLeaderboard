import { MatchAnalyzer } from "./analyzer/analyzer"
import { MongoDBHandler } from "./mongodb/mongodb-handler"

async function start() {
  console.log("STARTING")
  const analyzer = new MatchAnalyzer()

  const mongo = new MongoDBHandler({
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    url: process.env.DB_ADDRESS!,
    port: Number(process.env.DB_PORT),
    db: "tftmatchleaderboard"
  })

  const nerdResults = await mongo.GetNerds()
  const nerds = nerdResults.map(e => e.nerd)

  const matches = await mongo.GetMatches()
  const matchList = matches.map(m => m.matchId)
  
  const results = await analyzer.GetAllMatchData(nerds, matchList)
  console.log(`${results.matches.length} new matches to record`)
  for (const result of results.nerdPoints) {
    await mongo.UpdateNerd({
      nerd: result.nerd,
      matches: result.matches,
      points: result.points
    })
  }
  for (const match of results.matches) {
    await mongo.AddMatch(match)
  }
  await mongo.client?.close()
}
start()