// ==UserScript==
// @name         BRchan highlight removed
// @namespace    https://www.brchan.org/
// @version      1.0.1
// @author       yugo-salem, pngcrypt
// @include      http*://www.brchan.org/*
// @include      http*://brchan.org/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

;(function (root) {
'use strict';
	var $ = root.$,
		update_time = 60, // period of thread update (sec)
		latestPosts;

	// check jQuery, CloudFlare, in-thread & dollchan script
	if(!$ || !window.location.href.match(/\/res\/\d+/) || $('head title').text().match('CloudFlare') || $('#de-panel-buttons > a').length > 1)
		return;

	console.log('BRchan HL-removed started');

	$('head').append("<style>" +
		".post--removed {background-image: none !important; background-color: #faa !important; border-style: dotted !important}" +
		"</style>");

	function update() {
		$.ajax({
			url: document.location,
			cache: false,
			contentType: false,
			processData: false,
			dataType: 'text'
		})
		.success(function (data) {
			if(!latestPosts) {
				if(!(latestPosts = getPosts($(document)))) // get posts from page
					return;
			}
			var activePosts = getPosts($(data));
			if(!activePosts)
				return; // wrong answer
			var removed = $(latestPosts).not(activePosts);
			$.each(removed, function (index, value) {
				console.log('post #' + value + ' removed');
				$('#reply_' + value).addClass('post--removed');
			});
			latestPosts = activePosts;
		})
		.always(function() {
			setTimeout(update, update_time * 1000);
		});
	}

	function getPosts ($content) {
		var $thread = $content.find('div.thread');
		if(!$thread.length) 
			return null;
		return $thread.find('a.post_anchor').map(function () {
			return this.id;
		});
	}

	setTimeout(update, update_time * 1000);

})(window);
