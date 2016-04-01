$(document).ready(function() {
    /*==== ISOTOPE LAYOUT ====*/
    var $container = $('.section');

    $container.isotope({
        itemSelector: '.tile',
        layoutMode: 'masonryHorizontal',
        masonryHorizontal: {
            rowHeight: 0
        }
    });

    /*==== SCROLLBARS ====*/
    $("#content").mCustomScrollbar({
        scrollButtons: {
            enable: true
        },
        mouseWheelPixels: 500,
        horizontalScroll: true,
        advanced: {
            autoScrollOnFocus: false,
            autoExpandHorizontalScroll: true
        }
    });

    $(".htmltile").mCustomScrollbar({
        mouseWheelPixels: 300,
        theme: 'light-thick',
        scrollButtons: {
            enable: true
        },
        advanced: {
            updateOnContentResize: true,
            autoExpandHorizontalScroll: true
        }
    });
     $(".mlightbox-details").mCustomScrollbar({
        mouseWheelPixels: 300,
        theme: 'light-thick',
        scrollButtons: {
            enable: true
        },
        advanced: {
            updateOnContentResize: true,
            autoExpandHorizontalScroll: true
        }
    });


    /*==== SCROLLTO ====*/
    $("a[data-scroll='scrollto']").click(function(e) {
        e.preventDefault();
        var gotodiv = $(this).attr('href');
        $("#content").mCustomScrollbar("scrollTo", gotodiv);
    });

    /*==== METROMEGA FUNCTIONS ====*/
    $('.tileshow').each(function() {
        $(this).tileshow();
    });

    $('.bgtileshow').tileshow({
        timeout: 5000
    });

    /*==== REVEAL TILE ====*/
    $('.reveal-slide').each(function() {
        var height = $(this).height();
        $(this).hover(function() {
            $('.reveal', $(this)).stop().slideDown();
        }, function() {
            $('.reveal', $(this)).stop().slideUp(function() {
                $(this).height(height);
            });
        });
    });

    $('.reveal-fade').each(function() {
        $(this).hover(function() {
            $('.reveal', $(this)).stop().fadeIn(500, function() {
                $('.reveal', $(this)).css({
                    'display': 'block',
                    '-ms-filter': "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                    'filter': 'alpha(opacity=100)',
                    '-moz-opacity': 1,
                    '-khtml-opacity': 1,
                    'opacity': 1
                });
            });
        }, function() {
            $('.reveal', $(this)).stop().fadeOut(500, function() {
                $('.reveal', $(this)).css({
                    'display': 'none',
                    '-ms-filter': "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                    'filter': 'alpha(opacity=0)',
                    '-moz-opacity': 0,
                    '-khtml-opacity': 0,
                    'opacity': 0
                });
            });
        });
    });

    /*==== FUNCTIONS ====*/
    function setMargin() {
        var margin = ($(window).height() - $('.section').height()) / 2;
        $('.section').css({
            'margin-top': margin
        });
    }


    var theWindow = $(window),
            $bg = $("#background"),
            aspectRatio = $bg.width() / $bg.height();

    function resizeBg() {
        if ((theWindow.width() / theWindow.height()) < aspectRatio) {
            $bg
                    .removeClass()
                    .addClass('bgheight');
        } else {
            $bg
                    .removeClass()
                    .addClass('bgwidth');
        }
    }


    function initImages() {
        $('.imagetile').each(function() {
            var parent = $(this);
            var ratio = $('img', parent).width() / $('img', parent).height();

            if ((parent.width() / parent.height()) < ratio) {
                $('img', parent).removeClass('bgwidth').addClass('bgheight');
            }
            else {
                $('img', parent).removeClass('bgheight').addClass('bgwidth');
            }

            if (parent.hasClass('tileshow')) {
                var addClass = parent.find('.slide img').last().attr('class');
                $('img', parent).attr('class', ' ').addClass(addClass);
            }
        });
    }

    $('img').on('dragstart', function(event) {
        event.preventDefault();
    });


    /*==== FUNCTION CALLS ====*/
    initImages();
    resizeBg();
    setMargin();

    $(window).resize(function() {
        setTimeout(function() {
            $container.isotope('reLayout');
            setMargin();
            resizeBg();
            initImages();
        }, 300);
    });

    $(window).load(function() {
        initImages();
    });

    /*==== OPTIONS ====*/
    var $optionLinks = $('#portfolio a');

    $optionLinks.click(function() {
        if ($(this).hasClass('selected'))
            return false;
        else {
            var $filter = $(this).attr('data-option-value');
            $('#gallery').isotope({
                filter: $filter
            });
        }
    });

    /*==== METROMEGA SIDEBAR ====*/
    $('#opensidebar i').hover(function() {
        $('#sidebar').show(0).animate({'right': '0px'});
    });
    $('#sidebar').mouseleave(function() {
        $('#sidebar').animate({'right': '-120px'}, function() {
            $(this).css({'display': 'none'});
        });
    });

    /*==== METROMEGA CONTACT FORM ====*/



   
    
    /*==== mLightBox ====*/
    $('a[data-lightbox="mlightboximage"]').each(function() {
        $(this).mlightbox('image');
    });

    $('a[data-lightbox="mlightboxvideo"]').each(function() {
        $(this).mlightbox('video');
    });

    $('a[data-lightbox="mlightboxblog"]').each(function() {
        $(this).mlightbox('blog');
    });



});