// ==UserScript==
// @name         BRchan highlight removed
// @namespace    https://www.brchan.org/
// @version      1.0.0
// @author       yugo-salem
// @include      http*://www.brchan.org/*
// @include      http*://brchan.org/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

;(function (root) {
'use strict';
	var $ = root.$,
		update_time = 60, // period of thread update (sec)
		latestPosts = [];

	// check jQuery, CloudFlare, in-thread & dollchan script
	if(!$ || !window.location.href.match(/\/res\/\d+/) || $('head title').text().match('CloudFlare') || $('#de-panel-buttons > a').length > 1)
		return;
	console.log('BRchan HL-removed started');

	$('head').append("<style>" +
		".post--removed {background-image: none !important; background-color: #faa !important; border-style: dotted !important}" +
		"</style>");


	(function update() {
		var xhr = $.ajax({
			url: document.location,
			cache: false,
			contentType: false,
			processData: false
		}, 'html')
		.success(function (data) {
			var activePosts = getPosts($(data));
			var removed = difference(latestPosts, activePosts);
			$.each(removed, function (index, value) {
				console.log('post #' + value + ' removed');
				$('#reply_' + value).addClass('post--removed');
			});
			latestPosts = activePosts;
		})
		.always(function() {
			setTimeout(update, update_time * 1000);
		});
	})();

	function difference (first, second) {
		var merged = {};
		$.each(first, function (index, value) {
			merged[value] = null;
		});
		$.each(second, function (index, value) {
			delete merged[value];
		});
		return $.map(merged, function (v, k) {
			return k;
		});
	}

	function getPosts ($content) {
		return $content.find('.post_no:not(:contains("No."))').map(function () {
			return $(this).text();
		});
	}
})(window);
