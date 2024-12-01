---
title: Neovim colors and undercurls in tmux and Alacritty
date: 2024-12-01
categories: [Neovim, Tmux, Alacritty]
---

How to get correct colors and undercurl support in [Neovim] when running in [tmux] and [Alacritty].

This is something I have {{< backlink "italic-text-in-alacritty-tmux-neovim" "written about before" >}}, however, this
is a new and cleaner solution from [@dpom@fosstodon.org] that I'm writing up here for future reference.

Add the following in `~/tmux.conf`:

```shell
set -g default-terminal "tmux-256color"

# Enable undercurl and color.
set -ga terminal-features ",*:usstyle"

# Support RGB color with SGR escape sequences.
set -gs terminal-overrides ",*:RGB"
```

Check that the following profiles are installed in `~/.terminfo`:

```shell
$ infocmp alacritty
$ infocmp tmux-256color
```

If the `tmux-256color` profile is missing, it can be installed with these commands:

```shell
$ curl -LO https://invisible-island.net/datafiles/current/terminfo.src.gz
$ gunzip terminfo.src.gz
$ tic -xe tmux-256color terminfo.src
$ killall tmux
```

Open Neovim inside tmux and check if everything works by introducing a syntax or linting violation. If you don't see
colored undercurls, and you skipped installing the `tmux-256color` profile because you already had it installed, you
might have an old version, so try installing the latest with the commands above.

[Neovim]: https://neovim.io/
[tmux]: https://github.com/tmux/tmux
[Alacritty]: https://alacritty.org/
[@dpom@fosstodon.org]: https://chaos.social/@dpom@fosstodon.org/113547970039697221
