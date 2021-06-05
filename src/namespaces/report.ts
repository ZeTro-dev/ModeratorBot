import * as app from "../app"

import { Report } from "../tables/report"

export async function paginateReports(
  message: app.CommandMessage,
  reports: Report[]
) {
  new app.Paginator({
    channel: message.channel,
    placeHolder: new app.MessageEmbed()
      .setTitle("No report found.")
      .setColor("YELLOW"),
    filter: (reaction, user) => user.id === message.author.id,
    pages: await Promise.all(
      app.Paginator.divider(reports, 20).map(async (page, i, pages) => {
        const reports = await Promise.all(
          page.map(async (report) => {
            return {
              reported: await message.client.users
                .fetch(report.reported_id)
                .catch(),
              reporter: await message.client.users
                .fetch(report.reporter_id)
                .catch(),
              ...report,
            }
          })
        )

        return new app.MessageEmbed()
          .setTitle("Report list")
          .setDescription(
            reports.map(({ reported, reporter }) => {
              return `\`${reported?.id ?? " - "}\` (${
                reported?.tag ?? "deleted user"
              }) *reported by* **${reporter?.tag ?? "deleted user"}**`
            })
          )
          .setFooter(`Page ${i + 1} sur ${pages.length}`)
          .setColor("BLURPLE")
      })
    ),
  })
}
