**KEY:**
`  !  ` — is the standard command prefix.
`[...]` — specifies an option/argument to the command (required).
`<...>` — specifies an optional option/argument to the command (not-required).

▬▬▬

- `!help` — Shows this page.
- `!export` — Exports current configuration, and saves it.
- `!prefix [new]` — Changes the prefix for sending this bot commands (default is `!`). Can only be one (1) character/symbol/grapheme/rune long.
- `!id <who>` — Print ID of user, or self if no-one is specified.
- `!alias` — Manage aliases to commands:
  - `!alias ![the-alias] ![the-command]` — to add a new alias.
  - `!alias <ls>` — lists all aliases numerically.
  - `!alias rm ![the-alias]` — removes the alias by name.
  - `!alias rm #[alias-index]` — removes alias by index.
- `!ignore` — What the bot should ignore:
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
- `!respond` — How the bot should respond to certain messages:
  - `!respond [match] [reply]` — matches an expression said (using regular-expressions, i.e. `/regex/flags`), and replies with a message.
  - `!respond <ls>` — list all response rules numerically.
  - `!respond rm #[rule-index]` — removes the response-rule by index.
- `!reject` — Deletes messages meeting certain patterns:
  - `!reject [match] <reply>` — rejects certain messages, matching a regular-expression (specifying a reply is optional).
  - `!reject <ls>` — numerically lists all rejection rules.
  - `!reject rm #[rule-index]` — removes the rejection-rule specified by a numerical index.
- `!replace` — Bots currently do not have the ability to edit other users messages.  We can only wait.
- `!define [word]` — Looks a word up in the Oxford English Dictionary.
- `!urban [slang]` — Looks up a piece of slang in the _Urban Dictionary_.
- `!search [web-search-terms]` — Performs a web-search and returns the most appropriate URL found.
- `!image [image-search-terms]` — Searches for images specified by the terms given, and send a link to the most relevant one.
- `!news [news-search-term]` — Sends you the most relevant new on the specified topic area.
- `!youtube [youtube-search-terms]` — Searches for and returns a relevant _YouTube_ video.
- `!cron` — Run commands repeatedly based on some timer (Google cron syntax for more info):
  - `!cron [minute] [hour] [day-of-month] [month] [day-of-week] ![command] <...>` — runs a command (with or without arguments) repeatedly as specified by the schedule signature.
  - `!cron <ls>` — lists all active cron-jobs numerically.
  - `!cron rm #[job-index]` — removes a cron-job by index.
