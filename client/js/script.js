$(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', function() {
        console.log('Connected');
    });

    socket.on('screen/picture', function(picturePath) {
        $('.bg-image').css({'background-image': 'url('+picturePath+')'});
    });

    socket.on('screen/text', function(data) {
        $('.text').html(data);
    });

    socket.on('exception', function(data) {
        console.log('exception', data);
    });

    socket.on('disconnect', function() {
        console.log('Disconnected');
    });
});


