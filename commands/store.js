const Discord = require("discord.js");
const Command = require("../classes/Command.js");

module.exports = new Command({
  name: "store",
  aliases: [],
  description: "HELP_STORE",
  options: [
    {
      name: "page",
      description: "HELP_STORE_PAGE",
      type: Command.OptionTypes.INTEGER,
      required: false
    },
    {
      name: "search",
      description: "HELP_STORE_SEARCH",
      type: Command.OptionTypes.STRING,
      required: false
    }
  ],
  execute: async function({ message, args, translate }) {
    let commands = await tables.commands.all();
    commands = commands.map((c) => ({ id: c.id, ...c.value })).filter((c) => c.privacy !== "private");

    let page = 0;
    let cmdsPerPage = 5;
    let maxPage = Math.ceil(commands.length / cmdsPerPage);
    let filter = "";

    if (args[0]) {
      if (args[0] && !isNaN(args[0])) {
        const newPage = Number(args[0]);

        if (args[1]) filter = args[1].toLowerCase();
        commands = commands.filter((c) => c.name.startsWith(filter) || c.id === filter);
        maxPage = Math.ceil(commands.length / cmdsPerPage);

        if (newPage >= 0 && newPage <= maxPage - 1) page = newPage - 1;
      } else {
        filter = args[0].toLowerCase();
        commands = commands.filter((c) => c.name.startsWith(filter) || c.id === filter);
      }
    }

    async function embed(page, cmdsPerPage, maxPage) {
      const storeEmbed = new Discord.EmbedBuilder()
      .setTitle(translate("COMMAND_STORE"))
      .setColor(client.embedColor)
      .setFooter({ text: translate("PAGE_RATIO", page + 1, maxPage) });

      /** @type {Array<Discord.EmbedField>} */
      const fields = [];
      
      for (const command of commands.slice(page * cmdsPerPage, page * cmdsPerPage + cmdsPerPage)) {
        const authorTag = client.users.cache.get(command.author.id)?.tag || command.author.tag;

        fields.push({
          name: `> /${command.name} \`${command.id}\``,
          value: `*${command.description}*\n${translate("MADE_BY", authorTag)} • <t:${Math.round(command.createdAt / 1000)}>\n** **`,
          inline: false
        });
      }

      storeEmbed.setFields(...fields);
      return storeEmbed;
    }

    function components(page, maxPage) {
      return new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
        .setCustomId(`remove-page:${message.id}`)
        .setDisabled(page <= 0)
        .setEmoji("◀️")
        .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
        .setCustomId(`go-to-page:${message.id}`)
        .setLabel(translate("GO_TO_PAGE"))
        .setDisabled(maxPage - 1 === 0)
        .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
        .setCustomId(`add-page:${message.id}`)
        .setDisabled(page >= maxPage - 1)
        .setEmoji("▶️")
        .setStyle(Discord.ButtonStyle.Secondary)
      );
    }

    const botMessage = await message.reply({
      embeds: [await embed(page, cmdsPerPage, maxPage)],
      components: [components(page, maxPage)]
    });

    const modal = new Discord.ModalBuilder()
    .setCustomId(`go-to-page-modal:${message.id}`)
    .setTitle(translate("GO_TO_PAGE"))
    .setComponents(
      new Discord.ActionRowBuilder().setComponents(new Discord.TextInputBuilder()
        .setCustomId("page")
        .setStyle(Discord.TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(maxPage.toString().length)
        .setLabel(translate("PAGE"))
        .setRequired(true)
      ) 
    );

    const collector = message.channel.createMessageComponentCollector({ time: 6e+4 });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id) return interaction.reply({
        ephemeral: true,
        content: translate("NOT_ALLOWED_BUTTON")
      });

      collector.resetTimer();
      
      switch (interaction.customId) {
        case `remove-page:${message.id}`:
          if (page > 0) page--;
          break;

        case `add-page:${message.id}`:
          if (page < maxPage - 1) page++;
          break;

        case `go-to-page:${message.id}`:
          interaction.showModal(modal).catch(() => {});
          const modalSubmit = await interaction.awaitModalSubmit({ time: 6e+4 }).catch(() => {});
          if (!modalSubmit) return interaction.reply({
            content: translate("TOOK_TOO_LONG_PAGE"),
            ephemeral: true
          });

          const input = modalSubmit.fields.getTextInputValue("page");

          if (isNaN(input)) return modalSubmit.reply({
            ephemeral: true,
            content: translate("INVALID_PAGE")
          });

          const newPage = Number(input) - 1;
          if (newPage > maxPage - 1 || newPage < 0) return modalSubmit.reply({
            ephemeral: true,
            content: translate("INVALID_PAGE")
          });

          modalSubmit.deferUpdate(page = newPage);
          break;
      }

      interaction.deferUpdate(interaction.message.edit({
        embeds: [await embed(page, cmdsPerPage, maxPage)],
        components: [components(page, maxPage)]
      })).catch(() => {});
    });

    collector.on("end", async () => {
      if (!message.slash) {
        botMessage.components[0].components.forEach((button) => button.data.disabled = true);
        botMessage.edit({ components: botMessage.components });
      }
    });
  }
});