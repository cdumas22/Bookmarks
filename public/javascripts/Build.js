//this will build the all the needed javascript into the App-built folder
//only the App-built folder is needed for deployment, all libraries (backbone.js, zepto.js, etc)
//are not needed because they are all built into the Main module
//info https://github.com/jrburke/r.js/blob/master/build/example.build.js
({
    baseUrl: "App",
    dir: "App-built",
    mainConfigFile: 'App/main.js',
    //optimize : 'none',
    inlineText: true,
    removeCombined: true,
    useStrict: true,
    paths: {
        //if we wanted to use jquery or backbone from a cdn we could define it here with the value of 'none'
        //we would then have to load it in a script tag on the html page
    },
    pragmas: {
        configExclude: true
    },
    modules: [
        {
            name: "Main",
            include: ['css', 'text']
            //main gets backbone, underscore, and jquery from the define paths in the modules
        },
        {
            name: "Bookmark/Views/List",
            include: ["Tag/Views/List"],
            exclude: ['backbone','underscore','jquery','text','css']
        },
        {
            name: "Bookmark/Views/Item",
            exclude: ['backbone','underscore','jquery','text','css']
        }
    ]
})