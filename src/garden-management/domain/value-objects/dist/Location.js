"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Location = void 0;
var ValueObject_ts_1 = require("../../../plant-management/domain/value-objects/ValueObject.ts");
/**
 * Represents the location of a garden element
 */
var Location = /** @class */ (function (_super) {
    __extends(Location, _super);
    function Location() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Location.prototype.validate = function (value) {
        if (value.x < 0) {
            throw new Error("X coordinate cannot be negative");
        }
        if (value.y < 0) {
            throw new Error("Y coordinate cannot be negative");
        }
        if (value.description && value.description.length > 255) {
            throw new Error("Description cannot exceed 255 characters");
        }
    };
    Location.prototype.equalsCore = function (other) {
        return (this.value.x === other.value.x &&
            this.value.y === other.value.y &&
            this.value.zone === other.value.zone);
    };
    Object.defineProperty(Location.prototype, "x", {
        /**
         * Get the X coordinate
         */
        get: function () {
            return this.value.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "y", {
        /**
         * Get the Y coordinate
         */
        get: function () {
            return this.value.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "zone", {
        /**
         * Get the zone (if defined)
         */
        get: function () {
            return this.value.zone;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Location.prototype, "description", {
        /**
         * Get the description (if defined)
         */
        get: function () {
            return this.value.description;
        },
        enumerable: false,
        configurable: true
    });
    Location.prototype.toString = function () {
        var result = "(" + this.value.x + ", " + this.value.y + ")";
        if (this.value.zone) {
            result += " in " + this.value.zone;
        }
        return result;
    };
    /**
     * Calculate the distance to another location
     */
    Location.prototype.distanceTo = function (other) {
        var dx = this.value.x - other.value.x;
        var dy = this.value.y - other.value.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    /**
     * Create a new Location value object
     */
    Location.create = function (props) {
        return new Location(props);
    };
    return Location;
}(ValueObject_ts_1.ValueObject));
exports.Location = Location;
