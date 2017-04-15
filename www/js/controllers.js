angular.module('ss.controllers', [])

.controller('SheTuanCtrl', function($scope,PhotoService,localStorageService,SheTuanFactory,ENV,$ionicPopup,$ionicModal,$ionicLoading,$ionicActionSheet,$cordovaCamera,$cordovaFileTransfer) {
	$scope.mokuai='zxhd';//默认显示最新活动
	$scope.ENV=ENV;
    $scope.showloading=true;
	//获取服务器数据保存
        SheTuanFactory.getTopTopics($scope.mokuai);
       $scope.changeTab=function(index,mokuai){
            var a=document.getElementById('stTopTabList').getElementsByTagName('a');
            if(a[index].className == "tab-item active activated"){
               return false;
            }else{
                for (var i = 0; i < 2; i++) {
                    a[i].className = "tab-item ";
                }
                a[index].className = "tab-item active";
            }
			if(mokuai=='zxhd'){
				$scope.mokuai='zxhd';
				SheTuanFactory.getTopTopics('zxhd');
			}else{
				$scope.mokuai='styl';
				SheTuanFactory.getTopTopics('styl');
			}	 
        }
        //接收到刚才传过来的通知
        $scope.$on('zxhd.portalsUpdated', function() {
            $scope.zxhdListData=SheTuanFactory.getBackTopics('zxhd');
            // 停止广播ion-refresher
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.showloading=false;
        });
		//接收到刚才传过来的通知
        $scope.$on('styl.portalsUpdated', function() {
            $scope.stylListData=SheTuanFactory.getBackTopics('styl');
            // 停止广播ion-refresher
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.showloading=false;

        });
        $scope.hasNextPage = function() {
            return SheTuanFactory.hasNextPage($scope.mokuai);
        };
		 //下拉更新
	 $scope.doRefresh=function(){
			SheTuanFactory.getTopTopics($scope.mokuai);
            $scope.$broadcast('scroll.refreshComplete');
	 }
	 //上拉更新
        $scope.loadMore=function(){
           ShiWuZhaoLingFactory.getMoreTopics($scope.mokuai);
        }
		 // 发布交易参数
        $scope.cjstData = {
            mingCheng: '',
            sheTuanFuZeRen: '',
            chuangJianRiQi: '',
            weiXinQun: '',
			qqQun:'',
			jianJie:''
        }
var User = localStorageService.get('User');
$ionicModal.fromTemplateUrl("cjst.html", {
       scope: $scope,
        animation: "slide-in-up"
        }).then(function(modal) {
             $scope.modal = modal;
  });
  $scope.CJST = function() {
	if(User){
		$scope.modal.show();
	}else{
		$ionicLoading.show({template: '请先登录再发表', duration: 1000});
	}
      
  };
  $scope.close = function() {
      $scope.modal.hide();
  };
 $scope.addPhoto = function () {
    PhotoService.addPhoto('sheTuanImage');
	$scope.$on('sheTuanImage', function() {
            $scope.imageSrc=localStorageService.get('sheTuanImage');
        });
};
$scope.uploadPhoto = function () {
	if(User){
    var server = encodeURI($scope.ENV.baseUrl+'web/CA/CASheTuanXinXiServlet?action=notSecurity_MngSheTuanXinXi_add');
    var fileURL = $scope.imageSrc;
    var options = {
        fileKey: "file",//相当于form表单项的name属性
        fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
        mimeType: "image/jpeg",
		params:{
            mingCheng: $scope.cjstData.mingCheng,
            sheTuanFuZeRen: $scope.cjstData.sheTuanFuZeRen,
            chuangJianRiQi: $scope.cjstData.chuangJianRiQi,
			weiXinQun:$scope.cjstData.weiXinQun,
			qqQun:$scope.cjstData.qqQun,
			jianJie:$scope.cjstData.jianJie
		}		
    };
    $cordovaFileTransfer.upload(server, fileURL, options)
        .then(function (result) {
            // Success!
			$ionicPopup.alert({ title: '提示', template: "发布成功！", okText: '确定' });
			$scope.modal.hide();
			
        }, function (err) {
            // Error
			$ionicPopup.alert({ title: '提示', template: "发布失败，请重试！", okText: '确定' });
        }, function (progress) {
            // constant progress updates
        });
	}else{
		$ionicLoading.show({template: '请先登录再发表', duration: 1000});
	}

		};
 })
 .controller('ZxhdContentCtrl', function($scope,$stateParams,STContentFactory) {
        var id=$stateParams['id'];
        $scope.showloading=true;
        STContentFactory.getZXHD(id);
        $scope.$on('ZXHDContent.newsUpdated', function() {
            $scope.ZXHDContentData=STContentFactory.getZXHDBackTopics();
            $scope.showloading=false;
        });
 })
  .controller('StylContentCtrl', function($scope,STContentFactory,$stateParams,ENV) {
        var id=$stateParams['id'];
        $scope.showloading=true;
        $scope.ENV=ENV;
        STContentFactory.getSTYL(id);
        $scope.$on('STYLContent.newsUpdated', function() {
            $scope.STYLContentData=STContentFactory.getSTYLBackTopics();
            $scope.showloading=false;
        });
 })
