$.browser = $.browser || {};
$.browser.chrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
$.browser.safari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

var tags = [];
var favicon = "";
var close = function(){
	if ($.browser.chrome){
		window.close();
	}
	if($.browser.safari){	
		safari.extension.popovers["bookmarkPopover"].hide();
	}
};
var getTags = $.get("http://localhost:3001/bookmarks", function (response) {
	    var tagsA = _.pluck(response, 'tags');
	    for (var i = 0; i < tagsA.length; i++) {

	        var a = tagsA[i];
	        for (var j = 0; j < a.length; j++) {
	            tags.push(a[j]);
	        }
	    }
	    tags = _.uniq(tags);
	    console.log(tags);
	    $("input[name=tags]").autocomplete({
	        lookup: tags,
	        delimiter: ",",
	        maxHeight: 80
	    });
	});
	
if ($.browser.chrome) {
	chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
	       function (tabs) {
	           $('input[name=title]').val(tabs[0].title);
	           $('input[name=url]').val(tabs[0].url);
			   favicon = tabs[0].favIconUrl;
	       }
	    );
}
if ($.browser.safari) {  //sadf
	safari.application.addEventListener("popover", function(){
		$('input[name=title]').val(safari.application.activeBrowserWindow.activeTab.title);
		$('input[name=url]').val(safari.application.activeBrowserWindow.activeTab.url);
		//var favicon = safari.application.activeBrowserWindow.activeTab.
		$('input[name=tags]').val("");
		getTags();
	}, false);
}

$(".form-actions").on("click", "a", function(e){
    e.preventDefault();
    e.stopPropagation();
    if($.browser.chrome)
		chrome.tabs.create({'url': $(this).attr("href")});
});
$("body").on("click", ".save", function (e) {
           var tags = ($('input[name=tags]').val()).split(",");
           for(var i = 0; i < tags.length; i++){
               tags[i] = tags[i].replace(/^\s*|\s*$/g, "");
           }
           var obj = {
                title: $('input[name=title]').val(),
                description: $('textarea[name=description]').val(),
                url: $('input[name=url]').val(),
                tags: tags,
                lock: false,
                favicon: favicon,
                created: new Date()
            }

            $.post("http://localhost:3001/bookmarks", obj, function () {});
            setTimeout(close, 300);
      
});
$("body").on("click", ".cancel", close);