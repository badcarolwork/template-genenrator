(function (settings) {
  // basic_url = set.Lp_url;
  // basic_label = set.exit_label;
  var set = Performics.settings,
   _src = set.FLD.FLD_src,
    _type = set.FLD.FLD_type,
    _cat = set.FLD.FLD_cat,
    _IMP = set.FLD.DBM_IMP,
    _CLK = set.FLD.DBM_CLK,
    _u1 = set.FLD.u1,
    _u2 = set.FLD.u2,
    _u3 = set.FLD.u3,
    _u4 = set.FLD.u4,
    _u5 = set.FLD.u5,
    _u6 = set.FLD.u6,
    _u7 = set.FLD.u7,
    _u8 = set.FLD.u8,
    _u9 = set.FLD.u9,
    _u10 = set.FLD.u10;
  /*
Basic video setting:
1.landing page
2.videoCss
 */
  // var Lp_url = basic_url || "https://www.performics.com/"; //filled to determined the video landing page
  var videoCssLink = set.videoCssLink; //Choose the right type of video css
  /*
Resources setting:
 */
  var resources = {};
  resources.image = {};
  var video_src = set.video_src;
  (resources.image.play_src = "https://s0.2mdn.net/creatives/assets/2910296/play_btn.png"),
  (resources.image.mute_src = "https://s0.2mdn.net/creatives/assets/2910296/mute_btn.png"),
  (resources.image.unmute_src = "https://s0.2mdn.net/creatives/assets/2910296/unmute_btn.png");
  /*
Tracking setting:
1.FLD
 */
  //basic FLD setting
  var FLD_src = _src || "",
    FLD_type = _type || "",
    FLD_cat = _cat || "";
  //u1 name for IMP/CLK
  var DBM_IMP = _IMP || "IMP",
    DBM_CLK = _CLK || "CLK";
  //u2 name for video quartile
  var DBM_quart1 = "0.25",
    DBM_quart2 = "0.5",
    DBM_quart3 = "0.75",
    DBM_quart4 = "1";
  var u1 = _u1 || "0",
    u2 = _u2 || "0",
    u3 = _u3 || "PMP",
    u4 = _u4 || "0",
    u5 = _u5 || "0",
    u6 = _u6 || "0",
    u7 = _u7 || "0",
    u8 = _u8 || "0",
    u9 = _u9 || "0",
    u10 = _u10 || "0";
  /*
  handler variable
 */
  var videoM = {},
    is_fivevideo = false,
    is_clickable = false,
    is_clicked = false,
    is_halfvideo = false,
    is_completevideo = false,
    is_videoLoaded = false,
    is_imageLoaded = false;
  var BUILD_FRAME = function videoFramework(callback) {
    var s = document.getElementById("videoBox");
    var ttt = ["play_btn",
      [null, [resources.image.play_src]], "mute_btn",
      ["m-area", [resources.image.mute_src]], "unmute_btn",
      ["m-area", [resources.image.unmute_src]],
    ];
    var html = '<video id="video-1" autoplay="" playsinline webkit-playsinline muted src=""><source src="">' + "</video>";
    if (!Array.isArray) {
      Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
      };
    }
    for (var i = 0; i < ttt.length; i++) {
      if (!Array.isArray(ttt[i])) {
        if (ttt[i] !== null) {
          html += '<div id="' + ttt[i] + '">';
        } else {
          html += "<div>";
        }
      } else {
        for (var j = 0; j < ttt[i].length; j++) {
          if (!Array.isArray(ttt[i][j])) {
            if (ttt[i][j] !== null) {
              html += '<div class="' + ttt[i][j] + '">';
            } else {
              html += "<div>";
            }
          } else {
            for (var k = 0; k < ttt[i][j].length; k++) {
              if (!Array.isArray(ttt[i][j][k])) {
                if (ttt[i][j][k] !== null) {
                  html += '<img src=""/></div></div>';
                } else {
                  html += "<div></div></div></div>";
                }
              }
            }
          }
        }
      }
    }
    var isVisible = false;
    s.insertAdjacentHTML("beforeend", html);
    videomodule_ResourcesLoaded(show);
    // addImpClkFLD(DBM_IMP);
    add50percentDetection();
    callback();
  };
  var ADD_VIDEO_DOM = function videoDom() {
    videoM.dom = {};
    videoM.dom.vid = document.querySelector("#videoBox video");
    videoM.dom.vidContainer = document.getElementById("videoBox");
    videoM.dom.playBtn = document.getElementById("play_btn");
    videoM.dom.muteBtn = document.querySelector("#mute_btn img");
    videoM.dom.unmuteBtn = document.querySelector("#unmute_btn img");
    videoM.dom.expandedExit = document.getElementById("box");
  };
  // function addImpClkFLD(u1){
  //  var u_array = [u3,u4,u5,u6,u7,u8,u9,u10];
  //  var impclk_array = [u1,"0"];
  //  impclk_array.push.apply(impclk_array,u_array);
  //  FLD.apply(null,impclk_array);
  // }
  function css(cssId, cssLink, callback) {
    if (!document.getElementById(cssId)) {
      var a = document.getElementsByTagName("head")[0];
      var b = document.createElement("link");
      b.id = cssId;
      b.rel = "stylesheet";
      b.type = "text/css";
      b.href = cssLink;
      b.media = "all";
      a.appendChild(b);
    }
    callback();
  }
  var ADD_VIDEO_LISTENER = function videoListeners() {
    this.counter3s = timer.bind(this, 3, "3S_View");
    this.counterExit = exitClickHandler.bind("exit");
    this.counterClkPlay = videoplay.bind(this, "click_play");
    this.videoFLD_quart1 = addVideoFLD.bind(this, DBM_quart1);
    this.videoFLD_quart2 = addVideoFLD.bind(this, DBM_quart2);
    this.videoFLD_quart3 = addVideoFLD.bind(this, DBM_quart3);
    this.videoFLD_quart4 = addVideoFLD.bind(this, DBM_quart4);
    videoM.dom.expandedExit.addEventListener("click", this.counterExit);
    videoM.dom.expandedExit.addEventListener("touchEnd", this.counterExit);
    videoM.dom.playBtn.addEventListener("click", this.counterClkPlay, false);
    videoM.dom.playBtn.addEventListener("touchEnd", this.counterClkPlay, false);
    videoM.dom.muteBtn.addEventListener("click", muteChange);
    videoM.dom.unmuteBtn.addEventListener("click", muteChange);
    videoM.dom.vid.addEventListener("timeupdate", this.videoFLD_quart1, false);
    videoM.dom.vid.addEventListener("timeupdate", this.videoFLD_quart2, false);
    videoM.dom.vid.addEventListener("timeupdate", this.videoFLD_quart3, false);
    videoM.dom.vid.addEventListener("timeupdate", this.videoFLD_quart4, false);
    videoM.dom.vid.addEventListener("ended", videoEndHandler, false);
    videoM.dom.vid.addEventListener("timeupdate", this.counter3s, false);
  };

  function timer(sec, label) {
    var currentPos = videoM.dom.vid.currentTime;
    if (currentPos > sec) {
      if (is_clickable == true) {
        Enabler.counter("3S_View");
        videoM.dom.vid.removeEventListener("timeupdate", this.counter3s, false);
        console.log("3s");
      }
    }
  }

  function show() {
    set.isResourceLoaded = true;
    is_clickable = true;
    videoM.dom.expandedExit.style.display = "block";
    videoM.dom.vidContainer.style.visibility = "visible";
    if (videoM.dom.vid.readyState >= 2) {
      videoM.dom.playBtn.style.display = "none";
      startMuted(null);
    } else {
      videoM.dom.vid.hasCanPlay = false;
      videoM.dom.playBtn.style.display = "none";
      videoM.dom.vid.addEventListener("canplay", startMuted, false);
    }
    // alert('show');
  }

  function exitClickHandler(url, label) {
    is_clicked = true;
    set.is_clicked = true;
    videoM.dom.vid.pause();
    videoM.dom.playBtn.style.display = "block";
    if (videoM.dom.vid.readyState > 0) {
      videoM.dom.vid.currentTime = 1;
    }
    // Enabler.exit(label, url);
    // addImpClkFLD(DBM_CLK);
    // alert('exitClickHandler');
  }

  function startMuted(e) {
    videoM.dom.vid.hasCanPlay = true;
    if (videoM.dom.vid.hasCanPlay) {
      videoM.dom.vid.removeEventListener("canplay", startMuted);
    }
    videoM.dom.vid.volume = 0;
    videoM.dom.vid.muted = true;
    videoM.dom.vid.currentTime = 0.0001;
    videoM.dom.muteBtn.style.display = "block";
    videoM.dom.unmuteBtn.style.display = "none";
    videoM.dom.vid.play();
    // alert('startMuted');
  }

  function muteChange() {
    if (videoM.dom.muteBtn.style.display == "block" || videoM.dom.vid.muted) {
      videoM.dom.muteBtn.style.display = "none";
      videoM.dom.unmuteBtn.style.display = "block";
      videoM.dom.vid.volume = 0.5;
      videoM.dom.vid.muted = false;
    } else {
      videoM.dom.muteBtn.style.display = "block";
      videoM.dom.unmuteBtn.style.display = "none";
      videoM.dom.vid.volume = 0;
      videoM.dom.vid.muted = true;
    }
    // alert('MuteChange');
    event.stopPropagation();
  }

  function videoEndHandler(e) {
    videoM.dom.vid.pause();
    videoM.dom.playBtn.style.display = "block";
    if (videoM.dom.vid.readyState > 0) {
      videoM.dom.vid.currentTime = 1;
    }
    is_completevideo = true;
  }

  function addVideoTracking() {
    Enabler.loadModule(studio.module.ModuleId.VIDEO, function () {
      studio.video.Reporter.attach("Video Report 1", videoM.dom.vid);
    }.bind(this));
  }

  function videoplay(label, evt) {
    is_clickable = true;
    videoM.dom.playBtn.style.display = "none";
    videoM.dom.vid.controls = false;
    videoM.dom.vid.loop = false;
    Enabler.counter("click_play");
    videoM.dom.vid.volume = 0.5;
    videoM.dom.vid.muted = true;
    // videoM.dom.vid.currentTime  = 0;
    muteChange();
    videoM.dom.vid.play();
    // alert('videoplay');
    evt.stopPropagation();
  }

  function addVideoFLD(u2) {
    var u_array = [u3, u4, u5, u6, u7, u8, u9, u10];
    var vid_array = [u1, u2];
    vid_array.push.apply(vid_array, u_array);
    var currentPos = videoM.dom.vid.currentTime;
    var quartile1 = Math.floor(Math.round(videoM.dom.vid.duration) * (1 / 4));
    var quartile2 = Math.floor(Math.round(videoM.dom.vid.duration) * (2 / 4));
    var quartile3 = Math.floor(Math.round(videoM.dom.vid.duration) * (3 / 4));
    var quartile4 = Math.floor(Math.round(videoM.dom.vid.duration) * (4 / 4));
    if (currentPos > quartile1 && u2 === DBM_quart1) {
      videoM.dom.vid.removeEventListener("timeupdate", this.videoFLD_quart1, false);
      FLD.apply(null, vid_array);
      return console.log("quartile1 finished");
    } else if (currentPos > quartile2 && u2 === DBM_quart2) {
      videoM.dom.vid.removeEventListener("timeupdate", this.videoFLD_quart2, false);
      FLD.apply(null, vid_array);
      is_halfvideo = true;
      return console.log("quartile2 finished");
    } else if (currentPos > quartile3 && u2 === DBM_quart3) {
      videoM.dom.vid.removeEventListener("timeupdate", this.videoFLD_quart3, false);
      FLD.apply(null, vid_array);
      return console.log("quartile3 finished");
    } else if (currentPos > quartile4 - 1 && u2 === DBM_quart4) {
      videoM.dom.vid.removeEventListener("timeupdate", this.videoFLD_quart4, false);
      FLD.apply(null, vid_array);
      is_completevideo = true;
      return console.log("quartile4 finished");
    }
  }

  function FLD(u1, u2, u3, u4, u5, u6, u7, u8, u9, u10) {
    // for (var i =0 ; i<arguments.length;i++){
    //  if(!!arguments[i]){
    //      arguments[i] = arguments[i];
    //  } else {
    //      arguments[i] = "\"\"";
    //  }
    // }
    var video_img_obj;
    video_img_obj = new Image();
    video_img_obj.width = "1px";
    video_img_obj.height = "1px";
    video_img_obj.src = "https://ad.doubleclick.net/ddm/activity/src=" + FLD_src + ";type=" + FLD_type + ";cat=" + FLD_cat + ";u1=" + u1 + ";u2=" + u2 + ";u3=" + u3 + ";u4=" + u4 + ";u5=" + u5 + ";u6=" + u6 + ";u7=" + u7 + ";u8=" + u8 + ";u9=" + u9 + ";u10=" + u10 + ";dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1?";
  }

  function START() {
    css("videoModule", videoCssLink, function () {
      "videoCss loaded";
    });
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", BUILD_FRAME(ADD_VIDEO_DOM));
    } else {
      BUILD_FRAME(ADD_VIDEO_DOM);
    }
    EnablerFn();
  }

  function EnablerFn() {
    if (Enabler.isInitialized()) {
      enablerInitHandler();
    } else {
      Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
    }
  }

  function enablerInitHandler() {
    ADD_VIDEO_LISTENER();
    addVideoTracking();
  }

  function videomodule_ResourcesLoaded(callback) {
    preloadImage(setImage);
    preloadVideo(setVideo);
    document.getElementById("featureBox").style.opacity = 1;
    var a = setInterval(function () {
      if (is_videoLoaded && is_imageLoaded) {
        callback();
        clearInterval(a);
      } else {
        console.log("wait for moduleResources");
      }
    }.bind(null, callback), 100);
    // document.querySelector("#featureBox").style.opacity = 1;
  }

  function preloadVideo(callback) {
    var a = document.getElementsByTagName("head")[0];
    var b = document.createElement("link");
    b.id = "preloadVideo";
    b.as = "video";
    b.href = video_src;
    a.appendChild(b);
    console.log("Video Loaded");
    callback();
    return (is_videoLoaded = true);
  }

  function preloadImage(callback) {
    var imageLoadedCounter = 0;
    var images = new Array();
    var image_src = Object.values(resources.image);
    var num = image_src.length;

    function preload() {
      for (i = 0; i < preload.arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
        images[i].onload = function () {
          imageLoadedCounter++;
        };
        // console.log(preload.arguments[i]);
      }
    }
    preload.apply(null, image_src);
    var a = setInterval(function () {
      if (imageLoadedCounter === num) {
        console.log("Image Loaded");
        callback();
        clearInterval(a);
      } else {
        console.log("wait for image resources");
      }
    }.bind(null, callback), 100);
    return (is_imageLoaded = true);
  }

  function setImage() {
    document.querySelector("#unmute_btn>div>img").style.display = "none";
    document.querySelector("#play_btn>div>img").src = resources.image.play_src;
    document.querySelector("#mute_btn>div>img").src = resources.image.mute_src;
    document.querySelector("#unmute_btn>div>img").src = resources.image.unmute_src;
  }

  function setVideo() {
    document.querySelector("#video-1").src = video_src;
    document.querySelector("#videoBox source").src = video_src;
  }

  function add50percentDetection() {
    var video_ended = false;
    var myVideo = document.getElementById("video-1");
    myVideo.addEventListener("ended", function () {
      video_ended = true;
    });
    setInterval(function () {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            myVideo.pause();
            isVisible = false;
          } else if (entry.isIntersecting && !video_ended && !is_clicked) {
            myVideo.play();
            isVisible = true;
          }
        });
      }, {});
      observer.observe(myVideo);
    }, 500);
  }
  START();

})(Performics.settings);