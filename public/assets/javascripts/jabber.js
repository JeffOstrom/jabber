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
	$('.btn-update').on('click', function() {
        
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
});



