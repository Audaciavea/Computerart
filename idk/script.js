c         = document.querySelector('#c')
c.width   = 1920
c.height  = 1080
x         = c.getContext('2d')
M         = Math
S         = M.sin
C         = M.cos
T         = M.tan
t         = 0

rsz=window.onresize=()=>{
  let body = document.body
  let ar1 = 1.777778
  let ar2 = body.clientWidth/body.clientHeight
  if(ar1<ar2){
    c.style.height = body.clientHeight + 'px'
    setTimeout(()=>{c.style.width = c.clientHeight*ar1+'px'},0)
  } else {
    c.style.width  = body.clientWidth + 'px'
    setTimeout(()=>{c.style.height = c.clientWidth/ar1+'px'},0)
  }
}
rsz()


async function Draw(){
  if(!t){
    Rn = M.random
    R=(Rl,Pt,Yw,m)=>{X=S(p=(A=M.atan2)(X,Y)+Rl)*(d=(H=M.hypot)(X,Y)),Y=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d;if(m){X+=oX,Y+=oY,Z+=oZ}}
    Q=()=>[c.width/2+X/Z*700,c.height/2+Y/Z*700]
    Cube = (size=1) => {
      let Cb=[]
      for(i=6;i--;Cb=[...Cb,b])for(b=[],j=4;j--;)b=[...b,[(a=[S(p=Math.PI*2/4*j+Math.PI/4),C(p),2**.5/2])[i%3]*(l=i<3?-size:size),a[(i+1)%3]*l,a[(i+2)%3]*l]]
      return Cb
    }
    stroke = (scol, fcol,lw=1,dual=true) => {
      if(scol){
        x.closePath()
        x.strokeStyle = scol
        x.lineWidth = Math.min(150, 200/Z*lw)
        x.globalAlpha = dual?.25:1
        x.stroke()
        if(dual){
          x.globalAlpha = 1
          x.lineWidth/=3
          x.stroke()
        }
        x.globalAlpha = 1
      }
      if(fcol){
        x.fillStyle = fcol
        x.fill()
      }
    }


    rfunc = i => {
      R(Math.PI*2/br*(i/cl/rw|0)-S(t/4)*32,C(t/4)*4,0)
    }

    spawnB = () => {
      cubeSize = 2
      shp = Cube(cubeSize+C(t*4)*cubeSize/2)
      rw=1
      cl=2
      br=10
      sp=cubeSize * 8
      B=Array(rw*br*cl).fill().map((v,i)=>{
        X = ((i%cl)-cl/2+.5)*sp
        Y = (((i/cl|0)%rw)-rw/2+.5)*sp
        Z = ((i/cl/rw|0)-br/2+.5)*sp/4
        rfunc(i)
        return [X,Y,Z]
      })
    }

    colFunc = i => `hsla(${t*3e3+90/br*(i/rw/cl|0)},99%,${200+C(t)*150}%,.3)`


    P = []
    iPfreq = 35+S(t)*30
    spawnP = () =>{
      iPv = S(t*2)/4
      
      for(O=3;O--;) B.map((n,i)=>{
        tx = n[0]
        ty = n[1]
        tz = n[2]
        shp.map(v=>{
          v.map((q,m) => {
            l = m
            X = v[l][0]
            Y = v[l][1]
            Z = v[l][2]
            rfunc(i)
            X1 = X+tx
            Y1 = Y+ty
            Z1 = Z+tz

            l = (m+1)%v.length
            X = v[l][0]
            Y = v[l][1]
            Z = v[l][2]
            rfunc(i)
            X2 = X+tx
            Y2 = Y+ty
            Z2 = Z+tz

            vx1 = X1-X2
            vy1 = Y1-Y2
            vz1 = Z1-Z2
            d = Math.hypot(vx1,vy1,vz1)
            vx1/=d
            vy1/=d
            vz1/=d
            vx1*=iPv
            vy1*=iPv
            vz1*=iPv
            vx1+=(Rn()-.5)/50
            vy1+=(Rn()-.5)/50
            vz1+=(Rn()-.5)/50

            vx2 = -vx1
            vy2 = -vy1
            vz2 = -vz1
            if(Rn()<.4){
              col = colFunc(i)
              P = [...P, [X1, Y1, Z1, vx1, vy1, vz1, 1, col]]
              P = [...P, [X2, Y2, Z2, vx2, vy2, vz2, 1, col]]
            }
          })
        })
      })
    }
    bg = document.createElement('video')
    go = false
    bg.oncanplay= () => {
      bg.play()
      go = true
    }

    bg.loop = true
    bg.muted = true
    bg.src = 'https://i.imgur.io/aAlFWzJ.mp4'

  }
  x.globalAlpha = .4
  if(go) x.drawImage(bg,0,0,c.width,c.height)
  x.globalAlpha = 1
  x.fillStyle = '#0002'
  x.fillRect(0,0,c.width,c.height)
  x.lineJoin=x.lineCap='round'

  oX=oY=0, oZ=Math.min(30, Math.max(20,(.3+C(t/2))*60))
  Rl=t/4,Pt=-t/4, Yw=S(t/4)*2

  spawnB()

  B.map((n,i)=>{
    tx = n[0]
    ty = n[1]
    tz = n[2]
    shp.map(v=>{
      x.beginPath()
      v.map(q=>{
        X = q[0]
        Y = q[1]
        Z = q[2]
        rfunc(i)
        X+=tx
        Y+=ty
        Z+=tz
        R(Rl,Pt,Yw,1)
        if(Z>0)x.lineTo(...Q())
      })
      col1 = '#fff4'
      col2 = colFunc(i)
      stroke(col1, col2, 4, 1)
    })
  })

  iPfreq = 15+S(t*2)*11|0
  if(!((t*60|0)%iPfreq)) spawnP()

  P = P.filter(v=>v[6]>.1)
  P.map(v=>{
    X = v[0] += v[3]
    Y = v[1] += v[4]
    Z = v[2] += v[5]
    R(Rl,Pt,Yw,1)
    if(Z>0){
      l = Q()
      s = Math.min(1e3, 2e3/Z*v[6])
      x.globalAlpha = .1
      x.fillStyle = v[7]
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=3
      x.globalAlpha = .2
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=3
      x.globalAlpha = 1
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
    }
    v[6] -= .025
  })

  t+=1/60
  requestAnimationFrame(Draw)
}
Draw()