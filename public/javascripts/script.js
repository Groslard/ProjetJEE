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

    //submission scripts
    $('#contactme').submit(function() {
        //statements to validate the form	
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var email = document.getElementById('email');
        if (!filter.test(email.value)) {
            $('.email-missing').fadeIn(500);
        } else {
            $('.email-missing').fadeOut(500);
        }
        if (document.cform.firstname.value == "") {
            $('.firstname-missing').fadeIn(500);
        } else {
            $('.firstname-missing').fadeOut(500);
        }
        if (document.cform.lastname.value == "") {
            $('.lastname-missing').fadeIn(500);
        } else {
            $('.lastname-missing').fadeOut(500);
        }
        if (document.cform.message.value == "") {
            $('.message-missing').fadeIn(500);
        } else {
            $('.message-missing').fadeOut(500);
        }
        if ((document.cform.firstname.value == "") || (document.cform.lastname.value == "") || (!filter.test(email.value)) || (document.cform.message.value == "")) {
            return false;
        }

        if ((document.cform.firstname.value != "") && (document.cform.lastname.value != "") && (filter.test(email.value)) && (document.cform.message.value != "")) {

            $('#messageload').fadeIn();

            $.post('mail.php', {
                firstname: $('#firstname').val(),
                lastname: $('#lastname').val(),
                email: $('#email').val(),
                subject: $('#subject option:selected').text(),
                message: $('#message').val()
            },
            //return the data
            function(data, status) {
                $('#messageload').fadeOut();
                if (status == 'success') {
                    $('#contactme').fadeOut();
                    $('#messagesuccess').fadeIn();
                }
                else {
                    alert('Your message could not be sent. Please try again later!');
                }
            });
            //stay on the page
            return false;
        }
    });

    /*==== Ajout d'options dans la création d'une animation ====*/
    var nbOption = 1;

   $(".btn-add-panel").on("click", function () {
        $( ".accordion" ).append( "<div class='accordion-group' id='accordion"+nbOption+"' style='border: 1px solid #52a8ec;border-radius: 0px'> <div class='accordion-heading' style='margin-bottom: 0px;'> <a class='accordion-toggle' data-toggle='collapse' data-parent='#accordionOption' href='#collapse"+nbOption+"'> <div class='row-fluid' style='margin-bottom: 0px;'><input id='titre' name='titre' type='text' class='span12' placeholder='Titre de l`option' style='margin-bottom: 0px; width:85%;'>  <button type='button' id='btnDel"+nbOption+"' class='btn btn-lg btn-primary  pull-right btn-del-panel'  style='height: 35px;'>X</button></div> </a> </div> <div id='collapse"+nbOption+"' class='accordion-body collapse out' style='margin-bottom: 0px;'> <div class='accordion-inner'> <div class='row-fluid'> <label>Description <span class='hide label-important message-missing pull-right'>You forgot to enter a description!</span></label> <textarea name='description' placeholder='Description de l`option ' id='description' class='input-xlarge span12' rows='4'></textarea> </div><div class='row-fluid'> Nombre de places <input type='number' name='points' min='0' max='10000' step='1' value='100'> </div> <div class='row-fluid'> Durée de l'option (en minutes) <input type='number' name='points' min='1' max='480' step='' value='30'> </div> <div class='row-fluid'><label>Créneau de l'animation</label> <br><br><br> <div id='creneauOption"+nbOption+"'></div> </div><br/>");
       // $(".mCS-light-thick").mCustomScrollbar("update");
        $("#creneauOption"+nbOption+"").editRangeSlider({
          bounds: {min: 8, max: 20},
          defaultValues:{min: 9, max: 18}
        });
   /*     $("#btnDel"+nbOption+"").on("click", function () {
            $("#accordion"+nbOption+"").remove();
        });*/
        $("#btnDel1").on("click", function () {
            $("#accordion1").remove();
        });
        $("#btnDel2").on("click", function () {
            $("#accordion2").remove();
        });
        $("#btnDel3").on("click", function () {
            $("#accordion3").remove();
        });
        $("#btnDel4").on("click", function () {
            $("#accordion4").remove();
        });
        $("#btnDel5").on("click", function () {
            $("#accordion5").remove();
        });
        $("#btnDel6").on("click", function () {
            $("#accordion6").remove();
        });
        $("#btnDel7").on("click", function () {
            $("#accordion7").remove();
        });
        $("#btnDel8").on("click", function () {
            $("#accordion8").remove();
        });
        nbOption++;

        
    });


   
    
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