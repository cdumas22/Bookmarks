exports.index = function (req, res) {
    db.collection('tags', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.tags = function (req, res) {
    var id = req.params.tag;
    console.log('Retrieving tags: ' + id);
    db.collection('tags', function (err, collection) {
        collection.findOne({ '_id': new BSON.ObjectID(id) }, function (err, item) {
            res.send(item);
        });
    });
};

exports.create = function (req, res) {
    var bookmark = req.body;
    console.log('Adding tag: ' + JSON.stringify(bookmark));
    db.collection('tags', function (err, collection) {

        //var rq = require('request').defaults({ encoding: null });
        //console.log("begin request");
        //rq.get(bookmark.favicon, function (error, response, body) {
        //    if (!error && response.statusCode == 200) {
                
        //        data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
        //        console.log('image loaded' + data);
        //        bookmark.favicon = data;
        //    }
        //    console.log(bookmark.favicon);
            collection.insert(bookmark, { safe: true }, function (err, result) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    socket.broadcast.emit('tags:create', result[0]);
                    socket.emit('tags:create', result[0]);
                    res.send(result[0]);
                }
            });
        //});


        
    });
}

exports.update = function (req, res) {
    var id = req.params.tag;
    var tag = req.body;
    delete tag._id;

    console.log('Updating tag: ' + id);
    console.log(JSON.stringify(bookmark));
    db.collection('tags', function (err, collection) {
        collection.update({ '_id': new BSON.ObjectID(id) }, bookmark, { safe: true }, function (err, result) {
            if (err) {
                console.log('Error updating tag: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                bookmark._id = id;
                socket.broadcast.emit('update', bookmark);
                socket.emit('update', bookmark);
                res.send(bookmark);
            }
        });
    });
}

exports.destroy = function (req, res) {
    var id = req.params.tag;
    console.log('Deleting tag: ' + id);

    db.collection('tags', function (err, collection) {
        collection.remove({ '_id': new BSON.ObjectID(id) }, { safe: true }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred - ' + err });
            } else {
                console.log('' + result + ' Tag document(s) deleted');
            }
        });
    });
}