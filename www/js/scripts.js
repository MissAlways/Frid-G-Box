// Aplication scale
$(document).on("pagecreate", function () {

    $(document).on("pagecontainershow", function () {
        ScaleContentToDevice();
    });

    $(window).on("resize orientationchange", function () {
        ScaleContentToDevice();
    });

    function ScaleContentToDevice() {
        scroll(0, 0);
        var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
        $(".ui-content").height(content);
    }
});

$(document).on("pagecreate", "#mainpage", function () {
    // Search receipe
    $("#searchBtn").click(function () {
        getData();
    });

    // Add recipe to bookmarks
    $("#addBookmarkBtn").click(function () {
        addBookmark($("#recipeId").attr('name'), $("#rName").text());
    });

    // Get bookmarks 
    $("#getBookmarksBtn").click(function () {
        getBookmarks();
    });
});
// Get saved bookmarks to list 
$(document).on("pagecreate", "#bookmarks", function () {
    var recipe = storage.getItem("bookmarks");
    for (x = 0; x < storage.length; x++) {
        $("#bookmarkList").append("<li>" + "<a onClick=moveToRecipe(" + storage.key(x) +") href=#recipe> <h2>" + storage.getItem(storage.key(x)) + "</h2> </a>" + "</li>");
    }
});

var storage = window.localStorage;

function addBookmark(id, name) {
    if(localStorage.getItem(id) === null){
        storage.setItem(id, name);
        alert("Added to bookmarks");
    }
    else {
        alert("Its already in your bookmarks");
    }


}


function getData() {
    // Get text from input 
    var searched = $("#searchResipe").val();
    // Get api-key from api.js
    var apiKey = myKey.key;
    // Get data 
    $.ajax({
        url: "http://food2fork.com/api/search?key=" + apiKey + "&q=" + searched,
        dataType: "json",
        timeout: 5000,
        cached: false
    }).done(function (data) {
        // Removes the child elements of the list
        $("#list").empty();
        var id;
        var title;
        var image_url;
        var maxlength = 30; // 30 is max recipes per call
        // Place data to table 
        for (i = 0; i < maxlength; i++) {
            if (data.recipes[i].recipe_id != null) {
                id = data.recipes[i].recipe_id;
                image_url = data.recipes[i].image_url;
                title = data.recipes[i].title;
                $("#list").append("<tr>" + "<th>" + "<a onClick=moveToRecipe(" + id + ") href=#recipe><img src=" + image_url + " /> </a>" + "</th>" + "<th>" + "<a id=" + id + " onClick=moveToRecipe(" +id+ ") href=#recipe><p>" + title + "</p> </a>" + "</th>" + "</tr>");
            }
            else {
                break;
            }
        }
    })
}

function moveToRecipe(id) {
	
    // Get api-key from api.js
    var apiKey = myKey.key;
	
	console.log("http://food2fork.com/api/get?key=" + apiKey + "&rId=" + id);
	
    // Get data 
    $.ajax({
        url: "http://food2fork.com/api/get?key=" + apiKey + "&rId=" + id,
        dataType: "json",
        timeout: 5000,
        cached: false
    }).done(function (data) {
        // Removes the child elements of the ingrList
        $("#ingrList").empty();
        // Recipe id is hided under name in div 
        $("#recipeId").attr("name", id);
        // Recipe image change 
        $("#rPicture").attr("src", data.recipe.image_url);
        // Recipe name change 
        $("#rName").text(data.recipe.title);

        var maxlength = 40; //40 will be max ingredients

        for (l = 0; l < maxlength; l++) {
            console.log(data.recipe.ingredients.length);
			if (data.recipe.ingredients[l] != null) {
                $("#ingrList").append("<li>" + data.recipe.ingredients[l] + "</li>");
            }else {
                break;
            }
        }
        // Recipe source change 
        $("#rSource_url").attr("href", data.recipe.source_url);
        $("#rSource").text(data.recipe.source_url);

    })

}


