define(["backbone", "underscore", "text!Bookmark/Templates/Item.html", "autocomplete"], function (Backbone, _, template) {
    return Backbone.View.extend({
        className: "bookmark-view",
        template: _.template(template),
        events: {
            "click button.save": "save",
            "click button.cancel": "edit",
            "click .icon-remove": "remove_tag"
        },
        //many of the event listeners are the same
        initialize: function (options) {
            options || (options = {});
            this.model = options.model;
            this.collection = options.collection || this.model.collection;

            if(this.model) {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.root);
            }

            this.initializeLock();
        },
        //common
        initializeLock: function() {
            var _this = this;
            if(this.model) {
                this.listenTo(this, 'remove', function() {
                    this.model.unlock();
                    $(window).off('unload');
                });
            }
            $(window).on('unload', function(){
                _this.model.unlock({async: false});
                $(window).off('unload');
            });
        },
        //common
        remove: function() {
            this.trigger('remove');
            Backbone.View.prototype.remove.call(this);
        },
        //the template is different
        render: function () {
            this.model.unlock();
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.find("input[name=tags]").autocomplete({
                lookup: this.collection.tags(),
                delimiter: ",",
                maxHeight: 80,
                width:300
            });
            if (this.model.isNew()) {
                this.$el.addClass("editing");
            }
            return this;
        },
        //custom
        root: function() {
            window.location.hash = "bookmarks";
        },
        //common
        //the root may be different but that is up to the user to define
        edit: function () {
            if (this.model.isNew()) {
                this.root();
            }

            if(!this.$el.hasClass("editing") && this.model.get("lock") === true) {
                return false;
            }

            if (this.$el.hasClass("editing")) {
                this.$el.removeClass("editing");
                this.model.unlock();
            } else {
                this.$el.addClass("editing");
                this.model.lock();
            }
        },
        //the set model part is different
        save: function (event) {
            event.stopPropagation();
            event.preventDefault();
            var tags = (this.$el.find('input[name=tags]').val()).split(",");
            for (var i = 0; i < tags.length; i++) {
                tags[i] = tags[i].replace(/^\s*|\s*$/g, "").toLowerCase();
            }
            this.model.set({
                title: this.$el.find('input[name=title]').val(),
                description: this.$el.find('textarea[name=description]').val(),
                url: this.$el.find('input[name=url]').val(),
                tags: tags,
                lock: false
            });

            this.edit();

            if (this.model.isNew())  {
                this.model.set('created', new Date());
                this.collection.create(this.model, {wait: true});
            } else {
                this.model.save();
            }
            window.location = "#bookmarks";
        }
    });
});