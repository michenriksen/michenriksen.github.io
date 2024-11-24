---
title: "Weeknotes 2024 w47: quadratus lumborum"
date: "2024-11-24"
summary: "Michael's weeknotes for November 18-24, 2024."
categories: ["weeknotes"]
---

- I've been dealing with lower back and hip pain for a while and decided to get it checked by a physiotherapist. I was
worried that I was doing something very wrong in the gym, and about to pop a disc or something, but it turned out to be
a strained [Quadratus Lumborum] and a slightly pinched [Sciatic nerve]. This should sort itself out with light training
and treadmill walking. Phew.
- A random thought: I wonder if a [two-person rule] system has ever been implemented in a web application to safeguard
a critical function? Let's say a UI flow for deleting an organizational account and its entire Cloud
infrastructure: Two admins are required to sign in, enter an {{< sidenote "OTP," >}}One-Time Password or PIN, like the ones in Google Authenticator.{{< /sidenote >}}
and coordinate pressing a button at the same time, with a tolerance of ~300 milliseconds.
- Living right next to a cemetery is nice with all the pretty trees and such, but the daily noise from gasoline-powered
leaf blowers in this time of the year is really grinding my gears.
- Go 1.24 will introduce a new [os.Root] type that restricts file operations to a specific directory, which is neat
for preventing [path traversal] vulnerabilities.
- I'm trying to take a break from {{< sidenote "ADHD meds" >}}Lisdexamfetamine stimulant sold under the brand names Vyvanse and Elvanse.{{< /sidenote >}}
to see how it goes. I definitely feel that I benefit from it, but the constant check-ups, prescription circus, and the
price is an annoying factor. Trying to function with zero dopamine is pretty rough at the moment, though...


## Interesting links

- [The Secret Behind Valve’s Flickering Lights]: Cool analysis of how light effects are done in many of Valve's games.
- [Listen to what gets lost when an MP3 is made]: An article from 2015 about a project called "moDernisT" that lets you
listen to what is lost in MP3 compression.
- [Some surprising code execution sources in bash]: A quick note on some sneaky code execution sources in Bash that I
was not aware of.
- [Jujutsu: A Haven for Mercurial Users at Mozilla]: An introduction to an interesting version control tool called
[Jujutsu]. It uses Git under the hood, which I think is a cool design decision, since Git is used almost everywhere. I
might try it out on my personal projects.
- [Nuclear Waste Software License]: A [Mastodon post] reminded me of this one. I need to license something under it one
day.

[Quadratus Lumborum]: https://en.wikipedia.org/wiki/Quadratus_lumborum_muscle
[Sciatic nerve]: https://en.wikipedia.org/wiki/Sciatic_nerve
[two-person rule]: https://en.wikipedia.org/wiki/Two-person_rule
[os.Root]: https://tip.golang.org/doc/go1.24#directory-limited-filesystem-access
[path traversal]: https://owasp.org/www-community/attacks/Path_Traversal
[The Secret Behind Valve’s Flickering Lights]: https://www.alanzucconi.com/2021/06/15/valve-flickering-lights/
[Listen to what gets lost when an MP3 is made]: https://www.vox.com/2015/3/4/8147377/mp3-compressed-ghosts
[Some surprising code execution sources in bash]: https://yossarian.net/til/post/some-surprising-code-execution-sources-in-bash
[Jujutsu: A Haven for Mercurial Users at Mozilla]: https://ahal.ca/blog/2024/jujutsu-mercurial-haven/
[Jujutsu]: https://martinvonz.github.io/jj/latest/
[Nuclear Waste Software License]: https://github.com/ErikMcClure/bad-licenses/blob/master/NWSL
[Mastodon post]: https://hachyderm.io/@jenniferplusplus/113536381038780530
