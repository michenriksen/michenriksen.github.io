---
title: "Italic text in Alacritty, tmux, and Neovim"
date: "2023-11-17"
categories: ["programming", "dotfiles"]
locale: "en-US"
resources:
  - src: cover-code-preview.png
    title: "Preview of italicized text and curly underlines in Neovim."
---

A quick guide to get properly set up with italic text, curly underlines and other advanced styles in Alacritty, tmux,
and Neovim on macOS.
{.lead}
<!--more-->

{{< admonition >}}
I originally published this guide in a [GitHub Gist](https://gist.github.com/michenriksen/a3fd9e4104548c960696748d994309a3),
but I decided to consolidate it here for better visibility and easier reference.
{{< /admonition >}}

After living without italicized comments and fancy underlines under misspelled words for way too long, I finally
found a way to get them working in Alacritty, tmux, and Neovim on macOS. It seems that many people struggle with this
too so I decided to write this guide. I hope it helps.

## Configuring Alacritty

This little detail is something I completely missed when I installed Alacritty. It comes with its own [terminfo] profile
that needs to be installed to make it work correctly. Download and install it by running the following commands:

```bash-session
$ curl -L -o alacritty.info "https://github.com/alacritty/alacritty/blob/master/extra/alacritty.info"
$ sudo tic -xe alacritty,alacritty-direct alacritty.info
$ rm alacritty.info
```

Next, restart Alacritty and ensure that the `$TERM` environment variable is set to `alacritty`:

```bash-session
$ echo $TERM
alacritty
```

If that's not the case, you most likely have it set to something else in your [Alacritty configuration file], or
in a shell configuration file such as `.zshrc`.

### Testing it

Run the following commands to verify that styling works correctly in Alacritty while NOT running tmux:

```bash
echo -e '\e[1mBold\e[22m'
echo -e '\e[2mDimmed\e[22m'
echo -e '\e[3mItalic\e[23m'
echo -e '\e[4mUnderlined\e[24m'
echo -e '\e[4:3mCurly Underlined\e[4:0m'
echo -e '\e[4:3m\e[58;2;240;143;104mColored Curly Underlined\e[59m\e[4:0m'
```

If everything looks as expected, you are good to go to the next step.

## Configuring tmux

Open your `~/.tmux.conf` file and add the following lines to it:

```bash
set -g default-terminal "alacritty"
set -as terminal-overrides ',*:Setulc=\E[58::2::%p1%{65536}%/%d::%p1%{256}%/%{255}%&%d::%p1%{255}%&%d%;m'  # colored underscores
set -as terminal-overrides ',alacritty:RGB' # true-color support
```

{{< admonition title="Heads-up" >}}
if you are using the [tmux-sensible](https://github.com/tmux-plugins/tmux-sensible) plugin, be aware that it overrides
the `default-terminal`  setting to `screen-256color`, so be sure to add the preceding lines **after** the line that
loads the plugin.
{{< /admonition >}}

Make sure tmux picks up the new configuration by restarting the server:

```bash-session
$ tmux kill-server # WARNING: this will kill all tmux sessions
```

Start a new tmux session and run the [same commands as before](#testing-it) to verify that everything looks as expected.

## Configuring Neovim

This step can vary by how you configure your Neovim, but essentially, this configuration needs to be set:

```lua
vim.opt.termguicolors = true -- enable true-color support
```

You can verify that everything is good by running `:checkhealth nvim` in Neovim. The output should include
`$COLORTERM="truecolor"` and a bunch of green `OK` messages. You can disregard the
`$TERM should be "screen-256color" or "tmux-256color"` error if it's present in the output.

[terminfo]: https://linux.die.net/man/5/terminfo
[Alacritty configuration file]: https://github.com/alacritty/alacritty/blob/master/README.md#configuration
