import * as THREE from "three";
import * as Cesium from "cesium";
class _ThreeToCesium {
  #options = {};
  #isDestroyed = false;
  constructor(cesiumViewer, options = {}) {
    this.cesiumViewer = cesiumViewer;
    this.#options = {
      cameraNear: options.cameraNear ?? 0.1,
      cameraFar: options.cameraFar ?? 10000,
    };
    this.#attachRendererDomToCesium();
  }
  #attachRendererDomToCesium() {
    let cesiumContainer = this.cesiumViewer.container;
    let width = cesiumContainer.offsetWidth;
    let height = cesiumContainer.offsetHeight;
    this.threeScene = new THREE.Scene();
    this.threeCamera = new THREE.PerspectiveCamera(undefined, width / height, this.#options.cameraNear, this.#options.cameraFar);
    this.threeRenderer = new THREE.WebGLRenderer({ alpha: true });
    this.threeRenderer.setClearColor(0x000000, 0);
    this.threeRenderer.domElement.style.position = "absolute";
    this.threeRenderer.domElement.style.top = "0";
    this.threeRenderer.domElement.style.width = "100%";
    this.threeRenderer.domElement.style.height = "100%";
    this.threeRenderer.domElement.style.pointerEvents = "none";
    cesiumContainer.appendChild(this.threeRenderer.domElement);
  }
  #syncCamera() {
    this.threeCamera.matrixAutoUpdate = false;
    this.threeCamera.fov = Cesium.Math.toDegrees(this.cesiumViewer.camera.frustum.fovy)
    let cameraViewMatrix = this.cesiumViewer.camera.viewMatrix;
    let cameraViewMatrixInver = this.cesiumViewer.camera.inverseViewMatrix;
    let cameraViewMatrixRowMajor = this.convertColumnToRowMajor(cameraViewMatrix);
    let cameraViewMatrixInverRowMajor = this.convertColumnToRowMajor(cameraViewMatrixInver);
    this.threeCamera.matrixWorld.set(...cameraViewMatrixInverRowMajor);
    this.threeCamera.matrixWorldInverse.set(...cameraViewMatrixRowMajor);
    let cesiumContainer = this.cesiumViewer.container;
    let width = cesiumContainer.offsetWidth;
    let height = cesiumContainer.offsetHeight;
    let aspect = width / height;
    this.threeCamera.aspect = aspect;
    this.threeCamera.updateProjectionMatrix();
    this.threeRenderer.setSize(width, height);

  }
  add(object, cartesian3) {
    let group = new THREE.Group();
    this.threeScene.add(group);
    group.add(object);
    if (cartesian3) {
      let matrixLocalToWorld = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian3);
      let matrixLocalToWorldRowMajor = this.convertColumnToRowMajor(matrixLocalToWorld);
      group.applyMatrix4(new THREE.Matrix4().set(...matrixLocalToWorldRowMajor));
    }
    return group;
  }
  static localizePositions(positions) {
    let rectangle = Cesium.Rectangle.fromCartesianArray(positions);
    let center = Cesium.Rectangle.center(rectangle);
    let centerCartesian3 = Cesium.Cartographic.toCartesian(center);
    let matrixLocalToWorld = Cesium.Transforms.eastNorthUpToFixedFrame(centerCartesian3);
    let matrixLocalToWorldInverse = Cesium.Matrix4.inverse(matrixLocalToWorld, new Cesium.Matrix4());
    let positionsInLocal = positions.map(item => {
      let local = Cesium.Matrix4.multiplyByPoint(matrixLocalToWorldInverse, item, new Cesium.Cartesian3());
      return new THREE.Vector3(local.x, local.y, local.z)
    });
    return {
      positions: positionsInLocal,
      centerInWorld: centerCartesian3,
    }
  }
  convertColumnToRowMajor(columnMajorArray) {
    let rowMajorArray = [
      columnMajorArray[0], columnMajorArray[4], columnMajorArray[8], columnMajorArray[12],
      columnMajorArray[1], columnMajorArray[5], columnMajorArray[9], columnMajorArray[13],
      columnMajorArray[2], columnMajorArray[6], columnMajorArray[10], columnMajorArray[14],
      columnMajorArray[3], columnMajorArray[7], columnMajorArray[11], columnMajorArray[15],
    ];
    return rowMajorArray;
  }
  remove(object) {
    this.threeScene.remove(object.parent);
    this.threeScene.remove(object);
  }
  update() {
    if (this.#isDestroyed) return;
    this.#syncCamera();
    this.threeRenderer.render(this.threeScene, this.threeCamera);
  }
  destroy() {
    this.#isDestroyed = true;
    this.threeRenderer.dispose();
    this.cesiumViewer.container.removeChild(this.threeRenderer.domElement);
  }
}
function ThreeToCesium(...params) {
  return new _ThreeToCesium(...params);
}
ThreeToCesium.localizePositions = _ThreeToCesium.localizePositions;
export default ThreeToCesium