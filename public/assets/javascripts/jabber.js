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
});



