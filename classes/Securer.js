class Securer {
  constructor() {}

  /**
   * @param {import("discord.js").Message} message 
   */
  secureMessage(message) {
    return {
      channel: message.channel ?? this.secureChannel(message.channel),
      author: message.author ?? this.secureUser(message.author),
      member: message.member ?? this.secureMember(message.member),
      guild: message.guild ?? this.secureGuild(message.guild),
      client: message.client ?? this.secureClient(message.client),
      /**
       * @param {import("discord.js").MessageOptions} options 
       */
      reply: async (options) => {
        if (typeof options === "string") {
          options = {
            content: options,
            reply: { failIfNotExists: false, messageReference: null }
          }
        }

        options.reply = { failIfNotExists: false, messageReference: message }
        const botMessage = await message.channel.send(options);
        return this.secureMessage(botMessage);
      },
      channelId: message.channelId,
      guildId: message.guildId,
      toJSON: message.toJSON,
      toString: message.toString,
      id: message.id,
      content: message.content,
      cleanContent: message.cleanContent,
      edit: message.edit,
      components: message.components,
      embeds: message.embeds,
      attachments: message.attachments,
      removeAttachments: function(...args) { message.removeAttachments(...args) },
      deletable: message.deletable,
      hasThread: message.hasThread,
      inGuild: message.inGuild,
      pin: function(...args) { message.pin(...args) },
      pinnedpin: message.pinned,
      pinnable: message.pinnable,
      editedAt: message.editedAt,
      editedTimestamp: message.editedTimestamp,
      editable: message.editable,
      interaction: message.interaction,
      thread: message.thread,
      unpin: function(...args) { message.unpin(...args) },
      tts: message.tts,
      type: message.type,
      slash: message.slash
    }
  }
  
  /**
   * @param {import("discord.js").Channel} channel 
   */
  secureChannel(channel) {
    return {
      guild: channel.guild ?? this.secureGuild(channel.guild),
      send: async (...args) => {
        const botMessage = await channel.send(...args);
        this.secureMessage(botMessage);
      },
      id: channel.id,
      createdAt: channel.createdAt,
      createInvite: channel.createInvite,
      clone: channel.clone,
      createdTimestamp: channel.createdTimestamp,
      deletable: channel.deletable,
      children: channel.children,
      archived: channel.archived,
      archivedAt: channel.archivedAt,
      autoArchiveDuration: channel.autoArchiveDuration,
      bitrate: channel.bitrate,
      bulkDelete: channel.bulkDelete,
      defaultAutoArchiveDuration: channel.defaultAutoArchiveDuration,
      edit: channel.edit,
      delete: function(...args) { channel.delete(...args) },
      editable: channel.editable,
      guildId: channel.guildId,
      invitable: channel.invitable,
      nsfw: channel.nsfw,
      parent: channel.parent,
      memberCount: channel.memberCount,
      name: channel.name,
      position: channel.position,
      setPosition: channel.setPosition,
      topic: channel.topic,
      setTopic: channel.setTopic,
      isTextBased: channel.isTextBased,
      isVoiceBased: channel.isVoiceBased,
      isThread: channel.isThread,
      sendTyping: channel.sendTyping,
      setType: channel.setType,
      setNSFW: channel.setNSFW,
      rtcRegion: channel.rtcRegion,
      setArchived: channel.setArchived,
      setAutoArchiveDuration: channel.setAutoArchiveDuration,
      setDefaultAutoArchiveDuration: channel.setDefaultAutoArchiveDuration,
      userLimit: channel.userLimit,
      lastPinAt: channel.lastPinAt,
      lastPinTimestamp: channel.lastPinTimestamp,
      toJSON: channel.toJSON,
      toString: channel.toString
    }
  }

  /**
   * @param {import("discord.js").Guild} guild 
   */
  secureGuild(guild) {
    return {
      afkChannel: guild.afkChannel ?? this.secureChannel(guild.afkChannel),
      systemChannel: guild.systemChannel ?? this.secureChannel(guild.systemChannel),
      rulesChannel: guild.rulesChannel ?? this.secureChannel(guild.rulesChannel),
      name: guild.name,
      id: guild.id,
      afkTimeout: guild.afkTimeout,
      afkChannelId: guild.afkChannelId,
      available: guild.available,
      banner: guild.banner,
      bannerURL: function(...args) { guild.bannerURL(...args) },
      createdAt: guild.createdAt,
      createdTimestamp: guild.createdTimestamp,
      description: guild.description,
      joinedAt: guild.joinedAt,
      explicitContentFilter: guild.explicitContentFilter,
      delete: function(...args) { guild.delete(...args) },
      edit: function(...args) { guild.edit(...args) },
      editWelcomeScreen: function(...args) { guild.editWelcomeScreen(...args) },
      createTemplate: function(...args) { guild.createTemplate(...args) },
      invites: guild.invites,
      features: guild.features,
      icon: guild.icon,
      iconURL: function(...args) { guild.iconURL(...args) },
      setIcon: function(...args) { guild.setIcon(...args) },
      large: guild.large,
      joinedTimestamp: guild.joinedTimestamp,
      premiumProgressBarEnabled: guild.premiumProgressBarEnabled,
      premiumTier: guild.premiumTier,
      maximumBitrate: guild.maximumBitrate,
      maximumMembers: guild.maximumMembers,
      memberCount: guild.memberCount,
      maximumPresences: guild.maximumPresences,
      mfaLevel: guild.mfaLevel,
      setMFALevel: function(...args) { guild.setMFALevel(...args) },
      setName: function(...args) { guild.setName(...args) },
      setOwner: function(...args) { guild.setOwner(...args) },
      ownerId: guild.ownerId,
      nameAcronym: guild.nameAcronym,
      partnered: guild.partnered,
      preferredLocale: guild.preferredLocale,
      setPreferredLocale: function(...args) { guild.setPreferredLocale(...args) },
      setRulesChannel: function(...args) { guild.setRulesChannel(...args) },
      setSystemChannel: function(...args) { guild.setSystemChannel(...args) },
      systemChannelId: guild.systemChannelId,
      rulesChannelId: guild.rulesChannelId,
      leave: function(...args) { guild.leave(...args) },
      vanityURLCode: guild.vanityURLCode,
      vanityURLUses: guild.vanityURLUses,
      toJSON: guild.toJSON,
      toString: guild.toString,
      channels: {
        cache: guild.channels.cache.toJSON(),
        create: guild.channels.create
      }
    }
  }

  /**
   * @param {import("discord.js").Client} client 
   */
  secureClient(client) {
    return {
      user: this.secureUser(client.user),
      readyAt: client.readyAt,
      readyTimestamp: client.readyTimestamp,
      uptime: client.uptime,
      options: JSON.parse(JSON.stringify(client.options)),
      ws: {
        ping: client.ws.ping,
        status: client.ws.status,
        shards: client.ws.shards,
      },
      toJSON: client.toJSON,
      toString: client.toString
    }
  }

  /**
   * @param {import("discord.js").User} user 
   */
  secureUser(user) {
    return {
      username: user.username,
      tag: user.tag,
      id: user.id,
      displayAvatarURL: user.displayAvatarURL,
      bot: user.bot,
      createDM: function(...args) { user.createDM(...args) },
      createdAt: user.createdAt,
      createdTimestamp: user.createdTimestamp,
      deleteDM: function(...args) { user.deleteDM(...args) },
      send: async (...args) => {
        const botMessage = await user.send(...args);
        return this.secureMessage(botMessage);
      },
      discriminator: user.discriminator,
      bannerURL: user.bannerURL,
      banner: user.banner,
      hexAccentColor: user.hexAccentColor,
      toJSON: user.toJSON,
      toString: user.toString
    }
  }
  
  /**
   * @param {import("discord.js").GuildMember} member 
   */
  secureMember(member) {
    return {
      user: member.user ?? this.secureUser(member.user),
      id: member.id,
      bannable: member.bannable,
      ban: function(...args) { member.ban(...args) },
      kickable: member.kickable,
      kick: function(...args) { member.kick(...args) },
      moderatable: member.moderatable,
      timeout: function(...args) { member.timeout(...args) },
      joinedAt: member.joinedAt,
      joinedTimestamp: member.joinedTimestamp,
      displayColor: member.displayColor,
      createDM: function(...args) { member.createDM(...args) },
      deleteDM: function(...args) { member.deleteDM(...args) },
      displayAvatarURL: member.displayAvatarURL(...args),
      displayHexColor: member.displayHexColor,
      displayName: member.displayName,
      nickname: member.nickname,
      manageable: member.manageable,
      premiumSince: member.premiumSince,
      toJSON: member.toJSON,
      toString: member.toString,
      send: async (...args) => {
        const botMessage = await member.send(...args);
        return this.secureMessage(botMessage);
      }
    }
  }

  /**
   * @param {any} val 
   * @param {string} name 
   */
  secureModule(val, name) {
    if (val.on) delete val.on;
    if (val.once) delete val.once;

    switch (name) {
      case "discord.js":
        val = this.secureDiscordJs(val);
        break;
    }

    return val;
  }

  /**
   * @param {import("discord.js")} Discord 
   */
  secureDiscordJs(Discord) {
    return {
      AttachmentBuilder: Discord.AttachmentBuilder,
      EmbedBuilder: Discord.EmbedBuilder,
      ModalBuilder: Discord.ModalBuilder,
      ButtonBuilder: Discord.ButtonBuilder,
      ActionRowBuilder: Discord.ActionRowBuilder,
      SelectMenuBuilder: Discord.SelectMenuBuilder,
      TextInputBuilder: Discord.TextInputBuilder,
      Collection: Discord.Collection,
      ButtonStyle: Discord.ButtonStyle,
      TextInputStyle: Discord.TextInputStyle,
      Events: Discord.Events,
      PermissionFlagsBits: structuredClone(Discord.PermissionFlagsBits)
    }
  }
}

module.exports = Securer;