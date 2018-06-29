(function ($) {
    "use strict";

    // debugger;
    ymaps.ready(init);

    function init() {

        var myMap = new ymaps.Map("map", {
                center: [52.60220552275487, 39.51001299999996],
                zoom: 12,
                controls: ['geolocationControl', 'fullscreenControl', 'zoomControl', 'rulerControl']
            }),
            objectManager = new ymaps.ObjectManager({
                // Чтобы метки начали кластеризоваться, выставляем опцию.
                clusterize: false,
                // ObjectManager принимает те же опции, что и кластеризатор.
                gridSize: 64
            });

        var allPointsArray = [
            {
                "type": "Feature",
                "id": 1,
                "geometry": {"type": "Point", "coordinates": [52.60220552275487, 39.51001299999996]}
            },
            {
                "type": "Feature",
                "id": 2,
                "geometry": {"type": "Point", "coordinates": [52.59549162109813, 39.489144999999915]}
            },
            {
                "type": "Feature",
                "id": 3,
                "geometry": {"type": "Point", "coordinates": [52.60648812006721, 39.50492399999999]}
            }
        ];
        myMap.behaviors.disable('scrollZoom');
        myMap.behaviors.disable('multiTouch');

        for (var i = 0; i < allPointsArray.length; i++) {

            var placemark = new ymaps.Placemark( // делаем новую placemark на каждую торговую точку каждого города
                allPointsArray[i].geometry.coordinates,
                {balloonContent: 'Долевое 48'},// задаем ее координаты
                {
                    iconLayout: 'default#image',
                    iconImageHref: 'img/map-point.svg',
                    iconImageSize: [35, 50]
                }
            );

            myMap.geoObjects.add(placemark);
        }


        //

    };

    /*Мобильное меню*/
    var navMain = document.querySelector(".main-nav");
    var navToggle = document.querySelector(".main-nav-toggle");
    var pageHeaderWrapper =  document.querySelector(".page-header__wrapper");

    navMain.classList.remove('main-nav--nojs');

    navToggle.addEventListener("click", function () {
        if (navMain.classList.contains("main-nav--closed")) {
            navMain.classList.remove("main-nav--closed");
            navMain.classList.add("main-nav--opened");
            pageHeaderWrapper.classList.add("page-header__wrapper--menu-open");
        } else {
            navMain.classList.add("main-nav--closed");
            navMain.classList.remove("main-nav--opened");
            pageHeaderWrapper.classList.remove("page-header__wrapper--menu-open");
        }
    });

    var popup = document.querySelector(".popup");
    var popupOverlay = document.querySelector(".popup-overlay");
    var callBtnCollection = document.querySelectorAll(".btn-call");
    var nodelistToArray = Array.apply(null, callBtnCollection);
    var hiddenInput = document.getElementById('hiddenInput');


    nodelistToArray.forEach(function (button) {


        button.addEventListener("click", function (e) {

            e.preventDefault();

            var dataTitle = this.getAttribute('data-title');

            hiddenInput.value = dataTitle;

            console.log(hiddenInput.value);

            popup.classList.remove("popup--closed");
            popup.classList.add("popup--opened");
            popupOverlay.classList.remove("popup--closed");
        });
    });


    popupOverlay.addEventListener("click", function () {
        if (popup.classList.contains("popup--opened")) {
            popup.classList.remove("popup--opened");
            popup.classList.add("popup--closed");
            popupOverlay.classList.add("popup--closed");
        }
    });
    window.addEventListener("keydown", function (event) {
        if (event.keyCode === 27) {
            if (popup.classList.contains("popup--opened")) {
                popup.classList.remove("popup--opened");
                popup.classList.add("popup--closed");
                popupOverlay.classList.add("popup--closed");
            }
        }
    });


    function formHandler(selector) {

        // debugger;
        $(selector).on('submit', function (e) {

            e.preventDefault();

            var _this = $(this),
                $nameField = _this.find('input[name=name]'),
                $emailField = _this.find('input[name=email]'),
                $phoneField = _this.find('input[name=phone]'),
                $messageField = _this.find('input[name=tel]'),
                $hiddenInput = _this.find('input[type=hidden]');

            if ($emailField.val() === '') {
                $emailField.addClass('has-error');
            }
            if ($phoneField.val() === '') {
                $phoneField.addClass('has-error');
            }
            else if ($emailField.val() !== '' && $phoneField.val() !== '') {

                var ajaxdata = 'name=' + $nameField.val() + '&email=' + $emailField.val() + '&phone=' + $phoneField.val() + '&message=' + $messageField.val() + '&flat=' + $hiddenInput.val();

                console.log(ajaxdata);

                $.ajax({
                    type: "POST",
                    url: "/form_handler.php",
                    data: ajaxdata,
                    success: function ($output) {
                        $('#form-messages').html($output);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }
        });


    }

    function getPageScroll() {
        return window.pageYOffset;
    }

    $(window).on('scroll', function (e) {
        var $header = $(".page-header__top-block");
        if (getPageScroll() > 141) {
           $header.addClass("fixed").fadeIn();

        } else {
            $header.removeClass("fixed");
        }
    })


    formHandler('#contactForm');

    $('#mainMenu a').smoothScroll();
    $(document).on("scroll", onScroll);

})(jQuery);


var menu_selector = "#mainMenu nav > ul > li"; // Переменная должна содержать название класса или идентификатора, обертки нашего меню.

function onScroll() {
    var scroll_top = $(document).scrollTop() + 200;
    $(menu_selector + " a.nav-link").each(function () {
        var hash = $(this).attr("href");
        var target = $(hash);
        if (target.position().top <= scroll_top && target.position().top + target.outerHeight() > scroll_top) {
            $(menu_selector + " a.active").removeClass("active");
            $(this).addClass("active").siblings().removeClass('active');
        } else {
            $(this).removeClass("active");
        }
    });
}

$(window).on("load", function () {

    if ($(".inmap-content").length > 0) {
    } else {
        return;
    }

    if(window.innerWidth < 768) {
        $('.main-nav__link span br').replaceWith(' ');
    }

});

