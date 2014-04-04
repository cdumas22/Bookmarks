exports.index = function (req, res) {
    //db.collection('bookmarks', function (err, collection) {
        db.find({},function (err, items) {
            res.send(items);
        });
    //});
};

exports.bookmark = function (req, res) {
    var id = req.params.bookmark;
    console.log('Retrieving bookmark: ' + id);
    //db.collection('bookmarks', function (err, collection) {
        db.findOne({ '_id': id }, function (err, item) {
            res.send(item);
        });
    //});
};

exports.create = function (req, res) {
    var bookmark = req.body;
    console.log('Adding bookmark: ' + JSON.stringify(bookmark));
    //db.collection('bookmarks', function (err, collection) {

        //var rq = require('request').defaults({ encoding: null });
        //console.log("begin request");
        //rq.get(bookmark.favicon, function (error, response, body) {
        //    if (!error && response.statusCode == 200) {
                
        //        data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        //        console.log('image loaded' + data);
        //        bookmark.favicon = data;
        //    }
        //    console.log(bookmark.favicon);
            db.insert(bookmark, function (err, result) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    socket.broadcast.emit('bookmarks:create', result[0]);
                    socket.emit('bookmarks:create', result[0]);
                    res.send(result[0]);
                }
            });
        //});


        
    //});
}

exports.update = function (req, res) {
    var id = req.params.bookmark;
    var bookmark = req.body;
    //delete bookmark._id;
    if (bookmark.lock === "false") {
        bookmark.lock = false;
    }
    if (bookmark.lock === "true") {
        bookmark.lock = true;
    }

    console.log('Updating bookmark: ' + id);
    console.log(JSON.stringify(bookmark));
    //db.collection('bookmarks', function (err, collection) {
        db.update({ '_id': id }, bookmark, { safe: true }, function (err, result) {
            if (err) {
                console.log('Error updating bookmark: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                bookmark._id = id;
                socket.broadcast.emit('update', bookmark);
                socket.emit('update', bookmark);
                res.send(bookmark);
				db.persistence.compactDatafile();
            }
        });
    //});
}

exports.destroy = function (req, res) {
    var id = req.params.bookmark;
    console.log('Deleting bookmark: ' + id);

    //db.collection('bookmarks', function (err, collection) {
        db.remove({ '_id': id }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' Bookmark document(s) deleted');
				db.persistence.compactDatafile();
            }
        });
    //});
}