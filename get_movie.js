const request = require("request");
const cheerio = require("cheerio");

/* 
目指す最終形
movie_lists = {
  タイトル:公開日,
  タイトル:公開日,
  タイトル:公開日,
  ...全ページに乗ってる映画のkey(タイトル):value(公開日)を作成 
};

request処理全体をfor文でループさせる
① ~ ③ をページ分繰り返す
1.ページネーション分の処理を繰り返す
url iは10まで
https://eiga.com/now/all/release/i/

2.ページ毎の処理は以下
request でページデータを取得
$("セレクタ").eachで
タイトルの配列作成
公開日の配列作成

3.作成した配列要素数の数だけループして
movie_listsに対してkey valueの形式で作られた2つの配列を追加して終了

4.全てのループが終了したらmovie_listsが完成 console.logで360件のデータが入ってればOK
※ページ毎の処理で行っている requestが非同期のため、全部が終わったあとのデータが取得できない

*/

const movie_lists = {};

for (i = 0; i < 10; i++) {
  //1ページ毎に
  let num = i + 1;
  url = "https://eiga.com/now/all/release/" + num + "/";
  console.log(url);
  //ページ毎に配列を作ってオブジェクトに入れたら初期化して作り始める
  let release_date = [];
  let title = [];

  request(url, (e, response, body) => {
    if (e) {
      console.error(e);
    }
    try {
      let $ = cheerio.load(body); //bodyの読み込み

      $("div", ".m_unit").each((index, elem) => {
        release_date[index] = $(elem).text();
      });

      $("h3", ".m_unit").each((index, elem) => {
        title[index] = $(elem).text();
      });
      console.log(release_date); //ここまではうまくいく
      console.log(title); //ここまではうまくいく
    } catch (e) {
      console.error(e);
    }
    for (l = 0; l < release_date.length; l++) {
      movie_lists[title[l]] = release_date[l];
    }
  });

  // console.log(movie_lists);
  //ここで 作り上がったrelease_dateとtitleの配列を元に
  //movie_listsオブジェクトに対してキーをタイトル、バリューを公開日にして、オブジェクトのプロパティとして追加して行きたい
  //↑↑↑↑↑requestが非同期で処理されるので このタイミングで作られた配列コンソールログしてもデータが入っていない

  // for (l = 0; l < release_date.length; l++) {
  //   movie_lists[release_date[l]] = title[l];
  // }
}
