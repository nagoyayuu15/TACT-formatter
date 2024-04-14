# TACT-formatter
## create better ui for TACT
名古屋大学・岐阜大学で使用されているLMS、TACTのサイト一覧の表示を改善するchromium系ブラウザ拡張機能です。

### 1. サイトを時間割表で表示
TACTの~~信じられないほど見にくい~~サイト一覧を改善します。
サイト名から時間割を取得し、整列させます。

### 2. Comfortable Sakaiと共存
多くの人が使っているComfortable Sakaiはそのまま使えます。

## 導入方法
画面右上にある緑色のボタン[<>Code]をクリックし、表示されるDownload ZIPをクリックしてください。拡張機能が入ったzipファイルがダウンロードされますから、任意の場所に解凍(展開)してください。
それ以降の手順は以下のサイトを参考にしてください。
https://note.com/cute_echium873/n/n997dcf40b3a1

## その他
- Safariには対応していません。Chrome, Edge, Opera, Brave等のChromium系ブラウザのみ対応です。
- この拡張機能が原因で生じたいかなる損害に対しても責任を負いません。

~~不具合・バグを発見した場合はX(Twitter)の[@suke_0612](https://twitter.com/suke_0612)までご連絡ください。とても元気があったら直します。~~

このリポジトリは他の人間(nagoyayuu15@gmail.com)によるフォークです。

## Firefoxにおける使用

https://qiita.com/shuhey/items/57a732e3135b296e2fc1
を参考にself hostされています。

`.xpi`ファイルと`manifest.json`, `updates.json`は`https://vps.hbenpitsu.net/TTFF/`下に配置されています。

`.xpi`ファイルは`zip -r -FS ../TACT-formatter-for-firefox.xpi.zip * --exclude '*.git*'`によって出力されました。

https://addons.mozilla.org/firefox/downloads/file/4264145/2847be690a7940a9bec3-1.0.xpi
にアクセスしてインストールできます。
