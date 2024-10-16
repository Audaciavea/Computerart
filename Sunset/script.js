class Cloud{
  constructor(){
    this.x = random(width);
    let amt = pow(random(), .5)*scale;
    this.y = (scale-amt)*height/3;
    amt = amt*.8 + .2;
    this.w = amt*random(200, 600);
    this.h = amt*random(100, 200);
    this.amt = amt;
  }
  render(buffer){
    buffer.push();
    buffer.translate(this.x, this.y);
    buffer.noStroke();
    for (let i = 200; i > 0; i--){
      let amt = i/200;
      let s = random(40, 100)*this.amt;
      buffer.fill(.1, amt*.8, (amt)*.6 + .4, .4);
      let a = (1-abs(amt*2-1))*.8 + .2;
      let x = random(-.5, .5)*this.w*a;
      let y = amt*this.h;
      buffer.ellipse(x, y, s);
    }
    buffer.pop();
  }
}

function setup (){
  pixelDensity(1);
  createCanvas();
  colorMode(HSB, 1, 1, 1);
  windowResized();
}

let buffer;
let scale;
let init = () => {
  buffer = createGraphics(width, height);
  buffer.colorMode(HSB, 1, 1, 1);

  scale = height/800;
  
  buffer.background(0);
  for (let i = 0; i < height/2; i++){
    let amt = i/(height/2);
    let amt2 = pow(amt, 1.5);
    let hue = .05 + .6*(1 - amt);
    let sat = .1 + .9*(cos(amt2*TAU) + 1)/2;
    buffer.stroke(hue, sat, 1);
    buffer.line(0, i, width, i);
  }
  
  let clouds = [];
  let n = floor(20*width/800);
  for (let i = 0; i < n; i++){
    clouds.push(new Cloud());
  }
  
  clouds = clouds.sort((a, b) => (b.y-a.y));
  clouds.forEach(c => c.render(buffer));
  
  buffer.blendMode(ADD);
  buffer.noStroke();
  let s = height*.15;
  buffer.fill(.1, .8, 1, .1);
  for (let i = 0; i < 30; i++){
    buffer.ellipse(width/2, height/2, s + i*s/30);
  }
  
  
}

function draw(){
  blendMode(BLEND);
  image(buffer, 0, 0);
  let h = floor(height/2);
  translate(0, h-1);
  for (let i = 0; i < h+1; i++){
    let y = h - floor(i/4) - 2;
    let n = noise(i/10 + frameCount/50, frameCount/100);
    let n2 = noise(i/10 + frameCount/100, frameCount/200, 10000);
    let w = (n-.5)*h*(i/h);
    let x = (n2-.5)*h/2*(i/h);
    image(buffer, -w/2 + x, i, width+w, 1, 0, y, width, 1);
  }
  
  noStroke();
  blendMode(ADD);
  fill(.6, 1, 1, .3);
  rect(0, 0, width, h+1);
  blendMode(BLEND);
  rect(0, 0, width, h+1);
  
  blendMode(DARKEST);
  for (let i = 0; i < h+1; i++){
    let amt = i/h;
    stroke(.6, 1, amt, 1-amt);
    line(0, i, width, i);
  }
}

function mousePressed(){
  init();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  init();
}