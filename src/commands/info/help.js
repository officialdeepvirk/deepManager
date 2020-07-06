const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'h'],
      usage: 'help [command]',
      description: oneLine`
        Displays a list of all current commands, sorted by category. 
        Can be used in conjunction with a command for additional information.
      `,
      type: 'info',
      examples: ['help ping']
    });
  }
  run(message, args) {

    let embed;
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    if (args.length > 0 && (message.client.commands.has(args[0]) || message.client.aliases.has(args[0]))) {
      const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
      let description = `${command.description} 
        ${(command.aliases) ? '\n‣ **Aliases:** ' + command.aliases.map(c => `\`${c}\``).join(' ') : ''}
        ‣ **Usage:** \`${prefix}${command.usage}\`
        ‣ **Type:** \`${command.type}\`
        ${(command.examples) ? '‣ **Examples:** ' + command.examples.map(c => `\`${prefix}${c}\``).join(' ') : ''}
      `;
      embed = new MessageEmbed()
        .setTitle(`Command: \`${command.name}\``)
        .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
        .setDescription(description)  
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
    } else if (args.length > 0) {
      return this.sendErrorMessage(message, `Unable to find command \`${args[0]}\`. Please enter a valid command.`);
    } else {
      const info = [], fun = [], point = [], color = [], mod = [],  admin = [];
      message.client.commands.forEach(c => {
        if (c.type === 'info') info.push(`\`${c.name}\``);
        else if (c.type === 'fun') fun.push(`\`${c.name}\``);
        else if (c.type === 'point') point.push(`\`${c.name}\``);
        else if (c.type === 'mod') mod.push(`\`${c.name}\``);
        else if (c.type === 'color') color.push(`\`${c.name}\``);
        else if (c.type === 'admin') admin.push(`\`${c.name}\``);
      });
      embed = new MessageEmbed()
        .setTitle('Calypso\'s Commands')
        .setDescription(stripIndent`
          ‣ The prefix on **${message.guild.name}** is \`${prefix}\`
          ‣ Use \`${prefix}help [command]\` for more information
        `)
        .addField(`**Info [${info.length}]**`, info.join(' '))
        .addField(`**Fun [${fun.length}]**`, fun.join(' '))
        .addField(`**Point [${point.length}]**`, point.join(' '))
        .addField(`**Color [${color.length}]**`, color.join(' '))
        .addField(`**Mod [${mod.length}]**`, mod.join(' '))
        .addField(`**Admin [${admin.length}]**`, admin.join(' '))
        .addField(
          'Links', 
          '**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=268528727) | ' +
          '[Support Server](https://discord.gg/pnYVdut) | ' +
          '[Repository](https://github.com/sabattle/CalypsoBot)**'
        )
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setImage('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_Title.png')
        .setColor(message.guild.me.displayHexColor);
    }
    message.channel.send(embed);
  }
};