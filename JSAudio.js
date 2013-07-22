(function(win, doc) {

    var getAudio = function() {
        var audio;
        return function() {
            if (!audio) {
                audio = new Audio();
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
                    target[key] = tmp[key];
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
        var mit = Math.floor(duration/60);
        var sec = Math.ceil(duration - mit * 60);
        if (sec >= 60) {
            mit += 1;
            sec -= 60;
        }
        return parseD(mit) + ':' + parseD(sec);
    }

    var playingInterval;
    function init() {
        var that = this;
        var audio = that.audio;
        audio.addEventListener('play', function(e) {
            if (!that.canplay) return false;
            console.log('play');
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
        });
        audio.addEventListener('pause', function(e) {
            console.log('pause');
            that.playing = false;
            if (playingInterval) {
                clearInterval(playingInterval);
            }
            if (that.options.onpause) {
                that.options.onpause.call(that, e, that.audio);
            }
        });
        audio.addEventListener('error', function(e) {
            console.log('error');
            if (that.options.onerror) {
                that.options.onerror.call(that, e, that.audio);
            }
            that.canplay = false;
            if (playingInterval) {
                clearInterval(playingInterval);
            }
        });
        audio.addEventListener('ended', function(e) {
            console.log('ended');
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
        });
        audio.addEventListener('canplay', function(e) {
            console.log('canplay');
            that.canplay = true;
            if (that.playing) {
                that.play();
            }
            if (that.options.onload) {
                that.options.onload.call(that, e, that.audio);
            }
        });
        audio.addEventListener('loadstart', function() {
            console.log('loadstart');
        });
        audio.addEventListener('progress', function() {
            console.log('progress');
        });
    }

    function JSAudio(options) {
        this.audio = getAudio();
        this.playing = false;
        this.canplay = false;
        this.options = options || {};
        init.call(this);
    }

    mix(JSAudio, {

        mix: mix,

        parseTime: parseTime

    });

    JSAudio.prototype = {
        
        constructor: JSAudio,

        play: function() {
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
        
        destroy: function() {

        }

    };

    win.JSAudio = JSAudio;

})(window, document);