(function() {
    var searchBar = $(".inputSearch");
    var artistFilter = $("#artist-filter");
    var albumFilter = $("#album-filter");
    var selectType = $(".select-type");
    var goButton = $("#go");
    var resultsBar = $(".results-bar");
    var resultsContainer = $("#container");
    var more = $("#morebutton");
    var xhr;
    var nextURL;

    goButton.on("click", function() {
        resultsBar.empty();

        $.ajax({
            url: "https://elegant-croissant.glitch.me/spotify",
            data: {
                q: searchBar.val(),
                type: selectType.val()
            },
            success: function(data) {
                data = data.artists || data.albums;

                var resultsHtml = "";
                console.log("1-", data);
                for (var i = 0; i < data.items.length; i++) {
                    console.log("2-", data);
                    if (data.items[i].images[0] && data.next != null) {
                        console.log("3-", data);
                        resultsHtml += '<div class="result">';
                        resultsHtml += "";
                        resultsHtml +=
                            '<img src="' +
                            data.items[i].images[0].url +
                            '">' +
                            "<p>" +
                            data.items[i].name +
                            "</p></div>";
                    } else {
                        if (data.items[i].images[0] == undefined) {
                            console.log("no image");
                            resultsHtml += '<div class="result">';
                            resultsHtml += "";
                            resultsHtml +=
                                '<img src="noimage.jpg">' +
                                "<p>" +
                                data.items[i].name +
                                "</p></div>";
                        } else {
                            if (data.next == null) {
                                $(".no-results").css({
                                    display: "block"
                                });
                            }
                        }
                    }
                }
                resultsBar.append(
                    'search results for "' + searchBar.val() + '"'
                );
                $(".results").html(resultsHtml)[0];
                if (data.next != null) {
                    nextURL = data.next.replace(
                        "https://api.spotify.com/v1/search?query=",
                        "https://elegant-croissant.glitch.me/spotify?q="
                    );
                    more.css({ display: "block" });
                } else {
                    more.css({ display: "none" });
                }
            }
        });
    });

    more.on("click", function(e) {
        if (nextURL) {
            if (xhr) {
                xhr.abort();
            }
            xhr = $.ajax({
                url: nextURL,
                success: function(data) {
                    data = data.artists || data.albums;
                    console.log(data);
                    var resultsHtml = "";
                    for (var i = 0; i < data.items.length; i++) {
                        if (data.items[i].images[0] && data.next != null) {
                            console.log("3-", data);
                            resultsHtml += '<div class="result">';
                            resultsHtml += "";
                            resultsHtml +=
                                '<img src="' +
                                data.items[i].images[0].url +
                                '">' +
                                "<p>" +
                                data.items[i].name +
                                "</p></div>";
                        } else {
                            if (data.items[i].images[0] == undefined) {
                                console.log("no image");
                                resultsHtml += '<div class="result">';
                                resultsHtml += "";
                                resultsHtml +=
                                    '<img src="noimage.jpg">' +
                                    "<p>" +
                                    data.items[i].name +
                                    "</p></div>";
                            }
                        }
                    }

                    $(".results").append(resultsHtml);

                    if (data.next != null) {
                        nextURL = data.next.replace(
                            "https://api.spotify.com/v1/search?query=",
                            "https://elegant-croissant.glitch.me/spotify?q="
                        );
                    } else {
                        more.css({ display: "none" });
                    }
                }
            });
        }
    });

    function hasReachedBottom() {
        if (
            $("document").height() - $("document").scrollTop >=
            $("window").height() + 100 + "px"
        )
            return true;
    }

    function checkScroll() {
        setTimeout(function() {
            if (hasReachedBottom() == true) {
                if (nextURL) {
                    if (xhr) {
                        xhr.abort();
                    }
                    xhr = $.ajax({
                        url: nextURL,
                        success: function(data) {
                            data = data.artists || data.albums;
                            console.log(data);

                            var resultsHtml = "";
                            for (var i = 0; i < data.items.length; i++) {
                                if (
                                    data.items[i].images[0] &&
                                    data.next != null
                                ) {
                                    console.log("3-", data);
                                    resultsHtml += '<div class="result">';
                                    resultsHtml += "";
                                    resultsHtml +=
                                        '<img src="' +
                                        data.items[i].images[0].url +
                                        '">' +
                                        "<p>" +
                                        data.items[i].name +
                                        "</p></div>";
                                } else {
                                    if (data.items[i].images[0] == undefined) {
                                        console.log("no image");
                                        resultsHtml += '<div class="result">';
                                        resultsHtml += "";
                                        resultsHtml +=
                                            '<img src="noimage.jpg">' +
                                            "<p>" +
                                            data.items[i].name +
                                            "</p></div>";
                                    }
                                }
                            }
                            more.css({ display: "none" });
                            $(".results").append(resultsHtml);
                            more.css({
                                display: "none"
                            });
                        }
                    });
                }
            } else {
                checkScroll();
            }
        }, 1000);
    }
})();
