var PLAY = 1;
var END = 0;
var gameState = PLAY;

var shaktiman, shaktiman_running,shaktiman_collided;
var ground, invisibleGround, groundImage;
var bgImg;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  shaktiman_running = loadAnimation("SHAKTIMAN.2/sm2.gif","SHAKTIMAN.2/sm5.gif","SHAKTIMAN.2/sm9.gif");
  shaktiman_collided = loadAnimation("SHAKTIMAN.2/sm12.gif");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  bgImg = loadImage("Bazar bg.jpg")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1000, 400);

  var message = "This is a message";
 console.log(message)
  
 shaktiman = createSprite(50,340,20,50);
 shaktiman.addAnimation("running", shaktiman_running);
 shaktiman.addAnimation("collided", shaktiman_collided);
  

 shaktiman.scale = 0.3;
  
  ground = createSprite(500,360,1000,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(500,370,1000,10);
  invisibleGround.visible = false;

    bgground = createSprite(500,200,1000,400);
  bgground.addImage("bgground",bgTmg);
  bgground.x = ground.width /2;
  
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  //shaktiman.setCollider("rectangle",0,0,shaktiman.width,shaktiman.height);
  //shaktiman.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(bgImg);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& shaktiman.y >= 100) {
      shaktiman.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    shaktiman.velocityY = shaktiman.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(shaktiman)){
        //shaktiman.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the shaktiman animation
     shaktiman.changeAnimation("collided", shaktiman_collided);
    
     
     
      ground.velocityX = 0;
      shaktiman.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop shaktiman from falling down
  shaktiman.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState=PLAY
  gameOver.visible=false
  restart.visible=false 
  shaktiman.changeAnimation("running", shaktiman_running)

  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  score=0
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(1000,340,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(1000,100,40,10);
    cloud.y = Math.round(random(25,80));
    cloud.addImage(cloudImage);
    fill("blue");
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = shaktiman.depth;
    shaktiman.depth = shaktiman.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

