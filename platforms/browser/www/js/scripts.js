<!-- Aplication scale -->
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

function getData() {
    <!-- Get text from input -->
    var searched = $("#searchResipe").val();
    <!-- Get api-key from api.js-->
    var apiKey = myKey.key;
    <!-- Get data -->
    $.ajax({
        url: "http://food2fork.com/api/search?key=" + apiKey + "&q=" + searched,
        dataType: "json",
        timeout: 5000,
		cached: false
    }).done(function (data) {
        console.log(data.recipe);
        <!-- Removes the child elements of the list-->
        $("#list").empty();
        var id;
        var title;
        var image_url;
        <!-- Place data to table -->
        for (i = 0; i < 30; i++) {
            <!-- Checks if data is not null and adds data to table -->
            if (data.recipes[i].image_url != null) {
                id = data.recipes[i].recipe_id;
				image_url = data.recipes[i].image_url;
                title = data.recipes[i].title;
                $("#list").append("<tr>" + "<th>" + "<a onclick=moveToRecipe(id) href=#recipe><img src=" + image_url + " /> </a>" + "</th>" + "<th>" + "<a id="+id+" onclick=moveToRecipe(id) href=#recipe><p>" + title + "</p> </a>" + "</th>" + "</tr>");
            }
        }
    })
}

function moveToRecipe(id) {
    <!-- Get api-key from api.js-->
    var apiKey = myKey.key;
    <!-- Get data -->
    $.ajax({
        url: "http://food2fork.com/api/get?key=" + apiKey + "&rId=" + id,
        dataType: "json",
        timeout: 5000,
        cached: false
    }).done(function (data) {
        <!-- Removes the child elements of the ingrList-->
        $("#ingrList").empty();

        $("#recipeId").attr("name", id);
        <!-- Recipe image change -->
        $("#rPicture").attr("src", data.recipe.image_url);
        <!-- Recipe name change -->
        $("#rName").text(data.recipe.title);

        for (l = 0; l < data.recipe.ingredients.length; l++) {
            $("#ingrList").append("<li>" + data.recipe.ingredients[l] + "</li>");
        }
        <!-- Recipe source change -->
        $("#rSource_url").attr("href", data.recipe.source_url);
        $("#rSource").text(data.recipe.source_url);

    })

}

function addBookmark(id, name) {
    console.log("id: "+id+", name: "+name);
}

