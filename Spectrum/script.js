c=document.querySelector('#c')
    x=c.getContext('2d')
    S=Math.sin
    C=Math.cos
    Rn=Math.random
    t=go=0
      rsz=window.onresize=()=>{
        setTimeout(()=>{
          if(document.body.clientWidth > document.body.clientHeight*1.77777778){
            c.style.height = '100vh'
            setTimeout(()=>c.style.width = c.clientHeight*1.77777778+'px',0)
          }else{
            c.style.width = '100vw'
            setTimeout(()=>c.style.height = c.clientWidth/1.77777778 + 'px',0)
          }
          c.width=1920
          c.height=c.width/1.777777778
        },0)
      }
      rsz()

    Draw=()=>{

if(!t){
  go=false
  bg=new Image()
  drawRotatedImage = (image, X, Y, width, height, angle) => { 
    x.save()
    x.translate(X, Y)
    x.rotate(angle)
    x.drawImage(image, -width/2, -height/2, width, height)
    x.restore()
  }
  bg.onload=()=>{
    go=true
  }
  bg.src='https://srmcgann.github.io/temp3/XOzgZ.png'
}
for(X=0,Y=0,x.fillStyle='#000',x.fillRect(0,0,w=2e3,w),i=2e3;i--;x.fillStyle=`hsla(${Math.hypot(1e3-(X=w/2+S(p=Math.atan2(S(a=i+t*2)*S(b=(i**2.7%1)**.5*(1.48+(Math.min(1,(C(t*1.5)*32+28)))*.091))*l,C(b)*l)+S(t/6)*3)/(Z=(s=C(a)*S(b)*l)/(h=540)/l*1.75)),540-(Y=h+C(p)/Z))-t*2000},99%,${180+C(t*1.5)*150}%,.1)`,
n=30/s,
x.fillRect(X-n/2,Y-n/2,n,n),n/=5,
x.clearRect(X-n/2,Y-n/2,n,n))l=(i**3.7%1)**.25
s=1.45+S(S(t)*40)/6
if(go) drawRotatedImage(bg,c.width/2+40,c.height/2,bg.width*s,bg.height*s,C(t/2)*10)

      t+=1/60
      requestAnimationFrame(Draw)
    }
    Draw()