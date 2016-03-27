(function (win, doc){
// 定义注册事件函数
	function addlistener(ele, event, handler, capture){
		if (ele.addEventListener)
			!!capture ? ele.addEventListener(event, handler, true) : ele.addEventListener(event, handler);
		else
			ele.attachEvent('on' + event, handler);
	}
// 定义取消注册事件函数
	function removelistener(ele, event, handler, capture){
		if (ele.removeEventListener)
			!!capture ? ele.removeEventListener(event, handler, true) : ele.removeEventListener(event, handler);
		else
			ele.detachEvent('on' + event, handler);
	}
// 定义扩展对象函数
	function extend(target, source){
		for (var i in source){
			if (target[i] == undefined) target[i] = source[i];
		}
	}
// 设置cookie
	function setcookie(name, value, age){
		var cookietmp = name + '=' + encodeURIComponent(value) + '; ';
		if (age) cookietmp += "max-age=" + age +';';
		document.cookie = cookietmp;
	}
// 取得cookie
	function getcookie(){
		var cookietmp = document.cookie;
		var kv = cookietmp.split('; ');
		var cookie = {}
		kv.forEach(function(v){
			var ck = v.split('=')[0];
			var cv = v.split('=')[1];
			cookie[ck] = decodeURIComponent(cv);
		})
		return cookie;
	}
// 删除cookie
	function delcookie(name){
		var cookietmp = name + '=0; ' + 'max-age=0;'
		document.cookie = cookietmp;
	}
// 数字转换为时间格式
	function toTimeformat(str){
		var num = parseFloat(str);
		var hr = Math.floor(num/3600);
		if (hr<10) hr = '0' + hr;
		var min = Math.floor((num - hr*3600)/60);
		if (min<10) min = '0' + min;
		var sec = (num - hr*3600 - min*60).toFixed(0);
		if (sec< 10) sec = '0' + sec;
		var value = '';
		value += hr==0? '' : hr+':';
		value += min===0 ? '00:' : min+':';
		value += sec;
		return value;
	}	
// 获得滚动条宽度
	function getScrollBarWidth(){
		var outerDiv = doc.createElement("div");
		outerDiv.className = "measureScroll-outerDiv";
		var innerDiv = doc.createElement("div");
		outerDiv.appendChild(innerDiv);
		doc.body.appendChild(outerDiv);
		var width = outerDiv.offsetWidth - outerDiv.clientWidth;
		doc.body.removeChild(outerDiv);
		return width
	}
// 页面禁止滚动
	function pageFix(){
		doc.body.style.overflowY = "hidden";
		doc.body.style.marginRight = getScrollBarWidth() + 'px';
	}
// 恢复页面滚动
	function pageUnFix(){
		doc.body.style.overflowY = "auto";
		doc.body.style.marginRight = '0';
	}

// 视频全屏显示
	function FullScreen(ele){
		if (ele.requestFullscreen) {
			ele.requestFullscreen();
		} else if (ele.msRequestFullscreen) {
			ele.msRequestFullscreen();
		} else if (ele.mozRequestFullScreen) {
			ele.mozRequestFullScreen();
		} else if (ele.webkitRequestFullscreen) {
			ele.webkitRequestFullscreen();
		}
	}

//////////////////////// 隐藏广告

	var nomore = doc.getElementById('nomore');
	var ad = doc.getElementById('ad');
	var cookie = getcookie();

	if (!cookie.ad) 
		ad.style.display="block";
	else
		ad.style.display='none';

	nomore.onclick = function(){
		ad.style.display = 'none';
		setcookie('ad', 1);
	}

///////////////////////// 登录

	var followbt = doc.getElementById('followbt');
	var cancel = doc.getElementById('cancel');
	var signin = doc.getElementById('signin');
	var dark = doc.getElementById('dark');
	var closeBt = doc.getElementById('closeBt');
	var fansNum = doc.getElementById('fans-num');
	var loginForm = doc.forms.logform;

// 成功登陆后的样式改变
	function toBeLogined(){
		fansNum.textContent = parseInt(fansNum.textContent)+1;
		followbt.className = "onfocused";
		cancel.style.display = "block";
		removelistener(followbt, 'click', followListen);
		hideLogin();
	}
// 判断是否已经关注
	function followSign(){
		var id;
		return {
			on: function(){
				id = 1;
			},
			off: function(){
				id = 0;
			},
			get: function(){
				return id;
			}
		}
	}
// 登陆执行函数
	function followFunc(sign){
		if (sign.get() == 1) return;
		cookie['loginSuc']==1 ? toBeLogined() : showLogin();

	}
// 取消关注执行函数 
	function cancelFunc(sign){
		fansNum.textContent = parseInt(fansNum.textContent)-1;
		followbt.className = "";
		cancel.style.display = "none";
		setcookie('loginSuc', 0);
		addlistener(followbt, 'click', followListen);
		sign.off();
	}
// 显示登录窗口
	function showLogin(){
		dark.style.display = "block";
		signin.style.display = 'block';
		pageFix();
	}
// 隐藏登录窗口
	function hideLogin(){
		dark.style.display = "none";
		signin.style.display = 'none';
		pageUnFix();
	}
// 用于ajax “get”方法的序列化数据
	function serialize(data){
		var type = Object.prototype.toString.call(data).slice(8,-1);
		if(type === 'Object'){
			var tmp = [];
			for (var k in data)
				tmp.push(k + '=' + data[k])
			return tmp.join('&');
		}else{
			try{
				throw "限定为对象数据";
			}catch(e){
				alert(e)
			}
		}
	}
// 登录失败提示函数
	function loginTip() {
		var p = doc.getElementById('loginerror');
		return {
			show: function(msg){
				p.style.display="block";
				p.innerHTML = msg;
			},
			hide: function(){
				p.style.display = 'none';
			}
		}
	}
// 检查输入的账号与密码
	function checkinput(userName, password, func){
		var loginTip = func();
		if (userName != "studyOnline"){
			loginTip.show("账号为 <b>studyOnline</b>");
			return;
		}else if(password != "study.163.com"){
			loginTip.show("密码为 <b>study.163.com</b>")
			return;
		}else{
			return 1;
		}
	}
// 发起get的ajax请求
	function getAjax(Url, str, callback){
		var newurl = Url + '?'+str;
		var xhr = new XMLHttpRequest();
		xhr.open('get', newurl);
		xhr.onreadystatechange = function(){
			if(xhr.readyState===4 && xhr.status===200){
				callback(xhr.responseText)
			}
		}
		xhr.send(null);
	}
// 处理get方法返回的数据
	function getText(msg){
		if (msg == 1) {
			toBeLogined();
			setcookie('loginSuc', 1);
			sign.on();
		}
	}
// 关闭登录窗口
	addlistener(closeBt, 'click', hideLogin)
// 注册关注与取消事件
	var btStatus = followSign();
	function followListen(){
		return followFunc(btStatus);
	}
	function cancelListen(){
		return cancelFunc(btStatus);
	}
	addlistener(followbt, 'click', followListen);
	addlistener(cancel, 'click', cancelListen);
// 如果已经登录，则默认登录状态
	if (cookie['loginSuc'] == 1) {
		toBeLogined();
		removelistener(followbt, 'click', followListen);
	}
// 监听表单的登录按钮
	addlistener(loginForm.submit, 'click', function(e){
		e.preventDefault();
		var userName = this.parentNode.userName.value;
		var password = this.parentNode.password.value;

		if (!checkinput(userName, password, loginTip))  return;

		var inputData = serialize({userName: hex_md5(userName), password: hex_md5(password)});
		getAjax('http://study.163.com/webDev/login.htm', inputData, getText);
	})


// 定义轮播原型
	function Banner( opt ){
		extend(this, opt);

		this.currentIndex = 0;
		this.sliderX = 0;
		this.moveHandler;

		this.carrier[0].style.left = '0';
		this.carrier[1].style.left = '100%';
		this.carrier[2].style.left = '-100%';

 		this.imgPlace = {
 			0: this.carrier[0].getElementsByTagName('img')[0],
 			1: this.carrier[1].getElementsByTagName('img')[0],
 			2: this.carrier[2].getElementsByTagName('img')[0],
 		}
 		this.imgPlace[0].src = this.images[0];
 		this.imgPlace[1].src = this.images[1];
 		this.imgPlace[2].src = this.images[this.images.length-1];

 		this.CtoI = {
 			0: 0,
 			1: 1,
 			2: this.images.length-1,
 		}
	}
// 定义 “下一张” 的方法
	Banner.prototype.next = function(fromClick){
		this.sliderX = this.sliderX-100;
		this.slider.style.webkitTransform = "translateX(" + this.sliderX + "%)";
		this.slider.style.MozTransform = "translateX(" + this.sliderX + "%)";
		this.slider.style.msTransform = "translateX(" + this.sliderX + "%)";
		this.slider.style.oTransform = "translateX(" + this.sliderX + "%)";
		this.slider.style.Transform = "translateX(" + this.sliderX + "%)";


		this.currentIndex = this.currentIndex == 2 ? 0 : this.currentIndex +1;
		
		var moveId = this.currentIndex+1>2 ? 0 : this.currentIndex+1;

		this.carrier[moveId].style.left = parseInt(this.carrier[moveId].style.left) + 300 +'%';

		this.imgPlace[moveId].src = (this.CtoI[this.currentIndex] ==this.images.length-1) ? this.images[0] : this.images[this.CtoI[this.currentIndex] + 1];

		this.CtoI[moveId] = (this.CtoI[this.currentIndex] ==this.images.length-1) ? 0 : this.CtoI[this.currentIndex] + 1;


		this.buttonChange();

		if (!!fromClick) this.keepStep();

	}
// 定义 “上一张” 的方法
	Banner.prototype.pre = function(fromClick){
		this.sliderX = this.sliderX+100;

		this.slider.style.webkitTransform = "translateX(" + this.sliderX + "%)";
		this.slider.style.MozTransform = "translateX(" + this.sliderX + "%)";
		this.slider.style.msTransform = "translateX(" + this.sliderX + "%)";
		this.slider.style.oTransform = "translateX(" + this.sliderX + "%)";
		this.slider.style.Transform = "translateX(" + this.sliderX + "%)";

		this.currentIndex = this.currentIndex == 0 ? 2 : this.currentIndex -1;

		var moveId = this.currentIndex-1<0 ? 2 : this.currentIndex-1;

		this.carrier[moveId].style.left = parseInt(this.carrier[moveId].style.left) - 300 +'%';

		this.imgPlace[moveId].src = (this.CtoI[this.currentIndex] - 1==-1) ? this.images[this.images.length-1] : this.images[this.CtoI[this.currentIndex] - 1];

		this.CtoI[moveId] = (this.CtoI[this.currentIndex] - 1== -1) ? this.images.length-1 : this.CtoI[this.currentIndex] - 1;

		this.buttonChange();

		if (!!fromClick) this.keepStep();
	}
// 定义点击按钮切换的方法
	Banner.prototype.buttonChange = function(targetId){
		var currentImgIndex = targetId || this.CtoI[this.currentIndex];
		// this.buttons
		for (var i=0,len=this.buttons.length; i<len; i++){
			if (i == currentImgIndex) this.buttons[i].classList.add('pb-selected');
			else this.buttons[i].classList.remove('pb-selected');
		}
	}
// 任意切换后，保持自动切换的时间间隔
	Banner.prototype.keepStep = function(){
		clearInterval(this.moveHandler);
		this.start();
	}
// 定义开始轮播的方法
	Banner.prototype.start = function(){
		this.moveHandler = setInterval(this.next.bind(this), 2000);
	}


// 定义轮播对象，并赋值
	var banner = new Banner({
		slider: doc.getElementById('banner-slider'),
		carrier: doc.getElementsByClassName('banner-pic'),
		images: [
			'source/banner1.jpg',
			'source/banner2.jpg',
			'source/banner3.jpg',
		],
		buttonContainer: doc.getElementById('playbuttons'),
		buttons: doc.getElementsByClassName('playbutton'),
	});

	banner.start();

// 获得向前向后按钮，并注册监听事件
	var pre = doc.getElementById('pre');
	var next = doc.getElementById('next');

	addlistener(pre, 'click', banner.pre.bind(banner))
	addlistener(next, 'click', banner.next.bind(banner))
// 监听底部切换按钮的单击事件
	addlistener(banner.buttonContainer, 'click', function(event){
			var target = event.target || event.srcElement;

			var targetId = Array.prototype.indexOf.call(target.parentNode.children,target);
			
			clearInterval(banner.moveHandler);
			banner.imgPlace[banner.currentIndex].src = banner.images[targetId];
			
			var nextIndex = banner.currentIndex+1>2 ? 0 : banner.currentIndex+1;
			var preIndex = banner.currentIndex-1<0 ? 2 : banner.currentIndex-1;

			var nextImgId = targetId+1==banner.images.length ? 0 : targetId+1;
			var preImgId = targetId-1 == -1 ? banner.images.length-1 : targetId-1;

			banner.imgPlace[nextIndex].src = banner.images[nextImgId];
			banner.imgPlace[preIndex].src = banner.images[preImgId];

			banner.CtoI[banner.currentIndex] = targetId;
			banner.CtoI[nextIndex] = nextImgId;
			banner.CtoI[preIndex] = preImgId;

			banner.buttonChange(targetId);

			banner.start()
	})

// 定义翻页导航列原型
	function NavPage(pageContainer){
		this.currentPage = 1;
		this.viewMid = 3;
		this.pageContainer = pageContainer;
		this.type;
		this.initId; //判断是否更新换页列
	}

	extend(NavPage.prototype, {
// 初始化翻页导航条
		init: function(totalPage){
			if (!this.initId) return;
			this.totalPage = totalPage;

			this.generatePageNav();
		},

// 生成默认翻页导航
		generatePageNav: function(){
			this.pageContainer.innerHTML = '';

			if (this.currentPage <=4) this.viewMid = 3;
			else if (this.currentPage >= this.totalPage-3) this.viewMid = this.totalPage-2;
			else this.viewMid = this.currentPage;


			var preli = doc.createElement('li'); preli.id = 'p-pre';
			this.pageContainer.appendChild(preli);

			var toOne = doc.createElement('li');
			toOne.textContent = "1... "; toOne.className = "pagenum"
			toOne.style.display = (this.currentPage <= 4) ? "none" : "block";
			this.pageContainer.appendChild(toOne);

			for (var i=this.viewMid-2; i<=this.viewMid+2; i++){
				var tmpli = doc.createElement('li');
				if (this.viewMid==3 || this.viewMid==this.totalPage-2){
					tmpli.className = i===this.currentPage? "pagenum pagenow" : "pagenum";
				}else{
					tmpli.className = i===this.viewMid? "pagenum pagenow" : "pagenum";
				}
				tmpli.textContent = i;
				this.pageContainer.appendChild(tmpli)
			}

			var latest = doc.createElement('li'); latest.className = "pagenum";
			latest.textContent = "... " + this.totalPage;
			latest.style.display = (this.currentPage >= this.totalPage-3) ? "none" : "block";
			this.pageContainer.appendChild(latest)

			var nextli = doc.createElement('li'); nextli.id = 'p-next';
			this.pageContainer.appendChild(nextli);

		
		},

// 注册单击监听事件，上一张，下一张，任意页
		listenclick: function(){
			var self = this;
			addlistener(this.pageContainer, 'click', function(e){
				var target = e.target || e.srcElement;
				switch (target.id){
					case "p-pre":
						if (self.currentPage === 1) {return}
						else {
							self.pageContainer.getElementsByClassName('pagenum pagenow')[0].className = "pagenum";
							getAjax('http://study.163.com/webDev/couresByCategory.htm', serialize(reqData.pageTo(--self.currentPage, self)), processClassData);
							self.generatePageNav();
						}
						break;
					case "p-next":
						if (self.currentPage === self.totalPage) return;
						else 
							self.pageContainer.getElementsByClassName('pagenum pagenow')[0].className = "pagenum";
							getAjax('http://study.163.com/webDev/couresByCategory.htm', serialize(reqData.pageTo(++self.currentPage, self)), processClassData);
							self.generatePageNav();
						break;
					case "":
						var clickPage = parseInt(target.textContent.replace('...', ''));
						self.currentPage = clickPage;
						if (clickPage<=4){
							self.viewMid = 3;
						}else if(clickPage >= self.totalPage-4){
							self.viewMid = self.totalPage-2;
						}else{
							self.viewMid = clickPage;
						}
						self.pageContainer.getElementsByClassName('pagenum pagenow')[0].className = "pagenum";
						getAjax('http://study.163.com/webDev/couresByCategory.htm', serialize(reqData.pageTo(clickPage, self)), processClassData);
						self.generatePageNav();
				}
			})
		},

	})
// 发起数据请求，并返回数据
	function requestData(){
		var data = {
			pageNo: 1,
			psize: 20,
			type: 10
		}
		return {
			pageTo: function(num, NavInstance){
				data.pageNo = num;
				NavInstance.initId = 0;
				return data;
			},
			type: function(num, NavInstance){
				data.type = num;
				data.pageNo = 1;
				if (NavInstance.type != num){
					NavInstance.initId = 1;
					NavInstance.type = num;
				}else{
					NavInstance.initId = 0;
				}
				return data;
			}
		}
	}
// 生成课程信息
	function processClassData(Data){
		var data = JSON.parse(Data);
		var container = doc.getElementById('classshow');

		container.innerHTML = "";
		var classesInfo = data.list;
		for (var i=0,len=classesInfo.length; i<len; i++){
			var insertStr = '<div class="class-intro">';
			var classInfo = classesInfo[i];
			insertStr += '<div><img class="class-pic" src="' + classInfo.middlePhotoUrl + '"><div class="cs-hov-show"><div class="cs-hov-up clearfix">';
			insertStr += '<img src="' + classInfo.middlePhotoUrl + '">';
			insertStr += '<h3 class="cs-h-title">' + classInfo.name + '</h3>';
			insertStr += '<p class="cs-h-num"><span>' + classInfo.learnerCount + '</span> 人在学</p>';
			insertStr += '<p class="cs-h-author">发布者： <span><a href="'+ classInfo.providerLink + '">' + classInfo.provider + '</a></span></p>';
			insertStr += '<p class="cs-h-field">分类： <span>' + classInfo.targetUser + '</span></p>'
			insertStr += '</div>';
			insertStr += '<div class="cs-h-des"><p>' + classInfo.description + '</p></div>';
			insertStr += '</div></div>';
			insertStr += '<div class="cs-descri">';
			insertStr += '<p class="text-intro"><a href="' + classInfo.providerLink + '">' + classInfo.name + '</a></p>';
			insertStr += '<p class="class-field"><a href="' + classInfo.providerLink +'">' + classInfo.provider + '</a></p>';
			insertStr += '<p class="class-join-num">' + classInfo.learnerCount + '</p>';
			var price = classInfo.price==0 ? '免费' : '￥'+classInfo.price;
			insertStr += '<p class="class-price">' +  price + '</p>';
			insertStr += '</div></div>';
			container.innerHTML += insertStr;
		}
			
		var picContainer = doc.getElementsByClassName('class-pic');
		for (var j=0,len=picContainer.length; j<len; j++){
			(function(id){
				var innerShow = doc.getElementsByClassName('cs-hov-show')[id];
				addlistener(picContainer[id], 'mouseenter', function(){
					innerShow.style.display="block";
				});
				addlistener(innerShow, 'mouseleave', function(){
					this.style.display="none";
				})
			})(j);
		}

		pageNav.init(data.totalPage);
	}

	var pageContainer = doc.getElementById('page'); // 获得翻页导航的容器
	var reqData = requestData();                    // 默认显示的数据

	var pageNav = new NavPage(pageContainer); // 创建翻页导航按钮组的实例
	pageNav.listenclick();

	getAjax('http://study.163.com/webDev/couresByCategory.htm', serialize(reqData.type(10, pageNav)), processClassData); // 获得默认显示课程数据


// 切换课程的类别
	var selectClass = doc.getElementById('class-select');
	addlistener(selectClass, 'click', function(e){
		var target = e.target || e.srcElement;

		if (target.className=="class-fenlei cs-selected") {
			return;
		}else{
			doc.getElementsByClassName('class-fenlei cs-selected')[0].className="class-fenlei";
			target.className="class-fenlei cs-selected";
		}

		pageNav.viewMid = 3;
		pageNav.currentPage = 1;
		switch (target.id){
			case "product-design":
				getAjax('http://study.163.com/webDev/couresByCategory.htm', serialize(reqData.type(10, pageNav)), processClassData);
				break;
			case "program-lang":
				getAjax('http://study.163.com/webDev/couresByCategory.htm', serialize(reqData.type(20, pageNav)), processClassData);
				break;
		}
	});

// 获得最热排行的容器元素
	var hotContainer = doc.getElementById('hot-container');

// 获得最热排行数据
	function getHotData(Data){
		var data = JSON.parse(Data);
		generateHot(data);

		var newData = generateData(data);

		setInterval(function(){            // 每隔两秒更新一个课程
			updateHot(newData.get());
		}, 2000);
	}
// 生成最热排行页面元素
	function generateHot(data){

		for (var i=0; i<=9; i++){
			var div = doc.createElement('div');
			div.className = "top-item clearfix";
			div.style.top = 70*i +'px';

			var img = doc.createElement('img');
			img.src = data[i].smallPhotoUrl;

			var span1 = doc.createElement('span');
			span1.textContent = data[i].name;

			var span2 = doc.createElement('span');
			span2.textContent = data[i].learnerCount;

			div.appendChild(img);
			div.appendChild(span1);
			div.appendChild(span2);
			hotContainer.appendChild(div);
		}
	}
// 循环数据，并返回最新项
	function generateData(ArrayData){
		var data = ArrayData;
		return {
			get: function(){
				var out = data.pop();
				data.unshift(out);
				return out;
				// return data;
			}
		};
	}
// 更新最热排行的数据
	function updateHot(ObjectData){
		var newEle = doc.createElement('div');
		newEle.className = "top-item clearfix";
		newEle.style.top = '-70px';

		var img = doc.createElement('img');
		img.src = ObjectData.smallPhotoUrl;

		var span1 = doc.createElement('span');
		span1.textContent = ObjectData.name;

		var span2 = doc.createElement('span');
		span2.textContent = ObjectData.learnerCount;

		newEle.appendChild(img);
		newEle.appendChild(span1);
		newEle.appendChild(span2);
		hotContainer.insertBefore(newEle, hotContainer.firstElementChild);

		var nodesArray = hotContainer.childNodes;


		setTimeout(function(){
		for (var i=0; i<nodesArray.length; i++){
			if (nodesArray[i].nodeType != 1) continue;
			var ct = parseInt(nodesArray[i].style.top);
			nodesArray[i].style.top = ct + 70 + 'px';
		}}, 10);             
		

		setTimeout(function(){
			hotContainer.removeChild(hotContainer.lastElementChild);
			}, 2010);

	}

	getAjax('http://study.163.com/webDev/hotcouresByCategory.htm', '', getHotData);




// 视频播放
// 定义视频原型

	function Video(argu){
		extend(this, argu);
		this.curX = '';   			// 按下“视频位置点”时鼠标相对游览器左边距离
		this.moved = '';   			// 判断是否可以拖动“视频位置点”
		this.secmoved = !0;			// “视频位置点”是否随视频的播放前进
		this.changeTo;				// 判断“视频位置点”是否可以跳转到新的位置
		this.bufferrate = '';		// 缓存的比例
		this.playPause.innerHTML = '<i class="fa fa-play"></i>';    // 显示播放按钮
		this.curLeft = parseInt(this.dot.style.left);				// “视频位置点”到容器最左边的距离
		this.volmove;				// 判断音量按钮是否可以拖动
		this.curVol = 0.5;			// 初始音量大小
		this.curVolDotBottom = 29;	// 音量按钮的高度
	}

	extend(Video.prototype, {
		// 初始化各种监听事件
		init: function(){
			this.wholeWidth= getComputedStyle(this.videoMain).getPropertyValue('width');	
			var self = this;
			self.videoMain.volume = 0.5;
			// 弹出视频窗
			addlistener(this.vBt, 'click', function(){
				self.videoMain.parentNode.parentNode.style.display = "block";
				dark.style.display = "block";
				pageFix();
			});
			// 关闭视频窗
			addlistener(this.vClose, 'click', function(){
				self.videoMain.parentNode.parentNode.style.display = "none";
				dark.style.display = "none";
				self.videoMain.pause();
				self.videoMain.currentTime = 0;
				pageUnFix();
			});
			// 控制播放或暂停
			addlistener(this.playPause, 'click', function(){
				if (self.videoMain.paused || self.videoMain.ended)
					self.videoMain.play();
				else
					self.videoMain.pause();
			});
			// 视频播放时，显示暂停按钮
			addlistener(this.videoMain, 'play', function(){
				self.playPause.innerHTML = '<i class="fa fa-pause"></i>';
			});
			// 视频暂停时，显示播放按钮
			addlistener(this.videoMain, 'pause', function(){
				self.playPause.innerHTML = '<i class="fa fa-play"></i>';
			});
			// 视频载入元数据后显示视频总长度
			addlistener(this.videoMain, 'loadedmetadata', function(){
				var vLong = doc.getElementById('all-long');
				vLong.textContent = ' ' + toTimeformat(this.duration);
			});
			// 随着播放时间的前进，更新已播放距离，“视频位置点”的位置
			addlistener(this.videoMain, 'timeupdate', function(){
				var now = doc.getElementById('v-current');
				var playbar = doc.getElementById('v-bar');
				now.textContent = toTimeformat(this.currentTime) + ' ';

				var passrate = this.currentTime / this.duration;

				playbar.style.width = passrate * parseInt(self.wholeWidth) + 'px';

				self.dotMove(passrate);

			});
			// 更新缓存距离，
			addlistener(this.videoMain, 'progress', function(){
				var vBuffer = doc.getElementById('v-buffer');
				self.bufferrate = this.seekable.end(this.seekable.length-1) / this.duration;
				vBuffer.style.width = self.bufferrate * parseInt(self.wholeWidth) + 'px';

			})
			// 鼠标在“视频位置点”上按下时，使其可以被拖动；不跟随时间推移；允许跳转
			addlistener(dot, 'mousedown', function(e){
				self.curX = e.clientX;
				self.moved = !0;
				self.secmoved = !1;
				self.changeTo = !0;

			});
			// 鼠标在移动时，实时改变“鼠标位置点”的位置
			addlistener(doc, 'mousemove', function(e){
				if (!self.moved) return;
				this.body.style.cursor = "pointer";

				var relativeMove = e.clientX - self.curX;

				self.curLeft += relativeMove;

				if ((self.curLeft>=0 && self.curLeft<5) || self.curLeft<0)
					self.dot.style.left = 0 + 'px';
				else if(self.curLeft>=self.wholeWidth-10)
					self.dot.style.left = self.wholeWidth-10+'px';
				else
					self.dot.style.left = self.curLeft+'px';

				self.curX = e.clientX;

			});
			// 鼠标松开时确认更新视频播放位置
			addlistener(doc, 'mouseup', function(e){
				this.body.style.cursor = "auto";

				self.moved = !1;
				self.secmoved = !0;

				if (!self.changeTo) return;
				var defaultLeft = self.videoMain.getBoundingClientRect().left;

				var newRate = (e.clientX-defaultLeft) / parseInt(self.wholeWidth);
				var newTime = newRate * self.videoMain.duration;

				self.videoMain.currentTime = newTime;
				self.changeTo = !1;

				self.videoMain.play();

			});
			// 鼠标按下音量按钮时获得可拖动权限
			addlistener(this.volume, 'mousedown', function(e){
				self.volmove = !0;
				self.curY = e.clientY;
			})
			// 鼠标拖动时改变音量大小
			addlistener(doc, 'mousemove', function(e){
				if (!self.volmove) return;
				var tmp = parseInt(self.volume.style.bottom) - (e.clientY - self.curY);

				var dotBottom = self.volDotMove(tmp);

				self.curY = e.clientY;

				var volume = (parseInt(self.volume.style.bottom)+4)/66;
				self.volValue(volume)

				self.curVol = volume;
				self.curVolDotBottom = dotBottom;

			});
			// 鼠标抬起时关闭改变音量的拖动权限
			addlistener(doc, 'mouseup', function(e){
				self.volmove = !1;
			});
			// 点击音量标志时，有声与静音之间切换，同时改变标志样式
			addlistener(this.volIcon, 'click', function(){
				if (this.className.indexOf('fa-volume-up')!=-1){
					self.volValue(0);
					self.volDotMove(-4);
					this.className = "fa fa-volume-off";
				}else{
					self.volValue(self.curVol);
					self.volDotMove(self.curVolDotBottom);
					this.className = "fa fa-volume-up";
				}

			});
			// 视频呢最大化
			addlistener(this.maxScreen, 'click', function(){
				FullScreen(self.videoMain);
			});
			// 鼠标进入视频区域时显示控制条
			addlistener(this.videoMain, 'mouseenter', function(){
				var dot = doc.getElementById('dot');
				var vControl = doc.getElementsByClassName('v-control')[0];
				var vProgess = doc.getElementsByClassName('v-progess')[0];

				dot.style.display = "block";
				vControl.style.bottom = "10px";
				vProgess.style.height = "10px";
			});
			// 离开视频区时隐藏控制条
			addlistener(this.videoMain.parentNode, 'mouseleave', function(){
				var dot = doc.getElementById('dot');
				var vControl = doc.getElementsByClassName('v-control')[0];
				var vProgess = doc.getElementsByClassName('v-progess')[0];

				dot.style.display = "none";
				vControl.style.bottom = "-26px";

				vProgess.style.height = "4px";
			})

		},
		// 定义改变音量位置的函数
		volDotMove: function(val){
			var colorbar = doc.getElementById('vol-colorbar');

			if (val <= -4)
				this.volume.style.bottom = '-4px';
			else if (val >= 62)
				this.volume.style.bottom = '62px';
			else
				this.volume.style.bottom = val + 'px';

			colorbar.style.height = parseInt(this.volume.style.bottom)+4+'px';

			return parseInt(this.volume.style.bottom);
		},
		// 定义“视频位置点”位移变化函数
		dotMove: function(rate){
			if (!this.secmoved) return;
			var leftDistance = rate * parseInt(this.wholeWidth);
			if (leftDistance<=5 && leftDistance>=0) 
				leftDistance = 0;
			else if(leftDistance <= parseInt(this.wholeWidth) && leftDistance >=parseInt(this.wholeWidth)-5)
				leftDistance = parseInt(this.wholeWidth)-10;
			else
				leftDistance -= 5;
			this.dot.style.left = leftDistance + 'px';
			this.curLeft = leftDistance;			
		},
		// 定义决定视频音量的函数
		volValue: function(volrate){
			this.videoMain.volume = volrate;
		}
	});



	var video = new Video({
		videoMain: doc.getElementsByTagName('video')[0],	// 视频元素
		vBt: doc.getElementById('v-show'),					// 使视频弹出的元素
		vClose: doc.getElementById('v-closeBt'),			// 使视频关闭的元素
		playPause: doc.getElementById('pl-pa'),				// 播放与暂定按钮
		dot: doc.getElementById('dot'),						// “视频位置点”按钮
		volume: doc.getElementById('v-vol-dot'),			// "音量调节点"
		volIcon: doc.getElementById('vol-icon'),			// “音量标志”
		maxScreen: doc.getElementById('maxScreen')			// 视频最大化元素
	});

	video.init();





})(window, document);


