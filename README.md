# Simple Pocket

## なにこれ
--
シンプルなPocketクライアントです。
Chrome Extensionとして動作します。

##　インストール方法
--
js/config.jsに*[Pocket Developer](http://getpocket.com/developer/)から取得したコンシューマキーを入力してください。
次に、設定→拡張機能からデベロッパーモードをオンにし、パッケージ化されていない拡張機能を読み込む　を選択から、このREADME.mdが入ってる階層を指定してください。

## 検索オプション
--
検索ワードの後に-をつけることで検索オプションが使用できます。
お気に入りに登録しているもののみ表示したい場合は-f
アーカイブに登録しているもののみ表示したい場合は-a
両方登録しているもののみ表示したいならば-afまたは-fa
でフィルタリングが可能です。
また、検索オプションのみ指定した場合は全Webページからフィルタリングした結果を表示します。

## 動作環境
--
Chrome/Chromium最新版を使用してください。

## 使用ライブラリ
--
*[jQuery](http://jquery.com/)
*[jquery_bottom](https://github.com/jimyi/jquery_bottom)
*[Bootstrap](http://getbootstrap.com/)

##　ライセンス
--
このChrome ExtensionはMITライセンスの元公開いたします。
上記の使用しているライブラリについてはそれぞれのライブラリのライセンスを受け継ぎます。