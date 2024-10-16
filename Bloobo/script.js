c=document.querySelector('#c')
c.width  = 1920
c.height = 1080
x=c.getContext('2d')
S=Math.sin
C=Math.cos
Rn=Math.random
R = function(r,g,b,a) {
  a = a === undefined ? 1 : a;
  return "rgba("+(r|0)+","+(g|0)+","+(b|0)+","+a+")";
};
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
    R=(Rl,Pt,Yw,m)=>{
      M=Math
      A=M.atan2
      H=M.hypot
      X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
      Y=C(p)*d
      Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
      Z=C(p)*d
      X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
      Z=C(p)*d
      if(m){ 
        X+=oX
        Y+=oY
        Z+=oZ
      }
    }
    Q=()=>[c.width/2+X/Z*800,c.height/2+Y/Z*800]
    I=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0

    stroke=(scol,fcol)=>{
      if(scol){
        x.lineJoin=x.lineCap='butt'
        x.closePath()
        //x.globalAlpha=.2
        x.strokeStyle=scol
        x.lineWidth=Math.min(500, 200/Z)
        //x.stroke()
        x.globalAlpha=1
        x.lineWidth/=4
        x.stroke()
        x.lineJoin=x.lineCap='butt'
      }
      if(fcol){
        x.fillStyle=fcol
        x.fill()
      }
    }

    stroke2=(scol,fcol)=>{
      if(scol){
        x.closePath()
        x.globalAlpha=.2
        x.strokeStyle=scol
        x.lineWidth=Math.min(500, 500/Z)
        x.stroke()
        x.globalAlpha=1
        x.lineWidth/=6
        x.stroke()
      }
      if(fcol){
        x.fillStyle=fcol
        x.fill()
      }
    }
    floor = (X,Z) => {
      return 20/(2+S(.8+Math.hypot(X,Z)**2/60+t*6))-10
    }

    rw = 34
    cl = 34
    br = 1
    sp = 1
    B=Array(rw*cl*br).fill().map((v,i)=>{
      X = ((i%cl)-cl/2+.5)*sp
      Z = (((i/cl|0)%rw)-rw/2+.5)*sp
      Y = ((i/cl/rw|0)-br/2+.5)*sp + floor(X,Z)
      return [X,Y,Z]
    })

    rw2 = 35
    cl2 = 12
    br2 = 1
    sp2 = 2
    B2 = Array(rw2*cl2*br2).fill().map((v,i)=>{
      X = ((i%cl2)-cl2/2+.5)*sp2
      Z = (((i/cl2|0)%rw2)-rw2/2+.5)*sp2
      Y = ((i/cl2/rw2|0)-br2/2+.5)*sp + floor(X,Z)
      return [X,Y,Z]
    })

    starsLoaded = false, stars = [{loaded: false}]
    stars = Array(9).fill().map((v,i) => {
      let a = {img: new Image(), loaded: false}
      a.img.onload = () => {
        a.loaded = true
        setTimeout(()=>{
          if(stars.filter(v=>v.loaded).length == 9) starsLoaded = true
        }, 0)
      }
      a.img.src = `https://srmcgann.github.io/temp/stars/star${i+1}.png`
      return a
    })

    bg = new Image()
    go = false
    bg.onload=()=>{
      go = true
    }
    bg.src = 'https://srmcgann.github.io/temp3/S73UN.jpg'

    P = []
  }

  if(starsLoaded && go){
    x.globalAlpha=.2
    x.drawImage(bg,0,0,c.width,c.height)
    x.globalAlpha=1
    x.fillStyle='#0005'
    x.fillRect(0,0,c.width,c.height)
    oX=oY=0, oZ=24
    Rl=S(t)/4,Pt=-t/4,Yw=-t/2
    x.lineJoin=x.lineCap='butt'
    
    perim = 15, sd = 32

    ls = perim + Math.hypot(sp,sp)/2
    for(i=sd;i--;){
      x.beginPath()
      X = S(p=Math.PI*2/sd*i)*ls
      Z = C(p)*ls
      Y = floor(X,Z)
      R(Rl,Pt,Yw,1)
      if(Z>0) x.lineTo(...Q())
      X = S(p=Math.PI*2/sd*(i+1))*ls
      Z = C(p)*ls
      Y = floor(X,Z)
      R(Rl,Pt,Yw,1)
      if(Z>0) x.lineTo(...Q())
      stroke2('#0f88')
    }

    for(m=5;m--;)if(!((t*60|0)%0)){
      X = S(p=Math.PI*2*Rn())*perim
      Z = C(p)*perim
      Y = floor(X,Z)
      P = [...P, [X,Y,Z,Rn()*9|0]]
    }

    ls2 = 1/1.5,ox=oz=0,tog=false
    B2.map((v,i)=>{
      tx = v[0]*2
      ty = v[1]*2
      tz = v[2]*0.8660254037844386/3*2
      if(oz!=tz)tog=!tog
      oz=tz 
      keep = true
      x.beginPath()
      for(j=6;j--;){
        X = tx + (S(p=Math.PI*2/6*j+Math.PI/6)*ls2+(tog?ls2*1.5:0))*2
        Z = tz + (C(p)*ls2)*2
        if((d=Math.hypot(X,Z))>=perim*1.2)keep=false
        if(keep){
          if(d>perim){
            X/=d
            Z/=d
            X*=perim*1.05
            Z*=perim*1.05
          }
          Y = floor(X,Z)
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
        }
      }
      if(keep) stroke2('#0fc3')
    })

    if(1) B.map((v,i)=>{
      if(i%cl && i/cl|0){
        ax=ay=az=0

        l = i
        ax += B[l][0]
        az += B[l][2]
        l = i-1
        ax += B[l][0]
        az += B[l][2]
        l = i-1-cl
        ax += B[l][0]
        az += B[l][2]
        l = i-cl
        ax += B[l][0]
        az += B[l][2]

        ax/=4
        az/=4

        if((d=Math.hypot(ax,az))<perim*1.1){
          x.beginPath()
          l = i
          X = B[l][0]
          Z = B[l][2]
          if((d=Math.hypot(X,Z))>perim*1.05){
            X/=d
            Z/=d
            X*=perim*1.05
            Z*=perim*1.05
          }
          Y = floor(X,Z)
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          l = i-1
          X = B[l][0]
          Z = B[l][2]
          if((d=Math.hypot(X,Z))>perim*1.05){
            X/=d
            Z/=d
            X*=perim*1.05
            Z*=perim*1.05
          }
          Y = floor(X,Z)
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          l = i-1-cl
          X = B[l][0]
          Z = B[l][2]
          if((d=Math.hypot(X,Z))>perim*1.05){
            X/=d
            Z/=d
            X*=perim*1.05
            Z*=perim*1.05
          }
          Y = floor(X,Z)
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          l = i-cl
          X = B[l][0]
          Z = B[l][2]
          if((d=Math.hypot(X,Z))>perim*1.05){
            X/=d
            Z/=d
            X*=perim*1.05
            Z*=perim*1.05
          }
          Y = floor(X,Z)
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          stroke('#f004', '#60F2')
        }
      }
    })

    P = P.filter(v=>Math.hypot(v[0],v[2])>2)
    spd = .2

    P.map(v=>{
      X=v[0]
      Z=v[2]
      d1=Math.hypot(X,Z)
      p = Math.atan2(X,Z)+2/(1+d1**2/2)
      v[0] = S(p)*d1
      v[2] = C(p)*d1
      X/=d1
      Z/=d1
      X = v[0] -= X*spd
      Z = v[2] -= Z*spd
      v[1]=Y=floor(X,Z)
      R(Rl,Pt,Yw,1)
      if(Z>0){
        x.globalAlpha = Math.min(1, (d1/4)**5)
        s = Math.min(1e3, 1e4/Z**1.5)
        l = Q()
        x.drawImage(stars[v[3]].img,l[0]-s/2,l[1]-s/2,s,s)
      }
    })
    x.globalAlpha = 1
    Y=floor(X=0,Z=0)
    R(Rl,Pt,Yw,1) 
    s=Math.min(3e3,1e4/Z)
    l=Q()
    if(Z>0) x.drawImage(stars[5].img,l[0]-s/2.1,l[1]-s/2.1,s,s)
  }

  t+=1/60
  requestAnimationFrame(Draw)

}
Draw()