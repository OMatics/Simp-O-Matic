**KEY:** How to read the help pages (the notation it uses):

`  !  ` — is the standard command prefix.
`[...]` — specifies an option/argument to the command (required).
`<...>` — specifies an optional option/argument to the command (not-required).
`{a,b}` — represents a choice between a either writing `a` or `b` in its place.
`  _  ` — represents the absence of a value at that particular place.
**〈not impl.〉** — the command has not yet been implemented... please send a pull request :pleading_face:.

▬▬▬

- `!help` — Shows help messages.
  - `!help all` — shows page of help for all commands.
  - `!help <help>` — shows help on how to use the help command.
  - `!help key` — shows how to read the help messages.
  - `!help source` — shows information about the source code for this bot.
  - `!help [!command]` — shows help on a certain command.
- `!commands` — Lists out all commands, but with no description.  For descriptions, use `!help`.
- `!!` — Expands into the previously issued command:
  - `!!@ [@user-name]` — Expands into the previously issued command by that user.
  - `!!^` — Expands into the previous message sent (this counts commands as being messages too, since they are).
  - `!!^@` — Expands into the previously sent message by that user.
  - `!!{^,@,^@,_}<ordinal-number>` — Works like all the `!!`-commands, but with an index number to get the nth-to-last message.
  - **Example:** `!mock !!^@3 @Danny` — Repeats what `@Danny`'s 3rd-from-last message was back to him, but in a mocking way.
  - **Example:** `!! hello` — Executes the command that had just been executed, but with an extra argument (namely: `hello`).
- `!export` — Exports current configuration, and saves it.
- `!prefix [new]` — Changes the prefix for sending this bot commands (default is `!`). Can only be one (1) character/symbol/grapheme/rune long.
- `!ping` — Test the response-time/latency of the bot, by observing the time elapsed between the sending of this command, and the subsequent (one-word) response from the bot.
- `!invite` --- Get an invite link (needs admin (`8`) permissions).
- `!id <who>` — Print ID of user, or self if no-one is specified.
- `!get [accessor]` — Get a runtime configuration variable, using JavaScript object dot-notation.
- `!set [accessor] [json-value]` — Set a value in the runtime JavaScript configuration object.
- `!uptime` **〈not impl.〉** — Display how long the bot has been running for.
- `!clear #[number-of-messages] <@user-name>` **〈not impl.〉** — Clear a number of messages, from latest sent in the current channel.  Will delete any recent messages, unless a specific username is provided, in which case it will only clear messages sent from that user.
- `!alias` — Manage aliases to commands:
  - **Have a look at the aliases list, for alternatives to long commands!**
  - `!alias ![the-alias] ![the-command]` — to add a new alias.
  - `!alias <ls>` — lists all aliases numerically.
  - `!alias rm ![the-alias]` — removes the alias by name.
  - `!alias rm #[alias-index]` — removes the alias by a numerical index.
- `!ignore` **〈not impl.〉** — What the bot should ignore:
  - `!ignore channel [#channel-name]` — ignores everything in said channel.
  - `!ignore user [@user-name]` — ignores everything that user says/does.
  - `!ignore user speech [@user-name]` — ignores any non-commands given by that user.
  - `!ignore user commands [@user-name]` — ignores all commands that user tries to use.
  - `!ignore user commands elevated [@user-name]` — ignores all elevated/high-permissions commands that user tries to use.
  - `!ignore group ...` — works exactly like ignore-user, but for groups instead.
  - `!ignore not ...` — works exactly like all other ignore-commands, but does the opposite (toggles that rule ignore-rule on-off).
  - `!ignore whitelist [type] [@name]` — Will exempt certain users or groups from any of the ignore-rules, ever. (`[type]` is either `user` or `group`)
  - `!ignore <ls>` — lists all ignore rules by type.
  - `!ignore rm [type] [@name]` — clears all ignore rules for a certain type (types are: `user`, `channel` or `group`).
