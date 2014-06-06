define([
    "backbone",
    "Bookmark/Models/Bookmark",
    "Controller",
    "Tag/Views/List",
	"splitter"
], function (Backbone, BookmarkModel, Controller, Tags) {
    return Backbone.Router.extend({
        initialize: function (options) {
            options || (options = {});
            this.el = options.el;
        },
        //This is a general render function for the app, and will take care of making sure that the view is removed and then load in the new view
        render: function (view, viewOptions) {
            var _this = this;
            if (this.currentView) {
                this.currentView.remove();
            }
            require([view], function(v){
                _this.currentView = new v(viewOptions);
                _this.el.html(_this.currentView.render().el);
            });
        },
        routes: {
            "": "bookmarks",
            "bookmarks": "bookmarks",
            "bookmarks/new": "createBookmark",
            "bookmarks/:id": "viewBookmark"
        },
        createBookmark: function () {
            this.render("Bookmark/Views/Item", { model: new BookmarkModel(), collection: Controller.Collections.Bookmarks });
        },
        bookmarks: function () {

            var tags = new Tags({
                el: $("#TAGS"),
                collection: Controller.GetBookmarks()
            });

            this.render("Bookmark/Views/List", { collection: Controller.GetBookmarks() });
			
        },
        viewBookmark: function (id) {
            this.render("Bookmark/Views/Item", { model: Controller.GetBookmark(id)});
        }
    });
});