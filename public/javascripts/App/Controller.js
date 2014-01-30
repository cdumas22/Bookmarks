define([
	"Bookmark/Models/BookmarkCollection",
    "Bookmark/Models/Bookmark",
    "radio"
	], 
function(BookmarkCollection, BookmarkModel, Radio){
    var Collections = {
        Bookmarks: new BookmarkCollection()
    };
	var GetBookmarks = function () {
            Collections.Bookmarks.fetch();
            return Collections.Bookmarks;
        };
	var GetBookmark = function(bookmarkId) {
            var bookmark = Collections.Bookmarks.get(bookmarkId);
            if(bookmark){
                return bookmark;
            } else {
                bookmark = new BookmarkModel({_id: bookmarkId});
                Collections.Bookmarks.add(bookmark);
                bookmark.fetch();    
                return bookmark;
            }
        };
    //if a bookmark is deleted than remove the collection of its episodes
    //this will keep the data clean
    Radio('delete').subscribe([function(data){
        //delete Collections[data._id];
    }, this]);

	return {
		//This is the central area to save all collections
		//we will start with an empty bookmarkCollection
		Collections: Collections,
		//CONTROLLER METHODS --Backbone doesn't have a controller but these methods do the same thing
        //the event listeners within the views will trigger their render method when values change, 
        //so on the ajax calls we dont care if all the data is available yet, only the minimal to build the view.
	    //when the data becomes available the view will re-render
        GetBookmarks: GetBookmarks,
        GetBookmark: GetBookmark
        //end internal
    };
});