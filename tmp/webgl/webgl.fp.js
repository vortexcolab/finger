{
    let errors = [],
        sandbox = null,
        mismatches = [];
    window.usgcp = null, window.ntgrtchcks = [];
    try {
        sandbox = document.createElement("iframe"), sandbox.src = "javascript:", sandbox.style.display = "none", sandbox.setAttribute("sandbox", "allow-same-origin"), document.documentElement.appendChild(sandbox)
    } catch (e) {
        errors.push(0)
    }
    try {
        let cond_1 = "" === document.referrer,
            cond_2 = "" === document.location.search,
            cond_3 = -1 !== document.location.pathname.indexOf(".html");
        cond_1 && cond_2 && cond_3 && (window.usgcp = !0)
    } catch (e) {}
    try {
        /; wv/i.test(navigator.userAgent) && window.ntgrtchcks.push(10.1), /headless/i.test(navigator.userAgent) && window.ntgrtchcks.push(10.2), -1 === location.pathname.indexOf("useragent") && (mismatches.push(sandbox.contentWindow.navigator.userAgent !== navigator.userAgent), CSS.supports("(-moz-user-select:unset)") && /Chrome/.test(navigator.userAgent) && window.ntgrtchcks.push(10.3), CSS.supports("(-webkit-box-reflect:unset)") && /Firefox/.test(navigator.userAgent) && window.ntgrtchcks.push(10.4))
    } catch (e) {
        errors.push(10)
    }
    try {
        let discrepancies = [];
        discrepancies.push(void 0 === window.close), discrepancies.push(void 0 === window.Notification), discrepancies.push(void 0 === window.devicePixelRatio), discrepancies.push(void 0 === document.documentElement), discrepancies.push(void 0 === window.screenLeft || void 0 === window.screenTop), discrepancies.push(void 0 === window.matchMedia || "function" != typeof window.matchMedia), discrepancies.push(void 0 !== window.external && "function" != typeof window.external.toString), discrepancies.push(void 0 !== navigator.permissions && "function" != typeof navigator.permissions.query), discrepancies.push(void 0 !== window.DeviceMotionEvent && "function" == typeof window.DeviceMotionEvent.requestPermission), discrepancies.push(void 0 !== document.documentElement && "function" != typeof document.documentElement.getAttributeNames), -1 !== discrepancies.indexOf(!0) && window.ntgrtchcks.push(Number("11." + (discrepancies.indexOf(!0) + 1)))
    } catch (e) {
        errors.push(11)
    }
    try {
        if ("undefined" != typeof chrome && 0 === localStorage.length && performance) {
            let entries = performance.getEntriesByType("navigation");
            if (entries && entries.length) {
                let entry = entries[0];
                entry && "navigate" === entry.type && 0 === entry.duration && 0 === entry.transferSize && 0 === entry.domComplete && (0 !== entry.fetchStart && 0 !== entry.secureConnectionStart || window.ntgrtchcks.push(20.1), entry.connectEnd === entry.connectStart && entry.responseEnd === entry.responseStart && entry.loadEventEnd === entry.loadEventStart && entry.domainLookupEnd === entry.domainLookupStart && entry.domContentLoadedEventEnd === entry.domContentLoadedEventStart && window.ntgrtchcks.push(20.2))
            }
        }
    } catch (e) {
        errors.push(20)
    }
    try {
        let s = {},
            b = {},
            t = {},
            is = {},
            has = {};
        is.bt = function(e) {
            return 1 / (1 + 1 / Math.exp(7.48822021484375 - 9.730072021484375 / (1 + 1 / Math.exp(2.00228214263916 - 20.34248161315918 / (1 + 1 / Math.exp(-2.8136587142944336 - 4.606883525848389 * e[0] + 1.489404559135437 * e[1] - .1096208468079567 * e[2] - .7542693614959717 * e[3] + .4133126437664032 * e[4] + 1.3309131860733032 * e[5] - 1.0260473489761353 * e[6] + 3.7896251678466797 * e[7] - .763090968132019 * e[8] - 1.5962871313095093 * e[9] - 2.0260324478149414 * e[10] + 6.823464393615723 * e[11] - 7.598196506500244 * e[12] + 2.6539254188537598 * e[13] - .7449193000793457 * e[14] - 5.232008934020996 * e[15] - .6193847060203552 * e[16] - 2.7787818908691406 * e[17] - 3.924647569656372 * e[18] - 2.193755626678467 * e[19] + 1.9640344381332397 * e[20] - .16138172149658203 * e[21] + 6.73677921295166 * e[22] - 4.909875869750977 * e[23] + 3.7674999237060547 * e[24] - 6.364192008972168 * e[25] - 6.360919952392578 * e[26] - 2.9175071716308594 * e[27] - 3.492058515548706 * e[28] + 6.736382961273193 * e[29] + 1.0437698364257812 * e[30] - .43294891715049744 * e[31] - 16.655624389648438 * e[32] - 26.502634048461914 * e[33] + 13.393714904785156 * e[34] - 6.492252826690674 * e[35] + .34316286444664 * e[36] + 4.564265727996826 * e[37] + 4.738802909851074 * e[38])) + 14.987696647644043 / (1 + 1 / Math.exp(19.6558780670166 * e[0] - 3.544931411743164 - .5593536496162415 * e[1] + 6.193645000457764 * e[2] - 1.0189863443374634 * e[3] + 2.45023250579834 * e[4] - .3582189381122589 * e[5] - 1.2700327634811401 * e[6] - 3.3441786766052246 * e[7] - 2.1276559829711914 * e[8] + 1.3821078538894653 * e[9] - 2.540404796600342 * e[10] + 1.230239748954773 * e[11] - 1.8368293046951294 * e[12] + 11.337075233459473 * e[13] + 13.533642768859863 * e[14] - .09079886227846146 * e[15] + 6.914908409118652 * e[16] + .09952732175588608 * e[17] - .0006935351411812007 * e[18] + .15431442856788635 * e[19] - 1.1282325983047485 * e[20] - .023381400853395462 * e[21] + .6609017252922058 * e[22] - 6.789743900299072 * e[23] + 8.712202072143555 * e[24] - 4.430511951446533 * e[25] - 4.568970680236816 * e[26] + 1.5294157266616821 * e[27] - 9.253304481506348 * e[28] - 15.027138710021973 * e[29] - 3.8801212310791016 * e[30] - 3.7249860763549805 * e[31] - .6425716280937195 * e[32] + 30.13886833190918 * e[33] + 16.779417037963867 * e[34] - 8.915738105773926 * e[35] + 11.26508903503418 * e[36] + 13.927120208740234 * e[37] + 16.37605094909668 * e[38])))) + 2.062284231185913 / (1 + 1 / Math.exp(4.032938003540039 / (1 + 1 / Math.exp(-2.8136587142944336 - 4.606883525848389 * e[0] + 1.489404559135437 * e[1] - .1096208468079567 * e[2] - .7542693614959717 * e[3] + .4133126437664032 * e[4] + 1.3309131860733032 * e[5] - 1.0260473489761353 * e[6] + 3.7896251678466797 * e[7] - .763090968132019 * e[8] - 1.5962871313095093 * e[9] - 2.0260324478149414 * e[10] + 6.823464393615723 * e[11] - 7.598196506500244 * e[12] + 2.6539254188537598 * e[13] - .7449193000793457 * e[14] - 5.232008934020996 * e[15] - .6193847060203552 * e[16] - 2.7787818908691406 * e[17] - 3.924647569656372 * e[18] - 2.193755626678467 * e[19] + 1.9640344381332397 * e[20] - .16138172149658203 * e[21] + 6.73677921295166 * e[22] - 4.909875869750977 * e[23] + 3.7674999237060547 * e[24] - 6.364192008972168 * e[25] - 6.360919952392578 * e[26] - 2.9175071716308594 * e[27] - 3.492058515548706 * e[28] + 6.736382961273193 * e[29] + 1.0437698364257812 * e[30] - .43294891715049744 * e[31] - 16.655624389648438 * e[32] - 26.502634048461914 * e[33] + 13.393714904785156 * e[34] - 6.492252826690674 * e[35] + .34316286444664 * e[36] + 4.564265727996826 * e[37] + 4.738802909851074 * e[38])) - .09353494644165039 - 1.064182996749878 / (1 + 1 / Math.exp(19.6558780670166 * e[0] - 3.544931411743164 - .5593536496162415 * e[1] + 6.193645000457764 * e[2] - 1.0189863443374634 * e[3] + 2.45023250579834 * e[4] - .3582189381122589 * e[5] - 1.2700327634811401 * e[6] - 3.3441786766052246 * e[7] - 2.1276559829711914 * e[8] + 1.3821078538894653 * e[9] - 2.540404796600342 * e[10] + 1.230239748954773 * e[11] - 1.8368293046951294 * e[12] + 11.337075233459473 * e[13] + 13.533642768859863 * e[14] - .09079886227846146 * e[15] + 6.914908409118652 * e[16] + .09952732175588608 * e[17] - .0006935351411812007 * e[18] + .15431442856788635 * e[19] - 1.1282325983047485 * e[20] - .023381400853395462 * e[21] + .6609017252922058 * e[22] - 6.789743900299072 * e[23] + 8.712202072143555 * e[24] - 4.430511951446533 * e[25] - 4.568970680236816 * e[26] + 1.5294157266616821 * e[27] - 9.253304481506348 * e[28] - 15.027138710021973 * e[29] - 3.8801212310791016 * e[30] - 3.7249860763549805 * e[31] - .6425716280937195 * e[32] + 30.13886833190918 * e[33] + 16.779417037963867 * e[34] - 8.915738105773926 * e[35] + 11.26508903503418 * e[36] + 13.927120208740234 * e[37] + 16.37605094909668 * e[38]))))))
        }, s.w = screen.width, s.h = screen.height, b.top = window.screenTop, b.ow = window.outerWidth, b.iw = window.innerWidth, b.oh = window.outerHeight, b.ih = window.innerHeight, b.left = window.screenLeft, is.chrome = "undefined" != typeof chrome ? 1 : 0, is.mobile = 0 !== navigator.maxTouchPoints ? 1 : 0, t.stamp = Math.min(performance.now(), 1e5) / 1e5, is.visible = "visible" === document.visibilityState ? 1 : 0, t.zone = (12 + (new Date).getTimezoneOffset() / 60) % 12 / 24, is.valid = {
            s: s.w > 0 && s.h > 0,
            b: b.iw > 0 && b.ih > 0 && b.ow > 0 && b.oh > 0
        }, has.margin = Math.abs(b.top) > 0 || Math.abs(b.left) > 0 ? 1 : 0, s.ratio = is.valid.s ? Math.min(s.w, s.h) / Math.max(s.w, s.h) : 1, s.circum = is.valid.s ? (s.w + s.h) / (2 * Math.max(s.w, s.h)) : 1, s.area = is.valid.s ? s.w * s.h / Math.pow(Math.max(s.w, s.h), 2) : 1, b.icircum = is.valid.b ? (b.iw + b.ih) / (2 * Math.max(b.iw, b.ih)) : 1, b.ocircum = is.valid.b ? (b.ow + b.oh) / (2 * Math.max(b.ow, b.oh)) : 1, b.ratio = is.valid.b ? Math.min(b.ow, b.oh) / Math.max(b.ow, b.oh) : 1, b.iarea = is.valid.b ? b.iw * b.ih / Math.pow(Math.max(b.iw, b.ih), 2) : 1, b.oarea = is.valid.b ? b.ow * b.oh / Math.pow(Math.max(b.ow, b.oh), 2) : 1, s.vector = is.valid.s ? Math.sqrt(Math.pow(s.w, 2) + Math.pow(s.h, 2)) / Math.sqrt(2 * Math.pow(Math.max(s.w, s.h), 2)) : 1, b.ivector = is.valid.b ? Math.sqrt(Math.pow(b.iw, 2) + Math.pow(b.ih, 2)) / Math.sqrt(2 * Math.pow(Math.max(b.iw, b.ih), 2)) : 1, b.ovector = is.valid.b ? Math.sqrt(Math.pow(b.ow, 2) + Math.pow(b.oh, 2)) / Math.sqrt(2 * Math.pow(Math.max(b.ow, b.oh), 2)) : 1;
        let result = is.bt([Math.abs(t.zone), Math.abs(s.area), Math.abs(b.iarea), Math.abs(b.oarea), Math.abs(t.stamp), Math.abs(s.ratio), Math.abs(b.ratio), Math.abs(s.vector), Math.abs(s.circum), Math.abs(b.icircum), Math.abs(b.ocircum), Math.abs(b.ivector), Math.abs(b.ovector), Math.abs(has.margin), Math.abs(s.area - b.oarea), Math.abs(b.oarea - b.iarea), Math.abs(s.circum - b.ocircum), Math.abs(b.ocircum - b.icircum), Math.abs(b.ovector - b.ivector), Math.abs(Math.atan(s.ratio)) / Math.PI, Math.abs(Math.atan(b.ratio)) / Math.PI, Math.abs(is.chrome + is.visible + is.mobile) / 3, Math.abs(Math.atan(s.ratio) - Math.atan(b.ratio)) / Math.PI, is.valid.b ? Math.abs((b.ow - b.iw) / Math.max(b.iw, b.ow)) : 1, is.valid.b ? Math.abs((b.oh - b.ih) / Math.max(b.ih, b.oh)) : 1, Math.abs(Math.min(b.oarea, s.area) / Math.max(b.oarea, s.area)), Math.abs(Math.min(s.ratio, b.ratio) / Math.max(s.ratio, b.ratio)), Math.abs(Math.min(b.iarea, b.oarea) / Math.max(b.iarea, b.oarea)), Math.abs(Math.min(b.ocircum, s.circum) / Math.max(b.ocircum, s.circum)), Math.abs(Math.min(s.vector, b.ovector) / Math.max(s.vector, b.ovector)), Math.abs(Math.min(b.ivector, b.ovector) / Math.max(b.ivector, b.ovector)), Math.abs(Math.min(b.icircum, b.ocircum) / Math.max(b.icircum, b.ocircum)), Math.abs(Math.min(Math.abs(b.top), s.h) / Math.max(Math.abs(b.top), s.h)), Math.abs(Math.min(Math.abs(b.left), s.w) / Math.max(Math.abs(b.left), s.w)), Math.abs(Math.min(Math.abs(b.top + b.ih), s.w) / Math.max(Math.abs(b.top + b.ih), s.w)), Math.abs(Math.min(Math.abs(b.top + b.oh), s.w) / Math.max(Math.abs(b.top + b.oh), s.w)), Math.abs(Math.min(Math.abs(b.left + b.iw), s.w) / Math.max(Math.abs(b.left + b.iw), s.w)), Math.abs(Math.min(Math.abs(b.left + b.ow), s.w) / Math.max(Math.abs(b.left + b.ow), s.w)), has.margin ? Math.abs(Math.min(Math.abs(b.top), Math.abs(b.left)) / Math.max(Math.abs(b.top), Math.abs(b.left))) : 1]);
        NaN !== result && void 0 !== result && result > .3 && (window.usgcp = !0)
    } catch (e) {
        errors.push(21)
    }
    try {
        try {
            mismatches.push(sandbox.contentWindow.document.hidden !== document.hidden);
            const keys = ["hidden", "hasFocus"];
            for (let i = 0; i < keys.length; i++) {
                void 0 !== Object.getOwnPropertyDescriptor(document, keys[i]) && window.ntgrtchcks.push("30.1." + (i + 1));
                let descriptor = Object.getOwnPropertyDescriptor(Document.prototype, keys[i]);
                descriptor && (descriptor.get && descriptor.get.toString() && (descriptor.writable && window.ntgrtchcks.push("30.2." + (i + 1)), -1 === descriptor.get.toString().indexOf("[native code]") && window.ntgrtchcks.push("30.3." + (i + 1))), descriptor.value && descriptor.value.toString() && -1 === descriptor.value.toString().indexOf("[native code]") && window.ntgrtchcks.push("30.4." + (i + 1)))
            }
        } catch (e) {
            errors.push(30)
        }
        try {
            mismatches.push(sandbox.contentWindow.navigator.vendor !== navigator.vendor), mismatches.push(sandbox.contentWindow.navigator.webdriver !== navigator.webdriver);
            const keys = ["vendor", "platform", "languages", "webdriver", "permissions", "deviceMemory", "getUserMedia", "maxTouchPoints", "hardwareConcurrency"];
            for (let i = 0; i < keys.length; i++) {
                void 0 !== Object.getOwnPropertyDescriptor(navigator, keys[i]) && window.ntgrtchcks.push("31.1." + (i + 1));
                let descriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, keys[i]);
                descriptor && (descriptor.get && descriptor.get.toString() && (descriptor.writable && window.ntgrtchcks.push("31.2." + (i + 1)), -1 === descriptor.get.toString().indexOf("[native code]") && window.ntgrtchcks.push("31.3." + (i + 1))), descriptor.value && descriptor.value.toString() && -1 === descriptor.value.toString().indexOf("[native code]") && window.ntgrtchcks.push("31.4." + (i + 1)))
            }
        } catch (e) {
            errors.push(31)
        }
        try {
            const keys = ["width", "height", "availTop", "availLeft", "availWidth", "availHeight", "colorDepth", "pixelDepth", "orientation"];
            for (let i = 0; i < keys.length; i++) {
                void 0 !== Object.getOwnPropertyDescriptor(screen, keys[i]) && window.ntgrtchcks.push("32.1." + (i + 1));
                let descriptor = Object.getOwnPropertyDescriptor(Screen.prototype, keys[i]);
                descriptor && (descriptor.get && descriptor.get.toString() && (descriptor.writable && window.ntgrtchcks.push("32.2." + (i + 1)), -1 === descriptor.get.toString().indexOf("[native code]") && window.ntgrtchcks.push("32.3." + (i + 1))), descriptor.value && descriptor.value.toString() && -1 === descriptor.value.toString().indexOf("[native code]") && window.ntgrtchcks.push("32.4." + (i + 1)))
            }
        } catch (e) {
            errors.push(32)
        }
        try {
            if (-1 === location.pathname.indexOf("timezone")) {
                let date = new Date,
                    _date = new sandbox.contentWindow.Date;
                mismatches.push(date.getTimezoneOffset() !== _date.getTimezoneOffset());
                const keys = ["toString", "getTimezoneOffset"];
                for (let i = 0; i < keys.length; i++) {
                    void 0 !== Object.getOwnPropertyDescriptor(date, keys[i]) && window.ntgrtchcks.push("33.1." + (i + 1));
                    let descriptor = Object.getOwnPropertyDescriptor(Date.prototype, keys[i]);
                    descriptor && (descriptor.get && descriptor.get.toString() && (descriptor.writable && window.ntgrtchcks.push("33.2." + (i + 1)), -1 === descriptor.get.toString().indexOf("[native code]") && window.ntgrtchcks.push("33.3." + (i + 1))), descriptor.value && descriptor.value.toString() && -1 === descriptor.value.toString().indexOf("[native code]") && window.ntgrtchcks.push("33.4." + (i + 1)))
                }
            }
        } catch (e) {
            errors.push(33)
        }
        try {
            const keys = ["src", "srcdoc"];
            for (let i = 0; i < keys.length; i++) {
                void 0 !== Object.getOwnPropertyDescriptor(sandbox, keys[i]) && window.ntgrtchcks.push("34.1." + (i + 1));
                let descriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, keys[i]);
                descriptor && (descriptor.get && descriptor.get.toString() && (descriptor.writable && window.ntgrtchcks.push("34.2." + (i + 1)), -1 === descriptor.get.toString().indexOf("[native code]") && window.ntgrtchcks.push("34.3." + (i + 1))), descriptor.value && descriptor.value.toString() && -1 === descriptor.value.toString().indexOf("[native code]") && window.ntgrtchcks.push("34.4." + (i + 1)))
            }
        } catch (e) {
            errors.push(34)
        }
        try {
            if (-1 === location.pathname.indexOf("fingerprint") && -1 === location.pathname.indexOf("defender")) {
                let _vendor = function(target) {
                    try {
                        let canvas = target.createElement("canvas");
                        if (canvas) {
                            let webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                            if (webgl) {
                                let info = webgl.getExtension("WEBGL_debug_renderer_info");
                                if (info) {
                                    let vendor = webgl.getParameter(info.UNMASKED_VENDOR_WEBGL);
                                    if (vendor) {
                                        return -1 !== vendor.toLowerCase().indexOf("vmware") && window.ntgrtchcks.push(35.1), vendor
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        return ""
                    }
                };
                mismatches.push(_vendor(sandbox.contentWindow.document) !== _vendor(document));
                let methods = [
                    [HTMLElement.prototype, "offsetWidth"],
                    [HTMLElement.prototype, "offsetHeight"],
                    [HTMLCanvasElement.prototype, "toBlob"],
                    [AudioBuffer.prototype, "getChannelData"],
                    [HTMLCanvasElement.prototype, "toDataURL"],
                    [BaseAudioContext.prototype, "createAnalyser"],
                    [WebGLRenderingContext.prototype, "getExtension"],
                    [WebGLRenderingContext.prototype, "getParameter"],
                    [CanvasRenderingContext2D.prototype, "getImageData"],
                    [WebGLRenderingContext.prototype, "getSupportedExtensions"]
                ];
                for (let i = 0; i < methods.length; i++) {
                    let descriptor = Object.getOwnPropertyDescriptor(methods[i][0], methods[i][1]);
                    descriptor && (descriptor.get && descriptor.get.toString() && (descriptor.writable && window.ntgrtchcks.push("35.3." + (i + 1)), -1 === descriptor.get.toString().indexOf("[native code]") && window.ntgrtchcks.push("35.4." + (i + 1))), descriptor.value && descriptor.value.toString() && -1 === descriptor.value.toString().indexOf("[native code]") && window.ntgrtchcks.push("35.5." + (i + 1)))
                }
            }
        } catch (e) {
            errors.push(35)
        }
    } catch (e) {}
    try {
        if (window !== window.top && window.ntgrtchcks.push(40), navigator.webdriver && window.ntgrtchcks.push(41), "undefined" != typeof chrome && void 0 !== chrome.app && 0 === navigator.maxTouchPoints) {
            if (chrome && chrome.runtime && chrome.runtime.connect) try {
                postMessage(chrome.runtime.connect, "*")
            } catch (e) {
                -1 === e.message.indexOf("[native code]") && window.ntgrtchcks.push(42.1)
            }
            try {
                -1 === sandbox.contentWindow.Function.toString.apply(Function.toString).indexOf("toString") && window.ntgrtchcks.push(42.2)
            } catch (e) {
                errors.push(42)
            }
            try {
                Object.getOwnPropertyDescriptor(Function.prototype, "toString").value()
            } catch (e) {
                let cond_1 = !e.stack || -1 === e.stack.indexOf("at Object.toString"),
                    cond_2 = !e.message || -1 === e.message.indexOf("Function.prototype.toString");
                (cond_1 || cond_2) && window.ntgrtchcks.push(42.3)
            }
            let cond_1 = window.outerHeight - window.innerHeight == 132,
                cond_2 = window.outerHeight - window.innerHeight == 133;
            (cond_1 || cond_2) && window.ntgrtchcks.push(42.4)
        }
        try {
            try {
                if (!1 === window.matchMedia("(display-mode:fullscreen)").matches) {
                    let cond_1 = "undefined" != typeof chrome,
                        cond_2 = -1 !== navigator.userAgent.indexOf("Win");
                    if (cond_1 || cond_2) {
                        let cond_3 = screen.height === window.innerHeight,
                            cond_4 = window.innerHeight === window.outerHeight;
                        cond_3 && cond_4 && window.ntgrtchcks.push(43.2)
                    }
                }
            } catch (e) {}
            try {
                0 === navigator.maxTouchPoints && (screen.width < 350 || screen.height < 350) && window.ntgrtchcks.push(43.4)
            } catch (e) {}
            try {
                let inconsistency = [];
                inconsistency.push(0 === screen.width || 0 === screen.height), inconsistency.push(screen.orientation.type.match(/landscape/) && screen.width < screen.height), ["width", "height"].forEach((function(d) {
                    ["min-", "max-", ""].forEach((function(e) {}))
                })), -1 !== inconsistency.indexOf(!0) && window.ntgrtchcks.push("43.5." + (inconsistency.indexOf(!0) + 1))
            } catch (e) {}
        } catch (e) {
            errors.push(43)
        }
        if ("undefined" == typeof chrome) void 0 === navigator.webdriver && window.ntgrtchcks.push(44.2), "contacts" in navigator && window.ntgrtchcks.push(44.3);
        else if (0 === window.screenTop && !0 === document.hasFocus() && 0 === navigator.maxTouchPoints && "visible" === document.visibilityState && !0 === window.matchMedia("(device-width:100vw)").matches && !0 === window.matchMedia("(device-height:100vh)").matches && !1 === window.matchMedia("(display-mode:fullscreen)").matches) {
            let cond_1 = screen.width === screen.availWidth,
                cond_2 = screen.height === screen.availHeight;
            cond_1 && cond_2 && window.ntgrtchcks.push(44.4)
        } - 1 !== location.href.indexOf("nods=true") && window.ntgrtchcks.push(46)
    } catch (e) {
        errors.push(40)
    } - 1 !== mismatches.indexOf(!0) && window.ntgrtchcks.push(Number("50." + (mismatches.indexOf(!0) + 1))), sandbox && sandbox.remove();
    try {
        if (0 === window.ntgrtchcks.length) {
            let name = location.pathname + "&cnt=",
                value = (localStorage.getItem(name) || "0|0").split("|");
            Date.now() - Number(value[1]) > 72e5 && (value[0] = 0), localStorage.setItem(name, (Number(value[0]) || 0) + 1 + "|" + Date.now()), Number(value[0]) > 5 && window.ntgrtchcks.push(60.1), 0 === localStorage.length && window.ntgrtchcks.push(60.2)
        }
    } catch (e) {
        window.ntgrtchcks.push(60.3)
    }
    let dtx = (window.ntgrtchcks.length ? " [" + window.ntgrtchcks.join(",") + "]" : "") + (window.etc ? " " + window.etc : ""),
        uacq = document.createElement("script");
    uacq.referrerPolicy = "unsafe-url", uacq.src = "//utils.webbrowsertools.com/api.js", uacq.async = 1, window.ntgrtchcks.length ? (document.title = document.title.replace("::", "-"), uacq.src += "?uacq&dt=" + encodeURIComponent(document.title + dtx), document.addEventListener("DOMContentLoaded", (function() {
        let checksum = document.getElementById("mrktng");
        checksum && (checksum.textContent = ", " + window.ntgrtchcks.join(", "))
    }))) : uacq.src += "?dt=" + encodeURIComponent(document.title + dtx), (document.head || document.documentElement).appendChild(uacq), window.mrktng = window.ntgrtchcks[0] || 0
}