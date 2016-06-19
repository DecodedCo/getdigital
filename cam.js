		var activities = {
			"anger": "Be angry",
			"contempt": "Be contemptious",
			"disgust": "Bes disgusted",
			"fear": "Be fearful",
			"happiness": "Be happy",
			"neutral": "Nothing much",
			"sadness": "Be sad",
			"surprise": "Be surprised"
		}

		function take_snapshot() {
      $('#snapItBtn').hide();
			Webcam.snap(function(data_uri) {
				document.getElementById('results').innerHTML = '<img id="base64image" src="'+data_uri+'"/>';
        $('#my_camera').hide();
        $('#results').show();
				saveSnap();
			});
		}

		function showCam(){
			Webcam.set({
				width: 320,
				height: 240,
				image_format: 'jpeg',
				jpeg_quality: 100
			});
			Webcam.attach('#my_camera');
      $('#showCamBtn').hide();
      $('#snapItBtn').show();
      $('#my_camera').show();
		}

		function saveSnap(){
			var file = document.getElementById("base64image").src.substring(23).replace(' ', '+');
			var img = Base64Binary.decodeArrayBuffer(file);
			var ajax = new XMLHttpRequest();
			ajax.addEventListener("load", function(event) { uploadComplete(event);}, false);
			ajax.open("POST", "https://api.projectoxford.ai/emotion/v1.0/recognize","image/jpg");
			ajax.setRequestHeader("Content-Type","application/octet-stream");
			//ajax.setRequestHeader("Accept-Encoding","gzip, deflate");
			ajax.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml");
			ajax.setRequestHeader("Ocp-Apim-Subscription-Key","2635f04f27d04700ae9c21bf7efa8207");
			ajax.send(img);
}

function uploadComplete(event){
	var xmlDoc=event.target.responseXML;
	//console.log(xmlDoc);
	if(!xmlDoc.getElementsByTagName("scores")[0]){
		alert("ERROR! Try agin");
    $('#snapItBtn').show();
		return false;
	}
	var list = xmlDoc.getElementsByTagName("scores")[0].childNodes;
	var largest = 0;
	var largestLabel = "";

	list.forEach(function(emotion){
		console.log(emotion.nodeName, emotion.innerHTML);

		if(parseFloat(emotion.innerHTML) > largest){
			largest = parseFloat(emotion.innerHTML);
			largestLabel = emotion.nodeName;
		}
	});

	alert("You are " + largest.toFixed(2)*100 + "% " + largestLabel + " so we suggest you " + activities[largestLabel]);

	console.log(largestLabel, largest)
  
  $('#showCamBtn').show();
  $('#my_camera').hide();
  $('#results').hide();
	
}

