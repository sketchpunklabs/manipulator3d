(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.manipulator3d = {}, global.THREE));
})(this, (function (exports, THREE) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

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
    var ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2];
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
    var mag = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2));

    if (mag != 0) {
      mag = 1 / mag;
      out[0] = a[0] * mag;
      out[1] = a[1] * mag;
      out[2] = a[2] * mag;
    }

    return out;
  }
  function vec3_transformQuat(out, v, q) {
    var qx = q[0],
        qy = q[1],
        qz = q[2],
        qw = q[3],
        vx = v[0],
        vy = v[1],
        vz = v[2],
        x1 = qy * vz - qz * vy,
        y1 = qz * vx - qx * vz,
        z1 = qx * vy - qy * vx,
        x2 = qw * x1 + qy * z1 - qz * y1,
        y2 = qw * y1 + qz * x1 - qx * z1,
        z2 = qw * z1 + qx * y1 - qy * x1;
    out[0] = vx + 2 * x2;
    out[1] = vy + 2 * y2;
    out[2] = vz + 2 * z2;
    return out;
  }
  function vec3_sqrLen(a, b) {
    if (b === undefined) return Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2);
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2);
  }
  function vec3_len(a, b) {
    if (b === undefined) return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2));
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
  }
  function vec3_mul(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  function vec3_lerp(out, a, b, t) {
    var ti = 1 - t; // Linear Interpolation : (1 - t) * v0 + t * v1;

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
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3],
        bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function quat_normalize(out, q) {
    var len = Math.pow(q[0], 2) + Math.pow(q[1], 2) + Math.pow(q[2], 2) + Math.pow(q[3], 2);

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
    var half = rad * .5,
        s = Math.sin(half);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(half);
    return out;
  }
  function quat_sqrLen(a, b) {
    if (b === undefined) return Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2);
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2) + Math.pow(a[3] - b[3], 2);
  }

  var Ray = /*#__PURE__*/function () {
    function Ray() {
      _classCallCheck(this, Ray);

      _defineProperty(this, "posStart", [0, 0, 0]);

      _defineProperty(this, "posEnd", [0, 0, 0]);

      _defineProperty(this, "direction", [0, 0, 0]);

      _defineProperty(this, "vecLength", [0, 0, 0]);
    }

    _createClass(Ray, [{
      key: "posAt",
      value: // Vector Length between start to end
      // #region GETTERS / SETTERS

      /** Get position of the ray from T Scale of VecLen */
      function posAt(t, out) {
        // RayVecLen * t + RayOrigin
        // also works lerp( RayOrigin, RayEnd, t )
        out = out || [0, 0, 0];
        out[0] = this.vecLength[0] * t + this.posStart[0];
        out[1] = this.vecLength[1] * t + this.posStart[1];
        out[2] = this.vecLength[2] * t + this.posStart[2];
        return out;
      }
      /** Get position of the ray from distance from origin */

    }, {
      key: "directionAt",
      value: function directionAt(len, out) {
        out = out || [0, 0, 0];
        out[0] = this.direction[0] * len + this.posStart[0];
        out[1] = this.direction[1] * len + this.posStart[1];
        out[2] = this.direction[2] * len + this.posStart[2];
        return out;
      }
    }, {
      key: "fromCaster",
      value: function fromCaster(caster) {
        vec3_copy(this.posStart, caster.ray.origin.toArray());
        vec3_copy(this.direction, caster.ray.direction.toArray());
        var len = caster.far == Infinity ? 1000 : caster.far;
        vec3_scale(this.vecLength, this.direction, len);
        vec3_add(this.posEnd, this.posStart, this.vecLength);
      } // #endregion

    }]);

    return Ray;
  }();
  function intersectSphere(ray, origin, radius) {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var radiusSq = radius * radius;
    var rayToCenter = vec3_sub([0, 0, 0], origin, ray.posStart);
    var tProj = vec3_dot(rayToCenter, ray.direction); // Project the length to the center onto the Ray
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Get length of projection point to center and check if its within the sphere
    // Opposite^2 = hyptenuse^2 - adjacent^2

    var oppLenSq = vec3_sqrLen(rayToCenter) - tProj * tProj;
    return !(oppLenSq > radiusSq);
  }
  /** T returned is scale to vector length, not direction */

  function intersectPlane(ray, planePos, planeNorm) {
    // ((planePos - rayOrigin) dot planeNorm) / ( rayVecLen dot planeNorm )
    // pos = t * rayVecLen + rayOrigin;
    var denom = vec3_dot(ray.vecLength, planeNorm); // Dot product of ray Length and plane normal

    if (denom <= 0.000001 && denom >= -0.000001) return null; // abs(denom) < epsilon, using && instead to not perform absolute.

    var t = vec3_dot(vec3_sub([0, 0, 0], planePos, ray.posStart), planeNorm) / denom;
    return t >= 0 ? t : null;
  }
  function intersectTri(ray, v0, v1, v2, out) {
    var cullFace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    var v0v1 = vec3_sub([0, 0, 0], v1, v0);
    var v0v2 = vec3_sub([0, 0, 0], v2, v0);
    var pvec = vec3_cross([0, 0, 0], ray.direction, v0v2);
    var det = vec3_dot(v0v1, pvec);
    if (cullFace && det < 0.000001) return false; //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var idet = 1 / det;
    var tvec = vec3_sub([0, 0, 0], ray.posStart, v0);
    var u = vec3_dot(tvec, pvec) * idet;
    if (u < 0 || u > 1) return false; //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var qvec = vec3_cross([0, 0, 0], tvec, v0v1);
    var v = vec3_dot(ray.direction, qvec) * idet;
    if (v < 0 || u + v > 1) return false; //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if (out) {
      var len = vec3_dot(v0v2, qvec) * idet;
      ray.directionAt(len, out);
    }

    return true;
  }
  function nearPoint(ray, p) {
    var distLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;

    /* closest_point_to_line3D
    let dx	= bx - ax,
        dy	= by - ay,
        dz	= bz - az,
        t	= ( (px-ax)*dx + (py-ay)*dy + (pz-az)*dz ) / ( dx*dx + dy*dy + dz*dz ) ; */
    var v = vec3_sub([0, 0, 0], p, ray.posStart);
    vec3_mul(v, v, ray.vecLength);
    var t = (v[0] + v[1] + v[2]) / vec3_sqrLen(ray.vecLength);
    if (t < 0 || t > 1) return null; // Over / Under shoots the Ray Segment

    var lenSqr = vec3_sqrLen(ray.posAt(t, v), p); // Distance from point to nearest point on ray.

    return lenSqr <= distLimit * distLimit ? t : null;
  }
  var NearSegmentResult = /*#__PURE__*/_createClass(function NearSegmentResult() {
    _classCallCheck(this, NearSegmentResult);

    _defineProperty(this, "segPosition", [0, 0, 0]);

    _defineProperty(this, "rayPosition", [0, 0, 0]);

    _defineProperty(this, "distanceSq", 0);

    _defineProperty(this, "distance", 0);
  });
  /** Returns [ T of Segment, T of RayLen ] */

  function nearSegment(ray, p0, p1) {
    var results = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    // http://geomalgorithms.com/a07-_distance.html
    var u = vec3_sub([0, 0, 0], p1, p0),
        v = ray.vecLength,
        w = vec3_sub([0, 0, 0], p0, ray.posStart),
        a = vec3_dot(u, u),
        // always >= 0
    b = vec3_dot(u, v),
        c = vec3_dot(v, v),
        // always >= 0
    d = vec3_dot(u, w),
        e = vec3_dot(v, w),
        D = a * c - b * b; // always >= 0

    var tU = 0,
        // T Of Segment 
    tV = 0; // T Of Ray
    // Compute the line parameters of the two closest points

    if (D < 0.000001) {
      // the lines are almost parallel
      tU = 0.0;
      tV = b > c ? d / b : e / c; // use the largest denominator
    } else {
      tU = (b * e - c * d) / D;
      tV = (a * e - b * d) / D;
    }

    if (tU < 0 || tU > 1 || tV < 0 || tV > 1) return false; // Segment Position : u.scale( tU ).add( p0 )
    // Ray Position :     v.scale( tV ).add( this.origin ) ];

    if (results) {
      vec3_lerp(results.rayPosition, ray.posStart, ray.posEnd, tV);
      vec3_lerp(results.segPosition, p0, p1, tU);
      results.distance = vec3_len(results.segPosition, results.rayPosition);
    }

    return true;
  }

  var ManipulatorMode = Object.freeze({
    Translate: 0,
    Rotate: 1,
    Scale: 2
  });
  var ManipulatorData = /*#__PURE__*/function () {
    function ManipulatorData() {
      _classCallCheck(this, ManipulatorData);

      _defineProperty(this, "scaleFactor", 10);

      _defineProperty(this, "minFlipAdjust", -0.02);

      _defineProperty(this, "minHitDistance", 0.1);

      _defineProperty(this, "minPntDistance", 0.1);

      _defineProperty(this, "minArcDistance", 0.1);

      _defineProperty(this, "lastCamPos", [0, 0, 0]);

      _defineProperty(this, "lastCamRot", [0, 0, 0, 1]);

      _defineProperty(this, "hasHit", false);

      _defineProperty(this, "hasUpdated", true);

      _defineProperty(this, "isDragging", false);

      _defineProperty(this, "isActive", false);

      _defineProperty(this, "intersectPos", [0, 0, 0]);

      _defineProperty(this, "position", [0, 0, 0]);

      _defineProperty(this, "scale", [1, 1, 1]);

      _defineProperty(this, "infoScale", 1);

      _defineProperty(this, "arcRadius", 1.5);

      _defineProperty(this, "axisLen", 1.5);

      _defineProperty(this, "midPointLen", 0.55);

      _defineProperty(this, "sclPointLen", 1.8);

      _defineProperty(this, "axes", [// Information about each axis
      {
        dir: [1, 0, 0],
        endPos: [1, 0, 0],
        midPos: [0, 0, 0],
        sclPos: [0, 0, 0]
      }, // X
      {
        dir: [0, 1, 0],
        endPos: [0, 1, 0],
        midPos: [0, 0, 0],
        sclPos: [0, 0, 0]
      }, // Y
      {
        dir: [0, 0, 1],
        endPos: [0, 0, 1],
        midPos: [0, 0, 0],
        sclPos: [0, 0, 0]
      } // Z
      ]);

      _defineProperty(this, "traceStep", 0.1);

      _defineProperty(this, "traceLine", {
        isActive: false,
        // Should the line be visible
        hitPos: [0, 0, 0],
        // Current Hit position on line
        origin: [0, 0, 0],
        // Hit position that initialized the trace line
        a: [0, 0, 0],
        // First point of line
        b: [0, 0, 0],
        // Second Point of line
        dir: [0, 0, 0] // Direction line is being drawn on

      });

      _defineProperty(this, "activeMode", ManipulatorMode.Translate);

      _defineProperty(this, "activeAxis", -1);

      _defineProperty(this, "activePlane", -1);

      _defineProperty(this, "onDragStart", null);

      _defineProperty(this, "onDragEnd", null);

      _defineProperty(this, "onTranslate", null);

      _defineProperty(this, "onRotate", null);

      _defineProperty(this, "onScale", null);
    }

    _createClass(ManipulatorData, [{
      key: "setPosition",
      value: // #endregion
      // #region METHODS
      function setPosition(x, y, z) {
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
      } // UI data changed in relation to direction & distance from the camera

    }, {
      key: "updateFromCamera",
      value: function updateFromCamera(camPos, camRot) {
        var forceUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        // If dragging or no change to camera since last update
        if ((this.isDragging || Math.abs(vec3_sqrLen(camPos, this.lastCamPos)) <= 0.000001 && Math.abs(quat_sqrLen(camRot, this.lastCamRot)) <= 0.000001) && !forceUpdate) return this;
        vec3_copy(this.lastCamPos, camPos);
        quat_copy(this.lastCamRot, camRot);

        this._calcCameraScale();

        return this;
      }
    }, {
      key: "resetState",
      value: function resetState() {
        var lastState = [false, false, false];
        var a = this.axes;
        var i, ax;

        for (i = 0; i < 3; i++) {
          ax = a[i];

          if (ax.isActive) {
            lastState[i] = true;
            ax.isActive = false;
          }
        }

        this.traceLine.isActive = false;
        this.activeMode = ManipulatorMode.Translate;
        this.activeAxis = -1;
        this.activePlane = -1;
        return lastState;
      } // #endregion
      // #region DRAGGING

    }, {
      key: "startDrag",
      value: function startDrag() {
        this.isDragging = true;
        if (this.onDragStart) this.onDragStart();
      }
    }, {
      key: "stopDrag",
      value: function stopDrag() {
        this.isDragging = false;
        if (this.onDragEnd) this.onDragEnd();
      } // User interacting on a plane

    }, {
      key: "_movePlane",
      value: function _movePlane(ray, i) {
        var norm = this.axes[i].dir;
        var t = intersectPlane(ray, this.position, norm);

        if (t != null) {
          ray.posAt(t, this.position);
          this.calcAxesPosition();
          if (this.onTranslate) this.onTranslate(this.position.slice(0));
          return true;
        }

        return false;
      } // User interacting on a trace line

    }, {
      key: "_moveTrace",
      value: function _moveTrace(ray) {
        var segResult = new NearSegmentResult();

        if (nearSegment(ray, this.traceLine.a, this.traceLine.b, segResult)) {
          vec3_copy(this.traceLine.hitPos, segResult.segPosition);

          switch (this.activeMode) {
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            case ManipulatorMode.Translate:
              vec3_copy(this.position, segResult.segPosition);
              this.calcAxesPosition(); // Need to recompute all the axis data during translating

              if (this.onTranslate) this.onTranslate(segResult.segPosition.slice(0));
              break;
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            case ManipulatorMode.Rotate:
            case ManipulatorMode.Scale:
              var dir = vec3_sub([0, 0, 0], segResult.segPosition, this.traceLine.origin);
              var dist = vec3_len(dir);
              var sign = Math.sign(vec3_dot(dir, this.traceLine.dir));
              var step = dist / this.traceStep * sign;

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
      } // Handle ray on some sort of down event

    }, {
      key: "onRayDown",
      value: function onRayDown(ray) {
        if (this.isActive && this._rayIntersect(ray)) {
          this.startDrag();
          return true;
        }

        return false;
      } // Handle ray on same sort of hover event

    }, {
      key: "onRayHover",
      value: function onRayHover(ray) {
        return this.isActive && !this.isDragging ? this._rayIntersect(ray) : false;
      } // Handle ray on same sort of move event

    }, {
      key: "onRayMove",
      value: function onRayMove(ray) {
        if (this.isActive && !this.isDragging) return false;

        if (this.activeAxis != -1) {
          this._moveTrace(ray);
        } else if (this.activePlane != -1) {
          return this._movePlane(ray, this.activePlane);
        }

        return false;
      } // #endregion
      // #region HELPER

    }, {
      key: "_setTraceLine",
      value: function _setTraceLine(pos) {
        var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
        this.traceLine.isActive = true;
        vec3_copy(this.traceLine.origin, pos);
        vec3_copy(this.traceLine.hitPos, pos);

        if (axis == -1) {
          vec3_transformQuat(this.traceLine.dir, [1, 0, 0], this.lastCamRot);
        } else {
          vec3_copy(this.traceLine.dir, this.axes[axis].dir);
        }

        vec3_scaleAndAdd(this.traceLine.a, pos, this.traceLine.dir, -1000);
        vec3_scaleAndAdd(this.traceLine.b, pos, this.traceLine.dir, 1000);
      } // #endregion
      // #region COMPUTE

    }, {
      key: "_calcCameraScale",
      value: function _calcCameraScale() {
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Adjust the scale to keep the gizmo as the same size no matter how far the camera goes
        var eyeDir = vec3_sub([0, 0, 0], this.lastCamPos, this.position);
        var eyeLen = vec3_len(eyeDir);
        this.infoScale = eyeLen / this.scaleFactor;
        vec3_norm(eyeDir, eyeDir); // Normalize for DOT Checks

        vec3_scale(this.scale, [1, 1, 1], this.infoScale); //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Flip viewing to the opposite side

        if (vec3_dot(eyeDir, [1, 0, 0]) < this.minFlipAdjust) this.scale[0] = -this.scale[0];
        if (vec3_dot(eyeDir, [0, 1, 0]) < this.minFlipAdjust) this.scale[1] = -this.scale[1];
        if (vec3_dot(eyeDir, [0, 0, 1]) < this.minFlipAdjust) this.scale[2] = -this.scale[2]; //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Update the axis positions

        this.calcAxesPosition();
      }
    }, {
      key: "calcAxesPosition",
      value: function calcAxesPosition() {
        var a = this.axes;

        for (var i = 0; i < 3; i++) {
          vec3_scaleAndAdd(a[i].endPos, this.position, a[i].dir, this.scale[i] * this.axisLen); // Axis Line

          vec3_scaleAndAdd(a[i].midPos, this.position, a[i].dir, this.scale[i] * this.midPointLen); // Mid Point 

          vec3_scaleAndAdd(a[i].sclPos, this.position, a[i].dir, this.scale[i] * this.sclPointLen); // Scale Points
        }

        this.hasUpdated = true;
      } // #endregion
      // #region RAY INTERSECTION

    }, {
      key: "_rayIntersect",
      value: function _rayIntersect(ray) {
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // First test if the ray even intersects the sphere area the control occupies
        if (!this._testSphere(ray)) {
          return false;
        }

        var lastState = this.resetState(); // Reset axis & collect last axes state
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var hit = false;

        if (!(hit = this._testPoints(ray))) {
          if (!(hit = this._testPlanes(ray))) {
            if (!(hit = this._testAxis(ray))) {
              hit = this._testArc(ray);
            }
          }
        } // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


        var a = this.axes;

        for (var i = 0; i < 3; i++) {
          if (a[i].isActive != lastState[i]) {
            this.hasUpdated = true;
            break;
          }
        }

        this.hasHit = true;
        return hit;
      }
    }, {
      key: "_testSphere",
      value: function _testSphere(ray) {
        return intersectSphere(ray, this.position, (this.sclPointLen + this.minPntDistance) * this.infoScale);
      }
    }, {
      key: "_testPlanes",
      value: function _testPlanes(ray) {
        // Test each axis plane by using triangle points
        var a = this.axes;
        var i, ii;

        for (i = 0; i < 3; i++) {
          ii = (i + 1) % 3; // 0:1 = Z(2), 1:2 = X(0), 2:0 = Y(1) 

          if (intersectTri(ray, a[i].midPos, a[ii].midPos, this.position, this.intersectPos, false)) {
            this.activePlane = (i + 2) % 3;
            return true;
          }
        }

        return false;
      }
    }, {
      key: "_testArc",
      value: function _testArc(ray) {
        var minDistance = this.infoScale * this.minArcDistance;
        var a = this.axes;
        var hitPos = [0, 0, 0]; // Intersection Hit Position

        var hitDir = [0, 0, 0]; // Direction to Hit point

        var axis = [0, 0, 0]; // Axis for hemisphere testing

        var radius = this.arcRadius * this.infoScale; // Doing distance testing in Squared values

        var t, dist;
        var i, ii, iii;

        for (i = 0; i < 3; i++) {
          // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          // First test against the plane using the axis as the plane normal
          t = intersectPlane(ray, this.position, a[i].dir);
          if (t === null) continue; // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          // Next do a circle radius test of the hit point to plane origin

          ray.posAt(t, hitPos);
          dist = vec3_len(this.position, hitPos);

          if (Math.abs(dist - radius) <= minDistance) {
            // ------------------------------------------
            // Inside circle, Check if in the positive side of the hemisphere
            // using the next axis direction 
            ii = (i + 1) % 3; // Get direction to hit point

            vec3_sub(hitDir, hitPos, this.position); // Flip axis direction based on camera angle

            vec3_scale(axis, a[ii].dir, Math.sign(this.scale[ii]));

            if (vec3_dot(hitDir, axis) >= 0) {
              // ------------------------------------------
              // Do the other hemisphere check with the remaining axis  
              iii = (i + 2) % 3; // Flip axis direction based on camera angle

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
    }, {
      key: "_testAxis",
      value: function _testAxis(ray) {
        var minDistance = this.infoScale * this.minHitDistance;
        var segResult = new NearSegmentResult();
        var pos = [0, 0, 0];
        var min = Infinity;
        var axis = -1;
        var ax; // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        for (var i = 0; i < 3; i++) {
          ax = this.axes[i]; // Find the axis with the shortest distance

          if (nearSegment(ray, this.position, ax.endPos, segResult)) {
            if (segResult.distance <= minDistance && segResult.distance < min) {
              min = segResult.distance;
              axis = i;
              vec3_copy(pos, segResult.segPosition);
            }
          }
        } // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


        if (axis !== -1) {
          this.activeAxis = axis;

          this._setTraceLine(pos, axis);

          vec3_copy(this.intersectPos, pos);
          return true;
        }

        return false;
      }
    }, {
      key: "_testPoints",
      value: function _testPoints(ray) {
        var minDistance = this.infoScale * this.minPntDistance; // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test for origin point for all axis scaling

        var t = nearPoint(ray, this.position, minDistance);

        if (t !== null) {
          this._setTraceLine(this.position);

          this.activeMode = ManipulatorMode.Scale;
          this.activeAxis = -2;
          return true;
        } // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Test axis specific points


        for (var i = 0; i < 3; i++) {
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
      } // #endregion

    }]);

    return ManipulatorData;
  }();

  var ManipulatorMesh = /*#__PURE__*/function (_THREE$Group) {
    _inherits(ManipulatorMesh, _THREE$Group);

    var _super = _createSuper(ManipulatorMesh);

    // #region MAIN
    function ManipulatorMesh(data) {
      var _this;

      _classCallCheck(this, ManipulatorMesh);

      _this = _super.call(this);

      _defineProperty(_assertThisInitialized(_this), "axisColors", [0x81D773, 0x6DA9EA, 0xF7716A]);

      _defineProperty(_assertThisInitialized(_this), "axisLines", []);

      _defineProperty(_assertThisInitialized(_this), "axisArcs", []);

      _defineProperty(_assertThisInitialized(_this), "axisBoxes", []);

      _defineProperty(_assertThisInitialized(_this), "axisTris", []);

      _defineProperty(_assertThisInitialized(_this), "grpCtrl", new THREE__namespace.Group());

      _defineProperty(_assertThisInitialized(_this), "meshTracePnt", null);

      _defineProperty(_assertThisInitialized(_this), "meshTraceLine", null);

      _defineProperty(_assertThisInitialized(_this), "colSelect", 0xffffff);

      _defineProperty(_assertThisInitialized(_this), "colOrigin", 0xffff00);

      var PIH = Math.PI * 0.5;
      var lineRadius = 0.03;
      var arcRadius = data.arcRadius;
      var arcThickness = 0.03;
      var sclDistance = data.sclPointLen;
      _this.visible = false; // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // MATERIALS

      var matBasic = new THREE__namespace.MeshBasicMaterial({
        depthTest: false,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        transparent: true,
        side: THREE__namespace.DoubleSide,
        opacity: 1.0,
        color: 0xffffff
      });
      var matLine = new THREE__namespace.LineBasicMaterial({
        depthTest: false,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        transparent: true,
        color: 0x909090
      }); // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // GEOMETRY

      var geoTrace = new THREE__namespace.BufferGeometry();
      geoTrace.setAttribute('position', new THREE__namespace.Float32BufferAttribute([0, 0, 0, 0, 100, 0], 3));
      var geoTri = new THREE__namespace.BufferGeometry();
      geoTri.setAttribute('position', new THREE__namespace.Float32BufferAttribute([0, 0, 0, data.midPointLen, 0, 0, 0, data.midPointLen, 0], 3));
      var geoSphere = new THREE__namespace.SphereGeometry(0.1, 8, 8);
      var geoArc = new THREE__namespace.TorusGeometry(arcRadius, arcThickness, 3, 10, PIH);
      var geoAxisLine = new THREE__namespace.CylinderGeometry(lineRadius, lineRadius, data.axisLen, 3);
      geoAxisLine.translate(0, data.axisLen * 0.5, 0); // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // AXIS LINES

      var yAxisLine = new THREE__namespace.Mesh(geoAxisLine, matBasic.clone());

      _this.grpCtrl.add(yAxisLine);

      var zAxisLine = new THREE__namespace.Mesh(geoAxisLine, matBasic.clone());
      zAxisLine.rotation.x = PIH;

      _this.grpCtrl.add(zAxisLine);

      var xAxisLine = new THREE__namespace.Mesh(geoAxisLine, matBasic.clone());
      xAxisLine.rotation.z = -PIH;

      _this.grpCtrl.add(xAxisLine);

      _this.axisLines.push(xAxisLine, yAxisLine, zAxisLine); // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // AXIS LINES


      var zAxisArc = new THREE__namespace.Mesh(geoArc, matBasic.clone());

      _this.grpCtrl.add(zAxisArc);

      var xAxisArc = new THREE__namespace.Mesh(geoArc, matBasic.clone());
      xAxisArc.rotation.y = -PIH;

      _this.grpCtrl.add(xAxisArc);

      var yAxisArc = new THREE__namespace.Mesh(geoArc, matBasic.clone());
      yAxisArc.rotation.x = PIH;

      _this.grpCtrl.add(yAxisArc);

      _this.axisArcs.push(xAxisArc, yAxisArc, zAxisArc); // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // SCALE SELECTORS


      var zAxisBox = new THREE__namespace.Mesh(geoSphere, matBasic.clone());
      zAxisBox.position.z = sclDistance;

      _this.grpCtrl.add(zAxisBox);

      var xAxisBox = new THREE__namespace.Mesh(geoSphere, matBasic.clone());
      xAxisBox.position.x = sclDistance;

      _this.grpCtrl.add(xAxisBox);

      var yAxisBox = new THREE__namespace.Mesh(geoSphere, matBasic.clone());
      yAxisBox.position.y = sclDistance;

      _this.grpCtrl.add(yAxisBox);

      _this.axisBoxes.push(xAxisBox, yAxisBox, zAxisBox); // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // PLANE SELECTORS


      var zAxisTri = new THREE__namespace.Mesh(geoTri, matBasic.clone());

      _this.grpCtrl.add(zAxisTri);

      var yAxisTri = new THREE__namespace.Mesh(geoTri, matBasic.clone());
      yAxisTri.rotation.x = PIH;

      _this.grpCtrl.add(yAxisTri);

      var xAxisTri = new THREE__namespace.Mesh(geoTri, matBasic.clone());
      xAxisTri.rotation.y = -PIH;

      _this.grpCtrl.add(xAxisTri);

      _this.axisTris.push(xAxisTri, yAxisTri, zAxisTri); // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


      _this.meshTraceLine = new THREE__namespace.Line(geoTrace, matLine);
      _this.meshTraceLine.visible = false;

      _this.add(_this.meshTraceLine);

      _this.meshTracePnt = new THREE__namespace.Mesh(geoSphere, matBasic.clone());
      _this.meshTracePnt.visible = false;

      _this.add(_this.meshTracePnt);

      _this.origin = new THREE__namespace.Mesh(geoSphere, matBasic.clone());

      _this.grpCtrl.add(_this.origin);

      _this.add(_this.grpCtrl);

      return _this;
    } // #endregion


    _createClass(ManipulatorMesh, [{
      key: "showGizmo",
      value: function showGizmo() {
        this.grpCtrl.visible = true;
      }
    }, {
      key: "hideGizmo",
      value: function hideGizmo() {
        this.grpCtrl.visible = false;
      }
    }, {
      key: "update",
      value: function update(data) {
        if (!data.hasUpdated && !data.hasHit) return;
        this.grpCtrl.scale.fromArray(data.scale);
        this.grpCtrl.position.fromArray(data.position);

        if (data.activeAxis === -2 && data.activeMode === ManipulatorMode.Scale) {
          this.origin.material.color.setHex(this.colSelect);
        } else {
          this.origin.material.color.setHex(this.colOrigin);
        }

        for (var i = 0; i < 3; i++) {
          this.axisLines[i].material.color.setHex(this.axisColors[i]);
          this.axisArcs[i].material.color.setHex(this.axisColors[i]);
          this.axisBoxes[i].material.color.setHex(this.axisColors[i]);
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
                this.axisBoxes[i].material.color.setHex(this.colSelect);
                break;
            }
          }

          if (i === data.activePlane) {
            this.axisTris[i].material.color.setHex(0xffffff);
          }
        }

        if (data.traceLine.isActive) {
          var sclPnt = Math.abs(data.scale[2]);
          this.meshTracePnt.visible = true;
          this.meshTracePnt.scale.set(sclPnt, sclPnt, sclPnt);
          this.meshTracePnt.position.fromArray(data.traceLine.origin);
          this.meshTraceLine.visible = true;
          this.meshTraceLine.geometry.attributes.position.needsUpdate = true;
          var pntArray = this.meshTraceLine.geometry.attributes.position.array;
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
    }]);

    return ManipulatorMesh;
  }(THREE__namespace.Group);

  var Manipulator3D = /*#__PURE__*/function () {
    // #region MAIN
    // Rendering of the gizmo
    // Data state of the gizmo
    // Reference to selected object
    // ThreeJS Camera
    // ThreeJS Renderer
    // ThreeJS Ray Caster
    // Custom ray object
    // How much to increment per step
    // How many radians per step
    // Offset between gizmo position & intersection point
    // Caching values at the start of a drag action
    function Manipulator3D(scene, camera) {
      var _this = this;

      var renderer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var excludeMesh = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      _classCallCheck(this, Manipulator3D);

      _defineProperty(this, "mesh", null);

      _defineProperty(this, "data", null);

      _defineProperty(this, "attachedObject", null);

      _defineProperty(this, "_camera", null);

      _defineProperty(this, "_renderer", null);

      _defineProperty(this, "_caster", new THREE.Raycaster());

      _defineProperty(this, "_ray", new Ray());

      _defineProperty(this, "_scaleStep", 0.1);

      _defineProperty(this, "_rotateStep", 10 * Math.PI / 180);

      _defineProperty(this, "_intersectOffset", [0, 0, 0]);

      _defineProperty(this, "_initDragPosition", [0, 0, 0]);

      _defineProperty(this, "_initDragQuaternion", [0, 0, 0, 1]);

      _defineProperty(this, "_initDragScale", [0, 0, 0]);

      _defineProperty(this, "_3jsVec", new THREE.Vector3());

      _defineProperty(this, "_3jsQuat", new THREE.Quaternion());

      this.data = new ManipulatorData();
      this._camera = camera;

      if (!excludeMesh) {
        this.mesh = new ManipulatorMesh(this.data);
        scene.add(this.mesh);
      }

      this.data.onDragStart = function () {
        return _this._onDragStart();
      };

      this.data.onDragEnd = function () {
        return _this._onDragEnd();
      };

      this.data.onTranslate = function (pos) {
        return _this._onTranslate(pos);
      };

      this.data.onRotate = function (steps, iAxis) {
        return _this._onRotate(steps, iAxis);
      };

      this.data.onScale = function (steps, iAxis) {
        return _this._onScale(steps, iAxis);
      };

      if (renderer) this.setRenderer(renderer);
      this.update(true);
    } // Can set the renderer at a later point, sets up canvas listeners


    _createClass(Manipulator3D, [{
      key: "setRenderer",
      value: function setRenderer(renderer) {
        var _this2 = this;

        var canvas = renderer.domElement;
        this._renderer = renderer; // Special case when there is an onClick Handler on the canvas, it
        // get triggered on mouse up, but if user did a drag action the click
        // will trigger at the end. This can cause issues if using click as a way
        // to select new attachments.

        var stopClick = false;
        canvas.addEventListener('click', function (e) {
          if (stopClick) {
            e.stopImmediatePropagation();
            stopClick = false;
          }
        });
        canvas.addEventListener('pointermove', function (e) {
          _this2.update();

          _this2._updateRaycaster(e);

          if (!_this2.data.isDragging) {
            _this2.data.onRayHover(_this2._ray);
          } else {
            _this2.data.onRayMove(_this2._ray);

            canvas.setPointerCapture(e.pointerId); // Keep receiving events

            e.preventDefault();
            e.stopPropagation();
          }
        });
        canvas.addEventListener('pointerdown', function (e) {
          _this2._updateRaycaster(e);

          if (_this2.data.onRayDown(_this2._ray)) {
            e.preventDefault();
            e.stopPropagation();
            stopClick = true;
          }
        });
        canvas.addEventListener('pointerup', function (e) {
          if (_this2.data.isDragging) {
            _this2.data.stopDrag();

            canvas.releasePointerCapture(e.pointerId);
          }
        });
      } // #endregion
      // #region NON-MOUSE CONTROL METHODS ( XR Controller Ray Casting )

    }, {
      key: "rayHover",
      value: function rayHover(rayCaster) {
        this.update();

        this._ray.fromCaster(rayCaster);

        return this.data.onRayHover(this._ray);
      }
    }, {
      key: "rayMove",
      value: function rayMove(rayCaster) {
        this.update();

        this._ray.fromCaster(rayCaster);

        return this.data.onRayMove(this._ray);
      }
    }, {
      key: "rayDown",
      value: function rayDown(rayCaster) {
        this._ray.fromCaster(rayCaster);

        return this.data.onRayDown(this._ray);
      }
    }, {
      key: "rayUp",
      value: function rayUp() {
        if (this.data.isDragging) this.data.stopDrag();
      } // #endregion
      // #region METHODS

    }, {
      key: "isDragging",
      value: // #endregion
      // #region GETTERS
      function isDragging() {
        return this.data.isDragging;
      } // #endregion
      // #region RAY CASTER
      // Convert mouse screen position to NDC coordinates, needed for ray casting

    }, {
      key: "isActive",
      value: function isActive() {
        return this.data.isActive;
      } // Enable / disable gizmo

    }, {
      key: "setActive",
      value: function setActive(isOn) {
        this.data.isActive = isOn;
        if (this.mesh) this.mesh.visible = isOn;
        if (isOn) this.updateStateFromCamera();
      } // How much distance traveled on the trace line to register as 1 step

    }, {
      key: "setTraceLineStepDistance",
      value: function setTraceLineStepDistance(n) {
        this.data.traceStep = n;
        return this;
      }
    }, {
      key: "setScaleStep",
      value: function setScaleStep(n) {
        this._scaleStep = n;
        return this;
      }
    }, {
      key: "setRotationStep",
      value: function setRotationStep(n) {
        this._rotateStep = n * Math.PI / 180;
        return this;
      }
    }, {
      key: "setScaleFactor",
      value: function setScaleFactor(n) {
        this.data.scaleFactor = n;
        return this;
      }
    }, {
      key: "attach",
      value: function attach(obj) {
        if (!this.data.isActive) return;
        this.attachedObject = obj;
        this.data.setPosition(obj.position.toArray());
        this.data.calcAxesPosition();
        this.update(true);
      }
    }, {
      key: "detach",
      value: function detach() {
        this.attachedObject = null;
      }
    }, {
      key: "update",
      value: function update() {
        var forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (!this.data.isActive && !forceUpdate) return false; // When camera changes, need data to be updated to reflect the changes

        this.updateStateFromCamera(forceUpdate);

        if ((this.data.hasUpdated || this.data.hasHit) && this.mesh) {
          this.mesh.update(this.data);
          this.data.hasUpdated = false;
          this.data.hasHit = false;
          return true;
        }

        return false;
      }
    }, {
      key: "updateStateFromCamera",
      value: function updateStateFromCamera() {
        var forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        // In VR, the camera can exists on a dolly which causes its position & rotation 
        // to be stuck in local space. Need to get WorldSpace transform to properly compute
        // the scaling factor else the scale values will be so small that mesh wouldn't
        // be visible.
        this._camera.getWorldPosition(this._3jsVec);

        this._camera.getWorldQuaternion(this._3jsQuat);

        this.data.updateFromCamera(this._3jsVec.toArray(), this._3jsQuat.toArray(), forceUpdate);
      }
    }, {
      key: "_screenToNDCCoord",
      value: function _screenToNDCCoord(e) {
        var c = this._renderer.domElement; // renderer canvas

        var rect = c.getBoundingClientRect(); // need canvas screen location & size

        var x = e.clientX - rect.x; // canvas x position

        var y = e.clientY - rect.y; // canvas y position

        return {
          x: x / rect.width * 2 - 1,
          y: -(y / rect.height) * 2 + 1
        };
      } // Upate cached ray caster from mouse event on canvas

    }, {
      key: "_updateRaycaster",
      value: function _updateRaycaster(e) {
        this._caster.setFromCamera(this._screenToNDCCoord(e), this._camera);

        this._ray.fromCaster(this._caster);
      } // #endregion
      // #region INNER EVENTS

    }, {
      key: "_onDragStart",
      value: function _onDragStart() {
        // Save initial state of attached object
        vec3_copy(this._initDragPosition, this.attachedObject.position.toArray());
        vec3_copy(this._initDragScale, this.attachedObject.scale.toArray());
        quat_copy(this._initDragQuaternion, this.attachedObject.quaternion.toArray()); // Offset has prevent the snapping effect of translation

        vec3_sub(this._intersectOffset, this.data.position, this.data.intersectPos); // When dealing with small objects, better to hide the gizmo during scale & rotation
        // But leave the trace line visible as its really the only ui the user needs during dragging

        if (this.data.activeMode !== ManipulatorMode.Translate) {
          this.mesh.hideGizmo();
        }

        this.data.hasUpdated = true; // Need mesh to update

        this._emit('dragstart');
      }
    }, {
      key: "_onDragEnd",
      value: function _onDragEnd() {
        // onTranslate updates position, need to recalculate at the end of dragging 
        // for intersection tests to be accurate.
        this.data.calcAxesPosition(); // When doing dragging away from ui, the hover event won't trigger to undo
        // visual states, so call method at the end of the dragging to tidy things up.

        this.data.resetState();
        this.mesh.showGizmo();

        this._emit('dragend');
      }
    }, {
      key: "_onTranslate",
      value: function _onTranslate(pos) {
        var offsetPos = vec3_add([0, 0, 0], pos, this._intersectOffset);
        this.data.setPosition(offsetPos); // Save position for mesh to move to

        this.attachedObject.position.fromArray(offsetPos); // move attached object to the same spot

        this._emit('translate', pos);
      }
    }, {
      key: "_onRotate",
      value: function _onRotate(steps, iAxis) {
        // Y Axis needs to sign change, other exists reverse the scale sign        
        var sign = iAxis === 1 ? 1 : -Math.sign(this.data.scale[iAxis]); // Compute how much offset rotation to apply to initial value

        var q = quat_setAxisAngle([0, 0, 0, 1], this.data.axes[iAxis].dir, this._rotateStep * steps * sign);
        quat_mul(q, q, this._initDragQuaternion);
        quat_normalize(q, q); // Apply

        this.attachedObject.quaternion.fromArray(q);

        this._emit('rotate', q);
      }
    }, {
      key: "_onScale",
      value: function _onScale(steps, iAxis) {
        var scl = this._initDragScale.slice(0); // Clone data, keep init as read only


        var inc = steps * this._scaleStep; // How much to increment the scale value
        // Apply scale increment in all axes

        if (iAxis === null) {
          scl[0] += inc;
          scl[1] += inc;
          scl[2] += inc; // Apply to a specific axis
        } else {
          scl[iAxis] += inc * Math.sign(this.data.scale[iAxis]);
        } // Apply


        this.attachedObject.scale.fromArray(scl);

        this._emit('scale', scl);
      } // #endregion
      // #region OUTER EVENTS{

    }, {
      key: "on",
      value: function on(evtName, fn) {
        this._renderer.domElement.addEventListener(evtName, fn);
      }
    }, {
      key: "off",
      value: function off(evtName, fn) {
        this._renderer.domElement.removeEventListener(evtName, fn);
      }
    }, {
      key: "_emit",
      value: function _emit(evtName) {
        var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        this._renderer.domElement.dispatchEvent(new CustomEvent(evtName, {
          detail: detail,
          bubbles: true,
          cancelable: true,
          composed: false
        }));
      } // #endregion

    }]);

    return Manipulator3D;
  }();

  exports.Manipulator3D = Manipulator3D;
  exports.ManipulatorData = ManipulatorData;
  exports.ManipulatorMesh = ManipulatorMesh;
  exports.ManipulatorMode = ManipulatorMode;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
