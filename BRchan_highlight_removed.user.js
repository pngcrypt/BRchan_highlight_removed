// ==UserScript==
// @name         BRchan highlight removed
// @namespace    https://www.brchan.org/
// @version      1.0.5
// @author       yugo-salem, pngcrypt
// @updateURL    https://raw.github.com/pngcrypt/BRchan_highlight_removed/master/BRchan_highlight_removed.meta.js
// @include      http*://www.brchan.org/*
// @include      http*://brchan.org/*
// @include      http://brchanansdnhvvnm.onion/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

;(function (root) {
'use strict';
	var $ = root.$,
		update_time = 60, // period of thread update (sec)
		hide_mode = 1; // 0 - show deleted, 1 - minimize; 2 - hide

	// check jQuery, CloudFlare, in-thread & dollchan script
	if(!$ || !window.location.href.match(/\/res\/\d+/) || $('head title').text().match('CloudFlare') || $('#de-panel-buttons > a').length > 1)
		return;

	console.log('BRchan HL-removed started');

	$('head').append("<style>" +
		".post--removed {background-image: none !important; background-color: #faa !important; border-style: dotted !important;}" +
		".post--min > div, .post--min > .controls {display: none;}" +
		".post--min:hover > div, .post--min:hover > .controls {display: block;}" +
		".post--hide, .post--hide + br {display: none !important;}" +
		"</style>");

	function update() {
		// update thread (get new posts)
		$.ajax({
			url: document.location,
			cache: false,
			contentType: false,
			processData: false,
			dataType: 'text'
		})
		.done(function (data) {
			var latestPosts = getPosts($(document)); // get posts from page
			if(!latestPosts) 
				return; // wrong year...
			var activePosts = getPosts($(data)); // get new posts
			if(!activePosts)
				return; // wrong answer
			activePosts = $(latestPosts).not(activePosts); // deleted posts
			$.each(activePosts, function (index, value) {
				console.log('post #' + value + ' removed');
				$('#reply_' + value)
					.addClass('post--removed ' + hide_mode)
					.find('a.post_no').attr('id', value); // add id in post_no (disable counter in Rusifikator)
			});
		})
		.always(function() {
			setTimeout(update, update_time * 1000);
		});
	}

	function getPosts ($content) {
		var $thread = $content.find('div.thread');
		if(!$thread.length) 
			return null;
		return $thread.find('.post:not(.post--removed) a.post_anchor').map(function () {
			return this.id;
		});
	}

	hide_mode = hide_mode == 1 ? 'post--min' : (hide_mode == 2 ? 'post--hide' : '');
	setTimeout(update, update_time * 1000);

})(window);
