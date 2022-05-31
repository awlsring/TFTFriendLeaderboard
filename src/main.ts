import { Regions } from "twisted/dist/constants"
import { MatchAnalyzer } from "./analyzer/analyzer"

async function start() {
  console.log("STARTING")
  const analyzer = new MatchAnalyzer()
  const nerds = await analyzer.BuildNerdDetails([
    {
      name: "Mrichael",
      region: Regions.AMERICA_NORTH
    },
    {
      name: "Awlsring",
      region: Regions.AMERICA_NORTH
    },
    {
      name: "tebulus",
      region: Regions.AMERICA_NORTH
    },
    {
      name: "WeedSeagull",
      region: Regions.AMERICA_NORTH
    }
  ])
  // const ranks = await analyzer.GetNerdRankings()
  // ranks.forEach(r => {
  //   console.log(r)
  // })
  const results = await analyzer.GetAllMatchData(nerds)
  console.log(results)
}
start()