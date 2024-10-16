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
        R2=(Rl,Pt,Yw,m)=>{
          M=Math
          A=M.atan2
          H=M.hypot
          X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
          Y=C(p)*d
          Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
          Z=C(p)*d
          X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
          Z=C(p)*d
          if(m)X+=oX,Y+=oY,Z+=oZ
        }
        R=(Rl,Pt,Yw,m)=>{
          M=Math
          A=M.atan2
          H=M.hypot
          X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
          Y=C(p)*d
          X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
          Z=C(p)*d
          Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
          Z=C(p)*d
          if(m)X+=oX,Y+=oY,Z+=oZ
        }
        Q=()=>[c.width/2+X/Z*900,c.height/2+Y/Z*900]

        iBv=.1,iBlen=90,iBrad=.23,iBseglen=12
        sd=10,trainv=24,trainpv=4,G=0
        B=[[0,0,0,Rn()-.5,Rn()-.5,Rn()-.5]]
        pushSeg=()=>{
          l=B.length-1
          X=B[l][0]
          Y=B[l][1]
          Z=B[l][2]
          tx=vx=B[l][3]
          ty=vy=B[l][4]/1.12
          tz=vz=B[l][5]
          d=Math.hypot(vx,vy,vz)
          vx/=d
          vy/=d
          vz/=d
          dx=Rn()-.5
          dy=Rn()-.5
          dz=Rn()-.5
          d=Math.hypot(dx,dy,dz)
          dx/=d
          dy/=d
          dz/=d
          nx=(vx+dx*iBrad)/2
          ny=(vy+dy*iBrad)/2
          nz=(vz+dz*iBrad)/2
          d=Math.hypot(nx,ny,nz)
          vx=nx/d*iBv
          vy=ny/d*iBv
          vz=nz/d*iBv
          B=[...B, [X+vx*iBseglen,Y+vy*iBseglen,Z+vz*iBseglen,vx,vy,vz]]
          while(B.length>iBlen)G++,B.shift()
        }
        for(i=iBlen;i--;){
          pushSeg()
        }

        Stroke=h=>{
          x.strokeStyle=`hsla(${h*2-t*600},99%,${200+S(t)*175}%,.1)`
          x.lineWidth=Math.min(500,700/((4+Z**1.05)**1))
          x.stroke()
          x.lineWidth/=5
          x.strokeStyle=`hsla(0,99%,100%,${.35+S(t*3)*.2})`
          x.stroke()
        }

        iSTG=4e3,iSTc=3e3
        ST=Array(iSTc).fill().map(v=>{
          X=(Rn()-.5)*iSTG
          Y=(Rn()-.5)*iSTG
          Z=(Rn()-.5)*iSTG
          return [X,Y,Z]
        })
        Rl=0,Pt=0,Yw=0
        tRl=0,tPt=0,tYw=0
        oX=0,oY=0,oZ=0
        mX=0,mY=0,mZ=0
      }

      x.fillStyle='#000f'
      x.fillRect(0,0,c.width,c.height)
      x.lineJoin=x.lineCap='butt'


      ST.map(v=>{
        X=0
        Y=0
        Z=-20
        R(Rl,0,-Yw,0)
        X=v[0]+=X
        Y=v[1]+=Y
        Z=v[2]+=Z
        if(X<-iSTG/2)v[0]=iSTG/2
        if(X>iSTG/2)v[0]=-iSTG/2
        if(Y<-iSTG/2)v[1]=iSTG/2
        if(Y>iSTG/2)v[1]=-iSTG/2
        if(Z<-iSTG/2)v[2]=iSTG/2
        if(Z>iSTG/2)v[2]=-iSTG/2
        R(Rl,Pt,Yw,1)
        if(Z>0){
          x.globalAlpha=Math.min(1,(Z/900)**2)
          s=Math.min(500, 8e4/(Z**1.1))
          l=Q()
          x.fillStyle='#fff2'
          x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
          x.fillStyle='#fff'
          s/=4
          x.fillRect(l[0]-s/2,l[1]-s/2,s,s)
        }
      })
      x.globalAlpha=1

      if(!((t*60|0)%2)){
        pushSeg()
      }

      while(Math.abs(tPt-Pt)>Math.PI){
        if(tPt<Pt){
          tPt+=Math.PI*2
        } else {
          tPt-=Math.PI*2          
        }
      }
      while(Math.abs(tYw-Yw)>Math.PI){
        if(tYw<Yw){
          tYw+=Math.PI*2
        } else {
          tYw-=Math.PI*2          
        }
      }
      Rl=0
      Pt=Pt+(tPt-Pt)/trainv
      Yw=Yw+(tYw-Yw)/trainv
      mX=mX+(B[2][0]-mX)/trainpv
      mY=mY+(B[2][1]-mY)/trainpv
      mZ=mZ+(B[2][2]-mZ)/trainpv

      a=[]
      B.map((v,i)=>{
        if(i){
          X1=X=B[i-1][0]-mX
          Y1=Y=B[i-1][1]-mY
          Z1=Z=B[i-1][2]-mZ
          X2=X=v[0]-mX
          Y2=Y=v[1]-mY
          Z2=Z=v[2]-mZ

          x.beginPath()
          p1=Math.atan2(X2-X1,Z2-Z1)
          p2=Math.PI/2-Math.acos((Y2-Y1)/Math.hypot(X2-X1,Y2-Y1,Z2-Z1))
          if(i==10) tPt=-p2,tYw=-p1
          cull=0
          ls=1.1+(6+S(-t+C(t/1.5)*10+Math.PI*2*1/B.length*(i+G))*5)**20/1e20
          for(j=sd;j--;){
            X=S(p=Math.PI*2/sd*j)*ls
            Y=C(p)*ls
            Z=0
            R2(0,p2,p1,0)
            ax=X+=X2
            ay=Y+=Y2
            az=Z+=Z2
            R(Rl,Pt,Yw,1)
            if(Z>0){
              x.lineTo(...Q())
            } else {
              cull=1
            }
            a=[...a,[ax,ay,az,i]]
          }
          x.closePath()
          if(!cull)Stroke(i)
        }
      })

      a.map((q,j)=>{
        if(j>=sd){
          x.beginPath()
          X=a[j-sd][0]
          Y=a[j-sd][1]
          Z=a[j-sd][2]
          R(Rl,Pt,Yw,1)
          if(Z>0)x.lineTo(...Q())
          X=q[0]
          Y=q[1]
          Z=q[2]
          R(Rl,Pt,Yw,1)
          if(Z>0)x.lineTo(...Q())
          Stroke(q[3])
        }
      })

      t+=1/60
      requestAnimationFrame(Draw)
    }
    Draw()