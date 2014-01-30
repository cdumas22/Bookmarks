define(["backbone", "radio"], function (Backbone, Radio) {
    return Backbone.Model.extend({
        urlRoot: "/bookmarks",
        idAttribute: "_id",
        defaults: {
        	title: null,
        	description: null,
        	url: null,
        	tags: [],
        	lock: false,
        	count: 0,
            created: new Date()
        },
        parse: function (response) {
            if (!response.favicon || response.favicon === "undefined") {
                response.favicon = "/images/bookmark-icon-lg.png";
            }
            return response;
        },
        initialize: function() {
            Radio(this.get('_id') + ':update').subscribe([this.serverChange, this]);
            Radio(this.get('_id') + ':delete').subscribe([this.serverDelete, this]);
        },
        lock: function(options) {
            if(!this.isNew() && this.get('lock') === false) {
                this.save('lock', true, options);
            }
        },
        incrementCounter: function() {
            this.set("count", this.get("count") + 1);
            this.save();
        },
        unlock: function(options) {
            if(!this.isNew() && this.get('lock') === true) {
                this.save('lock', false, options);
            }
        },
        serverChange: function(data) {
        	this.set(data);
        },
        serverDelete: function(data) {
            Radio(this.get('_id') + ':update').unsubscribe(this.serverChange);
            Radio(this.get('_id') + ':delete').unsubscribe(this.serverDelete);
        	if(this.collection) {
        		this.collection.remove(this);
        	} else {
        		this.trigger('destroy', this);
                this.trigger('remove', this);
        	}
        }
    });
});