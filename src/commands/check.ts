import * as app from "../app"
import report from "../tables/report"

module.exports = new app.Command({
  name: "check",
  description: "Check if user is safe",
  aliases: ["checkkuser", "cu", "user", "checkUser", "safe"],
  channelType: "all",
  positional: [
    {
      name: "target",
      description: "User to check",
      castValue: "user",
      default: (message) => message?.author.id as string,
    },
  ],
  async run(message) {
    const user: app.User = message.args.target
    const reports = await report.query.select().where("reported_id", user.id)

    if (reports.length > 0)
      return message.channel.send(
        new app.MessageEmbed()
          .setColor("RED")
          .setTitle(`${user.tag} is reported!`)
          .setDescription(`This user has **${reports.length}** reports.`)
          .setFooter(`${message.usedPrefix}report list ${user.id}`)
      )

    return message.channel.send(
      new app.MessageEmbed()
        .setColor("GREEN")
        .setTitle(`${user.tag} is safe.`)
        .setDescription("No report found.")
    )
  },
})