- `!respond` **〈not impl.〉** — How the bot should respond to certain messages:
  - `!respond [match] [reply]` — matches an expression said (using regular-expressions, i.e. `/regex/flags`), and replies with a message.
  - `!respond <ls>` — list all response rules numerically.
  - `!respond rm #[rule-index]` — removes the response-rule by index.
- `!reject` **〈not impl.〉** — Deletes messages meeting certain patterns:
  - `!reject [match] <reply>` — rejects certain messages, matching a regular-expression (specifying a reply is optional).
  - `!reject <ls>` — numerically lists all rejection rules.
  - `!reject rm #[rule-index]` — removes the rejection-rule specified by a numerical index.
- `!replace` **〈not impl.〉** — Bots currently do not have the ability to edit other users messages.  We can only wait.
- `!cron` **〈not impl.〉** — Run commands repeatedly based on some timer (look-up cron syntax for more info):
  - `!cron [minute] [hour] [day-of-month] [month] [day-of-week] ![command] <...>` — runs a command (with or without arguments) repeatedly as specified by the schedule signature.
  - `!cron <ls>` — lists all active cron-jobs numerically.
  - `!cron rm #[job-index]` — removes a cron-job by index.
- `!choose [comma-separated-values]` **〈not impl.〉** — Choose randomly from a list of items, separated by commas.
- `!define [word]` — Looks a word up in the Oxford English Dictionary.
- `!urban [slang]` — Looks up a piece of slang in the _Urban Dictionary_.
- `!search [web-search-terms]` — Performs a web-search and returns the most appropriate URL found.
- `!image [image-search-terms]` — Searches for images specified by the terms given, and sends a link to the most relevant one.
- `!gif [gif-search-terms]` **〈not impl.〉** — Searches for and returns a GIF matching your search.
- `!cat` **〈not impl.〉** — Pussycat pictures...
- `!news [news-search-term]` **〈not impl.〉** — Sends you the most relevant news on the specified topic area.
- `!youtube [youtube-search-terms]` **〈not impl.〉** — Searches for and returns a relevant _YouTube_ video.
- `!wikipedia` **〈not impl.〉** — Search through Wikipedia, returning the most relevant wiki-link.
- `!translate <language> [phrase]` **〈not impl.〉** — Translate a phrase from a language (if none specified, it will auto-detect).
- `!wolfram` **〈not impl.〉** — Query Wolfram|Alpha.
- `!weather` — Check the weather:
  - `!weather set [location]` — sets your weather location.
  - `!weather <location>` — gives you the weather in a certain location, if location is left blank, it will either give you the weather in the default location, or in the area you `set` previously.
- `!say [phrase]` — Repeats what you told it to say.
- `!milkies` — In case you're feeling thirsty...
- `!{cowsay,cowthink} <options> [phrase]` — Make a cow say something, using Unix-like command-line arguments.
- `!figlet <options> [phrase]` — Print text in ASCII format, using Unix-like command-line arguments.
- `!roll <upper-bound>` — Roll a dice, default upper bound is 6.
- `!8ball` — Ask a question, receive a response.
- `!summon [@user-name]` **〈not impl.〉** — Summon someone to the server by making the bot poke them in their DMs about it.
- `!mock [phrase]` — Say something, _bUt iN a MocKiNg WaY_...
- `!boomer [phrase]` — Say something, but in the way your demented boomer uncle would write it on Facebook.
- `!ship [@user-name] [@user-name]` — Shows the love grade between two people.
- `!kiss [@user-name]` — Blow a kiss to someone you like!
- `!emojify [phrase]` — Turn your text into discord-style emoji.
- `!B [phrase]` — Replace some elements of your text with a certain U+1F171.
▬▬▬

**Source Code & Bugs:**

- `!github` — Get GitHub link. (https://github.com/Demonstrandum/Simp-O-Matic)
- `!fork` — Fork the repository and send me a pull-request for your patches. (https://github.com/Demonstrandum/Simp-O-Matic/fork)
- `!issue` — Spot a bug, have an issue or want to request a new feature? There's a page for that. (https://github.com/Demonstrandum/Simp-O-Matic/issues)

**Licenced under GNU GPLv3!  _Free_ as in Freedom!**
