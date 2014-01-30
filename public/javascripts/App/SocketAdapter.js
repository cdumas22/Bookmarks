define(['radio', 'socket'], function(Radio, io) {
	var socket = io.connect();

    socket.on('bookmarks:create', function(data){
        Radio('bookmarks:create').broadcast(data);
    });

    socket.on('update', function(data) {
        Radio(data._id + ':update').broadcast(data);
    });
    socket.on('delete', function(data) {
        Radio(data._id + ':delete').broadcast(data);
        Radio('delete').broadcast(data);
    });

    return socket;
});