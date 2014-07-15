$(function(){
	if(!(localStorage.getItem('user_info'))){
		$('#auth').show();
	}else{
		GetItems()
		$('#main').show();
	}
});


// event listener
$(document).on('click', '#auth button', function(e){
	if(!(localStorage.getItem("user_info"))){
		chrome.runtime.sendMessage({api: "auth_start"});
	}else{
		$('#auth').hide();
		$('#main').show();
	}
});


$(document).on('click', '.glyphicon-star' ,function(e){
	var fav_data = $(this).parent('.actions');
	var query_id = fav_data.data('query_id');
	var selector = $(this);
	if(fav_data.data('fav_flag') == 1){
 		QueryModify('unfavorite', query_id)
	 	.done(function(){
			selector.css('color', 'black');
			$(fav_data).data('fav_flag' ,'0');
		})
		.fail(function(){
			var msg = 'Favriteの解除に失敗しました。';
			InfoModal('Error', msg);
		});
 	}else{
	 	QueryModify('favorite', query_id)
	 	.done(function(){
			selector.css('color', 'yellow');
			$(fav_data).data('fav_flag' ,'1');
		})
		.fail(function(){
			var msg = 'Favriteに失敗しました。';
			InfoModal('Error', msg);
		});
	}
});

$(document).on('click', '.glyphicon-ok', function(e){
	var selector = $(this);
	var arc_data = $(this).parent('.actions');
	var query_id = arc_data.data('query_id');
	 if(arc_data.data('arc_flag') == 1){
	 	var deferred = QueryModify('readd', query_id);

	 	deferred.done(function(){
	 		selector.css('color', 'black');
	 		$(arc_data).data('arc_flag' ,'0');
	 	})

	 	.fail(function(e){
			var msg = 'archiveの解除に失敗しました。';
			InfoModal('Error', msg);
	 	});
	 }else{
	 	var deferred = QueryModify('archive', query_id);

	 	deferred.done(function(){
	 		selector.css('color', 'yellow');
	 		$(arc_data).data('arc_flag' ,'1');
	 	})

		.fail(function(e){
			var msg = 'archiveに失敗しました。';
			InfoModal('Error', msg);
	 	});
	 }
});

$(document).on('click', '.glyphicon-trash' ,function(e){
	var query_id = $(this).parent('.actions').data('query_id');
	var deferred = QueryModify('delete', query_id);

	deferred.done(function(){
		query_selector = '#ii' + query_id;
	 	$(query_selector).hide('slow');
	})

	.fail(function(){
		var msg = 'アイテムの削除に失敗しました。';
		InfoModal('Error', msg);
	});

});


$(document).on('click', '.glyphicon-refresh', function(){
	$('#queries .query').remove();
	sessionStorage.removeItem('offset');
	GetItems();
});


$(document).on('click', '.glyphicon-plus', function(){
	AddUrl();
});



$(document).on('click', '.glyphicon-search', function(){
	var words = $('#search_box').val();
	if(words == ''){
		return false;
	}
	$('#queries .query').remove();
	RemoveCond();
	sessionStorage.setItem('search', words);
	sessionStorage.getItem('search');
	GetItems();
	$('.glyphicon-arrow-left').parent().css('visibility','visible');
});

$('.form-inline').submit(function() {
	var input = $(this).children('#search_box').val();
	if(input == ""){
		return false;
	}
	$('#queries .query').remove();
	RemoveCond();
	sessionStorage.setItem('search', input);
	$('.glyphicon-arrow-left').parent().css('visibility','visible');
	GetItems();
	return false;
});


$(document).on('click', '.glyphicon-arrow-left', function(){
	RemoveCond();
	$('#queries .query').remove();
	GetItems();
	$(this).parent().css('visibility','hidden');
});