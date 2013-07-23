(function(win, doc) {

    var getAudio = function() {
        var audio;
        return function() {
            if (!audio) {
                audio = new Audio();
                audio.autoplay = false;
            }
            return audio;
        };
    }();

    function mix(target) {
        var args = [].slice.call(arguments, 1);
        for (var i = 0, len = args.length, key, tmp; i < len; i++) {
            tmp = args[i];
            if (Object(tmp) === tmp) {
                for (key in tmp) {
                    if (tmp.hasOwnProperty(key)) {
                        target[key] = tmp[key];
                    }
                }
            }
        }
        return target;
    }

    function parseD(num) {
        num = '' + (num || 0);
        return num.length === 1 ? ('0' + num) : num;
    }

    function parseTime(duration) {
        duration = duration - 0;
        var mit = Math.floor(duration/60);
        var sec = Math.ceil(duration - mit * 60);
        if (sec >= 60) {
            mit += 1;
            sec -= 60;
        }
        return parseD(mit) + ':' + parseD(sec);
    }

    var playingInterval, that,
        HANDLERS = {},
        EVENT_NAMES = ['play', 'playing', 'pause', 'error', 'ended', 
                       'canplay', 'loadstart', 'progress'];
    HANDLERS.playHandler = function (e) {
        if (!that.canplay) {
            return false;
        }
    };
    HANDLERS.playingHandler = function (e) {
        if (!that.canplay) {
            return false;
        }
        var time = that.getParsedCurrentTime();
        that.playing = true;
        if (that.options.onplay) {
            that.options.onplay.call(that, e, that.audio);
        }
        if (that.options.onplaying) {
            if (playingInterval) clearInterval(playingInterval);
            playingInterval = setInterval(function() {
                time = that.getParsedCurrentTime();
                that.options.onplaying.call(that, time, that.audio);
            }, 1000);
            that.options.onplaying.call(that, time, that.audio);
        }
    };
    HANDLERS.pauseHandler = function (e) {
        that.playing = false;
        if (playingInterval) {
            clearInterval(playingInterval);
        }
        if (that.options.onpause) {
            that.options.onpause.call(that, e, that.audio);
        }
    };
    HANDLERS.errorHandler = function (e) {
        if (that.options.onerror) {
            that.options.onerror.call(that, e, that.audio);
        }
        that.canplay = false;
        if (playingInterval) {
            clearInterval(playingInterval);
        }
    };
    HANDLERS.endedHandler = function (e) {
        that.playing = false;
        if (playingInterval) {
            clearInterval(playingInterval);
        }
        if (that.options.onended) {
            that.options.onended.call(that, e, that.audio);
        }
        if (that.options.loop) {
            audio.play();
        }
    };
    HANDLERS.canplayHandler = function (e) {
        that.canplay = true;
        if (that.playing) {
            that.play();
        }
        if (that.options.onload) {
            that.options.onload.call(that, e, that.audio);
        }
    };
    HANDLERS.loadstartHandler = function (e) {
        if (that.options.onloadstart) {
            that.options.onloadstart.call(that, e, that.audio);
        }
    };
    HANDLERS.progressHandler = function (e) {
        if (that.options.onprogress) {
            that.options.onprogress.call(that, e, that.audio);
        }
    };

    function bindEvts(ele) {
        for (var i = 0, len = EVENT_NAMES.length, name; i < len; i++) {
            name = EVENT_NAMES[i];
            ele.addEventListener(name, HANDLERS[name + 'Handler'], false);
        }
    }
    function unbindEvts(ele) {
        for (var i = 0, len = EVENT_NAMES.length, name; i < len; i++) {
            name = EVENT_NAMES[i];
            ele.removeEventListener(name, HANDLERS[name + 'Handler'], false);
        }
    }
    function init() {
        that = this;
        bindEvts(that.audio);
    }

    function JSAudio(options) {
        this.audio = getAudio();
        this.playing = false;
        this.canplay = false;
        this.options = options || {};
        if (this.options.volume) {
            this.audio.volume  = this.options.volume/100;
        }
        init.call(this);
    }

    mix(JSAudio, {

        mix: mix,

        parseTime: parseTime

    });

    JSAudio.prototype = {
        
        constructor: JSAudio,

        play: function() {
            if (!this.getSrc()) {
                if (this.options.onerror) {
                    var e = document.createEvent('HTMLEvents');
                    e.type = 'error';
                    e.initEvent('error', false, false);
                    this.options.onerror.call(this, e, this.audio);
                }
                return false;
            }
            this.audio.play();
        },

        pause: function() {
            this.audio.pause();
        },

        load: function(src) {
            this.audio.src = src;
            this.canplay = false;
        },

        stop: function() {
            this.pause();
            this.audio.removeAttribute('src');
            this.playing = false;
            this.canplay = false;
            if (this.options.onstop) {
                this.options.onstop.call(this);
            }
        },

        getSrc: function() {
            var src = this.audio.getAttribute('src');
            if (src) {
                src = this.audio.src;
            }
            return src;
        },

        getPlayedTime: function() {
            var time = 0;
            var played = this.audio.played;
            if (played.length) {
                time = played.end(0);
            }
            return time;
        },

        getCurrentTime: function() {
            return this.audio.currentTime;
        },

        getParsedCurrentTime: function() {
            return parseTime(this.getCurrentTime());
        },

        getParsedPlayedTime: function() {
            return parseTime(this.getPlayedTime());
        },

        getDuration: function() {
            return this.audio.duration;
        },

        getParsedDuration: function() {
            return parseTime(this.getDuration());
        },

        setOptions: function(opts) {
            if (!opts || Object(opts) !== opts) return false;
            mix(this.options, opts);
            return true;
        },

        setVolume: function(volume) {
            this.audio.volume  = volume/100;
        },
        
        destroy: function() {
            var _that = this;
            _that.stop();
            setTimeout(function() {
                unbindEvts(_that.audio);
                _that.options = null;
                _that.audio = null;
                that = null;
            });
        }

    };

    (function(prot) {
        var key, method;
        for (key in prot) {
            if (prot.hasOwnProperty(key) && key !== 'constructor') {
                method = prot[key];
                prot[key] = function(method) {
                    return function() {
                        if (this && this.audio && this.options) {
                            return method.apply(this, arguments);
                        } else {
                            throw new Error('JSAudio实例化对象已经被销毁了！');
                        }
                    };
                }(method);
            }
        }
    })(JSAudio.prototype);
    

    win.JSAudio = JSAudio;

})(window, document);