// WebcamJS v1.0.9 - http://github.com/jhuckaby/webcamjs - MIT Licensed
(function(e){var t;function a(){var e=Error.apply(this,arguments);e.name=this.name="FlashError";this.stack=e.stack;this.message=e.message}function s(){var e=Error.apply(this,arguments);e.name=this.name="WebcamError";this.stack=e.stack;this.message=e.message}IntermediateInheritor=function(){};IntermediateInheritor.prototype=Error.prototype;a.prototype=new IntermediateInheritor;s.prototype=new IntermediateInheritor;var Webcam={version:"1.0.8",protocol:location.protocol.match(/https/i)?"https":"http",loaded:false,live:false,userMedia:true,params:{width:0,height:0,dest_width:0,dest_height:0,image_format:"jpeg",jpeg_quality:90,force_flash:false,flip_horiz:false,fps:30,upload_name:"webcam",constraints:null,swfURL:"",flashNotDetectedText:"ERROR: No Adobe Flash Player detected.  Webcam.js relies on Flash for browsers that do not support getUserMedia (like yours)."},errors:{FlashError:a,WebcamError:s},hooks:{},init:function(){var t=this;this.mediaDevices=navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?navigator.mediaDevices:navigator.mozGetUserMedia||navigator.webkitGetUserMedia?{getUserMedia:function(e){return new Promise(function(t,a){(navigator.mozGetUserMedia||navigator.webkitGetUserMedia).call(navigator,e,t,a)})}}:null;e.URL=e.URL||e.webkitURL||e.mozURL||e.msURL;this.userMedia=this.userMedia&&!!this.mediaDevices&&!!e.URL;if(navigator.userAgent.match(/Firefox\D+(\d+)/)){if(parseInt(RegExp.$1,10)<21)this.userMedia=null}if(this.userMedia){e.addEventListener("beforeunload",function(e){t.reset()})}},attach:function(a){if(typeof a=="string"){a=document.getElementById(a)||document.querySelector(a)}if(!a){return this.dispatch("error",new s("Could not locate DOM element to attach to."))}this.container=a;a.innerHTML="";var i=document.createElement("div");a.appendChild(i);this.peg=i;if(!this.params.width)this.params.width=a.offsetWidth;if(!this.params.height)this.params.height=a.offsetHeight;if(!this.params.width||!this.params.height){return this.dispatch("error",new s("No width and/or height for webcam.  Please call set() first, or attach to a visible element."))}if(!this.params.dest_width)this.params.dest_width=this.params.width;if(!this.params.dest_height)this.params.dest_height=this.params.height;this.userMedia=t===undefined?this.userMedia:t;if(this.params.force_flash){t=this.userMedia;this.userMedia=null}if(typeof this.params.fps!=="number")this.params.fps=30;var r=this.params.width/this.params.dest_width;var o=this.params.height/this.params.dest_height;if(this.userMedia){var h=document.createElement("video");h.setAttribute("autoplay","autoplay");h.style.width=""+this.params.dest_width+"px";h.style.height=""+this.params.dest_height+"px";if(r!=1||o!=1){a.style.overflow="hidden";h.style.webkitTransformOrigin="0px 0px";h.style.mozTransformOrigin="0px 0px";h.style.msTransformOrigin="0px 0px";h.style.oTransformOrigin="0px 0px";h.style.transformOrigin="0px 0px";h.style.webkitTransform="scaleX("+r+") scaleY("+o+")";h.style.mozTransform="scaleX("+r+") scaleY("+o+")";h.style.msTransform="scaleX("+r+") scaleY("+o+")";h.style.oTransform="scaleX("+r+") scaleY("+o+")";h.style.transform="scaleX("+r+") scaleY("+o+")"}a.appendChild(h);this.video=h;var n=this;this.mediaDevices.getUserMedia({audio:false,video:this.params.constraints||{mandatory:{minWidth:this.params.dest_width,minHeight:this.params.dest_height}}}).then(function(t){h.onloadedmetadata=function(e){n.stream=t;n.loaded=true;n.live=true;n.dispatch("load");n.dispatch("live");n.flip()};h.src=e.URL.createObjectURL(t)||t}).catch(function(e){return n.dispatch("error",e)})}else{e.Webcam=Webcam;var l=document.createElement("div");l.innerHTML=this.getSWFHTML();a.appendChild(l)}if(this.params.crop_width&&this.params.crop_height){var c=Math.floor(this.params.crop_width*r);var m=Math.floor(this.params.crop_height*o);a.style.width=""+c+"px";a.style.height=""+m+"px";a.style.overflow="hidden";a.scrollLeft=Math.floor(this.params.width/2-c/2);a.scrollTop=Math.floor(this.params.height/2-m/2)}else{a.style.width=""+this.params.width+"px";a.style.height=""+this.params.height+"px"}},reset:function(){if(this.preview_active)this.unfreeze();this.unflip();if(this.userMedia){if(this.stream){if(this.stream.getVideoTracks){var e=this.stream.getVideoTracks();if(e&&e[0]&&e[0].stop)e[0].stop()}else if(this.stream.stop){this.stream.stop()}}delete this.stream;delete this.video}if(this.userMedia!==true){this.getMovie()._releaseCamera()}if(this.container){this.container.innerHTML="";delete this.container}this.loaded=false;this.live=false},set:function(){if(arguments.length==1){for(var e in arguments[0]){this.params[e]=arguments[0][e]}}else{this.params[arguments[0]]=arguments[1]}},on:function(e,t){e=e.replace(/^on/i,"").toLowerCase();if(!this.hooks[e])this.hooks[e]=[];this.hooks[e].push(t)},off:function(e,t){e=e.replace(/^on/i,"").toLowerCase();if(this.hooks[e]){if(t){var a=this.hooks[e].indexOf(t);if(a>-1)this.hooks[e].splice(a,1)}else{this.hooks[e]=[]}}},dispatch:function(){var t=arguments[0].replace(/^on/i,"").toLowerCase();var i=Array.prototype.slice.call(arguments,1);if(this.hooks[t]&&this.hooks[t].length){for(var r=0,o=this.hooks[t].length;r<o;r++){var h=this.hooks[t][r];if(typeof h=="function"){h.apply(this,i)}else if(typeof h=="object"&&h.length==2){h[0][h[1]].apply(h[0],i)}else if(e[h]){e[h].apply(e,i)}}return true}else if(t=="error"){if(i[0]instanceof a||i[0]instanceof s){message=i[0].message}else{message="Could not access webcam: "+i[0].name+": "+i[0].message+" "+i[0].toString()}alert("Webcam.js Error: "+message)}return false},setSWFLocation:function(e){this.set("swfURL",e)},detectFlash:function(){var t="Shockwave Flash",a="ShockwaveFlash.ShockwaveFlash",s="application/x-shockwave-flash",i=e,r=navigator,o=false;if(typeof r.plugins!=="undefined"&&typeof r.plugins[t]==="object"){var h=r.plugins[t].description;if(h&&(typeof r.mimeTypes!=="undefined"&&r.mimeTypes[s]&&r.mimeTypes[s].enabledPlugin)){o=true}}else if(typeof i.ActiveXObject!=="undefined"){try{var n=new ActiveXObject(a);if(n){var l=n.GetVariable("$version");if(l)o=true}}catch(c){}}return o},getSWFHTML:function(){var t="",s=this.params.swfURL;if(location.protocol.match(/file/)){this.dispatch("error",new a("Flash does not work from local disk.  Please run from a web server."));return'<h3 style="color:red">ERROR: the Webcam.js Flash fallback does not work from local disk.  Please run it from a web server.</h3>'}if(!this.detectFlash()){this.dispatch("error",new a("Adobe Flash Player not found.  Please install from get.adobe.com/flashplayer and try again."));return'<h3 style="color:red">'+this.params.flashNotDetectedText+"</h3>"}if(!s){var i="";var r=document.getElementsByTagName("script");for(var o=0,h=r.length;o<h;o++){var n=r[o].getAttribute("src");if(n&&n.match(/\/webcam(\.min)?\.js/)){i=n.replace(/\/webcam(\.min)?\.js.*$/,"");o=h}}if(i)s=i+"/webcam.swf";else s="webcam.swf"}if(e.localStorage&&!localStorage.getItem("visited")){this.params.new_user=1;localStorage.setItem("visited",1)}var l="";for(var c in this.params){if(l)l+="&";l+=c+"="+escape(this.params[c])}t+='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" type="application/x-shockwave-flash" codebase="'+this.protocol+'://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+this.params.width+'" height="'+this.params.height+'" id="webcam_movie_obj" align="middle"><param name="wmode" value="opaque" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+s+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+l+'"/><embed id="webcam_movie_embed" src="'+s+'" wmode="opaque" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+this.params.width+'" height="'+this.params.height+'" name="webcam_movie_embed" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+l+'"></embed></object>';return t},getMovie:function(){if(!this.loaded)return this.dispatch("error",new a("Flash Movie is not loaded yet"));var e=document.getElementById("webcam_movie_obj");if(!e||!e._snap)e=document.getElementById("webcam_movie_embed");if(!e)this.dispatch("error",new a("Cannot locate Flash movie in DOM"));return e},freeze:function(){var e=this;var t=this.params;if(this.preview_active)this.unfreeze();var a=this.params.width/this.params.dest_width;var s=this.params.height/this.params.dest_height;this.unflip();var i=t.crop_width||t.dest_width;var r=t.crop_height||t.dest_height;var o=document.createElement("canvas");o.width=i;o.height=r;var h=o.getContext("2d");this.preview_canvas=o;this.preview_context=h;if(a!=1||s!=1){o.style.webkitTransformOrigin="0px 0px";o.style.mozTransformOrigin="0px 0px";o.style.msTransformOrigin="0px 0px";o.style.oTransformOrigin="0px 0px";o.style.transformOrigin="0px 0px";o.style.webkitTransform="scaleX("+a+") scaleY("+s+")";o.style.mozTransform="scaleX("+a+") scaleY("+s+")";o.style.msTransform="scaleX("+a+") scaleY("+s+")";o.style.oTransform="scaleX("+a+") scaleY("+s+")";o.style.transform="scaleX("+a+") scaleY("+s+")"}this.snap(function(){o.style.position="relative";o.style.left=""+e.container.scrollLeft+"px";o.style.top=""+e.container.scrollTop+"px";e.container.insertBefore(o,e.peg);e.container.style.overflow="hidden";e.preview_active=true},o)},unfreeze:function(){if(this.preview_active){this.container.removeChild(this.preview_canvas);delete this.preview_context;delete this.preview_canvas;this.preview_active=false;this.flip()}},flip:function(){if(this.params.flip_horiz){var e=this.container.style;e.webkitTransform="scaleX(-1)";e.mozTransform="scaleX(-1)";e.msTransform="scaleX(-1)";e.oTransform="scaleX(-1)";e.transform="scaleX(-1)";e.filter="FlipH";e.msFilter="FlipH"}},unflip:function(){if(this.params.flip_horiz){var e=this.container.style;e.webkitTransform="scaleX(1)";e.mozTransform="scaleX(1)";e.msTransform="scaleX(1)";e.oTransform="scaleX(1)";e.transform="scaleX(1)";e.filter="";e.msFilter=""}},savePreview:function(e,t){var a=this.params;var s=this.preview_canvas;var i=this.preview_context;if(t){var r=t.getContext("2d");r.drawImage(s,0,0)}e(t?null:s.toDataURL("image/"+a.image_format,a.jpeg_quality/100),s,i);this.unfreeze()},snap:function(e,t){var a=this;var i=this.params;if(!this.loaded)return this.dispatch("error",new s("Webcam is not loaded yet"));if(!e)return this.dispatch("error",new s("Please provide a callback function or canvas to snap()"));if(this.preview_active){this.savePreview(e,t);return null}var r=document.createElement("canvas");r.width=this.params.dest_width;r.height=this.params.dest_height;var o=r.getContext("2d");if(this.params.flip_horiz){o.translate(i.dest_width,0);o.scale(-1,1)}var h=function(){if(this.src&&this.width&&this.height){o.drawImage(this,0,0,i.dest_width,i.dest_height)}if(i.crop_width&&i.crop_height){var a=document.createElement("canvas");a.width=i.crop_width;a.height=i.crop_height;var s=a.getContext("2d");s.drawImage(r,Math.floor(i.dest_width/2-i.crop_width/2),Math.floor(i.dest_height/2-i.crop_height/2),i.crop_width,i.crop_height,0,0,i.crop_width,i.crop_height);o=s;r=a}if(t){var h=t.getContext("2d");h.drawImage(r,0,0)}e(t?null:r.toDataURL("image/"+i.image_format,i.jpeg_quality/100),r,o)};if(this.userMedia){o.drawImage(this.video,0,0,this.params.dest_width,this.params.dest_height);h()}else{var n=this.getMovie()._snap();var l=new Image;l.onload=h;l.src="data:image/"+this.params.image_format+";base64,"+n}return null},configure:function(e){if(!e)e="camera";this.getMovie()._configure(e)},flashNotify:function(e,t){switch(e){case"flashLoadComplete":this.loaded=true;this.dispatch("load");break;case"cameraLive":this.live=true;this.dispatch("live");break;case"error":this.dispatch("error",new a(t));break;default:break}},b64ToUint6:function(e){return e>64&&e<91?e-65:e>96&&e<123?e-71:e>47&&e<58?e+4:e===43?62:e===47?63:0},base64DecToArr:function(e,t){var a=e.replace(/[^A-Za-z0-9\+\/]/g,""),s=a.length,i=t?Math.ceil((s*3+1>>2)/t)*t:s*3+1>>2,r=new Uint8Array(i);for(var o,h,n=0,l=0,c=0;c<s;c++){h=c&3;n|=this.b64ToUint6(a.charCodeAt(c))<<18-6*h;if(h===3||s-c===1){for(o=0;o<3&&l<i;o++,l++){r[l]=n>>>(16>>>o&24)&255}n=0}}return r},upload:function(e,t,a){var s=this.params.upload_name||"webcam";var i="";if(e.match(/^data\:image\/(\w+)/))i=RegExp.$1;else throw"Cannot locate image format in Data URI";var r=e.replace(/^data\:image\/\w+\;base64\,/,"");var o=new XMLHttpRequest;o.open("POST",t,true);if(o.upload&&o.upload.addEventListener){o.upload.addEventListener("progress",function(e){if(e.lengthComputable){var t=e.loaded/e.total;Webcam.dispatch("uploadProgress",t,e)}},false)}var h=this;o.onload=function(){if(a)a.apply(h,[o.status,o.responseText,o.statusText]);Webcam.dispatch("uploadComplete",o.status,o.responseText,o.statusText)};var n=new Blob([this.base64DecToArr(r)],{type:"image/"+i});var l=new FormData;l.append(s,n,s+"."+i.replace(/e/,""));o.send(l)}};Webcam.init();if(typeof define==="function"&&define.amd){define(function(){return Webcam})}else if(typeof module==="object"&&module.exports){module.exports=Webcam}else{e.Webcam=Webcam}})(window);


/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 * 
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 */

var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);
		
		return ab;
	},

	removePaddingChars: function(input){
		var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
		if(lkey == 64){
			return input.substring(0,input.length - 1);
		}
		return input;
	},

	decode: function (input, arrayBuffer) {
		//get last chars to see if are valid
		input = this.removePaddingChars(input);
		input = this.removePaddingChars(input);

		var bytes = parseInt((input.length / 4) * 3, 10);
		
		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;
		
		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}
	
		return uarray;	
	}
}
