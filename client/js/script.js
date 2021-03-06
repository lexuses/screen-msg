$(() => {
    const socket = io('http://127.0.0.1:3000');

    socket.on('connect', function() {
        console.log('Connected');
    });

    socket.on('screen/media', async function(media) {
        let imageWrapper = $('.bg-image');
        let videoWrapper = $('.bg-video');

        if (imageWrapper.is(':visible')) {
            await imageWrapper.fadeOut(400).promise().done();
        }
        if (videoWrapper.is(':visible')) {
            await videoWrapper.fadeOut(400).promise().done();
        }

        switch (media.type) {
            case 'IMG':
                imageWrapper.css({'background-image': 'url('+media.src+')'});
                imageWrapper.fadeIn();
                break;
            case 'VIDEO':
                let video = videoWrapper.find('video')[0];
                video.src = media.src;
                videoWrapper.fadeIn();
                break;
        }
    });

    socket.on('screen/text', function(data) {
        $('.text').html(data);
    });

    socket.on('screen/style', function(data) {
        let imageWrapper = $('.bg-image');
        let videoShadow = $('.video-shadow');

        imageWrapper.css({
            filter: `opacity(${data.opacity}%)`,
        });
        videoShadow.css({
            'background-color': `rgba(0,0,0,${(100 - data.opacity)/100})`,
        });

        $('body').css({
            'font-size': `${data.fontSize}px`,
        })
    });

    socket.on('exception', function(data) {
        console.log('exception', data);
    });

    socket.on('disconnect', function() {
        console.log('Disconnected');
    });
});


