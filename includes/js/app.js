$(document).ready(function() {
    function notValidField(element) {
        element.addClass('form__element--notvalid');
    }

    function isMyFormValid() {
        $('#form').on('submit', function(e) {
            const namesRegex = /^(?!undefined)[A-Za-zàâéèëêïîôùüçœ\'\’\-]{2,60}$/;
            const mailRegex = /^[A-Za-z0-9\-\.\_]+\@[a-z]+\.[a-z]+$/;

            const isLastName = namesRegex.test($('.form__input--lastName').val());
            const isFirstName = namesRegex.test($('.form__input--firstName').val());
            const isMail = mailRegex.test($('.form__input--mail').val());

            $('.form__message').html('');
            $('.form__input, .form__textarea').removeClass('form__element--notvalid');
            if(isLastName && isFirstName && isMail && $('.form__textarea').val() != '') {
                contactPost();
            } else {
                let errorMessage;
                let error = [];

                if(!isLastName) {
                    notValidField($('.form__input--lastName'));
                    error.push('le nom');
                }

                if(!isFirstName) {
                    notValidField($('.form__input--firstName'));
                    error.push('le prénom');
                }

                if(!isMail) {
                    notValidField($('.form__input--mail'));
                    error.push('l\'email');
                }

                if($('.form__textarea').val() == '') {
                    notValidField($('.form__textarea'));
                    error.push('le message');
                    
                }

                switch (error.length) {
                    case 1 :
                    errorMessage = error + ' est invalide';
                    break;
                    case 2 :
                    errorMessage = error[0] + ' & ' + error[1] + ' sont invalides';
                    break;
                    case 3 :
                    errorMessage = error[0] + ', ' + error[1] + ' & ' + error[2] + ' sont invalides';
                    break;
                    default :
                    errorMessage = 'Les champs sont invalides';
                }

                errorMessage = errorMessage[0].toUpperCase() + errorMessage.slice(1);
                $('.form__message').html(errorMessage);
            }

            e.preventDefault();
        });
    }

    function articleUrl(url) {
        const found = [false];

        $.ajax({
            async: false,
            url: 'api.php',
            method: 'GET',
            cache: false,

            success: function(response) {
                for(article of response) {
                    if ('#' + article.title.toLowerCase().replace(/\s+/g, '-') == url) {
                        found[0] = true;
                    }
                }
            },

            error: function() {
                console.log('error');
            }
        });

        return found;
    }

    function loadArticle(articleTitle) {
        $.ajax({
            url: 'api.php',
            method: 'GET',
            cache: false,

            success: function(response) {
                for(article of response) {
                    if ('#' + article.title.toLowerCase().replace(/\s+/g, '-') == articleTitle) {
                        let articleToLoad = article;
                        $('#main').fadeOut(function() {
                            $(this).empty();
                            $(this).append(
                                "<script src='includes/js/prism.js'></script>"
                                + "<div class='article__container' id='"
                                + articleToLoad.title
                                + "'>"
                                + "<div class='container article'>"

                                + "<div class='article__header'>"
                                + "<h2 class='article__title'>"
                                + articleToLoad.title
                                + "</h2>"

                                + "<div class='article__date'>posté le "
                                + articleToLoad.creation_date
                                + "</div>"

                                + "<div class='article__sharing'>"
                                + "<i class='fab fa-facebook'></i>"
                                + "<i class='fab fa-twitter'></i>"
                                + "<i class='fab fa-linkedin'></i>"
                                + "<i class='fas fa-link'></i>"
                                + "</div>"
                                + "</div>"

                                + "<div class='article__content'>"
                                + articleToLoad.content
                                + "</div>"

                                + "<div class='article__tag'>"
                                + "CATEGORIE: " + articleToLoad.tag
                                + "</div>"
                                + "</div>"
                                + "</div>"
                                );
                            $(this).fadeIn();
                        });
                    }
                }

                $('a[href="#blog"]').parent().addClass('navbar__tab--active')
                $('a[href="#blog"]').parent().siblings('.navbar__tab').removeClass('navbar__tab--active');
            },

            error: function() {
                console.log('error');
            }
        });
    }

    if (articleUrl(window.location.hash)[0]) {
        loadArticle(window.location.hash);
    } else if (window.location.hash == '#portfolio') {
        $('#main').load('portfolio.html');
    } else if (window.location.hash == '#blog') {
        $('#main').load('blog.html');
    } else if (window.location.hash == '#contact') {
        $('#main').load('contact.html', function() {
            isMyFormValid();
        });
    } else {
        $('#main').load('home.html');
    }

    $('[href="' + String(window.location.hash) + '"]').parent().addClass('navbar__tab--active');
    $('[href="' + String(window.location.hash) + '"]').parent().siblings('.navbar__tab').removeClass('navbar__tab--active');

	// For each link in the navigation bar when clicked
	$('.navbar__tab').on('click', function () {
        const currentPage = this;

		// We add the class .active to the link that is clicked and remove it from the others
        $(this).addClass('navbar__tab--active')
        $(this).siblings('.navbar__tab').removeClass('navbar__tab--active');

        // If the page asked is already loaded
        if ($(currentPage).children('a').attr('href').slice(1) != $('#main').children('div').attr('id')) {
            // Then we load the correct page with help of the id of that link
            $('#main').fadeOut(function() {
                $('#main').load($(currentPage).children('a').attr('href').slice(1) + '.html', function() {
                    $('#main').fadeIn();

                    isMyFormValid();
                });
            });
        }
    });
});