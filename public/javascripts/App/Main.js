//>>excludeStart("configExclude", pragmas.configExclude)
//this is only needed in a development enviroment
//with the built version this is not needed
requirejs.config({
    paths: {
        jquery: "../libraries/jquery-1.10.2.min",
        backbone: "../libraries/backbone",
        underscore: "../libraries/underscore",
        css: "../libraries/css",
        text: "../libraries/text",
        socket: "../libraries/socket.io",
        radio: '../libraries/Radio',
        json2: '../libraries/json2',
        waterfall: '../libraries/jquery.waterfall',
        autocomplete: '../libraries/jquery.autocomplete.min',
		splitter: '../libraries/splitter'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery', 'json2'],
            exports: 'Backbone'
        },
        splitter: {
            deps: ['jquery']
        }
    }
});
//>>excludeEnd("configExclude")

require(["backbone", "Router", "SocketAdapter"], function (Backbone, Router, Socket, Tags) {
    $.ajaxSetup({ cache: false });
    var router = new Router({
        el: $("#APP")
    });
    
    Backbone.history.start();
});