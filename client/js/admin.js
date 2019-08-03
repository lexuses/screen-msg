function isActive() {
    return $('input[name=send]').is(':checked');
}

function addPictureToList(path) {
    let img = document.createElement( "img" );
    $(img).attr({src: 'media/' + path});

    let mediaItem = document.createElement( "div" );
    $(mediaItem).addClass('media-item');
    $(mediaItem).append(img);

    $('.media-list').append(mediaItem);
}

function getExtension(path) {
    const re = /(?:\.([^.]+))?$/;

    return re.exec(path)[1];
}

function addVideoToList(path) {
    let video = document.createElement('video');
    video.src = 'media/' + path;
    video.autoplay = false;
    video.muted = true;

    let mediaItem = document.createElement( "div" );
    $(mediaItem).addClass('media-item video');
    $(mediaItem).append(video);

    $('.media-list').append(mediaItem);
}

$(() => {
    const socket = io('http://127.0.0.1:3000');
    socket.on('connect', function() {
        console.log('Connected');
    });

    socket.on('exception', function(data) {
        console.log('event', data);
    });

    socket.on('disconnect', function() {
        console.log('Disconnected');
    });

    socket.emit('media/all', {}, media => {
        media.forEach((path) => {
            switch (getExtension(path)) {
                case 'jpg':
                        addPictureToList(path);
                    break;
                case 'mp4':
                        addVideoToList(path);
                    break;
            }

        })
    });

    $('#text').on('change keyup paste', function (event) {
        if (isActive()) {
            socket.emit('text/set', $(this).html());
        }
    });

    $('.media-list').on('click', '.media-item', function (data) {
        let mediaNode = $(this).children()[0];
        let src = $(mediaNode).attr('src');

        let bgImage = $('.bg-image');
        let bgVideo = $('.bg-video');

        bgImage.hide();
        bgVideo.hide();

        switch (getExtension(src)) {
            case 'jpg':
                bgImage.css({'background-image': 'url('+src+')'});
                bgImage.fadeIn();
                break;
            case 'mp4':
                let video = bgVideo.find('video')[0];
                video.src = src;
                bgVideo.fadeIn();
                break;
        }

        if (isActive()) {
            socket.emit('media/set', {
                src: $(mediaNode).attr('src'),
                type: mediaNode.tagName,
            });
        }
    });

    $('#clear-text').click(() => {
        $('#text').text('');
        if (isActive()) {
            socket.emit('text/set', '');
        }
    });

    $('#clear-media').click(() => {
        $('.bg-image').hide();
        $('.bg-video').hide();

        if (isActive()) {
            socket.emit('media/set', {
                src: '',
                type: 'none'
            });
        }
    });

    $('input[type=range]').on('input', function () {
        $(this).trigger('change');
    });

    $("[type=range]").change(function(){
        socket.emit('style/changed', {
            opacity: $(this).val(),
        });
    });
});
