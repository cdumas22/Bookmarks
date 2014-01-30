define(["backbone", "radio"], function (Backbone, Radio) {
    return Backbone.Model.extend({
        urlRoot: "/tags",
        idAttribute: "_id",
        defaults: {
            name: null,
            parentId: null
        },
        initialize: function () {
            Radio(this.get('_id') + ':update').subscribe([this.serverChange, this]);
            Radio(this.get('_id') + ':delete').subscribe([this.serverDelete, this]);
        },
        getChildren: function() {
            if (!this.collection) { return null; }
            var id = this.get("_id");
            this.collection.filter(function (model) {
                return model.get("parentId") === id;
            });
        },
        serverChange: function (data) {
            this.set(data);
        },
        serverDelete: function (data) {
            Radio(this.get('_id') + ':update').unsubscribe(this.serverChange);
            Radio(this.get('_id') + ':delete').unsubscribe(this.serverDelete);
            if (this.collection) {
                this.collection.remove(this);
            } else {
                this.trigger('destroy', this);
                this.trigger('remove', this);
            }
        }
    });
});