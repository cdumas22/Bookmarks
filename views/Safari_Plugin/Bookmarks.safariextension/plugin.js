safari.application.addEventListener("popover", function(){
	$('input[name=title]').val(safari.application.activeBrowserWindow.activeTab.title);
	$('input[name=url]').val(safari.application.activeBrowserWindow.activeTab.url);
	//var favicon = safari.application.activeBrowserWindow.activeTab.

	var tags = [];




	$.get("http://localhost:3001/bookmarks", function (response) {
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
	
}, false);
$(".form-actions").on("click", "a", function(e){
    e.preventDefault();
    e.stopPropagation();
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
                //favicon: tabs[0].favIconUrl,
                created: new Date()
            }

            $.post("http://localhost:3001/bookmarks", obj, function () {});
            setTimeout(function () { 
				safari.extension.popovers["bookmarkPopover"].hide();
			}, 300);
      
});
$("body").on("click", ".cancel", function(){
	safari.extension.popovers["bookmarkPopover"].hide();
});