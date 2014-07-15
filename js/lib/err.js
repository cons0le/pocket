//　error message
function InfoModal(title,msg){
	$('#msg_title').text(title);
	$('#error_message').text(msg);
	$('#msg_box').modal('show');
}