/* Custom JavaScript File */
/* --------------- */
/* Project Title : JABBER */
/* Team Members : 
    1) Jamal
    2) Jeff
    3) Kalpesh
    4) Peter */
/* Starting Date : 01-03-2018 */
/* Version : 1.0.0 */
/* Copyright reserved 2018 */
/* ----------------------- */

$(document).ready(function() {

	/* Edit Profile Text Fields */
	$('.edit').on('click', function() {

		var currentField = "#" + $(this).attr('id');
		var editField = currentField + "-edit"

		$(currentField).hide();
		$(editField).show();
		$(editField).focus();
		$('#btn-profile-update').show();

		$('#btn-profile-update').on('click', function() {
			$(".edit").each(function() {
				var eachUpdate = "#" + $(this).attr('id') + '-edit'
				$(this).html( $(eachUpdate).val().trim() );
			});

			$(editField).hide();
			$(currentField).show();

			var id = $('#user-image').attr('data-value');

			$.ajax({
				method: "POST",
				data: {
					firstname: $('#user-firstname').text(),
					lastname:  $('#user-lastname').text(),
					email: $('#user-email').text(),
					bio: $('#user-bio').text()
				},
				url: '/update/profile/' + id
			}).done(function(data) {
				location.reload();
			})
		});
	});

	/* Edit User Messages */
	$('.btn-update').on('click', function() {
        /* Toggle buttons to perform Update/Delete */
        var currentValue = $(this).attr('data-value').trim();
        var id = $(this).attr('record-id');
        
        if(currentValue === 'update') {
            $(this).attr('data-value','save');
            $(this).html('<i class="fas fa-save"></i>');
            $('#delete-' + id).html('<i class="fas fa-times-circle"></i>');
            $('#delete-' + id).attr('operation', 'cancel');
            var message = $('#message-' + id).text().trim();
            $('#message-' + id).hide();
            $('#update-message-' + id).show();
            $('#update-message-' + id).focus();
            $('#update-message-' + id).val(message);
        }
        else if(currentValue === 'save') {
            $(this).attr('data-value','update');
            $(this).html('<i class="fas fa-pencil-alt"></i>');
            $('#delete-' + id).html('<i class="fas fa-trash"></i>');
            $('#delete-' + id).attr('operation', 'delete');
            var message = $('#update-message-' + id).val();
            $('#message-' + id).show();
            $('#update-message-' + id).hide();

            $.ajax({
                method: "POST",
                data: {
                    'message': message
                },
                url: "/update/" + id
            }).done(function(data){
                location.reload();
            });
        }
    });

    /* When modal show up, grab the 'data-href' attribute of calling button */
    /* And set it to 'data-id' of 'Delete' button, so that we can grab that id on click event of Delete button */
    $('#exampleModalCenter').on('shown.bs.modal', function(event) {
        var id = $(event.relatedTarget).data('href');
        $('#btn-delete').attr('data-id', id);
    });

    /* This is Modal's Delete button which has 'data-id' attribute containing current post id */
    $('#btn-delete').on('click', function() {
        var id = $(this).attr('data-id');
        $.ajax({
            method: "POST",
            data: {
                'id': id
            },
            url: "/delete/" + id
        }).done(function(data){
            location.reload();
        });
    });

    /*Finding other user and function for modal*/
    $("#searchbtn").on("click", function(event) {

        event.preventDefault();

        //function to check the input is filled
        function validateForm() {
            var x = $("#lookup").val();
            if (x == "") {
                return false;
            } else {
                return true;
            }
        };

        //If the input, then run this code
        if(validateForm()){

            var email = $('#lookup').val().trim();

            $.ajax({
            method: "POST",
            data: {
                email: email
            },
            url: "/dashboard/search",
        }).done(function(data){

            /*Clearing input field and modal each time*/
            $("#lookup").val("");
            $("#insertdata").html("");

            /*Looping through the object being sent back*/
            for (var i = 0; i < data.length; i++) {

                var div = $("<div class='col-md-12'>");

                /*Profile Image*/
                var showimage = $("<img id=userProfilepic>");
                showimage.attr('src', '/assets/images/profile/'+ data[i].profilepicture +'');

                /*Profile Name*/
                var name = $("<h4>");
                name.attr('id', 'matchname');
                name.text(data[i].firstname + " " + data[i].lastname)

                /*Follow Button*/
                var firstButton = $('<button>');
                firstButton.attr('type', 'button');
                firstButton.addClass('btn bg-junglegreen text-white follow');
                firstButton.attr('id', 'follow');
                firstButton.attr('type', 'button');
                firstButton.addClass('follow followbtn');
                firstButton.attr('userid', data[i].id);
                firstButton.addClass('btn bg-junglegreen text-white');
                firstButton.attr('data-dismiss', 'modal');
                firstButton.text('Follow')

                /*View Profile Button*/
                var secondButton = $("<form action='/profile/" + data[i].id + "' method='POST'>" + 
               "<button type='submit' id=" + data[i].id + " class='btn bg-junglegreen text-white viewprofile'>View Profile</button></form>");

                div.append(showimage, name, firstButton, secondButton);

                $("#insertdata").append(div);
            };


            $("#matchuser").modal();
           
        });

        };  
    });

    /* GET News Feed Messages */
	$('#feed-tab').on('click', function() {

		$.get('/feed', function(data) {

			$('#feed').empty();
			var print = data;

			for (var i=0; i<print.length; i++) {

				//console.log(print[i]);

				var profilepicture = print[i].profilepicture;
				var fullname = print[i].fullname;
				var id = print[i].id;
				var message = print[i].message;
				var time = print[i].createdAt;
				var user = print[i].user;
				var image;
				var imageHtml;

				if (print[i].image !== null) {
					image = print[i].image;
					imageHtml = '<a href="assets/images/post/' + image + '" target="_blank">' + '<img src="assets/images/post/' + image + '" class="img-fluid user-picture">' + '</a>';
				} else { 
					imageHtml = '';
				};

				$('#feed').append( 
					'<div class="media">' +
						'<img class="rounded mr-3 post-picture follow" src="assets/images/profile/' + profilepicture + '" userid="' + user + '">' +
						'<div class="media-body">' +
							'<h5 class="mt-0">' + fullname + '</h5>' +
							imageHtml + 
							 '<br>' +
							'<span id="message-'+ id +'">' + message + '</span><br>' +
							'<small>' +
								'<span id="postedTime">' + moment(time).format('LLL') + '</span>' + 
							'</small><br>' +
						'</div>' +
					'</div>' +
					'<br>' + 
					'<hr class="hr-full">' 
				);

			}
		});

	});

 	/* Follow User */
    $(document).on ("click", ".follow", function () {
            
        var newFollow = $(this).attr('userid');
        var currentUser = $('#user-image').attr('data-value');
       
		$.ajax({
			method: "POST",
			url: "/follow/" + currentUser + "/" + newFollow
		}).done(function(data){
			//location.reload();
		});

	});


    $('#unfollow-btn').on('click', function() {
    	$('#fake-following').remove();
    })


});

