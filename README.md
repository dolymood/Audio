Audio
=====
<p>一个简洁的Audio封装.</p>
<p>提供常用的功能封装.</p>
<p>考虑到一般应用场景：</p>
<i>同时只有一个音频在播放，所以设计上只有一个audio元素，每次更改的时候都是更换audio的src.</i>
<h3>使用说明：</h3>
<pre>
var ad = new JSAudio({
	loop: false, // 是否循环播放当前曲目
	volume: 50, // 声音 0--100
    parseTime: true, // 是否是转换后的时间 120 →　02:00
	onplay: function(e, audio) { // 播放
    	// 	audio: audio元素
    	// this: 实例化的JSAudio对象, 也就是ad
    },
    onduration: function(duartion) { // 当可以得到音频长度时

    },
    onstop: function() { // 停止

    },
    onplaying:function(time, audio) { // 播放中
    	// time：当前播放的时间
    },
    onpause: function(e, audio) { // 暂停
    
    },
    onerror:function(e, audio) { // 出错

    },
    onended: function(e, audio) { // 播放结束
    
    },
    oncanplay:function(e, audio) { // 可以开始播放

    },
    onloadstart: function(e, audio) { // 开始加载
    
    },
    onprogress:function(e, audio) { // 正在下载中

    }
});
</pre>
<h3>属性：</h3>
<pre>
ad.playing // 是否正在播放
ad.canplay // 是否能播放
</pre>
<h3>方法：</h3>
<pre>
ad.play() // 播放
ad.pause() // 暂停
ad.load(src) // 加载指定src的音频文件
ad.stop // 停止播放
ad.getSrc // 得到当前正在播放的音频的地址
ad.getPlayedTime // 得到已播放的时间： 20 (以秒为单位)
ad.getParsedPlayedTime // 得到转换后已播放的时间： 03:45
ad.getCurrentTime // 得到正在播放的时间： 20 (以秒为单位)
ad.getParsedCurrentTime // 得到转换后正在播放的时间： 03:45
ad.getDuration // 得到当前音频的长度： 20 (以秒为单位)
ad.getParsedDuration // 得到转换后当前音频的长度： 03:45
ad.setOptions(opts) // 设置options
ad.setVolume(vol) // 设置声音 vol: 0--100
ad.destroy // 销毁
</pre>
<h3>此外，JSAudio还有两个静态方法：</h3>
<pre>
JSAudio.mix(target) // 将第一个参数之后的对象上的属性“克隆”到target对象上
                    // eg: JSAudio.mix({}, {}, {})
JSAudio.parseTime(time) // 将time(秒)装换成 03:50 的形式
</pre>
<h3>else：</h3>
<p>1. <i>由于在 mobile safari 上不能自动播放，所以实现不了自动播放，也就是autoplay的效果。因此，需要手工的在某些事件处理函数中来调用audio的play才可以播放。故不提供autoplay功能。</i>
</p>
<p>2. <i>在ios5上有bug：只能连续的播放3首，不能一直持续播放</i></p>
<p>3. <i>在触发canplay事件的时候，不一定能去得到duration，所以在设计上，可以在初始化的时候通过onduration就可以正确的得到duration</i></p>
<p>4. <i>ios上目前不支持volume设置</i></p>
<p>5. <i>在ios4.3.3上当切换audio的src的时候canplay会被调用2次，第一次是老的src对应触发的，第二次才是新的src对应触发的</i></p>
