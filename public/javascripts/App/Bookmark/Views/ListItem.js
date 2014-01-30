define(["backbone", "underscore", "text!Bookmark/Templates/ListItem.html"], function (Backbone, _, Template) {
    return Backbone.View.extend({
        tagName: "div",
        className: "bookmark",
        template: _.template(Template),
        events: {
            "click a.remove": "destroy",
            "click a.locked": "unlock",
            "click a.link": "incrementCounter"
        },
        initialize: function (options) {
            options || (options = {});
            this.model = options.model;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.clearLine);
            this.listenTo(this.model,'remove', this.clearLine);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        incrementCounter: function(event){
            this.model.incrementCounter();
        },
        unlock: function(event) {
            event.stopPropagation();
            event.preventDefault();
            this.model.unlock();
        },
        destroy: function (event) {
            event.stopPropagation();
            event.preventDefault();
            if (confirm("Are you sure you want to delete this item")) {
                this.model.destroy();
            }
        },
        clearLine: function() {
            this.$el.remove();
        }
    });
});