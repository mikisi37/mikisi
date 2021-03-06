//デバックフラグ
const DEBUG = true;

let drawCount=0;
let fps=0;
let lastTime=Date.now();


//スムージング
const SMOOTHING = false;

//ゲームスピード(ms)
const GAME_SPEED = 1000/60;

//画面サイズ
const SCREEN_W = 320;
const SCREEN_H = 320;

//キャンバスサイズ
const CANVAS_W = SCREEN_W *2;
const CANVAS_H = SCREEN_H *2;

//フィールドサイズ
const FIELD_W = SCREEN_W +120;
const FIELD_H = SCREEN_H +40;

//星の数
const STAR_MAX =300;

//ファイルを読み込み
let spriteImage = new Image();
spriteImage.src = "シューティングゲーム/sprite.png";

//キャンバス
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width = CANVAS_W;
can.height = CANVAS_H;

con.mozimageSmoothingEnagbled   =SMOOTHING;
con.webkitimageSmoothingEnabled =SMOOTHING;
con.msimageSmoothingEnabled     =SMOOTHING;
con.imageSmoothingEnabled       =SMOOTHING;

con.font="20px' Impact'";

//フィールド(仮想画面)
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");
vcan.width = FIELD_W;
vcan.height = FIELD_H;

//カメラ座標
let camera_x = 0;
let camera_y = 0;

//ゲームオーバーフラグ
let gameOver =false;

//スコア
let score = 0;

//星の実体
let star=[];

//キーボードの状態
let key=[];

//スコアチェック
let scores = 149;

//スキルアップ
let sukiru = 1;

//タイム計測
let time = 0;

//オブジェクトなど
let teki=[];
let teta=[];
let tama=[];
let expl=[];
let jiki = new Jiki();

//ゲーム初期化
function gameInit()
{
	for(let i=0;i<STAR_MAX;i++)star[i]= new Star();
	setInterval( gameLoop , GAME_SPEED );
}

//オブジェクトアップデートベース
function updateObj( obj )
{
	for(let i=obj.length-1;i>=0;i--)
	{
		obj[i].update();
		if(obj[i].kill)obj.splice( i,1 );
	}
}

//ゲームループ
function gameLoop()
{
	//テスト
	if( rand(0,50)==1)
	{
		let r = rand(0,1);
		teki.push( new Teki( r,rand(0,FIELD_W<<8),0, 0,rand(300,1200) ) );
	}

	//移動の処理
	for(let i=0;i<STAR_MAX;i++)star[i].update();

	updateObj(tama);
	updateObj(teta);
	updateObj(teki);
	updateObj(expl);

	if(!gameOver) jiki.update();

	//描画の処理
	vcon.fillStyle=(jiki.damage)?"#660000":"black";
	vcon.fillRect(camera_x,camera_y,SCREEN_W,SCREEN_H);

	for(let i=0;i<STAR_MAX;i++)star[i].draw();
	for(let i=0;i<tama.length;i++)tama[i].draw();
	for(let i=0;i<teta.length;i++)teta[i].draw();
	for(let i=0;i<teki.length;i++)teki[i].draw();
	for(let i=0;i<expl.length;i++)expl[i].draw();

	if(!gameOver) jiki.draw();

	//戦闘機の移動範囲 0 ～ FIELD_W
	//カメラ範囲 0 ～ (FIELD_W-SCREEN_W)
	camera_x = (jiki.x>>8)/FIELD_W * (FIELD_W-SCREEN_W);
	camera_y = (jiki.y>>8)/FIELD_H * (FIELD_H-SCREEN_H);

	//仮想画面から実際のキャンバスにコピー
	con.drawImage( vcan , camera_x,camera_y,SCREEN_W,SCREEN_H,
		0,0,CANVAS_W,CANVAS_H);

//情報の表示
	con.fillStyle = "green";

	if(gameOver)
	{
		let s= "GAME OVER";
		let w= con.measureText(s).width;
		let x= CANVAS_W/2 - w/2;
		let y= CANVAS_H/2 - 30;
		con.fillText(s,x,y);
		s= "Push 'Enter' key to restart";
		w= con.measureText(s).width;
		x= CANVAS_W/2 - w/2;
		y= CANVAS_H/2 + 10 ;
		con.fillText(s,x,y);
	}

	if(DEBUG)
	{
		drawCount++;
		if( lastTime +1000 <=Date.now() )
		{
			fps=drawCount;
			drawCount=0;
			lastTime=Date.now();
		}

		con.fillText("FPS:"+fps,10,20);
		con.fillText("X:"+(jiki.x>>8),100,20);
		con.fillText("Y:"+(jiki.y>>8),193,20);
		con.fillText("Time:"+(Math.round(time)),265,20)
		con.fillText("HP:"+jiki.hp,380,20);
		con.fillText("SkillLV:"+sukiru,470,20)

		con.fillText("Bullet:"+tama.length,10,40);
		con.fillText("Enemy:"+teki.length,100,40);
		con.fillText("Enemy Bullet:"+teta.length,195,40);
		con.fillText("Score:"+score,380,40);
	}

	//スコアでHP回復＆スキルアップ

	if(score > scores)
	{
		scores += 150;
		jiki.hp += 20;
		if(sukiru<5)
		{
			sukiru += 1;
		}
	}

	//タイムカウント
	if(!gameOver)
	{
		time += 0.017;
	}

}

//オンロードでゲーム開始
window.onload=function()
{
	gameInit();
}
