---
title: "Birdwatcher: Data analysis and OSINT framework for Twitter"
layout: post
date: 2016-10-14 13:37
image: /assets/images/birdwatcher/workspace.png
headerImage: false
category: blog
projects: true
author: michenriksen
---

Yes, here again with another tool release. This time it's an [OSINT](https://en.wikipedia.org/wiki/Open-source_intelligence) framework for a different social network — [Twitter.com](https://twitter.com/).

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/start.png"><img src="/assets/images/birdwatcher/start_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Birdwatcher framework.</figcaption>
</div>

[Birdwatcher](https://github.com/michenriksen/birdwatcher) started out as a collection of small scripts to generate a classic weighted word cloud of Tweets from a group of users. As I thought about what else I could do with data from Twitter I decided to rewrite the scripts into a full-fledged, module based, console framework with a ton more functionality.

If you have any experience working with other frameworks such as [Metasploit](https://www.metasploit.com/) or [Recon-ng](https://bitbucket.org/LaNMaSteR53/recon-ng), you will feel right at home with Birdwatcher as it's heavily inspired by these frameworks and has many of the same concepts and commands.

This blog post won't go over how to set up Birdwatcher, but you can have a look at the [README](https://github.com/michenriksen/birdwatcher#birdwatcher) to find out how to [install](https://github.com/michenriksen/birdwatcher#installation) and [configure](https://github.com/michenriksen/birdwatcher#configuration) the framework.

## Workspaces

Just like Metasploit and Recon-ng, Birdwatcher supports the concept of Workspaces. Workspaces enable you to segment and manage users and data stored in the underlying database. You can use workspaces to create logical separation between different users. For example, you may want to create a workspace for a company, a department or for a specific topic.

The command prompt will always show the currently active workspace inside the square brackets. Birdwatcher will always have a default workspace which might be all you need if you intend to use Birdwatcher on a single group of users. If you plan to use it on several different groups, it is recommended to create a workspace for each of them, to prevent cross contamination.

## Commands

The core of the Birdwatcher framework is its commands and one of the most important ones is the `help` command:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/help.png"><img src="/assets/images/birdwatcher/help_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Executing the help command.</figcaption>
</div>

The help command simply lists all available commands with short descriptions of what they do.

## Modules

Again, just like Metasploit and Recon-ng, Birdwatcher ships with a bunch of modules that either enrich the raw Twitter data harvested by the commands or somehow present the data in interesting and useful ways. Here are some of the things the modules can currently do:

* Retrieve user's Klout score, Tweet topics and influence graph
* Generate weighted word clouds based on user's Tweets
* Listing the most shared URLs
* Generate graphical social graphs between users
* Crawl shared URLs to retrieve HTTP status codes, content types and page titles
* Generate KML files with geo-enabled Tweets to be viewed in Google Earth
* Generate Punchcard-style plots of when users are most engaged with Twitter
* Calculate the sentiment score of Tweets (positive, neutral or negative)

Birdwatcher's code is designed to make it pretty simple for anyone with a bit of Ruby knowledge to extend Birdwatcher with new modules. How to create one is out of scope for this blog post, but have a look at this [Wiki article](https://github.com/michenriksen/birdwatcher/wiki/Creating-a-Birdwatcher-Module) if you are interested in finding out more.

## LOVELY HORSE

If you have been following the news around the Snowden documents, you might have heard of a program by the UK intelligence agency GCHQ called [LOVELY HORSE](http://www.mirror.co.uk/news/technology-science/technology/gchqs-lovely-horse-tool-helped-5133474). The program was made to simply monitor a smaller group of security related Twitter accounts to keep taps on what was being said and possibly more.

To demonstrate the capabilities and usage of Birdwatcher, I thought it would be fun to go through how we can create our own LOVELY HORSE program...

### Creating a new workspace

Instead of using the default workspace, let's create a dedicated one for our lovely horses to keep things neat and tidy:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/workspace.png"><img src="/assets/images/birdwatcher/workspace_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Creating a new workspace.</figcaption>
</div>

The `workspace add` command created our new workspace and automatically made it the currently active one, as can be seen in the square brackets of the command prompt.

### Adding users to the workspace

Now that we have our workspace we need to add some users to it so we have something to work with. The [leaked PDF](https://s3.amazonaws.com/s3.documentcloud.org/documents/1588722/lovely-horse.pdf) contains a list of 37 Twitter accounts that we will use for this example:

```
0xcharlie
alexsotirov
anon_central
anon_operations
anonops
anonymousirc
bradarkin
CeRTFi
danchodanchev
daveaitel
dinodaizovi
diocyde
egyp7
GoVCeRT_NL
halvarflake
hdmoore
hernano
JaNeTCSiRT
kevinmitnick
lennyzeltser
lulzsec
mdowd
mikko
msftsecresponse
operationleaks
owasp
pusscat
Shadowserver
snowfl0w
taosecurity
taviso
teamcymru
thegrugq
TheHackersNews
tinman2k
VuPeN
WTFuzz
```

One way to add the users would be to execute `user add 0xcharlie alexsotirov ... WTFuzz` but that would be a lot of typing and I don't really like that. Instead we can make use of our first module to easily import them into the workspace. We copy the usernames and save them to a file and load the User Importer module:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/module_info.png"><img src="/assets/images/birdwatcher/module_info_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">The User Importer module.</figcaption>
</div>

The `use` command loads a module by its path. The path is determined simply by how the module files are placed in the directory stucture. Modules live inside at least one directory which can be seen as a namespace of the type of object they are working on. In this case the User Importer lives in the `users/` namespace which makes pretty good sense. When a module is loaded it is also indicated in the command prompt with another set of square brackets with the module's path in red text.

After loading the module we type `show info` to get a bit more information on what the module does. All modules have additional information that can be seen with the `show info` command.

The `show` command can also display any options a module might have:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/module_options.png"><img src="/assets/images/birdwatcher/module_options.png" class="image" alt="" /></a>
  <figcaption class="caption">Options for the User Importer module.</figcaption>
</div>

The module is very basic and only has one option called `FILE` which tells the module which file to read usernames from. The table tells us that the option is required to set and that the current value is empty. Let's configure the module and run it:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/user_import.png"><img src="/assets/images/birdwatcher/user_import_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Importing users.</figcaption>
</div>

The module fetched basic user information from the Twitter API and saved them to the underlying database. We can see the users in the current workspace at any time with the `user list` command:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/user_list.png"><img src="/assets/images/birdwatcher/user_list_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Paging through users in the workspace.</figcaption>
</div>

### Fetching Tweets

Now that we have imported our lovely horses we can fetch their Tweets from the Twitter API and have them saved to the database for analysis:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/status_fetch.png"><img src="/assets/images/birdwatcher/status_fetch_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Fetching Tweets from users.</figcaption>
</div>

The `status fetch` command will fetch up to 1.000 Tweets from each user and save them to the database. The command also extracts entities such as URLs, Mentions and Hashtags to save them to separate database tables. The command might take a bit of time to finish the first time because of all the Tweets it needs to fetch and process, however on any subsequent runs, it only fetches and processes any Tweets the users might have posted since the last run.

Now that we have fetched the Tweets we can page through them with the `status list` command:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/status_list.png"><img src="/assets/images/birdwatcher/status_list_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Listing Tweets from users.</figcaption>
</div>

Using the `status search` command we can find Tweets containing a specific word or phrase, for example *lovelyhorse*:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/status_search.png"><img src="/assets/images/birdwatcher/status_search_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Searching for Tweets mentioning <em>lovelyhorse</em>.</figcaption>
</div>

### Crawling URLs

After the Tweets have been fetched and processed we also have a pretty large collection of URLs that might point to interesting or valuable information. Right now we only know the URLs that were shared which can pretty hard to process. To get a better idea of which links might be interesting we can use the URL Crawler module:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/url_crawl_info.png"><img src="/assets/images/birdwatcher/url_crawl_info_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Loading the URL Crawler module.</figcaption>
</div>

As the module information says, it enriches the collected URLs with their HTTP status codes, content types and potentially page titles if the URL points to a HTML page with a title. The module also follows redirects so in case the URL is somehow obfuscated or shortened we can know the actual destination too.

The module also warns us that it might not be safe to blindly visit all the shared URLs as it could be pointing at places you don't want to request with your own IP. Let's check the module's options to see what we can do:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/url_crawl_options.png"><img src="/assets/images/birdwatcher/url_crawl_options_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Viewing options for the URL Crawler module.</figcaption>
</div>

This module has a bit more options than the `users/import` module. None of them are required but the `PROXY_ADDR` and `PROXY_PORT` are definitely a good idea to configure. The options will instruct the module to request all URLs through a HTTP proxy to hide the origin of the request for your own safety and OPSEC. I personally have [Tor](https://www.torproject.org/) installed and its SOCKS proxy exposed as an HTTP proxy with Polipo. Check out this [blog post](https://www.marcus-povey.co.uk/2016/03/24/using-tor-as-a-http-proxy/) if you want to know how it's done.

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/url_crawl.png"><img src="/assets/images/birdwatcher/url_crawl_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Crawling URLs for more information.</figcaption>
</div>

We configure the module to use a proxy and run it. It will steadily crunch through the URLs but it might take a while to finish, depending on your connection speed, proxy, `THREADS` setting and the amount of URLs to crawl. The first time you run this module it can take quite a long time as it needs to process a lot of URLs.

### Getting Klout information

The [Klout API](https://klout.com/s/developers/v2) can give us a lot of valuable information on users such as their ][Klout score](https://klout.com/corp/score) which can be used to find users with the most reach and influence, the general topics they are Tweeting about, and an influence graph which can tell us who each user is influencing and who they are being influenced by.

The first module we need to run is the `users/klout_id` module. This module simply retrieves each user's Klout ID which is needed for all the other Klout related modules:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/klout_id.png"><img src="/assets/images/birdwatcher/klout_id_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Retrieving user's Klout ID.</figcaption>
</div>

Next we run the `users/klout_topics` module which retrieves the general topics that each user is Tweeting about such as Technology, Hacking, Marketing, Information Security, etc. Each topic will be saved in a table and referenced through a join table to users, to make it easy to retrieve users who Tweet, or don't Tweet, about a specific topic:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/klout_topics.png"><img src="/assets/images/birdwatcher/klout_topics_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Retrieving user's Klout topics.</figcaption>
</div>

If we want to know about how influential each user is, we can use the `users/klout_score` module to retrieve their Klout score. The score is calculated by Klout and is explained here, but the higher the score the more influential the user is:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/klout_score.png"><img src="/assets/images/birdwatcher/klout_score_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Retrieving user's Klout scores.</figcaption>
</div>

From the output we can see that mikko is the most influential followed by hdmoore and thegrugq. The klout score will of course also be saved to the database to make querying based on Klout scores possible.

Lastly we will run the `users/klout_influence` module to retrieve information about who our users are being influenced by and who they are influencing:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/klout_influence.png"><img src="/assets/images/birdwatcher/klout_influence.png" class="image" alt="" /></a>
  <figcaption class="caption">Retrieving user's Klout influence.</figcaption>
</div>

### Making a word cloud

A great way to get a quick sense of what the users are talking about is to use the `statuses/word_cloud` module. The module can generate a classic weighted word cloud based on Tweets from all users, or a smaller selection, within a window of time. The module has quite a lot of options for customization:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/word_cloud_options.png"><img src="/assets/images/birdwatcher/word_cloud_options_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Viewing options for the Word Cloud module.</figcaption>
</div>

We configure the module with a file destination for the generated image and set `INCLUDE_PAGE_TITLES` to true in order to mix in the page titles we previously retrived with the `urls/crawl` module. This gives an even better idea of the topics our users have been talking about over the last seven days:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/word_cloud.png"><img src="/assets/images/birdwatcher/word_cloud_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Generating a word cloud from Tweets.</figcaption>
</div>

The result is a pretty word cloud that tells us what has been on our lovely horse's mind over the last seven days:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/word_cloud_result.png"><img src="/assets/images/birdwatcher/word_cloud_result_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">The result of the word cloud module.</figcaption>
</div>

### Generating an influence graph

The raw influence data we retrieved earlier with `users/klout_influence` can be visualized and examined with the `users/influence_graph` module:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/influence_graph.png"><img src="/assets/images/birdwatcher/influence_graph_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">The influence graph visualized.</figcaption>
</div>

Another type of graph we can generate is a social graph that doesn't use Klout's influence data but instead finds social connections by analyzing each user's Tweets for mentions of other users:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/social_graph.png"><img src="/assets/images/birdwatcher/social_graph_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Calculating the social graph between users.</figcaption>
</div>

The resulting graph is a bit different from the influence graph and shows a very tightly coupled cluster between some users. The edge weight between users is calculated simply by counting how many times they mention each other in Tweets. The thicker the line, the stronger the connection between two users:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/social_graph_result.png"><img src="/assets/images/birdwatcher/social_graph_result_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">The social graph visualized.</figcaption>
</div>

### Plotting a user's Twitter engagement

Another question you might ask is at what day and time a user is most engaged with Twitter. This might be useful for finding the time where a user is most likely to engage with you on Twitter. We can use the `users/activity_plot` module to get an idea of this:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/activity_plot.png"><img src="/assets/images/birdwatcher/activity_plot_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Generating an activity plot for <em>halvarflake</em>.</figcaption>
</div>

The resulting plot tells us that halvarflake is generally very engaged with Twitter on Fridays at around 8AM and Tuesdays & Wednesdays at around 7PM:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/activity_plot_result.png"><img src="/assets/images/birdwatcher/activity_plot_result_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption"><em>halvarflake</em>'s activity plot.</figcaption>
</div>

### Listing shared URLs

The last module I want to demonstrate in this blog post is the `urls/most_shared` module. The module will simply list URLs shared within a specific window of time ordered from most to least shared. If a URL has been shared by several users it is a pretty good indicator that it has interesting information:

<div class="thumb-image">
  <a href="/assets/images/birdwatcher/most_shared.png"><img src="/assets/images/birdwatcher/most_shared_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Paging through the shared URLs.</figcaption>
</div>

Because we ran the `urls/crawl` module earlier we also see page title, content type and HTTP code which is very convenient. Because I used Tor as an HTTP proxy we also ran into a CloudFlare CAPTCHA wall.

## Wrapping up

This concludes my first post on Birdwatcher. I hope you enjoyed it and hope you will include it in your OSINT toolbox. Feel free to file any bugs on [GitHub](https://github.com/michenriksen/birdwatcher/issues/new) or give me ideas for new modules.
