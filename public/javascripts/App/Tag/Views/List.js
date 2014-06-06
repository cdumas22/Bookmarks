define(["backbone", "underscore", "text!Tag/Templates/List.html",  "Tag/Views/ListItem"], function (Backbone, _, template, ListItem) {   
    return Backbone.View.extend({
        className: "tag-list",
        template: _.template(template),
        events: {
            "keyup input[name=search]": "search"
        },
        initialize: function (options) {
            options || (options = {});
            this.collection = options.collection;
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
        },
        render: function () {
            this.$el.html(this.template());
            this.tags = this.collection.tags();
            this.tags.sort();
            this.addAll(this.tags);
            var _this = this;

            $("body > div").height((parseInt($(window).innerHeight())) + "px");
            //$("body > div").splitter();
            $(window).resize(function () {
                _this.$el.find('.models').height((parseInt($(window).innerHeight()) - 60) + "px");
                $("body > div").height((parseInt($(window).innerHeight())) + "px");
                $(".vsplitbar").height((parseInt($(window).innerHeight())) + "px");
            });
            return this;
        },
        addAll: function (collection) {
            this.$el.find('.models').children().remove();
            _.each(collection, this.addOne, this);
            this.$el.find('.models').height((parseInt($(window).innerHeight()) - 60) + "px");
        },
        addOne: function (model) {
            var view = new ListItem({ model: model });
            this.$el.find('.models').append(view.render().el);
        },
        search: function (e) {
            var letters = this.$('input[name=search]').val();
            letters = letters.replace(/\s\bor\b\s/gi, '|').replace(/^\s*|\s*$/g, "");
            var pattern = new RegExp(letters, "gi");
            if (letters == "") {
                this.addAll( this.tags );
            } else {
                this.addAll(_.filter(this.tags, function (tag) {
                    return pattern.test(tag);
                }));
            }
        }
    });
});