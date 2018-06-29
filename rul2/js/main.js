$(document).ready(function () {
  $('.slick-slider').slick({
    infinite: true,
    dots: false,
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 1
  });

  $('.popup-gallery').each(function () { // the containers for all your galleries
    $(this).magnificPopup({
      delegate: 'a',
      type: 'image',
      tLoading: 'Загрузка',
      mainClass: 'mfp-img-mobile',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
      },
      image: {
        tError: 'изобраджение не найдено',
      }
    });
  });

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').each(function () { // the containers for all your galleries
    $(this).magnificPopup({
      disableOn: 320,
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    });
  });
});


let animElements = $('.anim');
const animate = function () {
  animElements.each(function () {
    let pos;
    $this = $(this);
    if (this.getBoundingClientRect().top <= window.innerHeight && this.getBoundingClientRect().bottom > 0) {
      if (pos !== 0) {
        $this.removeClass('out out_top');
        $this.addClass('in');
      }
    } else {
      if (pos !== 1) {
        $this.removeClass('in');
        $this.addClass('out');
      }
    }
    if (this.getBoundingClientRect().bottom <= 0) {
      if (pos !== -1) {
        $this.addClass('out out_top');
        $this.removeClass('in');
        pos = -1;
      }
    }
  });
};
window.addEventListener('scroll', function () {
  window.requestAnimationFrame(function () {
    animate();
  });
});


//прилипающее меню
// function getPageScroll() {
//   return window.pageYOffset;
// }
//
// var fixedContainer = document.querySelector('.fixed-container');
// var container = document.querySelector('.container');
// var header = document.querySelector('.page-header__top');
//
// window.onscroll = function () {
//   if (getPageScroll() > 200) {
//     header.classList.add("fixed");
//     fixedContainer.style.width = container.offsetWidth + 'px';
//   } else {
//     header.classList.remove("fixed");
//   }
// }

//end прилипающее меню

function formHandler(selector) {

  // debugger;
  $(selector).on('submit', function (e) {

    e.preventDefault();

    var _this = $(this),
      $nameField = _this.find('input[name=name]'),
      $emailField = _this.find('input[name=email]'),
      $phoneField = _this.find('input[name=phone]'),
      $cityField = _this.find('input[name=city]');


    if
    ($emailField.val() === '') {
      $emailField.addClass('has-error');
    }
    if ($phoneField.val() === '') {
      $phoneField.addClass('has-error');
    }
    else if ($emailField.val() !== '' && $phoneField.val() !== '') {

      var ajaxdata = 'name=' + $nameField.val() + '&email=' + $emailField.val() + '&phone=' + $phoneField.val() + '&city=' + $cityField.val();


      $.ajax({
        type: "POST",
        url: "form_handler.php",
        data: ajaxdata,
        success: function ($output) {
          $('.answer-mail').html($output);
          yaCounter48913442.reachGoal('order');
        },
        error: function (error) {
          console.log(error);
        }
      });
    }
  });


}

formHandler('#contactForm');
formHandler('#contactFormBottom');

// активация/деактивация кнопки отправки формы
function toggleButton(id, target) {
  if (target.checked) {
    document.getElementById(id).removeAttribute('disabled');
  } else {
    document.getElementById(id).setAttribute('disabled', 'disabled')
  }
}


function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}
r(function(){
  if (!document.getElementsByClassName) {
    // Поддержка IE8
    var getElementsByClassName = function(node, classname) {
      var a = [];
      var re = new RegExp('(^| )'+classname+'( |$)');
      var els = node.getElementsByTagName("*");
      for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
      return a;
    }
    var videos = getElementsByClassName(document.body,"video__youtube");
  } else {
    var videos = document.getElementsByClassName("video__youtube");
  }

  var nb_videos = videos.length;
  for (var i=0; i<nb_videos; i++) {
    // Находим постер для видео, зная ID нашего видео
    // videos[i].style.backgroundImage = 'url(http://i.ytimg.com/vi/' + videos[i].id + '/sddefault.jpg)';

    // Размещаем над постером кнопку Play, чтобы создать эффект плеера
    var play = document.createElement("div");
    play.setAttribute("class","play");
    videos[i].appendChild(play);

    videos[i].onclick = function() {
      // Создаем iFrame и сразу начинаем проигрывать видео, т.е. атрибут autoplay у видео в значении 1
      var iframe = document.createElement("iframe");
      var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&fs=1&autohide=1&rel=0&amp&showinfo=0&encrypted-media=1";
      if (this.getAttribute("data-params")) iframe_url+='&'+this.getAttribute("data-params");
      iframe.setAttribute("src",iframe_url);
      iframe.setAttribute("frameborder",'0');
      iframe.setAttribute("allowfullscreen",'1');

      // Высота и ширина iFrame будет как у элемента-родителя
      iframe.style.width  = this.style.width;
      iframe.style.height = this.style.height;

      // Заменяем начальное изображение (постер) на iFrame
      this.parentNode.replaceChild(iframe, this);
    }
  }
});



// const menuWrapper = document.querySelector('#navbarNav');
// const menuLinks = menuWrapper.querySelectorAll('a');
// // const menuItem = menuWrapper.querySelectorAll('li');
// const possitionMenuElements = [];
//
// document.addEventListener('scroll', onScroll);

// function onScroll(event) {
//   // console.log( 'скрол ' + window.pageYOffset);
//   // console.log('elem ' + elem.offsetTop);
//   const scrollPage = window.pageYOffset
//   menuLinks.forEach(function (item, index) {
//     if (!possitionMenuElements.length) {
//       menuLinks.forEach(function (item) {
//         if(item.hash){
//           possitionMenuElements.push(document.querySelector(item.hash))
//         }
//       })
//     }
//     if(item.hash){
//       if(possitionMenuElements[index]){
//         if (scrollPage > possitionMenuElements[index].offsetTop) {
//           let nextIndex = index + 1;
//           menuLinks[index].classList.remove('active');
//           menuLinks[nextIndex].classList.add('active');
//         }
//       }
//     }
//     // if (item.hash === menuIndex) {
//     //   console.log(item.classList.add('active'))
//     // }
//   })
// }

// console.log(elem.getBoundingClientRect().top);


//
// var menu_selector = ".main-nav"; // Переменная должна содержать название класса или идентификатора, обертки нашего меню.
//
// function onScroll() {
//   var scroll_top = $(document).scrollTop();
//   $(menu_selector + " li.main-nav__item").each(function () {
//     var hash = $(this).find('a').attr("href");
//     var target = $(hash);
//     if (target.position().top <= scroll_top && target.position().top + target.outerHeight() > scroll_top) {
//       $(menu_selector + " a.active").removeClass("active");
//       $(this).addClass("active");
//     } else {
//       $(this).removeClass("active");
//     }
//   });
// };
//
// $(document).ready(function () {
//   $(document).on("scroll", onScroll);
//
//   $('a[href^="#"]').click(function (e) {
//     e.preventDefault();
//     $(document).off("scroll");
//     $(menu_selector + " a.active").removeClass("active");
//     // $(this).addClass("active");
//     var hash = $(this).attr("href");
//     var target = $(hash);
//
//     $("html, body").animate({
//       scrollTop: target.offset().top
//     }, 500, function () {
//       window.location.hash = hash;
//       $(document).on("scroll", onScroll);
//     });
//
//   });
//
// });
