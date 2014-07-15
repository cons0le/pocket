$(document).on('click', '#clear', function(e){
	localStorage.clear();
	var get_cookies = {
		url: "https://getpocket.com"
	};
	chrome.cookies.getAll(get_cookies,function(c){
		for(var i = 0;i < c.length; i++){
			var r = {
				url: "https://getpocket.com",
				name: c[i].name
			};
			chrome.cookies.remove(r);
		}
		OptionInfoModal('Information', '認証を解除しました。');
	});
});

function OptionInfoModal(title,msg){
	$('#opt_msg_title').text(title);
	$('#opt_error_message').text(msg);
	$('#opt_msg_box').modal('show');
}