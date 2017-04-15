angular.module('ss.pluginServices', ['ngCordova'])  
    // Toast服务
    .service('ToastService', ['$cordovaToast', function ($cordovaToast) {
        return {
            showShortTop: function (message) {
                $cordovaToast.showShortTop(message);
            },
            showShortCenter: function (message) {
                $cordovaToast.showShortCenter(message);
            },
            showShortBottom: function (message) {
                $cordovaToast.showShortBottom("再按一次退出");
            },
            showLongTop: function (message) {
                $cordovaToast.showLongTop(message);
            },
            showLongCenter: function (message) {
                $cordovaToast.showLongCenter(message);
            },
            showLongBottom: function (message) {
                $cordovaToast.showLongBottom(message);
            }
        }
    }])
	 .service('getPictureService', ['$cordovaCamera','localStorageService','$rootScope', function ($cordovaCamera,localStorageService,$rootScope) {
        return {
            takePhoto: function (mokuai) {
               var options = {
					quality: 100,
					destinationType: Camera.DestinationType.FILE_URI,//Choose the format of the return value.
					sourceType: Camera.PictureSourceType.CAMERA,//资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
					targetWidth: 150,//头像宽度
					targetHeight: 150//头像高度
					};

					$cordovaCamera.getPicture(options)
						.then(function (imageURI) {
							//Success
							localStorageService.set(mokuai,imageURI);
							 $rootScope.$broadcast(mokuai);
						}, function (err) {
							// Error
						});
				},
					pickImage: function (mokuai) {
						var options = {
							quality: 100,
							destinationType: Camera.DestinationType.FILE_URI,//Choose the format of the return value.
							sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,//资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
							targetWidth: 150,//头像宽度
							targetHeight: 150//头像高度
						};

					$cordovaCamera.getPicture(options)
						.then(function (imageURI) {
							//Success
							localStorageService.set(mokuai,imageURI);
							$rootScope.$broadcast(mokuai);
						}, function (err) {
							// Error
						});
					}
			}
    }])
    .service('PhotoService', ['getPictureService','localStorageService','ENV','$ionicActionSheet','$cordovaCamera','$cordovaFileTransfer', function (getPictureService,localStorageService,ENV,$ionicActionSheet,$cordovaCamera,$cordovaFileTransfer) {
        return {

			//add
			 addPhoto : function (mokuai) {
					$ionicActionSheet.show({
						cancelOnStateChange: true,
						cssClass: 'action_s',
						titleText: "请选择获取图片方式",
						buttons: [
							{text: '相机'},
							{text: '图库'}
						],
						cancelText: '取消',
						cancel: function () {
							return true;
						},
						buttonClicked: function (index) {

							switch (index) {
								case 0:
									getPictureService.takePhoto(mokuai);
									break;
								case 1:
									getPictureService.pickImage(mokuai);
									break;
								default:
									break;
							}
							return true;
						}
					});
				}
        }
    }])
