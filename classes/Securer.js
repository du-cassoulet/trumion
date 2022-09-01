const Discord = require("discord.js");

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
      mentions: message.mentions ?? this.secureMentions(message.mentions),
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
      edit: async (options) => { 
        const botMessage = await message.edit(options);
        return this.secureMessage(botMessage);
      },
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
      slash: message.slash,
      createReactionCollector: (options = {}) => {
        if (!options.time || options.time > 3e+5) options.time = 3e+5;
        return this.secureReactionCollector(message.createReactionCollector(options));
      },
      react: async (...args) => {
        const botReaction = await message.react(...args);
        return this.secureReaction(botReaction);
      },
      reactions: {
        removeAll: async () => {
          const botMessage = await message.reactions.removeAll();
          return botMessage;
        },
        client: message.reactions.client ?? this.secureClient(message.reactions.client),
        message: message.reactions.message ?? this.secureMessage(message.reactions.message),
        resolve: (...args) => {
          return this.secureReaction(message.reactions.resolve(...args));
        },
        resolveId: message.reactions.resolveId
      }
    }
  }

  /**
   * @param {import("discord.js").Attachment} attachment 
   */
  secureAttachment(attachment) {
    return {
      id: attachment.id,
      name: attachment.name,
      contentType: attachment.contentType,
      description: attachment.description,
      ephemeral: attachment.ephemeral,
      height: attachment.height,
      width: attachment.width,
      proxyURL: attachment.proxyURL,
      size: attachment.size,
      spoiler: attachment.spoiler,
      url: attachment.url,
      toJSON: attachment.toJSON,
      toString: attachment.toString
    }
  }
  
  /**
   * @param {import("discord.js").Role} role 
   */
  secureRole(role) {
    return {
      guild: role.guild ?? this.secureGuild(role.guild),
      members: role.members ?? this.secureCollection(role.members),
      id: role.id,
      color: role.color,
      createdAt: role.createdAt,
      createdTimestamp: role.createdTimestamp,
      editable: role.editable,
      hexColor: role.hexColor,
      hoist: role.hoist,
      icon: role.icon,
      iconURL: role.iconURL,
      managed: role.managed,
      mentionable: role.mentionable,
      name: role.name,
      permissions: role.permissions,
      position: role.position,
      rawPosition: role.rawPosition,
      delete: async (...args) => {
        const role = await role.delete(...args);
        return role;
      },
      edit: async (...args) => {
        const role = await role.edit(...args);
        return role;
      },
      comparePositionTo: role.comparePositionTo,
      equals: role.equals,
      permissionsIn: role.permissionsIn,
      toJSON: role.toJSON,
      toString: role.toString
    }
  }

  /**
   * @param {import("discord.js").MessageMentions} mentions 
   */
  secureMentions(mentions) {
    return {
      repliedUser: mentions.repliedUser ?? this.secureUser(mentions.repliedUser),
      channels: secureCollection(mentions.channels),
      members: secureCollection(mentions.members),
      users: secureCollection(mentions.users),
      roles: secureCollection(mentions.roles),
      everyone: mentions.everyone,
      toJSON: mentions.toJSON,
      toString: mentions.toString,
    }
  }

  /**
   * @param {import("discord.js").Collection<string, import("discord.js").GuildChannel | import("discord.js").GuildMember | import("discord.js").User | import("discord.js").Role | import("discord.js").Emoji | import("discord.js").Guild> | import("discord.js").Attachment>} collection 
   */
  secureCollection(collection) {
    const newCollection = new Discord.Collection();

    collection.forEach((element) => {
      if (element instanceof Discord.GuildChannel) {
        newCollection.set(element.id, this.secureChannel(element));
      } else if (element instanceof Discord.GuildMember) {
        newCollection.set(element.id, this.secureMember(element));
      } else if (element instanceof Discord.User) {
        newCollection.set(element.id, this.secureUser(element));
      } else if (element instanceof Discord.Role) {
        newCollection.set(element.id, this.secureRole(element));
      } else if (element instanceof Discord.Emoji) {
        newCollection.set(element.id, this.secureEmoji(element));
      } else if (element instanceof Discord.Guild) {
        newCollection.set(element.id, this.secureGuild(element));
      } else if (element instanceof Discord.Attachment) {
        newCollection.set(element.id, this.secureAttachment(element));
      } else {
        throw new Error("Invalid element to secure");
      }
    });

    return newCollection;
  }

  /**
   * @param {import("discord.js").ReactionCollector} collector 
   */
  secureReactionCollector(collector) {
    return {
      on: (event, listener) => {
        return collector.on(event, (reaction, user, reason) => listener(
          this.secureReaction(reaction),
          this.secureUser(user),
          reason
        ));
      },
      once: (event, listener) => {
        return collector.once(event, (reaction, user, reason) => listener(
          this.secureReaction(reaction),
          this.secureUser(user),
          reason
        ));
      },
      client: collector.client ?? this.secureClient(collector.client),
      ended: collector.message ?? this.secureMessage(collector.message),
      empty: collector.empty,
      collect: collector.collect,
      dispose: collector.dispose,
      stop: collector.stop,
      total: collector.total,
      endReason: collector.endReason,
      ended: collector.ended,
      toJSON: collector.toJSON,
      toString: collector.toString
    }
  }

  /**
   * @param {import("discord.js").MessageReaction} reaction 
   */
  secureReaction(reaction) {
    return {
      emoji: reaction.emoji ?? this.secureEmoji(reaction.emoji),
      client: reaction.emoji ?? this.secureClient(reaction.client),
      message: reaction.message ?? this.secureMember(reaction.message),
      count: reaction.count,
      me: reaction.me,
      react: async () => {
        const botReaction = await reaction.react();
        return this.secureReaction(botReaction);
      },
      remove: async () => {
        const botReaction = await reaction.remove();
        return this.secureReaction(botReaction);
      },
      toJSON: reaction.toJSON,
      toString: reaction.toString
    }
  }

  /**
   * @param {import("discord.js").Emoji} emoji 
   */
  secureEmoji(emoji) {
    return {
      client: emoji.client ?? this.secureClient(emoji.client),
      name: emoji.name,
      animated: emoji.animated,
      createdAt: emoji.createdAt,
      createdTimestamp: emoji.createdTimestamp,
      id: emoji.id,
      identifier: emoji.identifier,
      url: emoji.url,
      toJSON: emoji.toJSON,
      toString: emoji.toString
    }
  }
  
  /**
   * @param {import("discord.js").Channel} channel 
   */
  secureChannel(channel) {
    return {
      guild: channel.guild ?? this.secureGuild(channel.guild),
      client: channel.client ?? this.secureClient(channel.client),
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
      client: guild.client ?? this.secureClient(guild.client),
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
      client: user.client ?? this.secureClient(user.client),
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
      client: member.client ?? this.secureClient(member.client),
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
      PermissionFlagsBits: { ...Discord.PermissionFlagsBits }
    }
  }
}

module.exports = Securer;