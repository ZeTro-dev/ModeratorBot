import * as app from "../app"

module.exports = new app.Command({
  name: "fetch",
  description: "Fetch user information",
  channelType: "all",
  positional: [
    {
      name: "target",
      description: "Fetched user",
      castValue: "user",
      required: true,
    },
  ],
  async run(message) {
    const user: app.User = message.args.target

    return message.channel.send(
      new app.MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `**Created** the ${app
            .dayjs(user.createdAt)
            .format("DD/MM/YYYY at HH:mm")}`
        )
        .setColor("BLURPLE")
    )
  },
})
