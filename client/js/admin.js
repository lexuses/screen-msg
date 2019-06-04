function isActive() {
    return $('input[name=send]').is(':checked');
}

$(() => {
    const socket = io('http://localhost:3000');
    socket.on('connect', function() {
        console.log('Connected');
    });

    socket.on('exception', function(data) {
        console.log('event', data);
    });

    socket.on('disconnect', function() {
        console.log('Disconnected');
    });

    socket.emit('pictures/all', {}, pictures => {
        pictures.forEach((path) => {
            let picture = document.createElement( "div" );
            $(picture).addClass('picture');

            let img = document.createElement( "img" );
            $(img).attr({src: 'pictures/' + path});

            $(picture).append(img);

            $('.picture-list').append(picture);
        })
    });

    $('#text').on('change keyup paste', function (event) {
        if (isActive()) {
            socket.emit('text/set', $(this).html());
        }
    });

    $('.picture-list').on('click', 'img', function (data) {
        let src = $(this).attr('src');
        $('.main').css({'background-image': 'url('+src+')'});

        if (isActive()) {
            socket.emit('pictures/set', $(this).attr('src'));
        }
    });

    $('#clear-text').click(() => {
        $('#text').text('');
        if (isActive()) {
            socket.emit('text/set', '');
        }
    });

    $('#clear-picture').click(() => {
        $('.main').css({'background-image': ''});

        if (isActive()) {
            socket.emit('pictures/set', '');
        }
    });
});
