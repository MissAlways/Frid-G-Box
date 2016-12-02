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

});
// Get saved bookmarks to list 
$(document).on("pagecreate", "#bookmarks", function () {
    var recipe = storage.getItem("bookmarks");
    for (x = 0; x < storage.length; x++) {
        $("#bookmarkList").append("<tr><td> <a onClick='moveToRecipe(" + storage.key(x) + ")' href='#recipe'> <h2>" + storage.getItem(storage.key(x)) + "</h2> </a> </td><td> <a onclick='deleteRecipe(" + storage.key(x) + ")' href='#' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all'></a> </td></td></tr>");
    }
});

var storage = window.localStorage;

function addBookmark(id, name) {
    if (localStorage.getItem(id) === null) {
        storage.setItem(id, name);
        alert("Added to bookmarks");
    }
    else {
        alert("Its already in your bookmarks");
    }
}

function deleteRecipe(id) {
    storage.removeItem(id);
    refreshPage();
}

function refreshPage() {
    location.reload();
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
        // Place data to table 
        for (i = 0; i < data.recipes.length; i++) {
            id = data.recipes[i].recipe_id;
            image_url = data.recipes[i].image_url;
            title = data.recipes[i].title;
            $("#list").append("<tr>" + "<th>" + "<a onClick='moveToRecipe(" + id + ")' href='#recipe'><img src=" + image_url + " /> </a>" + "</th>" + "<th>" + "<a id=" + id + " onClick='moveToRecipe(" + id + ")' href='#recipe'><p>" + title + "</p> </a>" + "</th>" + "</tr>");
        }
    })
}

function moveToRecipe(id) {

    // Get api-key from api.js
    var apiKey = myKey.key;

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

        for (l = 0; l < data.recipe.ingredients.length; l++) {
            $("#ingrList").append("<li>" + data.recipe.ingredients[l] + "</li>");
        }
        // Recipe source change 
        $("#rSource_url").attr("href", data.recipe.source_url);
        $("#rSource").text(data.recipe.source_url);

    })

}