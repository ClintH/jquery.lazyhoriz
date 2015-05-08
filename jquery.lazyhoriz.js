/**
*
* LAZYHORIZ
* Horizontal scrolling and lazy load
*
* MIT License
* Copyright 2015 Clint Heyer
* http://github.com/clinth
*
* Draws from Luis Almeida's 'jQuery Unveil'
* 	https://github.com/luis-almeida/unveil/blob/master/jquery.unveil.js
*
*/
;(function($) {
$.fn.lazyhoriz = function(options) {
	var $w = $(window),
		retina = window.devicePixelRatio > 1,
		attrib = 'data-src',
		$unloadedImages = this,
		$loadedImages = null,
		windowWidth = $w.width()
		maxItems = 0,
		selectedIndex = 0,
		resizeTimeout = null,
		scrollTimeout = null;

	var settings = $.extend({
		container: "#slides",
		parent: "header",
		slide: ".slide",
		images: ".ll",
		useHash: true,
		lazyLoad: true
	}, options)

	$container = $(settings.container);
	$parent = $(settings.parent);
	if (lazyLoad) {
		$unloadedImages = $(settings.images);
	}

	maxItems = $(settings.slide, $container).length;

	// Jump to item if its in hash
	if (settings.useHash && window.location.hash) {
		var h = window.location.hash;
		if (h.charAt('0') == "#") h = h.substr(1);
		try {
			selectedIndex = parseInt(h);
			showSelected(false);
		} catch (e) {}
	}

	function lazyLoad() {
		var threshold = windowWidth;
		var inView = $unloadedImages.filter(function() {
		  var $e = $(this);
      if ($e.is(":hidden")) return;
      var wl = $w.scrollLeft(),
          ww = wl + windowWidth,
          el = $e.offset().left,
          ew = el + $e.width();

      return ew >= wl - threshold && el <= ww + threshold;
		})
		inView.each(function(index, e) {
			$(e).attr('src', $(e).attr(attrib));
		})
		$unloadedImages = $unloadedImages.not(inView);
	}

	function handleResize() {
		$(settings.container +">div>div").css({
			height: window.innerHeight,
			width: window.innerWidth
		});
		
		$parent.css({
			height: window.innerHeight,
			width: window.innerWidth
		});
		resizeImages();
		showSelected(false);
  	if (settings.lazyLoad) lazyLoad();
	}

	// Returns currently selected element (jQuery wrapped)
	function getSelectedElement() {
		return $("#img-" + selectedIndex);
	}

	// Skip by a certain offset forward or backward (negative vector)
	function skip(vector, anim) {
		if (typeof anim == 'undefined') anim = true;
		var n = selectedIndex + vector;
		if (n < 0) n = 0;
		if (n >= maxItems) n = 0;
		selectedIndex = n;
		showSelected(anim);
	}

	function showSelected(anim) {
		if (typeof anim == 'undefined') anim = true;
		var sel = getSelectedElement();
		var newLeft = sel.parent().outerWidth() * selectedIndex;
		if (anim) {
			$parent.animate({
				scrollLeft: newLeft
			}, 500);			
		} else {
			$parent.scrollLeft(newLeft);
		}
		$(document).scrollTop(0);
		if (settings.useHash)
			window.location.hash = selectedIndex;

		if (settings.selectedChange)
			settings.selectedChange(sel, selectedIndex);
	}

	function handleScroll() {
		if (settings.lazyLoad) lazyLoad();
		var closest = Math.ceil($parent.scrollLeft() / getSelectedElement().parent().outerWidth());
		if (isNaN(closest) || closest >= maxItems) closest = maxItems-1;
		if (selectedIndex !== closest) {
			selectedIndex = closest;
			showSelected(true);
		}
	}

	 function resizeImages() {
    // Force image sizes to be re-calculated
		document.body.style.zoom = 1.0000001;
    setTimeout(function() {
    	document.body.style.zoom = 1;
    }, 100);  	
  }

	// Interaction events
 	$container.on("click", function(e) {
  	if (e.clientX < window.innerWidth /2) {
  		skip(-1);
  	} else {
  		skip(1);
  	}
  })

	// Listen to window events
	$w.resize(function() {
		windowWidth = $w.width();
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
			resizeTimeout = null;
		}
		resizeTimeout = setTimeout(handleResize, 200);
	});

	$parent.scroll(function() {
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
			scrollTimeout = null;
		}
		scrollTimeout = setTimeout(handleScroll, 200);
	})

	$w.on("keydown", function(e) {
		if (e.which == 39) {
			e.preventDefault();
			skip(1);
		} else if (e.which == 37) {
			e.preventDefault();
			skip(-1);
		}
	});

	$w.bind("load", handleResize);
  $w.bind("orientationchange", function() {
    handleResize();
  });

  handleResize();
}

})(window.jQuery);