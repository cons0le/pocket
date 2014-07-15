//ajax query load
$(document).ready(function() {
	$(window).bottom({proximity: 0});
	$(window).bind('bottom', function(){
		var bind_obj = $(this);
		if(!bind_obj.data('loading')) {
			console.log($('#queries').height() - $('#queries').scrollTop());
			if(($('html').height() - $(document).scrollTop()) < 800){
				bind_obj.data('loading', true);
				$('#queries').append('<div class = "load"><img src = "../icons/gif-load.gif"></div>');
				setTimeout(function(){
					GetItems(bind_obj);
				}, 200);
			}
		}
	});
});


// get queries
function GetItems(loading){
	var query_offset = Number(sessionStorage.getItem('offset'));
	if(query_offset == 0) query_offset = 0;
	var search　= sessionStorage.getItem('search');
	if(search){
		AddFlag(search);
	}
	chrome.runtime.sendMessage(
		{
			api: "get",
	 		article: 15,
	 		offset: query_offset,
	 		state: sessionStorage.getItem('arc'),
	 		fav: sessionStorage.getItem('fav'),
	 		search: sessionStorage.getItem('search')
	 	},
	 function(response){
		if(response.error){
			if(!sessionStorage.getItem('modal')){
				InfoModal('Error', response.error);
				sessionStorage.setItem('modal', 1);
			}
		}else{
			var i = 0;
			var count = Object.keys(response.data).length;
			for(var query in response.data){
				var obj = response.data[query];
				if(obj.status == 2)obj.status = 0;
				if(obj.given_url == '' || typeof obj.given_url == 'undefined')obj.given_url = obj.resolved_url;
				if(obj.given_title == '' || typeof obj.given_title == 'undefined')obj.given_title = obj.resolved_title || obj.given_url; //a || b という書式はaが未定義であればbを使うという意味
				QueryGenerate(obj.item_id, obj.given_url, obj.given_title, obj.favorite, obj.status);
				i++;
				if(i == count)sessionStorage.setItem('offset', query_offset + i);
			}
		}
		if($('html').height() > $('#queries').height()){
			$('#queries').css('height', $('body').height() + 1);
		}
		if(typeof loading !== 'undefined'){
			$('div.load').remove();
			loading.data('loading', false);
		}
	});
}

//generate queries
function QueryGenerate(query_id, query_url, query_title, fav_flag, arc_flag){
	query_id_R = 'ii'　+　query_id;
	var base_tag = '<div id="'+ query_id_R + '\" '+'class="query">';
	if(!typeof query_title == 'undefined'){
		var query_title = query_url;
	}else{
		var title_text = '<a href = \"' + query_url + '\"'+ ' target=\"_blank\"' + '>' + query_title + '</a>';
		var url_text = '<div class = "url_text"><a href = \"' + query_url + '\" class = "url_text" target=\"_blank\" >' + String(query_url).substring(0,19) + '....' +'</a></div>';
	}
	var point = $('#queries');
	point.append(base_tag);
	var name = point.children('#' + query_id_R);
		name
			.append('<div class = "title">');
			name.children('div.title')
				.append(title_text);
		name
			.append('<div class = "tool">');
			name.children('div.tool')
				.append(url_text)
				.append('<ul class = "actions">');
			name.find('ul.actions')
				.append('<li class = "glyphicon glyphicon-ok"></li>')
				.append('<li class = "glyphicon glyphicon-star"></li>')
				.append('<li class = "glyphicon glyphicon-trash"></li>')
					.attr({
						'data-query_id': query_id,
						'data-arc_flag': arc_flag,
						'data-fav_flag': fav_flag
					});
	if(arc_flag == 1){
		$('#' + query_id_R + ' li.glyphicon-ok').css('color', 'yellow');
	}
	if (fav_flag == 1) {
		$('#' + query_id_R + ' li.glyphicon-star').css('color', 'yellow');
	}
}