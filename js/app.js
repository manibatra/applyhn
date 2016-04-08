var ratings = 0,
    date = 0,
    random = 0,
    chat = 0,
    pages = 0;

var currentURL = "http://hn.algolia.com/api/v1/search_by_date?";

$("#ratings, #ratings_drop").on('click', function() {
    ratings = 1;
    $('.btn').removeClass("z-depth-4");
    $(this).addClass("z-depth-4");
    currentURL = "http://hn.algolia.com/api/v1/search?";
    $('.collapsible').children().remove();
    $(".preloader-wrapper").addClass('active');
    $.when(getContent('0', true)).done(function() {
        $(".preloader-wrapper").removeClass('active');
        $('.pagination').find('.active').removeClass('active');
        $('.pagination > li:nth-child(2)').addClass('active');
    });
});

$("#date, #date_drop").on('click', function() {
    date = 1;
    $('.btn').removeClass("z-depth-4");
    $(this).addClass("z-depth-4");
    currentURL = "http://hn.algolia.com/api/v1/search_by_date?";
    $('.collapsible').children().remove();
    $(".preloader-wrapper").addClass('active');
    $.when(getContent('0', true)).done(function() {
        $(".preloader-wrapper").removeClass('active');
        $('.pagination').find('.active').removeClass('active');
        $('.pagination > li:nth-child(2)').addClass('active');
    });
});

$("#random, #random_drop").on('click', function() {
    random = !random;
    $('.btn').removeClass("z-depth-4");
    var currentPage = $('.pagination').find('.active');
    if (random) {
        $('#random').text('Random Off');
        $('#random').append('<i class="material-icons left">loop</i>');
        $('#dropdown2 > li:nth-child(3) > a').text('Random Off');
    } else {
        $('#random').text('Random On');
        $('#random').append('<i class="material-icons left">loop</i>');

        $('#dropdown2 > li:nth-child(3) > a').text('Random On');
    }
    showPage(currentPage);
});




var getContent = function(pageNo, loadPages) {


    $.ajax({
        url: currentURL + "query=%22apply%20hn%22&tags=story&page=" + pageNo.toString() + "&hitsPerPage=15",
        success: function displayData(data) {
            if (loadPages === true) {
                console.log(data);
                pages = data['nbPages'];
                var existing = $('.pagination').children().length;
                if ((existing - 2) < pages) {
                    for (var i = existing - 1; i <= pages; i++) {
                        $('.pagination > li:nth-child(' + (i) + ')').after('<li class="waves-effect"><a href="#!">' + i + '</a></li>');
                        $('#dropdown1 > li:nth-child(' + (i) + ')').after('<li><a href="#!">' + i + '</a></li>');
                    }
                }


            }

            if (chat) {
                data['hits'].sort(function(a, b) {
                    return b['num_comments'] - a['num_comments'];
                });
            } else if (date === 0) {
                data['hits'].sort(function(a, b) {
                    return b['points'] - a['points'];
                });
            }

            var counter = 0;

            for (key in data['hits']) {

                if (data["hits"][key]["title"].toLowerCase().indexOf('apply hn:') >= 0) {
                    $('.collapsible').append('<li>\
							<div class="collapsible-header"><div class="chip">' + data["hits"][key]["points"] +
                        '</div>' + data["hits"][key]["title"] + '<a href="https://news.ycombinator.com/item?id=' + data["hits"][key]["objectID"] + '" class="secondary-content"><i class="material-icons">send</i></a></div>\
							<div class="collapsible-body"><span class="new badge uptop">' + data["hits"][key]["num_comments"] + '</span><p>' + data['hits'][key]['story_text'] + '</p></div>\
						</li>');
                    counter = counter + 1;
                }


            }

            if (counter === 0) {

                $('.collapsible').append('<li>\
                    <div class="collapsible-header"><i class="material-icons">whatshot</i>Nothing to see here</div>\
                    <div class="collapsible-body"><p>Go back! Go back!</p></div>\
                </li>')
            }

        },
        async: false
    });



}

$("#chat, #chat_drop").on('click', function() {
    chat = !chat;
    if (chat) {
        $('#chat > i').text('trending_up');
        $('#dropdown2 > li:nth-child(4) > a').text('Order group by ratings');
        $('#chat').attr('data-tooltip', 'Order within current group by ratings');
    } else {
        $('#chat > i').text('chat_bubble_outline');
        $('#dropdown2 > li:nth-child(4) > a').text('Order group by comments');
        $('#chat').attr('data-tooltip', 'Order within current group by comments');
    }
    var currentPage = $('.pagination').find('.active');
    showPage(currentPage);


});



$(document).on('click', '.pagination > .waves-effect, #dropdown1 > li', function(e) {

    var currentPage = $('.pagination').find('.active');
    currentPage.removeClass('active');
    currentPage.addClass('waves-effect');
    var index = $(this).index();
    $('.pagination > li:nth-child(' + (index + 1) + ')').addClass('active');
    showPage($(this));

});


$("#next_page").on('click', function() {
    var currentPage = $('.pagination').find('.active');
    currentPage.removeClass('active');
    currentPage.addClass('waves-effect');
    var index = currentPage.index() + 1;
    $('.pagination > li:nth-child(' + (index + 1) + ')').addClass('active');
    showPage(currentPage.next());

});

$("#prev_page").on('click', function() {
    var currentPage = $('.pagination').find('.active');
    var index = currentPage.index() - 1;
    if (index >= 1) {
        currentPage.removeClass('active');
        currentPage.addClass('waves-effect');
        $('.pagination > li:nth-child(' + (index + 1) + ')').addClass('active');
        showPage(currentPage.next());
    }

});


var showPage = function(page) {
    $('.collapsible').children().remove();
    $(".preloader-wrapper").addClass('active');
    var pageNumber = (!random) ? (parseInt($(page).find('a').text()) - 1) : Math.floor(Math.random() * ((pages - 1) - 0 + 1) + 0);
    $.when(getContent(pageNumber, false)).done(function() {
        $(".preloader-wrapper").removeClass('active');
    });
}

$(document).ready(function() {
    $(".button-collapse").sideNav();
    $.when(getContent('0', true)).done(function() {
        $(".preloader-wrapper").removeClass('active');
    });

});