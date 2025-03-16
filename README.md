# three-to-cesium
- - -
**language:** [English](README.md) / [简体中文](README.zh-CN.md)
- - -
A plugin that enables Cesium and Three.js to run in synchronization.
---
![](./example/assets/code3.gif)
## 🎨Live Demo
<https://weijun-lab.github.io/three-to-cesium/>
## Installation
* `npm install three-to-cesium`
* Or download the repository
## Usage
### ESM(ECMAScript Modules)
```js
import ThreeToCesium from "three-to-cesium";
```
### UMD(Universal Module Definition)
```html
<script src="three-to-cesium/dist/three-to-cesium.umd.cjs"></script>
```
### Warning
This plugin relies on the Cesium and Three.js libraries to achieve its full functionality. When using UMD, please ensure that the Cesium and Three.js libraries have already been loaded.
```html
<script src="path/to/three.js"></script>
<script src="path/to/Cesium.js"></script>
<script src="three-to-cesium/dist/three-to-cesium.umd.cjs"></script>
```
If you are using a build tool for module import, please ensure that Cesium and Three.js are installed in your project environment.
```bash
npm install three cesium
```
```js
import ThreeToCesium from "three-to-cesium";
```
---
## Code Example
### Example1
```js
let cesiumViewer = new Cesium.Viewer('map', {
  sceneModePicker: false,
});
let sceneIntegrator = ThreeToCesium(cesiumViewer);
let position = Cesium.Cartesian3.fromDegrees(108.95943284886424, 34.288286155753546, 5);
let mesh = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshNormalMaterial()
);
sceneIntegrator.add(mesh,position)
cesiumViewer.scene.postRender.addEventListener(() => {
  sceneIntegrator.update();
});
```
![](./example/assets/code1.png)


### Example2
```js
let cesiumViewer = new Cesium.Viewer('map', {
    sceneModePicker: false,
});
let localPositions = ThreeToCesium.localizePositions([
  Cesium.Cartesian3.fromDegrees(108.95993690885348, 34.28688948263291, 0),
  Cesium.Cartesian3.fromDegrees(108.95836123161854, 34.28461622000204, 0),
  Cesium.Cartesian3.fromDegrees(108.96052860333033, 34.28463093923793, 0),
  Cesium.Cartesian3.fromDegrees(108.95894270765785, 34.286895032131916, 0),
]);
let sceneIntegrator = ThreeToCesium(cesiumViewer);
let geometry = new THREE.BufferGeometry().setFromPoints(localPositions.positions);
let material = new THREE.LineBasicMaterial({
  color: 0xff0000,
});
let line = new THREE.Line(geometry, material);
sceneIntegrator.add(line, localPositions.centerInWorld);
cesiumViewer.scene.postRender.addEventListener(() => {
  sceneIntegrator.update();
});
```
![](./example/assets/code2.png)
### Example3
```js
let cesiumViewer = new Cesium.Viewer('map', {
    sceneModePicker: false,
});
let sceneIntegrator = ThreeToCesium(cesiumViewer);
let position = Cesium.Cartesian3.fromDegrees(108.95943284886424, 34.288286155753546, 0.1);
let group = new THREE.Group();
sceneIntegrator.add(group, position);

let spotLight = new THREE.SpotLight(0xffffff, 7000);
spotLight.position.set(-10, 60, -10);
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
spotLight.shadow.camera.far = 130;
spotLight.shadow.camera.near = 40;
spotLight.shadow.mapSize = new THREE.Vector2(3000, 3000)
group.add(spotLight);
let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
group.add(ambientLight);

let planeGeometry = new THREE.PlaneGeometry(60, 30);
let planeMaterial = new THREE.MeshLambertMaterial({
    color: "#eee"
});
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.y = 0;
plane.position.z = 0;
group.add(plane);

let sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
let sphereMaterial = new THREE.MeshLambertMaterial({
    color: "blue",
});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
group.add(sphere);

sceneIntegrator.threeRenderer.shadowMap.enabled = true;
spotLight.castShadow = true;
plane.receiveShadow = true;
sphere.castShadow = true;

let step = 0;
let clock = new THREE.Clock();
cesiumViewer.scene.postRender.addEventListener(() => {
    let delta = clock.getDelta();
    step += delta * 3;
    sphere.position.x = 10 * Math.cos(step);
    sphere.position.y = 5 + 10 * Math.abs(Math.sin(step));
    sceneIntegrator.update();
});
```
![](./example/assets/code3.gif)
## Params
```js
ThreeToCesium(cesiumViewer,options);
```
| Params | Type | Description |
| --- | --- | --- |
| **cesiumViewer** | Cesium.Viewer | - |
| **options** | Object | - |
### Options
| Options | Type | Default | Description |
| --- | --- | --- | --- |
| **cameraFar** | Number | 10000 | The far plane of the Three.js camera frustum. |
| **cameraNear** | Number | 0.1 | The near plane of the Three.js camera frustum. |

## Methods
| Methods | Return | Description |
| --- | --- | --- |
| add(`<THREE.Object3D>` object, `<Cesium.Cartesian3>` position) | THREE.Group | Add a Three.js 3D object to a specified location on the Earth. |
| remove(`<THREE.Object3D>` object) | - | Remove the specified Three.js 3D object. |
| update() | - | Synchronize the Three.js and Cesium cameras, and execute THREE.WebGLRenderer.render(). |
| destroy() | - | Destroy the Three.js scene. |
| **static** localizePositions(`Array.<Cesium.Cartesian3>` array) | {positions,centerInWorld} | Translate the incoming global Cartesian3 coordinates to local coordinates with the center point as the origin. The returned object has a `positions` property containing the array of local coordinates and a `centerInWorld` property representing the origin of the local coordinate system. see [Example2](#example2). |
## Properties
| Properties | Type | Description |
| --- | --- | --- |
|**cesiumViewer**| Cesium.Viewer | - |
|**threeCamera**| THREE.PerspectiveCamera | - |
|**threeRenderer**| THREE.WebGLRenderer | - |
|**threeScene**| THREE.Scene | - |