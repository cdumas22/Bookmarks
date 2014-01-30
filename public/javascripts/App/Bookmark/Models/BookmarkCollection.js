define(["backbone", "Bookmark/Models/Bookmark", 'radio', 'underscore'], function (Backbone, BookmarkModel, Radio,_) {
    return Backbone.Collection.extend({
        model: BookmarkModel,
        url: "/bookmarks",
        initialize: function() {
        	Radio('bookmarks:create').subscribe([this.serverCreate, this]);
        },
        serverCreate: function(data) {
        	this.add(data);
        },
        strategies: {
            "A-Z": function (model) {
                var title = model.get('title');
                title = title.split(" ")[0].toLowerCase();
                return title;
            },
            "Z-A": function (model) {
                var title = model.get('title');
                title = title.split(" ")[0].toLowerCase().split("");
                return _.map(title, function (letter) {
                    return String.fromCharCode(-(letter.charCodeAt(0)));
                });
            },
            "Most Popular": function (model) {
                return -(model.get('count'));
            },
            "Created Date": function (model) {
                var date = Date.parse(model.get('created')).valueOf();
                return -date;
            }
        },
        selectedStrategy: "A-Z",
        changeSort: function (sortProperty) {
            this.selectedStrategy = sortProperty;
            this.comparator = this.strategies[sortProperty];
            this.sort();
        },
        comparator: function (model) {
            return this.strategies[this.selectedStrategy].call(this, model);
        },
        tags: function () {
            var tags = [];
            this.each(function (model) {
                var t = model.get("tags");
                var i;
                for (i = 0; i < t.length; i++) {
                    if ($.inArray(t[i], tags) < 0) {
                        tags.push(t[i]);
                    }
                }
            });
            for (i = 0; i < tags.length; i++) {
                tags[i] = tags[i].toLowerCase()
            }
            tags = _.uniq(tags);
            return tags;
        },
        search: function (letters, sort) {
            if (sort !== this.selectedStrategy) {
                this.changeSort(sort);
            }
            if (letters == "") return this;
            var test = letters.split("::");
            var and = [];
            var or = [];
            var results = [];
            filter = false;
            if (test.length == 2) {
                letters = test[1];
                filter = test[0];
            }
            //and = letters.split(/\sand\s/gi)
            //for (var i = 0; i < and.length; i++) {
            letters = letters.replace(/\s\bor\b\s/gi, '|').replace(/^\s*|\s*$/g, "");
            //}

            //var regex = ".*"
            //for (var i = 0; i < and.length; i++) {
            //    //var o = and[i].indexOf("|") > 0 ? true : false;
            //    regex += "(?=.*" + and[i] + ").*";
            //}

            
            var pattern = new RegExp(letters, "gi");
            results = this.filter(function (data) {

                return ((filter === "title" || !filter) && pattern.test(data.get("title"))) ||
                        ((filter === "description" || !filter) && pattern.test(data.get("description"))) ||
                        ((filter === "url" || !filter) && pattern.test(data.get("url"))) ||
                        ((filter === "tags" || !filter) && pattern.test(data.get("tags")));
            });
            
            return _(results);
        }
    });
});