.controller('ShiWuZhaoLingCtrl', function($scope,PhotoService,localStorageService,UserFactory,ShiWuZhaoLingFactory,ENV,$ionicPopup,$ionicModal,$ionicLoading,$ionicActionSheet,$cordovaCamera,$cordovaFileTransfer) {
        $scope.ENV=ENV;
        $scope.showloading=true;
        //获取服务器数据保存
        ShiWuZhaoLingFactory.getTopTopics();
        //接收到刚才传过来的通知
        $scope.$on('PortalList.portalsUpdated', function() {
            $scope.portalListData=ShiWuZhaoLingFactory.getBackTopics();
            // 停止广播ion-refresher
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.showloading=false;
        });
        $scope.hasNextPage = function() {
            return ShiWuZhaoLingFactory.hasNextPage();
        };
        //下拉更新
        $scope.doRefresh=function(){
            ShiWuZhaoLingFactory.getTopTopics();
            $scope.$broadcast('scroll.refreshComplete');
        }
        //上拉更新
        $scope.loadMore=function(){
            ShiWuZhaoLingFactory.getMoreTopics();
        }
        $scope.changeTab=function(shiFouDiuShi,index){
            var a=document.getElementById('swzlTopTabList').getElementsByTagName('a');
            if(a[index].className == "tab-item active activated"){
                return false;
            }else{
                for (var i = 0; i < 2; i++) {
                    a[i].className = "tab-item ";
                }
                a[index].className = "tab-item active";
                ShiWuZhaoLingFactory.setShiFouDiuShi(shiFouDiuShi);
            }
        }
 // 发布失物招领参数
        $scope.topicsData = {
            accesstoken: '',
            wuPinMingCheng: '',
            shiFouDiuShi: '',
            diDian: '',
			shiJian:'',
			teZheng:'',
			lianXiRen:'',
			lianXiDianHua:'',
			qqHaoMa:'',
			weiXinHaoMa:'',
			faBuZheId:'',
			faBuZheName:''
        }
		var User = localStorageService.get('User');
        if (User) {
            $scope.topicsData.accesstoken = User[0].accesstoken;
			$scope.topicsData.faBuZheId=User[0].id;
			$scope.topicsData.faBuZheName=User[0].niCheng;
        }
$ionicModal.fromTemplateUrl("release.html", {
       scope: $scope,
        animation: "slide-in-up"
        }).then(function(modal) {
             $scope.modal = modal;
  });
  $scope.release = function() {
	if(User){
		$scope.modal.show();
	}else{
		$ionicLoading.show({template: '请先登录再发表', duration: 1000});
	}  
  };
  $scope.close = function() {
      $scope.modal.hide();
  };
 $scope.addPhoto = function () {
    PhotoService.addPhoto('shiWuImage');
	$scope.$on('shiWuImage', function() {
            $scope.imageSrc=localStorageService.get('shiWuImage');
        });
};
$scope.uploadPhoto = function () {
	if(User){
	var requestParams = "&callback=JSON_CALLBACK";
    var server = encodeURI($scope.ENV.baseUrl+'web/LAF/LAFShiWuZhaoLingServlet?action=notSecurity_MngShiWuZhaoLingXinXi_upload'+requestParams);
    var fileURL = $scope.imageSrc;
    var options = {
        fileKey: "file",//相当于form表单项的name属性
        fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
        mimeType: "image/jpeg",
		params:{
            accesstoken: '',
            wuPinMingCheng: $scope.topicsData.wuPinMingCheng,
            shiFouDiuShi: $scope.topicsData.shiFouDiuShi,
            diDian: $scope.topicsData.diDian,
			shiJian:$scope.topicsData.shiJian,
			teZheng:$scope.topicsData.teZheng,
			lianXiRen:$scope.topicsData.lianXiRen,
			lianXiDianHua:$scope.topicsData.lianXiDianHua,
			qqHaoMa:$scope.topicsData.qqHaoMa,
			weiXinHaoMa:$scope.topicsData.weiXinHaoMa,
			faBuZheId:$scope.topicsData.faBuZheId,
			faBuZheName:$scope.topicsData.faBuZheName
		}		
    };
    $cordovaFileTransfer.upload(server, fileURL, options)
        .then(function (result) {
            // Success!
			$ionicPopup.alert({ title: '提示', template: "发布成功！", okText: '确定' });
			$scope.modal.hide();
			if("YES"==$scope.topicsData.shiFouDiuShi){
				$scope.changeTab($scope.topicsData.shiFouDiuShi,1);
			}else{
				$scope.changeTab($scope.topicsData.shiFouDiuShi,0);
			}	
        }, function (err) {
            // Error
			$ionicPopup.alert({ title: '提示', template: "发布失败，请重试！", okText: '确定' });
        }, function (progress) {
            // constant progress updates
        });
	}else{
		$ionicLoading.show({template: '请先登录再发表', duration: 1000});
	}
		};
})
 .controller('shiWuZhaoLingContentCtrl', function($scope,$rootScope,$ionicPopup,$stateParams,UserFactory,ShiWuZhaoLingContentFactory,ENV,localStorageService) {
        var id=$stateParams['id'];
        $scope.showloading=true;
        $scope.ENV=ENV;
        ShiWuZhaoLingContentFactory.get(id);
        $scope.$on('shiWuZhaoLingContent.newsUpdated', function() {
            $scope.shiWuZhaoLingContentData=ShiWuZhaoLingContentFactory.getBackTopics();
            $scope.showloading=false;
        });
		// 评论参数
        $scope.replyData = {
            accesstoken: '',
            content: '',
            reply_id: '',
			pingLunZhe:'',
			pingLunZheId:'',
			jieShouZheId:''
        }
		var User = localStorageService.get('User');
        if (User) {
            $scope.replyData.accesstoken = User[0].accesstoken;
			$scope.replyData.pingLunZheId =User[0].id;
			$scope.replyData.pingLunZhe = User[0].niCheng;
        }
		// 回复评论
        $scope.reReply = function (replyId, loginName,jieShouZheId) {
            $scope.replyData.content = '@' + loginName + ' ';
            $scope.replyData.reply_id = replyId;
			$scope.replyData.jieShouZheId=jieShouZheId;
        }
		// 提交评论
        $scope.saveReply = function () {
            if ($scope.replyData.content.indexOf('@') < 0) {
                $scope.replyData.reply_id = '0';
				$scope.replyData.jieShouZheId=$scope.shiWuZhaoLingContentData[0].faBuZheId;
            }
            var flag=ShiWuZhaoLingContentFactory.postReplie($stateParams.id, $scope.replyData.content,$scope.replyData.reply_id,$scope.replyData.pingLunZhe,$scope.replyData.pingLunZheId,$scope.replyData.jieShouZheId);			
			$scope.replyData.content = '';	
			ShiWuZhaoLingContentFactory.get(id);    
			}
        $rootScope.hideTabs='tabs-item-hide';

        //页面销毁
        $scope.$on('$destroy',function(){
            $rootScope.hideTabs = '';
        });
		//页面刚加载
        $scope.$on('$ionicView.beforeEnter', function() {
        });
 })
