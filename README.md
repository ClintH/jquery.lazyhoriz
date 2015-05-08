# What is it?

For making a pretty decent immersive, responsive, horizontally-scrolling image gallery. With lazy loading. Particularly designed for photography.

[Demo](http://heyer.photography)

Tested in Chrome, Android and iOS.

Bonus features:
* URL hash changes so that position within the scroll can be recalled/deep-linked (can be disabled)
* Handles device re-orientation

# Why does it exist?

I evaluated a heck of a lot of plugins and code snippets, and ended up rolling my own. The reason for this is that most: 1) don't do a good job of respecting the aspect ratio of the image 2) bleed pixels off outside of the viewport area 3) don't work well for both cursor and touch

# Requirements

Some structuring of your HTML DOM is required. The assumptions made by the JS and included CSS require the following:

```
<header>
    <div id="slides">
        <div class="slide">
            <img id="img-0" class="ll" data-src="http://urltoimage" title="Title of image">
        </div>
        <div class="slide">
        ...
        </div
    </div>
</header>
```

Setting options (see below) allow you to be more flexible with your ids and classes.

I'm using a static file generator (Hexo) which automatically generates this structure based on a folder of JPEGs. You can set something like this up yourself, or manually make a set of slide DIVs. Importantly, each IMG has an incrementing id in the order they appear, left to right and starting at 0.

# Usage

Once you've got your DOM in order, added the JS file via a SCRIPT tag and have the necessary CSS, use the following to initialise:

```
$(document).lazyhoriz({  
    selectedChange: function(sel, selectedIndex) {
        // example: grab the title from selected image
        // and set it to a div
        var title = sel.attr("title");
        $("#photoInfo").text(title);
    }
})
```

Other options that can be passed in during init:

| key       | default |                                                                             |
|-----------|---------|-----------------------------------------------------------------------------|
| container | #slides | Container of child slide divs (selector)                                    |
| parent    | header  | Main parent of everything (selector)                                        |
| slide     | .slide  | Slide (selector)                                                            |
| images    | .ll     | Image element (selector)                                                    |
| useHash   | TRUE    | If true, URL hash is used to set initial image and to reflect current (bool |
| lazyLoad  | TRUE    | If true, will attempt to lazy load images from data-src attribute (bool)    |



## Callback

The 'selectedChange' callback can be used to hear back when a new image is currently showing.

## Placeholder

Put a regular `src` attribute in the image if you want to have a placeholder image show before images are loaded. This might even be a super low-res version of the final image.

## Noscript

Include something like this inside of your the slide DIVs to ensure images appear if Javascript is disabled:

```
<noscript><img src="http://urltoimage" title="Title of image"></noscript>
```
