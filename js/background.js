chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.api == 'auth_start') {
		var send = {
			"consumer_key" : consumer_key,
			"redirect_uri" : "chrome-extension://"　+　chrome.i18n.getMessage("@@extension_id")
		};
		$.ajax({
			async: false,
			type:"post",
			url:"https://getpocket.com/v3/oauth/request",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Accept", "application/json");
			},
			data:JSON.stringify(send),
			contentType: "application/json",
			dataType:"json",
			})
		.always(function(res){
			switch(res.status){
				case 400: 
				case 403:
					chrome.tabs.create({url: 'about:blank'}, function(tab){
						alert('コンシューマキーが違う可能性があります。確認して下さい。');
						chrome.tabs.remove(tab.id);
					});					
				break

				case undefined:
					localStorage.setItem('req_code',res.code);
					chrome.tabs.create({url: "https://getpocket.com/auth/authorize?request_token="+res.code}, function(tab){
						localStorage.setItem("tabid",tab.id);
					});
				break

				default:
					chrome.tabs.create({url: 'about:blank'}, function(tab){
						alert('リクエストコードを取得できませんでした。Pocket APIサーバがダウンしている可能性があります。');
						chrome.tabs.remove(tab.id);
					});
				break
			}
		});
	}
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
	if(req.api == "get_token"){
		var send = {
			"consumer_key" : consumer_key,
			"code" : localStorage.getItem('req_code')
		};
		localStorage.removeItem('req_code');
		$.ajax({
			async: false,
			type:"post",
			url:"https://getpocket.com/v3/oauth/authorize",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Accept", "application/json");
			},
			data:JSON.stringify(send),
			contentType: "application/json",
			dataType:"json",
		})
		.always(function(res){
			switch(res.status){
				case 400: 
				case 403:
					alert('エラーが発生しました。もう一度最初からやり直してみてください。それでもこのメッセージが出るならばPocket Webサイトからアプリ認証を解除して認証をやり直してみてください。');
					var tabid = Number(localStorage.getItem('tabid'));
					chrome.tabs.remove(tabid);
					localStorage.removeItem('req_code');
					localStorage.removeItem('tabid');
				break

				case undefined:
					localStorage.setItem('user_info', JSON.stringify(res));
					var tabid = Number(localStorage.getItem('tabid'));
					chrome.tabs.remove(tabid);
					localStorage.removeItem('tabid');
				break

				default:
					alert('エラーが発生しました。Pocket APIサーバーがダウンしている可能性があります。');
					var tabid = Number(localStorage.getItem('tabid'));
					chrome.tabs.remove(tabid);
					localStorage.removeItem('req_code');
					localStorage.removeItem('tabid');
				break			
			}
		});
	}
});

chrome.tabs.onRemoved.addListener(function(tabid) {
	var tab_auth = Number(localStorage.getItem('tabid'));
	if(tabid == tab_auth){
		if(localStorage.getItem('user_info') == null){
			var send = {
				"consumer_key" : consumer_key,
				"code" : localStorage.getItem('req_code')
			};
			localStorage.removeItem('req_code');
			$.ajax({
				async: false,
				type:"post",
				url:"https://getpocket.com/v3/oauth/authorize",
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-Accept", "application/json");
				},
				data:JSON.stringify(send),
				contentType: "application/json",
				dataType:"json",
			})
			.always(function(res){
				switch(res.status){
					case 400: 
					case 403:
						alert('エラーが発生しました。もう一度最初からやり直してみてください。それでもこのメッセージが出るならばPocket Webサイトからアプリ認証を解除して認証をやり直してみてください。');
						var tabid = Number(localStorage.getItem('tabid'));
						chrome.tabs.remove(tabid);
						localStorage.removeItem('req_code');
						localStorage.removeItem('tabid');
					break

					case undefined:
						localStorage.setItem('user_info', JSON.stringify(res));
						var tabid = Number(localStorage.getItem('tabid'));
						localStorage.removeItem('tabid');
					break

					default:
						alert('エラーが発生しました。Pocket APIサーバーがダウンしている可能性があります。');
						var tabid = Number(localStorage.getItem('tabid'));
						chrome.tabs.remove(tabid);
						localStorage.removeItem('req_code');
						localStorage.removeItem('tabid');
					break			
				}
			});
		}
	}
});



chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.api == 'get') {
    	var token = JSON.parse(localStorage.getItem("user_info")).access_token;
    	if(req.state == null)req.state = 'all';
		var send = {
			"consumer_key": consumer_key,
			"access_token": token,
			"state": req.state,
			"sort": "newest",
			"count": req.article,
			"offset": req.offset
		};
		if(!(req.search === null)) send.search = req.search;
		if(!(req.fav === null)) send.favorite = req.fav;
		$.ajax({
			async: false,
			type:"post",
			url:"https://getpocket.com/v3/get",
			data:JSON.stringify(send),
			contentType: "application/json",
			dataType:"json",
			})
		.always(function(res){
			switch(res.status){
				case 1:
					var query = {data: res.list};
					sendResponse(query); 
				break

				case 400:
					var query = {error: '想定外のエラーが発生しました。何度も出るようであれば連絡をお願いします。'}; //json proper syntax error proper=構文
					sendResponse(query);
				break

				case 401:
					var query = {error: 'トークンが無効です。認証をやり直してみてください'}; //missing token
					sendResponse(query);
				break

				case 403:
					var query = {error: '正しい権限を持っていないコンシューマキーを使っているか、API呼び出し回数が制限を超えています。'}; //rate limiting or bad permission
					sendResponse(query);
				break

				case 503:
					var query = {error: 'Pocket APIサーバーがダウンしている可能性があります。'}; // Pocket API server is down or maintenance
					sendResponse(query);
				break

				default:
					var query = {error: '条件に適合するクエリがありません。'}; //unknown error
					sendResponse(query);
				break
			}
		});
	}
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.api == 'add') {
    	var token = JSON.parse(localStorage.getItem('user_info')).access_token;
		var send = {
			"consumer_key": consumer_key,
			"access_token": token,
			"title": req.title,
			"url": req.url
		};
		$.ajax({
			async: false,
			type:"post",
			url:"https://getpocket.com/v3/add",
			data:JSON.stringify(send),
			contentType: "application/json",
			dataType:"json",
			})
		.always(function(res){
			switch(res.status){
				case 1:
					var query = {status: "1"};
					sendResponse(query); 
				break

				case 400:
					var query = {error: '想定外のエラーが発生しました。何度も出るようであれば連絡をお願いします。'}; //json proper syntax error proper=構文
					sendResponse(query);
				break

				case 401:
					var query = {error: 'トークンが無効です。認証をやり直してみてください'}; //missing token
					sendResponse(query);
				break

				case 403:
					var query = {error: '正しい権限を持っていないコンシューマキーを使っているか、API呼び出し回数が制限を超えています。'}; //rate limiting or bad permission
					sendResponse(query);
				break

				case 503:
					var query = {error: 'Pocket APIサーバーがダウンしている可能性があります。'}; // Pocket API server is down or maintenance
					sendResponse(query);
				break

				default:
					var query = {error: '不明なエラーが発生しました。'}; //unknown error
					sendResponse(query);
			}
		});
	}
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.api == 'modify') {
    	var token = JSON.parse(localStorage.getItem("user_info")).access_token;
		var send = {
			"consumer_key": consumer_key,
			"access_token": token,
			"actions":
			[
				{
					"action": req.action,
					"item_id": req.id
				}
			]
		};
		$.ajax({
			async: false,
			type:"post",
			url:"https://getpocket.com/v3/send",
			data:JSON.stringify(send),
			contentType: "application/json",
			dataType:"json",
			})
		.always(function(res){
			switch(res.status){
				case 1:
					var query = {success: "ok"};
					sendResponse(query); 
				break

				case 400:
					var query = {error: '想定外のエラーが発生しました。何度も出るようであれば連絡をお願いします。'}; //json proper syntax error proper=構文
					sendResponse(query);
				break

				case 401:
					var query = {error: 'トークンが無効です。認証をやり直してみてください'}; //missing token
					sendResponse(query);
				break

				case 403:
					var query = {error: '正しい権限を持っていないコンシューマキーを使っているか、API呼び出し回数が制限を超えています。'}; //rate limiting or bad permission
					sendResponse(query);
				break

				case 503:
					var query = {error: 'Pocket APIサーバーがダウンしている可能性があります。'}; // Pocket API server is down or maintenance
					sendResponse(query);
				break

				default:
					var query = {error: '不明なエラーが発生しました。'}; //unknown error
					sendResponse(query);
				break
			}
		});
	}
});