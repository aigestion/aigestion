"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// ../../node_modules/.pnpm/@protobufjs+aspromise@1.1.2/node_modules/@protobufjs/aspromise/index.js
var require_aspromise = __commonJS({
  "../../node_modules/.pnpm/@protobufjs+aspromise@1.1.2/node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
    "use strict";
    module2.exports = asPromise;
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
      while (index < arguments.length)
        params[offset++] = arguments[index++];
      return new Promise(function executor(resolve2, reject) {
        params[offset] = function callback(err) {
          if (pending) {
            pending = false;
            if (err)
              reject(err);
            else {
              var params2 = new Array(arguments.length - 1), offset2 = 0;
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2];
              resolve2.apply(null, params2);
            }
          }
        };
        try {
          fn.apply(ctx || null, params);
        } catch (err) {
          if (pending) {
            pending = false;
            reject(err);
          }
        }
      });
    }
  }
});

// ../../node_modules/.pnpm/@protobufjs+base64@1.1.2/node_modules/@protobufjs/base64/index.js
var require_base64 = __commonJS({
  "../../node_modules/.pnpm/@protobufjs+base64@1.1.2/node_modules/@protobufjs/base64/index.js"(exports2) {
    "use strict";
    var base64 = exports2;
    base64.length = function length2(string) {
      var p = string.length;
      if (!p)
        return 0;
      var n = 0;
      while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
      return Math.ceil(string.length * 3) / 4 - n;
    };
    var b64 = new Array(64);
    var s64 = new Array(123);
    for (i = 0; i < 64; )
      s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
    var i;
    base64.encode = function encode(buffer2, start, end) {
      var parts = null, chunk = [];
      var i2 = 0, j = 0, t;
      while (start < end) {
        var b = buffer2[start++];
        switch (j) {
          case 0:
            chunk[i2++] = b64[b >> 2];
            t = (b & 3) << 4;
            j = 1;
            break;
          case 1:
            chunk[i2++] = b64[t | b >> 4];
            t = (b & 15) << 2;
            j = 2;
            break;
          case 2:
            chunk[i2++] = b64[t | b >> 6];
            chunk[i2++] = b64[b & 63];
            j = 0;
            break;
        }
        if (i2 > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i2 = 0;
        }
      }
      if (j) {
        chunk[i2++] = b64[t];
        chunk[i2++] = 61;
        if (j === 1)
          chunk[i2++] = 61;
      }
      if (parts) {
        if (i2)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i2));
    };
    var invalidEncoding = "invalid encoding";
    base64.decode = function decode(string, buffer2, offset) {
      var start = offset;
      var j = 0, t;
      for (var i2 = 0; i2 < string.length; ) {
        var c = string.charCodeAt(i2++);
        if (c === 61 && j > 1)
          break;
        if ((c = s64[c]) === void 0)
          throw Error(invalidEncoding);
        switch (j) {
          case 0:
            t = c;
            j = 1;
            break;
          case 1:
            buffer2[offset++] = t << 2 | (c & 48) >> 4;
            t = c;
            j = 2;
            break;
          case 2:
            buffer2[offset++] = (t & 15) << 4 | (c & 60) >> 2;
            t = c;
            j = 3;
            break;
          case 3:
            buffer2[offset++] = (t & 3) << 6 | c;
            j = 0;
            break;
        }
      }
      if (j === 1)
        throw Error(invalidEncoding);
      return offset - start;
    };
    base64.test = function test(string) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
    };
  }
});

// ../../node_modules/.pnpm/@protobufjs+eventemitter@1.1.0/node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = __commonJS({
  "../../node_modules/.pnpm/@protobufjs+eventemitter@1.1.0/node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
    "use strict";
    module2.exports = EventEmitter;
    function EventEmitter() {
      this._listeners = {};
    }
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
      (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this
      });
      return this;
    };
    EventEmitter.prototype.off = function off(evt, fn) {
      if (evt === void 0)
        this._listeners = {};
      else {
        if (fn === void 0)
          this._listeners[evt] = [];
        else {
          var listeners = this._listeners[evt];
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn)
              listeners.splice(i, 1);
            else
              ++i;
        }
      }
      return this;
    };
    EventEmitter.prototype.emit = function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i = 1;
        for (; i < arguments.length; )
          args.push(arguments[i++]);
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args);
      }
      return this;
    };
  }
});

// ../../node_modules/.pnpm/@protobufjs+float@1.0.2/node_modules/@protobufjs/float/index.js
var require_float = __commonJS({
  "../../node_modules/.pnpm/@protobufjs+float@1.0.2/node_modules/@protobufjs/float/index.js"(exports2, module2) {
    "use strict";
    module2.exports = factory(factory);
    function factory(exports3) {
      if (typeof Float32Array !== "undefined")
        (function() {
          var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
          function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
          }
          function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
          }
          exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
          exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
          function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
          }
          function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
          }
          exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
          exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
        })();
      else
        (function() {
          function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0)
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos);
            else if (isNaN(val))
              writeUint(2143289344, buf, pos);
            else if (val > 34028234663852886e22)
              writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 11754943508222875e-54)
              writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
            else {
              var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
              writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
          }
          exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
          exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
          function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
            return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
          }
          exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
          exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
        })();
      if (typeof Float64Array !== "undefined")
        (function() {
          var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
          function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
          }
          function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
          }
          exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
          exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
          function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
          }
          function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
          }
          exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
          exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
        })();
      else
        (function() {
          function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0) {
              writeUint(0, buf, pos + off0);
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos + off1);
            } else if (isNaN(val)) {
              writeUint(0, buf, pos + off0);
              writeUint(2146959360, buf, pos + off1);
            } else if (val > 17976931348623157e292) {
              writeUint(0, buf, pos + off0);
              writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
              var mantissa;
              if (val < 22250738585072014e-324) {
                mantissa = val / 5e-324;
                writeUint(mantissa >>> 0, buf, pos + off0);
                writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
              } else {
                var exponent = Math.floor(Math.log(val) / Math.LN2);
                if (exponent === 1024)
                  exponent = 1023;
                mantissa = val * Math.pow(2, -exponent);
                writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
              }
            }
          }
          exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
          exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
          function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
          }
          exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
          exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
        })();
      return exports3;
    }
    function writeUintLE(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    function writeUintBE(val, buf, pos) {
      buf[pos] = val >>> 24;
      buf[pos + 1] = val >>> 16 & 255;
      buf[pos + 2] = val >>> 8 & 255;
      buf[pos + 3] = val & 255;
    }
    function readUintLE(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
    }
    function readUintBE(buf, pos) {
      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
    }
  }
});

// ../../node_modules/.pnpm/@protobufjs+inquire@1.1.0/node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS({
  "../../node_modules/.pnpm/@protobufjs+inquire@1.1.0/node_modules/@protobufjs/inquire/index.js"(exports, module) {
    "use strict";
    module.exports = inquire;
    function inquire(moduleName) {
      try {
        var mod = eval("quire".replace(/^/, "re"))(moduleName);
        if (mod && (mod.length || Object.keys(mod).length))
          return mod;
      } catch (e) {
      }
      return null;
    }
  }
});

// ../../node_modules/.pnpm/@protobufjs+utf8@1.1.0/node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS({
  "../../node_modules/.pnpm/@protobufjs+utf8@1.1.0/node_modules/@protobufjs/utf8/index.js"(exports2) {
    "use strict";
    var utf83 = exports2;
    utf83.length = function utf8_length(string) {
      var len = 0, c = 0;
      for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    };
    utf83.read = function utf8_read(buffer2, start, end) {
      var len = end - start;
      if (len < 1)
        return "";
      var parts = null, chunk = [], i = 0, t;
      while (start < end) {
        t = buffer2[start++];
        if (t < 128)
          chunk[i++] = t;
        else if (t > 191 && t < 224)
          chunk[i++] = (t & 31) << 6 | buffer2[start++] & 63;
        else if (t > 239 && t < 365) {
          t = ((t & 7) << 18 | (buffer2[start++] & 63) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63) - 65536;
          chunk[i++] = 55296 + (t >> 10);
          chunk[i++] = 56320 + (t & 1023);
        } else
          chunk[i++] = (t & 15) << 12 | (buffer2[start++] & 63) << 6 | buffer2[start++] & 63;
        if (i > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i = 0;
        }
      }
      if (parts) {
        if (i)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i));
    };
    utf83.write = function utf8_write(string, buffer2, offset) {
      var start = offset, c1, c2;
      for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
          buffer2[offset++] = c1;
        } else if (c1 < 2048) {
          buffer2[offset++] = c1 >> 6 | 192;
          buffer2[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer2[offset++] = c1 >> 18 | 240;
          buffer2[offset++] = c1 >> 12 & 63 | 128;
          buffer2[offset++] = c1 >> 6 & 63 | 128;
          buffer2[offset++] = c1 & 63 | 128;
        } else {
          buffer2[offset++] = c1 >> 12 | 224;
          buffer2[offset++] = c1 >> 6 & 63 | 128;
          buffer2[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    };
  }
});

// ../../node_modules/.pnpm/@protobufjs+pool@1.1.0/node_modules/@protobufjs/pool/index.js
var require_pool = __commonJS({
  "../../node_modules/.pnpm/@protobufjs+pool@1.1.0/node_modules/@protobufjs/pool/index.js"(exports2, module2) {
    "use strict";
    module2.exports = pool;
    function pool(alloc, slice, size) {
      var SIZE = size || 8192;
      var MAX = SIZE >>> 1;
      var slab = null;
      var offset = SIZE;
      return function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX)
          return alloc(size2);
        if (offset + size2 > SIZE) {
          slab = alloc(SIZE);
          offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size2);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf;
      };
    }
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
    "use strict";
    module2.exports = LongBits;
    var util = require_minimal();
    function LongBits(lo, hi) {
      this.lo = lo >>> 0;
      this.hi = hi >>> 0;
    }
    var zero = LongBits.zero = new LongBits(0, 0);
    zero.toNumber = function() {
      return 0;
    };
    zero.zzEncode = zero.zzDecode = function() {
      return this;
    };
    zero.length = function() {
      return 1;
    };
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
    LongBits.fromNumber = function fromNumber2(value) {
      if (value === 0)
        return zero;
      var sign = value < 0;
      if (sign)
        value = -value;
      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
      if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295)
            hi = 0;
        }
      }
      return new LongBits(lo, hi);
    };
    LongBits.from = function from(value) {
      if (typeof value === "number")
        return LongBits.fromNumber(value);
      if (util.isString(value)) {
        if (util.Long)
          value = util.Long.fromString(value);
        else
          return LongBits.fromNumber(parseInt(value, 10));
      }
      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    };
    LongBits.prototype.toNumber = function toNumber2(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo)
          hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    };
    LongBits.prototype.toLong = function toLong(unsigned) {
      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    };
    var charCodeAt = String.prototype.charCodeAt;
    LongBits.fromHash = function fromHash(hash) {
      if (hash === zeroHash)
        return zero;
      return new LongBits(
        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
      );
    };
    LongBits.prototype.toHash = function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        this.lo >>> 8 & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24,
        this.hi & 255,
        this.hi >>> 8 & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
      );
    };
    LongBits.prototype.zzEncode = function zzEncode() {
      var mask = this.hi >> 31;
      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      this.lo = (this.lo << 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.zzDecode = function zzDecode() {
      var mask = -(this.lo & 1);
      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.length = function length2() {
      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    };
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/util/minimal.js"(exports2) {
    "use strict";
    var util = exports2;
    util.asPromise = require_aspromise();
    util.base64 = require_base64();
    util.EventEmitter = require_eventemitter();
    util.float = require_float();
    util.inquire = require_inquire();
    util.utf8 = require_utf8();
    util.pool = require_pool();
    util.LongBits = require_longbits();
    util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
    util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
    util.emptyArray = Object.freeze ? Object.freeze([]) : (
      /* istanbul ignore next */
      []
    );
    util.emptyObject = Object.freeze ? Object.freeze({}) : (
      /* istanbul ignore next */
      {}
    );
    util.isInteger = Number.isInteger || /* istanbul ignore next */
    function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    util.isString = function isString(value) {
      return typeof value === "string" || value instanceof String;
    };
    util.isObject = function isObject3(value) {
      return value && typeof value === "object";
    };
    util.isset = /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util.isSet = function isSet3(obj, prop) {
      var value = obj[prop];
      if (value != null && obj.hasOwnProperty(prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    };
    util.Buffer = function() {
      try {
        var Buffer2 = util.inquire("buffer").Buffer;
        return Buffer2.prototype.utf8Write ? Buffer2 : (
          /* istanbul ignore next */
          null
        );
      } catch (e) {
        return null;
      }
    }();
    util._Buffer_from = null;
    util._Buffer_allocUnsafe = null;
    util.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    };
    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util.Long = /* istanbul ignore next */
    util.global.dcodeIO && /* istanbul ignore next */
    util.global.dcodeIO.Long || /* istanbul ignore next */
    util.global.Long || util.inquire("long");
    util.key2Re = /^true|false|0|1$/;
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util.longToHash = function longToHash(value) {
      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
    };
    util.longFromHash = function longFromHash(hash, unsigned) {
      var bits = util.LongBits.fromHash(hash);
      if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
      return bits.toNumber(Boolean(unsigned));
    };
    function merge(dst, src, ifNotSet) {
      for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === void 0 || !ifNotSet)
          dst[keys[i]] = src[keys[i]];
      return dst;
    }
    util.merge = merge;
    util.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
    function newError(name) {
      function CustomError(message, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message, properties);
        Object.defineProperty(this, "message", { get: function() {
          return message;
        } });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge(this, properties);
      }
      CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: CustomError,
          writable: true,
          enumerable: false,
          configurable: true
        },
        name: {
          get: function get() {
            return name;
          },
          set: void 0,
          enumerable: false,
          // configurable: false would accurately preserve the behavior of
          // the original, but I'm guessing that was not intentional.
          // For an actual error subclass, this property would
          // be configurable.
          configurable: true
        },
        toString: {
          value: function value() {
            return this.name + ": " + this.message;
          },
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      return CustomError;
    }
    util.newError = newError;
    util.ProtocolError = newError("ProtocolError");
    util.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;
      return function() {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
            return keys[i2];
      };
    };
    util.oneOfSetter = function setOneOf(fieldNames) {
      return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name)
            delete this[fieldNames[i]];
      };
    };
    util.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util._configure = function() {
      var Buffer2 = util.Buffer;
      if (!Buffer2) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
      }
      util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || /* istanbul ignore next */
      function Buffer_from(value, encoding) {
        return new Buffer2(value, encoding);
      };
      util._Buffer_allocUnsafe = Buffer2.allocUnsafe || /* istanbul ignore next */
      function Buffer_allocUnsafe(size) {
        return new Buffer2(size);
      };
    };
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/writer.js"(exports2, module2) {
    "use strict";
    module2.exports = Writer;
    var util = require_minimal();
    var BufferWriter;
    var LongBits = util.LongBits;
    var base64 = util.base64;
    var utf83 = util.utf8;
    function Op(fn, len, val) {
      this.fn = fn;
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    function noop() {
    }
    function State(writer) {
      this.head = writer.head;
      this.tail = writer.tail;
      this.len = writer.len;
      this.next = writer.states;
    }
    function Writer() {
      this.len = 0;
      this.head = new Op(noop, 0, 0);
      this.tail = this.head;
      this.states = null;
    }
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
          return new BufferWriter();
        })();
      } : function create_array() {
        return new Writer();
      };
    };
    Writer.create = create();
    Writer.alloc = function alloc(size) {
      return new util.Array(size);
    };
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
    Writer.prototype._push = function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val);
      this.len += len;
      return this;
    };
    function writeByte(val, buf, pos) {
      buf[pos] = val & 255;
    }
    function writeVarint32(val, buf, pos) {
      while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf[pos] = val;
    }
    function VarintOp(len, val) {
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;
    Writer.prototype.uint32 = function write_uint32(value) {
      this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
        value
      )).len;
      return this;
    };
    Writer.prototype.int32 = function write_int32(value) {
      return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
    };
    Writer.prototype.sint32 = function write_sint32(value) {
      return this.uint32((value << 1 ^ value >> 31) >>> 0);
    };
    function writeVarint64(val, buf, pos) {
      while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
      }
      while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
      }
      buf[pos++] = val.lo;
    }
    Writer.prototype.uint64 = function write_uint64(value) {
      var bits = LongBits.from(value);
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.int64 = Writer.prototype.uint64;
    Writer.prototype.sint64 = function write_sint64(value) {
      var bits = LongBits.from(value).zzEncode();
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.bool = function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0);
    };
    function writeFixed32(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    Writer.prototype.fixed32 = function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0);
    };
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
    Writer.prototype.fixed64 = function write_fixed64(value) {
      var bits = LongBits.from(value);
      return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
    };
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
    Writer.prototype.float = function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value);
    };
    Writer.prototype.double = function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value);
    };
    var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
      buf.set(val, pos);
    } : function writeBytes_for(val, buf, pos) {
      for (var i = 0; i < val.length; ++i)
        buf[pos + i] = val[i];
    };
    Writer.prototype.bytes = function write_bytes(value) {
      var len = value.length >>> 0;
      if (!len)
        return this._push(writeByte, 1, 0);
      if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
      }
      return this.uint32(len)._push(writeBytes, len, value);
    };
    Writer.prototype.string = function write_string(value) {
      var len = utf83.length(value);
      return len ? this.uint32(len)._push(utf83.write, len, value) : this._push(writeByte, 1, 0);
    };
    Writer.prototype.fork = function fork() {
      this.states = new State(this);
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
      return this;
    };
    Writer.prototype.reset = function reset() {
      if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
      } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
      }
      return this;
    };
    Writer.prototype.ldelim = function ldelim() {
      var head = this.head, tail = this.tail, len = this.len;
      this.reset().uint32(len);
      if (len) {
        this.tail.next = head.next;
        this.tail = tail;
        this.len += len;
      }
      return this;
    };
    Writer.prototype.finish = function finish() {
      var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
      while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
      }
      return buf;
    };
    Writer._configure = function(BufferWriter_) {
      BufferWriter = BufferWriter_;
      Writer.create = create();
      BufferWriter._configure();
    };
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferWriter;
    var Writer = require_writer();
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util = require_minimal();
    function BufferWriter() {
      Writer.call(this);
    }
    BufferWriter._configure = function() {
      BufferWriter.alloc = util._Buffer_allocUnsafe;
      BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos);
      } : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy)
          val.copy(buf, pos, 0, val.length);
        else
          for (var i = 0; i < val.length; )
            buf[pos++] = val[i++];
      };
    };
    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
      if (util.isString(value))
        value = util._Buffer_from(value, "base64");
      var len = value.length >>> 0;
      this.uint32(len);
      if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
      return this;
    };
    function writeStringBuffer(val, buf, pos) {
      if (val.length < 40)
        util.utf8.write(val, buf, pos);
      else if (buf.utf8Write)
        buf.utf8Write(val, pos);
      else
        buf.write(val, pos);
    }
    BufferWriter.prototype.string = function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value);
      this.uint32(len);
      if (len)
        this._push(writeStringBuffer, len, value);
      return this;
    };
    BufferWriter._configure();
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/reader.js"(exports2, module2) {
    "use strict";
    module2.exports = Reader;
    var util = require_minimal();
    var BufferReader;
    var LongBits = util.LongBits;
    var utf83 = util.utf8;
    function indexOutOfRange(reader, writeLength) {
      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }
    function Reader(buffer2) {
      this.buf = buffer2;
      this.pos = 0;
      this.len = buffer2.length;
    }
    var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer2) {
      if (buffer2 instanceof Uint8Array || Array.isArray(buffer2))
        return new Reader(buffer2);
      throw Error("illegal buffer");
    } : function create_array2(buffer2) {
      if (Array.isArray(buffer2))
        return new Reader(buffer2);
      throw Error("illegal buffer");
    };
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup(buffer2) {
        return (Reader.create = function create_buffer(buffer3) {
          return util.Buffer.isBuffer(buffer3) ? new BufferReader(buffer3) : create_array(buffer3);
        })(buffer2);
      } : create_array;
    };
    Reader.create = create();
    Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
    util.Array.prototype.slice;
    Reader.prototype.uint32 = function read_uint32_setup() {
      var value = 4294967295;
      return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        if ((this.pos += 5) > this.len) {
          this.pos = this.len;
          throw indexOutOfRange(this, 10);
        }
        return value;
      };
    }();
    Reader.prototype.int32 = function read_int32() {
      return this.uint32() | 0;
    };
    Reader.prototype.sint32 = function read_sint32() {
      var value = this.uint32();
      return value >>> 1 ^ -(value & 1) | 0;
    };
    function readLongVarint() {
      var bits = new LongBits(0, 0);
      var i = 0;
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      }
      throw Error("invalid varint encoding");
    }
    Reader.prototype.bool = function read_bool() {
      return this.uint32() !== 0;
    };
    function readFixed32_end(buf, end) {
      return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
    }
    Reader.prototype.fixed32 = function read_fixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4);
    };
    Reader.prototype.sfixed32 = function read_sfixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4) | 0;
    };
    function readFixed64() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);
      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    Reader.prototype.float = function read_float() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readFloatLE(this.buf, this.pos);
      this.pos += 4;
      return value;
    };
    Reader.prototype.double = function read_double() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readDoubleLE(this.buf, this.pos);
      this.pos += 8;
      return value;
    };
    Reader.prototype.bytes = function read_bytes() {
      var length2 = this.uint32(), start = this.pos, end = this.pos + length2;
      if (end > this.len)
        throw indexOutOfRange(this, length2);
      this.pos += length2;
      if (Array.isArray(this.buf))
        return this.buf.slice(start, end);
      return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
    };
    Reader.prototype.string = function read_string() {
      var bytes = this.bytes();
      return utf83.read(bytes, 0, bytes.length);
    };
    Reader.prototype.skip = function skip(length2) {
      if (typeof length2 === "number") {
        if (this.pos + length2 > this.len)
          throw indexOutOfRange(this, length2);
        this.pos += length2;
      } else {
        do {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
      }
      return this;
    };
    Reader.prototype.skipType = function(wireType) {
      switch (wireType) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while ((wireType = this.uint32() & 7) !== 4) {
            this.skipType(wireType);
          }
          break;
        case 5:
          this.skip(4);
          break;
        default:
          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
      }
      return this;
    };
    Reader._configure = function(BufferReader_) {
      BufferReader = BufferReader_;
      Reader.create = create();
      BufferReader._configure();
      var fn = util.Long ? "toLong" : (
        /* istanbul ignore next */
        "toNumber"
      );
      util.merge(Reader.prototype, {
        int64: function read_int64() {
          return readLongVarint.call(this)[fn](false);
        },
        uint64: function read_uint64() {
          return readLongVarint.call(this)[fn](true);
        },
        sint64: function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false);
        },
        fixed64: function read_fixed64() {
          return readFixed64.call(this)[fn](true);
        },
        sfixed64: function read_sfixed64() {
          return readFixed64.call(this)[fn](false);
        }
      });
    };
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferReader;
    var Reader = require_reader();
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util = require_minimal();
    function BufferReader(buffer2) {
      Reader.call(this, buffer2);
    }
    BufferReader._configure = function() {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
    };
    BufferReader.prototype.string = function read_string_buffer() {
      var len = this.uint32();
      return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
    };
    BufferReader._configure();
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
    "use strict";
    module2.exports = Service;
    var util = require_minimal();
    (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
    function Service(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");
      util.EventEmitter.call(this);
      this.rpcImpl = rpcImpl;
      this.requestDelimited = Boolean(requestDelimited);
      this.responseDelimited = Boolean(responseDelimited);
    }
    Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
      if (!request)
        throw TypeError("request must be specified");
      var self2 = this;
      if (!callback)
        return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
      if (!self2.rpcImpl) {
        setTimeout(function() {
          callback(Error("already ended"));
        }, 0);
        return void 0;
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
          function rpcCallback(err, response) {
            if (err) {
              self2.emit("error", err, method);
              return callback(err);
            }
            if (response === null) {
              self2.end(
                /* endedByRPC */
                true
              );
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err2) {
                self2.emit("error", err2, method);
                return callback(err2);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          }
        );
      } catch (err) {
        self2.emit("error", err, method);
        setTimeout(function() {
          callback(err);
        }, 0);
        return void 0;
      }
    };
    Service.prototype.end = function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC)
          this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
      }
      return this;
    };
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/rpc.js"(exports2) {
    "use strict";
    var rpc = exports2;
    rpc.Service = require_service();
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/roots.js"(exports2, module2) {
    "use strict";
    module2.exports = {};
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/src/index-minimal.js"(exports2) {
    "use strict";
    var protobuf = exports2;
    protobuf.build = "minimal";
    protobuf.Writer = require_writer();
    protobuf.BufferWriter = require_writer_buffer();
    protobuf.Reader = require_reader();
    protobuf.BufferReader = require_reader_buffer();
    protobuf.util = require_minimal();
    protobuf.rpc = require_rpc();
    protobuf.roots = require_roots();
    protobuf.configure = configure;
    function configure() {
      protobuf.util._configure();
      protobuf.Writer._configure(protobuf.BufferWriter);
      protobuf.Reader._configure(protobuf.BufferReader);
    }
    configure();
  }
});

// ../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/minimal.js
var require_minimal2 = __commonJS({
  "../../node_modules/.pnpm/protobufjs@7.2.4/node_modules/protobufjs/minimal.js"(exports2, module2) {
    "use strict";
    module2.exports = require_index_minimal();
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  main: () => main
});
module.exports = __toCommonJS(src_exports);

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/animator.gen.js
var import_minimal = __toESM(require_minimal2());
function createBasePBAnimator() {
  return { states: [] };
}
var PBAnimator;
(function(PBAnimator2) {
  function encode(message, writer = import_minimal.default.Writer.create()) {
    for (const v of message.states) {
      PBAnimationState.encode(v, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  }
  PBAnimator2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal.default.Reader ? input : import_minimal.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAnimator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.states.push(PBAnimationState.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAnimator2.decode = decode;
})(PBAnimator || (PBAnimator = {}));
function createBasePBAnimationState() {
  return { clip: "", playing: void 0, weight: void 0, speed: void 0, loop: void 0, shouldReset: void 0 };
}
var PBAnimationState;
(function(PBAnimationState2) {
  function encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.clip !== "") {
      writer.uint32(18).string(message.clip);
    }
    if (message.playing !== void 0) {
      writer.uint32(24).bool(message.playing);
    }
    if (message.weight !== void 0) {
      writer.uint32(37).float(message.weight);
    }
    if (message.speed !== void 0) {
      writer.uint32(45).float(message.speed);
    }
    if (message.loop !== void 0) {
      writer.uint32(48).bool(message.loop);
    }
    if (message.shouldReset !== void 0) {
      writer.uint32(56).bool(message.shouldReset);
    }
    return writer;
  }
  PBAnimationState2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal.default.Reader ? input : import_minimal.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAnimationState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }
          message.clip = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.playing = reader.bool();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.weight = reader.float();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }
          message.speed = reader.float();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }
          message.loop = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.shouldReset = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAnimationState2.decode = decode;
})(PBAnimationState || (PBAnimationState = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/Animator.gen.js
var AnimatorSchema = {
  COMPONENT_ID: 1042,
  serialize(value, builder) {
    const writer = PBAnimator.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAnimator.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAnimator.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAnimator"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/audio_event.gen.js
var import_minimal2 = __toESM(require_minimal2());
function createBasePBAudioEvent() {
  return { state: 0, timestamp: 0 };
}
var PBAudioEvent;
(function(PBAudioEvent2) {
  function encode(message, writer = import_minimal2.default.Writer.create()) {
    if (message.state !== 0) {
      writer.uint32(8).int32(message.state);
    }
    if (message.timestamp !== 0) {
      writer.uint32(16).uint32(message.timestamp);
    }
    return writer;
  }
  PBAudioEvent2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal2.default.Reader ? input : import_minimal2.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAudioEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.state = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.timestamp = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAudioEvent2.decode = decode;
})(PBAudioEvent || (PBAudioEvent = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AudioEvent.gen.js
var AudioEventSchema = {
  COMPONENT_ID: 1105,
  serialize(value, builder) {
    const writer = PBAudioEvent.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAudioEvent.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAudioEvent.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAudioEvent"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/audio_source.gen.js
var import_minimal3 = __toESM(require_minimal2());
function createBasePBAudioSource() {
  return {
    playing: void 0,
    volume: void 0,
    loop: void 0,
    pitch: void 0,
    audioClipUrl: "",
    currentTime: void 0,
    global: void 0
  };
}
var PBAudioSource;
(function(PBAudioSource2) {
  function encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.playing !== void 0) {
      writer.uint32(8).bool(message.playing);
    }
    if (message.volume !== void 0) {
      writer.uint32(21).float(message.volume);
    }
    if (message.loop !== void 0) {
      writer.uint32(24).bool(message.loop);
    }
    if (message.pitch !== void 0) {
      writer.uint32(37).float(message.pitch);
    }
    if (message.audioClipUrl !== "") {
      writer.uint32(42).string(message.audioClipUrl);
    }
    if (message.currentTime !== void 0) {
      writer.uint32(53).float(message.currentTime);
    }
    if (message.global !== void 0) {
      writer.uint32(56).bool(message.global);
    }
    return writer;
  }
  PBAudioSource2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal3.default.Reader ? input : import_minimal3.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAudioSource();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.playing = reader.bool();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.volume = reader.float();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.loop = reader.bool();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.pitch = reader.float();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.audioClipUrl = reader.string();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }
          message.currentTime = reader.float();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.global = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAudioSource2.decode = decode;
})(PBAudioSource || (PBAudioSource = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AudioSource.gen.js
var AudioSourceSchema = {
  COMPONENT_ID: 1020,
  serialize(value, builder) {
    const writer = PBAudioSource.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAudioSource.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAudioSource.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAudioSource"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/audio_stream.gen.js
var import_minimal4 = __toESM(require_minimal2());
function createBasePBAudioStream() {
  return {
    playing: void 0,
    volume: void 0,
    url: "",
    spatial: void 0,
    spatialMinDistance: void 0,
    spatialMaxDistance: void 0
  };
}
var PBAudioStream;
(function(PBAudioStream2) {
  function encode(message, writer = import_minimal4.default.Writer.create()) {
    if (message.playing !== void 0) {
      writer.uint32(8).bool(message.playing);
    }
    if (message.volume !== void 0) {
      writer.uint32(21).float(message.volume);
    }
    if (message.url !== "") {
      writer.uint32(26).string(message.url);
    }
    if (message.spatial !== void 0) {
      writer.uint32(32).bool(message.spatial);
    }
    if (message.spatialMinDistance !== void 0) {
      writer.uint32(45).float(message.spatialMinDistance);
    }
    if (message.spatialMaxDistance !== void 0) {
      writer.uint32(53).float(message.spatialMaxDistance);
    }
    return writer;
  }
  PBAudioStream2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal4.default.Reader ? input : import_minimal4.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAudioStream();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.playing = reader.bool();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.volume = reader.float();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.url = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.spatial = reader.bool();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }
          message.spatialMinDistance = reader.float();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }
          message.spatialMaxDistance = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAudioStream2.decode = decode;
})(PBAudioStream || (PBAudioStream = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AudioStream.gen.js
var AudioStreamSchema = {
  COMPONENT_ID: 1021,
  serialize(value, builder) {
    const writer = PBAudioStream.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAudioStream.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAudioStream.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAudioStream"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_attach.gen.js
var import_minimal5 = __toESM(require_minimal2());
var AvatarAnchorPointType;
(function(AvatarAnchorPointType2) {
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_POSITION"] = 0] = "AAPT_POSITION";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_NAME_TAG"] = 1] = "AAPT_NAME_TAG";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_HEAD"] = 4] = "AAPT_HEAD";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_NECK"] = 5] = "AAPT_NECK";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_SPINE"] = 6] = "AAPT_SPINE";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_SPINE1"] = 7] = "AAPT_SPINE1";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_SPINE2"] = 8] = "AAPT_SPINE2";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_HIP"] = 9] = "AAPT_HIP";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_SHOULDER"] = 10] = "AAPT_LEFT_SHOULDER";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_ARM"] = 11] = "AAPT_LEFT_ARM";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_FOREARM"] = 12] = "AAPT_LEFT_FOREARM";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_HAND"] = 2] = "AAPT_LEFT_HAND";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_HAND_INDEX"] = 13] = "AAPT_LEFT_HAND_INDEX";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_SHOULDER"] = 14] = "AAPT_RIGHT_SHOULDER";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_ARM"] = 15] = "AAPT_RIGHT_ARM";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_FOREARM"] = 16] = "AAPT_RIGHT_FOREARM";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_HAND"] = 3] = "AAPT_RIGHT_HAND";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_HAND_INDEX"] = 17] = "AAPT_RIGHT_HAND_INDEX";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_UP_LEG"] = 18] = "AAPT_LEFT_UP_LEG";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_LEG"] = 19] = "AAPT_LEFT_LEG";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_FOOT"] = 20] = "AAPT_LEFT_FOOT";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_LEFT_TOE_BASE"] = 21] = "AAPT_LEFT_TOE_BASE";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_UP_LEG"] = 22] = "AAPT_RIGHT_UP_LEG";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_LEG"] = 23] = "AAPT_RIGHT_LEG";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_FOOT"] = 24] = "AAPT_RIGHT_FOOT";
  AvatarAnchorPointType2[AvatarAnchorPointType2["AAPT_RIGHT_TOE_BASE"] = 25] = "AAPT_RIGHT_TOE_BASE";
})(AvatarAnchorPointType || (AvatarAnchorPointType = {}));
function createBasePBAvatarAttach() {
  return { avatarId: void 0, anchorPointId: 0 };
}
var PBAvatarAttach;
(function(PBAvatarAttach2) {
  function encode(message, writer = import_minimal5.default.Writer.create()) {
    if (message.avatarId !== void 0) {
      writer.uint32(10).string(message.avatarId);
    }
    if (message.anchorPointId !== 0) {
      writer.uint32(16).int32(message.anchorPointId);
    }
    return writer;
  }
  PBAvatarAttach2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal5.default.Reader ? input : import_minimal5.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAvatarAttach();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.avatarId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.anchorPointId = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAvatarAttach2.decode = decode;
})(PBAvatarAttach || (PBAvatarAttach = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AvatarAttach.gen.js
var AvatarAttachSchema = {
  COMPONENT_ID: 1073,
  serialize(value, builder) {
    const writer = PBAvatarAttach.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAvatarAttach.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAvatarAttach.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAvatarAttach"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_base.gen.js
var import_minimal7 = __toESM(require_minimal2());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/common/colors.gen.js
var import_minimal6 = __toESM(require_minimal2());
function createBaseColor3() {
  return { r: 0, g: 0, b: 0 };
}
var Color3;
(function(Color33) {
  function encode(message, writer = import_minimal6.default.Writer.create()) {
    if (message.r !== 0) {
      writer.uint32(13).float(message.r);
    }
    if (message.g !== 0) {
      writer.uint32(21).float(message.g);
    }
    if (message.b !== 0) {
      writer.uint32(29).float(message.b);
    }
    return writer;
  }
  Color33.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal6.default.Reader ? input : import_minimal6.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseColor3();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.r = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.g = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.b = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Color33.decode = decode;
})(Color3 || (Color3 = {}));
function createBaseColor4() {
  return { r: 0, g: 0, b: 0, a: 0 };
}
var Color4;
(function(Color43) {
  function encode(message, writer = import_minimal6.default.Writer.create()) {
    if (message.r !== 0) {
      writer.uint32(13).float(message.r);
    }
    if (message.g !== 0) {
      writer.uint32(21).float(message.g);
    }
    if (message.b !== 0) {
      writer.uint32(29).float(message.b);
    }
    if (message.a !== 0) {
      writer.uint32(37).float(message.a);
    }
    return writer;
  }
  Color43.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal6.default.Reader ? input : import_minimal6.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseColor4();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.r = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.g = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.b = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.a = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Color43.decode = decode;
})(Color4 || (Color4 = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_base.gen.js
function createBasePBAvatarBase() {
  return { skinColor: void 0, eyesColor: void 0, hairColor: void 0, bodyShapeUrn: "", name: "" };
}
var PBAvatarBase;
(function(PBAvatarBase2) {
  function encode(message, writer = import_minimal7.default.Writer.create()) {
    if (message.skinColor !== void 0) {
      Color3.encode(message.skinColor, writer.uint32(10).fork()).ldelim();
    }
    if (message.eyesColor !== void 0) {
      Color3.encode(message.eyesColor, writer.uint32(18).fork()).ldelim();
    }
    if (message.hairColor !== void 0) {
      Color3.encode(message.hairColor, writer.uint32(26).fork()).ldelim();
    }
    if (message.bodyShapeUrn !== "") {
      writer.uint32(34).string(message.bodyShapeUrn);
    }
    if (message.name !== "") {
      writer.uint32(42).string(message.name);
    }
    return writer;
  }
  PBAvatarBase2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal7.default.Reader ? input : import_minimal7.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAvatarBase();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.skinColor = Color3.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.eyesColor = Color3.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.hairColor = Color3.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.bodyShapeUrn = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAvatarBase2.decode = decode;
})(PBAvatarBase || (PBAvatarBase = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AvatarBase.gen.js
var AvatarBaseSchema = {
  COMPONENT_ID: 1087,
  serialize(value, builder) {
    const writer = PBAvatarBase.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAvatarBase.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAvatarBase.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAvatarBase"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_emote_command.gen.js
var import_minimal8 = __toESM(require_minimal2());
function createBasePBAvatarEmoteCommand() {
  return { emoteUrn: "", loop: false, timestamp: 0 };
}
var PBAvatarEmoteCommand;
(function(PBAvatarEmoteCommand2) {
  function encode(message, writer = import_minimal8.default.Writer.create()) {
    if (message.emoteUrn !== "") {
      writer.uint32(10).string(message.emoteUrn);
    }
    if (message.loop === true) {
      writer.uint32(16).bool(message.loop);
    }
    if (message.timestamp !== 0) {
      writer.uint32(24).uint32(message.timestamp);
    }
    return writer;
  }
  PBAvatarEmoteCommand2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal8.default.Reader ? input : import_minimal8.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAvatarEmoteCommand();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.emoteUrn = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.loop = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.timestamp = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAvatarEmoteCommand2.decode = decode;
})(PBAvatarEmoteCommand || (PBAvatarEmoteCommand = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AvatarEmoteCommand.gen.js
var AvatarEmoteCommandSchema = {
  COMPONENT_ID: 1088,
  serialize(value, builder) {
    const writer = PBAvatarEmoteCommand.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAvatarEmoteCommand.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAvatarEmoteCommand.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAvatarEmoteCommand"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_equipped_data.gen.js
var import_minimal9 = __toESM(require_minimal2());
function createBasePBAvatarEquippedData() {
  return { wearableUrns: [], emoteUrns: [] };
}
var PBAvatarEquippedData;
(function(PBAvatarEquippedData2) {
  function encode(message, writer = import_minimal9.default.Writer.create()) {
    for (const v of message.wearableUrns) {
      writer.uint32(10).string(v);
    }
    for (const v of message.emoteUrns) {
      writer.uint32(18).string(v);
    }
    return writer;
  }
  PBAvatarEquippedData2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal9.default.Reader ? input : import_minimal9.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAvatarEquippedData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.wearableUrns.push(reader.string());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.emoteUrns.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAvatarEquippedData2.decode = decode;
})(PBAvatarEquippedData || (PBAvatarEquippedData = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AvatarEquippedData.gen.js
var AvatarEquippedDataSchema = {
  COMPONENT_ID: 1091,
  serialize(value, builder) {
    const writer = PBAvatarEquippedData.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAvatarEquippedData.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAvatarEquippedData.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAvatarEquippedData"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_modifier_area.gen.js
var import_minimal11 = __toESM(require_minimal2());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/common/vectors.gen.js
var import_minimal10 = __toESM(require_minimal2());
function createBasePosition() {
  return { x: 0, y: 0, z: 0 };
}
var Position;
(function(Position2) {
  function encode(message, writer = import_minimal10.default.Writer.create()) {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    if (message.z !== 0) {
      writer.uint32(29).float(message.z);
    }
    return writer;
  }
  Position2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal10.default.Reader ? input : import_minimal10.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePosition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.x = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.y = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.z = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Position2.decode = decode;
})(Position || (Position = {}));
function createBaseVector3() {
  return { x: 0, y: 0, z: 0 };
}
var Vector3;
(function(Vector33) {
  function encode(message, writer = import_minimal10.default.Writer.create()) {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    if (message.z !== 0) {
      writer.uint32(29).float(message.z);
    }
    return writer;
  }
  Vector33.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal10.default.Reader ? input : import_minimal10.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseVector3();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.x = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.y = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.z = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Vector33.decode = decode;
})(Vector3 || (Vector3 = {}));
function createBaseVector2() {
  return { x: 0, y: 0 };
}
var Vector2;
(function(Vector23) {
  function encode(message, writer = import_minimal10.default.Writer.create()) {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    return writer;
  }
  Vector23.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal10.default.Reader ? input : import_minimal10.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseVector2();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.x = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.y = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Vector23.decode = decode;
})(Vector2 || (Vector2 = {}));
function createBaseQuaternion() {
  return { x: 0, y: 0, z: 0, w: 0 };
}
var Quaternion;
(function(Quaternion3) {
  function encode(message, writer = import_minimal10.default.Writer.create()) {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    if (message.z !== 0) {
      writer.uint32(29).float(message.z);
    }
    if (message.w !== 0) {
      writer.uint32(37).float(message.w);
    }
    return writer;
  }
  Quaternion3.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal10.default.Reader ? input : import_minimal10.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseQuaternion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.x = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.y = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.z = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.w = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Quaternion3.decode = decode;
})(Quaternion || (Quaternion = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_modifier_area.gen.js
var AvatarModifierType;
(function(AvatarModifierType2) {
  AvatarModifierType2[AvatarModifierType2["AMT_HIDE_AVATARS"] = 0] = "AMT_HIDE_AVATARS";
  AvatarModifierType2[AvatarModifierType2["AMT_DISABLE_PASSPORTS"] = 1] = "AMT_DISABLE_PASSPORTS";
})(AvatarModifierType || (AvatarModifierType = {}));
function createBasePBAvatarModifierArea() {
  return { area: void 0, excludeIds: [], modifiers: [] };
}
var PBAvatarModifierArea;
(function(PBAvatarModifierArea2) {
  function encode(message, writer = import_minimal11.default.Writer.create()) {
    if (message.area !== void 0) {
      Vector3.encode(message.area, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.excludeIds) {
      writer.uint32(18).string(v);
    }
    writer.uint32(26).fork();
    for (const v of message.modifiers) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  }
  PBAvatarModifierArea2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal11.default.Reader ? input : import_minimal11.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAvatarModifierArea();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.area = Vector3.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.excludeIds.push(reader.string());
          continue;
        case 3:
          if (tag === 24) {
            message.modifiers.push(reader.int32());
            continue;
          }
          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.modifiers.push(reader.int32());
            }
            continue;
          }
          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAvatarModifierArea2.decode = decode;
})(PBAvatarModifierArea || (PBAvatarModifierArea = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AvatarModifierArea.gen.js
var AvatarModifierAreaSchema = {
  COMPONENT_ID: 1070,
  serialize(value, builder) {
    const writer = PBAvatarModifierArea.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAvatarModifierArea.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAvatarModifierArea.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAvatarModifierArea"
  }
};

// ../../node_modules/.pnpm/long@5.3.2/node_modules/long/index.js
var wasm = null;
try {
  wasm = new WebAssembly.Instance(
    new WebAssembly.Module(
      new Uint8Array([
        // \0asm
        0,
        97,
        115,
        109,
        // version 1
        1,
        0,
        0,
        0,
        // section "type"
        1,
        13,
        2,
        // 0, () => i32
        96,
        0,
        1,
        127,
        // 1, (i32, i32, i32, i32) => i32
        96,
        4,
        127,
        127,
        127,
        127,
        1,
        127,
        // section "function"
        3,
        7,
        6,
        // 0, type 0
        0,
        // 1, type 1
        1,
        // 2, type 1
        1,
        // 3, type 1
        1,
        // 4, type 1
        1,
        // 5, type 1
        1,
        // section "global"
        6,
        6,
        1,
        // 0, "high", mutable i32
        127,
        1,
        65,
        0,
        11,
        // section "export"
        7,
        50,
        6,
        // 0, "mul"
        3,
        109,
        117,
        108,
        0,
        1,
        // 1, "div_s"
        5,
        100,
        105,
        118,
        95,
        115,
        0,
        2,
        // 2, "div_u"
        5,
        100,
        105,
        118,
        95,
        117,
        0,
        3,
        // 3, "rem_s"
        5,
        114,
        101,
        109,
        95,
        115,
        0,
        4,
        // 4, "rem_u"
        5,
        114,
        101,
        109,
        95,
        117,
        0,
        5,
        // 5, "get_high"
        8,
        103,
        101,
        116,
        95,
        104,
        105,
        103,
        104,
        0,
        0,
        // section "code"
        10,
        191,
        1,
        6,
        // 0, "get_high"
        4,
        0,
        35,
        0,
        11,
        // 1, "mul"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        126,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        // 2, "div_s"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        127,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        // 3, "div_u"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        128,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        // 4, "rem_s"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        129,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        // 5, "rem_u"
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        130,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11
      ])
    ),
    {}
  ).exports;
} catch {
}
function Long(low, high, unsigned) {
  this.low = low | 0;
  this.high = high | 0;
  this.unsigned = !!unsigned;
}
Long.prototype.__isLong__;
Object.defineProperty(Long.prototype, "__isLong__", { value: true });
function isLong(obj) {
  return (obj && obj["__isLong__"]) === true;
}
function ctz32(value) {
  var c = Math.clz32(value & -value);
  return value ? 31 - c : c;
}
Long.isLong = isLong;
var INT_CACHE = {};
var UINT_CACHE = {};
function fromInt(value, unsigned) {
  var obj, cachedObj, cache;
  if (unsigned) {
    value >>>= 0;
    if (cache = 0 <= value && value < 256) {
      cachedObj = UINT_CACHE[value];
      if (cachedObj)
        return cachedObj;
    }
    obj = fromBits(value, 0, true);
    if (cache)
      UINT_CACHE[value] = obj;
    return obj;
  } else {
    value |= 0;
    if (cache = -128 <= value && value < 128) {
      cachedObj = INT_CACHE[value];
      if (cachedObj)
        return cachedObj;
    }
    obj = fromBits(value, value < 0 ? -1 : 0, false);
    if (cache)
      INT_CACHE[value] = obj;
    return obj;
  }
}
Long.fromInt = fromInt;
function fromNumber(value, unsigned) {
  if (isNaN(value))
    return unsigned ? UZERO : ZERO;
  if (unsigned) {
    if (value < 0)
      return UZERO;
    if (value >= TWO_PWR_64_DBL)
      return MAX_UNSIGNED_VALUE;
  } else {
    if (value <= -TWO_PWR_63_DBL)
      return MIN_VALUE;
    if (value + 1 >= TWO_PWR_63_DBL)
      return MAX_VALUE;
  }
  if (value < 0)
    return fromNumber(-value, unsigned).neg();
  return fromBits(
    value % TWO_PWR_32_DBL | 0,
    value / TWO_PWR_32_DBL | 0,
    unsigned
  );
}
Long.fromNumber = fromNumber;
function fromBits(lowBits, highBits, unsigned) {
  return new Long(lowBits, highBits, unsigned);
}
Long.fromBits = fromBits;
var pow_dbl = Math.pow;
function fromString(str, unsigned, radix) {
  if (str.length === 0)
    throw Error("empty string");
  if (typeof unsigned === "number") {
    radix = unsigned;
    unsigned = false;
  } else {
    unsigned = !!unsigned;
  }
  if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
    return unsigned ? UZERO : ZERO;
  radix = radix || 10;
  if (radix < 2 || 36 < radix)
    throw RangeError("radix");
  var p;
  if ((p = str.indexOf("-")) > 0)
    throw Error("interior hyphen");
  else if (p === 0) {
    return fromString(str.substring(1), unsigned, radix).neg();
  }
  var radixToPower = fromNumber(pow_dbl(radix, 8));
  var result = ZERO;
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = fromNumber(pow_dbl(radix, size));
      result = result.mul(power).add(fromNumber(value));
    } else {
      result = result.mul(radixToPower);
      result = result.add(fromNumber(value));
    }
  }
  result.unsigned = unsigned;
  return result;
}
Long.fromString = fromString;
function fromValue(val, unsigned) {
  if (typeof val === "number")
    return fromNumber(val, unsigned);
  if (typeof val === "string")
    return fromString(val, unsigned);
  return fromBits(
    val.low,
    val.high,
    typeof unsigned === "boolean" ? unsigned : val.unsigned
  );
}
Long.fromValue = fromValue;
var TWO_PWR_16_DBL = 1 << 16;
var TWO_PWR_24_DBL = 1 << 24;
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
var ZERO = fromInt(0);
Long.ZERO = ZERO;
var UZERO = fromInt(0, true);
Long.UZERO = UZERO;
var ONE = fromInt(1);
Long.ONE = ONE;
var UONE = fromInt(1, true);
Long.UONE = UONE;
var NEG_ONE = fromInt(-1);
Long.NEG_ONE = NEG_ONE;
var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
Long.MAX_VALUE = MAX_VALUE;
var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
Long.MIN_VALUE = MIN_VALUE;
var LongPrototype = Long.prototype;
LongPrototype.toInt = function toInt() {
  return this.unsigned ? this.low >>> 0 : this.low;
};
LongPrototype.toNumber = function toNumber() {
  if (this.unsigned)
    return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
  return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};
LongPrototype.toString = function toString(radix) {
  radix = radix || 10;
  if (radix < 2 || 36 < radix)
    throw RangeError("radix");
  if (this.isZero())
    return "0";
  if (this.isNegative()) {
    if (this.eq(MIN_VALUE)) {
      var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
      return div.toString(radix) + rem1.toInt().toString(radix);
    } else
      return "-" + this.neg().toString(radix);
  }
  var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
  var result = "";
  while (true) {
    var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
    rem = remDiv;
    if (rem.isZero())
      return digits + result;
    else {
      while (digits.length < 6)
        digits = "0" + digits;
      result = "" + digits + result;
    }
  }
};
LongPrototype.getHighBits = function getHighBits() {
  return this.high;
};
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
  return this.high >>> 0;
};
LongPrototype.getLowBits = function getLowBits() {
  return this.low;
};
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
  return this.low >>> 0;
};
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
  if (this.isNegative())
    return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
  var val = this.high != 0 ? this.high : this.low;
  for (var bit = 31; bit > 0; bit--)
    if ((val & 1 << bit) != 0)
      break;
  return this.high != 0 ? bit + 33 : bit + 1;
};
LongPrototype.isSafeInteger = function isSafeInteger() {
  var top11Bits = this.high >> 21;
  if (!top11Bits)
    return true;
  if (this.unsigned)
    return false;
  return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
};
LongPrototype.isZero = function isZero() {
  return this.high === 0 && this.low === 0;
};
LongPrototype.eqz = LongPrototype.isZero;
LongPrototype.isNegative = function isNegative() {
  return !this.unsigned && this.high < 0;
};
LongPrototype.isPositive = function isPositive() {
  return this.unsigned || this.high >= 0;
};
LongPrototype.isOdd = function isOdd() {
  return (this.low & 1) === 1;
};
LongPrototype.isEven = function isEven() {
  return (this.low & 1) === 0;
};
LongPrototype.equals = function equals(other) {
  if (!isLong(other))
    other = fromValue(other);
  if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
    return false;
  return this.high === other.high && this.low === other.low;
};
LongPrototype.eq = LongPrototype.equals;
LongPrototype.notEquals = function notEquals(other) {
  return !this.eq(
    /* validates */
    other
  );
};
LongPrototype.neq = LongPrototype.notEquals;
LongPrototype.ne = LongPrototype.notEquals;
LongPrototype.lessThan = function lessThan(other) {
  return this.comp(
    /* validates */
    other
  ) < 0;
};
LongPrototype.lt = LongPrototype.lessThan;
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
  return this.comp(
    /* validates */
    other
  ) <= 0;
};
LongPrototype.lte = LongPrototype.lessThanOrEqual;
LongPrototype.le = LongPrototype.lessThanOrEqual;
LongPrototype.greaterThan = function greaterThan(other) {
  return this.comp(
    /* validates */
    other
  ) > 0;
};
LongPrototype.gt = LongPrototype.greaterThan;
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
  return this.comp(
    /* validates */
    other
  ) >= 0;
};
LongPrototype.gte = LongPrototype.greaterThanOrEqual;
LongPrototype.ge = LongPrototype.greaterThanOrEqual;
LongPrototype.compare = function compare(other) {
  if (!isLong(other))
    other = fromValue(other);
  if (this.eq(other))
    return 0;
  var thisNeg = this.isNegative(), otherNeg = other.isNegative();
  if (thisNeg && !otherNeg)
    return -1;
  if (!thisNeg && otherNeg)
    return 1;
  if (!this.unsigned)
    return this.sub(other).isNegative() ? -1 : 1;
  return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
};
LongPrototype.comp = LongPrototype.compare;
LongPrototype.negate = function negate() {
  if (!this.unsigned && this.eq(MIN_VALUE))
    return MIN_VALUE;
  return this.not().add(ONE);
};
LongPrototype.neg = LongPrototype.negate;
LongPrototype.add = function add(addend) {
  if (!isLong(addend))
    addend = fromValue(addend);
  var a48 = this.high >>> 16;
  var a32 = this.high & 65535;
  var a16 = this.low >>> 16;
  var a00 = this.low & 65535;
  var b48 = addend.high >>> 16;
  var b32 = addend.high & 65535;
  var b16 = addend.low >>> 16;
  var b00 = addend.low & 65535;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 65535;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c48 += a48 + b48;
  c48 &= 65535;
  return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
};
LongPrototype.subtract = function subtract(subtrahend) {
  if (!isLong(subtrahend))
    subtrahend = fromValue(subtrahend);
  return this.add(subtrahend.neg());
};
LongPrototype.sub = LongPrototype.subtract;
LongPrototype.multiply = function multiply(multiplier) {
  if (this.isZero())
    return this;
  if (!isLong(multiplier))
    multiplier = fromValue(multiplier);
  if (wasm) {
    var low = wasm["mul"](this.low, this.high, multiplier.low, multiplier.high);
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  if (multiplier.isZero())
    return this.unsigned ? UZERO : ZERO;
  if (this.eq(MIN_VALUE))
    return multiplier.isOdd() ? MIN_VALUE : ZERO;
  if (multiplier.eq(MIN_VALUE))
    return this.isOdd() ? MIN_VALUE : ZERO;
  if (this.isNegative()) {
    if (multiplier.isNegative())
      return this.neg().mul(multiplier.neg());
    else
      return this.neg().mul(multiplier).neg();
  } else if (multiplier.isNegative())
    return this.mul(multiplier.neg()).neg();
  if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
    return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
  var a48 = this.high >>> 16;
  var a32 = this.high & 65535;
  var a16 = this.low >>> 16;
  var a00 = this.low & 65535;
  var b48 = multiplier.high >>> 16;
  var b32 = multiplier.high & 65535;
  var b16 = multiplier.low >>> 16;
  var b00 = multiplier.low & 65535;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 65535;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 65535;
  return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
};
LongPrototype.mul = LongPrototype.multiply;
LongPrototype.divide = function divide(divisor) {
  if (!isLong(divisor))
    divisor = fromValue(divisor);
  if (divisor.isZero())
    throw Error("division by zero");
  if (wasm) {
    if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
      return this;
    }
    var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
      this.low,
      this.high,
      divisor.low,
      divisor.high
    );
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  if (this.isZero())
    return this.unsigned ? UZERO : ZERO;
  var approx, rem, res;
  if (!this.unsigned) {
    if (this.eq(MIN_VALUE)) {
      if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
        return MIN_VALUE;
      else if (divisor.eq(MIN_VALUE))
        return ONE;
      else {
        var halfThis = this.shr(1);
        approx = halfThis.div(divisor).shl(1);
        if (approx.eq(ZERO)) {
          return divisor.isNegative() ? ONE : NEG_ONE;
        } else {
          rem = this.sub(divisor.mul(approx));
          res = approx.add(rem.div(divisor));
          return res;
        }
      }
    } else if (divisor.eq(MIN_VALUE))
      return this.unsigned ? UZERO : ZERO;
    if (this.isNegative()) {
      if (divisor.isNegative())
        return this.neg().div(divisor.neg());
      return this.neg().div(divisor).neg();
    } else if (divisor.isNegative())
      return this.div(divisor.neg()).neg();
    res = ZERO;
  } else {
    if (!divisor.unsigned)
      divisor = divisor.toUnsigned();
    if (divisor.gt(this))
      return UZERO;
    if (divisor.gt(this.shru(1)))
      return UONE;
    res = UZERO;
  }
  rem = this;
  while (rem.gte(divisor)) {
    approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
    var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
    while (approxRem.isNegative() || approxRem.gt(rem)) {
      approx -= delta;
      approxRes = fromNumber(approx, this.unsigned);
      approxRem = approxRes.mul(divisor);
    }
    if (approxRes.isZero())
      approxRes = ONE;
    res = res.add(approxRes);
    rem = rem.sub(approxRem);
  }
  return res;
};
LongPrototype.div = LongPrototype.divide;
LongPrototype.modulo = function modulo(divisor) {
  if (!isLong(divisor))
    divisor = fromValue(divisor);
  if (wasm) {
    var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
      this.low,
      this.high,
      divisor.low,
      divisor.high
    );
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  return this.sub(this.div(divisor).mul(divisor));
};
LongPrototype.mod = LongPrototype.modulo;
LongPrototype.rem = LongPrototype.modulo;
LongPrototype.not = function not() {
  return fromBits(~this.low, ~this.high, this.unsigned);
};
LongPrototype.countLeadingZeros = function countLeadingZeros() {
  return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
};
LongPrototype.clz = LongPrototype.countLeadingZeros;
LongPrototype.countTrailingZeros = function countTrailingZeros() {
  return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
};
LongPrototype.ctz = LongPrototype.countTrailingZeros;
LongPrototype.and = function and(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};
LongPrototype.or = function or(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};
LongPrototype.xor = function xor(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};
LongPrototype.shiftLeft = function shiftLeft(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  else if (numBits < 32)
    return fromBits(
      this.low << numBits,
      this.high << numBits | this.low >>> 32 - numBits,
      this.unsigned
    );
  else
    return fromBits(0, this.low << numBits - 32, this.unsigned);
};
LongPrototype.shl = LongPrototype.shiftLeft;
LongPrototype.shiftRight = function shiftRight(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  else if (numBits < 32)
    return fromBits(
      this.low >>> numBits | this.high << 32 - numBits,
      this.high >> numBits,
      this.unsigned
    );
  else
    return fromBits(
      this.high >> numBits - 32,
      this.high >= 0 ? 0 : -1,
      this.unsigned
    );
};
LongPrototype.shr = LongPrototype.shiftRight;
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits < 32)
    return fromBits(
      this.low >>> numBits | this.high << 32 - numBits,
      this.high >>> numBits,
      this.unsigned
    );
  if (numBits === 32)
    return fromBits(this.high, 0, this.unsigned);
  return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
};
LongPrototype.shru = LongPrototype.shiftRightUnsigned;
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
LongPrototype.rotateLeft = function rotateLeft(numBits) {
  var b;
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits === 32)
    return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits(
      this.low << numBits | this.high >>> b,
      this.high << numBits | this.low >>> b,
      this.unsigned
    );
  }
  numBits -= 32;
  b = 32 - numBits;
  return fromBits(
    this.high << numBits | this.low >>> b,
    this.low << numBits | this.high >>> b,
    this.unsigned
  );
};
LongPrototype.rotl = LongPrototype.rotateLeft;
LongPrototype.rotateRight = function rotateRight(numBits) {
  var b;
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits === 32)
    return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits(
      this.high << b | this.low >>> numBits,
      this.low << b | this.high >>> numBits,
      this.unsigned
    );
  }
  numBits -= 32;
  b = 32 - numBits;
  return fromBits(
    this.low << b | this.high >>> numBits,
    this.high << b | this.low >>> numBits,
    this.unsigned
  );
};
LongPrototype.rotr = LongPrototype.rotateRight;
LongPrototype.toSigned = function toSigned() {
  if (!this.unsigned)
    return this;
  return fromBits(this.low, this.high, false);
};
LongPrototype.toUnsigned = function toUnsigned() {
  if (this.unsigned)
    return this;
  return fromBits(this.low, this.high, true);
};
LongPrototype.toBytes = function toBytes(le) {
  return le ? this.toBytesLE() : this.toBytesBE();
};
LongPrototype.toBytesLE = function toBytesLE() {
  var hi = this.high, lo = this.low;
  return [
    lo & 255,
    lo >>> 8 & 255,
    lo >>> 16 & 255,
    lo >>> 24,
    hi & 255,
    hi >>> 8 & 255,
    hi >>> 16 & 255,
    hi >>> 24
  ];
};
LongPrototype.toBytesBE = function toBytesBE() {
  var hi = this.high, lo = this.low;
  return [
    hi >>> 24,
    hi >>> 16 & 255,
    hi >>> 8 & 255,
    hi & 255,
    lo >>> 24,
    lo >>> 16 & 255,
    lo >>> 8 & 255,
    lo & 255
  ];
};
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
  return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
  return new Long(
    bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
    bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
    unsigned
  );
};
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
  return new Long(
    bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
    bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
    unsigned
  );
};
if (typeof BigInt === "function") {
  Long.fromBigInt = function fromBigInt(value, unsigned) {
    var lowBits = Number(BigInt.asIntN(32, value));
    var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
    return fromBits(lowBits, highBits, unsigned);
  };
  Long.fromValue = function fromValueWithBigInt(value, unsigned) {
    if (typeof value === "bigint")
      return Long.fromBigInt(value, unsigned);
    return fromValue(value, unsigned);
  };
  LongPrototype.toBigInt = function toBigInt() {
    var lowBigInt = BigInt(this.low >>> 0);
    var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
    return highBigInt << BigInt(32) | lowBigInt;
  };
}
var long_default = Long;

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_shape.gen.js
var import_minimal12 = __toESM(require_minimal2());
function createBasePBAvatarShape() {
  return {
    id: "",
    name: void 0,
    bodyShape: void 0,
    skinColor: void 0,
    hairColor: void 0,
    eyeColor: void 0,
    expressionTriggerId: void 0,
    expressionTriggerTimestamp: void 0,
    talking: void 0,
    wearables: [],
    emotes: [],
    showOnlyWearables: void 0
  };
}
var PBAvatarShape;
(function(PBAvatarShape2) {
  function encode(message, writer = import_minimal12.default.Writer.create()) {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== void 0) {
      writer.uint32(18).string(message.name);
    }
    if (message.bodyShape !== void 0) {
      writer.uint32(26).string(message.bodyShape);
    }
    if (message.skinColor !== void 0) {
      Color3.encode(message.skinColor, writer.uint32(34).fork()).ldelim();
    }
    if (message.hairColor !== void 0) {
      Color3.encode(message.hairColor, writer.uint32(42).fork()).ldelim();
    }
    if (message.eyeColor !== void 0) {
      Color3.encode(message.eyeColor, writer.uint32(50).fork()).ldelim();
    }
    if (message.expressionTriggerId !== void 0) {
      writer.uint32(58).string(message.expressionTriggerId);
    }
    if (message.expressionTriggerTimestamp !== void 0) {
      writer.uint32(64).int64(message.expressionTriggerTimestamp);
    }
    if (message.talking !== void 0) {
      writer.uint32(72).bool(message.talking);
    }
    for (const v of message.wearables) {
      writer.uint32(82).string(v);
    }
    for (const v of message.emotes) {
      writer.uint32(90).string(v);
    }
    if (message.showOnlyWearables !== void 0) {
      writer.uint32(96).bool(message.showOnlyWearables);
    }
    return writer;
  }
  PBAvatarShape2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal12.default.Reader ? input : import_minimal12.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBAvatarShape();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.bodyShape = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.skinColor = Color3.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.hairColor = Color3.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.eyeColor = Color3.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }
          message.expressionTriggerId = reader.string();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }
          message.expressionTriggerTimestamp = longToNumber(reader.int64());
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }
          message.talking = reader.bool();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }
          message.wearables.push(reader.string());
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }
          message.emotes.push(reader.string());
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }
          message.showOnlyWearables = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBAvatarShape2.decode = decode;
})(PBAvatarShape || (PBAvatarShape = {}));
var tsProtoGlobalThis = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();
function longToNumber(long) {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}
if (import_minimal12.default.util.Long !== long_default) {
  import_minimal12.default.util.Long = long_default;
  import_minimal12.default.configure();
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/AvatarShape.gen.js
var AvatarShapeSchema = {
  COMPONENT_ID: 1080,
  serialize(value, builder) {
    const writer = PBAvatarShape.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBAvatarShape.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBAvatarShape.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBAvatarShape"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/billboard.gen.js
var import_minimal13 = __toESM(require_minimal2());
var BillboardMode;
(function(BillboardMode2) {
  BillboardMode2[BillboardMode2["BM_NONE"] = 0] = "BM_NONE";
  BillboardMode2[BillboardMode2["BM_X"] = 1] = "BM_X";
  BillboardMode2[BillboardMode2["BM_Y"] = 2] = "BM_Y";
  BillboardMode2[BillboardMode2["BM_Z"] = 4] = "BM_Z";
  BillboardMode2[BillboardMode2["BM_ALL"] = 7] = "BM_ALL";
})(BillboardMode || (BillboardMode = {}));
function createBasePBBillboard() {
  return { billboardMode: void 0 };
}
var PBBillboard;
(function(PBBillboard2) {
  function encode(message, writer = import_minimal13.default.Writer.create()) {
    if (message.billboardMode !== void 0) {
      writer.uint32(8).int32(message.billboardMode);
    }
    return writer;
  }
  PBBillboard2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal13.default.Reader ? input : import_minimal13.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBBillboard();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.billboardMode = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBBillboard2.decode = decode;
})(PBBillboard || (PBBillboard = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/Billboard.gen.js
var BillboardSchema = {
  COMPONENT_ID: 1090,
  serialize(value, builder) {
    const writer = PBBillboard.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBBillboard.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBBillboard.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBBillboard"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/camera_mode.gen.js
var import_minimal14 = __toESM(require_minimal2());
function createBasePBCameraMode() {
  return { mode: 0 };
}
var PBCameraMode;
(function(PBCameraMode2) {
  function encode(message, writer = import_minimal14.default.Writer.create()) {
    if (message.mode !== 0) {
      writer.uint32(8).int32(message.mode);
    }
    return writer;
  }
  PBCameraMode2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal14.default.Reader ? input : import_minimal14.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBCameraMode();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.mode = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBCameraMode2.decode = decode;
})(PBCameraMode || (PBCameraMode = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/CameraMode.gen.js
var CameraModeSchema = {
  COMPONENT_ID: 1072,
  serialize(value, builder) {
    const writer = PBCameraMode.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBCameraMode.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBCameraMode.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBCameraMode"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/camera_mode_area.gen.js
var import_minimal15 = __toESM(require_minimal2());
function createBasePBCameraModeArea() {
  return { area: void 0, mode: 0 };
}
var PBCameraModeArea;
(function(PBCameraModeArea2) {
  function encode(message, writer = import_minimal15.default.Writer.create()) {
    if (message.area !== void 0) {
      Vector3.encode(message.area, writer.uint32(10).fork()).ldelim();
    }
    if (message.mode !== 0) {
      writer.uint32(16).int32(message.mode);
    }
    return writer;
  }
  PBCameraModeArea2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal15.default.Reader ? input : import_minimal15.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBCameraModeArea();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.area = Vector3.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.mode = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBCameraModeArea2.decode = decode;
})(PBCameraModeArea || (PBCameraModeArea = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/CameraModeArea.gen.js
var CameraModeAreaSchema = {
  COMPONENT_ID: 1071,
  serialize(value, builder) {
    const writer = PBCameraModeArea.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBCameraModeArea.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBCameraModeArea.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBCameraModeArea"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/engine_info.gen.js
var import_minimal16 = __toESM(require_minimal2());
function createBasePBEngineInfo() {
  return { frameNumber: 0, totalRuntime: 0, tickNumber: 0 };
}
var PBEngineInfo;
(function(PBEngineInfo2) {
  function encode(message, writer = import_minimal16.default.Writer.create()) {
    if (message.frameNumber !== 0) {
      writer.uint32(8).uint32(message.frameNumber);
    }
    if (message.totalRuntime !== 0) {
      writer.uint32(21).float(message.totalRuntime);
    }
    if (message.tickNumber !== 0) {
      writer.uint32(24).uint32(message.tickNumber);
    }
    return writer;
  }
  PBEngineInfo2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal16.default.Reader ? input : import_minimal16.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBEngineInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.frameNumber = reader.uint32();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.totalRuntime = reader.float();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.tickNumber = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBEngineInfo2.decode = decode;
})(PBEngineInfo || (PBEngineInfo = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/EngineInfo.gen.js
var EngineInfoSchema = {
  COMPONENT_ID: 1048,
  serialize(value, builder) {
    const writer = PBEngineInfo.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBEngineInfo.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBEngineInfo.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBEngineInfo"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/gltf_container.gen.js
var import_minimal17 = __toESM(require_minimal2());
function createBasePBGltfContainer() {
  return { src: "", visibleMeshesCollisionMask: void 0, invisibleMeshesCollisionMask: void 0 };
}
var PBGltfContainer;
(function(PBGltfContainer2) {
  function encode(message, writer = import_minimal17.default.Writer.create()) {
    if (message.src !== "") {
      writer.uint32(10).string(message.src);
    }
    if (message.visibleMeshesCollisionMask !== void 0) {
      writer.uint32(32).uint32(message.visibleMeshesCollisionMask);
    }
    if (message.invisibleMeshesCollisionMask !== void 0) {
      writer.uint32(40).uint32(message.invisibleMeshesCollisionMask);
    }
    return writer;
  }
  PBGltfContainer2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal17.default.Reader ? input : import_minimal17.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBGltfContainer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.src = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.visibleMeshesCollisionMask = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.invisibleMeshesCollisionMask = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBGltfContainer2.decode = decode;
})(PBGltfContainer || (PBGltfContainer = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/GltfContainer.gen.js
var GltfContainerSchema = {
  COMPONENT_ID: 1041,
  serialize(value, builder) {
    const writer = PBGltfContainer.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBGltfContainer.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBGltfContainer.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBGltfContainer"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/gltf_container_loading_state.gen.js
var import_minimal18 = __toESM(require_minimal2());
function createBasePBGltfContainerLoadingState() {
  return { currentState: 0 };
}
var PBGltfContainerLoadingState;
(function(PBGltfContainerLoadingState2) {
  function encode(message, writer = import_minimal18.default.Writer.create()) {
    if (message.currentState !== 0) {
      writer.uint32(8).int32(message.currentState);
    }
    return writer;
  }
  PBGltfContainerLoadingState2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal18.default.Reader ? input : import_minimal18.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBGltfContainerLoadingState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.currentState = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBGltfContainerLoadingState2.decode = decode;
})(PBGltfContainerLoadingState || (PBGltfContainerLoadingState = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/GltfContainerLoadingState.gen.js
var GltfContainerLoadingStateSchema = {
  COMPONENT_ID: 1049,
  serialize(value, builder) {
    const writer = PBGltfContainerLoadingState.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBGltfContainerLoadingState.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBGltfContainerLoadingState.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBGltfContainerLoadingState"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/gltf_node_modifiers.gen.js
var import_minimal21 = __toESM(require_minimal2());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/material.gen.js
var import_minimal20 = __toESM(require_minimal2());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/common/texture.gen.js
var import_minimal19 = __toESM(require_minimal2());
var TextureWrapMode;
(function(TextureWrapMode2) {
  TextureWrapMode2[TextureWrapMode2["TWM_REPEAT"] = 0] = "TWM_REPEAT";
  TextureWrapMode2[TextureWrapMode2["TWM_CLAMP"] = 1] = "TWM_CLAMP";
  TextureWrapMode2[TextureWrapMode2["TWM_MIRROR"] = 2] = "TWM_MIRROR";
})(TextureWrapMode || (TextureWrapMode = {}));
var TextureFilterMode;
(function(TextureFilterMode2) {
  TextureFilterMode2[TextureFilterMode2["TFM_POINT"] = 0] = "TFM_POINT";
  TextureFilterMode2[TextureFilterMode2["TFM_BILINEAR"] = 1] = "TFM_BILINEAR";
  TextureFilterMode2[TextureFilterMode2["TFM_TRILINEAR"] = 2] = "TFM_TRILINEAR";
})(TextureFilterMode || (TextureFilterMode = {}));
function createBaseTexture() {
  return { src: "", wrapMode: void 0, filterMode: void 0, offset: void 0, tiling: void 0 };
}
var Texture;
(function(Texture2) {
  function encode(message, writer = import_minimal19.default.Writer.create()) {
    if (message.src !== "") {
      writer.uint32(10).string(message.src);
    }
    if (message.wrapMode !== void 0) {
      writer.uint32(16).int32(message.wrapMode);
    }
    if (message.filterMode !== void 0) {
      writer.uint32(24).int32(message.filterMode);
    }
    if (message.offset !== void 0) {
      Vector2.encode(message.offset, writer.uint32(34).fork()).ldelim();
    }
    if (message.tiling !== void 0) {
      Vector2.encode(message.tiling, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  }
  Texture2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal19.default.Reader ? input : import_minimal19.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseTexture();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.src = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.wrapMode = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.filterMode = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.offset = Vector2.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.tiling = Vector2.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Texture2.decode = decode;
})(Texture || (Texture = {}));
function createBaseAvatarTexture() {
  return { userId: "", wrapMode: void 0, filterMode: void 0 };
}
var AvatarTexture;
(function(AvatarTexture2) {
  function encode(message, writer = import_minimal19.default.Writer.create()) {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.wrapMode !== void 0) {
      writer.uint32(16).int32(message.wrapMode);
    }
    if (message.filterMode !== void 0) {
      writer.uint32(24).int32(message.filterMode);
    }
    return writer;
  }
  AvatarTexture2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal19.default.Reader ? input : import_minimal19.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseAvatarTexture();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.wrapMode = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.filterMode = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  AvatarTexture2.decode = decode;
})(AvatarTexture || (AvatarTexture = {}));
function createBaseVideoTexture() {
  return { videoPlayerEntity: 0, wrapMode: void 0, filterMode: void 0 };
}
var VideoTexture;
(function(VideoTexture2) {
  function encode(message, writer = import_minimal19.default.Writer.create()) {
    if (message.videoPlayerEntity !== 0) {
      writer.uint32(8).uint32(message.videoPlayerEntity);
    }
    if (message.wrapMode !== void 0) {
      writer.uint32(16).int32(message.wrapMode);
    }
    if (message.filterMode !== void 0) {
      writer.uint32(24).int32(message.filterMode);
    }
    return writer;
  }
  VideoTexture2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal19.default.Reader ? input : import_minimal19.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseVideoTexture();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.videoPlayerEntity = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.wrapMode = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.filterMode = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  VideoTexture2.decode = decode;
})(VideoTexture || (VideoTexture = {}));
function createBaseTextureUnion() {
  return { tex: void 0 };
}
var TextureUnion;
(function(TextureUnion2) {
  function encode(message, writer = import_minimal19.default.Writer.create()) {
    switch (message.tex?.$case) {
      case "texture":
        Texture.encode(message.tex.texture, writer.uint32(10).fork()).ldelim();
        break;
      case "avatarTexture":
        AvatarTexture.encode(message.tex.avatarTexture, writer.uint32(18).fork()).ldelim();
        break;
      case "videoTexture":
        VideoTexture.encode(message.tex.videoTexture, writer.uint32(26).fork()).ldelim();
        break;
    }
    return writer;
  }
  TextureUnion2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal19.default.Reader ? input : import_minimal19.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseTextureUnion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.tex = { $case: "texture", texture: Texture.decode(reader, reader.uint32()) };
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.tex = { $case: "avatarTexture", avatarTexture: AvatarTexture.decode(reader, reader.uint32()) };
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.tex = { $case: "videoTexture", videoTexture: VideoTexture.decode(reader, reader.uint32()) };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  TextureUnion2.decode = decode;
})(TextureUnion || (TextureUnion = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/material.gen.js
var MaterialTransparencyMode;
(function(MaterialTransparencyMode2) {
  MaterialTransparencyMode2[MaterialTransparencyMode2["MTM_OPAQUE"] = 0] = "MTM_OPAQUE";
  MaterialTransparencyMode2[MaterialTransparencyMode2["MTM_ALPHA_TEST"] = 1] = "MTM_ALPHA_TEST";
  MaterialTransparencyMode2[MaterialTransparencyMode2["MTM_ALPHA_BLEND"] = 2] = "MTM_ALPHA_BLEND";
  MaterialTransparencyMode2[MaterialTransparencyMode2["MTM_ALPHA_TEST_AND_ALPHA_BLEND"] = 3] = "MTM_ALPHA_TEST_AND_ALPHA_BLEND";
  MaterialTransparencyMode2[MaterialTransparencyMode2["MTM_AUTO"] = 4] = "MTM_AUTO";
})(MaterialTransparencyMode || (MaterialTransparencyMode = {}));
function createBasePBMaterial() {
  return { material: void 0 };
}
var PBMaterial;
(function(PBMaterial2) {
  function encode(message, writer = import_minimal20.default.Writer.create()) {
    switch (message.material?.$case) {
      case "unlit":
        PBMaterial_UnlitMaterial.encode(message.material.unlit, writer.uint32(10).fork()).ldelim();
        break;
      case "pbr":
        PBMaterial_PbrMaterial.encode(message.material.pbr, writer.uint32(18).fork()).ldelim();
        break;
    }
    return writer;
  }
  PBMaterial2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal20.default.Reader ? input : import_minimal20.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMaterial();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.material = { $case: "unlit", unlit: PBMaterial_UnlitMaterial.decode(reader, reader.uint32()) };
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.material = { $case: "pbr", pbr: PBMaterial_PbrMaterial.decode(reader, reader.uint32()) };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMaterial2.decode = decode;
})(PBMaterial || (PBMaterial = {}));
function createBasePBMaterial_UnlitMaterial() {
  return {
    texture: void 0,
    alphaTest: void 0,
    castShadows: void 0,
    diffuseColor: void 0,
    alphaTexture: void 0
  };
}
var PBMaterial_UnlitMaterial;
(function(PBMaterial_UnlitMaterial2) {
  function encode(message, writer = import_minimal20.default.Writer.create()) {
    if (message.texture !== void 0) {
      TextureUnion.encode(message.texture, writer.uint32(10).fork()).ldelim();
    }
    if (message.alphaTest !== void 0) {
      writer.uint32(21).float(message.alphaTest);
    }
    if (message.castShadows !== void 0) {
      writer.uint32(24).bool(message.castShadows);
    }
    if (message.diffuseColor !== void 0) {
      Color4.encode(message.diffuseColor, writer.uint32(34).fork()).ldelim();
    }
    if (message.alphaTexture !== void 0) {
      TextureUnion.encode(message.alphaTexture, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  }
  PBMaterial_UnlitMaterial2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal20.default.Reader ? input : import_minimal20.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMaterial_UnlitMaterial();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.texture = TextureUnion.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.alphaTest = reader.float();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.castShadows = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.diffuseColor = Color4.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.alphaTexture = TextureUnion.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMaterial_UnlitMaterial2.decode = decode;
})(PBMaterial_UnlitMaterial || (PBMaterial_UnlitMaterial = {}));
function createBasePBMaterial_PbrMaterial() {
  return {
    texture: void 0,
    alphaTest: void 0,
    castShadows: void 0,
    alphaTexture: void 0,
    emissiveTexture: void 0,
    bumpTexture: void 0,
    albedoColor: void 0,
    emissiveColor: void 0,
    reflectivityColor: void 0,
    transparencyMode: void 0,
    metallic: void 0,
    roughness: void 0,
    specularIntensity: void 0,
    emissiveIntensity: void 0,
    directIntensity: void 0
  };
}
var PBMaterial_PbrMaterial;
(function(PBMaterial_PbrMaterial2) {
  function encode(message, writer = import_minimal20.default.Writer.create()) {
    if (message.texture !== void 0) {
      TextureUnion.encode(message.texture, writer.uint32(10).fork()).ldelim();
    }
    if (message.alphaTest !== void 0) {
      writer.uint32(21).float(message.alphaTest);
    }
    if (message.castShadows !== void 0) {
      writer.uint32(24).bool(message.castShadows);
    }
    if (message.alphaTexture !== void 0) {
      TextureUnion.encode(message.alphaTexture, writer.uint32(34).fork()).ldelim();
    }
    if (message.emissiveTexture !== void 0) {
      TextureUnion.encode(message.emissiveTexture, writer.uint32(42).fork()).ldelim();
    }
    if (message.bumpTexture !== void 0) {
      TextureUnion.encode(message.bumpTexture, writer.uint32(50).fork()).ldelim();
    }
    if (message.albedoColor !== void 0) {
      Color4.encode(message.albedoColor, writer.uint32(58).fork()).ldelim();
    }
    if (message.emissiveColor !== void 0) {
      Color3.encode(message.emissiveColor, writer.uint32(66).fork()).ldelim();
    }
    if (message.reflectivityColor !== void 0) {
      Color3.encode(message.reflectivityColor, writer.uint32(74).fork()).ldelim();
    }
    if (message.transparencyMode !== void 0) {
      writer.uint32(80).int32(message.transparencyMode);
    }
    if (message.metallic !== void 0) {
      writer.uint32(93).float(message.metallic);
    }
    if (message.roughness !== void 0) {
      writer.uint32(101).float(message.roughness);
    }
    if (message.specularIntensity !== void 0) {
      writer.uint32(117).float(message.specularIntensity);
    }
    if (message.emissiveIntensity !== void 0) {
      writer.uint32(125).float(message.emissiveIntensity);
    }
    if (message.directIntensity !== void 0) {
      writer.uint32(133).float(message.directIntensity);
    }
    return writer;
  }
  PBMaterial_PbrMaterial2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal20.default.Reader ? input : import_minimal20.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMaterial_PbrMaterial();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.texture = TextureUnion.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.alphaTest = reader.float();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.castShadows = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.alphaTexture = TextureUnion.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.emissiveTexture = TextureUnion.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.bumpTexture = TextureUnion.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }
          message.albedoColor = Color4.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }
          message.emissiveColor = Color3.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }
          message.reflectivityColor = Color3.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }
          message.transparencyMode = reader.int32();
          continue;
        case 11:
          if (tag !== 93) {
            break;
          }
          message.metallic = reader.float();
          continue;
        case 12:
          if (tag !== 101) {
            break;
          }
          message.roughness = reader.float();
          continue;
        case 14:
          if (tag !== 117) {
            break;
          }
          message.specularIntensity = reader.float();
          continue;
        case 15:
          if (tag !== 125) {
            break;
          }
          message.emissiveIntensity = reader.float();
          continue;
        case 16:
          if (tag !== 133) {
            break;
          }
          message.directIntensity = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMaterial_PbrMaterial2.decode = decode;
})(PBMaterial_PbrMaterial || (PBMaterial_PbrMaterial = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/gltf_node_modifiers.gen.js
function createBasePBGltfNodeModifiers() {
  return { modifiers: [] };
}
var PBGltfNodeModifiers;
(function(PBGltfNodeModifiers2) {
  function encode(message, writer = import_minimal21.default.Writer.create()) {
    for (const v of message.modifiers) {
      PBGltfNodeModifiers_GltfNodeModifier.encode(v, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  }
  PBGltfNodeModifiers2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal21.default.Reader ? input : import_minimal21.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBGltfNodeModifiers();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.modifiers.push(PBGltfNodeModifiers_GltfNodeModifier.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBGltfNodeModifiers2.decode = decode;
})(PBGltfNodeModifiers || (PBGltfNodeModifiers = {}));
function createBasePBGltfNodeModifiers_GltfNodeModifier() {
  return { path: "", castShadows: void 0, material: void 0 };
}
var PBGltfNodeModifiers_GltfNodeModifier;
(function(PBGltfNodeModifiers_GltfNodeModifier2) {
  function encode(message, writer = import_minimal21.default.Writer.create()) {
    if (message.path !== "") {
      writer.uint32(10).string(message.path);
    }
    if (message.castShadows !== void 0) {
      writer.uint32(16).bool(message.castShadows);
    }
    if (message.material !== void 0) {
      PBMaterial.encode(message.material, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  }
  PBGltfNodeModifiers_GltfNodeModifier2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal21.default.Reader ? input : import_minimal21.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBGltfNodeModifiers_GltfNodeModifier();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.path = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.castShadows = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.material = PBMaterial.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBGltfNodeModifiers_GltfNodeModifier2.decode = decode;
})(PBGltfNodeModifiers_GltfNodeModifier || (PBGltfNodeModifiers_GltfNodeModifier = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/GltfNodeModifiers.gen.js
var GltfNodeModifiersSchema = {
  COMPONENT_ID: 1099,
  serialize(value, builder) {
    const writer = PBGltfNodeModifiers.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBGltfNodeModifiers.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBGltfNodeModifiers.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBGltfNodeModifiers"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/input_modifier.gen.js
var import_minimal22 = __toESM(require_minimal2());
function createBasePBInputModifier() {
  return { mode: void 0 };
}
var PBInputModifier;
(function(PBInputModifier2) {
  function encode(message, writer = import_minimal22.default.Writer.create()) {
    switch (message.mode?.$case) {
      case "standard":
        PBInputModifier_StandardInput.encode(message.mode.standard, writer.uint32(10).fork()).ldelim();
        break;
    }
    return writer;
  }
  PBInputModifier2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal22.default.Reader ? input : import_minimal22.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBInputModifier();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.mode = { $case: "standard", standard: PBInputModifier_StandardInput.decode(reader, reader.uint32()) };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBInputModifier2.decode = decode;
})(PBInputModifier || (PBInputModifier = {}));
function createBasePBInputModifier_StandardInput() {
  return {
    disableAll: void 0,
    disableWalk: void 0,
    disableJog: void 0,
    disableRun: void 0,
    disableJump: void 0,
    disableEmote: void 0
  };
}
var PBInputModifier_StandardInput;
(function(PBInputModifier_StandardInput2) {
  function encode(message, writer = import_minimal22.default.Writer.create()) {
    if (message.disableAll !== void 0) {
      writer.uint32(8).bool(message.disableAll);
    }
    if (message.disableWalk !== void 0) {
      writer.uint32(16).bool(message.disableWalk);
    }
    if (message.disableJog !== void 0) {
      writer.uint32(24).bool(message.disableJog);
    }
    if (message.disableRun !== void 0) {
      writer.uint32(32).bool(message.disableRun);
    }
    if (message.disableJump !== void 0) {
      writer.uint32(40).bool(message.disableJump);
    }
    if (message.disableEmote !== void 0) {
      writer.uint32(48).bool(message.disableEmote);
    }
    return writer;
  }
  PBInputModifier_StandardInput2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal22.default.Reader ? input : import_minimal22.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBInputModifier_StandardInput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.disableAll = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.disableWalk = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.disableJog = reader.bool();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.disableRun = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.disableJump = reader.bool();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }
          message.disableEmote = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBInputModifier_StandardInput2.decode = decode;
})(PBInputModifier_StandardInput || (PBInputModifier_StandardInput = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/InputModifier.gen.js
var InputModifierSchema = {
  COMPONENT_ID: 1078,
  serialize(value, builder) {
    const writer = PBInputModifier.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBInputModifier.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBInputModifier.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBInputModifier"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/light_source.gen.js
var import_minimal23 = __toESM(require_minimal2());
function createBasePBLightSource() {
  return {
    active: void 0,
    color: void 0,
    intensity: void 0,
    range: void 0,
    shadow: void 0,
    shadowMaskTexture: void 0,
    type: void 0
  };
}
var PBLightSource;
(function(PBLightSource2) {
  function encode(message, writer = import_minimal23.default.Writer.create()) {
    if (message.active !== void 0) {
      writer.uint32(8).bool(message.active);
    }
    if (message.color !== void 0) {
      Color3.encode(message.color, writer.uint32(18).fork()).ldelim();
    }
    if (message.intensity !== void 0) {
      writer.uint32(29).float(message.intensity);
    }
    if (message.range !== void 0) {
      writer.uint32(37).float(message.range);
    }
    if (message.shadow !== void 0) {
      writer.uint32(40).bool(message.shadow);
    }
    if (message.shadowMaskTexture !== void 0) {
      TextureUnion.encode(message.shadowMaskTexture, writer.uint32(50).fork()).ldelim();
    }
    switch (message.type?.$case) {
      case "point":
        PBLightSource_Point.encode(message.type.point, writer.uint32(58).fork()).ldelim();
        break;
      case "spot":
        PBLightSource_Spot.encode(message.type.spot, writer.uint32(66).fork()).ldelim();
        break;
    }
    return writer;
  }
  PBLightSource2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal23.default.Reader ? input : import_minimal23.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBLightSource();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.active = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.color = Color3.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.intensity = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.range = reader.float();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.shadow = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.shadowMaskTexture = TextureUnion.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }
          message.type = { $case: "point", point: PBLightSource_Point.decode(reader, reader.uint32()) };
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }
          message.type = { $case: "spot", spot: PBLightSource_Spot.decode(reader, reader.uint32()) };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBLightSource2.decode = decode;
})(PBLightSource || (PBLightSource = {}));
function createBasePBLightSource_Point() {
  return {};
}
var PBLightSource_Point;
(function(PBLightSource_Point2) {
  function encode(_, writer = import_minimal23.default.Writer.create()) {
    return writer;
  }
  PBLightSource_Point2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal23.default.Reader ? input : import_minimal23.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBLightSource_Point();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBLightSource_Point2.decode = decode;
})(PBLightSource_Point || (PBLightSource_Point = {}));
function createBasePBLightSource_Spot() {
  return { innerAngle: void 0, outerAngle: void 0 };
}
var PBLightSource_Spot;
(function(PBLightSource_Spot2) {
  function encode(message, writer = import_minimal23.default.Writer.create()) {
    if (message.innerAngle !== void 0) {
      writer.uint32(77).float(message.innerAngle);
    }
    if (message.outerAngle !== void 0) {
      writer.uint32(85).float(message.outerAngle);
    }
    return writer;
  }
  PBLightSource_Spot2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal23.default.Reader ? input : import_minimal23.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBLightSource_Spot();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 9:
          if (tag !== 77) {
            break;
          }
          message.innerAngle = reader.float();
          continue;
        case 10:
          if (tag !== 85) {
            break;
          }
          message.outerAngle = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBLightSource_Spot2.decode = decode;
})(PBLightSource_Spot || (PBLightSource_Spot = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/LightSource.gen.js
var LightSourceSchema = {
  COMPONENT_ID: 1079,
  serialize(value, builder) {
    const writer = PBLightSource.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBLightSource.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBLightSource.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBLightSource"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/main_camera.gen.js
var import_minimal24 = __toESM(require_minimal2());
function createBasePBMainCamera() {
  return { virtualCameraEntity: void 0 };
}
var PBMainCamera;
(function(PBMainCamera2) {
  function encode(message, writer = import_minimal24.default.Writer.create()) {
    if (message.virtualCameraEntity !== void 0) {
      writer.uint32(8).uint32(message.virtualCameraEntity);
    }
    return writer;
  }
  PBMainCamera2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal24.default.Reader ? input : import_minimal24.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMainCamera();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.virtualCameraEntity = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMainCamera2.decode = decode;
})(PBMainCamera || (PBMainCamera = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/MainCamera.gen.js
var MainCameraSchema = {
  COMPONENT_ID: 1075,
  serialize(value, builder) {
    const writer = PBMainCamera.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBMainCamera.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBMainCamera.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBMainCamera"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/Material.gen.js
var MaterialSchema = {
  COMPONENT_ID: 1017,
  serialize(value, builder) {
    const writer = PBMaterial.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBMaterial.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBMaterial.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBMaterial"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/mesh_collider.gen.js
var import_minimal25 = __toESM(require_minimal2());
var ColliderLayer;
(function(ColliderLayer2) {
  ColliderLayer2[ColliderLayer2["CL_NONE"] = 0] = "CL_NONE";
  ColliderLayer2[ColliderLayer2["CL_POINTER"] = 1] = "CL_POINTER";
  ColliderLayer2[ColliderLayer2["CL_PHYSICS"] = 2] = "CL_PHYSICS";
  ColliderLayer2[ColliderLayer2["CL_PLAYER"] = 4] = "CL_PLAYER";
  ColliderLayer2[ColliderLayer2["CL_RESERVED2"] = 8] = "CL_RESERVED2";
  ColliderLayer2[ColliderLayer2["CL_RESERVED3"] = 16] = "CL_RESERVED3";
  ColliderLayer2[ColliderLayer2["CL_RESERVED4"] = 32] = "CL_RESERVED4";
  ColliderLayer2[ColliderLayer2["CL_RESERVED5"] = 64] = "CL_RESERVED5";
  ColliderLayer2[ColliderLayer2["CL_RESERVED6"] = 128] = "CL_RESERVED6";
  ColliderLayer2[ColliderLayer2["CL_CUSTOM1"] = 256] = "CL_CUSTOM1";
  ColliderLayer2[ColliderLayer2["CL_CUSTOM2"] = 512] = "CL_CUSTOM2";
  ColliderLayer2[ColliderLayer2["CL_CUSTOM3"] = 1024] = "CL_CUSTOM3";
  ColliderLayer2[ColliderLayer2["CL_CUSTOM4"] = 2048] = "CL_CUSTOM4";
  ColliderLayer2[ColliderLayer2["CL_CUSTOM5"] = 4096] = "CL_CUSTOM5";
  ColliderLayer2[ColliderLayer2["CL_CUSTOM6"] = 8192] = "CL_CUSTOM6";
  ColliderLayer2[ColliderLayer2["CL_CUSTOM7"] = 16384] = "CL_CUSTOM7";
  ColliderLayer2[ColliderLayer2["CL_CUSTOM8"] = 32768] = "CL_CUSTOM8";
})(ColliderLayer || (ColliderLayer = {}));
function createBasePBMeshCollider() {
  return { collisionMask: void 0, mesh: void 0 };
}
var PBMeshCollider;
(function(PBMeshCollider2) {
  function encode(message, writer = import_minimal25.default.Writer.create()) {
    if (message.collisionMask !== void 0) {
      writer.uint32(8).uint32(message.collisionMask);
    }
    switch (message.mesh?.$case) {
      case "box":
        PBMeshCollider_BoxMesh.encode(message.mesh.box, writer.uint32(18).fork()).ldelim();
        break;
      case "sphere":
        PBMeshCollider_SphereMesh.encode(message.mesh.sphere, writer.uint32(26).fork()).ldelim();
        break;
      case "cylinder":
        PBMeshCollider_CylinderMesh.encode(message.mesh.cylinder, writer.uint32(34).fork()).ldelim();
        break;
      case "plane":
        PBMeshCollider_PlaneMesh.encode(message.mesh.plane, writer.uint32(42).fork()).ldelim();
        break;
    }
    return writer;
  }
  PBMeshCollider2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal25.default.Reader ? input : import_minimal25.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshCollider();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.collisionMask = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.mesh = { $case: "box", box: PBMeshCollider_BoxMesh.decode(reader, reader.uint32()) };
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.mesh = { $case: "sphere", sphere: PBMeshCollider_SphereMesh.decode(reader, reader.uint32()) };
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.mesh = { $case: "cylinder", cylinder: PBMeshCollider_CylinderMesh.decode(reader, reader.uint32()) };
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.mesh = { $case: "plane", plane: PBMeshCollider_PlaneMesh.decode(reader, reader.uint32()) };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshCollider2.decode = decode;
})(PBMeshCollider || (PBMeshCollider = {}));
function createBasePBMeshCollider_BoxMesh() {
  return {};
}
var PBMeshCollider_BoxMesh;
(function(PBMeshCollider_BoxMesh2) {
  function encode(_, writer = import_minimal25.default.Writer.create()) {
    return writer;
  }
  PBMeshCollider_BoxMesh2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal25.default.Reader ? input : import_minimal25.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshCollider_BoxMesh();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshCollider_BoxMesh2.decode = decode;
})(PBMeshCollider_BoxMesh || (PBMeshCollider_BoxMesh = {}));
function createBasePBMeshCollider_CylinderMesh() {
  return { radiusTop: void 0, radiusBottom: void 0 };
}
var PBMeshCollider_CylinderMesh;
(function(PBMeshCollider_CylinderMesh2) {
  function encode(message, writer = import_minimal25.default.Writer.create()) {
    if (message.radiusTop !== void 0) {
      writer.uint32(13).float(message.radiusTop);
    }
    if (message.radiusBottom !== void 0) {
      writer.uint32(21).float(message.radiusBottom);
    }
    return writer;
  }
  PBMeshCollider_CylinderMesh2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal25.default.Reader ? input : import_minimal25.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshCollider_CylinderMesh();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.radiusTop = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.radiusBottom = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshCollider_CylinderMesh2.decode = decode;
})(PBMeshCollider_CylinderMesh || (PBMeshCollider_CylinderMesh = {}));
function createBasePBMeshCollider_PlaneMesh() {
  return {};
}
var PBMeshCollider_PlaneMesh;
(function(PBMeshCollider_PlaneMesh2) {
  function encode(_, writer = import_minimal25.default.Writer.create()) {
    return writer;
  }
  PBMeshCollider_PlaneMesh2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal25.default.Reader ? input : import_minimal25.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshCollider_PlaneMesh();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshCollider_PlaneMesh2.decode = decode;
})(PBMeshCollider_PlaneMesh || (PBMeshCollider_PlaneMesh = {}));
function createBasePBMeshCollider_SphereMesh() {
  return {};
}
var PBMeshCollider_SphereMesh;
(function(PBMeshCollider_SphereMesh2) {
  function encode(_, writer = import_minimal25.default.Writer.create()) {
    return writer;
  }
  PBMeshCollider_SphereMesh2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal25.default.Reader ? input : import_minimal25.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshCollider_SphereMesh();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshCollider_SphereMesh2.decode = decode;
})(PBMeshCollider_SphereMesh || (PBMeshCollider_SphereMesh = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/MeshCollider.gen.js
var MeshColliderSchema = {
  COMPONENT_ID: 1019,
  serialize(value, builder) {
    const writer = PBMeshCollider.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBMeshCollider.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBMeshCollider.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBMeshCollider"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/mesh_renderer.gen.js
var import_minimal26 = __toESM(require_minimal2());
function createBasePBMeshRenderer() {
  return { mesh: void 0 };
}
var PBMeshRenderer;
(function(PBMeshRenderer2) {
  function encode(message, writer = import_minimal26.default.Writer.create()) {
    switch (message.mesh?.$case) {
      case "box":
        PBMeshRenderer_BoxMesh.encode(message.mesh.box, writer.uint32(10).fork()).ldelim();
        break;
      case "sphere":
        PBMeshRenderer_SphereMesh.encode(message.mesh.sphere, writer.uint32(18).fork()).ldelim();
        break;
      case "cylinder":
        PBMeshRenderer_CylinderMesh.encode(message.mesh.cylinder, writer.uint32(26).fork()).ldelim();
        break;
      case "plane":
        PBMeshRenderer_PlaneMesh.encode(message.mesh.plane, writer.uint32(34).fork()).ldelim();
        break;
    }
    return writer;
  }
  PBMeshRenderer2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal26.default.Reader ? input : import_minimal26.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshRenderer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.mesh = { $case: "box", box: PBMeshRenderer_BoxMesh.decode(reader, reader.uint32()) };
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.mesh = { $case: "sphere", sphere: PBMeshRenderer_SphereMesh.decode(reader, reader.uint32()) };
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.mesh = { $case: "cylinder", cylinder: PBMeshRenderer_CylinderMesh.decode(reader, reader.uint32()) };
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.mesh = { $case: "plane", plane: PBMeshRenderer_PlaneMesh.decode(reader, reader.uint32()) };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshRenderer2.decode = decode;
})(PBMeshRenderer || (PBMeshRenderer = {}));
function createBasePBMeshRenderer_BoxMesh() {
  return { uvs: [] };
}
var PBMeshRenderer_BoxMesh;
(function(PBMeshRenderer_BoxMesh2) {
  function encode(message, writer = import_minimal26.default.Writer.create()) {
    writer.uint32(10).fork();
    for (const v of message.uvs) {
      writer.float(v);
    }
    writer.ldelim();
    return writer;
  }
  PBMeshRenderer_BoxMesh2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal26.default.Reader ? input : import_minimal26.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshRenderer_BoxMesh();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 13) {
            message.uvs.push(reader.float());
            continue;
          }
          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.uvs.push(reader.float());
            }
            continue;
          }
          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshRenderer_BoxMesh2.decode = decode;
})(PBMeshRenderer_BoxMesh || (PBMeshRenderer_BoxMesh = {}));
function createBasePBMeshRenderer_CylinderMesh() {
  return { radiusTop: void 0, radiusBottom: void 0 };
}
var PBMeshRenderer_CylinderMesh;
(function(PBMeshRenderer_CylinderMesh2) {
  function encode(message, writer = import_minimal26.default.Writer.create()) {
    if (message.radiusTop !== void 0) {
      writer.uint32(13).float(message.radiusTop);
    }
    if (message.radiusBottom !== void 0) {
      writer.uint32(21).float(message.radiusBottom);
    }
    return writer;
  }
  PBMeshRenderer_CylinderMesh2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal26.default.Reader ? input : import_minimal26.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshRenderer_CylinderMesh();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.radiusTop = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.radiusBottom = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshRenderer_CylinderMesh2.decode = decode;
})(PBMeshRenderer_CylinderMesh || (PBMeshRenderer_CylinderMesh = {}));
function createBasePBMeshRenderer_PlaneMesh() {
  return { uvs: [] };
}
var PBMeshRenderer_PlaneMesh;
(function(PBMeshRenderer_PlaneMesh2) {
  function encode(message, writer = import_minimal26.default.Writer.create()) {
    writer.uint32(10).fork();
    for (const v of message.uvs) {
      writer.float(v);
    }
    writer.ldelim();
    return writer;
  }
  PBMeshRenderer_PlaneMesh2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal26.default.Reader ? input : import_minimal26.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshRenderer_PlaneMesh();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 13) {
            message.uvs.push(reader.float());
            continue;
          }
          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.uvs.push(reader.float());
            }
            continue;
          }
          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshRenderer_PlaneMesh2.decode = decode;
})(PBMeshRenderer_PlaneMesh || (PBMeshRenderer_PlaneMesh = {}));
function createBasePBMeshRenderer_SphereMesh() {
  return {};
}
var PBMeshRenderer_SphereMesh;
(function(PBMeshRenderer_SphereMesh2) {
  function encode(_, writer = import_minimal26.default.Writer.create()) {
    return writer;
  }
  PBMeshRenderer_SphereMesh2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal26.default.Reader ? input : import_minimal26.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBMeshRenderer_SphereMesh();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBMeshRenderer_SphereMesh2.decode = decode;
})(PBMeshRenderer_SphereMesh || (PBMeshRenderer_SphereMesh = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/MeshRenderer.gen.js
var MeshRendererSchema = {
  COMPONENT_ID: 1018,
  serialize(value, builder) {
    const writer = PBMeshRenderer.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBMeshRenderer.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBMeshRenderer.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBMeshRenderer"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/nft_shape.gen.js
var import_minimal27 = __toESM(require_minimal2());
var NftFrameType;
(function(NftFrameType2) {
  NftFrameType2[NftFrameType2["NFT_CLASSIC"] = 0] = "NFT_CLASSIC";
  NftFrameType2[NftFrameType2["NFT_BAROQUE_ORNAMENT"] = 1] = "NFT_BAROQUE_ORNAMENT";
  NftFrameType2[NftFrameType2["NFT_DIAMOND_ORNAMENT"] = 2] = "NFT_DIAMOND_ORNAMENT";
  NftFrameType2[NftFrameType2["NFT_MINIMAL_WIDE"] = 3] = "NFT_MINIMAL_WIDE";
  NftFrameType2[NftFrameType2["NFT_MINIMAL_GREY"] = 4] = "NFT_MINIMAL_GREY";
  NftFrameType2[NftFrameType2["NFT_BLOCKY"] = 5] = "NFT_BLOCKY";
  NftFrameType2[NftFrameType2["NFT_GOLD_EDGES"] = 6] = "NFT_GOLD_EDGES";
  NftFrameType2[NftFrameType2["NFT_GOLD_CARVED"] = 7] = "NFT_GOLD_CARVED";
  NftFrameType2[NftFrameType2["NFT_GOLD_WIDE"] = 8] = "NFT_GOLD_WIDE";
  NftFrameType2[NftFrameType2["NFT_GOLD_ROUNDED"] = 9] = "NFT_GOLD_ROUNDED";
  NftFrameType2[NftFrameType2["NFT_METAL_MEDIUM"] = 10] = "NFT_METAL_MEDIUM";
  NftFrameType2[NftFrameType2["NFT_METAL_WIDE"] = 11] = "NFT_METAL_WIDE";
  NftFrameType2[NftFrameType2["NFT_METAL_SLIM"] = 12] = "NFT_METAL_SLIM";
  NftFrameType2[NftFrameType2["NFT_METAL_ROUNDED"] = 13] = "NFT_METAL_ROUNDED";
  NftFrameType2[NftFrameType2["NFT_PINS"] = 14] = "NFT_PINS";
  NftFrameType2[NftFrameType2["NFT_MINIMAL_BLACK"] = 15] = "NFT_MINIMAL_BLACK";
  NftFrameType2[NftFrameType2["NFT_MINIMAL_WHITE"] = 16] = "NFT_MINIMAL_WHITE";
  NftFrameType2[NftFrameType2["NFT_TAPE"] = 17] = "NFT_TAPE";
  NftFrameType2[NftFrameType2["NFT_WOOD_SLIM"] = 18] = "NFT_WOOD_SLIM";
  NftFrameType2[NftFrameType2["NFT_WOOD_WIDE"] = 19] = "NFT_WOOD_WIDE";
  NftFrameType2[NftFrameType2["NFT_WOOD_TWIGS"] = 20] = "NFT_WOOD_TWIGS";
  NftFrameType2[NftFrameType2["NFT_CANVAS"] = 21] = "NFT_CANVAS";
  NftFrameType2[NftFrameType2["NFT_NONE"] = 22] = "NFT_NONE";
})(NftFrameType || (NftFrameType = {}));
function createBasePBNftShape() {
  return { urn: "", style: void 0, color: void 0 };
}
var PBNftShape;
(function(PBNftShape2) {
  function encode(message, writer = import_minimal27.default.Writer.create()) {
    if (message.urn !== "") {
      writer.uint32(10).string(message.urn);
    }
    if (message.style !== void 0) {
      writer.uint32(16).int32(message.style);
    }
    if (message.color !== void 0) {
      Color3.encode(message.color, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  }
  PBNftShape2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal27.default.Reader ? input : import_minimal27.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBNftShape();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.urn = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.style = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.color = Color3.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBNftShape2.decode = decode;
})(PBNftShape || (PBNftShape = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/NftShape.gen.js
var NftShapeSchema = {
  COMPONENT_ID: 1040,
  serialize(value, builder) {
    const writer = PBNftShape.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBNftShape.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBNftShape.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBNftShape"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/player_identity_data.gen.js
var import_minimal28 = __toESM(require_minimal2());
function createBasePBPlayerIdentityData() {
  return { address: "", isGuest: false };
}
var PBPlayerIdentityData;
(function(PBPlayerIdentityData2) {
  function encode(message, writer = import_minimal28.default.Writer.create()) {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.isGuest === true) {
      writer.uint32(24).bool(message.isGuest);
    }
    return writer;
  }
  PBPlayerIdentityData2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal28.default.Reader ? input : import_minimal28.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBPlayerIdentityData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.address = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.isGuest = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBPlayerIdentityData2.decode = decode;
})(PBPlayerIdentityData || (PBPlayerIdentityData = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/PlayerIdentityData.gen.js
var PlayerIdentityDataSchema = {
  COMPONENT_ID: 1089,
  serialize(value, builder) {
    const writer = PBPlayerIdentityData.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBPlayerIdentityData.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBPlayerIdentityData.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBPlayerIdentityData"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/pointer_events.gen.js
var import_minimal29 = __toESM(require_minimal2());
function createBasePBPointerEvents() {
  return { pointerEvents: [] };
}
var PBPointerEvents;
(function(PBPointerEvents2) {
  function encode(message, writer = import_minimal29.default.Writer.create()) {
    for (const v of message.pointerEvents) {
      PBPointerEvents_Entry.encode(v, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  }
  PBPointerEvents2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal29.default.Reader ? input : import_minimal29.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBPointerEvents();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.pointerEvents.push(PBPointerEvents_Entry.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBPointerEvents2.decode = decode;
})(PBPointerEvents || (PBPointerEvents = {}));
function createBasePBPointerEvents_Info() {
  return {
    button: void 0,
    hoverText: void 0,
    maxDistance: void 0,
    showFeedback: void 0,
    showHighlight: void 0
  };
}
var PBPointerEvents_Info;
(function(PBPointerEvents_Info2) {
  function encode(message, writer = import_minimal29.default.Writer.create()) {
    if (message.button !== void 0) {
      writer.uint32(8).int32(message.button);
    }
    if (message.hoverText !== void 0) {
      writer.uint32(18).string(message.hoverText);
    }
    if (message.maxDistance !== void 0) {
      writer.uint32(29).float(message.maxDistance);
    }
    if (message.showFeedback !== void 0) {
      writer.uint32(32).bool(message.showFeedback);
    }
    if (message.showHighlight !== void 0) {
      writer.uint32(40).bool(message.showHighlight);
    }
    return writer;
  }
  PBPointerEvents_Info2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal29.default.Reader ? input : import_minimal29.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBPointerEvents_Info();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.button = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.hoverText = reader.string();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.maxDistance = reader.float();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.showFeedback = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.showHighlight = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBPointerEvents_Info2.decode = decode;
})(PBPointerEvents_Info || (PBPointerEvents_Info = {}));
function createBasePBPointerEvents_Entry() {
  return { eventType: 0, eventInfo: void 0 };
}
var PBPointerEvents_Entry;
(function(PBPointerEvents_Entry2) {
  function encode(message, writer = import_minimal29.default.Writer.create()) {
    if (message.eventType !== 0) {
      writer.uint32(8).int32(message.eventType);
    }
    if (message.eventInfo !== void 0) {
      PBPointerEvents_Info.encode(message.eventInfo, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  }
  PBPointerEvents_Entry2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal29.default.Reader ? input : import_minimal29.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBPointerEvents_Entry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.eventType = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.eventInfo = PBPointerEvents_Info.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBPointerEvents_Entry2.decode = decode;
})(PBPointerEvents_Entry || (PBPointerEvents_Entry = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/PointerEvents.gen.js
var PointerEventsSchema = {
  COMPONENT_ID: 1062,
  serialize(value, builder) {
    const writer = PBPointerEvents.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBPointerEvents.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBPointerEvents.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBPointerEvents"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/pointer_events_result.gen.js
var import_minimal31 = __toESM(require_minimal2());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/common/raycast_hit.gen.js
var import_minimal30 = __toESM(require_minimal2());
function createBaseRaycastHit() {
  return {
    position: void 0,
    globalOrigin: void 0,
    direction: void 0,
    normalHit: void 0,
    length: 0,
    meshName: void 0,
    entityId: void 0
  };
}
var RaycastHit;
(function(RaycastHit2) {
  function encode(message, writer = import_minimal30.default.Writer.create()) {
    if (message.position !== void 0) {
      Vector3.encode(message.position, writer.uint32(10).fork()).ldelim();
    }
    if (message.globalOrigin !== void 0) {
      Vector3.encode(message.globalOrigin, writer.uint32(18).fork()).ldelim();
    }
    if (message.direction !== void 0) {
      Vector3.encode(message.direction, writer.uint32(26).fork()).ldelim();
    }
    if (message.normalHit !== void 0) {
      Vector3.encode(message.normalHit, writer.uint32(34).fork()).ldelim();
    }
    if (message.length !== 0) {
      writer.uint32(45).float(message.length);
    }
    if (message.meshName !== void 0) {
      writer.uint32(50).string(message.meshName);
    }
    if (message.entityId !== void 0) {
      writer.uint32(56).uint32(message.entityId);
    }
    return writer;
  }
  RaycastHit2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal30.default.Reader ? input : import_minimal30.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseRaycastHit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.position = Vector3.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.globalOrigin = Vector3.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.direction = Vector3.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.normalHit = Vector3.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }
          message.length = reader.float();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.meshName = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.entityId = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  RaycastHit2.decode = decode;
})(RaycastHit || (RaycastHit = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/pointer_events_result.gen.js
function createBasePBPointerEventsResult() {
  return { button: 0, hit: void 0, state: 0, timestamp: 0, analog: void 0, tickNumber: 0 };
}
var PBPointerEventsResult;
(function(PBPointerEventsResult2) {
  function encode(message, writer = import_minimal31.default.Writer.create()) {
    if (message.button !== 0) {
      writer.uint32(8).int32(message.button);
    }
    if (message.hit !== void 0) {
      RaycastHit.encode(message.hit, writer.uint32(18).fork()).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(32).int32(message.state);
    }
    if (message.timestamp !== 0) {
      writer.uint32(40).uint32(message.timestamp);
    }
    if (message.analog !== void 0) {
      writer.uint32(53).float(message.analog);
    }
    if (message.tickNumber !== 0) {
      writer.uint32(56).uint32(message.tickNumber);
    }
    return writer;
  }
  PBPointerEventsResult2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal31.default.Reader ? input : import_minimal31.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBPointerEventsResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.button = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.hit = RaycastHit.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.state = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.timestamp = reader.uint32();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }
          message.analog = reader.float();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.tickNumber = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBPointerEventsResult2.decode = decode;
})(PBPointerEventsResult || (PBPointerEventsResult = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/PointerEventsResult.gen.js
var PointerEventsResultSchema = {
  COMPONENT_ID: 1063,
  serialize(value, builder) {
    const writer = PBPointerEventsResult.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBPointerEventsResult.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBPointerEventsResult.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBPointerEventsResult"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/pointer_lock.gen.js
var import_minimal32 = __toESM(require_minimal2());
function createBasePBPointerLock() {
  return { isPointerLocked: false };
}
var PBPointerLock;
(function(PBPointerLock2) {
  function encode(message, writer = import_minimal32.default.Writer.create()) {
    if (message.isPointerLocked === true) {
      writer.uint32(8).bool(message.isPointerLocked);
    }
    return writer;
  }
  PBPointerLock2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal32.default.Reader ? input : import_minimal32.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBPointerLock();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.isPointerLocked = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBPointerLock2.decode = decode;
})(PBPointerLock || (PBPointerLock = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/PointerLock.gen.js
var PointerLockSchema = {
  COMPONENT_ID: 1074,
  serialize(value, builder) {
    const writer = PBPointerLock.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBPointerLock.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBPointerLock.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBPointerLock"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/primary_pointer_info.gen.js
var import_minimal33 = __toESM(require_minimal2());
var PointerType;
(function(PointerType2) {
  PointerType2[PointerType2["POT_NONE"] = 0] = "POT_NONE";
  PointerType2[PointerType2["POT_MOUSE"] = 1] = "POT_MOUSE";
})(PointerType || (PointerType = {}));
function createBasePBPrimaryPointerInfo() {
  return { pointerType: void 0, screenCoordinates: void 0, screenDelta: void 0, worldRayDirection: void 0 };
}
var PBPrimaryPointerInfo;
(function(PBPrimaryPointerInfo2) {
  function encode(message, writer = import_minimal33.default.Writer.create()) {
    if (message.pointerType !== void 0) {
      writer.uint32(8).int32(message.pointerType);
    }
    if (message.screenCoordinates !== void 0) {
      Vector2.encode(message.screenCoordinates, writer.uint32(18).fork()).ldelim();
    }
    if (message.screenDelta !== void 0) {
      Vector2.encode(message.screenDelta, writer.uint32(26).fork()).ldelim();
    }
    if (message.worldRayDirection !== void 0) {
      Vector3.encode(message.worldRayDirection, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  }
  PBPrimaryPointerInfo2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal33.default.Reader ? input : import_minimal33.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBPrimaryPointerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.pointerType = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.screenCoordinates = Vector2.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.screenDelta = Vector2.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.worldRayDirection = Vector3.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBPrimaryPointerInfo2.decode = decode;
})(PBPrimaryPointerInfo || (PBPrimaryPointerInfo = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/PrimaryPointerInfo.gen.js
var PrimaryPointerInfoSchema = {
  COMPONENT_ID: 1209,
  serialize(value, builder) {
    const writer = PBPrimaryPointerInfo.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBPrimaryPointerInfo.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBPrimaryPointerInfo.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBPrimaryPointerInfo"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/raycast.gen.js
var import_minimal34 = __toESM(require_minimal2());
var RaycastQueryType;
(function(RaycastQueryType2) {
  RaycastQueryType2[RaycastQueryType2["RQT_HIT_FIRST"] = 0] = "RQT_HIT_FIRST";
  RaycastQueryType2[RaycastQueryType2["RQT_QUERY_ALL"] = 1] = "RQT_QUERY_ALL";
  RaycastQueryType2[RaycastQueryType2["RQT_NONE"] = 2] = "RQT_NONE";
})(RaycastQueryType || (RaycastQueryType = {}));
function createBasePBRaycast() {
  return {
    timestamp: void 0,
    originOffset: void 0,
    direction: void 0,
    maxDistance: 0,
    queryType: 0,
    continuous: void 0,
    collisionMask: void 0
  };
}
var PBRaycast;
(function(PBRaycast2) {
  function encode(message, writer = import_minimal34.default.Writer.create()) {
    if (message.timestamp !== void 0) {
      writer.uint32(8).uint32(message.timestamp);
    }
    if (message.originOffset !== void 0) {
      Vector3.encode(message.originOffset, writer.uint32(18).fork()).ldelim();
    }
    switch (message.direction?.$case) {
      case "localDirection":
        Vector3.encode(message.direction.localDirection, writer.uint32(50).fork()).ldelim();
        break;
      case "globalDirection":
        Vector3.encode(message.direction.globalDirection, writer.uint32(26).fork()).ldelim();
        break;
      case "globalTarget":
        Vector3.encode(message.direction.globalTarget, writer.uint32(58).fork()).ldelim();
        break;
      case "targetEntity":
        writer.uint32(80).uint32(message.direction.targetEntity);
        break;
    }
    if (message.maxDistance !== 0) {
      writer.uint32(37).float(message.maxDistance);
    }
    if (message.queryType !== 0) {
      writer.uint32(40).int32(message.queryType);
    }
    if (message.continuous !== void 0) {
      writer.uint32(64).bool(message.continuous);
    }
    if (message.collisionMask !== void 0) {
      writer.uint32(72).uint32(message.collisionMask);
    }
    return writer;
  }
  PBRaycast2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal34.default.Reader ? input : import_minimal34.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBRaycast();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.timestamp = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.originOffset = Vector3.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.direction = { $case: "localDirection", localDirection: Vector3.decode(reader, reader.uint32()) };
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.direction = { $case: "globalDirection", globalDirection: Vector3.decode(reader, reader.uint32()) };
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }
          message.direction = { $case: "globalTarget", globalTarget: Vector3.decode(reader, reader.uint32()) };
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }
          message.direction = { $case: "targetEntity", targetEntity: reader.uint32() };
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.maxDistance = reader.float();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.queryType = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }
          message.continuous = reader.bool();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }
          message.collisionMask = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBRaycast2.decode = decode;
})(PBRaycast || (PBRaycast = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/Raycast.gen.js
var RaycastSchema = {
  COMPONENT_ID: 1067,
  serialize(value, builder) {
    const writer = PBRaycast.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBRaycast.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBRaycast.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBRaycast"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/raycast_result.gen.js
var import_minimal35 = __toESM(require_minimal2());
function createBasePBRaycastResult() {
  return { timestamp: void 0, globalOrigin: void 0, direction: void 0, hits: [], tickNumber: 0 };
}
var PBRaycastResult;
(function(PBRaycastResult2) {
  function encode(message, writer = import_minimal35.default.Writer.create()) {
    if (message.timestamp !== void 0) {
      writer.uint32(8).uint32(message.timestamp);
    }
    if (message.globalOrigin !== void 0) {
      Vector3.encode(message.globalOrigin, writer.uint32(18).fork()).ldelim();
    }
    if (message.direction !== void 0) {
      Vector3.encode(message.direction, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.hits) {
      RaycastHit.encode(v, writer.uint32(34).fork()).ldelim();
    }
    if (message.tickNumber !== 0) {
      writer.uint32(40).uint32(message.tickNumber);
    }
    return writer;
  }
  PBRaycastResult2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal35.default.Reader ? input : import_minimal35.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBRaycastResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.timestamp = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.globalOrigin = Vector3.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.direction = Vector3.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.hits.push(RaycastHit.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.tickNumber = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBRaycastResult2.decode = decode;
})(PBRaycastResult || (PBRaycastResult = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/RaycastResult.gen.js
var RaycastResultSchema = {
  COMPONENT_ID: 1068,
  serialize(value, builder) {
    const writer = PBRaycastResult.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBRaycastResult.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBRaycastResult.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBRaycastResult"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/realm_info.gen.js
var import_minimal36 = __toESM(require_minimal2());
function createBasePBRealmInfo() {
  return {
    baseUrl: "",
    realmName: "",
    networkId: 0,
    commsAdapter: "",
    isPreview: false,
    room: void 0,
    isConnectedSceneRoom: void 0
  };
}
var PBRealmInfo;
(function(PBRealmInfo2) {
  function encode(message, writer = import_minimal36.default.Writer.create()) {
    if (message.baseUrl !== "") {
      writer.uint32(10).string(message.baseUrl);
    }
    if (message.realmName !== "") {
      writer.uint32(18).string(message.realmName);
    }
    if (message.networkId !== 0) {
      writer.uint32(24).int32(message.networkId);
    }
    if (message.commsAdapter !== "") {
      writer.uint32(34).string(message.commsAdapter);
    }
    if (message.isPreview === true) {
      writer.uint32(40).bool(message.isPreview);
    }
    if (message.room !== void 0) {
      writer.uint32(50).string(message.room);
    }
    if (message.isConnectedSceneRoom !== void 0) {
      writer.uint32(56).bool(message.isConnectedSceneRoom);
    }
    return writer;
  }
  PBRealmInfo2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal36.default.Reader ? input : import_minimal36.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBRealmInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.baseUrl = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.realmName = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.networkId = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.commsAdapter = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.isPreview = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.room = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.isConnectedSceneRoom = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBRealmInfo2.decode = decode;
})(PBRealmInfo || (PBRealmInfo = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/RealmInfo.gen.js
var RealmInfoSchema = {
  COMPONENT_ID: 1106,
  serialize(value, builder) {
    const writer = PBRealmInfo.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBRealmInfo.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBRealmInfo.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBRealmInfo"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/skybox_time.gen.js
var import_minimal37 = __toESM(require_minimal2());
var TransitionMode;
(function(TransitionMode2) {
  TransitionMode2[TransitionMode2["TM_FORWARD"] = 0] = "TM_FORWARD";
  TransitionMode2[TransitionMode2["TM_BACKWARD"] = 1] = "TM_BACKWARD";
})(TransitionMode || (TransitionMode = {}));
function createBasePBSkyboxTime() {
  return { fixedTime: 0, transitionMode: void 0 };
}
var PBSkyboxTime;
(function(PBSkyboxTime2) {
  function encode(message, writer = import_minimal37.default.Writer.create()) {
    if (message.fixedTime !== 0) {
      writer.uint32(8).uint32(message.fixedTime);
    }
    if (message.transitionMode !== void 0) {
      writer.uint32(16).int32(message.transitionMode);
    }
    return writer;
  }
  PBSkyboxTime2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal37.default.Reader ? input : import_minimal37.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBSkyboxTime();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.fixedTime = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.transitionMode = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBSkyboxTime2.decode = decode;
})(PBSkyboxTime || (PBSkyboxTime = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/SkyboxTime.gen.js
var SkyboxTimeSchema = {
  COMPONENT_ID: 1210,
  serialize(value, builder) {
    const writer = PBSkyboxTime.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBSkyboxTime.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBSkyboxTime.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBSkyboxTime"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/text_shape.gen.js
var import_minimal38 = __toESM(require_minimal2());
function createBasePBTextShape() {
  return {
    text: "",
    font: void 0,
    fontSize: void 0,
    fontAutoSize: void 0,
    textAlign: void 0,
    width: void 0,
    height: void 0,
    paddingTop: void 0,
    paddingRight: void 0,
    paddingBottom: void 0,
    paddingLeft: void 0,
    lineSpacing: void 0,
    lineCount: void 0,
    textWrapping: void 0,
    shadowBlur: void 0,
    shadowOffsetX: void 0,
    shadowOffsetY: void 0,
    outlineWidth: void 0,
    shadowColor: void 0,
    outlineColor: void 0,
    textColor: void 0
  };
}
var PBTextShape;
(function(PBTextShape2) {
  function encode(message, writer = import_minimal38.default.Writer.create()) {
    if (message.text !== "") {
      writer.uint32(10).string(message.text);
    }
    if (message.font !== void 0) {
      writer.uint32(16).int32(message.font);
    }
    if (message.fontSize !== void 0) {
      writer.uint32(29).float(message.fontSize);
    }
    if (message.fontAutoSize !== void 0) {
      writer.uint32(32).bool(message.fontAutoSize);
    }
    if (message.textAlign !== void 0) {
      writer.uint32(40).int32(message.textAlign);
    }
    if (message.width !== void 0) {
      writer.uint32(53).float(message.width);
    }
    if (message.height !== void 0) {
      writer.uint32(61).float(message.height);
    }
    if (message.paddingTop !== void 0) {
      writer.uint32(69).float(message.paddingTop);
    }
    if (message.paddingRight !== void 0) {
      writer.uint32(77).float(message.paddingRight);
    }
    if (message.paddingBottom !== void 0) {
      writer.uint32(85).float(message.paddingBottom);
    }
    if (message.paddingLeft !== void 0) {
      writer.uint32(93).float(message.paddingLeft);
    }
    if (message.lineSpacing !== void 0) {
      writer.uint32(101).float(message.lineSpacing);
    }
    if (message.lineCount !== void 0) {
      writer.uint32(104).int32(message.lineCount);
    }
    if (message.textWrapping !== void 0) {
      writer.uint32(112).bool(message.textWrapping);
    }
    if (message.shadowBlur !== void 0) {
      writer.uint32(125).float(message.shadowBlur);
    }
    if (message.shadowOffsetX !== void 0) {
      writer.uint32(133).float(message.shadowOffsetX);
    }
    if (message.shadowOffsetY !== void 0) {
      writer.uint32(141).float(message.shadowOffsetY);
    }
    if (message.outlineWidth !== void 0) {
      writer.uint32(149).float(message.outlineWidth);
    }
    if (message.shadowColor !== void 0) {
      Color3.encode(message.shadowColor, writer.uint32(154).fork()).ldelim();
    }
    if (message.outlineColor !== void 0) {
      Color3.encode(message.outlineColor, writer.uint32(162).fork()).ldelim();
    }
    if (message.textColor !== void 0) {
      Color4.encode(message.textColor, writer.uint32(170).fork()).ldelim();
    }
    return writer;
  }
  PBTextShape2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal38.default.Reader ? input : import_minimal38.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBTextShape();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.text = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.font = reader.int32();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.fontSize = reader.float();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.fontAutoSize = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.textAlign = reader.int32();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }
          message.width = reader.float();
          continue;
        case 7:
          if (tag !== 61) {
            break;
          }
          message.height = reader.float();
          continue;
        case 8:
          if (tag !== 69) {
            break;
          }
          message.paddingTop = reader.float();
          continue;
        case 9:
          if (tag !== 77) {
            break;
          }
          message.paddingRight = reader.float();
          continue;
        case 10:
          if (tag !== 85) {
            break;
          }
          message.paddingBottom = reader.float();
          continue;
        case 11:
          if (tag !== 93) {
            break;
          }
          message.paddingLeft = reader.float();
          continue;
        case 12:
          if (tag !== 101) {
            break;
          }
          message.lineSpacing = reader.float();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }
          message.lineCount = reader.int32();
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }
          message.textWrapping = reader.bool();
          continue;
        case 15:
          if (tag !== 125) {
            break;
          }
          message.shadowBlur = reader.float();
          continue;
        case 16:
          if (tag !== 133) {
            break;
          }
          message.shadowOffsetX = reader.float();
          continue;
        case 17:
          if (tag !== 141) {
            break;
          }
          message.shadowOffsetY = reader.float();
          continue;
        case 18:
          if (tag !== 149) {
            break;
          }
          message.outlineWidth = reader.float();
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }
          message.shadowColor = Color3.decode(reader, reader.uint32());
          continue;
        case 20:
          if (tag !== 162) {
            break;
          }
          message.outlineColor = Color3.decode(reader, reader.uint32());
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }
          message.textColor = Color4.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBTextShape2.decode = decode;
})(PBTextShape || (PBTextShape = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/TextShape.gen.js
var TextShapeSchema = {
  COMPONENT_ID: 1030,
  serialize(value, builder) {
    const writer = PBTextShape.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBTextShape.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBTextShape.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBTextShape"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/trigger_area.gen.js
var import_minimal39 = __toESM(require_minimal2());
var TriggerAreaMeshType;
(function(TriggerAreaMeshType2) {
  TriggerAreaMeshType2[TriggerAreaMeshType2["TAMT_BOX"] = 0] = "TAMT_BOX";
  TriggerAreaMeshType2[TriggerAreaMeshType2["TAMT_SPHERE"] = 1] = "TAMT_SPHERE";
})(TriggerAreaMeshType || (TriggerAreaMeshType = {}));
function createBasePBTriggerArea() {
  return { mesh: void 0, collisionMask: void 0 };
}
var PBTriggerArea;
(function(PBTriggerArea2) {
  function encode(message, writer = import_minimal39.default.Writer.create()) {
    if (message.mesh !== void 0) {
      writer.uint32(8).int32(message.mesh);
    }
    if (message.collisionMask !== void 0) {
      writer.uint32(16).uint32(message.collisionMask);
    }
    return writer;
  }
  PBTriggerArea2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal39.default.Reader ? input : import_minimal39.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBTriggerArea();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.mesh = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.collisionMask = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBTriggerArea2.decode = decode;
})(PBTriggerArea || (PBTriggerArea = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/TriggerArea.gen.js
var TriggerAreaSchema = {
  COMPONENT_ID: 1060,
  serialize(value, builder) {
    const writer = PBTriggerArea.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBTriggerArea.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBTriggerArea.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBTriggerArea"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/trigger_area_result.gen.js
var import_minimal40 = __toESM(require_minimal2());
var TriggerAreaEventType;
(function(TriggerAreaEventType2) {
  TriggerAreaEventType2[TriggerAreaEventType2["TAET_ENTER"] = 0] = "TAET_ENTER";
  TriggerAreaEventType2[TriggerAreaEventType2["TAET_STAY"] = 1] = "TAET_STAY";
  TriggerAreaEventType2[TriggerAreaEventType2["TAET_EXIT"] = 2] = "TAET_EXIT";
})(TriggerAreaEventType || (TriggerAreaEventType = {}));
function createBasePBTriggerAreaResult() {
  return {
    triggeredEntity: 0,
    triggeredEntityPosition: void 0,
    triggeredEntityRotation: void 0,
    eventType: 0,
    timestamp: 0,
    trigger: void 0
  };
}
var PBTriggerAreaResult;
(function(PBTriggerAreaResult2) {
  function encode(message, writer = import_minimal40.default.Writer.create()) {
    if (message.triggeredEntity !== 0) {
      writer.uint32(8).uint32(message.triggeredEntity);
    }
    if (message.triggeredEntityPosition !== void 0) {
      Vector3.encode(message.triggeredEntityPosition, writer.uint32(18).fork()).ldelim();
    }
    if (message.triggeredEntityRotation !== void 0) {
      Quaternion.encode(message.triggeredEntityRotation, writer.uint32(26).fork()).ldelim();
    }
    if (message.eventType !== 0) {
      writer.uint32(32).int32(message.eventType);
    }
    if (message.timestamp !== 0) {
      writer.uint32(40).uint32(message.timestamp);
    }
    if (message.trigger !== void 0) {
      PBTriggerAreaResult_Trigger.encode(message.trigger, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  }
  PBTriggerAreaResult2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal40.default.Reader ? input : import_minimal40.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBTriggerAreaResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.triggeredEntity = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.triggeredEntityPosition = Vector3.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.triggeredEntityRotation = Quaternion.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.eventType = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.timestamp = reader.uint32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.trigger = PBTriggerAreaResult_Trigger.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBTriggerAreaResult2.decode = decode;
})(PBTriggerAreaResult || (PBTriggerAreaResult = {}));
function createBasePBTriggerAreaResult_Trigger() {
  return { entity: 0, layers: 0, position: void 0, rotation: void 0, scale: void 0 };
}
var PBTriggerAreaResult_Trigger;
(function(PBTriggerAreaResult_Trigger2) {
  function encode(message, writer = import_minimal40.default.Writer.create()) {
    if (message.entity !== 0) {
      writer.uint32(8).uint32(message.entity);
    }
    if (message.layers !== 0) {
      writer.uint32(16).uint32(message.layers);
    }
    if (message.position !== void 0) {
      Vector3.encode(message.position, writer.uint32(26).fork()).ldelim();
    }
    if (message.rotation !== void 0) {
      Quaternion.encode(message.rotation, writer.uint32(34).fork()).ldelim();
    }
    if (message.scale !== void 0) {
      Vector3.encode(message.scale, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  }
  PBTriggerAreaResult_Trigger2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal40.default.Reader ? input : import_minimal40.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBTriggerAreaResult_Trigger();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.entity = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.layers = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.position = Vector3.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.rotation = Quaternion.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.scale = Vector3.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBTriggerAreaResult_Trigger2.decode = decode;
})(PBTriggerAreaResult_Trigger || (PBTriggerAreaResult_Trigger = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/TriggerAreaResult.gen.js
var TriggerAreaResultSchema = {
  COMPONENT_ID: 1061,
  serialize(value, builder) {
    const writer = PBTriggerAreaResult.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBTriggerAreaResult.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBTriggerAreaResult.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBTriggerAreaResult"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/tween.gen.js
var import_minimal41 = __toESM(require_minimal2());
var TextureMovementType;
(function(TextureMovementType2) {
  TextureMovementType2[TextureMovementType2["TMT_OFFSET"] = 0] = "TMT_OFFSET";
  TextureMovementType2[TextureMovementType2["TMT_TILING"] = 1] = "TMT_TILING";
})(TextureMovementType || (TextureMovementType = {}));
var EasingFunction;
(function(EasingFunction2) {
  EasingFunction2[EasingFunction2["EF_LINEAR"] = 0] = "EF_LINEAR";
  EasingFunction2[EasingFunction2["EF_EASEINQUAD"] = 1] = "EF_EASEINQUAD";
  EasingFunction2[EasingFunction2["EF_EASEOUTQUAD"] = 2] = "EF_EASEOUTQUAD";
  EasingFunction2[EasingFunction2["EF_EASEQUAD"] = 3] = "EF_EASEQUAD";
  EasingFunction2[EasingFunction2["EF_EASEINSINE"] = 4] = "EF_EASEINSINE";
  EasingFunction2[EasingFunction2["EF_EASEOUTSINE"] = 5] = "EF_EASEOUTSINE";
  EasingFunction2[EasingFunction2["EF_EASESINE"] = 6] = "EF_EASESINE";
  EasingFunction2[EasingFunction2["EF_EASEINEXPO"] = 7] = "EF_EASEINEXPO";
  EasingFunction2[EasingFunction2["EF_EASEOUTEXPO"] = 8] = "EF_EASEOUTEXPO";
  EasingFunction2[EasingFunction2["EF_EASEEXPO"] = 9] = "EF_EASEEXPO";
  EasingFunction2[EasingFunction2["EF_EASEINELASTIC"] = 10] = "EF_EASEINELASTIC";
  EasingFunction2[EasingFunction2["EF_EASEOUTELASTIC"] = 11] = "EF_EASEOUTELASTIC";
  EasingFunction2[EasingFunction2["EF_EASEELASTIC"] = 12] = "EF_EASEELASTIC";
  EasingFunction2[EasingFunction2["EF_EASEINBOUNCE"] = 13] = "EF_EASEINBOUNCE";
  EasingFunction2[EasingFunction2["EF_EASEOUTBOUNCE"] = 14] = "EF_EASEOUTBOUNCE";
  EasingFunction2[EasingFunction2["EF_EASEBOUNCE"] = 15] = "EF_EASEBOUNCE";
  EasingFunction2[EasingFunction2["EF_EASEINCUBIC"] = 16] = "EF_EASEINCUBIC";
  EasingFunction2[EasingFunction2["EF_EASEOUTCUBIC"] = 17] = "EF_EASEOUTCUBIC";
  EasingFunction2[EasingFunction2["EF_EASECUBIC"] = 18] = "EF_EASECUBIC";
  EasingFunction2[EasingFunction2["EF_EASEINQUART"] = 19] = "EF_EASEINQUART";
  EasingFunction2[EasingFunction2["EF_EASEOUTQUART"] = 20] = "EF_EASEOUTQUART";
  EasingFunction2[EasingFunction2["EF_EASEQUART"] = 21] = "EF_EASEQUART";
  EasingFunction2[EasingFunction2["EF_EASEINQUINT"] = 22] = "EF_EASEINQUINT";
  EasingFunction2[EasingFunction2["EF_EASEOUTQUINT"] = 23] = "EF_EASEOUTQUINT";
  EasingFunction2[EasingFunction2["EF_EASEQUINT"] = 24] = "EF_EASEQUINT";
  EasingFunction2[EasingFunction2["EF_EASEINCIRC"] = 25] = "EF_EASEINCIRC";
  EasingFunction2[EasingFunction2["EF_EASEOUTCIRC"] = 26] = "EF_EASEOUTCIRC";
  EasingFunction2[EasingFunction2["EF_EASECIRC"] = 27] = "EF_EASECIRC";
  EasingFunction2[EasingFunction2["EF_EASEINBACK"] = 28] = "EF_EASEINBACK";
  EasingFunction2[EasingFunction2["EF_EASEOUTBACK"] = 29] = "EF_EASEOUTBACK";
  EasingFunction2[EasingFunction2["EF_EASEBACK"] = 30] = "EF_EASEBACK";
})(EasingFunction || (EasingFunction = {}));
function createBasePBTween() {
  return { duration: 0, easingFunction: 0, mode: void 0, playing: void 0, currentTime: void 0 };
}
var PBTween;
(function(PBTween2) {
  function encode(message, writer = import_minimal41.default.Writer.create()) {
    if (message.duration !== 0) {
      writer.uint32(13).float(message.duration);
    }
    if (message.easingFunction !== 0) {
      writer.uint32(16).int32(message.easingFunction);
    }
    switch (message.mode?.$case) {
      case "move":
        Move.encode(message.mode.move, writer.uint32(26).fork()).ldelim();
        break;
      case "rotate":
        Rotate.encode(message.mode.rotate, writer.uint32(34).fork()).ldelim();
        break;
      case "scale":
        Scale.encode(message.mode.scale, writer.uint32(42).fork()).ldelim();
        break;
      case "textureMove":
        TextureMove.encode(message.mode.textureMove, writer.uint32(66).fork()).ldelim();
        break;
      case "rotateContinuous":
        RotateContinuous.encode(message.mode.rotateContinuous, writer.uint32(74).fork()).ldelim();
        break;
      case "moveContinuous":
        MoveContinuous.encode(message.mode.moveContinuous, writer.uint32(82).fork()).ldelim();
        break;
      case "textureMoveContinuous":
        TextureMoveContinuous.encode(message.mode.textureMoveContinuous, writer.uint32(90).fork()).ldelim();
        break;
    }
    if (message.playing !== void 0) {
      writer.uint32(48).bool(message.playing);
    }
    if (message.currentTime !== void 0) {
      writer.uint32(61).float(message.currentTime);
    }
    return writer;
  }
  PBTween2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal41.default.Reader ? input : import_minimal41.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBTween();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.duration = reader.float();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.easingFunction = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.mode = { $case: "move", move: Move.decode(reader, reader.uint32()) };
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.mode = { $case: "rotate", rotate: Rotate.decode(reader, reader.uint32()) };
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.mode = { $case: "scale", scale: Scale.decode(reader, reader.uint32()) };
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }
          message.mode = { $case: "textureMove", textureMove: TextureMove.decode(reader, reader.uint32()) };
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }
          message.mode = {
            $case: "rotateContinuous",
            rotateContinuous: RotateContinuous.decode(reader, reader.uint32())
          };
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }
          message.mode = { $case: "moveContinuous", moveContinuous: MoveContinuous.decode(reader, reader.uint32()) };
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }
          message.mode = {
            $case: "textureMoveContinuous",
            textureMoveContinuous: TextureMoveContinuous.decode(reader, reader.uint32())
          };
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }
          message.playing = reader.bool();
          continue;
        case 7:
          if (tag !== 61) {
            break;
          }
          message.currentTime = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBTween2.decode = decode;
})(PBTween || (PBTween = {}));
function createBaseMove() {
  return { start: void 0, end: void 0, faceDirection: void 0 };
}
var Move;
(function(Move2) {
  function encode(message, writer = import_minimal41.default.Writer.create()) {
    if (message.start !== void 0) {
      Vector3.encode(message.start, writer.uint32(10).fork()).ldelim();
    }
    if (message.end !== void 0) {
      Vector3.encode(message.end, writer.uint32(18).fork()).ldelim();
    }
    if (message.faceDirection !== void 0) {
      writer.uint32(24).bool(message.faceDirection);
    }
    return writer;
  }
  Move2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal41.default.Reader ? input : import_minimal41.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseMove();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.start = Vector3.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.end = Vector3.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.faceDirection = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Move2.decode = decode;
})(Move || (Move = {}));
function createBaseRotate() {
  return { start: void 0, end: void 0 };
}
var Rotate;
(function(Rotate2) {
  function encode(message, writer = import_minimal41.default.Writer.create()) {
    if (message.start !== void 0) {
      Quaternion.encode(message.start, writer.uint32(10).fork()).ldelim();
    }
    if (message.end !== void 0) {
      Quaternion.encode(message.end, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  }
  Rotate2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal41.default.Reader ? input : import_minimal41.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseRotate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.start = Quaternion.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.end = Quaternion.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Rotate2.decode = decode;
})(Rotate || (Rotate = {}));
function createBaseScale() {
  return { start: void 0, end: void 0 };
}
var Scale;
(function(Scale2) {
  function encode(message, writer = import_minimal41.default.Writer.create()) {
    if (message.start !== void 0) {
      Vector3.encode(message.start, writer.uint32(10).fork()).ldelim();
    }
    if (message.end !== void 0) {
      Vector3.encode(message.end, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  }
  Scale2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal41.default.Reader ? input : import_minimal41.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseScale();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.start = Vector3.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.end = Vector3.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Scale2.decode = decode;
})(Scale || (Scale = {}));
function createBaseTextureMove() {
  return { start: void 0, end: void 0, movementType: void 0 };
}
var TextureMove;
(function(TextureMove2) {
  function encode(message, writer = import_minimal41.default.Writer.create()) {
    if (message.start !== void 0) {
      Vector2.encode(message.start, writer.uint32(10).fork()).ldelim();
    }
    if (message.end !== void 0) {
      Vector2.encode(message.end, writer.uint32(18).fork()).ldelim();
    }
    if (message.movementType !== void 0) {
      writer.uint32(24).int32(message.movementType);
    }
    return writer;
  }
  TextureMove2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal41.default.Reader ? input : import_minimal41.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseTextureMove();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.start = Vector2.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.end = Vector2.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.movementType = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  TextureMove2.decode = decode;
})(TextureMove || (TextureMove = {}));
function createBaseRotateContinuous() {
  return { direction: void 0, speed: 0 };
}
var RotateContinuous;
(function(RotateContinuous2) {
  function encode(message, writer = import_minimal41.default.Writer.create()) {
    if (message.direction !== void 0) {
      Quaternion.encode(message.direction, writer.uint32(10).fork()).ldelim();
    }
    if (message.speed !== 0) {
      writer.uint32(21).float(message.speed);
    }
    return writer;
  }
  RotateContinuous2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal41.default.Reader ? input : import_minimal41.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseRotateContinuous();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.direction = Quaternion.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.speed = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  RotateContinuous2.decode = decode;
})(RotateContinuous || (RotateContinuous = {}));
function createBaseMoveContinuous() {
  return { direction: void 0, speed: 0 };
}
var MoveContinuous;
(function(MoveContinuous2) {
  function encode(message, writer = import_minimal41.default.Writer.create()) {
    if (message.direction !== void 0) {
      Vector3.encode(message.direction, writer.uint32(10).fork()).ldelim();
    }
    if (message.speed !== 0) {
      writer.uint32(21).float(message.speed);
    }
    return writer;
  }
  MoveContinuous2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal41.default.Reader ? input : import_minimal41.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseMoveContinuous();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.direction = Vector3.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.speed = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  MoveContinuous2.decode = decode;
})(MoveContinuous || (MoveContinuous = {}));
function createBaseTextureMoveContinuous() {
  return { direction: void 0, speed: 0, movementType: void 0 };
}
var TextureMoveContinuous;
(function(TextureMoveContinuous2) {
  function encode(message, writer = import_minimal41.default.Writer.create()) {
    if (message.direction !== void 0) {
      Vector2.encode(message.direction, writer.uint32(10).fork()).ldelim();
    }
    if (message.speed !== 0) {
      writer.uint32(21).float(message.speed);
    }
    if (message.movementType !== void 0) {
      writer.uint32(24).int32(message.movementType);
    }
    return writer;
  }
  TextureMoveContinuous2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal41.default.Reader ? input : import_minimal41.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseTextureMoveContinuous();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.direction = Vector2.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.speed = reader.float();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.movementType = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  TextureMoveContinuous2.decode = decode;
})(TextureMoveContinuous || (TextureMoveContinuous = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/Tween.gen.js
var TweenSchema = {
  COMPONENT_ID: 1102,
  serialize(value, builder) {
    const writer = PBTween.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBTween.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBTween.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBTween"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/tween_sequence.gen.js
var import_minimal42 = __toESM(require_minimal2());
var TweenLoop;
(function(TweenLoop2) {
  TweenLoop2[TweenLoop2["TL_RESTART"] = 0] = "TL_RESTART";
  TweenLoop2[TweenLoop2["TL_YOYO"] = 1] = "TL_YOYO";
})(TweenLoop || (TweenLoop = {}));
function createBasePBTweenSequence() {
  return { sequence: [], loop: void 0 };
}
var PBTweenSequence;
(function(PBTweenSequence2) {
  function encode(message, writer = import_minimal42.default.Writer.create()) {
    for (const v of message.sequence) {
      PBTween.encode(v, writer.uint32(10).fork()).ldelim();
    }
    if (message.loop !== void 0) {
      writer.uint32(16).int32(message.loop);
    }
    return writer;
  }
  PBTweenSequence2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal42.default.Reader ? input : import_minimal42.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBTweenSequence();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.sequence.push(PBTween.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.loop = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBTweenSequence2.decode = decode;
})(PBTweenSequence || (PBTweenSequence = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/TweenSequence.gen.js
var TweenSequenceSchema = {
  COMPONENT_ID: 1104,
  serialize(value, builder) {
    const writer = PBTweenSequence.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBTweenSequence.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBTweenSequence.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBTweenSequence"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/tween_state.gen.js
var import_minimal43 = __toESM(require_minimal2());
var TweenStateStatus;
(function(TweenStateStatus2) {
  TweenStateStatus2[TweenStateStatus2["TS_ACTIVE"] = 0] = "TS_ACTIVE";
  TweenStateStatus2[TweenStateStatus2["TS_COMPLETED"] = 1] = "TS_COMPLETED";
  TweenStateStatus2[TweenStateStatus2["TS_PAUSED"] = 2] = "TS_PAUSED";
})(TweenStateStatus || (TweenStateStatus = {}));
function createBasePBTweenState() {
  return { state: 0, currentTime: 0 };
}
var PBTweenState;
(function(PBTweenState2) {
  function encode(message, writer = import_minimal43.default.Writer.create()) {
    if (message.state !== 0) {
      writer.uint32(8).int32(message.state);
    }
    if (message.currentTime !== 0) {
      writer.uint32(21).float(message.currentTime);
    }
    return writer;
  }
  PBTweenState2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal43.default.Reader ? input : import_minimal43.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBTweenState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.state = reader.int32();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.currentTime = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBTweenState2.decode = decode;
})(PBTweenState || (PBTweenState = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/TweenState.gen.js
var TweenStateSchema = {
  COMPONENT_ID: 1103,
  serialize(value, builder) {
    const writer = PBTweenState.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBTweenState.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBTweenState.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBTweenState"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_background.gen.js
var import_minimal45 = __toESM(require_minimal2());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/common/border_rect.gen.js
var import_minimal44 = __toESM(require_minimal2());
function createBaseBorderRect() {
  return { top: 0, left: 0, right: 0, bottom: 0 };
}
var BorderRect;
(function(BorderRect2) {
  function encode(message, writer = import_minimal44.default.Writer.create()) {
    if (message.top !== 0) {
      writer.uint32(13).float(message.top);
    }
    if (message.left !== 0) {
      writer.uint32(21).float(message.left);
    }
    if (message.right !== 0) {
      writer.uint32(29).float(message.right);
    }
    if (message.bottom !== 0) {
      writer.uint32(37).float(message.bottom);
    }
    return writer;
  }
  BorderRect2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal44.default.Reader ? input : import_minimal44.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseBorderRect();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.top = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.left = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.right = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.bottom = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  BorderRect2.decode = decode;
})(BorderRect || (BorderRect = {}));
function createBaseRect() {
  return { x: 0, y: 0, width: 0, height: 0 };
}
var Rect;
(function(Rect2) {
  function encode(message, writer = import_minimal44.default.Writer.create()) {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    if (message.width !== 0) {
      writer.uint32(29).float(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(37).float(message.height);
    }
    return writer;
  }
  Rect2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal44.default.Reader ? input : import_minimal44.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseRect();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.x = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.y = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.width = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.height = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Rect2.decode = decode;
})(Rect || (Rect = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_background.gen.js
var BackgroundTextureMode;
(function(BackgroundTextureMode2) {
  BackgroundTextureMode2[BackgroundTextureMode2["NINE_SLICES"] = 0] = "NINE_SLICES";
  BackgroundTextureMode2[BackgroundTextureMode2["CENTER"] = 1] = "CENTER";
  BackgroundTextureMode2[BackgroundTextureMode2["STRETCH"] = 2] = "STRETCH";
})(BackgroundTextureMode || (BackgroundTextureMode = {}));
function createBasePBUiBackground() {
  return { color: void 0, texture: void 0, textureMode: 0, textureSlices: void 0, uvs: [] };
}
var PBUiBackground;
(function(PBUiBackground2) {
  function encode(message, writer = import_minimal45.default.Writer.create()) {
    if (message.color !== void 0) {
      Color4.encode(message.color, writer.uint32(10).fork()).ldelim();
    }
    if (message.texture !== void 0) {
      TextureUnion.encode(message.texture, writer.uint32(18).fork()).ldelim();
    }
    if (message.textureMode !== 0) {
      writer.uint32(24).int32(message.textureMode);
    }
    if (message.textureSlices !== void 0) {
      BorderRect.encode(message.textureSlices, writer.uint32(34).fork()).ldelim();
    }
    writer.uint32(42).fork();
    for (const v of message.uvs) {
      writer.float(v);
    }
    writer.ldelim();
    return writer;
  }
  PBUiBackground2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal45.default.Reader ? input : import_minimal45.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBUiBackground();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.color = Color4.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.texture = TextureUnion.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.textureMode = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.textureSlices = BorderRect.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag === 45) {
            message.uvs.push(reader.float());
            continue;
          }
          if (tag === 42) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.uvs.push(reader.float());
            }
            continue;
          }
          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBUiBackground2.decode = decode;
})(PBUiBackground || (PBUiBackground = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/UiBackground.gen.js
var UiBackgroundSchema = {
  COMPONENT_ID: 1053,
  serialize(value, builder) {
    const writer = PBUiBackground.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBUiBackground.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBUiBackground.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBUiBackground"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_canvas_information.gen.js
var import_minimal46 = __toESM(require_minimal2());
function createBasePBUiCanvasInformation() {
  return { devicePixelRatio: 0, width: 0, height: 0, interactableArea: void 0 };
}
var PBUiCanvasInformation;
(function(PBUiCanvasInformation2) {
  function encode(message, writer = import_minimal46.default.Writer.create()) {
    if (message.devicePixelRatio !== 0) {
      writer.uint32(13).float(message.devicePixelRatio);
    }
    if (message.width !== 0) {
      writer.uint32(16).int32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(24).int32(message.height);
    }
    if (message.interactableArea !== void 0) {
      BorderRect.encode(message.interactableArea, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  }
  PBUiCanvasInformation2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal46.default.Reader ? input : import_minimal46.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBUiCanvasInformation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.devicePixelRatio = reader.float();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.width = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.height = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.interactableArea = BorderRect.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBUiCanvasInformation2.decode = decode;
})(PBUiCanvasInformation || (PBUiCanvasInformation = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/UiCanvasInformation.gen.js
var UiCanvasInformationSchema = {
  COMPONENT_ID: 1054,
  serialize(value, builder) {
    const writer = PBUiCanvasInformation.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBUiCanvasInformation.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBUiCanvasInformation.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBUiCanvasInformation"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_dropdown.gen.js
var import_minimal47 = __toESM(require_minimal2());
function createBasePBUiDropdown() {
  return {
    acceptEmpty: false,
    emptyLabel: void 0,
    options: [],
    selectedIndex: void 0,
    disabled: false,
    color: void 0,
    textAlign: void 0,
    font: void 0,
    fontSize: void 0
  };
}
var PBUiDropdown;
(function(PBUiDropdown2) {
  function encode(message, writer = import_minimal47.default.Writer.create()) {
    if (message.acceptEmpty === true) {
      writer.uint32(8).bool(message.acceptEmpty);
    }
    if (message.emptyLabel !== void 0) {
      writer.uint32(18).string(message.emptyLabel);
    }
    for (const v of message.options) {
      writer.uint32(26).string(v);
    }
    if (message.selectedIndex !== void 0) {
      writer.uint32(32).int32(message.selectedIndex);
    }
    if (message.disabled === true) {
      writer.uint32(40).bool(message.disabled);
    }
    if (message.color !== void 0) {
      Color4.encode(message.color, writer.uint32(50).fork()).ldelim();
    }
    if (message.textAlign !== void 0) {
      writer.uint32(80).int32(message.textAlign);
    }
    if (message.font !== void 0) {
      writer.uint32(88).int32(message.font);
    }
    if (message.fontSize !== void 0) {
      writer.uint32(96).int32(message.fontSize);
    }
    return writer;
  }
  PBUiDropdown2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal47.default.Reader ? input : import_minimal47.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBUiDropdown();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.acceptEmpty = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.emptyLabel = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.options.push(reader.string());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.selectedIndex = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.disabled = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.color = Color4.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }
          message.textAlign = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }
          message.font = reader.int32();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }
          message.fontSize = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBUiDropdown2.decode = decode;
})(PBUiDropdown || (PBUiDropdown = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/UiDropdown.gen.js
var UiDropdownSchema = {
  COMPONENT_ID: 1094,
  serialize(value, builder) {
    const writer = PBUiDropdown.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBUiDropdown.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBUiDropdown.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBUiDropdown"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_dropdown_result.gen.js
var import_minimal48 = __toESM(require_minimal2());
function createBasePBUiDropdownResult() {
  return { value: 0 };
}
var PBUiDropdownResult;
(function(PBUiDropdownResult2) {
  function encode(message, writer = import_minimal48.default.Writer.create()) {
    if (message.value !== 0) {
      writer.uint32(8).int32(message.value);
    }
    return writer;
  }
  PBUiDropdownResult2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal48.default.Reader ? input : import_minimal48.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBUiDropdownResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.value = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBUiDropdownResult2.decode = decode;
})(PBUiDropdownResult || (PBUiDropdownResult = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/UiDropdownResult.gen.js
var UiDropdownResultSchema = {
  COMPONENT_ID: 1096,
  serialize(value, builder) {
    const writer = PBUiDropdownResult.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBUiDropdownResult.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBUiDropdownResult.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBUiDropdownResult"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_input.gen.js
var import_minimal49 = __toESM(require_minimal2());
function createBasePBUiInput() {
  return {
    placeholder: "",
    color: void 0,
    placeholderColor: void 0,
    disabled: false,
    textAlign: void 0,
    font: void 0,
    fontSize: void 0,
    value: void 0
  };
}
var PBUiInput;
(function(PBUiInput2) {
  function encode(message, writer = import_minimal49.default.Writer.create()) {
    if (message.placeholder !== "") {
      writer.uint32(10).string(message.placeholder);
    }
    if (message.color !== void 0) {
      Color4.encode(message.color, writer.uint32(18).fork()).ldelim();
    }
    if (message.placeholderColor !== void 0) {
      Color4.encode(message.placeholderColor, writer.uint32(26).fork()).ldelim();
    }
    if (message.disabled === true) {
      writer.uint32(32).bool(message.disabled);
    }
    if (message.textAlign !== void 0) {
      writer.uint32(80).int32(message.textAlign);
    }
    if (message.font !== void 0) {
      writer.uint32(88).int32(message.font);
    }
    if (message.fontSize !== void 0) {
      writer.uint32(96).int32(message.fontSize);
    }
    if (message.value !== void 0) {
      writer.uint32(106).string(message.value);
    }
    return writer;
  }
  PBUiInput2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal49.default.Reader ? input : import_minimal49.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBUiInput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.placeholder = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.color = Color4.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.placeholderColor = Color4.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.disabled = reader.bool();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }
          message.textAlign = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }
          message.font = reader.int32();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }
          message.fontSize = reader.int32();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }
          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBUiInput2.decode = decode;
})(PBUiInput || (PBUiInput = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/UiInput.gen.js
var UiInputSchema = {
  COMPONENT_ID: 1093,
  serialize(value, builder) {
    const writer = PBUiInput.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBUiInput.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBUiInput.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBUiInput"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_input_result.gen.js
var import_minimal50 = __toESM(require_minimal2());
function createBasePBUiInputResult() {
  return { value: "", isSubmit: void 0 };
}
var PBUiInputResult;
(function(PBUiInputResult2) {
  function encode(message, writer = import_minimal50.default.Writer.create()) {
    if (message.value !== "") {
      writer.uint32(10).string(message.value);
    }
    if (message.isSubmit !== void 0) {
      writer.uint32(16).bool(message.isSubmit);
    }
    return writer;
  }
  PBUiInputResult2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal50.default.Reader ? input : import_minimal50.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBUiInputResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.value = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.isSubmit = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBUiInputResult2.decode = decode;
})(PBUiInputResult || (PBUiInputResult = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/UiInputResult.gen.js
var UiInputResultSchema = {
  COMPONENT_ID: 1095,
  serialize(value, builder) {
    const writer = PBUiInputResult.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBUiInputResult.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBUiInputResult.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBUiInputResult"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_text.gen.js
var import_minimal51 = __toESM(require_minimal2());
var TextWrap;
(function(TextWrap2) {
  TextWrap2[TextWrap2["TW_WRAP"] = 0] = "TW_WRAP";
  TextWrap2[TextWrap2["TW_NO_WRAP"] = 1] = "TW_NO_WRAP";
})(TextWrap || (TextWrap = {}));
function createBasePBUiText() {
  return {
    value: "",
    color: void 0,
    textAlign: void 0,
    font: void 0,
    fontSize: void 0,
    textWrap: void 0
  };
}
var PBUiText;
(function(PBUiText2) {
  function encode(message, writer = import_minimal51.default.Writer.create()) {
    if (message.value !== "") {
      writer.uint32(10).string(message.value);
    }
    if (message.color !== void 0) {
      Color4.encode(message.color, writer.uint32(18).fork()).ldelim();
    }
    if (message.textAlign !== void 0) {
      writer.uint32(24).int32(message.textAlign);
    }
    if (message.font !== void 0) {
      writer.uint32(32).int32(message.font);
    }
    if (message.fontSize !== void 0) {
      writer.uint32(40).int32(message.fontSize);
    }
    if (message.textWrap !== void 0) {
      writer.uint32(48).int32(message.textWrap);
    }
    return writer;
  }
  PBUiText2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal51.default.Reader ? input : import_minimal51.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBUiText();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.value = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.color = Color4.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.textAlign = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.font = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.fontSize = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }
          message.textWrap = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBUiText2.decode = decode;
})(PBUiText || (PBUiText = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/UiText.gen.js
var UiTextSchema = {
  COMPONENT_ID: 1052,
  serialize(value, builder) {
    const writer = PBUiText.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBUiText.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBUiText.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBUiText"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_transform.gen.js
var import_minimal52 = __toESM(require_minimal2());
var YGPositionType;
(function(YGPositionType2) {
  YGPositionType2[YGPositionType2["YGPT_RELATIVE"] = 0] = "YGPT_RELATIVE";
  YGPositionType2[YGPositionType2["YGPT_ABSOLUTE"] = 1] = "YGPT_ABSOLUTE";
})(YGPositionType || (YGPositionType = {}));
var YGAlign;
(function(YGAlign2) {
  YGAlign2[YGAlign2["YGA_AUTO"] = 0] = "YGA_AUTO";
  YGAlign2[YGAlign2["YGA_FLEX_START"] = 1] = "YGA_FLEX_START";
  YGAlign2[YGAlign2["YGA_CENTER"] = 2] = "YGA_CENTER";
  YGAlign2[YGAlign2["YGA_FLEX_END"] = 3] = "YGA_FLEX_END";
  YGAlign2[YGAlign2["YGA_STRETCH"] = 4] = "YGA_STRETCH";
  YGAlign2[YGAlign2["YGA_BASELINE"] = 5] = "YGA_BASELINE";
  YGAlign2[YGAlign2["YGA_SPACE_BETWEEN"] = 6] = "YGA_SPACE_BETWEEN";
  YGAlign2[YGAlign2["YGA_SPACE_AROUND"] = 7] = "YGA_SPACE_AROUND";
})(YGAlign || (YGAlign = {}));
var YGUnit;
(function(YGUnit2) {
  YGUnit2[YGUnit2["YGU_UNDEFINED"] = 0] = "YGU_UNDEFINED";
  YGUnit2[YGUnit2["YGU_POINT"] = 1] = "YGU_POINT";
  YGUnit2[YGUnit2["YGU_PERCENT"] = 2] = "YGU_PERCENT";
  YGUnit2[YGUnit2["YGU_AUTO"] = 3] = "YGU_AUTO";
})(YGUnit || (YGUnit = {}));
var YGFlexDirection;
(function(YGFlexDirection2) {
  YGFlexDirection2[YGFlexDirection2["YGFD_ROW"] = 0] = "YGFD_ROW";
  YGFlexDirection2[YGFlexDirection2["YGFD_COLUMN"] = 1] = "YGFD_COLUMN";
  YGFlexDirection2[YGFlexDirection2["YGFD_COLUMN_REVERSE"] = 2] = "YGFD_COLUMN_REVERSE";
  YGFlexDirection2[YGFlexDirection2["YGFD_ROW_REVERSE"] = 3] = "YGFD_ROW_REVERSE";
})(YGFlexDirection || (YGFlexDirection = {}));
var YGWrap;
(function(YGWrap2) {
  YGWrap2[YGWrap2["YGW_NO_WRAP"] = 0] = "YGW_NO_WRAP";
  YGWrap2[YGWrap2["YGW_WRAP"] = 1] = "YGW_WRAP";
  YGWrap2[YGWrap2["YGW_WRAP_REVERSE"] = 2] = "YGW_WRAP_REVERSE";
})(YGWrap || (YGWrap = {}));
var YGJustify;
(function(YGJustify2) {
  YGJustify2[YGJustify2["YGJ_FLEX_START"] = 0] = "YGJ_FLEX_START";
  YGJustify2[YGJustify2["YGJ_CENTER"] = 1] = "YGJ_CENTER";
  YGJustify2[YGJustify2["YGJ_FLEX_END"] = 2] = "YGJ_FLEX_END";
  YGJustify2[YGJustify2["YGJ_SPACE_BETWEEN"] = 3] = "YGJ_SPACE_BETWEEN";
  YGJustify2[YGJustify2["YGJ_SPACE_AROUND"] = 4] = "YGJ_SPACE_AROUND";
  YGJustify2[YGJustify2["YGJ_SPACE_EVENLY"] = 5] = "YGJ_SPACE_EVENLY";
})(YGJustify || (YGJustify = {}));
var YGOverflow;
(function(YGOverflow2) {
  YGOverflow2[YGOverflow2["YGO_VISIBLE"] = 0] = "YGO_VISIBLE";
  YGOverflow2[YGOverflow2["YGO_HIDDEN"] = 1] = "YGO_HIDDEN";
  YGOverflow2[YGOverflow2["YGO_SCROLL"] = 2] = "YGO_SCROLL";
})(YGOverflow || (YGOverflow = {}));
var YGDisplay;
(function(YGDisplay2) {
  YGDisplay2[YGDisplay2["YGD_FLEX"] = 0] = "YGD_FLEX";
  YGDisplay2[YGDisplay2["YGD_NONE"] = 1] = "YGD_NONE";
})(YGDisplay || (YGDisplay = {}));
var YGEdge;
(function(YGEdge2) {
  YGEdge2[YGEdge2["YGE_LEFT"] = 0] = "YGE_LEFT";
  YGEdge2[YGEdge2["YGE_TOP"] = 1] = "YGE_TOP";
  YGEdge2[YGEdge2["YGE_RIGHT"] = 2] = "YGE_RIGHT";
  YGEdge2[YGEdge2["YGE_BOTTOM"] = 3] = "YGE_BOTTOM";
  YGEdge2[YGEdge2["YGE_START"] = 4] = "YGE_START";
  YGEdge2[YGEdge2["YGE_END"] = 5] = "YGE_END";
  YGEdge2[YGEdge2["YGE_HORIZONTAL"] = 6] = "YGE_HORIZONTAL";
  YGEdge2[YGEdge2["YGE_VERTICAL"] = 7] = "YGE_VERTICAL";
  YGEdge2[YGEdge2["YGE_ALL"] = 8] = "YGE_ALL";
})(YGEdge || (YGEdge = {}));
var PointerFilterMode;
(function(PointerFilterMode2) {
  PointerFilterMode2[PointerFilterMode2["PFM_NONE"] = 0] = "PFM_NONE";
  PointerFilterMode2[PointerFilterMode2["PFM_BLOCK"] = 1] = "PFM_BLOCK";
})(PointerFilterMode || (PointerFilterMode = {}));
function createBasePBUiTransform() {
  return {
    parent: 0,
    rightOf: 0,
    alignContent: void 0,
    alignItems: void 0,
    flexWrap: void 0,
    flexShrink: void 0,
    positionType: 0,
    alignSelf: 0,
    flexDirection: 0,
    justifyContent: 0,
    overflow: 0,
    display: 0,
    flexBasisUnit: 0,
    flexBasis: 0,
    flexGrow: 0,
    widthUnit: 0,
    width: 0,
    heightUnit: 0,
    height: 0,
    minWidthUnit: 0,
    minWidth: 0,
    minHeightUnit: 0,
    minHeight: 0,
    maxWidthUnit: 0,
    maxWidth: 0,
    maxHeightUnit: 0,
    maxHeight: 0,
    positionLeftUnit: 0,
    positionLeft: 0,
    positionTopUnit: 0,
    positionTop: 0,
    positionRightUnit: 0,
    positionRight: 0,
    positionBottomUnit: 0,
    positionBottom: 0,
    marginLeftUnit: 0,
    marginLeft: 0,
    marginTopUnit: 0,
    marginTop: 0,
    marginRightUnit: 0,
    marginRight: 0,
    marginBottomUnit: 0,
    marginBottom: 0,
    paddingLeftUnit: 0,
    paddingLeft: 0,
    paddingTopUnit: 0,
    paddingTop: 0,
    paddingRightUnit: 0,
    paddingRight: 0,
    paddingBottomUnit: 0,
    paddingBottom: 0,
    pointerFilter: void 0,
    borderLeftWidthUnit: void 0,
    borderLeftWidth: void 0,
    borderTopWidthUnit: void 0,
    borderTopWidth: void 0,
    borderRightWidthUnit: void 0,
    borderRightWidth: void 0,
    borderBottomWidthUnit: void 0,
    borderBottomWidth: void 0,
    borderTopLeftRadiusUnit: void 0,
    borderTopLeftRadius: void 0,
    borderTopRightRadiusUnit: void 0,
    borderTopRightRadius: void 0,
    borderBottomLeftRadiusUnit: void 0,
    borderBottomLeftRadius: void 0,
    borderBottomRightRadiusUnit: void 0,
    borderBottomRightRadius: void 0,
    borderTopColor: void 0,
    borderBottomColor: void 0,
    borderLeftColor: void 0,
    borderRightColor: void 0,
    opacity: void 0,
    zIndex: void 0
  };
}
var PBUiTransform;
(function(PBUiTransform2) {
  function encode(message, writer = import_minimal52.default.Writer.create()) {
    if (message.parent !== 0) {
      writer.uint32(8).int32(message.parent);
    }
    if (message.rightOf !== 0) {
      writer.uint32(16).int32(message.rightOf);
    }
    if (message.alignContent !== void 0) {
      writer.uint32(24).int32(message.alignContent);
    }
    if (message.alignItems !== void 0) {
      writer.uint32(32).int32(message.alignItems);
    }
    if (message.flexWrap !== void 0) {
      writer.uint32(40).int32(message.flexWrap);
    }
    if (message.flexShrink !== void 0) {
      writer.uint32(53).float(message.flexShrink);
    }
    if (message.positionType !== 0) {
      writer.uint32(56).int32(message.positionType);
    }
    if (message.alignSelf !== 0) {
      writer.uint32(64).int32(message.alignSelf);
    }
    if (message.flexDirection !== 0) {
      writer.uint32(72).int32(message.flexDirection);
    }
    if (message.justifyContent !== 0) {
      writer.uint32(80).int32(message.justifyContent);
    }
    if (message.overflow !== 0) {
      writer.uint32(88).int32(message.overflow);
    }
    if (message.display !== 0) {
      writer.uint32(96).int32(message.display);
    }
    if (message.flexBasisUnit !== 0) {
      writer.uint32(104).int32(message.flexBasisUnit);
    }
    if (message.flexBasis !== 0) {
      writer.uint32(117).float(message.flexBasis);
    }
    if (message.flexGrow !== 0) {
      writer.uint32(125).float(message.flexGrow);
    }
    if (message.widthUnit !== 0) {
      writer.uint32(128).int32(message.widthUnit);
    }
    if (message.width !== 0) {
      writer.uint32(141).float(message.width);
    }
    if (message.heightUnit !== 0) {
      writer.uint32(144).int32(message.heightUnit);
    }
    if (message.height !== 0) {
      writer.uint32(157).float(message.height);
    }
    if (message.minWidthUnit !== 0) {
      writer.uint32(160).int32(message.minWidthUnit);
    }
    if (message.minWidth !== 0) {
      writer.uint32(173).float(message.minWidth);
    }
    if (message.minHeightUnit !== 0) {
      writer.uint32(176).int32(message.minHeightUnit);
    }
    if (message.minHeight !== 0) {
      writer.uint32(189).float(message.minHeight);
    }
    if (message.maxWidthUnit !== 0) {
      writer.uint32(192).int32(message.maxWidthUnit);
    }
    if (message.maxWidth !== 0) {
      writer.uint32(205).float(message.maxWidth);
    }
    if (message.maxHeightUnit !== 0) {
      writer.uint32(208).int32(message.maxHeightUnit);
    }
    if (message.maxHeight !== 0) {
      writer.uint32(221).float(message.maxHeight);
    }
    if (message.positionLeftUnit !== 0) {
      writer.uint32(224).int32(message.positionLeftUnit);
    }
    if (message.positionLeft !== 0) {
      writer.uint32(237).float(message.positionLeft);
    }
    if (message.positionTopUnit !== 0) {
      writer.uint32(240).int32(message.positionTopUnit);
    }
    if (message.positionTop !== 0) {
      writer.uint32(253).float(message.positionTop);
    }
    if (message.positionRightUnit !== 0) {
      writer.uint32(256).int32(message.positionRightUnit);
    }
    if (message.positionRight !== 0) {
      writer.uint32(269).float(message.positionRight);
    }
    if (message.positionBottomUnit !== 0) {
      writer.uint32(272).int32(message.positionBottomUnit);
    }
    if (message.positionBottom !== 0) {
      writer.uint32(285).float(message.positionBottom);
    }
    if (message.marginLeftUnit !== 0) {
      writer.uint32(288).int32(message.marginLeftUnit);
    }
    if (message.marginLeft !== 0) {
      writer.uint32(301).float(message.marginLeft);
    }
    if (message.marginTopUnit !== 0) {
      writer.uint32(304).int32(message.marginTopUnit);
    }
    if (message.marginTop !== 0) {
      writer.uint32(317).float(message.marginTop);
    }
    if (message.marginRightUnit !== 0) {
      writer.uint32(320).int32(message.marginRightUnit);
    }
    if (message.marginRight !== 0) {
      writer.uint32(333).float(message.marginRight);
    }
    if (message.marginBottomUnit !== 0) {
      writer.uint32(336).int32(message.marginBottomUnit);
    }
    if (message.marginBottom !== 0) {
      writer.uint32(349).float(message.marginBottom);
    }
    if (message.paddingLeftUnit !== 0) {
      writer.uint32(352).int32(message.paddingLeftUnit);
    }
    if (message.paddingLeft !== 0) {
      writer.uint32(365).float(message.paddingLeft);
    }
    if (message.paddingTopUnit !== 0) {
      writer.uint32(368).int32(message.paddingTopUnit);
    }
    if (message.paddingTop !== 0) {
      writer.uint32(381).float(message.paddingTop);
    }
    if (message.paddingRightUnit !== 0) {
      writer.uint32(384).int32(message.paddingRightUnit);
    }
    if (message.paddingRight !== 0) {
      writer.uint32(397).float(message.paddingRight);
    }
    if (message.paddingBottomUnit !== 0) {
      writer.uint32(400).int32(message.paddingBottomUnit);
    }
    if (message.paddingBottom !== 0) {
      writer.uint32(413).float(message.paddingBottom);
    }
    if (message.pointerFilter !== void 0) {
      writer.uint32(416).int32(message.pointerFilter);
    }
    if (message.borderLeftWidthUnit !== void 0) {
      writer.uint32(424).int32(message.borderLeftWidthUnit);
    }
    if (message.borderLeftWidth !== void 0) {
      writer.uint32(437).float(message.borderLeftWidth);
    }
    if (message.borderTopWidthUnit !== void 0) {
      writer.uint32(440).int32(message.borderTopWidthUnit);
    }
    if (message.borderTopWidth !== void 0) {
      writer.uint32(453).float(message.borderTopWidth);
    }
    if (message.borderRightWidthUnit !== void 0) {
      writer.uint32(456).int32(message.borderRightWidthUnit);
    }
    if (message.borderRightWidth !== void 0) {
      writer.uint32(469).float(message.borderRightWidth);
    }
    if (message.borderBottomWidthUnit !== void 0) {
      writer.uint32(472).int32(message.borderBottomWidthUnit);
    }
    if (message.borderBottomWidth !== void 0) {
      writer.uint32(485).float(message.borderBottomWidth);
    }
    if (message.borderTopLeftRadiusUnit !== void 0) {
      writer.uint32(488).int32(message.borderTopLeftRadiusUnit);
    }
    if (message.borderTopLeftRadius !== void 0) {
      writer.uint32(501).float(message.borderTopLeftRadius);
    }
    if (message.borderTopRightRadiusUnit !== void 0) {
      writer.uint32(504).int32(message.borderTopRightRadiusUnit);
    }
    if (message.borderTopRightRadius !== void 0) {
      writer.uint32(517).float(message.borderTopRightRadius);
    }
    if (message.borderBottomLeftRadiusUnit !== void 0) {
      writer.uint32(520).int32(message.borderBottomLeftRadiusUnit);
    }
    if (message.borderBottomLeftRadius !== void 0) {
      writer.uint32(533).float(message.borderBottomLeftRadius);
    }
    if (message.borderBottomRightRadiusUnit !== void 0) {
      writer.uint32(536).int32(message.borderBottomRightRadiusUnit);
    }
    if (message.borderBottomRightRadius !== void 0) {
      writer.uint32(549).float(message.borderBottomRightRadius);
    }
    if (message.borderTopColor !== void 0) {
      Color4.encode(message.borderTopColor, writer.uint32(554).fork()).ldelim();
    }
    if (message.borderBottomColor !== void 0) {
      Color4.encode(message.borderBottomColor, writer.uint32(562).fork()).ldelim();
    }
    if (message.borderLeftColor !== void 0) {
      Color4.encode(message.borderLeftColor, writer.uint32(570).fork()).ldelim();
    }
    if (message.borderRightColor !== void 0) {
      Color4.encode(message.borderRightColor, writer.uint32(578).fork()).ldelim();
    }
    if (message.opacity !== void 0) {
      writer.uint32(589).float(message.opacity);
    }
    if (message.zIndex !== void 0) {
      writer.uint32(616).int32(message.zIndex);
    }
    return writer;
  }
  PBUiTransform2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal52.default.Reader ? input : import_minimal52.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBUiTransform();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.parent = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.rightOf = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.alignContent = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.alignItems = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.flexWrap = reader.int32();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }
          message.flexShrink = reader.float();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.positionType = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }
          message.alignSelf = reader.int32();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }
          message.flexDirection = reader.int32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }
          message.justifyContent = reader.int32();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }
          message.overflow = reader.int32();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }
          message.display = reader.int32();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }
          message.flexBasisUnit = reader.int32();
          continue;
        case 14:
          if (tag !== 117) {
            break;
          }
          message.flexBasis = reader.float();
          continue;
        case 15:
          if (tag !== 125) {
            break;
          }
          message.flexGrow = reader.float();
          continue;
        case 16:
          if (tag !== 128) {
            break;
          }
          message.widthUnit = reader.int32();
          continue;
        case 17:
          if (tag !== 141) {
            break;
          }
          message.width = reader.float();
          continue;
        case 18:
          if (tag !== 144) {
            break;
          }
          message.heightUnit = reader.int32();
          continue;
        case 19:
          if (tag !== 157) {
            break;
          }
          message.height = reader.float();
          continue;
        case 20:
          if (tag !== 160) {
            break;
          }
          message.minWidthUnit = reader.int32();
          continue;
        case 21:
          if (tag !== 173) {
            break;
          }
          message.minWidth = reader.float();
          continue;
        case 22:
          if (tag !== 176) {
            break;
          }
          message.minHeightUnit = reader.int32();
          continue;
        case 23:
          if (tag !== 189) {
            break;
          }
          message.minHeight = reader.float();
          continue;
        case 24:
          if (tag !== 192) {
            break;
          }
          message.maxWidthUnit = reader.int32();
          continue;
        case 25:
          if (tag !== 205) {
            break;
          }
          message.maxWidth = reader.float();
          continue;
        case 26:
          if (tag !== 208) {
            break;
          }
          message.maxHeightUnit = reader.int32();
          continue;
        case 27:
          if (tag !== 221) {
            break;
          }
          message.maxHeight = reader.float();
          continue;
        case 28:
          if (tag !== 224) {
            break;
          }
          message.positionLeftUnit = reader.int32();
          continue;
        case 29:
          if (tag !== 237) {
            break;
          }
          message.positionLeft = reader.float();
          continue;
        case 30:
          if (tag !== 240) {
            break;
          }
          message.positionTopUnit = reader.int32();
          continue;
        case 31:
          if (tag !== 253) {
            break;
          }
          message.positionTop = reader.float();
          continue;
        case 32:
          if (tag !== 256) {
            break;
          }
          message.positionRightUnit = reader.int32();
          continue;
        case 33:
          if (tag !== 269) {
            break;
          }
          message.positionRight = reader.float();
          continue;
        case 34:
          if (tag !== 272) {
            break;
          }
          message.positionBottomUnit = reader.int32();
          continue;
        case 35:
          if (tag !== 285) {
            break;
          }
          message.positionBottom = reader.float();
          continue;
        case 36:
          if (tag !== 288) {
            break;
          }
          message.marginLeftUnit = reader.int32();
          continue;
        case 37:
          if (tag !== 301) {
            break;
          }
          message.marginLeft = reader.float();
          continue;
        case 38:
          if (tag !== 304) {
            break;
          }
          message.marginTopUnit = reader.int32();
          continue;
        case 39:
          if (tag !== 317) {
            break;
          }
          message.marginTop = reader.float();
          continue;
        case 40:
          if (tag !== 320) {
            break;
          }
          message.marginRightUnit = reader.int32();
          continue;
        case 41:
          if (tag !== 333) {
            break;
          }
          message.marginRight = reader.float();
          continue;
        case 42:
          if (tag !== 336) {
            break;
          }
          message.marginBottomUnit = reader.int32();
          continue;
        case 43:
          if (tag !== 349) {
            break;
          }
          message.marginBottom = reader.float();
          continue;
        case 44:
          if (tag !== 352) {
            break;
          }
          message.paddingLeftUnit = reader.int32();
          continue;
        case 45:
          if (tag !== 365) {
            break;
          }
          message.paddingLeft = reader.float();
          continue;
        case 46:
          if (tag !== 368) {
            break;
          }
          message.paddingTopUnit = reader.int32();
          continue;
        case 47:
          if (tag !== 381) {
            break;
          }
          message.paddingTop = reader.float();
          continue;
        case 48:
          if (tag !== 384) {
            break;
          }
          message.paddingRightUnit = reader.int32();
          continue;
        case 49:
          if (tag !== 397) {
            break;
          }
          message.paddingRight = reader.float();
          continue;
        case 50:
          if (tag !== 400) {
            break;
          }
          message.paddingBottomUnit = reader.int32();
          continue;
        case 51:
          if (tag !== 413) {
            break;
          }
          message.paddingBottom = reader.float();
          continue;
        case 52:
          if (tag !== 416) {
            break;
          }
          message.pointerFilter = reader.int32();
          continue;
        case 53:
          if (tag !== 424) {
            break;
          }
          message.borderLeftWidthUnit = reader.int32();
          continue;
        case 54:
          if (tag !== 437) {
            break;
          }
          message.borderLeftWidth = reader.float();
          continue;
        case 55:
          if (tag !== 440) {
            break;
          }
          message.borderTopWidthUnit = reader.int32();
          continue;
        case 56:
          if (tag !== 453) {
            break;
          }
          message.borderTopWidth = reader.float();
          continue;
        case 57:
          if (tag !== 456) {
            break;
          }
          message.borderRightWidthUnit = reader.int32();
          continue;
        case 58:
          if (tag !== 469) {
            break;
          }
          message.borderRightWidth = reader.float();
          continue;
        case 59:
          if (tag !== 472) {
            break;
          }
          message.borderBottomWidthUnit = reader.int32();
          continue;
        case 60:
          if (tag !== 485) {
            break;
          }
          message.borderBottomWidth = reader.float();
          continue;
        case 61:
          if (tag !== 488) {
            break;
          }
          message.borderTopLeftRadiusUnit = reader.int32();
          continue;
        case 62:
          if (tag !== 501) {
            break;
          }
          message.borderTopLeftRadius = reader.float();
          continue;
        case 63:
          if (tag !== 504) {
            break;
          }
          message.borderTopRightRadiusUnit = reader.int32();
          continue;
        case 64:
          if (tag !== 517) {
            break;
          }
          message.borderTopRightRadius = reader.float();
          continue;
        case 65:
          if (tag !== 520) {
            break;
          }
          message.borderBottomLeftRadiusUnit = reader.int32();
          continue;
        case 66:
          if (tag !== 533) {
            break;
          }
          message.borderBottomLeftRadius = reader.float();
          continue;
        case 67:
          if (tag !== 536) {
            break;
          }
          message.borderBottomRightRadiusUnit = reader.int32();
          continue;
        case 68:
          if (tag !== 549) {
            break;
          }
          message.borderBottomRightRadius = reader.float();
          continue;
        case 69:
          if (tag !== 554) {
            break;
          }
          message.borderTopColor = Color4.decode(reader, reader.uint32());
          continue;
        case 70:
          if (tag !== 562) {
            break;
          }
          message.borderBottomColor = Color4.decode(reader, reader.uint32());
          continue;
        case 71:
          if (tag !== 570) {
            break;
          }
          message.borderLeftColor = Color4.decode(reader, reader.uint32());
          continue;
        case 72:
          if (tag !== 578) {
            break;
          }
          message.borderRightColor = Color4.decode(reader, reader.uint32());
          continue;
        case 73:
          if (tag !== 589) {
            break;
          }
          message.opacity = reader.float();
          continue;
        case 77:
          if (tag !== 616) {
            break;
          }
          message.zIndex = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBUiTransform2.decode = decode;
})(PBUiTransform || (PBUiTransform = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/UiTransform.gen.js
var UiTransformSchema = {
  COMPONENT_ID: 1050,
  serialize(value, builder) {
    const writer = PBUiTransform.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBUiTransform.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBUiTransform.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBUiTransform"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/video_event.gen.js
var import_minimal53 = __toESM(require_minimal2());
var VideoState;
(function(VideoState2) {
  VideoState2[VideoState2["VS_NONE"] = 0] = "VS_NONE";
  VideoState2[VideoState2["VS_ERROR"] = 1] = "VS_ERROR";
  VideoState2[VideoState2["VS_LOADING"] = 2] = "VS_LOADING";
  VideoState2[VideoState2["VS_READY"] = 3] = "VS_READY";
  VideoState2[VideoState2["VS_PLAYING"] = 4] = "VS_PLAYING";
  VideoState2[VideoState2["VS_BUFFERING"] = 5] = "VS_BUFFERING";
  VideoState2[VideoState2["VS_SEEKING"] = 6] = "VS_SEEKING";
  VideoState2[VideoState2["VS_PAUSED"] = 7] = "VS_PAUSED";
})(VideoState || (VideoState = {}));
function createBasePBVideoEvent() {
  return { timestamp: 0, tickNumber: 0, currentOffset: 0, videoLength: 0, state: 0 };
}
var PBVideoEvent;
(function(PBVideoEvent2) {
  function encode(message, writer = import_minimal53.default.Writer.create()) {
    if (message.timestamp !== 0) {
      writer.uint32(8).uint32(message.timestamp);
    }
    if (message.tickNumber !== 0) {
      writer.uint32(16).uint32(message.tickNumber);
    }
    if (message.currentOffset !== 0) {
      writer.uint32(29).float(message.currentOffset);
    }
    if (message.videoLength !== 0) {
      writer.uint32(37).float(message.videoLength);
    }
    if (message.state !== 0) {
      writer.uint32(40).int32(message.state);
    }
    return writer;
  }
  PBVideoEvent2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal53.default.Reader ? input : import_minimal53.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBVideoEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.timestamp = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.tickNumber = reader.uint32();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.currentOffset = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.videoLength = reader.float();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.state = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBVideoEvent2.decode = decode;
})(PBVideoEvent || (PBVideoEvent = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/VideoEvent.gen.js
var VideoEventSchema = {
  COMPONENT_ID: 1044,
  serialize(value, builder) {
    const writer = PBVideoEvent.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBVideoEvent.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBVideoEvent.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBVideoEvent"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/video_player.gen.js
var import_minimal54 = __toESM(require_minimal2());
function createBasePBVideoPlayer() {
  return {
    src: "",
    playing: void 0,
    position: void 0,
    volume: void 0,
    playbackRate: void 0,
    loop: void 0,
    spatial: void 0,
    spatialMinDistance: void 0,
    spatialMaxDistance: void 0
  };
}
var PBVideoPlayer;
(function(PBVideoPlayer2) {
  function encode(message, writer = import_minimal54.default.Writer.create()) {
    if (message.src !== "") {
      writer.uint32(10).string(message.src);
    }
    if (message.playing !== void 0) {
      writer.uint32(16).bool(message.playing);
    }
    if (message.position !== void 0) {
      writer.uint32(29).float(message.position);
    }
    if (message.volume !== void 0) {
      writer.uint32(37).float(message.volume);
    }
    if (message.playbackRate !== void 0) {
      writer.uint32(45).float(message.playbackRate);
    }
    if (message.loop !== void 0) {
      writer.uint32(48).bool(message.loop);
    }
    if (message.spatial !== void 0) {
      writer.uint32(56).bool(message.spatial);
    }
    if (message.spatialMinDistance !== void 0) {
      writer.uint32(69).float(message.spatialMinDistance);
    }
    if (message.spatialMaxDistance !== void 0) {
      writer.uint32(77).float(message.spatialMaxDistance);
    }
    return writer;
  }
  PBVideoPlayer2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal54.default.Reader ? input : import_minimal54.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBVideoPlayer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.src = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.playing = reader.bool();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }
          message.position = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }
          message.volume = reader.float();
          continue;
        case 5:
          if (tag !== 45) {
            break;
          }
          message.playbackRate = reader.float();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }
          message.loop = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.spatial = reader.bool();
          continue;
        case 8:
          if (tag !== 69) {
            break;
          }
          message.spatialMinDistance = reader.float();
          continue;
        case 9:
          if (tag !== 77) {
            break;
          }
          message.spatialMaxDistance = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBVideoPlayer2.decode = decode;
})(PBVideoPlayer || (PBVideoPlayer = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/VideoPlayer.gen.js
var VideoPlayerSchema = {
  COMPONENT_ID: 1043,
  serialize(value, builder) {
    const writer = PBVideoPlayer.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBVideoPlayer.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBVideoPlayer.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBVideoPlayer"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/virtual_camera.gen.js
var import_minimal56 = __toESM(require_minimal2());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/common/camera_transition.gen.js
var import_minimal55 = __toESM(require_minimal2());
function createBaseCameraTransition() {
  return { transitionMode: void 0 };
}
var CameraTransition;
(function(CameraTransition2) {
  function encode(message, writer = import_minimal55.default.Writer.create()) {
    switch (message.transitionMode?.$case) {
      case "time":
        writer.uint32(13).float(message.transitionMode.time);
        break;
      case "speed":
        writer.uint32(21).float(message.transitionMode.speed);
        break;
    }
    return writer;
  }
  CameraTransition2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal55.default.Reader ? input : import_minimal55.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseCameraTransition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }
          message.transitionMode = { $case: "time", time: reader.float() };
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }
          message.transitionMode = { $case: "speed", speed: reader.float() };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  CameraTransition2.decode = decode;
})(CameraTransition || (CameraTransition = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/virtual_camera.gen.js
function createBasePBVirtualCamera() {
  return { defaultTransition: void 0, lookAtEntity: void 0 };
}
var PBVirtualCamera;
(function(PBVirtualCamera2) {
  function encode(message, writer = import_minimal56.default.Writer.create()) {
    if (message.defaultTransition !== void 0) {
      CameraTransition.encode(message.defaultTransition, writer.uint32(10).fork()).ldelim();
    }
    if (message.lookAtEntity !== void 0) {
      writer.uint32(16).uint32(message.lookAtEntity);
    }
    return writer;
  }
  PBVirtualCamera2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal56.default.Reader ? input : import_minimal56.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBVirtualCamera();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.defaultTransition = CameraTransition.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.lookAtEntity = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBVirtualCamera2.decode = decode;
})(PBVirtualCamera || (PBVirtualCamera = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/VirtualCamera.gen.js
var VirtualCameraSchema = {
  COMPONENT_ID: 1076,
  serialize(value, builder) {
    const writer = PBVirtualCamera.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBVirtualCamera.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBVirtualCamera.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBVirtualCamera"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/visibility_component.gen.js
var import_minimal57 = __toESM(require_minimal2());
function createBasePBVisibilityComponent() {
  return { visible: void 0, propagateToChildren: void 0 };
}
var PBVisibilityComponent;
(function(PBVisibilityComponent2) {
  function encode(message, writer = import_minimal57.default.Writer.create()) {
    if (message.visible !== void 0) {
      writer.uint32(8).bool(message.visible);
    }
    if (message.propagateToChildren !== void 0) {
      writer.uint32(16).bool(message.propagateToChildren);
    }
    return writer;
  }
  PBVisibilityComponent2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal57.default.Reader ? input : import_minimal57.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBasePBVisibilityComponent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.visible = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.propagateToChildren = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  PBVisibilityComponent2.decode = decode;
})(PBVisibilityComponent || (PBVisibilityComponent = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/VisibilityComponent.gen.js
var VisibilityComponentSchema = {
  COMPONENT_ID: 1081,
  serialize(value, builder) {
    const writer = PBVisibilityComponent.encode(value);
    const buffer2 = new Uint8Array(writer.finish(), 0, writer.len);
    builder.writeBuffer(buffer2, false);
  },
  deserialize(reader) {
    return PBVisibilityComponent.decode(reader.buffer(), reader.remainingBytes());
  },
  create() {
    return PBVisibilityComponent.decode(new Uint8Array());
  },
  jsonSchema: {
    type: "object",
    properties: {},
    serializationType: "protocol-buffer",
    protocolBuffer: "PBVisibilityComponent"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/index.gen.js
var Animator = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::Animator", AnimatorSchema);
var AudioEvent = (engine2) => /* @__PURE__ */ engine2.defineValueSetComponentFromSchema("core::AudioEvent", AudioEventSchema, {
  timestampFunction: (t) => t.timestamp,
  maxElements: 100
});
var AudioSource = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::AudioSource", AudioSourceSchema);
var AudioStream = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::AudioStream", AudioStreamSchema);
var AvatarAttach = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::AvatarAttach", AvatarAttachSchema);
var AvatarBase = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::AvatarBase", AvatarBaseSchema);
var AvatarEmoteCommand = (engine2) => /* @__PURE__ */ engine2.defineValueSetComponentFromSchema("core::AvatarEmoteCommand", AvatarEmoteCommandSchema, {
  timestampFunction: (t) => t.timestamp,
  maxElements: 100
});
var AvatarEquippedData = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::AvatarEquippedData", AvatarEquippedDataSchema);
var AvatarModifierArea = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::AvatarModifierArea", AvatarModifierAreaSchema);
var AvatarShape = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::AvatarShape", AvatarShapeSchema);
var Billboard = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::Billboard", BillboardSchema);
var CameraMode = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::CameraMode", CameraModeSchema);
var CameraModeArea = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::CameraModeArea", CameraModeAreaSchema);
var EngineInfo = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::EngineInfo", EngineInfoSchema);
var GltfContainer = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::GltfContainer", GltfContainerSchema);
var GltfContainerLoadingState = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::GltfContainerLoadingState", GltfContainerLoadingStateSchema);
var GltfNodeModifiers = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::GltfNodeModifiers", GltfNodeModifiersSchema);
var InputModifier = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::InputModifier", InputModifierSchema);
var LightSource = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::LightSource", LightSourceSchema);
var MainCamera = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::MainCamera", MainCameraSchema);
var Material = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::Material", MaterialSchema);
var MeshCollider = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::MeshCollider", MeshColliderSchema);
var MeshRenderer = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::MeshRenderer", MeshRendererSchema);
var NftShape = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::NftShape", NftShapeSchema);
var PlayerIdentityData = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::PlayerIdentityData", PlayerIdentityDataSchema);
var PointerEvents = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::PointerEvents", PointerEventsSchema);
var PointerEventsResult = (engine2) => /* @__PURE__ */ engine2.defineValueSetComponentFromSchema("core::PointerEventsResult", PointerEventsResultSchema, {
  timestampFunction: (t) => t.timestamp,
  maxElements: 100
});
var PointerLock = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::PointerLock", PointerLockSchema);
var PrimaryPointerInfo = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::PrimaryPointerInfo", PrimaryPointerInfoSchema);
var Raycast = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::Raycast", RaycastSchema);
var RaycastResult = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::RaycastResult", RaycastResultSchema);
var RealmInfo = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::RealmInfo", RealmInfoSchema);
var SkyboxTime = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::SkyboxTime", SkyboxTimeSchema);
var TextShape2 = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::TextShape", TextShapeSchema);
var TriggerArea = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::TriggerArea", TriggerAreaSchema);
var TriggerAreaResult = (engine2) => /* @__PURE__ */ engine2.defineValueSetComponentFromSchema("core::TriggerAreaResult", TriggerAreaResultSchema, {
  timestampFunction: (t) => t.timestamp,
  maxElements: 100
});
var Tween = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::Tween", TweenSchema);
var TweenSequence = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::TweenSequence", TweenSequenceSchema);
var TweenState = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::TweenState", TweenStateSchema);
var UiBackground = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::UiBackground", UiBackgroundSchema);
var UiCanvasInformation = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::UiCanvasInformation", UiCanvasInformationSchema);
var UiDropdown = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::UiDropdown", UiDropdownSchema);
var UiDropdownResult = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::UiDropdownResult", UiDropdownResultSchema);
var UiInput = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::UiInput", UiInputSchema);
var UiInputResult = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::UiInputResult", UiInputResultSchema);
var UiText = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::UiText", UiTextSchema);
var UiTransform = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::UiTransform", UiTransformSchema);
var VideoEvent = (engine2) => /* @__PURE__ */ engine2.defineValueSetComponentFromSchema("core::VideoEvent", VideoEventSchema, {
  timestampFunction: (t) => t.timestamp,
  maxElements: 100
});
var VideoPlayer = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::VideoPlayer", VideoPlayerSchema);
var VirtualCamera = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::VirtualCamera", VirtualCameraSchema);
var VisibilityComponent = (engine2) => /* @__PURE__ */ engine2.defineComponentFromSchema("core::VisibilityComponent", VisibilityComponentSchema);
var componentDefinitionByName = {
  "core::Animator": Animator,
  "core::AudioEvent": AudioEvent,
  "core::AudioSource": AudioSource,
  "core::AudioStream": AudioStream,
  "core::AvatarAttach": AvatarAttach,
  "core::AvatarBase": AvatarBase,
  "core::AvatarEmoteCommand": AvatarEmoteCommand,
  "core::AvatarEquippedData": AvatarEquippedData,
  "core::AvatarModifierArea": AvatarModifierArea,
  "core::AvatarShape": AvatarShape,
  "core::Billboard": Billboard,
  "core::CameraMode": CameraMode,
  "core::CameraModeArea": CameraModeArea,
  "core::EngineInfo": EngineInfo,
  "core::GltfContainer": GltfContainer,
  "core::GltfContainerLoadingState": GltfContainerLoadingState,
  "core::GltfNodeModifiers": GltfNodeModifiers,
  "core::InputModifier": InputModifier,
  "core::LightSource": LightSource,
  "core::MainCamera": MainCamera,
  "core::Material": Material,
  "core::MeshCollider": MeshCollider,
  "core::MeshRenderer": MeshRenderer,
  "core::NftShape": NftShape,
  "core::PlayerIdentityData": PlayerIdentityData,
  "core::PointerEvents": PointerEvents,
  "core::PointerEventsResult": PointerEventsResult,
  "core::PointerLock": PointerLock,
  "core::PrimaryPointerInfo": PrimaryPointerInfo,
  "core::Raycast": Raycast,
  "core::RaycastResult": RaycastResult,
  "core::RealmInfo": RealmInfo,
  "core::SkyboxTime": SkyboxTime,
  "core::TextShape": TextShape2,
  "core::TriggerArea": TriggerArea,
  "core::TriggerAreaResult": TriggerAreaResult,
  "core::Tween": Tween,
  "core::TweenSequence": TweenSequence,
  "core::TweenState": TweenState,
  "core::UiBackground": UiBackground,
  "core::UiCanvasInformation": UiCanvasInformation,
  "core::UiDropdown": UiDropdown,
  "core::UiDropdownResult": UiDropdownResult,
  "core::UiInput": UiInput,
  "core::UiInputResult": UiInputResult,
  "core::UiText": UiText,
  "core::UiTransform": UiTransform,
  "core::VideoEvent": VideoEvent,
  "core::VideoPlayer": VideoPlayer,
  "core::VirtualCamera": VirtualCamera,
  "core::VisibilityComponent": VisibilityComponent
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/extended/AudioSource.js
function defineAudioSourceComponent(engine2) {
  const theComponent = AudioSource(engine2);
  return {
    ...theComponent,
    playSound(entity, src, resetCursor = true) {
      const audioSource = theComponent.getMutableOrNull(entity);
      if (!audioSource)
        return false;
      audioSource.audioClipUrl = src;
      audioSource.playing = true;
      audioSource.currentTime = resetCursor ? 0 : audioSource.currentTime;
      return true;
    },
    stopSound(entity, resetCursor = true) {
      const audioSource = theComponent.getMutableOrNull(entity);
      if (!audioSource)
        return false;
      audioSource.playing = false;
      audioSource.currentTime = resetCursor ? 0 : audioSource.currentTime;
      return true;
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/extended/Material.js
var TextureHelper = {
  Common(texture) {
    return {
      tex: {
        $case: "texture",
        texture
      }
    };
  },
  Avatar(avatarTexture) {
    return {
      tex: {
        $case: "avatarTexture",
        avatarTexture
      }
    };
  },
  Video(videoTexture) {
    return {
      tex: {
        $case: "videoTexture",
        videoTexture
      }
    };
  }
};
function defineMaterialComponent(engine2) {
  const theComponent = Material(engine2);
  return {
    ...theComponent,
    Texture: TextureHelper,
    setBasicMaterial(entity, material) {
      theComponent.createOrReplace(entity, {
        material: {
          $case: "unlit",
          unlit: material
        }
      });
    },
    setPbrMaterial(entity, material) {
      theComponent.createOrReplace(entity, {
        material: {
          $case: "pbr",
          pbr: material
        }
      });
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/extended/MeshCollider.js
function defineMeshColliderComponent(engine2) {
  const theComponent = MeshCollider(engine2);
  function getCollisionMask(layers) {
    if (Array.isArray(layers)) {
      return layers.map((item) => item).reduce((prev, item) => prev | item, 0);
    } else if (layers) {
      return layers;
    }
  }
  return {
    ...theComponent,
    setBox(entity, colliderLayers) {
      theComponent.createOrReplace(entity, {
        mesh: { $case: "box", box: {} },
        collisionMask: getCollisionMask(colliderLayers)
      });
    },
    setPlane(entity, colliderLayers) {
      theComponent.createOrReplace(entity, {
        mesh: { $case: "plane", plane: {} },
        collisionMask: getCollisionMask(colliderLayers)
      });
    },
    setCylinder(entity, radiusBottom, radiusTop, colliderLayers) {
      theComponent.createOrReplace(entity, {
        mesh: { $case: "cylinder", cylinder: { radiusBottom, radiusTop } },
        collisionMask: getCollisionMask(colliderLayers)
      });
    },
    setSphere(entity, colliderLayers) {
      theComponent.createOrReplace(entity, {
        mesh: { $case: "sphere", sphere: {} },
        collisionMask: getCollisionMask(colliderLayers)
      });
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/extended/MeshRenderer.js
function defineMeshRendererComponent(engine2) {
  const theComponent = MeshRenderer(engine2);
  return {
    ...theComponent,
    setBox(entity, uvs) {
      theComponent.createOrReplace(entity, {
        mesh: { $case: "box", box: { uvs: uvs || [] } }
      });
    },
    setPlane(entity, uvs) {
      theComponent.createOrReplace(entity, {
        mesh: { $case: "plane", plane: { uvs: uvs || [] } }
      });
    },
    setCylinder(entity, radiusBottom, radiusTop) {
      theComponent.createOrReplace(entity, {
        mesh: { $case: "cylinder", cylinder: { radiusBottom, radiusTop } }
      });
    },
    setSphere(entity) {
      theComponent.createOrReplace(entity, {
        mesh: { $case: "sphere", sphere: {} }
      });
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/extended/Tween.js
var TweenHelper = {
  Move(move) {
    return {
      $case: "move",
      move
    };
  },
  MoveContinuous(moveContinuous) {
    return {
      $case: "moveContinuous",
      moveContinuous
    };
  },
  Rotate(rotate) {
    return {
      $case: "rotate",
      rotate
    };
  },
  RotateContinuous(rotateContinuous) {
    return {
      $case: "rotateContinuous",
      rotateContinuous
    };
  },
  Scale(scale) {
    return {
      $case: "scale",
      scale
    };
  },
  TextureMove(textureMove) {
    return {
      $case: "textureMove",
      textureMove
    };
  },
  TextureMoveContinuous(textureMoveContinuous) {
    return {
      $case: "textureMoveContinuous",
      textureMoveContinuous
    };
  }
};
function defineTweenComponent(engine2) {
  const theComponent = Tween(engine2);
  return {
    ...theComponent,
    Mode: TweenHelper,
    setMove(entity, start, end, duration, easingFunction = 0) {
      theComponent.createOrReplace(entity, {
        mode: {
          $case: "move",
          move: {
            start,
            end
          }
        },
        duration,
        easingFunction,
        playing: true
      });
    },
    setScale(entity, start, end, duration, easingFunction = 0) {
      theComponent.createOrReplace(entity, {
        mode: {
          $case: "scale",
          scale: {
            start,
            end
          }
        },
        duration,
        easingFunction,
        playing: true
      });
    },
    setRotate(entity, start, end, duration, easingFunction = 0) {
      theComponent.createOrReplace(entity, {
        mode: {
          $case: "rotate",
          rotate: {
            start,
            end
          }
        },
        duration,
        easingFunction,
        playing: true
      });
    },
    setTextureMove(entity, start, end, duration, movementType = 0, easingFunction = 0) {
      theComponent.createOrReplace(entity, {
        mode: {
          $case: "textureMove",
          textureMove: {
            start,
            end,
            movementType
          }
        },
        duration,
        easingFunction,
        playing: true
      });
    },
    setMoveContinuous(entity, direction, speed, duration = 0) {
      theComponent.createOrReplace(entity, {
        mode: {
          $case: "moveContinuous",
          moveContinuous: {
            direction,
            speed
          }
        },
        duration,
        easingFunction: 0,
        playing: true
      });
    },
    setRotateContinuous(entity, direction, speed, duration = 0) {
      theComponent.createOrReplace(entity, {
        mode: {
          $case: "rotateContinuous",
          rotateContinuous: {
            direction,
            speed
          }
        },
        duration,
        easingFunction: 0,
        playing: true
      });
    },
    setTextureMoveContinuous(entity, direction, speed, movementType = 0, duration = 0) {
      theComponent.createOrReplace(entity, {
        mode: {
          $case: "textureMoveContinuous",
          textureMoveContinuous: {
            direction,
            speed,
            movementType
          }
        },
        duration,
        easingFunction: 0,
        playing: true
      });
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/Array.js
var IArray = (type) => {
  return {
    serialize(value, builder) {
      builder.writeUint32(value.length);
      for (const item of value) {
        type.serialize(item, builder);
      }
    },
    deserialize(reader) {
      const newArray = [];
      const length2 = reader.readUint32();
      for (let index = 0; index < length2; index++) {
        newArray.push(type.deserialize(reader));
      }
      return newArray;
    },
    create() {
      return [];
    },
    jsonSchema: {
      type: "array",
      items: type.jsonSchema,
      serializationType: "array"
    }
  };
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/basic/Boolean.js
var Bool = {
  serialize(value, builder) {
    builder.writeInt8(value ? 1 : 0);
  },
  deserialize(reader) {
    return reader.readInt8() === 1;
  },
  create() {
    return false;
  },
  jsonSchema: {
    type: "boolean",
    serializationType: "boolean"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/basic/Integer.js
var Int64 = {
  serialize(value, builder) {
    builder.writeInt64(BigInt(value));
  },
  deserialize(reader) {
    return Number(reader.readInt64());
  },
  create() {
    return 0;
  },
  jsonSchema: {
    type: "integer",
    serializationType: "int64"
  }
};
var Int32 = {
  serialize(value, builder) {
    builder.writeInt32(value);
  },
  deserialize(reader) {
    return reader.readInt32();
  },
  create() {
    return 0;
  },
  jsonSchema: {
    type: "integer",
    serializationType: "int32"
  }
};
var Int16 = {
  serialize(value, builder) {
    builder.writeInt16(value);
  },
  deserialize(reader) {
    return reader.readInt16();
  },
  create() {
    return 0;
  },
  jsonSchema: {
    type: "integer",
    serializationType: "int16"
  }
};
var Int8 = {
  serialize(value, builder) {
    builder.writeInt8(value);
  },
  deserialize(reader) {
    return reader.readInt8();
  },
  create() {
    return 0;
  },
  jsonSchema: {
    type: "integer",
    serializationType: "int8"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/basic/String.js
var FlatString = {
  serialize(value, builder) {
    builder.writeUtf8String(value);
  },
  deserialize(reader) {
    return reader.readUtf8String();
  },
  create() {
    return "";
  },
  jsonSchema: {
    type: "string",
    serializationType: "utf8-string"
  }
};
var EcsString = FlatString;

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/basic/Enum.js
function validateMemberValuesAreNumbersAndInRangeInt32(enumValue) {
  const MIN_VALUE2 = -(2 ** 31), MAX_VALUE2 = 2 ** 31 - 1;
  let valueCount = 0, totalCount = 0;
  for (const key in enumValue) {
    if (typeof enumValue[key] === "number") {
      if (enumValue[key] > MAX_VALUE2 || enumValue[key] < MIN_VALUE2) {
        throw new Error(`Enum member values must be numbers within the range of ${MIN_VALUE2} to ${MAX_VALUE2}.`);
      }
      valueCount++;
    }
    totalCount++;
  }
  if (totalCount !== valueCount * 2) {
    throw new Error("All enum member values must be of numeric type.");
  }
}
function validateMemberValuesAreStrings(enumValue) {
  for (const key in enumValue) {
    if (typeof enumValue[key] !== "string") {
      throw new Error("All enum member values must be of string type.");
    }
  }
}
var IntEnumReflectionType = "enum-int";
var IntEnum = (enumObject, defaultValue) => {
  validateMemberValuesAreNumbersAndInRangeInt32(enumObject);
  return {
    serialize(value, builder) {
      Int32.serialize(value, builder);
    },
    deserialize(reader) {
      return Int32.deserialize(reader);
    },
    create() {
      return defaultValue;
    },
    jsonSchema: {
      // JSON-schema
      type: "integer",
      enum: Object.values(enumObject).filter((item) => Number.isInteger(item)),
      default: defaultValue,
      // @dcl/ecs Schema Spec
      serializationType: IntEnumReflectionType,
      enumObject
    }
  };
};
var StringEnumReflectionType = "enum-string";
var StringEnum = (enumObject, defaultValue) => {
  validateMemberValuesAreStrings(enumObject);
  return {
    serialize(value, builder) {
      FlatString.serialize(value, builder);
    },
    deserialize(reader) {
      return FlatString.deserialize(reader);
    },
    create() {
      return defaultValue;
    },
    jsonSchema: {
      // JSON-schema
      type: "string",
      enum: Object.values(enumObject),
      default: defaultValue,
      // @dcl/ecs Schema Spec
      serializationType: StringEnumReflectionType,
      enumObject
    }
  };
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/basic/Float.js
var Float32 = {
  serialize(value, builder) {
    builder.writeFloat32(value);
  },
  deserialize(reader) {
    return reader.readFloat32();
  },
  create() {
    return 0;
  },
  jsonSchema: {
    type: "number",
    serializationType: "float32"
  }
};
var Float64 = {
  serialize(value, builder) {
    builder.writeFloat64(value);
  },
  deserialize(reader) {
    return reader.readFloat64();
  },
  create() {
    return 0;
  },
  jsonSchema: {
    type: "number",
    serializationType: "float64"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/custom/Color3.js
var Color3Schema = {
  serialize(value, builder) {
    builder.writeFloat32(value.r);
    builder.writeFloat32(value.g);
    builder.writeFloat32(value.b);
  },
  deserialize(reader) {
    return {
      r: reader.readFloat32(),
      g: reader.readFloat32(),
      b: reader.readFloat32()
    };
  },
  create() {
    return { r: 0, g: 0, b: 0 };
  },
  jsonSchema: {
    type: "object",
    properties: {
      r: { type: "number" },
      g: { type: "number" },
      b: { type: "number" }
    },
    serializationType: "color3"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/custom/Color4.js
var Color4Schema = {
  serialize(value, builder) {
    builder.writeFloat32(value.r);
    builder.writeFloat32(value.g);
    builder.writeFloat32(value.b);
    builder.writeFloat32(value.a);
  },
  deserialize(reader) {
    return {
      r: reader.readFloat32(),
      g: reader.readFloat32(),
      b: reader.readFloat32(),
      a: reader.readFloat32()
    };
  },
  create() {
    return { r: 0, g: 0, b: 0, a: 0 };
  },
  jsonSchema: {
    type: "object",
    properties: {
      r: { type: "number" },
      g: { type: "number" },
      b: { type: "number" },
      a: { type: "number" }
    },
    serializationType: "color4"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/custom/Entity.js
var EntitySchema = {
  serialize(value, builder) {
    builder.writeInt32(value);
  },
  deserialize(reader) {
    return reader.readInt32();
  },
  create() {
    return 0;
  },
  jsonSchema: {
    type: "integer",
    serializationType: "entity"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/custom/Quaternion.js
var QuaternionSchema = {
  serialize(value, builder) {
    builder.writeFloat32(value.x);
    builder.writeFloat32(value.y);
    builder.writeFloat32(value.z);
    builder.writeFloat32(value.w);
  },
  deserialize(reader) {
    return {
      x: reader.readFloat32(),
      y: reader.readFloat32(),
      z: reader.readFloat32(),
      w: reader.readFloat32()
    };
  },
  create() {
    return { x: 0, y: 0, z: 0, w: 0 };
  },
  jsonSchema: {
    type: "object",
    properties: {
      x: { type: "number" },
      y: { type: "number" },
      z: { type: "number" },
      w: { type: "number" }
    },
    serializationType: "quaternion"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/custom/Vector3.js
var Vector3Schema = {
  serialize(value, builder) {
    builder.writeFloat32(value.x);
    builder.writeFloat32(value.y);
    builder.writeFloat32(value.z);
  },
  deserialize(reader) {
    return {
      x: reader.readFloat32(),
      y: reader.readFloat32(),
      z: reader.readFloat32()
    };
  },
  create() {
    return { x: 0, y: 0, z: 0 };
  },
  jsonSchema: {
    type: "object",
    properties: {
      x: { type: "number" },
      y: { type: "number" },
      z: { type: "number" },
      w: { type: "number" }
    },
    serializationType: "vector3"
  }
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/Map.js
var IMap = (spec, defaultValue) => {
  const specReflection = Object.keys(spec).reduce((specReflection2, currentKey) => {
    specReflection2[currentKey] = spec[currentKey].jsonSchema;
    return specReflection2;
  }, {});
  return {
    serialize(value, builder) {
      for (const key in spec) {
        spec[key].serialize(value[key], builder);
      }
    },
    deserialize(reader) {
      const newValue = {};
      for (const key in spec) {
        ;
        newValue[key] = spec[key].deserialize(reader);
      }
      return newValue;
    },
    create() {
      const newValue = {};
      for (const key in spec) {
        ;
        newValue[key] = spec[key].create();
      }
      return { ...newValue, ...defaultValue };
    },
    extend: (base) => {
      const newValue = {};
      for (const key in spec) {
        ;
        newValue[key] = spec[key].create();
      }
      return { ...newValue, ...defaultValue, ...base };
    },
    jsonSchema: {
      type: "object",
      properties: specReflection,
      serializationType: "map"
    }
  };
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/Optional.js
var IOptional = (spec) => {
  return {
    serialize(value, builder) {
      if (value) {
        builder.writeInt8(1);
        spec.serialize(value, builder);
      } else {
        builder.writeInt8(0);
      }
    },
    deserialize(reader) {
      const exists = reader.readInt8();
      if (exists) {
        return spec.deserialize(reader);
      }
    },
    create() {
      return void 0;
    },
    jsonSchema: {
      type: spec.jsonSchema.type,
      serializationType: "optional",
      optionalJsonSchema: spec.jsonSchema
    }
  };
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/OneOf.js
var IOneOf = (specs) => {
  const specKeys = Object.keys(specs);
  const keyToIndex = specKeys.reduce((dict, key, index) => {
    dict[key] = index;
    return dict;
  }, {});
  const specReflection = specKeys.reduce((specReflection2, currentKey) => {
    specReflection2[currentKey] = specs[currentKey].jsonSchema;
    return specReflection2;
  }, {});
  return {
    serialize({ $case, value }, builder) {
      const _value = keyToIndex[$case.toString()] + 1;
      builder.writeUint8(_value);
      specs[$case].serialize(value, builder);
    },
    deserialize(reader) {
      const $case = specKeys[reader.readInt8() - 1];
      const value = specs[$case].deserialize(reader);
      return { $case, value };
    },
    create() {
      return {};
    },
    jsonSchema: {
      type: "object",
      properties: specReflection,
      serializationType: "one-of"
    }
  };
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/buildSchema/utils.js
var isSchemaType = (value, types) => types.includes(value.serializationType);
var isOneOfJsonSchema = (type) => isSchemaType(type, ["one-of"]);
var getUnknownSchema = () => ({
  type: { type: "object", serializationType: "unknown" },
  value: void 0
});
var isCompoundType = (type) => isSchemaType(type, ["array", "map"]);
var getTypeAndValue = (properties, value, key) => {
  const type = properties[key];
  const valueKey = value[key];
  if (isOneOfJsonSchema(type)) {
    const typedMapValue = valueKey;
    if (!typedMapValue.$case)
      return getUnknownSchema();
    const propType = type.properties[typedMapValue.$case];
    if (isCompoundType(propType))
      value[key] = { [typedMapValue.$case]: typedMapValue.value };
    return { type: propType, value: typedMapValue.value };
  }
  return { type, value: valueKey };
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/buildSchema/index.js
var primitiveSchemas = {
  [Bool.jsonSchema.serializationType]: Bool,
  [EcsString.jsonSchema.serializationType]: EcsString,
  [Float32.jsonSchema.serializationType]: Float32,
  [Float64.jsonSchema.serializationType]: Float64,
  [Int8.jsonSchema.serializationType]: Int8,
  [Int16.jsonSchema.serializationType]: Int16,
  [Int32.jsonSchema.serializationType]: Int32,
  [Int64.jsonSchema.serializationType]: Int64,
  [Vector3Schema.jsonSchema.serializationType]: Vector3Schema,
  [QuaternionSchema.jsonSchema.serializationType]: QuaternionSchema,
  [Color3Schema.jsonSchema.serializationType]: Color3Schema,
  [Color4Schema.jsonSchema.serializationType]: Color4Schema,
  [EntitySchema.jsonSchema.serializationType]: EntitySchema
};
function jsonSchemaToSchema(jsonSchema) {
  if (primitiveSchemas[jsonSchema.serializationType]) {
    return primitiveSchemas[jsonSchema.serializationType];
  }
  if (jsonSchema.serializationType === "map") {
    const mapJsonSchema = jsonSchema;
    const spec = {};
    for (const key in mapJsonSchema.properties) {
      spec[key] = jsonSchemaToSchema(mapJsonSchema.properties[key]);
    }
    return IMap(spec);
  }
  if (jsonSchema.serializationType === "optional") {
    const withItemsJsonSchema = jsonSchema;
    return IOptional(jsonSchemaToSchema(withItemsJsonSchema.optionalJsonSchema));
  }
  if (jsonSchema.serializationType === "array") {
    const withItemsJsonSchema = jsonSchema;
    return IArray(jsonSchemaToSchema(withItemsJsonSchema.items));
  }
  if (jsonSchema.serializationType === "enum-int") {
    const enumJsonSchema = jsonSchema;
    return IntEnum(enumJsonSchema.enumObject, enumJsonSchema.default);
  }
  if (jsonSchema.serializationType === "enum-string") {
    const enumJsonSchema = jsonSchema;
    return StringEnum(enumJsonSchema.enumObject, enumJsonSchema.default);
  }
  if (jsonSchema.serializationType === "one-of") {
    const oneOfJsonSchema = jsonSchema;
    const spec = {};
    for (const key in oneOfJsonSchema.properties) {
      spec[key] = jsonSchemaToSchema(oneOfJsonSchema.properties[key]);
    }
    return IOneOf(spec);
  }
  throw new Error(`${jsonSchema.serializationType} is not supported as reverse schema generation.`);
}
function mutateValues(jsonSchema, value, mutateFn) {
  if (jsonSchema.serializationType === "map") {
    const { properties } = jsonSchema;
    const typedValue = value;
    for (const key in properties) {
      const { type, value: mapValue } = getTypeAndValue(properties, typedValue, key);
      if (type.serializationType === "unknown")
        continue;
      if (isCompoundType(type)) {
        mutateValues(type, mapValue, mutateFn);
      } else {
        const newValue = mutateFn(mapValue, type);
        if (newValue.changed) {
          typedValue[key] = newValue.value;
        }
      }
    }
  } else if (jsonSchema.serializationType === "array") {
    const { items } = jsonSchema;
    const arrayValue = value;
    for (let i = 0, n = arrayValue.length; i < n; i++) {
      const { type, value: value2 } = getTypeAndValue({ items }, { items: arrayValue[i] }, "items");
      if (isCompoundType(type)) {
        mutateValues(type, value2, mutateFn);
      } else {
        const newValue = mutateFn(value2, type);
        if (newValue.changed) {
          arrayValue[i] = newValue.value;
        }
      }
    }
  }
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/schemas/index.js
var Schemas;
(function(Schemas2) {
  Schemas2.Boolean = Bool;
  Schemas2.String = EcsString;
  Schemas2.Float = Float32;
  Schemas2.Double = Float64;
  Schemas2.Byte = Int8;
  Schemas2.Short = Int16;
  Schemas2.Int = Int32;
  Schemas2.Int64 = Int64;
  Schemas2.Number = Float32;
  Schemas2.Vector3 = Vector3Schema;
  Schemas2.Quaternion = QuaternionSchema;
  Schemas2.Color3 = Color3Schema;
  Schemas2.Color4 = Color4Schema;
  Schemas2.Entity = EntitySchema;
  Schemas2.EnumNumber = IntEnum;
  Schemas2.EnumString = StringEnum;
  Schemas2.Array = IArray;
  Schemas2.Map = IMap;
  Schemas2.Optional = IOptional;
  Schemas2.OneOf = IOneOf;
  Schemas2.fromJson = jsonSchemaToSchema;
  Schemas2.mutateNestedValues = mutateValues;
})(Schemas || (Schemas = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/manual/Name.js
function defineNameComponent(engine2) {
  const Name3 = engine2.defineComponent("core-schema::Name", {
    value: Schemas.String
  });
  return Name3;
}
var Name_default = defineNameComponent;

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/manual/NetworkEntity.js
function defineNetworkEntityComponent(engine2) {
  const EntityNetwork = engine2.defineComponent("core-schema::Network-Entity", {
    networkId: Schemas.Int64,
    entityId: Schemas.Entity
  });
  return EntityNetwork;
}
var NetworkEntity_default = defineNetworkEntityComponent;

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/manual/NetworkParent.js
function defineNetworkParentComponent(engine2) {
  const EntityNetwork = engine2.defineComponent("core-schema::Network-Parent", {
    networkId: Schemas.Int64,
    entityId: Schemas.Entity
  });
  return EntityNetwork;
}
var NetworkParent_default = defineNetworkParentComponent;

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/manual/Transform.js
var TRANSFORM_LENGTH = 44;
var TransformSchema = {
  serialize(value, builder) {
    const ptr = builder.incrementWriteOffset(TRANSFORM_LENGTH);
    builder.setFloat32(ptr, value.position.x);
    builder.setFloat32(ptr + 4, value.position.y);
    builder.setFloat32(ptr + 8, value.position.z);
    builder.setFloat32(ptr + 12, value.rotation.x);
    builder.setFloat32(ptr + 16, value.rotation.y);
    builder.setFloat32(ptr + 20, value.rotation.z);
    builder.setFloat32(ptr + 24, value.rotation.w);
    builder.setFloat32(ptr + 28, value.scale.x);
    builder.setFloat32(ptr + 32, value.scale.y);
    builder.setFloat32(ptr + 36, value.scale.z);
    builder.setUint32(ptr + 40, value.parent || 0);
  },
  deserialize(reader) {
    const ptr = reader.incrementReadOffset(TRANSFORM_LENGTH);
    return {
      position: {
        x: reader.getFloat32(ptr),
        y: reader.getFloat32(ptr + 4),
        z: reader.getFloat32(ptr + 8)
      },
      rotation: {
        x: reader.getFloat32(ptr + 12),
        y: reader.getFloat32(ptr + 16),
        z: reader.getFloat32(ptr + 20),
        w: reader.getFloat32(ptr + 24)
      },
      scale: {
        x: reader.getFloat32(ptr + 28),
        y: reader.getFloat32(ptr + 32),
        z: reader.getFloat32(ptr + 36)
      },
      parent: reader.getUint32(ptr + 40)
    };
  },
  create() {
    return {
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      parent: 0
    };
  },
  extend(value) {
    return {
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      parent: 0,
      ...value
    };
  },
  jsonSchema: {
    type: "object",
    properties: {
      position: {
        type: "object",
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          z: { type: "number" }
        }
      },
      scale: {
        type: "object",
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          z: { type: "number" }
        }
      },
      rotation: {
        type: "object",
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          z: { type: "number" },
          w: { type: "number" }
        }
      },
      parent: { type: "integer" }
    },
    serializationType: "transform"
  }
};
function defineTransformComponent(engine2) {
  const transformDef = engine2.defineComponentFromSchema("core::Transform", TransformSchema);
  return {
    ...transformDef,
    create(entity, val) {
      return transformDef.create(entity, TransformSchema.extend(val));
    },
    createOrReplace(entity, val) {
      return transformDef.createOrReplace(entity, TransformSchema.extend(val));
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/common/media_state.gen.js
var MediaState;
(function(MediaState2) {
  MediaState2[MediaState2["MS_NONE"] = 0] = "MS_NONE";
  MediaState2[MediaState2["MS_ERROR"] = 1] = "MS_ERROR";
  MediaState2[MediaState2["MS_LOADING"] = 2] = "MS_LOADING";
  MediaState2[MediaState2["MS_READY"] = 3] = "MS_READY";
  MediaState2[MediaState2["MS_PLAYING"] = 4] = "MS_PLAYING";
  MediaState2[MediaState2["MS_BUFFERING"] = 5] = "MS_BUFFERING";
  MediaState2[MediaState2["MS_SEEKING"] = 6] = "MS_SEEKING";
  MediaState2[MediaState2["MS_PAUSED"] = 7] = "MS_PAUSED";
})(MediaState || (MediaState = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/manual/Tags.js
function defineTagsComponent(engine2) {
  const Tags3 = engine2.defineComponent("core-schema::Tags", {
    tags: Schemas.Array(Schemas.String)
  });
  return {
    ...Tags3,
    add(entity, tagName) {
      const tagsComponent = Tags3.getMutableOrNull(entity);
      if (tagsComponent) {
        tagsComponent.tags.push(tagName);
      } else {
        Tags3.createOrReplace(entity, { tags: [tagName] });
      }
      return true;
    },
    remove(entity, tagName) {
      const tagsComponent = Tags3.getMutableOrNull(entity);
      if (!tagsComponent || !tagsComponent.tags)
        return false;
      const newTags = tagsComponent.tags.filter((tag) => tag !== tagName);
      if (newTags.length === tagsComponent.tags.length)
        return false;
      tagsComponent.tags = newTags;
      return true;
    }
  };
}
var Tags_default = defineTagsComponent;

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/index.js
var Transform = (engine2) => defineTransformComponent(engine2);
var Material2 = (engine2) => defineMaterialComponent(engine2);
var AudioSource2 = (engine2) => defineAudioSourceComponent(engine2);
var MeshRenderer2 = (engine2) => defineMeshRendererComponent(engine2);
var MeshCollider2 = (engine2) => defineMeshColliderComponent(engine2);
var Tween2 = (engine2) => defineTweenComponent(engine2);
var Name = (engine2) => Name_default(engine2);
var Tags = (engine2) => Tags_default(engine2);
var NetworkEntity = (engine2) => NetworkEntity_default(engine2);
var NetworkParent = (engine2) => NetworkParent_default(engine2);

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/component-names.gen.js
var coreComponentMappings = {
  "core::Transform": 1,
  "core::Animator": 1042,
  "core::AudioEvent": 1105,
  "core::AudioSource": 1020,
  "core::AudioStream": 1021,
  "core::AvatarAttach": 1073,
  "core::AvatarBase": 1087,
  "core::AvatarEmoteCommand": 1088,
  "core::AvatarEquippedData": 1091,
  "core::AvatarModifierArea": 1070,
  "core::AvatarShape": 1080,
  "core::Billboard": 1090,
  "core::CameraMode": 1072,
  "core::CameraModeArea": 1071,
  "core::EngineInfo": 1048,
  "core::GltfContainer": 1041,
  "core::GltfContainerLoadingState": 1049,
  "core::GltfNodeModifiers": 1099,
  "core::InputModifier": 1078,
  "core::LightSource": 1079,
  "core::MainCamera": 1075,
  "core::MapPin": 1097,
  "core::Material": 1017,
  "core::MeshCollider": 1019,
  "core::MeshRenderer": 1018,
  "core::NftShape": 1040,
  "core::PlayerIdentityData": 1089,
  "core::PointerEvents": 1062,
  "core::PointerEventsResult": 1063,
  "core::PointerLock": 1074,
  "core::PrimaryPointerInfo": 1209,
  "core::Raycast": 1067,
  "core::RaycastResult": 1068,
  "core::RealmInfo": 1106,
  "core::SkyboxTime": 1210,
  "core::TextShape": 1030,
  "core::TriggerArea": 1060,
  "core::TriggerAreaResult": 1061,
  "core::Tween": 1102,
  "core::TweenSequence": 1104,
  "core::TweenState": 1103,
  "core::UiBackground": 1053,
  "core::UiCanvasInformation": 1054,
  "core::UiDropdown": 1094,
  "core::UiDropdownResult": 1096,
  "core::UiInput": 1093,
  "core::UiInputResult": 1095,
  "core::UiText": 1052,
  "core::UiTransform": 1050,
  "core::VideoEvent": 1044,
  "core::VideoPlayer": 1043,
  "core::VirtualCamera": 1076,
  "core::VisibilityComponent": 1081
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/component-number.js
var utf8 = __toESM(require_utf8());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/runtime/crc.js
var CRC_TABLE = new Int32Array([
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
]);
function _crc32(buf, previous) {
  let crc = ~~previous ^ -1;
  for (let n = 0; n < buf.length; n++) {
    crc = CRC_TABLE[(crc ^ buf[n]) & 255] ^ crc >>> 8;
  }
  return crc ^ -1;
}
function unsignedCRC32(data, prev = 0) {
  return _crc32(data, prev) >>> 0;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/component-number.js
var MAX_STATIC_COMPONENT = 1 << 11;
function componentNumberFromName(componentName) {
  if (coreComponentMappings[componentName])
    return coreComponentMappings[componentName];
  const bytes = new Uint8Array(128);
  utf8.write(componentName, bytes, 0);
  return (unsignedCRC32(bytes) + MAX_STATIC_COMPONENT & 4294967295) >>> 0;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/runtime/invariant.js
var __DEV__ = typeof DEBUG === "boolean" && DEBUG || typeof process === "object" && true || false;
function checkNotThenable(t, error) {
  if (__DEV__) {
    if (t && typeof t === "object" && typeof t.then === "function") {
      throw new Error(error);
    }
  }
  return t;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/systems/crdt/gset.js
function createVersionGSet() {
  const lastVersion = /* @__PURE__ */ new Map();
  return {
    /**
     *
     * @param number
     * @param version
     * @returns
     */
    addTo(number, version) {
      if (version < 0) {
        return false;
      }
      const currentValue = lastVersion.get(number);
      if (currentValue !== void 0 && currentValue >= version) {
        return true;
      }
      lastVersion.set(number, version);
      return true;
    },
    /**
     * @returns the set with [number, version] of each value
     */
    has(n, v) {
      const currentValue = lastVersion.get(n);
      if (currentValue !== void 0 && currentValue >= v) {
        return true;
      }
      return false;
    },
    /**
     * Warning: this function returns the reference to the internal map,
     *  if you need to mutate some value, make a copy.
     * For optimization purpose the copy isn't made here.
     *
     * @returns the map of number to version
     */
    getMap() {
      return lastVersion;
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/engine/entity.js
var MAX_U16 = 65535;
var MASK_UPPER_16_ON_32 = 4294901760;
var AMOUNT_VERSION_AVAILABLE = MAX_U16 + 1;
var MAX_ENTITY_NUMBER = MAX_U16;
var RESERVED_STATIC_ENTITIES = 512;
var EntityUtils;
(function(EntityUtils2) {
  function fromEntityId(entityId) {
    return [(entityId & MAX_U16) >>> 0, ((entityId & MASK_UPPER_16_ON_32) >> 16 & MAX_U16) >>> 0];
  }
  EntityUtils2.fromEntityId = fromEntityId;
  function toEntityId(entityNumber, entityVersion) {
    return (entityNumber & MAX_U16 | (entityVersion & MAX_U16) << 16) >>> 0;
  }
  EntityUtils2.toEntityId = toEntityId;
})(EntityUtils || (EntityUtils = {}));
var EntityState;
(function(EntityState2) {
  EntityState2[EntityState2["Unknown"] = 0] = "Unknown";
  EntityState2[EntityState2["UsedEntity"] = 1] = "UsedEntity";
  EntityState2[EntityState2["Removed"] = 2] = "Removed";
  EntityState2[EntityState2["Reserved"] = 3] = "Reserved";
})(EntityState || (EntityState = {}));
function createEntityContainer(opts) {
  const reservedStaticEntities = opts?.reservedStaticEntities ?? RESERVED_STATIC_ENTITIES;
  let entityCounter = reservedStaticEntities;
  const usedEntities = /* @__PURE__ */ new Set();
  let toRemoveEntities = [];
  const removedEntities = createVersionGSet();
  function generateNewEntity() {
    if (entityCounter > MAX_ENTITY_NUMBER - 1) {
      throw new Error(`It fails trying to generate an entity out of range ${MAX_ENTITY_NUMBER}.`);
    }
    const entityNumber = entityCounter++;
    const entityVersion = removedEntities.getMap().has(entityNumber) ? removedEntities.getMap().get(entityNumber) + 1 : 0;
    const entity = EntityUtils.toEntityId(entityNumber, entityVersion);
    if (usedEntities.has(entity)) {
      return generateNewEntity();
    }
    usedEntities.add(entity);
    return entity;
  }
  function generateEntity() {
    const usedSize = usedEntities.size;
    if (usedSize + reservedStaticEntities >= entityCounter) {
      return generateNewEntity();
    }
    for (const [number, version] of removedEntities.getMap()) {
      if (version < MAX_U16) {
        const entity = EntityUtils.toEntityId(number, version + 1);
        if (!usedEntities.has(entity) && !toRemoveEntities.includes(entity)) {
          usedEntities.add(entity);
          return entity;
        }
      }
    }
    return generateNewEntity();
  }
  function removeEntity(entity) {
    if (entity < reservedStaticEntities)
      return false;
    if (usedEntities.has(entity)) {
      usedEntities.delete(entity);
      toRemoveEntities.push(entity);
    } else {
      updateRemovedEntity(entity);
    }
    return true;
  }
  function releaseRemovedEntities() {
    const arr = toRemoveEntities;
    if (arr.length) {
      toRemoveEntities = [];
      for (const entity of arr) {
        const [n, v] = EntityUtils.fromEntityId(entity);
        removedEntities.addTo(n, v);
      }
    }
    return arr;
  }
  function updateRemovedEntity(entity) {
    const [n, v] = EntityUtils.fromEntityId(entity);
    removedEntities.addTo(n, v);
    for (let i = 0; i <= v; i++) {
      usedEntities.delete(EntityUtils.toEntityId(n, i));
    }
    return true;
  }
  function updateUsedEntity(entity) {
    const [n, v] = EntityUtils.fromEntityId(entity);
    if (removedEntities.has(n, v))
      return false;
    if (v > 0) {
      for (let i = 0; i <= v - 1; i++) {
        usedEntities.delete(EntityUtils.toEntityId(n, i));
      }
      removedEntities.addTo(n, v - 1);
    }
    usedEntities.add(entity);
    return true;
  }
  function getEntityState(entity) {
    const [n, v] = EntityUtils.fromEntityId(entity);
    if (n < reservedStaticEntities) {
      return EntityState.Reserved;
    }
    if (usedEntities.has(entity)) {
      return EntityState.UsedEntity;
    }
    const removedVersion = removedEntities.getMap().get(n);
    if (removedVersion !== void 0 && removedVersion >= v) {
      return EntityState.Removed;
    }
    return EntityState.Unknown;
  }
  return {
    generateEntity,
    removeEntity,
    getExistingEntities() {
      return new Set(usedEntities);
    },
    getEntityState,
    releaseRemovedEntities,
    updateRemovedEntity,
    updateUsedEntity
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/ByteBuffer/index.js
var utf82 = __toESM(require_utf8());
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ReadWriteByteBuffer_instances;
var _ReadWriteByteBuffer_woAdd;
var _ReadWriteByteBuffer_roAdd;
function getNextSize(currentSize, intendedSize) {
  const minNewSize = Math.max(currentSize, intendedSize) + 1024;
  return Math.ceil(minNewSize / 1024) * 1024;
}
var defaultInitialCapacity = 10240;
var ReadWriteByteBuffer = class {
  /**
   * @param buffer - The initial buffer, provide a buffer if you need to set "initial capacity"
   * @param readingOffset - Set the cursor where begins to read. Default 0
   * @param writingOffset - Set the cursor to not start writing from the begin of it. Defaults to the buffer size
   */
  constructor(buffer2, readingOffset, writingOffset) {
    _ReadWriteByteBuffer_instances.add(this);
    this._buffer = buffer2 || new Uint8Array(defaultInitialCapacity);
    this.view = new DataView(this._buffer.buffer, this._buffer.byteOffset);
    this.woffset = writingOffset ?? (buffer2 ? this._buffer.length : null) ?? 0;
    this.roffset = readingOffset ?? 0;
  }
  buffer() {
    return this._buffer;
  }
  bufferLength() {
    return this._buffer.length;
  }
  resetBuffer() {
    this.roffset = 0;
    this.woffset = 0;
  }
  currentReadOffset() {
    return this.roffset;
  }
  currentWriteOffset() {
    return this.woffset;
  }
  incrementReadOffset(amount) {
    return __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, amount);
  }
  remainingBytes() {
    return this.woffset - this.roffset;
  }
  readFloat32() {
    return this.view.getFloat32(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 4), true);
  }
  readFloat64() {
    return this.view.getFloat64(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 8), true);
  }
  readInt8() {
    return this.view.getInt8(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 1));
  }
  readInt16() {
    return this.view.getInt16(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 2), true);
  }
  readInt32() {
    return this.view.getInt32(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 4), true);
  }
  readInt64() {
    return this.view.getBigInt64(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 8), true);
  }
  readUint8() {
    return this.view.getUint8(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 1));
  }
  readUint16() {
    return this.view.getUint16(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 2), true);
  }
  readUint32() {
    return this.view.getUint32(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 4), true);
  }
  readUint64() {
    return this.view.getBigUint64(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 8), true);
  }
  readBuffer() {
    const length2 = this.view.getUint32(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 4), true);
    return this._buffer.subarray(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, length2), __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 0));
  }
  readUtf8String() {
    const length2 = this.view.getUint32(__classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 4), true);
    return utf82.read(this._buffer, __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, length2), __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_roAdd).call(this, 0));
  }
  incrementWriteOffset(amount) {
    return __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, amount);
  }
  toBinary() {
    return this._buffer.subarray(0, this.woffset);
  }
  toCopiedBinary() {
    return new Uint8Array(this.toBinary());
  }
  writeBuffer(value, writeLength = true) {
    if (writeLength) {
      this.writeUint32(value.byteLength);
    }
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, value.byteLength);
    this._buffer.set(value, o);
  }
  writeUtf8String(value, writeLength = true) {
    const byteLength = utf82.length(value);
    if (writeLength) {
      this.writeUint32(byteLength);
    }
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, byteLength);
    utf82.write(value, this._buffer, o);
  }
  writeFloat32(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 4);
    this.view.setFloat32(o, value, true);
  }
  writeFloat64(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 8);
    this.view.setFloat64(o, value, true);
  }
  writeInt8(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 1);
    this.view.setInt8(o, value);
  }
  writeInt16(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 2);
    this.view.setInt16(o, value, true);
  }
  writeInt32(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 4);
    this.view.setInt32(o, value, true);
  }
  writeInt64(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 8);
    this.view.setBigInt64(o, value, true);
  }
  writeUint8(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 1);
    this.view.setUint8(o, value);
  }
  writeUint16(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 2);
    this.view.setUint16(o, value, true);
  }
  writeUint32(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 4);
    this.view.setUint32(o, value, true);
  }
  writeUint64(value) {
    const o = __classPrivateFieldGet(this, _ReadWriteByteBuffer_instances, "m", _ReadWriteByteBuffer_woAdd).call(this, 8);
    this.view.setBigUint64(o, value, true);
  }
  // DataView Proxy
  getFloat32(offset) {
    return this.view.getFloat32(offset, true);
  }
  getFloat64(offset) {
    return this.view.getFloat64(offset, true);
  }
  getInt8(offset) {
    return this.view.getInt8(offset);
  }
  getInt16(offset) {
    return this.view.getInt16(offset, true);
  }
  getInt32(offset) {
    return this.view.getInt32(offset, true);
  }
  getInt64(offset) {
    return this.view.getBigInt64(offset, true);
  }
  getUint8(offset) {
    return this.view.getUint8(offset);
  }
  getUint16(offset) {
    return this.view.getUint16(offset, true);
  }
  getUint32(offset) {
    return this.view.getUint32(offset, true);
  }
  getUint64(offset) {
    return this.view.getBigUint64(offset, true);
  }
  setFloat32(offset, value) {
    this.view.setFloat32(offset, value, true);
  }
  setFloat64(offset, value) {
    this.view.setFloat64(offset, value, true);
  }
  setInt8(offset, value) {
    this.view.setInt8(offset, value);
  }
  setInt16(offset, value) {
    this.view.setInt16(offset, value, true);
  }
  setInt32(offset, value) {
    this.view.setInt32(offset, value, true);
  }
  setInt64(offset, value) {
    this.view.setBigInt64(offset, value, true);
  }
  setUint8(offset, value) {
    this.view.setUint8(offset, value);
  }
  setUint16(offset, value) {
    this.view.setUint16(offset, value, true);
  }
  setUint32(offset, value) {
    this.view.setUint32(offset, value, true);
  }
  setUint64(offset, value) {
    this.view.setBigUint64(offset, value, true);
  }
};
_ReadWriteByteBuffer_instances = /* @__PURE__ */ new WeakSet(), _ReadWriteByteBuffer_woAdd = function _ReadWriteByteBuffer_woAdd2(amount) {
  if (this.woffset + amount > this._buffer.byteLength) {
    const newsize = getNextSize(this._buffer.byteLength, this.woffset + amount);
    const newBuffer = new Uint8Array(newsize);
    newBuffer.set(this._buffer);
    const oldOffset = this._buffer.byteOffset;
    this._buffer = newBuffer;
    this.view = new DataView(this._buffer.buffer, oldOffset);
  }
  this.woffset += amount;
  return this.woffset - amount;
}, _ReadWriteByteBuffer_roAdd = function _ReadWriteByteBuffer_roAdd2(amount) {
  if (this.roffset + amount > this.woffset) {
    throw new Error("Outside of the bounds of writen data.");
  }
  this.roffset += amount;
  return this.roffset - amount;
};

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/types.js
var CrdtMessageType;
(function(CrdtMessageType2) {
  CrdtMessageType2[CrdtMessageType2["RESERVED"] = 0] = "RESERVED";
  CrdtMessageType2[CrdtMessageType2["PUT_COMPONENT"] = 1] = "PUT_COMPONENT";
  CrdtMessageType2[CrdtMessageType2["DELETE_COMPONENT"] = 2] = "DELETE_COMPONENT";
  CrdtMessageType2[CrdtMessageType2["DELETE_ENTITY"] = 3] = "DELETE_ENTITY";
  CrdtMessageType2[CrdtMessageType2["APPEND_VALUE"] = 4] = "APPEND_VALUE";
  CrdtMessageType2[CrdtMessageType2["PUT_COMPONENT_NETWORK"] = 5] = "PUT_COMPONENT_NETWORK";
  CrdtMessageType2[CrdtMessageType2["DELETE_COMPONENT_NETWORK"] = 6] = "DELETE_COMPONENT_NETWORK";
  CrdtMessageType2[CrdtMessageType2["DELETE_ENTITY_NETWORK"] = 7] = "DELETE_ENTITY_NETWORK";
  CrdtMessageType2[CrdtMessageType2["MAX_MESSAGE_TYPE"] = 8] = "MAX_MESSAGE_TYPE";
})(CrdtMessageType || (CrdtMessageType = {}));
var CRDT_MESSAGE_HEADER_LENGTH = 8;
var ProcessMessageResultType;
(function(ProcessMessageResultType2) {
  ProcessMessageResultType2[ProcessMessageResultType2["StateUpdatedTimestamp"] = 1] = "StateUpdatedTimestamp";
  ProcessMessageResultType2[ProcessMessageResultType2["StateOutdatedTimestamp"] = 2] = "StateOutdatedTimestamp";
  ProcessMessageResultType2[ProcessMessageResultType2["NoChanges"] = 3] = "NoChanges";
  ProcessMessageResultType2[ProcessMessageResultType2["StateOutdatedData"] = 4] = "StateOutdatedData";
  ProcessMessageResultType2[ProcessMessageResultType2["StateUpdatedData"] = 5] = "StateUpdatedData";
  ProcessMessageResultType2[ProcessMessageResultType2["EntityWasDeleted"] = 6] = "EntityWasDeleted";
  ProcessMessageResultType2[ProcessMessageResultType2["EntityDeleted"] = 7] = "EntityDeleted";
})(ProcessMessageResultType || (ProcessMessageResultType = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/crdtMessageProtocol.js
var CrdtMessageProtocol;
(function(CrdtMessageProtocol2) {
  function validate(buf) {
    const rem = buf.remainingBytes();
    if (rem < CRDT_MESSAGE_HEADER_LENGTH) {
      return false;
    }
    const messageLength = buf.getUint32(buf.currentReadOffset());
    if (rem < messageLength) {
      return false;
    }
    return true;
  }
  CrdtMessageProtocol2.validate = validate;
  function readHeader(buf) {
    if (!validate(buf)) {
      return null;
    }
    return {
      length: buf.readUint32(),
      type: buf.readUint32()
    };
  }
  CrdtMessageProtocol2.readHeader = readHeader;
  function getHeader(buf) {
    if (!validate(buf)) {
      return null;
    }
    const currentOffset = buf.currentReadOffset();
    return {
      length: buf.getUint32(currentOffset),
      type: buf.getUint32(currentOffset + 4)
    };
  }
  CrdtMessageProtocol2.getHeader = getHeader;
  function consumeMessage(buf) {
    const header = getHeader(buf);
    if (!header) {
      return false;
    }
    buf.incrementReadOffset(header.length);
    return true;
  }
  CrdtMessageProtocol2.consumeMessage = consumeMessage;
})(CrdtMessageProtocol || (CrdtMessageProtocol = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/deleteComponent.js
var DeleteComponent;
(function(DeleteComponent2) {
  DeleteComponent2.MESSAGE_HEADER_LENGTH = 12;
  function write3(entity, componentId, timestamp, buf) {
    const messageLength = CRDT_MESSAGE_HEADER_LENGTH + DeleteComponent2.MESSAGE_HEADER_LENGTH;
    const startMessageOffset = buf.incrementWriteOffset(messageLength);
    buf.setUint32(startMessageOffset, messageLength);
    buf.setUint32(startMessageOffset + 4, CrdtMessageType.DELETE_COMPONENT);
    buf.setUint32(startMessageOffset + 8, entity);
    buf.setUint32(startMessageOffset + 12, componentId);
    buf.setUint32(startMessageOffset + 16, timestamp);
  }
  DeleteComponent2.write = write3;
  function read2(buf) {
    const header = CrdtMessageProtocol.readHeader(buf);
    if (!header) {
      return null;
    }
    if (header.type !== CrdtMessageType.DELETE_COMPONENT) {
      throw new Error("DeleteComponentOperation tried to read another message type.");
    }
    const msg = {
      ...header,
      entityId: buf.readUint32(),
      componentId: buf.readUint32(),
      timestamp: buf.readUint32()
    };
    return msg;
  }
  DeleteComponent2.read = read2;
})(DeleteComponent || (DeleteComponent = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/appendValue.js
var AppendValueOperation;
(function(AppendValueOperation2) {
  AppendValueOperation2.MESSAGE_HEADER_LENGTH = 16;
  function write3(entity, timestamp, componentId, data, buf) {
    const startMessageOffset = buf.incrementWriteOffset(CRDT_MESSAGE_HEADER_LENGTH + AppendValueOperation2.MESSAGE_HEADER_LENGTH);
    buf.writeBuffer(data, false);
    const messageLength = buf.currentWriteOffset() - startMessageOffset;
    buf.setUint32(startMessageOffset, messageLength);
    buf.setUint32(startMessageOffset + 4, CrdtMessageType.APPEND_VALUE);
    buf.setUint32(startMessageOffset + 8, entity);
    buf.setUint32(startMessageOffset + 12, componentId);
    buf.setUint32(startMessageOffset + 16, timestamp);
    const newLocal = messageLength - AppendValueOperation2.MESSAGE_HEADER_LENGTH - CRDT_MESSAGE_HEADER_LENGTH;
    buf.setUint32(startMessageOffset + 20, newLocal);
  }
  AppendValueOperation2.write = write3;
  function read2(buf) {
    const header = CrdtMessageProtocol.readHeader(buf);
    if (!header) {
      return null;
    }
    if (header.type !== CrdtMessageType.APPEND_VALUE) {
      throw new Error("AppendValueOperation tried to read another message type.");
    }
    return {
      ...header,
      entityId: buf.readUint32(),
      componentId: buf.readUint32(),
      timestamp: buf.readUint32(),
      data: buf.readBuffer()
    };
  }
  AppendValueOperation2.read = read2;
})(AppendValueOperation || (AppendValueOperation = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/deleteEntity.js
var DeleteEntity;
(function(DeleteEntity2) {
  DeleteEntity2.MESSAGE_HEADER_LENGTH = 4;
  function write3(entity, buf) {
    buf.writeUint32(CRDT_MESSAGE_HEADER_LENGTH + 4);
    buf.writeUint32(CrdtMessageType.DELETE_ENTITY);
    buf.writeUint32(entity);
  }
  DeleteEntity2.write = write3;
  function read2(buf) {
    const header = CrdtMessageProtocol.readHeader(buf);
    if (!header) {
      return null;
    }
    if (header.type !== CrdtMessageType.DELETE_ENTITY) {
      throw new Error("DeleteEntity tried to read another message type.");
    }
    return {
      ...header,
      entityId: buf.readUint32()
    };
  }
  DeleteEntity2.read = read2;
})(DeleteEntity || (DeleteEntity = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/putComponent.js
var PutComponentOperation;
(function(PutComponentOperation2) {
  PutComponentOperation2.MESSAGE_HEADER_LENGTH = 16;
  function write3(entity, timestamp, componentId, data, buf) {
    const startMessageOffset = buf.incrementWriteOffset(CRDT_MESSAGE_HEADER_LENGTH + PutComponentOperation2.MESSAGE_HEADER_LENGTH);
    buf.writeBuffer(data, false);
    const messageLength = buf.currentWriteOffset() - startMessageOffset;
    buf.setUint32(startMessageOffset, messageLength);
    buf.setUint32(startMessageOffset + 4, CrdtMessageType.PUT_COMPONENT);
    buf.setUint32(startMessageOffset + 8, entity);
    buf.setUint32(startMessageOffset + 12, componentId);
    buf.setUint32(startMessageOffset + 16, timestamp);
    const newLocal = messageLength - PutComponentOperation2.MESSAGE_HEADER_LENGTH - CRDT_MESSAGE_HEADER_LENGTH;
    buf.setUint32(startMessageOffset + 20, newLocal);
  }
  PutComponentOperation2.write = write3;
  function read2(buf) {
    const header = CrdtMessageProtocol.readHeader(buf);
    if (!header) {
      return null;
    }
    if (header.type !== CrdtMessageType.PUT_COMPONENT) {
      throw new Error("PutComponentOperation tried to read another message type.");
    }
    return {
      ...header,
      entityId: buf.readUint32(),
      componentId: buf.readUint32(),
      timestamp: buf.readUint32(),
      data: buf.readBuffer()
    };
  }
  PutComponentOperation2.read = read2;
})(PutComponentOperation || (PutComponentOperation = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/network/putComponentNetwork.js
var PutNetworkComponentOperation;
(function(PutNetworkComponentOperation2) {
  PutNetworkComponentOperation2.MESSAGE_HEADER_LENGTH = 20;
  function write3(entity, timestamp, componentId, networkId, data, buf) {
    const startMessageOffset = buf.incrementWriteOffset(CRDT_MESSAGE_HEADER_LENGTH + PutNetworkComponentOperation2.MESSAGE_HEADER_LENGTH);
    buf.writeBuffer(data, false);
    const messageLength = buf.currentWriteOffset() - startMessageOffset;
    buf.setUint32(startMessageOffset, messageLength);
    buf.setUint32(startMessageOffset + 4, CrdtMessageType.PUT_COMPONENT_NETWORK);
    buf.setUint32(startMessageOffset + 8, entity);
    buf.setUint32(startMessageOffset + 12, componentId);
    buf.setUint32(startMessageOffset + 16, timestamp);
    buf.setUint32(startMessageOffset + 20, networkId);
    const dataLength = messageLength - PutNetworkComponentOperation2.MESSAGE_HEADER_LENGTH - CRDT_MESSAGE_HEADER_LENGTH;
    buf.setUint32(startMessageOffset + 24, dataLength);
  }
  PutNetworkComponentOperation2.write = write3;
  function read2(buf) {
    const header = CrdtMessageProtocol.readHeader(buf);
    if (!header) {
      return null;
    }
    if (header.type !== CrdtMessageType.PUT_COMPONENT_NETWORK) {
      throw new Error("PutComponentNetworkOperation tried to read another message type.");
    }
    return {
      ...header,
      entityId: buf.readUint32(),
      componentId: buf.readUint32(),
      timestamp: buf.readUint32(),
      networkId: buf.readUint32(),
      data: buf.readBuffer()
    };
  }
  PutNetworkComponentOperation2.read = read2;
})(PutNetworkComponentOperation || (PutNetworkComponentOperation = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/network/deleteComponentNetwork.js
var DeleteComponentNetwork;
(function(DeleteComponentNetwork2) {
  DeleteComponentNetwork2.MESSAGE_HEADER_LENGTH = 16;
  function write3(entity, componentId, timestamp, networkId, buf) {
    const messageLength = CRDT_MESSAGE_HEADER_LENGTH + DeleteComponentNetwork2.MESSAGE_HEADER_LENGTH;
    const startMessageOffset = buf.incrementWriteOffset(messageLength);
    buf.setUint32(startMessageOffset, messageLength);
    buf.setUint32(startMessageOffset + 4, CrdtMessageType.DELETE_COMPONENT_NETWORK);
    buf.setUint32(startMessageOffset + 8, entity);
    buf.setUint32(startMessageOffset + 12, componentId);
    buf.setUint32(startMessageOffset + 16, timestamp);
    buf.setUint32(startMessageOffset + 20, networkId);
  }
  DeleteComponentNetwork2.write = write3;
  function read2(buf) {
    const header = CrdtMessageProtocol.readHeader(buf);
    if (!header) {
      return null;
    }
    if (header.type !== CrdtMessageType.DELETE_COMPONENT_NETWORK) {
      throw new Error("DeleteComponentOperation tried to read another message type.");
    }
    return {
      ...header,
      entityId: buf.readUint32(),
      componentId: buf.readUint32(),
      timestamp: buf.readUint32(),
      networkId: buf.readUint32()
    };
  }
  DeleteComponentNetwork2.read = read2;
})(DeleteComponentNetwork || (DeleteComponentNetwork = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/network/deleteEntityNetwork.js
var DeleteEntityNetwork;
(function(DeleteEntityNetwork2) {
  DeleteEntityNetwork2.MESSAGE_HEADER_LENGTH = 8;
  function write3(entity, networkId, buf) {
    buf.writeUint32(CRDT_MESSAGE_HEADER_LENGTH + 4);
    buf.writeUint32(CrdtMessageType.DELETE_ENTITY_NETWORK);
    buf.writeUint32(entity);
    buf.writeUint32(networkId);
  }
  DeleteEntityNetwork2.write = write3;
  function read2(buf) {
    const header = CrdtMessageProtocol.readHeader(buf);
    if (!header) {
      return null;
    }
    if (header.type !== CrdtMessageType.DELETE_ENTITY_NETWORK) {
      throw new Error("DeleteEntityNetwork tried to read another message type.");
    }
    return {
      ...header,
      entityId: buf.readUint32(),
      networkId: buf.readUint32()
    };
  }
  DeleteEntityNetwork2.read = read2;
})(DeleteEntityNetwork || (DeleteEntityNetwork = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/serialization/crdt/network/utils.js
function isNetworkMessage(message) {
  return [
    CrdtMessageType.DELETE_COMPONENT_NETWORK,
    CrdtMessageType.DELETE_ENTITY_NETWORK,
    CrdtMessageType.PUT_COMPONENT_NETWORK
  ].includes(message.type);
}
function networkMessageToLocal(message, localEntityId, buffer2, destinationBuffer) {
  const offset = buffer2.currentWriteOffset();
  if (message.type === CrdtMessageType.PUT_COMPONENT_NETWORK) {
    PutComponentOperation.write(localEntityId, message.timestamp, message.componentId, message.data, buffer2);
  } else if (message.type === CrdtMessageType.DELETE_COMPONENT_NETWORK) {
    DeleteComponent.write(localEntityId, message.componentId, message.timestamp, buffer2);
  } else if (message.type === CrdtMessageType.DELETE_ENTITY_NETWORK) {
    DeleteEntity.write(localEntityId, buffer2);
  }
  destinationBuffer.writeBuffer(buffer2.buffer().subarray(offset, buffer2.currentWriteOffset()), false);
}
function localMessageToNetwork(message, network, buffer2, destinationBuffer) {
  const offset = buffer2.currentWriteOffset();
  if (message.type === CrdtMessageType.PUT_COMPONENT) {
    PutNetworkComponentOperation.write(network.entityId, message.timestamp, message.componentId, network.networkId, message.data, buffer2);
  } else if (message.type === CrdtMessageType.DELETE_COMPONENT) {
    DeleteComponentNetwork.write(network.entityId, message.componentId, message.timestamp, network.networkId, buffer2);
  } else if (message.type === CrdtMessageType.DELETE_ENTITY) {
    DeleteEntityNetwork.write(network.entityId, network.networkId, buffer2);
  }
  destinationBuffer.writeBuffer(buffer2.buffer().subarray(offset, buffer2.currentWriteOffset()), false);
}
var buffer = new ReadWriteByteBuffer();
function fixTransformParent(message, transformValue, parent) {
  buffer.resetBuffer();
  let transform = transformValue;
  if (!transform && "data" in message) {
    transform = TransformSchema.deserialize(new ReadWriteByteBuffer(message.data));
  }
  if (!transform)
    throw new Error("Invalid parent transform");
  const newTransform = { ...transform, parent };
  TransformSchema.serialize(newTransform, buffer);
  return buffer.toBinary();
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/systems/crdt/index.js
var LIVEKIT_MAX_SIZE = 12;
function crdtSceneSystem(engine2, onProcessEntityComponentChange) {
  const transports = [];
  const NetworkEntity2 = NetworkEntity(engine2);
  const NetworkParent2 = NetworkParent(engine2);
  const Transform3 = Transform(engine2);
  const receivedMessages = [];
  const broadcastMessages = [];
  function parseChunkMessage(transportId) {
    return function parseChunkMessage2(chunkMessage) {
      const buffer2 = new ReadWriteByteBuffer(chunkMessage);
      let header;
      while (header = CrdtMessageProtocol.getHeader(buffer2)) {
        const offset = buffer2.currentReadOffset();
        let message = void 0;
        if (header.type === CrdtMessageType.DELETE_COMPONENT) {
          message = DeleteComponent.read(buffer2);
        } else if (header.type === CrdtMessageType.DELETE_COMPONENT_NETWORK) {
          message = DeleteComponentNetwork.read(buffer2);
        } else if (header.type === CrdtMessageType.PUT_COMPONENT) {
          message = PutComponentOperation.read(buffer2);
        } else if (header.type === CrdtMessageType.PUT_COMPONENT_NETWORK) {
          message = PutNetworkComponentOperation.read(buffer2);
        } else if (header.type === CrdtMessageType.DELETE_ENTITY) {
          message = DeleteEntity.read(buffer2);
        } else if (header.type === CrdtMessageType.DELETE_ENTITY_NETWORK) {
          message = DeleteEntityNetwork.read(buffer2);
        } else if (header.type === CrdtMessageType.APPEND_VALUE) {
          message = AppendValueOperation.read(buffer2);
        } else {
          buffer2.incrementReadOffset(header.length);
        }
        if (message) {
          receivedMessages.push({
            ...message,
            transportId,
            messageBuffer: buffer2.buffer().subarray(offset, buffer2.currentReadOffset())
          });
        }
      }
    };
  }
  function getMessages(value) {
    const messagesToProcess = value.splice(0, value.length);
    return messagesToProcess;
  }
  function findNetworkId(msg) {
    const hasNetworkId = "networkId" in msg;
    if (hasNetworkId) {
      for (const [entityId, network] of engine2.getEntitiesWith(NetworkEntity2)) {
        if (network.networkId === msg.networkId && network.entityId === msg.entityId) {
          return { entityId, network };
        }
      }
    }
    return { entityId: msg.entityId };
  }
  async function receiveMessages() {
    const messagesToProcess = getMessages(receivedMessages);
    const entitiesShouldBeCleaned = [];
    for (const msg of messagesToProcess) {
      let { entityId, network } = findNetworkId(msg);
      if (isNetworkMessage(msg) && !network) {
        entityId = engine2.addEntity();
        network = { entityId: msg.entityId, networkId: msg.networkId };
        NetworkEntity2.createOrReplace(entityId, network);
      }
      if (msg.type === CrdtMessageType.DELETE_ENTITY || msg.type === CrdtMessageType.DELETE_ENTITY_NETWORK) {
        entitiesShouldBeCleaned.push(entityId);
        broadcastMessages.push(msg);
      } else {
        const entityState = engine2.entityContainer.getEntityState(entityId);
        if (entityState === EntityState.Removed)
          continue;
        if (entityState === EntityState.Unknown) {
          engine2.entityContainer.updateUsedEntity(entityId);
        }
        const component = engine2.getComponentOrNull(msg.componentId);
        if (component) {
          if (msg.type === CrdtMessageType.PUT_COMPONENT && component.componentId === Transform3.componentId && NetworkEntity2.has(entityId) && NetworkParent2.has(entityId)) {
            msg.data = fixTransformParent(msg);
          }
          const [conflictMessage, value] = component.updateFromCrdt({ ...msg, entityId });
          if (!conflictMessage) {
            broadcastMessages.push(msg);
            onProcessEntityComponentChange && onProcessEntityComponentChange(entityId, msg.type, component, value);
          }
        } else {
          broadcastMessages.push(msg);
        }
      }
    }
    for (const entity of entitiesShouldBeCleaned) {
      for (const definition of engine2.componentsIter()) {
        definition.entityDeleted(entity, true);
      }
      engine2.entityContainer.updateRemovedEntity(entity);
      onProcessEntityComponentChange && onProcessEntityComponentChange(entity, CrdtMessageType.DELETE_ENTITY);
    }
  }
  async function sendMessages(entitiesDeletedThisTick) {
    const crdtMessages = getMessages(broadcastMessages);
    const buffer2 = new ReadWriteByteBuffer();
    for (const component of engine2.componentsIter()) {
      for (const message of component.getCrdtUpdates()) {
        const offset = buffer2.currentWriteOffset();
        if (transports.some((t) => t.filter(message))) {
          if (message.type === CrdtMessageType.PUT_COMPONENT) {
            PutComponentOperation.write(message.entityId, message.timestamp, message.componentId, message.data, buffer2);
          } else if (message.type === CrdtMessageType.DELETE_COMPONENT) {
            DeleteComponent.write(message.entityId, component.componentId, message.timestamp, buffer2);
          } else if (message.type === CrdtMessageType.APPEND_VALUE) {
            AppendValueOperation.write(message.entityId, message.timestamp, message.componentId, message.data, buffer2);
          }
          crdtMessages.push({
            ...message,
            messageBuffer: buffer2.buffer().subarray(offset, buffer2.currentWriteOffset())
          });
        }
        if (onProcessEntityComponentChange) {
          const rawValue = message.type === CrdtMessageType.PUT_COMPONENT || message.type === CrdtMessageType.APPEND_VALUE ? component.get(message.entityId) : void 0;
          onProcessEntityComponentChange(message.entityId, message.type, component, rawValue);
        }
      }
    }
    for (const entityId of entitiesDeletedThisTick) {
      const offset = buffer2.currentWriteOffset();
      DeleteEntity.write(entityId, buffer2);
      crdtMessages.push({
        type: CrdtMessageType.DELETE_ENTITY,
        entityId,
        messageBuffer: buffer2.buffer().subarray(offset, buffer2.currentWriteOffset())
      });
      onProcessEntityComponentChange && onProcessEntityComponentChange(entityId, CrdtMessageType.DELETE_ENTITY);
    }
    const transportBuffer = new ReadWriteByteBuffer();
    for (const index in transports) {
      const __NetworkMessagesBuffer = [];
      const transportIndex = Number(index);
      const transport = transports[transportIndex];
      const isRendererTransport = transport.type === "renderer";
      const isNetworkTransport = transport.type === "network";
      transportBuffer.resetBuffer();
      const buffer3 = new ReadWriteByteBuffer();
      for (const message2 of crdtMessages) {
        const currentBufferSize = transportBuffer.toBinary().byteLength;
        const messageSize = message2.messageBuffer.byteLength;
        if (isNetworkTransport && (currentBufferSize + messageSize) / 1024 > LIVEKIT_MAX_SIZE) {
          if (currentBufferSize > 0) {
            __NetworkMessagesBuffer.push(transportBuffer.toCopiedBinary());
            transportBuffer.resetBuffer();
          }
          if (messageSize / 1024 > LIVEKIT_MAX_SIZE) {
            console.error(`Message too large (${messageSize} bytes), skipping message for entity ${message2.entityId}`);
            continue;
          }
        }
        if (message2.transportId === transportIndex)
          continue;
        if (!transport.filter(message2))
          continue;
        const { entityId } = findNetworkId(message2);
        const transformNeedsFix = "componentId" in message2 && message2.componentId === Transform3.componentId && Transform3.has(entityId) && NetworkParent2.has(entityId) && NetworkEntity2.has(entityId);
        if (isRendererTransport && message2.type === CrdtMessageType.PUT_COMPONENT && transformNeedsFix) {
          const parent = findNetworkId(NetworkParent2.get(entityId));
          const transformData = fixTransformParent(message2, Transform3.get(entityId), parent.entityId);
          const offset = buffer3.currentWriteOffset();
          PutComponentOperation.write(entityId, message2.timestamp, message2.componentId, transformData, buffer3);
          transportBuffer.writeBuffer(buffer3.buffer().subarray(offset, buffer3.currentWriteOffset()), false);
          continue;
        }
        if (isRendererTransport && isNetworkMessage(message2)) {
          let transformData = "data" in message2 ? message2.data : new Uint8Array();
          if (transformNeedsFix) {
            const parent = findNetworkId(NetworkParent2.get(entityId));
            transformData = fixTransformParent(message2, Transform3.get(entityId), parent.entityId);
          }
          networkMessageToLocal({ ...message2, data: transformData }, entityId, buffer3, transportBuffer);
          continue;
        }
        if (isNetworkTransport && !isNetworkMessage(message2)) {
          const networkData = NetworkEntity2.getOrNull(message2.entityId);
          if (networkData) {
            localMessageToNetwork(message2, networkData, buffer3, transportBuffer);
            continue;
          }
        }
        transportBuffer.writeBuffer(message2.messageBuffer, false);
      }
      if (isNetworkTransport && transportBuffer.currentWriteOffset()) {
        __NetworkMessagesBuffer.push(transportBuffer.toBinary());
      }
      const message = isNetworkTransport ? __NetworkMessagesBuffer : transportBuffer.toBinary();
      await transport.send(message);
    }
  }
  function addTransport(transport) {
    const id = transports.push(transport) - 1;
    transport.onmessage = parseChunkMessage(id);
  }
  return {
    sendMessages,
    receiveMessages,
    addTransport
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/systems/crdt/utils.js
var CrdtUtils;
(function(CrdtUtils2) {
  let SynchronizedEntityType;
  (function(SynchronizedEntityType2) {
    SynchronizedEntityType2[SynchronizedEntityType2["NETWORKED"] = 0] = "NETWORKED";
    SynchronizedEntityType2[SynchronizedEntityType2["RENDERER"] = 1] = "RENDERER";
  })(SynchronizedEntityType = CrdtUtils2.SynchronizedEntityType || (CrdtUtils2.SynchronizedEntityType = {}));
})(CrdtUtils || (CrdtUtils = {}));
function dataCompare(a, b) {
  if (a === b)
    return 0;
  if (a === null && b !== null)
    return -1;
  if (a !== null && b === null)
    return 1;
  if (a instanceof Uint8Array && b instanceof Uint8Array) {
    const lengthDifference = a.byteLength - b.byteLength;
    if (lengthDifference !== 0) {
      return lengthDifference > 0 ? 1 : -1;
    }
    let res;
    for (let i = 0, n = a.byteLength; i < n; i++) {
      res = a[i] - b[i];
      if (res !== 0) {
        return res > 0 ? 1 : -1;
      }
    }
    return 0;
  }
  if (typeof a === "string") {
    const lengthDifference = a.length - b.length;
    if (lengthDifference !== 0) {
      return lengthDifference > 0 ? 1 : -1;
    }
    return a.localeCompare(b);
  }
  return a > b ? 1 : -1;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/engine/readonly.js
function deepReadonly(val) {
  return Object.freeze({ ...val });
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/engine/lww-element-set-component-definition.js
function incrementTimestamp(entity, timestamps) {
  const newTimestamp = (timestamps.get(entity) || 0) + 1;
  timestamps.set(entity, newTimestamp);
  return newTimestamp;
}
function createDumpLwwFunctionFromCrdt(componentId, timestamps, schema, data) {
  return function dumpCrdtState(buffer2, filterEntity) {
    for (const [entity, timestamp] of timestamps) {
      if (filterEntity) {
        if (!filterEntity(entity))
          continue;
      }
      if (data.has(entity)) {
        const it = data.get(entity);
        const buf = new ReadWriteByteBuffer();
        schema.serialize(it, buf);
        PutComponentOperation.write(entity, timestamp, componentId, buf.toBinary(), buffer2);
      } else {
        DeleteComponent.write(entity, componentId, timestamp, buffer2);
      }
    }
  };
}
function createUpdateLwwFromCrdt(componentId, timestamps, schema, data) {
  function crdtRuleForCurrentState(message) {
    const { entityId, timestamp } = message;
    const currentTimestamp = timestamps.get(entityId);
    if (currentTimestamp === void 0 || currentTimestamp < timestamp) {
      return ProcessMessageResultType.StateUpdatedTimestamp;
    }
    if (currentTimestamp > timestamp) {
      return ProcessMessageResultType.StateOutdatedTimestamp;
    }
    if (message.type === CrdtMessageType.DELETE_COMPONENT && !data.has(entityId)) {
      return ProcessMessageResultType.NoChanges;
    }
    let currentDataGreater = 0;
    if (data.has(entityId)) {
      const writeBuffer = new ReadWriteByteBuffer();
      schema.serialize(data.get(entityId), writeBuffer);
      currentDataGreater = dataCompare(writeBuffer.toBinary(), message.data || null);
    } else {
      currentDataGreater = dataCompare(null, message.data);
    }
    if (currentDataGreater === 0) {
      return ProcessMessageResultType.NoChanges;
    } else if (currentDataGreater > 0) {
      return ProcessMessageResultType.StateOutdatedData;
    } else {
      return ProcessMessageResultType.StateUpdatedData;
    }
  }
  return (msg) => {
    if (msg.type !== CrdtMessageType.PUT_COMPONENT && msg.type !== CrdtMessageType.PUT_COMPONENT_NETWORK && msg.type !== CrdtMessageType.DELETE_COMPONENT && msg.type !== CrdtMessageType.DELETE_COMPONENT_NETWORK)
      return [null, data.get(msg.entityId)];
    const action = crdtRuleForCurrentState(msg);
    const entity = msg.entityId;
    switch (action) {
      case ProcessMessageResultType.StateUpdatedData:
      case ProcessMessageResultType.StateUpdatedTimestamp: {
        timestamps.set(entity, msg.timestamp);
        if (msg.type === CrdtMessageType.PUT_COMPONENT || msg.type === CrdtMessageType.PUT_COMPONENT_NETWORK) {
          const buf = new ReadWriteByteBuffer(msg.data);
          data.set(entity, schema.deserialize(buf));
        } else {
          data.delete(entity);
        }
        return [null, data.get(entity)];
      }
      case ProcessMessageResultType.StateOutdatedTimestamp:
      case ProcessMessageResultType.StateOutdatedData: {
        if (data.has(entity)) {
          const writeBuffer = new ReadWriteByteBuffer();
          schema.serialize(data.get(entity), writeBuffer);
          return [
            {
              type: CrdtMessageType.PUT_COMPONENT,
              componentId,
              data: writeBuffer.toBinary(),
              entityId: entity,
              timestamp: timestamps.get(entity)
            },
            data.get(entity)
          ];
        } else {
          return [
            {
              type: CrdtMessageType.DELETE_COMPONENT,
              componentId,
              entityId: entity,
              timestamp: timestamps.get(entity)
            },
            void 0
          ];
        }
      }
    }
    return [null, data.get(entity)];
  };
}
function createGetCrdtMessagesForLww(componentId, timestamps, dirtyIterator, schema, data) {
  return function* () {
    for (const entity of dirtyIterator) {
      const newTimestamp = incrementTimestamp(entity, timestamps);
      if (data.has(entity)) {
        const writeBuffer = new ReadWriteByteBuffer();
        schema.serialize(data.get(entity), writeBuffer);
        const msg = {
          type: CrdtMessageType.PUT_COMPONENT,
          componentId,
          entityId: entity,
          data: writeBuffer.toBinary(),
          timestamp: newTimestamp
        };
        yield msg;
      } else {
        const msg = {
          type: CrdtMessageType.DELETE_COMPONENT,
          componentId,
          entityId: entity,
          timestamp: newTimestamp
        };
        yield msg;
      }
    }
    dirtyIterator.clear();
  };
}
function createComponentDefinitionFromSchema(componentName, componentId, schema) {
  const data = /* @__PURE__ */ new Map();
  const dirtyIterator = /* @__PURE__ */ new Set();
  const timestamps = /* @__PURE__ */ new Map();
  const onChangeCallbacks = /* @__PURE__ */ new Map();
  return {
    get componentId() {
      return componentId;
    },
    get componentName() {
      return componentName;
    },
    get componentType() {
      return 0;
    },
    schema,
    has(entity) {
      return data.has(entity);
    },
    deleteFrom(entity, markAsDirty = true) {
      const component = data.get(entity);
      if (data.delete(entity) && markAsDirty) {
        dirtyIterator.add(entity);
      }
      return component || null;
    },
    entityDeleted(entity, markAsDirty) {
      if (data.delete(entity) && markAsDirty) {
        dirtyIterator.add(entity);
      }
    },
    getOrNull(entity) {
      const component = data.get(entity);
      return component ? deepReadonly(component) : null;
    },
    get(entity) {
      const component = data.get(entity);
      if (!component) {
        throw new Error(`[getFrom] Component ${componentName} for entity #${entity} not found`);
      }
      return deepReadonly(component);
    },
    create(entity, value) {
      const component = data.get(entity);
      if (component) {
        throw new Error(`[create] Component ${componentName} for ${entity} already exists`);
      }
      const usedValue = value === void 0 ? schema.create() : schema.extend ? schema.extend(value) : value;
      data.set(entity, usedValue);
      dirtyIterator.add(entity);
      return usedValue;
    },
    createOrReplace(entity, value) {
      const usedValue = value === void 0 ? schema.create() : schema.extend ? schema.extend(value) : value;
      data.set(entity, usedValue);
      dirtyIterator.add(entity);
      return usedValue;
    },
    getMutableOrNull(entity) {
      const component = data.get(entity);
      if (!component) {
        return null;
      }
      dirtyIterator.add(entity);
      return component;
    },
    getOrCreateMutable(entity, value) {
      const component = data.get(entity);
      if (!component) {
        return this.create(entity, value);
      } else {
        dirtyIterator.add(entity);
        return component;
      }
    },
    getMutable(entity) {
      const component = this.getMutableOrNull(entity);
      if (component === null) {
        throw new Error(`[mutable] Component ${componentName} for ${entity} not found`);
      }
      return component;
    },
    *iterator() {
      for (const [entity, component] of data) {
        yield [entity, component];
      }
    },
    *dirtyIterator() {
      for (const entity of dirtyIterator) {
        yield entity;
      }
    },
    getCrdtUpdates: createGetCrdtMessagesForLww(componentId, timestamps, dirtyIterator, schema, data),
    updateFromCrdt: createUpdateLwwFromCrdt(componentId, timestamps, schema, data),
    dumpCrdtStateToBuffer: createDumpLwwFunctionFromCrdt(componentId, timestamps, schema, data),
    onChange(entity, cb) {
      const cbs = onChangeCallbacks.get(entity) ?? [];
      cbs.push(cb);
      onChangeCallbacks.set(entity, cbs);
    },
    __onChangeCallbacks(entity, value) {
      const cbs = onChangeCallbacks.get(entity);
      if (!cbs)
        return;
      for (const cb of cbs) {
        cb(value);
      }
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/engine/systems.js
var SYSTEMS_REGULAR_PRIORITY = 1e5;
function SystemContainer() {
  const systems = [];
  function sort() {
    systems.sort((a, b) => b.priority - a.priority);
  }
  function add2(fn, priority, name) {
    const systemName = name ?? fn.name;
    if (systems.find((item) => item.fn === fn)) {
      throw new Error(`System ${JSON.stringify(systemName)} already added to the engine`);
    }
    systems.push({
      fn,
      priority,
      name: systemName
    });
    sort();
  }
  function remove(selector) {
    let index = -1;
    if (typeof selector === "string") {
      index = systems.findIndex((item) => item.name === selector);
    } else {
      index = systems.findIndex((item) => item.fn === selector);
    }
    if (index === -1) {
      return false;
    }
    systems.splice(index, 1);
    sort();
    return true;
  }
  return {
    add: add2,
    remove,
    getSystems() {
      return systems;
    }
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/engine/grow-only-value-set-component-definition.js
var emptyReadonlySet = freezeSet(/* @__PURE__ */ new Set());
function frozenError() {
  throw new Error("The set is frozen");
}
function freezeSet(set) {
  ;
  set.add = frozenError;
  set.clear = frozenError;
  return set;
}
function sortByTimestamp(a, b) {
  return a.timestamp > b.timestamp ? 1 : -1;
}
function createValueSetComponentDefinitionFromSchema(componentName, componentId, schema, options) {
  const data = /* @__PURE__ */ new Map();
  const dirtyIterator = /* @__PURE__ */ new Set();
  const queuedCommands = [];
  const onChangeCallbacks = /* @__PURE__ */ new Map();
  function shouldSort(row) {
    const len = row.raw.length;
    if (len > 1 && row.raw[len - 1].timestamp <= row.raw[len - 2].timestamp) {
      return true;
    }
    return false;
  }
  function gotUpdated(entity) {
    const row = data.get(entity);
    if (row) {
      if (shouldSort(row)) {
        row.raw.sort(sortByTimestamp);
      }
      while (row.raw.length > options.maxElements) {
        row.raw.shift();
      }
      const frozenSet = freezeSet(new Set(row?.raw.map(($) => $.value)));
      row.frozenSet = frozenSet;
      return frozenSet;
    } else {
      return emptyReadonlySet;
    }
  }
  function append(entity, value) {
    let row = data.get(entity);
    if (!row) {
      row = { raw: [], frozenSet: emptyReadonlySet };
      data.set(entity, row);
    }
    const usedValue = schema.extend ? schema.extend(value) : value;
    const timestamp = options.timestampFunction(usedValue);
    if (__DEV__) {
      Object.freeze(usedValue);
    }
    row.raw.push({ value: usedValue, timestamp });
    return { set: gotUpdated(entity), value: usedValue };
  }
  const ret = {
    get componentId() {
      return componentId;
    },
    get componentName() {
      return componentName;
    },
    get componentType() {
      return 1;
    },
    schema,
    has(entity) {
      return data.has(entity);
    },
    entityDeleted(entity) {
      data.delete(entity);
    },
    get(entity) {
      const values = data.get(entity);
      if (values) {
        return values.frozenSet;
      } else {
        return emptyReadonlySet;
      }
    },
    addValue(entity, rawValue) {
      const { set, value } = append(entity, rawValue);
      dirtyIterator.add(entity);
      const buf = new ReadWriteByteBuffer();
      schema.serialize(value, buf);
      queuedCommands.push({
        componentId,
        data: buf.toBinary(),
        entityId: entity,
        timestamp: 0,
        type: CrdtMessageType.APPEND_VALUE
      });
      return set;
    },
    *iterator() {
      for (const [entity, component] of data) {
        yield [entity, component.frozenSet];
      }
    },
    *dirtyIterator() {
      for (const entity of dirtyIterator) {
        yield entity;
      }
    },
    getCrdtUpdates() {
      dirtyIterator.clear();
      return queuedCommands.splice(0, queuedCommands.length);
    },
    updateFromCrdt(_body) {
      if (_body.type === CrdtMessageType.APPEND_VALUE) {
        const buf = new ReadWriteByteBuffer(_body.data);
        const { value } = append(_body.entityId, schema.deserialize(buf));
        return [null, value];
      }
      return [null, void 0];
    },
    dumpCrdtStateToBuffer: function(buffer2, filterEntity) {
      for (const [entity, { raw }] of data) {
        if (filterEntity && !filterEntity(entity))
          continue;
        for (const it of raw) {
          const buf = new ReadWriteByteBuffer();
          schema.serialize(it.value, buf);
          AppendValueOperation.write(entity, 0, componentId, buf.toBinary(), buffer2);
        }
      }
    },
    onChange(entity, cb) {
      const cbs = onChangeCallbacks.get(entity) ?? [];
      cbs.push(cb);
      onChangeCallbacks.set(entity, cbs);
    },
    __onChangeCallbacks(entity, value) {
      const cbs = onChangeCallbacks.get(entity);
      if (!cbs)
        return;
      for (const cb of cbs) {
        cb(value);
      }
    }
  };
  return ret;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/runtime/helpers/tree.js
function* genEntityTree(entity, entities) {
  if (!entities.has(entity))
    return;
  entities.delete(entity);
  for (const [_entity, value] of entities) {
    if (value.parent === entity) {
      yield* genEntityTree(_entity, entities);
    }
  }
  yield entity;
}
function getComponentEntityTree(engine2, entity, component) {
  const entities = new Map(engine2.getEntitiesWith(component));
  return genEntityTree(entity, entities);
}
function removeNetworkEntityChildrens(engine2, parent) {
  const NetworkParent2 = NetworkParent(engine2);
  const NetworkEntity2 = NetworkEntity(engine2);
  engine2.removeEntity(parent);
  const network = NetworkEntity2.getOrNull(parent);
  if (network) {
    for (const [entity, parent2] of engine2.getEntitiesWith(NetworkParent2)) {
      if (parent2.entityId === network.entityId && parent2.networkId === network.networkId) {
        removeNetworkEntityChildrens(engine2, entity);
      }
    }
  }
  return;
}
function removeEntityWithChildren(engine2, entity) {
  const Transform3 = Transform(engine2);
  const NetworkEntity2 = NetworkEntity(engine2);
  if (NetworkEntity2.has(entity)) {
    return removeNetworkEntityChildrens(engine2, entity);
  }
  for (const ent of getComponentEntityTree(engine2, entity, Transform3)) {
    engine2.removeEntity(ent);
  }
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/engine/input.js
var InputCommands = [
  0,
  1,
  2,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13
  /* InputAction.IA_ACTION_6 */
];
var InputStateUpdateSystemPriority = 1 << 20;
function createInputSystem(engine2) {
  const PointerEventsResult2 = PointerEventsResult(engine2);
  const globalState = {
    previousFrameMaxTimestamp: 0,
    currentFrameMaxTimestamp: 0,
    buttonState: /* @__PURE__ */ new Map(),
    thisFrameCommands: []
  };
  function findLastAction(pointerEventType, inputAction, entity) {
    const ascendingTimestampIterator = PointerEventsResult2.get(entity);
    for (const command of Array.from(ascendingTimestampIterator).reverse()) {
      if (command.button === inputAction && command.state === pointerEventType) {
        return command;
      }
    }
  }
  function* findCommandsByActionDescending(inputAction, entity) {
    const ascendingTimestampIterator = PointerEventsResult2.get(entity);
    for (const command of Array.from(ascendingTimestampIterator).reverse()) {
      if (command.button === inputAction) {
        yield command;
      }
    }
  }
  function buttonStateUpdateSystem() {
    let maxTimestamp = globalState.currentFrameMaxTimestamp;
    globalState.previousFrameMaxTimestamp = maxTimestamp;
    if (globalState.thisFrameCommands.length) {
      globalState.thisFrameCommands = [];
    }
    for (const [, commands] of engine2.getEntitiesWith(PointerEventsResult2)) {
      const arrayCommands = Array.from(commands);
      for (let i = arrayCommands.length - 1; i >= 0; i--) {
        const command = arrayCommands[i];
        if (command.timestamp > maxTimestamp) {
          maxTimestamp = command.timestamp;
        }
        if (command.timestamp > globalState.previousFrameMaxTimestamp) {
          globalState.thisFrameCommands.push(command);
        }
        if (command.state === 0 || command.state === 1) {
          const prevCommand = globalState.buttonState.get(command.button);
          if (!prevCommand || command.timestamp > prevCommand.timestamp) {
            globalState.buttonState.set(command.button, command);
          } else {
            break;
          }
        }
      }
    }
    globalState.currentFrameMaxTimestamp = maxTimestamp;
  }
  engine2.addSystem(buttonStateUpdateSystem, InputStateUpdateSystemPriority, "@dcl/ecs#inputSystem");
  function timestampIsCurrentFrame(timestamp) {
    if (timestamp > globalState.previousFrameMaxTimestamp && timestamp <= globalState.currentFrameMaxTimestamp) {
      return true;
    } else {
      return false;
    }
  }
  function getClick(inputAction, entity) {
    if (inputAction !== 3) {
      return findClick(inputAction, entity);
    }
    for (const input of InputCommands) {
      const cmd = findClick(input, entity);
      if (cmd)
        return cmd;
    }
    return null;
  }
  function findClick(inputAction, entity) {
    let down = null;
    let up = null;
    for (const it of findCommandsByActionDescending(inputAction, entity)) {
      if (!up) {
        if (it.state === 0) {
          up = it;
          continue;
        }
      } else if (!down) {
        if (it.state === 1) {
          down = it;
          break;
        }
      }
    }
    if (!up || !down)
      return null;
    if (down.timestamp < up.timestamp && timestampIsCurrentFrame(up.timestamp)) {
      return { up, down };
    }
    return null;
  }
  function getInputCommandFromEntity(inputAction, pointerEventType, entity) {
    if (inputAction !== 3) {
      return findInputCommand(inputAction, pointerEventType, entity);
    }
    for (const input of InputCommands) {
      const cmd = findInputCommand(input, pointerEventType, entity);
      if (cmd)
        return cmd;
    }
    return null;
  }
  function getInputCommand(inputAction, pointerEventType, entity) {
    if (entity) {
      return getInputCommandFromEntity(inputAction, pointerEventType, entity);
    } else {
      for (const command of globalState.thisFrameCommands) {
        if ((command.button === inputAction || inputAction === 3) && command.state === pointerEventType) {
          return command;
        }
      }
      return null;
    }
  }
  function findInputCommand(inputAction, pointerEventType, entity) {
    const command = findLastAction(pointerEventType, inputAction, entity);
    if (!command)
      return null;
    if (timestampIsCurrentFrame(command.timestamp)) {
      return command;
    } else {
      return null;
    }
  }
  function isClicked(inputAction, entity) {
    return getClick(inputAction, entity) !== null;
  }
  function isTriggered(inputAction, pointerEventType, entity) {
    if (entity) {
      const command = findLastAction(pointerEventType, inputAction, entity);
      return command && timestampIsCurrentFrame(command.timestamp) || false;
    } else {
      for (const command of globalState.thisFrameCommands) {
        if ((command.button === inputAction || inputAction === 3) && command.state === pointerEventType) {
          return true;
        }
      }
      return false;
    }
  }
  function isPressed(inputAction) {
    return globalState.buttonState.get(inputAction)?.state === 1;
  }
  return {
    isPressed,
    getClick,
    getInputCommand,
    isClicked,
    isTriggered
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/engine/component.js
var ComponentType;
(function(ComponentType2) {
  ComponentType2[ComponentType2["LastWriteWinElementSet"] = 0] = "LastWriteWinElementSet";
  ComponentType2[ComponentType2["GrowOnlyValueSet"] = 1] = "GrowOnlyValueSet";
})(ComponentType || (ComponentType = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/engine/index.js
function preEngine(options) {
  const entityContainer = options?.entityContainer ?? createEntityContainer();
  const componentsDefinition = /* @__PURE__ */ new Map();
  const systems = SystemContainer();
  let sealed = false;
  function addSystem(fn, priority = SYSTEMS_REGULAR_PRIORITY, name) {
    systems.add(fn, priority, name);
  }
  function removeSystem(selector) {
    return systems.remove(selector);
  }
  function addEntity() {
    const entity = entityContainer.generateEntity();
    return entity;
  }
  function removeEntity(entity) {
    for (const [, component] of componentsDefinition) {
      if (component.componentName === "core-schema::Network-Entity")
        continue;
      component.entityDeleted(entity, true);
    }
    return entityContainer.removeEntity(entity);
  }
  function removeEntityWithChildren2(entity) {
    return removeEntityWithChildren({ removeEntity, defineComponentFromSchema, getEntitiesWith, defineComponent }, entity);
  }
  function registerComponentDefinition(componentName, component) {
    if (sealed)
      throw new Error("Engine is already sealed. No components can be added at this stage");
    const componentId = componentNumberFromName(componentName);
    const prev = componentsDefinition.get(componentId);
    if (prev) {
      throw new Error(`Component number ${componentId} was already registered.`);
    }
    if (component.componentName !== componentName) {
      throw new Error(`Component name doesn't match componentDefinition.componentName ${componentName} != ${component.componentName}`);
    }
    if (component.componentId !== componentId) {
      throw new Error(`Component number doesn't match componentDefinition.componentId ${componentId} != ${component.componentId}`);
    }
    componentsDefinition.set(componentId, component);
    return component;
  }
  function defineComponentFromSchema(componentName, schema) {
    const componentId = componentNumberFromName(componentName);
    const prev = componentsDefinition.get(componentId);
    if (prev) {
      return prev;
    }
    if (sealed)
      throw new Error("Engine is already sealed. No components can be added at this stage");
    const newComponent = createComponentDefinitionFromSchema(componentName, componentId, schema);
    componentsDefinition.set(componentId, newComponent);
    return newComponent;
  }
  function defineValueSetComponentFromSchema(componentName, schema, options2) {
    const componentId = componentNumberFromName(componentName);
    const prev = componentsDefinition.get(componentId);
    if (prev) {
      return prev;
    }
    if (sealed)
      throw new Error("Engine is already sealed. No components can be added at this stage");
    const newComponent = createValueSetComponentDefinitionFromSchema(componentName, componentId, schema, options2);
    componentsDefinition.set(componentId, newComponent);
    return newComponent;
  }
  function defineComponent(componentName, mapSpec, constructorDefault) {
    const componentId = componentNumberFromName(componentName);
    const prev = componentsDefinition.get(componentId);
    if (prev) {
      return prev;
    }
    if (sealed)
      throw new Error("Engine is already sealed. No components can be added at this stage");
    const schemaSpec = Schemas.Map(mapSpec, constructorDefault);
    const def = createComponentDefinitionFromSchema(componentName, componentId, schemaSpec);
    const newComponent = {
      ...def,
      create(entity, val) {
        return def.create(entity, val);
      },
      createOrReplace(entity, val) {
        return def.createOrReplace(entity, val);
      }
    };
    componentsDefinition.set(componentId, newComponent);
    return newComponent;
  }
  function getComponent(componentIdOrName) {
    const componentId = typeof componentIdOrName === "number" ? componentIdOrName : componentNumberFromName(componentIdOrName);
    const component = componentsDefinition.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentIdOrName} not found. You need to declare the components at the beginnig of the engine declaration`);
    }
    return component;
  }
  function getComponentOrNull(componentIdOrName) {
    const componentId = typeof componentIdOrName === "number" ? componentIdOrName : componentNumberFromName(componentIdOrName);
    return componentsDefinition.get(componentId) ?? /* istanbul ignore next */
    null;
  }
  function* getEntitiesWith(...components) {
    for (const [entity, ...groupComp] of getComponentDefGroup(...components)) {
      yield [entity, ...groupComp.map((c) => c.get(entity))];
    }
  }
  function getEntityOrNullByName(value) {
    const NameComponent = Name({ defineComponent });
    for (const [entity, name] of getEntitiesWith(NameComponent)) {
      if (name.value === value)
        return entity;
    }
    return null;
  }
  function getEntityByName(value) {
    const entity = getEntityOrNullByName(value);
    return entity;
  }
  function* getEntitiesByTag(tagName) {
    const TagComponent = Tags({ defineComponent });
    for (const [entity, component] of getEntitiesWith(TagComponent)) {
      if (entity !== 0 && component.tags?.some((tag) => tag === tagName)) {
        yield entity;
      }
    }
  }
  function* getComponentDefGroup(...args) {
    const [firstComponentDef, ...componentDefinitions] = args;
    for (const [entity] of firstComponentDef.iterator()) {
      let matches = true;
      for (const componentDef of componentDefinitions) {
        if (!componentDef.has(entity)) {
          matches = false;
          break;
        }
      }
      if (matches) {
        yield [entity, ...args];
      }
    }
  }
  function getSystems() {
    return systems.getSystems();
  }
  function componentsIter() {
    return componentsDefinition.values();
  }
  function removeComponentDefinition(componentIdOrName) {
    if (sealed)
      throw new Error("Engine is already sealed. No components can be removed at this stage");
    const componentId = typeof componentIdOrName === "number" ? componentIdOrName : componentNumberFromName(componentIdOrName);
    componentsDefinition.delete(componentId);
  }
  Transform({ defineComponentFromSchema });
  function seal() {
    if (!sealed) {
      sealed = true;
    }
  }
  return {
    addEntity,
    removeEntity,
    removeEntityWithChildren: removeEntityWithChildren2,
    addSystem,
    getSystems,
    removeSystem,
    defineComponent,
    defineComponentFromSchema,
    defineValueSetComponentFromSchema,
    getEntitiesWith,
    getComponent,
    getComponentOrNull,
    getEntityOrNullByName,
    getEntityByName,
    getEntitiesByTag,
    removeComponentDefinition,
    registerComponentDefinition,
    entityContainer,
    componentsIter,
    seal
  };
}
function Engine(options) {
  const partialEngine = preEngine(options);
  const onChangeFunction = (entity, operation, component, componentValue) => {
    if (operation === CrdtMessageType.DELETE_ENTITY) {
      for (const component2 of partialEngine.componentsIter()) {
        component2?.__onChangeCallbacks(entity, void 0);
      }
    } else {
      component?.__onChangeCallbacks(entity, componentValue);
    }
    return options?.onChangeFunction(entity, operation, component, componentValue);
  };
  const crdtSystem = crdtSceneSystem(partialEngine, onChangeFunction);
  async function update(dt) {
    await crdtSystem.receiveMessages();
    for (const system of partialEngine.getSystems()) {
      const ret = system.fn(dt);
      checkNotThenable(ret, `A system (${system.name || "anonymous"}) returned a thenable. Systems cannot be async functions. Documentation: https://dcl.gg/sdk/sync-systems`);
    }
    const deletedEntites = partialEngine.entityContainer.releaseRemovedEntities();
    await crdtSystem.sendMessages(deletedEntites);
  }
  return {
    _id: Date.now(),
    addEntity: partialEngine.addEntity,
    removeEntity: partialEngine.removeEntity,
    removeEntityWithChildren: partialEngine.removeEntityWithChildren,
    addSystem: partialEngine.addSystem,
    removeSystem: partialEngine.removeSystem,
    defineComponent: partialEngine.defineComponent,
    defineComponentFromSchema: partialEngine.defineComponentFromSchema,
    defineValueSetComponentFromSchema: partialEngine.defineValueSetComponentFromSchema,
    registerComponentDefinition: partialEngine.registerComponentDefinition,
    getEntitiesWith: partialEngine.getEntitiesWith,
    getComponent: partialEngine.getComponent,
    getComponentOrNull: partialEngine.getComponentOrNull,
    removeComponentDefinition: partialEngine.removeComponentDefinition,
    componentsIter: partialEngine.componentsIter,
    seal: partialEngine.seal,
    getEntityOrNullByName: partialEngine.getEntityOrNullByName,
    getEntityByName: partialEngine.getEntityByName,
    getEntitiesByTag: partialEngine.getEntitiesByTag,
    update,
    RootEntity: 0,
    PlayerEntity: 1,
    CameraEntity: 2,
    getEntityState: partialEngine.entityContainer.getEntityState,
    addTransport: crdtSystem.addTransport,
    entityContainer: partialEngine.entityContainer
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/systems/events.js
var getDefaultOpts = (opts = {}) => ({
  button: 3,
  ...opts
});
function createPointerEventsSystem(engine2, inputSystem2) {
  const PointerEvents2 = PointerEvents(engine2);
  let EventType;
  (function(EventType2) {
    EventType2[EventType2["Click"] = 0] = "Click";
    EventType2[EventType2["Down"] = 1] = "Down";
    EventType2[EventType2["Up"] = 2] = "Up";
    EventType2[EventType2["HoverEnter"] = 3] = "HoverEnter";
    EventType2[EventType2["HoverLeave"] = 4] = "HoverLeave";
  })(EventType || (EventType = {}));
  const eventsMap = /* @__PURE__ */ new Map();
  function getEvent(entity) {
    return eventsMap.get(entity) || eventsMap.set(entity, /* @__PURE__ */ new Map()).get(entity);
  }
  function setPointerEvent(entity, type, opts) {
    const pointerEvent = PointerEvents2.getMutableOrNull(entity) || PointerEvents2.create(entity);
    pointerEvent.pointerEvents.push({
      eventType: type,
      eventInfo: {
        button: opts.button,
        showFeedback: opts.showFeedback,
        showHighlight: opts.showHighlight,
        hoverText: opts.hoverText,
        maxDistance: opts.maxDistance
      }
    });
  }
  function removePointerEvent(entity, type, button) {
    const pointerEvent = PointerEvents2.getMutableOrNull(entity);
    if (!pointerEvent)
      return;
    pointerEvent.pointerEvents = pointerEvent.pointerEvents.filter((pointer) => !(pointer.eventInfo?.button === button && pointer.eventType === type));
  }
  function getPointerEvent(eventType) {
    if (eventType === EventType.Up) {
      return 0;
    } else if (eventType === EventType.HoverLeave) {
      return 3;
    } else if (eventType === EventType.HoverEnter) {
      return 2;
    }
    return 1;
  }
  function removeEvent(entity, type) {
    const event = getEvent(entity);
    const pointerEvent = event.get(type);
    if (pointerEvent?.opts.hoverText) {
      removePointerEvent(entity, getPointerEvent(type), pointerEvent.opts.button);
    }
    event.delete(type);
  }
  engine2.addSystem(function EventSystem() {
    for (const [entity, event] of eventsMap) {
      if (engine2.getEntityState(entity) === EntityState.Removed) {
        eventsMap.delete(entity);
        continue;
      }
      for (const [eventType, { cb, opts }] of event) {
        if (eventType === EventType.Click) {
          const command = inputSystem2.getClick(opts.button, entity);
          if (command)
            checkNotThenable(cb(command.up), "Click event returned a thenable. Only synchronous functions are allowed");
        }
        if (eventType === EventType.Down || eventType === EventType.Up || eventType === EventType.HoverEnter || eventType === EventType.HoverLeave) {
          const command = inputSystem2.getInputCommand(opts.button, getPointerEvent(eventType), entity);
          if (command) {
            checkNotThenable(cb(command), "Event handler returned a thenable. Only synchronous functions are allowed");
          }
        }
      }
    }
  });
  const onPointerDown = (...args) => {
    const [data, cb, maybeOpts] = args;
    if (typeof data === "number") {
      return onPointerDown({ entity: data, opts: maybeOpts ?? {} }, cb);
    }
    const { entity, opts } = data;
    const options = getDefaultOpts(opts);
    removeEvent(entity, EventType.Down);
    getEvent(entity).set(EventType.Down, { cb, opts: options });
    setPointerEvent(entity, 1, options);
  };
  const onPointerUp = (...args) => {
    const [data, cb, maybeOpts] = args;
    if (typeof data === "number") {
      return onPointerUp({ entity: data, opts: maybeOpts ?? {} }, cb);
    }
    const { entity, opts } = data;
    const options = getDefaultOpts(opts);
    removeEvent(entity, EventType.Up);
    getEvent(entity).set(EventType.Up, { cb, opts: options });
    setPointerEvent(entity, 0, options);
  };
  const onPointerHoverEnter = (...args) => {
    const [data, cb] = args;
    const { entity, opts } = data;
    const options = getDefaultOpts(opts);
    removeEvent(entity, EventType.HoverEnter);
    getEvent(entity).set(EventType.HoverEnter, { cb, opts: options });
    setPointerEvent(entity, 2, options);
  };
  const onPointerHoverLeave = (...args) => {
    const [data, cb] = args;
    const { entity, opts } = data;
    const options = getDefaultOpts(opts);
    removeEvent(entity, EventType.HoverLeave);
    getEvent(entity).set(EventType.HoverLeave, { cb, opts: options });
    setPointerEvent(entity, 3, options);
  };
  return {
    removeOnClick(entity) {
      removeEvent(entity, EventType.Click);
    },
    removeOnPointerDown(entity) {
      removeEvent(entity, EventType.Down);
    },
    removeOnPointerUp(entity) {
      removeEvent(entity, EventType.Up);
    },
    removeOnPointerHoverEnter(entity) {
      removeEvent(entity, EventType.HoverEnter);
    },
    removeOnPointerHoverLeave(entity) {
      removeEvent(entity, EventType.HoverLeave);
    },
    onClick(value, cb) {
      const { entity } = value;
      const options = getDefaultOpts(value.opts);
      removeEvent(entity, EventType.Click);
      getEvent(entity).set(EventType.Click, { cb, opts: options });
      setPointerEvent(entity, 1, options);
    },
    onPointerDown,
    onPointerUp,
    onPointerHoverEnter,
    onPointerHoverLeave
  };
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/systems/tween.js
var cacheTween = /* @__PURE__ */ new Map();
function createTweenSystem(engine2) {
  if (cacheTween.has(engine2._id)) {
    return cacheTween.get(engine2._id);
  }
  const Tween3 = Tween2(engine2);
  const TweenState2 = TweenState(engine2);
  const TweenSequence2 = TweenSequence(engine2);
  const cache = /* @__PURE__ */ new Map();
  function isCompleted(entity) {
    const tweenState = TweenState2.getOrNull(entity);
    const tween = Tween3.getOrNull(entity);
    const tweenCache = cache.get(entity);
    if (!tweenState || !tween || !tweenCache)
      return false;
    if (
      // Renderer notified that the tween is completed
      // Only consider it completed if the tween hasn't changed this frame (to avoid false positives after YOYO/sequence processing)
      (tweenState.state === 1 && !tweenCache.changed || tweenChanged(entity) && !tweenCache.changed) && // Avoid sending isCompleted multiple times
      !tweenCache.completed
    ) {
      return true;
    }
    return false;
  }
  function tweenChanged(entity) {
    const currentTween = Tween3.getOrNull(entity);
    const prevTween = cache.get(entity)?.tween;
    if (currentTween && !prevTween || !currentTween && prevTween) {
      return true;
    }
    if (!currentTween || !prevTween)
      return false;
    const currentBuff = new ReadWriteByteBuffer();
    Tween3.schema.serialize(currentTween, currentBuff);
    const compareResult = dataCompare(currentBuff.toBinary(), prevTween);
    return compareResult !== 0;
  }
  engine2.addSystem(() => {
    for (const [entity, tween] of engine2.getEntitiesWith(Tween3)) {
      if (tweenChanged(entity)) {
        const buffer2 = new ReadWriteByteBuffer();
        Tween3.schema.serialize(tween, buffer2);
        cache.set(entity, {
          tween: buffer2.toBinary(),
          completed: false,
          changed: true
        });
        continue;
      }
      const tweenCache = cache.get(entity);
      if (tweenCache) {
        tweenCache.changed = false;
        if (isCompleted(entity)) {
          tweenCache.completed = true;
        }
      }
    }
  }, Number.NEGATIVE_INFINITY);
  function initializeTweenSequenceSystem() {
    const restartTweens = [];
    function backwardsTween(tween) {
      if (tween.mode?.$case === "move" && tween.mode.move) {
        return { ...tween, mode: { ...tween.mode, move: { start: tween.mode.move.end, end: tween.mode.move.start } } };
      }
      if (tween.mode?.$case === "rotate" && tween.mode.rotate) {
        return {
          ...tween,
          mode: { ...tween.mode, rotate: { start: tween.mode.rotate.end, end: tween.mode.rotate.start } }
        };
      }
      if (tween.mode?.$case === "scale" && tween.mode.scale) {
        return {
          ...tween,
          mode: { ...tween.mode, scale: { start: tween.mode.scale.end, end: tween.mode.scale.start } }
        };
      }
      if (tween.mode?.$case === "textureMove" && tween.mode.textureMove) {
        return {
          ...tween,
          mode: { ...tween.mode, textureMove: { start: tween.mode.textureMove.end, end: tween.mode.textureMove.start } }
        };
      }
      throw new Error("Invalid tween");
    }
    engine2.addSystem(() => {
      for (const restart of restartTweens) {
        restart();
      }
      restartTweens.length = 0;
      for (const [entity, tween] of engine2.getEntitiesWith(Tween3)) {
        const tweenCache = cache.get(entity);
        if (!tweenCache)
          continue;
        if (tweenCache.completed) {
          const tweenSequence = TweenSequence2.getOrNull(entity);
          if (!tweenSequence)
            continue;
          const { sequence } = tweenSequence;
          if (sequence && sequence.length) {
            const [nextTweenSequence, ...otherTweens] = sequence;
            Tween3.createOrReplace(entity, nextTweenSequence);
            const mutableTweenHelper = TweenSequence2.getMutable(entity);
            mutableTweenHelper.sequence = otherTweens;
            if (tweenSequence.loop === 0) {
              mutableTweenHelper.sequence.push(tween);
            }
            tweenCache.completed = false;
            tweenCache.changed = true;
          } else if (tweenSequence.loop === 1) {
            Tween3.createOrReplace(entity, backwardsTween(tween));
            tweenCache.completed = false;
            tweenCache.changed = true;
          } else if (tweenSequence.loop === 0) {
            Tween3.deleteFrom(entity);
            cache.delete(entity);
            restartTweens.push(() => {
              Tween3.createOrReplace(entity, tween);
            });
          }
        }
      }
    }, Number.NEGATIVE_INFINITY);
  }
  const enableTweenSequenceLogic = globalThis.ENABLE_SDK_TWEEN_SEQUENCE;
  if (enableTweenSequenceLogic !== false)
    initializeTweenSequenceSystem();
  const tweenSystem2 = {
    // This event is fired only once per tween
    tweenCompleted: isCompleted
  };
  cacheTween.set(engine2._id, tweenSystem2);
  return tweenSystem2;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/systems/pointer-event-collider-checker.js
function pointerEventColliderChecker(engine2) {
  const PointerEvents2 = PointerEvents(engine2);
  const MeshCollider3 = MeshCollider2(engine2);
  const GltfContainer2 = GltfContainer(engine2);
  const UiTransform2 = UiTransform(engine2);
  const alreadyShownlog = /* @__PURE__ */ new Set();
  let timer = 0;
  function systemChecker(dt) {
    timer += dt;
    if (timer <= 10) {
      return;
    }
    timer = 0;
    for (const [entity] of engine2.getEntitiesWith(PointerEvents2)) {
      if (alreadyShownlog.has(entity))
        continue;
      if (GltfContainer2.has(entity))
        continue;
      if (UiTransform2.has(entity))
        continue;
      const mesh = MeshCollider3.getOrNull(entity);
      if (mesh) {
        if (mesh.collisionMask === void 0 || mesh.collisionMask & 1) {
          continue;
        }
      }
      alreadyShownlog.add(entity);
      console.log(`\u26A0\uFE0F Missing MeshCollider component on entity ${entity}. Add a MeshCollider to the entity so it can be clickeable by the player.
See https://docs.decentraland.org/creator/development-guide/sdk7/colliders/#pointer-blocking`);
    }
  }
  engine2.removeSystem(systemChecker);
  engine2.addSystem(systemChecker);
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/runtime/initialization/index.js
var engine = /* @__PURE__ */ Engine();
var inputSystem = /* @__PURE__ */ createInputSystem(engine);
var pointerEventsSystem = /* @__PURE__ */ createPointerEventsSystem(engine, inputSystem);
var tweenSystem = createTweenSystem(engine);
pointerEventColliderChecker(engine);

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/global.gen.js
var TextShape3 = /* @__PURE__ */ TextShape2(engine);

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/common/camera_type.gen.js
var CameraType;
(function(CameraType2) {
  CameraType2[CameraType2["CT_FIRST_PERSON"] = 0] = "CT_FIRST_PERSON";
  CameraType2[CameraType2["CT_THIRD_PERSON"] = 1] = "CT_THIRD_PERSON";
  CameraType2[CameraType2["CT_CINEMATIC"] = 2] = "CT_CINEMATIC";
})(CameraType || (CameraType = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/common/input_action.gen.js
var InputAction;
(function(InputAction2) {
  InputAction2[InputAction2["IA_POINTER"] = 0] = "IA_POINTER";
  InputAction2[InputAction2["IA_PRIMARY"] = 1] = "IA_PRIMARY";
  InputAction2[InputAction2["IA_SECONDARY"] = 2] = "IA_SECONDARY";
  InputAction2[InputAction2["IA_ANY"] = 3] = "IA_ANY";
  InputAction2[InputAction2["IA_FORWARD"] = 4] = "IA_FORWARD";
  InputAction2[InputAction2["IA_BACKWARD"] = 5] = "IA_BACKWARD";
  InputAction2[InputAction2["IA_RIGHT"] = 6] = "IA_RIGHT";
  InputAction2[InputAction2["IA_LEFT"] = 7] = "IA_LEFT";
  InputAction2[InputAction2["IA_JUMP"] = 8] = "IA_JUMP";
  InputAction2[InputAction2["IA_WALK"] = 9] = "IA_WALK";
  InputAction2[InputAction2["IA_ACTION_3"] = 10] = "IA_ACTION_3";
  InputAction2[InputAction2["IA_ACTION_4"] = 11] = "IA_ACTION_4";
  InputAction2[InputAction2["IA_ACTION_5"] = 12] = "IA_ACTION_5";
  InputAction2[InputAction2["IA_ACTION_6"] = 13] = "IA_ACTION_6";
})(InputAction || (InputAction = {}));
var PointerEventType;
(function(PointerEventType2) {
  PointerEventType2[PointerEventType2["PET_UP"] = 0] = "PET_UP";
  PointerEventType2[PointerEventType2["PET_DOWN"] = 1] = "PET_DOWN";
  PointerEventType2[PointerEventType2["PET_HOVER_ENTER"] = 2] = "PET_HOVER_ENTER";
  PointerEventType2[PointerEventType2["PET_HOVER_LEAVE"] = 3] = "PET_HOVER_LEAVE";
})(PointerEventType || (PointerEventType = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/common/loading_state.gen.js
var LoadingState;
(function(LoadingState2) {
  LoadingState2[LoadingState2["UNKNOWN"] = 0] = "UNKNOWN";
  LoadingState2[LoadingState2["LOADING"] = 1] = "LOADING";
  LoadingState2[LoadingState2["NOT_FOUND"] = 2] = "NOT_FOUND";
  LoadingState2[LoadingState2["FINISHED_WITH_ERROR"] = 3] = "FINISHED_WITH_ERROR";
  LoadingState2[LoadingState2["FINISHED"] = 4] = "FINISHED";
})(LoadingState || (LoadingState = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/common/texts.gen.js
var TextAlignMode;
(function(TextAlignMode2) {
  TextAlignMode2[TextAlignMode2["TAM_TOP_LEFT"] = 0] = "TAM_TOP_LEFT";
  TextAlignMode2[TextAlignMode2["TAM_TOP_CENTER"] = 1] = "TAM_TOP_CENTER";
  TextAlignMode2[TextAlignMode2["TAM_TOP_RIGHT"] = 2] = "TAM_TOP_RIGHT";
  TextAlignMode2[TextAlignMode2["TAM_MIDDLE_LEFT"] = 3] = "TAM_MIDDLE_LEFT";
  TextAlignMode2[TextAlignMode2["TAM_MIDDLE_CENTER"] = 4] = "TAM_MIDDLE_CENTER";
  TextAlignMode2[TextAlignMode2["TAM_MIDDLE_RIGHT"] = 5] = "TAM_MIDDLE_RIGHT";
  TextAlignMode2[TextAlignMode2["TAM_BOTTOM_LEFT"] = 6] = "TAM_BOTTOM_LEFT";
  TextAlignMode2[TextAlignMode2["TAM_BOTTOM_CENTER"] = 7] = "TAM_BOTTOM_CENTER";
  TextAlignMode2[TextAlignMode2["TAM_BOTTOM_RIGHT"] = 8] = "TAM_BOTTOM_RIGHT";
})(TextAlignMode || (TextAlignMode = {}));
var Font;
(function(Font2) {
  Font2[Font2["F_SANS_SERIF"] = 0] = "F_SANS_SERIF";
  Font2[Font2["F_SERIF"] = 1] = "F_SERIF";
  Font2[Font2["F_MONOSPACE"] = 2] = "F_MONOSPACE";
})(Font || (Font = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/composite/components.js
function getCompositeRootComponent(engine2) {
  const component = engine2.getComponentOrNull("composite::root");
  if (component) {
    return component;
  }
  return engine2.defineComponent("composite::root", {
    src: Schemas.String,
    entities: Schemas.Array(Schemas.Map({
      src: Schemas.Entity,
      dest: Schemas.Entity
    }))
  });
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/composite/path.js
var currentWorkingDir = "/";
function normalizeStringPosix(path, allowAboveRoot = false) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47)
      break;
    else
      code = 47;
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += "/..";
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += "/" + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function resolve(...args) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  let cwd;
  for (let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path;
    if (i >= 0)
      path = args[i];
    else {
      if (cwd === void 0)
        cwd = currentWorkingDir;
      path = cwd;
    }
    if (path.length === 0) {
      continue;
    }
    resolvedPath = path + "/" + resolvedPath;
    resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0)
      return "/" + resolvedPath;
    else
      return "/";
  } else if (resolvedPath.length > 0) {
    return resolvedPath;
  } else {
    return ".";
  }
}
function dirname(path) {
  if (path.length === 0)
    return ".";
  let code = path.charCodeAt(0);
  const hasRoot = code === 47;
  let end = -1;
  let matchedSlash = true;
  for (let i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path.slice(0, end);
}
function resolveComposite(path, cwd) {
  const absolutePath = path.startsWith(".") ? resolve(cwd, path) : resolve(path);
  return absolutePath.substring(1);
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/composite/instance.js
var EntityMappingMode;
(function(EntityMappingMode2) {
  EntityMappingMode2[EntityMappingMode2["EMM_NONE"] = 0] = "EMM_NONE";
  EntityMappingMode2[EntityMappingMode2["EMM_NEXT_AVAILABLE"] = 1] = "EMM_NEXT_AVAILABLE";
  EntityMappingMode2[EntityMappingMode2["EMM_DIRECT_MAPPING"] = 2] = "EMM_DIRECT_MAPPING";
})(EntityMappingMode || (EntityMappingMode = {}));
function getComponentValue(componentDefinition, component) {
  if (component.data?.$case === "json") {
    return component.data.json;
  } else {
    return componentDefinition.schema.deserialize(new ReadWriteByteBuffer(component.data?.binary));
  }
}
function getComponentDefinition(engine2, component) {
  const existingComponentDefinition = engine2.getComponentOrNull(component.name);
  if (!existingComponentDefinition) {
    if (component.name.startsWith("core::")) {
      if (component.name in componentDefinitionByName) {
        return componentDefinitionByName[component.name](engine2);
      } else {
        throw new Error(`The core component ${component.name} was not found.`);
      }
    } else if (component.jsonSchema) {
      return engine2.defineComponentFromSchema(component.name, Schemas.fromJson(component.jsonSchema));
    } else {
      throw new Error(`${component.name} is not defined and there is no schema to define it.`);
    }
  } else {
    return existingComponentDefinition;
  }
}
function getEntityMapping(engine2, compositeEntity, mappedEntities, { entityMapping }) {
  const existingEntity = mappedEntities.get(compositeEntity);
  if (existingEntity) {
    return existingEntity;
  }
  if (entityMapping?.type === EntityMappingMode.EMM_DIRECT_MAPPING) {
    const entity = entityMapping.getCompositeEntity(compositeEntity);
    mappedEntities.set(compositeEntity, entity);
    return entity;
  }
  const newEntity = entityMapping?.type === EntityMappingMode.EMM_NEXT_AVAILABLE ? entityMapping.getNextAvailableEntity() : engine2.addEntity();
  if (newEntity === null) {
    throw new Error("There is no more entities to allocate");
  }
  mappedEntities.set(compositeEntity, newEntity);
  return newEntity;
}
function instanceComposite(engine2, compositeResource, compositeProvider, options) {
  const { rootEntity, alreadyRequestedSrc: optionalAlreadyRequestedSrc, entityMapping } = options;
  const alreadyRequestedSrc = optionalAlreadyRequestedSrc || /* @__PURE__ */ new Set();
  const compositeDirectoryPath = dirname(resolve(compositeResource.src));
  const TransformComponentNumber = componentNumberFromName("core::Transform");
  const CompositeRootComponent = getCompositeRootComponent(engine2);
  const mappedEntities = /* @__PURE__ */ new Map();
  const getCompositeEntity = (compositeEntity) => getEntityMapping(engine2, compositeEntity, mappedEntities, options);
  const compositeRootEntity = rootEntity ?? getCompositeEntity(0);
  if (rootEntity) {
    mappedEntities.set(0, rootEntity);
  }
  const childrenComposite = compositeResource.composite.components.find((item) => item.name === CompositeRootComponent.componentName);
  if (childrenComposite) {
    for (const [childCompositeEntity, compositeRawData] of childrenComposite.data) {
      const childComposite = getComponentValue(CompositeRootComponent, compositeRawData);
      const childCompositePath = resolveComposite(childComposite.src, compositeDirectoryPath);
      const childCompositeResource = compositeProvider.getCompositeOrNull(childCompositePath);
      const targetEntity = getCompositeEntity(childCompositeEntity);
      if (childCompositeResource) {
        if (alreadyRequestedSrc.has(childCompositeResource.src) || childCompositeResource.src === compositeResource.src) {
          throw new Error(`Composite ${compositeResource.src} has a recursive instanciation while try to instance ${childCompositeResource.src}. Previous instances: ${alreadyRequestedSrc.toString()}`);
        }
        instanceComposite(engine2, childCompositeResource, compositeProvider, {
          rootEntity: targetEntity,
          alreadyRequestedSrc: new Set(alreadyRequestedSrc).add(childCompositeResource.src),
          entityMapping: entityMapping?.type === EntityMappingMode.EMM_NEXT_AVAILABLE ? entityMapping : void 0
        });
      }
    }
  }
  for (const component of compositeResource.composite.components) {
    if (component.name === CompositeRootComponent.componentName)
      continue;
    const componentDefinition = getComponentDefinition(engine2, component);
    for (const [entity, compositeComponentValue] of component.data) {
      const componentValueDeserialized = getComponentValue(componentDefinition, compositeComponentValue);
      const targetEntity = getCompositeEntity(entity);
      const componentValue = componentDefinition.create(targetEntity, componentValueDeserialized);
      if (componentDefinition.componentId === TransformComponentNumber) {
        const transform = componentValue;
        if (transform.parent) {
          transform.parent = getCompositeEntity(transform.parent);
        } else {
          transform.parent = getCompositeEntity(0);
        }
      } else {
        Schemas.mutateNestedValues(componentDefinition.schema.jsonSchema, componentValue, (value, valueType) => {
          if (valueType.serializationType === "entity") {
            return { changed: true, value: getCompositeEntity(value) };
          } else {
            return { changed: false };
          }
        });
      }
    }
  }
  const composite = CompositeRootComponent.getMutableOrNull(compositeRootEntity) || CompositeRootComponent.create(compositeRootEntity);
  for (const [entitySource, targetEntity] of mappedEntities) {
    composite.entities.push({
      src: entitySource,
      dest: targetEntity
    });
  }
  composite.src = compositeResource.src;
  return compositeRootEntity;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/composite/proto/gen/composite.gen.js
var import_minimal59 = __toESM(require_minimal2());

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/composite/proto/gen/google/protobuf/struct.gen.js
var import_minimal58 = __toESM(require_minimal2());
var NullValue;
(function(NullValue2) {
  NullValue2[NullValue2["NULL_VALUE"] = 0] = "NULL_VALUE";
})(NullValue || (NullValue = {}));
function nullValueFromJSON(object) {
  switch (object) {
    case 0:
    case "NULL_VALUE":
      return 0;
    default:
      throw new tsProtoGlobalThis2.Error("Unrecognized enum value " + object + " for enum NullValue");
  }
}
function nullValueToJSON(object) {
  switch (object) {
    case 0:
      return "NULL_VALUE";
    default:
      throw new tsProtoGlobalThis2.Error("Unrecognized enum value " + object + " for enum NullValue");
  }
}
function createBaseStruct() {
  return { fields: /* @__PURE__ */ new Map() };
}
var Struct;
(function(Struct2) {
  function encode(message, writer = import_minimal58.default.Writer.create()) {
    message.fields.forEach((value, key) => {
      if (value !== void 0) {
        Struct_FieldsEntry.encode({ key, value }, writer.uint32(10).fork()).ldelim();
      }
    });
    return writer;
  }
  Struct2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal58.default.Reader ? input : import_minimal58.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseStruct();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          const entry1 = Struct_FieldsEntry.decode(reader, reader.uint32());
          if (entry1.value !== void 0) {
            message.fields.set(entry1.key, entry1.value);
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Struct2.decode = decode;
  function fromJSON(object) {
    return {
      fields: isObject(object.fields) ? Object.entries(object.fields).reduce((acc, [key, value]) => {
        acc.set(key, value);
        return acc;
      }, /* @__PURE__ */ new Map()) : /* @__PURE__ */ new Map()
    };
  }
  Struct2.fromJSON = fromJSON;
  function toJSON(message) {
    const obj = {};
    obj.fields = {};
    if (message.fields) {
      message.fields.forEach((v, k) => {
        obj.fields[k] = v;
      });
    }
    return obj;
  }
  Struct2.toJSON = toJSON;
  function wrap(object) {
    const struct = createBaseStruct();
    if (object !== void 0) {
      Object.keys(object).forEach((key) => {
        struct.fields.set(key, object[key]);
      });
    }
    return struct;
  }
  Struct2.wrap = wrap;
  function unwrap(message) {
    const object = {};
    [...message.fields.keys()].forEach((key) => {
      object[key] = message.fields.get(key);
    });
    return object;
  }
  Struct2.unwrap = unwrap;
})(Struct || (Struct = {}));
function createBaseStruct_FieldsEntry() {
  return { key: "", value: void 0 };
}
var Struct_FieldsEntry;
(function(Struct_FieldsEntry2) {
  function encode(message, writer = import_minimal58.default.Writer.create()) {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== void 0) {
      Value.encode(Value.wrap(message.value), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  }
  Struct_FieldsEntry2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal58.default.Reader ? input : import_minimal58.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseStruct_FieldsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.value = Value.unwrap(Value.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Struct_FieldsEntry2.decode = decode;
  function fromJSON(object) {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object?.value) ? object.value : void 0 };
  }
  Struct_FieldsEntry2.fromJSON = fromJSON;
  function toJSON(message) {
    const obj = {};
    message.key !== void 0 && (obj.key = message.key);
    message.value !== void 0 && (obj.value = message.value);
    return obj;
  }
  Struct_FieldsEntry2.toJSON = toJSON;
})(Struct_FieldsEntry || (Struct_FieldsEntry = {}));
function createBaseValue() {
  return { kind: void 0 };
}
var Value;
(function(Value2) {
  function encode(message, writer = import_minimal58.default.Writer.create()) {
    switch (message.kind?.$case) {
      case "nullValue":
        writer.uint32(8).int32(message.kind.nullValue);
        break;
      case "numberValue":
        writer.uint32(17).double(message.kind.numberValue);
        break;
      case "stringValue":
        writer.uint32(26).string(message.kind.stringValue);
        break;
      case "boolValue":
        writer.uint32(32).bool(message.kind.boolValue);
        break;
      case "structValue":
        Struct.encode(Struct.wrap(message.kind.structValue), writer.uint32(42).fork()).ldelim();
        break;
      case "listValue":
        ListValue.encode(ListValue.wrap(message.kind.listValue), writer.uint32(50).fork()).ldelim();
        break;
    }
    return writer;
  }
  Value2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal58.default.Reader ? input : import_minimal58.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.kind = { $case: "nullValue", nullValue: reader.int32() };
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }
          message.kind = { $case: "numberValue", numberValue: reader.double() };
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.kind = { $case: "stringValue", stringValue: reader.string() };
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.kind = { $case: "boolValue", boolValue: reader.bool() };
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.kind = { $case: "structValue", structValue: Struct.unwrap(Struct.decode(reader, reader.uint32())) };
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }
          message.kind = { $case: "listValue", listValue: ListValue.unwrap(ListValue.decode(reader, reader.uint32())) };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  Value2.decode = decode;
  function fromJSON(object) {
    return {
      kind: isSet(object.nullValue) ? { $case: "nullValue", nullValue: nullValueFromJSON(object.nullValue) } : isSet(object.numberValue) ? { $case: "numberValue", numberValue: Number(object.numberValue) } : isSet(object.stringValue) ? { $case: "stringValue", stringValue: String(object.stringValue) } : isSet(object.boolValue) ? { $case: "boolValue", boolValue: Boolean(object.boolValue) } : isSet(object.structValue) ? { $case: "structValue", structValue: object.structValue } : isSet(object.listValue) ? { $case: "listValue", listValue: [...object.listValue] } : void 0
    };
  }
  Value2.fromJSON = fromJSON;
  function toJSON(message) {
    const obj = {};
    message.kind?.$case === "nullValue" && (obj.nullValue = message.kind?.nullValue !== void 0 ? nullValueToJSON(message.kind?.nullValue) : void 0);
    message.kind?.$case === "numberValue" && (obj.numberValue = message.kind?.numberValue);
    message.kind?.$case === "stringValue" && (obj.stringValue = message.kind?.stringValue);
    message.kind?.$case === "boolValue" && (obj.boolValue = message.kind?.boolValue);
    message.kind?.$case === "structValue" && (obj.structValue = message.kind?.structValue);
    message.kind?.$case === "listValue" && (obj.listValue = message.kind?.listValue);
    return obj;
  }
  Value2.toJSON = toJSON;
  function wrap(value) {
    const result = createBaseValue();
    if (value === null) {
      result.kind = {
        $case: "nullValue",
        nullValue: 0
        /* NullValue.NULL_VALUE */
      };
    } else if (typeof value === "boolean") {
      result.kind = { $case: "boolValue", boolValue: value };
    } else if (typeof value === "number") {
      result.kind = { $case: "numberValue", numberValue: value };
    } else if (typeof value === "string") {
      result.kind = { $case: "stringValue", stringValue: value };
    } else if (Array.isArray(value)) {
      result.kind = { $case: "listValue", listValue: value };
    } else if (typeof value === "object") {
      result.kind = { $case: "structValue", structValue: value };
    } else if (typeof value !== "undefined") {
      throw new Error("Unsupported any value type: " + typeof value);
    }
    return result;
  }
  Value2.wrap = wrap;
  function unwrap(message) {
    if (message.kind?.$case === "nullValue") {
      return null;
    } else if (message.kind?.$case === "numberValue") {
      return message.kind?.numberValue;
    } else if (message.kind?.$case === "stringValue") {
      return message.kind?.stringValue;
    } else if (message.kind?.$case === "boolValue") {
      return message.kind?.boolValue;
    } else if (message.kind?.$case === "structValue") {
      return message.kind?.structValue;
    } else if (message.kind?.$case === "listValue") {
      return message.kind?.listValue;
    } else {
      return void 0;
    }
  }
  Value2.unwrap = unwrap;
})(Value || (Value = {}));
function createBaseListValue() {
  return { values: [] };
}
var ListValue;
(function(ListValue2) {
  function encode(message, writer = import_minimal58.default.Writer.create()) {
    for (const v of message.values) {
      Value.encode(Value.wrap(v), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  }
  ListValue2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal58.default.Reader ? input : import_minimal58.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseListValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.values.push(Value.unwrap(Value.decode(reader, reader.uint32())));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  ListValue2.decode = decode;
  function fromJSON(object) {
    return { values: Array.isArray(object?.values) ? [...object.values] : [] };
  }
  ListValue2.fromJSON = fromJSON;
  function toJSON(message) {
    const obj = {};
    if (message.values) {
      obj.values = message.values.map((e) => e);
    } else {
      obj.values = [];
    }
    return obj;
  }
  ListValue2.toJSON = toJSON;
  function wrap(array) {
    const result = createBaseListValue();
    result.values = array ?? [];
    return result;
  }
  ListValue2.wrap = wrap;
  function unwrap(message) {
    if (message?.hasOwnProperty("values") && Array.isArray(message.values)) {
      return message.values;
    } else {
      return message;
    }
  }
  ListValue2.unwrap = unwrap;
})(ListValue || (ListValue = {}));
var tsProtoGlobalThis2 = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isSet(value) {
  return value !== null && value !== void 0;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/composite/proto/gen/composite.gen.js
function createBaseComponentData() {
  return { data: void 0 };
}
var ComponentData;
(function(ComponentData2) {
  function encode(message, writer = import_minimal59.default.Writer.create()) {
    switch (message.data?.$case) {
      case "json":
        Value.encode(Value.wrap(message.data.json), writer.uint32(10).fork()).ldelim();
        break;
      case "binary":
        writer.uint32(18).bytes(message.data.binary);
        break;
    }
    return writer;
  }
  ComponentData2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal59.default.Reader ? input : import_minimal59.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseComponentData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.data = { $case: "json", json: Value.unwrap(Value.decode(reader, reader.uint32())) };
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.data = { $case: "binary", binary: reader.bytes() };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  ComponentData2.decode = decode;
  function fromJSON(object) {
    return {
      data: isSet2(object.json) ? { $case: "json", json: object.json } : isSet2(object.binary) ? { $case: "binary", binary: bytesFromBase64(object.binary) } : void 0
    };
  }
  ComponentData2.fromJSON = fromJSON;
  function toJSON(message) {
    const obj = {};
    message.data?.$case === "json" && (obj.json = message.data?.json);
    message.data?.$case === "binary" && (obj.binary = message.data?.binary !== void 0 ? base64FromBytes(message.data?.binary) : void 0);
    return obj;
  }
  ComponentData2.toJSON = toJSON;
})(ComponentData || (ComponentData = {}));
function createBaseCompositeComponent() {
  return { name: "", jsonSchema: void 0, data: /* @__PURE__ */ new Map() };
}
var CompositeComponent;
(function(CompositeComponent2) {
  function encode(message, writer = import_minimal59.default.Writer.create()) {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.jsonSchema !== void 0) {
      Value.encode(Value.wrap(message.jsonSchema), writer.uint32(18).fork()).ldelim();
    }
    message.data.forEach((value, key) => {
      CompositeComponent_DataEntry.encode({ key, value }, writer.uint32(26).fork()).ldelim();
    });
    return writer;
  }
  CompositeComponent2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal59.default.Reader ? input : import_minimal59.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseCompositeComponent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.jsonSchema = Value.unwrap(Value.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          const entry3 = CompositeComponent_DataEntry.decode(reader, reader.uint32());
          if (entry3.value !== void 0) {
            message.data.set(entry3.key, entry3.value);
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  CompositeComponent2.decode = decode;
  function fromJSON(object) {
    return {
      name: isSet2(object.name) ? String(object.name) : "",
      jsonSchema: isSet2(object?.jsonSchema) ? object.jsonSchema : void 0,
      data: isObject2(object.data) ? Object.entries(object.data).reduce((acc, [key, value]) => {
        acc.set(Number(key), ComponentData.fromJSON(value));
        return acc;
      }, /* @__PURE__ */ new Map()) : /* @__PURE__ */ new Map()
    };
  }
  CompositeComponent2.fromJSON = fromJSON;
  function toJSON(message) {
    const obj = {};
    message.name !== void 0 && (obj.name = message.name);
    message.jsonSchema !== void 0 && (obj.jsonSchema = message.jsonSchema);
    obj.data = {};
    if (message.data) {
      message.data.forEach((v, k) => {
        obj.data[k] = ComponentData.toJSON(v);
      });
    }
    return obj;
  }
  CompositeComponent2.toJSON = toJSON;
})(CompositeComponent || (CompositeComponent = {}));
function createBaseCompositeComponent_DataEntry() {
  return { key: 0, value: void 0 };
}
var CompositeComponent_DataEntry;
(function(CompositeComponent_DataEntry2) {
  function encode(message, writer = import_minimal59.default.Writer.create()) {
    if (message.key !== 0) {
      writer.uint32(8).int32(message.key);
    }
    if (message.value !== void 0) {
      ComponentData.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  }
  CompositeComponent_DataEntry2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal59.default.Reader ? input : import_minimal59.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseCompositeComponent_DataEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.key = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.value = ComponentData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  CompositeComponent_DataEntry2.decode = decode;
  function fromJSON(object) {
    return {
      key: isSet2(object.key) ? Number(object.key) : 0,
      value: isSet2(object.value) ? ComponentData.fromJSON(object.value) : void 0
    };
  }
  CompositeComponent_DataEntry2.fromJSON = fromJSON;
  function toJSON(message) {
    const obj = {};
    message.key !== void 0 && (obj.key = Math.round(message.key));
    message.value !== void 0 && (obj.value = message.value ? ComponentData.toJSON(message.value) : void 0);
    return obj;
  }
  CompositeComponent_DataEntry2.toJSON = toJSON;
})(CompositeComponent_DataEntry || (CompositeComponent_DataEntry = {}));
function createBaseCompositeDefinition() {
  return { version: 0, components: [] };
}
var CompositeDefinition;
(function(CompositeDefinition2) {
  function encode(message, writer = import_minimal59.default.Writer.create()) {
    if (message.version !== 0) {
      writer.uint32(8).int32(message.version);
    }
    for (const v of message.components) {
      CompositeComponent.encode(v, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  }
  CompositeDefinition2.encode = encode;
  function decode(input, length2) {
    const reader = input instanceof import_minimal59.default.Reader ? input : import_minimal59.default.Reader.create(input);
    let end = length2 === void 0 ? reader.len : reader.pos + length2;
    const message = createBaseCompositeDefinition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.version = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.components.push(CompositeComponent.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  }
  CompositeDefinition2.decode = decode;
  function fromJSON(object) {
    return {
      version: isSet2(object.version) ? Number(object.version) : 0,
      components: Array.isArray(object?.components) ? object.components.map((e) => CompositeComponent.fromJSON(e)) : []
    };
  }
  CompositeDefinition2.fromJSON = fromJSON;
  function toJSON(message) {
    const obj = {};
    message.version !== void 0 && (obj.version = Math.round(message.version));
    if (message.components) {
      obj.components = message.components.map((e) => e ? CompositeComponent.toJSON(e) : void 0);
    } else {
      obj.components = [];
    }
    return obj;
  }
  CompositeDefinition2.toJSON = toJSON;
})(CompositeDefinition || (CompositeDefinition = {}));
var tsProtoGlobalThis3 = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();
function bytesFromBase64(b64) {
  if (tsProtoGlobalThis3.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis3.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis3.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}
function base64FromBytes(arr) {
  if (tsProtoGlobalThis3.Buffer) {
    return tsProtoGlobalThis3.Buffer.from(arr).toString("base64");
  } else {
    const bin = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis3.btoa(bin.join(""));
  }
}
function isObject2(value) {
  return typeof value === "object" && value !== null;
}
function isSet2(value) {
  return value !== null && value !== void 0;
}

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/composite/index.js
var Composite;
(function(Composite2) {
  function fromJson(object) {
    return CompositeDefinition.fromJSON(object);
  }
  Composite2.fromJson = fromJson;
  function fromBinary(buffer2) {
    return CompositeDefinition.decode(buffer2);
  }
  Composite2.fromBinary = fromBinary;
  function toJson(composite) {
    return CompositeDefinition.toJSON(composite);
  }
  Composite2.toJson = toJson;
  function toBinary(composite) {
    return CompositeDefinition.encode(composite).finish();
  }
  Composite2.toBinary = toBinary;
  function instance(engine2, compositeData, compositeProvider, options = {}) {
    instanceComposite(engine2, compositeData, compositeProvider, options);
  }
  Composite2.instance = instance;
  function resolveAndNormalizePath(src, cwd = "/") {
    return resolveComposite(src, cwd);
  }
  Composite2.resolveAndNormalizePath = resolveAndNormalizePath;
})(Composite || (Composite = {}));

// ../../node_modules/.pnpm/@dcl+ecs@7.17.0/node_modules/@dcl/ecs/dist/index.js
var Transform2 = /* @__PURE__ */ Transform(engine);
var AudioSource3 = /* @__PURE__ */ AudioSource2(engine);
var Material3 = /* @__PURE__ */ Material2(engine);
var MeshRenderer3 = /* @__PURE__ */ MeshRenderer2(engine);
var Name2 = Name(engine);
var Tags2 = Tags(engine);

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/types.js
var ToGammaSpace = 1 / 2.2;
var ToLinearSpace = 2.2;
var Epsilon = 1e-6;
var DEG2RAD = Math.PI / 180;
var RAD2DEG = 360 / (Math.PI * 2);

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/Scalar.js
var Scalar;
(function(Scalar2) {
  Scalar2.TwoPi = Math.PI * 2;
  function withinEpsilon(a, b, epsilon = 1401298e-51) {
    const num = a - b;
    return -epsilon <= num && num <= epsilon;
  }
  Scalar2.withinEpsilon = withinEpsilon;
  function toHex(i) {
    const str = i.toString(16);
    if (i <= 15) {
      return ("0" + str).toUpperCase();
    }
    return str.toUpperCase();
  }
  Scalar2.toHex = toHex;
  function sign(value) {
    const _value = +value;
    if (_value === 0 || isNaN(_value)) {
      return _value;
    }
    return _value > 0 ? 1 : -1;
  }
  Scalar2.sign = sign;
  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }
  Scalar2.clamp = clamp;
  function log2(value) {
    return Math.log(value) * Math.LOG2E;
  }
  Scalar2.log2 = log2;
  function repeat(value, length2) {
    return value - Math.floor(value / length2) * length2;
  }
  Scalar2.repeat = repeat;
  function normalize(value, min, max) {
    return (value - min) / (max - min);
  }
  Scalar2.normalize = normalize;
  function denormalize(normalized, min, max) {
    return normalized * (max - min) + min;
  }
  Scalar2.denormalize = denormalize;
  function deltaAngle(current, target) {
    let num = repeat(target - current, 360);
    if (num > 180) {
      num -= 360;
    }
    return num;
  }
  Scalar2.deltaAngle = deltaAngle;
  function pingPong(tx, length2) {
    const t = repeat(tx, length2 * 2);
    return length2 - Math.abs(t - length2);
  }
  Scalar2.pingPong = pingPong;
  function smoothStep(from, to, tx) {
    let t = clamp(tx);
    t = -2 * t * t * t + 3 * t * t;
    return to * t + from * (1 - t);
  }
  Scalar2.smoothStep = smoothStep;
  function moveTowards(current, target, maxDelta) {
    let result = 0;
    if (Math.abs(target - current) <= maxDelta) {
      result = target;
    } else {
      result = current + sign(target - current) * maxDelta;
    }
    return result;
  }
  Scalar2.moveTowards = moveTowards;
  function moveTowardsAngle(current, target, maxDelta) {
    const num = deltaAngle(current, target);
    let result = 0;
    if (-maxDelta < num && num < maxDelta) {
      result = target;
    } else {
      result = moveTowards(current, current + num, maxDelta);
    }
    return result;
  }
  Scalar2.moveTowardsAngle = moveTowardsAngle;
  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }
  Scalar2.lerp = lerp;
  function lerpAngle(start, end, amount) {
    let num = repeat(end - start, 360);
    if (num > 180) {
      num -= 360;
    }
    return start + num * clamp(amount);
  }
  Scalar2.lerpAngle = lerpAngle;
  function inverseLerp(a, b, value) {
    let result = 0;
    if (a !== b) {
      result = clamp((value - a) / (b - a));
    } else {
      result = 0;
    }
    return result;
  }
  Scalar2.inverseLerp = inverseLerp;
  function hermite(value1, tangent1, value2, tangent2, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const part1 = 2 * cubed - 3 * squared + 1;
    const part2 = -2 * cubed + 3 * squared;
    const part3 = cubed - 2 * squared + amount;
    const part4 = cubed - squared;
    return value1 * part1 + value2 * part2 + tangent1 * part3 + tangent2 * part4;
  }
  Scalar2.hermite = hermite;
  function randomRange(min, max) {
    if (min === max) {
      return min;
    }
    return Math.random() * (max - min) + min;
  }
  Scalar2.randomRange = randomRange;
  function rangeToPercent(num, min, max) {
    return (num - min) / (max - min);
  }
  Scalar2.rangeToPercent = rangeToPercent;
  function percentToRange(percent, min, max) {
    return (max - min) * percent + min;
  }
  Scalar2.percentToRange = percentToRange;
  function normalizeRadians(angle) {
    return angle - Scalar2.TwoPi * Math.floor((angle + Math.PI) / Scalar2.TwoPi);
  }
  Scalar2.normalizeRadians = normalizeRadians;
})(Scalar || (Scalar = {}));

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/Vector3.js
var Vector32;
(function(Vector33) {
  function isNonUniform(vector) {
    const absX = Math.abs(vector.x);
    const absY = Math.abs(vector.y);
    if (absX !== absY) {
      return true;
    }
    const absZ = Math.abs(vector.z);
    if (absX !== absZ) {
      return true;
    }
    return false;
  }
  Vector33.isNonUniform = isNonUniform;
  function create(x = 0, y = 0, z = 0) {
    return { x, y, z };
  }
  Vector33.create = create;
  function add2(vector1, vector2) {
    return {
      x: vector1.x + vector2.x,
      y: vector1.y + vector2.y,
      z: vector1.z + vector2.z
    };
  }
  Vector33.add = add2;
  function addToRef(vectorA, vectorB, result) {
    result.x = vectorA.x + vectorB.x;
    result.y = vectorA.y + vectorB.y;
    result.z = vectorA.z + vectorB.z;
  }
  Vector33.addToRef = addToRef;
  function subtract2(vector1, vector2) {
    return {
      x: vector1.x - vector2.x,
      y: vector1.y - vector2.y,
      z: vector1.z - vector2.z
    };
  }
  Vector33.subtract = subtract2;
  function subtractToRef(vectorA, vectorB, result) {
    result.x = vectorA.x - vectorB.x;
    result.y = vectorA.y - vectorB.y;
    result.z = vectorA.z - vectorB.z;
  }
  Vector33.subtractToRef = subtractToRef;
  function subtractFromFloatsToRef(vector1, x, y, z, result) {
    result.x = vector1.x - x;
    result.y = vector1.y - y;
    result.z = vector1.z - z;
  }
  Vector33.subtractFromFloatsToRef = subtractFromFloatsToRef;
  function negate2(value) {
    return { x: -value.x, y: -value.y, z: -value.z };
  }
  Vector33.negate = negate2;
  function copyFrom(source, dest) {
    dest.x = source.x;
    dest.y = source.y;
    dest.z = source.z;
  }
  Vector33.copyFrom = copyFrom;
  function copyFromFloats(x, y, z, dest) {
    dest.x = x;
    dest.y = y;
    dest.z = z;
  }
  Vector33.copyFromFloats = copyFromFloats;
  function clone(source) {
    return create(source.x, source.y, source.z);
  }
  Vector33.clone = clone;
  function getClipFactor(vector0, vector1, axis, size) {
    const d0 = dot(vector0, axis) - size;
    const d1 = dot(vector1, axis) - size;
    const s = d0 / (d0 - d1);
    return s;
  }
  Vector33.getClipFactor = getClipFactor;
  function getAngleBetweenVectors(vector0, vector1, normal) {
    const v0 = normalize(vector0);
    const v1 = normalize(vector1);
    const v0v1dot = dot(v0, v1);
    const n = create();
    crossToRef(v0, v1, n);
    if (dot(n, normal) > 0) {
      return Math.acos(v0v1dot);
    }
    return -Math.acos(v0v1dot);
  }
  Vector33.getAngleBetweenVectors = getAngleBetweenVectors;
  function fromArray(array, offset = 0) {
    return create(array[offset], array[offset + 1], array[offset + 2]);
  }
  Vector33.fromArray = fromArray;
  function fromFloatArray(array, offset) {
    return fromArray(array, offset);
  }
  Vector33.fromFloatArray = fromFloatArray;
  function fromArrayToRef(array, offset, result) {
    result.x = array[offset];
    result.y = array[offset + 1];
    result.z = array[offset + 2];
  }
  Vector33.fromArrayToRef = fromArrayToRef;
  function fromFloatArrayToRef(array, offset, result) {
    return fromArrayToRef(array, offset, result);
  }
  Vector33.fromFloatArrayToRef = fromFloatArrayToRef;
  function length2(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  }
  Vector33.length = length2;
  function lengthSquared(vector) {
    return vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
  }
  Vector33.lengthSquared = lengthSquared;
  function scaleToRef(vector, scale2, result) {
    result.x = vector.x * scale2;
    result.y = vector.y * scale2;
    result.z = vector.z * scale2;
  }
  Vector33.scaleToRef = scaleToRef;
  function scale(vector, scale2) {
    return create(vector.x * scale2, vector.y * scale2, vector.z * scale2);
  }
  Vector33.scale = scale;
  function normalizeFromLength(vector, len) {
    const result = create(0, 0, 0);
    normalizeFromLengthToRef(vector, len, result);
    return result;
  }
  Vector33.normalizeFromLength = normalizeFromLength;
  function normalizeFromLengthToRef(vector, len, result) {
    if (len === 0 || len === 1) {
      copyFrom(vector, result);
      return;
    }
    scaleToRef(vector, 1 / len, result);
  }
  Vector33.normalizeFromLengthToRef = normalizeFromLengthToRef;
  function normalize(vector) {
    return normalizeFromLength(vector, length2(vector));
  }
  Vector33.normalize = normalize;
  function normalizeToRef(vector, result) {
    normalizeFromLengthToRef(vector, length2(vector), result);
  }
  Vector33.normalizeToRef = normalizeToRef;
  function dot(left, right) {
    return left.x * right.x + left.y * right.y + left.z * right.z;
  }
  Vector33.dot = dot;
  function applyMatrix4(vector, matrix) {
    const result = clone(vector);
    applyMatrix4ToRef(vector, matrix, result);
    return result;
  }
  Vector33.applyMatrix4 = applyMatrix4;
  function applyMatrix4ToRef(vector, matrix, result) {
    const { x, y, z } = vector;
    const m = matrix._m;
    const w = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15]);
    result.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) * w;
    result.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) * w;
    result.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) * w;
  }
  Vector33.applyMatrix4ToRef = applyMatrix4ToRef;
  function rotate(vector, q) {
    const result = create();
    rotateToRef(vector, q, result);
    return result;
  }
  Vector33.rotate = rotate;
  function rotateToRef(vector, q, result) {
    const { x, y, z } = vector;
    const { x: qx, y: qy, z: qz, w: qw } = q;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    result.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    result.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    result.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  }
  Vector33.rotateToRef = rotateToRef;
  function lerp(start, end, amount) {
    const result = create(0, 0, 0);
    lerpToRef(start, end, amount, result);
    return result;
  }
  Vector33.lerp = lerp;
  function lerpToRef(start, end, amount, result) {
    result.x = start.x + (end.x - start.x) * amount;
    result.y = start.y + (end.y - start.y) * amount;
    result.z = start.z + (end.z - start.z) * amount;
  }
  Vector33.lerpToRef = lerpToRef;
  function cross(left, right) {
    const result = Zero();
    crossToRef(left, right, result);
    return result;
  }
  Vector33.cross = cross;
  function crossToRef(left, right, result) {
    result.x = left.y * right.z - left.z * right.y;
    result.y = left.z * right.x - left.x * right.z;
    result.z = left.x * right.y - left.y * right.x;
  }
  Vector33.crossToRef = crossToRef;
  function transformCoordinates(vector, transformation) {
    const result = Zero();
    transformCoordinatesToRef(vector, transformation, result);
    return result;
  }
  Vector33.transformCoordinates = transformCoordinates;
  function transformCoordinatesToRef(vector, transformation, result) {
    return transformCoordinatesFromFloatsToRef(vector.x, vector.y, vector.z, transformation, result);
  }
  Vector33.transformCoordinatesToRef = transformCoordinatesToRef;
  function transformCoordinatesFromFloatsToRef(x, y, z, transformation, result) {
    const m = transformation._m;
    const rx = x * m[0] + y * m[4] + z * m[8] + m[12];
    const ry = x * m[1] + y * m[5] + z * m[9] + m[13];
    const rz = x * m[2] + y * m[6] + z * m[10] + m[14];
    const rw = 1 / (x * m[3] + y * m[7] + z * m[11] + m[15]);
    result.x = rx * rw;
    result.y = ry * rw;
    result.z = rz * rw;
  }
  Vector33.transformCoordinatesFromFloatsToRef = transformCoordinatesFromFloatsToRef;
  function transformNormal(vector, transformation) {
    const result = Zero();
    transformNormalToRef(vector, transformation, result);
    return result;
  }
  Vector33.transformNormal = transformNormal;
  function transformNormalToRef(vector, transformation, result) {
    transformNormalFromFloatsToRef(vector.x, vector.y, vector.z, transformation, result);
  }
  Vector33.transformNormalToRef = transformNormalToRef;
  function transformNormalFromFloatsToRef(x, y, z, transformation, result) {
    const m = transformation._m;
    result.x = x * m[0] + y * m[4] + z * m[8];
    result.y = x * m[1] + y * m[5] + z * m[9];
    result.z = x * m[2] + y * m[6] + z * m[10];
  }
  Vector33.transformNormalFromFloatsToRef = transformNormalFromFloatsToRef;
  function catmullRom(value1, value2, value3, value4, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const x = 0.5 * (2 * value2.x + (-value1.x + value3.x) * amount + (2 * value1.x - 5 * value2.x + 4 * value3.x - value4.x) * squared + (-value1.x + 3 * value2.x - 3 * value3.x + value4.x) * cubed);
    const y = 0.5 * (2 * value2.y + (-value1.y + value3.y) * amount + (2 * value1.y - 5 * value2.y + 4 * value3.y - value4.y) * squared + (-value1.y + 3 * value2.y - 3 * value3.y + value4.y) * cubed);
    const z = 0.5 * (2 * value2.z + (-value1.z + value3.z) * amount + (2 * value1.z - 5 * value2.z + 4 * value3.z - value4.z) * squared + (-value1.z + 3 * value2.z - 3 * value3.z + value4.z) * cubed);
    return create(x, y, z);
  }
  Vector33.catmullRom = catmullRom;
  function clamp(value, min, max) {
    const v = create();
    clampToRef(value, min, max, v);
    return v;
  }
  Vector33.clamp = clamp;
  function clampToRef(value, min, max, result) {
    let x = value.x;
    x = x > max.x ? max.x : x;
    x = x < min.x ? min.x : x;
    let y = value.y;
    y = y > max.y ? max.y : y;
    y = y < min.y ? min.y : y;
    let z = value.z;
    z = z > max.z ? max.z : z;
    z = z < min.z ? min.z : z;
    copyFromFloats(x, y, z, result);
  }
  Vector33.clampToRef = clampToRef;
  function hermite(value1, tangent1, value2, tangent2, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const part1 = 2 * cubed - 3 * squared + 1;
    const part2 = -2 * cubed + 3 * squared;
    const part3 = cubed - 2 * squared + amount;
    const part4 = cubed - squared;
    const x = value1.x * part1 + value2.x * part2 + tangent1.x * part3 + tangent2.x * part4;
    const y = value1.y * part1 + value2.y * part2 + tangent1.y * part3 + tangent2.y * part4;
    const z = value1.z * part1 + value2.z * part2 + tangent1.z * part3 + tangent2.z * part4;
    return create(x, y, z);
  }
  Vector33.hermite = hermite;
  function minimize(left, right) {
    const min = create();
    minimizeInPlaceFromFloatsToRef(right, left.x, left.y, left.z, min);
    return min;
  }
  Vector33.minimize = minimize;
  function maximize(left, right) {
    const max = create();
    maximizeInPlaceFromFloatsToRef(left, right.x, right.y, right.z, max);
    return max;
  }
  Vector33.maximize = maximize;
  function distance(value1, value2) {
    return Math.sqrt(distanceSquared(value1, value2));
  }
  Vector33.distance = distance;
  function distanceSquared(value1, value2) {
    const x = value1.x - value2.x;
    const y = value1.y - value2.y;
    const z = value1.z - value2.z;
    return x * x + y * y + z * z;
  }
  Vector33.distanceSquared = distanceSquared;
  function center(value1, value2) {
    const center2 = add2(value1, value2);
    scaleToRef(center2, 0.5, center2);
    return center2;
  }
  Vector33.center = center;
  function rotationFromAxis(axis1, axis2, axis3) {
    const rotation = Zero();
    rotationFromAxisToRef(axis1, axis2, axis3, rotation);
    return rotation;
  }
  Vector33.rotationFromAxis = rotationFromAxis;
  function rotationFromAxisToRef(axis1, axis2, axis3, result) {
    const quat = Quaternion2.create();
    Quaternion2.fromAxisToRotationQuaternionToRef(axis1, axis2, axis3, quat);
    copyFrom(Quaternion2.toEulerAngles(quat), result);
  }
  Vector33.rotationFromAxisToRef = rotationFromAxisToRef;
  function toString2(vector) {
    return `(${vector.x}, ${vector.y}, ${vector.z})`;
  }
  Vector33.toString = toString2;
  function getHashCode(vector) {
    let hash = vector.x || 0;
    hash = hash * 397 ^ (vector.y || 0);
    hash = hash * 397 ^ (vector.z || 0);
    return hash;
  }
  Vector33.getHashCode = getHashCode;
  function equals2(vector1, vector2) {
    return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
  }
  Vector33.equals = equals2;
  function equalsWithEpsilon(vector1, vector2, epsilon = Epsilon) {
    return Scalar.withinEpsilon(vector1.x, vector2.x, epsilon) && Scalar.withinEpsilon(vector1.y, vector2.y, epsilon) && Scalar.withinEpsilon(vector1.z, vector2.z, epsilon);
  }
  Vector33.equalsWithEpsilon = equalsWithEpsilon;
  function equalsToFloats(vector, x, y, z) {
    return vector.x === x && vector.y === y && vector.z === z;
  }
  Vector33.equalsToFloats = equalsToFloats;
  function multiply2(vector1, vector2) {
    const result = create();
    multiplyToRef(vector1, vector2, result);
    return result;
  }
  Vector33.multiply = multiply2;
  function multiplyToRef(vector1, vector2, result) {
    result.x = vector1.x * vector2.x;
    result.y = vector1.y * vector2.y;
    result.z = vector1.z * vector2.z;
  }
  Vector33.multiplyToRef = multiplyToRef;
  function multiplyByFloatsToRef(vector1, x, y, z, result) {
    result.x = vector1.x * x;
    result.y = vector1.y * y;
    result.z = vector1.z * z;
  }
  Vector33.multiplyByFloatsToRef = multiplyByFloatsToRef;
  function multiplyByFloats(vector1, x, y, z) {
    const result = create();
    multiplyByFloatsToRef(vector1, x, y, z, result);
    return result;
  }
  Vector33.multiplyByFloats = multiplyByFloats;
  function divide2(vector1, vector2) {
    return {
      x: vector1.x / vector2.x,
      y: vector1.y / vector2.y,
      z: vector1.z / vector2.z
    };
  }
  Vector33.divide = divide2;
  function divideToRef(vector1, vector2, result) {
    result.x = vector1.x / vector2.x;
    result.y = vector1.y / vector2.y;
    result.z = vector1.z / vector2.z;
  }
  Vector33.divideToRef = divideToRef;
  function maximizeInPlaceFromFloatsToRef(vector1, x, y, z, result) {
    if (x > vector1.x) {
      result.x = x;
    } else {
      result.x = vector1.x;
    }
    if (y > vector1.y) {
      result.y = y;
    } else {
      result.y = vector1.y;
    }
    if (z > vector1.z) {
      result.z = z;
    } else {
      result.z = vector1.z;
    }
  }
  Vector33.maximizeInPlaceFromFloatsToRef = maximizeInPlaceFromFloatsToRef;
  function minimizeInPlaceFromFloatsToRef(vector1, x, y, z, result) {
    if (x < vector1.x) {
      result.x = x;
    } else {
      result.x = vector1.x;
    }
    if (y < vector1.y) {
      result.y = y;
    } else {
      result.y = vector1.y;
    }
    if (z < vector1.z) {
      result.z = z;
    } else {
      result.z = vector1.z;
    }
  }
  Vector33.minimizeInPlaceFromFloatsToRef = minimizeInPlaceFromFloatsToRef;
  function floor(vector1) {
    return create(Math.floor(vector1.x), Math.floor(vector1.y), Math.floor(vector1.z));
  }
  Vector33.floor = floor;
  function fract(vector1) {
    return create(vector1.x - Math.floor(vector1.x), vector1.y - Math.floor(vector1.y), vector1.z - Math.floor(vector1.z));
  }
  Vector33.fract = fract;
  function Zero() {
    return create(0, 0, 0);
  }
  Vector33.Zero = Zero;
  function One() {
    return create(1, 1, 1);
  }
  Vector33.One = One;
  function Up() {
    return create(0, 1, 0);
  }
  Vector33.Up = Up;
  function Down() {
    return create(0, -1, 0);
  }
  Vector33.Down = Down;
  function Forward() {
    return create(0, 0, 1);
  }
  Vector33.Forward = Forward;
  function Backward() {
    return create(0, 0, -1);
  }
  Vector33.Backward = Backward;
  function Right() {
    return create(1, 0, 0);
  }
  Vector33.Right = Right;
  function Left() {
    return create(-1, 0, 0);
  }
  Vector33.Left = Left;
  function Random() {
    return create(Math.random(), Math.random(), Math.random());
  }
  Vector33.Random = Random;
})(Vector32 || (Vector32 = {}));

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/Plane.js
var Plane;
(function(Plane2) {
  function create(a, b, c, d) {
    return {
      normal: Vector32.create(a, b, c),
      d
    };
  }
  Plane2.create = create;
  function fromArray(array) {
    return create(array[0], array[1], array[2], array[3]);
  }
  Plane2.fromArray = fromArray;
  function fromPoints(_point1, _point2, _point3) {
    const result = create(0, 0, 0, 0);
    return result;
  }
  Plane2.fromPoints = fromPoints;
  function romPositionAndNormal(origin, normal) {
    const result = create(0, 0, 0, 0);
    result.normal = Vector32.normalize(normal);
    result.d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
    return result;
  }
  Plane2.romPositionAndNormal = romPositionAndNormal;
  function signedDistanceToPlaneFromPositionAndNormal(origin, normal, point) {
    const d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
    return Vector32.dot(point, normal) + d;
  }
  Plane2.signedDistanceToPlaneFromPositionAndNormal = signedDistanceToPlaneFromPositionAndNormal;
  function asArray(plane) {
    return [plane.normal.x, plane.normal.y, plane.normal.z, plane.d];
  }
  Plane2.asArray = asArray;
  function clone(plane) {
    return create(plane.normal.x, plane.normal.y, plane.normal.z, plane.d);
  }
  Plane2.clone = clone;
  function getHashCode(_plane) {
    return 0;
  }
  Plane2.getHashCode = getHashCode;
  function normalize(plane) {
    const result = create(0, 0, 0, 0);
    const norm = Math.sqrt(plane.normal.x * plane.normal.x + plane.normal.y * plane.normal.y + plane.normal.z * plane.normal.z);
    let magnitude = 0;
    if (norm !== 0) {
      magnitude = 1 / norm;
    }
    result.normal.x = plane.normal.x * magnitude;
    result.normal.y = plane.normal.y * magnitude;
    result.normal.z = plane.normal.z * magnitude;
    result.d *= magnitude;
    return plane;
  }
  Plane2.normalize = normalize;
  function transform(plane, transformation) {
    const transposedMatrix = Matrix.create();
    Matrix.transposeToRef(transformation, transposedMatrix);
    const m = transposedMatrix._m;
    const x = plane.normal.x;
    const y = plane.normal.y;
    const z = plane.normal.z;
    const d = plane.d;
    const normalX = x * m[0] + y * m[1] + z * m[2] + d * m[3];
    const normalY = x * m[4] + y * m[5] + z * m[6] + d * m[7];
    const normalZ = x * m[8] + y * m[9] + z * m[10] + d * m[11];
    const finalD = x * m[12] + y * m[13] + z * m[14] + d * m[15];
    return create(normalX, normalY, normalZ, finalD);
  }
  Plane2.transform = transform;
  function dotCoordinate(plane, point) {
    return plane.normal.x * point.x + plane.normal.y * point.y + plane.normal.z * point.z + plane.d;
  }
  Plane2.dotCoordinate = dotCoordinate;
  function copyFromPoints(point1, point2, point3) {
    const x1 = point2.x - point1.x;
    const y1 = point2.y - point1.y;
    const z1 = point2.z - point1.z;
    const x2 = point3.x - point1.x;
    const y2 = point3.y - point1.y;
    const z2 = point3.z - point1.z;
    const yz = y1 * z2 - z1 * y2;
    const xz = z1 * x2 - x1 * z2;
    const xy = x1 * y2 - y1 * x2;
    const pyth = Math.sqrt(yz * yz + xz * xz + xy * xy);
    let invPyth;
    if (pyth !== 0) {
      invPyth = 1 / pyth;
    } else {
      invPyth = 0;
    }
    const normal = Vector32.create(yz * invPyth, xz * invPyth, xy * invPyth);
    return {
      normal,
      d: -(normal.x * point1.x + normal.y * point1.y + normal.z * point1.z)
    };
  }
  Plane2.copyFromPoints = copyFromPoints;
  function isFrontFacingTo(plane, direction, epsilon) {
    const dot = Vector32.dot(plane.normal, direction);
    return dot <= epsilon;
  }
  Plane2.isFrontFacingTo = isFrontFacingTo;
  function signedDistanceTo(plane, point) {
    return Vector32.dot(point, plane.normal) + plane.d;
  }
  Plane2.signedDistanceTo = signedDistanceTo;
})(Plane || (Plane = {}));

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/Matrix.js
var Matrix;
(function(Matrix2) {
  function m(self2) {
    return self2._m;
  }
  Matrix2.m = m;
  let _updateFlagSeed = 0;
  const _identityReadonly = {};
  function IdentityReadonly() {
    return _identityReadonly;
  }
  Matrix2.IdentityReadonly = IdentityReadonly;
  function create() {
    const newMatrix = {
      updateFlag: 0,
      isIdentity: false,
      isIdentity3x2: true,
      _isIdentityDirty: true,
      _isIdentity3x2Dirty: true,
      _m: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    _updateIdentityStatus(newMatrix, false);
    return newMatrix;
  }
  Matrix2.create = create;
  function fromArray(array, offset = 0) {
    const result = create();
    fromArrayToRef(array, offset, result);
    return result;
  }
  Matrix2.fromArray = fromArray;
  function fromArrayToRef(array, offset, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] = array[index + offset];
    }
    _markAsUpdated(result);
  }
  Matrix2.fromArrayToRef = fromArrayToRef;
  function fromFloatArrayToRefScaled(array, offset, scale2, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] = array[index + offset] * scale2;
    }
    _markAsUpdated(result);
  }
  Matrix2.fromFloatArrayToRefScaled = fromFloatArrayToRefScaled;
  function fromValuesToRef(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44, result) {
    const m2 = result._m;
    m2[0] = initialM11;
    m2[1] = initialM12;
    m2[2] = initialM13;
    m2[3] = initialM14;
    m2[4] = initialM21;
    m2[5] = initialM22;
    m2[6] = initialM23;
    m2[7] = initialM24;
    m2[8] = initialM31;
    m2[9] = initialM32;
    m2[10] = initialM33;
    m2[11] = initialM34;
    m2[12] = initialM41;
    m2[13] = initialM42;
    m2[14] = initialM43;
    m2[15] = initialM44;
    _markAsUpdated(result);
  }
  Matrix2.fromValuesToRef = fromValuesToRef;
  function fromValues(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
    const result = create();
    const m2 = result._m;
    m2[0] = initialM11;
    m2[1] = initialM12;
    m2[2] = initialM13;
    m2[3] = initialM14;
    m2[4] = initialM21;
    m2[5] = initialM22;
    m2[6] = initialM23;
    m2[7] = initialM24;
    m2[8] = initialM31;
    m2[9] = initialM32;
    m2[10] = initialM33;
    m2[11] = initialM34;
    m2[12] = initialM41;
    m2[13] = initialM42;
    m2[14] = initialM43;
    m2[15] = initialM44;
    _markAsUpdated(result);
    return result;
  }
  Matrix2.fromValues = fromValues;
  function compose(scale2, rotation, translation2) {
    const result = create();
    composeToRef(scale2, rotation, translation2, result);
    return result;
  }
  Matrix2.compose = compose;
  function composeToRef(scale2, rotation, translation2, result) {
    const tmpMatrix = [create(), create(), create()];
    scalingToRef(scale2.x, scale2.y, scale2.z, tmpMatrix[1]);
    fromQuaternionToRef(rotation, tmpMatrix[0]);
    multiplyToRef(tmpMatrix[1], tmpMatrix[0], result);
    setTranslation(result, translation2);
  }
  Matrix2.composeToRef = composeToRef;
  function Identity() {
    const identity = fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    _updateIdentityStatus(identity, true);
    return identity;
  }
  Matrix2.Identity = Identity;
  function IdentityToRef(result) {
    fromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, result);
    _updateIdentityStatus(result, true);
  }
  Matrix2.IdentityToRef = IdentityToRef;
  function Zero() {
    const zero = fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    _updateIdentityStatus(zero, false);
    return zero;
  }
  Matrix2.Zero = Zero;
  function RotationX(angle) {
    const result = create();
    rotationXToRef(angle, result);
    return result;
  }
  Matrix2.RotationX = RotationX;
  function rotationXToRef(angle, result) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    fromValuesToRef(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, result);
    _updateIdentityStatus(result, c === 1 && s === 0);
  }
  Matrix2.rotationXToRef = rotationXToRef;
  function rotationY(angle) {
    const result = create();
    rotationYToRef(angle, result);
    return result;
  }
  Matrix2.rotationY = rotationY;
  function rotationYToRef(angle, result) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    fromValuesToRef(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1, result);
    _updateIdentityStatus(result, c === 1 && s === 0);
  }
  Matrix2.rotationYToRef = rotationYToRef;
  function rotationZ(angle) {
    const result = create();
    rotationZToRef(angle, result);
    return result;
  }
  Matrix2.rotationZ = rotationZ;
  function rotationZToRef(angle, result) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    fromValuesToRef(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, result);
    _updateIdentityStatus(result, c === 1 && s === 0);
  }
  Matrix2.rotationZToRef = rotationZToRef;
  function rotationAxis(axis, angle) {
    const result = create();
    rotationAxisToRef(axis, angle, result);
    return result;
  }
  Matrix2.rotationAxis = rotationAxis;
  function rotationAxisToRef(_axis, angle, result) {
    const s = Math.sin(-angle);
    const c = Math.cos(-angle);
    const c1 = 1 - c;
    const axis = Vector32.normalize(_axis);
    const m2 = result._m;
    m2[0] = axis.x * axis.x * c1 + c;
    m2[1] = axis.x * axis.y * c1 - axis.z * s;
    m2[2] = axis.x * axis.z * c1 + axis.y * s;
    m2[3] = 0;
    m2[4] = axis.y * axis.x * c1 + axis.z * s;
    m2[5] = axis.y * axis.y * c1 + c;
    m2[6] = axis.y * axis.z * c1 - axis.x * s;
    m2[7] = 0;
    m2[8] = axis.z * axis.x * c1 - axis.y * s;
    m2[9] = axis.z * axis.y * c1 + axis.x * s;
    m2[10] = axis.z * axis.z * c1 + c;
    m2[11] = 0;
    m2[12] = 0;
    m2[13] = 0;
    m2[14] = 0;
    m2[15] = 1;
    _markAsUpdated(result);
  }
  Matrix2.rotationAxisToRef = rotationAxisToRef;
  function rotationYawPitchRoll(yaw, pitch, roll) {
    const result = create();
    rotationYawPitchRollToRef(yaw, pitch, roll, result);
    return result;
  }
  Matrix2.rotationYawPitchRoll = rotationYawPitchRoll;
  function rotationYawPitchRollToRef(yaw, pitch, roll, result) {
    const quaternionResult = Quaternion2.Zero();
    Quaternion2.fromRotationYawPitchRollToRef(yaw, pitch, roll, quaternionResult);
    fromQuaternionToRef(quaternionResult, result);
  }
  Matrix2.rotationYawPitchRollToRef = rotationYawPitchRollToRef;
  function scaling(x, y, z) {
    const result = create();
    scalingToRef(x, y, z, result);
    return result;
  }
  Matrix2.scaling = scaling;
  function scalingToRef(x, y, z, result) {
    fromValuesToRef(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1, result);
    _updateIdentityStatus(result, x === 1 && y === 1 && z === 1);
  }
  Matrix2.scalingToRef = scalingToRef;
  function translation(x, y, z) {
    const result = create();
    translationToRef(x, y, z, result);
    return result;
  }
  Matrix2.translation = translation;
  function translationToRef(x, y, z, result) {
    fromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1, result);
    _updateIdentityStatus(result, x === 0 && y === 0 && z === 0);
  }
  Matrix2.translationToRef = translationToRef;
  function lerp(startValue, endValue, gradient) {
    const result = create();
    lerpToRef(startValue, endValue, gradient, result);
    return result;
  }
  Matrix2.lerp = lerp;
  function lerpToRef(startValue, endValue, gradient, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] = startValue._m[index] * (1 - gradient) + endValue._m[index] * gradient;
    }
    _markAsUpdated(result);
  }
  Matrix2.lerpToRef = lerpToRef;
  function decomposeLerp(startValue, endValue, gradient) {
    const result = create();
    decomposeLerpToRef(startValue, endValue, gradient, result);
    return result;
  }
  Matrix2.decomposeLerp = decomposeLerp;
  function decomposeLerpToRef(startValue, endValue, gradient, result) {
    const startScale = Vector32.Zero();
    const startRotation = Quaternion2.Zero();
    const startTranslation = Vector32.Zero();
    decompose(startValue, startScale, startRotation, startTranslation);
    const endScale = Vector32.Zero();
    const endRotation = Quaternion2.Zero();
    const endTranslation = Vector32.Zero();
    decompose(endValue, endScale, endRotation, endTranslation);
    const resultScale = Vector32.Zero();
    Vector32.lerpToRef(startScale, endScale, gradient, resultScale);
    const resultRotation = Quaternion2.Zero();
    Quaternion2.slerpToRef(startRotation, endRotation, gradient, resultRotation);
    const resultTranslation = Vector32.Zero();
    Vector32.lerpToRef(startTranslation, endTranslation, gradient, resultTranslation);
    composeToRef(resultScale, resultRotation, resultTranslation, result);
  }
  Matrix2.decomposeLerpToRef = decomposeLerpToRef;
  function LookAtLH(eye, target, up) {
    const result = create();
    lookAtLHToRef(eye, target, up, result);
    return result;
  }
  Matrix2.LookAtLH = LookAtLH;
  function lookAtLHToRef(eye, target, up, result) {
    const xAxis = Vector32.Zero();
    const yAxis = Vector32.Zero();
    const zAxis = Vector32.Zero();
    Vector32.subtractToRef(target, eye, zAxis);
    Vector32.normalizeToRef(zAxis, zAxis);
    Vector32.crossToRef(up, zAxis, xAxis);
    const xSquareLength = Vector32.lengthSquared(xAxis);
    if (xSquareLength === 0) {
      xAxis.x = 1;
    } else {
      Vector32.normalizeFromLengthToRef(xAxis, Math.sqrt(xSquareLength), xAxis);
    }
    Vector32.crossToRef(zAxis, xAxis, yAxis);
    Vector32.normalizeToRef(yAxis, yAxis);
    const ex = -Vector32.dot(xAxis, eye);
    const ey = -Vector32.dot(yAxis, eye);
    const ez = -Vector32.dot(zAxis, eye);
    fromValuesToRef(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1, result);
  }
  Matrix2.lookAtLHToRef = lookAtLHToRef;
  function lookAtRH(eye, target, up) {
    const result = create();
    lookAtRHToRef(eye, target, up, result);
    return result;
  }
  Matrix2.lookAtRH = lookAtRH;
  function lookAtRHToRef(eye, target, up, result) {
    const xAxis = Vector32.Zero();
    const yAxis = Vector32.Zero();
    const zAxis = Vector32.Zero();
    Vector32.subtractToRef(eye, target, zAxis);
    Vector32.normalizeToRef(zAxis, zAxis);
    Vector32.crossToRef(up, zAxis, xAxis);
    const xSquareLength = Vector32.lengthSquared(xAxis);
    if (xSquareLength === 0) {
      xAxis.x = 1;
    } else {
      Vector32.normalizeFromLengthToRef(xAxis, Math.sqrt(xSquareLength), xAxis);
    }
    Vector32.crossToRef(zAxis, xAxis, yAxis);
    Vector32.normalizeToRef(yAxis, yAxis);
    const ex = -Vector32.dot(xAxis, eye);
    const ey = -Vector32.dot(yAxis, eye);
    const ez = -Vector32.dot(zAxis, eye);
    fromValuesToRef(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1, result);
  }
  Matrix2.lookAtRHToRef = lookAtRHToRef;
  function orthoLH(width, height, znear, zfar) {
    const matrix = create();
    orthoLHToRef(width, height, znear, zfar, matrix);
    return matrix;
  }
  Matrix2.orthoLH = orthoLH;
  function orthoLHToRef(width, height, znear, zfar, result) {
    const n = znear;
    const f = zfar;
    const a = 2 / width;
    const b = 2 / height;
    const c = 2 / (f - n);
    const d = -(f + n) / (f - n);
    fromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, 0, 0, d, 1, result);
    _updateIdentityStatus(result, a === 1 && b === 1 && c === 1 && d === 0);
  }
  Matrix2.orthoLHToRef = orthoLHToRef;
  function OrthoOffCenterLH(left, right, bottom, top, znear, zfar) {
    const matrix = create();
    orthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, matrix);
    return matrix;
  }
  Matrix2.OrthoOffCenterLH = OrthoOffCenterLH;
  function orthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, result) {
    const n = znear;
    const f = zfar;
    const a = 2 / (right - left);
    const b = 2 / (top - bottom);
    const c = 2 / (f - n);
    const d = -(f + n) / (f - n);
    const i0 = (left + right) / (left - right);
    const i1 = (top + bottom) / (bottom - top);
    fromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, i0, i1, d, 1, result);
    _markAsUpdated(result);
  }
  Matrix2.orthoOffCenterLHToRef = orthoOffCenterLHToRef;
  function orthoOffCenterRH(left, right, bottom, top, znear, zfar) {
    const matrix = create();
    orthoOffCenterRHToRef(left, right, bottom, top, znear, zfar, matrix);
    return matrix;
  }
  Matrix2.orthoOffCenterRH = orthoOffCenterRH;
  function orthoOffCenterRHToRef(left, right, bottom, top, znear, zfar, result) {
    orthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, result);
    result._m[10] *= -1;
  }
  Matrix2.orthoOffCenterRHToRef = orthoOffCenterRHToRef;
  function perspectiveLH(width, height, znear, zfar) {
    const matrix = create();
    const n = znear;
    const f = zfar;
    const a = 2 * n / width;
    const b = 2 * n / height;
    const c = (f + n) / (f - n);
    const d = -2 * f * n / (f - n);
    fromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 1, 0, 0, d, 0, matrix);
    _updateIdentityStatus(matrix, false);
    return matrix;
  }
  Matrix2.perspectiveLH = perspectiveLH;
  function perspectiveFovLH(fov, aspect, znear, zfar) {
    const matrix = create();
    perspectiveFovLHToRef(fov, aspect, znear, zfar, matrix);
    return matrix;
  }
  Matrix2.perspectiveFovLH = perspectiveFovLH;
  function perspectiveFovLHToRef(fov, aspect, znear, zfar, result, isVerticalFovFixed = true) {
    const n = znear;
    const f = zfar;
    const t = 1 / Math.tan(fov * 0.5);
    const a = isVerticalFovFixed ? t / aspect : t;
    const b = isVerticalFovFixed ? t : t * aspect;
    const c = (f + n) / (f - n);
    const d = -2 * f * n / (f - n);
    fromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 1, 0, 0, d, 0, result);
    _updateIdentityStatus(result, false);
  }
  Matrix2.perspectiveFovLHToRef = perspectiveFovLHToRef;
  function PerspectiveFovRH(fov, aspect, znear, zfar) {
    const matrix = create();
    perspectiveFovRHToRef(fov, aspect, znear, zfar, matrix);
    return matrix;
  }
  Matrix2.PerspectiveFovRH = PerspectiveFovRH;
  function perspectiveFovRHToRef(fov, aspect, znear, zfar, result, isVerticalFovFixed = true) {
    const n = znear;
    const f = zfar;
    const t = 1 / Math.tan(fov * 0.5);
    const a = isVerticalFovFixed ? t / aspect : t;
    const b = isVerticalFovFixed ? t : t * aspect;
    const c = -(f + n) / (f - n);
    const d = -2 * f * n / (f - n);
    fromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, -1, 0, 0, d, 0, result);
    _updateIdentityStatus(result, false);
  }
  Matrix2.perspectiveFovRHToRef = perspectiveFovRHToRef;
  function perspectiveFovWebVRToRef(fov, znear, zfar, result, rightHanded = false) {
    const rightHandedFactor = rightHanded ? -1 : 1;
    const upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    const downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    const leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    const rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    const xScale = 2 / (leftTan + rightTan);
    const yScale = 2 / (upTan + downTan);
    const m2 = result._m;
    m2[0] = xScale;
    m2[1] = m2[2] = m2[3] = m2[4] = 0;
    m2[5] = yScale;
    m2[6] = m2[7] = 0;
    m2[8] = (leftTan - rightTan) * xScale * 0.5;
    m2[9] = -((upTan - downTan) * yScale * 0.5);
    m2[10] = -zfar / (znear - zfar);
    m2[11] = 1 * rightHandedFactor;
    m2[12] = m2[13] = m2[15] = 0;
    m2[14] = -(2 * zfar * znear) / (zfar - znear);
    _markAsUpdated(result);
  }
  Matrix2.perspectiveFovWebVRToRef = perspectiveFovWebVRToRef;
  function GetAsMatrix2x2(matrix) {
    return [matrix._m[0], matrix._m[1], matrix._m[4], matrix._m[5]];
  }
  Matrix2.GetAsMatrix2x2 = GetAsMatrix2x2;
  function GetAsMatrix3x3(matrix) {
    return [
      matrix._m[0],
      matrix._m[1],
      matrix._m[2],
      matrix._m[4],
      matrix._m[5],
      matrix._m[6],
      matrix._m[8],
      matrix._m[9],
      matrix._m[10]
    ];
  }
  Matrix2.GetAsMatrix3x3 = GetAsMatrix3x3;
  function transpose(matrix) {
    const result = create();
    transposeToRef(matrix, result);
    return result;
  }
  Matrix2.transpose = transpose;
  function transposeToRef(matrix, result) {
    const rm = result._m;
    const mm = matrix._m;
    rm[0] = mm[0];
    rm[1] = mm[4];
    rm[2] = mm[8];
    rm[3] = mm[12];
    rm[4] = mm[1];
    rm[5] = mm[5];
    rm[6] = mm[9];
    rm[7] = mm[13];
    rm[8] = mm[2];
    rm[9] = mm[6];
    rm[10] = mm[10];
    rm[11] = mm[14];
    rm[12] = mm[3];
    rm[13] = mm[7];
    rm[14] = mm[11];
    rm[15] = mm[15];
    _updateIdentityStatus(result, matrix.isIdentity, matrix._isIdentityDirty);
  }
  Matrix2.transposeToRef = transposeToRef;
  function reflection(plane) {
    const matrix = create();
    reflectionToRef(plane, matrix);
    return matrix;
  }
  Matrix2.reflection = reflection;
  function reflectionToRef(_plane, result) {
    const plane = Plane.normalize(_plane);
    const x = plane.normal.x;
    const y = plane.normal.y;
    const z = plane.normal.z;
    const temp = -2 * x;
    const temp2 = -2 * y;
    const temp3 = -2 * z;
    fromValuesToRef(temp * x + 1, temp2 * x, temp3 * x, 0, temp * y, temp2 * y + 1, temp3 * y, 0, temp * z, temp2 * z, temp3 * z + 1, 0, temp * plane.d, temp2 * plane.d, temp3 * plane.d, 1, result);
  }
  Matrix2.reflectionToRef = reflectionToRef;
  function fromXYZAxesToRef(xaxis, yaxis, zaxis, result) {
    fromValuesToRef(xaxis.x, xaxis.y, xaxis.z, 0, yaxis.x, yaxis.y, yaxis.z, 0, zaxis.x, zaxis.y, zaxis.z, 0, 0, 0, 0, 1, result);
  }
  Matrix2.fromXYZAxesToRef = fromXYZAxesToRef;
  function fromQuaternionToRef(quat, result) {
    const xx = quat.x * quat.x;
    const yy = quat.y * quat.y;
    const zz = quat.z * quat.z;
    const xy = quat.x * quat.y;
    const zw = quat.z * quat.w;
    const zx = quat.z * quat.x;
    const yw = quat.y * quat.w;
    const yz = quat.y * quat.z;
    const xw = quat.x * quat.w;
    result._m[0] = 1 - 2 * (yy + zz);
    result._m[1] = 2 * (xy + zw);
    result._m[2] = 2 * (zx - yw);
    result._m[3] = 0;
    result._m[4] = 2 * (xy - zw);
    result._m[5] = 1 - 2 * (zz + xx);
    result._m[6] = 2 * (yz + xw);
    result._m[7] = 0;
    result._m[8] = 2 * (zx + yw);
    result._m[9] = 2 * (yz - xw);
    result._m[10] = 1 - 2 * (yy + xx);
    result._m[11] = 0;
    result._m[12] = 0;
    result._m[13] = 0;
    result._m[14] = 0;
    result._m[15] = 1;
    _markAsUpdated(result);
  }
  Matrix2.fromQuaternionToRef = fromQuaternionToRef;
  function _markAsUpdated(self2) {
    self2.updateFlag = _updateFlagSeed++;
    self2.isIdentity = false;
    self2.isIdentity3x2 = false;
    self2._isIdentityDirty = true;
    self2._isIdentity3x2Dirty = true;
  }
  function isIdentityUpdate(self2) {
    if (self2._isIdentityDirty) {
      self2._isIdentityDirty = false;
      const m2 = self2._m;
      self2.isIdentity = m2[0] === 1 && m2[1] === 0 && m2[2] === 0 && m2[3] === 0 && m2[4] === 0 && m2[5] === 1 && m2[6] === 0 && m2[7] === 0 && m2[8] === 0 && m2[9] === 0 && m2[10] === 1 && m2[11] === 0 && m2[12] === 0 && m2[13] === 0 && m2[14] === 0 && m2[15] === 1;
    }
    return self2.isIdentity;
  }
  Matrix2.isIdentityUpdate = isIdentityUpdate;
  function isIdentityAs3x2Update(self2) {
    if (self2._isIdentity3x2Dirty) {
      self2._isIdentity3x2Dirty = false;
      if (self2._m[0] !== 1 || self2._m[5] !== 1 || self2._m[15] !== 1) {
        self2.isIdentity3x2 = false;
      } else if (self2._m[1] !== 0 || self2._m[2] !== 0 || self2._m[3] !== 0 || self2._m[4] !== 0 || self2._m[6] !== 0 || self2._m[7] !== 0 || self2._m[8] !== 0 || self2._m[9] !== 0 || self2._m[10] !== 0 || self2._m[11] !== 0 || self2._m[12] !== 0 || self2._m[13] !== 0 || self2._m[14] !== 0) {
        self2.isIdentity3x2 = false;
      } else {
        self2.isIdentity3x2 = true;
      }
    }
    return self2.isIdentity3x2;
  }
  Matrix2.isIdentityAs3x2Update = isIdentityAs3x2Update;
  function determinant(self2) {
    if (self2.isIdentity === true) {
      return 1;
    }
    const m2 = self2._m;
    const m00 = m2[0], m01 = m2[1], m02 = m2[2], m03 = m2[3];
    const m10 = m2[4], m11 = m2[5], m12 = m2[6], m13 = m2[7];
    const m20 = m2[8], m21 = m2[9], m22 = m2[10], m23 = m2[11];
    const m30 = m2[12], m31 = m2[13], m32 = m2[14], m33 = m2[15];
    const det_22_33 = m22 * m33 - m32 * m23;
    const det_21_33 = m21 * m33 - m31 * m23;
    const det_21_32 = m21 * m32 - m31 * m22;
    const det_20_33 = m20 * m33 - m30 * m23;
    const det_20_32 = m20 * m32 - m22 * m30;
    const det_20_31 = m20 * m31 - m30 * m21;
    const cofact_00 = +(m11 * det_22_33 - m12 * det_21_33 + m13 * det_21_32);
    const cofact_01 = -(m10 * det_22_33 - m12 * det_20_33 + m13 * det_20_32);
    const cofact_02 = +(m10 * det_21_33 - m11 * det_20_33 + m13 * det_20_31);
    const cofact_03 = -(m10 * det_21_32 - m11 * det_20_32 + m12 * det_20_31);
    return m00 * cofact_00 + m01 * cofact_01 + m02 * cofact_02 + m03 * cofact_03;
  }
  Matrix2.determinant = determinant;
  function toArray(self2) {
    return self2._m;
  }
  Matrix2.toArray = toArray;
  function asArray(self2) {
    return self2._m;
  }
  Matrix2.asArray = asArray;
  function reset(self2) {
    fromValuesToRef(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, self2);
    _updateIdentityStatus(self2, false);
  }
  Matrix2.reset = reset;
  function add2(self2, other) {
    const result = create();
    addToRef(self2, other, result);
    return result;
  }
  Matrix2.add = add2;
  function addToRef(self2, other, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] = self2._m[index] + other._m[index];
    }
    _markAsUpdated(result);
  }
  Matrix2.addToRef = addToRef;
  function addToSelf(self2, other) {
    for (let index = 0; index < 16; index++) {
      self2._m[index] += other._m[index];
    }
    _markAsUpdated(self2);
  }
  Matrix2.addToSelf = addToSelf;
  function invert(source) {
    const result = create();
    invertToRef(source, result);
    return result;
  }
  Matrix2.invert = invert;
  function invertToRef(source, result) {
    if (source.isIdentity === true) {
      copy(source, result);
      return;
    }
    const m2 = source._m;
    const m00 = m2[0], m01 = m2[1], m02 = m2[2], m03 = m2[3];
    const m10 = m2[4], m11 = m2[5], m12 = m2[6], m13 = m2[7];
    const m20 = m2[8], m21 = m2[9], m22 = m2[10], m23 = m2[11];
    const m30 = m2[12], m31 = m2[13], m32 = m2[14], m33 = m2[15];
    const det_22_33 = m22 * m33 - m32 * m23;
    const det_21_33 = m21 * m33 - m31 * m23;
    const det_21_32 = m21 * m32 - m31 * m22;
    const det_20_33 = m20 * m33 - m30 * m23;
    const det_20_32 = m20 * m32 - m22 * m30;
    const det_20_31 = m20 * m31 - m30 * m21;
    const cofact_00 = +(m11 * det_22_33 - m12 * det_21_33 + m13 * det_21_32);
    const cofact_01 = -(m10 * det_22_33 - m12 * det_20_33 + m13 * det_20_32);
    const cofact_02 = +(m10 * det_21_33 - m11 * det_20_33 + m13 * det_20_31);
    const cofact_03 = -(m10 * det_21_32 - m11 * det_20_32 + m12 * det_20_31);
    const det = m00 * cofact_00 + m01 * cofact_01 + m02 * cofact_02 + m03 * cofact_03;
    if (det === 0) {
      copy(source, result);
      return;
    }
    const detInv = 1 / det;
    const det_12_33 = m12 * m33 - m32 * m13;
    const det_11_33 = m11 * m33 - m31 * m13;
    const det_11_32 = m11 * m32 - m31 * m12;
    const det_10_33 = m10 * m33 - m30 * m13;
    const det_10_32 = m10 * m32 - m30 * m12;
    const det_10_31 = m10 * m31 - m30 * m11;
    const det_12_23 = m12 * m23 - m22 * m13;
    const det_11_23 = m11 * m23 - m21 * m13;
    const det_11_22 = m11 * m22 - m21 * m12;
    const det_10_23 = m10 * m23 - m20 * m13;
    const det_10_22 = m10 * m22 - m20 * m12;
    const det_10_21 = m10 * m21 - m20 * m11;
    const cofact_10 = -(m01 * det_22_33 - m02 * det_21_33 + m03 * det_21_32);
    const cofact_11 = +(m00 * det_22_33 - m02 * det_20_33 + m03 * det_20_32);
    const cofact_12 = -(m00 * det_21_33 - m01 * det_20_33 + m03 * det_20_31);
    const cofact_13 = +(m00 * det_21_32 - m01 * det_20_32 + m02 * det_20_31);
    const cofact_20 = +(m01 * det_12_33 - m02 * det_11_33 + m03 * det_11_32);
    const cofact_21 = -(m00 * det_12_33 - m02 * det_10_33 + m03 * det_10_32);
    const cofact_22 = +(m00 * det_11_33 - m01 * det_10_33 + m03 * det_10_31);
    const cofact_23 = -(m00 * det_11_32 - m01 * det_10_32 + m02 * det_10_31);
    const cofact_30 = -(m01 * det_12_23 - m02 * det_11_23 + m03 * det_11_22);
    const cofact_31 = +(m00 * det_12_23 - m02 * det_10_23 + m03 * det_10_22);
    const cofact_32 = -(m00 * det_11_23 - m01 * det_10_23 + m03 * det_10_21);
    const cofact_33 = +(m00 * det_11_22 - m01 * det_10_22 + m02 * det_10_21);
    fromValuesToRef(cofact_00 * detInv, cofact_10 * detInv, cofact_20 * detInv, cofact_30 * detInv, cofact_01 * detInv, cofact_11 * detInv, cofact_21 * detInv, cofact_31 * detInv, cofact_02 * detInv, cofact_12 * detInv, cofact_22 * detInv, cofact_32 * detInv, cofact_03 * detInv, cofact_13 * detInv, cofact_23 * detInv, cofact_33 * detInv, result);
  }
  Matrix2.invertToRef = invertToRef;
  function addAtIndex(self2, index, value) {
    self2._m[index] += value;
    _markAsUpdated(self2);
  }
  Matrix2.addAtIndex = addAtIndex;
  function multiplyAtIndex(self2, index, value) {
    self2._m[index] *= value;
    _markAsUpdated(self2);
    return self2;
  }
  Matrix2.multiplyAtIndex = multiplyAtIndex;
  function setTranslationFromFloats(self2, x, y, z) {
    self2._m[12] = x;
    self2._m[13] = y;
    self2._m[14] = z;
    _markAsUpdated(self2);
  }
  Matrix2.setTranslationFromFloats = setTranslationFromFloats;
  function setTranslation(self2, vector3) {
    setTranslationFromFloats(self2, vector3.x, vector3.y, vector3.z);
  }
  Matrix2.setTranslation = setTranslation;
  function getTranslation(self2) {
    return Vector32.create(self2._m[12], self2._m[13], self2._m[14]);
  }
  Matrix2.getTranslation = getTranslation;
  function getTranslationToRef(self2, result) {
    result.x = self2._m[12];
    result.y = self2._m[13];
    result.z = self2._m[14];
  }
  Matrix2.getTranslationToRef = getTranslationToRef;
  function removeRotationAndScaling(self2) {
    const m2 = self2._m;
    fromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, m2[12], m2[13], m2[14], m2[15], self2);
    _updateIdentityStatus(self2, m2[12] === 0 && m2[13] === 0 && m2[14] === 0 && m2[15] === 1);
    return self2;
  }
  Matrix2.removeRotationAndScaling = removeRotationAndScaling;
  function multiply2(self2, other) {
    const result = create();
    multiplyToRef(self2, other, result);
    return result;
  }
  Matrix2.multiply = multiply2;
  function copy(from, dest) {
    copyToArray(from, dest._m);
    _updateIdentityStatus(dest, from.isIdentity, from._isIdentityDirty, from.isIdentity3x2, from._isIdentity3x2Dirty);
  }
  Matrix2.copy = copy;
  function copyToArray(self2, arrayDest, offsetDest = 0) {
    for (let index = 0; index < 16; index++) {
      arrayDest[offsetDest + index] = self2._m[index];
    }
  }
  Matrix2.copyToArray = copyToArray;
  function multiplyToRef(self2, other, result) {
    if (self2.isIdentity) {
      copy(other, result);
      return;
    }
    if (other.isIdentity) {
      copy(self2, result);
      return;
    }
    multiplyToArray(self2, other, result._m, 0);
    _markAsUpdated(result);
  }
  Matrix2.multiplyToRef = multiplyToRef;
  function multiplyToArray(self2, other, result, offset) {
    const m2 = self2._m;
    const otherM = other._m;
    const tm0 = m2[0], tm1 = m2[1], tm2 = m2[2], tm3 = m2[3];
    const tm4 = m2[4], tm5 = m2[5], tm6 = m2[6], tm7 = m2[7];
    const tm8 = m2[8], tm9 = m2[9], tm10 = m2[10], tm11 = m2[11];
    const tm12 = m2[12], tm13 = m2[13], tm14 = m2[14], tm15 = m2[15];
    const om0 = otherM[0], om1 = otherM[1], om2 = otherM[2], om3 = otherM[3];
    const om4 = otherM[4], om5 = otherM[5], om6 = otherM[6], om7 = otherM[7];
    const om8 = otherM[8], om9 = otherM[9], om10 = otherM[10], om11 = otherM[11];
    const om12 = otherM[12], om13 = otherM[13], om14 = otherM[14], om15 = otherM[15];
    result[offset] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
    result[offset + 1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
    result[offset + 2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
    result[offset + 3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;
    result[offset + 4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
    result[offset + 5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
    result[offset + 6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
    result[offset + 7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;
    result[offset + 8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
    result[offset + 9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
    result[offset + 10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
    result[offset + 11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;
    result[offset + 12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
    result[offset + 13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
    result[offset + 14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
    result[offset + 15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
  }
  Matrix2.multiplyToArray = multiplyToArray;
  function equals2(self2, value) {
    const other = value;
    if (!other) {
      return false;
    }
    if (self2.isIdentity || other.isIdentity) {
      if (!self2._isIdentityDirty && !other._isIdentityDirty) {
        return self2.isIdentity && other.isIdentity;
      }
    }
    const m2 = self2._m;
    const om = other._m;
    return m2[0] === om[0] && m2[1] === om[1] && m2[2] === om[2] && m2[3] === om[3] && m2[4] === om[4] && m2[5] === om[5] && m2[6] === om[6] && m2[7] === om[7] && m2[8] === om[8] && m2[9] === om[9] && m2[10] === om[10] && m2[11] === om[11] && m2[12] === om[12] && m2[13] === om[13] && m2[14] === om[14] && m2[15] === om[15];
  }
  Matrix2.equals = equals2;
  function clone(self2) {
    const result = create();
    copy(self2, result);
    return result;
  }
  Matrix2.clone = clone;
  function getHashCode(self2) {
    let hash = self2._m[0] || 0;
    for (let i = 1; i < 16; i++) {
      hash = hash * 397 ^ (self2._m[i] || 0);
    }
    return hash;
  }
  Matrix2.getHashCode = getHashCode;
  function decompose(self2, scale2, rotation, translation2) {
    if (self2.isIdentity) {
      if (translation2) {
        translation2.x = 0;
        translation2.y = 0;
        translation2.z = 0;
      }
      if (scale2) {
        scale2.x = 1;
        scale2.y = 1;
        scale2.z = 1;
      }
      if (rotation) {
        rotation.w = 1;
        rotation.x = 0;
        rotation.y = 0;
        rotation.z = 0;
      }
      return true;
    }
    const m2 = self2._m;
    if (translation2) {
      translation2.x = m2[12];
      translation2.y = m2[13];
      translation2.z = m2[14];
    }
    const usedScale = scale2 || Vector32.Zero();
    usedScale.x = Math.sqrt(m2[0] * m2[0] + m2[1] * m2[1] + m2[2] * m2[2]);
    usedScale.y = Math.sqrt(m2[4] * m2[4] + m2[5] * m2[5] + m2[6] * m2[6]);
    usedScale.z = Math.sqrt(m2[8] * m2[8] + m2[9] * m2[9] + m2[10] * m2[10]);
    if (determinant(self2) <= 0) {
      usedScale.y *= -1;
    }
    if (usedScale.x === 0 || usedScale.y === 0 || usedScale.z === 0) {
      if (rotation) {
        rotation.w = 1;
        rotation.x = 0;
        rotation.y = 0;
        rotation.z = 0;
      }
      return false;
    }
    if (rotation) {
      const sx = 1 / usedScale.x, sy = 1 / usedScale.y, sz = 1 / usedScale.z;
      const tmpMatrix = create();
      fromValuesToRef(m2[0] * sx, m2[1] * sx, m2[2] * sx, 0, m2[4] * sy, m2[5] * sy, m2[6] * sy, 0, m2[8] * sz, m2[9] * sz, m2[10] * sz, 0, 0, 0, 0, 1, tmpMatrix);
      Quaternion2.fromRotationMatrixToRef(tmpMatrix, rotation);
    }
    return true;
  }
  Matrix2.decompose = decompose;
  function setRowFromFloats(self2, index, x, y, z, w) {
    if (index < 0 || index > 3) {
      return;
    }
    const i = index * 4;
    self2._m[i + 0] = x;
    self2._m[i + 1] = y;
    self2._m[i + 2] = z;
    self2._m[i + 3] = w;
    _markAsUpdated(self2);
  }
  Matrix2.setRowFromFloats = setRowFromFloats;
  function scale(self2, scale2) {
    const result = create();
    scaleToRef(self2, scale2, result);
    return result;
  }
  Matrix2.scale = scale;
  function scaleToRef(self2, scale2, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] = self2._m[index] * scale2;
    }
    _markAsUpdated(result);
  }
  Matrix2.scaleToRef = scaleToRef;
  function scaleAndAddToRef(self2, scale2, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] += self2._m[index] * scale2;
    }
    _markAsUpdated(result);
  }
  Matrix2.scaleAndAddToRef = scaleAndAddToRef;
  function normalMatrixToRef(self2, ref) {
    const tmp = create();
    invertToRef(self2, tmp);
    transposeToRef(tmp, ref);
    const m2 = ref._m;
    fromValuesToRef(m2[0], m2[1], m2[2], 0, m2[4], m2[5], m2[6], 0, m2[8], m2[9], m2[10], 0, 0, 0, 0, 1, ref);
  }
  Matrix2.normalMatrixToRef = normalMatrixToRef;
  function getRotationMatrix(self2) {
    const result = create();
    getRotationMatrixToRef(self2, result);
    return result;
  }
  Matrix2.getRotationMatrix = getRotationMatrix;
  function getRotationMatrixToRef(self2, result) {
    const scale2 = Vector32.Zero();
    if (!decompose(self2, scale2)) {
      result = Identity();
      return;
    }
    const m2 = self2._m;
    const sx = 1 / scale2.x, sy = 1 / scale2.y, sz = 1 / scale2.z;
    fromValuesToRef(m2[0] * sx, m2[1] * sx, m2[2] * sx, 0, m2[4] * sy, m2[5] * sy, m2[6] * sy, 0, m2[8] * sz, m2[9] * sz, m2[10] * sz, 0, 0, 0, 0, 1, result);
  }
  Matrix2.getRotationMatrixToRef = getRotationMatrixToRef;
  function toggleModelMatrixHandInPlace(self2) {
    self2._m[2] *= -1;
    self2._m[6] *= -1;
    self2._m[8] *= -1;
    self2._m[9] *= -1;
    self2._m[14] *= -1;
    _markAsUpdated(self2);
  }
  Matrix2.toggleModelMatrixHandInPlace = toggleModelMatrixHandInPlace;
  function toggleProjectionMatrixHandInPlace(self2) {
    self2._m[8] *= -1;
    self2._m[9] *= -1;
    self2._m[10] *= -1;
    self2._m[11] *= -1;
    _markAsUpdated(self2);
  }
  Matrix2.toggleProjectionMatrixHandInPlace = toggleProjectionMatrixHandInPlace;
  function _updateIdentityStatus(self2, isIdentity, isIdentityDirty = false, isIdentity3x2 = false, isIdentity3x2Dirty = true) {
    self2.updateFlag = _updateFlagSeed++;
    self2.isIdentity = isIdentity;
    self2.isIdentity3x2 = isIdentity || isIdentity3x2;
    self2._isIdentityDirty = self2.isIdentity ? false : isIdentityDirty;
    self2._isIdentity3x2Dirty = self2.isIdentity3x2 ? false : isIdentity3x2Dirty;
  }
})(Matrix || (Matrix = {}));

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/Quaternion.js
var Quaternion2;
(function(Quaternion3) {
  function create(x = 0, y = 0, z = 0, w = 1) {
    return { x, y, z, w };
  }
  Quaternion3.create = create;
  function add2(q1, q2) {
    return { x: q1.x + q2.x, y: q1.y + q2.y, z: q1.z + q2.z, w: q1.w + q2.w };
  }
  Quaternion3.add = add2;
  function fromRotationYawPitchRoll(yaw, pitch, roll) {
    const halfPitch = pitch * 0.5;
    const halfYaw = yaw * 0.5;
    const halfRoll = roll * 0.5;
    const c1 = Math.cos(halfPitch);
    const c2 = Math.cos(halfYaw);
    const c3 = Math.cos(halfRoll);
    const s1 = Math.sin(halfPitch);
    const s2 = Math.sin(halfYaw);
    const s3 = Math.sin(halfRoll);
    return create(c2 * s1 * c3 + s2 * c1 * s3, s2 * c1 * c3 - c2 * s1 * s3, c2 * c1 * s3 - s2 * s1 * c3, c2 * c1 * c3 + s2 * s1 * s3);
  }
  Quaternion3.fromRotationYawPitchRoll = fromRotationYawPitchRoll;
  function fromEulerDegrees(x, y, z) {
    return fromRotationYawPitchRoll(y * DEG2RAD, x * DEG2RAD, z * DEG2RAD);
  }
  Quaternion3.fromEulerDegrees = fromEulerDegrees;
  function length2(q) {
    return Math.sqrt(lengthSquared(q));
  }
  Quaternion3.length = length2;
  function lengthSquared(q) {
    return q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
  }
  Quaternion3.lengthSquared = lengthSquared;
  function dot(left, right) {
    return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
  }
  Quaternion3.dot = dot;
  function angle(quat1, quat2) {
    const dotVal = dot(quat1, quat2);
    return Math.acos(Math.min(Math.abs(dotVal), 1)) * 2 * RAD2DEG;
  }
  Quaternion3.angle = angle;
  function rotateTowards(from, to, maxDegreesDelta) {
    const num = angle(from, to);
    if (num === 0) {
      return to;
    }
    const t = Math.min(1, maxDegreesDelta / num);
    return slerp(from, to, t);
  }
  Quaternion3.rotateTowards = rotateTowards;
  function lookRotation(forward, up = { x: 0, y: 1, z: 0 }) {
    const forwardNew = Vector32.normalize(forward);
    const right = Vector32.normalize(Vector32.cross(up, forwardNew));
    const upNew = Vector32.cross(forwardNew, right);
    const m00 = right.x;
    const m01 = right.y;
    const m02 = right.z;
    const m10 = upNew.x;
    const m11 = upNew.y;
    const m12 = upNew.z;
    const m20 = forwardNew.x;
    const m21 = forwardNew.y;
    const m22 = forwardNew.z;
    const num8 = m00 + m11 + m22;
    const quaternion = create();
    if (num8 > 0) {
      let num = Math.sqrt(num8 + 1);
      quaternion.w = num * 0.5;
      num = 0.5 / num;
      quaternion.x = (m12 - m21) * num;
      quaternion.y = (m20 - m02) * num;
      quaternion.z = (m01 - m10) * num;
      return quaternion;
    }
    if (m00 >= m11 && m00 >= m22) {
      const num7 = Math.sqrt(1 + m00 - m11 - m22);
      const num4 = 0.5 / num7;
      quaternion.x = 0.5 * num7;
      quaternion.y = (m01 + m10) * num4;
      quaternion.z = (m02 + m20) * num4;
      quaternion.w = (m12 - m21) * num4;
      return quaternion;
    }
    if (m11 > m22) {
      const num6 = Math.sqrt(1 + m11 - m00 - m22);
      const num3 = 0.5 / num6;
      quaternion.x = (m10 + m01) * num3;
      quaternion.y = 0.5 * num6;
      quaternion.z = (m21 + m12) * num3;
      quaternion.w = (m20 - m02) * num3;
      return quaternion;
    }
    const num5 = Math.sqrt(1 + m22 - m00 - m11);
    const num2 = 0.5 / num5;
    quaternion.x = (m20 + m02) * num2;
    quaternion.y = (m21 + m12) * num2;
    quaternion.z = 0.5 * num5;
    quaternion.w = (m01 - m10) * num2;
    return quaternion;
  }
  Quaternion3.lookRotation = lookRotation;
  function normalize(q) {
    const qLength = 1 / length2(q);
    return create(q.x * qLength, q.y * qLength, q.z * qLength, q.w * qLength);
  }
  Quaternion3.normalize = normalize;
  function fromToRotation(from, to, up = Vector32.Up()) {
    const v0 = Vector32.normalize(from);
    const v1 = Vector32.normalize(to);
    const a = Vector32.cross(v0, v1);
    const w = Math.sqrt(Vector32.lengthSquared(v0) * Vector32.lengthSquared(v1)) + Vector32.dot(v0, v1);
    if (Vector32.lengthSquared(a) < 1e-4) {
      return Math.abs(w) < 1e-4 ? normalize(create(up.x, up.y, up.z, 0)) : Identity();
    } else {
      return normalize(create(a.x, a.y, a.z, w));
    }
  }
  Quaternion3.fromToRotation = fromToRotation;
  function Identity() {
    return create(0, 0, 0, 1);
  }
  Quaternion3.Identity = Identity;
  function toEulerAngles(q) {
    const out = Vector32.create();
    const unit = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
    const test = q.x * q.w - q.y * q.z;
    if (test > 0.4995 * unit) {
      out.x = Math.PI / 2;
      out.y = 2 * Math.atan2(q.y, q.x);
      out.z = 0;
    } else if (test < -0.4995 * unit) {
      out.x = -Math.PI / 2;
      out.y = -2 * Math.atan2(q.y, q.x);
      out.z = 0;
    } else {
      out.x = Math.asin(2 * (q.w * q.x - q.y * q.z));
      out.y = Math.atan2(2 * q.w * q.y + 2 * q.z * q.x, 1 - 2 * (q.x * q.x + q.y * q.y));
      out.z = Math.atan2(2 * q.w * q.z + 2 * q.x * q.y, 1 - 2 * (q.z * q.z + q.x * q.x));
    }
    out.x *= RAD2DEG;
    out.y *= RAD2DEG;
    out.z *= RAD2DEG;
    out.x = Scalar.repeat(out.x, 360);
    out.y = Scalar.repeat(out.y, 360);
    out.z = Scalar.repeat(out.z, 360);
    return out;
  }
  Quaternion3.toEulerAngles = toEulerAngles;
  function fromRotationYawPitchRollToRef(yaw, pitch, roll, result) {
    const halfPitch = pitch * 0.5;
    const halfYaw = yaw * 0.5;
    const halfRoll = roll * 0.5;
    const c1 = Math.cos(halfPitch);
    const c2 = Math.cos(halfYaw);
    const c3 = Math.cos(halfRoll);
    const s1 = Math.sin(halfPitch);
    const s2 = Math.sin(halfYaw);
    const s3 = Math.sin(halfRoll);
    result.x = c2 * s1 * c3 + s2 * c1 * s3;
    result.y = s2 * c1 * c3 - c2 * s1 * s3;
    result.z = c2 * c1 * s3 - s2 * s1 * c3;
    result.w = c2 * c1 * c3 + s2 * s1 * s3;
  }
  Quaternion3.fromRotationYawPitchRollToRef = fromRotationYawPitchRollToRef;
  function fromRotationMatrixToRef(matrix, result) {
    const data = matrix._m;
    const m11 = data[0], m12 = data[4], m13 = data[8];
    const m21 = data[1], m22 = data[5], m23 = data[9];
    const m31 = data[2], m32 = data[6], m33 = data[10];
    const trace = m11 + m22 + m33;
    let s;
    if (trace > 0) {
      s = 0.5 / Math.sqrt(trace + 1);
      result.w = 0.25 / s;
      result.x = (m32 - m23) * s;
      result.y = (m13 - m31) * s;
      result.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      result.w = (m32 - m23) / s;
      result.x = 0.25 * s;
      result.y = (m12 + m21) / s;
      result.z = (m13 + m31) / s;
    } else if (m22 > m33) {
      s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      result.w = (m13 - m31) / s;
      result.x = (m12 + m21) / s;
      result.y = 0.25 * s;
      result.z = (m23 + m32) / s;
    } else {
      s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      result.w = (m21 - m12) / s;
      result.x = (m13 + m31) / s;
      result.y = (m23 + m32) / s;
      result.z = 0.25 * s;
    }
  }
  Quaternion3.fromRotationMatrixToRef = fromRotationMatrixToRef;
  function slerp(left, right, amount) {
    const result = Quaternion3.Identity();
    Quaternion3.slerpToRef(left, right, amount, result);
    return result;
  }
  Quaternion3.slerp = slerp;
  function slerpToRef(left, right, amount, result) {
    let num2;
    let num3;
    let num4 = left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
    let flag = false;
    if (num4 < 0) {
      flag = true;
      num4 = -num4;
    }
    if (num4 > 0.999999) {
      num3 = 1 - amount;
      num2 = flag ? -amount : amount;
    } else {
      const num5 = Math.acos(num4);
      const num6 = 1 / Math.sin(num5);
      num3 = Math.sin((1 - amount) * num5) * num6;
      num2 = flag ? -Math.sin(amount * num5) * num6 : Math.sin(amount * num5) * num6;
    }
    result.x = num3 * left.x + num2 * right.x;
    result.y = num3 * left.y + num2 * right.y;
    result.z = num3 * left.z + num2 * right.z;
    result.w = num3 * left.w + num2 * right.w;
  }
  Quaternion3.slerpToRef = slerpToRef;
  function multiply2(self2, q1) {
    const result = create(0, 0, 0, 1);
    multiplyToRef(self2, q1, result);
    return result;
  }
  Quaternion3.multiply = multiply2;
  function multiplyToRef(self2, q1, result) {
    result.x = self2.x * q1.w + self2.y * q1.z - self2.z * q1.y + self2.w * q1.x;
    result.y = -self2.x * q1.z + self2.y * q1.w + self2.z * q1.x + self2.w * q1.y;
    result.z = self2.x * q1.y - self2.y * q1.x + self2.z * q1.w + self2.w * q1.z;
    result.w = -self2.x * q1.x - self2.y * q1.y - self2.z * q1.z + self2.w * q1.w;
  }
  Quaternion3.multiplyToRef = multiplyToRef;
  function fromAngleAxis(degrees, axis) {
    if (Vector32.lengthSquared(axis) === 0) {
      return Quaternion3.Identity();
    }
    const result = Identity();
    let radians = degrees * DEG2RAD;
    radians *= 0.5;
    const a2 = Vector32.normalize(axis);
    Vector32.scaleToRef(a2, Math.sin(radians), a2);
    result.x = a2.x;
    result.y = a2.y;
    result.z = a2.z;
    result.w = Math.cos(radians);
    return normalize(result);
  }
  Quaternion3.fromAngleAxis = fromAngleAxis;
  function fromAxisToRotationQuaternion(axis1, axis2, axis3) {
    const quat = Quaternion3.create(0, 0, 0, 0);
    fromAxisToRotationQuaternionToRef(axis1, axis2, axis3, quat);
    return quat;
  }
  Quaternion3.fromAxisToRotationQuaternion = fromAxisToRotationQuaternion;
  function fromAxisToRotationQuaternionToRef(axis1, axis2, axis3, ref) {
    const rotMat = Matrix.create();
    Matrix.fromXYZAxesToRef(Vector32.normalize(axis1), Vector32.normalize(axis2), Vector32.normalize(axis3), rotMat);
    Quaternion3.fromRotationMatrixToRef(rotMat, ref);
  }
  Quaternion3.fromAxisToRotationQuaternionToRef = fromAxisToRotationQuaternionToRef;
  function Zero() {
    return create(0, 0, 0, 0);
  }
  Quaternion3.Zero = Zero;
  function fromLookAt(position, target, worldUp = Vector32.Up()) {
    const result = Quaternion3.Identity();
    fromLookAtToRef(position, target, worldUp, result);
    return result;
  }
  Quaternion3.fromLookAt = fromLookAt;
  function fromLookAtToRef(position, target, worldUp = Vector32.Up(), result) {
    const m = Matrix.Identity();
    Matrix.lookAtLHToRef(position, target, worldUp, m);
    Matrix.invertToRef(m, m);
    Quaternion3.fromRotationMatrixToRef(m, result);
  }
  Quaternion3.fromLookAtToRef = fromLookAtToRef;
})(Quaternion2 || (Quaternion2 = {}));

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/Vector2.js
var Vector22;
(function(Vector23) {
  function create(x = 0, y = 0) {
    return { x, y };
  }
  Vector23.create = create;
  function Zero() {
    return create(0, 0);
  }
  Vector23.Zero = Zero;
  function One() {
    return create(1, 1);
  }
  Vector23.One = One;
})(Vector22 || (Vector22 = {}));

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/Color4.js
var Color42;
(function(Color43) {
  function create(r = 0, g = 0, b = 0, a = 1) {
    return { r, g, b, a };
  }
  Color43.create = create;
  function fromHexString(hex) {
    if (hex.substring(0, 1) !== "#" || hex.length !== 7 && hex.length !== 9) {
      return create(0, 0, 0, 1);
    }
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const aStr = hex.substring(7, 9);
    const a = aStr ? parseInt(aStr, 16) : 255;
    return Color43.fromInts(r, g, b, a);
  }
  Color43.fromHexString = fromHexString;
  function lerp(left, right, amount) {
    const result = create(0, 0, 0, 0);
    Color43.lerpToRef(left, right, amount, result);
    return result;
  }
  Color43.lerp = lerp;
  function lerpToRef(left, right, amount, result) {
    result.r = left.r + (right.r - left.r) * amount;
    result.g = left.g + (right.g - left.g) * amount;
    result.b = left.b + (right.b - left.b) * amount;
    result.a = left.a + (right.a - left.a) * amount;
  }
  Color43.lerpToRef = lerpToRef;
  function Red() {
    return create(1, 0, 0, 1);
  }
  Color43.Red = Red;
  function Green() {
    return create(0, 1, 0, 1);
  }
  Color43.Green = Green;
  function Blue() {
    return create(0, 0, 1, 1);
  }
  Color43.Blue = Blue;
  function Black() {
    return create(0, 0, 0, 1);
  }
  Color43.Black = Black;
  function White() {
    return create(1, 1, 1, 1);
  }
  Color43.White = White;
  function Purple() {
    return create(0.5, 0, 0.5, 1);
  }
  Color43.Purple = Purple;
  function Magenta() {
    return create(1, 0, 1, 1);
  }
  Color43.Magenta = Magenta;
  function Yellow() {
    return create(1, 1, 0, 1);
  }
  Color43.Yellow = Yellow;
  function Gray() {
    return create(0.5, 0.5, 0.5, 1);
  }
  Color43.Gray = Gray;
  function Teal() {
    return create(0, 1, 1, 1);
  }
  Color43.Teal = Teal;
  function Clear() {
    return create(0, 0, 0, 0);
  }
  Color43.Clear = Clear;
  function fromColor3(color3, alpha = 1) {
    return create(color3.r, color3.g, color3.b, alpha);
  }
  Color43.fromColor3 = fromColor3;
  function fromArray(array, offset = 0) {
    return create(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
  }
  Color43.fromArray = fromArray;
  function fromInts(r, g, b, a) {
    return create(r / 255, g / 255, b / 255, a / 255);
  }
  Color43.fromInts = fromInts;
  function checkColors4(colors, count) {
    if (colors.length === count * 3) {
      const colors4 = [];
      for (let index = 0; index < colors.length; index += 3) {
        const newIndex = index / 3 * 4;
        colors4[newIndex] = colors[index];
        colors4[newIndex + 1] = colors[index + 1];
        colors4[newIndex + 2] = colors[index + 2];
        colors4[newIndex + 3] = 1;
      }
      return colors4;
    }
    return colors;
  }
  Color43.checkColors4 = checkColors4;
  function addToRef(a, b, ref) {
    ref.r = a.r + b.r;
    ref.g = a.g + b.g;
    ref.b = a.b + b.b;
    ref.a = a.a + b.a;
  }
  Color43.addToRef = addToRef;
  function toArray(value, array, index = 0) {
    array[index] = value.r;
    array[index + 1] = value.g;
    array[index + 2] = value.b;
    array[index + 3] = value.a;
  }
  Color43.toArray = toArray;
  function add2(value, right) {
    const ret = Clear();
    addToRef(value, right, ret);
    return ret;
  }
  Color43.add = add2;
  function subtract2(value, right) {
    const ret = Clear();
    subtractToRef(value, right, ret);
    return ret;
  }
  Color43.subtract = subtract2;
  function subtractToRef(a, b, result) {
    result.r = a.r - b.r;
    result.g = a.g - b.g;
    result.b = a.b - b.b;
    result.a = a.a - b.a;
  }
  Color43.subtractToRef = subtractToRef;
  function scale(value, scale2) {
    return create(value.r * scale2, value.g * scale2, value.b * scale2, value.a * scale2);
  }
  Color43.scale = scale;
  function scaleToRef(value, scale2, result) {
    result.r = value.r * scale2;
    result.g = value.g * scale2;
    result.b = value.b * scale2;
    result.a = value.a * scale2;
  }
  Color43.scaleToRef = scaleToRef;
  function scaleAndAddToRef(value, scale2, result) {
    result.r += value.r * scale2;
    result.g += value.g * scale2;
    result.b += value.b * scale2;
    result.a += value.a * scale2;
  }
  Color43.scaleAndAddToRef = scaleAndAddToRef;
  function clampToRef(value, min = 0, max = 1, result) {
    result.r = Scalar.clamp(value.r, min, max);
    result.g = Scalar.clamp(value.g, min, max);
    result.b = Scalar.clamp(value.b, min, max);
    result.a = Scalar.clamp(value.a, min, max);
  }
  Color43.clampToRef = clampToRef;
  function multiply2(value, color) {
    return create(value.r * color.r, value.g * color.g, value.b * color.b, value.a * color.a);
  }
  Color43.multiply = multiply2;
  function multiplyToRef(value, color, result) {
    result.r = value.r * color.r;
    result.g = value.g * color.g;
    result.b = value.b * color.b;
    result.a = value.a * color.a;
  }
  Color43.multiplyToRef = multiplyToRef;
  function toString2(value) {
    return "{R: " + value.r + " G:" + value.g + " B:" + value.b + " A:" + value.a + "}";
  }
  Color43.toString = toString2;
  function getHashCode(value) {
    let hash = value.r || 0;
    hash = hash * 397 ^ (value.g || 0);
    hash = hash * 397 ^ (value.b || 0);
    hash = hash * 397 ^ (value.a || 0);
    return hash;
  }
  Color43.getHashCode = getHashCode;
  function clone(value) {
    return create(value.r, value.g, value.b, value.a);
  }
  Color43.clone = clone;
  function copyFrom(source, dest) {
    dest.r = source.r;
    dest.g = source.g;
    dest.b = source.b;
    dest.a = source.a;
  }
  Color43.copyFrom = copyFrom;
  function copyFromFloats(r, g, b, a, dest) {
    dest.r = r;
    dest.g = g;
    dest.b = b;
    dest.a = a;
  }
  Color43.copyFromFloats = copyFromFloats;
  function set(r, g, b, a, dest) {
    dest.r = r;
    dest.g = g;
    dest.b = b;
    dest.a = a;
  }
  Color43.set = set;
  function toHexString(value) {
    const intR = value.r * 255 | 0;
    const intG = value.g * 255 | 0;
    const intB = value.b * 255 | 0;
    const intA = value.a * 255 | 0;
    return "#" + Scalar.toHex(intR) + Scalar.toHex(intG) + Scalar.toHex(intB) + Scalar.toHex(intA);
  }
  Color43.toHexString = toHexString;
  function toLinearSpace(value) {
    const convertedColor = create();
    toLinearSpaceToRef(value, convertedColor);
    return convertedColor;
  }
  Color43.toLinearSpace = toLinearSpace;
  function toLinearSpaceToRef(value, ref) {
    ref.r = Math.pow(value.r, ToLinearSpace);
    ref.g = Math.pow(value.g, ToLinearSpace);
    ref.b = Math.pow(value.b, ToLinearSpace);
    ref.a = value.a;
  }
  Color43.toLinearSpaceToRef = toLinearSpaceToRef;
  function toGammaSpace(value) {
    const convertedColor = create();
    toGammaSpaceToRef(value, convertedColor);
    return convertedColor;
  }
  Color43.toGammaSpace = toGammaSpace;
  function toGammaSpaceToRef(value, convertedColor) {
    convertedColor.r = Math.pow(value.r, ToGammaSpace);
    convertedColor.g = Math.pow(value.g, ToGammaSpace);
    convertedColor.b = Math.pow(value.b, ToGammaSpace);
    convertedColor.a = value.a;
  }
  Color43.toGammaSpaceToRef = toGammaSpaceToRef;
})(Color42 || (Color42 = {}));

// ../../node_modules/.pnpm/@dcl+ecs-math@2.1.0/node_modules/@dcl/ecs-math/dist/Color3.js
var Color32;
(function(Color33) {
  function create(r = 0, g = 0, b = 0) {
    return { r, g, b };
  }
  Color33.create = create;
  function fromHexString(hex) {
    if (hex.substring(0, 1) !== "#" || hex.length !== 7) {
      return create(0, 0, 0);
    }
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return fromInts(r, g, b);
  }
  Color33.fromHexString = fromHexString;
  function fromArray(array, offset = 0) {
    return create(array[offset], array[offset + 1], array[offset + 2]);
  }
  Color33.fromArray = fromArray;
  function fromInts(r, g, b) {
    return create(r / 255, g / 255, b / 255);
  }
  Color33.fromInts = fromInts;
  function lerp(start, end, amount) {
    const result = create(0, 0, 0);
    Color33.lerpToRef(start, end, amount, result);
    return result;
  }
  Color33.lerp = lerp;
  function lerpToRef(left, right, amount, result) {
    result.r = left.r + (right.r - left.r) * amount;
    result.g = left.g + (right.g - left.g) * amount;
    result.b = left.b + (right.b - left.b) * amount;
  }
  Color33.lerpToRef = lerpToRef;
  function Red() {
    return create(1, 0, 0);
  }
  Color33.Red = Red;
  function Green() {
    return create(0, 1, 0);
  }
  Color33.Green = Green;
  function Blue() {
    return create(0, 0, 1);
  }
  Color33.Blue = Blue;
  function Black() {
    return create(0, 0, 0);
  }
  Color33.Black = Black;
  function White() {
    return create(1, 1, 1);
  }
  Color33.White = White;
  function Purple() {
    return create(0.5, 0, 0.5);
  }
  Color33.Purple = Purple;
  function Magenta() {
    return create(1, 0, 1);
  }
  Color33.Magenta = Magenta;
  function Yellow() {
    return create(1, 1, 0);
  }
  Color33.Yellow = Yellow;
  function Gray() {
    return create(0.5, 0.5, 0.5);
  }
  Color33.Gray = Gray;
  function Teal() {
    return create(0, 1, 1);
  }
  Color33.Teal = Teal;
  function Random() {
    return create(Math.random(), Math.random(), Math.random());
  }
  Color33.Random = Random;
  function toString2(value) {
    return "{R: " + value.r + " G:" + value.g + " B:" + value.b + "}";
  }
  Color33.toString = toString2;
  function getHashCode(value) {
    let hash = value.r || 0;
    hash = hash * 397 ^ (value.g || 0);
    hash = hash * 397 ^ (value.b || 0);
    return hash;
  }
  Color33.getHashCode = getHashCode;
  function toArray(value, array, index = 0) {
    array[index] = value.r;
    array[index + 1] = value.g;
    array[index + 2] = value.b;
  }
  Color33.toArray = toArray;
  function toColor4(value, alpha = 1) {
    return Color42.create(value.r, value.g, value.b, alpha);
  }
  Color33.toColor4 = toColor4;
  function asArray(value) {
    const result = new Array();
    toArray(value, result, 0);
    return result;
  }
  Color33.asArray = asArray;
  function toLuminance(value) {
    return value.r * 0.3 + value.g * 0.59 + value.b * 0.11;
  }
  Color33.toLuminance = toLuminance;
  function multiply2(value, otherColor) {
    return create(value.r * otherColor.r, value.g * otherColor.g, value.b * otherColor.b);
  }
  Color33.multiply = multiply2;
  function multiplyToRef(value, otherColor, result) {
    result.r = value.r * otherColor.r;
    result.g = value.g * otherColor.g;
    result.b = value.b * otherColor.b;
  }
  Color33.multiplyToRef = multiplyToRef;
  function equals2(value, otherColor) {
    return otherColor && value.r === otherColor.r && value.g === otherColor.g && value.b === otherColor.b;
  }
  Color33.equals = equals2;
  function equalsFloats(value, r, g, b) {
    return value.r === r && value.g === g && value.b === b;
  }
  Color33.equalsFloats = equalsFloats;
  function scale(value, scale2) {
    return create(value.r * scale2, value.g * scale2, value.b * scale2);
  }
  Color33.scale = scale;
  function scaleToRef(value, scale2, result) {
    result.r = value.r * scale2;
    result.g = value.g * scale2;
    result.b = value.b * scale2;
  }
  Color33.scaleToRef = scaleToRef;
  function scaleAndAddToRef(value, scale2, result) {
    result.r += value.r * scale2;
    result.g += value.g * scale2;
    result.b += value.b * scale2;
  }
  Color33.scaleAndAddToRef = scaleAndAddToRef;
  function clampToRef(value, min = 0, max = 1, result) {
    result.r = Scalar.clamp(value.r, min, max);
    result.g = Scalar.clamp(value.g, min, max);
    result.b = Scalar.clamp(value.b, min, max);
  }
  Color33.clampToRef = clampToRef;
  function clamp(value, min = 0, max = 1) {
    const result = Color33.Black();
    clampToRef(value, min, max, result);
    return result;
  }
  Color33.clamp = clamp;
  function add2(value, otherColor) {
    return create(value.r + otherColor.r, value.g + otherColor.g, value.b + otherColor.b);
  }
  Color33.add = add2;
  function addToRef(value, otherColor, result) {
    result.r = value.r + otherColor.r;
    result.g = value.g + otherColor.g;
    result.b = value.b + otherColor.b;
  }
  Color33.addToRef = addToRef;
  function subtract2(value, otherColor) {
    return create(value.r - otherColor.r, value.g - otherColor.g, value.b - otherColor.b);
  }
  Color33.subtract = subtract2;
  function subtractToRef(value, otherColor, result) {
    result.r = value.r - otherColor.r;
    result.g = value.g - otherColor.g;
    result.b = value.b - otherColor.b;
  }
  Color33.subtractToRef = subtractToRef;
  function clone(value) {
    return create(value.r, value.g, value.b);
  }
  Color33.clone = clone;
  function copyFrom(source, dest) {
    dest.r = source.r;
    dest.g = source.g;
    dest.b = source.b;
  }
  Color33.copyFrom = copyFrom;
  function set(dest, r, g, b) {
    dest.r = r;
    dest.g = g;
    dest.b = b;
  }
  Color33.set = set;
  function toHexString(value) {
    const intR = value.r * 255 | 0;
    const intG = value.g * 255 | 0;
    const intB = value.b * 255 | 0;
    return "#" + Scalar.toHex(intR) + Scalar.toHex(intG) + Scalar.toHex(intB);
  }
  Color33.toHexString = toHexString;
  function toLinearSpace(value) {
    const convertedColor = create();
    toLinearSpaceToRef(value, convertedColor);
    return convertedColor;
  }
  Color33.toLinearSpace = toLinearSpace;
  function toLinearSpaceToRef(value, convertedColor) {
    convertedColor.r = Math.pow(value.r, ToLinearSpace);
    convertedColor.g = Math.pow(value.g, ToLinearSpace);
    convertedColor.b = Math.pow(value.b, ToLinearSpace);
  }
  Color33.toLinearSpaceToRef = toLinearSpaceToRef;
  function toGammaSpace(value) {
    const convertedColor = create();
    toGammaSpaceToRef(value, convertedColor);
    return convertedColor;
  }
  Color33.toGammaSpace = toGammaSpace;
  function toGammaSpaceToRef(value, convertedColor) {
    convertedColor.r = Math.pow(value.r, ToGammaSpace);
    convertedColor.g = Math.pow(value.g, ToGammaSpace);
    convertedColor.b = Math.pow(value.b, ToGammaSpace);
  }
  Color33.toGammaSpaceToRef = toGammaSpaceToRef;
})(Color32 || (Color32 = {}));

// src/advanced-lighting.ts
var AdvancedLightingSystem = class {
  constructor() {
    this.lights = /* @__PURE__ */ new Map();
    this.timeOfDay = 0;
    this.shadowCasters = [];
    this.volumetricLights = [];
  }
  // Initialize advanced lighting
  initialize() {
    console.log("\u{1F4A1} Advanced Lighting System Initializing...");
    this.createGlobalIllumination();
    this.createDynamicShadows();
    this.createVolumetricLighting();
    this.createHDRSystem();
    this.startDayNightCycle();
    console.log("\u{1F4A1} Advanced Lighting System Ready!");
  }
  // Create global illumination system
  createGlobalIllumination() {
    const sunLight = engine.addEntity();
    Transform2.create(sunLight, {
      position: Vector32.create(8, 20, 8),
      scale: Vector32.create(2, 2, 2)
    });
    MeshRenderer3.setBox(sunLight);
    Material3.setPbrMaterial(sunLight, {
      albedoColor: Color42.create(1, 0.95, 0.8, 0.8),
      emissiveColor: Color42.create(1, 0.95, 0.8, 1),
      emissiveIntensity: 2
    });
    this.lights.set("sun", sunLight);
    const ambientLight = engine.addEntity();
    Transform2.create(ambientLight, {
      position: Vector32.create(8, 15, 8),
      scale: Vector32.create(30, 30, 30)
    });
    MeshRenderer3.setSphere(ambientLight);
    Material3.setPbrMaterial(ambientLight, {
      albedoColor: Color42.create(0.4, 0.45, 0.5, 0.1),
      emissiveColor: Color42.create(0.4, 0.45, 0.5, 0.3),
      emissiveIntensity: 0.5
    });
    this.lights.set("ambient", ambientLight);
  }
  // Create dynamic shadow system
  createDynamicShadows() {
    const shadowCasterPositions = [
      { pos: Vector32.create(8, 0, 8), scale: Vector32.create(16, 0.1, 16) },
      // Floor
      { pos: Vector32.create(8, 3, 15.9), scale: Vector32.create(16, 6, 0.2) },
      // Back wall
      { pos: Vector32.create(2, 3, 0.5), scale: Vector32.create(1.2, 6, 1.2) },
      // Pillar 1
      { pos: Vector32.create(14, 3, 0.5), scale: Vector32.create(1.2, 6, 1.2) }
      // Pillar 2
    ];
    shadowCasterPositions.forEach((config, index) => {
      const shadowCaster = engine.addEntity();
      Transform2.create(shadowCaster, {
        position: config.pos,
        scale: config.scale
      });
      MeshRenderer3.setBox(shadowCaster);
      Material3.setPbrMaterial(shadowCaster, {
        alphaTest: 0.01,
        castShadows: true,
        receiveShadows: true
      });
      this.shadowCasters.push(shadowCaster);
    });
  }
  // Create volumetric lighting effects
  createVolumetricLighting() {
    const beamPositions = [
      Vector32.create(2, 6, 2),
      Vector32.create(14, 6, 2),
      Vector32.create(8, 6, 8),
      Vector32.create(2, 6, 14),
      Vector32.create(14, 6, 14)
    ];
    beamPositions.forEach((pos, index) => {
      const volumetricLight = engine.addEntity();
      Transform2.create(volumetricLight, {
        position: pos,
        scale: Vector32.create(0.3, 8, 0.3)
      });
      MeshRenderer3.setBox(volumetricLight);
      Material3.setPbrMaterial(volumetricLight, {
        albedoColor: Color42.create(0.8, 0.9, 1, 0.3),
        emissiveColor: Color42.create(0.6, 0.7, 1, 0.8),
        emissiveIntensity: 5,
        alphaTest: 0.01
      });
      this.volumetricLights.push(volumetricLight);
    });
  }
  // Create HDR tone mapping system
  createHDRSystem() {
    const exposureZones = [
      { pos: Vector32.create(8, 2, 8), intensity: 1, color: Color32.create(1, 1, 1) },
      // Center
      { pos: Vector32.create(2, 2, 2), intensity: 0.8, color: Color32.create(0.8, 0.9, 1) },
      // Corner 1
      { pos: Vector32.create(14, 2, 2), intensity: 0.8, color: Color32.create(0.8, 0.9, 1) },
      // Corner 2
      { pos: Vector32.create(2, 2, 14), intensity: 0.8, color: Color32.create(0.8, 0.9, 1) },
      // Corner 3
      { pos: Vector32.create(14, 2, 14), intensity: 0.8, color: Color32.create(0.8, 0.9, 1) }
      // Corner 4
    ];
    exposureZones.forEach((zone, index) => {
      const exposureLight = engine.addEntity();
      Transform2.create(exposureLight, {
        position: zone.pos,
        scale: Vector32.create(4, 4, 4)
      });
      MeshRenderer3.setSphere(exposureLight);
      Material3.setPbrMaterial(exposureLight, {
        albedoColor: Color42.create(zone.color.r, zone.color.g, zone.color.b, 0.2),
        emissiveColor: Color42.create(zone.color.r, zone.color.g, zone.color.b, 0.6),
        emissiveIntensity: zone.intensity
      });
      this.lights.set(`exposure_${index}`, exposureLight);
    });
  }
  // Start day/night cycle
  startDayNightCycle() {
    engine.addSystem(() => {
      this.timeOfDay += 1e-3;
      this.updateDayNightCycle();
      this.updateVolumetricLights();
    });
  }
  // Update day/night cycle lighting
  updateDayNightCycle() {
    const sunLight = this.lights.get("sun");
    const ambientLight = this.lights.get("ambient");
    if (sunLight && ambientLight) {
      const sunAngle = this.timeOfDay * Math.PI * 2;
      const sunHeight = Math.sin(sunAngle);
      const sunIntensity = Math.max(0, sunHeight);
      const sunTransform = Transform2.getMutable(sunLight);
      sunTransform.rotation = Quaternion2.fromEulerDegrees(
        sunAngle * 180 / Math.PI - 90,
        0,
        0
      );
      const sunMaterial = Material3.getMutable(sunLight);
      if (sunMaterial && sunMaterial.$case === "pbr") {
        sunMaterial.pbr.emissiveIntensity = sunIntensity * 2;
        if (sunIntensity > 0.5) {
          sunMaterial.pbr.albedoColor = Color42.create(1, 0.95, 0.8, 0.8);
          sunMaterial.pbr.emissiveColor = Color42.create(1, 0.95, 0.8, 1);
        } else if (sunIntensity > 0.1) {
          sunMaterial.pbr.albedoColor = Color42.create(1, 0.7, 0.4, 0.8);
          sunMaterial.pbr.emissiveColor = Color42.create(1, 0.7, 0.4, 1);
        } else {
          sunMaterial.pbr.albedoColor = Color42.create(0.2, 0.3, 0.6, 0.8);
          sunMaterial.pbr.emissiveColor = Color42.create(0.2, 0.3, 0.6, 1);
        }
      }
      const ambientMaterial = Material3.getMutable(ambientLight);
      if (ambientMaterial && ambientMaterial.$case === "pbr") {
        ambientMaterial.pbr.emissiveIntensity = 0.3 + sunIntensity * 0.2;
        if (sunIntensity < 0.1) {
          ambientMaterial.pbr.albedoColor = Color42.create(0.1, 0.15, 0.3, 0.1);
          ambientMaterial.pbr.emissiveColor = Color42.create(0.1, 0.15, 0.3, 0.3);
        } else {
          ambientMaterial.pbr.albedoColor = Color42.create(0.4, 0.45, 0.5, 0.1);
          ambientMaterial.pbr.emissiveColor = Color42.create(0.4, 0.45, 0.5, 0.3);
        }
      }
    }
  }
  // Update volumetric lights with pulsing effect
  updateVolumetricLights() {
    this.volumetricLights.forEach((light, index) => {
      const time = this.timeOfDay * 2 + index * 0.5;
      const pulse = Math.sin(time) * 0.3 + 0.7;
      const material = Material3.getMutable(light);
      if (material && material.$case === "pbr") {
        material.pbr.emissiveIntensity = pulse * 5;
      }
    });
  }
  // Create dynamic spotlight for events
  createEventSpotlight(position, color = Color32.create(1, 1, 1)) {
    const spotlight = engine.addEntity();
    Transform2.create(spotlight, {
      position: Vector32.create(position.x, position.y + 5, position.z),
      rotation: Quaternion2.fromEulerDegrees(90, 0, 0),
      scale: Vector32.create(2, 8, 2)
    });
    MeshRenderer3.setCylinder(spotlight);
    Material3.setPbrMaterial(spotlight, {
      albedoColor: Color42.create(color.r, color.g, color.b, 0.3),
      emissiveColor: Color42.create(color.r, color.g, color.b, 0.8),
      emissiveIntensity: 3
    });
    setTimeout(() => {
      engine.removeEntity(spotlight);
    }, 5e3);
    return spotlight;
  }
  // Create emergency lighting
  createEmergencyLighting() {
    const emergencyPositions = [
      Vector32.create(1, 4, 1),
      Vector32.create(15, 4, 1),
      Vector32.create(1, 4, 15),
      Vector32.create(15, 4, 15)
    ];
    emergencyPositions.forEach((pos) => {
      const emergencyLight = engine.addEntity();
      Transform2.create(emergencyLight, {
        position: pos,
        scale: Vector32.create(1, 1, 1)
      });
      MeshRenderer3.setBox(emergencyLight);
      Material3.setPbrMaterial(emergencyLight, {
        albedoColor: Color42.create(1, 0.2, 0.2, 0.8),
        emissiveColor: Color42.create(1, 0.2, 0.2, 1),
        emissiveIntensity: 4
      });
      engine.addSystem(() => {
        const time = Date.now() / 200;
        const pulse = Math.sin(time) > 0 ? 1 : 0.2;
        const material = Material3.getMutable(emergencyLight);
        if (material && material.$case === "pbr") {
          material.pbr.emissiveIntensity = pulse * 4;
        }
      });
    });
  }
  // Cleanup lighting system
  cleanup() {
    this.lights.forEach((light) => {
      engine.removeEntity(light);
    });
    this.shadowCasters.forEach((caster) => {
      engine.removeEntity(caster);
    });
    this.volumetricLights.forEach((light) => {
      engine.removeEntity(light);
    });
    this.lights.clear();
    this.shadowCasters = [];
    this.volumetricLights = [];
  }
};
var lightingSystem = new AdvancedLightingSystem();

// src/enhanced-sound.ts
var SoundSystem = class {
  constructor() {
    this.audioSources = /* @__PURE__ */ new Map();
    this.masterVolume = 0.5;
  }
  // Initialize sound system
  initialize() {
    console.log("\u{1F50A} Sound System Initializing...");
    this.createAmbientSound();
    this.createInteractionSounds();
    console.log("\u{1F50A} Sound System Ready!");
  }
  // Create ambient background sound
  createAmbientSound() {
    const ambientSource = engine.addEntity();
    AudioSource3.create(ambientSource, {
      playing: true,
      loop: true,
      volume: this.masterVolume * 0.3,
      audioClipUrl: "sounds/ambient-quantum.mp3"
    });
    this.audioSources.set("ambient", ambientSource);
  }
  // Create interaction sound effects
  createInteractionSounds() {
    const clickSource = engine.addEntity();
    AudioSource3.create(clickSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.8,
      audioClipUrl: "sounds/interface-click.mp3"
    });
    this.audioSources.set("click", clickSource);
    const alertSource = engine.addEntity();
    AudioSource3.create(alertSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.9,
      audioClipUrl: "sounds/alert-chime.mp3"
    });
    this.audioSources.set("alert", alertSource);
    const powerUpSource = engine.addEntity();
    AudioSource3.create(powerUpSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.7,
      audioClipUrl: "sounds/power-up.mp3"
    });
    this.audioSources.set("powerup", powerUpSource);
  }
  // Play specific sound
  playSound(soundName) {
    const source = this.audioSources.get(soundName);
    if (source) {
      const audioSource = AudioSource3.getMutable(source);
      audioSource.playing = true;
      if (!audioSource.loop) {
        setTimeout(() => {
          audioSource.playing = false;
        }, 1e3);
      }
    }
  }
  // Stop specific sound
  stopSound(soundName) {
    const source = this.audioSources.get(soundName);
    if (source) {
      AudioSource3.getMutable(source).playing = false;
    }
  }
  // Set master volume
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.audioSources.forEach((source, name) => {
      const audioSource = AudioSource3.getMutable(source);
      if (name === "ambient") {
        audioSource.volume = this.masterVolume * 0.3;
      } else {
        audioSource.volume = this.masterVolume * 0.8;
      }
    });
  }
  // Play interaction sound based on type
  playInteractionSound(type) {
    switch (type) {
      case "click":
        this.playSound("click");
        break;
      case "alert":
        this.playSound("alert");
        break;
      case "powerup":
        this.playSound("powerup");
        break;
      case "error":
        this.playSound("alert");
        break;
    }
  }
  // Cleanup sound system
  cleanup() {
    this.audioSources.forEach((source) => {
      engine.removeEntity(source);
    });
    this.audioSources.clear();
  }
};
var soundSystem = new SoundSystem();

// src/ai-npc-system.ts
var NPCAssistant = class {
  constructor(name, role, position) {
    this.dialogueTree = /* @__PURE__ */ new Map();
    this.memory = /* @__PURE__ */ new Map();
    this.currentDialogue = "greeting";
    this.isProcessing = false;
    this.emotionalState = "neutral";
    this.name = name;
    this.role = role;
    this.createNPC(position);
    this.initializeDialogueTree();
    this.startAIProcessing();
  }
  createNPC(position) {
    this.entity = engine.addEntity();
    Transform2.create(this.entity, {
      position,
      scale: Vector32.create(1, 2, 1)
    });
    MeshRenderer3.setBox(this.entity);
    Material3.setPbrMaterial(this.entity, {
      albedoColor: Color42.create(0.3, 0.5, 0.8, 1),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: Color42.create(0.1, 0.2, 0.4, 0.3),
      emissiveIntensity: 1
    });
    const head = engine.addEntity();
    Transform2.create(head, {
      parent: this.entity,
      position: Vector32.create(0, 1.2, 0),
      scale: Vector32.create(0.8, 0.8, 0.8)
    });
    MeshRenderer3.setSphere(head);
    Material3.setPbrMaterial(head, {
      albedoColor: Color42.create(0.9, 0.8, 0.7, 1),
      roughness: 0.1,
      metallic: 0.1
    });
    const nameTag = engine.addEntity();
    Transform2.create(nameTag, {
      parent: this.entity,
      position: Vector32.create(0, 2.5, 0),
      scale: Vector32.create(0.5, 0.5, 0.5)
    });
    TextShape3.create(nameTag, {
      text: `${this.name}
${this.role}`,
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: Color42.create(0, 0, 0, 1)
    });
    pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: `\u{1F916} Talk to ${this.name}`
        }
      },
      () => this.handleInteraction()
    );
  }
  initializeDialogueTree() {
    this.dialogueTree.set("greeting", {
      id: "greeting",
      text: `Hello! I'm ${this.name}, your ${this.role}. How can I assist you today?`,
      responses: [
        "Tell me about the system status",
        "Help me with a task",
        "What can you do?",
        "Goodbye"
      ],
      emotion: "happy"
    });
    this.dialogueTree.set("system_status", {
      id: "system_status",
      text: "All systems are operating at optimal efficiency. Quantum core is stable, network latency is under 10ms, and security protocols are active.",
      responses: [
        "Show me detailed metrics",
        "Run diagnostics",
        "Back to main menu"
      ],
      emotion: "neutral"
    });
    this.dialogueTree.set("task_help", {
      id: "task_help",
      text: "I can help you with various tasks: system monitoring, data analysis, security checks, or collaborative projects. What would you like to work on?",
      responses: [
        "System monitoring",
        "Data analysis",
        "Security check",
        "Collaboration"
      ],
      emotion: "excited"
    });
    this.dialogueTree.set("capabilities", {
      id: "capabilities",
      text: "I have advanced AI capabilities including natural language processing, predictive analytics, real-time monitoring, and adaptive learning. I can also integrate with external systems and provide intelligent recommendations.",
      responses: [
        "Show me examples",
        "Teach me something",
        "Back to main menu"
      ],
      emotion: "excited"
    });
    this.dialogueTree.set("detailed_metrics", {
      id: "detailed_metrics",
      text: "Current metrics: CPU usage at 42%, memory at 68%, network throughput at 1.2GB/s, and quantum coherence at 98.7%. All parameters within acceptable ranges.",
      responses: [
        "Show historical trends",
        "Export report",
        "Back to system status"
      ],
      emotion: "neutral"
    });
    this.dialogueTree.set("farewell", {
      id: "farewell",
      text: "It was great assisting you! Feel free to return anytime. I'll be here monitoring the systems and learning from our interactions.",
      responses: [],
      emotion: "happy"
    });
  }
  async handleInteraction() {
    if (this.isProcessing)
      return;
    this.isProcessing = true;
    soundSystem.playInteractionSound("click");
    const dialogue = this.dialogueTree.get(this.currentDialogue);
    if (!dialogue) {
      this.isProcessing = false;
      return;
    }
    await this.displayDialogueWithTyping(dialogue);
    this.updateEmotionalState(dialogue.emotion);
    this.showResponseOptions(dialogue.responses);
    this.isProcessing = false;
  }
  async displayDialogueWithTyping(dialogue) {
    const dialogueEntity = engine.addEntity();
    Transform2.create(dialogueEntity, {
      position: Vector32.create(8, 4, 8),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(dialogueEntity, {
      text: "",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 4,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: Color42.create(0, 0, 0, 1)
    });
    const fullText = `${this.name}: ${dialogue.text}`;
    let currentText = "";
    for (let i = 0; i <= fullText.length; i++) {
      currentText = fullText.substring(0, i);
      TextShape3.getMutable(dialogueEntity).text = currentText;
      await new Promise((resolve2) => setTimeout(resolve2, 50));
    }
    setTimeout(() => {
      engine.removeEntity(dialogueEntity);
    }, 5e3);
  }
  showResponseOptions(responses) {
    responses.forEach((response, index) => {
      const responseEntity = engine.addEntity();
      Transform2.create(responseEntity, {
        position: Vector32.create(4 + index * 2, 3, 10),
        scale: Vector32.create(0.2, 0.2, 0.2)
      });
      TextShape3.create(responseEntity, {
        text: `${index + 1}. ${response}`,
        textColor: Color42.create(0.8, 0.8, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: responseEntity,
          opts: {
            button: InputAction.IA_POINTER,
            hoverText: response
          }
        },
        () => {
          this.handleResponse(index);
          engine.removeEntity(responseEntity);
        }
      );
    });
  }
  handleResponse(responseIndex) {
    const dialogue = this.dialogueTree.get(this.currentDialogue);
    if (!dialogue || responseIndex >= dialogue.responses.length)
      return;
    const response = dialogue.responses[responseIndex];
    switch (response) {
      case "Tell me about the system status":
        this.currentDialogue = "system_status";
        break;
      case "Help me with a task":
        this.currentDialogue = "task_help";
        break;
      case "What can you do?":
        this.currentDialogue = "capabilities";
        break;
      case "Show me detailed metrics":
        this.currentDialogue = "detailed_metrics";
        break;
      case "Goodbye":
        this.currentDialogue = "farewell";
        break;
      default:
        this.currentDialogue = "greeting";
    }
    setTimeout(() => {
      this.handleInteraction();
    }, 1e3);
  }
  updateEmotionalState(emotion) {
    this.emotionalState = emotion;
    const material = Material3.getMutable(this.entity);
    if (material && material.$case === "pbr") {
      switch (emotion) {
        case "happy":
          material.pbr.emissiveColor = Color42.create(0.2, 0.8, 0.2, 0.5);
          material.pbr.emissiveIntensity = 2;
          break;
        case "excited":
          material.pbr.emissiveColor = Color42.create(1, 0.8, 0.2, 0.5);
          material.pbr.emissiveIntensity = 3;
          break;
        case "concerned":
          material.pbr.emissiveColor = Color42.create(0.8, 0.2, 0.2, 0.5);
          material.pbr.emissiveIntensity = 1.5;
          break;
        default:
          material.pbr.emissiveColor = Color42.create(0.1, 0.2, 0.4, 0.3);
          material.pbr.emissiveIntensity = 1;
      }
    }
  }
  startAIProcessing() {
    engine.addSystem(() => {
      if (Math.random() > 0.98) {
        const material = Material3.getMutable(this.entity);
        if (material && material.$case === "pbr") {
          material.pbr.emissiveIntensity = 1 + Math.random() * 0.5;
        }
      }
    });
  }
  // Advanced AI methods
  async processNaturalLanguage(input) {
    await new Promise((resolve2) => setTimeout(resolve2, 1e3));
    if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
      return `Hello! I'm ${this.name}. How can I help you today?`;
    } else if (input.toLowerCase().includes("status")) {
      return "All systems are operational. Would you like detailed metrics?";
    } else if (input.toLowerCase().includes("help")) {
      return "I can assist with system monitoring, data analysis, and security checks. What do you need?";
    } else {
      return "I understand you need assistance. Let me help you with that.";
    }
  }
  learnFromInteraction(playerId, topic) {
    if (!this.memory.has(playerId)) {
      this.memory.set(playerId, {
        playerName: playerId,
        lastInteraction: Date.now(),
        topics: [],
        preferences: []
      });
    }
    const playerMemory = this.memory.get(playerId);
    playerMemory.topics.push(topic);
    playerMemory.lastInteraction = Date.now();
  }
  getPersonalizedResponse(playerId) {
    const playerMemory = this.memory.get(playerId);
    if (!playerMemory) {
      return "Nice to meet you! I'm here to help with any questions or tasks.";
    }
    const timeSinceLastInteraction = Date.now() - playerMemory.lastInteraction;
    if (timeSinceLastInteraction < 6e4) {
      return "Welcome back! Is there anything else I can help you with?";
    } else {
      return `It's been a while! Last time we discussed ${playerMemory.topics[playerMemory.topics.length - 1]}. How can I assist you today?`;
    }
  }
  cleanup() {
    if (this.entity) {
      engine.removeEntity(this.entity);
    }
  }
};
var NPCManager = class {
  constructor() {
    this.npcs = /* @__PURE__ */ new Map();
  }
  createNPC(name, role, position) {
    const npc = new NPCAssistant(name, role, position);
    this.npcs.set(name, npc);
    return npc;
  }
  getNPC(name) {
    return this.npcs.get(name);
  }
  getAllNPCs() {
    return Array.from(this.npcs.values());
  }
  cleanup() {
    this.npcs.forEach((npc) => npc.cleanup());
    this.npcs.clear();
  }
};
var npcManager = new NPCManager();

// src/analytics-dashboard.ts
var AnalyticsDashboardSystem = class {
  // 5 seconds
  constructor() {
    this.analyticsData = /* @__PURE__ */ new Map();
    this.widgets = /* @__PURE__ */ new Map();
    this.reports = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.realTimeData = [];
    this.maxRealTimeEvents = 1e3;
    this.dataRetentionDays = 30;
    this.refreshInterval = 5e3;
    this.initializeDataSources();
  }
  // Initialize analytics dashboard system
  initialize() {
    console.log("\u{1F4CA} Analytics Dashboard System Initializing...");
    this.createDashboardUI();
    this.createDefaultWidgets();
    this.createDefaultReports();
    this.startAnalyticsEngine();
    this.generateSampleData();
    this.isInitialized = true;
    console.log("\u{1F4CA} Analytics Dashboard System Ready!");
  }
  // Initialize data sources
  initializeDataSources() {
    console.log("\u{1F4E1} Initializing analytics data sources...");
  }
  // Create dashboard UI
  createDashboardUI() {
    this.dashboardUI = engine.addEntity();
    Transform2.create(this.dashboardUI, {
      position: Vector32.create(8, 4, 2),
      scale: Vector32.create(6, 4, 0.1)
    });
    MeshRenderer3.setBox(this.dashboardUI);
    Material3.setPbrMaterial(this.dashboardUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.dashboardUI,
      position: Vector32.create(0, 1.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F4CA} ANALYTICS DASHBOARD",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createWidgetContainers();
    this.createControlPanel();
    this.createStatusBar();
  }
  // Create widget containers
  createWidgetContainers() {
    const mainChart = engine.addEntity();
    Transform2.create(mainChart, {
      parent: this.dashboardUI,
      position: Vector32.create(-1.5, 0.5, 0.1),
      scale: Vector32.create(2.5, 1.5, 0.1)
    });
    MeshRenderer3.setBox(mainChart);
    Material3.setPbrMaterial(mainChart, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const kpiArea = engine.addEntity();
    Transform2.create(kpiArea, {
      parent: this.dashboardUI,
      position: Vector32.create(1.5, 0.5, 0.1),
      scale: Vector32.create(2.5, 1.5, 0.1)
    });
    MeshRenderer3.setBox(kpiArea);
    Material3.setPbrMaterial(kpiArea, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const realtimeArea = engine.addEntity();
    Transform2.create(realtimeArea, {
      parent: this.dashboardUI,
      position: Vector32.create(0, -0.8, 0.1),
      scale: Vector32.create(5, 0.8, 0.1)
    });
    MeshRenderer3.setBox(realtimeArea);
    Material3.setPbrMaterial(realtimeArea, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
  }
  // Create control panel
  createControlPanel() {
    const controls = [
      { id: "refresh", icon: "\u{1F504}", name: "Refresh Data" },
      { id: "export", icon: "\u{1F4E4}", name: "Export Report" },
      { id: "settings", icon: "\u2699\uFE0F", name: "Settings" },
      { id: "fullscreen", icon: "\u{1F50D}", name: "Fullscreen" }
    ];
    let xOffset = -1.5;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.dashboardUI,
        position: Vector32.create(xOffset, -1.5, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Create status bar
  createStatusBar() {
    const statusBar = engine.addEntity();
    Transform2.create(statusBar, {
      parent: this.dashboardUI,
      position: Vector32.create(0, -1.9, 0.1),
      scale: Vector32.create(5.5, 0.2, 0.1)
    });
    MeshRenderer3.setBox(statusBar);
    Material3.setPbrMaterial(statusBar, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const statusText = engine.addEntity();
    Transform2.create(statusText, {
      parent: statusBar,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(statusText, {
      text: "\u{1F4CA} Last Update: Just Now | Events: 0",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.2,
      textAlign: 3
    });
  }
  // Create default widgets
  createDefaultWidgets() {
    const userActivityChart = {
      id: "widget_user_activity",
      type: "chart",
      title: "User Activity",
      position: Vector32.create(-1.5, 0.5, 0.1),
      size: Vector32.create(2.5, 1.5, 0.1),
      dataSource: "user_behavior",
      refreshInterval: 1e4,
      config: {
        chartType: "line",
        timeRange: "day",
        aggregation: "count",
        colors: [Color32.create(0.2, 0.6, 1), Color32.create(1, 0.6, 0.2)],
        showLegend: true,
        showGrid: true
      },
      isVisible: true
    };
    const systemPerformanceGauge = {
      id: "widget_system_performance",
      type: "gauge",
      title: "System Performance",
      position: Vector32.create(1.5, 0.8, 0.1),
      size: Vector32.create(1, 0.6, 0.1),
      dataSource: "system_performance",
      refreshInterval: 5e3,
      config: {
        timeRange: "hour",
        aggregation: "avg"
      },
      isVisible: true
    };
    const businessMetrics = {
      id: "widget_business_metrics",
      type: "metric",
      title: "Business Metrics",
      position: Vector32.create(1.5, 0.2, 0.1),
      size: Vector32.create(2.5, 0.6, 0.1),
      dataSource: "business_metrics",
      refreshInterval: 15e3,
      config: {
        timeRange: "week",
        aggregation: "sum"
      },
      isVisible: true
    };
    const realtimeEvents = {
      id: "widget_realtime_events",
      type: "realtime",
      title: "Real-time Events",
      position: Vector32.create(0, -0.8, 0.1),
      size: Vector32.create(5, 0.8, 0.1),
      dataSource: "realtime",
      refreshInterval: 1e3,
      config: {
        timeRange: "hour"
      },
      isVisible: true
    };
    this.widgets.set(userActivityChart.id, userActivityChart);
    this.widgets.set(systemPerformanceGauge.id, systemPerformanceGauge);
    this.widgets.set(businessMetrics.id, businessMetrics);
    this.widgets.set(realtimeEvents.id, realtimeEvents);
    console.log("\u{1F4C8} Default widgets created");
  }
  // Create default reports
  createDefaultReports() {
    const dailyReport = {
      id: "report_daily_performance",
      name: "Daily Performance Report",
      description: "Comprehensive daily performance metrics",
      category: "system_performance",
      widgets: ["widget_user_activity", "widget_system_performance"],
      schedule: {
        frequency: "daily",
        enabled: true,
        nextRun: Date.now() + 864e5,
        // Tomorrow
        timezone: "UTC"
      },
      recipients: ["admin@aigestion.com"],
      format: "pdf",
      isTemplate: false
    };
    const weeklyReport = {
      id: "report_weekly_business",
      name: "Weekly Business Report",
      description: "Weekly business metrics and KPIs",
      category: "business_metrics",
      widgets: ["widget_business_metrics"],
      schedule: {
        frequency: "weekly",
        enabled: true,
        nextRun: Date.now() + 6048e5,
        // Next week
        timezone: "UTC"
      },
      recipients: ["management@aigestion.com"],
      format: "html",
      isTemplate: false
    };
    this.reports.set(dailyReport.id, dailyReport);
    this.reports.set(weeklyReport.id, weeklyReport);
    console.log("\u{1F4CB} Default reports created");
  }
  // Start analytics engine
  startAnalyticsEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateRealTimeData();
      this.refreshWidgets();
      this.processReports();
      this.cleanupOldData();
    });
  }
  // Generate sample data
  generateSampleData() {
    const categories = ["user_behavior", "system_performance", "business_metrics", "engagement"];
    categories.forEach((category) => {
      const data = {
        id: `data_${category}_${Date.now()}`,
        timestamp: Date.now(),
        category,
        metrics: this.generateMetrics(category),
        dimensions: /* @__PURE__ */ new Map([
          ["platform", "web"],
          ["version", "1.0.0"],
          ["environment", "production"]
        ]),
        events: [],
        kpis: this.generateKPIs(category)
      };
      this.analyticsData.set(data.id, data);
    });
    for (let i = 0; i < 50; i++) {
      const event = {
        id: `event_${Date.now()}_${i}`,
        name: this.getRandomEventName(),
        category: this.getRandomEventCategory(),
        timestamp: Date.now() - Math.random() * 36e5,
        // Last hour
        userId: `user_${Math.floor(Math.random() * 100)}`,
        sessionId: `session_${Math.floor(Math.random() * 20)}`,
        properties: /* @__PURE__ */ new Map([
          ["action", this.getRandomAction()],
          ["page", this.getRandomPage()],
          ["duration", Math.floor(Math.random() * 300)]
        ]),
        value: Math.random() * 100
      };
      this.realTimeData.push(event);
    }
    console.log("\u{1F4CA} Sample analytics data generated");
  }
  // Generate metrics
  generateMetrics(category) {
    const metrics = /* @__PURE__ */ new Map();
    switch (category) {
      case "user_behavior":
        metrics.set("active_users", Math.floor(Math.random() * 1e3) + 500);
        metrics.set("page_views", Math.floor(Math.random() * 1e4) + 5e3);
        metrics.set("session_duration", Math.random() * 600 + 120);
        metrics.set("bounce_rate", Math.random() * 0.5 + 0.2);
        break;
      case "system_performance":
        metrics.set("cpu_usage", Math.random() * 80 + 10);
        metrics.set("memory_usage", Math.random() * 70 + 20);
        metrics.set("response_time", Math.random() * 500 + 100);
        metrics.set("error_rate", Math.random() * 5);
        break;
      case "business_metrics":
        metrics.set("revenue", Math.random() * 1e4 + 5e3);
        metrics.set("conversion_rate", Math.random() * 0.1 + 0.02);
        metrics.set("customer_acquisition", Math.floor(Math.random() * 100) + 50);
        metrics.set("retention_rate", Math.random() * 0.3 + 0.6);
        break;
      case "engagement":
        metrics.set("interaction_rate", Math.random() * 0.8 + 0.1);
        metrics.set("social_shares", Math.floor(Math.random() * 500) + 100);
        metrics.set("comments", Math.floor(Math.random() * 200) + 50);
        metrics.set("likes", Math.floor(Math.random() * 1e3) + 200);
        break;
    }
    return metrics;
  }
  // Generate KPIs
  generateKPIs(category) {
    const kpis = [];
    switch (category) {
      case "user_behavior":
        kpis.push({
          id: "kpi_daily_active_users",
          name: "Daily Active Users",
          value: Math.floor(Math.random() * 1e3) + 500,
          target: 1500,
          unit: "users",
          trend: Math.random() > 0.5 ? "up" : "down",
          change: (Math.random() - 0.5) * 20,
          status: "good"
        });
        break;
      case "system_performance":
        kpis.push({
          id: "kpi_uptime",
          name: "System Uptime",
          value: 99.5 + Math.random() * 0.5,
          target: 99.9,
          unit: "%",
          trend: "stable",
          change: 0.1,
          status: "good"
        });
        break;
      case "business_metrics":
        kpis.push({
          id: "kpi_monthly_revenue",
          name: "Monthly Revenue",
          value: Math.floor(Math.random() * 5e4) + 1e5,
          target: 2e5,
          unit: "$",
          trend: Math.random() > 0.3 ? "up" : "down",
          change: (Math.random() - 0.5) * 15,
          status: Math.random() > 0.2 ? "good" : "warning"
        });
        break;
    }
    return kpis;
  }
  // Get random event name
  getRandomEventName() {
    const events = [
      "page_view",
      "button_click",
      "form_submit",
      "video_play",
      "download",
      "login",
      "logout",
      "search",
      "filter",
      "sort",
      "share",
      "comment",
      "purchase",
      "add_to_cart",
      "checkout",
      "sign_up",
      "subscribe"
    ];
    return events[Math.floor(Math.random() * events.length)];
  }
  // Get random event category
  getRandomEventCategory() {
    const categories = ["navigation", "interaction", "conversion", "engagement", "error"];
    return categories[Math.floor(Math.random() * categories.length)];
  }
  // Get random action
  getRandomAction() {
    const actions = ["click", "hover", "scroll", "swipe", "tap", "drag", "drop"];
    return actions[Math.floor(Math.random() * actions.length)];
  }
  // Get random page
  getRandomPage() {
    const pages = [
      "/dashboard",
      "/profile",
      "/settings",
      "/analytics",
      "/reports",
      "/products",
      "/services",
      "/about",
      "/contact",
      "/help"
    ];
    return pages[Math.floor(Math.random() * pages.length)];
  }
  // Update real-time data
  updateRealTimeData() {
    if (Math.random() < 0.1) {
      const event = {
        id: `event_realtime_${Date.now()}_${Math.random()}`,
        name: this.getRandomEventName(),
        category: this.getRandomEventCategory(),
        timestamp: Date.now(),
        userId: `user_${Math.floor(Math.random() * 100)}`,
        sessionId: `session_${Math.floor(Math.random() * 20)}`,
        properties: /* @__PURE__ */ new Map([
          ["action", this.getRandomAction()],
          ["page", this.getRandomPage()]
        ]),
        value: Math.random() * 100
      };
      this.realTimeData.push(event);
      if (this.realTimeData.length > this.maxRealTimeEvents) {
        this.realTimeData = this.realTimeData.slice(-this.maxRealTimeEvents);
      }
    }
  }
  // Refresh widgets
  refreshWidgets() {
    this.widgets.forEach((widget, id) => {
      if (Date.now() - widget.refreshInterval < 0)
        return;
      this.updateWidgetData(widget);
    });
  }
  // Update widget data
  updateWidgetData(widget) {
    switch (widget.type) {
      case "chart":
        this.updateChartData(widget);
        break;
      case "gauge":
        this.updateGaugeData(widget);
        break;
      case "metric":
        this.updateMetricData(widget);
        break;
      case "realtime":
        this.updateRealtimeData(widget);
        break;
    }
  }
  // Update chart data
  updateChartData(widget) {
    console.log(`\u{1F4C8} Updating chart widget: ${widget.title}`);
  }
  // Update gauge data
  updateGaugeData(widget) {
    console.log(`\u{1F3AF} Updating gauge widget: ${widget.title}`);
  }
  // Update metric data
  updateMetricData(widget) {
    console.log(`\u{1F4CA} Updating metric widget: ${widget.title}`);
  }
  // Update real-time data widget
  updateRealtimeData(widget) {
    console.log(`\u26A1 Updating real-time widget: ${widget.title}`);
  }
  // Process reports
  processReports() {
    const now = Date.now();
    this.reports.forEach((report, id) => {
      if (report.schedule.enabled && now >= report.schedule.nextRun) {
        this.generateReport(report);
        report.schedule.nextRun = this.calculateNextRun(report.schedule);
      }
    });
  }
  // Generate report
  generateReport(report) {
    console.log(`\u{1F4CB} Generating report: ${report.name}`);
    const reportData = {
      reportId: report.id,
      reportName: report.name,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      widgets: report.widgets.map((widgetId) => {
        const widget = this.widgets.get(widgetId);
        return widget ? {
          id: widget.id,
          title: widget.title,
          data: this.getWidgetData(widget)
        } : null;
      }).filter(Boolean)
    };
    report.recipients.forEach((recipient) => {
      console.log(`\u{1F4E7} Sending report to: ${recipient}`);
    });
    soundSystem.playInteractionSound("powerup");
  }
  // Get widget data
  getWidgetData(widget) {
    const data = Array.from(this.analyticsData.values()).filter((d) => d.category === widget.dataSource).map((d) => ({
      timestamp: d.timestamp,
      metrics: Object.fromEntries(d.metrics),
      kpis: d.kpis
    }));
    return data;
  }
  // Calculate next run time
  calculateNextRun(schedule) {
    const now = Date.now();
    let nextRun = now;
    switch (schedule.frequency) {
      case "hourly":
        nextRun = now + 36e5;
        break;
      case "daily":
        nextRun = now + 864e5;
        break;
      case "weekly":
        nextRun = now + 6048e5;
        break;
      case "monthly":
        nextRun = now + 2592e6;
        break;
    }
    return nextRun;
  }
  // Clean up old data
  cleanupOldData() {
    const cutoffTime = Date.now() - this.dataRetentionDays * 24 * 60 * 60 * 1e3;
    this.analyticsData.forEach((data, id) => {
      if (data.timestamp < cutoffTime) {
        this.analyticsData.delete(id);
      }
    });
    this.realTimeData = this.realTimeData.filter((event) => event.timestamp > cutoffTime);
  }
  // Handle control
  handleControl(controlId) {
    switch (controlId) {
      case "refresh":
        this.refreshAllWidgets();
        break;
      case "export":
        this.exportData();
        break;
      case "settings":
        this.openSettings();
        break;
      case "fullscreen":
        this.toggleFullscreen();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Refresh all widgets
  refreshAllWidgets() {
    console.log("\u{1F504} Refreshing all widgets...");
    this.widgets.forEach((widget) => {
      this.updateWidgetData(widget);
    });
    soundSystem.playInteractionSound("powerup");
  }
  // Export data
  exportData() {
    console.log("\u{1F4E4} Exporting analytics data...");
    const exportData = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      analyticsData: Array.from(this.analyticsData.values()),
      widgets: Array.from(this.widgets.values()),
      realTimeEvents: this.realTimeData.slice(-100)
      // Last 100 events
    };
    console.log("\u{1F4CA} Data exported successfully");
    soundSystem.playInteractionSound("powerup");
  }
  // Open settings
  openSettings() {
    console.log("\u2699\uFE0F Opening analytics settings...");
    soundSystem.playInteractionSound("click");
  }
  // Toggle fullscreen
  toggleFullscreen() {
    console.log("\u{1F50D} Toggling fullscreen mode...");
    soundSystem.playInteractionSound("click");
  }
  // Track event
  trackEvent(event) {
    this.realTimeData.push(event);
    if (this.realTimeData.length > this.maxRealTimeEvents) {
      this.realTimeData = this.realTimeData.slice(-this.maxRealTimeEvents);
    }
    console.log(`\u{1F4CA} Tracked event: ${event.name}`);
  }
  // Get analytics data
  getAnalyticsData(category) {
    const data = Array.from(this.analyticsData.values());
    return category ? data.filter((d) => d.category === category) : data;
  }
  // Get real-time events
  getRealTimeEvents(limit) {
    return limit ? this.realTimeData.slice(-limit) : this.realTimeData;
  }
  // Get widgets
  getWidgets() {
    return Array.from(this.widgets.values());
  }
  // Get reports
  getReports() {
    return Array.from(this.reports.values());
  }
  // Add widget
  addWidget(widget) {
    this.widgets.set(widget.id, widget);
    console.log(`\u{1F4C8} Added widget: ${widget.title}`);
  }
  // Remove widget
  removeWidget(widgetId) {
    this.widgets.delete(widgetId);
    console.log(`\u{1F5D1}\uFE0F Removed widget: ${widgetId}`);
  }
  // Create custom report
  createReport(report) {
    const newReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random()}`
    };
    this.reports.set(newReport.id, newReport);
    console.log(`\u{1F4CB} Created report: ${newReport.name}`);
    return newReport;
  }
  // Set data retention
  setDataRetentionDays(days) {
    this.dataRetentionDays = Math.max(1, days);
    console.log(`\u{1F4C5} Data retention set to: ${days} days`);
  }
  // Get system statistics
  getSystemStatistics() {
    return {
      totalAnalyticsData: this.analyticsData.size,
      totalWidgets: this.widgets.size,
      totalReports: this.reports.size,
      realTimeEvents: this.realTimeData.length,
      dataRetentionDays: this.dataRetentionDays,
      maxRealTimeEvents: this.maxRealTimeEvents,
      refreshInterval: this.refreshInterval
    };
  }
  // Cleanup system
  cleanup() {
    this.analyticsData.clear();
    this.widgets.clear();
    this.reports.clear();
    this.realTimeData = [];
    if (this.dashboardUI) {
      engine.removeEntity(this.dashboardUI);
    }
    this.isInitialized = false;
  }
};
var analyticsDashboardSystem = new AnalyticsDashboardSystem();

// src/ar-integration.ts
var ARIntegrationSystem = class {
  constructor() {
    this.devices = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
    this.overlays = /* @__PURE__ */ new Map();
    this.currentSession = null;
    this.isInitialized = false;
    this.initializeAREngine();
    this.initializeTrackingSystem();
    this.initializeRenderingSystem();
  }
  // Initialize AR system
  initialize() {
    console.log("\u{1F4F1} AR Integration System Initializing...");
    this.setupARDevices();
    this.createARUI();
    this.startAREngine();
    this.setupARInteractions();
    this.isInitialized = true;
    console.log("\u{1F4F1} AR Integration System Ready!");
  }
  // Initialize AR engine
  initializeAREngine() {
    this.arEngine = {
      isSupported: true,
      isInitialized: false,
      session: null,
      initialize: () => {
        console.log("\u{1F527} Initializing AR engine...");
        this.arEngine.isInitialized = true;
      },
      startSession: (device) => {
        console.log(`\u{1F680} Starting AR session on ${device.name}`);
        return {
          id: `session_${Date.now()}`,
          device,
          isActive: true
        };
      },
      stopSession: (sessionId) => {
        console.log(`\u{1F6D1} Stopping AR session: ${sessionId}`);
      }
    };
  }
  // Initialize tracking system
  initializeTrackingSystem() {
    this.trackingSystem = {
      isTracking: false,
      trackingQuality: "high",
      detectedAnchors: [],
      startTracking: () => {
        console.log("\u{1F3AF} Starting AR tracking...");
        this.trackingSystem.isTracking = true;
      },
      stopTracking: () => {
        console.log("\u{1F6D1} Stopping AR tracking...");
        this.trackingSystem.isTracking = false;
      },
      detectPlanes: () => {
        return [
          {
            id: "plane_floor",
            type: "horizontal",
            position: Vector32.create(0, 0, 0),
            size: Vector32.create(10, 0, 10)
          },
          {
            id: "plane_wall",
            type: "vertical",
            position: Vector32.create(0, 2, -5),
            size: Vector32.create(10, 4, 0)
          }
        ];
      },
      detectImages: () => {
        return [
          {
            id: "image_logo",
            position: Vector32.create(2, 1, 0),
            confidence: 0.95
          }
        ];
      }
    };
  }
  // Initialize rendering system
  initializeRenderingSystem() {
    this.renderingSystem = {
      isRendering: false,
      frameRate: 60,
      resolution: { width: 1920, height: 1080 },
      startRendering: () => {
        console.log("\u{1F3A8} Starting AR rendering...");
        this.renderingSystem.isRendering = true;
      },
      stopRendering: () => {
        console.log("\u{1F6D1} Stopping AR rendering...");
        this.renderingSystem.isRendering = false;
      },
      renderFrame: (overlays) => {
        overlays.forEach((overlay) => {
          if (overlay.isVisible) {
            console.log(`\u{1F3A8} Rendering overlay: ${overlay.type}`);
          }
        });
      }
    };
  }
  // Setup AR devices
  setupARDevices() {
    const smartphone = {
      id: "device_smartphone",
      name: "Smartphone AR",
      type: "smartphone",
      isConnected: false,
      position: Vector32.create(0, 0, 0),
      rotation: Quaternion2.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 60,
        aspectRatio: 16 / 9,
        nearPlane: 0.1,
        farPlane: 100,
        trackingMode: "world"
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: false,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 20
      }
    };
    const tablet = {
      id: "device_tablet",
      name: "Tablet AR",
      type: "tablet",
      isConnected: false,
      position: Vector32.create(0, 0, 0),
      rotation: Quaternion2.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 45,
        aspectRatio: 4 / 3,
        nearPlane: 0.1,
        farPlane: 100,
        trackingMode: "world"
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: false,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 30
      }
    };
    const arGlasses = {
      id: "device_ar_glasses",
      name: "AR Glasses",
      type: "ar_glasses",
      isConnected: false,
      position: Vector32.create(0, 0, 0),
      rotation: Quaternion2.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 50,
        aspectRatio: 16 / 9,
        nearPlane: 0.05,
        farPlane: 50,
        trackingMode: "world"
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: true,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 50
      }
    };
    this.devices.set(smartphone.id, smartphone);
    this.devices.set(tablet.id, tablet);
    this.devices.set(arGlasses.id, arGlasses);
    console.log("\u{1F4F1} AR devices configured");
  }
  // Create AR UI
  createARUI() {
    this.arUI = engine.addEntity();
    Transform2.create(this.arUI, {
      position: Vector32.create(14, 3, 8),
      scale: Vector32.create(3, 4, 0.1)
    });
    MeshRenderer3.setBox(this.arUI);
    Material3.setPbrMaterial(this.arUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.arUI,
      position: Vector32.create(0, 1.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F4F1} AR OVERLAY SYSTEM",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createDeviceSelection();
    this.createSessionControls();
    this.createOverlayControls();
    this.createStatusDisplay();
  }
  // Create device selection
  createDeviceSelection() {
    const deviceSection = engine.addEntity();
    Transform2.create(deviceSection, {
      parent: this.arUI,
      position: Vector32.create(0, 1.2, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(deviceSection);
    Material3.setPbrMaterial(deviceSection, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const deviceText = engine.addEntity();
    Transform2.create(deviceText, {
      parent: deviceSection,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(deviceText, {
      text: "\u{1F4F1} Select Device",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
    let xOffset = -0.6;
    this.devices.forEach((device, id) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.arUI,
        position: Vector32.create(xOffset, 0.8, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: device.isConnected ? Color42.create(0.2, 0.8, 0.2, 1) : Color42.create(0.8, 0.2, 0.2, 1),
        emissiveColor: device.isConnected ? Color42.create(0.2, 0.8, 0.2, 0.5) : Color42.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: device.type === "smartphone" ? "\u{1F4F1}" : device.type === "tablet" ? "\u{1F4F1}" : "\u{1F97D}",
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: device.name }
        },
        () => this.connectDevice(id)
      );
      xOffset += 0.6;
    });
  }
  // Create session controls
  createSessionControls() {
    const controls = [
      { id: "start", icon: "\u25B6\uFE0F", name: "Start Session" },
      { id: "stop", icon: "\u23F9\uFE0F", name: "Stop Session" },
      { id: "reset", icon: "\u{1F504}", name: "Reset Tracking" }
    ];
    let xOffset = -0.8;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.arUI,
        position: Vector32.create(xOffset, 0.4, 0.1),
        scale: Vector32.create(0.25, 0.25, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleSessionControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Create overlay controls
  createOverlayControls() {
    const overlayTypes = [
      { id: "ui", icon: "\u{1F5BC}\uFE0F", name: "UI Overlay" },
      { id: "3d", icon: "\u{1F3AE}", name: "3D Model" },
      { id: "text", icon: "\u{1F4DD}", name: "Text" },
      { id: "data", icon: "\u{1F4CA}", name: "Data" }
    ];
    let xOffset = -0.9;
    overlayTypes.forEach((type) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.arUI,
        position: Vector32.create(xOffset, 0, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.6, 0.3, 0.8, 1),
        emissiveColor: Color42.create(0.6, 0.3, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: type.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: type.name }
        },
        () => this.createOverlay(type.id)
      );
      xOffset += 0.6;
    });
  }
  // Create status display
  createStatusDisplay() {
    const statusDisplay = engine.addEntity();
    Transform2.create(statusDisplay, {
      parent: this.arUI,
      position: Vector32.create(0, -0.4, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(statusDisplay);
    Material3.setPbrMaterial(statusDisplay, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const statusText = engine.addEntity();
    Transform2.create(statusText, {
      parent: statusDisplay,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(statusText, {
      text: "\u{1F4CA} Status: Ready",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Start AR engine
  startAREngine() {
    this.arEngine.initialize();
    this.trackingSystem.startTracking();
    this.renderingSystem.startRendering();
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateARSession();
      this.processOverlays();
      this.updateTracking();
    });
  }
  // Setup AR interactions
  setupARInteractions() {
  }
  // Connect device
  connectDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device)
      return;
    device.isConnected = true;
    console.log(`\u{1F4F1} Connected to ${device.name}`);
    this.startARSession(device);
    soundSystem.playInteractionSound("powerup");
  }
  // Disconnect device
  disconnectDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device)
      return;
    device.isConnected = false;
    console.log(`\u{1F4F1} Disconnected from ${device.name}`);
    if (this.currentSession && this.currentSession.device.id === deviceId) {
      this.stopARSession();
    }
    soundSystem.playInteractionSound("click");
  }
  // Start AR session
  startARSession(device) {
    const sessionData = this.arEngine.startSession(device);
    const session = {
      id: sessionData.id,
      device,
      isActive: true,
      anchors: /* @__PURE__ */ new Map(),
      overlays: /* @__PURE__ */ new Map(),
      trackingQuality: "high",
      planeDetection: true,
      lightEstimation: true
    };
    this.sessions.set(session.id, session);
    this.currentSession = session;
    console.log(`\u{1F680} AR session started: ${session.id}`);
    this.startAnchorDetection();
  }
  // Stop AR session
  stopARSession() {
    if (!this.currentSession)
      return;
    this.arEngine.stopSession(this.currentSession.id);
    this.sessions.delete(this.currentSession.id);
    this.currentSession = null;
    console.log("\u{1F6D1} AR session stopped");
  }
  // Start anchor detection
  startAnchorDetection() {
    if (!this.currentSession)
      return;
    if (this.currentSession.device.capabilities.supportsPlaneDetection) {
      const planes = this.trackingSystem.detectPlanes();
      planes.forEach((plane) => {
        const anchor = {
          id: plane.id,
          type: "plane",
          position: plane.position,
          rotation: Quaternion2.fromEulerDegrees(0, 0, 0),
          confidence: 0.9,
          trackingState: "tracking"
        };
        this.currentSession.anchors.set(anchor.id, anchor);
      });
    }
    if (this.currentSession.device.capabilities.supportsImageTracking) {
      const images = this.trackingSystem.detectImages();
      images.forEach((image) => {
        const anchor = {
          id: image.id,
          type: "image",
          position: image.position,
          rotation: Quaternion2.fromEulerDegrees(0, 0, 0),
          confidence: image.confidence,
          trackingState: "tracking"
        };
        this.currentSession.anchors.set(anchor.id, anchor);
      });
    }
  }
  // Handle session control
  handleSessionControl(controlId) {
    switch (controlId) {
      case "start":
        if (this.currentSession) {
          console.log("\u{1F680} Session already active");
        } else {
          const firstDevice = Array.from(this.devices.values())[0];
          if (firstDevice) {
            this.connectDevice(firstDevice.id);
          }
        }
        break;
      case "stop":
        this.stopARSession();
        break;
      case "reset":
        this.resetTracking();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Create overlay
  createOverlay(type) {
    if (!this.currentSession) {
      console.log("\u274C No active AR session");
      return;
    }
    const overlay = {
      id: `overlay_${Date.now()}`,
      type,
      content: this.generateOverlayContent(type),
      position: Vector32.create(
        Math.random() * 4 - 2,
        Math.random() * 2 + 1,
        Math.random() * 2 - 1
      ),
      rotation: Quaternion2.fromEulerDegrees(0, Math.random() * 360, 0),
      scale: Vector32.create(1, 1, 1),
      anchorType: "world",
      isVisible: true,
      isInteractive: true
    };
    this.overlays.set(overlay.id, overlay);
    this.currentSession.overlays.set(overlay.id, overlay);
    console.log(`\u{1F3A8} Created ${type} overlay: ${overlay.id}`);
    soundSystem.playInteractionSound("click");
  }
  // Generate overlay content
  generateOverlayContent(type) {
    switch (type) {
      case "ui":
        return {
          title: "AR UI Panel",
          elements: ["Button", "Slider", "Text"],
          layout: "vertical"
        };
      case "3d":
        return {
          model: "cube",
          material: "metallic",
          animations: ["rotate", "pulse"]
        };
      case "text":
        return {
          text: "Hello AR World!",
          fontSize: 24,
          color: "#FFFFFF",
          font: "Arial"
        };
      case "data":
        return {
          chartType: "bar",
          data: [10, 20, 30, 40, 50],
          labels: ["A", "B", "C", "D", "E"]
        };
      default:
        return {};
    }
  }
  // Update AR session
  updateARSession() {
    if (!this.currentSession)
      return;
    const time = Date.now() / 1e3;
    const quality = Math.sin(time * 0.5) > 0 ? "high" : "medium";
    this.currentSession.trackingQuality = quality;
    const device = this.currentSession.device;
    device.position = Vector32.create(
      Math.sin(time * 0.3) * 0.5,
      Math.cos(time * 0.2) * 0.2,
      Math.sin(time * 0.4) * 0.3
    );
  }
  // Process overlays
  processOverlays() {
    if (!this.currentSession)
      return;
    const overlays = Array.from(this.currentSession.overlays.values());
    this.renderingSystem.renderFrame(overlays);
    overlays.forEach((overlay) => {
      if (overlay.isVisible) {
        const time = Date.now() / 1e3;
        overlay.position.y += Math.sin(time * 2 + parseInt(overlay.id)) * 1e-3;
      }
    });
  }
  // Update tracking
  updateTracking() {
    if (!this.currentSession)
      return;
    this.currentSession.anchors.forEach((anchor) => {
      if (Math.random() < 0.01) {
        anchor.trackingState = anchor.trackingState === "tracking" ? "limited" : "tracking";
      }
    });
    if (Math.random() < 5e-3) {
      this.startAnchorDetection();
    }
  }
  // Reset tracking
  resetTracking() {
    if (!this.currentSession)
      return;
    console.log("\u{1F504} Resetting AR tracking...");
    this.currentSession.anchors.clear();
    this.startAnchorDetection();
    soundSystem.playInteractionSound("powerup");
  }
  // Get current session
  getCurrentSession() {
    return this.currentSession;
  }
  // Get all devices
  getDevices() {
    return Array.from(this.devices.values());
  }
  // Get connected devices
  getConnectedDevices() {
    return Array.from(this.devices.values()).filter((device) => device.isConnected);
  }
  // Get overlays
  getOverlays() {
    return Array.from(this.overlays.values());
  }
  // Update overlay visibility
  setOverlayVisibility(overlayId, isVisible) {
    const overlay = this.overlays.get(overlayId);
    if (overlay) {
      overlay.isVisible = isVisible;
      console.log(`\u{1F441}\uFE0F Overlay ${overlayId} ${isVisible ? "shown" : "hidden"}`);
    }
  }
  // Update overlay position
  updateOverlayPosition(overlayId, position) {
    const overlay = this.overlays.get(overlayId);
    if (overlay) {
      overlay.position = position;
      console.log(`\u{1F4CD} Moved overlay ${overlayId} to position`);
    }
  }
  // Remove overlay
  removeOverlay(overlayId) {
    const overlay = this.overlays.get(overlayId);
    if (overlay) {
      this.overlays.delete(overlayId);
      if (this.currentSession) {
        this.currentSession.overlays.delete(overlayId);
      }
      console.log(`\u{1F5D1}\uFE0F Removed overlay: ${overlayId}`);
    }
  }
  // Cleanup system
  cleanup() {
    this.stopARSession();
    this.devices.clear();
    this.sessions.clear();
    this.overlays.clear();
    if (this.arUI) {
      engine.removeEntity(this.arUI);
    }
    this.trackingSystem.stopTracking();
    this.renderingSystem.stopRendering();
    this.isInitialized = false;
  }
};
var arIntegrationSystem = new ARIntegrationSystem();

// src/avatar-system.ts
var AvatarSystem = class {
  constructor() {
    this.avatarParts = /* @__PURE__ */ new Map();
    this.presets = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.currentAvatar = this.createDefaultAvatar();
    this.animationState = {
      currentAnimation: "idle",
      isPlaying: true,
      speed: 1,
      loop: true
    };
  }
  // Initialize avatar system
  initialize() {
    console.log("\u{1F464} Avatar System Initializing...");
    this.loadAvatarPresets();
    this.createAvatar();
    this.createCustomizationUI();
    this.setupAvatarAnimations();
    this.isInitialized = true;
    console.log("\u{1F464} Avatar System Ready!");
  }
  // Create default avatar
  createDefaultAvatar() {
    return {
      id: "default",
      name: "Default Avatar",
      bodyType: "humanoid",
      primaryColor: Color32.create(0.3, 0.5, 0.8),
      secondaryColor: Color32.create(0.8, 0.6, 0.2),
      accessories: [],
      animations: ["idle", "walk", "wave", "dance"],
      effects: [],
      scale: Vector32.create(1, 2, 1),
      position: Vector32.create(8, 1, 8)
    };
  }
  // Load avatar presets
  loadAvatarPresets() {
    const presets = [
      {
        id: "professional",
        name: "Professional",
        category: "professional",
        thumbnail: "\u{1F454}",
        customization: {
          id: "professional",
          name: "Professional Avatar",
          bodyType: "humanoid",
          primaryColor: Color32.create(0.2, 0.3, 0.6),
          secondaryColor: Color32.create(0.8, 0.8, 0.8),
          accessories: ["tie", "briefcase"],
          animations: ["idle", "walk", "type", "present"],
          effects: [],
          scale: Vector32.create(1, 2, 1),
          position: Vector32.create(8, 1, 8)
        }
      },
      {
        id: "cyberpunk",
        name: "Cyberpunk",
        category: "futuristic",
        thumbnail: "\u{1F916}",
        customization: {
          id: "cyberpunk",
          name: "Cyberpunk Avatar",
          bodyType: "cyborg",
          primaryColor: Color32.create(0.8, 0.2, 0.8),
          secondaryColor: Color32.create(0.2, 0.8, 0.8),
          accessories: ["helmet", "armor", "glowing-eyes"],
          animations: ["idle", "walk", "hack", "transform"],
          effects: [
            { type: "glow", intensity: 0.8, color: Color32.create(0.8, 0.2, 0.8), enabled: true },
            { type: "particles", intensity: 0.5, color: Color32.create(0.2, 0.8, 0.8), enabled: true }
          ],
          scale: Vector32.create(1.1, 2.1, 1.1),
          position: Vector32.create(8, 1, 8)
        }
      },
      {
        id: "energy",
        name: "Energy Being",
        category: "futuristic",
        thumbnail: "\u2728",
        customization: {
          id: "energy",
          name: "Energy Being",
          bodyType: "energy",
          primaryColor: Color32.create(0.8, 0.8, 1),
          secondaryColor: Color32.create(1, 0.8, 0.8),
          accessories: ["energy-orbs"],
          animations: ["idle", "float", "pulse", "teleport"],
          effects: [
            { type: "glow", intensity: 1, color: Color32.create(0.8, 0.8, 1), enabled: true },
            { type: "particles", intensity: 0.8, color: Color32.create(1, 0.8, 0.8), enabled: true },
            { type: "hologram", intensity: 0.6, color: Color32.create(0.8, 1, 0.8), enabled: true }
          ],
          scale: Vector32.create(0.9, 2.2, 0.9),
          position: Vector32.create(8, 1, 8)
        }
      },
      {
        id: "artist",
        name: "Artist",
        category: "artistic",
        thumbnail: "\u{1F3A8}",
        customization: {
          id: "artist",
          name: "Artist Avatar",
          bodyType: "humanoid",
          primaryColor: Color32.create(0.8, 0.4, 0.2),
          secondaryColor: Color32.create(0.2, 0.8, 0.4),
          accessories: ["beret", "palette"],
          animations: ["idle", "walk", "paint", "dance"],
          effects: [
            { type: "particles", intensity: 0.3, color: Color32.create(0.8, 0.4, 0.2), enabled: true }
          ],
          scale: Vector32.create(1, 2, 1),
          position: Vector32.create(8, 1, 8)
        }
      }
    ];
    presets.forEach((preset) => {
      this.presets.set(preset.id, preset);
    });
  }
  // Create avatar entity
  createAvatar() {
    this.avatarEntity = engine.addEntity();
    Transform2.create(this.avatarEntity, {
      position: this.currentAvatar.position,
      scale: this.currentAvatar.scale,
      rotation: Quaternion2.fromEulerDegrees(0, 0, 0)
    });
    this.createAvatarBody();
    this.createAvatarAccessories();
    this.applyAvatarEffects();
  }
  // Create avatar body based on type
  createAvatarBody() {
    const body = engine.addEntity();
    Transform2.create(body, {
      parent: this.avatarEntity,
      position: Vector32.create(0, 0, 0),
      scale: Vector32.create(0.8, 1.6, 0.4)
    });
    switch (this.currentAvatar.bodyType) {
      case "humanoid":
        MeshRenderer3.setBox(body);
        Material3.setPbrMaterial(body, {
          albedoColor: Color42.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.3,
          metallic: 0.1
        });
        break;
      case "robot":
        MeshRenderer3.setBox(body);
        Material3.setPbrMaterial(body, {
          albedoColor: Color42.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.1,
          metallic: 0.9,
          emissiveColor: Color42.create(
            this.currentAvatar.primaryColor.r * 0.3,
            this.currentAvatar.primaryColor.g * 0.3,
            this.currentAvatar.primaryColor.b * 0.3,
            0.5
          ),
          emissiveIntensity: 2
        });
        break;
      case "cyborg":
        MeshRenderer3.setBox(body);
        Material3.setPbrMaterial(body, {
          albedoColor: Color42.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.2,
          metallic: 0.7,
          emissiveColor: Color42.create(
            this.currentAvatar.secondaryColor.r * 0.5,
            this.currentAvatar.secondaryColor.g * 0.5,
            this.currentAvatar.secondaryColor.b * 0.5,
            0.6
          ),
          emissiveIntensity: 3
        });
        break;
      case "energy":
        MeshRenderer3.setSphere(body);
        Material3.setPbrMaterial(body, {
          albedoColor: Color42.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            0.6
          ),
          roughness: 0,
          metallic: 1,
          emissiveColor: Color42.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          emissiveIntensity: 5
        });
        break;
    }
    this.avatarParts.set("body", body);
    this.createAvatarHead();
  }
  // Create avatar head
  createAvatarHead() {
    const head = engine.addEntity();
    Transform2.create(head, {
      parent: this.avatarEntity,
      position: Vector32.create(0, 1.2, 0),
      scale: Vector32.create(0.4, 0.4, 0.4)
    });
    if (this.currentAvatar.bodyType === "energy") {
      MeshRenderer3.setSphere(head);
    } else {
      MeshRenderer3.setBox(head);
    }
    Material3.setPbrMaterial(head, {
      albedoColor: Color42.create(
        this.currentAvatar.secondaryColor.r,
        this.currentAvatar.secondaryColor.g,
        this.currentAvatar.secondaryColor.b,
        1
      ),
      roughness: 0.2,
      metallic: 0.1
    });
    this.avatarParts.set("head", head);
  }
  // Create avatar accessories
  createAvatarAccessories() {
    this.currentAvatar.accessories.forEach((accessory) => {
      this.createAccessory(accessory);
    });
  }
  // Create individual accessory
  createAccessory(accessory) {
    const accessoryEntity = engine.addEntity();
    switch (accessory) {
      case "tie":
        Transform2.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: Vector32.create(0, 0.2, 0.21),
          scale: Vector32.create(0.1, 0.8, 0.05)
        });
        MeshRenderer3.setBox(accessoryEntity);
        Material3.setPbrMaterial(accessoryEntity, {
          albedoColor: Color42.create(0.8, 0.2, 0.2, 1),
          roughness: 0.1,
          metallic: 0.1
        });
        break;
      case "helmet":
        Transform2.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: Vector32.create(0, 1.6, 0),
          scale: Vector32.create(0.5, 0.3, 0.5)
        });
        MeshRenderer3.setBox(accessoryEntity);
        Material3.setPbrMaterial(accessoryEntity, {
          albedoColor: Color42.create(0.3, 0.3, 0.3, 1),
          roughness: 0.1,
          metallic: 0.9,
          emissiveColor: Color42.create(0.2, 0.2, 0.8, 0.5),
          emissiveIntensity: 2
        });
        break;
      case "energy-orbs":
        for (let i = 0; i < 3; i++) {
          const orb = engine.addEntity();
          Transform2.create(orb, {
            parent: this.avatarEntity,
            position: Vector32.create(
              Math.cos(i * 120 * Math.PI / 180) * 0.8,
              1 + Math.sin(i * 120 * Math.PI / 180) * 0.3,
              Math.sin(i * 120 * Math.PI / 180) * 0.8
            ),
            scale: Vector32.create(0.1, 0.1, 0.1)
          });
          MeshRenderer3.setSphere(orb);
          Material3.setPbrMaterial(orb, {
            albedoColor: Color42.create(1, 0.8, 0.2, 0.8),
            emissiveColor: Color42.create(1, 0.8, 0.2, 1),
            emissiveIntensity: 4
          });
          this.avatarParts.set(`orb_${i}`, orb);
        }
        break;
      case "beret":
        Transform2.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: Vector32.create(0, 1.45, 0),
          scale: Vector32.create(0.5, 0.1, 0.5)
        });
        MeshRenderer3.setBox(accessoryEntity);
        Material3.setPbrMaterial(accessoryEntity, {
          albedoColor: Color42.create(0.8, 0.2, 0.2, 1),
          roughness: 0.3,
          metallic: 0.1
        });
        break;
    }
    this.avatarParts.set(accessory, accessoryEntity);
  }
  // Apply avatar effects
  applyAvatarEffects() {
    this.currentAvatar.effects.forEach((effect) => {
      if (effect.enabled) {
        this.createEffect(effect);
      }
    });
  }
  // Create individual effect
  createEffect(effect) {
    switch (effect.type) {
      case "glow":
        this.createGlowEffect(effect);
        break;
      case "particles":
        this.createParticleEffect(effect);
        break;
      case "hologram":
        this.createHologramEffect(effect);
        break;
    }
  }
  // Create glow effect
  createGlowEffect(effect) {
    const glow = engine.addEntity();
    Transform2.create(glow, {
      parent: this.avatarEntity,
      position: Vector32.create(0, 1, 0),
      scale: Vector32.create(1.5, 2.5, 1.5)
    });
    MeshRenderer3.setSphere(glow);
    Material3.setPbrMaterial(glow, {
      albedoColor: Color42.create(effect.color.r, effect.color.g, effect.color.b, 0.3),
      emissiveColor: Color42.create(effect.color.r, effect.color.g, effect.color.b, 0.8),
      emissiveIntensity: effect.intensity * 3
    });
    this.avatarParts.set("glow", glow);
  }
  // Create particle effect
  createParticleEffect(effect) {
    for (let i = 0; i < 20; i++) {
      const particle = engine.addEntity();
      Transform2.create(particle, {
        parent: this.avatarEntity,
        position: Vector32.create(
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        ),
        scale: Vector32.create(0.05, 0.05, 0.05)
      });
      MeshRenderer3.setSphere(particle);
      Material3.setPbrMaterial(particle, {
        albedoColor: Color42.create(effect.color.r, effect.color.g, effect.color.b, 0.8),
        emissiveColor: Color42.create(effect.color.r, effect.color.g, effect.color.b, 1),
        emissiveIntensity: effect.intensity * 2
      });
      this.avatarParts.set(`particle_${i}`, particle);
    }
  }
  // Create hologram effect
  createHologramEffect(effect) {
    const hologram = engine.addEntity();
    Transform2.create(hologram, {
      parent: this.avatarEntity,
      position: Vector32.create(0, 0, 0),
      scale: Vector32.create(1.1, 2.1, 1.1)
    });
    MeshRenderer3.setBox(hologram);
    Material3.setPbrMaterial(hologram, {
      albedoColor: Color42.create(effect.color.r, effect.color.g, effect.color.b, 0.2),
      emissiveColor: Color42.create(effect.color.r, effect.color.g, effect.color.b, 0.6),
      emissiveIntensity: effect.intensity * 2
    });
    this.avatarParts.set("hologram", hologram);
  }
  // Create customization UI
  createCustomizationUI() {
    const uiPanel = engine.addEntity();
    Transform2.create(uiPanel, {
      position: Vector32.create(14, 3, 8),
      scale: Vector32.create(3, 4, 0.1)
    });
    MeshRenderer3.setBox(uiPanel);
    Material3.setPbrMaterial(uiPanel, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: uiPanel,
      position: Vector32.create(0, 1.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(title, {
      text: "\u{1F464} AVATAR CUSTOMIZE",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createPresetButtons(uiPanel);
    this.createColorCustomization(uiPanel);
    this.createEffectToggles(uiPanel);
    this.customizationUI = uiPanel;
  }
  // Create preset buttons
  createPresetButtons(parent) {
    let yOffset = 1.2;
    this.presets.forEach((preset, index) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent,
        position: Vector32.create(0, yOffset, 0.1),
        scale: Vector32.create(0.4, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.2, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.2, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape3.create(buttonText, {
        text: `${preset.thumbnail} ${preset.name}`,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Select ${preset.name}` }
        },
        () => this.applyPreset(preset.id)
      );
      yOffset -= 0.4;
    });
  }
  // Create color customization
  createColorCustomization(parent) {
    const colorPanel = engine.addEntity();
    Transform2.create(colorPanel, {
      parent,
      position: Vector32.create(0, -0.5, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(colorPanel);
    Material3.setPbrMaterial(colorPanel, {
      albedoColor: Color42.create(0.3, 0.3, 0.3, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const colorText = engine.addEntity();
    Transform2.create(colorText, {
      parent: colorPanel,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.5, 0.5, 0.5)
    });
    TextShape3.create(colorText, {
      text: "\u{1F3A8} COLORS",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create effect toggles
  createEffectToggles(parent) {
    const effectPanel = engine.addEntity();
    Transform2.create(effectPanel, {
      parent,
      position: Vector32.create(0, -1.2, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(effectPanel);
    Material3.setPbrMaterial(effectPanel, {
      albedoColor: Color42.create(0.3, 0.3, 0.3, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const effectText = engine.addEntity();
    Transform2.create(effectText, {
      parent: effectPanel,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.5, 0.5, 0.5)
    });
    TextShape3.create(effectText, {
      text: "\u2728 EFFECTS",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Setup avatar animations
  setupAvatarAnimations() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateAnimations();
      this.updateEffects();
    });
  }
  // Update animations
  updateAnimations() {
    if (!this.animationState.isPlaying)
      return;
    const time = Date.now() / 1e3;
    const body = this.avatarParts.get("body");
    if (body) {
      switch (this.animationState.currentAnimation) {
        case "idle":
          const idleBob = Math.sin(time * 2) * 0.02;
          const transform = Transform2.getMutable(body);
          transform.position.y = idleBob;
          break;
        case "walk":
          const walkBob = Math.abs(Math.sin(time * 4)) * 0.05;
          const walkTransform = Transform2.getMutable(body);
          walkTransform.position.y = walkBob;
          walkTransform.rotation = Quaternion2.fromEulerDegrees(
            Math.sin(time * 4) * 5,
            0,
            0
          );
          break;
        case "dance":
          const danceTransform = Transform2.getMutable(body);
          danceTransform.rotation = Quaternion2.fromEulerDegrees(
            Math.sin(time * 3) * 10,
            Math.cos(time * 2) * 15,
            Math.sin(time * 4) * 5
          );
          break;
        case "float":
          const floatTransform = Transform2.getMutable(body);
          floatTransform.position.y = Math.sin(time * 1.5) * 0.1;
          break;
      }
    }
  }
  // Update effects
  updateEffects() {
    this.avatarParts.forEach((part, key) => {
      if (key.startsWith("particle_")) {
        const time = Date.now() / 1e3;
        const transform = Transform2.getMutable(part);
        transform.position.y += Math.sin(time + parseInt(key.split("_")[1])) * 0.01;
      }
      if (key.startsWith("orb_")) {
        const time = Date.now() / 1e3;
        const index = parseInt(key.split("_")[1]);
        const radius = 0.8 + Math.sin(time * 2 + index * 120 * Math.PI / 180) * 0.2;
        const transform = Transform2.getMutable(part);
        transform.position.x = Math.cos(time + index * 120 * Math.PI / 180) * radius;
        transform.position.z = Math.sin(time + index * 120 * Math.PI / 180) * radius;
      }
    });
  }
  // Apply preset
  applyPreset(presetId) {
    const preset = this.presets.get(presetId);
    if (!preset)
      return;
    console.log(`\u{1F464} Applying preset: ${preset.name}`);
    soundSystem.playInteractionSound("powerup");
    this.clearCurrentAvatar();
    this.currentAvatar = { ...preset.customization };
    this.createAvatar();
  }
  // Clear current avatar
  clearCurrentAvatar() {
    this.avatarParts.forEach((part) => {
      engine.removeEntity(part);
    });
    this.avatarParts.clear();
  }
  // Play animation
  playAnimation(animationName) {
    if (this.currentAvatar.animations.includes(animationName)) {
      this.animationState.currentAnimation = animationName;
      this.animationState.isPlaying = true;
      console.log(`\u{1F3AC} Playing animation: ${animationName}`);
    }
  }
  // Stop animation
  stopAnimation() {
    this.animationState.isPlaying = false;
  }
  // Get current avatar customization
  getCurrentAvatar() {
    return { ...this.currentAvatar };
  }
  // Get available presets
  getAvailablePresets() {
    return Array.from(this.presets.values());
  }
  // Customize avatar colors
  customizeColors(primaryColor, secondaryColor) {
    this.currentAvatar.primaryColor = primaryColor;
    this.currentAvatar.secondaryColor = secondaryColor;
    const body = this.avatarParts.get("body");
    if (body) {
      const material = Material3.getMutable(body);
      if (material && material.$case === "pbr") {
        material.pbr.albedoColor = Color42.create(primaryColor.r, primaryColor.g, primaryColor.b, 1);
      }
    }
    const head = this.avatarParts.get("head");
    if (head) {
      const material = Material3.getMutable(head);
      if (material && material.$case === "pbr") {
        material.pbr.albedoColor = Color42.create(secondaryColor.r, secondaryColor.g, secondaryColor.b, 1);
      }
    }
  }
  // Add accessory
  addAccessory(accessory) {
    if (!this.currentAvatar.accessories.includes(accessory)) {
      this.currentAvatar.accessories.push(accessory);
      this.createAccessory(accessory);
      soundSystem.playInteractionSound("click");
    }
  }
  // Remove accessory
  removeAccessory(accessory) {
    const index = this.currentAvatar.accessories.indexOf(accessory);
    if (index > -1) {
      this.currentAvatar.accessories.splice(index, 1);
      const part = this.avatarParts.get(accessory);
      if (part) {
        engine.removeEntity(part);
        this.avatarParts.delete(accessory);
      }
      soundSystem.playInteractionSound("click");
    }
  }
  // Toggle effect
  toggleEffect(effectType) {
    const effect = this.currentAvatar.effects.find((e) => e.type === effectType);
    if (effect) {
      effect.enabled = !effect.enabled;
      if (effect.enabled) {
        this.createEffect(effect);
      } else {
        this.avatarParts.forEach((part, key) => {
          if (key.startsWith(effectType)) {
            engine.removeEntity(part);
            this.avatarParts.delete(key);
          }
        });
      }
      soundSystem.playInteractionSound("click");
    }
  }
  // Cleanup system
  cleanup() {
    this.clearCurrentAvatar();
    if (this.avatarEntity) {
      engine.removeEntity(this.avatarEntity);
    }
    if (this.customizationUI) {
      engine.removeEntity(this.customizationUI);
    }
    this.presets.clear();
    this.isInitialized = false;
  }
};
var avatarSystem = new AvatarSystem();

// src/blockchain-integration.ts
var BlockchainIntegrationSystem = class {
  constructor() {
    this.wallets = /* @__PURE__ */ new Map();
    this.assets = /* @__PURE__ */ new Map();
    this.transactions = /* @__PURE__ */ new Map();
    this.contracts = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.currentWallet = null;
    this.supportedChains = ["ethereum", "polygon", "arbitrum", "optimism"];
    this.gasPrices = /* @__PURE__ */ new Map();
    this.initializeGasPrices();
  }
  // Initialize blockchain system
  initialize() {
    console.log("\u26D3\uFE0F Blockchain Integration System Initializing...");
    this.setupSmartContracts();
    this.createBlockchainUI();
    this.createDefaultWallet();
    this.initializeBlockchainConnection();
    this.startBlockchainEngine();
    this.isInitialized = true;
    console.log("\u26D3\uFE0F Blockchain Integration System Ready!");
  }
  // Initialize gas prices
  initializeGasPrices() {
    this.gasPrices.set("ethereum", 20);
    this.gasPrices.set("polygon", 30);
    this.gasPrices.set("arbitrum", 0.1);
    this.gasPrices.set("optimism", 0.1);
  }
  // Setup smart contracts
  setupSmartContracts() {
    this.contracts.set("asset_registry", {
      id: "asset_registry",
      name: "Asset Registry",
      address: "0x1234567890123456789012345678901234567890",
      abi: [],
      functions: /* @__PURE__ */ new Map([
        ["mintAsset", {
          name: "mintAsset",
          inputs: [
            { name: "to", type: "address" },
            { name: "uri", type: "string" }
          ],
          outputs: [{ name: "tokenId", type: "uint256" }],
          isPayable: false,
          isView: false
        }],
        ["transferAsset", {
          name: "transferAsset",
          inputs: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "tokenId", type: "uint256" }
          ],
          outputs: [],
          isPayable: false,
          isView: false
        }]
      ]),
      isActive: true
    });
    this.contracts.set("certificate", {
      id: "certificate",
      name: "Certificate Registry",
      address: "0x2345678901234567890123456789012345678901",
      abi: [],
      functions: /* @__PURE__ */ new Map([
        ["issueCertificate", {
          name: "issueCertificate",
          inputs: [
            { name: "recipient", type: "address" },
            { name: "metadata", type: "string" }
          ],
          outputs: [{ name: "certificateId", type: "uint256" }],
          isPayable: false,
          isView: false
        }],
        ["verifyCertificate", {
          name: "verifyCertificate",
          inputs: [
            { name: "certificateId", type: "uint256" }
          ],
          outputs: [{ name: "isValid", type: "bool" }],
          isPayable: false,
          isView: true
        }]
      ]),
      isActive: true
    });
    this.contracts.set("badge", {
      id: "badge",
      name: "Achievement Badges",
      address: "0x3456789012345678901234567890123456789012",
      abi: [],
      functions: /* @__PURE__ */ new Map([
        ["awardBadge", {
          name: "awardBadge",
          inputs: [
            { name: "user", type: "address" },
            { name: "badgeType", type: "uint256" }
          ],
          outputs: [],
          isPayable: false,
          isView: false
        }],
        ["getUserBadges", {
          name: "getUserBadges",
          inputs: [
            { name: "user", type: "address" }
          ],
          outputs: [{ name: "badgeIds", type: "uint256[]" }],
          isPayable: false,
          isView: true
        }]
      ]),
      isActive: true
    });
  }
  // Create blockchain UI
  createBlockchainUI() {
    this.blockchainUI = engine.addEntity();
    Transform2.create(this.blockchainUI, {
      position: Vector32.create(2, 3, 8),
      scale: Vector32.create(3, 4, 0.1)
    });
    MeshRenderer3.setBox(this.blockchainUI);
    Material3.setPbrMaterial(this.blockchainUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.blockchainUI,
      position: Vector32.create(0, 1.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u26D3\uFE0F BLOCKCHAIN ASSETS",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createWalletSection();
    this.createAssetsSection();
    this.createTransactionsSection();
    this.createBlockchainControls();
  }
  // Create wallet section
  createWalletSection() {
    const walletSection = engine.addEntity();
    Transform2.create(walletSection, {
      parent: this.blockchainUI,
      position: Vector32.create(0, 1.2, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(walletSection);
    Material3.setPbrMaterial(walletSection, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const walletText = engine.addEntity();
    Transform2.create(walletText, {
      parent: walletSection,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(walletText, {
      text: "\u{1F45B} WALLET: Not Connected",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create assets section
  createAssetsSection() {
    const assetsSection = engine.addEntity();
    Transform2.create(assetsSection, {
      parent: this.blockchainUI,
      position: Vector32.create(0, 0.5, 0.1),
      scale: Vector32.create(0.8, 0.4, 0.1)
    });
    MeshRenderer3.setBox(assetsSection);
    Material3.setPbrMaterial(assetsSection, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const assetsText = engine.addEntity();
    Transform2.create(assetsText, {
      parent: assetsSection,
      position: Vector32.create(0, 0.1, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(assetsText, {
      text: "\u{1F3A8} ASSETS: 0",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create transactions section
  createTransactionsSection() {
    const transactionsSection = engine.addEntity();
    Transform2.create(transactionsSection, {
      parent: this.blockchainUI,
      position: Vector32.create(0, -0.2, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(transactionsSection);
    Material3.setPbrMaterial(transactionsSection, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const transactionsText = engine.addEntity();
    Transform2.create(transactionsText, {
      parent: transactionsSection,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(transactionsText, {
      text: "\u{1F4CA} TRANSACTIONS: 0",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create blockchain controls
  createBlockchainControls() {
    const controls = [
      { id: "connect", icon: "\u{1F517}", name: "Connect Wallet" },
      { id: "mint", icon: "\u{1F3A8}", name: "Mint Asset" },
      { id: "transfer", icon: "\u{1F4B8}", name: "Transfer" },
      { id: "verify", icon: "\u2705", name: "Verify" }
    ];
    let xOffset = -0.9;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.blockchainUI,
        position: Vector32.create(xOffset, -0.7, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleBlockchainControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create default wallet
  createDefaultWallet() {
    const wallet = {
      id: "wallet_default",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      chain: "ethereum",
      balance: /* @__PURE__ */ new Map([
        ["ETH", 2.5],
        ["USDC", 1e3],
        ["AIG", 500]
      ]),
      assets: [],
      isConnected: false,
      permissions: ["read", "write", "admin"]
    };
    this.wallets.set(wallet.id, wallet);
    console.log("\u{1F45B} Default wallet created");
  }
  // Initialize blockchain connection
  initializeBlockchainConnection() {
    console.log("\u{1F517} Initializing blockchain connections...");
    this.supportedChains.forEach((chain) => {
      console.log(`\u{1F4E1} Connected to ${chain}`);
    });
  }
  // Start blockchain engine
  startBlockchainEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateBlockchainUI();
      this.simulateBlockchainActivity();
      this.updateGasPrices();
    });
  }
  // Handle blockchain control
  handleBlockchainControl(controlId) {
    switch (controlId) {
      case "connect":
        this.connectWallet();
        break;
      case "mint":
        this.mintAsset();
        break;
      case "transfer":
        this.transferAsset();
        break;
      case "verify":
        this.verifyAsset();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Connect wallet
  connectWallet() {
    if (this.currentWallet && this.currentWallet.isConnected) {
      console.log("\u{1F45B} Wallet already connected");
      return;
    }
    const wallet = this.wallets.get("wallet_default");
    if (!wallet)
      return;
    wallet.isConnected = true;
    this.currentWallet = wallet;
    console.log("\u{1F517} Wallet connected successfully");
    console.log(`\u{1F4CD} Address: ${wallet.address}`);
    console.log(`\u26D3\uFE0F Chain: ${wallet.chain}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Disconnect wallet
  disconnectWallet() {
    if (!this.currentWallet)
      return;
    this.currentWallet.isConnected = false;
    console.log("\u{1F50C} Wallet disconnected");
    soundSystem.playInteractionSound("click");
  }
  // Mint asset
  mintAsset() {
    if (!this.currentWallet || !this.currentWallet.isConnected) {
      console.log("\u274C Please connect wallet first");
      return;
    }
    const asset = {
      id: `asset_${Date.now()}`,
      name: `AIG Asset #${this.assets.size + 1}`,
      type: "nft",
      blockchain: this.currentWallet.chain,
      contractAddress: this.contracts.get("asset_registry")?.address || "",
      tokenId: (this.assets.size + 1).toString(),
      owner: this.currentWallet.address,
      metadata: {
        description: "AIGestion Virtual Office Asset",
        image: "ipfs://QmHash...",
        attributes: /* @__PURE__ */ new Map([
          ["created_by", "AIGestion"],
          ["office_space", "virtual"],
          ["utility", "productivity"]
        ]),
        rarity: "rare",
        category: "office",
        creator: "AIGestion",
        royalties: 2.5
      },
      value: 0.1,
      currency: "ETH",
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    };
    this.assets.set(asset.id, asset);
    this.currentWallet.assets.push(asset);
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "mint",
      from: "0x0000000000000000000000000000000000000000",
      to: this.currentWallet.address,
      asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: "confirmed",
      timestamp: Date.now(),
      blockNumber: 12345678
    };
    this.transactions.set(transaction.id, transaction);
    console.log(`\u{1F3A8} Minted new asset: ${asset.name}`);
    console.log(`\u{1F194} Token ID: ${asset.tokenId}`);
    console.log(`\u{1F4B0} Value: ${asset.value} ${asset.currency}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Transfer asset
  transferAsset() {
    if (!this.currentWallet || !this.currentWallet.isConnected) {
      console.log("\u274C Please connect wallet first");
      return;
    }
    if (this.currentWallet.assets.length === 0) {
      console.log("\u274C No assets to transfer");
      return;
    }
    const asset = this.currentWallet.assets[0];
    const recipient = "0x1234567890123456789012345678901234567890";
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "transfer",
      from: this.currentWallet.address,
      to: recipient,
      asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: "pending",
      timestamp: Date.now()
    };
    this.transactions.set(transaction.id, transaction);
    asset.owner = recipient;
    asset.lastTransferred = Date.now();
    const index = this.currentWallet.assets.indexOf(asset);
    if (index > -1) {
      this.currentWallet.assets.splice(index, 1);
    }
    console.log(`\u{1F4B8} Transferred ${asset.name} to ${recipient}`);
    setTimeout(() => {
      transaction.status = "confirmed";
      transaction.blockNumber = 12345679;
      console.log(`\u2705 Transaction confirmed: ${transaction.id}`);
    }, 3e3);
    soundSystem.playInteractionSound("click");
  }
  // Verify asset
  verifyAsset() {
    if (this.assets.size === 0) {
      console.log("\u274C No assets to verify");
      return;
    }
    const asset = Array.from(this.assets.values())[0];
    console.log(`\u{1F50D} Verifying asset: ${asset.name}`);
    console.log(`\u{1F194} Token ID: ${asset.tokenId}`);
    console.log(`\u26D3\uFE0F Blockchain: ${asset.blockchain}`);
    console.log(`\u2705 Verification: ${asset.isVerified ? "VALID" : "INVALID"}`);
    console.log(`\u{1F464} Owner: ${asset.owner}`);
    console.log(`\u{1F4C5} Created: ${new Date(asset.createdAt).toLocaleString()}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Issue certificate
  issueCertificate(recipient, metadata) {
    const certificate = {
      id: `cert_${Date.now()}`,
      name: `Certificate #${this.assets.size + 1}`,
      type: "certificate",
      blockchain: this.currentWallet?.chain || "ethereum",
      contractAddress: this.contracts.get("certificate")?.address || "",
      tokenId: (this.assets.size + 1).toString(),
      owner: recipient,
      metadata: {
        description: "AIGestion Achievement Certificate",
        image: "ipfs://QmCertHash...",
        attributes: /* @__PURE__ */ new Map([
          ["type", "achievement"],
          ["issuer", "AIGestion"],
          ["metadata", metadata]
        ]),
        rarity: "uncommon",
        category: "certificate",
        creator: "AIGestion",
        royalties: 0
      },
      value: 0,
      currency: "ETH",
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    };
    this.assets.set(certificate.id, certificate);
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "mint",
      from: "0x0000000000000000000000000000000000000000",
      to: recipient,
      asset: certificate,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet?.chain || "ethereum") || 20,
      status: "confirmed",
      timestamp: Date.now(),
      blockNumber: 12345680
    };
    this.transactions.set(transaction.id, transaction);
    console.log(`\u{1F4DC} Issued certificate to ${recipient}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Award badge
  awardBadge(user, badgeType) {
    const badge = {
      id: `badge_${Date.now()}`,
      name: `${badgeType} Badge`,
      type: "badge",
      blockchain: this.currentWallet?.chain || "ethereum",
      contractAddress: this.contracts.get("badge")?.address || "",
      tokenId: (this.assets.size + 1).toString(),
      owner: user,
      metadata: {
        description: `${badgeType} Achievement Badge`,
        image: "ipfs://QmBadgeHash...",
        attributes: /* @__PURE__ */ new Map([
          ["type", badgeType],
          ["issuer", "AIGestion"],
          ["achievement_level", "gold"]
        ]),
        rarity: "rare",
        category: "badge",
        creator: "AIGestion",
        royalties: 0
      },
      value: 0,
      currency: "ETH",
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    };
    this.assets.set(badge.id, badge);
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "mint",
      from: "0x0000000000000000000000000000000000000000",
      to: user,
      asset: badge,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet?.chain || "ethereum") || 20,
      status: "confirmed",
      timestamp: Date.now(),
      blockNumber: 12345681
    };
    this.transactions.set(transaction.id, transaction);
    console.log(`\u{1F3C6} Awarded ${badgeType} badge to ${user}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Update blockchain UI
  updateBlockchainUI() {
  }
  // Simulate blockchain activity
  simulateBlockchainActivity() {
    if (Math.random() < 0.01) {
      this.simulateIncomingTransaction();
    }
  }
  // Simulate incoming transaction
  simulateIncomingTransaction() {
    if (!this.currentWallet || !this.currentWallet.isConnected)
      return;
    const assetTypes = ["nft", "badge", "certificate"];
    const randomType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
    const asset = {
      id: `asset_${Date.now()}`,
      name: `Received ${randomType}`,
      type: randomType,
      blockchain: this.currentWallet.chain,
      contractAddress: this.contracts.get("asset_registry")?.address || "",
      tokenId: Math.floor(Math.random() * 1e4).toString(),
      owner: this.currentWallet.address,
      metadata: {
        description: "Received asset",
        image: "ipfs://QmReceivedHash...",
        attributes: /* @__PURE__ */ new Map([
          ["received", "true"],
          ["sender", "0xSenderAddress"]
        ]),
        rarity: "common",
        category: randomType,
        creator: "Unknown",
        royalties: 0
      },
      value: Math.random() * 0.5,
      currency: "ETH",
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    };
    this.assets.set(asset.id, asset);
    this.currentWallet.assets.push(asset);
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "transfer",
      from: "0xSenderAddress",
      to: this.currentWallet.address,
      asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: "confirmed",
      timestamp: Date.now(),
      blockNumber: 12345682
    };
    this.transactions.set(transaction.id, transaction);
    console.log(`\u{1F4E5} Received new asset: ${asset.name}`);
  }
  // Update gas prices
  updateGasPrices() {
    this.gasPrices.forEach((price, chain) => {
      const fluctuation = (Math.random() - 0.5) * 0.1;
      const newPrice = Math.max(0.01, price + fluctuation);
      this.gasPrices.set(chain, newPrice);
    });
  }
  // Get current wallet
  getCurrentWallet() {
    return this.currentWallet;
  }
  // Get all assets
  getAssets() {
    return Array.from(this.assets.values());
  }
  // Get transactions
  getTransactions() {
    return Array.from(this.transactions.values());
  }
  // Get gas price
  getGasPrice(chain) {
    return this.gasPrices.get(chain) || 20;
  }
  // Get supported chains
  getSupportedChains() {
    return [...this.supportedChains];
  }
  // Switch chain
  switchChain(chain) {
    if (!this.supportedChains.includes(chain)) {
      console.log(`\u274C Chain ${chain} not supported`);
      return;
    }
    if (this.currentWallet) {
      this.currentWallet.chain = chain;
      console.log(`\u26D3\uFE0F Switched to ${chain}`);
      soundSystem.playInteractionSound("click");
    }
  }
  // Get contract
  getContract(contractId) {
    return this.contracts.get(contractId);
  }
  // Call contract function
  async callContract(contractId, functionName, parameters) {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error(`Contract ${contractId} not found`);
    }
    const func = contract.functions.get(functionName);
    if (!func) {
      throw new Error(`Function ${functionName} not found in contract ${contractId}`);
    }
    console.log(`\u{1F4DE} Calling ${contractId}.${functionName} with parameters:`, parameters);
    return new Promise((resolve2) => {
      setTimeout(() => {
        console.log(`\u2705 Contract call completed`);
        resolve2({ success: true, result: "mock_result" });
      }, 1e3);
    });
  }
  // Cleanup system
  cleanup() {
    this.wallets.clear();
    this.assets.clear();
    this.transactions.clear();
    this.contracts.clear();
    if (this.blockchainUI) {
      engine.removeEntity(this.blockchainUI);
    }
    this.currentWallet = null;
    this.isInitialized = false;
  }
};
var blockchainSystem = new BlockchainIntegrationSystem();

// src/collaboration-whiteboard.ts
var CollaborationWhiteboardSystem = class {
  constructor() {
    this.sessions = /* @__PURE__ */ new Map();
    this.currentSession = null;
    this.users = /* @__PURE__ */ new Map();
    this.drawingTools = /* @__PURE__ */ new Map();
    this.drawingEntities = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.isDrawing = false;
    this.currentDrawing = null;
    this.drawingHistory = [];
    this.currentUser = {
      id: "user_main",
      name: "Main User",
      color: Color32.create(0.2, 0.6, 1),
      cursor: Vector32.create(0, 0, 0),
      isDrawing: false,
      currentTool: this.createDefaultTool()
    };
  }
  // Initialize whiteboard system
  initialize() {
    console.log("\u{1F3A8} Collaboration Whiteboard System Initializing...");
    this.setupDrawingTools();
    this.createWhiteboard();
    this.createToolbar();
    this.startDrawingEngine();
    this.createDefaultSession();
    this.isInitialized = true;
    console.log("\u{1F3A8} Collaboration Whiteboard System Ready!");
  }
  // Setup drawing tools
  setupDrawingTools() {
    this.drawingTools.set("pen", {
      type: "pen",
      color: Color32.create(0, 0, 0),
      strokeWidth: 2,
      isActive: true
    });
    this.drawingTools.set("eraser", {
      type: "eraser",
      color: Color32.create(1, 1, 1),
      strokeWidth: 10,
      isActive: false
    });
    this.drawingTools.set("text", {
      type: "text",
      color: Color32.create(0, 0, 0),
      strokeWidth: 1,
      isActive: false
    });
    this.drawingTools.set("shape", {
      type: "shape",
      color: Color32.create(0.2, 0.6, 1),
      strokeWidth: 2,
      isActive: false
    });
    this.drawingTools.set("selection", {
      type: "selection",
      color: Color32.create(0.8, 0.8, 0.8),
      strokeWidth: 1,
      isActive: false
    });
  }
  // Create default tool
  createDefaultTool() {
    return {
      type: "pen",
      color: Color32.create(0, 0, 0),
      strokeWidth: 2,
      isActive: true
    };
  }
  // Create whiteboard surface
  createWhiteboard() {
    this.whiteboardEntity = engine.addEntity();
    Transform2.create(this.whiteboardEntity, {
      position: Vector32.create(8, 3, 2),
      scale: Vector32.create(6, 4, 0.1)
    });
    MeshRenderer3.setBox(this.whiteboardEntity);
    Material3.setPbrMaterial(this.whiteboardEntity, {
      albedoColor: Color42.create(1, 1, 1, 1),
      roughness: 0.1,
      metallic: 0
    });
    this.createWhiteboardBorder();
    this.setupWhiteboardInteraction();
  }
  // Create whiteboard border
  createWhiteboardBorder() {
    const border = engine.addEntity();
    Transform2.create(border, {
      parent: this.whiteboardEntity,
      position: Vector32.create(0, 0, -0.05),
      scale: Vector32.create(6.1, 4.1, 0.05)
    });
    MeshRenderer3.setBox(border);
    Material3.setPbrMaterial(border, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 1),
      roughness: 0.3,
      metallic: 0.8
    });
  }
  // Setup whiteboard interaction
  setupWhiteboardInteraction() {
    pointerEventsSystem.onPointerDown(
      {
        entity: this.whiteboardEntity,
        opts: { button: InputAction.IA_POINTER, hoverText: "Start Drawing" }
      },
      (e) => this.startDrawing(e)
    );
    pointerEventsSystem.onPointerUp(
      {
        entity: this.whiteboardEntity,
        opts: { button: InputAction.IA_POINTER }
      },
      () => this.stopDrawing()
    );
    pointerEventsSystem.onPointerMove(
      {
        entity: this.whiteboardEntity,
        opts: { button: InputAction.IA_POINTER }
      },
      (e) => this.continueDrawing(e)
    );
  }
  // Create toolbar
  createToolbar() {
    this.toolbarEntity = engine.addEntity();
    Transform2.create(this.toolbarEntity, {
      position: Vector32.create(8, 5, 2),
      scale: Vector32.create(4, 0.8, 0.1)
    });
    MeshRenderer3.setBox(this.toolbarEntity);
    Material3.setPbrMaterial(this.toolbarEntity, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    this.createToolButtons();
    this.createColorPalette();
    this.createSessionControls();
  }
  // Create tool buttons
  createToolButtons() {
    const tools = [
      { id: "pen", icon: "\u270F\uFE0F", name: "Pen" },
      { id: "eraser", icon: "\u{1F9F9}", name: "Eraser" },
      { id: "text", icon: "\u{1F4DD}", name: "Text" },
      { id: "shape", icon: "\u2B55", name: "Shape" },
      { id: "selection", icon: "\u{1F446}", name: "Select" }
    ];
    let xOffset = -1.5;
    tools.forEach((tool) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.toolbarEntity,
        position: Vector32.create(xOffset, 0, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: tool.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: tool.name }
        },
        () => this.selectTool(tool.id)
      );
      xOffset += 0.8;
    });
  }
  // Create color palette
  createColorPalette() {
    const colors = [
      Color32.create(0, 0, 0),
      // Black
      Color32.create(1, 0, 0),
      // Red
      Color32.create(0, 1, 0),
      // Green
      Color32.create(0, 0, 1),
      // Blue
      Color32.create(1, 1, 0),
      // Yellow
      Color32.create(1, 0, 1),
      // Magenta
      Color32.create(0, 1, 1),
      // Cyan
      Color32.create(0.5, 0.5, 0.5)
      // Gray
    ];
    let xOffset = -1.5;
    colors.forEach((color, index) => {
      const colorButton = engine.addEntity();
      Transform2.create(colorButton, {
        parent: this.toolbarEntity,
        position: Vector32.create(xOffset, -0.3, 0.1),
        scale: Vector32.create(0.15, 0.15, 0.1)
      });
      MeshRenderer3.setBox(colorButton);
      Material3.setPbrMaterial(colorButton, {
        albedoColor: Color42.create(color.r, color.g, color.b, 1),
        roughness: 0.2,
        metallic: 0.1
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: colorButton,
          opts: { button: InputAction.IA_POINTER, hoverText: `Select Color ${index + 1}` }
        },
        () => this.selectColor(color)
      );
      xOffset += 0.4;
    });
  }
  // Create session controls
  createSessionControls() {
    const controls = [
      { id: "new", icon: "\u{1F195}", name: "New Session" },
      { id: "save", icon: "\u{1F4BE}", name: "Save" },
      { id: "share", icon: "\u{1F517}", name: "Share" },
      { id: "clear", icon: "\u{1F5D1}\uFE0F", name: "Clear" }
    ];
    let xOffset = 1.5;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.toolbarEntity,
        position: Vector32.create(xOffset, 0, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.8, 0.4, 0.2, 1),
        emissiveColor: Color42.create(0.8, 0.4, 0.2, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleSessionControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Start drawing engine
  startDrawingEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateDrawingEntities();
      this.syncWithRemoteUsers();
    });
  }
  // Create default session
  createDefaultSession() {
    const session = {
      id: "session_default",
      name: "Default Whiteboard",
      participants: [this.currentUser.id],
      drawings: [],
      isActive: true,
      createdAt: Date.now(),
      lastModified: Date.now()
    };
    this.sessions.set(session.id, session);
    this.currentSession = session;
    this.users.set(this.currentUser.id, this.currentUser);
    console.log("\u{1F3A8} Default whiteboard session created");
  }
  // Start drawing
  startDrawing(event) {
    if (!this.currentSession)
      return;
    const point = this.getDrawingPoint(event);
    if (!point)
      return;
    this.isDrawing = true;
    this.currentUser.isDrawing = true;
    const drawing = {
      id: `drawing_${Date.now()}`,
      userId: this.currentUser.id,
      type: this.currentUser.currentTool.type === "eraser" ? "freehand" : "line",
      points: [point],
      color: this.currentUser.currentTool.color,
      strokeWidth: this.currentUser.currentTool.strokeWidth,
      timestamp: Date.now(),
      isShared: true
    };
    this.currentDrawing = drawing;
    this.drawingHistory.push(drawing);
    soundSystem.playInteractionSound("click");
  }
  // Continue drawing
  continueDrawing(event) {
    if (!this.isDrawing || !this.currentDrawing)
      return;
    const point = this.getDrawingPoint(event);
    if (!point)
      return;
    this.currentDrawing.points.push(point);
    this.renderDrawing(this.currentDrawing);
  }
  // Stop drawing
  stopDrawing() {
    if (!this.isDrawing || !this.currentDrawing)
      return;
    this.isDrawing = false;
    this.currentUser.isDrawing = false;
    if (this.currentDrawing.points.length > 1) {
      this.currentSession.drawings.push(this.currentDrawing);
      this.currentSession.lastModified = Date.now();
      this.shareDrawing(this.currentDrawing);
    }
    this.currentDrawing = null;
    soundSystem.playInteractionSound("click");
  }
  // Get drawing point from event
  getDrawingPoint(event) {
    if (!event.hit || !this.whiteboardEntity)
      return null;
    const localPoint = Vector32.create(
      event.hit.hitPoint.x - Transform2.get(this.whiteboardEntity).position.x,
      event.hit.hitPoint.y - Transform2.get(this.whiteboardEntity).position.y,
      0.05
    );
    return localPoint;
  }
  // Render drawing
  renderDrawing(drawing) {
    if (!this.drawingEntities.has(drawing.id)) {
      this.drawingEntities.set(drawing.id, []);
    }
    const entities = this.drawingEntities.get(drawing.id);
    entities.forEach((entity) => engine.removeEntity(entity));
    entities.length = 0;
    switch (drawing.type) {
      case "line":
      case "freehand":
        this.renderFreehandDrawing(drawing, entities);
        break;
      case "circle":
        this.renderCircleDrawing(drawing, entities);
        break;
      case "rectangle":
        this.renderRectangleDrawing(drawing, entities);
        break;
      case "arrow":
        this.renderArrowDrawing(drawing, entities);
        break;
    }
  }
  // Render freehand drawing
  renderFreehandDrawing(drawing, entities) {
    for (let i = 0; i < drawing.points.length - 1; i++) {
      const start = drawing.points[i];
      const end = drawing.points[i + 1];
      const line = engine.addEntity();
      Transform2.create(line, {
        parent: this.whiteboardEntity,
        position: Vector32.create(
          (start.x + end.x) / 2,
          (start.y + end.y) / 2,
          0.05
        ),
        scale: Vector32.create(
          Vector32.distance(start, end),
          drawing.strokeWidth * 0.01,
          0.01
        ),
        rotation: Quaternion2.fromEulerDegrees(
          0,
          0,
          Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI
        )
      });
      MeshRenderer3.setBox(line);
      Material3.setPbrMaterial(line, {
        albedoColor: Color42.create(
          drawing.color.r,
          drawing.color.g,
          drawing.color.b,
          1
        ),
        roughness: 0.1,
        metallic: 0
      });
      entities.push(line);
    }
  }
  // Render circle drawing
  renderCircleDrawing(drawing, entities) {
    if (drawing.points.length < 2)
      return;
    const center = drawing.points[0];
    const radius = Vector32.distance(center, drawing.points[1]);
    const circle = engine.addEntity();
    Transform2.create(circle, {
      parent: this.whiteboardEntity,
      position: Vector32.create(center.x, center.y, 0.05),
      scale: Vector32.create(radius * 2, radius * 2, 0.01)
    });
    MeshRenderer3.setBox(circle);
    Material3.setPbrMaterial(circle, {
      albedoColor: Color42.create(
        drawing.color.r,
        drawing.color.g,
        drawing.color.b,
        1
      ),
      roughness: 0.1,
      metallic: 0
    });
    entities.push(circle);
  }
  // Render rectangle drawing
  renderRectangleDrawing(drawing, entities) {
    if (drawing.points.length < 2)
      return;
    const start = drawing.points[0];
    const end = drawing.points[1];
    const rectangle = engine.addEntity();
    Transform2.create(rectangle, {
      parent: this.whiteboardEntity,
      position: Vector32.create(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2,
        0.05
      ),
      scale: Vector32.create(
        Math.abs(end.x - start.x),
        Math.abs(end.y - start.y),
        0.01
      )
    });
    MeshRenderer3.setBox(rectangle);
    Material3.setPbrMaterial(rectangle, {
      albedoColor: Color42.create(
        drawing.color.r,
        drawing.color.g,
        drawing.color.b,
        1
      ),
      roughness: 0.1,
      metallic: 0
    });
    entities.push(rectangle);
  }
  // Render arrow drawing
  renderArrowDrawing(drawing, entities) {
    if (drawing.points.length < 2)
      return;
    const start = drawing.points[0];
    const end = drawing.points[1];
    this.renderFreehandDrawing(drawing, entities);
    const arrowHead = engine.addEntity();
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    Transform2.create(arrowHead, {
      parent: this.whiteboardEntity,
      position: Vector32.create(end.x, end.y, 0.05),
      scale: Vector32.create(0.1, 0.1, 0.01),
      rotation: Quaternion2.fromEulerDegrees(
        0,
        0,
        angle * 180 / Math.PI
      )
    });
    MeshRenderer3.setBox(arrowHead);
    Material3.setPbrMaterial(arrowHead, {
      albedoColor: Color42.create(
        drawing.color.r,
        drawing.color.g,
        drawing.color.b,
        1
      ),
      roughness: 0.1,
      metallic: 0
    });
    entities.push(arrowHead);
  }
  // Update drawing entities
  updateDrawingEntities() {
    this.updateCursorPosition();
    this.updateDrawingAnimations();
  }
  // Update cursor position
  updateCursorPosition() {
    const time = Date.now() / 1e3;
    this.currentUser.cursor = Vector32.create(
      Math.sin(time * 0.5) * 2,
      Math.cos(time * 0.3) * 1.5,
      0.05
    );
  }
  // Update drawing animations
  updateDrawingAnimations() {
    this.drawingEntities.forEach((entities, drawingId) => {
      entities.forEach((entity, index) => {
        const time = Date.now() / 1e3;
        const transform = Transform2.getMutable(entity);
        const scale = transform.scale;
        const pulse = 1 + Math.sin(time * 2 + index * 0.1) * 0.02;
        transform.scale = Vector32.create(
          scale.x * pulse,
          scale.y * pulse,
          scale.z
        );
      });
    });
  }
  // Sync with remote users
  syncWithRemoteUsers() {
    if (Math.random() < 0.01) {
      this.simulateRemoteUserDrawing();
    }
  }
  // Simulate remote user drawing
  simulateRemoteUserDrawing() {
    const remoteUser = {
      id: "user_remote",
      name: "Remote User",
      color: Color32.create(1, 0.5, 0),
      cursor: Vector32.create(
        Math.random() * 4 - 2,
        Math.random() * 2 - 1,
        0.05
      ),
      isDrawing: true,
      currentTool: this.createDefaultTool()
    };
    const drawing = {
      id: `drawing_remote_${Date.now()}`,
      userId: remoteUser.id,
      type: "freehand",
      points: [
        remoteUser.cursor,
        Vector32.create(
          remoteUser.cursor.x + Math.random() * 0.5,
          remoteUser.cursor.y + Math.random() * 0.5,
          0.05
        )
      ],
      color: remoteUser.color,
      strokeWidth: 2,
      timestamp: Date.now(),
      isShared: true
    };
    if (this.currentSession) {
      this.currentSession.drawings.push(drawing);
      this.renderDrawing(drawing);
    }
  }
  // Select tool
  selectTool(toolId) {
    const tool = this.drawingTools.get(toolId);
    if (!tool)
      return;
    this.drawingTools.forEach((t) => t.isActive = false);
    tool.isActive = true;
    this.currentUser.currentTool = tool;
    console.log(`\u{1F3A8} Selected tool: ${toolId}`);
    soundSystem.playInteractionSound("click");
  }
  // Select color
  selectColor(color) {
    this.currentUser.currentTool.color = color;
    console.log(`\u{1F3A8} Selected color: RGB(${color.r}, ${color.g}, ${color.b})`);
    soundSystem.playInteractionSound("click");
  }
  // Handle session control
  handleSessionControl(controlId) {
    switch (controlId) {
      case "new":
        this.createNewSession();
        break;
      case "save":
        this.saveSession();
        break;
      case "share":
        this.shareSession();
        break;
      case "clear":
        this.clearWhiteboard();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Create new session
  createNewSession() {
    const session = {
      id: `session_${Date.now()}`,
      name: `Whiteboard ${this.sessions.size + 1}`,
      participants: [this.currentUser.id],
      drawings: [],
      isActive: true,
      createdAt: Date.now(),
      lastModified: Date.now()
    };
    this.sessions.set(session.id, session);
    this.currentSession = session;
    this.clearWhiteboard();
    console.log(`\u{1F3A8} Created new session: ${session.name}`);
  }
  // Save session
  saveSession() {
    if (!this.currentSession)
      return;
    console.log(`\u{1F4BE} Saving session: ${this.currentSession.name}`);
    console.log(`\u{1F4CA} Drawings: ${this.currentSession.drawings.length}`);
    console.log(`\u{1F465} Participants: ${this.currentSession.participants.length}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Share session
  shareSession() {
    if (!this.currentSession)
      return;
    console.log(`\u{1F517} Sharing session: ${this.currentSession.name}`);
    console.log(`\u{1F517} Share link: https://aigestion.dev/whiteboard/${this.currentSession.id}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Clear whiteboard
  clearWhiteboard() {
    if (!this.currentSession)
      return;
    this.drawingEntities.forEach((entities) => {
      entities.forEach((entity) => engine.removeEntity(entity));
    });
    this.drawingEntities.clear();
    this.currentSession.drawings = [];
    this.currentSession.lastModified = Date.now();
    console.log("\u{1F5D1}\uFE0F Whiteboard cleared");
    soundSystem.playInteractionSound("click");
  }
  // Share drawing with other users
  shareDrawing(drawing) {
    console.log(`\u{1F4E4} Sharing drawing: ${drawing.id}`);
  }
  // Join session
  joinSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session)
      return;
    this.currentSession = session;
    session.participants.push(this.currentUser.id);
    session.lastModified = Date.now();
    session.drawings.forEach((drawing) => this.renderDrawing(drawing));
    console.log(`\u{1F3A8} Joined session: ${session.name}`);
  }
  // Leave session
  leaveSession() {
    if (!this.currentSession)
      return;
    const index = this.currentSession.participants.indexOf(this.currentUser.id);
    if (index > -1) {
      this.currentSession.participants.splice(index, 1);
    }
    console.log(`\u{1F3A8} Left session: ${this.currentSession.name}`);
    this.currentSession = null;
  }
  // Get current session
  getCurrentSession() {
    return this.currentSession;
  }
  // Get all sessions
  getSessions() {
    return Array.from(this.sessions.values());
  }
  // Get drawing history
  getDrawingHistory() {
    return [...this.drawingHistory];
  }
  // Add user to session
  addUserToSession(userId, userName) {
    const user = {
      id: userId,
      name: userName,
      color: Color32.create(
        Math.random(),
        Math.random(),
        Math.random()
      ),
      cursor: Vector32.create(0, 0, 0),
      isDrawing: false,
      currentTool: this.createDefaultTool()
    };
    this.users.set(userId, user);
    if (this.currentSession) {
      this.currentSession.participants.push(userId);
      this.currentSession.lastModified = Date.now();
    }
    console.log(`\u{1F464} User ${userName} joined the session`);
  }
  // Remove user from session
  removeUserFromSession(userId) {
    const user = this.users.get(userId);
    if (!user)
      return;
    this.users.delete(userId);
    if (this.currentSession) {
      const index = this.currentSession.participants.indexOf(userId);
      if (index > -1) {
        this.currentSession.participants.splice(index, 1);
        this.currentSession.lastModified = Date.now();
      }
    }
    console.log(`\u{1F464} User ${user.name} left the session`);
  }
  // Cleanup system
  cleanup() {
    this.drawingEntities.forEach((entities) => {
      entities.forEach((entity) => engine.removeEntity(entity));
    });
    this.drawingEntities.clear();
    this.sessions.clear();
    this.users.clear();
    this.drawingTools.clear();
    this.drawingHistory = [];
    if (this.whiteboardEntity) {
      engine.removeEntity(this.whiteboardEntity);
    }
    if (this.toolbarEntity) {
      engine.removeEntity(this.toolbarEntity);
    }
    this.isInitialized = false;
  }
};
var whiteboardSystem = new CollaborationWhiteboardSystem();

// src/content-management.ts
var ContentManagementSystem = class {
  constructor() {
    this.content = /* @__PURE__ */ new Map();
    this.collections = /* @__PURE__ */ new Map();
    this.templates = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.currentCollection = null;
    this.searchIndex = /* @__PURE__ */ new Map();
    this.initializeAnalyticsEngine();
    this.initializeVersionControl();
  }
  // Initialize content management system
  initialize() {
    console.log("\u{1F4DA} Dynamic Content Management System Initializing...");
    this.setupContentTemplates();
    this.createContentUI();
    this.createDefaultCollections();
    this.initializeSearchIndex();
    this.startContentEngine();
    this.isInitialized = true;
    console.log("\u{1F4DA} Dynamic Content Management System Ready!");
  }
  // Initialize analytics engine
  initializeAnalyticsEngine() {
    this.analyticsEngine = {
      track: (event, data) => {
        console.log(`\u{1F4CA} Analytics: ${event}`, data);
      },
      getMetrics: (contentId) => {
        return {
          views: Math.floor(Math.random() * 1e3),
          downloads: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          averageRating: (Math.random() * 2 + 3).toFixed(1),
          timeSpent: Math.floor(Math.random() * 300)
        };
      }
    };
  }
  // Initialize version control
  initializeVersionControl() {
    this.versionControl = {
      createVersion: (contentId, changes) => {
        console.log(`\u{1F4DD} Creating version for content: ${contentId}`);
        return {
          id: `v_${Date.now()}`,
          contentId,
          changes,
          timestamp: Date.now(),
          author: "system"
        };
      },
      getVersionHistory: (contentId) => {
        return [
          {
            id: "v_1",
            contentId,
            changes: "Initial version",
            timestamp: Date.now() - 864e5,
            author: "creator"
          }
        ];
      }
    };
  }
  // Setup content templates
  setupContentTemplates() {
    const documentTemplate = {
      id: "template_document",
      name: "Document",
      type: "document",
      structure: {
        sections: ["title", "content", "attachments"],
        layout: "standard"
      },
      fields: [
        {
          id: "title",
          name: "Title",
          type: "text",
          required: true,
          validation: [
            { type: "required", value: true, message: "Title is required" },
            { type: "minLength", value: 3, message: "Title must be at least 3 characters" }
          ]
        },
        {
          id: "content",
          name: "Content",
          type: "text",
          required: true,
          validation: [
            { type: "required", value: true, message: "Content is required" }
          ]
        },
        {
          id: "category",
          name: "Category",
          type: "select",
          required: true,
          options: ["Report", "Proposal", "Manual", "Guide", "Other"]
        }
      ],
      isDefault: true
    };
    const presentationTemplate = {
      id: "template_presentation",
      name: "Presentation",
      type: "presentation",
      structure: {
        slides: ["title", "content", "media"],
        layout: "slides"
      },
      fields: [
        {
          id: "title",
          name: "Title",
          type: "text",
          required: true
        },
        {
          id: "slides",
          name: "Slides",
          type: "multiselect",
          required: true,
          options: ["Title Slide", "Content Slide", "Image Slide", "Chart Slide"]
        }
      ],
      isDefault: false
    };
    const datasetTemplate = {
      id: "template_dataset",
      name: "Dataset",
      type: "dataset",
      structure: {
        schema: ["columns", "types", "constraints"],
        format: "structured"
      },
      fields: [
        {
          id: "name",
          name: "Dataset Name",
          type: "text",
          required: true
        },
        {
          id: "format",
          name: "Format",
          type: "select",
          required: true,
          options: ["CSV", "JSON", "XML", "Parquet"]
        },
        {
          id: "size",
          name: "Size (MB)",
          type: "number",
          required: true
        }
      ],
      isDefault: false
    };
    this.templates.set(documentTemplate.id, documentTemplate);
    this.templates.set(presentationTemplate.id, presentationTemplate);
    this.templates.set(datasetTemplate.id, datasetTemplate);
    console.log("\u{1F4CB} Content templates configured");
  }
  // Create content UI
  createContentUI() {
    this.contentUI = engine.addEntity();
    Transform2.create(this.contentUI, {
      position: Vector32.create(8, 3, 14),
      scale: Vector32.create(4, 4, 0.1)
    });
    MeshRenderer3.setBox(this.contentUI);
    Material3.setPbrMaterial(this.contentUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.contentUI,
      position: Vector32.create(0, 1.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F4DA} CONTENT MANAGEMENT",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createContentBrowser();
    this.createContentEditor();
    this.createCollectionManager();
    this.createAnalyticsPanel();
  }
  // Create content browser
  createContentBrowser() {
    const browser = engine.addEntity();
    Transform2.create(browser, {
      parent: this.contentUI,
      position: Vector32.create(0, 1, 0.1),
      scale: Vector32.create(0.9, 0.4, 0.1)
    });
    MeshRenderer3.setBox(browser);
    Material3.setPbrMaterial(browser, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const browserText = engine.addEntity();
    Transform2.create(browserText, {
      parent: browser,
      position: Vector32.create(0, 0.1, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(browserText, {
      text: "\u{1F4C2} Content Browser",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
    this.createBrowserControls();
  }
  // Create browser controls
  createBrowserControls() {
    const controls = [
      { id: "search", icon: "\u{1F50D}", name: "Search" },
      { id: "filter", icon: "\u{1F53D}", name: "Filter" },
      { id: "sort", icon: "\u2195\uFE0F", name: "Sort" },
      { id: "new", icon: "\u2795", name: "New Content" }
    ];
    let xOffset = -0.6;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.contentUI,
        position: Vector32.create(xOffset, 0.6, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleBrowserControl(control.id)
      );
      xOffset += 0.4;
    });
  }
  // Create content editor
  createContentEditor() {
    const editor = engine.addEntity();
    Transform2.create(editor, {
      parent: this.contentUI,
      position: Vector32.create(0, 0.1, 0.1),
      scale: Vector32.create(0.9, 0.4, 0.1)
    });
    MeshRenderer3.setBox(editor);
    Material3.setPbrMaterial(editor, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const editorText = engine.addEntity();
    Transform2.create(editorText, {
      parent: editor,
      position: Vector32.create(0, 0.1, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(editorText, {
      text: "\u270F\uFE0F Content Editor",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create collection manager
  createCollectionManager() {
    const manager = engine.addEntity();
    Transform2.create(manager, {
      parent: this.contentUI,
      position: Vector32.create(0, -0.4, 0.1),
      scale: Vector32.create(0.9, 0.3, 0.1)
    });
    MeshRenderer3.setBox(manager);
    Material3.setPbrMaterial(manager, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const managerText = engine.addEntity();
    Transform2.create(managerText, {
      parent: manager,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(managerText, {
      text: "\u{1F4C1} Collections",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create analytics panel
  createAnalyticsPanel() {
    const analytics = engine.addEntity();
    Transform2.create(analytics, {
      parent: this.contentUI,
      position: Vector32.create(0, -0.9, 0.1),
      scale: Vector32.create(0.9, 0.3, 0.1)
    });
    MeshRenderer3.setBox(analytics);
    Material3.setPbrMaterial(analytics, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const analyticsText = engine.addEntity();
    Transform2.create(analyticsText, {
      parent: analytics,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(analyticsText, {
      text: "\u{1F4CA} Analytics",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create default collections
  createDefaultCollections() {
    const documentsCollection = {
      id: "collection_documents",
      name: "Documents",
      description: "All documents and text files",
      items: [],
      layout: "grid",
      filters: [
        { field: "type", operator: "equals", value: "document" }
      ],
      sortBy: "date",
      sortOrder: "desc",
      isPublic: true
    };
    const mediaCollection = {
      id: "collection_media",
      name: "Media",
      description: "Images, videos, and audio files",
      items: [],
      layout: "masonry",
      filters: [
        { field: "type", operator: "contains", value: "image" }
      ],
      sortBy: "title",
      sortOrder: "asc",
      isPublic: true
    };
    const presentationsCollection = {
      id: "collection_presentations",
      name: "Presentations",
      description: "Slides and presentations",
      items: [],
      layout: "carousel",
      filters: [
        { field: "type", operator: "equals", value: "presentation" }
      ],
      sortBy: "date",
      sortOrder: "desc",
      isPublic: false
    };
    this.collections.set(documentsCollection.id, documentsCollection);
    this.collections.set(mediaCollection.id, mediaCollection);
    this.collections.set(presentationsCollection.id, presentationsCollection);
    this.currentCollection = documentsCollection;
    console.log("\u{1F4C1} Default collections created");
  }
  // Initialize search index
  initializeSearchIndex() {
    console.log("\u{1F50D} Initializing search index...");
    this.createSampleContent();
  }
  // Create sample content
  createSampleContent() {
    const sampleContent = [
      {
        id: "content_1",
        title: "Q4 Financial Report",
        type: "document",
        category: "Report",
        tags: ["finance", "quarterly", "2024"],
        metadata: {
          author: "Finance Team",
          description: "Quarterly financial report for Q4 2024",
          size: 2048e3,
          format: "PDF",
          language: "en",
          accessibility: {
            hasCaptions: false,
            hasAudioDescription: false,
            hasTranscript: true,
            hasAltText: true,
            language: "en"
          }
        },
        content: { url: "/files/q4_report.pdf" },
        permissions: {
          canView: ["all"],
          canEdit: ["finance_team"],
          canDelete: ["finance_manager"],
          canShare: true,
          isPublic: false
        },
        createdAt: Date.now() - 864e5,
        updatedAt: Date.now() - 36e5,
        version: 2,
        status: "published"
      },
      {
        id: "content_2",
        title: "Product Launch Presentation",
        type: "presentation",
        category: "Marketing",
        tags: ["product", "launch", "marketing"],
        metadata: {
          author: "Marketing Team",
          description: "New product launch presentation",
          size: 512e4,
          format: "PPTX",
          duration: 1800,
          language: "en",
          accessibility: {
            hasCaptions: true,
            hasAudioDescription: false,
            hasTranscript: true,
            hasAltText: true,
            language: "en"
          }
        },
        content: { url: "/files/product_launch.pptx" },
        permissions: {
          canView: ["all"],
          canEdit: ["marketing_team"],
          canDelete: ["marketing_manager"],
          canShare: true,
          isPublic: true
        },
        createdAt: Date.now() - 1728e5,
        updatedAt: Date.now() - 72e5,
        version: 3,
        status: "published"
      },
      {
        id: "content_3",
        title: "Customer Analytics Dataset",
        type: "dataset",
        category: "Analytics",
        tags: ["customer", "analytics", "data"],
        metadata: {
          author: "Data Team",
          description: "Customer behavior analytics dataset",
          size: 1024e4,
          format: "CSV",
          language: "en",
          accessibility: {
            hasCaptions: false,
            hasAudioDescription: false,
            hasTranscript: false,
            hasAltText: true,
            language: "en"
          }
        },
        content: { url: "/data/customer_analytics.csv" },
        permissions: {
          canView: ["data_team", "analysts"],
          canEdit: ["data_team"],
          canDelete: ["data_manager"],
          canShare: false,
          isPublic: false
        },
        createdAt: Date.now() - 2592e5,
        updatedAt: Date.now() - 864e5,
        version: 1,
        status: "published"
      }
    ];
    sampleContent.forEach((item) => {
      this.content.set(item.id, item);
      this.updateSearchIndex(item);
    });
    console.log("\u{1F4C4} Sample content created");
  }
  // Update search index
  updateSearchIndex(item) {
    const searchableText = [
      item.title,
      item.description,
      item.category,
      ...item.tags,
      item.metadata.author
    ].join(" ").toLowerCase();
    this.searchIndex.set(item.id, searchableText.split(" "));
  }
  // Start content engine
  startContentEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateContentMetrics();
      this.processContentUpdates();
      this.optimizeSearchIndex();
    });
  }
  // Handle browser control
  handleBrowserControl(controlId) {
    switch (controlId) {
      case "search":
        this.openSearchDialog();
        break;
      case "filter":
        this.openFilterDialog();
        break;
      case "sort":
        this.toggleSortOrder();
        break;
      case "new":
        this.openContentCreator();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Open search dialog
  openSearchDialog() {
    console.log("\u{1F50D} Opening search dialog...");
  }
  // Open filter dialog
  openFilterDialog() {
    console.log("\u{1F53D} Opening filter dialog...");
  }
  // Toggle sort order
  toggleSortOrder() {
    if (!this.currentCollection)
      return;
    this.currentCollection.sortOrder = this.currentCollection.sortOrder === "asc" ? "desc" : "asc";
    console.log(`\u{1F504} Sort order: ${this.currentCollection.sortOrder}`);
  }
  // Open content creator
  openContentCreator() {
    console.log("\u2795 Opening content creator...");
  }
  // Create content
  createContent(templateId, data) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    const content = {
      id: `content_${Date.now()}`,
      title: data.title || "Untitled",
      type: template.type,
      category: data.category || "General",
      tags: data.tags || [],
      metadata: {
        author: data.author || "Unknown",
        description: data.description || "",
        size: 0,
        format: template.type,
        language: data.language || "en",
        accessibility: {
          hasCaptions: false,
          hasAudioDescription: false,
          hasTranscript: false,
          hasAltText: false,
          language: data.language || "en"
        }
      },
      content: data.content || {},
      permissions: {
        canView: data.canView || ["all"],
        canEdit: data.canEdit || [data.author || "Unknown"],
        canDelete: data.canDelete || [data.author || "Unknown"],
        canShare: data.canShare !== void 0 ? data.canShare : true,
        isPublic: data.isPublic !== void 0 ? data.isPublic : false
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      status: "draft"
    };
    this.content.set(content.id, content);
    this.updateSearchIndex(content);
    this.analyticsEngine.track("content_created", {
      contentId: content.id,
      type: content.type,
      author: content.metadata.author
    });
    console.log(`\u{1F4DD} Created content: ${content.title}`);
    return content;
  }
  // Update content
  updateContent(contentId, updates) {
    const content = this.content.get(contentId);
    if (!content)
      return null;
    const version = this.versionControl.createVersion(contentId, updates);
    Object.assign(content, updates);
    content.updatedAt = Date.now();
    content.version += 1;
    this.updateSearchIndex(content);
    this.analyticsEngine.track("content_updated", {
      contentId,
      version: content.version
    });
    console.log(`\u270F\uFE0F Updated content: ${content.title}`);
    return content;
  }
  // Delete content
  deleteContent(contentId) {
    const content = this.content.get(contentId);
    if (!content)
      return false;
    content.status = "deleted";
    this.searchIndex.delete(contentId);
    this.analyticsEngine.track("content_deleted", {
      contentId,
      type: content.type
    });
    console.log(`\u{1F5D1}\uFE0F Deleted content: ${content.title}`);
    return true;
  }
  // Search content
  searchContent(query) {
    const terms = query.toLowerCase().split(" ");
    const results = [];
    this.content.forEach((content, id) => {
      if (content.status === "deleted")
        return;
      const indexTerms = this.searchIndex.get(id) || [];
      const score = this.calculateSearchScore(terms, indexTerms);
      if (score > 0) {
        results.push(content);
      }
    });
    return results.sort((a, b) => {
      const scoreA = this.calculateSearchScore(terms, this.searchIndex.get(a.id) || []);
      const scoreB = this.calculateSearchScore(terms, this.searchIndex.get(b.id) || []);
      return scoreB - scoreA;
    });
  }
  // Calculate search score
  calculateSearchScore(queryTerms, indexTerms) {
    let score = 0;
    queryTerms.forEach((term) => {
      if (indexTerms.includes(term)) {
        score += 1;
      }
    });
    return score;
  }
  // Get content by collection
  getContentByCollection(collectionId) {
    const collection = this.collections.get(collectionId);
    if (!collection)
      return [];
    let results = Array.from(this.content.values()).filter((content) => {
      if (content.status === "deleted")
        return false;
      return collection.filters.every((filter) => {
        const fieldValue = this.getFieldValue(content, filter.field);
        return this.applyFilter(fieldValue, filter.operator, filter.value);
      });
    });
    results.sort((a, b) => {
      const aValue = this.getFieldValue(a, collection.sortBy);
      const bValue = this.getFieldValue(b, collection.sortBy);
      if (collection.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return results;
  }
  // Get field value
  getFieldValue(content, field) {
    switch (field) {
      case "title":
        return content.title;
      case "date":
        return content.createdAt;
      case "author":
        return content.metadata.author;
      case "type":
        return content.type;
      case "popularity":
        return this.analyticsEngine.getMetrics(content.id).views;
      default:
        return "";
    }
  }
  // Apply filter
  applyFilter(value, operator, filterValue) {
    switch (operator) {
      case "equals":
        return value === filterValue;
      case "contains":
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      case "greater":
        return value > filterValue;
      case "less":
        return value < filterValue;
      case "between":
        return value >= filterValue[0] && value <= filterValue[1];
      default:
        return false;
    }
  }
  // Update content metrics
  updateContentMetrics() {
    this.content.forEach((content, id) => {
      const metrics = this.analyticsEngine.getMetrics(id);
    });
  }
  // Process content updates
  processContentUpdates() {
  }
  // Optimize search index
  optimizeSearchIndex() {
  }
  // Get content
  getContent(contentId) {
    return this.content.get(contentId);
  }
  // Get all content
  getAllContent() {
    return Array.from(this.content.values()).filter((content) => content.status !== "deleted");
  }
  // Get collections
  getCollections() {
    return Array.from(this.collections.values());
  }
  // Get templates
  getTemplates() {
    return Array.from(this.templates.values());
  }
  // Get content metrics
  getContentMetrics(contentId) {
    return this.analyticsEngine.getMetrics(contentId);
  }
  // Cleanup system
  cleanup() {
    this.content.clear();
    this.collections.clear();
    this.templates.clear();
    this.searchIndex.clear();
    if (this.contentUI) {
      engine.removeEntity(this.contentUI);
    }
    this.isInitialized = false;
  }
};
var contentManagementSystem = new ContentManagementSystem();

// src/cross-platform-sync.ts
var CrossPlatformSyncSystem = class {
  constructor() {
    this.sessions = /* @__PURE__ */ new Map();
    this.currentSession = null;
    this.networks = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.syncQueue = [];
    this.maxQueueSize = 1e3;
    this.syncInterval = 100;
    // 100ms
    this.lastSyncTime = 0;
    this.initializeNetworks();
    this.setupConflictResolver();
  }
  // Initialize cross-platform sync system
  initialize() {
    console.log("\u{1F504} Cross-Platform Sync System Initializing...");
    this.createSyncUI();
    this.startSyncEngine();
    this.createDefaultSession();
    this.isInitialized = true;
    console.log("\u{1F504} Cross-Platform Sync System Ready!");
  }
  // Initialize networks
  initializeNetworks() {
    this.networks.set("websocket", {
      id: "network_websocket",
      type: "websocket",
      isConnected: false,
      latency: 50,
      bandwidth: 1e3,
      reliability: 0.95
    });
    this.networks.set("webrtc", {
      id: "network_webrtc",
      type: "webrtc",
      isConnected: false,
      latency: 20,
      bandwidth: 5e3,
      reliability: 0.98
    });
    this.networks.set("http", {
      id: "network_http",
      type: "http",
      isConnected: true,
      latency: 200,
      bandwidth: 2e3,
      reliability: 0.99
    });
    console.log("\u{1F310} Sync networks initialized");
  }
  // Setup conflict resolver
  setupConflictResolver() {
    this.conflictResolver = {
      resolve: (conflict, strategy) => {
        console.log(`\u{1F527} Resolving conflict ${conflict.id} with strategy: ${strategy}`);
        switch (strategy) {
          case "last_write_wins":
            return conflict.changes[conflict.changes.length - 1];
          case "first_write_wins":
            return conflict.changes[0];
          case "merge":
            return this.mergeChanges(conflict.changes);
          case "manual":
            return null;
          case "voting":
            return this.resolveByVoting(conflict.changes);
          default:
            return conflict.changes[conflict.changes.length - 1];
        }
      },
      merge: (changes) => {
        const merged = { ...changes[0].data };
        for (let i = 1; i < changes.length; i++) {
          Object.assign(merged, changes[i].data);
        }
        return merged;
      },
      resolveByVoting: (changes) => {
        const votes = /* @__PURE__ */ new Map();
        changes.forEach((change) => {
          votes.set(change.author, Math.random());
        });
        let maxVotes = 0;
        let winner = changes[0];
        votes.forEach((votes2, author) => {
          if (votes2 > maxVotes) {
            maxVotes = votes2;
            winner = changes.find((c) => c.author === author) || changes[0];
          }
        });
        return winner;
      }
    };
  }
  // Create sync UI
  createSyncUI() {
    this.syncUI = engine.addEntity();
    Transform2.create(this.syncUI, {
      position: Vector32.create(2, 3, 8),
      scale: Vector32.create(3, 4, 0.1)
    });
    MeshRenderer3.setBox(this.syncUI);
    Material3.setPbrMaterial(this.syncUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.syncUI,
      position: Vector32.create(0, 1.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F504} CROSS-PLATFORM SYNC",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createSessionControls();
    this.createPlatformIndicators();
    this.createSyncStatus();
    this.createConflictDisplay();
  }
  // Create session controls
  createSessionControls() {
    const controls = [
      { id: "create_session", icon: "\u2795", name: "Create Session" },
      { id: "join_session", icon: "\u{1F517}", name: "Join Session" },
      { id: "sync_now", icon: "\u{1F504}", name: "Sync Now" },
      { id: "leave_session", icon: "\u{1F6AA}", name: "Leave Session" }
    ];
    let xOffset = -0.9;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.syncUI,
        position: Vector32.create(xOffset, 1.2, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleSessionControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create platform indicators
  createPlatformIndicators() {
    const platforms = ["web", "mobile", "desktop", "vr", "ar", "console"];
    let xOffset = -1.2;
    platforms.forEach((platform) => {
      const indicator = engine.addEntity();
      Transform2.create(indicator, {
        parent: this.syncUI,
        position: Vector32.create(xOffset, 0.6, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(indicator);
      Material3.setPbrMaterial(indicator, {
        albedoColor: this.getPlatformColor(platform),
        emissiveColor: this.getPlatformColor(platform),
        emissiveIntensity: 0.5
      });
      const platformText = engine.addEntity();
      Transform2.create(platformText, {
        parent: indicator,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(platformText, {
        text: this.getPlatformIcon(platform),
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: InputAction.IA_POINTER, hoverText: platform }
        },
        () => this.connectPlatform(platform)
      );
      xOffset += 0.4;
    });
  }
  // Create sync status
  createSyncStatus() {
    const statusDisplay = engine.addEntity();
    Transform2.create(statusDisplay, {
      parent: this.syncUI,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(statusDisplay);
    Material3.setPbrMaterial(statusDisplay, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const statusText = engine.addEntity();
    Transform2.create(statusText, {
      parent: statusDisplay,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(statusText, {
      text: "\u{1F4CA} Status: Ready",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create conflict display
  createConflictDisplay() {
    const conflictDisplay = engine.addEntity();
    Transform2.create(conflictDisplay, {
      parent: this.syncUI,
      position: Vector32.create(0, -0.6, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(conflictDisplay);
    Material3.setPbrMaterial(conflictDisplay, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const conflictText = engine.addEntity();
    Transform2.create(conflictText, {
      parent: conflictDisplay,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(conflictText, {
      text: "\u26A0\uFE0F Conflicts: 0",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Get platform color
  getPlatformColor(platform) {
    switch (platform) {
      case "web":
        return Color42.create(0.2, 0.6, 1, 1);
      case "mobile":
        return Color42.create(0.8, 0.4, 0.2, 1);
      case "desktop":
        return Color42.create(0.2, 0.8, 0.4, 1);
      case "vr":
        return Color42.create(0.8, 0.2, 0.8, 1);
      case "ar":
        return Color42.create(0.2, 0.8, 0.8, 1);
      case "console":
        return Color42.create(0.8, 0.8, 0.2, 1);
      default:
        return Color42.create(0.5, 0.5, 0.5, 1);
    }
  }
  // Get platform icon
  getPlatformIcon(platform) {
    switch (platform) {
      case "web":
        return "\u{1F310}";
      case "mobile":
        return "\u{1F4F1}";
      case "desktop":
        return "\u{1F5A5}\uFE0F";
      case "vr":
        return "\u{1F97D}";
      case "ar":
        return "\u{1F4F7}";
      case "console":
        return "\u{1F3AE}";
      default:
        return "\u2753";
    }
  }
  // Start sync engine
  startSyncEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.processSyncQueue();
      this.checkConnections();
      this.detectConflicts();
      this.updateSyncStatus();
    });
  }
  // Create default session
  createDefaultSession() {
    const session = {
      id: "session_default",
      name: "Default Sync Session",
      platform: "web",
      status: "active",
      participants: [
        {
          id: "user_main",
          name: "Main User",
          platform: "web",
          role: "host",
          permissions: {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canInvite: true,
            canKick: true,
            canChangeSettings: true
          },
          status: "online",
          lastSeen: Date.now()
        }
      ],
      lastSync: Date.now(),
      syncInterval: 100,
      dataSync: {
        entities: /* @__PURE__ */ new Map(),
        settings: /* @__PURE__ */ new Map(),
        events: [],
        conflicts: [],
        version: 1
      },
      conflictResolution: {
        strategy: "last_write_wins",
        autoResolve: true,
        timeout: 5e3
      }
    };
    this.sessions.set(session.id, session);
    this.currentSession = session;
    console.log("\u{1F504} Default sync session created");
  }
  // Handle session control
  handleSessionControl(controlId) {
    switch (controlId) {
      case "create_session":
        this.createSession();
        break;
      case "join_session":
        this.joinSession();
        break;
      case "sync_now":
        this.forceSync();
        break;
      case "leave_session":
        this.leaveSession();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Create session
  createSession() {
    const sessionId = `session_${Date.now()}`;
    const session = {
      id: sessionId,
      name: `Sync Session ${this.sessions.size + 1}`,
      platform: "web",
      status: "active",
      participants: [
        {
          id: "user_main",
          name: "Main User",
          platform: "web",
          role: "host",
          permissions: {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canInvite: true,
            canKick: true,
            canChangeSettings: true
          },
          status: "online",
          lastSeen: Date.now()
        }
      ],
      lastSync: Date.now(),
      syncInterval: 100,
      dataSync: {
        entities: /* @__PURE__ */ new Map(),
        settings: /* @__PURE__ */ new Map(),
        events: [],
        conflicts: [],
        version: 1
      },
      conflictResolution: {
        strategy: "last_write_wins",
        autoResolve: true,
        timeout: 5e3
      }
    };
    this.sessions.set(sessionId, session);
    this.currentSession = session;
    console.log(`\u2795 Created session: ${session.name}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Join session
  joinSession() {
    console.log("\u{1F517} Joining session...");
    soundSystem.playInteractionSound("click");
  }
  // Force sync
  forceSync() {
    if (!this.currentSession)
      return;
    console.log("\u{1F504} Forcing sync...");
    this.currentSession.status = "syncing";
    setTimeout(() => {
      this.currentSession.status = "active";
      this.currentSession.lastSync = Date.now();
      console.log("\u2705 Sync completed");
    }, 1e3);
    soundSystem.playInteractionSound("powerup");
  }
  // Leave session
  leaveSession() {
    if (!this.currentSession)
      return;
    console.log(`\u{1F6AA} Leaving session: ${this.currentSession.name}`);
    this.currentSession = null;
    soundSystem.playInteractionSound("click");
  }
  // Connect platform
  connectPlatform(platform) {
    const network = this.networks.get(platform === "web" ? "websocket" : "webrtc");
    if (!network)
      return;
    network.isConnected = true;
    console.log(`\u{1F517} Connected to ${platform} platform`);
    soundSystem.playInteractionSound("powerup");
  }
  // Disconnect platform
  disconnectPlatform(platform) {
    const network = this.networks.get(platform === "web" ? "websocket" : "webrtc");
    if (!network)
      return;
    network.isConnected = false;
    console.log(`\u{1F50C} Disconnected from ${platform} platform`);
    soundSystem.playInteractionSound("click");
  }
  // Process sync queue
  processSyncQueue() {
    if (this.syncQueue.length === 0)
      return;
    const now = Date.now();
    if (now - this.lastSyncTime < this.syncInterval)
      return;
    const eventsToProcess = this.syncQueue.splice(0, 10);
    eventsToProcess.forEach((event) => {
      this.processSyncEvent(event);
    });
    this.lastSyncTime = now;
  }
  // Process sync event
  processSyncEvent(event) {
    if (!this.currentSession)
      return;
    console.log(`\u{1F4E4} Processing sync event: ${event.type} for ${event.target}`);
    this.currentSession.dataSync.events.push(event);
    if (this.currentSession.dataSync.events.length > 1e3) {
      this.currentSession.dataSync.events = this.currentSession.dataSync.events.slice(-500);
    }
    switch (event.type) {
      case "create":
        this.handleCreateEvent(event);
        break;
      case "update":
        this.handleUpdateEvent(event);
        break;
      case "delete":
        this.handleDeleteEvent(event);
        break;
      case "move":
        this.handleMoveEvent(event);
        break;
      case "interact":
        this.handleInteractEvent(event);
        break;
    }
  }
  // Handle create event
  handleCreateEvent(event) {
    const entity = {
      id: event.target,
      type: "custom",
      data: event.data,
      timestamp: event.timestamp,
      author: event.author,
      version: 1,
      conflicts: []
    };
    if (this.currentSession) {
      this.currentSession.dataSync.entities.set(event.target, entity);
    }
  }
  // Handle update event
  handleUpdateEvent(event) {
    if (!this.currentSession)
      return;
    const entity = this.currentSession.dataSync.entities.get(event.target);
    if (entity) {
      if (entity.author !== event.author && entity.timestamp > event.timestamp - 1e3) {
        this.createConflict(entity, event);
      } else {
        entity.data = event.data;
        entity.timestamp = event.timestamp;
        entity.author = event.author;
        entity.version++;
      }
    }
  }
  // Handle delete event
  handleDeleteEvent(event) {
    if (this.currentSession) {
      this.currentSession.dataSync.entities.delete(event.target);
    }
  }
  // Handle move event
  handleMoveEvent(event) {
    if (!this.currentSession)
      return;
    const entity = this.currentSession.dataSync.entities.get(event.target);
    if (entity && entity.type === "position") {
      entity.data = event.data;
      entity.timestamp = event.timestamp;
    }
  }
  // Handle interact event
  handleInteractEvent(event) {
    console.log`🎯 Interaction event: ${event.target} by ${event.author}`;
  }
  // Create conflict
  createConflict(entity, event) {
    const conflict = {
      id: `conflict_${Date.now()}_${Math.random()}`,
      type: "data",
      entity: entity.id,
      changes: [
        {
          author: entity.author,
          platform: this.currentSession.platform,
          data: entity.data,
          timestamp: entity.timestamp
        },
        {
          author: event.author,
          platform: event.platform,
          data: event.data,
          timestamp: event.timestamp
        }
      ],
      timestamp: Date.now(),
      status: "pending"
    };
    if (this.currentSession) {
      this.currentSession.dataSync.conflicts.push(conflict);
      if (this.currentSession.conflictResolution.autoResolve) {
        this.resolveConflict(conflict);
      }
    }
  }
  // Resolve conflict
  resolveConflict(conflict) {
    if (!this.currentSession)
      return;
    const resolution = this.conflictResolver.resolve(conflict, this.currentSession.conflictResolution.strategy);
    if (resolution) {
      const entity = this.currentSession.dataSync.entities.get(conflict.entity);
      if (entity) {
        entity.data = resolution.data;
        entity.author = resolution.author;
        entity.timestamp = resolution.timestamp;
        entity.version++;
      }
      conflict.status = "resolved";
      console.log(`\u2705 Resolved conflict ${conflict.id}`);
    } else {
      conflict.status = "ignored";
      console.log(`\u26A0\uFE0F Ignored conflict ${conflict.id}`);
    }
  }
  // Check connections
  checkConnections() {
    this.networks.forEach((network, id) => {
      if (Math.random() < 0.01) {
        network.latency = 20 + Math.random() * 100;
        network.bandwidth = 1e3 + Math.random() * 4e3;
        network.reliability = 0.9 + Math.random() * 0.09;
      }
    });
  }
  // Detect conflicts
  detectConflicts() {
    if (!this.currentSession)
      return;
    const now = Date.now();
    this.currentSession.dataSync.conflicts = this.currentSession.dataSync.conflicts.filter((conflict) => {
      return now - conflict.timestamp < 3e4;
    });
  }
  // Update sync status
  updateSyncStatus() {
    if (!this.currentSession)
      return;
    const totalEntities = this.currentSession.dataSync.entities.size;
    const pendingConflicts = this.currentSession.dataSync.conflicts.filter((c) => c.status === "pending").length;
    const queueSize = this.syncQueue.length;
    console.log(`\u{1F4CA} Sync Status: ${this.currentSession.status} | Entities: ${totalEntities} | Conflicts: ${pendingConflicts} | Queue: ${queueSize}`);
  }
  // Queue sync event
  queueSyncEvent(event) {
    if (this.syncQueue.length >= this.maxQueueSize) {
      this.syncQueue.shift();
    }
    this.syncQueue.push(event);
  }
  // Get current session
  getCurrentSession() {
    return this.currentSession;
  }
  // Get all sessions
  getSessions() {
    return Array.from(this.sessions.values());
  }
  // Get network status
  getNetworkStatus() {
    return new Map(this.networks);
  }
  // Get sync statistics
  getSyncStatistics() {
    if (!this.currentSession)
      return null;
    return {
      sessionId: this.currentSession.id,
      status: this.currentSession.status,
      participants: this.currentSession.participants.length,
      entities: this.currentSession.dataSync.entities.size,
      events: this.currentSession.dataSync.events.length,
      conflicts: this.currentSession.dataSync.conflicts.length,
      lastSync: this.currentSession.lastSync,
      queueSize: this.syncQueue.length
    };
  }
  // Set conflict resolution strategy
  setConflictResolutionStrategy(strategy) {
    if (this.currentSession) {
      this.currentSession.conflictResolution.strategy = strategy;
      console.log(`\u{1F527} Conflict resolution strategy set to: ${strategy}`);
    }
  }
  // Enable/disable auto-resolve
  setAutoResolve(enabled) {
    if (this.currentSession) {
      this.currentSession.conflictResolution.autoResolve = enabled;
      console.log(`\u{1F916} Auto-resolve ${enabled ? "enabled" : "disabled"}`);
    }
  }
  // Cleanup system
  cleanup() {
    this.sessions.clear();
    this.networks.clear();
    this.syncQueue = [];
    if (this.syncUI) {
      engine.removeEntity(this.syncUI);
    }
    this.isInitialized = false;
  }
};
var crossPlatformSyncSystem = new CrossPlatformSyncSystem();

// src/emotion-detection.ts
var EmotionDetectionSystem = class {
  constructor() {
    this.emotionProfiles = /* @__PURE__ */ new Map();
    this.currentEmotions = /* @__PURE__ */ new Map();
    this.adaptiveResponses = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.detectionSensitivity = 0.7;
    this.adaptationThreshold = 0.8;
    this.emotionHistory = [];
    this.maxHistoryLength = 100;
    this.setupAdaptiveResponses();
  }
  // Initialize emotion detection system
  initialize() {
    console.log("\u{1F60A} Emotion Detection System Initializing...");
    this.createEmotionUI();
    this.createDefaultProfiles();
    this.startEmotionEngine();
    this.initializeSensors();
    this.isInitialized = true;
    console.log("\u{1F60A} Emotion Detection System Ready!");
  }
  // Setup adaptive responses
  setupAdaptiveResponses() {
    this.adaptiveResponses.set("joy_bright", {
      id: "joy_bright",
      emotionTrigger: "joy",
      responseType: "environmental",
      action: {
        type: "adjust_lighting",
        parameters: /* @__PURE__ */ new Map([
          ["brightness", 1.2],
          ["color", "warm"],
          ["duration", 5e3]
        ]),
        duration: 5e3,
        intensity: 0.8
      },
      priority: 1,
      conditions: [
        { parameter: "intensity", operator: "greater", value: 0.6 }
      ]
    });
    this.adaptiveResponses.set("joy_music", {
      id: "joy_music",
      emotionTrigger: "joy",
      responseType: "audio",
      action: {
        type: "play_music",
        parameters: /* @__PURE__ */ new Map([
          ["genre", "upbeat"],
          ["volume", 0.6],
          ["duration", 3e3]
        ]),
        duration: 3e3,
        intensity: 0.7
      },
      priority: 2,
      conditions: []
    });
    this.adaptiveResponses.set("stress_calm", {
      id: "stress_calm",
      emotionTrigger: "stress",
      responseType: "environmental",
      action: {
        type: "adjust_lighting",
        parameters: /* @__PURE__ */ new Map([
          ["brightness", 0.7],
          ["color", "cool"],
          ["duration", 1e4]
        ]),
        duration: 1e4,
        intensity: 0.9
      },
      priority: 1,
      conditions: [
        { parameter: "intensity", operator: "greater", value: 0.5 }
      ]
    });
    this.adaptiveResponses.set("stress_breathing", {
      id: "stress_breathing",
      emotionTrigger: "stress",
      responseType: "visual",
      action: {
        type: "breathing_guide",
        parameters: /* @__PURE__ */ new Map([
          ["rate", 0.2],
          ["duration", 5e3]
        ]),
        duration: 5e3,
        intensity: 0.8
      },
      priority: 2,
      conditions: []
    });
    this.adaptiveResponses.set("focus_minimize", {
      id: "focus_minimize",
      emotionTrigger: "focus",
      responseType: "environmental",
      action: {
        type: "minimize_distractions",
        parameters: /* @__PURE__ */ new Map([
          ["ui_opacity", 0.3],
          ["notifications", false],
          ["duration", 15e3]
        ]),
        duration: 15e3,
        intensity: 0.9
      },
      priority: 1,
      conditions: [
        { parameter: "intensity", operator: "greater", value: 0.7 }
      ]
    });
    this.adaptiveResponses.set("sadness_comfort", {
      id: "sadness_comfort",
      emotionTrigger: "sadness",
      responseType: "audio",
      action: {
        type: "play_music",
        parameters: /* @__PURE__ */ new Map([
          ["genre", "comforting"],
          ["volume", 0.4],
          ["duration", 8e3]
        ]),
        duration: 8e3,
        intensity: 0.6
      },
      priority: 1,
      conditions: []
    });
    this.adaptiveResponses.set("anger_cool", {
      id: "anger_cool",
      emotionTrigger: "anger",
      responseType: "environmental",
      action: {
        type: "adjust_temperature",
        parameters: /* @__PURE__ */ new Map([
          ["temperature", 20],
          ["duration", 1e4]
        ]),
        duration: 1e4,
        intensity: 0.8
      },
      priority: 1,
      conditions: [
        { parameter: "intensity", operator: "greater", value: 0.6 }
      ]
    });
    console.log("\u{1F3AD} Adaptive responses configured");
  }
  // Create emotion UI
  createEmotionUI() {
    this.emotionUI = engine.addEntity();
    Transform2.create(this.emotionUI, {
      position: Vector32.create(8, 4, 14),
      scale: Vector32.create(3, 3, 0.1)
    });
    MeshRenderer3.setBox(this.emotionUI);
    Material3.setPbrMaterial(this.emotionUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.emotionUI,
      position: Vector32.create(0, 1.2, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F60A} EMOTION DETECTION",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createEmotionIndicators();
    this.createResponseControls();
    this.createProfileDisplay();
  }
  // Create emotion indicators
  createEmotionIndicators() {
    const emotions = ["joy", "stress", "focus", "sadness", "anger", "calm"];
    let xOffset = -1.2;
    emotions.forEach((emotion) => {
      const indicator = engine.addEntity();
      Transform2.create(indicator, {
        parent: this.emotionUI,
        position: Vector32.create(xOffset, 0.6, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(indicator);
      Material3.setPbrMaterial(indicator, {
        albedoColor: this.getEmotionColor(emotion),
        emissiveColor: this.getEmotionColor(emotion),
        emissiveIntensity: 0.5
      });
      const emotionText = engine.addEntity();
      Transform2.create(emotionText, {
        parent: indicator,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(emotionText, {
        text: this.getEmotionIcon(emotion),
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: InputAction.IA_POINTER, hoverText: `Simulate ${emotion}` }
        },
        () => this.simulateEmotion(emotion)
      );
      xOffset += 0.4;
    });
  }
  // Create response controls
  createResponseControls() {
    const controls = [
      { id: "enable_adaptation", icon: "\u{1F504}", name: "Enable Adaptation" },
      { id: "disable_adaptation", icon: "\u23F8\uFE0F", name: "Disable Adaptation" },
      { id: "calibrate", icon: "\u2699\uFE0F", name: "Calibrate" }
    ];
    let xOffset = -0.8;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.emotionUI,
        position: Vector32.create(xOffset, 0.2, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleResponseControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Create profile display
  createProfileDisplay() {
    const profileDisplay = engine.addEntity();
    Transform2.create(profileDisplay, {
      parent: this.emotionUI,
      position: Vector32.create(0, -0.4, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(profileDisplay);
    Material3.setPbrMaterial(profileDisplay, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const profileText = engine.addEntity();
    Transform2.create(profileText, {
      parent: profileDisplay,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(profileText, {
      text: "\u{1F464} Profile: Active",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Get emotion color
  getEmotionColor(emotion) {
    switch (emotion) {
      case "joy":
        return Color42.create(1, 0.8, 0.2, 1);
      case "stress":
        return Color42.create(0.8, 0.2, 0.2, 1);
      case "focus":
        return Color42.create(0.2, 0.8, 0.8, 1);
      case "sadness":
        return Color42.create(0.2, 0.4, 0.8, 1);
      case "anger":
        return Color42.create(0.8, 0.2, 0.2, 1);
      case "calm":
        return Color42.create(0.2, 0.8, 0.4, 1);
      default:
        return Color42.create(0.5, 0.5, 0.5, 1);
    }
  }
  // Get emotion icon
  getEmotionIcon(emotion) {
    switch (emotion) {
      case "joy":
        return "\u{1F60A}";
      case "stress":
        return "\u{1F630}";
      case "focus":
        return "\u{1F3AF}";
      case "sadness":
        return "\u{1F622}";
      case "anger":
        return "\u{1F620}";
      case "calm":
        return "\u{1F60C}";
      default:
        return "\u{1F610}";
    }
  }
  // Create default profiles
  createDefaultProfiles() {
    const defaultProfile = {
      userId: "user_default",
      baselineEmotions: /* @__PURE__ */ new Map([
        ["joy", 0.3],
        ["stress", 0.2],
        ["focus", 0.4],
        ["sadness", 0.1],
        ["anger", 0.1],
        ["calm", 0.5],
        ["neutral", 0.6]
      ]),
      personalityTraits: [
        { trait: "openness", value: 0.7 },
        { trait: "conscientiousness", value: 0.8 },
        { trait: "extraversion", value: 0.6 },
        { trait: "agreeableness", value: 0.7 },
        { trait: "neuroticism", value: 0.3 }
      ],
      preferences: {
        lightingPreference: "adaptive",
        musicPreference: ["ambient", "classical"],
        colorPreference: [Color32.create(0.2, 0.4, 0.8), Color32.create(0.8, 0.6, 0.2)],
        interactionStyle: "subtle",
        privacyLevel: "medium"
      },
      history: [],
      adaptationLevel: 0.5
    };
    this.emotionProfiles.set(defaultProfile.userId, defaultProfile);
    console.log("\u{1F464} Default emotion profile created");
  }
  // Start emotion engine
  startEmotionEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.detectEmotions();
      this.processAdaptiveResponses();
      this.updateEmotionHistory();
    });
  }
  // Initialize sensors
  initializeSensors() {
    console.log("\u{1F4E1} Initializing emotion sensors...");
  }
  // Detect emotions
  detectEmotions() {
    if (Math.random() < 0.02) {
      const emotions = ["joy", "stress", "focus", "calm", "sadness", "anger"];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      this.detectEmotion("user_default", randomEmotion, Math.random() * 0.5 + 0.5);
    }
  }
  // Detect emotion
  detectEmotion(userId, emotion, intensity) {
    const profile = this.emotionProfiles.get(userId);
    if (!profile)
      return;
    const emotionData = {
      id: `emotion_${Date.now()}_${Math.random()}`,
      userId,
      timestamp: Date.now(),
      primaryEmotion: emotion,
      confidence: Math.random() * 0.3 + 0.7,
      intensity,
      triggers: this.identifyTriggers(emotion),
      context: {
        activity: "working",
        location: "office",
        participants: ["user"],
        environment: "virtual_office",
        timeOfDay: (/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : "afternoon"
      },
      physiological: {
        heartRate: 60 + Math.random() * 40,
        voiceTone: Math.random(),
        facialExpression: Math.random(),
        bodyLanguage: Math.random(),
        responseTime: Math.random() * 1e3 + 200
      }
    };
    this.currentEmotions.set(userId, emotionData);
    this.emotionHistory.push(emotionData);
    if (this.emotionHistory.length > this.maxHistoryLength) {
      this.emotionHistory.shift();
    }
    profile.history.push(emotionData);
    this.adaptProfile(userId, emotionData);
    console.log(`\u{1F60A} Detected emotion: ${emotion} (intensity: ${intensity.toFixed(2)})`);
  }
  // Identify triggers
  identifyTriggers(emotion) {
    const triggers = [];
    switch (emotion) {
      case "joy":
        triggers.push("achievement", "social_interaction", "success");
        break;
      case "stress":
        triggers.push("deadline", "complexity", "interruption");
        break;
      case "focus":
        triggers.push("task_engagement", "goal_orientation");
        break;
      case "sadness":
        triggers.push("setback", "isolation", "failure");
        break;
      case "anger":
        triggers.push("frustration", "obstacle", "conflict");
        break;
      case "calm":
        triggers.push("meditation", "completion", "satisfaction");
        break;
    }
    return triggers;
  }
  // Adapt profile
  adaptProfile(userId, emotionData) {
    const profile = this.emotionProfiles.get(userId);
    if (!profile)
      return;
    const currentBaseline = profile.baselineEmotions.get(emotionData.primaryEmotion) || 0;
    const newBaseline = currentBaseline * 0.9 + emotionData.intensity * 0.1;
    profile.baselineEmotions.set(emotionData.primaryEmotion, newBaseline);
    profile.adaptationLevel = Math.min(1, profile.adaptationLevel + 0.01);
    console.log(`\u{1F4C8} Adapted profile for ${userId} (adaptation level: ${profile.adaptationLevel.toFixed(2)})`);
  }
  // Process adaptive responses
  processAdaptiveResponses() {
    this.currentEmotions.forEach((emotionData, userId) => {
      const profile = this.emotionProfiles.get(userId);
      if (!profile)
        return;
      if (emotionData.intensity > this.adaptationThreshold) {
        this.triggerAdaptiveResponse(emotionData, profile);
      }
    });
  }
  // Trigger adaptive response
  triggerAdaptiveResponse(emotionData, profile) {
    const responseKey = `${emotionData.primaryEmotion}_${this.getBestResponseType(emotionData, profile)}`;
    const response = this.adaptiveResponses.get(responseKey);
    if (response) {
      const conditionsMet = response.conditions.every((condition) => {
        const value = emotionData.intensity;
        switch (condition.operator) {
          case "greater":
            return value > condition.value;
          case "less":
            return value < condition.value;
          case "equals":
            return value === condition.value;
          case "between":
            return value >= condition.value[0] && value <= condition.value[1];
          default:
            return false;
        }
      });
      if (conditionsMet) {
        this.executeAdaptiveResponse(response, emotionData);
      }
    }
  }
  // Get best response type
  getBestResponseType(emotionData, profile) {
    switch (profile.preferences.interactionStyle) {
      case "direct":
        return "environmental";
      case "subtle":
        return "audio";
      case "minimal":
        return "visual";
      default:
        return "environmental";
    }
  }
  // Execute adaptive response
  executeAdaptiveResponse(response, emotionData) {
    console.log(`\u{1F3AD} Executing adaptive response: ${response.action.type}`);
    switch (response.action.type) {
      case "adjust_lighting":
        this.adjustLighting(response.action.parameters);
        break;
      case "play_music":
        this.playMusic(response.action.parameters);
        break;
      case "breathing_guide":
        this.showBreathingGuide(response.action.parameters);
        break;
      case "minimize_distractions":
        this.minimizeDistractions(response.action.parameters);
        break;
      case "adjust_temperature":
        this.adjustTemperature(response.action.parameters);
        break;
    }
    soundSystem.playInteractionSound("powerup");
  }
  // Adjust lighting
  adjustLighting(parameters) {
    const brightness = parameters.get("brightness");
    const color = parameters.get("color");
    const duration = parameters.get("duration");
    console.log(`\u{1F4A1} Adjusting lighting: brightness=${brightness}, color=${color}, duration=${duration}ms`);
  }
  // Play music
  playMusic(parameters) {
    const genre = parameters.get("genre");
    const volume = parameters.get("volume");
    const duration = parameters.get("duration");
    console.log(`\u{1F3B5} Playing music: genre=${genre}, volume=${volume}, duration=${duration}ms`);
  }
  // Show breathing guide
  showBreathingGuide(parameters) {
    const rate = parameters.get("rate");
    const duration = parameters.get("duration");
    console.log(`\u{1FAC1} Showing breathing guide: rate=${rate}, duration=${duration}ms`);
  }
  // Minimize distractions
  minimizeDistractions(parameters) {
    const uiOpacity = parameters.get("ui_opacity");
    const notifications = parameters.get("notifications");
    const duration = parameters.get("duration");
    console.log(`\u{1F507} Minimizing distractions: ui_opacity=${uiOpacity}, notifications=${notifications}`);
  }
  // Adjust temperature
  adjustTemperature(parameters) {
    const temperature = parameters.get("temperature");
    const duration = parameters.get("duration");
    console.log(`\u{1F321}\uFE0F Adjusting temperature: ${temperature}\xB0C for ${duration}ms`);
  }
  // Update emotion history
  updateEmotionHistory() {
    const now = Date.now();
    this.currentEmotions.forEach((emotion, userId) => {
      if (now - emotion.timestamp > 3e4) {
        this.currentEmotions.delete(userId);
      }
    });
  }
  // Handle response control
  handleResponseControl(controlId) {
    switch (controlId) {
      case "enable_adaptation":
        this.adaptationThreshold = 0.5;
        console.log("\u{1F504} Emotion adaptation enabled");
        break;
      case "disable_adaptation":
        this.adaptationThreshold = 1;
        console.log("\u23F8\uFE0F Emotion adaptation disabled");
        break;
      case "calibrate":
        this.calibrateSystem();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Simulate emotion
  simulateEmotion(emotion) {
    const intensity = Math.random() * 0.5 + 0.5;
    this.detectEmotion("user_default", emotion, intensity);
    soundSystem.playInteractionSound("click");
  }
  // Calibrate system
  calibrateSystem() {
    console.log("\u2699\uFE0F Calibrating emotion detection system...");
    this.adaptationThreshold = 0.8;
    this.currentEmotions.clear();
    this.detectionSensitivity = 0.7;
    console.log("\u2705 Calibration complete");
    soundSystem.playInteractionSound("powerup");
  }
  // Get current emotion
  getCurrentEmotion(userId) {
    return this.currentEmotions.get(userId);
  }
  // Get emotion profile
  getEmotionProfile(userId) {
    return this.emotionProfiles.get(userId);
  }
  // Get emotion history
  getEmotionHistory() {
    return [...this.emotionHistory];
  }
  // Set detection sensitivity
  setDetectionSensitivity(sensitivity) {
    this.detectionSensitivity = Math.max(0, Math.min(1, sensitivity));
    console.log(`\u{1F4E1} Detection sensitivity set to: ${this.detectionSensitivity}`);
  }
  // Set adaptation threshold
  setAdaptationThreshold(threshold) {
    this.adaptationThreshold = Math.max(0, Math.min(1, threshold));
    console.log(`\u{1F3AD} Adaptation threshold set to: ${this.adaptationThreshold}`);
  }
  // Create custom profile
  createProfile(userId, preferences) {
    const profile = {
      userId,
      baselineEmotions: /* @__PURE__ */ new Map([
        ["joy", 0.3],
        ["stress", 0.2],
        ["focus", 0.4],
        ["sadness", 0.1],
        ["anger", 0.1],
        ["calm", 0.5],
        ["neutral", 0.6]
      ]),
      personalityTraits: [
        { trait: "openness", value: 0.5 },
        { trait: "conscientiousness", value: 0.5 },
        { trait: "extraversion", value: 0.5 },
        { trait: "agreeableness", value: 0.5 },
        { trait: "neuroticism", value: 0.5 }
      ],
      preferences: {
        lightingPreference: "adaptive",
        musicPreference: ["ambient"],
        colorPreference: [Color32.create(0.5, 0.5, 0.5)],
        interactionStyle: "subtle",
        privacyLevel: "medium",
        ...preferences
      },
      history: [],
      adaptationLevel: 0.3
    };
    this.emotionProfiles.set(userId, profile);
    console.log(`\u{1F464} Created emotion profile for ${userId}`);
    return profile;
  }
  // Cleanup system
  cleanup() {
    this.emotionProfiles.clear();
    this.currentEmotions.clear();
    this.adaptiveResponses.clear();
    this.emotionHistory = [];
    if (this.emotionUI) {
      engine.removeEntity(this.emotionUI);
    }
    this.isInitialized = false;
  }
};
var emotionDetectionSystem = new EmotionDetectionSystem();

// src/enhanced-architecture.ts
var AnimationSystem = class {
  constructor() {
    this.animations = /* @__PURE__ */ new Map();
  }
  addAnimation(entity, data) {
    this.animations.set(entity, data);
  }
  update(deltaTime) {
    this.animations.forEach((data, entity) => {
      data.time += deltaTime;
      const transform = Transform2.getMutable(entity);
      if (data.type === "pulse") {
        const scale = 1 + Math.sin(data.time * data.speed) * data.intensity;
        transform.scale = Vector32.create(scale, scale, scale);
      } else if (data.type === "rotate") {
        transform.rotation = Quaternion2.fromEulerDegrees(
          0,
          data.time * data.speed * 10,
          0
        );
      } else if (data.type === "float") {
        transform.position.y = data.baseY + Math.sin(data.time * data.speed) * data.intensity;
      }
    });
  }
};
var animationSystem = new AnimationSystem();
function createEnhancedArchitecture() {
  const holographicFloor = engine.addEntity();
  Material3.setPbrMaterial(holographicFloor, {
    albedoColor: Color42.create(0.1, 0.3, 0.6, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color42.create(0, 0.2, 0.4, 0.5),
    emissiveIntensity: 2
  });
  const quantumGlass = engine.addEntity();
  Material3.setPbrMaterial(quantumGlass, {
    albedoColor: Color42.create(0.3, 0.6, 1, 0.15),
    roughness: 0,
    metallic: 0.2,
    alphaTest: 0.05,
    emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.3),
    emissiveIntensity: 1
  });
  const floor = engine.addEntity();
  Transform2.create(floor, {
    position: Vector32.create(8, 0.01, 8),
    scale: Vector32.create(16, 0.1, 16)
  });
  MeshRenderer3.setBox(floor);
  Material3.setPbrMaterial(floor, {
    albedoColor: Color42.create(0.05, 0.1, 0.2, 0.9),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: Color42.create(0, 0.3, 0.6, 0.4),
    emissiveIntensity: 3
  });
  const ceiling = engine.addEntity();
  Transform2.create(ceiling, {
    position: Vector32.create(8, 6, 8),
    scale: Vector32.create(16, 0.1, 16)
  });
  MeshRenderer3.setBox(ceiling);
  Material3.setPbrMaterial(ceiling, {
    albedoColor: Color42.create(0.1, 0.05, 0.15, 1),
    roughness: 0.2,
    metallic: 0.7,
    emissiveColor: Color42.create(0.4, 0.2, 0.8, 0.3),
    emissiveIntensity: 2
  });
  const backWall = engine.addEntity();
  Transform2.create(backWall, {
    position: Vector32.create(8, 3, 15.9),
    scale: Vector32.create(16, 6, 0.2)
  });
  MeshRenderer3.setBox(backWall);
  Material3.setPbrMaterial(backWall, {
    albedoColor: Color42.create(0.15, 0.1, 0.2, 1),
    roughness: 0.3,
    metallic: 0.6,
    emissiveColor: Color42.create(0.3, 0.1, 0.5, 0.2),
    emissiveIntensity: 1
  });
  const leftGlass = engine.addEntity();
  Transform2.create(leftGlass, {
    position: Vector32.create(0.1, 3, 8),
    scale: Vector32.create(0.2, 6, 16)
  });
  MeshRenderer3.setBox(leftGlass);
  Material3.setPbrMaterial(leftGlass, {
    albedoColor: Color42.create(0.5, 0.7, 1, 0.2),
    roughness: 0,
    metallic: 0.3,
    emissiveColor: Color42.create(0.3, 0.5, 1, 0.4),
    emissiveIntensity: 2
  });
  const rightGlass = engine.addEntity();
  Transform2.create(rightGlass, {
    position: Vector32.create(15.9, 3, 8),
    scale: Vector32.create(0.2, 6, 16)
  });
  MeshRenderer3.setBox(rightGlass);
  Material3.setPbrMaterial(rightGlass, {
    albedoColor: Color42.create(0.5, 0.7, 1, 0.2),
    roughness: 0,
    metallic: 0.3,
    emissiveColor: Color42.create(0.3, 0.5, 1, 0.4),
    emissiveIntensity: 2
  });
  const pillar1 = engine.addEntity();
  Transform2.create(pillar1, {
    position: Vector32.create(2, 3, 0.5),
    scale: Vector32.create(1.2, 6, 1.2)
  });
  MeshRenderer3.setBox(pillar1);
  Material3.setPbrMaterial(pillar1, {
    albedoColor: Color42.create(0.2, 0.4, 0.8, 1),
    roughness: 0.2,
    metallic: 0.8,
    emissiveColor: Color42.create(0.2, 0.3, 0.7, 0.5),
    emissiveIntensity: 3
  });
  const pillar2 = engine.addEntity();
  Transform2.create(pillar2, {
    position: Vector32.create(14, 3, 0.5),
    scale: Vector32.create(1.2, 6, 1.2)
  });
  MeshRenderer3.setBox(pillar2);
  Material3.setPbrMaterial(pillar2, {
    albedoColor: Color42.create(0.2, 0.4, 0.8, 1),
    roughness: 0.2,
    metallic: 0.8,
    emissiveColor: Color42.create(0.2, 0.3, 0.7, 0.5),
    emissiveIntensity: 3
  });
  const neonStrip1 = engine.addEntity();
  Transform2.create(neonStrip1, {
    position: Vector32.create(8, 5.9, 8),
    scale: Vector32.create(14, 0.05, 14)
  });
  MeshRenderer3.setBox(neonStrip1);
  Material3.setPbrMaterial(neonStrip1, {
    albedoColor: Color42.create(0, 0, 0, 1),
    emissiveColor: Color42.create(0.8, 0.3, 1, 1),
    emissiveIntensity: 8
  });
  const neonStrip2 = engine.addEntity();
  Transform2.create(neonStrip2, {
    position: Vector32.create(8, 5.7, 8),
    scale: Vector32.create(13, 0.05, 13)
  });
  MeshRenderer3.setBox(neonStrip2);
  Material3.setPbrMaterial(neonStrip2, {
    albedoColor: Color42.create(0, 0, 0, 1),
    emissiveColor: Color42.create(0.3, 0.8, 1, 1),
    emissiveIntensity: 6
  });
  for (let i = 0; i < 5; i++) {
    const dataStream = engine.addEntity();
    Transform2.create(dataStream, {
      position: Vector32.create(3 + i * 2.5, 3, 2),
      scale: Vector32.create(0.1, 4, 0.1)
    });
    MeshRenderer3.setBox(dataStream);
    Material3.setPbrMaterial(dataStream, {
      albedoColor: Color42.create(0, 1, 0.8, 0.6),
      roughness: 0,
      metallic: 0.5,
      emissiveColor: Color42.create(0, 1, 0.8, 1),
      emissiveIntensity: 4
    });
  }
  const quantumPlatform = engine.addEntity();
  Transform2.create(quantumPlatform, {
    position: Vector32.create(8, 0.5, 8),
    scale: Vector32.create(4, 0.2, 4)
  });
  MeshRenderer3.setBox(quantumPlatform);
  Material3.setPbrMaterial(quantumPlatform, {
    albedoColor: Color42.create(0.2, 0.1, 0.4, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color42.create(0.6, 0.3, 1, 0.6),
    emissiveIntensity: 5
  });
  for (let i = 0; i < 3; i++) {
    const displayPanel = engine.addEntity();
    Transform2.create(displayPanel, {
      position: Vector32.create(4 + i * 4, 4, 12),
      scale: Vector32.create(2, 1.5, 0.1)
    });
    MeshRenderer3.setBox(displayPanel);
    Material3.setPbrMaterial(displayPanel, {
      albedoColor: Color42.create(0, 0, 0, 0.9),
      roughness: 0.1,
      metallic: 0.8,
      emissiveColor: Color42.create(0.2, 0.8, 1, 0.4),
      emissiveIntensity: 3
    });
  }
  const energyCore = engine.addEntity();
  Transform2.create(energyCore, {
    position: Vector32.create(8, 2, 8),
    scale: Vector32.create(1, 1, 1)
  });
  MeshRenderer3.setBox(energyCore);
  Material3.setPbrMaterial(energyCore, {
    albedoColor: Color42.create(1, 1, 1, 0.8),
    roughness: 0,
    metallic: 1,
    emissiveColor: Color42.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 10
  });
  createArtGallery();
  animationSystem.addAnimation(energyCore, {
    type: "float",
    speed: 0.8,
    intensity: 0.3,
    time: 0,
    baseY: 2
  });
  engine.addSystem(() => {
    animationSystem.update(0.016);
  });
}
function createArtGallery() {
  console.log("\u{1F3A8} Creating Art Gallery...");
}

// src/enhanced-interactables.ts
var systemStatusEntity;
var alertSystemEntity;
function createEnhancedInteractables() {
  const mainDashboard = engine.addEntity();
  Transform2.create(mainDashboard, {
    position: Vector32.create(8, 3, 15.5),
    scale: Vector32.create(8, 4, 0.2)
  });
  MeshRenderer3.setBox(mainDashboard);
  Material3.setPbrMaterial(mainDashboard, {
    albedoColor: Color42.create(0, 0, 0, 0.95),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color42.create(0.1, 0.3, 0.6, 0.3),
    emissiveIntensity: 2
  });
  const titleText = engine.addEntity();
  Transform2.create(titleText, {
    parent: mainDashboard,
    position: Vector32.create(0, 0.4, -0.8),
    scale: Vector32.create(0.125, 0.25, 1)
  });
  TextShape3.create(titleText, {
    text: "\u26A1 AIGESTION NEXUS HQ \u26A1",
    textColor: Color42.create(0.8, 0.5, 1, 1),
    fontSize: 6,
    textAlign: 3,
    outlineWidth: 0.1,
    outlineColor: Color42.create(0.5, 0.2, 0.8, 1)
  });
  systemStatusEntity = engine.addEntity();
  Transform2.create(systemStatusEntity, {
    parent: mainDashboard,
    position: Vector32.create(0, -0.1, -0.8),
    scale: Vector32.create(0.125, 0.25, 1)
  });
  TextShape3.create(systemStatusEntity, {
    text: "\u{1F525} SYSTEMS ONLINE \u{1F525}\n\u26A1 Quantum Core: ACTIVE\n\u{1F310} Network: OPTIMAL\n\u{1F6E1}\uFE0F Security: ENHANCED",
    textColor: Color42.create(0, 1, 0.8, 1),
    fontSize: 3,
    textAlign: 3
  });
  alertSystemEntity = engine.addEntity();
  Transform2.create(alertSystemEntity, {
    parent: mainDashboard,
    position: Vector32.create(0, -0.5, -0.8),
    scale: Vector32.create(0.125, 0.25, 1)
  });
  TextShape3.create(alertSystemEntity, {
    text: "\u{1F4E1} Real-time Monitoring Active...",
    textColor: Color42.create(1, 1, 0, 1),
    fontSize: 2.5,
    textAlign: 3
  });
  const quantumPanel = engine.addEntity();
  Transform2.create(quantumPanel, {
    position: Vector32.create(2, 1.5, 10),
    scale: Vector32.create(2, 2, 0.3)
  });
  MeshRenderer3.setBox(quantumPanel);
  Material3.setPbrMaterial(quantumPanel, {
    albedoColor: Color42.create(0.2, 0.1, 0.4, 0.9),
    roughness: 0.2,
    metallic: 0.8,
    emissiveColor: Color42.create(0.6, 0.3, 1, 0.5),
    emissiveIntensity: 3
  });
  const quantumLabel = engine.addEntity();
  Transform2.create(quantumLabel, {
    parent: quantumPanel,
    position: Vector32.create(0, 0.3, -0.6),
    scale: Vector32.create(0.5, 0.5, 1)
  });
  TextShape3.create(quantumLabel, {
    text: "QUANTUM\nCORE",
    textColor: Color42.create(0.8, 0.5, 1, 1),
    fontSize: 4,
    textAlign: 3
  });
  const networkPanel = engine.addEntity();
  Transform2.create(networkPanel, {
    position: Vector32.create(14, 1.5, 10),
    scale: Vector32.create(2, 2, 0.3)
  });
  MeshRenderer3.setBox(networkPanel);
  Material3.setPbrMaterial(networkPanel, {
    albedoColor: Color42.create(0.1, 0.3, 0.6, 0.9),
    roughness: 0.2,
    metallic: 0.8,
    emissiveColor: Color42.create(0.2, 0.6, 1, 0.5),
    emissiveIntensity: 3
  });
  const networkLabel = engine.addEntity();
  Transform2.create(networkLabel, {
    parent: networkPanel,
    position: Vector32.create(0, 0.3, -0.6),
    scale: Vector32.create(0.5, 0.5, 1)
  });
  TextShape3.create(networkLabel, {
    text: "NETWORK\nHUB",
    textColor: Color42.create(0.5, 0.8, 1, 1),
    fontSize: 4,
    textAlign: 3
  });
  const masterControl = engine.addEntity();
  Transform2.create(masterControl, {
    position: Vector32.create(8, 2, 8),
    scale: Vector32.create(1.5, 1.5, 1.5)
  });
  MeshRenderer3.setBox(masterControl);
  Material3.setPbrMaterial(masterControl, {
    albedoColor: Color42.create(1, 0.8, 0.2, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color42.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 8
  });
  pointerEventsSystem.onPointerDown(
    {
      entity: masterControl,
      opts: { button: InputAction.IA_POINTER, hoverText: "\u{1F3AE} MASTER CONTROL SYSTEM" }
    },
    () => {
      console.log("\u{1F3AE} Master Control Activated - Quantum Systems Online");
      soundSystem.playInteractionSound("powerup");
      updateSystemStatus("QUANTUM_MODE", true);
    }
  );
  pointerEventsSystem.onPointerDown(
    {
      entity: quantumPanel,
      opts: { button: InputAction.IA_POINTER, hoverText: "\u26A1 Activate Quantum Core" }
    },
    () => {
      console.log("\u26A1 Quantum Core Activation Sequence");
      soundSystem.playInteractionSound("powerup");
      updateSystemStatus("QUANTUM_CORE", true);
    }
  );
  pointerEventsSystem.onPointerDown(
    {
      entity: networkPanel,
      opts: { button: InputAction.IA_POINTER, hoverText: "\u{1F310} Network Diagnostics" }
    },
    () => {
      console.log("\u{1F310} Network Diagnostics Running");
      soundSystem.playInteractionSound("click");
      updateSystemStatus("NETWORK_SCAN", true);
    }
  );
  for (let i = 0; i < 5; i++) {
    const dataOrb = engine.addEntity();
    Transform2.create(dataOrb, {
      position: Vector32.create(3 + i * 1.5, 3.5, 5 + i * 0.5),
      scale: Vector32.create(0.5, 0.5, 0.5)
    });
    MeshRenderer3.setBox(dataOrb);
    Material3.setPbrMaterial(dataOrb, {
      albedoColor: Color42.create(0, 1, 0.8, 0.7),
      roughness: 0,
      metallic: 0.8,
      emissiveColor: Color42.create(0, 1, 0.8, 1),
      emissiveIntensity: 5
    });
    pointerEventsSystem.onPointerDown(
      {
        entity: dataOrb,
        opts: { button: InputAction.IA_POINTER, hoverText: `\u{1F4CA} Data Node ${i + 1}` }
      },
      () => {
        console.log(`\u{1F4CA} Accessing Data Node ${i + 1}`);
        updateSystemStatus(`DATA_NODE_${i + 1}`, true);
      }
    );
  }
  const securityTerminal = engine.addEntity();
  Transform2.create(securityTerminal, {
    position: Vector32.create(8, 1, 2),
    scale: Vector32.create(3, 2, 0.5)
  });
  MeshRenderer3.setBox(securityTerminal);
  Material3.setPbrMaterial(securityTerminal, {
    albedoColor: Color42.create(0.1, 0.2, 0.3, 0.9),
    roughness: 0.3,
    metallic: 0.7,
    emissiveColor: Color42.create(0.2, 0.4, 0.6, 0.4),
    emissiveIntensity: 2
  });
  const securityLabel = engine.addEntity();
  Transform2.create(securityLabel, {
    parent: securityTerminal,
    position: Vector32.create(0, 0.2, -0.6),
    scale: Vector32.create(0.33, 0.5, 1)
  });
  TextShape3.create(securityLabel, {
    text: "\u{1F6E1}\uFE0F SECURITY\nTERMINAL",
    textColor: Color42.create(0.5, 0.8, 1, 1),
    fontSize: 3,
    textAlign: 3
  });
  pointerEventsSystem.onPointerDown(
    {
      entity: securityTerminal,
      opts: { button: InputAction.IA_POINTER, hoverText: "\u{1F6E1}\uFE0F Access Security Systems" }
    },
    () => {
      console.log("\u{1F6E1}\uFE0F Security Systems Accessed");
      updateSystemStatus("SECURITY_BREACH", false);
    }
  );
  for (let i = 0; i < 3; i++) {
    const energyCrystal = engine.addEntity();
    Transform2.create(energyCrystal, {
      position: Vector32.create(4 + i * 4, 1, 14),
      scale: Vector32.create(0.8, 1.2, 0.8)
    });
    MeshRenderer3.setBox(energyCrystal);
    Material3.setPbrMaterial(energyCrystal, {
      albedoColor: Color42.create(0.8, 0.2, 1, 0.8),
      roughness: 0.1,
      metallic: 0.9,
      emissiveColor: Color42.create(0.8, 0.2, 1, 1),
      emissiveIntensity: 6
    });
    pointerEventsSystem.onPointerDown(
      {
        entity: energyCrystal,
        opts: { button: InputAction.IA_POINTER, hoverText: `\u{1F48E} Energy Crystal ${i + 1}` }
      },
      () => {
        console.log(`\u{1F48E} Energy Crystal ${i + 1} Activated`);
        updateSystemStatus(`ENERGY_BOOST_${i + 1}`, true);
      }
    );
  }
}
function updateSystemStatus(system, active) {
  if (!systemStatusEntity)
    return;
  const status = active ? "\u2705 ACTIVE" : "\u26A0\uFE0F INACTIVE";
  const color = active ? Color42.create(0, 1, 0.5, 1) : Color42.create(1, 0.5, 0, 1);
  TextShape3.getMutable(systemStatusEntity).text = `\u{1F525} SYSTEMS ONLINE \u{1F525}
\u26A1 Quantum Core: ${status}
\u{1F310} Network: OPTIMAL
\u{1F6E1}\uFE0F Security: ENHANCED
\u{1F4E1} Last Action: ${system}`;
  TextShape3.getMutable(systemStatusEntity).textColor = color;
}
function updateAlert(message, alertType = "INFO") {
  if (!alertSystemEntity)
    return;
  const colors = {
    INFO: Color42.create(0, 1, 1, 1),
    WARNING: Color42.create(1, 1, 0, 1),
    CRITICAL: Color42.create(1, 0, 0, 1)
  };
  const icons = {
    INFO: "\u{1F4E1}",
    WARNING: "\u26A0\uFE0F",
    CRITICAL: "\u{1F6A8}"
  };
  TextShape3.getMutable(alertSystemEntity).text = `${icons[alertType]} ${message}`;
  TextShape3.getMutable(alertSystemEntity).textColor = colors[alertType];
}

// src/enhanced-network.ts
async function fetchEnhancedSystemStats() {
  return new Promise((resolve2) => {
    setTimeout(() => {
      const cpuLoad = Math.floor(Math.random() * 40) + 30;
      const systemHealth = cpuLoad > 60 ? "CRITICAL" : cpuLoad > 45 ? "WARNING" : "OPTIMAL";
      resolve2({
        activeUsers: Math.floor(Math.random() * 800) + 1500,
        systemHealth,
        cpuLoad,
        quantumCoreStatus: Math.random() > 0.95 ? "OVERLOAD" : Math.random() > 0.1 ? "ONLINE" : "OFFLINE",
        networkLatency: Math.floor(Math.random() * 50) + 10,
        securityLevel: Math.random() > 0.98 ? "COMPROMISED" : Math.random() > 0.3 ? "ENHANCED" : "STANDARD",
        energyReserves: Math.floor(Math.random() * 60) + 40,
        dataStreamActive: Math.random() > 0.2,
        lastUpdate: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      });
    }, 300);
  });
}
async function fetchAlertMessages() {
  return new Promise((resolve2) => {
    setTimeout(() => {
      const alerts = [
        {
          id: "ALERT_001",
          message: "Quantum core synchronization complete",
          type: "INFO",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          priority: 1
        },
        {
          id: "ALERT_002",
          message: "Network latency optimization in progress",
          type: "INFO",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          priority: 2
        }
      ];
      if (Math.random() > 0.8) {
        alerts.push({
          id: "ALERT_003",
          message: "Unusual activity detected in security perimeter",
          type: "WARNING",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          priority: 5
        });
      }
      resolve2(alerts);
    }, 150);
  });
}
async function runSystemDiagnostics() {
  return new Promise((resolve2) => {
    setTimeout(() => {
      const components = {
        quantumCore: Math.random() > 0.9 ? "FAIL" : Math.random() > 0.3 ? "OK" : "WARNING",
        network: Math.random() > 0.95 ? "FAIL" : Math.random() > 0.2 ? "OK" : "WARNING",
        security: Math.random() > 0.98 ? "FAIL" : Math.random() > 0.1 ? "OK" : "WARNING",
        energy: Math.random() > 0.85 ? "FAIL" : Math.random() > 0.4 ? "OK" : "WARNING"
      };
      const failCount = Object.values(components).filter((status) => status === "FAIL").length;
      const warningCount = Object.values(components).filter((status) => status === "WARNING").length;
      let overall = "HEALTHY";
      if (failCount > 0)
        overall = "CRITICAL";
      else if (warningCount > 1)
        overall = "WARNING";
      resolve2({ overall, components });
    }, 1200);
  });
}

// src/gesture-recognition.ts
var GestureRecognitionSystem = class {
  constructor() {
    this.gestures = /* @__PURE__ */ new Map();
    this.gestureActions = /* @__PURE__ */ new Map();
    this.gestureTrails = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.gestureHistory = [];
    this.maxHistoryLength = 10;
    this.handTracking = {
      isActive: false,
      leftHand: null,
      rightHand: null,
      lastUpdate: Date.now()
    };
  }
  // Initialize gesture recognition system
  initialize() {
    console.log("\u{1F44B} Gesture Recognition System Initializing...");
    this.setupGestureActions();
    this.createGestureUI();
    this.startHandTracking();
    this.startGestureRecognition();
    this.isInitialized = true;
    console.log("\u{1F44B} Gesture Recognition System Ready!");
  }
  // Setup gesture actions
  setupGestureActions() {
    this.addGestureAction("swipe_left", "navigate", { direction: "left" }, true);
    this.addGestureAction("swipe_right", "navigate", { direction: "right" }, true);
    this.addGestureAction("swipe_up", "navigate", { direction: "up" }, true);
    this.addGestureAction("swipe_down", "navigate", { direction: "down" }, true);
    this.addGestureAction("push", "push_object", { force: 1 }, true);
    this.addGestureAction("pull", "pull_object", { force: 1 }, true);
    this.addGestureAction("point", "select_target", { mode: "single" }, true);
    this.addGestureAction("pinch", "zoom", { scale: 1 }, true);
    this.addGestureAction("spread", "zoom", { scale: 2 }, true);
    this.addGestureAction("wave", "toggle_menu", {}, true);
    this.addGestureAction("thumbs_up", "confirm", {}, true);
    this.addGestureAction("thumbs_down", "cancel", {}, true);
    this.addGestureAction("circle", "rotate", { angle: 360 }, true);
    this.addGestureAction("double_swipe", "switch_scene", {}, true);
    this.addGestureAction("hold", "open_settings", {}, true);
  }
  // Add gesture action
  addGestureAction(gestureType, action, parameters, enabled) {
    const gestureAction = {
      gestureType,
      action,
      parameters,
      enabled
    };
    this.gestureActions.set(`${gestureType}_${action}`, gestureAction);
  }
  // Create gesture UI
  createGestureUI() {
    this.gestureUI = engine.addEntity();
    Transform2.create(this.gestureUI, {
      position: Vector32.create(8, 5, 8),
      scale: Vector32.create(3, 1, 0.1)
    });
    MeshRenderer3.setBox(this.gestureUI);
    Material3.setPbrMaterial(this.gestureUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.gestureUI,
      position: Vector32.create(0, 0.3, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F44B} GESTURE CONTROL ACTIVE",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createGestureIndicators();
  }
  // Create gesture indicators
  createGestureIndicators() {
    const indicatorPositions = [
      { x: -1, y: -0.2, gesture: "\u{1F446}" },
      { x: -0.5, y: -0.2, gesture: "\u{1F91A}" },
      { x: 0, y: -0.2, gesture: "\u{1F44C}" },
      { x: 0.5, y: -0.2, gesture: "\u{1F44B}" },
      { x: 1, y: -0.2, gesture: "\u{1F44D}" }
    ];
    indicatorPositions.forEach((pos) => {
      const indicator = engine.addEntity();
      Transform2.create(indicator, {
        parent: this.gestureUI,
        position: Vector32.create(pos.x, pos.y, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(indicator);
      Material3.setPbrMaterial(indicator, {
        albedoColor: Color42.create(0.2, 0.8, 0.2, 1),
        emissiveColor: Color42.create(0.2, 0.8, 0.2, 0.5),
        emissiveIntensity: 1
      });
      const gestureText = engine.addEntity();
      Transform2.create(gestureText, {
        parent: indicator,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(gestureText, {
        text: pos.gesture,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
    });
  }
  // Start hand tracking simulation
  startHandTracking() {
    this.handTracking.isActive = true;
    engine.addSystem(() => {
      if (!this.isInitialized || !this.handTracking.isActive)
        return;
      this.updateHandTracking();
    });
  }
  // Update hand tracking
  updateHandTracking() {
    const time = Date.now() / 1e3;
    this.handTracking.rightHand = {
      position: Vector32.create(
        8 + Math.sin(time * 0.5) * 2,
        2 + Math.cos(time * 0.3) * 0.5,
        8 + Math.cos(time * 0.4) * 2
      ),
      rotation: Quaternion2.fromEulerDegrees(
        Math.sin(time * 0.2) * 20,
        Math.cos(time * 0.3) * 30,
        Math.sin(time * 0.4) * 10
      ),
      fingers: this.simulateFingers(time),
      confidence: 0.9
    };
    this.handTracking.leftHand = {
      position: Vector32.create(
        8 + Math.cos(time * 0.4) * 1.5,
        2 + Math.sin(time * 0.5) * 0.3,
        8 + Math.sin(time * 0.3) * 1.5
      ),
      rotation: Quaternion2.fromEulerDegrees(
        Math.cos(time * 0.3) * 15,
        Math.sin(time * 0.4) * 25,
        Math.cos(time * 0.2) * 8
      ),
      fingers: this.simulateFingers(time + Math.PI),
      confidence: 0.85
    };
    this.handTracking.lastUpdate = Date.now();
  }
  // Simulate finger data
  simulateFingers(time) {
    return [
      {
        id: "thumb",
        position: Vector32.create(0.1, 0.1, 0.05),
        isExtended: Math.sin(time * 2) > 0,
        confidence: 0.9
      },
      {
        id: "index",
        position: Vector32.create(0.15, 0.15, 0.1),
        isExtended: Math.sin(time * 3) > -0.5,
        confidence: 0.95
      },
      {
        id: "middle",
        position: Vector32.create(0.1, 0.2, 0.08),
        isExtended: Math.sin(time * 2.5) > -0.3,
        confidence: 0.9
      },
      {
        id: "ring",
        position: Vector32.create(0.05, 0.18, 0.06),
        isExtended: Math.sin(time * 2.2) > -0.2,
        confidence: 0.85
      },
      {
        id: "pinky",
        position: Vector32.create(0, 0.15, 0.04),
        isExtended: Math.sin(time * 2.8) > -0.1,
        confidence: 0.8
      }
    ];
  }
  // Start gesture recognition
  startGestureRecognition() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.detectGestures();
      this.updateGestureTrails();
    });
  }
  // Detect gestures
  detectGestures() {
    if (!this.handTracking.rightHand)
      return;
    const hand = this.handTracking.rightHand;
    const currentTime = Date.now();
    this.detectSwipeGesture(hand, currentTime);
    this.detectCircleGesture(hand, currentTime);
    this.detectPinchGesture(hand, currentTime);
    this.detectWaveGesture(hand, currentTime);
    this.detectPointGesture(hand, currentTime);
    this.detectThumbsGesture(hand, currentTime);
  }
  // Detect swipe gesture
  detectSwipeGesture(hand, currentTime) {
    const gestureId = "swipe";
    let existingGesture = this.gestures.get(gestureId);
    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: "Swipe",
        type: "swipe",
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.gestures.set(gestureId, existingGesture);
    }
    existingGesture.path.push(hand.position);
    existingGesture.endPoint = hand.position;
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);
    const distance = Vector32.distance(existingGesture.startPoint, existingGesture.endPoint);
    if (distance > 1 && existingGesture.duration > 500) {
      existingGesture.isActive = true;
      existingGesture.confidence = Math.min(1, distance / 2);
      this.onGestureDetected(existingGesture);
      this.gestures.delete(gestureId);
    }
  }
  // Detect circle gesture
  detectCircleGesture(hand, currentTime) {
    const gestureId = "circle";
    let existingGesture = this.gestures.get(gestureId);
    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: "Circle",
        type: "circle",
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.gestures.set(gestureId, existingGesture);
    }
    existingGesture.path.push(hand.position);
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);
    if (existingGesture.path.length > 20) {
      const isCircle = this.isCircularPath(existingGesture.path);
      if (isCircle) {
        existingGesture.isActive = true;
        existingGesture.confidence = 0.8;
        this.onGestureDetected(existingGesture);
        this.gestures.delete(gestureId);
      }
    }
  }
  // Detect pinch gesture
  detectPinchGesture(hand, currentTime) {
    const thumbExtended = hand.fingers.find((f) => f.id === "thumb")?.isExtended;
    const indexExtended = hand.fingers.find((f) => f.id === "index")?.isExtended;
    if (thumbExtended && indexExtended) {
      const thumb = hand.fingers.find((f) => f.id === "thumb");
      const index = hand.fingers.find((f) => f.id === "index");
      if (thumb && index) {
        const distance = Vector32.distance(thumb.position, index.position);
        if (distance < 0.05) {
          const gesture = {
            id: "pinch",
            name: "Pinch",
            type: "pinch",
            confidence: 0.9,
            isActive: true,
            startPoint: hand.position,
            endPoint: hand.position,
            duration: 0,
            path: [hand.position]
          };
          this.onGestureDetected(gesture);
        }
      }
    }
  }
  // Detect wave gesture
  detectWaveGesture(hand, currentTime) {
    const gestureId = "wave";
    let existingGesture = this.gestures.get(gestureId);
    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: "Wave",
        type: "wave",
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.gestures.set(gestureId, existingGesture);
    }
    existingGesture.path.push(hand.position);
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);
    if (existingGesture.path.length > 10) {
      const isWaving = this.isWavingMotion(existingGesture.path);
      if (isWaving) {
        existingGesture.isActive = true;
        existingGesture.confidence = 0.7;
        this.onGestureDetected(existingGesture);
        this.gestures.delete(gestureId);
      }
    }
  }
  // Detect point gesture
  detectPointGesture(hand, currentTime) {
    const indexExtended = hand.fingers.find((f) => f.id === "index")?.isExtended;
    const otherFingersExtended = hand.fingers.filter((f) => f.id !== "index").some((f) => f.isExtended);
    if (indexExtended && !otherFingersExtended) {
      const gesture = {
        id: "point",
        name: "Point",
        type: "point",
        confidence: 0.85,
        isActive: true,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.onGestureDetected(gesture);
    }
  }
  // Detect thumbs up/down gesture
  detectThumbsGesture(hand, currentTime) {
    const thumbExtended = hand.fingers.find((f) => f.id === "thumb")?.isExtended;
    const otherFingersExtended = hand.fingers.filter((f) => f.id !== "thumb").some((f) => f.isExtended);
    if (thumbExtended && !otherFingersExtended) {
      const gesture = {
        id: "thumbs_up",
        name: "Thumbs Up",
        type: "thumbs_up",
        confidence: 0.9,
        isActive: true,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.onGestureDetected(gesture);
    }
  }
  // Check if path is circular
  isCircularPath(path) {
    if (path.length < 10)
      return false;
    const center = Vector32.lerp(path[0], path[path.length - 1], 0.5);
    const radius = Vector32.distance(path[0], center);
    let isCircular = true;
    for (let i = 1; i < path.length; i++) {
      const distance = Vector32.distance(path[i], center);
      if (Math.abs(distance - radius) > radius * 0.3) {
        isCircular = false;
        break;
      }
    }
    return isCircular;
  }
  // Check for waving motion
  isWavingMotion(path) {
    if (path.length < 10)
      return false;
    let directionChanges = 0;
    let lastDirection = 0;
    for (let i = 1; i < path.length; i++) {
      const direction = path[i].x - path[i - 1].x;
      if (Math.sign(direction) !== Math.sign(lastDirection) && lastDirection !== 0) {
        directionChanges++;
      }
      lastDirection = direction;
    }
    return directionChanges >= 3;
  }
  // Handle detected gesture
  onGestureDetected(gesture) {
    console.log(`\u{1F44B} Gesture detected: ${gesture.name} (confidence: ${gesture.confidence.toFixed(2)})`);
    this.gestureHistory.push(gesture);
    if (this.gestureHistory.length > this.maxHistoryLength) {
      this.gestureHistory.shift();
    }
    this.gestureActions.forEach((action, key) => {
      if (action.enabled && key.startsWith(gesture.type)) {
        this.executeGestureAction(action);
      }
    });
    soundSystem.playInteractionSound("click");
    this.createGestureFeedback(gesture);
  }
  // Execute gesture action
  executeGestureAction(action) {
    console.log(`\u{1F3AF} Executing action: ${action.action} with parameters:`, action.parameters);
    switch (action.action) {
      case "navigate":
        console.log(`\u{1F9ED} Navigating ${action.parameters.direction}`);
        break;
      case "push_object":
        console.log(`\u{1F4AA} Pushing object with force: ${action.parameters.force}`);
        break;
      case "pull_object":
        console.log(`\u{1F3AF} Pulling object with force: ${action.parameters.force}`);
        break;
      case "select_target":
        console.log(`\u{1F446} Selecting target in ${action.parameters.mode} mode`);
        break;
      case "zoom":
        console.log(`\u{1F50D} Zooming to scale: ${action.parameters.scale}`);
        break;
      case "toggle_menu":
        console.log(`\u{1F4CB} Toggling menu`);
        break;
      case "confirm":
        console.log(`\u2705 Confirming action`);
        break;
      case "cancel":
        console.log(`\u274C Canceling action`);
        break;
      case "rotate":
        console.log(`\u{1F504} Rotating by ${action.parameters.angle} degrees`);
        break;
      case "switch_scene":
        console.log(`\u{1F3AC} Switching scene`);
        break;
      case "open_settings":
        console.log(`\u2699\uFE0F Opening settings`);
        break;
    }
  }
  // Create gesture feedback
  createGestureFeedback(gesture) {
    const feedback = engine.addEntity();
    Transform2.create(feedback, {
      position: gesture.endPoint,
      scale: Vector32.create(0.2, 0.2, 0.2)
    });
    MeshRenderer3.setSphere(feedback);
    Material3.setPbrMaterial(feedback, {
      albedoColor: Color42.create(0.2, 0.8, 1, 0.8),
      emissiveColor: Color42.create(0.2, 0.8, 1, 1),
      emissiveIntensity: 3
    });
    this.animateGestureFeedback(feedback);
  }
  // Animate gesture feedback
  animateGestureFeedback(feedback) {
    let scale = 0.2;
    let opacity = 1;
    const animate = () => {
      scale += 0.02;
      opacity -= 0.02;
      const transform = Transform2.getMutable(feedback);
      transform.scale = Vector32.create(scale, scale, scale);
      const material = Material3.getMutable(feedback);
      if (material && material.$case === "pbr") {
        material.pbr.albedoColor = Color42.create(0.2, 0.8, 1, opacity);
      }
      if (opacity > 0) {
        setTimeout(animate, 16);
      } else {
        engine.removeEntity(feedback);
      }
    };
    animate();
  }
  // Update gesture trails
  updateGestureTrails() {
    if (!this.handTracking.rightHand)
      return;
    const hand = this.handTracking.rightHand;
    const trailId = "right_hand";
    if (!this.gestureTrails.has(trailId)) {
      this.gestureTrails.set(trailId, []);
    }
    const trail = this.gestureTrails.get(trailId);
    const trailPoint = engine.addEntity();
    Transform2.create(trailPoint, {
      position: hand.position,
      scale: Vector32.create(0.05, 0.05, 0.05)
    });
    MeshRenderer3.setSphere(trailPoint);
    Material3.setPbrMaterial(trailPoint, {
      albedoColor: Color42.create(0.5, 0.8, 1, 0.6),
      emissiveColor: Color42.create(0.5, 0.8, 1, 0.8),
      emissiveIntensity: 2
    });
    trail.push(trailPoint);
    if (trail.length > 20) {
      const oldPoint = trail.shift();
      engine.removeEntity(oldPoint);
    }
    trail.forEach((point, index) => {
      const opacity = index / trail.length * 0.6;
      const material = Material3.getMutable(point);
      if (material && material.$case === "pbr") {
        material.pbr.albedoColor = Color42.create(0.5, 0.8, 1, opacity);
      }
    });
  }
  // Enable/disable gesture recognition
  setGestureRecognition(enabled) {
    this.handTracking.isActive = enabled;
    console.log(`\u{1F44B} Gesture recognition ${enabled ? "enabled" : "disabled"}`);
  }
  // Get gesture history
  getGestureHistory() {
    return [...this.gestureHistory];
  }
  // Get current hand tracking data
  getHandTracking() {
    return { ...this.handTracking };
  }
  // Enable/disable gesture action
  setGestureAction(gestureType, action, enabled) {
    const key = `${gestureType}_${action}`;
    const gestureAction = this.gestureActions.get(key);
    if (gestureAction) {
      gestureAction.enabled = enabled;
      console.log(`\u{1F44B} Gesture action ${key} ${enabled ? "enabled" : "disabled"}`);
    }
  }
  // Cleanup system
  cleanup() {
    this.gestureTrails.forEach((trail) => {
      trail.forEach((point) => engine.removeEntity(point));
    });
    this.gestureTrails.clear();
    this.gestures.clear();
    this.gestureHistory = [];
    if (this.gestureUI) {
      engine.removeEntity(this.gestureUI);
    }
    this.gestureActions.clear();
    this.isInitialized = false;
  }
};
var gestureSystem = new GestureRecognitionSystem();

// src/haptic-feedback.ts
var HapticFeedbackSystem = class {
  constructor() {
    this.devices = /* @__PURE__ */ new Map();
    this.patterns = /* @__PURE__ */ new Map();
    this.zones = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.activeEvents = /* @__PURE__ */ new Map();
    this.globalIntensity = 0.8;
    this.isSystemEnabled = true;
    this.initializeHapticEngine();
  }
  // Initialize haptic feedback system
  initialize() {
    console.log("\u{1F3AF} Haptic Feedback System Initializing...");
    this.setupHapticDevices();
    this.createHapticPatterns();
    this.createHapticZones();
    this.createHapticUI();
    this.startHapticEngine();
    this.isInitialized = true;
    console.log("\u{1F3AF} Haptic Feedback System Ready!");
  }
  // Initialize haptic engine
  initializeHapticEngine() {
    this.hapticEngine = {
      playPattern: (device, pattern, intensity) => {
        console.log(`\u{1F4F3} Playing pattern ${pattern.name} on ${device.name}`);
        const effectiveIntensity = Math.min(intensity * device.intensity * this.globalIntensity, device.capabilities.maxIntensity);
        return {
          success: true,
          duration: pattern.duration,
          intensity: effectiveIntensity
        };
      },
      stopPattern: (device, patternId) => {
        console.log(`\u{1F6D1} Stopping pattern ${patternId} on ${device.name}`);
        return { success: true };
      },
      playWaveform: (device, waveform, intensity) => {
        console.log(`\u{1F30A} Playing waveform on ${device.name}`);
        return { success: true };
      },
      setIntensity: (device, intensity) => {
        device.intensity = Math.max(0, Math.min(1, intensity));
        return { success: true };
      }
    };
  }
  // Setup haptic devices
  setupHapticDevices() {
    const vrController = {
      id: "device_vr_controller",
      name: "VR Controller",
      type: "controller",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: true,
        supportsTemperature: false,
        supportsTexture: true,
        maxIntensity: 1,
        responseTime: 10,
        channels: 2
      },
      intensity: 0.8,
      batteryLevel: 0.85
    };
    const hapticGlove = {
      id: "device_haptic_glove",
      name: "Haptic Glove",
      type: "glove",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: true,
        supportsTemperature: true,
        supportsTexture: true,
        maxIntensity: 0.9,
        responseTime: 15,
        channels: 5
      },
      intensity: 0.7,
      batteryLevel: 0.6
    };
    const hapticVest = {
      id: "device_haptic_vest",
      name: "Haptic Vest",
      type: "vest",
      isConnected: false,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: false,
        supportsTemperature: true,
        supportsTexture: false,
        maxIntensity: 1,
        responseTime: 25,
        channels: 8
      },
      intensity: 0.6,
      batteryLevel: 0.4
    };
    const hapticChair = {
      id: "device_haptic_chair",
      name: "Haptic Chair",
      type: "chair",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: true,
        supportsTemperature: true,
        supportsTexture: false,
        maxIntensity: 0.8,
        responseTime: 30,
        channels: 4
      },
      intensity: 0.5,
      batteryLevel: 0.9
    };
    const touchscreen = {
      id: "device_touchscreen",
      name: "Touchscreen",
      type: "touchscreen",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: false,
        supportsTemperature: false,
        supportsTexture: true,
        maxIntensity: 0.7,
        responseTime: 5,
        channels: 1
      },
      intensity: 0.6,
      batteryLevel: 1
    };
    this.devices.set(vrController.id, vrController);
    this.devices.set(hapticGlove.id, hapticGlove);
    this.devices.set(hapticVest.id, hapticVest);
    this.devices.set(hapticChair.id, hapticChair);
    this.devices.set(touchscreen.id, touchscreen);
    console.log("\u{1F4F1} Haptic devices configured");
  }
  // Create haptic patterns
  createHapticPatterns() {
    const clickPattern = {
      id: "pattern_click",
      name: "Click",
      type: "click",
      duration: 100,
      intensity: 0.6,
      waveforms: [
        {
          channel: 0,
          frequency: 200,
          amplitude: 0.8,
          duration: 50,
          waveform: "sine",
          phase: 0
        }
      ],
      loops: false,
      fadeIn: 0,
      fadeOut: 20
    };
    const impactPattern = {
      id: "pattern_impact",
      name: "Impact",
      type: "impact",
      duration: 200,
      intensity: 0.9,
      waveforms: [
        {
          channel: 0,
          frequency: 100,
          amplitude: 1,
          duration: 100,
          waveform: "square",
          phase: 0
        },
        {
          channel: 1,
          frequency: 50,
          amplitude: 0.6,
          duration: 150,
          waveform: "sine",
          phase: 0
        }
      ],
      loops: false,
      fadeIn: 0,
      fadeOut: 50
    };
    const pulsePattern = {
      id: "pattern_pulse",
      name: "Pulse",
      type: "pulse",
      duration: 500,
      intensity: 0.7,
      waveforms: [
        {
          channel: 0,
          frequency: 80,
          amplitude: 0.8,
          duration: 250,
          waveform: "sine",
          phase: 0
        }
      ],
      loops: true,
      fadeIn: 50,
      fadeOut: 50
    };
    const texturePattern = {
      id: "pattern_texture",
      name: "Texture",
      type: "texture",
      duration: 1e3,
      intensity: 0.4,
      waveforms: [
        {
          channel: 0,
          frequency: 150,
          amplitude: 0.5,
          duration: 100,
          waveform: "noise",
          phase: 0
        },
        {
          channel: 1,
          frequency: 200,
          amplitude: 0.3,
          duration: 100,
          waveform: "noise",
          phase: Math.PI
        }
      ],
      loops: true,
      fadeIn: 100,
      fadeOut: 100
    };
    const ambientPattern = {
      id: "pattern_ambient",
      name: "Ambient",
      type: "ambient",
      duration: 0,
      intensity: 0.2,
      waveforms: [
        {
          channel: 0,
          frequency: 30,
          amplitude: 0.3,
          duration: 1e3,
          waveform: "sine",
          phase: 0
        }
      ],
      loops: true,
      fadeIn: 500,
      fadeOut: 500
    };
    this.patterns.set(clickPattern.id, clickPattern);
    this.patterns.set(impactPattern.id, impactPattern);
    this.patterns.set(pulsePattern.id, pulsePattern);
    this.patterns.set(texturePattern.id, texturePattern);
    this.patterns.set(ambientPattern.id, ambientPattern);
    console.log("\u{1F3B5} Haptic patterns created");
  }
  // Create haptic zones
  createHapticZones() {
    const desktopZone = {
      id: "zone_desktop",
      name: "Desktop",
      position: Vector32.create(8, 1, 8),
      size: Vector32.create(3, 1, 3),
      sensitivity: 0.8,
      devices: ["device_haptic_chair"],
      isActive: true,
      effects: [
        {
          type: "vibration",
          intensity: 0.3,
          duration: 200,
          pattern: "pattern_ambient"
        }
      ]
    };
    const interactionZone = {
      id: "zone_interaction",
      name: "Interaction Area",
      position: Vector32.create(8, 2, 8),
      size: Vector32.create(2, 2, 2),
      sensitivity: 1,
      devices: ["device_vr_controller", "device_haptic_glove"],
      isActive: true,
      effects: []
    };
    const floorZone = {
      id: "zone_floor",
      name: "Floor",
      position: Vector32.create(8, 0, 8),
      size: Vector32.create(10, 0.1, 10),
      sensitivity: 0.5,
      devices: ["device_haptic_vest"],
      isActive: false,
      effects: []
    };
    this.zones.set(desktopZone.id, desktopZone);
    this.zones.set(interactionZone.id, interactionZone);
    this.zones.set(floorZone.id, floorZone);
    console.log("\u{1F5FA}\uFE0F Haptic zones created");
  }
  // Create haptic UI
  createHapticUI() {
    this.hapticUI = engine.addEntity();
    Transform2.create(this.hapticUI, {
      position: Vector32.create(14, 3, 2),
      scale: Vector32.create(3, 4, 0.1)
    });
    MeshRenderer3.setBox(this.hapticUI);
    Material3.setPbrMaterial(this.hapticUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.hapticUI,
      position: Vector32.create(0, 1.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F3AF} HAPTIC FEEDBACK",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createDeviceIndicators();
    this.createPatternControls();
    this.createIntensityControls();
    this.createZoneControls();
  }
  // Create device indicators
  createDeviceIndicators() {
    const devices = Array.from(this.devices.values());
    let xOffset = -1.2;
    devices.forEach((device) => {
      const indicator = engine.addEntity();
      Transform2.create(indicator, {
        parent: this.hapticUI,
        position: Vector32.create(xOffset, 1.2, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(indicator);
      Material3.setPbrMaterial(indicator, {
        albedoColor: device.isConnected ? Color42.create(0.2, 0.8, 0.2, 1) : Color42.create(0.8, 0.2, 0.2, 1),
        emissiveColor: device.isConnected ? Color42.create(0.2, 0.8, 0.2, 0.5) : Color42.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: device.isConnected ? 2 : 0.5
      });
      const deviceText = engine.addEntity();
      Transform2.create(deviceText, {
        parent: indicator,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(deviceText, {
        text: this.getDeviceIcon(device.type),
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: InputAction.IA_POINTER, hoverText: device.name }
        },
        () => this.toggleDevice(device.id)
      );
      xOffset += 0.4;
    });
  }
  // Create pattern controls
  createPatternControls() {
    const patterns = ["click", "impact", "pulse", "texture", "ambient"];
    let xOffset = -1;
    patterns.forEach((pattern) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.hapticUI,
        position: Vector32.create(xOffset, 0.6, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: this.getPatternIcon(pattern),
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Play ${pattern}` }
        },
        () => this.playPattern(pattern)
      );
      xOffset += 0.4;
    });
  }
  // Create intensity controls
  createIntensityControls() {
    const intensitySlider = engine.addEntity();
    Transform2.create(intensitySlider, {
      parent: this.hapticUI,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(2, 0.2, 0.1)
    });
    MeshRenderer3.setBox(intensitySlider);
    Material3.setPbrMaterial(intensitySlider, {
      albedoColor: Color42.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color42.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const intensityText = engine.addEntity();
    Transform2.create(intensityText, {
      parent: intensitySlider,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(intensityText, {
      text: `\u{1F50A} Intensity: ${(this.globalIntensity * 100).toFixed(0)}%`,
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
    pointerEventsSystem.onPointerDown(
      {
        entity: intensitySlider,
        opts: { button: InputAction.IA_POINTER, hoverText: "Adjust Intensity" }
      },
      () => this.adjustIntensity()
    );
  }
  // Create zone controls
  createZoneControls() {
    const zones = Array.from(this.zones.values());
    let xOffset = -0.8;
    zones.forEach((zone) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.hapticUI,
        position: Vector32.create(xOffset, -0.4, 0.1),
        scale: Vector32.create(0.2, 0.2, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: zone.isActive ? Color42.create(0.2, 0.8, 0.2, 1) : Color42.create(0.8, 0.2, 0.2, 1),
        emissiveColor: zone.isActive ? Color42.create(0.2, 0.8, 0.2, 0.5) : Color42.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: zone.isActive ? 2 : 0.5
      });
      const zoneText = engine.addEntity();
      Transform2.create(zoneText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(zoneText, {
        text: zone.name,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 1.2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Toggle ${zone.name}` }
        },
        () => this.toggleZone(zone.id)
      );
      xOffset += 0.6;
    });
  }
  // Get device icon
  getDeviceIcon(type) {
    switch (type) {
      case "controller":
        return "\u{1F3AE}";
      case "glove":
        return "\u{1F9E4}";
      case "vest":
        return "\u{1F9BA}";
      case "chair":
        return "\u{1FA91}";
      case "touchscreen":
        return "\u{1F4F1}";
      default:
        return "\u{1F4F1}";
    }
  }
  // Get pattern icon
  getPatternIcon(pattern) {
    switch (pattern) {
      case "click":
        return "\u{1F446}";
      case "impact":
        return "\u{1F4A5}";
      case "pulse":
        return "\u{1F497}";
      case "texture":
        return "\u{1F30A}";
      case "ambient":
        return "\u{1F30A}";
      default:
        return "\u{1F4F3}";
    }
  }
  // Start haptic engine
  startHapticEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.processHapticEvents();
      this.updateDeviceStatus();
      this.updateZoneEffects();
    });
  }
  // Process haptic events
  processHapticEvents() {
    this.activeEvents.forEach((event, id) => {
      if (event.processed)
        return;
      const zone = this.findZone(event.position);
      if (!zone || !zone.isActive)
        return;
      const devices = this.findDevicesForZone(zone);
      if (devices.length === 0)
        return;
      this.applyHapticFeedback(event, zone, devices);
      event.processed = true;
    });
    this.activeEvents.forEach((event, id) => {
      if (event.processed && Date.now() - event.timestamp > 5e3) {
        this.activeEvents.delete(id);
      }
    });
  }
  // Find zone for position
  findZone(position) {
    for (const zone of this.zones.values()) {
      const distance = Vector32.distance(position, zone.position);
      if (distance <= Math.max(zone.size.x, zone.size.y, zone.size.z) / 2) {
        return zone;
      }
    }
    return null;
  }
  // Find devices for zone
  findDevicesForZone(zone) {
    return Array.from(this.devices.values()).filter(
      (device) => device.isConnected && zone.devices.includes(device.id)
    );
  }
  // Apply haptic feedback
  applyHapticFeedback(event, zone, devices) {
    const intensity = event.intensity * zone.sensitivity * this.globalIntensity;
    devices.forEach((device) => {
      if (event.pattern) {
        const pattern = this.patterns.get(event.pattern);
        if (pattern) {
          this.hapticEngine.playPattern(device, pattern, intensity);
        }
      } else {
        const defaultPattern = this.getDefaultPattern(event.type);
        if (defaultPattern) {
          this.hapticEngine.playPattern(device, defaultPattern, intensity);
        }
      }
    });
  }
  // Get default pattern
  getDefaultPattern(eventType) {
    switch (eventType) {
      case "touch":
      case "interaction":
        return this.patterns.get("pattern_click");
      case "collision":
        return this.patterns.get("pattern_impact");
      case "feedback":
        return this.patterns.get("pattern_pulse");
      case "alert":
        return this.patterns.get("pattern_pulse");
      case "ambient":
        return this.patterns.get("pattern_ambient");
      default:
        return null;
    }
  }
  // Update device status
  updateDeviceStatus() {
    this.devices.forEach((device, id) => {
      if (Math.random() < 1e-3) {
        device.batteryLevel = Math.max(0, device.batteryLevel - 0.01);
        if (device.batteryLevel < 0.1) {
          device.isConnected = false;
          console.log(`\u{1F50B} Device ${device.name} battery low`);
        }
      }
    });
  }
  // Update zone effects
  updateZoneEffects() {
    this.zones.forEach((zone) => {
      if (zone.isActive && zone.effects.length > 0) {
        zone.effects.forEach((effect) => {
          if (effect.type === "vibration" && effect.pattern) {
            const devices = this.findDevicesForZone(zone);
            devices.forEach((device) => {
              const pattern = this.patterns.get(effect.pattern);
              if (pattern) {
                this.hapticEngine.playPattern(device, pattern, effect.intensity);
              }
            });
          }
        });
      }
    });
  }
  // Trigger haptic event
  triggerHapticEvent(event) {
    if (!this.isSystemEnabled)
      return;
    event.id = `event_${Date.now()}_${Math.random()}`;
    event.timestamp = Date.now();
    event.processed = false;
    this.activeEvents.set(event.id, event);
    console.log(`\u{1F3AF} Triggered haptic event: ${event.type}`);
  }
  // Play pattern
  playPattern(patternId, intensity) {
    const pattern = this.patterns.get(patternId);
    if (!pattern)
      return;
    const effectiveIntensity = intensity || pattern.intensity;
    this.devices.forEach((device) => {
      if (device.isConnected) {
        this.hapticEngine.playPattern(device, pattern, effectiveIntensity);
      }
    });
    console.log(`\u{1F3B5} Playing pattern: ${pattern.name}`);
    soundSystem.playInteractionSound("click");
  }
  // Stop pattern
  stopPattern(patternId) {
    this.devices.forEach((device) => {
      if (device.isConnected) {
        this.hapticEngine.stopPattern(device, patternId);
      }
    });
    console.log(`\u{1F6D1} Stopped pattern: ${patternId}`);
  }
  // Toggle device
  toggleDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device)
      return;
    device.isConnected = !device.isConnected;
    console.log(`${device.isConnected ? "\u{1F517}" : "\u{1F50C}"} Device ${device.name} ${device.isConnected ? "connected" : "disconnected"}`);
    soundSystem.playInteractionSound("click");
  }
  // Toggle zone
  toggleZone(zoneId) {
    const zone = this.zones.get(zoneId);
    if (!zone)
      return;
    zone.isActive = !zone.isActive;
    console.log(`${zone.isActive ? "\u2705" : "\u274C"} Zone ${zone.name} ${zone.isActive ? "activated" : "deactivated"}`);
    soundSystem.playInteractionSound("click");
  }
  // Adjust intensity
  adjustIntensity() {
    const levels = [0.2, 0.4, 0.6, 0.8, 1];
    const currentIndex = levels.indexOf(this.globalIntensity);
    const nextIndex = (currentIndex + 1) % levels.length;
    this.globalIntensity = levels[nextIndex];
    console.log(`\u{1F50A} Global intensity set to: ${(this.globalIntensity * 100).toFixed(0)}%`);
    soundSystem.playInteractionSound("click");
  }
  // Set global intensity
  setGlobalIntensity(intensity) {
    this.globalIntensity = Math.max(0, Math.min(1, intensity));
    console.log(`\u{1F50A} Global intensity set to: ${(this.globalIntensity * 100).toFixed(0)}%`);
  }
  // Enable/disable system
  setSystemEnabled(enabled) {
    this.isSystemEnabled = enabled;
    console.log(`\u{1F3AF} Haptic system ${enabled ? "enabled" : "disabled"}`);
    if (!enabled) {
      this.devices.forEach((device) => {
        if (device.isConnected) {
          this.patterns.forEach((pattern) => {
            this.hapticEngine.stopPattern(device, pattern.id);
          });
        }
      });
    }
  }
  // Get connected devices
  getConnectedDevices() {
    return Array.from(this.devices.values()).filter((device) => device.isConnected);
  }
  // Get all devices
  getAllDevices() {
    return Array.from(this.devices.values());
  }
  // Get active zones
  getActiveZones() {
    return Array.from(this.zones.values()).filter((zone) => zone.isActive);
  }
  // Get available patterns
  getAvailablePatterns() {
    return Array.from(this.patterns.values());
  }
  // Create custom pattern
  createCustomPattern(pattern) {
    const newPattern = {
      ...pattern,
      id: `pattern_custom_${Date.now()}_${Math.random()}`
    };
    this.patterns.set(newPattern.id, newPattern);
    console.log(`\u{1F3B5} Created custom pattern: ${newPattern.name}`);
    return newPattern;
  }
  // Create custom zone
  createCustomZone(zone) {
    const newZone = {
      ...zone,
      id: `zone_custom_${Date.now()}_${Math.random()}`
    };
    this.zones.set(newZone.id, newZone);
    console.log(`\u{1F5FA}\uFE0F Created custom zone: ${newZone.name}`);
    return newZone;
  }
  // Get system statistics
  getSystemStatistics() {
    return {
      totalDevices: this.devices.size,
      connectedDevices: this.getConnectedDevices().length,
      totalPatterns: this.patterns.size,
      totalZones: this.zones.size,
      activeZones: this.getActiveZones().length,
      activeEvents: this.activeEvents.size,
      globalIntensity: this.globalIntensity,
      systemEnabled: this.isSystemEnabled
    };
  }
  // Cleanup system
  cleanup() {
    this.devices.clear();
    this.patterns.clear();
    this.zones.clear();
    this.activeEvents.clear();
    if (this.hapticUI) {
      engine.removeEntity(this.hapticUI);
    }
    this.isInitialized = false;
  }
};
var hapticFeedbackSystem = new HapticFeedbackSystem();

// src/holographic-data-walls.ts
var HolographicDataWall = class {
  constructor(position, scale) {
    this.charts = /* @__PURE__ */ new Map();
    this.visualElements = [];
    this.animationTime = 0;
    this.isActive = true;
    this.createWall(position, scale);
    this.startAnimation();
  }
  createWall(position, scale) {
    this.entity = engine.addEntity();
    Transform2.create(this.entity, {
      position,
      scale
    });
    MeshRenderer3.setBox(this.entity);
    Material3.setPbrMaterial(this.entity, {
      albedoColor: Color42.create(0.05, 0.05, 0.1, 0.9),
      roughness: 0.1,
      metallic: 0.8,
      emissiveColor: Color42.create(0.1, 0.1, 0.3, 0.5),
      emissiveIntensity: 2
    });
    this.createGridOverlay();
    this.createTitle();
  }
  createGridOverlay() {
    const gridSize = 10;
    const gridSpacing = 1.6;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const gridCell = engine.addEntity();
        Transform2.create(gridCell, {
          parent: this.entity,
          position: Vector32.create(
            -7.5 + x * gridSpacing,
            -3.5 + y * gridSpacing,
            0.1
          ),
          scale: Vector32.create(1.5, 1.5, 0.05)
        });
        MeshRenderer3.setBox(gridCell);
        Material3.setPbrMaterial(gridCell, {
          albedoColor: Color42.create(0.2, 0.3, 0.5, 0.3),
          emissiveColor: Color42.create(0.1, 0.2, 0.4, 0.5),
          emissiveIntensity: 1
        });
        this.visualElements.push(gridCell);
      }
    }
  }
  createTitle() {
    const titleEntity = engine.addEntity();
    Transform2.create(titleEntity, {
      parent: this.entity,
      position: Vector32.create(0, 4.5, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(titleEntity, {
      text: "\u{1F4CA} HOLOGRAPHIC DATA VISUALIZATION",
      textColor: Color42.create(0.5, 0.8, 1, 1),
      fontSize: 4,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: Color42.create(0, 0, 0, 1)
    });
    this.visualElements.push(titleEntity);
  }
  // Add a new chart to the wall
  addChart(id, config) {
    this.charts.set(id, config);
    this.renderChart(id);
    if (config.updateInterval > 0) {
      setInterval(() => {
        this.updateChart(id);
      }, config.updateInterval);
    }
  }
  renderChart(chartId) {
    const chart = this.charts.get(chartId);
    if (!chart)
      return;
    switch (chart.type) {
      case "bar":
        this.renderBarChart(chartId, chart);
        break;
      case "line":
        this.renderLineChart(chartId, chart);
        break;
      case "pie":
        this.renderPieChart(chartId, chart);
        break;
      case "scatter":
        this.renderScatterChart(chartId, chart);
        break;
      case "heatmap":
        this.renderHeatmap(chartId, chart);
        break;
    }
  }
  renderBarChart(chartId, config) {
    const barWidth = 1.2;
    const maxHeight = 3;
    const spacing = 1.5;
    const startX = -6;
    config.data.forEach((point, index) => {
      const bar = engine.addEntity();
      const height = point.value / 100 * maxHeight;
      Transform2.create(bar, {
        parent: this.entity,
        position: Vector32.create(
          startX + index * spacing,
          -2 + height / 2,
          0.2
        ),
        scale: Vector32.create(barWidth, height, 0.3)
      });
      MeshRenderer3.setBox(bar);
      Material3.setPbrMaterial(bar, {
        albedoColor: Color42.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveColor: Color42.create(point.color.r, point.color.g, point.color.b, 0.6),
        emissiveIntensity: 2
      });
      const label = engine.addEntity();
      Transform2.create(label, {
        parent: this.entity,
        position: Vector32.create(
          startX + index * spacing,
          -3.5,
          0.3
        ),
        scale: Vector32.create(0.2, 0.2, 0.2)
      });
      TextShape3.create(label, {
        text: point.label,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      this.visualElements.push(bar, label);
    });
  }
  renderLineChart(chartId, config) {
    const points = [];
    const spacing = 1.2;
    const startX = -6;
    config.data.forEach((point, index) => {
      const x = startX + index * spacing;
      const y = -2 + point.value / 100 * 3;
      points.push(Vector32.create(x, y, 0.2));
      const dataPoint = engine.addEntity();
      Transform2.create(dataPoint, {
        parent: this.entity,
        position: Vector32.create(x, y, 0.2),
        scale: Vector32.create(0.2, 0.2, 0.2)
      });
      MeshRenderer3.setSphere(dataPoint);
      Material3.setPbrMaterial(dataPoint, {
        albedoColor: Color42.create(point.color.r, point.color.g, point.color.b, 1),
        emissiveColor: Color42.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveIntensity: 3
      });
      this.visualElements.push(dataPoint);
    });
    for (let i = 0; i < points.length - 1; i++) {
      const line = engine.addEntity();
      const start = points[i];
      const end = points[i + 1];
      const distance = Vector32.distance(start, end);
      const midpoint = Vector32.lerp(start, end, 0.5);
      Transform2.create(line, {
        parent: this.entity,
        position: Vector32.create(midpoint.x, midpoint.y, 0.15),
        scale: Vector32.create(0.05, distance, 0.1)
      });
      MeshRenderer3.setBox(line);
      Material3.setPbrMaterial(line, {
        albedoColor: Color42.create(0.5, 0.8, 1, 0.8),
        emissiveColor: Color42.create(0.5, 0.8, 1, 0.6),
        emissiveIntensity: 2
      });
      this.visualElements.push(line);
    }
  }
  renderPieChart(chartId, config) {
    const total = config.data.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = 0;
    config.data.forEach((point, index) => {
      const percentage = point.value / total;
      const angle = percentage * 360;
      const slice = engine.addEntity();
      Transform2.create(slice, {
        parent: this.entity,
        position: Vector32.create(
          Math.cos(currentAngle * Math.PI / 180) * 2,
          Math.sin(currentAngle * Math.PI / 180) * 2,
          0.2
        ),
        scale: Vector32.create(1.5, 1.5, 0.3)
      });
      MeshRenderer3.setBox(slice);
      Material3.setPbrMaterial(slice, {
        albedoColor: Color42.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveColor: Color42.create(point.color.r, point.color.g, point.color.b, 0.6),
        emissiveIntensity: 2
      });
      this.visualElements.push(slice);
      currentAngle += angle;
    });
  }
  renderScatterChart(chartId, config) {
    config.data.forEach((point, index) => {
      const scatterPoint = engine.addEntity();
      Transform2.create(scatterPoint, {
        parent: this.entity,
        position: Vector32.create(
          -6 + index / config.data.length * 12,
          -2 + point.value / 100 * 3,
          0.2
        ),
        scale: Vector32.create(0.3, 0.3, 0.3)
      });
      MeshRenderer3.setSphere(scatterPoint);
      Material3.setPbrMaterial(scatterPoint, {
        albedoColor: Color42.create(point.color.r, point.color.g, point.color.b, 0.9),
        emissiveColor: Color42.create(point.color.r, point.color.g, point.color.b, 0.7),
        emissiveIntensity: 3
      });
      this.visualElements.push(scatterPoint);
    });
  }
  renderHeatmap(chartId, config) {
    const gridSize = 8;
    const cellSize = 1.5;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const dataIndex = (x * gridSize + y) % config.data.length;
        const point = config.data[dataIndex];
        const heatCell = engine.addEntity();
        Transform2.create(heatCell, {
          parent: this.entity,
          position: Vector32.create(
            -6 + x * cellSize,
            -2 + y * cellSize,
            0.2
          ),
          scale: Vector32.create(cellSize * 0.8, cellSize * 0.8, 0.2)
        });
        MeshRenderer3.setBox(heatCell);
        const intensity = point.value / 100;
        Material3.setPbrMaterial(heatCell, {
          albedoColor: Color42.create(
            point.color.r * intensity,
            point.color.g * intensity,
            point.color.b * intensity,
            0.8
          ),
          emissiveColor: Color42.create(
            point.color.r * intensity,
            point.color.g * intensity,
            point.color.b * intensity,
            0.6
          ),
          emissiveIntensity: intensity * 3
        });
        this.visualElements.push(heatCell);
      }
    }
  }
  updateChart(chartId) {
    const chart = this.charts.get(chartId);
    if (!chart)
      return;
    const newPoint = {
      label: `T${Date.now() % 1e3}`,
      value: Math.random() * 100,
      color: Color32.create(Math.random(), Math.random(), Math.random()),
      timestamp: Date.now()
    };
    chart.data.push(newPoint);
    if (chart.data.length > chart.maxDataPoints) {
      chart.data.shift();
    }
    this.clearChart(chartId);
    this.renderChart(chartId);
  }
  clearChart(chartId) {
    const elementsToRemove = this.visualElements.splice(20);
    elementsToRemove.forEach((element) => {
      engine.removeEntity(element);
    });
  }
  startAnimation() {
    engine.addSystem(() => {
      if (!this.isActive)
        return;
      this.animationTime += 0.016;
      this.visualElements.forEach((element, index) => {
        if (index % 3 === 0) {
          const material = Material3.getMutable(element);
          if (material && material.$case === "pbr") {
            const pulse = Math.sin(this.animationTime * 2 + index * 0.1) * 0.3 + 0.7;
            material.pbr.emissiveIntensity = pulse * 2;
          }
        }
      });
    });
  }
  // Real-time data streaming
  startDataStream(chartId, dataSource) {
    setInterval(() => {
      const chart = this.charts.get(chartId);
      if (chart) {
        const newDataPoint = dataSource();
        chart.data.push(newDataPoint);
        if (chart.data.length > chart.maxDataPoints) {
          chart.data.shift();
        }
        this.clearChart(chartId);
        this.renderChart(chartId);
      }
    }, 1e3);
  }
  // Interactive features
  setInteractive(enabled) {
    this.isActive = enabled;
  }
  // Cleanup
  cleanup() {
    this.visualElements.forEach((element) => {
      engine.removeEntity(element);
    });
    this.visualElements = [];
    this.charts.clear();
  }
};
var DataVisualizationManager = class {
  constructor() {
    this.walls = /* @__PURE__ */ new Map();
  }
  createWall(id, position, scale) {
    const wall = new HolographicDataWall(position, scale);
    this.walls.set(id, wall);
    return wall;
  }
  getWall(id) {
    return this.walls.get(id);
  }
  // Pre-configured data sources
  static createSystemStatusData() {
    return [
      { label: "CPU", value: 65, color: Color32.create(0.2, 0.8, 0.2), timestamp: Date.now() },
      { label: "Memory", value: 78, color: Color32.create(0.8, 0.6, 0.2), timestamp: Date.now() },
      { label: "Network", value: 45, color: Color32.create(0.2, 0.6, 0.8), timestamp: Date.now() },
      { label: "Storage", value: 32, color: Color32.create(0.8, 0.2, 0.6), timestamp: Date.now() },
      { label: "Quantum", value: 89, color: Color32.create(0.6, 0.2, 0.8), timestamp: Date.now() }
    ];
  }
  static createRealtimeDataSource() {
    let counter = 0;
    return () => ({
      label: `Data${counter++}`,
      value: Math.random() * 100,
      color: Color32.create(Math.random(), Math.random(), Math.random()),
      timestamp: Date.now()
    });
  }
  cleanup() {
    this.walls.forEach((wall) => wall.cleanup());
    this.walls.clear();
  }
};
var dataVizManager = new DataVisualizationManager();

// src/multiplayer-system.ts
var MultiplayerSystem = class {
  constructor() {
    this.remotePlayers = /* @__PURE__ */ new Map();
    this.activeSession = null;
    this.sharedObjects = /* @__PURE__ */ new Map();
    this.voiceChannels = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.connectionStatus = "disconnected";
    this.localPlayer = {
      id: this.generatePlayerId(),
      name: "Player",
      position: Vector32.create(8, 1, 8),
      rotation: Quaternion2.fromEulerDegrees(0, 0, 0),
      avatar: null,
      isActive: true,
      lastUpdate: Date.now(),
      color: Color32.create(Math.random(), Math.random(), Math.random())
    };
  }
  // Initialize multiplayer system
  async initialize() {
    console.log("\u{1F310} Multiplayer System Initializing...");
    this.createLocalPlayer();
    this.setupVoiceChat();
    this.createCollaborationTools();
    this.startNetworkSync();
    await this.connectToServer();
    this.isInitialized = true;
    console.log("\u{1F310} Multiplayer System Ready!");
  }
  // Create local player avatar
  createLocalPlayer() {
    const avatar = engine.addEntity();
    Transform2.create(avatar, {
      position: this.localPlayer.position,
      scale: Vector32.create(1, 2, 1)
    });
    MeshRenderer3.setBox(avatar);
    Material3.setPbrMaterial(avatar, {
      albedoColor: Color42.create(
        this.localPlayer.color.r,
        this.localPlayer.color.g,
        this.localPlayer.color.b,
        1
      ),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: Color42.create(
        this.localPlayer.color.r * 0.3,
        this.localPlayer.color.g * 0.3,
        this.localPlayer.color.b * 0.3,
        0.5
      ),
      emissiveIntensity: 1
    });
    const nameTag = engine.addEntity();
    Transform2.create(nameTag, {
      parent: avatar,
      position: Vector32.create(0, 2.5, 0),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(nameTag, {
      text: this.localPlayer.name,
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    });
    this.localPlayer.avatar = avatar;
  }
  // Setup voice chat system
  setupVoiceChat() {
    const mainChannel = {
      id: "main",
      name: "Main Channel",
      participants: [this.localPlayer.id],
      isSpatial: true,
      maxParticipants: 10
    };
    this.voiceChannels.set("main", mainChannel);
    this.createVoiceChannelUI();
  }
  // Create voice channel UI
  createVoiceChannelUI() {
    const voicePanel = engine.addEntity();
    Transform2.create(voicePanel, {
      position: Vector32.create(1, 3, 8),
      scale: Vector32.create(1.5, 2, 0.1)
    });
    MeshRenderer3.setBox(voicePanel);
    Material3.setPbrMaterial(voicePanel, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const voiceTitle = engine.addEntity();
    Transform2.create(voiceTitle, {
      parent: voicePanel,
      position: Vector32.create(0, 0.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(voiceTitle, {
      text: "\u{1F3A4} VOICE CHAT",
      textColor: Color42.create(0.8, 0.8, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    const muteButton = engine.addEntity();
    Transform2.create(muteButton, {
      parent: voicePanel,
      position: Vector32.create(0, -0.2, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.1)
    });
    MeshRenderer3.setBox(muteButton);
    Material3.setPbrMaterial(muteButton, {
      albedoColor: Color42.create(0.2, 0.8, 0.2, 1),
      emissiveColor: Color42.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2
    });
    const muteText = engine.addEntity();
    Transform2.create(muteText, {
      parent: muteButton,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.5, 0.5, 0.5)
    });
    TextShape3.create(muteText, {
      text: "\u{1F50A}",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    });
    pointerEventsSystem.onPointerDown(
      {
        entity: muteButton,
        opts: { button: InputAction.IA_POINTER, hoverText: "Toggle Mute" }
      },
      () => this.toggleMute()
    );
  }
  // Create collaboration tools
  createCollaborationTools() {
    this.createSharedWhiteboard();
    this.createDocumentSharing();
    this.createCollaborationPanel();
  }
  // Create shared whiteboard
  createSharedWhiteboard() {
    const whiteboard = engine.addEntity();
    Transform2.create(whiteboard, {
      position: Vector32.create(8, 3, 12),
      scale: Vector32.create(6, 4, 0.2)
    });
    MeshRenderer3.setBox(whiteboard);
    Material3.setPbrMaterial(whiteboard, {
      albedoColor: Color42.create(1, 1, 1, 1),
      roughness: 0.1,
      metallic: 0.1
    });
    const sharedObject = {
      id: "main-whiteboard",
      type: "whiteboard",
      position: Vector32.create(8, 3, 12),
      content: { drawings: [], text: [] },
      ownerId: this.localPlayer.id,
      collaborators: [],
      isLocked: false
    };
    this.sharedObjects.set("main-whiteboard", sharedObject);
  }
  // Create document sharing system
  createDocumentSharing() {
    const docSharePanel = engine.addEntity();
    Transform2.create(docSharePanel, {
      position: Vector32.create(14, 3, 8),
      scale: Vector32.create(2, 3, 0.1)
    });
    MeshRenderer3.setBox(docSharePanel);
    Material3.setPbrMaterial(docSharePanel, {
      albedoColor: Color42.create(0.1, 0.3, 0.6, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const docTitle = engine.addEntity();
    Transform2.create(docTitle, {
      parent: docSharePanel,
      position: Vector32.create(0, 1.2, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(docTitle, {
      text: "\u{1F4C4} DOCUMENTS",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
  }
  // Create collaboration panel
  createCollaborationPanel() {
    const collabPanel = engine.addEntity();
    Transform2.create(collabPanel, {
      position: Vector32.create(2, 3, 8),
      scale: Vector32.create(2, 3, 0.1)
    });
    MeshRenderer3.setBox(collabPanel);
    Material3.setPbrMaterial(collabPanel, {
      albedoColor: Color42.create(0.2, 0.1, 0.4, 0.9),
      emissiveColor: Color42.create(0.4, 0.2, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const collabTitle = engine.addEntity();
    Transform2.create(collabTitle, {
      parent: collabPanel,
      position: Vector32.create(0, 1.2, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(collabTitle, {
      text: "\u{1F91D} COLLABORATE",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    const startSessionBtn = engine.addEntity();
    Transform2.create(startSessionBtn, {
      parent: collabPanel,
      position: Vector32.create(0, 0.3, 0.1),
      scale: Vector32.create(0.4, 0.2, 0.1)
    });
    MeshRenderer3.setBox(startSessionBtn);
    Material3.setPbrMaterial(startSessionBtn, {
      albedoColor: Color42.create(0.2, 0.8, 0.2, 1),
      emissiveColor: Color42.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2
    });
    const sessionText = engine.addEntity();
    Transform2.create(sessionText, {
      parent: startSessionBtn,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.5, 0.5, 0.5)
    });
    TextShape3.create(sessionText, {
      text: "START",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    pointerEventsSystem.onPointerDown(
      {
        entity: startSessionBtn,
        opts: { button: InputAction.IA_POINTER, hoverText: "Start Collaboration Session" }
      },
      () => this.startCollaborationSession()
    );
  }
  // Start network synchronization
  startNetworkSync() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.syncPlayerPositions();
      this.syncSharedObjects();
      this.updateVoiceChat();
    });
  }
  // Connect to server
  async connectToServer() {
    this.connectionStatus = "connecting";
    console.log("\u{1F50C} Connecting to multiplayer server...");
    await new Promise((resolve2) => setTimeout(resolve2, 2e3));
    this.connectionStatus = "connected";
    console.log("\u2705 Connected to multiplayer server");
    setTimeout(() => {
      this.simulatePlayerJoin("Alice", Color32.create(1, 0.5, 0.5));
    }, 3e3);
    setTimeout(() => {
      this.simulatePlayerJoin("Bob", Color32.create(0.5, 1, 0.5));
    }, 5e3);
  }
  // Simulate player joining
  simulatePlayerJoin(name, color) {
    const player = {
      id: this.generatePlayerId(),
      name,
      position: Vector32.create(
        Math.random() * 14 + 1,
        1,
        Math.random() * 14 + 1
      ),
      rotation: Quaternion2.fromEulerDegrees(0, 0, 0),
      avatar: null,
      isActive: true,
      lastUpdate: Date.now(),
      color
    };
    this.createRemotePlayer(player);
    this.remotePlayers.set(player.id, player);
    console.log(`\u{1F44B} ${name} joined the session`);
    soundSystem.playInteractionSound("click");
  }
  // Create remote player avatar
  createRemotePlayer(player) {
    const avatar = engine.addEntity();
    Transform2.create(avatar, {
      position: player.position,
      scale: Vector32.create(1, 2, 1)
    });
    MeshRenderer3.setBox(avatar);
    Material3.setPbrMaterial(avatar, {
      albedoColor: Color42.create(player.color.r, player.color.g, player.color.b, 1),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: Color42.create(
        player.color.r * 0.3,
        player.color.g * 0.3,
        player.color.b * 0.3,
        0.5
      ),
      emissiveIntensity: 1
    });
    const nameTag = engine.addEntity();
    Transform2.create(nameTag, {
      parent: avatar,
      position: Vector32.create(0, 2.5, 0),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(nameTag, {
      text: player.name,
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    });
    player.avatar = avatar;
  }
  // Sync player positions
  syncPlayerPositions() {
    if (this.localPlayer.avatar) {
      const transform = Transform2.getMutable(this.localPlayer.avatar);
      this.localPlayer.position = transform.position;
      this.localPlayer.lastUpdate = Date.now();
    }
    this.remotePlayers.forEach((player) => {
      if (player.avatar && player.isActive) {
        if (Math.random() > 0.98) {
          const newPos = Vector32.create(
            player.position.x + (Math.random() - 0.5) * 0.5,
            player.position.y,
            player.position.z + (Math.random() - 0.5) * 0.5
          );
          const transform = Transform2.getMutable(player.avatar);
          transform.position = newPos;
          player.position = newPos;
          player.lastUpdate = Date.now();
        }
      }
    });
  }
  // Sync shared objects
  syncSharedObjects() {
    const whiteboard = this.sharedObjects.get("main-whiteboard");
    if (whiteboard && Math.random() > 0.99) {
      console.log("\u{1F3A8} Remote whiteboard update received");
    }
  }
  // Update voice chat
  updateVoiceChat() {
    const mainChannel = this.voiceChannels.get("main");
    if (mainChannel) {
      this.remotePlayers.forEach((player) => {
        if (!mainChannel.participants.includes(player.id)) {
          mainChannel.participants.push(player.id);
        }
      });
    }
  }
  // Start collaboration session
  startCollaborationSession() {
    const session = {
      id: this.generateSessionId(),
      name: `Session ${Date.now()}`,
      hostId: this.localPlayer.id,
      participants: [this.localPlayer.id],
      startTime: Date.now(),
      isActive: true,
      sharedObjects: /* @__PURE__ */ new Map()
    };
    this.activeSession = session;
    console.log(`\u{1F91D} Started collaboration session: ${session.name}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Toggle mute
  toggleMute() {
    console.log("\u{1F507} Toggle mute");
    soundSystem.playInteractionSound("click");
  }
  // Share object with collaborators
  shareObject(objectId, collaborators) {
    const obj = this.sharedObjects.get(objectId);
    if (obj) {
      obj.collaborators = collaborators;
      console.log(`\u{1F4E4} Shared object ${objectId} with ${collaborators.length} collaborators`);
    }
  }
  // Join voice channel
  joinVoiceChannel(channelId) {
    const channel = this.voiceChannels.get(channelId);
    if (channel && channel.participants.length < channel.maxParticipants) {
      channel.participants.push(this.localPlayer.id);
      console.log(`\u{1F3A4} Joined voice channel: ${channel.name}`);
    }
  }
  // Leave voice channel
  leaveVoiceChannel(channelId) {
    const channel = this.voiceChannels.get(channelId);
    if (channel) {
      channel.participants = channel.participants.filter((id) => id !== this.localPlayer.id);
      console.log(`\u{1F507} Left voice channel: ${channel.name}`);
    }
  }
  // Send message to chat
  sendChatMessage(message) {
    console.log(`\u{1F4AC} ${this.localPlayer.name}: ${message}`);
  }
  // Get all connected players
  getConnectedPlayers() {
    const players = [this.localPlayer];
    this.remotePlayers.forEach((player) => {
      if (player.isActive) {
        players.push(player);
      }
    });
    return players;
  }
  // Get active session
  getActiveSession() {
    return this.activeSession;
  }
  // Utility functions
  generatePlayerId() {
    return "player_" + Math.random().toString(36).substr(2, 9);
  }
  generateSessionId() {
    return "session_" + Math.random().toString(36).substr(2, 9);
  }
  // Cleanup system
  cleanup() {
    if (this.localPlayer.avatar) {
      engine.removeEntity(this.localPlayer.avatar);
    }
    this.remotePlayers.forEach((player) => {
      if (player.avatar) {
        engine.removeEntity(player.avatar);
      }
    });
    this.remotePlayers.clear();
    this.sharedObjects.forEach((obj) => {
    });
    this.sharedObjects.clear();
    this.voiceChannels.clear();
    this.activeSession = null;
    this.isInitialized = false;
    this.connectionStatus = "disconnected";
  }
};
var multiplayerSystem = new MultiplayerSystem();

// src/physics-interaction.ts
var PhysicsInteractionSystem = class {
  constructor() {
    this.objects = /* @__PURE__ */ new Map();
    this.materials = /* @__PURE__ */ new Map();
    this.forceFields = /* @__PURE__ */ new Map();
    this.constraints = /* @__PURE__ */ new Map();
    this.collisions = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.gravity = Vector32.create(0, -9.81, 0);
    this.timeStep = 1 / 60;
    this.maxSubSteps = 4;
    this.collisionMatrix = [];
    this.initializeCollisionMatrix();
  }
  // Initialize physics system
  initialize() {
    console.log("\u269B\uFE0F Physics Interaction System Initializing...");
    this.setupPhysicsMaterials();
    this.createPhysicsUI();
    this.createPhysicsObjects();
    this.startPhysicsEngine();
    this.isInitialized = true;
    console.log("\u269B\uFE0F Physics Interaction System Ready!");
  }
  // Initialize collision matrix
  initializeCollisionMatrix() {
    for (let i = 0; i < 8; i++) {
      this.collisionMatrix[i] = [];
      for (let j = 0; j < 8; j++) {
        this.collisionMatrix[i][j] = true;
      }
    }
  }
  // Setup physics materials
  setupPhysicsMaterials() {
    const metal = {
      id: "material_metal",
      name: "Metal",
      density: 7850,
      restitution: 0.3,
      friction: 0.7,
      durability: 100,
      soundProfile: {
        impactSound: "metal_impact",
        frictionSound: "metal_scrape",
        breakSound: "metal_break",
        volume: 0.8,
        pitch: 1
      }
    };
    const wood = {
      id: "material_wood",
      name: "Wood",
      density: 700,
      restitution: 0.4,
      friction: 0.6,
      durability: 50,
      soundProfile: {
        impactSound: "wood_impact",
        frictionSound: "wood_scrape",
        breakSound: "wood_break",
        volume: 0.6,
        pitch: 0.9
      }
    };
    const glass = {
      id: "material_glass",
      name: "Glass",
      density: 2500,
      restitution: 0.1,
      friction: 0.3,
      durability: 20,
      soundProfile: {
        impactSound: "glass_impact",
        frictionSound: "glass_scrape",
        breakSound: "glass_break",
        volume: 0.9,
        pitch: 1.2
      }
    };
    const rubber = {
      id: "material_rubber",
      name: "Rubber",
      density: 1500,
      restitution: 0.8,
      friction: 0.9,
      durability: 80,
      soundProfile: {
        impactSound: "rubber_impact",
        frictionSound: "rubber_scrape",
        breakSound: "rubber_break",
        volume: 0.5,
        pitch: 0.8
      }
    };
    this.materials.set(metal.id, metal);
    this.materials.set(wood.id, wood);
    this.materials.set(glass.id, glass);
    this.materials.set(rubber.id, rubber);
    console.log("\u{1F527} Physics materials configured");
  }
  // Create physics UI
  createPhysicsUI() {
    this.physicsUI = engine.addEntity();
    Transform2.create(this.physicsUI, {
      position: Vector32.create(2, 3, 8),
      scale: Vector32.create(3, 4, 0.1)
    });
    MeshRenderer3.setBox(this.physicsUI);
    Material3.setPbrMaterial(this.physicsUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.physicsUI,
      position: Vector32.create(0, 1.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u269B\uFE0F PHYSICS INTERACTION",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createObjectControls();
    this.createForceFieldControls();
    this.createConstraintControls();
    this.createPhysicsStats();
  }
  // Create object controls
  createObjectControls() {
    const controls = [
      { id: "spawn_ball", icon: "\u26AA", name: "Spawn Ball" },
      { id: "spawn_box", icon: "\u2B1C", name: "Spawn Box" },
      { id: "spawn_cylinder", icon: "\u{1F964}", name: "Spawn Cylinder" },
      { id: "clear_all", icon: "\u{1F5D1}\uFE0F", name: "Clear All" }
    ];
    let xOffset = -0.9;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.physicsUI,
        position: Vector32.create(xOffset, 1.2, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleObjectControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create force field controls
  createForceFieldControls() {
    const controls = [
      { id: "gravity_field", icon: "\u{1F30D}", name: "Gravity Field" },
      { id: "magnetic_field", icon: "\u{1F9F2}", name: "Magnetic Field" },
      { id: "wind_field", icon: "\u{1F4A8}", name: "Wind Field" },
      { id: "explosion", icon: "\u{1F4A5}", name: "Explosion" }
    ];
    let xOffset = -0.9;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.physicsUI,
        position: Vector32.create(xOffset, 0.6, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.8, 0.3, 0.3, 1),
        emissiveColor: Color42.create(0.8, 0.3, 0.3, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleForceFieldControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create constraint controls
  createConstraintControls() {
    const controls = [
      { id: "spring_constraint", icon: "\u{1F300}", name: "Spring" },
      { id: "hinge_constraint", icon: "\u{1F6AA}", name: "Hinge" },
      { id: "fixed_constraint", icon: "\u{1F512}", name: "Fixed" }
    ];
    let xOffset = -0.6;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.physicsUI,
        position: Vector32.create(xOffset, 0, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.8, 0.3, 1),
        emissiveColor: Color42.create(0.3, 0.8, 0.3, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleConstraintControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create physics stats
  createPhysicsStats() {
    const statsDisplay = engine.addEntity();
    Transform2.create(statsDisplay, {
      parent: this.physicsUI,
      position: Vector32.create(0, -0.6, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(statsDisplay);
    Material3.setPbrMaterial(statsDisplay, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const statsText = engine.addEntity();
    Transform2.create(statsText, {
      parent: statsDisplay,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(statsText, {
      text: "\u{1F4CA} Objects: 0 | Collisions: 0",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create physics objects
  createPhysicsObjects() {
    this.createGroundPlane();
    this.createInitialObjects();
  }
  // Create ground plane
  createGroundPlane() {
    const ground = {
      id: "ground_plane",
      type: "static",
      mass: 0,
      velocity: Vector32.create(0, 0, 0),
      acceleration: Vector32.create(0, 0, 0),
      angularVelocity: Vector32.create(0, 0, 0),
      angularAcceleration: Vector32.create(0, 0, 0),
      position: Vector32.create(8, 0, 8),
      rotation: Quaternion2.fromEulerDegrees(0, 0, 0),
      scale: Vector32.create(20, 0.1, 20),
      restitution: 0.5,
      friction: 0.8,
      damping: 0.1,
      gravityScale: 0,
      isGrounded: true,
      isColliding: false,
      collisionLayer: 0,
      collisionMask: 255
    };
    this.objects.set(ground.id, ground);
    this.createPhysicsEntity(ground, "material_metal");
  }
  // Create initial objects
  createInitialObjects() {
    for (let i = 0; i < 3; i++) {
      this.spawnPhysicsObject("ball", Vector32.create(
        6 + i * 2,
        3 + i,
        6 + i
      ));
    }
  }
  // Create physics entity
  createPhysicsObject(obj, materialId) {
    const entity = engine.addEntity();
    Transform2.create(entity, {
      position: obj.position,
      scale: obj.scale,
      rotation: obj.rotation
    });
    const material = this.materials.get(materialId);
    if (!material)
      return;
    if (obj.id.includes("ball")) {
      MeshRenderer3.setSphere(entity);
    } else if (obj.id.includes("box")) {
      MeshRenderer3.setBox(entity);
    } else if (obj.id.includes("cylinder")) {
      MeshRenderer3.setCylinder(entity, 1, 1, 1, 1, 1);
    } else {
      MeshRenderer3.setBox(entity);
    }
    const color = this.getMaterialColor(materialId);
    Material3.setPbrMaterial(entity, {
      albedoColor: color,
      roughness: 1 - material.friction,
      metallic: material.restitution,
      emissiveColor: Color42.create(0, 0, 0, 0),
      emissiveIntensity: 0
    });
    pointerEventsSystem.onPointerDown(
      {
        entity,
        opts: { button: InputAction.IA_POINTER, hoverText: "Interact" }
      },
      () => this.interactWithObject(obj.id)
    );
    return entity;
  }
  // Get material color
  getMaterialColor(materialId) {
    switch (materialId) {
      case "material_metal":
        return Color42.create(0.7, 0.7, 0.8, 1);
      case "material_wood":
        return Color42.create(0.6, 0.4, 0.2, 1);
      case "material_glass":
        return Color42.create(0.8, 0.9, 1, 0.7);
      case "material_rubber":
        return Color42.create(0.2, 0.2, 0.2, 1);
      default:
        return Color42.create(0.5, 0.5, 0.5, 1);
    }
  }
  // Start physics engine
  startPhysicsEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.simulatePhysics();
      this.detectCollisions();
      this.applyForceFields();
      this.updateConstraints();
      this.updatePhysicsStats();
    });
  }
  // Simulate physics
  simulatePhysics() {
    const dt = this.timeStep;
    this.objects.forEach((obj, id) => {
      if (obj.type === "static")
        return;
      const gravity = Vector32.scale(this.gravity, obj.gravityScale);
      obj.acceleration = Vector32.add(obj.acceleration, gravity);
      obj.velocity = Vector32.add(obj.velocity, Vector32.scale(obj.acceleration, dt));
      obj.velocity = Vector32.scale(obj.velocity, 1 - obj.damping * dt);
      obj.angularVelocity = Vector32.scale(obj.angularVelocity, 1 - obj.damping * dt);
      obj.position = Vector32.add(obj.position, Vector32.scale(obj.velocity, dt));
      const angularDelta = Vector32.scale(obj.angularVelocity, dt);
      obj.rotation = Quaternion2.multiply(
        obj.rotation,
        Quaternion2.fromEulerDegrees(angularDelta.x, angularDelta.y, angularDelta.z)
      );
      obj.acceleration = Vector32.create(0, 0, 0);
      obj.angularAcceleration = Vector32.create(0, 0, 0);
      this.checkGroundCollision(obj);
      this.updateEntityTransform(id);
    });
  }
  // Check ground collision
  checkGroundCollision(obj) {
    if (obj.position.y <= obj.scale.y / 2) {
      obj.position.y = obj.scale.y / 2;
      if (obj.velocity.y < 0) {
        obj.velocity.y = -obj.velocity.y * obj.restitution;
        obj.velocity.x *= 1 - obj.friction * 0.1;
        obj.velocity.z *= 1 - obj.friction * 0.1;
        if (Math.abs(obj.velocity.y) > 0.5) {
          soundSystem.playInteractionSound("impact");
        }
      }
      obj.isGrounded = true;
    } else {
      obj.isGrounded = false;
    }
  }
  // Update entity transform
  updateEntityTransform(objectId) {
    const obj = this.objects.get(objectId);
    if (!obj)
      return;
  }
  // Detect collisions
  detectCollisions() {
    const objectArray = Array.from(this.objects.values());
    for (let i = 0; i < objectArray.length; i++) {
      for (let j = i + 1; j < objectArray.length; j++) {
        const objA = objectArray[i];
        const objB = objectArray[j];
        if (this.shouldCollide(objA, objB)) {
          const collision = this.checkCollision(objA, objB);
          if (collision) {
            this.resolveCollision(collision);
          }
        }
      }
    }
  }
  // Check if objects should collide
  shouldCollide(objA, objB) {
    return (objA.collisionMask & 1 << objB.collisionLayer) !== 0 && (objB.collisionMask & 1 << objA.collisionLayer) !== 0;
  }
  // Check collision between two objects
  checkCollision(objA, objB) {
    const distance = Vector32.distance(objA.position, objB.position);
    const minDistance = (objA.scale.x + objB.scale.x) / 2;
    if (distance < minDistance) {
      const collision = {
        id: `collision_${Date.now()}_${Math.random()}`,
        objectA: objA.id,
        objectB: objB.id,
        contactPoint: Vector32.lerp(objA.position, objB.position, 0.5),
        contactNormal: Vector32.normalize(Vector32.subtract(objB.position, objA.position)),
        impulse: minDistance - distance,
        timestamp: Date.now()
      };
      return collision;
    }
    return null;
  }
  // Resolve collision
  resolveCollision(collision) {
    const objA = this.objects.get(collision.objectA);
    const objB = this.objects.get(collision.objectB);
    if (!objA || !objB)
      return;
    const separation = Vector32.scale(collision.contactNormal, collision.impulse / 2);
    if (objA.type !== "static") {
      objA.position = Vector32.subtract(objA.position, separation);
    }
    if (objB.type !== "static") {
      objB.position = Vector32.add(objB.position, separation);
    }
    const relativeVelocity = Vector32.subtract(objB.velocity, objA.velocity);
    const velocityAlongNormal = Vector32.dot(relativeVelocity, collision.contactNormal);
    if (velocityAlongNormal > 0)
      return;
    const restitution = Math.min(objA.restitution, objB.restitution);
    const impulseScalar = -(1 + restitution) * velocityAlongNormal;
    const impulse = Vector32.scale(collision.contactNormal, impulseScalar);
    if (objA.type !== "static") {
      objA.velocity = Vector32.subtract(objA.velocity, impulse);
    }
    if (objB.type !== "static") {
      objB.velocity = Vector32.add(objB.velocity, impulse);
    }
    this.collisions.set(collision.id, collision);
    soundSystem.playInteractionSound("collision");
  }
  // Apply force fields
  applyForceFields() {
    this.forceFields.forEach((field, id) => {
      if (!field.isActive)
        return;
      this.objects.forEach((obj, objectId) => {
        if (field.affectedObjects.includes(objectId)) {
          this.applyForceField(obj, field);
        }
      });
    });
  }
  // Apply force field to object
  applyForceField(obj, field) {
    const distance = Vector32.distance(obj.position, field.position);
    if (distance <= field.radius) {
      const force = Vector32.scale(field.direction, field.strength);
      const falloff = 1 - distance / field.radius;
      const finalForce = Vector32.scale(force, falloff);
      obj.acceleration = Vector32.add(obj.acceleration, finalForce);
    }
  }
  // Update constraints
  updateConstraints() {
    this.constraints.forEach((constraint, id) => {
      this.applyConstraint(constraint);
    });
  }
  // Apply constraint
  applyConstraint(constraint) {
    const objA = this.objects.get(constraint.objectA);
    const objB = constraint.objectB ? this.objects.get(constraint.objectB) : null;
    if (!objA)
      return;
    switch (constraint.type) {
      case "spring":
        if (objB) {
          this.applySpringConstraint(objA, objB, constraint);
        }
        break;
      case "hinge":
        if (objB) {
          this.applyHingeConstraint(objA, objB, constraint);
        }
        break;
      case "fixed":
        if (objB) {
          this.applyFixedConstraint(objA, objB, constraint);
        }
        break;
    }
  }
  // Apply spring constraint
  applySpringConstraint(objA, objB, constraint) {
    const distance = Vector32.distance(objA.position, objB.position);
    const restLength = constraint.minDistance || 2;
    const displacement = distance - restLength;
    if (Math.abs(displacement) > 0.01) {
      const direction = Vector32.normalize(Vector32.subtract(objB.position, objA.position));
      const force = Vector32.scale(direction, displacement * constraint.strength);
      objA.acceleration = Vector32.add(objA.acceleration, force);
      objB.acceleration = Vector32.subtract(objB.acceleration, force);
    }
  }
  // Apply hinge constraint
  applyHingeConstraint(objA, objB, constraint) {
    const targetPos = Vector32.add(objB.position, constraint.positionB);
    const direction = Vector32.subtract(targetPos, objA.position);
    objA.position = Vector32.add(targetPos, Vector32.scale(direction, -0.5));
    objB.position = Vector32.add(targetPos, Vector32.scale(direction, 0.5));
  }
  // Apply fixed constraint
  applyFixedConstraint(objA, objB, constraint) {
    const targetPos = Vector32.add(objB.position, constraint.positionB);
    objA.position = targetPos;
    objA.velocity = Vector32.create(0, 0, 0);
  }
  // Update physics stats
  updatePhysicsStats() {
    const objectCount = this.objects.size;
    const collisionCount = this.collisions.size;
    console.log(`\u{1F4CA} Objects: ${objectCount} | Collisions: ${collisionCount}`);
  }
  // Handle object control
  handleObjectControl(controlId) {
    switch (controlId) {
      case "spawn_ball":
        this.spawnPhysicsObject("ball", Vector32.create(8, 5, 8));
        break;
      case "spawn_box":
        this.spawnPhysicsObject("box", Vector32.create(8, 5, 8));
        break;
      case "spawn_cylinder":
        this.spawnPhysicsObject("cylinder", Vector32.create(8, 5, 8));
        break;
      case "clear_all":
        this.clearAllObjects();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Handle force field control
  handleForceFieldControl(controlId) {
    switch (controlId) {
      case "gravity_field":
        this.createForceField("gravity");
        break;
      case "magnetic_field":
        this.createForceField("magnetic");
        break;
      case "wind_field":
        this.createForceField("wind");
        break;
      case "explosion":
        this.createExplosion();
        break;
    }
    soundSystem.playInteractionSound("powerup");
  }
  // Handle constraint control
  handleConstraintControl(controlId) {
    switch (controlId) {
      case "spring_constraint":
        this.createSpringConstraint();
        break;
      case "hinge_constraint":
        this.createHingeConstraint();
        break;
      case "fixed_constraint":
        this.createFixedConstraint();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Spawn physics object
  spawnPhysicsObject(type, position) {
    const obj = {
      id: `${type}_${Date.now()}_${Math.random()}`,
      type: "rigid_body",
      mass: 1,
      velocity: Vector32.create(
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2
      ),
      acceleration: Vector32.create(0, 0, 0),
      angularVelocity: Vector32.create(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      angularAcceleration: Vector32.create(0, 0, 0),
      position,
      rotation: Quaternion2.fromEulerDegrees(
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360
      ),
      scale: Vector32.create(0.5, 0.5, 0.5),
      restitution: 0.6,
      friction: 0.5,
      damping: 0.1,
      gravityScale: 1,
      isGrounded: false,
      isColliding: false,
      collisionLayer: 1,
      collisionMask: 255
    };
    this.objects.set(obj.id, obj);
    this.createPhysicsObject(obj, "material_rubber");
    console.log(`\u{1F3BE} Spawned ${type}: ${obj.id}`);
  }
  // Create force field
  createForceField(type) {
    const field = {
      id: `field_${type}_${Date.now()}`,
      type,
      position: Vector32.create(8, 2, 8),
      radius: 5,
      strength: 10,
      direction: Vector32.create(0, 1, 0),
      isActive: true,
      affectedObjects: Array.from(this.objects.keys()).filter((id) => id !== "ground_plane")
    };
    this.forceFields.set(field.id, field);
    console.log(`\u26A1 Created ${type} force field: ${field.id}`);
  }
  // Create explosion
  createExplosion() {
    const explosionPos = Vector32.create(8, 2, 8);
    const explosionForce = 20;
    const explosionRadius = 8;
    this.objects.forEach((obj, id) => {
      if (obj.type === "static")
        return;
      const distance = Vector32.distance(obj.position, explosionPos);
      if (distance <= explosionRadius) {
        const direction = Vector32.normalize(Vector32.subtract(obj.position, explosionPos));
        const force = Vector32.scale(direction, explosionForce * (1 - distance / explosionRadius));
        obj.velocity = Vector32.add(obj.velocity, force);
      }
    });
    soundSystem.playInteractionSound("explosion");
    console.log("\u{1F4A5} Explosion created!");
  }
  // Create spring constraint
  createSpringConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter((id) => id !== "ground_plane");
    if (objectIds.length < 2)
      return;
    const constraint = {
      id: `constraint_spring_${Date.now()}`,
      type: "spring",
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: Vector32.create(0, 0, 0),
      positionB: Vector32.create(0, 0, 0),
      minDistance: 2,
      strength: 5,
      damping: 0.5
    };
    this.constraints.set(constraint.id, constraint);
    console.log(`\u{1F300} Created spring constraint: ${constraint.id}`);
  }
  // Create hinge constraint
  createHingeConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter((id) => id !== "ground_plane");
    if (objectIds.length < 2)
      return;
    const constraint = {
      id: `constraint_hinge_${Date.now()}`,
      type: "hinge",
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: Vector32.create(0, 0, 0),
      positionB: Vector32.create(1, 0, 0),
      limits: {
        minRotation: Vector32.create(-45, 0, 0),
        maxRotation: Vector32.create(45, 0, 0)
      },
      strength: 10,
      damping: 0.5
    };
    this.constraints.set(constraint.id, constraint);
    console.log(`\u{1F6AA} Created hinge constraint: ${constraint.id}`);
  }
  // Create fixed constraint
  createFixedConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter((id) => id !== "ground_plane");
    if (objectIds.length < 2)
      return;
    const constraint = {
      id: `constraint_fixed_${Date.now()}`,
      type: "fixed",
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: Vector32.create(0, 0, 0),
      positionB: Vector32.create(0, 0, 0),
      strength: 100,
      damping: 1
    };
    this.constraints.set(constraint.id, constraint);
    console.log(`\u{1F512} Created fixed constraint: ${constraint.id}`);
  }
  // Interact with object
  interactWithObject(objectId) {
    const obj = this.objects.get(objectId);
    if (!obj || obj.type === "static")
      return;
    const impulse = Vector32.create(
      (Math.random() - 0.5) * 10,
      Math.random() * 10,
      (Math.random() - 0.5) * 10
    );
    obj.velocity = Vector32.add(obj.velocity, impulse);
    soundSystem.playInteractionSound("impact");
    console.log(`\u{1F44A} Applied impulse to ${objectId}`);
  }
  // Clear all objects
  clearAllObjects() {
    this.objects.forEach((obj, id) => {
      if (id !== "ground_plane") {
        this.objects.delete(id);
      }
    });
    this.forceFields.clear();
    this.constraints.clear();
    this.collisions.clear();
    console.log("\u{1F5D1}\uFE0F Cleared all physics objects");
    soundSystem.playInteractionSound("click");
  }
  // Get physics objects
  getObjects() {
    return Array.from(this.objects.values());
  }
  // Get force fields
  getForceFields() {
    return Array.from(this.forceFields.values());
  }
  // Get constraints
  getConstraints() {
    return Array.from(this.constraints.values());
  }
  // Set gravity
  setGravity(gravity) {
    this.gravity = gravity;
    console.log(`\u{1F30D} Gravity set to: (${gravity.x}, ${gravity.y}, ${gravity.z})`);
  }
  // Cleanup system
  cleanup() {
    this.objects.clear();
    this.materials.clear();
    this.forceFields.clear();
    this.constraints.clear();
    this.collisions.clear();
    if (this.physicsUI) {
      engine.removeEntity(this.physicsUI);
    }
    this.isInitialized = false;
  }
};
var physicsSystem = new PhysicsInteractionSystem();

// src/procedural-generation.ts
var ProceduralGenerationSystem = class {
  constructor() {
    this.chunks = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.chunkSize = 32;
    this.renderDistance = 2;
  }
  initialize() {
    console.log("\u{1F30D} Procedural Generation System Initializing...");
    this.createGenerationUI();
    this.startGenerationEngine();
    this.generateInitialChunks();
    this.isInitialized = true;
    console.log("\u{1F30D} Procedural Generation System Ready!");
  }
  createGenerationUI() {
    this.generationUI = engine.addEntity();
    Transform2.create(this.generationUI, {
      position: Vector32.create(14, 3, 8),
      scale: Vector32.create(3, 2, 0.1)
    });
    MeshRenderer3.setBox(this.generationUI);
    Material3.setPbrMaterial(this.generationUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.generationUI,
      position: Vector32.create(0, 0.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F30D} INFINITE WORLD",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    const controls = [
      { id: "generate", icon: "\u{1F3B2}", name: "Generate" },
      { id: "expand", icon: "\u2795", name: "Expand" },
      { id: "reset", icon: "\u{1F5D1}\uFE0F", name: "Reset" }
    ];
    let xOffset = -0.6;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.generationUI,
        position: Vector32.create(xOffset, 0, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        { entity: button, opts: { button: InputAction.IA_POINTER, hoverText: control.name } },
        () => this.handleControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  handleControl(controlId) {
    switch (controlId) {
      case "generate":
        this.generateNewChunk();
        break;
      case "expand":
        this.expandWorld();
        break;
      case "reset":
        this.resetWorld();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  startGenerationEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateChunks();
    });
  }
  generateInitialChunks() {
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        this.generateChunk(x, z);
      }
    }
  }
  generateChunk(x, z) {
    const chunkId = `chunk_${x}_${z}`;
    const biomes = ["office", "tech", "nature", "abstract"];
    const biome = biomes[Math.floor(Math.random() * biomes.length)];
    const chunk = {
      id: chunkId,
      position: Vector32.create(x * this.chunkSize, 0, z * this.chunkSize),
      biome,
      structures: [],
      entities: [],
      isLoaded: false
    };
    this.chunks.set(chunkId, chunk);
    this.generateChunkContent(chunk);
    console.log(`\u{1F30D} Generated chunk ${chunkId} (${biome})`);
    return chunk;
  }
  generateChunkContent(chunk) {
    const structureCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < structureCount; i++) {
      const structure = {
        id: `struct_${chunk.id}_${i}`,
        type: chunk.biome === "office" ? "building" : "decoration",
        position: Vector32.create(
          chunk.position.x + Math.random() * this.chunkSize,
          2,
          chunk.position.z + Math.random() * this.chunkSize
        )
      };
      chunk.structures.push(structure);
    }
    const entityCount = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < entityCount; i++) {
      const entity = {
        id: `entity_${chunk.id}_${i}`,
        type: chunk.biome === "nature" ? "plant" : "object",
        position: Vector32.create(
          chunk.position.x + Math.random() * this.chunkSize,
          1,
          chunk.position.z + Math.random() * this.chunkSize
        )
      };
      chunk.entities.push(entity);
    }
  }
  updateChunks() {
    this.chunks.forEach((chunk) => {
      if (!chunk.isLoaded) {
        this.loadChunk(chunk);
      }
    });
  }
  loadChunk(chunk) {
    const terrain = engine.addEntity();
    Transform2.create(terrain, {
      position: chunk.position,
      scale: Vector32.create(this.chunkSize, 0.1, this.chunkSize)
    });
    MeshRenderer3.setBox(terrain);
    const biomeColor = this.getBiomeColor(chunk.biome);
    Material3.setPbrMaterial(terrain, {
      albedoColor: biomeColor,
      roughness: 0.8,
      metallic: 0.1
    });
    chunk.structures.forEach((structure) => {
      const structEntity = engine.addEntity();
      Transform2.create(structEntity, {
        position: structure.position,
        scale: Vector32.create(2, 4, 2)
      });
      MeshRenderer3.setBox(structEntity);
      Material3.setPbrMaterial(structEntity, {
        albedoColor: Color42.create(0.7, 0.7, 0.7, 1),
        roughness: 0.3,
        metallic: 0.5
      });
    });
    chunk.entities.forEach((entity) => {
      const entityEntity = engine.addEntity();
      Transform2.create(entityEntity, {
        position: entity.position,
        scale: Vector32.create(0.5, 1, 0.5)
      });
      MeshRenderer3.setSphere(entityEntity);
      Material3.setPbrMaterial(entityEntity, {
        albedoColor: Color42.create(0.2, 0.8, 0.2, 1),
        roughness: 0.5,
        metallic: 0.1
      });
    });
    chunk.isLoaded = true;
  }
  getBiomeColor(biome) {
    switch (biome) {
      case "office":
        return Color42.create(0.6, 0.6, 0.7, 1);
      case "tech":
        return Color42.create(0.2, 0.4, 0.8, 1);
      case "nature":
        return Color42.create(0.2, 0.8, 0.2, 1);
      case "abstract":
        return Color42.create(0.8, 0.2, 0.8, 1);
      default:
        return Color42.create(0.5, 0.5, 0.5, 1);
    }
  }
  generateNewChunk() {
    const x = Math.floor(Math.random() * 10) - 5;
    const z = Math.floor(Math.random() * 10) - 5;
    this.generateChunk(x, z);
    soundSystem.playInteractionSound("powerup");
  }
  expandWorld() {
    for (let i = 0; i < 4; i++) {
      const x = Math.floor(Math.random() * 20) - 10;
      const z = Math.floor(Math.random() * 20) - 10;
      this.generateChunk(x, z);
    }
    soundSystem.playInteractionSound("powerup");
  }
  resetWorld() {
    this.chunks.forEach((chunk) => {
      chunk.isLoaded = false;
    });
    this.chunks.clear();
    this.generateInitialChunks();
    soundSystem.playInteractionSound("click");
  }
  getChunks() {
    return Array.from(this.chunks.values());
  }
  cleanup() {
    this.chunks.clear();
    if (this.generationUI) {
      engine.removeEntity(this.generationUI);
    }
    this.isInitialized = false;
  }
};
var proceduralSystem = new ProceduralGenerationSystem();

// src/responsive-ui-system.ts
var ResponsiveUISystem = class {
  constructor() {
    this.components = /* @__PURE__ */ new Map();
    this.touchPoints = /* @__PURE__ */ new Map();
    this.activeGestures = /* @__PURE__ */ new Map();
    this.gestureThresholds = {
      tap: { maxDuration: 300, maxDistance: 0.1 },
      longPress: { minDuration: 500, maxDistance: 0.1 },
      swipe: { minVelocity: 0.5, minDistance: 0.5 },
      pinch: { minScale: 0.8, maxScale: 1.2 },
      rotate: { minAngle: 15 }
    };
    this.isInitialized = false;
  }
  // Initialize the UI system
  initialize() {
    console.log("\u{1F4F1} Responsive UI System Initializing...");
    this.createMainUI();
    this.setupGestureRecognition();
    this.startAnimationLoop();
    this.isInitialized = true;
    console.log("\u{1F4F1} Responsive UI System Ready!");
  }
  // Create main UI interface
  createMainUI() {
    this.createFloatingPanel();
    this.createGestureTutorial();
    this.createResponsiveButtons();
    this.createTouchFeedback();
  }
  // Create floating control panel
  createFloatingPanel() {
    const panel = engine.addEntity();
    Transform2.create(panel, {
      position: Vector32.create(8, 3, 2),
      scale: Vector32.create(4, 2, 0.1)
    });
    MeshRenderer3.setBox(panel);
    Material3.setPbrMaterial(panel, {
      albedoColor: Color42.create(0.1, 0.1, 0.2, 0.9),
      roughness: 0.2,
      metallic: 0.8,
      emissiveColor: Color42.create(0.2, 0.3, 0.6, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: panel,
      position: Vector32.create(0, 0.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(title, {
      text: "\u{1F3AE} CONTROL PANEL",
      textColor: Color42.create(0.8, 0.8, 1, 1),
      fontSize: 3,
      textAlign: 3
    });
    this.addComponent("mainPanel", {
      id: "mainPanel",
      entity: panel,
      type: "panel",
      position: Vector32.create(8, 3, 2),
      size: Vector32.create(4, 2, 0.1),
      visible: true,
      interactive: true,
      gestureHandlers: /* @__PURE__ */ new Map([
        ["drag", this.handlePanelDrag.bind(this)],
        ["pinch", this.handlePanelPinch.bind(this)],
        ["doubleTap", this.handlePanelDoubleTap.bind(this)]
      ])
    });
  }
  // Create gesture tutorial
  createGestureTutorial() {
    const tutorial = engine.addEntity();
    Transform2.create(tutorial, {
      position: Vector32.create(14, 4, 2),
      scale: Vector32.create(2, 3, 0.1)
    });
    MeshRenderer3.setBox(tutorial);
    Material3.setPbrMaterial(tutorial, {
      albedoColor: Color42.create(0.2, 0.1, 0.3, 0.8),
      emissiveColor: Color42.create(0.4, 0.2, 0.6, 0.4),
      emissiveIntensity: 1
    });
    const tutorialText = engine.addEntity();
    Transform2.create(tutorialText, {
      parent: tutorial,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.2, 0.2, 0.2)
    });
    TextShape3.create(tutorialText, {
      text: "\u{1F446} TAP\n\u{1F91A} SWIPE\n\u{1F90F} PINCH\n\u{1F504} ROTATE\n\u23F0 LONG PRESS",
      textColor: Color42.create(1, 1, 0.8, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.addComponent("gestureTutorial", {
      id: "gestureTutorial",
      entity: tutorial,
      type: "panel",
      position: Vector32.create(14, 4, 2),
      size: Vector32.create(2, 3, 0.1),
      visible: true,
      interactive: true,
      gestureHandlers: /* @__PURE__ */ new Map([
        ["tap", this.handleTutorialTap.bind(this)]
      ])
    });
  }
  // Create responsive buttons
  createResponsiveButtons() {
    const buttonConfigs = [
      { id: "btnLights", label: "\u{1F4A1}", pos: Vector32.create(2, 1.5, 2), color: Color42.create(1, 0.8, 0.2, 1) },
      { id: "btnSound", label: "\u{1F50A}", pos: Vector32.create(3, 1.5, 2), color: Color42.create(0.2, 0.8, 1, 1) },
      { id: "btnData", label: "\u{1F4CA}", pos: Vector32.create(4, 1.5, 2), color: Color42.create(0.8, 0.2, 1, 1) },
      { id: "btnNPC", label: "\u{1F916}", pos: Vector32.create(5, 1.5, 2), color: Color42.create(0.2, 1, 0.8, 1) }
    ];
    buttonConfigs.forEach((config) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        position: config.pos,
        scale: Vector32.create(0.4, 0.4, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: config.color,
        roughness: 0.1,
        metallic: 0.9,
        emissiveColor: config.color,
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape3.create(buttonText, {
        text: config.label,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 4,
        textAlign: 3
      });
      this.addComponent(config.id, {
        id: config.id,
        entity: button,
        type: "button",
        position: config.pos,
        size: Vector32.create(0.4, 0.4, 0.1),
        visible: true,
        interactive: true,
        gestureHandlers: /* @__PURE__ */ new Map([
          ["tap", () => this.handleButtonTap(config.id)],
          ["longPress", () => this.handleButtonLongPress(config.id)],
          ["swipe", (direction) => this.handleButtonSwipe(config.id, direction)]
        ])
      });
    });
  }
  // Create touch feedback system
  createTouchFeedback() {
    const rippleEffect = engine.addEntity();
    Transform2.create(rippleEffect, {
      position: Vector32.create(0, -10, 0),
      // Hidden initially
      scale: Vector32.create(0.1, 0.1, 0.1)
    });
    MeshRenderer3.setSphere(rippleEffect);
    Material3.setPbrMaterial(rippleEffect, {
      albedoColor: Color42.create(0.5, 0.8, 1, 0.6),
      emissiveColor: Color42.create(0.5, 0.8, 1, 0.8),
      emissiveIntensity: 3
    });
    this.addComponent("touchFeedback", {
      id: "touchFeedback",
      entity: rippleEffect,
      type: "panel",
      position: Vector32.create(0, -10, 0),
      size: Vector32.create(0.1, 0.1, 0.1),
      visible: false,
      interactive: false,
      gestureHandlers: /* @__PURE__ */ new Map()
    });
  }
  // Setup gesture recognition system
  setupGestureRecognition() {
    pointerEventsSystem.onPointerDown(
      { entity: engine.RootEntity, opts: { button: InputAction.IA_POINTER } },
      (e) => this.handleTouchStart(e)
    );
    pointerEventsSystem.onPointerUp(
      { entity: engine.RootEntity, opts: { button: InputAction.IA_POINTER } },
      (e) => this.handleTouchEnd(e)
    );
    engine.addSystem(() => {
      this.updateHoverStates();
    });
  }
  // Handle touch start
  handleTouchStart(event) {
    const touchPoint = {
      id: Date.now(),
      position: Vector32.create(event.hit.hitPoint.x, event.hit.hitPoint.y, event.hit.hitPoint.z),
      timestamp: Date.now(),
      pressure: 1
    };
    this.touchPoints.set(touchPoint.id, touchPoint);
    this.startGestureDetection(touchPoint);
    this.showTouchFeedback(touchPoint.position);
  }
  // Handle touch end
  handleTouchEnd(event) {
    const touchPoint = Array.from(this.touchPoints.values()).pop();
    if (!touchPoint)
      return;
    const endPosition = Vector32.create(event.hit.hitPoint.x, event.hit.hitPoint.y, event.hit.hitPoint.z);
    const duration = Date.now() - touchPoint.timestamp;
    const distance = Vector32.distance(touchPoint.position, endPosition);
    this.detectAndTriggerGesture(touchPoint, endPosition, duration, distance);
    this.touchPoints.delete(touchPoint.id);
    this.hideTouchFeedback();
  }
  // Start gesture detection
  startGestureDetection(touchPoint) {
    setTimeout(() => {
      if (this.touchPoints.has(touchPoint.id)) {
        this.triggerGesture("longPress", touchPoint.position, touchPoint.position, Date.now() - touchPoint.timestamp, 0);
      }
    }, this.gestureThresholds.longPress.minDuration);
  }
  // Detect and trigger gestures
  detectAndTriggerGesture(startPoint, endPosition, duration, distance) {
    if (duration <= this.gestureThresholds.tap.maxDuration && distance <= this.gestureThresholds.tap.maxDistance) {
      this.triggerGesture("tap", startPoint.position, endPosition, duration, distance);
      return;
    }
    const velocity = distance / duration * 1e3;
    if (velocity >= this.gestureThresholds.swipe.minVelocity && distance >= this.gestureThresholds.swipe.minDistance) {
      const direction = Vector32.subtract(endPosition, startPoint.position).normalize();
      this.triggerGesture("swipe", startPoint.position, endPosition, duration, distance, direction);
      return;
    }
    if (duration >= this.gestureThresholds.longPress.minDuration && distance <= this.gestureThresholds.longPress.maxDistance) {
      this.triggerGesture("longPress", startPoint.position, endPosition, duration, distance);
    }
  }
  // Trigger gesture on components
  triggerGesture(type, startPos, endPos, duration, distance, direction) {
    this.components.forEach((component) => {
      if (!component.interactive || !component.visible)
        return;
      if (this.isPointInComponent(endPos, component)) {
        const handler = component.gestureHandlers.get(type);
        if (handler) {
          soundSystem.playInteractionSound("click");
          if (direction) {
            handler(direction);
          } else {
            handler();
          }
        }
      }
    });
  }
  // Check if point is within component bounds
  isPointInComponent(point, component) {
    const halfSize = Vector32.scale(component.size, 0.5);
    const minBounds = Vector32.subtract(component.position, halfSize);
    const maxBounds = Vector32.add(component.position, halfSize);
    return point.x >= minBounds.x && point.x <= maxBounds.x && point.y >= minBounds.y && point.y <= maxBounds.y && point.z >= minBounds.z && point.z <= maxBounds.z;
  }
  // Show touch feedback
  showTouchFeedback(position) {
    const feedback = this.components.get("touchFeedback");
    if (feedback) {
      const transform = Transform2.getMutable(feedback.entity);
      transform.position = position;
      transform.scale = Vector32.create(0.1, 0.1, 0.1);
      this.animateRipple(feedback.entity);
    }
  }
  // Hide touch feedback
  hideTouchFeedback() {
    const feedback = this.components.get("touchFeedback");
    if (feedback) {
      const transform = Transform2.getMutable(feedback.entity);
      transform.position = Vector32.create(0, -10, 0);
    }
  }
  // Animate ripple effect
  animateRipple(entity) {
    let scale = 0.1;
    let opacity = 1;
    const animate = () => {
      scale += 0.02;
      opacity -= 0.02;
      const transform = Transform2.getMutable(entity);
      transform.scale = Vector32.create(scale, scale, scale);
      const material = Material3.getMutable(entity);
      if (material && material.$case === "pbr") {
        material.pbr.albedoColor = Color42.create(0.5, 0.8, 1, opacity);
      }
      if (opacity > 0) {
        setTimeout(animate, 16);
      }
    };
    animate();
  }
  // Gesture handlers
  handlePanelDrag() {
    console.log("\u{1F3AE} Panel dragged");
  }
  handlePanelPinch() {
    console.log("\u{1F3AE} Panel pinched");
  }
  handlePanelDoubleTap() {
    console.log("\u{1F3AE} Panel double-tapped");
  }
  handleTutorialTap() {
    console.log("\u{1F4DA} Tutorial tapped");
  }
  handleButtonTap(buttonId) {
    console.log(`\u{1F518} Button ${buttonId} tapped`);
    switch (buttonId) {
      case "btnLights":
        this.toggleLights();
        break;
      case "btnSound":
        this.toggleSound();
        break;
      case "btnData":
        this.toggleDataVisualization();
        break;
      case "btnNPC":
        this.toggleNPCs();
        break;
    }
  }
  handleButtonLongPress(buttonId) {
    console.log(`\u23F0 Button ${buttonId} long-pressed`);
  }
  handleButtonSwipe(buttonId, direction) {
    console.log(`\u{1F446} Button ${buttonId} swiped ${direction}`);
  }
  // Control functions
  toggleLights() {
    console.log("\u{1F4A1} Lights toggled");
  }
  toggleSound() {
    console.log("\u{1F50A} Sound toggled");
  }
  toggleDataVisualization() {
    console.log("\u{1F4CA} Data visualization toggled");
  }
  toggleNPCs() {
    console.log("\u{1F916} NPCs toggled");
  }
  // Update hover states
  updateHoverStates() {
    this.components.forEach((component) => {
      if (!component.interactive || !component.visible)
        return;
      const material = Material3.getMutable(component.entity);
      if (material && material.$case === "pbr") {
        const time = Date.now() / 1e3;
        const pulse = Math.sin(time * 3) * 0.1 + 0.9;
        material.pbr.emissiveIntensity = pulse * 2;
      }
    });
  }
  // Start animation loop
  startAnimationLoop() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateUIAnimations();
    });
  }
  // Update UI animations
  updateUIAnimations() {
    this.components.forEach((component) => {
      if (!component.visible)
        return;
      if (component.interactive) {
        const time = Date.now() / 1e3;
        const transform = Transform2.getMutable(component.entity);
        const floatOffset = Math.sin(time + component.position.x) * 0.02;
        transform.position.y = component.position.y + floatOffset;
      }
    });
  }
  // Add component to system
  addComponent(id, component) {
    this.components.set(id, component);
  }
  // Get component by ID
  getComponent(id) {
    return this.components.get(id);
  }
  // Show/hide component
  setComponentVisibility(id, visible) {
    const component = this.components.get(id);
    if (component) {
      component.visible = visible;
      const transform = Transform2.getMutable(component.entity);
      if (visible) {
        transform.scale = component.size;
      } else {
        transform.scale = Vector32.create(0, 0, 0);
      }
    }
  }
  // Cleanup system
  cleanup() {
    this.components.forEach((component) => {
      engine.removeEntity(component.entity);
    });
    this.components.clear();
    this.touchPoints.clear();
    this.activeGestures.clear();
    this.isInitialized = false;
  }
};
var uiSystem = new ResponsiveUISystem();

// src/smart-room-system.ts
var SmartRoomSystem = class {
  constructor() {
    this.devices = /* @__PURE__ */ new Map();
    this.automationRules = /* @__PURE__ */ new Map();
    this.smartScenes = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.currentScene = "default";
    this.energyUsage = 0;
  }
  // Initialize smart room system
  initialize() {
    console.log("\u{1F3E0} Smart Room System Initializing...");
    this.createIoTDevices();
    this.createAutomationRules();
    this.createSmartScenes();
    this.createControlPanel();
    this.startAutomationEngine();
    this.isInitialized = true;
    console.log("\u{1F3E0} Smart Room System Ready!");
  }
  // Create IoT devices
  createIoTDevices() {
    this.createDevice("light_main", "Main Light", "light", Vector32.create(8, 4, 8));
    this.createDevice("light_desk", "Desk Light", "light", Vector32.create(4, 2.5, 4));
    this.createDevice("light_meeting", "Meeting Room Light", "light", Vector32.create(12, 2.5, 12));
    this.createDevice("temp_main", "Thermostat", "temperature", Vector32.create(8, 3, 2));
    this.createDevice("security_main", "Security System", "security", Vector32.create(1, 2, 8));
    this.createDevice("camera_entrance", "Entrance Camera", "security", Vector32.create(8, 3, 15));
    this.createDevice("entertainment_display", "Smart Display", "entertainment", Vector32.create(8, 3, 0.5));
    this.createDevice("entertainment_audio", "Audio System", "entertainment", Vector32.create(14, 2, 8));
    this.createDevice("productivity_focus", "Focus Mode", "productivity", Vector32.create(4, 3, 12));
    this.createDevice("productivity_timer", "Work Timer", "productivity", Vector32.create(12, 3, 4));
    this.createDevice("energy_monitor", "Energy Monitor", "energy", Vector32.create(2, 3, 2));
    this.createDevice("energy_solar", "Solar Panels", "energy", Vector32.create(14, 5, 14));
  }
  // Create individual device
  createDevice(id, name, type, position) {
    const device = engine.addEntity();
    Transform2.create(device, {
      position,
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    let deviceColor;
    let deviceIcon;
    switch (type) {
      case "light":
        deviceColor = Color42.create(1, 0.8, 0.2, 1);
        deviceIcon = "\u{1F4A1}";
        MeshRenderer3.setSphere(device);
        break;
      case "temperature":
        deviceColor = Color42.create(0.2, 0.8, 1, 1);
        deviceIcon = "\u{1F321}\uFE0F";
        MeshRenderer3.setBox(device);
        break;
      case "security":
        deviceColor = Color42.create(0.8, 0.2, 0.2, 1);
        deviceIcon = "\u{1F6E1}\uFE0F";
        MeshRenderer3.setBox(device);
        break;
      case "entertainment":
        deviceColor = Color42.create(0.8, 0.2, 0.8, 1);
        deviceIcon = "\u{1F3AE}";
        MeshRenderer3.setBox(device);
        break;
      case "productivity":
        deviceColor = Color42.create(0.2, 0.8, 0.2, 1);
        deviceIcon = "\u26A1";
        MeshRenderer3.setBox(device);
        break;
      case "energy":
        deviceColor = Color42.create(1, 0.6, 0.2, 1);
        deviceIcon = "\u26A1";
        MeshRenderer3.setBox(device);
        break;
      default:
        deviceColor = Color42.create(0.5, 0.5, 0.5, 1);
        deviceIcon = "\u{1F4F1}";
        MeshRenderer3.setBox(device);
    }
    Material3.setPbrMaterial(device, {
      albedoColor: deviceColor,
      roughness: 0.2,
      metallic: 0.8,
      emissiveColor: Color42.create(
        deviceColor.r * 0.5,
        deviceColor.g * 0.5,
        deviceColor.b * 0.5,
        0.5
      ),
      emissiveIntensity: 1
    });
    const label = engine.addEntity();
    Transform2.create(label, {
      parent: device,
      position: Vector32.create(0, 0.3, 0),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(label, {
      text: deviceIcon,
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    const statusIndicator = engine.addEntity();
    Transform2.create(statusIndicator, {
      parent: device,
      position: Vector32.create(0, -0.2, 0),
      scale: Vector32.create(0.1, 0.1, 0.1)
    });
    MeshRenderer3.setSphere(statusIndicator);
    Material3.setPbrMaterial(statusIndicator, {
      albedoColor: Color42.create(0, 1, 0, 1),
      emissiveColor: Color42.create(0, 1, 0, 1),
      emissiveIntensity: 2
    });
    const iotDevice = {
      id,
      name,
      type,
      status: "online",
      value: type === "light" ? false : type === "temperature" ? 22 : 0,
      position,
      automationRules: [],
      lastUpdate: Date.now()
    };
    this.devices.set(id, iotDevice);
    pointerEventsSystem.onPointerDown(
      {
        entity: device,
        opts: { button: InputAction.IA_POINTER, hoverText: `Control ${name}` }
      },
      () => this.handleDeviceInteraction(id)
    );
  }
  // Create automation rules
  createAutomationRules() {
    this.createAutomationRule("morning_routine", "Morning Routine", {
      type: "time",
      conditions: [
        { deviceId: "temp_main", property: "hour", operator: "equals", value: 8 }
      ]
    }, [
      { type: "setDevice", target: "light_main", parameters: { value: true } },
      { type: "setDevice", target: "temp_main", parameters: { value: 22 } },
      { type: "setDevice", target: "entertainment_audio", parameters: { value: "morning_playlist" } }
    ]);
    this.createAutomationRule("energy_saving", "Energy Saving", {
      type: "device",
      conditions: [
        { deviceId: "energy_monitor", property: "usage", operator: "greater", value: 80 }
      ]
    }, [
      { type: "setDevice", target: "light_main", parameters: { value: false } },
      { type: "setDevice", target: "light_desk", parameters: { value: false } },
      { type: "notify", target: "user", parameters: { message: "High energy usage detected" } }
    ]);
    this.createAutomationRule("security_night", "Night Security", {
      type: "time",
      conditions: [
        { deviceId: "temp_main", property: "hour", operator: "greater", value: 22 }
      ]
    }, [
      { type: "setDevice", target: "security_main", parameters: { value: "armed" } },
      { type: "setDevice", target: "camera_entrance", parameters: { value: "recording" } }
    ]);
    this.createAutomationRule("focus_mode", "Focus Mode", {
      type: "device",
      conditions: [
        { deviceId: "productivity_focus", property: "active", operator: "equals", value: true }
      ]
    }, [
      { type: "setDevice", target: "entertainment_audio", parameters: { value: false } },
      { type: "setDevice", target: "light_desk", parameters: { value: true, brightness: 0.8 } },
      { type: "notify", target: "user", parameters: { message: "Focus mode activated" } }
    ]);
  }
  // Create automation rule
  createAutomationRule(id, name, trigger, actions) {
    const rule = {
      id,
      name,
      trigger,
      actions,
      enabled: true,
      priority: 1
    };
    this.automationRules.set(id, rule);
  }
  // Create smart scenes
  createSmartScenes() {
    this.createSmartScene("work_mode", "Work Mode", "Optimized for productivity", [
      "light_main",
      "light_desk",
      "productivity_timer"
    ], /* @__PURE__ */ new Map([
      ["light_main", { value: true, brightness: 0.9 }],
      ["light_desk", { value: true, brightness: 0.8 }],
      ["temp_main", { value: 21 }],
      ["productivity_timer", { value: true, duration: 25 }]
    ]), "\u{1F4BC}");
    this.createSmartScene("meeting_mode", "Meeting Mode", "Optimized for collaboration", [
      "light_main",
      "light_meeting",
      "entertainment_display"
    ], /* @__PURE__ */ new Map([
      ["light_main", { value: true, brightness: 0.7 }],
      ["light_meeting", { value: true, brightness: 0.8 }],
      ["entertainment_display", { value: "presentation_mode" }],
      ["temp_main", { value: 22 }]
    ]), "\u{1F91D}");
    this.createSmartScene("relax_mode", "Relax Mode", "Optimized for comfort", [
      "entertainment_audio",
      "light_main"
    ], /* @__PURE__ */ new Map([
      ["light_main", { value: true, brightness: 0.3, color: "warm" }],
      ["entertainment_audio", { value: "relax_playlist" }],
      ["temp_main", { value: 23 }]
    ]), "\u{1F319}");
    this.createSmartScene("energy_saver", "Energy Saver", "Minimize energy consumption", [
      "light_main",
      "light_desk",
      "entertainment_display"
    ], /* @__PURE__ */ new Map([
      ["light_main", { value: false }],
      ["light_desk", { value: false }],
      ["entertainment_display", { value: false }],
      ["temp_main", { value: 20 }]
    ]), "\u{1F331}");
  }
  // Create smart scene
  createSmartScene(id, name, description, devices, settings, icon) {
    const scene = {
      id,
      name,
      description,
      devices,
      settings,
      icon
    };
    this.smartScenes.set(id, scene);
  }
  // Create control panel
  createControlPanel() {
    this.controlPanel = engine.addEntity();
    Transform2.create(this.controlPanel, {
      position: Vector32.create(8, 3, 14),
      scale: Vector32.create(4, 3, 0.1)
    });
    MeshRenderer3.setBox(this.controlPanel);
    Material3.setPbrMaterial(this.controlPanel, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.controlPanel,
      position: Vector32.create(0, 1.2, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape3.create(title, {
      text: "\u{1F3E0} SMART ROOM CONTROL",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createSceneButtons();
    this.createDeviceStatusDisplay();
    this.createEnergyMonitor();
  }
  // Create scene buttons
  createSceneButtons() {
    let xOffset = -1.2;
    this.smartScenes.forEach((scene, id) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.controlPanel,
        position: Vector32.create(xOffset, 0.5, 0.1),
        scale: Vector32.create(0.5, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.2, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.2, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape3.create(buttonText, {
        text: `${scene.icon} ${scene.name}`,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 1.5,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Activate ${scene.name}` }
        },
        () => this.activateScene(id)
      );
      xOffset += 0.8;
    });
  }
  // Create device status display
  createDeviceStatusDisplay() {
    const statusDisplay = engine.addEntity();
    Transform2.create(statusDisplay, {
      parent: this.controlPanel,
      position: Vector32.create(0, -0.3, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(statusDisplay);
    Material3.setPbrMaterial(statusDisplay, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    this.updateDeviceStatusDisplay();
  }
  // Create energy monitor
  createEnergyMonitor() {
    const energyDisplay = engine.addEntity();
    Transform2.create(energyDisplay, {
      parent: this.controlPanel,
      position: Vector32.create(0, -0.8, 0.1),
      scale: Vector32.create(0.8, 0.2, 0.1)
    });
    MeshRenderer3.setBox(energyDisplay);
    Material3.setPbrMaterial(energyDisplay, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    this.updateEnergyDisplay();
  }
  // Start automation engine
  startAutomationEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateDeviceValues();
      this.checkAutomationRules();
      this.updateDisplays();
    });
  }
  // Update device values
  updateDeviceValues() {
    this.devices.forEach((device) => {
      switch (device.type) {
        case "temperature":
          device.value = 20 + Math.sin(Date.now() / 1e4) * 3;
          break;
        case "energy":
          device.value = Math.random() * 100;
          break;
        case "security":
          device.value = Math.random() > 0.95 ? "alert" : "normal";
          break;
      }
      device.lastUpdate = Date.now();
    });
    this.energyUsage = Array.from(this.devices.values()).filter((d) => d.type === "energy").reduce((sum, d) => sum + d.value, 0);
  }
  // Check automation rules
  checkAutomationRules() {
    this.automationRules.forEach((rule) => {
      if (!rule.enabled)
        return;
      if (this.evaluateTrigger(rule.trigger)) {
        this.executeActions(rule.actions);
      }
    });
  }
  // Evaluate trigger conditions
  evaluateTrigger(trigger) {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    switch (trigger.type) {
      case "time":
        return trigger.conditions.some((condition) => {
          if (condition.property === "hour") {
            switch (condition.operator) {
              case "equals":
                return hour === condition.value;
              case "greater":
                return hour > condition.value;
              case "less":
                return hour < condition.value;
              default:
                return false;
            }
          }
          return false;
        });
      case "device":
        return trigger.conditions.every((condition) => {
          const device = this.devices.get(condition.deviceId);
          if (!device)
            return false;
          switch (condition.operator) {
            case "equals":
              return device.value === condition.value;
            case "greater":
              return device.value > condition.value;
            case "less":
              return device.value < condition.value;
            default:
              return false;
          }
        });
      default:
        return false;
    }
  }
  // Execute automation actions
  executeActions(actions) {
    actions.forEach((action) => {
      switch (action.type) {
        case "setDevice":
          this.setDeviceValue(action.target, action.parameters);
          break;
        case "notify":
          console.log(`\u{1F514} Notification: ${action.parameters.message}`);
          soundSystem.playInteractionSound("alert");
          break;
        case "scene":
          this.activateScene(action.target);
          break;
      }
    });
  }
  // Set device value
  setDeviceValue(deviceId, parameters) {
    const device = this.devices.get(deviceId);
    if (device) {
      device.value = parameters.value || parameters;
      device.lastUpdate = Date.now();
      console.log(`\u{1F527} Set ${device.name} to: ${device.value}`);
    }
  }
  // Handle device interaction
  handleDeviceInteraction(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device)
      return;
    console.log(`\u{1F527} Interacting with ${device.name}`);
    soundSystem.playInteractionSound("click");
    if (typeof device.value === "boolean") {
      device.value = !device.value;
    } else if (device.type === "light") {
      device.value = !device.value;
    }
    this.updateDeviceVisual(deviceId);
  }
  // Update device visual
  updateDeviceVisual(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device)
      return;
    const deviceEntity = Array.from(engine.entities).find((e) => {
      const transform = Transform2.get(e);
      return transform && Vector32.distance(transform.position, device.position) < 0.1;
    });
    if (deviceEntity) {
      const material = Material3.getMutable(deviceEntity);
      if (material && material.$case === "pbr") {
        if (device.value === true) {
          material.pbr.emissiveIntensity = 3;
        } else {
          material.pbr.emissiveIntensity = 1;
        }
      }
    }
  }
  // Activate scene
  activateScene(sceneId) {
    const scene = this.smartScenes.get(sceneId);
    if (!scene)
      return;
    console.log(`\u{1F3AC} Activating scene: ${scene.name}`);
    soundSystem.playInteractionSound("powerup");
    this.currentScene = sceneId;
    scene.settings.forEach((settings, deviceId) => {
      this.setDeviceValue(deviceId, settings);
    });
  }
  // Update displays
  updateDisplays() {
    this.updateDeviceStatusDisplay();
    this.updateEnergyDisplay();
  }
  // Update device status display
  updateDeviceStatusDisplay() {
    const onlineDevices = Array.from(this.devices.values()).filter((d) => d.status === "online").length;
    const totalDevices = this.devices.size;
    console.log(`\u{1F4CA} Device Status: ${onlineDevices}/${totalDevices} online`);
  }
  // Update energy display
  updateEnergyDisplay() {
    console.log(`\u26A1 Energy Usage: ${this.energyUsage.toFixed(1)}%`);
  }
  // Get current scene
  getCurrentScene() {
    return this.currentScene;
  }
  // Get all devices
  getDevices() {
    return Array.from(this.devices.values());
  }
  // Get device by ID
  getDevice(deviceId) {
    return this.devices.get(deviceId);
  }
  // Add new device
  addDevice(device) {
    this.devices.set(device.id, device);
    console.log(`\u{1F4F1} Added device: ${device.name}`);
  }
  // Remove device
  removeDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (device) {
      this.devices.delete(deviceId);
      console.log(`\u{1F5D1}\uFE0F Removed device: ${device.name}`);
    }
  }
  // Get energy usage
  getEnergyUsage() {
    return this.energyUsage;
  }
  // Cleanup system
  cleanup() {
    this.devices.clear();
    this.automationRules.clear();
    this.smartScenes.clear();
    if (this.controlPanel) {
      engine.removeEntity(this.controlPanel);
    }
    this.isInitialized = false;
  }
};
var smartRoomSystem = new SmartRoomSystem();

// src/voice-command-system.ts
var VoiceCommandSystem = class {
  constructor() {
    this.commands = /* @__PURE__ */ new Map();
    this.intents = /* @__PURE__ */ new Map();
    this.commandHistory = [];
    this.isInitialized = false;
    this.isListening = false;
    this.currentTranscript = "";
    this.voiceAssistant = {
      id: "assistant_nexus",
      name: "Nexus",
      personality: "professional",
      voice: "female",
      language: "en-US",
      isActive: true,
      processingState: "idle"
    };
  }
  // Initialize voice command system
  initialize() {
    console.log("\u{1F3A4} Voice Command System Initializing...");
    this.setupIntents();
    this.createVoiceUI();
    this.initializeSpeechRecognition();
    this.initializeAIProcessor();
    this.initializeVoiceSynthesis();
    this.startVoiceEngine();
    this.isInitialized = true;
    console.log("\u{1F3A4} Voice Command System Ready!");
  }
  // Setup voice intents
  setupIntents() {
    this.intents.set("toggle_lights", {
      name: "toggle_lights",
      parameters: /* @__PURE__ */ new Map([
        ["location", "string"],
        ["action", "string"]
      ]),
      action: "control_lighting"
    });
    this.intents.set("adjust_temperature", {
      name: "adjust_temperature",
      parameters: /* @__PURE__ */ new Map([
        ["temperature", "number"],
        ["unit", "string"]
      ]),
      action: "control_climate"
    });
    this.intents.set("start_meeting", {
      name: "start_meeting",
      parameters: /* @__PURE__ */ new Map([
        ["participants", "array"],
        ["topic", "string"]
      ]),
      action: "initiate_meeting"
    });
    this.intents.set("navigate_to", {
      name: "navigate_to",
      parameters: /* @__PURE__ */ new Map([
        ["destination", "string"],
        ["mode", "string"]
      ]),
      action: "navigate"
    });
    this.intents.set("show_dashboard", {
      name: "show_dashboard",
      parameters: /* @__PURE__ */ new Map([
        ["type", "string"],
        ["data", "string"]
      ]),
      action: "display_dashboard"
    });
    this.intents.set("send_message", {
      name: "send_message",
      parameters: /* @__PURE__ */ new Map([
        ["recipient", "string"],
        ["message", "string"]
      ]),
      action: "communicate"
    });
    this.intents.set("schedule_event", {
      name: "schedule_event",
      parameters: /* @__PURE__ */ new Map([
        ["title", "string"],
        ["time", "string"],
        ["duration", "string"]
      ]),
      action: "create_calendar_event"
    });
    this.intents.set("get_status", {
      name: "get_status",
      parameters: /* @__PURE__ */ new Map([
        ["system", "string"],
        ["metric", "string"]
      ]),
      action: "query_status"
    });
    this.intents.set("analyze_data", {
      name: "analyze_data",
      parameters: /* @__PURE__ */ new Map([
        ["dataset", "string"],
        ["analysis_type", "string"]
      ]),
      action: "perform_analysis"
    });
    this.intents.set("lock_system", {
      name: "lock_system",
      parameters: /* @__PURE__ */ new Map([
        ["level", "string"],
        ["duration", "string"]
      ]),
      action: "secure_system"
    });
    this.intents.set("emergency_stop", {
      name: "emergency_stop",
      parameters: /* @__PURE__ */ new Map([
        ["system", "string"],
        ["reason", "string"]
      ]),
      action: "emergency_shutdown"
    });
  }
  // Create voice UI
  createVoiceUI() {
    this.voiceUI = engine.addEntity();
    Transform2.create(this.voiceUI, {
      position: Vector32.create(8, 4, 14),
      scale: Vector32.create(3, 2, 0.1)
    });
    MeshRenderer3.setBox(this.voiceUI);
    Material3.setPbrMaterial(this.voiceUI, {
      albedoColor: Color42.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color42.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = engine.addEntity();
    Transform2.create(title, {
      parent: this.voiceUI,
      position: Vector32.create(0, 0.7, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(title, {
      text: "\u{1F3A4} VOICE ASSISTANT",
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createStatusIndicator();
    this.createTranscriptDisplay();
    this.createVoiceControls();
  }
  // Create status indicator
  createStatusIndicator() {
    const statusIndicator = engine.addEntity();
    Transform2.create(statusIndicator, {
      parent: this.voiceUI,
      position: Vector32.create(0, 0.3, 0.1),
      scale: Vector32.create(0.2, 0.2, 0.1)
    });
    MeshRenderer3.setBox(statusIndicator);
    Material3.setPbrMaterial(statusIndicator, {
      albedoColor: Color42.create(0.2, 0.8, 0.2, 1),
      emissiveColor: Color42.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2
    });
    this.animateStatusIndicator(statusIndicator);
  }
  // Animate status indicator
  animateStatusIndicator(indicator) {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      const time = Date.now() / 1e3;
      const material = Material3.getMutable(indicator);
      if (material && material.$case === "pbr") {
        switch (this.voiceAssistant.processingState) {
          case "idle":
            material.pbr.albedoColor = Color42.create(0.2, 0.8, 0.2, 1);
            material.pbr.emissiveIntensity = 1;
            break;
          case "listening":
            const pulse = Math.sin(time * 3) * 0.5 + 0.5;
            material.pbr.albedoColor = Color42.create(1, 0.8, 0.2, 1);
            material.pbr.emissiveIntensity = 2 + pulse * 2;
            break;
          case "processing":
            material.pbr.albedoColor = Color42.create(0.2, 0.2, 1, 1);
            material.pbr.emissiveIntensity = 3;
            break;
          case "responding":
            material.pbr.albedoColor = Color42.create(0.8, 0.2, 0.8, 1);
            material.pbr.emissiveIntensity = 2;
            break;
        }
      }
    });
  }
  // Create transcript display
  createTranscriptDisplay() {
    const transcriptDisplay = engine.addEntity();
    Transform2.create(transcriptDisplay, {
      parent: this.voiceUI,
      position: Vector32.create(0, -0.1, 0.1),
      scale: Vector32.create(0.8, 0.3, 0.1)
    });
    MeshRenderer3.setBox(transcriptDisplay);
    Material3.setPbrMaterial(transcriptDisplay, {
      albedoColor: Color42.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color42.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const transcriptText = engine.addEntity();
    Transform2.create(transcriptText, {
      parent: transcriptDisplay,
      position: Vector32.create(0, 0, 0.1),
      scale: Vector32.create(0.3, 0.3, 0.3)
    });
    TextShape.create(transcriptText, {
      text: 'Say "Hello Nexus" to start...',
      textColor: Color42.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create voice controls
  createVoiceControls() {
    const controls = [
      { id: "listen", icon: "\u{1F3A4}", name: "Start Listening" },
      { id: "stop", icon: "\u23F9\uFE0F", name: "Stop Listening" },
      { id: "settings", icon: "\u2699\uFE0F", name: "Voice Settings" }
    ];
    let xOffset = -0.8;
    controls.forEach((control) => {
      const button = engine.addEntity();
      Transform2.create(button, {
        parent: this.voiceUI,
        position: Vector32.create(xOffset, -0.6, 0.1),
        scale: Vector32.create(0.3, 0.3, 0.1)
      });
      MeshRenderer3.setBox(button);
      Material3.setPbrMaterial(button, {
        albedoColor: Color42.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color42.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = engine.addEntity();
      Transform2.create(buttonText, {
        parent: button,
        position: Vector32.create(0, 0, 0.1),
        scale: Vector32.create(0.5, 0.5, 0.5)
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color42.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleVoiceControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Initialize speech recognition
  initializeSpeechRecognition() {
    this.recognitionEngine = {
      isListening: false,
      continuous: true,
      interimResults: true,
      lang: "en-US",
      start: () => {
        this.recognitionEngine.isListening = true;
        this.voiceAssistant.processingState = "listening";
        console.log("\u{1F3A4} Speech recognition started");
      },
      stop: () => {
        this.recognitionEngine.isListening = false;
        this.voiceAssistant.processingState = "idle";
        console.log("\u{1F3A4} Speech recognition stopped");
      },
      onresult: null,
      onerror: null,
      onend: null
    };
    this.recognitionEngine.onresult = (event) => this.handleSpeechResult(event);
    this.recognitionEngine.onerror = (event) => this.handleSpeechError(event);
    this.recognitionEngine.onend = () => this.handleSpeechEnd();
  }
  // Initialize AI processor
  initializeAIProcessor() {
    this.aiProcessor = {
      processIntent: (transcript) => this.processIntentWithAI(transcript),
      generateResponse: (intent, entities) => this.generateAIResponse(intent, entities),
      confidence: 0.85
    };
  }
  // Initialize voice synthesis
  initializeVoiceSynthesis() {
    this.voiceSynthesizer = {
      speak: (text) => this.synthesizeSpeech(text),
      cancel: () => this.stopSpeech(),
      voice: this.voiceAssistant.voice,
      rate: 1,
      pitch: 1,
      volume: 1
    };
  }
  // Start voice engine
  startVoiceEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateVoiceUI();
      this.simulateVoiceInput();
    });
  }
  // Handle voice control
  handleVoiceControl(controlId) {
    switch (controlId) {
      case "listen":
        this.startListening();
        break;
      case "stop":
        this.stopListening();
        break;
      case "settings":
        this.openVoiceSettings();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Start listening
  startListening() {
    if (this.recognitionEngine.isListening)
      return;
    this.recognitionEngine.start();
    this.isListening = true;
    this.voiceAssistant.processingState = "listening";
    console.log("\u{1F3A4} Started listening for voice commands...");
    soundSystem.playInteractionSound("powerup");
  }
  // Stop listening
  stopListening() {
    if (!this.recognitionEngine.isListening)
      return;
    this.recognitionEngine.stop();
    this.isListening = false;
    this.voiceAssistant.processingState = "idle";
    console.log("\u{1F3A4} Stopped listening");
    soundSystem.playInteractionSound("click");
  }
  // Handle speech result
  handleSpeechResult(event) {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.toLowerCase().trim();
    this.currentTranscript = transcript;
    if (result.isFinal) {
      this.processVoiceCommand(transcript);
    }
  }
  // Handle speech error
  handleSpeechError(event) {
    console.error("\u{1F3A4} Speech recognition error:", event.error);
    this.voiceAssistant.processingState = "idle";
    this.isListening = false;
  }
  // Handle speech end
  handleSpeechEnd() {
    this.voiceAssistant.processingState = "idle";
    this.isListening = false;
  }
  // Process voice command
  processVoiceCommand(transcript) {
    console.log(`\u{1F3A4} Processing command: "${transcript}"`);
    this.voiceAssistant.processingState = "processing";
    const intentResult = this.aiProcessor.processIntent(transcript);
    if (intentResult.confidence > 0.7) {
      this.executeVoiceCommand(intentResult.intent, intentResult.entities);
    } else {
      this.handleUnknownCommand(transcript);
    }
  }
  // Process intent with AI
  processIntentWithAI(transcript) {
    const intents = [
      { keywords: ["turn on", "switch on", "activate"], intent: "toggle_lights", entities: /* @__PURE__ */ new Map([["action", "on"]]) },
      { keywords: ["turn off", "switch off", "deactivate"], intent: "toggle_lights", entities: /* @__PURE__ */ new Map([["action", "off"]]) },
      { keywords: ["temperature", "set temp", "adjust temp"], intent: "adjust_temperature", entities: /* @__PURE__ */ new Map([["temperature", 22]]) },
      { keywords: ["meeting", "start meeting", "schedule meeting"], intent: "start_meeting", entities: /* @__PURE__ */ new Map() },
      { keywords: ["navigate", "go to", "take me to"], intent: "navigate_to", entities: /* @__PURE__ */ new Map() },
      { keywords: ["dashboard", "show dashboard", "display"], intent: "show_dashboard", entities: /* @__PURE__ */ new Map() },
      { keywords: ["status", "check status", "system status"], intent: "get_status", entities: /* @__PURE__ */ new Map() },
      { keywords: ["lock", "secure", "lock down"], intent: "lock_system", entities: /* @__PURE__ */ new Map() },
      { keywords: ["emergency", "stop", "emergency stop"], intent: "emergency_stop", entities: /* @__PURE__ */ new Map() }
    ];
    for (const intentData of intents) {
      for (const keyword of intentData.keywords) {
        if (transcript.includes(keyword)) {
          return {
            intent: intentData.intent,
            entities: intentData.entities,
            confidence: 0.9
          };
        }
      }
    }
    return {
      intent: "unknown",
      entities: /* @__PURE__ */ new Map(),
      confidence: 0.1
    };
  }
  // Execute voice command
  executeVoiceCommand(intent, entities) {
    console.log(`\u{1F3AF} Executing intent: ${intent}`);
    const command = {
      id: `cmd_${Date.now()}`,
      phrase: this.currentTranscript,
      intent,
      entities,
      confidence: 0.9,
      timestamp: Date.now(),
      isProcessed: false
    };
    this.commands.set(command.id, command);
    this.commandHistory.push(command);
    switch (intent) {
      case "toggle_lights":
        this.executeLightControl(entities);
        break;
      case "adjust_temperature":
        this.executeTemperatureControl(entities);
        break;
      case "start_meeting":
        this.executeMeetingStart(entities);
        break;
      case "navigate_to":
        this.executeNavigation(entities);
        break;
      case "show_dashboard":
        this.executeDashboardDisplay(entities);
        break;
      case "get_status":
        this.executeStatusQuery(entities);
        break;
      case "lock_system":
        this.executeSystemLock(entities);
        break;
      case "emergency_stop":
        this.executeEmergencyStop(entities);
        break;
    }
    command.isProcessed = true;
    this.voiceAssistant.processingState = "responding";
    const response = this.aiProcessor.generateResponse(intent, entities);
    this.speakResponse(response.text);
    setTimeout(() => {
      this.voiceAssistant.processingState = "idle";
    }, 2e3);
  }
  // Execute light control
  executeLightControl(entities) {
    const action = entities.get("action");
    console.log(`\u{1F4A1} ${action === "on" ? "Turning on" : "Turning off"} lights`);
    soundSystem.playInteractionSound("powerup");
  }
  // Execute temperature control
  executeTemperatureControl(entities) {
    const temperature = entities.get("temperature");
    console.log(`\u{1F321}\uFE0F Setting temperature to ${temperature}\xB0C`);
    soundSystem.playInteractionSound("click");
  }
  // Execute meeting start
  executeMeetingStart(entities) {
    console.log("\u{1F91D} Starting meeting session");
    soundSystem.playInteractionSound("powerup");
  }
  // Execute navigation
  executeNavigation(entities) {
    console.log("\u{1F9ED} Navigating to destination");
    soundSystem.playInteractionSound("click");
  }
  // Execute dashboard display
  executeDashboardDisplay(entities) {
    console.log("\u{1F4CA} Displaying dashboard");
    soundSystem.playInteractionSound("powerup");
  }
  // Execute status query
  executeStatusQuery(entities) {
    console.log("\u{1F4C8} Querying system status");
    soundSystem.playInteractionSound("click");
  }
  // Execute system lock
  executeSystemLock(entities) {
    console.log("\u{1F512} Locking system");
    soundSystem.playInteractionSound("alert");
  }
  // Execute emergency stop
  executeEmergencyStop(entities) {
    console.log("\u{1F6A8} EMERGENCY STOP ACTIVATED");
    soundSystem.playInteractionSound("error");
  }
  // Handle unknown command
  handleUnknownCommand(transcript) {
    console.log(`\u2753 Unknown command: "${transcript}"`);
    const response = this.aiProcessor.generateResponse("unknown", /* @__PURE__ */ new Map());
    this.speakResponse(response.text);
    this.voiceAssistant.processingState = "idle";
  }
  // Generate AI response
  generateAIResponse(intent, entities) {
    const responses = {
      toggle_lights: {
        text: "I've adjusted the lighting for you.",
        confidence: 0.9,
        actions: ["light_control"],
        emotion: "helpful"
      },
      adjust_temperature: {
        text: "Temperature settings updated successfully.",
        confidence: 0.9,
        actions: ["climate_control"],
        emotion: "efficient"
      },
      start_meeting: {
        text: "I'm setting up your meeting room now.",
        confidence: 0.9,
        actions: ["meeting_setup"],
        emotion: "professional"
      },
      navigate_to: {
        text: "Taking you to your destination.",
        confidence: 0.9,
        actions: ["navigation"],
        emotion: "helpful"
      },
      show_dashboard: {
        text: "Displaying the dashboard you requested.",
        confidence: 0.9,
        actions: ["dashboard_display"],
        emotion: "informative"
      },
      get_status: {
        text: "All systems are operating normally.",
        confidence: 0.9,
        actions: ["status_report"],
        emotion: "confident"
      },
      lock_system: {
        text: "System security protocols activated.",
        confidence: 0.9,
        actions: ["security_lock"],
        emotion: "serious"
      },
      emergency_stop: {
        text: "Emergency procedures initiated immediately.",
        confidence: 1,
        actions: ["emergency_shutdown"],
        emotion: "urgent"
      },
      unknown: {
        text: "I'm not sure I understand. Could you please rephrase that?",
        confidence: 0.3,
        actions: [],
        emotion: "confused"
      }
    };
    return responses[intent] || responses.unknown;
  }
  // Synthesize speech
  synthesizeSpeech(text) {
    console.log(`\u{1F50A} Speaking: "${text}"`);
    this.voiceAssistant.processingState = "responding";
    setTimeout(() => {
      this.voiceAssistant.processingState = "idle";
    }, 2e3);
  }
  // Stop speech
  stopSpeech() {
    console.log("\u{1F50A} Speech stopped");
    this.voiceAssistant.processingState = "idle";
  }
  // Speak response
  speakResponse(text) {
    this.voiceSynthesizer.speak(text);
  }
  // Update voice UI
  updateVoiceUI() {
  }
  // Simulate voice input
  simulateVoiceInput() {
    if (Math.random() < 5e-3) {
      const sampleCommands = [
        "turn on the lights",
        "set temperature to 22 degrees",
        "show me the dashboard",
        "what's the system status",
        "start a meeting"
      ];
      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      this.processVoiceCommand(randomCommand);
    }
  }
  // Open voice settings
  openVoiceSettings() {
    console.log("\u2699\uFE0F Opening voice settings");
    soundSystem.playInteractionSound("click");
  }
  // Get command history
  getCommandHistory() {
    return [...this.commandHistory];
  }
  // Get voice assistant info
  getVoiceAssistant() {
    return { ...this.voiceAssistant };
  }
  // Set voice assistant personality
  setPersonality(personality) {
    this.voiceAssistant.personality = personality;
    console.log(`\u{1F3A4} Voice personality set to: ${personality}`);
  }
  // Set voice language
  setLanguage(language) {
    this.voiceAssistant.language = language;
    this.recognitionEngine.lang = language;
    console.log(`\u{1F3A4} Voice language set to: ${language}`);
  }
  // Enable/disable voice assistant
  setVoiceAssistantEnabled(enabled) {
    this.voiceAssistant.isActive = enabled;
    if (!enabled) {
      this.stopListening();
    }
    console.log(`\u{1F3A4} Voice assistant ${enabled ? "enabled" : "disabled"}`);
  }
  // Cleanup system
  cleanup() {
    this.stopListening();
    this.commands.clear();
    this.intents.clear();
    this.commandHistory = [];
    if (this.voiceUI) {
      engine.removeEntity(this.voiceUI);
    }
    this.isInitialized = false;
  }
};
var voiceCommandSystem = new VoiceCommandSystem();

// src/weather-system.ts
var WeatherSystem = class {
  // 1 real second = 1 game minute
  constructor() {
    this.celestialBodies = /* @__PURE__ */ new Map();
    this.weatherEffects = [];
    this.isInitialized = false;
    this.timeScale = 60;
    this.currentState = {
      type: "clear",
      intensity: 0.3,
      temperature: 22,
      humidity: 45,
      windSpeed: 5,
      windDirection: Vector32.create(1, 0, 0)
    };
    this.currentTime = {
      hour: 12,
      minute: 0,
      dayProgress: 0.5
    };
  }
  // Initialize weather system
  initialize() {
    console.log("\u{1F324}\uFE0F Weather System Initializing...");
    this.createSkyDome();
    this.createCelestialBodies();
    this.createWeatherEffects();
    this.startWeatherSimulation();
    this.startDayNightCycle();
    this.isInitialized = true;
    console.log("\u{1F324}\uFE0F Weather System Ready!");
  }
  // Create sky dome
  createSkyDome() {
    this.skyDome = engine.addEntity();
    Transform2.create(this.skyDome, {
      position: Vector32.create(8, 50, 8),
      scale: Vector32.create(100, 100, 100)
    });
    MeshRenderer3.setSphere(this.skyDome);
    this.updateSkyColor();
  }
  // Create sun and moon
  createCelestialBodies() {
    const sun = engine.addEntity();
    Transform2.create(sun, {
      position: Vector32.create(8, 30, 8),
      scale: Vector32.create(3, 3, 3)
    });
    MeshRenderer3.setSphere(sun);
    Material3.setPbrMaterial(sun, {
      albedoColor: Color42.create(1, 0.95, 0.8, 1),
      emissiveColor: Color42.create(1, 0.9, 0.6, 1),
      emissiveIntensity: 5
    });
    this.celestialBodies.set("sun", {
      entity: sun,
      type: "sun",
      basePosition: Vector32.create(8, 30, 8),
      orbitRadius: 40,
      orbitSpeed: 0.1,
      currentAngle: 0
    });
    const moon = engine.addEntity();
    Transform2.create(moon, {
      position: Vector32.create(8, 30, 8),
      scale: Vector32.create(2, 2, 2)
    });
    MeshRenderer3.setSphere(moon);
    Material3.setPbrMaterial(moon, {
      albedoColor: Color42.create(0.9, 0.9, 1, 1),
      emissiveColor: Color42.create(0.6, 0.6, 0.8, 0.8),
      emissiveIntensity: 2
    });
    this.celestialBodies.set("moon", {
      entity: moon,
      type: "moon",
      basePosition: Vector32.create(8, 30, 8),
      orbitRadius: 40,
      orbitSpeed: 0.1,
      currentAngle: 180
    });
  }
  // Create weather effects
  createWeatherEffects() {
    this.createRainEffect();
    this.createCloudSystem();
    this.createFogEffect();
    this.createSnowEffect();
  }
  // Create rain effect
  createRainEffect() {
    for (let i = 0; i < 100; i++) {
      const rainDrop = engine.addEntity();
      Transform2.create(rainDrop, {
        position: Vector32.create(
          Math.random() * 16,
          Math.random() * 20 + 10,
          Math.random() * 16
        ),
        scale: Vector32.create(0.02, 0.2, 0.02)
      });
      MeshRenderer3.setBox(rainDrop);
      Material3.setPbrMaterial(rainDrop, {
        albedoColor: Color42.create(0.6, 0.7, 0.9, 0.7),
        emissiveColor: Color42.create(0.4, 0.5, 0.8, 0.5),
        emissiveIntensity: 1
      });
      this.weatherEffects.push({
        entity: rainDrop,
        type: "rain",
        velocity: Vector32.create(0, -8, 0)
      });
    }
  }
  // Create cloud system
  createCloudSystem() {
    for (let i = 0; i < 20; i++) {
      const cloud = engine.addEntity();
      Transform2.create(cloud, {
        position: Vector32.create(
          Math.random() * 16,
          Math.random() * 10 + 15,
          Math.random() * 16
        ),
        scale: Vector32.create(
          Math.random() * 3 + 2,
          Math.random() * 1 + 0.5,
          Math.random() * 3 + 2
        )
      });
      MeshRenderer3.setBox(cloud);
      Material3.setPbrMaterial(cloud, {
        albedoColor: Color42.create(0.9, 0.9, 0.9, 0.8),
        roughness: 0.8,
        metallic: 0.1
      });
      this.weatherEffects.push({
        entity: cloud,
        type: "cloud",
        velocity: Vector32.create(
          (Math.random() - 0.5) * 0.5,
          0,
          (Math.random() - 0.5) * 0.5
        )
      });
    }
  }
  // Create fog effect
  createFogEffect() {
    const fogVolume = engine.addEntity();
    Transform2.create(fogVolume, {
      position: Vector32.create(8, 2, 8),
      scale: Vector32.create(20, 4, 20)
    });
    MeshRenderer3.setBox(fogVolume);
    Material3.setPbrMaterial(fogVolume, {
      albedoColor: Color42.create(0.8, 0.8, 0.85, 0.3),
      emissiveColor: Color42.create(0.7, 0.7, 0.75, 0.2),
      emissiveIntensity: 0.5
    });
    this.weatherEffects.push({
      entity: fogVolume,
      type: "fog",
      velocity: Vector32.create(0, 0, 0)
    });
  }
  // Create snow effect
  createSnowEffect() {
    for (let i = 0; i < 50; i++) {
      const snowFlake = engine.addEntity();
      Transform2.create(snowFlake, {
        position: Vector32.create(
          Math.random() * 16,
          Math.random() * 20 + 10,
          Math.random() * 16
        ),
        scale: Vector32.create(0.1, 0.1, 0.1)
      });
      MeshRenderer3.setSphere(snowFlake);
      Material3.setPbrMaterial(snowFlake, {
        albedoColor: Color42.create(1, 1, 1, 0.9),
        emissiveColor: Color42.create(0.8, 0.8, 1, 0.6),
        emissiveIntensity: 1
      });
      this.weatherEffects.push({
        entity: snowFlake,
        type: "snow",
        velocity: Vector32.create(
          (Math.random() - 0.5) * 0.5,
          -1,
          (Math.random() - 0.5) * 0.5
        )
      });
    }
  }
  // Start weather simulation
  startWeatherSimulation() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateWeatherEffects();
      this.simulateWeatherChanges();
    });
  }
  // Start day/night cycle
  startDayNightCycle() {
    engine.addSystem(() => {
      if (!this.isInitialized)
        return;
      this.updateTimeOfDay();
      this.updateCelestialBodies();
      this.updateSkyColor();
    });
  }
  // Update time of day
  updateTimeOfDay() {
    this.currentTime.minute += 1 / 60;
    if (this.currentTime.minute >= 60) {
      this.currentTime.minute = 0;
      this.currentTime.hour++;
      if (this.currentTime.hour >= 24) {
        this.currentTime.hour = 0;
      }
    }
    this.currentTime.dayProgress = (this.currentTime.hour * 60 + this.currentTime.minute) / 1440;
  }
  // Update celestial bodies positions
  updateCelestialBodies() {
    this.celestialBodies.forEach((body) => {
      const angle = (this.currentTime.dayProgress * 360 - 90) * Math.PI / 180;
      const x = body.basePosition.x + Math.cos(angle) * body.orbitRadius;
      const y = body.basePosition.y + Math.sin(angle) * body.orbitRadius;
      const z = body.basePosition.z;
      const transform = Transform2.getMutable(body.entity);
      transform.position = Vector32.create(x, y, z);
      const isVisible = y > body.basePosition.y;
      transform.scale = isVisible ? Vector32.create(body.type === "sun" ? 3 : 2, body.type === "sun" ? 3 : 2, body.type === "sun" ? 3 : 2) : Vector32.create(0, 0, 0);
    });
  }
  // Update sky color based on time and weather
  updateSkyColor() {
    const material = Material3.getMutable(this.skyDome);
    if (!material || material.$case !== "pbr")
      return;
    let skyColor;
    const hour = this.currentTime.hour;
    if (hour >= 6 && hour < 12) {
      const progress = (hour - 6) / 6;
      skyColor = Color42.lerp(
        Color42.create(0.8, 0.6, 0.4, 1),
        // Dawn
        Color42.create(0.5, 0.7, 1, 1),
        // Day
        progress
      );
    } else if (hour >= 12 && hour < 18) {
      skyColor = Color42.create(0.5, 0.7, 1, 1);
    } else if (hour >= 18 && hour < 21) {
      const progress = (hour - 18) / 3;
      skyColor = Color42.lerp(
        Color42.create(0.5, 0.7, 1, 1),
        // Day
        Color42.create(0.2, 0.3, 0.6, 1),
        // Dusk
        progress
      );
    } else {
      skyColor = Color42.create(0.05, 0.05, 0.2, 1);
    }
    skyColor = this.applyWeatherToSkyColor(skyColor);
    material.pbr.albedoColor = skyColor;
    material.pbr.emissiveColor = Color42.create(
      skyColor.r * 0.3,
      skyColor.g * 0.3,
      skyColor.b * 0.3,
      1
    );
  }
  // Apply weather effects to sky color
  applyWeatherToSkyColor(baseColor) {
    switch (this.currentState.type) {
      case "cloudy":
        return Color42.lerp(baseColor, Color42.create(0.6, 0.6, 0.6, 1), this.currentState.intensity * 0.7);
      case "rainy":
      case "stormy":
        return Color42.lerp(baseColor, Color42.create(0.3, 0.3, 0.4, 1), this.currentState.intensity * 0.8);
      case "foggy":
        return Color42.lerp(baseColor, Color42.create(0.7, 0.7, 0.75, 1), this.currentState.intensity * 0.6);
      default:
        return baseColor;
    }
  }
  // Update weather effects
  updateWeatherEffects() {
    this.weatherEffects.forEach((effect) => {
      const transform = Transform2.getMutable(effect.entity);
      transform.position = Vector32.add(transform.position, Vector32.scale(effect.velocity, 0.016));
      if (effect.type === "rain" || effect.type === "snow") {
        if (transform.position.y < 0) {
          transform.position.y = 30;
          transform.position.x = Math.random() * 16;
          transform.position.z = Math.random() * 16;
        }
      } else if (effect.type === "cloud") {
        if (transform.position.x > 20)
          transform.position.x = -4;
        if (transform.position.x < -4)
          transform.position.x = 20;
        if (transform.position.z > 20)
          transform.position.z = -4;
        if (transform.position.z < -4)
          transform.position.z = 20;
      }
      const shouldBeVisible = this.isEffectVisible(effect.type);
      transform.scale = shouldBeVisible ? Vector32.create(1, 1, 1) : Vector32.create(0, 0, 0);
    });
  }
  // Check if effect should be visible
  isEffectVisible(effectType) {
    switch (effectType) {
      case "rain":
        return this.currentState.type === "rainy" || this.currentState.type === "stormy";
      case "cloud":
        return this.currentState.type === "cloudy" || this.currentState.type === "rainy" || this.currentState.type === "stormy";
      case "fog":
        return this.currentState.type === "foggy";
      case "snow":
        return this.currentState.type === "snowy";
      default:
        return false;
    }
  }
  // Simulate weather changes
  simulateWeatherChanges() {
    if (Math.random() > 0.9995) {
      this.changeWeather();
    }
  }
  // Change weather
  changeWeather(newWeather) {
    if (newWeather) {
      this.currentState = { ...this.currentState, ...newWeather };
    } else {
      const weatherTypes = ["clear", "cloudy", "rainy", "stormy", "foggy"];
      this.currentState.type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      this.currentState.intensity = Math.random() * 0.8 + 0.2;
      this.currentState.temperature = 15 + Math.random() * 20;
      this.currentState.humidity = 30 + Math.random() * 60;
      this.currentState.windSpeed = Math.random() * 15;
    }
    console.log(`\u{1F324}\uFE0F Weather changed to: ${this.currentState.type} (intensity: ${this.currentState.intensity.toFixed(2)})`);
  }
  // Get current weather state
  getCurrentWeather() {
    return { ...this.currentState };
  }
  // Get current time
  getCurrentTime() {
    return { ...this.currentTime };
  }
  // Set time of day
  setTimeOfDay(hour, minute = 0) {
    this.currentTime.hour = Math.max(0, Math.min(23, hour));
    this.currentTime.minute = Math.max(0, Math.min(59, minute));
    this.currentTime.dayProgress = (this.currentTime.hour * 60 + this.currentTime.minute) / 1440;
  }
  // Set time scale
  setTimeScale(scale) {
    this.timeScale = Math.max(0.1, Math.min(1e3, scale));
  }
  // Get weather forecast
  getForecast() {
    const forecast = [];
    const baseWeather = { ...this.currentState };
    for (let i = 1; i <= 24; i++) {
      const hour = (this.currentTime.hour + i) % 24;
      let weatherType;
      if (hour >= 6 && hour < 12) {
        weatherType = Math.random() > 0.7 ? "cloudy" : "clear";
      } else if (hour >= 12 && hour < 18) {
        weatherType = Math.random() > 0.8 ? "rainy" : "clear";
      } else {
        weatherType = Math.random() > 0.6 ? "clear" : "cloudy";
      }
      forecast.push({
        ...baseWeather,
        type: weatherType,
        intensity: Math.random() * 0.8 + 0.2,
        temperature: baseWeather.temperature + (Math.random() - 0.5) * 10
      });
    }
    return forecast;
  }
  // Cleanup system
  cleanup() {
    this.celestialBodies.forEach((body) => {
      engine.removeEntity(body.entity);
    });
    this.celestialBodies.clear();
    this.weatherEffects.forEach((effect) => {
      engine.removeEntity(effect.entity);
    });
    this.weatherEffects = [];
    if (this.skyDome) {
      engine.removeEntity(this.skyDome);
    }
    this.isInitialized = false;
  }
};
var weatherSystem = new WeatherSystem();

// src/enhanced-index.ts
function enhancedMain() {
  console.log(" Initializing AIGestion Enhanced Virtual Office...");
  soundSystem.initialize();
  lightingSystem.initialize();
  uiSystem.initialize();
  weatherSystem.initialize();
  multiplayerSystem.initialize();
  avatarSystem.initialize();
  smartRoomSystem.initialize();
  gestureSystem.initialize();
  whiteboardSystem.initialize();
  voiceCommandSystem.initialize();
  blockchainSystem.initialize();
  arIntegrationSystem.initialize();
  contentManagementSystem.initialize();
  physicsSystem.initialize();
  proceduralSystem.initialize();
  emotionDetectionSystem.initialize();
  crossPlatformSyncSystem.initialize();
  analyticsDashboardSystem.initialize();
  hapticFeedbackSystem.initialize();
  createEnhancedArchitecture();
  createEnhancedInteractables();
  initializeNPCs();
  initializeDataVisualization();
  startRealTimeUpdates();
  createParticleEffects();
  console.log(" Enhanced Virtual Office Initialized Successfully!");
}
var systemUpdateInterval;
var diagnosticsInterval;
var alertsInterval;
function startRealTimeUpdates() {
  if (systemUpdateInterval)
    clearInterval(systemUpdateInterval);
  if (diagnosticsInterval)
    clearInterval(diagnosticsInterval);
  if (alertsInterval)
    clearInterval(alertsInterval);
  systemUpdateInterval = setInterval(async () => {
    try {
      const stats = await fetchEnhancedSystemStats();
      updateSystemStatus("AUTO_UPDATE", true);
      if (stats.systemHealth === "CRITICAL") {
        updateAlert(" CRITICAL: System overload detected!", "CRITICAL");
        soundSystem.playInteractionSound("alert");
      } else if (stats.systemHealth === "WARNING") {
        updateAlert(" WARNING: High system load detected", "WARNING");
        soundSystem.playInteractionSound("alert");
      } else {
        updateAlert(" All systems operating normally", "INFO");
      }
      console.log(" System Stats Updated:", stats);
    } catch (error) {
      console.error(" Error updating system stats:", error);
    }
  }, 3e3);
  diagnosticsInterval = setInterval(async () => {
    try {
      const diagnostics = await runSystemDiagnostics();
      console.log(" System Diagnostics:", diagnostics);
      if (diagnostics.overall === "CRITICAL") {
        updateAlert(" CRITICAL SYSTEM FAILURE DETECTED!", "CRITICAL");
        soundSystem.playInteractionSound("error");
      }
    } catch (error) {
      console.error(" Error running diagnostics:", error);
    }
  }, 1e4);
  alertsInterval = setInterval(async () => {
    try {
      const alerts = await fetchAlertMessages();
      if (alerts.length > 0) {
        const latestAlert = alerts[alerts.length - 1];
        updateAlert(latestAlert.message, latestAlert.type);
      }
    } catch (error) {
      console.error(" Error fetching alerts:", error);
    }
  }, 5e3);
}
function initializeNPCs() {
  npcManager.createNPC(
    "NEXUS",
    "System Administrator",
    Vector32.create(4, 1, 4)
  );
  npcManager.createNPC(
    "DATA",
    "Data Analyst",
    Vector32.create(12, 1, 4)
  );
  npcManager.createNPC(
    "GUARD",
    "Security Expert",
    Vector32.create(8, 1, 12)
  );
  console.log("\u{1F916} AI Assistants Initialized");
}
function initializeDataVisualization() {
  const mainWall = dataVizManager.createWall(
    "main",
    Vector32.create(8, 4, 0.5),
    Vector32.create(16, 8, 0.2)
  );
  mainWall.addChart("systemStatus", {
    type: "bar",
    title: "System Status",
    data: DataVisualizationManager.createSystemStatusData(),
    maxDataPoints: 10,
    updateInterval: 3e3
  });
  mainWall.startDataStream("realtime", DataVisualizationManager.createRealtimeDataSource());
  console.log("\u{1F4CA} Data Visualization Initialized");
}
var particlePool = [];
var maxParticles = 50;
function createParticleEffects() {
  for (let i = 0; i < Math.min(20, maxParticles); i++) {
    const particle = createParticle();
    animateParticle(particle);
    particlePool.push(particle);
  }
  for (let i = 0; i < Math.min(15, maxParticles - 20); i++) {
    const energyParticle = createEnergyParticle();
    animateEnergyParticle(energyParticle);
    particlePool.push(energyParticle);
  }
}
function createParticle() {
  const particle = engine.addEntity();
  Transform2.create(particle, {
    position: Vector32.create(
      Math.random() * 16,
      Math.random() * 4 + 1,
      Math.random() * 16
    ),
    scale: Vector32.create(0.1, 0.1, 0.1)
  });
  MeshRenderer3.setBox(particle);
  Material3.setPbrMaterial(particle, {
    albedoColor: Color42.create(0, 1, 0.8, 0.6),
    roughness: 0,
    metallic: 0.5,
    emissiveColor: Color42.create(0, 1, 0.8, 1),
    emissiveIntensity: 3
  });
  return particle;
}
function createEnergyParticle() {
  const energyParticle = engine.addEntity();
  Transform2.create(energyParticle, {
    position: Vector32.create(
      8 + (Math.random() - 0.5) * 4,
      2 + Math.random() * 2,
      8 + (Math.random() - 0.5) * 4
    ),
    scale: Vector32.create(0.15, 0.15, 0.15)
  });
  MeshRenderer3.setBox(energyParticle);
  Material3.setPbrMaterial(energyParticle, {
    albedoColor: Color42.create(1, 0.8, 0.2, 0.7),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: Color42.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 5
  });
  return energyParticle;
}
function animateParticle(particle) {
  let time = 0;
  const initialPos = Transform2.getMutable(particle).position;
  setInterval(() => {
    time += 0.1;
    const transform = Transform2.getMutable(particle);
    transform.position.x = initialPos.x + Math.sin(time) * 0.5;
    transform.position.y = initialPos.y + Math.cos(time * 0.5) * 0.3;
    transform.position.z = initialPos.z + Math.sin(time * 0.7) * 0.5;
  }, 100);
}
function animateEnergyParticle(particle) {
  let time = 0;
  const initialPos = Transform2.getMutable(particle).position;
  setInterval(() => {
    time += 0.15;
    const transform = Transform2.getMutable(particle);
    transform.position.y = initialPos.y + Math.sin(time) * 0.8;
    transform.scale.x = 0.15 + Math.sin(time * 2) * 0.05;
    transform.scale.z = 0.15 + Math.cos(time * 2) * 0.05;
  }, 100);
}
enhancedMain();

// src/index.ts
function main() {
  const debugCube = engine.addEntity();
  Transform2.create(debugCube, {
    position: Vector32.create(8, 2, 8),
    scale: Vector32.create(2, 2, 2)
  });
  MeshRenderer3.setBox(debugCube);
  Material3.setPbrMaterial(debugCube, { albedoColor: Color42.Red() });
  enhancedMain();
}
main();
/*! Bundled license information:

long/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
