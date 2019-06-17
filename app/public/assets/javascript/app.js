$(document).ready(function () {
    $("#submit").click(function (e) {
        $("#match-name").text("");
        $("#no-match-name").text("");
        $("#match-image").attr("src", "");
        $("#survey")[0].reportValidity();
        e.preventDefault();
        var formIsValid = $("#survey")[0].checkValidity();
        var user = new FormData();

        if (formIsValid) {
            $("#loader").removeClass("hide");
            var name = $("#fullname").val().trim();
            var image = $("#image").prop("files")[0];
            var userScores = [];
            $(".score").each(function () {
                var value = $(this).val();
                userScores.push(value);
            })

            user.append("file", image);
            user.append("name", name);
            user.append("scores", userScores);

            $.ajax({
                type: "POST",
                url: "/api/friends",
                processData: false,
                contentType: false,
                dataType: "json",
                data: user, 
                success: function(data, textStatus, jqXHR) {
                    $("#loader").addClass("hide");
                    if(data === null) {
                        $("#no-match-name").text("Sorry no match was found, try again later.");
                        $("#match-image").attr("src", "https://i.pinimg.com/236x/f7/46/11/f74611437f581854e3e86c036d409ba9--sad-faces-funny-faces.jpg");
                        $('.modal').modal();
                        $("#modal1").modal("open");
                    } else {
                        $("#match-name").text(data.name);
                        $("#match-image").attr("src", `https://auth-demo.s3.amazonaws.com/${data.image}.jpg`);
                        $('.modal').modal();
                        $("#modal1").modal("open");
                    }
                }
            })
        } else {
            alert("Check form and resubmit");
        }
    })

})


