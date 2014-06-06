define(["backbone", "underscore", "text!Bookmark/Templates/List.html",  "Bookmark/Views/ListItem", "waterfall"], function (Backbone, _, template, ListItem) {   
    return Backbone.View.extend({
        className: "bookmark-list",
        template: _.template(template),
        events: {
            "keyup input[name=search]": "search",
            "change select.sorting": "search"
        },
        initialize: function (options) {
            options || (options = {});
            this.collection = options.collection;
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
        },
        render: function () {
            var json = this.collection.toJSON();
            this.$el.html(this.template());
            this.addAll(this.collection);
            var _this = this;
            
            $(window).keypress(function () {
                if (!$("#TAGS input[name=search]").is(":focus")) {
                    $(".bookmark-list input[name=search]").focus();
                }
            });
            $("body > div").splitter({
                sizeLeft:250
            });
            return this;
        },
        addAll: function (collection) {
            this.$el.find('.models').children().remove();
            collection.each(this.addOne, this);
        },
        addOne: function (model) {
            var view = new ListItem({ model: model });
            this.$el.find('.models').append(view.render().el);
        },
        search: function (e) {
            var letters = this.$('input[name=search]').val();
            var sorting = this.$('select.sorting').val();
            this.addAll(this.collection.search(letters, sorting));
        }

    });
});