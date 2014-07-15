// search word parse
function AddFlag(word){
	var word = String(word);
	var parse = word.split("-");
	var cond = parse.length - 1;
	var search = word;
	var r = parse[cond];
	switch ((parse[cond].replace('ｆ','f')).replace('ａ','a')){
		case 'a':
			sessionStorage.setItem('arc', 'archive');
			search　= word.replace('-'　+　r, '');
		break

		case 'f':
			sessionStorage.setItem('fav', 1);
			search　= word.replace('-'　+　r, '');
		break

		case 'fa':
		case 'af':
			sessionStorage.setItem('fav', 1);
			sessionStorage.setItem('arc', 'archive');
			search　= word.replace('-' +　r, '');
		break
	}
	/*
	Pocket APIの使用上スペース区切りで複数の検索ワードを投げてもエラーとして帰ってくるため、
	複数の検索ワードは使用できない。
	しかしGoogle検索等と同じ感覚で使ってしまうため複数の検索ワードはどうしても使われてしまう。
	現状は複数の検索ワードをとりあえず投げてエラーを返しておく。(README.mdにその旨を書いておく)
	不便なようなら最初の文字列だけを投げるように変更する。
	*/
	search_t = $.trim(search);
	sessionStorage.setItem('search', search_t);
}