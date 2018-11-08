(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "video {\n    border: 1px solid #ccc;\n    padding: 20px;\n    margin: 10px;\n    border-radius: 20px;\n    transition: all 1s ease-in-out;\n}\n\n#list ul {\n    list-style: none;\n}\n\n#list ul li {\n    font-family: Georgia, serif, Times;\n    font-size: 18px;\n    display: block;\n    width: 300px;\n    height: 28px;\n    background-color: #333;\n    border-left: 5px solid #222;\n    border-right: 5px solid #222;\n    padding-left: 10px;\n    text-decoration: none;\n    color: #bfe1f1;\n}\n\n#list ul li:hover {\n    -moz-transform: rotate(-5deg);\n    -moz-box-shadow: 10px 10px 20px #000000;\n    -webkit-transform: rotate(-5deg);\n    -webkit-box-shadow: 10px 10px 20px #000000;\n    transform: rotate(-5deg);\n    box-shadow: 10px 10px 20px #000000;\n}"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"app\">\n    <span>{{myid}}</span>\n    <video id=\"selfview\" autoplay></video>\n    <video id=\"remoteview\" autoplay></video>\n    <button id=\"endCall\" style=\"display: none;\" (click)=\"endCurrentCall()\">End Call </button>\n    <div id=\"list\">\n        <ul id=\"users\">\n            <li *ngFor=\"let user of users\">{{user}}\n                <input type=\"button\" style=\"float:right;\" value=\"Call\" (click)=\"callUser(user)\" id=\"makeCall\" />\n            </li>\n        </ul>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var pusher_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pusher-js */ "./node_modules/pusher-js/dist/web/pusher.js");
/* harmony import */ var pusher_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pusher_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = /** @class */ (function () {
    function AppComponent(http) {
        this.http = http;
        this.users = new Array(0);
        this.btnHide = true;
        this.usersOnCall = new Array(0);
        this.pusher = new pusher_js__WEBPACK_IMPORTED_MODULE_2___default.a(_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].pusher.key, {
            cluster: _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].pusher.cluster,
            encrypted: true,
            authEndpoint: _environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].pusher.authEndpoint
        });
    }
    AppComponent.prototype.ngOnInit = function () {
        this._setRTC();
        this._getOnCallUsers();
        this._bindEvents();
    };
    AppComponent.prototype._getOnCallUsers = function () {
        var _this = this;
        this.http.get('/api/getUsersOnCall').subscribe(function (users) {
            _this.usersOnCall = users["usersOnCall"];
        });
    };
    AppComponent.prototype._setRTC = function () {
        this._GetRTCPeerConnection();
        this._GetRTCSessionDescription();
        this._GetRTCIceCandidate();
        this._prepareCaller();
    };
    AppComponent.prototype._bindEvents = function () {
        var _this = this;
        this.channel = this.pusher.subscribe('presence-videocall');
        this.channel.bind('pusher:subscription_succeeded', function (members) {
            //set the member count
            _this.usersOnline = members.count;
            _this.id = _this.channel.members.me.id;
            _this.myid = " My caller id is : " + _this.id;
            members.each(function (member) {
                if (member.id != _this.channel.members.me.id) {
                    _this.users.push(member.id);
                }
            });
        });
        this.channel.bind('pusher:member_added', function (member) {
            _this.users.push(member.id);
        });
        this.channel.bind('pusher:member_removed', function (member) {
            // for remove member from list:
            var index = _this.users.indexOf(member.id);
            _this.users.splice(index, 1);
            if (member.id == _this.room) {
                _this._endCall();
            }
        });
        this.channel.bind("client-candidate", function (msg) {
            if (msg.room == _this.room) {
                console.log("candidate received");
                _this.caller.addIceCandidate(new RTCIceCandidate(msg.candidate));
            }
        });
        this.channel.bind("client-sdp", function (msg) {
            if (msg.room == _this.id) {
                console.log("sdp received");
                var answer = confirm("You have a call from: " + msg.from + "Would you like to answer?");
                if (!answer) {
                    return _this.channel.trigger("client-reject", { "room": msg.room, "rejected": _this.id });
                }
                _this.room = msg.room;
                _this._getCam()
                    .then(function (stream) {
                    _this.localUserMedia = stream;
                    _this._toggleEndCallButton();
                    if (window.URL) {
                        document.getElementById("selfview")["src"] = window.URL.createObjectURL(stream);
                    }
                    else {
                        document.getElementById("selfview")["src"] = stream;
                    }
                    _this.caller.addStream(stream);
                    var sessionDesc = new RTCSessionDescription(msg.sdp);
                    _this.caller.setRemoteDescription(sessionDesc);
                    _this.caller.createAnswer().then(function (sdp) {
                        _this.caller.setLocalDescription(new RTCSessionDescription(sdp));
                        _this.channel.trigger("client-answer", {
                            "sdp": sdp,
                            "room": _this.room
                        });
                    });
                })
                    .catch(function (error) {
                    console.log('an error occured', error);
                });
            }
        });
        //Listening for answer to offer sent to remote peer
        this.channel.bind("client-answer", function (answer) {
            if (answer.room == _this.room) {
                console.log("answer received");
                _this.caller.setRemoteDescription(new RTCSessionDescription(answer.sdp));
            }
        });
        this.channel.bind("client-reject", function (answer) {
            if (answer.room == _this.room) {
                console.log("Call declined");
                alert("call to " + answer.rejected + "was politely declined");
                _this._endCall();
            }
        });
        this.channel.bind("client-_endCall", function (answer) {
            if (answer.room == _this.room) {
                console.log("Call Ended");
                _this._endCall();
            }
        });
        this.channel.bind("usersOnCall", function (users) {
            _this.usersOnCall = users.usersOnCall;
        });
    };
    AppComponent.prototype._toggleEndCallButton = function () {
        if (document.getElementById("endCall").style.display == 'block') {
            document.getElementById("endCall").style.display = 'none';
        }
        else {
            document.getElementById("endCall").style.display = 'block';
        }
    };
    AppComponent.prototype._endCall = function () {
        this.room = undefined;
        this.caller.close();
        for (var _i = 0, _a = this.localUserMedia.getTracks(); _i < _a.length; _i++) {
            var track = _a[_i];
            track.stop();
        }
        this._prepareCaller();
        this._toggleEndCallButton();
    };
    AppComponent.prototype.endCurrentCall = function () {
        var _this = this;
        this.channel.trigger("client-endcall", {
            "room": this.room
        });
        this.usersOnCall = this.usersOnCall.filter(function (user) { return user != _this.room && user != _this.id; });
        this.http.post('/api/usersOnCall', { usersOnCall: this.usersOnCall }).subscribe(function (data) { });
        this._endCall();
    };
    //Send the ICE Candidate to the remote peer
    AppComponent.prototype._onIceCandidate = function (peer, evt) {
        if (evt.candidate) {
            this.channel.trigger("client-candidate", {
                "candidate": evt.candidate,
                "room": this.room
            });
        }
    };
    AppComponent.prototype.callUser = function (user) {
        var _this = this;
        if (!this.usersOnCall.includes(user)) {
            this._getCam()
                .then(function (stream) {
                if (window.URL) {
                    document.getElementById("selfview")["src"] = window.URL.createObjectURL(stream);
                }
                else {
                    document.getElementById("selfview")["src"] = stream;
                }
                _this._toggleEndCallButton();
                _this.caller.addStream(stream);
                _this.localUserMedia = stream;
                _this.caller.createOffer().then(function (desc) {
                    _this.caller.setLocalDescription(new RTCSessionDescription(desc));
                    _this.channel.trigger("client-sdp", {
                        "sdp": desc,
                        "room": user,
                        "from": _this.id
                    });
                    _this.room = user;
                    _this.usersOnCall.push(user);
                    _this.usersOnCall.push(_this.id);
                    _this.http.post('/api/usersOnCall', { usersOnCall: _this.usersOnCall }).subscribe(function (data) { });
                });
            })
                .catch(function (error) {
                console.log('an error occured', error);
            });
        }
        else {
            alert(user + 'is on another call');
        }
    };
    ;
    AppComponent.prototype._getCam = function () {
        //Get local audio/video feed and show it in selfview video element 
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
    };
    AppComponent.prototype._prepareCaller = function () {
        var _this = this;
        //Initializing a peer connection
        this.caller = new window.RTCPeerConnection();
        //Listen for ICE Candidates and send them to remote peers
        this.caller.onicecandidate = function (evt) {
            if (!evt.candidate)
                return;
            console.log("onicecandidate called");
            _this._onIceCandidate(_this.caller, evt);
        };
        //onaddstream handler to receive remote feed and show in remoteview video element
        this.caller.onaddstream = function (evt) {
            console.log("onaddstream called");
            if (window.URL) {
                document.getElementById("remoteview")["src"] = window.URL.createObjectURL(evt.stream);
            }
            else {
                document.getElementById("remoteview")["src"] = evt.stream;
            }
        };
    };
    AppComponent.prototype._GetRTCIceCandidate = function () {
        window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate ||
            window.mozRTCIceCandidate || window.msRTCIceCandidate;
        return window.RTCIceCandidate;
    };
    AppComponent.prototype._GetRTCPeerConnection = function () {
        window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection ||
            window.mozRTCPeerConnection || window.msRTCPeerConnection;
        return window.RTCPeerConnection;
    };
    AppComponent.prototype._GetRTCSessionDescription = function () {
        window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription ||
            window.mozRTCSessionDescription || window.msRTCSessionDescription;
        return window.RTCSessionDescription;
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    pusher: {
        key: 'ed4324c3f7a8ff4fa128',
        cluster: 'ap2',
        encrypted: true,
        authEndpoint: 'pusher/auth'
    }
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/dhruv/Documents/webrtc/ang-webRTC/web-RTC-Pusher/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map