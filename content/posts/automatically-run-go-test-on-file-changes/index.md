---
title: "Quick tip: Automatic test runs when files change"
date: "2023-12-17"
locale: "en_US"
categories: ["programming", "golang", "testing", "quick-tip"]
---

How to use watchexec to get instant feedback from your tests when you change a file in your Go project.
{.lead}
<!--more-->

I discovered [watchexec] a while ago and it's been a nifty tool to have for performing all kinds of tasks when
files change. It's a cross-platform tool written in Rust, well maintained, reliable, and easy to use.

One of the things I frequently use it for, is to automatically run tests for a package when I change a file in it:

```bash
watchexec       \
  -c clear      \
  -o do-nothing \
  -d 100ms      \
  --exts go     \
  'pkg=".${WATCHEXEC_COMMON_PATH/$PWD/}/..."; echo "running tests for $pkg"; go test "$pkg"'
```

- `-c clear` clears the screen before every run
- `-o do-nothing` drops any test runs if there's already one running
- `-d 100ms` debounces file changes for 100 milliseconds to allow for multiple changes to happen at once
- `-exts go` filters file events to only `.go` files
- `pkg=".${WATCHEXEC_COMMON_PATH/$PWD/}/..."` constructs the package path to run by trimming away the current working
  directory from a special environment variable that watchexec sets which holds the directory of the changed file

The command is a bit of a mouthful, so I can recommend setting up an alias for it:

```bash
# Automatically run `go test` for a package when files change.
alias autotest="watchexec -c clear -o do-nothing -d 100ms --exts go 'pkg=\".\${WATCHEXEC_COMMON_PATH/\$PWD/}/...\"; echo \"running tests for \$pkg\"; go test \"\$pkg\"'"
```

{{< admonition type="tip" title="Fancy web UI with gokiburi" >}}
I guess I can't mention automatic test runs without also mentioning a project of mine called [gokiburi]. It watches for
file changes similarly to watchexec, and presents the results in a spiffy web UI with coverage view, browser
notifications, sound notifications, and more.

[Read more on GitHub][gokiburi].

[gokiburi]: https://github.com/michenriksen/gokiburi
{{< /admonition >}}

[watchexec]: https://github.com/watchexec/watchexec
