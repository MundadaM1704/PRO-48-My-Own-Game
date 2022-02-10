var bg, bgImg;
var player, playerImg;
var coin, coinImg, coinGroup;
var obstacle1, obstacle2, obstacle3, obstacle4, obstaclesGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var coinSound, dieSound;
var edges;
var invisibleGround;
var gameState = "PLAY";
var score;

function preload(){
  playerImg = loadAnimation("p1.png","p2.png","p3.png","p4.png","p5.png","p6.png","p7.png","p8.png"); 
  bgImg = loadImage("Ground.jpg");
  coinImg = loadImage("coin.png");
  obstacle1 = loadImage("obstacle-1.png");
  obstacle2 = loadImage("obstacle-2.png");
  obstacle3 = loadImage("obstacle-3.png");
  obstacle4 = loadImage("obstacle-4.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  coinSound = loadSound("coin.wav");
  dieSound = loadSound("die.mp3");
}

function setup(){
  createCanvas(450,190);
  
  bg = createSprite(0,0,450,190);
  bg.addImage(bgImg);
  bg.scale = 2;
  bg.x = bg.width/2;
  bg.velocityX = -4;
  
  player = createSprite(70,128,50,50);
  player.addAnimation("running",playerImg);
  player.scale = 0.6;
  
  invisibleGround = createSprite(0,190,600,20);
  invisibleGround.visible = false;
  
  gameOver = createSprite(220,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(220,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
   
  edges = createEdgeSprites()
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw(){
  background(255);
  
  if(gameState === "PLAY"){
    console.log("GameState: ",gameState);
    
  if(bg.x < 200){
    bg.x = bg.width/2;
  }
  
  if(keyDown("space") && player.y >= 60){
    player.velocityY = -8.5;
  }
    
  bg.velocityX = -(4+3*score/100);
  
  player.velocityY = player.velocityY+0.5;
  player.collide(edges);
  player.collide(invisibleGround);
  
  spawnCoins();
  spawnObstacles();

    
    if(coinGroup.isTouching(player)){
      coinGroup.destroyEach();
      coinSound.play();
      score = score + 1;
      console.log("GREAT!! Your score is ",score);
    }
    
    if(obstaclesGroup.isTouching(player)){
      gameState = "END";
      dieSound.play();
      console.log("GameState: ", gameState);
    }
  }
  
  else if(gameState === "END"){
    gameOver.visible = true;
    restart.visible = true;
    
    player.velocityX = 0;
    player.velocityY = 0;
    
    bg.velocityX = 0;
    
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    player.destroy();
    coinGroup.destroyEach();
    obstaclesGroup.destroyEach();
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
  
  textSize(15);
  fill("black");
  text("Score : "+score,10,20);
}

function spawnCoins(){
  if(frameCount%70 === 0){
    coin = createSprite(580,60);
    coin.addImage(coinImg);
    coin.velocityX = -5;
    coin.scale = 0.1;
    coin.lifetime = 600;
    coinGroup.add(coin);
  }
}

function spawnObstacles() {
  if(frameCount%80 === 0) {
    var obstacle = createSprite(600,165,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle3);
              break;
      case 2: obstacle.addImage(obstacle4);
              break;
      case 3: obstacle.addImage(obstacle1);
              break;
      case 4: obstacle.addImage(obstacle2);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);          
    obstacle.scale = 0.35;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = "PLAY";
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  player = createSprite(70,128,50,50);
  player.addAnimation("running",playerImg);
  player.scale = 0.6;
  
  score = 0; 
}