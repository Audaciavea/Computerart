c = document.querySelector('#c')
c.width = 1920
c.height = 1080
x = c.getContext('2d')
C = Math.cos
S = Math.sin
t = 0
T = Math.tan

rsz=window.onresize=()=>{
  setTimeout(()=>{
    if(document.body.clientWidth > document.body.clientHeight*1.77777778){
      c.style.height = '100vh'
      setTimeout(()=>c.style.width = c.clientHeight*1.77777778+'px',0)
    }else{
      c.style.width = '100vw'
      setTimeout(()=>c.style.height =     c.clientWidth/1.77777778 + 'px',0)
    }
  },0)
}
rsz()

async function Draw(){
  oX=oY=oZ=0
  if(!t){
    HSVFromRGB = (R, G, B) => {
      let R_=R/256
      let G_=G/256
      let B_=B/256
      let Cmin = Math.min(R_,G_,B_)
      let Cmax = Math.max(R_,G_,B_)
      let val = Cmax //(Cmax+Cmin) / 2
      let delta = Cmax-Cmins
      let sat = Cmax ? delta / Cmax: 0
      let min=Math.min(R,G,B)
      let max=Math.max(R,G,B)
      let hue = 0
      if(delta){
        if(R>=G && R>=B) hue = (G-B)/(max-min)
        if(G>=R && G>=B) hue = 2+(B-R)/(max-min)
        if(B>=G && B>=R) hue = 4+(R-G)/(max-min)
      }
      hue*=60
      while(hue<0) hue+=360;
      while(hue>=360) hue-=360;
      return [hue, sat, val]
    }

    RGBFromHSV = (H, S, V) => {
      while(H<0) H+=360;
      while(H>=360) H-=360;
      let C = V*S
      let X = C * (1-Math.abs((H/60)%2-1))
      let m = V-C
      let R_, G_, B_
      if(H>=0 && H < 60)    R_=C, G_=X, B_=0
      if(H>=60 && H < 120)  R_=X, G_=C, B_=0
      if(H>=120 && H < 180) R_=0, G_=C, B_=X
      if(H>=180 && H < 240) R_=0, G_=X, B_=C
      if(H>=240 && H < 300) R_=X, G_=0, B_=C
      if(H>=300 && H < 360) R_=C, G_=0, B_=X
      let R = (R_+m)*256
      let G = (G_+m)*256
      let B = (B_+m)*256
      return [R,G,B]
    }

    R=R2=(Rl,Pt,Yw,m)=>{
      M=Math
      X-=oX
      Y-=oY
      Z-=oZ
      A=M.atan2
      H=M.hypot
      X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
      Z=C(p)*d
      Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
      Z=C(p)*d
      X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
      Y=C(p)*d
    }
    R3=(Rl,Pt,Yw,m)=>{
      M=Math
      A=M.atan2
      H=M.hypot
      X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
      Y=C(p)*d
      Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
      Z=C(p)*d
      X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
      Z=C(p)*d
    }
    Q=()=>[c.width/2+X/Z*700,c.height/2+Y/Z*700]
    Q2=()=>[c.width/2+X/Z*1200,c.height/2+Y/Z*1200]
    I=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0

    Rn = Math.random
    async function loadOBJ(url, scale, tx, ty, tz, rl, pt, yw) {
      let res
      await fetch(url, res => res).then(data=>data.text()).then(data=>{
        a=[]
        data.split("\nv ").map(v=>{
          a=[...a, v.split("\n")[0]]
        })
        a=a.filter((v,i)=>i).map(v=>[...v.split(' ').map(n=>(+n.replace("\n", '')))])
        ax=ay=az=0
        a.map(v=>{
          v[1]*=-1
          ax+=v[0]
          ay+=v[1]
          az+=v[2]
        })
        ax/=a.length
        ay/=a.length
        az/=a.length
        a.map(v=>{
          X=(v[0]-ax)*scale
          Y=(v[1]-ay)*scale
          Z=(v[2]-az)*scale
          R2(rl,pt,yw,0)
          v[0]=X
          v[1]=Y
          v[2]=Z
        })
        maxY=-6e6
        a.map(v=>{
          if(v[1]>maxY)maxY=v[1]
        })
        a.map(v=>{
          v[1]-=maxY-oY
          v[0]+=tx
          v[1]+=ty
          v[2]+=tz
        })

        b=[]
        data.split("\nf ").map(v=>{
          b=[...b, v.split("\n")[0]]
        })
        b.shift()
        b=b.map(v=>v.split(' '))
        b=b.map(v=>{
          v=v.map(q=>{
            return +q.split('/')[0]
          })
          v=v.filter(q=>q)
          return v
        })

        res=[]
        b.map(v=>{
          e=[]
          v.map(q=>{
            e=[...e, a[q-1]]
          })
          e = e.filter(q=>q)
          res=[...res, e]
        })
      })
      return res
    }

    geoSphere = (mx, my, mz, iBc, size) => {
      let collapse=0
      let B=Array(iBc).fill().map(v=>{
        X = Rn()-.5
        Y = Rn()-.5
        Z = Rn()-.5
        return  [X,Y,Z]
      })
      for(let m=200;m--;){
        B.map((v,i)=>{
          X = v[0]
          Y = v[1]
          Z = v[2]
          B.map((q,j)=>{
            if(j!=i){
              X2=q[0]
              Y2=q[1]
              Z2=q[2]
              d=1+(Math.hypot(X-X2,Y-Y2,Z-Z2)*(3+iBc/40)*3)**4
              X+=(X-X2)*99/d
              Y+=(Y-Y2)*99/d
              Z+=(Z-Z2)*99/d
            }
          })
          d=Math.hypot(X,Y,Z)
          v[0]=X/d
          v[1]=Y/d
          v[2]=Z/d
          if(collapse){
            d=25+Math.hypot(X,Y,Z)
            v[0]=(X-X/d)/1.1
            v[1]=(Y-Y/d)/1.1         
            v[2]=(Z-Z/d)/1.1
          }
        })
      }
      mind = 6e6
      B.map((v,i)=>{
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        B.map((q,j)=>{
          X2 = q[0]
          Y2 = q[1]
          Z2 = q[2]
          if(i!=j){
            d = Math.hypot(a=X1-X2, b=Y1-Y2, e=Z1-Z2)
            if(d<mind) mind = d
          }
        })
      })
      a = []
      B.map((v,i)=>{
        X1 = v[0]
        Y1 = v[1]
        Z1 = v[2]
        B.map((q,j)=>{
          X2 = q[0]
          Y2 = q[1]
          Z2 = q[2]
          if(i!=j){
            d = Math.hypot(X1-X2, Y1-Y2, Z1-Z2)
            if(d<mind*2){
              if(!a.filter(q=>q[0]==X2&&q[1]==Y2&&q[2]==Z2&&q[3]==X1&&q[4]==Y1&&q[5]==Z1).length) a = [...a, [X1*size,Y1*size,Z1*size,X2*size,Y2*size,Z2*size]]
            }
          }
        })
      })
      B.map(v=>{
        v[0]*=size
        v[1]*=size
        v[2]*=size
        v[0]+=mx
        v[1]+=my
        v[2]+=mz
      })
      return [mx, my, mz, size, B, a]
    }

    lineFaceI = (X1, Y1, Z1, X2, Y2, Z2, facet, autoFlipNormals=false, showNormals=false) => {
      let X_, Y_, Z_, d, m, l_,K,J,L,p
      let I_=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
      let Q_=()=>[c.width/2+X_/Z_*600,c.height/2+Y_/Z_*600]
      let R_ = (Rl,Pt,Yw,m)=>{
        let M=Math, A=M.atan2, H=M.hypot
        X_=S(p=A(X_,Y_)+Rl)*(d=H(X_,Y_)),Y_=C(p)*d,X_=S(p=A(X_,Z_)+Yw)*(d=H(X_,Z_)),Z_=C(p)*d,Y_=S(p=A(Y_,Z_)+Pt)*(d=H(Y_,Z_)),Z_=C(p)*d
        if(m){ X_+=oX,Y_+=oY,Z_+=oZ }
      }
      let rotSwitch = m =>{
        switch(m){
          case 0: R_(0,0,Math.PI/2); break
          case 1: R_(0,Math.PI/2,0); break
          case 2: R_(Math.PI/2,0,Math.PI/2); break
        }        
      }
      let ax = 0, ay = 0, az = 0
      facet.map(q_=>{ ax += q_[0], ay += q_[1], az += q_[2] })
      ax /= facet.length, ay /= facet.length, az /= facet.length
      let b1 = facet[2][0]-facet[1][0], b2 = facet[2][1]-facet[1][1], b3 = facet[2][2]-facet[1][2]
      let c1 = facet[1][0]-facet[0][0], c2 = facet[1][1]-facet[0][1], c3 = facet[1][2]-facet[0][2]
      let crs = [b2*c3-b3*c2,b3*c1-b1*c3,b1*c2-b2*c1]
      d = Math.hypot(...crs)+.001
      let nls = 1 //normal line length
      crs = crs.map(q=>q/d*nls)
      let X1_ = ax, Y1_ = ay, Z1_ = az
      let flip = 1
      if(autoFlipNormals){
        let d1_ = Math.hypot(X1_-X1,Y1_-Y1,Z1_-Z1)
        let d2_ = Math.hypot(X1-(ax + crs[0]/99),Y1-(ay + crs[1]/99),Z1-(az + crs[2]/99))
        flip = d2_>d1_?-1:1
      }
      let X2_ = ax + (crs[0]*=flip), Y2_ = ay + (crs[1]*=flip), Z2_ = az + (crs[2]*=flip)
      if(showNormals){
        x.beginPath()
        X_ = X1_, Y_ = Y1_, Z_ = Z1_
        R_(Rl,Pt,Yw,1)
        if(Z_>0) x.lineTo(...Q_())
        X_ = X2_, Y_ = Y2_, Z_ = Z2_
        R_(Rl,Pt,Yw,1)
        if(Z_>0) x.lineTo(...Q_())
        x.lineWidth = 5
        x.strokeStyle='#f004'
        x.stroke()
      }

      let p1_ = Math.atan2(X2_-X1_,Z2_-Z1_)
      let p2_ = -(Math.acos((Y2_-Y1_)/(Math.hypot(X2_-X1_,Y2_-Y1_,Z2_-Z1_)+.001))+Math.PI/2)
      let isc = false, iscs = [false,false,false]
      X_ = X1, Y_ = Y1, Z_ = Z1
      R_(0,-p2_,-p1_)
      let rx_ = X_, ry_ = Y_, rz_ = Z_
      for(let m=3;m--;){
        if(isc === false){
          X_ = rx_, Y_ = ry_, Z_ = rz_
          rotSwitch(m)
          X1_ = X_, Y1_ = Y_, Z1_ = Z_ = 5, X_ = X2, Y_ = Y2, Z_ = Z2
          R_(0,-p2_,-p1_)
          rotSwitch(m)
          X2_ = X_, Y2_ = Y_, Z2_ = Z_
          facet.map((q_,j_)=>{
            if(isc === false){
              let l = j_
              X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X3_=X_, Y3_=Y_, Z3_=Z_
              l = (j_+1)%facet.length
              X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X4_ = X_, Y4_ = Y_, Z4_ = Z_
              if(l_=I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) iscs[m] = l_
            }
          })
        }
      }
      if(iscs.filter(v=>v!==false).length==3){
        let iscx = iscs[1][0], iscy = iscs[0][1], iscz = iscs[0][0]
        let pointInPoly = true
        ax=0, ay=0, az=0
        facet.map((q_, j_)=>{ ax+=q_[0], ay+=q_[1], az+=q_[2] })
        ax/=facet.length, ay/=facet.length, az/=facet.length
        X_ = ax, Y_ = ay, Z_ = az
        R_(0,-p2_,-p1_)
        X1_ = X_, Y1_ = Y_, Z1_ = Z_
        X2_ = iscx, Y2_ = iscy, Z2_ = iscz
        facet.map((q_,j_)=>{
          if(pointInPoly){
            let l = j_
            X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
            R_(0,-p2_,-p1_)
            let X3_ = X_, Y3_ = Y_, Z3_ = Z_
            l = (j_+1)%facet.length
            X_ = facet[l][0], Y_ = facet[l][1], Z_ = facet[l][2]
            R_(0,-p2_,-p1_)
            let X4_ = X_, Y4_ = Y_, Z4_ = Z_
            if(I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) pointInPoly = false
          }
        })
        if(pointInPoly){
          X_ = iscx, Y_ = iscy, Z_ = iscz
          R_(0,p2_,0)
          R_(0,0,p1_)
          isc = [[X_,Y_,Z_], [crs[0],crs[1],crs[2]]]
        }
      }
      return isc
    }

    TruncatedOctahedron = ls => {
      let shp = [], a = []
      mind = 6e6
      for(let i=6;i--;){
        X = S(p=Math.PI*2/6*i+Math.PI/6)*ls
        Y = C(p)*ls
        Z = 0
        if(Y<mind) mind = Y
        a = [...a, [X, Y, Z]]
      }
      let theta = .6154797086703867
      a.map(v=>{
        X = v[0]
        Y = v[1] - mind
        Z = v[2]
        R(0,theta,0)
        v[0] = X
        v[1] = Y
        v[2] = Z+1.5
      })
      b = JSON.parse(JSON.stringify(a)).map(v=>{
        v[1] *= -1
        return v
      })
      shp = [...shp, a, b]
      e = JSON.parse(JSON.stringify(shp)).map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
        return v
      })
      shp = [...shp, ...e]
      e = JSON.parse(JSON.stringify(shp)).map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
        return v
      })
      shp = [...shp, ...e]

      coords = [
        [[3,1],[4,3],[4,4],[3,2]],
        [[3,4],[3,3],[2,4],[6,2]],
        [[1,4],[0,3],[0,4],[4,2]],
        [[1,1],[1,2],[6,4],[7,3]],
        [[3,5],[7,5],[1,5],[3,0]],
        [[2,5],[6,5],[0,5],[4,5]]
      ]
      a = []
      coords.map(v=>{
        b = []
        v.map(q=>{
          X = shp[q[0]][q[1]][0]
          Y = shp[q[0]][q[1]][1]
          Z = shp[q[0]][q[1]][2]
          b = [...b, [X,Y,Z]]
        })
        a = [...a, b]
      })
      shp = [...shp, ...a]
      return shp.map(v=>{
        v.map(q=>{
          q[0]/=3
          q[1]/=3
          q[2]/=3
          q[0]*=ls
          q[1]*=ls
          q[2]*=ls
        })
        return v
      })
    }

    Cylinder = (rw,cl,ls1,ls2) => {
      let a = []
      for(let i=rw;i--;){
        let b = []
        for(let j=cl;j--;){
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
        }
        //a = [...a, b]
        for(let j=cl;j--;){
          b = []
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*i-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(j+1)) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*j) * ls1
          Y = (1/rw*(i+1)-.5)*ls2
          Z = C(p) * ls1
          b = [...b, [X,Y,Z]]
          a = [...a, b]
        }
      }
      b = []
      for(let j=cl;j--;){
        X = S(p=Math.PI*2/cl*j) * ls1
        Y = ls2/2
        Z = C(p) * ls1
        b = [...b, [X,Y,Z]]
      }
      //a = [...a, b]
      return a
    }

    Tetrahedron = size => {
      ret = []
      a = []
      let h = size/1.4142/1.25
      for(i=3;i--;){
        X = S(p=Math.PI*2/3*i) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
      }
      ret = [...ret, a]
      for(j=3;j--;){
        a = []
        X = 0
        Y = 0
        Z = -h
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/3*j) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/3*(j+1)) * size/1.25
        Y = C(p) * size/1.25
        Z = h
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      ax=ay=az=ct=0
      ret.map(v=>{
        v.map(q=>{
          ax+=q[0]
          ay+=q[1]
          az+=q[2]
          ct++
        })
      })
      ax/=ct
      ay/=ct
      az/=ct
      ret.map(v=>{
        v.map(q=>{
          q[0]-=ax
          q[1]-=ay
          q[2]-=az
        })
      })
      return ret
    }

    Cube = size => {
      for(CB=[],j=6;j--;CB=[...CB,b])for(b=[],i=4;i--;)b=[...b,[(a=[S(p=Math.PI*2/4*i+Math.PI/4),C(p),2**.5/2])[j%3]*(l=j<3?size/1.5:-size/1.5),a[(j+1)%3]*l,a[(j+2)%3]*l]]
      return CB
    }

    Octahedron = size => {
      ret = []
      let h = size/1.25
      for(j=8;j--;){
        a = []
        X = 0
        Y = 0
        Z = h * (j<4?-1:1)
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/4*j) * size/1.25
        Y = C(p) * size/1.25
        Z = 0
        a = [...a, [X,Y,Z]]
        X = S(p=Math.PI*2/4*(j+1)) * size/1.25
        Y = C(p) * size/1.25
        Z = 0
        a = [...a, [X,Y,Z]]
        ret = [...ret, a]
      }
      return ret      
    }

    Dodecahedron = size => {
      ret = []
      a = []
      mind = -6e6
      for(i=5;i--;){
        X=S(p=Math.PI*2/5*i + Math.PI/5)
        Y=C(p)
        Z=0
        if(Y>mind) mind=Y
        a = [...a, [X,Y,Z]]
      }
      a.map(v=>{
        X = v[0]
        Y = v[1]-=mind
        Z = v[2]
        R(0, .553573, 0)
        v[0] = X
        v[1] = Y
        v[2] = Z
      })
      b = JSON.parse(JSON.stringify(a))
      b.map(v=>{
        v[1] *= -1
      })
      ret = [...ret, a, b]
      mind = -6e6
      ret.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          if(Z>mind)mind = Z
        })
      })
      d1=Math.hypot(ret[0][0][0]-ret[0][1][0],ret[0][0][1]-ret[0][1][1],ret[0][0][2]-ret[0][1][2])
      ret.map(v=>{
        v.map(q=>{
          q[2]-=mind+d1/2
        })
      })
      b = JSON.parse(JSON.stringify(ret))
      b.map(v=>{
        v.map(q=>{
          q[2]*=-1
        })
      })
      ret = [...ret, ...b]
      b = JSON.parse(JSON.stringify(ret))
      b.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          R(0,Math.PI/2,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
      })
      e = JSON.parse(JSON.stringify(ret))
      e.map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R(0,0,Math.PI/2)
          R(Math.PI/2,0,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
      })
      ret = [...ret, ...b, ...e]
      ret.map(v=>{
        v.map(q=>{
          q[0] *= size/2
          q[1] *= size/2
          q[2] *= size/2
        })
      })
      return ret
    }

    Icosahedron = size => {
      ret = []
      let B = [
        [[0,3],[1,0],[2,2]],
        [[0,3],[1,0],[1,3]],
        [[0,3],[2,3],[1,3]],
        [[0,2],[2,1],[1,0]],
        [[0,2],[1,3],[1,0]],
        [[0,2],[1,3],[2,0]],
        [[0,3],[2,2],[0,0]],
        [[1,0],[2,2],[2,1]],
        [[1,1],[2,2],[2,1]],
        [[1,1],[2,2],[0,0]],
        [[1,1],[2,1],[0,1]],
        [[0,2],[2,1],[0,1]],
        [[2,0],[1,2],[2,3]],
        [[0,0],[0,3],[2,3]],
        [[1,3],[2,0],[2,3]],
        [[2,3],[0,0],[1,2]],
        [[1,2],[2,0],[0,1]],
        [[0,0],[1,2],[1,1]],
        [[0,1],[1,2],[1,1]],
        [[0,2],[2,0],[0,1]],
      ]
      for(p=[1,1],i=38;i--;)p=[...p,p[l=p.length-1]+p[l-1]]
      phi = p[l]/p[l-1]
      a = [
        [-phi,-1,0],
        [phi,-1,0],
        [phi,1,0],
        [-phi,1,0],
      ]
      for(j=3;j--;ret=[...ret, b])for(b=[],i=4;i--;) b = [...b, [a[i][j],a[i][(j+1)%3],a[i][(j+2)%3]]]
      ret.map(v=>{
        v.map(q=>{
          q[0]*=size/2.25
          q[1]*=size/2.25
          q[2]*=size/2.25
        })
      })
      cp = JSON.parse(JSON.stringify(ret))
      out=[]
      a = []
      B.map(v=>{
        idx1a = v[0][0]
        idx2a = v[1][0]
        idx3a = v[2][0]
        idx1b = v[0][1]
        idx2b = v[1][1]
        idx3b = v[2][1]
        a = [...a, [cp[idx1a][idx1b],cp[idx2a][idx2b],cp[idx3a][idx3b]]]
      })
      out = [...out, ...a]
      return out
    }

    stroke = (scol, fcol, lwo=1, od=true, oga=1) => {
      if(scol){
        x.closePath()
        if(od) x.globalAlpha = .2*oga
        x.strokeStyle = scol
        x.lineWidth = Math.min(1000,100*lwo/Z)
        if(od) x.stroke()
        x.lineWidth /= 4
        x.globalAlpha = 1*oga
        x.stroke()
      }
      if(fcol){
        x.globalAlpha = 1*oga
        x.fillStyle = fcol
        x.fill()
      }
      x.globalAlpha = 1
    }

    subbed = (subs, size, sphereize, shape) => {
      for(let m=subs; m--;){
        base = shape
        shape = []
        base.map(v=>{
          l = 0
          X1 = v[l][0]
          Y1 = v[l][1]
          Z1 = v[l][2]
          l = 1
          X2 = v[l][0]
          Y2 = v[l][1]
          Z2 = v[l][2]
          l = 2
          X3 = v[l][0]
          Y3 = v[l][1]
          Z3 = v[l][2]
          if(v.length > 3){
            l = 3
            X4 = v[l][0]
            Y4 = v[l][1]
            Z4 = v[l][2]
            if(v.length > 4){
              l = 4
              X5 = v[l][0]
              Y5 = v[l][1]
              Z5 = v[l][2]
            }
          }
          mx1 = (X1+X2)/2
          my1 = (Y1+Y2)/2
          mz1 = (Z1+Z2)/2
          mx2 = (X2+X3)/2
          my2 = (Y2+Y3)/2
          mz2 = (Z2+Z3)/2
          a = []
          switch(v.length){
            case 3:
              mx3 = (X3+X1)/2
              my3 = (Y3+Y1)/2
              mz3 = (Z3+Z1)/2
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              break
            case 4:
              mx3 = (X3+X4)/2
              my3 = (Y3+Y4)/2
              mz3 = (Z3+Z4)/2
              mx4 = (X4+X1)/2
              my4 = (Y4+Y1)/2
              mz4 = (Z4+Z1)/2
              cx = (X1+X2+X3+X4)/4
              cy = (Y1+Y2+Y3+Y4)/4
              cz = (Z1+Z2+Z3+Z4)/4
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx1, Y = my1, Z = mz1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx2, Y = my2, Z = mz2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = mx4, Y = my4, Z = mz4, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              X = mx3, Y = my3, Z = mz3, a = [...a, [X,Y,Z]]
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              break
            case 5:
              cx = (X1+X2+X3+X4+X5)/5
              cy = (Y1+Y2+Y3+Y4+Y5)/5
              cz = (Z1+Z2+Z3+Z4+Z5)/5
              mx3 = (X3+X4)/2
              my3 = (Y3+Y4)/2
              mz3 = (Z3+Z4)/2
              mx4 = (X4+X5)/2
              my4 = (Y4+Y5)/2
              mz4 = (Z4+Z5)/2
              mx5 = (X5+X1)/2
              my5 = (Y5+Y1)/2
              mz5 = (Z5+Z1)/2
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X2, Y = Y2, Z = Z2, a = [...a, [X,Y,Z]]
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X3, Y = Y3, Z = Z3, a = [...a, [X,Y,Z]]
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X4, Y = Y4, Z = Z4, a = [...a, [X,Y,Z]]
              X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              X = X5, Y = Y5, Z = Z5, a = [...a, [X,Y,Z]]
              X = X1, Y = Y1, Z = Z1, a = [...a, [X,Y,Z]]
              X = cx, Y = cy, Z = cz, a = [...a, [X,Y,Z]]
              shape = [...shape, a]
              a = []
              break
          }
        })
      }
      if(sphereize){
        ip1 = sphereize
        ip2 = 1-sphereize
        shape = shape.map(v=>{
          v = v.map(q=>{
            X = q[0]
            Y = q[1]
            Z = q[2]
            d = Math.hypot(X,Y,Z)
            X /= d
            Y /= d
            Z /= d
            X *= size*.75*ip1 + d*ip2
            Y *= size*.75*ip1 + d*ip2
            Z *= size*.75*ip1 + d*ip2
            return [X,Y,Z]
          })
          return v
        })
      }
      return shape
    }

    subDividedIcosahedron  = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Icosahedron(size))
    subDividedTetrahedron  = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Tetrahedron(size))
    subDividedOctahedron   = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Octahedron(size))
    subDividedCube         = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Cube(size))
    subDividedDodecahedron = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Dodecahedron(size))

    Rn = Math.random

    LsystemRecurse = (size, splits, p1, p2, stem, theta, LsystemReduction, twistFactor) => {
      if(size < .25) return
      let X1 = stem[0]
      let Y1 = stem[1]
      let Z1 = stem[2]
      let X2 = stem[3]
      let Y2 = stem[4]
      let Z2 = stem[5]
      let p1a = Math.atan2(X2-X1,Z2-Z1)
      let p2a = -Math.acos((Y2-Y1)/(Math.hypot(X2-X1,Y2-Y1,Z2-Z1)+.0001))+Math.PI
      size/=LsystemReduction
      for(let i=splits;i--;){
        X = 0
        Y = -size
        Z = 0
        R(0, theta, 0)
        R(0, 0, Math.PI*2/splits*i+twistFactor)
        R(0, p2a, 0)
        R(0, 0, p1a+twistFactor)
        X+=X2
        Y+=Y2
        Z+=Z2
        let newStem = [X2, Y2, Z2, X, Y, Z]
        Lshp = [...Lshp, newStem]
        LsystemRecurse(size, splits, p1+Math.PI*2/splits*i+twistFactor, p2+theta, newStem, theta, LsystemReduction, twistFactor)
      }
    }
    DrawLsystem = shp => {
      shp.map(v=>{
        x.beginPath()
        X = v[0]
        Y = v[1]
        Z = v[2]
        R(Rl,Pt,Yw,1)
        if(Z>0)x.lineTo(...Q())
        X = v[3]
        Y = v[4]
        Z = v[5]
        R(Rl,Pt,Yw,1)
        if(Z>0)x.lineTo(...Q())
        lwo = Math.hypot(v[0]-v[3],v[1]-v[4],v[2]-v[5])*4
        stroke('#0f82','',lwo)
      })

    }
    Lsystem = (size, splits, theta, LsystemReduction, twistFactor) => {
      Lshp = []
      stem = [0,0,0,0,-size,0]
      Lshp = [...Lshp, stem]
      LsystemRecurse(size, splits, 0, 0, stem, theta, LsystemReduction, twistFactor)
      Lshp.map(v=>{
        v[1]+=size*1.5
        v[4]+=size*1.5
      })
      return Lshp
    }

    Sphere = (ls, rw, cl) => {
      a = []
      ls/=1.25
      for(j = rw; j--;){
        for(i = cl; i--;){
          b = []
          X = S(p = Math.PI*2/cl*i) * S(q = Math.PI/rw*j) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*(i+1)) * S(q = Math.PI/rw*j) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*(i+1)) * S(q = Math.PI/rw*(j+1)) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          X = S(p = Math.PI*2/cl*i) * S(q = Math.PI/rw*(j+1)) * ls
          Y = C(q) * ls
          Z = C(p) * S(q) * ls
          b = [...b, [X,Y,Z]]
          a = [...a, b]
        }
      }
      return a
    }

    Torus = (rw, cl, ls1, ls2, parts=1, twists=0, part_spacing=1.5) => {
      let ret = [], tx=0, ty=0, tz=0, prl1 = 0, p2a = 0
      let tx1 = 0, ty1 = 0, tz1 = 0, prl2 = 0, p2b = 0, tx2 = 0, ty2 = 0, tz2 = 0
      for(let m=parts;m--;){
        avgs = Array(rw).fill().map(v=>[0,0,0])
        for(j=rw;j--;)for(let i = cl;i--;){
          if(parts>1){
            ls3 = ls1*part_spacing
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(prl1 = Math.PI*2/rw*(j-1)*twists,0,0)
            tx1 = X
            ty1 = Y 
            tz1 = Z
            R(0, 0, Math.PI*2/rw*(j-1))
            ax1 = X
            ay1 = Y
            az1 = Z
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(prl2 = Math.PI*2/rw*(j)*twists,0,0)
            tx2 = X
            ty2 = Y
            tz2 = Z
            R(0, 0, Math.PI*2/rw*j)
            ax2 = X
            ay2 = Y
            az2 = Z
            p1a = Math.atan2(ax2-ax1,az2-az1)
            p2a = Math.PI/2+Math.acos((ay2-ay1)/(Math.hypot(ax2-ax1,ay2-ay1,az2-az1)+.001))

            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(Math.PI*2/rw*(j)*twists,0,0)
            tx1b = X
            ty1b = Y
            tz1b = Z
            R(0, 0, Math.PI*2/rw*j)
            ax1b = X
            ay1b = Y
            az1b = Z
            X = S(p=Math.PI*2/parts*m) * ls3
            Y = C(p) * ls3
            Z = 0
            R(Math.PI*2/rw*(j+1)*twists,0,0)
            tx2b = X
            ty2b = Y
            tz2b = Z
            R(0, 0, Math.PI*2/rw*(j+1))
            ax2b = X
            ay2b = Y
            az2b = Z
            p1b = Math.atan2(ax2b-ax1b,az2b-az1b)
            p2b = Math.PI/2+Math.acos((ay2b-ay1b)/(Math.hypot(ax2b-ax1b,ay2b-ay1b,az2b-az1b)+.001))
          }
          a = []
          X = S(p=Math.PI*2/cl*i) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1a)
          R(prl1,p2a,0)
          X += ls2 + tx1, Y += ty1, Z += tz1
          R(0, 0, Math.PI*2/rw*j)
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(i+1)) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1a)
          R(prl1,p2a,0)
          X += ls2 + tx1, Y += ty1, Z += tz1
          R(0, 0, Math.PI*2/rw*j)
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*(i+1)) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1b)
          R(prl2,p2b,0)
          X += ls2 + tx2, Y += ty2, Z += tz2
          R(0, 0, Math.PI*2/rw*(j+1))
          a = [...a, [X,Y,Z]]
          X = S(p=Math.PI*2/cl*i) * ls1
          Y = C(p) * ls1
          Z = 0
          //R(0,0,-p1b)
          R(prl2,p2b,0)
          X += ls2 + tx2, Y += ty2, Z += tz2
          R(0, 0, Math.PI*2/rw*(j+1))
          a = [...a, [X,Y,Z]]
          ret = [...ret, a]
        }
      }
      return ret
    }

    G_ = 100000, iSTc = 1e4
    ST = Array(iSTc).fill().map(v=>{
      X = (Rn()-.5)*G_
      Y = (Rn()-.5)*G_
      Z = (Rn()-.5)*G_
      return [X,Y,Z]
    })

    burst = new Image()
    burst.src = "https://srmcgann.github.io/temp/burst.png"

    powerupsLoaded = false, powerupImgs = [{loaded: false}]
    powerupImgs = Array(3).fill().map((v,i) => {
      let a = {img: new Image(), loaded: false}
      a.img.onload = () => {
        a.loaded = true
        setTimeout(()=>{
          if(powerupImgs.filter(v=>v.loaded).length == 3) powerupsLoaded = true
        }, 0)
      }
      a.img.src = `https://srmcgann.github.io/temp7/powerup${i+1}.png`
      return a
    })

    crosshairsLoaded = false, crosshairImgs = [{loaded: false}]
    crosshairImgs = Array(3).fill().map((v,i) => {
      let a = {img: new Image(), loaded: false}
      a.img.onload = () => {
        a.loaded = true
        setTimeout(()=>{
          if(crosshairImgs.filter(v=>v.loaded).length == 3) crosshairsLoaded = true
        }, 0)
      }
      a.img.src = `https://srmcgann.github.io/temp7/crosshair${i+1}.png`
      return a
    })

    carIcon = new Image()
    carIcon.src = 'https://srmcgann.github.io/temp7/carIcon.png'

    starsLoaded = false, starImgs = [{loaded: false}]
    starImgs = Array(9).fill().map((v,i) => {
      let a = {img: new Image(), loaded: false}
      a.img.onload = () => {
        a.loaded = true
        setTimeout(()=>{
          if(starImgs.filter(v=>v.loaded).length == 9) starsLoaded = true
        }, 0)
      }
      a.img.src = `https://srmcgann.github.io/stars/star${i+1}.png`
      return a
    })

    floor = (X, Z) => {
      //return 0
      //return ((50-Math.hypot(X,Z)/20-t*10)%50)
      //return Math.max(0, C((d=Math.hypot(X, Z))/300)*200+((50-d/20-t*10)%50))
      return (S(X/50+t/2) + S(Z/100))*4 * ((1+S(X/300+t)*C(Z/300)))*2 + ((S(X/1000)+C(Z/2000))*200)
      //return Math.min(20, Math.max(-20, S(X/500+t/2)*100 + S(Z/150+t)*100)) + ((S(X/400) + S(Z/200)) * ((1+S(X/100)*C(Z/100)))*10 + ((S(X/1000)+C(Z/2000))*200))
      //return Math.max(-2000, Math.min(2000, (C(Z/100)*25 + C(X/100)*25)**5/2e4))
      //return Math.max(-20,Math.min(20,100-(S(X/400+t/2+Math.hypot(X/400,Z/400))*150 * C(Z/400))))
      
      /*p = Math.atan2(X+=400, Z -= 800) + Math.PI/4
      d = Math.hypot(X, Z)
      X = S(p) * d
      Z = C(p) * d
      return Math.min(50, Math.max(-50, ((C(X/400) + S(Z/400))*10)**3/20))
      */
    }

    spawnCar = (X=0, Y=0, Z=0, uid=0) => {
      let car = {
        X,
        Y,
        Z,
        vx: 0,
        vy: 0,
        vz: 0,
        yw: 0,
        pt: 0,
        rl: 0,
        rlv: 0,
        ptv: 0,
        ywv: 0,
        id: uid,
        score: 0,
        speed: 0,
        health: 1,
        curGun: 0,
        gunTheta: 0,
        gunThetav: 0,
        drift: iDrift,
        powerups: [
          {
            name: 'speedBoost',
            val: 1,
            timer: 0,
            duration: 5
          },
          {
            name: 'guns++',
            val: 1,
            timer: 0,
            duration: 20
          },
          {
            name: 'Darah++',
            val: 1,
            initVal: 1,
            timer: 0,
            duration: 20,
          }
        ],
        shotTimer: 0,
        forward: true,
        shooting: false,
        shotInterval: 1,
        grounded: false,
        powerupTimer: 0,
        poweredUp: false,
        distanceTravelled: 0,
        keys: Array(256).fill(0),
        keyTimers: Array(256).fill(0),
        name: uid ? 'KOMPUTER ' + (uid?uid:'') : 'AUDACIA',
        decon: JSON.parse(JSON.stringify(base_car_decon)),
      }
      car.cam = spawnCam(car)
      return car
    }

    userID = 0 // only for practice ver.
    async function masterInit(){
      powerupTemplate = [
        {
          name: 'speed++',
          val: .5,
          initVal: .5,
          duration: 5
        },
        {
          name: 'guns++',
          val: 1,
          initVal: 1,
          duration: 20
        },
        {
          name: 'Darah++',
          val: 1,
          initVal: 1,
          duration: 0
        }
      ]
      cams = []
      grav = .66
      iCarsc = 3
      camMode= 0
      sparks = []
      camDist = 7
      iDrift = 50
      flashes = []
      bullets = []
      sliders = []
      iSparkv = .4
      iBulletv = 16
      maxSpeed = 40
      powerups = []
      carTrails = []
      showDash = true
      showCars = true
      camSelected = 0
      maxCamDist = 25
      crashDamage = .2
      crosshairSel = 0
      showGyro = false
      smokeTrails = []
      showOrigin = true
      flashNotices = []
      bulletDamage = .05
      powerupFreq = 250
      showstars = true
      mapChoice= 'topo'
      showFloor = true
      camModeStyles = 2
      camFollowSpeed = 4
      maxTurnRadius = .1
      showCrosshair = true
      camSelHasChanged = false
      dashHasBeenHidden = false
      hotkeysModalVisible = false
      keyTimerInterval = 1/60*5 // .25 sec
      base_gun = Cylinder(1,8,.6,1.5).map(v=>{
        v.map(q=>{
          X = q[0]
          Y = q[1]
          Z = q[2]
          R3(0,Math.PI/2,0)
          q[0] = X
          q[1] = Y
          q[2] = Z
        })
        return v
      })
      base_car_lowpoly = base_car = await loadOBJ('https://srmcgann.github.io/objs/best_car_no_wheels.obj', 1, 0,  -1, -2.75, 0, 0, Math.PI)
      base_wheel = await loadOBJ('https://srmcgann.github.io/objs/car_wheel.obj', 1, 0, 0, 0, 0, 0, Math.PI)
      //base_car_lowpoly = await loadOBJ('https://srmcgann.github.io/objs/best_car_no_wheels_lowpoly.obj', 1, 0, -1, -2, 0, 0, Math.PI)
      base_wheel_lowpoly = await loadOBJ('https://srmcgann.github.io/objs/car_wheel_lowpoly.obj', 1, 0, 0, 0, 0, 0, Math.PI)
      base_car_decon = JSON.parse(JSON.stringify(base_car)).map(v=>{
        v = [0, 0, 0,  // X,   Y,   Z
             0, 0, 0,  // vx,  vy,  vz
             0, 0, 0,  // rl,  pt,  yw
             0, 0, 0,  // rlv, ptv, ywv
            ] 
        return v
      })
    }
    await masterInit()

    spawnFlashNotice = (text, col)=>{
      flashNotices = [...flashNotices, [text, col, 1]]
    }

    spawnCam = car => {

      X = car.X
      Z = car.Z - camDist
      Y = floor(X, Z) - 10
      R(0, 0, 0)
      return {
        X, Y, Z
      }
    }

    cars = Array(iCarsc).fill().map((v, i) => {
      X = 0, Z = 0
      Y = floor(X, Z)
      return spawnCar(X,Y,Z,i) 
    })

    oX=0, oY=0, oZ=30
    Rl=0, Pt=-.125, Yw=0

    c.onmousedown = e => {
      let rect = c.getBoundingClientRect()
      mx = (e.pageX - rect.left)/c.clientWidth*c.width
      my = (e.pageY - rect.top)/c.clientHeight*c.height
      if(sliders.length){
        sliders.map(slider=>{
          X = slider.posX - slider.width/2 + slider.width/(slider.max - slider.min) * eval(slider.valVariable)
          Y = slider.posY
          s = slider.height/2
          d = Math.hypot(X-mx,Y-my)
          if(d<s && e.button == 0){
            slider.sliding = true
            slider.tmx = mx
            slider.tmy = my
          }
        })
      }
      
      if(showDash && e.button == 0){
        let ofx = hotkeysModalVisible ? 450 : 0
        X1 = ofx-450
        Y1 = c.height - 490
        X2 = X1 + 500
        Y2 = Y1 + 20*14.5
        if(mx >= X1 && mx <= X2 && my >= Y1 && my <= Y2){
          hotkeysModalVisible = !hotkeysModalVisible
        }
      }
    }
    
    c.onmouseup = e => {
      sliders.map(slider=>{
        slider.sliding = false
      })
    }
    
    c.onmousemove = e => {
      e.preventDefault()
      e.stopPropagation()
      let rect = c.getBoundingClientRect()
      mx = (e.pageX - rect.left)/c.clientWidth*c.width
      my = (e.pageY - rect.top)/c.clientHeight*c.height
      
      if(sliders.length){
        c.style.cursor = 'unset'
        sliders.map(slider=>{
          X = slider.posX - slider.width/2 + slider.width/(slider.max - slider.min) * eval(slider.valVariable)
          Y = slider.posY
          s = slider.height/2
          d = Math.hypot(X-mx,Y-my)
          if(d<s){
            c.style.cursor = 'pointer'
          }
          if(slider.sliding){
            if(slider.style == 'horizontal'){
              dx = (mx-slider.tmx)/slider.width*(slider.max-slider.min)
              eval(slider.valVariable + ' += dx')
              slider.tmx = mx
              slider.tmy = my
              eval(slider.valVariable + ' = Math.min(slider.max,Math.max(slider.min,'+slider.valVariable+'))')
              slider.captionVar = Math.round(eval(slider.valVariable)) + '%'
            }else{
            }
          }
        })
      }

      if(showDash){
        let ofx = hotkeysModalVisible ? 450 : 0
        X1 = ofx-450
        Y1 = c.height - 490
        X2 = X1 + 500
        Y2 = Y1 + 20*14.5
        if(mx >= X1 && mx <= X2 && my >= Y1 && my <= Y2){
          c.style.cursor = 'pointer'
        }else{
          c.style.cursor = 'unset'
        }
      }
    }
    
    
    sliders = [...sliders,
      {
        caption: 'Drift',
        style: 'horizontal',   // vertical/horizontal
        posX: c.width/2,
        posY: c.height-100,
        width: 400,
        height: 40,
        min: 0,
        max: 100,
        majorStep: 25,
        minorStep: 5,
        tickColor: '#0f8a',
        backgroundColor: '#40f4',
        selectorColor: '#fff',
        valVariable: 'cars[0].drift',
        padding: 75,
        textColor: '#f2a',
        fontSize: 32,
        captionVar: cars[0].drift + '%',
        sliding: false,
        tmx: 0,
        tmy: 0,
      }
    ]
    
    drawSlider = slider => {
      if(slider.style == 'horizontal'){
        x.fillStyle = slider.backgroundColor
        X = slider.posX - slider.width/2 - slider.padding/2
        Y = slider.posY - slider.height/2 - slider.padding/2
        w = slider.width + slider.padding
        h = slider.height + slider.padding
        x.fillRect(X,Y,w,h)
      }
      for(let i = slider.min; i<slider.max+1; i+=slider.minorStep){
        if(slider.style == 'horizontal'){
          x.beginPath()
          X = slider.posX - slider.width/2 + slider.width/(slider.max - slider.min) * i
          Y = slider.posY - slider.height/4
          x.lineTo(X,Y)
          X = slider.posX - slider.width/2 + slider.width/(slider.max - slider.min) * i
          Y = slider.posY + slider.height/4
          x.lineTo(X,Y)
          Z = 1
          stroke(slider.tickColor,'',.1, true)
        }else{
        }
      }
      for(let i = slider.min; i<slider.max+1; i+=slider.majorStep){
        if(slider.style == 'horizontal'){
          x.beginPath()
          X = slider.posX - slider.width/2 + slider.width/(slider.max - slider.min) * i
          Y = slider.posY - slider.height/2
          x.lineTo(X,Y)
          X = slider.posX - slider.width/2 + slider.width/(slider.max - slider.min) * i
          Y = slider.posY + slider.height/2
          x.lineTo(X,Y)
          Z = 1
          stroke(slider.tickColor,'',.1, true)
          x.fillStyle = slider.textColor
          x.textAlign = 'center'
          x.font = (slider.fontSize) + "px Courier Prime"
          x.fillText(i,X,Y+slider.height/2)
        }else{
        }
      }
      if(slider.style == 'horizontal'){
        x.beginPath()
        X = slider.posX - slider.width/2
        Y = slider.posY
        x.lineTo(X,Y)
        X = slider.posX + slider.width/2
        Y = slider.posY
        x.lineTo(X,Y)
        stroke(slider.tickColor,'',.1, true)
      }
      x.fillStyle = slider.textColor
      x.textAlign = 'left'
      x.font = (slider.fontSize*1.5) + "px Courier Prime"
      x.fillText(slider.caption + ' ' + slider.captionVar,slider.posX-slider.width/2,Y-slider.height/2-slider.fontSize/3)
      X = slider.posX - slider.width/2 + slider.width/(slider.max - slider.min) * eval(slider.valVariable)
      Y = slider.posY
      s = slider.height*1.5
      x.drawImage(burst,X-s/2,Y-s/2,s,s)
    }

    c.onkeydown = e => {
      e.preventDefault()
      e.stopPropagation()
      cars[0].keys[e.keyCode] = true
    }

    c.onkeyup = e => {
      e.preventDefault()
      e.stopPropagation()
      cars[0].keys[e.keyCode] = false
    }

    doKeys = car => {
      car.shooting = false
      car.keys.map((v,i) => {
        if(v){
          switch(i){
            case 49: if(cars.length)
              camSelected = 0;
              camSelHasChanged=true
            break
            case 50: if(cars.length>1)
              camSelected = 1;
              camSelHasChanged=true
            break
            case 51: if(cars.length>2)
              camSelected = 2;
              camSelHasChanged=true
            break
            case 52: if(cars.length>3)
              camSelected = 3;
              camSelHasChanged=true
            break
            case 53: if(cars.length>4)
              camSelected = 4;
              camSelHasChanged=true
            break
            case 54: if(cars.length>5)
              camSelected = 5;
              camSelHasChanged=true
            break
            case 55: if(cars.length>6)
              camSelected = 6;
              camSelHasChanged=true
            break
            case 56: if(cars.length>7)
              camSelected = 7;
              camSelHasChanged=true
            break
            case 57: if(cars.length>8)
              camSelected = 8;
              camSelHasChanged=true
            break
            case 48: if(cars.length>9)
              camSelected = 9;
              camSelHasChanged=true
            break
            case 72:
              if(car.keyTimers[i] < t){
                car.keyTimers[i] = t+keyTimerInterval
                hotkeysModalVisible = !hotkeysModalVisible
              }
            break
            case  84:
              if(car.keyTimers[i] < t){
                car.keyTimers[i] = t+keyTimerInterval
                showDash = !showDash
              }
              break
            case  67:
              if(car.keyTimers[i] < t){
                car.keyTimers[i] = t+keyTimerInterval
                if(showCrosshair && crosshairSel<crosshairImgs.length-1){
                  crosshairSel++
                }else{
                  crosshairSel=0
                  showCrosshair = !showCrosshair
                }
              }
              break
            case 77:
              if(car.keyTimers[i] < t){
                car.keyTimers[i] = t+keyTimerInterval
                camMode++
                camMode%=2
              }
              break
            /*case 65:
              if(car.grounded){
                d1 = Math.hypot(car.vx,car.vz)
                car.ywv -= .04
                car.ywv = Math.min(maxTurnRadius, Math.max(-maxTurnRadius, car.ywv))
              }
              break*/
            case 37:
              if(car.grounded){
                d1 = Math.hypot(car.vx,car.vz)
                car.ywv -= .04
                car.ywv = Math.min(maxTurnRadius, Math.max(-maxTurnRadius, car.ywv))
              }
              break
            case 16:
              if(car.grounded){
                let boost = car.powerups.filter(powerup=>powerup.name=='speedBoost')[0].val
                car.vx += S(car.yw) * .25 * boost * (car.forward ? 1 : -1)
                car.vz += C(car.yw) * .25 * boost * (car.forward ? 1 : -1)
                d1 = Math.hypot(car.vx,car.vy,car.vz)
                d2 = Math.min(maxSpeed, d1)
                car.vx /=d1
                car.vz /=d1
                car.vx *=d2
                car.vz *=d2
              }
              break
            case 38:
              if(car.grounded){
                let boost = car.powerups.filter(powerup=>powerup.name=='speedBoost')[0].val
                car.vx += S(car.yw) * (.5 - .4*(car.drift/100)) * boost
                car.vz += C(car.yw) * (.5 - .4*(car.drift/100)) * boost
                d1 = Math.hypot(car.vx,car.vy,car.vz)
                d2 = Math.min(maxSpeed, d1)
                car.vx /=d1
                car.vz /=d1
                car.vx *=d2
                car.vz *=d2
              }
              break
            /*case 68:
              if(car.grounded){
                d1 = Math.hypot(car.vx,car.vz)
                car.ywv += .04
                car.ywv = Math.min(maxTurnRadius, Math.max(-maxTurnRadius, car.ywv))
              }
              break*/
            case 39:
              if(car.grounded){
                d1 = Math.hypot(car.vx,car.vz)
                car.ywv += .04
                car.ywv = Math.min(maxTurnRadius, Math.max(-maxTurnRadius, car.ywv))
              }
              break
            /*case 83:
              if(car.grounded){
                let boost = car.powerups.filter(powerup=>powerup.name=='speedBoost')[0].val
                car.vx -= S(car.yw) * .04 * boost
                car.vz -= C(car.yw) * .04 * boost
                d1 = Math.hypot(car.vx,car.vy,car.vz)
                d2 = Math.min(maxSpeed, d1)
                car.vx /=d1
                car.vz /=d1
                car.vx *=d2
                car.vz *=d2
              }
              break*/
            case 40:
              if(car.grounded){
                let boost = car.powerups.filter(powerup=>powerup.name=='speedBoost')[0].val
                car.vx -= S(car.yw) * (.25 - .2*(car.drift/100)) * boost
                car.vz -= C(car.yw) * (.25 - .2*(car.drift/100)) * boost
                d1 = Math.hypot(car.vx,car.vy,car.vz)
                d2 = Math.min(maxSpeed, d1)
                car.vx /=d1
                car.vz /=d1
                car.vx *=d2
                car.vz *=d2
              }
              break
            case 17:
              car.shooting = true
              break
          }
        }
      })
    }
    window.onload = () => {c.focus()}

    spawnBullet = (car, idx) => {
      floatingCam = !camMode
      sd = car.curGun
      ls = car.curGun > 1 ? 1 : 0
      for(let i=sd; i--;){
        px = S(p=Math.PI*2/sd*i+car.gunTheta)
        py = C(p)
        X = px/2
        Y = py/2
        Z = iBulletv
        if(floatingCam){
          R3(car.rl, car.pt, car.yw)
        }else{
          R3(curCar.rl/1.5, curCar.pt/1.25-.03, curCar.yw)
        }
        vx = X + car.vx
        vy = Y
        vz = Z + car.vz
        X = px*ls
        Y = py*ls - (floatingCam ? 3 : 3.5) - 1.5
        Z = 4
        if(floatingCam){
          carFunc(car)
        }else{
          R3(car.rl,car.pt,car.yw)
        }
        X += car.X + (floatingCam ? car.vx : 0)
        Y += car.Y
        Z += car.Z + (floatingCam ? car.vz : 0)
        spawnFlash(X, Y, Z, .0125)
        bullets = [...bullets, [X-vx, Y-(floatingCam?0:.1)-vy, Z-vz, vx, vy, vz, 1, idx]]
      }
    }

    shoot = (car, idx) => {
      if(car.shotTimer<t){
        car.shotTimer = t + 1/60*car.shotInterval
        spawnBullet(car, idx)
      }
    }

    carFunc = car =>{
      Y+=2
      Z+=2
      R3(car.rl/1.5, car.pt/1.25, car.yw)
      //R3(car.rl, car.pt, car.yw)
      Y-=2
      Z-=2
    }

    spawnFlash = (X, Y, Z, size = 1) => {
      for(let m = 1; m--;){
        flashes = [...flashes, [X,Y,Z,size]]
      }
    }

    spawnSparks = (X, Y, Z, intensity=1) => {
      for(let m = Math.min(100,20 + intensity*4|0); m--;){
        let p1 = Rn()*Math.PI*2
        let p2 = Rn()<.5 ? Math.PI - Rn()**.5*Math.PI/2: Rn()**.5*Math.PI/2
        let pv = .05+Rn()**.5*(iSparkv+intensity/200 - .05)
        vx = S(p1) * S(p2) * pv
        vy = -Math.abs(C(p2) * pv*1.5)
        vz = C(p1) * S(p2) * pv
        sparks = [...sparks, [X,Y,Z,vx,vy,vz,1+intensity/10]]
      }
    }

    spawnPowerup = () => {
      let type
      cars.map(car => {
        ls = 10 + Rn()**.5*490
        X = car.X + S(p=Math.PI*2*Rn()) * ls
        Z = car.Z + C(p) * ls
        Y = floor(X, Z) - 3
        type = (Rn()**2*powerupTemplate.length)|0
        initVal = powerupTemplate[type].val
        duration = powerupTemplate[type].duration
        nm = powerupTemplate[type].name
        powerups = [...powerups, [X,Y,Z,0,0,0,type,initVal,nm,duration]]
      })
    }

    checkHealth = (car, idx) => {
      let ret = true
      if(car.health <= 0){
        ret = false
        if(!idx){
          spawnFlashNotice('OH SIAL!', '#800')
          spawnFlashNotice('KAMU MATI!', '#800')
          spawnFlashNotice('.....hidup kembali.....', '#0f4')
        }
        spawnSparks(car.X, car.Y, car.Z, 100)
        spawnSparks(car.X, car.Y, car.Z, 100)
        let newCar = spawnCar(0, floor(0,0), 0, idx)
        Object.entries(car).forEach(([key,val])=>{
          switch(key){
            case 'id': pass = true; break
            case 'camMode': pass = true; break
            case 'score': pass = true; break
            case 'name': pass = true; break
            case 'distanceTravelled': pass = true; break
            default: pass = false
          }
          if(!pass) cars[idx][key] = newCar[key]
        })
      }
      return ret
    }

    drawCar = (car, idx, col1='#0f83', col2="#4f83") => {

      while(car.yw > Math.PI*4) car.yw-=Math.PI*8
      while(car.yw < -Math.PI*4) car.yw+=Math.PI*8
      while(car.pt > Math.PI*4) car.pt-=Math.PI*8
      while(car.pt < -Math.PI*4) car.pt+=Math.PI*8
      while(car.rl > Math.PI*4) car.rl-=Math.PI*8
      while(car.rl < -Math.PI*4) car.rl+=Math.PI*8

      let ox = car.X
      let oy = car.Y
      let oz = car.Z

      fl = floor(car.X, car.Z)
      ocg = car.grounded
      car.grounded = car.Y >= fl - 1
      car.vy /= 1.01
      car.X += car.vx
      car.Y += car.vy += grav
      car.Z += car.vz

      X=Y=0, Z = 1
      R3(0,0,car.yw)
      X1 = X, Y1 = Y, Z1 = Z
      X=Y=0, Z = -1
      R3(0,0,car.yw)
      X2 = X, Y2 = Y, Z2 = Z
      X3 = car.vx
      Z3 = car.vz
      d1 = Math.hypot(X3-X1,Z3-Z1)
      d2 = Math.hypot(X3-X2,Z3-Z2)
      car.forward = d2>=d1-.1

      d1 = Math.hypot(car.vx,car.vz)
      car.speed = d1
      car.distanceTravelled += d1 * (car.forward? 1 : -1)
      dx=dy=dz=0
      car.rl += car.rlv
      car.pt += car.ptv
      if(car.grounded) car.yw += car.ywv * (25-car.drift/250) *  Math.min(.04, d1/maxSpeed/2) * (car.keys[40] ? -1 : 1) * (car.keys[40] || car.keys[83] ? -1 : 1)
      car.rlv /= 1.00125
      car.ptv /= 1.00125
      car.ywv /= 1.00125
      sparkWheels = false
      if(car.grounded){
        if(!ocg && car.vy>1){
          intensity = car.vy*5
          sparkWheels = true
          if(car.vy > 6.5){
            cars[idx].health -= crashDamage
            checkHealth(car, idx)
            if(car.curGun){
              if(!idx) spawnFlashNotice('HANCUR! [SENJATA HILANG]', '#800')
              car.curGun = 0
            }
            car.decon.map(v=>{
              v[3] += (Rn() - .5) * intensity /4
              v[4] += (Rn() - .5) * intensity /4
              v[5] += (Rn() - .5) * intensity /4
              v[6] += (Rn() - .5) * intensity /4
              v[7] += (Rn() - .5) * intensity /4
              v[8] += (Rn() - .5) * intensity /4
            })
          }
          car.vy*=-.15
        }else{
          car.vy /= 1.5
        }
        if(!car.keys[38] && !car.keys[40]){ // no-pedal
          car.vx /= 1.2 - (.175 * (car.drift/100))
          car.vz /= 1.2 - (.175 * (car.drift/100))
        }else{
          car.vx /= 1.2 - (.2 * (car.drift/100))
          car.vz /= 1.2 - (.2 * (car.drift/100))
        }
        car.rlv /= 1.25
        car.ptv /= 1.25
        car.ywv /= 1.25
      }else{
        car.rl += car.rlv/1.4
        car.pt += car.ptv/1.4
        car.yw += car.ywv/1.4
      }

      fl = floor(car.X, car.Z)
      car.Y = Math.min(fl, car.Y)

      dy = Math.min(0, (car.Y - oy)/2) / (1+Math.abs(fl-car.Y))
      car.vy += Math.max(-5, dy*2)

      let carx = car.X
      let cary = car.Y
      let carz = car.Z


      if(car.grounded){
        X = -4
        Y = 0
        Z = 0
        R3(0, 0, car.yw)
        floor1 = floor(X+carx, Z+carz)
        X = 4
        Y = 0
        Z = 0
        R3(0, 0, car.yw)
        floor2 = floor(X+carx, Z+carz)

        X = 0
        Y = 0
        Z = -8
        R3(0, 0, car.yw)
        floor3 = floor(X+carx, Z+carz)
        X = 0
        Y = 0
        Z = 8
        R3(0, 0, car.yw)
        floor4 = floor(X+carx, Z+carz)
        car.ptv += Math.min(.1,Math.max(-.1,((floor4-floor3)/16-car.pt)/8))
        car.rlv += Math.min(.1,Math.max(-.1,((floor1-floor2)/8-car.rl)/8))
      }

      if(camMode && idx == camSelected){
        olc = x.lineCap
        x.lineJoin = x.lineCap = 'butt';
        /*(idx && Math.hypot(car.X-cars[idx].X,car.Y-cars[idx].Y,car.Z-cars[idx].Z)>50 ? base_car_lowpoly : base_car_lowpoly).map((v, i) => {*/
        base_car.map((v, i) => {
          x.beginPath()
          ax=ay=az = 0
          v.map((q, j) => {
            ax += q[0]
            ay += q[1]
            az += q[2]
          })
          ax /= v.length
          ay /= v.length
          az /= v.length

          v.map((q, j) => {
            for(m=12;m--;)car.decon[i][m]/=1.1
            dconx = (car.decon[i][0] += car.decon[i][3])
            dcony = (car.decon[i][1] += car.decon[i][4])
            dconz = (car.decon[i][2] += car.decon[i][5])
            X = q[0] -ax
            Y = q[1] -ay
            Z = q[2] -az
            R3(car.decon[i][6] += car.decon[i][9], car.decon[i][7] += car.decon[i][10], car.decon[i][8] += car.decon[i][11])
            X += 0 + dconx + ax
            Y += 3.5 + dcony + ay
            Z += 4 + dconz + az
            X*=2
            l = Q2()
            if(Z>4.5 && l[1]>c.height/3 && i>80) x.lineTo(...l)
          })
          alpha = (l[1]/c.height/2)**4*5
          if(alpha > .05) stroke(col1,col2,3,true,alpha)
        })

        for(n=4; n--;){
          if(sparkWheels){
            X = (n%2?1.5:-1.5)
            Y = 1
            Z = ((n/2|0)?3.8:-3.8)-1.2
            spawnSparks(car.X+X,car.Y+Y,car.Z+Z,intensity)
          };
          (idx!=camSelected && Math.hypot(car.X-cars[idx].X,car.Y-cars[idx].Y,car.Z-cars[idx].Z)>30 ? base_wheel_lowpoly : base_wheel).map((v, i) => {
            if((!car.forward && car.keys[38] || car.forward && car.keys[40])&& Rn()<.1){
              let poly = JSON.parse(JSON.stringify(v)).map(q => {
                X = q[0]
                Y = q[1]
                Z = q[2]
                X += (n%2?2.5:-2.5)
                Y -= 1.1
                Z += ((n/2|0)?3.8:-3.8)-3
                carFunc(car)
                q[0] = X*2
                q[1] = Y
                q[2] = Z
                q[3] = car.vx/2
                q[4] = 0
                q[5] = car.vz/2
                q[6] = 1
                q[7] = car.X
                q[8] = car.Y
                q[9] = car.Z
                return q
              })
              smokeTrails = [...smokeTrails, poly]
            }
            x.beginPath()
            v.map((q, j) => {
              dconx = (car.decon[i][0] += car.decon[i][3])
              dcony = (car.decon[i][1] += car.decon[i][4])
              dconz = (car.decon[i][2] += car.decon[i][5])
              X = q[0] //-ax
              Y = q[1] //-ay
              Z = q[2] //-az
              R3(car.decon[i][6] += car.decon[i][9], car.decon[i][7] += car.decon[i][10], car.decon[i][8] += car.decon[i][11])
              X = q[0] + dconx
              Y = q[1]+1.1 + dcony
              Z = q[2] + dconz
              if(!(n%2)) R3(0,0,Math.PI)
              R3(0,car.distanceTravelled,0)
              if(n/2|0) R3(0,0,car.ywv*8)
              X += (n%2?2.5:-2.5)
              Y -= 1.1
              Z += ((n/2|0)?3.8:-3.8)-1.2
              X *= 2
              Y += 3.5
              Z += 4
              l = Q2()
              if(Z>1) x.lineTo(...l)
            })
            alpha = (l[1]/c.height/2)**4*10
            stroke('#f00','#f043',.5,false,alpha)
          })
        }
        x.lineJoin = x.lineCap = olc

        if(showCrosshair){
          x.globalAlpha = .2
          s=800
          x.drawImage(crosshairImgs[crosshairSel].img,c.width/2-s/2,c.height/2-s/2,s,s)
          x.globalAlpha = 1
          x.lineJoin = x.lineCap = olc
          //x.lineCap = x.lineJoin = 'round'
        }

        //guns
        sd = car.curGun
        ls = car.curGun>1 ? 1 : 0
        for(let i = sd; i--;){
          tx = S(p=Math.PI*2/sd*i+car.gunTheta)*ls
          ty = C(p)*ls - 1.5
          tz = 0
          car.gunThetav+=car.shooting?.02:0
          car.gunTheta += car.gunThetav
          car.gunThetav /=1.25
          base_gun.map((v,i) => {
            x.beginPath()
            v.map((q, j) => {
              X = q[0]
              Y = q[1]
              Z = q[2]
              R3(car.gunTheta,0,0)
              X += tx
              Y += ty
              Z += tz + 3
              //R3(car.rl,car.pt,car.yw)
              //X += car.X
              //Y += car.Y
              //Z += car.Z
              //R(Rl,Pt,Yw,1)
              if(Z>0)x.lineTo(...Q2())
            })
            stroke('#4f81','',1,false)
          })
        }
        x.lineCap = x.lineJoin = 'butt'
      }else{
        x.lineJoin = x.lineCap = 'butt';
        (idx && Math.hypot(car.X-cars[idx].X,car.Y-cars[idx].Y,car.Z-cars[idx].Z)>50 ? base_car_lowpoly : base_car).map((v, i) => {
          ax=ay=az = 0
          v.map((q, j) => {
            ax += q[0]
            ay += q[1]
            az += q[2]
          })
          ax /= v.length
          ay /= v.length
          az /= v.length
          if(car.poweredUp && Rn()<.05){
            let poly = JSON.parse(JSON.stringify(v)).map(q => {
              X = q[0]
              Y = q[1]
              Z = q[2]
              carFunc(car)
              q[0] = X
              q[1] = Y
              q[2] = Z
              q[3] = car.vx/1.25
              q[4] = 0
              q[5] = car.vz/1.25
              q[6] = 1
              q[7] = car.X
              q[8] = car.Y
              q[9] = car.Z
              return q
            })
            carTrails = [...carTrails, poly]
          }

          x.beginPath()
          v.map((q, j) => {
            for(m=12;m--;)car.decon[i][m]/=1.1
            d = Math.hypot(car.decon[i][0],car.decon[i][0],car.decon[i][0])
            dconx = (car.decon[i][0] += car.decon[i][3])
            dcony = (car.decon[i][1] += car.decon[i][4]+=(d>.1?grav/3:0))
            dconz = (car.decon[i][2] += car.decon[i][5])
            if(dcony + cary + ay >= (f=floor(carx+ax+dconx, carz+az+dconz))){
              car.decon[i][4] = (car.decon[i][4]>0 ? -car.decon[i][4] : car.decon[i][4]) * .7
              dcony = car.decon[i][1] += car.decon[i][4]
            }
            X = q[0] -ax
            Y = q[1] -ay
            Z = q[2] -az
            R3(car.decon[i][6] += car.decon[i][9], car.decon[i][7] += car.decon[i][10], car.decon[i][8] += car.decon[i][11])
            X += ax
            Y += ay
            Z += az
            carFunc(car)
            X += dconx
            Y += dcony
            Z += dconz
            X += carx
            Y += cary
            Z += carz
            R(Rl,Pt,Yw,1)
            if(Z>0) x.lineTo(...Q())
          })
          stroke(col1,col2,3,false)
        })

        for(n=4; n--;){
          if(sparkWheels){
            X = (n%2?1.5:-1.5)
            Y = 1
            Z = ((n/2|0)?3.8:-3.8)-1.2
            spawnSparks(car.X+X,car.Y+Y,car.Z+Z,intensity)
          };
          ((idx && Math.hypot(car.X-cars[idx].X,car.Y-cars[idx].Y,car.Z-cars[idx].Z)>50 ? base_wheel_lowpoly : base_wheel)).map((v, i) => {
            if((!car.forward && car.keys[38] || car.forward && car.keys[40] )&& Rn()<.1){
              let poly = JSON.parse(JSON.stringify(v)).map(q => {
                X = q[0]
                Y = q[1]
                Z = q[2]
                X += (n%2?2.5:-2.5)
                Y -= 1.1
                Z += ((n/2|0)?3.8:-3.8)-1.2
                carFunc(car)
                q[0] = X
                q[1] = Y
                q[2] = Z
                q[3] = car.vx/2
                q[4] = 0
                q[5] = car.vz/2
                q[6] = 1
                q[7] = car.X
                q[8] = car.Y
                q[9] = car.Z
                return q
              })
              smokeTrails = [...smokeTrails, poly]
            }

            x.beginPath()
            v.map((q, j) => {
              dconx = (car.decon[i][0] += car.decon[i][3])
              dcony = (car.decon[i][1] += car.decon[i][4])
              dconz = (car.decon[i][2] += car.decon[i][5])
              X = q[0] -ax
              Y = q[1] -ay
              Z = q[2] -az
              R3(car.decon[i][6] += car.decon[i][9], car.decon[i][7] += car.decon[i][10], car.decon[i][8] += car.decon[i][11])
              X = q[0] + dconx
              Y = q[1]+1.1 + dcony
              Z = q[2] + dconz
              if(!(n%2)) R3(0,0,Math.PI)
              R3(0,car.distanceTravelled,0)
              if(n/2|0) R3(0,0,car.ywv*8)
              X += (n%2?2.5:-2.5)
              Y -= 1.1
              Z += ((n/2|0)?3.8:-3.8)-1.2
              carFunc(car)
              X += carx
              Y += cary
              Z += carz
              R(Rl,Pt,Yw,1)
              if(Z>0) x.lineTo(...Q())
            })
            stroke('#f00','#f043',.5,false)
          })
        }

        //guns
        //x.lineJoin = x.lineCap = 'round'
        sd = car.curGun
        ls = car.curGun>1 ? 1 : 0
        for(let i = sd; i--;){
          tx = S(p=Math.PI*2/sd*i+car.gunTheta)*ls
          ty = C(p)*ls - 1.5
          tz = 0
          car.gunThetav+=car.shooting?.02:0
          car.gunTheta += car.gunThetav
          car.gunThetav /=1.25
          base_gun.map((v,i) => {
            x.beginPath()
            v.map((q, j) => {


              X = q[0]
              Y = q[1]
              Z = q[2]
              R3(car.gunTheta,0,0)
              X += tx
              Y += ty - 3
              Z += tz + 3
              carFunc(car)
              X += car.X
              Y += car.Y
              Z += car.Z
              R(Rl,Pt,Yw,1)
              if(Z>0)x.lineTo(...Q())
            })
            stroke('#4f86','',4,false)
          })
        }

        X = car.X
        Y = car.Y-8
        Z = car.Z
        R(Rl,Pt,Yw,1)
        if(Z>0){
          x.textAlign = 'center'
          x.font = Math.max(32, (fs=1e3/Z)) + 'px Courier Prime'
          x.fillStyle = '#fff8'
          l = Q()
          x.fillText(car.name, ...l)

          w = 4e3/Z
          h = w/8
          x.strokeStyle = '#fffa'
          x.lineWidth = 5
          x.strokeRect(l[0]-w/2,l[1]+h/2,w,h)
          x.fillStyle = '#0f0'
          x.fillRect(l[0]-w/2,l[1]+h/2,w*car.health,h)
        }

        if(showGyro){
          x.beginPath()
          X = 0
          Y = -3
          Z = 0
          carFunc(car)
          X += car.X
          Y += car.Y
          Z += car.Z
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          X = 0
          Y = -3
          Z = 5
          carFunc(car)
          X += car.X
          Y += car.Y
          Z += car.Z
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          stroke('#f008', '', 5, true)

          x.beginPath()
          X = 0
          Y = -3
          Z = 0
          carFunc(car)
          X += car.X
          Y += car.Y
          Z += car.Z
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          X = 5
          Y = -3
          Z = 0
          carFunc(car)
          X += car.X
          Y += car.Y
          Z += car.Z
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          stroke('#f008', '', 5, true)

          x.beginPath()
          X = 0
          Y = -3
          Z = 0
          carFunc(car)
          X += car.X
          Y += car.Y
          Z += car.Z
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          X = 0
          Y = -8
          Z = 0
          carFunc(car)
          X += car.X
          Y += car.Y
          Z += car.Z
          R(Rl,Pt,Yw,1)
          if(Z>0) x.lineTo(...Q())
          stroke('#f008', '', 5, true)
        }
      }
      if(idx == camSelected){
        x.textAlign = 'left'
        x.fillStyle = '#1048'
        x.fillRect(0,c.height-200, 620, 200)
        x.font = (fs=32)+'px Courier Prime'
        x.fillStyle = '#aaa'
        x.fillText(`KAMERA SAAT INI:`, 10, c.height-fs*1.66)
        x.fillStyle = '#fff'
        x.fillText(car.name, 10, c.height-fs/2)
        x.strokeStyle = '#fffa'
        x.lineWidth = 5
        x.strokeRect(10,c.height-130, 600, 30)
        x.fillStyle = '#0f0'
        x.fillRect(10,c.height-130, 600 * car.health, 30)
        x.font = (fs=64)+'px Courier Prime'
        x.fillText(`DARAH ${Math.ceil(1+car.health*99)}%`, 10, c.height-fs/2-110)
      }

      if(idx==0){ // draw once
        x.fillStyle = '#1048'
        hgt = 70 + cars.length*50
        x.fillRect(c.width-620,c.height-hgt, 620, hgt)
      } 
      
      x.textAlign = 'left'
      x.font = (fs=64)+'px Courier Prime'
      x.fillStyle = '#0f0'
      x.fillText(`SKOR`, c.width-610, c.height-hgt+fs/1.25)
      x.font = (fs=50)+'px Courier Prime'
      x.fillStyle = '#0f88'
      x.fillText(`${car.score} : ${car.name}`, c.width-610, c.height-hgt + 100 + fs*idx)
    }
    
    doAI = (car, idx) => {
      X = car.X
      Y = car.Y
      Z = car.Z
      car.keys=Array(256).fill(false)
      car.keys[38] = true
      if(Rn()<.4) car.keys[17] = true
      if(Rn()<.9){
        if(!car.curGun){
          powerups.map(v => {
            switch(v[6]){
              case 1:  //guns++
                X2 = v[0]
                Y2 = v[1]
                Z2 = v[2]
                p = Math.atan2(X2-X, Z2-Z)
                if(Math.abs(p-car.yw)>Math.PI){
                  if(p<car.yw){
                    p+=Math.PI*2
                  }else{
                    p-=Math.PI*2
                  }
                }
                if(p-car.yw>0){
                  car.keys[37] = false
                  car.keys[39] = true
                }else{
                  car.keys[37] = true
                  car.keys[39] = false
                }
              break
            }
          })
        }else{
          mind = 6e6
          tgt = -1
          cars.map((q, j) => {
            X2 = q.X
            Y2 = q.Y
            Z2 = q.Z
            if(j != idx && (d = Math.hypot(X2-X,Y2-Y,Z2-Z))<mind){
              tgt = j
              mind = d
            }
          })
          if(tgt != -1){
            X2 = cars[tgt].X
            Y2 = cars[tgt].Y
            Z2 = cars[tgt].Z
            p = Math.atan2(X2-X, Z2-Z)
            if(Math.abs(p-car.yw)>Math.PI){
              if(p<car.yw){
                p+=Math.PI*2
              }else{
                p-=Math.PI*2
              }
            }
            if(p-car.yw>0){
              car.keys[37] = false
              car.keys[39] = true
            }else{
              car.keys[37] = true
              car.keys[39] = false
            }
          }
        }
      }
    }
  }

  curCar = cars[camSelected]
  switch(camMode){
    case 0:
      d = Math.hypot(curCar.vx, curCar.vz)
      cd = Math.min(maxCamDist, camDist + d/2)
      dx = curCar.cam.X - curCar.X
      dy = curCar.cam.Y - curCar.Y
      dz = curCar.cam.Z - curCar.Z
      d = Math.hypot(dx,dy,dz)
      nx = S(t/4)*cd
      nz = C(t/4)*cd
      X = dx/d*cd-nx + curCar.X
      Z = dz/d*cd-nz + curCar.Z
      Y = Math.min(floor(X,Z)-cd, dy/d*cd-cd/2  + curCar.Y)
      tgtx = X
      tgty = Y
      tgtz = Z
      curCar.cam.X -= (curCar.cam.X - tgtx)/camFollowSpeed
      curCar.cam.Y -= (curCar.cam.Y - tgty)/camFollowSpeed
      curCar.cam.Z -= (curCar.cam.Z - tgtz)/camFollowSpeed
      oX = curCar.cam.X
      oZ = curCar.cam.Z
      oY = curCar.cam.Y
      Pt = -Math.acos((oY-curCar.Y) / (Math.hypot(oX-curCar.X,oY-curCar.Y,oZ-curCar.Z)+.001))+Math.PI/2
      Yw = -Math.atan2(curCar.X-oX,curCar.Z-oZ)
      Rl = 0
      break
    case 1:
      X = 0
      Y = -5
      Z = 25
      R3(0,curCar.pt,0)
      R3(0,0,curCar.yw)
      X_ = X+=curCar.X
      Y_ = Y+=curCar.Y
      Z_ = Z+=curCar.Z
      X = 0
      Y = -3
      Z = 1
      R3(0,curCar.pt,0)
      R3(0,0,curCar.yw)
      oX = curCar.cam.X = curCar.X - X
      oY = curCar.cam.Y = curCar.Y - 3
      oZ = curCar.cam.Z = curCar.Z - Z
      Pt = -Math.acos((oY-Y_) / (Math.hypot(oX-X_,oY-Y_,oZ-Z_)+.001))+Math.PI/2
      Yw = -Math.atan2(X_-oX,Z_-oZ)
      Rl = -curCar.rl
      break
  }

  x.globalAlpha = 1
  x.fillStyle='#000C'
  x.fillRect(0,0,c.width,c.height)
  x.lineJoin = x.lineCap = 'butt'

  if(!((t*60|0)%((powerupFreq/powerupTemplate.length*(1+cars.length))|0))) spawnPowerup()

  if(showstars) ST.map(v=>{
    X = v[0]
    Y = v[1]
    Z = v[2]
    R(Rl,Pt,Yw,1)
    if(Z>0){
      if((x.globalAlpha = Math.min(1,(Z/5e3)**2))>.1){
        s = Math.min(1e3, 4e5/Z)
        x.fillStyle = '#ffffff04'
        l = Q()
        x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
        s/=5
        x.fillStyle = '#fffa'
        x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      }
    }
  })

  x.globalAlpha = 1

  if(showFloor){
    cars.map(car => {
      let carx = car.X
      let carz = car.Z
      let cary = car.Y

      rw = (32+4)*8
      cl = rw/3|0
      sp = 8
      ls = sp/2.25  //.75**.5*sp/2
      Array(rw*cl).fill().map((v, i) => {
        if(!((i+(i/cl/5|0))%2) && !((i/cl|0)%6)){
          tx = ((i%cl)-cl/2+.5)*sp
          ty = 0
          tz = (((i/cl|0)%rw)-rw/2+.5)*sp * (.75**2/2)
          while(carz-tz>rw*sp*(.75**2/2)/2){
            tz+=rw*sp*(.75**2/2)
          }
          while(carz-tz<-rw*sp*(.75**2/2)/2){
            tz-=rw*sp*(.75**2/2)
          }
          ct = 0
          while(carx-tx>cl*sp/2 && ct<1e3){
            tx+=cl*sp
            ct++
          }
          ct = 0
          while(carx-tx<-cl*sp/2 && ct<1e3){
            tx-=cl*sp
            ct++
          }
          X = tx
          Z = tz
          Y_ = Y = floor(X,Z)
          R(Rl,Pt,Yw,1)
          if(Z>0){
            d1 = Math.hypot(tx-carx,tz-carz)
            alpha = 1/(1+d1**8/1e19)
            if(alpha > .1 && d1<rw/4){
              x.beginPath()
              ay = 0
              for(j=6;j--;){
                X = tx + S(p=Math.PI*2/6*j+Math.PI/6) * ls + ((i/cl|0)%2?sp/2:0)
                Z = tz + C(p) * ls
                Y = ty + floor(X, Z)
                ay += Y
                R(Rl,Pt,Yw,1)
                if(Z>0) x.lineTo(...Q())
              }
              ay /= 6
              col1 = ``//`hsla(${ay*5},99%,50%,${.2}`
              col2= `hsla(${ay*5+180},99%,50%,${.5}`
              stroke(col1, col2, 25, false, alpha)
            }else{
              l = Q()
              s = 2500/Z
              x.globalAlpha = alpha
              x.fillStyle = `#40f6`
              x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
              s/=3
              x.fillStyle = `#2fcf`
              x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
            }
          }
        }
      })
    })
  }
  x.globalAlpha = 1

  if(showOrigin){
    sd = 24
    for(j=6; j--;){
      ls = (1+j)*8
      x.beginPath()
      for(i=sd;i--;){
        X = S(p=Math.PI*2/sd*i)*ls
        Z = C(p)*ls
        Y = floor(X, Z)
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
      }
      stroke('',`hsla(${360/6*j+t*200},99%,50%,${.5})`)
    }
  }

  cars.map((car, idx) => {
    if(idx) doAI(car, idx)
    if(car.shooting) shoot(car, idx)
    doKeys(car)
  })

  if(showCars) {
    cars.map((car, idx) => {
      car.powerups.map((powerup, i) => {
        switch(i){
          case 0:
            if(powerup.timer){
              car.poweredUp = true
              col1 = `hsla(${t*15000},99%,50%,1)`
              col2 = `hsla(${t*15000},99%,50%,.2)`
              drawCar(car, idx, col1, col2)
            }
            break
          case 1:
            if(powerup.timer){
              cars[idx].curGun++
              powerup.timer = 0
              powerup.val=0
            }
            break
        }
        if(powerup.timer && powerup.timer <=t){
          powerup.timer = 0
          powerup.val = 1
          car.poweredUp = false
        }
      })
      if(!car.poweredUp){
        drawCar(car, idx)
      }
    })
  }

  x.globalAlpha = 1


  if(t&&!dashHasBeenHidden && showDash && !((t*60|0)%480)){
    spawnFlashNotice('atau \'M\' untuk beralih mode kamera', '#40f8')
    spawnFlashNotice('untuk menyembunyikan dasbor', '#40f8')
    spawnFlashNotice('Tips: tekan \'T\'', '#40f8')
  }
  
  if(t && !camSelHasChanged && !(((t*60|0)+240)%480)){
    spawnFlashNotice('...untuk mengintip kamera pemain lain', '#40f8')
    spawnFlashNotice('\'1\', \'2\'... dll', '#40f8')
    spawnFlashNotice('Tips: Tekan tombol angka...', '#40f8')
  }
  
  powerups = powerups.filter(v=>v[7]>0)
  powerups.map(v=>{
    let starIdx
    X = v[0]
    Z = v[2]
    Y = v[1] = floor(X,Z) - 3
    cars.map((car, idx) => {
      X2 = car.X
      Y2 = car.Y
      Z2 = car.Z
      if(Math.hypot(X2-X,Y2-Y,Z2-Z)<25){
        spawnFlash(X,Y,Z)
        switch(v[6]){
          case 0:
            car.powerups[v[6]].val++
            car.powerups[v[6]].timer = t + v[9]
            break
          case 1:
            car.powerups[v[6]].timer = t + v[9]
            break
          case 2:
            cars[idx].health = 1
            car.powerups[v[6]].timer = t + v[9]
            break
        }
        v[7]=0
      }
    })
    R(Rl,Pt,Yw,1)
    if(Z>0){
      s = Math.min(1e4, 8e4/Z)
      l = Q()
      switch(v[6]){
        case 0:  //Kecepatan++
          starIdx = 4
        break
        case 1:  //Senjata++
          starIdx = 1
        break
        case 2:  //Darah++
          starIdx = 6
        break
      }
      x.drawImage(starImgs[starIdx].img,l[0]-s/2/1.065, l[1]-s/2/1.065,s,s)
    }

    X = v[0]
    Z = v[2]
    Y = v[1] = floor(X,Z) - 3
    R(Rl,Pt,Yw,1)
    if(Z>0){
      s = Math.min(4e3, 2e4/Z)
      l = Q()
      x.drawImage(powerupImgs[v[6]].img,l[0]-s/2, l[1]-s/2-15000/Z,s,s)
      x.textAlign = 'center'
      x.font = (fs=20000/Z)+'px Courier Prime'
      x.fillStyle = '#fff'
      x.fillText((v[7]*100|0),l[0], l[1]-30000/Z,s,s)
    }
    v[7] -= .0025
  })

  carTrails = carTrails.filter(v => {
    v = v.filter(q=>q[6]>0)
    return !!v.length
  })
  carTrails.map(v=>{
    x.beginPath()
    v.map(q => {
      q[7] += q[3]/=1.01
      q[8] += q[4]/=1.01
      q[9] += q[5]/=1.01
      X = (q[0] *= 1.05) + q[7]
      Y = (q[1] *= 1.05) + q[8]
      Z = (q[2] *= 1.05) + q[9]
      R(Rl,Pt,Yw,1)
      if(Z>0) x.lineTo(...Q())
      a=q[6] -= .05
    })

    stroke('', '#f0f6',1,false,Math.max(0,a))
  })

  smokeTrails = smokeTrails.filter(v => {
    v = v.filter(q=>q[6]>0)
    return !!v.length
  })
  smokeTrails.map(v=>{
    x.beginPath()
    v.map(q => {
      q[7] += q[3]/=1.01
      q[8] += q[4]/=1.01
      q[9] += q[5]/=1.01
      X = (q[0] *= 1.05) + q[7]
      Y = (q[1] *= 1.05) + q[8]
      Z = (q[2] *= 1.05) + q[9]
      R(Rl,Pt,Yw,1)
      if(Z>0) x.lineTo(...Q())
      a=q[6] -= .025
    })
    stroke('', '#6666',1,false,Math.max(0, a))
  })

  bullets = bullets.filter(v=>v[6]>0)
  bullets.map(v => {
    X = v[0] += v[3]
    Y = v[1] += v[4]
    Z = v[2] += v[5]
    if(Y>(Y_=floor(X,Z)+1)){
      spawnSparks(X, Y_, Z, 10)
      v[6]=0
    }else{
      cont = true
      cars.map((car, idx) => {
        if(v[7] != idx){
          X2 = car.X
          Y2 = car.Y
          Z2 = car.Z
          d = Math.hypot(X2-X, Y2-Y, Z2-Z)
          if(d<16){
            spawnSparks(car.X, car.Y, car.Z, 20)
            cars[idx].health -= bulletDamage
            cont = checkHealth(car, idx)
            if(!cont){
              cars.filter((q, j) => j==v[7])[0].score++
            }
            v[6] = 0
          }
        }
      })
      if(cont){
        R(Rl,Pt,Yw,1)
        if(Z>0){
          l = Q()
          s = Math.min(1e5,5e3/Z*v[6])
          x.drawImage(burst,l[0]-s/2,l[1]-s/2,s,s)
          //s/=2
          //x.drawImage(starImgs[4].img,l[0]-s/2/1.05,l[1]-s/2/1.05,s,s)
        }
        v[6] -= .025
      }
    }
  })

  flashes = flashes.filter(v=>v[3]>0)
  flashes.map(v=>{
    X = v[0]
    Y = v[1]
    Z = v[2]
    R(Rl,Pt,Yw,1)
    if(Z>0){
      l = camMode?Q2():Q()
      s = Math.min(1e5,5e5/Z*v[3])
      x.drawImage(starImgs[5].img,l[0]-s/2/1.05,l[1]-s/2/1.05,s,s)
    }
    v[3] -= .1
  })

  sparks = sparks.filter(v=>v[6]>0)
  sparks.map(v=>{
    X = v[0] += v[3]
    Y = v[1] += v[4]
    Z = v[2] += v[5]
    R(Rl,Pt,Yw,1)
    if(Z>0){
      l = Q()
      s = Math.min(1e4,1200/Z*v[6])
      x.fillStyle = '#ff000005'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=3
      x.fillStyle = '#ff880010'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
      s/=2
      x.fillStyle = '#ffffffff'
      x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
    }
    v[6]-=.1
  })

  flashNotices = flashNotices.filter(v=>v[2]>0)
  if(flashNotices.length){
    x.fillStyle = flashNotices[l=flashNotices.length-1][1]
    x.globalAlpha = flashNotices[l][2]
    x.textAlign = 'center'
    x.fillRect(0,0,c.width,c.height)
    x.fillStyle = '#fff'
    x.font = (fs=60)+'px Courier Prime'
    x.fillText(flashNotices[l][0],c.width/2, c.height/1.6 - fs)
    flashNotices[l][2]-=.05
  }

  x.globalAlpha = 1
  
  

  if(showDash){

    let ofx = hotkeysModalVisible ? 450 : 0
    x.beginPath()
    x.lineTo(ofx-450, c.height - 490)
    for(i=0;i<21;i++){
      X = Math.min(50, S(Math.PI/20*i)**.5*80)+ofx
      Y = c.height - 490 + i*14.5
      x.lineTo(X, Y)
    }
    x.lineTo(ofx-450, c.height - 490 + 20*14.5)
    x.textAlign = 'left'
    Z=10
    stroke('#f40','#422c',2,true)
    x.fillStyle = '#f80'
    x.font = (fs=40) + 'px Courier Prime'
    X = 5 + ofx
    fs/=1.25
    Y = c.height - 473 + fs
    x.fillText('H', X, Y)
    x.fillText('O', X, Y+=fs)
    x.fillText('T', X, Y+=fs)
    x.fillText('K', X, Y+=fs*2)
    x.fillText('E', X, Y+=fs)
    x.fillText('Y', X, Y+=fs)
    x.fillText('S', X, Y+=fs)
    
    X-=450
    Y = c.height - 490 + fs
    x.font = (fs=32) + 'px Courier Prime'
    x.fillText('Panah  - Mengemudi', X, Y)
    x.fillText('SHIFT  - Nitro', X, Y+=fs)
    x.fillText('CTRL   - Menembak', X, Y+=fs)
    x.fillText('T      - HUD', X, Y+=fs)
    x.fillText('M      - Mode Kamera', X, Y+=fs)
    x.fillText('0-9    - Kamera Pemain', X, Y+=fs)
    x.fillText('C      - Garis Bidik', X, Y+=fs)          
    x.fillText('H      - Tombol Pintas', X, Y+=fs)          

    olc = x.lineJoin
    x.lineJoin = x.lineCap = 'butt'
    ls     = 200
    margin = 55

    //backlight
    x.beginPath()
    x.lineTo(-20,ls*2 + margin*3.25)
    x.lineTo(-20,-20)
    x.lineTo(c.width+20,-20)
    x.lineTo(c.width+20,Y_=ls*2+margin*3.25)
    x.lineTo(c.width - c.width/6,Y_=ls*2+margin*3.25)
    for(i=0;i<100;i++){
      X = c.width - c.width/6 - c.width*(2/3)/99*i
      Y = Y_ + (C(Math.PI/99*i)**4*ls-ls)*2.5
      x.lineTo(X,Y)
    }
    x.lineTo(-20,Y_=ls*2+margin*3.25)
    Z = 3
    col1 = curCar.forward ? '#0f82' : '#f002'
    col2 = curCar.forward ? '#0f82' : '#f042'
    stroke(col1, col2, 2)

    switch(mapChoice){
      case 'topo':
        x.lineJoin = x.lineCap = 'round'
        let mapRes = 50
        let sp = 8
        let scl = 1, fl
        x.font = (fs=60) + 'px Courier Prime'
        x.textAlign = 'left'
        x.fillStyle = '#444'
        x.fillText('◄ ►', c.width - margin*4 - mapRes*sp, fs)
        x.fillStyle = '#fff'
        x.textAlign = 'right'
        x.fillText('', c.width - margin, fs)


        rw = 128*2+2
        cl = rw/3|0
        sp_ = 8
        ls_ = sp_/2.25  //.75**.5*sp_/2
        x.beginPath()
        x.arc(c.width - margin/2 - mapRes*sp/2, margin*1.66 + mapRes*sp/2,ls,0,7)
        stroke('#0ff','#000',1,true)
        Array(rw*cl).fill().map((v, i) => {
          if(!((i+(i/cl/5|0))%2) && !((i/cl|0)%6)){
            tx = ((i%cl)-cl/2+.5)*sp_
            ty = 0
            tz = (((i/cl|0)%rw)-rw/2+.5)*sp_ * (.75**2/2)
            while(cars[0].Z-tz>rw*sp_*(.75**2/2)/2){
              tz+=rw*sp_*(.75**2/2)
            }
            while(cars[0].Z-tz<-rw*sp_*(.75**2/2)/2){
              tz-=rw*sp_*(.75**2/2)
            }
            ct = 0
            while(cars[0].X-tx>cl*sp_/2 && ct<1e3){
              tx+=cl*sp_
              ct++
            }
            ct = 0
            while(cars[0].X-tx<-cl*sp_/2 && ct<1e3){
              tx-=cl*sp_
              ct++
            }
            worldX = tx
            worldZ = tz
            fl = floor(worldX, -worldZ)
            X = (tx - cars[0].X)/scl
            Z = (tz - cars[0].Z)/scl
            if(Math.hypot(X,Z)<ls*1.00){
              Y = 0
              R3(0,0,-cars[0].yw)
              s = sp/1.5*2
              x.fillStyle = `hsla(${fl*5+180},99%,50%,.5)`
              x.fillRect(c.width - margin/2 - mapRes*sp/2 + X - s/2, margin*1.66 + mapRes*sp/2 - Z - s/2, s, s)
            }
          }
        })

        if(showOrigin){
          sd = 24
          tx = -cars[camSelected].X/scl
          tz = -cars[camSelected].Z/scl
          if((d = Math.hypot(tx,tz))>ls*1.00){
            tx /= d
            tz /= d
            tx *= ls*1.00
            tz *= ls*1.00
          }
          s_ = sp*1.3*4 * Math.max(.3, Math.min(1,ls/1.5/d))/40
          for(j=6; j--;){
            ls2 = (1+j)*8
            x.beginPath()
            for(i=sd;i--;){
              X = (S(p=Math.PI*2/sd*i)*ls2)/scl*s_+tx
              Z = (C(p)*ls2)/scl*s_+tz
              Y = 0
              R3(0, 0, -cars[camSelected].yw)
              x.lineTo(c.width - margin/2 - mapRes*sp/2 + X, margin*1.66 + mapRes*sp/2 - Z)
            }
            stroke('',`hsla(${360/6*j+t*200},99%,50%,${.5})`)
          }
        }

        powerups.map(v=>{
          X = (v[0] - cars[0].X)/scl
          Z = (v[2] - cars[0].Z)/scl
          if((d = Math.hypot(X,Z))>ls*1.00){
            X /= d
            Z /= d
            X *= ls*1.00
            Z *= ls*1.00
          }
          Y = 0
          R3(0,0,-curCar.yw)
          X += c.width - margin/2 - mapRes*sp/2
          Z = margin*1.66 + mapRes*sp/2 - Z
          X = Math.min(c.width - margin/2, Math.max(X, c.width - margin/2 - mapRes*sp))
          Z = Math.min(margin*1.66 + mapRes*sp, Math.max(Z, margin*1.66))
          s = sp*1.3*4 * Math.max(.1, Math.min(1,ls/1.5/d))
          x.drawImage(powerupImgs[v[6]].img, X - s/2, Z - s/2, s, s)
          //x.drawImage(powerupImgs[v[6]].img,c.width - margin/2 - mapRes*sp/2 + X - s/2, margin*1.66 + mapRes*sp/2 - Z - s/2, s, s)
        })

        cars.map(car => {
          X = (car.X - cars[0].X)/scl
          Z = (car.Z - cars[0].Z)/scl
          if((d = Math.hypot(X,Z))>ls*1.00){
            X /= d
            Z /= d
            X *= ls*1.00
            Z *= ls*1.00
          }
          Y = 0
          R3(0,0,-curCar.yw)
          X += c.width - margin/2 - mapRes*sp/2
          Z = margin*1.66 + mapRes*sp/2 - Z
          X = Math.min(c.width - margin/2, Math.max(X, c.width - margin/2 - mapRes*sp))
          Z = Math.min(margin*1.66 + mapRes*sp, Math.max(Z, margin*1.66))
          s = sp*1.3*4 * Math.max(.1, Math.min(1,ls/1.5/d))
          x.drawImage(carIcon, X - s, Z - s/2, s*2, s)
        })

        bullets.map(v=>{
          X = (v[0] - curCar.X)/scl
          Z = (v[2] - curCar.Z)/scl
          if(Math.hypot(X,Z)<ls*1.00){
            Y = 0
            R3(0,0,-curCar.yw)
            s = sp*1.3*4
            x.drawImage(starImgs[0].img,c.width - margin/2 - mapRes*sp/2 + X - s/2, margin*1.66 + mapRes*sp/2 - Z - s/2, s, s)
          }
        })

        ls_ = ls
        s=350
        x.beginPath()
        let p_ = 0//curCar.yw
        X = c.width - margin/2 - mapRes*sp/2+ S(-p_)*ls_/5
        Y = margin*1.66 + mapRes*sp/2 + C(-p_)*ls_/5
        x.lineTo(X,Y)
        X = c.width - margin/2 - mapRes*sp/2
        Y = margin*1.66 + mapRes*sp/2
        x.lineTo(X,Y)
        tx = X += S(p=-p_+Math.PI)* ls_/5
        ty = Y += C(p)* ls_/5
        x.lineTo(X,Y)
        X += S(p+Math.PI/1.3)*ls_/8
        Y += C(p+Math.PI/1.3)*ls_/8
        x.lineTo(X,Y)
        x.lineTo(X=tx,Y=ty)
        X += S(p-Math.PI/1.3)*ls_/8
        Y += C(p-Math.PI/1.3)*ls_/8
        x.lineTo(X,Y)
        x.lineTo(tx,ty)
        Z=3
        stroke('#000','',2.5/2,false)
        stroke('#f00','',.5/2,true)
        
        cars.map(car => {
          X = (car.X - cars[0].X)/scl
          Z = (car.Z - cars[0].Z)/scl
          if((d = Math.hypot(X,Z))>ls*1.00){
            X /= d
            Z /= d
            X *= ls*1.00
            Z *= ls*1.00
          }
          Y = 0
          R3(0,0,-curCar.yw)
          X += c.width - margin/2 - mapRes*sp/2
          Z = margin*1.66 + mapRes*sp/2 - Z
          X = Math.min(c.width - margin/2, Math.max(X, c.width - margin/2 - mapRes*sp))
          Z = Math.min(margin*1.66 + mapRes*sp, Math.max(Z, margin*1.66))
          x.font = (fs=24) + 'px Courier Prime'
          x.textAlign = 'center'
          x.strokeStyle = '#000a'
          x.lineWidth = 3
          x.strokeText(car.name, X, Z-fs/6)
          x.fillStyle = '#fff'
          x.fillText(car.name, X, Z-fs/6)
        })


        x.lineJoin = x.lineCap = 'butt'

        break
      default:
        break
    }


    ls     = 200
    margin = 55

    // speedometer
    margin += 15
    Z = 3
    col    = '#4ff'
    x.beginPath()
    x.arc(margin+ls,margin+ls,ls,0,7)
    stroke(col,'#4f82')
    sd     = 10
    opi    = -Math.PI*2/10
    x.textAlign = 'center'
    for(i=sd+1;i--;){
      x.font = (fs = 32) + 'px Courier Prime'
      x.fillStyle = '#fff'
      X = ls+margin+S(p=Math.PI*2/(sd+2)*-i+opi)*ls*1.2
      Y = ls+margin+C(p)*ls*1.2
      x.fillText(i*40,X,Y+fs/3)
    }
    sd     = 100
    for(i=sd+1;i--;){
      x.beginPath()
      f = !(i%10)?.75:(!(i%5)?.85:.95)
      X = ls+margin+S(p=Math.PI*2/(sd+20)*-i+opi)*(ls*f)
      Y = ls+margin+C(p)*(ls*f)
      x.lineTo(X,Y)
      X = ls+margin+S(p=Math.PI*2/(sd+20)*-i+opi)*ls
      Y = ls+margin+C(p)*ls
      x.lineTo(X,Y)
      Z=3
      stroke(col,'',.2,true)
    }
    x.beginPath()
    x.lineTo(margin+ls,margin+ls)
    X = ls+margin+S(p=Math.PI*2/(sd+2)*-(curCar.speed*Math.PI)+opi)*(ls*.8)
    Y = ls+margin+C(p)*(ls*.8)
    x.lineTo(X,Y)
    stroke('#f04','',2,true)
    margin -=15
    x.beginPath()
    x.lineTo(margin/2,ls*2+margin*2)
    x.lineTo(margin/2+ls/1.5,ls*2+margin*2)
    x.lineTo(margin/2+ls/1.5,ls*2+margin*3)
    x.lineTo(margin/2,ls*2+margin*3)
    Z=3
    x.textAlign = 'center'
    stroke(col,'#4f82',.2,true)
    x.fillStyle = '#fff'
    x.font = (fs = 60) + 'px Courier Prime'
    x.fillText((Math.round(curCar.speed*15)),margin*1.75,margin*3+ls*2-fs/6)
    x.textAlign = 'right'
    x.fillText('MPH ',margin+ls*1.5,margin*3+ls*2-fs/5)
    x.lineJoin = x.lineCap = olc
  }

  // reverse warning
  if(!curCar.forward && ((t*60|0)%6<3)){
    x.textAlign = 'center'
    x.font = (fs = 60) + 'px Courier Prime'
    x.fillStyle = '#f00'
    x.fillText('>>> PERINGATAN BERBALIK <<<', c.width/2-100, +fs/1.1)
  }else{
    x.textAlign = 'left'
    x.font = (fs = 50) + 'px Courier Prime'
    x.fillStyle = '#0f8'
    let bval = curCar.powerups[0].val
    x.fillText(`NITRO ${bval-1} ` + ('>'.repeat(bval-1)), c.width/2-300, fs/1.5)
    x.strokeStyle = '#4f82'
    x.lineWidth = 10
    x.strokeRect(c.width/2-300, fs-10,400,30)
    if(bval>1){
      x.fillStyle = '#f08'
      x.fillRect(c.width/2-300, fs-10,400 * (curCar.powerups[0].timer-t)/curCar.powerups[0].duration,30)
    }
  }

  sliders.map(slider=>{
    drawSlider(slider)
  })

  t+=1/60
  requestAnimationFrame(Draw)
}
Draw()