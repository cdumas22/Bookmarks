define(["backbone", "underscore"], function (Backbone, _) {
    return Backbone.View.extend({
        tagName: "li",
        template: _.template("<a class='btn tag'><%= tag %></a>"),
        events: {
            "click a": "setFilter"
        },
        initialize: function (options) {
            options || (options = {});
            this.model = options.model;
        },
        setFilter: function() {
            $("#APP input[name=search]").val("tags::" + this.model).trigger(jQuery.Event("keyup"));
        },
        render: function () {
            this.$el.html(this.template({ tag: this.model }));
            return this;
        }
    });
});