.controller('ChuXingCtrl', function($scope,ChuXingFactory,ENV) {
        $scope.ENV=ENV;
        $scope.showloading=true;
        //获取服务器数据保存
        ChuXingFactory.getTopTopics();
        //接收到刚才传过来的通知
        $scope.$on('ChuXing.portalsUpdated', function() {
            $scope.chuXingListData=ChuXingFactory.getBackTopics();
            // 停止广播ion-refresher
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.showloading=false;
        });
        $scope.hasNextPage = function() {
            return ChuXingFactory.hasNextPage();
        };
        //下拉更新
        $scope.doRefresh=function(){
            ChuXingFactory.getTopTopics();
            $scope.$broadcast('scroll.refreshComplete');
        }
        //上拉更新
        $scope.loadMore=function(){
            ChuXingFactory.getMoreTopics();
        }
})
 .controller('chuXingContentCtrl', function($scope,$rootScope,$stateParams,ChuXingContentFactory,ENV) {
        var id=$stateParams['id'];
        $scope.showloading=true;
        $scope.ENV=ENV;
        ChuXingContentFactory.get(id);
        $scope.$on('chuXingContent.newsUpdated', function() {
            $scope.ChuXingContentData=ChuXingContentFactory.getBackTopics();
            $scope.showloading=false;
        });
 })
