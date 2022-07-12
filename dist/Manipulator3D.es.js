var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { Group, MeshBasicMaterial, DoubleSide, LineBasicMaterial, BufferGeometry, Float32BufferAttribute, SphereGeometry, TorusGeometry, CylinderGeometry, Mesh, Line, Raycaster, Vector3, Quaternion } from "three";
function vec3_copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function vec3_add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function vec3_sub(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function vec3_cross(out, a, b) {
  const ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function vec3_dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function vec3_scaleAndAdd(out, add, v, s) {
  out[0] = v[0] * s + add[0];
  out[1] = v[1] * s + add[1];
  out[2] = v[2] * s + add[2];
  return out;
}
function vec3_scale(out, a, s) {
  out[0] = a[0] * s;
  out[1] = a[1] * s;
  out[2] = a[2] * s;
  return out;
}
function vec3_norm(out, a) {
  let mag = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
  if (mag != 0) {
    mag = 1 / mag;
    out[0] = a[0] * mag;
    out[1] = a[1] * mag;
    out[2] = a[2] * mag;
  }
  return out;
}
function vec3_transformQuat(out, v, q) {
  const qx = q[0], qy = q[1], qz = q[2], qw = q[3], vx = v[0], vy = v[1], vz = v[2], x1 = qy * vz - qz * vy, y1 = qz * vx - qx * vz, z1 = qx * vy - qy * vx, x2 = qw * x1 + qy * z1 - qz * y1, y2 = qw * y1 + qz * x1 - qx * z1, z2 = qw * z1 + qx * y1 - qy * x1;
  out[0] = vx + 2 * x2;
  out[1] = vy + 2 * y2;
  out[2] = vz + 2 * z2;
  return out;
}
function vec3_sqrLen(a, b) {
  if (b === void 0)
    return a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}
function vec3_len(a, b) {
  if (b === void 0)
    return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}
function vec3_mul(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function vec3_lerp(out, a, b, t) {
  const ti = 1 - t;
  out[0] = a[0] * ti + b[0] * t;
  out[1] = a[1] * ti + b[1] * t;
  out[2] = a[2] * ti + b[2] * t;
  return out;
}
function quat_copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function quat_mul(out, a, b) {
  const ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function quat_normalize(out, q) {
  let len = q[0] ** 2 + q[1] ** 2 + q[2] ** 2 + q[3] ** 2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = q[0] * len;
    out[1] = q[1] * len;
    out[2] = q[2] * len;
    out[3] = q[3] * len;
  }
  return out;
}
function quat_setAxisAngle(out, axis, rad) {
  const half = rad * 0.5, s = Math.sin(half);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(half);
  return out;
}
function quat_sqrLen(a, b) {
  if (b === void 0)
    return a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + a[3] ** 2;
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 + (a[3] - b[3]) ** 2;
}
class Ray {
  constructor() {
    __publicField(this, "posStart", [0, 0, 0]);
    __publicField(this, "posEnd", [0, 0, 0]);
    __publicField(this, "direction", [0, 0, 0]);
    __publicField(this, "vecLength", [0, 0, 0]);
  }
  posAt(t, out) {
    out = out || [0, 0, 0];
    out[0] = this.vecLength[0] * t + this.posStart[0];
    out[1] = this.vecLength[1] * t + this.posStart[1];
    out[2] = this.vecLength[2] * t + this.posStart[2];
    return out;
  }
  directionAt(len, out) {
    out = out || [0, 0, 0];
    out[0] = this.direction[0] * len + this.posStart[0];
    out[1] = this.direction[1] * len + this.posStart[1];
    out[2] = this.direction[2] * len + this.posStart[2];
    return out;
  }
  fromCaster(caster) {
    vec3_copy(this.posStart, caster.ray.origin.toArray());
    vec3_copy(this.direction, caster.ray.direction.toArray());
    const len = caster.far == Infinity ? 1e3 : caster.far;
    vec3_scale(this.vecLength, this.direction, len);
    vec3_add(this.posEnd, this.posStart, this.vecLength);
  }
}
function intersectSphere(ray, origin, radius) {
  const radiusSq = radius * radius;
  const rayToCenter = vec3_sub([0, 0, 0], origin, ray.posStart);
  const tProj = vec3_dot(rayToCenter, ray.direction);
  const oppLenSq = vec3_sqrLen(rayToCenter) - tProj * tProj;
  return !(oppLenSq > radiusSq);
}
function intersectPlane(ray, planePos, planeNorm) {
  const denom = vec3_dot(ray.vecLength, planeNorm);
  if (denom <= 1e-6 && denom >= -1e-6)
    return null;
  const t = vec3_dot(vec3_sub([0, 0, 0], planePos, ray.posStart), planeNorm) / denom;
  return t >= 0 ? t : null;
}
function intersectTri(ray, v0, v1, v2, out, cullFace = true) {
  const v0v1 = vec3_sub([0, 0, 0], v1, v0);
  const v0v2 = vec3_sub([0, 0, 0], v2, v0);
  const pvec = vec3_cross([0, 0, 0], ray.direction, v0v2);
  const det = vec3_dot(v0v1, pvec);
  if (cullFace && det < 1e-6)
    return false;
  const idet = 1 / det;
  const tvec = vec3_sub([0, 0, 0], ray.posStart, v0);
  const u = vec3_dot(tvec, pvec) * idet;
  if (u < 0 || u > 1)
    return false;
  const qvec = vec3_cross([0, 0, 0], tvec, v0v1);
  const v = vec3_dot(ray.direction, qvec) * idet;
  if (v < 0 || u + v > 1)
    return false;
  if (out) {
    const len = vec3_dot(v0v2, qvec) * idet;
    ray.directionAt(len, out);
  }
  return true;
}
function nearPoint(ray, p, distLimit = 0.1) {
  const v = vec3_sub([0, 0, 0], p, ray.posStart);
  vec3_mul(v, v, ray.vecLength);
  const t = (v[0] + v[1] + v[2]) / vec3_sqrLen(ray.vecLength);
  if (t < 0 || t > 1)
    return null;
  const lenSqr = vec3_sqrLen(ray.posAt(t, v), p);
  return lenSqr <= distLimit * distLimit ? t : null;
}
class NearSegmentResult {
  constructor() {
    __publicField(this, "segPosition", [0, 0, 0]);
    __publicField(this, "rayPosition", [0, 0, 0]);
    __publicField(this, "distanceSq", 0);
    __publicField(this, "distance", 0);
  }
}
function nearSegment(ray, p0, p1, results = null) {
  const u = vec3_sub([0, 0, 0], p1, p0), v = ray.vecLength, w = vec3_sub([0, 0, 0], p0, ray.posStart), a = vec3_dot(u, u), b = vec3_dot(u, v), c = vec3_dot(v, v), d = vec3_dot(u, w), e = vec3_dot(v, w), D = a * c - b * b;
  let tU = 0, tV = 0;
  if (D < 1e-6) {
    tU = 0;
    tV = b > c ? d / b : e / c;
  } else {
    tU = (b * e - c * d) / D;
    tV = (a * e - b * d) / D;
  }
  if (tU < 0 || tU > 1 || tV < 0 || tV > 1)
    return false;
  if (results) {
    vec3_lerp(results.rayPosition, ray.posStart, ray.posEnd, tV);
    vec3_lerp(results.segPosition, p0, p1, tU);
    results.distance = vec3_len(results.segPosition, results.rayPosition);
  }
  return true;
}
const ManipulatorMode = Object.freeze({
  Translate: 0,
  Rotate: 1,
  Scale: 2
});
class ManipulatorData {
  constructor() {
    __publicField(this, "scaleFactor", 10);
    __publicField(this, "minFlipAdjust", -0.02);
    __publicField(this, "minHitDistance", 0.1);
    __publicField(this, "minPntDistance", 0.1);
    __publicField(this, "minArcDistance", 0.1);
    __publicField(this, "lastCamPos", [0, 0, 0]);
    __publicField(this, "lastCamRot", [0, 0, 0, 1]);
    __publicField(this, "hasHit", false);
    __publicField(this, "hasUpdated", true);
    __publicField(this, "isDragging", false);
    __publicField(this, "isActive", false);
    __publicField(this, "intersectPos", [0, 0, 0]);
    __publicField(this, "position", [0, 0, 0]);
    __publicField(this, "scale", [1, 1, 1]);
    __publicField(this, "infoScale", 1);
    __publicField(this, "arcRadius", 1.5);
    __publicField(this, "axisLen", 1.5);
    __publicField(this, "midPointLen", 0.55);
    __publicField(this, "sclPointLen", 1.8);
    __publicField(this, "useTranslate", true);
    __publicField(this, "useScale", true);
    __publicField(this, "useRotate", true);
    __publicField(this, "axes", [
      { dir: [1, 0, 0], endPos: [1, 0, 0], midPos: [0, 0, 0], sclPos: [0, 0, 0] },
      { dir: [0, 1, 0], endPos: [0, 1, 0], midPos: [0, 0, 0], sclPos: [0, 0, 0] },
      { dir: [0, 0, 1], endPos: [0, 0, 1], midPos: [0, 0, 0], sclPos: [0, 0, 0] }
    ]);
    __publicField(this, "traceStep", 0.1);
    __publicField(this, "traceLine", {
      isActive: false,
      hitPos: [0, 0, 0],
      origin: [0, 0, 0],
      a: [0, 0, 0],
      b: [0, 0, 0],
      dir: [0, 0, 0]
    });
    __publicField(this, "activeMode", ManipulatorMode.Translate);
    __publicField(this, "activeAxis", -1);
    __publicField(this, "activePlane", -1);
    __publicField(this, "onDragStart", null);
    __publicField(this, "onDragEnd", null);
    __publicField(this, "onTranslate", null);
    __publicField(this, "onRotate", null);
    __publicField(this, "onScale", null);
  }
  setPosition(x, y, z) {
    if (x.length === 3) {
      this.position[0] = x[0];
      this.position[1] = x[1];
      this.position[2] = x[2];
    } else {
      this.position[0] = x;
      this.position[1] = y;
      this.position[2] = z;
    }
    this.hasUpdated = true;
    return this;
  }
  updateFromCamera(camPos, camRot, forceUpdate = false) {
    if ((this.isDragging || Math.abs(vec3_sqrLen(camPos, this.lastCamPos)) <= 1e-6 && Math.abs(quat_sqrLen(camRot, this.lastCamRot)) <= 1e-6) && !forceUpdate)
      return this;
    vec3_copy(this.lastCamPos, camPos);
    quat_copy(this.lastCamRot, camRot);
    this._calcCameraScale();
    return this;
  }
  resetState() {
    this.traceLine.isActive = false;
    this.activeMode = ManipulatorMode.Translate;
    this.activeAxis = -1;
    this.activePlane = -1;
  }
  startDrag() {
    this.isDragging = true;
    if (this.onDragStart)
      this.onDragStart();
  }
  stopDrag() {
    this.isDragging = false;
    if (this.onDragEnd)
      this.onDragEnd();
  }
  _movePlane(ray, i) {
    const norm = this.axes[i].dir;
    const t = intersectPlane(ray, this.position, norm);
    if (t != null) {
      ray.posAt(t, this.position);
      this.calcAxesPosition();
      if (this.onTranslate)
        this.onTranslate(this.position.slice(0));
      return true;
    }
    return false;
  }
  _moveTrace(ray) {
    const segResult = new NearSegmentResult();
    if (nearSegment(ray, this.traceLine.a, this.traceLine.b, segResult)) {
      vec3_copy(this.traceLine.hitPos, segResult.segPosition);
      switch (this.activeMode) {
        case ManipulatorMode.Translate:
          vec3_copy(this.position, segResult.segPosition);
          this.calcAxesPosition();
          if (this.onTranslate)
            this.onTranslate(segResult.segPosition.slice(0));
          break;
        case ManipulatorMode.Rotate:
        case ManipulatorMode.Scale:
          const dir = vec3_sub([0, 0, 0], segResult.segPosition, this.traceLine.origin);
          const dist = vec3_len(dir);
          const sign = Math.sign(vec3_dot(dir, this.traceLine.dir));
          const step = dist / this.traceStep * sign;
          if (this.onRotate && this.activeMode === ManipulatorMode.Rotate) {
            this.onRotate(step, this.activeAxis);
          }
          if (this.onScale && this.activeMode === ManipulatorMode.Scale) {
            this.onScale(step, this.activeAxis >= 0 ? this.activeAxis : null);
          }
          break;
      }
      return true;
    }
    return false;
  }
  onRayDown(ray) {
    if (this.isActive && this._rayIntersect(ray)) {
      this.startDrag();
      return true;
    }
    return false;
  }
  onRayHover(ray) {
    return this.isActive && !this.isDragging ? this._rayIntersect(ray) : false;
  }
  onRayMove(ray) {
    if (this.isActive && !this.isDragging)
      return false;
    if (this.activeAxis != -1) {
      this._moveTrace(ray);
    } else if (this.activePlane != -1) {
      return this._movePlane(ray, this.activePlane);
    }
    return false;
  }
  _setTraceLine(pos, axis = -1) {
    this.traceLine.isActive = true;
    vec3_copy(this.traceLine.origin, pos);
    vec3_copy(this.traceLine.hitPos, pos);
    if (axis == -1) {
      vec3_transformQuat(this.traceLine.dir, [1, 0, 0], this.lastCamRot);
    } else {
      vec3_copy(this.traceLine.dir, this.axes[axis].dir);
    }
    vec3_scaleAndAdd(this.traceLine.a, pos, this.traceLine.dir, -1e3);
    vec3_scaleAndAdd(this.traceLine.b, pos, this.traceLine.dir, 1e3);
  }
  _calcCameraScale() {
    const eyeDir = vec3_sub([0, 0, 0], this.lastCamPos, this.position);
    const eyeLen = vec3_len(eyeDir);
    this.infoScale = eyeLen / this.scaleFactor;
    vec3_norm(eyeDir, eyeDir);
    vec3_scale(this.scale, [1, 1, 1], this.infoScale);
    if (vec3_dot(eyeDir, [1, 0, 0]) < this.minFlipAdjust)
      this.scale[0] = -this.scale[0];
    if (vec3_dot(eyeDir, [0, 1, 0]) < this.minFlipAdjust)
      this.scale[1] = -this.scale[1];
    if (vec3_dot(eyeDir, [0, 0, 1]) < this.minFlipAdjust)
      this.scale[2] = -this.scale[2];
    this.calcAxesPosition();
  }
  calcAxesPosition() {
    const a = this.axes;
    for (let i = 0; i < 3; i++) {
      vec3_scaleAndAdd(a[i].endPos, this.position, a[i].dir, this.scale[i] * this.axisLen);
      vec3_scaleAndAdd(a[i].midPos, this.position, a[i].dir, this.scale[i] * this.midPointLen);
      vec3_scaleAndAdd(a[i].sclPos, this.position, a[i].dir, this.scale[i] * this.sclPointLen);
    }
    this.hasUpdated = true;
  }
  _rayIntersect(ray) {
    if (!this._testSphere(ray)) {
      return false;
    }
    const lastAxis = this.activeAxis;
    this.resetState();
    let hit = this.useScale && this._testPoints(ray);
    hit = hit || this.useTranslate && this._testPlanes(ray);
    hit = hit || this.useTranslate && this._testAxis(ray);
    hit = hit || this.useRotate && this._testArc(ray);
    if (lastAxis !== this.activeAxis) {
      this.hasUpdated = true;
    }
    this.hasHit = hit;
    return hit;
  }
  _testSphere(ray) {
    return intersectSphere(ray, this.position, (this.sclPointLen + this.minPntDistance) * this.infoScale);
  }
  _testPlanes(ray) {
    const a = this.axes;
    let i, ii;
    for (i = 0; i < 3; i++) {
      ii = (i + 1) % 3;
      if (intersectTri(ray, a[i].midPos, a[ii].midPos, this.position, this.intersectPos, false)) {
        this.activePlane = (i + 2) % 3;
        return true;
      }
    }
    return false;
  }
  _testArc(ray) {
    const minDistance = this.infoScale * this.minArcDistance;
    const a = this.axes;
    const hitPos = [0, 0, 0];
    const hitDir = [0, 0, 0];
    const axis = [0, 0, 0];
    const radius = this.arcRadius * this.infoScale;
    let t, dist;
    let i, ii, iii;
    for (i = 0; i < 3; i++) {
      t = intersectPlane(ray, this.position, a[i].dir);
      if (t === null)
        continue;
      ray.posAt(t, hitPos);
      dist = vec3_len(this.position, hitPos);
      if (Math.abs(dist - radius) <= minDistance) {
        ii = (i + 1) % 3;
        vec3_sub(hitDir, hitPos, this.position);
        vec3_scale(axis, a[ii].dir, Math.sign(this.scale[ii]));
        if (vec3_dot(hitDir, axis) >= 0) {
          iii = (i + 2) % 3;
          vec3_scale(axis, a[iii].dir, Math.sign(this.scale[iii]));
          if (vec3_dot(hitDir, axis) >= 0) {
            this.activeAxis = i;
            this.activeMode = ManipulatorMode.Rotate;
            this._setTraceLine(hitPos);
            vec3_copy(this.intersectPos, hitPos);
            return true;
          }
        }
      }
    }
    return false;
  }
  _testAxis(ray) {
    const minDistance = this.infoScale * this.minHitDistance;
    const segResult = new NearSegmentResult();
    const pos = [0, 0, 0];
    let min = Infinity;
    let axis = -1;
    let ax;
    for (let i = 0; i < 3; i++) {
      ax = this.axes[i];
      if (nearSegment(ray, this.position, ax.endPos, segResult)) {
        if (segResult.distance <= minDistance && segResult.distance < min) {
          min = segResult.distance;
          axis = i;
          vec3_copy(pos, segResult.segPosition);
        }
      }
    }
    if (axis !== -1) {
      this.activeAxis = axis;
      this._setTraceLine(pos, axis);
      vec3_copy(this.intersectPos, pos);
      return true;
    }
    return false;
  }
  _testPoints(ray) {
    const minDistance = this.infoScale * this.minPntDistance;
    let t = nearPoint(ray, this.position, minDistance);
    if (t !== null) {
      this._setTraceLine(this.position);
      this.activeMode = ManipulatorMode.Scale;
      this.activeAxis = -2;
      return true;
    }
    for (let i = 0; i < 3; i++) {
      t = nearPoint(ray, this.axes[i].sclPos, minDistance);
      if (t !== null) {
        this._setTraceLine(this.axes[i].sclPos, i);
        this.activeAxis = i;
        this.activeMode = ManipulatorMode.Scale;
        vec3_copy(this.intersectPos, this.axes[i].sclPos);
        return true;
      }
    }
    return false;
  }
}
class ManipulatorMesh extends Group {
  constructor(data) {
    super();
    __publicField(this, "axisColors", [8509299, 7186922, 16216426]);
    __publicField(this, "axisLines", []);
    __publicField(this, "axisArcs", []);
    __publicField(this, "axisPoints", []);
    __publicField(this, "axisTris", []);
    __publicField(this, "grpCtrl", new Group());
    __publicField(this, "meshTracePnt", null);
    __publicField(this, "meshTraceLine", null);
    __publicField(this, "colSelect", 16777215);
    __publicField(this, "colOrigin", 16776960);
    const PIH = Math.PI * 0.5;
    const lineRadius = 0.03;
    const arcRadius = data.arcRadius;
    const arcThickness = 0.03;
    const sclDistance = data.sclPointLen;
    this.visible = false;
    const matBasic = new MeshBasicMaterial({
      depthTest: false,
      depthWrite: false,
      fog: false,
      toneMapped: false,
      transparent: true,
      side: DoubleSide,
      opacity: 1,
      color: 16777215
    });
    const matLine = new LineBasicMaterial({
      depthTest: false,
      depthWrite: false,
      fog: false,
      toneMapped: false,
      transparent: true,
      color: 9474192
    });
    const geoTrace = new BufferGeometry();
    geoTrace.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 0, 100, 0], 3));
    const geoTri = new BufferGeometry();
    geoTri.setAttribute("position", new Float32BufferAttribute([0, 0, 0, data.midPointLen, 0, 0, 0, data.midPointLen, 0], 3));
    const geoSphere = new SphereGeometry(0.1, 8, 8);
    const geoArc = new TorusGeometry(arcRadius, arcThickness, 3, 10, PIH);
    const geoAxisLine = new CylinderGeometry(lineRadius, lineRadius, data.axisLen, 3);
    geoAxisLine.translate(0, data.axisLen * 0.5, 0);
    const yAxisLine = new Mesh(geoAxisLine, matBasic.clone());
    this.grpCtrl.add(yAxisLine);
    const zAxisLine = new Mesh(geoAxisLine, matBasic.clone());
    zAxisLine.rotation.x = PIH;
    this.grpCtrl.add(zAxisLine);
    const xAxisLine = new Mesh(geoAxisLine, matBasic.clone());
    xAxisLine.rotation.z = -PIH;
    this.grpCtrl.add(xAxisLine);
    this.axisLines.push(xAxisLine, yAxisLine, zAxisLine);
    const zAxisArc = new Mesh(geoArc, matBasic.clone());
    this.grpCtrl.add(zAxisArc);
    const xAxisArc = new Mesh(geoArc, matBasic.clone());
    xAxisArc.rotation.y = -PIH;
    this.grpCtrl.add(xAxisArc);
    const yAxisArc = new Mesh(geoArc, matBasic.clone());
    yAxisArc.rotation.x = PIH;
    this.grpCtrl.add(yAxisArc);
    this.axisArcs.push(xAxisArc, yAxisArc, zAxisArc);
    const zAxisPnt = new Mesh(geoSphere, matBasic.clone());
    zAxisPnt.position.z = sclDistance;
    this.grpCtrl.add(zAxisPnt);
    const xAxisPnt = new Mesh(geoSphere, matBasic.clone());
    xAxisPnt.position.x = sclDistance;
    this.grpCtrl.add(xAxisPnt);
    const yAxisPnt = new Mesh(geoSphere, matBasic.clone());
    yAxisPnt.position.y = sclDistance;
    this.grpCtrl.add(yAxisPnt);
    this.axisPoints.push(xAxisPnt, yAxisPnt, zAxisPnt);
    const zAxisTri = new Mesh(geoTri, matBasic.clone());
    this.grpCtrl.add(zAxisTri);
    const yAxisTri = new Mesh(geoTri, matBasic.clone());
    yAxisTri.rotation.x = PIH;
    this.grpCtrl.add(yAxisTri);
    const xAxisTri = new Mesh(geoTri, matBasic.clone());
    xAxisTri.rotation.y = -PIH;
    this.grpCtrl.add(xAxisTri);
    this.axisTris.push(xAxisTri, yAxisTri, zAxisTri);
    this.meshTraceLine = new Line(geoTrace, matLine);
    this.meshTraceLine.visible = false;
    this.add(this.meshTraceLine);
    this.meshTracePnt = new Mesh(geoSphere, matBasic.clone());
    this.meshTracePnt.visible = false;
    this.add(this.meshTracePnt);
    this.origin = new Mesh(geoSphere, matBasic.clone());
    this.grpCtrl.add(this.origin);
    this.add(this.grpCtrl);
  }
  showGizmo() {
    this.grpCtrl.visible = true;
  }
  hideGizmo() {
    this.grpCtrl.visible = false;
  }
  updateLook(data) {
    let itm;
    for (itm of this.axisArcs)
      itm.visible = data.useRotate;
    this.origin.visible = data.useScale;
    for (itm of this.axisPoints)
      itm.visible = data.useScale;
    for (itm of this.axisTris)
      itm.visible = data.useTranslate;
  }
  update(data) {
    if (!data.hasUpdated && !data.hasHit)
      return;
    this.grpCtrl.scale.fromArray(data.scale);
    this.grpCtrl.position.fromArray(data.position);
    if (data.activeAxis === -2 && data.activeMode === ManipulatorMode.Scale) {
      this.origin.material.color.setHex(this.colSelect);
    } else {
      this.origin.material.color.setHex(this.colOrigin);
    }
    for (let i = 0; i < 3; i++) {
      this.axisLines[i].material.color.setHex(this.axisColors[i]);
      this.axisArcs[i].material.color.setHex(this.axisColors[i]);
      this.axisPoints[i].material.color.setHex(this.axisColors[i]);
      this.axisTris[i].material.color.setHex(this.axisColors[i]);
      if (i === data.activeAxis) {
        switch (data.activeMode) {
          case ManipulatorMode.Translate:
            this.axisLines[i].material.color.setHex(this.colSelect);
            break;
          case ManipulatorMode.Rotate:
            this.axisArcs[i].material.color.setHex(this.colSelect);
            break;
          case ManipulatorMode.Scale:
            this.axisPoints[i].material.color.setHex(this.colSelect);
            break;
        }
      }
      if (i === data.activePlane) {
        this.axisTris[i].material.color.setHex(16777215);
      }
    }
    if (data.traceLine.isActive) {
      const sclPnt = Math.abs(data.scale[2]);
      this.meshTracePnt.visible = true;
      this.meshTracePnt.scale.set(sclPnt, sclPnt, sclPnt);
      this.meshTracePnt.position.fromArray(data.traceLine.origin);
      this.meshTraceLine.visible = true;
      this.meshTraceLine.geometry.attributes.position.needsUpdate = true;
      const pntArray = this.meshTraceLine.geometry.attributes.position.array;
      pntArray[0] = data.traceLine.a[0];
      pntArray[1] = data.traceLine.a[1];
      pntArray[2] = data.traceLine.a[2];
      pntArray[3] = data.traceLine.b[0];
      pntArray[4] = data.traceLine.b[1];
      pntArray[5] = data.traceLine.b[2];
    } else {
      this.meshTraceLine.visible = false;
      this.meshTracePnt.visible = false;
    }
  }
}
class Manipulator3D {
  constructor(scene, camera, renderer = null, excludeMesh = false) {
    __publicField(this, "mesh", null);
    __publicField(this, "data", null);
    __publicField(this, "attachedObject", null);
    __publicField(this, "_camera", null);
    __publicField(this, "_renderer", null);
    __publicField(this, "_caster", new Raycaster());
    __publicField(this, "_ray", new Ray());
    __publicField(this, "_scaleStep", 0.1);
    __publicField(this, "_rotateStep", 10 * Math.PI / 180);
    __publicField(this, "_intersectOffset", [0, 0, 0]);
    __publicField(this, "_initDragPosition", [0, 0, 0]);
    __publicField(this, "_initDragQuaternion", [0, 0, 0, 1]);
    __publicField(this, "_initDragScale", [1, 1, 1]);
    __publicField(this, "_currentPosition", [0, 0, 0]);
    __publicField(this, "_currentQuaternion", [0, 0, 0, 1]);
    __publicField(this, "_currentScale", [1, 1, 1]);
    __publicField(this, "_3jsVec", new Vector3());
    __publicField(this, "_3jsQuat", new Quaternion());
    __publicField(this, "_stopClick", false);
    __publicField(this, "_onClick", (e) => {
      if (this._stopClick) {
        e.stopImmediatePropagation();
        this._stopClick = false;
      }
    });
    __publicField(this, "_onPointerMove", (e) => {
      var _a;
      this.update();
      this._updateRaycaster(e);
      if (!this.data.isDragging) {
        this.data.onRayHover(this._ray);
      } else {
        this.data.onRayMove(this._ray);
        (_a = this.renderer) == null ? void 0 : _a.domElement.setPointerCapture(e.pointerId);
        e.preventDefault();
        e.stopPropagation();
      }
    });
    __publicField(this, "_onPointerDown", (e) => {
      this._updateRaycaster(e);
      if (this.data.onRayDown(this._ray)) {
        e.preventDefault();
        e.stopPropagation();
        this._stopClick = true;
      }
    });
    __publicField(this, "_onPointerUp", (e) => {
      var _a;
      if (this.data.isDragging) {
        this.data.stopDrag();
        (_a = this.renderer) == null ? void 0 : _a.domElement.releasePointerCapture(e.pointerId);
      }
    });
    this.data = new ManipulatorData();
    this._camera = camera;
    if (!excludeMesh) {
      this.mesh = new ManipulatorMesh(this.data);
      scene.add(this.mesh);
    }
    this.data.onDragStart = () => this._onDragStart();
    this.data.onDragEnd = () => this._onDragEnd();
    this.data.onTranslate = (pos) => this._onTranslate(pos);
    this.data.onRotate = (steps, iAxis) => this._onRotate(steps, iAxis);
    this.data.onScale = (steps, iAxis) => this._onScale(steps, iAxis);
    if (renderer)
      this.setRenderer(renderer);
    this.update(true);
  }
  setRenderer(renderer) {
    renderer.domElement;
    this._renderer = renderer;
    this.addMouseListeners();
  }
  rayHover(rayCaster) {
    this.update();
    this._ray.fromCaster(rayCaster);
    return this.data.onRayHover(this._ray);
  }
  rayMove(rayCaster) {
    this.update();
    this._ray.fromCaster(rayCaster);
    return this.data.onRayMove(this._ray);
  }
  rayDown(rayCaster) {
    this._ray.fromCaster(rayCaster);
    return this.data.onRayDown(this._ray);
  }
  rayUp() {
    if (this.data.isDragging)
      this.data.stopDrag();
  }
  isDragging() {
    return this.data.isDragging;
  }
  isActive() {
    return this.data.isActive;
  }
  setActive(isOn) {
    this.data.isActive = isOn;
    if (this.mesh)
      this.mesh.visible = isOn;
    if (isOn)
      this.updateStateFromCamera();
    return this;
  }
  moveTo(p) {
    this.data.setPosition(p);
    this.data.calcAxesPosition();
    vec3_copy(this._currentPosition, p);
    this.update(true);
    return this;
  }
  useTranslate(b) {
    this.data.useTranslate = b;
    this.mesh.updateLook(this.data);
    return this;
  }
  useRotate(b) {
    this.data.useRotate = b;
    this.mesh.updateLook(this.data);
    return this;
  }
  useScale(b) {
    this.data.useScale = b;
    this.mesh.updateLook(this.data);
    return this;
  }
  setTraceLineStepDistance(n) {
    this.data.traceStep = n;
    return this;
  }
  setScaleStep(n) {
    this._scaleStep = n;
    return this;
  }
  setRotationStep(n) {
    this._rotateStep = n * Math.PI / 180;
    return this;
  }
  setScaleFactor(n) {
    this.data.scaleFactor = n;
    return this;
  }
  resetInitialValues(q = [0, 0, 0, 1], s = [1, 1, 1]) {
    if (s)
      vec3_copy(this._initDragScale, s);
    if (q)
      quat_copy(this._initDragQuaternion, q);
    return this;
  }
  attach(obj) {
    if (!this.data.isActive)
      return;
    this.attachedObject = obj;
    this.moveTo(obj.position.toArray());
    return this;
  }
  detach() {
    this.attachedObject = null;
    return this;
  }
  update(forceUpdate = false) {
    if (!this.data.isActive && !forceUpdate)
      return false;
    this.updateStateFromCamera(forceUpdate);
    if ((this.data.hasUpdated || this.data.hasHit) && this.mesh) {
      this.mesh.update(this.data);
      this.data.hasUpdated = false;
      this.data.hasHit = false;
      return true;
    }
    return false;
  }
  updateStateFromCamera(forceUpdate = false) {
    this._camera.getWorldPosition(this._3jsVec);
    this._camera.getWorldQuaternion(this._3jsQuat);
    this.data.updateFromCamera(this._3jsVec.toArray(), this._3jsQuat.toArray(), forceUpdate);
  }
  isDragging() {
    return this.data.isDragging;
  }
  _screenToNDCCoord(e) {
    const c = this._renderer.domElement;
    const rect = c.getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    return {
      x: x / rect.width * 2 - 1,
      y: -(y / rect.height) * 2 + 1
    };
  }
  _updateRaycaster(e) {
    this._caster.setFromCamera(this._screenToNDCCoord(e), this._camera);
    this._ray.fromCaster(this._caster);
  }
  addMouseListeners() {
    var _a;
    const canvas = (_a = this._renderer) == null ? void 0 : _a.domElement;
    if (!canvas)
      return;
    canvas.addEventListener("click", this._onClick);
    canvas.addEventListener("pointermove", this._onPointerMove);
    canvas.addEventListener("pointerdown", this._onPointerDown);
    canvas.addEventListener("pointerup", this._onPointerUp);
  }
  removeMouseListeners() {
    var _a;
    const canvas = (_a = this._renderer) == null ? void 0 : _a.domElement;
    if (!canvas)
      return;
    canvas.removeEventListener("click", this._onClick);
    canvas.removeEventListener("pointermove", this._onPointerMove);
    canvas.removeEventListener("pointerdown", this._onPointerDown);
    canvas.removeEventListener("pointerup", this._onPointerUp);
  }
  _onDragStart() {
    if (this.attachedObject) {
      vec3_copy(this._initDragPosition, this.attachedObject.position.toArray());
      vec3_copy(this._initDragScale, this.attachedObject.scale.toArray());
      quat_copy(this._initDragQuaternion, this.attachedObject.quaternion.toArray());
    } else {
      vec3_copy(this._initDragPosition, this._currentPosition);
      vec3_copy(this._initDragScale, this._currentScale);
      quat_copy(this._initDragQuaternion, this._currentQuaternion);
    }
    vec3_sub(this._intersectOffset, this.data.position, this.data.intersectPos);
    if (this.data.activeMode !== ManipulatorMode.Translate) {
      this.mesh.hideGizmo();
    }
    this.data.hasUpdated = true;
    this._emit("dragstart");
  }
  _onDragEnd() {
    this.data.calcAxesPosition();
    this.data.resetState();
    this.mesh.showGizmo();
    this._emit("dragend");
  }
  _onTranslate(pos) {
    const offsetPos = vec3_add([0, 0, 0], pos, this._intersectOffset);
    this.data.setPosition(offsetPos);
    if (this.attachedObject)
      this.attachedObject.position.fromArray(offsetPos);
    vec3_copy(this._currentPosition, offsetPos);
    this._emit("translate", offsetPos);
  }
  _onRotate(steps, iAxis) {
    const sign = iAxis === 1 ? 1 : -Math.sign(this.data.scale[iAxis]);
    const q = quat_setAxisAngle([0, 0, 0, 1], this.data.axes[iAxis].dir, this._rotateStep * steps * sign);
    quat_mul(q, q, this._initDragQuaternion);
    quat_normalize(q, q);
    if (this.attachedObject)
      this.attachedObject.quaternion.fromArray(q);
    quat_copy(this._currentQuaternion, q);
    this._emit("rotate", q);
  }
  _onScale(steps, iAxis) {
    const scl = this._initDragScale.slice(0);
    const inc = steps * this._scaleStep;
    if (iAxis === null) {
      scl[0] += inc;
      scl[1] += inc;
      scl[2] += inc;
    } else {
      scl[iAxis] += inc * Math.sign(this.data.scale[iAxis]);
    }
    if (this.attachedObject)
      this.attachedObject.scale.fromArray(scl);
    vec3_copy(this._currentScale, scl);
    this._emit("scale", scl);
  }
  on(evtName, fn) {
    this._renderer.domElement.addEventListener(evtName, fn);
    return this;
  }
  off(evtName, fn) {
    this._renderer.domElement.removeEventListener(evtName, fn);
    return this;
  }
  _emit(evtName, detail = null) {
    this._renderer.domElement.dispatchEvent(new CustomEvent(evtName, { detail, bubbles: true, cancelable: true, composed: false }));
  }
}
export { Manipulator3D, ManipulatorData, ManipulatorMesh, ManipulatorMode };
