import * as app from "../app"
import path from "path"

import report from "../tables/report"

module.exports = new app.Command({
  name: "report",
  description: "The report command",
  channelType: "all",
  middlewares: [
    (message) =>
      message.attachments.size > 0 ||
      "You must attach a proof of the reported user offense.",
    (message) => {
      const attachment = message.attachments.first()
      return (
        (attachment &&
          /\.(?:jpe?g|png)/.test(path.extname(attachment.name ?? ""))) ||
        "You must attach a image file as proof."
      )
    },
  ],
  positional: [
    {
      name: "target",
      description: "User to report",
      castValue: "user",
      required: true,
    },
  ],
  options: [
    {
      name: "reason",
      description: "Reason of report",
      required: true,
    },
  ],
  async run(message) {
    const target: app.User = message.args.target
    const reason: string = message.args.reason
    const attachment = message.attachments.first() as app.MessageAttachment

    await report.query.insert({
      reporter_id: message.author.id,
      reported_id: target.id,
      reason: message.args.reason,
      proof: attachment.proxyURL,
    })

    return message.channel.send(
      new app.MessageEmbed()
        .setAuthor(`Successfully reported by ${message.author.username}`)
        .setThumbnail(target.displayAvatarURL())
        .addField(
          "User",
          `Tag: \`${target.tag}\` | ID: \`${target.id}\``,
          false
        )
        .addField(
          "Reason",
          reason
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n")
        )
        .setImage(attachment.proxyURL)
        .setTimestamp()
    )
  },
  subs: [
    new app.Command({
      name: "list",
      description: "List reports",
      channelType: "all",
      aliases: ["ls"],
      options: [
        {
          name: "reported",
          aliases: ["target"],
          description: "Reported user",
          castValue: "user",
        },
        {
          name: "reporter",
          aliases: ["author", "owner"],
          description: "Author of reports",
          castValue: "user",
        },
      ],
      async run(message) {
        const query = report.query.select()

        if (message.args.reported)
          query.where("reported_id", message.args.reported.id)

        if (message.args.reporter)
          query.where("reporter_id", message.args.reporter.id)

        return app.paginateReports(message, await query)
      },
    }),
    new app.Command({
      name: "find",
      description: "Find user by report reason",
      aliases: ["filter", "search", "query"],
      channelType: "all",
      rest: {
        name: "search",
        description: "The pattern to search",
        required: true,
        all: true,
      },
      async run(message) {
        return app.paginateReports(
          message,
          await report.query
            .select()
            .where("reason", "like", `%${message.args.search}%`)
        )
      },
    }),
  ],
})