.controller('XiaoYuanJiaoYiCtrl', function($scope,PhotoService,localStorageService,UserFactory,JiaoYiFactory,ENV,$ionicPopup,$ionicModal,$ionicLoading,$ionicActionSheet,$cordovaCamera,$cordovaFileTransfer) {
        $scope.ENV=ENV;
        $scope.showloading=true;
        //获取服务器数据保存
        JiaoYiFactory.getTopTopics();
        //接收到刚才传过来的通知
        $scope.$on('JiaoYi.portalsUpdated', function() {
            $scope.jiaoYilListData=JiaoYiFactory.getBackTopics();
            // 停止广播ion-refresher
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.showloading=false;
        });
        $scope.hasNextPage = function() {
            return JiaoYiFactory.hasNextPage();
        };
        //下拉更新
        $scope.doRefresh=function(){
            JiaoYiFactory.getTopTopics();
            $scope.$broadcast('scroll.refreshComplete');
        }
        //上拉更新
        $scope.loadMore=function(){
            JiaoYiFactory.getMoreTopics();
        }
 // 发布交易参数
        $scope.jiaoYiData = {
            wuPinMingCheng: '',
            wuPinJiaGe: '',
            wuPinmiaoShu: '',
            yongHuId: '',
			yongHuNiCheng:''
        }
		var User = localStorageService.get('User');
        if (User) {
			$scope.jiaoYiData.yongHuId=User[0].id;
			$scope.jiaoYiData.yongHuNiCheng=User[0].niCheng;
        }
$ionicModal.fromTemplateUrl("faBu.html", {
       scope: $scope,
        animation: "slide-in-up"
        }).then(function(modal) {
             $scope.modal = modal;
  });
  $scope.faBu = function() {
	if(User){
		$scope.modal.show();
	}else{
		$ionicLoading.show({template: '请先登录再发表', duration: 1000});
	} 
  };
  $scope.close = function() {
      $scope.modal.hide();
  };

 $scope.addPhoto = function () {
    PhotoService.addPhoto('jiaoYiImage');
	$scope.$on('jiaoYiImage', function() {
            $scope.imageSrc=localStorageService.get('jiaoYiImage');
        });
};
$scope.uploadPhoto = function () {
	if(User){
    var server = encodeURI($scope.ENV.baseUrl+'web/CTP/CTPJiaoYiXinXiServlet?action=notSecurity_MngJiaoYiXinXi_add');
    var fileURL = $scope.imageSrc;
    var options = {
        fileKey: "file",//相当于form表单项的name属性
        fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
        mimeType: "image/jpeg",
		params:{
            wuPinMingCheng: $scope.jiaoYiData.wuPinMingCheng,
            wuPinJiaGe: $scope.jiaoYiData.wuPinJiaGe,
            wuPinmiaoShu: $scope.jiaoYiData.wuPinmiaoShu,
			yongHuId:$scope.jiaoYiData.yongHuId,
			yongHuNiCheng:$scope.jiaoYiData.yongHuNiCheng
		}		
    };
    $cordovaFileTransfer.upload(server, fileURL, options)
        .then(function (result) {
            // Success!
			$ionicPopup.alert({ title: '提示', template: "发布成功！", okText: '确定' });
			$scope.modal.hide();			
        }, function (err) {
            // Error
			$ionicPopup.alert({ title: '提示', template: "发布失败，请重试！", okText: '确定' });
        }, function (progress) {
            // constant progress updates
        });
	}else{
		$ionicLoading.show({template: '请先登录再发表', duration: 1000});
	}
		};
})
 .controller('jiaoYiContentCtrl', function($scope,$rootScope,$stateParams,JiaoYiContentFactory,ENV) {
        var id=$stateParams['id'];
        $scope.showloading=true;
        $scope.ENV=ENV;
        JiaoYiContentFactory.get(id);
        $scope.$on('jiaoYiContent.newsUpdated', function() {
            $scope.JiaoYiContentData=JiaoYiContentFactory.getBackTopics();
            $scope.showloading=false;
        });
 })
