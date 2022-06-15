# 3D Manipulator for ThreeJs
[![twitter](https://img.shields.io/badge/Twitter-profile-blue?style=flat-square&logo=twitter)](https://twitter.com/SketchpunkLabs)
[![npm](https://img.shields.io/badge/Github-donate-blue?style=flat-square&logo=github)](https://github.com/sponsors/sketchpunklabs)
[![youtube](https://img.shields.io/badge/Youtube-subscribe-red?style=flat-square&logo=youtube)](https://youtube.com/c/sketchpunklabs)
[![Patreon](https://img.shields.io/badge/Patreon-donate-red?style=flat-square&logo=youtube)](https://www.patreon.com/sketchpunk)
[![Ko-Fi](https://img.shields.io/badge/Ko_Fi-donate-orange?style=flat-square&logo=youtube)](https://ko-fi.com/sketchpunk)

<img src="https://c10.patreonusercontent.com/4/patreon-media/p/post/66941306/1b761d08be794bc7926a49dbcfce033f/eyJ3Ijo2MjB9/1.gif?token-time=1654819200&token-hash=hP0VfQMhyc7hSer_P4lweBqISVazEPIvZxjNXXSf2GI%3D">

https://www.npmjs.com/package/manipulator3d

### NPM Install ###
```
npm install manipulator3d
```

### Development Setup ###
```
git clone --depth=1 https://github.com/sketchpunklabs/manipulator3d
cd manipulator3d
npm install
npm run dev
```

## Usage ###
```javascript
import { Manipulator3D } from 'Manipulator3D';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const cube = facedCube( null, 0.5 );
cube.position.set( 0, 1, 0 );
scene.add( cube );

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const man = new Manipulator3D( scene, camera, renderer );

// Hook into events to disable camera controller when user does a drag action
man.on( 'dragstart', ()=>{ orbitControl.enabled = false; } );
man.on( 'dragend', ()=>{   orbitControl.enabled = true; } );

// Hook into events to see the changes happen
// man.on( 'translate', e=>console.log( 'Translate', e.detail ) );
// man.on( 'rotate', e=>console.log( 'Rotate( Quat )', e.detail ) );
// man.on( 'scale', e=>console.log( 'Scale', e.detail ) );

// Turn on gizmo
man.setActive( true );

// Attach object to manipulate
man.attach( cube );
```