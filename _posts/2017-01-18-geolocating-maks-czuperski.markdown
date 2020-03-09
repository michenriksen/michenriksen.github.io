---
title: "Geolocating Maks Czuperski"
layout: post
date: 2017-01-18 13:37
image: /assets/images/geolocation/whereami_gold_mountain.png
headerImage: false
category: blog
author: michenriksen
---

The other day while checking my Twitter feed, I came across an interesting retweet from [Elliot Higgins](https://twitter.com/EliotHiggins), the founder of [Bellingcat](https://www.bellingcat.com/):

<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/DigitalSherlocks?src=hash">#DigitalSherlocks</a> out there!—Where am I? <a href="https://t.co/4eXw7BuMj8">pic.twitter.com/4eXw7BuMj8</a></p>&mdash; Maks Czuperski (@MaksCzuperski) <a href="https://twitter.com/MaksCzuperski/status/819510013148463105">January 12, 2017</a></blockquote>

This looked like a fun challenge and being the OSINT geek that I am, I couldn't let it pass. Here is how I geolocated Maks Czuperski:

First thing was of course to get a copy of the image. Right-click and *Copy Image Address* gave me a good 2048x1536px version where details could be picked out.

<div class="thumb-image">
  <a href="/assets/images/geolocation/whereami.png"><img src="/assets/images/geolocation/whereami_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">The picture from Maks Czuperski's tweet.</figcaption>
</div>

The location did not look familiar to me and there were no famous buildings in the background, readable street signs or other easy wins to quickly figure out the location. The building across the plaza did have a kind of interesting shape and colors, so the first thing I tried was to cut out a piece of the picture with part of the building clearly visible without obstructions, and upload it to Google's reverse image search. It is quite impressive, and almost eerie, what Google can recognize in images. This time however, I had no luck. I also tried with a crop of the walkway pattern in the lower area of the picture, but no luck there either.

Next step was to zoom in on the image and comb it for any details that could give me a hint to its location. This was when I spotted the store signs in the lower right corner of the image:

<div class="thumb-image">
  <a href="/assets/images/geolocation/whereami_zoom.png"><img src="/assets/images/geolocation/whereami_zoom_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">An Expert store is visible in the image.</figcaption>
</div>

I was lucky to know that Expert is an electronics store from my time living in Denmark and, assuming that Expert only has stores in Denmark, I wondered if it could be somewhere in Copenhagen perhaps. A quick Google search led me to the company's [Wikipedia article](https://en.wikipedia.org/wiki/Expert_(company)) which stated that Expert operates in several countries a part from Denmark:

* Norway
* Denmark
* Sweden
* Faroe Islands
* Åland Islands
* Finland
* Estonia
* Belgium
* Germany
* Greece
* Ireland
* France
* Austria
* Czech Republic
* Iceland
* Italy
* The Netherlands
* Portugal
* Spain
* Slovakia
* Australia/New Zealand
* Croatia
* Hungary

This made the list of potential places quite a bit bigger, but at least it was narrowed down to a handful of countries. I combed through the picture once more to find any other details I could pair with this information and pretty quickly spotted a sign for a place called "Gold Mountain" right next to the Expert shop:

<div class="thumb-image">
  <a href="/assets/images/geolocation/whereami_gold_mountain.png"><img src="/assets/images/geolocation/whereami_gold_mountain_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">A place called Gold Mountain next to Expert.</figcaption>
</div>

I had never heard of Gold Mountain before, and it was my hope that this would be a bit more unique than Expert. I made the assumption that he was most likely in a capital city, or at least a bigger city, in one of the countries where Expert operates. My plan was now to perform a search for *Gold Mountain* combined with the capital city name for each country in the list:

<div class="thumb-image">
  <a href="/assets/images/geolocation/google_gold_mountain.png"><img src="/assets/images/geolocation/google_gold_mountain_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Googling for <em>Gold Mountain</em> in Oslo.</figcaption>
</div>

Bingo! I was lucky that the capital for the first country in the list yielded a result that looked like the right place. The Google Streetview image to the right of the search results looked like it had the funnily shaped building in the background, and sure enough, clicking on it [landed me](https://encrypted.google.com/maps/uv?hl=en&pb=!1s0x46416e87584d4a15:0xec11d10f5cae7d6c!2m19!2m2!1i80!2i80!3m1!2i20!16m13!1b1!2m2!1m1!1e1!2m2!1m1!1e3!2m2!1m1!1e5!2m2!1m1!1e4!3m1!7e115!4s/maps/place/%2522golden%2Bmountain%2522%2Boslo/@59.9130538,10.7342323,3a,75y,315.79h,90t/data%3D*213m4*211e1*213m2*211sg-lA7LDc3hCsqgBfS2QtPQ*212e0*214m2*213m1*211s0x0:0xec11d10f5cae7d6c?hl%3Den!5s%22golden+mountain%22+oslo+-+Google+Search&imagekey=!1e2!2sg-lA7LDc3hCsqgBfS2QtPQ&sa=X&ved=0ahUKEwjzu6bc8MvRAhXGAxoKHTyXDIUQpx8IbjAK) straight on the plaza in the picture!

I pretty quickly determined the direction that the picture was taken from and tweeted at Maks Czuperski:

<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/MaksCzuperski">@MaksCzuperski</a> <a href="https://twitter.com/EliotHiggins">@EliotHiggins</a> Somewhere here? <a href="https://t.co/FplgM8BPop">pic.twitter.com/FplgM8BPop</a></p>&mdash; Michael Henriksen (@michenriksen) <a href="https://twitter.com/michenriksen/status/819517437259476992">January 12, 2017</a></blockquote>

After a while he replied and asked me to be more precise. I tried to narrow it down further:

<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/MaksCzuperski">@MaksCzuperski</a> <a href="https://twitter.com/EliotHiggins">@EliotHiggins</a> My guess would be one of these top windows. It&#39;s Fridtjof Nansens Plass in Oslo. <a href="https://t.co/y1TmuzmoyU">pic.twitter.com/y1TmuzmoyU</a></p>&mdash; Michael Henriksen (@michenriksen) <a href="https://twitter.com/michenriksen/status/819527342745878528">January 12, 2017</a></blockquote>

I managed to narrow it down to a couple of windows where the picture could have been taken from, which I think was pretty cool. It was a super fun exercise and I wish someone would arrange daily or weekly geolocation challenges like this!

If you find this sort of stuff interesting, you should definitely check out [Bellingcat](https://www.bellingcat.com/)'s articles and guides. In case you haven't heard of them, here's a short description of what they are about, from their own website:

> Bellingcat uses open source and social media investigation to investigate a variety of subjects, from Mexican drug lords to conflicts being fought across the world. Bellingcat brings together contributors who specialise in open source and social media investigation, and creates guides and case studies so others may learn to do the same.

As a little bonus to my investigation, I later came across the following tweet:

<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr">Thanks, <a href="https://twitter.com/MaksCzuperski">@MaksCzuperski</a> for more insight on social media and the engagement age. <a href="https://twitter.com/Atlantkomite">@Atlantkomite</a> <a href="https://t.co/9eTyvf0NSN">pic.twitter.com/9eTyvf0NSN</a></p>&mdash; Marita I. Wangberg (@FD_Marita) <a href="https://twitter.com/FD_Marita/status/819497169413607424">January 12, 2017</a></blockquote>

The picture shows Maks Czuperski doing a presentation on geolocation stuff at the Norwegian Atlantic Committee. He apparently used his geolocation challenge tweet as part of his presentation, to demonstrate how quickly someone could find him. Pretty cool!

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
