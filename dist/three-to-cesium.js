var v = (r) => {
  throw TypeError(r);
};
var R = (r, e, t) => e.has(r) || v("Cannot " + t);
var c = (r, e, t) => (R(r, e, "read from private field"), t ? t.call(r) : e.get(r)), w = (r, e, t) => e.has(r) ? v("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), f = (r, e, t, i) => (R(r, e, "write to private field"), i ? i.call(r, t) : e.set(r, t), t), u = (r, e, t) => (R(r, e, "access private method"), t);
import * as h from "three";
import * as s from "cesium";
var n, l, m, V, g;
class T {
  constructor(e, t = {}) {
    w(this, m);
    w(this, n, {});
    w(this, l, !1);
    var i, a;
    this.cesiumViewer = e, f(this, n, {
      cameraNear: (i = t.cameraNear) != null ? i : 0.1,
      cameraFar: (a = t.cameraFar) != null ? a : 1e4
    }), u(this, m, V).call(this);
  }
  add(e, t) {
    let i = new h.Group();
    if (this.threeScene.add(i), i.add(e), t) {
      let a = s.Transforms.eastNorthUpToFixedFrame(t), o = this.convertColumnToRowMajor(a);
      i.applyMatrix4(new h.Matrix4().set(...o));
    }
    return i;
  }
  static localizePositions(e) {
    let t = s.Rectangle.fromCartesianArray(e), i = s.Rectangle.center(t), a = s.Cartographic.toCartesian(i), o = s.Transforms.eastNorthUpToFixedFrame(a), d = s.Matrix4.inverse(o, new s.Matrix4());
    return {
      positions: e.map((p) => {
        let x = s.Matrix4.multiplyByPoint(d, p, new s.Cartesian3());
        return new h.Vector3(x.x, x.y, x.z);
      }),
      centerInWorld: a
    };
  }
  convertColumnToRowMajor(e) {
    return [
      e[0],
      e[4],
      e[8],
      e[12],
      e[1],
      e[5],
      e[9],
      e[13],
      e[2],
      e[6],
      e[10],
      e[14],
      e[3],
      e[7],
      e[11],
      e[15]
    ];
  }
  remove(e) {
    this.threeScene.remove(e.parent), this.threeScene.remove(e);
  }
  update() {
    c(this, l) || (u(this, m, g).call(this), this.threeRenderer.render(this.threeScene, this.threeCamera));
  }
  destroy() {
    f(this, l, !0), this.threeRenderer.dispose(), this.cesiumViewer.container.removeChild(this.threeRenderer.domElement);
  }
}
n = new WeakMap(), l = new WeakMap(), m = new WeakSet(), V = function() {
  let e = this.cesiumViewer.container, t = e.offsetWidth, i = e.offsetHeight;
  this.threeScene = new h.Scene(), this.threeCamera = new h.PerspectiveCamera(void 0, t / i, c(this, n).cameraNear, c(this, n).cameraFar), this.threeRenderer = new h.WebGLRenderer({ alpha: !0 }), this.threeRenderer.setClearColor(0, 0), this.threeRenderer.domElement.style.position = "absolute", this.threeRenderer.domElement.style.top = "0", this.threeRenderer.domElement.style.width = "100%", this.threeRenderer.domElement.style.height = "100%", this.threeRenderer.domElement.style.pointerEvents = "none", e.appendChild(this.threeRenderer.domElement);
}, g = function() {
  this.threeCamera.matrixAutoUpdate = !1, this.threeCamera.fov = s.Math.toDegrees(this.cesiumViewer.camera.frustum.fovy);
  let e = this.cesiumViewer.camera.viewMatrix, t = this.cesiumViewer.camera.inverseViewMatrix, i = this.convertColumnToRowMajor(e), a = this.convertColumnToRowMajor(t);
  this.threeCamera.matrixWorld.set(...a), this.threeCamera.matrixWorldInverse.set(...i);
  let o = this.cesiumViewer.container, d = o.offsetWidth, C = o.offsetHeight, p = d / C;
  this.threeCamera.aspect = p, this.threeCamera.updateProjectionMatrix(), this.threeRenderer.setSize(d, C);
};
function E(...r) {
  return new T(...r);
}
E.localizePositions = T.localizePositions;
export {
  E as default
};
