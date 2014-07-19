//request add query
function AddUrl(){
	chrome.tabs.getSelected(function(tab){
		var add_url = tab.url;
		var add_title = tab.title;
		var user_info = JSON.parse(localStorage.getItem("user_info"));
		chrome.runtime.sendMessage({api: "add", token: user_info.access_token, url: add_url, title: add_title}, function(response){
			if(response.status == 1){
				InfoModal('Information', '追加しました');
			}else if(response.error){
				InfoModal('Error', response.error);
			}
		});
	});
}

//modify request
function QueryModify(action, query_id){
	var defer = new $.Deferred();
	chrome.runtime.sendMessage({api: "modify", action: action, id: query_id}, function(response){
		if(response.success == undefined){
			defer.reject();
		}else{
			defer.resolve();
		}
	});
	return defer.promise();
}