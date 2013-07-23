Audio
=====
<p>一个简洁的Audio封装.</p>
<p>提供常用的功能封装.</p>
<p>考虑到一般应用场景：</p>
<i>同时只有一个音频在播放，所以设计上只有一个audio元素，每次更改的时候都是更换audio的src.</i>
<p>使用说明：</p>
<pre>
var ad = new JSAudio({
	loop: false, // 是否循环播放当前曲目
	volume: 50, // 声音 0--100
	onplay: function(e, audio) { // 播放
    	// 	audio: audio元素
    	// this: 实例化的JSAudio对象, 也就是ad
    },
    onplaying:function(time, audio) { // 播放中
    	// time：当前播放的时间 02:43
    },
    onpause: function(e, audio) { // 暂停
    
    },
    onerror:function(e, audio) { // 出错

    },
    onended: function(e, audio) { // 播放结束
    
    },
    onload:function(e, audio) { // 可以开始播放

    },
    onloadstart: function(e, audio) { // 开始加载
    
    },
    onprogress:function(e, audio) { // 正在下载中

    }
});
</pre>
<p>属性：</p>
<pre>
ad.playing // 是否正在播放
ad.canplay // 是否能播放
</pre>
<p>方法：</p>
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
<p>此外，JSAudio还有两个静态方法：</p>
<pre>
JSAudio.mix(target) // 将第一个参数之后的对象上的属性“克隆”到target对象上
                    // eg: JSAudio.mix({}, {}, {})
JSAudio.parseTime(time) // 将time(秒)装换成 03:50 的形式
</pre>