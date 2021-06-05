import * as app from "../app"

export interface Report {
  reported_id: string
  reporter_id: string
  reason: string
  proof: string
}

const table = new app.Table<Report>({
  name: "report",
  priority: 1,
  setup: (table) => {
    table.string("reported_id")
    table.string("reporter_id")
    table.string("reason")
    table.string("proof")
  },
})

export default table
