var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var gameOver, restart;

function preload() {
  mario_running = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  mario_collided = loadAnimation("collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("c5.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

 jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 400);

  mario = createSprite(50, 280, 20, 50);

  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 1;

  ground = createSprite(200, 280, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -5;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(200, 290, 400, 100);
  invisibleGround.visible = false;
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  mario.setCollider("rectangle",0,0,mario.width,mario.height);
  mario.debug=true;
  score = 0;

}

function draw() {

  background(255);
  text("Score: " + score, 500, 50);

  if (gameState === PLAY) {
    gameOver.visible = false
    restart.visible = false
     ground.velocityX = -(4 + 3* score/100)
   
    score = score + Math.round(getFrameRate() / 60);
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (keyDown("space") && mario.y >= 150) {
      mario.velocityY = -12;
       jumpSound.play();
    }
    mario.velocityY = mario.velocityY + 0.8
    spawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(mario)) {
      dieSound.play();
      gameState = END;
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    mario.velocityY = 0;
    mario.changeAnimation("collided", mario_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
    if(mousePressedOver(restart)) {
      reset();
    }
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

  }



  mario.collide(invisibleGround);

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 02, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 226, 10, 40);
    obstacle.debug = true;
    obstacle.velocityX = -(6+score/100);

    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;

      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);

  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  mario.changeAnimation("running", mario_running);
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}