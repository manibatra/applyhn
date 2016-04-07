var getContent = function(pageNo, loadPages) {


    $.ajax({
        url: "http://hn.algolia.com/api/v1/search?advancedSyntax=true&analytics=false&hitsPerPage=20&page=" + pageNo.toString() + "&query=%22applyyy+hn:%22&tags=story",
        success: function(data) {
            if (loadPages === true) {
                // console.log(data);
                var pages = data['nbPages'];
                var existing = $('.pagination').children().length;
                if ((existing - 2) < pages) {
                    for (var i = existing - 1; i <= pages; i++) {
                        $('.pagination > li:nth-child(' + (i) + ')').after('<li class="waves-effect"><a href="#!">' + i + '</a></li>');
                        $('.dropdown-content > li:nth-child(' + (i) + ')').after('<li><a href="#!">' + i + '</a></li>');
                    }
                }


            }

            for (key in data['hits']) {

                if (data["hits"][key]["title"].toLowerCase().indexOf('apply hn:') >= 0) {
                    $('.collapsible').append('<li>\
							<div class="collapsible-header"><div class="chip">' + data["hits"][key]["points"] +
                        '</div>' + data["hits"][key]["title"] + '</div>\
							<div class="collapsible-body"><p>' + data['hits'][key]['story_text'] + '</p></div>\
						</li>');
                }
            }


        },
        async: false
    });

}

$(document).on('click', '.pagination > .waves-effect, .dropdown-content > li', function(e) {

    var currentPage = $('.pagination').find('.active');
    currentPage.removeClass('active');
    currentPage.addClass('waves-effect');
    var index = $(this).index();
    $('.pagination > li:nth-child(' + (index + 1) + ')').addClass('active');
    showPage($(this));


});


var showPage = function(page) {
    $('.collapsible').children().remove();
    $(".preloader-wrapper").addClass('active');
    $.when(getContent((parseInt($(page).find('a').text()) - 1), false)).done(function() {
        $(".preloader-wrapper").removeClass('active');
    });
}

$(document).ready(function() {
    $(".button-collapse").sideNav();
    $.when(getContent('0', true)).done(function() {
        $(".preloader-wrapper").removeClass('active');
    });

});