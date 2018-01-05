webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".container {\n  height: 100vh;\n  width: 100vw;\n}\n\ncanvas {\n  max-width: 95%;\n  max-height: 70vh;\n}\n\nmat-progress-bar {\n  margin-right: 0.5rem;\n}\n\n@media screen and (max-width: 500px) {\n  .mat-caption {\n    display: none;\n  }\n\n  .my-github {\n    display: none;\n  }\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\"\n     fxLayout=\"column\">\n    <mat-toolbar fxLayout=\"row\"\n                 fxLayoutAlign=\"space-between center\">\n    <p>\n      <span>Image Pixel Dislocator</span>\n      <span class=\"mat-caption\">Rearrange the pixels in your images.</span>\n    </p>\n\n    <a mat-button\n       href=\"https://github.com/russon77/image-dislocator\">\n      <img src=\"assets/img/github-circle-white-transparent.svg\">\n      <span class=\"my-github\">GitHub</span>\n    </a>\n  </mat-toolbar>\n\n  <div class=\"content-container\"\n       fxFlex\n       fxLayout=\"column\"\n       fxLayoutAlign=\"space-between center\">\n    <div fxFlex\n         fxLayout=\"column\"\n         fxLayoutAlign=\"center center\">\n      <section class=\"mat-typography\"\n               *ngIf=\"!baseImage\">\n        <h1>\n          To get started, select an image.\n        </h1>\n        <p>\n          <mat-icon>arrow_downward</mat-icon>\n          <br>\n          <mat-icon>arrow_downward</mat-icon>\n          <br>\n          <mat-icon>arrow_downward</mat-icon>\n        </p>\n      </section>\n      <canvas #myCanvas\n              class=\"content-main-image\"></canvas>\n    </div>\n    <mat-toolbar color=\"primary\"\n                 fxLayout=\"row\"\n                 fxLayoutAlign=\"space-between center\">\n      <div>\n        <input #fileInput\n               type=\"file\"\n               accept=\"image/jpeg,image/png\"\n               style=\"display:none\"\n               (change)=\"onSelectImage($event.target.files[0])\">\n        <button mat-button\n                (click)=\"fileInput.click()\">Select File</button>\n      </div>\n\n      <mat-progress-bar mode=\"indeterminate\"\n                        *ngIf=\"isLoading\"></mat-progress-bar>\n\n      <mat-slide-toggle [(ngModel)]=\"dislocated\"\n                        [disabled]=\"isLoading\"\n                        (change)=\"onDislocateChange($event)\">\n        Dislocate!\n      </mat-slide-toggle>\n    </mat-toolbar>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppComponent = (function () {
    function AppComponent() {
        this.canvas = null;
        this.context = null;
        this.baseImage = null;
        this.changedImage = null;
        this.offscreenCanvas = null;
        this.offscreenContext = null;
        this.isLoading = false;
        this.dislocated = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenContext = this.offscreenCanvas.getContext('2d');
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        this.canvas = this.canvasChild.nativeElement;
        this.context = this.canvas.getContext('2d');
    };
    AppComponent.prototype.draw = function (image) {
        if (!image) {
            return;
        }
        // clear
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.height = image.height;
        this.canvas.width = image.width;
        // clear again
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // and draw
        this.context.putImageData(image, 0, 0);
    };
    AppComponent.prototype.onSelectImage = function (file) {
        var _this = this;
        this.isLoading = true;
        this.changedImage = null;
        this.baseImage = null;
        this.dislocated = false;
        var reader = new FileReader();
        reader.onload = function (e) {
            var image = new Image();
            image.onload = function () {
                _this.isLoading = false;
                _this.offscreenContext.fillRect(0, 0, _this.offscreenCanvas.width, _this.offscreenCanvas.height);
                _this.offscreenCanvas.width = image.width;
                _this.offscreenCanvas.height = image.height;
                _this.offscreenContext.drawImage(image, 0, 0);
                _this.baseImage = _this.offscreenContext.getImageData(0, 0, image.width, image.height);
                _this.draw(_this.baseImage);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };
    AppComponent.prototype.onDislocateChange = function (_a) {
        var _this = this;
        var checked = _a.checked;
        if (this.isLoading) {
            return;
        }
        if (null !== this.changedImage) {
            if (checked) {
                this.draw(this.changedImage);
            }
            else {
                this.draw(this.baseImage);
            }
            return;
        }
        this.isLoading = true;
        setTimeout(function () {
            // thanks threads.js!
            // http://threadsjs.readthedocs.io/en/latest/
            var thrd = thread.spawn(function (imageData, done) {
                // major thanks to https://www.alanzucconi.com/2015/09/30/colour-sorting/
                // for inspiration and code!
                function sorter(a, b) {
                    var hsvA = rgb2step(a[0], a[1], a[2]);
                    var hsvB = rgb2step(b[0], b[1], b[2]);
                    var aIsGreater = -1;
                    var bIsGreater = 1;
                    if (hsvA[0] > hsvB[0]) {
                        return aIsGreater;
                    }
                    else if (hsvA[0] < hsvB[0]) {
                        return bIsGreater;
                    }
                    else {
                        if (hsvA[1] > hsvB[1]) {
                            return aIsGreater;
                        }
                        else if (hsvA[1] < hsvA[1]) {
                            return bIsGreater;
                        }
                        else {
                            if (hsvA[2] > hsvB[2]) {
                                return aIsGreater;
                            }
                            else if (hsvA[2] < hsvB[2]) {
                                return bIsGreater;
                            }
                        }
                    }
                    return 0;
                }
                function rgb2step(r, g, b, repetitions) {
                    if (repetitions === void 0) { repetitions = 8; }
                    var lum = Math.sqrt(.241 * r + .691 * g + .068 * b);
                    var _a = rgb2hsv(r, g, b), h = _a[0], s = _a[1], v = _a[2];
                    var h2 = Math.floor(h * repetitions);
                    var lum2 = Math.floor(lum * repetitions);
                    var v2 = Math.floor(v * repetitions);
                    return [h2, lum2, v2];
                }
                // thanks to http://www.javascripter.net/faq/rgb2hsv.htm
                function rgb2hsv(r, g, b) {
                    var computedH = 0;
                    var computedS = 0;
                    var computedV = 0;
                    r = r / 255;
                    g = g / 255;
                    b = b / 255;
                    var minRGB = Math.min(r, Math.min(g, b));
                    var maxRGB = Math.max(r, Math.max(g, b));
                    // Black-gray-white
                    if (minRGB === maxRGB) {
                        computedV = minRGB;
                        return [0, 0, computedV];
                    }
                    // Colors other than black-gray-white:
                    var d = (r === minRGB) ? g - b : ((b === minRGB) ? r - g : b - r);
                    var h = (r === minRGB) ? 3 : ((b === minRGB) ? 1 : 5);
                    computedH = 60 * (h - d / (maxRGB - minRGB));
                    computedS = (maxRGB - minRGB) / maxRGB;
                    computedV = maxRGB;
                    return [computedH, computedS, computedV];
                }
                console.log('Worker has started its job!');
                var array = new Uint8ClampedArray(imageData.data);
                var colors = [];
                // convert to array of color tuples
                for (var i = 0; i < array.length; i += 4) {
                    var color = [array[i], array[i + 1], array[i + 2], array[i + 3]];
                    colors.push(color);
                }
                colors.sort(sorter);
                // convert back to a Uint8Array
                for (var i = 0; i < colors.length; i++) {
                    array[(i * 4) + 0] = colors[i][0];
                    array[(i * 4) + 1] = colors[i][1];
                    array[(i * 4) + 2] = colors[i][2];
                    array[(i * 4) + 3] = colors[i][3];
                }
                console.log('Worker has finished (inside thread)');
                done(new ImageData(array, imageData.width, imageData.height));
            });
            thrd
                .send(_this.baseImage)
                .on('message', function (response) {
                console.log('Worker has finished (outside thread)');
                _this.changedImage = response;
                _this.draw(_this.changedImage);
                thrd.kill();
            })
                .on('error', function (error) {
                console.error('Worker errored:', error);
                thrd.kill();
            })
                .on('exit', function () {
                console.log('Worker has been terminated.');
                _this.isLoading = false;
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* ViewChild */])('myCanvas'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], AppComponent.prototype, "canvasChild", void 0);
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_flex_layout__ = __webpack_require__("../../../flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_material__ = __webpack_require__("../../../material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["H" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_0__angular_flex_layout__["a" /* FlexLayoutModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormsModule */],
                /* Angular Material */
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["e" /* MatToolbarModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["a" /* MatButtonModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["d" /* MatSlideToggleModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["c" /* MatProgressBarModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MatIconModule */]
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_hammerjs__ = __webpack_require__("../../../../hammerjs/hammer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_hammerjs__);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map