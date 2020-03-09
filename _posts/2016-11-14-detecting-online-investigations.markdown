---
title: "Detecting online investigations"
layout: post
date: 2016-11-14 13:37
headerImage: false
category: blog
author: michenriksen
---

I recently purchased a license for [Hunchly](https://www.hunch.ly/), an awesome tool for performing online investigations and general research on the web. The tool seems to be very popular among criminal investigators, journalists and OSINT geeks like me.

For those who don't know, Hunchly is a tool that integrates directly into your browser through an extension to record and store local copies of every website you visit during an investigation. This is very convenient when doing OSINT investigations as you never loose anything, even if it gets deleted at a later time, and it makes it easy to trace your steps to how you found a particular piece of information.

Another great feature of Hunchly is the ability to associate so-called *selectors* to cases. Selectors are basically specific strings of interest that Hunchly will then keep track of, and notify you whenever these selectors are found on websites you visit. Selectors would normally be things like names, email addresses, phone numbers, domains and anything else that is relevant to the person or subject you are investigating.

Hunchly can be configured to automatically highlight these selectors on websites when they are encountered. It is not enabled by default, but I'm sure it's a very common setting to enable as it makes it very easy to spot the relevant parts when browsing:

<div class="thumb-image">
  <a href="/assets/images/hunchly/hunchly_selectors.png"><img src="/assets/images/hunchly/hunchly_selectors_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Highlighted selectors on the michenriksen.com frontpage.</figcaption>
</div>

The above screenshot shows how my website's frontpage looks like when Hunchly is configured with the selectors: *Michael Henriksen*, *SoundCloud* and *Gitrob*. All occurrences of these strings are highlighted with a yellow background.

Since Hunchly is highlighting the selectors by modifying the HTML before it's displayed in the browser, I started thinking about how a tech-savvy criminal, or anyone doing activities that would cause people to investigate them, such as an activist, could exploit this feature to detect the fact that someone is actively investigating them, and even get a sense of what the investigator knows and what they are interested in.

This is how Hunchly highlights selector strings:

```html
<mark data-markjs="true" class="hunchly">selector text</mark>
```

Hunchly wraps the selectors in `<mark>` tags with a unique class of `hunchly` which can be used to very accurately determine that Hunchly is being used on a website.

Using a bit of Javascript, it is fairly easy for anyone worried about being investigated to detect it. Here is a small Proof Of Concept:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Detecting Hunchly</title>
</head>
<body>
  <div id="canary">
    John Doe johndoe@gmail.com 888444333
  </div>
  <script type="text/javascript">
    setTimeout(function() {
      var selectors = document.querySelectorAll("#canary mark.hunchly");
      if (selectors.length === 0) {
        console.log("No Hunchly selectors found in canary");
      } else {
        console.log("Found " + selectors.length + " Hunchly selector(s) in canary");
        selectors.forEach(function(item, i) {
          console.info("Investigator is interested in: " + item.textContent);
        });
        alert("Hi there, investigator!");
      }
    }, 200);
  </script>
</body>
</html>
```

On **line 9 - 11** a <div> element is defined with an ID of `canary`. This element would contain potential selectors that an investigator is likely to have entered into Hunchly. This should obviously not contain actual sensitive information that would help an investigator, but already publicly known information such as a name, public email address, etc. which is very likely for an investigator to have entered into Hunchly. It could also contain misinformation (e.g. a fake phone number) that has been planted on other websites. This would give the person under investigation an idea of where the investigator has already been, and what the investigator thinks they know about their target.

On **line 14** the Javascript is looking for any `<mark>` tags with a `hunchly` class within the `#canary` div element. If no elements are found, it simply logs *No Hunchly selectors found in canary* to the console.

**Line 18 - 22** is what is being executed if a Hunchly selector highlight is found within the `#canary` element. It logs the total amount of selectors detected and then loops over each selector to log the text that was highlighted. It finishes off with popping up an alert box with *Hi there, investigator!* as the message.

Instead of simply logging the information to the console, the script could easily be modified to call out to a backend script with Ajax or do something more aggressive like triggering a browser exploit, loading a [BeEF](http://beefproject.com/) hook, redirecting them to Goatse or anything else to mess with the investigator. I'm sure you can come up with other fun things to do...

Before I finish this post, I want emphasize that this is not meant as a diss to Hunchly, I think it's an excellent tool and would recommend it to anyone doing OSINT stuff. I simply felt like pointing out a potential problem with Hunchly's selector highlight feature, so if you are looking into someone who might be crazy enough to do stuff like this, you might want to turn that feature off. I don't know if this is the reason it is disabled as default, or if there is another reason. Anyways, check out [Hunchly](https://www.hunch.ly/) website or watch this [excellent video tutorial](https://www.youtube.com/watch?v=wA1ec0dPYhw) if you want to know more about the tool.