.controller('MsgCtrl', function($scope,ENV,localStorageService,$state, $ionicPopup, $ionicLoading,$ionicHistory,UserFactory,ShiWuZhaoLingContentFactory) {
		// 评论参数
        $scope.replyData = {
            accesstoken: '',
            content: '',
			wuPinId:'',
            reply_id: '',
			pingLunZhe:'',
			pingLunZheId:'',
			jieShouZheId:''
        }
		var User = localStorageService.get('User');
		if(User){	
			$scope.replyData.accesstoken = User[0].accesstoken;
			$scope.replyData.pingLunZheId =User[0].id;
			$scope.replyData.pingLunZhe = User[0].niCheng;
		}else{
			$ionicLoading.show({template: '请先登录再发表', duration: 1000});
		}
		// 回复评论
        $scope.reReply = function (replyId,wuPinId,loginName,jieShouZheId) {
            $scope.replyData.content = '@' + loginName + ' ';
            $scope.replyData.reply_id = replyId;
			 $scope.replyData.wuPinId = wuPinId;
			$scope.replyData.jieShouZheId=jieShouZheId;
        }
		// 提交评论
        $scope.saveReply = function () {
            if ($scope.replyData.content.indexOf('@') < 0) {
                return false;
            }
			ShiWuZhaoLingContentFactory.postReplie($scope.replyData.wuPinId, $scope.replyData.content,$scope.replyData.reply_id,$scope.replyData.pingLunZhe,$scope.replyData.pingLunZheId,$scope.replyData.jieShouZheId);			
			$ionicPopup.alert({ title: '提示', template: "评论成功！", okText: '确定' });
			$scope.replyData.content = '';	
			}
		//页面刚加载
        $scope.$on('$ionicView.beforeEnter', function() {
			$scope.messageData=localStorageService.get('message');
        });
})
.controller('ZhuCeCtrl', function(ZhuCeFactory,PhotoService,$scope,ENV,$ionicLoading,$ionicActionSheet,$cordovaCamera,$cordovaFileTransfer,$state,$ionicPopup,localStorageService) {
	//注册数据
	$scope.user={
		  name: null,
          password: null,
		  queRenPassword:null
	}
    $scope.ENV=ENV;
    $scope.addPhoto = function () {
		PhotoService.addPhoto('zhuCeImage');
		$scope.$on('zhuCeImage', function() {
				$scope.imageSrc=localStorageService.get('zhuCeImage');
			});	
    };
$scope.register= function () {
	var flag;
	if($scope.user.name==null||$scope.user.name==''){
		$ionicLoading.show({template: '请输入昵称', duration: 1000});
		return false;
	}
	else if($scope.user.password==null||$scope.user.password==''){
		$ionicLoading.show({template: '请输入密码', duration: 1000});
		return false;
	}
	else if($scope.user.queRenPassword==null||$scope.user.queRenPassword==''){
		$ionicLoading.show({template: '请输入确认密码', duration: 1000});
		return false;
	}
	else if($scope.user.queRenPassword!==$scope.user.password){
		$ionicLoading.show({template: '两次密码不一致', duration: 1000});
		return false;
	}else {
		ZhuCeFactory.check($scope.user.name);
	}
	$scope.$on('ZhuCe.newsUpdated', function() {
			flag=ZhuCeFactory.getFlag();
			if(!flag){
			$ionicLoading.show({template: '昵称已经被注册！', duration: 1000});
			return false;
		}else{
	var server = encodeURI($scope.ENV.baseUrl+'web/UP/UPYongHuXinXiServlet?action=notSecurity_MngYongHuXinXi_add');
    var fileURL = $scope.imageSrc;
    var options = {
        fileKey: "file",//相当于form表单项的name属性
        fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
        mimeType: "image/jpeg",
		params:{
            niCheng: $scope.user.name,
            miMa:$scope.user.password
		}		
    };
    $cordovaFileTransfer.upload(server, fileURL, options)
        .then(function (result) {
            // Success!		
			$ionicPopup.alert({ title: '提示', template: "注册成功！", okText: '确定' });
				$state.go("login");
							
        }, function (err) {
            // Error
			$ionicPopup.alert({ title: '提示', template: "注册失败，请重试！", okText: '确定' });
        }, function (progress) {
            // constant progress updates
        });
		}
	});
	};
})
.controller('CeBianLanCtrl', function($scope,ENV,$interval,localStorageService,$state, $ionicPopup, $ionicHistory, $ionicViewSwitcher, $ionicLoading,$ionicSideMenuDelegate,UserFactory) {
		$scope.ENV=ENV;
		$scope.$on('UserLogin.newsUpdated', function() {
			$scope.userData=UserFactory.getUserData();
			UserFactory.getJieShouXinXi($scope.userData[0].id);
			//每一分钟刷新信息
			$scope.timeout_upd=$interval(function() {
				UserFactory.getJieShouXinXi($scope.userData[0].id);
			}, 60000);	
		});
		$scope.$on('messageData.newsUpdated', function(){
				$scope.messageData =UserFactory.getMessageData();
				localStorageService.set('message', $scope.messageData);
					});					
		$scope.$on('setPingLunYiDu.newsUpdated', function(){
			UserFactory.getJieShouXinXi($scope.userData[0].id);
					});
		$scope.zhuxiao = function(){
			$scope.userData='';
			$interval.cancel($scope.timeout_upd);  
			localStorageService.remove('User');
			localStorageService.remove('message');
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
			$state.go("login");
		};
	$scope.goMsg = function() {
			$ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
				UserFactory.setPingLunYiDu($scope.userData[0].id);
				$state.go("Msg");
		};
	$scope.goMySheTuan = function() {
			$ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
				UserFactory.setPingLunYiDu($scope.userData[0].id);
				$state.go("mySheTuan");
		};
	$scope.login = function() {
			$ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
				$state.go("login");
		};	
   })
