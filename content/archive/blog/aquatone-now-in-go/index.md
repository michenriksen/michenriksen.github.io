---
title: "AQUATONE: Now in Go"
date: 2018-11-04
aliases:
- "/blog/aquatone-now-in-go"
archive: true
---

I'm continuing my quest to move my open source tools from Ruby to Go. Earlier this year, I released the [Go rewrite of Gitrob](/blog/gitrob-now-in-go/) and now I'm happy to announce the release of a new and streamlined version of Aquatone!

## What's Changed

Quite a lot has changed in the new version. The two major themes of the rewrite is simplification and ease-of-use:

### No DNS enumeration

Yes, Aquatone is now completely focused on screenshotting and reporting. I know a lot of people used Aquatone for its DNS enumeration capabilities and it was definitely very good at that when it was released. Now other tools are doing a much better job of this, so I decided to leave it out of the new Aquatone, and instead make it easy to use it with your tool of choice.

### Single command

Because Aquatone is now focused on one thing, it is now a single *aquatone* command. No more aquatone-discover, aquatone-scan and aquatone-gather.

### Screenshotting with Chrome

The old version used [Nightmare](http://www.nightmarejs.org/) for taking screenshots. This was very unreliable and introduced a big dependency with Node.js. The new version uses either Google Chrome or Chromium in headless mode to take screenshots, which is much more reliable.

## What's New

### Input Agnostic

Aquatone works by having input piped to it. It doesn't care about what this data looks like as IPs, hostnames, domains and URLs will be extracted from the input with regular expression matching. The output of all your tools can be piped to Aquatone and it should work fine, but you can of course clean it up with the usual terminal commands if needed.

### Support for Nmap/Masscan XML

If you have an XML output file from either [Nmap](https://nmap.org/) or [Masscan](https://github.com/robertdavidgraham/masscan), you can feed that to Aquatone too. Just add the `-nmap` flag to let Aquatone know to parse it properly.

### Clustering of similar sites

Sometimes it could be quite painful to scroll through the HTML report from the old Aquatone to find that unusual, vulnerable-looking page. The new Aquatone will now cluster pages with similar HTML structure together to make it much easier to digest the report and find the interesting stuff.

## Installation

Installing Aquatone is super easy. Simply head over to the project on Github and [download a pre-compiled binary](https://github.com/michenriksen/aquatone/releases) for your operating system.

Read more about installation and setup in the project [README](https://github.com/michenriksen/aquatone#installation).

**Enjoy!**