.controller('LoginCtrl', function($scope,$interval,ENV,localStorageService,$state, $ionicPopup, $ionicHistory, $ionicViewSwitcher, $ionicLoading,$ionicSideMenuDelegate,UserFactory) {		
		$scope.zhuce = function() {
			$ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
				$state.go("zhuCe");
		};			
		$scope.ENV=ENV;
		 //表单数据
		 $scope.user = {
            name: null,
            password: null
        };
		$scope.doLogin = function() {
				var user = $scope.user;
				$ionicLoading.show({
					template: '用户登录中...'
				});
				UserFactory.login(user.name, user.password);
					$scope.$on('UserLogin.newsUpdated', function() {
					$scope.userData=UserFactory.getUserData();
					var user1=$scope.userData;	
					localStorageService.set('User', user1);
					$ionicLoading.hide();
					if(user1[0].success!==true){
						$ionicPopup.alert({ title: '用户登录失败', template: "登录失败", okText: '确定' });
					}else{
						$ionicHistory.nextViewOptions({
							disableAnimate: true,
							disableBack: true
						});
						$state.go("tab.sheTuan");
					}
			});
       };			
   })
   .controller('MySheTuanCtrl', function($scope,ENV,UserFactory,SheTuanFactory,$ionicModal,PhotoService,localStorageService,$state, $ionicPopup, $ionicLoading,$ionicHistory,$ionicActionSheet,$cordovaCamera,$cordovaFileTransfer) {
		$scope.ENV=ENV;
		var User = localStorageService.get('User');
		$scope.$on('messageData.newsUpdated', function(){
				$scope.messageData =UserFactory.getMessageData();
				localStorageService.set('message', $scope.messageData);
					});
		$scope.huoDongXinXiData={
			suoShuSheTuan:null,
            huoDongMingCheng:null,
            fuZeRen:null,
			muDi:null,
			baoMingShiJian:null,
			huoDongShiJian:null,
			diDian:null
		}
		$scope.xiuGaiData={
			    id:null,
				mingCheng:null,
			    sheTuanFuZeRen:null,
				weiXinQun:null,
				qqQun:null,
				jianJie:null,
				chuangJianRiQi:null
		   }
		$scope.faBuHuoDong=function(){
			$scope.huoDongXinXiData.suoShuSheTuan=$scope.messageData[0].sheTuanList[0].mingCheng;
				$scope.modal2.show();
		}
        $scope.xiuGai=function(){
			$scope.xiuGaiData.id=$scope.messageData[0].sheTuanList[0].id;
			$scope.xiuGaiData.mingCheng=$scope.messageData[0].sheTuanList[0].mingCheng;
			$scope.xiuGaiData.sheTuanFuZeRen=$scope.messageData[0].sheTuanList[0].sheTuanFuZeRen;
			$scope.xiuGaiData.weiXinQun=$scope.messageData[0].sheTuanList[0].weiXinQun;
			$scope.xiuGaiData.qqQun=$scope.messageData[0].sheTuanList[0].qqQun;
			$scope.xiuGaiData.jianJie=$scope.messageData[0].sheTuanList[0].jianJie;
			//$scope.xiuGaiData.chuangJianRiQi=$scope.messageData[0].sheTuanList[0].chuangJianRiQi;
			$scope.modal.show();
		}
		$scope.addPhoto = function () {
		PhotoService.addPhoto('mySheTuanImage');
		$scope.$on('mySheTuanImage', function() {
				$scope.imageSrc=localStorageService.get('mySheTuanImage');
			});	
        };
		$ionicModal.fromTemplateUrl("sheTuanXiuGai.html", {
                  scope: $scope,
                  animation: "slide-in-up"
             }).then(function(modal) {
                $scope.modal = modal;
               });
	    $ionicModal.fromTemplateUrl("faBuHuoDong.html", {
                  scope: $scope,
                  animation: "slide-in-up"
             }).then(function(modal) {
                $scope.modal2 = modal;
               });
       $scope.close = function() {
           $scope.modal.hide();
           };
		$scope.close2 = function() {
           $scope.modal2.hide();
           };
		$scope.faBu=function(){
			SheTuanFactory.saveHuoDongXinXi($scope.huoDongXinXiData);
			$scope.$on('saveHuoDongXinXi', function() {
				$ionicPopup.alert({ title: '提示', template: "发布成功！", okText: '确定' });
				$scope.modal2.hide();
			});	
		}
		$scope.save = function() {
		 if(User){
			var server = encodeURI(ENV.baseUrl+'web/CA/CASheTuanXinXiServlet?action=notSecurity_MngSheTuanXinXi_update');
            var fileURL = $scope.imageSrc;
            var options = {
               fileKey: "file",//相当于form表单项的name属性
               fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
               mimeType: "image/jpeg",
		       params:{
			   id: $scope.xiuGaiData.id,
			   mingCheng: $scope.xiuGaiData.mingCheng,
               sheTuanFuZeRen: $scope.xiuGaiData.sheTuanFuZeRen,
               weiXinQun:$scope.xiuGaiData.weiXinQun,
               qqQun:$scope.xiuGaiData.qqQun,
			   jianJie:$scope.xiuGaiData.jianJie,
               chuangJianRiQi:$scope.xiuGaiData.chuangJianRiQi==null?$scope.messageData[0].sheTuanList[0].chuangJianRiQi:$scope.xiuGaiData.chuangJianRiQi
		      }		
           };
        $cordovaFileTransfer.upload(server, fileURL, options)
           .then(function (result) {
            // Success!		
			$ionicPopup.alert({ title: '提示', template: "修改成功！", okText: '确定' });
			UserFactory.getJieShouXinXi(User[0].id);
				$scope.modal.hide();
          }, function (err) {
            // Error
			$ionicPopup.alert({ title: '提示', template: "修改失败，请重试！", okText: '确定' });
          }, function (progress) {
            // constant progress updates
          });			
		}else{
			$ionicLoading.show({template: '请先登录', duration: 1000});
		}
      };		
		//页面刚加载
        $scope.$on('$ionicView.beforeEnter', function() {
			$scope.messageData=localStorageService.get('message');
        });
});