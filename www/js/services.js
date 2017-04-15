/**
 * Created by zhuchaochao on 2016/6/29.
 */
angular.module('ss.services', [])
    .factory('ShiWuZhaoLingFactory',function($rootScope,$resource,ENV){
        var queryUrl=ENV.baseUrl+"web/LAF/LAFShiWuZhaoLingServlet";
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            topics = {}
        ShiFouDiuShi="NO";
        rows=5;   //一页显示5条
        var resource = $resource(queryUrl, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngShiWuZhaoLingXinXi_query',
                    shiFouDiuShi: '@shiFouDiuShi',
                    page: '@page',
                    rows:'@rows'
                },
                timeout: 20000
            }
        });
        return {
            //获取第一页的数据
            getTopTopics:function(){
                var hasNextPage = false;   //是否有下一页
                resource.query({
                    shiFouDiuShi:ShiFouDiuShi,
                    page:1,
                    rows:rows
                }, function (r) {
                    totalPage=parseInt((r.total-1)/rows)+1;
                    if (totalPage > 1) {  //来判断是否有下一页数据
                        hasNextPage = true;
                    }else{
                        hasNextPage = false
                    }
                    topics[rows]={
                        hasNextPage:hasNextPage,
                        'nextPage': 2,
                        'data': r.rows
                    }
                    //在这里请求完成以后  通知controller
                    $rootScope.$broadcast('PortalList.portalsUpdated');
                })
            } ,
            //返回我们保存的数据
            getBackTopics:function(){
                if(topics[rows]===undefined){
                    return false
                }
                return topics[rows].data;
            },
            getMoreTopics:function(){
                //为了解决一步加载的时候数据还没有加载完成  然后请求loadMore的时候  找不到数据
                if(topics[rows]===undefined){
                    return false;
                }
                //获取以前的数据
                var hasNextPage=topics[rows].hasNextPage;
                var nextPage=topics[rows].nextPage;
                var moreTopicsData=topics[rows].data;
                resource.query({
                    shiFouDiuShi:ShiFouDiuShi,
                    rows:rows,
                    page:nextPage
                }, function (r) {
                    totalPage=parseInt((r.total-1)/rows)+1;
                    if (totalPage>nextPage) {  //来判断是否有下一页数据
                        hasNextPage = true;
                        nextPage++
                    }else{
                        hasNextPage = false;
                    }
                    moreTopicsData=moreTopicsData.concat(r.rows);
                    topics[rows]={
                        hasNextPage:hasNextPage,
                        'nextPage': nextPage,
                        'data': moreTopicsData
                    }
                    //在这里请求完成以后  通知controller
                    $rootScope.$broadcast('PortalList.portalsUpdated');

                })
            },
            setShiFouDiuShi:function(shiFouDiuShi){   //点击分类加载数据
                ShiFouDiuShi=shiFouDiuShi;
                this.getTopTopics();
            },
            hasNextPage: function() {
                if (topics[rows] === undefined) {
                    return false;
                }
                return topics[rows].hasNextPage;
            }
        }
    })
    //失物详情
    .factory('ShiWuZhaoLingContentFactory', function($resource,$rootScope,ENV,$q,$ionicPopup) {
        var queryUrl=ENV.baseUrl+"web/LAF/LAFShiWuZhaoLingServlet";
		var queryUrl2=ENV.baseUrl+"web/LAF/LAFShiWuZhaoLingPingLunXinXiServlet";
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            topic = {};
        var resource = $resource(queryUrl, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngShiWuZhaoLingXinXi_view',
                    id: '@id'
                },
                timeout: 20000
            }
        });
		var resource2 = $resource(queryUrl2, {}, {
            query: {
                method: 'post',
                params: {
                    action:'notSecurity_MngShiWuZhaoLingPingLunXinXi_add',
                    wuPinID: '@wuPinID',
					pid:'@pid',
					neiRong:'@neiRong',
					pingLunZhe:'@pingLunZhe'
                },
                timeout: 20000
            }
        });
        return {
            get: function(id) {				
                return resource.query({
                    id: id
                }, function(r) {
                    topic[1]={
                        'data': r.rows
                    }
                    $rootScope.$broadcast('shiWuZhaoLingContent.newsUpdated');
                });				
            },
            getBackTopics: function() {
                if(topic[1]===undefined){
                    return false
                }
                return topic[1].data;
            },
			 postReplie: function(wuPinID,neiRong,pid,pingLunZhe,pingLunZheId,jieShouZheId) {		
                 return resource2.query({
                    wuPinID: wuPinID,
					neiRong:neiRong,
					pid:pid,
					pingLunZhe:pingLunZhe,
					pingLunZheId:pingLunZheId,
					jieShouZheId:jieShouZheId,
					shiFouYiDu:'NO'
                },function(r) {
					if (r.success)
					{
						return "成功";
					}else{
						return "失败";
						}
                });				
            }
        };
    })
	.factory('UserFactory', function($resource,$rootScope,ENV,$q){
		var queryUrl=ENV.baseUrl+"web/UP/UPLoginServlet";
		var queryUrl2=ENV.baseUrl+"web/UP/UPYongHuXinXiServlet";
		userData = {};
		messageData={};
		var resource = $resource(queryUrl, {}, {
            query: {
                method: 'post',
                params: {
                    action:'notSecurity_MngYongHuXinXi_login',
                    niCheng: '@niCheng',
					miMa:'@miMa'
                },
                timeout: 20000
            }
        });
		var resource2 = $resource(queryUrl2, {}, {
            query: {
                method: 'post',
                params: {
                    action:'notSecurity_MngYongHuXinXi_view',
                    id: '@id'
                },
                timeout: 20000
            }
        });
		var resource3 = $resource(queryUrl2, {}, {
            query: {
                method: 'post',
                params: {
                    action:'notSecurity_MngYongHuXinXi_set',
                    id: '@id'
                },
                timeout: 20000
            }
        });
		return {
            login: function(name,password) {				
                return resource.query({
                    niCheng: name,
					miMa:password
                }, function(r) {
                    userData[1]={
                        'data': r.rows
                    }
                    $rootScope.$broadcast('UserLogin.newsUpdated');
                });				
            },
			getJieShouXinXi: function(id) {				
                return resource2.query({
                    id:id
                }, function(r) {
                    messageData[1]={
						'data':r.rows
					}
				$rootScope.$broadcast('messageData.newsUpdated');
                });				
            },
			setPingLunYiDu: function(id) {				
                return resource3.query({
                    id:id
                }, function(r) {
				$rootScope.$broadcast('setPingLunYiDu.newsUpdated');
                });				
            },
			getUserData: function() {
                if(userData[1]===undefined){
                    return false
                }
                return userData[1].data;
            },
			getMessageData: function() {
                if(messageData[1]===undefined){
                    return false
                }
                return messageData[1].data;
            }
		}
	})
.factory('ZhuCeFactory', function($resource,$rootScope,ENV,$q){
		var queryUrl=ENV.baseUrl+"web/UP/UPYongHuXinXiServlet";
		var flag='';
		var resource = $resource(queryUrl, {}, {
            query: {
                method: 'post',
                params: {
                    action:'notSecurity_MngYongHuXinXi_check',
                    niCheng: '@niCheng',				
                },
                timeout: 20000
            }
        });
		return {		
			check: function(name) {				
                return resource.query({
                    niCheng: name
                }, function(r) {
					flag = r.success;
					console.log("check");
					 $rootScope.$broadcast('ZhuCe.newsUpdated');
					flag='';
                });				
            },
			getFlag: function(){
				if(flag==undefined||flag==''){
                    return false
                }
				return flag;
			}
		}
})
.factory('SheTuanFactory',function($rootScope,$resource,ENV){
        var queryUrl1=ENV.baseUrl+"/web/CA/CASheTuanHuoDongXinXiServlet";
		var queryUrl2=ENV.baseUrl+"/web/CA/CASheTuanXinXiServlet";
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
         HuoDongXinXiTopics = {};
		 SheTuanXinXiTopics = {};
        rows=5;   //一页显示5条
        var resource1 = $resource(queryUrl1, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngSheTuanHuoDongXinXi_query',
                    page: '@page',
                    rows:'@rows'
                },
                timeout: 20000
            }
        });
		var resource2 = $resource(queryUrl2, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngSheTuanXinXi_query',
                    page: '@page',
                    rows:'@rows'
                },
                timeout: 20000
            }
        });
       var resource3 = $resource(queryUrl1, {}, {
            query: {
                method: 'post',
                params: {
                    action:'notSecurity_MngSheTuanHuoDongXinXi_add',
                    suoShuSheTuan: '@suoShuSheTuan',
                    huoDongMingCheng:'@huoDongMingCheng',
                    fuZeRen:'@fuZeRen',
					muDi:'@muDi',
					baoMingShiJian:'@baoMingShiJian',
					huoDongShiJian:'@huoDongShiJian',
					diDian:'@diDian'
                },
                timeout: 20000
            }
        });
        return {
            saveHuoDongXinXi:function(huoDongXinxiData){
				resource3.query({
						suoShuSheTuan:huoDongXinxiData.suoShuSheTuan,
                        huoDongMingCheng:huoDongXinxiData.huoDongMingCheng,
                        fuZeRen:huoDongXinxiData.fuZeRen,
					    muDi:huoDongXinxiData.muDi,
					    baoMingShiJian:huoDongXinxiData.baoMingShiJian,
					    huoDongShiJian:huoDongXinxiData.huoDongShiJian,
					    diDian:huoDongXinxiData.diDian
					}, function (r) {
						//在这里请求完成以后  通知controller
						$rootScope.$broadcast('saveHuoDongXinXi');
					})
			},
            //获取第一页的数据
            getTopTopics:function(mokuai){
				if(mokuai=='zxhd'){
					var zxhdHasNextPage = false;   //是否有下一页
					resource1.query({
						page:1,
						rows:rows
					}, function (r) {
						totalPage=parseInt((r.total-1)/rows)+1;
						if (totalPage > 1) {  //来判断是否有下一页数据
							zxhdHasNextPage = true;
						}else{
							zxhdHasNextPage = false
						}
						HuoDongXinXiTopics[rows]={
							hasNextPage:zxhdHasNextPage,
							'nextPage': 2,
							'data': r.rows
						}
						//在这里请求完成以后  通知controller
						$rootScope.$broadcast('zxhd.portalsUpdated');
					})
				}else{
					var stylHasNextPage = false;   //是否有下一页
						resource2.query({
							page:1,
							rows:rows
						}, function (r) {
							totalPage=parseInt((r.total-1)/rows)+1;
							if (totalPage > 1) {  //来判断是否有下一页数据
								stylHasNextPage = true;
							}else{
								stylHasNextPage = false
							}
							SheTuanXinXiTopics[rows]={
								hasNextPage:stylHasNextPage,
								'nextPage': 2,
								'data': r.rows
							}
							//在这里请求完成以后  通知controller
							$rootScope.$broadcast('styl.portalsUpdated');
						})
				}                
            } ,
            //返回我们保存的数据
            getBackTopics:function(mokuai){
				if(mokuai=='zxhd'){
					if(HuoDongXinXiTopics[rows]===undefined){
						 return false
						}
					 return HuoDongXinXiTopics[rows].data;
				}else{
					if(SheTuanXinXiTopics[rows]===undefined){
						 return false
						}
					 return SheTuanXinXiTopics[rows].data;
				}
            },
          getMoreTopics:function(mokuai){
			if(mokuai=='zxhd'){
				        //为了解决一步加载的时候数据还没有加载完成  然后请求loadMore的时候  找不到数据
                if(HuoDongXinXiTopics[rows]===undefined){
                    return false;
                }
                //获取以前的数据
                var hasNextPage=HuoDongXinXiTopics[rows].hasNextPage;
                var nextPage=HuoDongXinXiTopics[rows].nextPage;
                var moreTopicsData=HuoDongXinXiTopics[rows].data;
                resource.query({
                    rows:rows,
                    page:nextPage
                }, function (r) {
                    totalPage=parseInt((r.total-1)/rows)+1;
                    if (totalPage>nextPage) {  //来判断是否有下一页数据
                        hasNextPage = true;
                        nextPage++
                    }else{
                        hasNextPage = false;
                    }
                    moreTopicsData=moreTopicsData.concat(r.rows);
                    HuoDongXinXiTopics[rows]={
                        hasNextPage:hasNextPage,
                        'nextPage': nextPage,
                        'data': moreTopicsData
                    }
                    //在这里请求完成以后  通知controller
                    $rootScope.$broadcast('zxhd.portalsUpdated');
                })
			}else{
				 if(SheTuanXinXiTopics[rows]===undefined){
                    return false;
                }
                //获取以前的数据
                var hasNextPage=SheTuanXinXiTopics[rows].hasNextPage;
                var nextPage=SheTuanXinXiTopics[rows].nextPage;
                var moreTopicsData=SheTuanXinXiTopics[rows].data;
                resource.query({
                    rows:rows,
                    page:nextPage
                }, function (r) {
                    totalPage=parseInt((r.total-1)/rows)+1;
                    if (totalPage>nextPage) {  //来判断是否有下一页数据
                        hasNextPage = true;
                        nextPage++
                    }else{
                        hasNextPage = false;
                    }
                    moreTopicsData=moreTopicsData.concat(r.rows);
                    SheTuanXinXiTopics[rows]={
                        hasNextPage:hasNextPage,
                        'nextPage': nextPage,
                        'data': moreTopicsData
                    }
                    //在这里请求完成以后  通知controller
                    $rootScope.$broadcast('styl.portalsUpdated');
					})
				}              
              },
            hasNextPage: function(mokuai) {
				if(mokuai=='zxhd'){
				     if (HuoDongXinXiTopics[rows] === undefined) {
                      return false;
                     }
                  return HuoDongXinXiTopics[rows].hasNextPage;
				}else{
					if (SheTuanXinXiTopics[rows] === undefined) {
                      return false;
                     }
                  return SheTuanXinXiTopics[rows].hasNextPage;
				}                
            }
        }
    })	
//社团详情
.factory('STContentFactory', function($resource,$rootScope,ENV) {
        var queryUrl1=ENV.baseUrl+"/web/CA/CASheTuanXinXiServlet";
		var queryUrl2=ENV.baseUrl+"/web/CA/CASheTuanHuoDongXinXiServlet";
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            STYLtopic = {};
			ZXHDtopic = {};
        var resource1 = $resource(queryUrl1, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngSheTuanXinXi_view',
                    id: '@id'
                },
                timeout: 20000
            }
        });
		 var resource2 = $resource(queryUrl2, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngSheTuanHuoDongXinXi_view',
                    id: '@id'
                },
                timeout: 20000
            }
        });
    return {
            getSTYL: function(id) {				
                return resource1.query({
                    id: id
                }, function(r) {
                    STYLtopic[1]={
                        'data': r.rows
                    }
                    $rootScope.$broadcast('STYLContent.newsUpdated');
                });				
            },
            getSTYLBackTopics: function() {
                if(STYLtopic[1]===undefined){
                    return false
                }
                return STYLtopic[1].data;
            },
		 getZXHD: function(id) {				
                return resource2.query({
                    id: id
                }, function(r) {
                    ZXHDtopic[1]={
                        'data': r.rows
                    }
                    $rootScope.$broadcast('ZXHDContent.newsUpdated');
                });				
            },
            getZXHDBackTopics: function() {
                if(ZXHDtopic[1]===undefined){
                    return false
                }
                return ZXHDtopic[1].data;
            }
        };
    })
.factory('ChuXingFactory',function($rootScope,$resource,ENV){
        var queryUrl=ENV.baseUrl+"web/TT/TTChuXingXinXiServlet";
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            topics = {}
        rows=5;   //一页显示5条
        var resource = $resource(queryUrl, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngChuXingXinXi_query',
                    page: '@page',
                    rows:'@rows'
                },
                timeout: 20000
            }
        });
        return {
            //获取第一页的数据
            getTopTopics:function(){
                var hasNextPage = false;   //是否有下一页
                resource.query({
                    page:1,
                    rows:rows
                }, function (r) {
                    totalPage=parseInt((r.total-1)/rows)+1;
                    if (totalPage > 1) {  //来判断是否有下一页数据
                        hasNextPage = true;
                    }else{
                        hasNextPage = false
                    }
                    topics[rows]={
                        hasNextPage:hasNextPage,
                        'nextPage': 2,
                        'data': r.rows
                    }
                    //在这里请求完成以后  通知controller
                    $rootScope.$broadcast('ChuXing.portalsUpdated');
                })
            } ,
            //返回我们保存的数据
            getBackTopics:function(){
                if(topics[rows]===undefined){
                    return false
                }
                return topics[rows].data;
            },
            getMoreTopics:function(){
                //为了解决一步加载的时候数据还没有加载完成  然后请求loadMore的时候  找不到数据
                if(topics[rows]===undefined){
                    return false;
                }
                //获取以前的数据
                var hasNextPage=topics[rows].hasNextPage;
                var nextPage=topics[rows].nextPage;
                var moreTopicsData=topics[rows].data;
                resource.query({
                    rows:rows,
                    page:nextPage
                }, function (r) {
                    totalPage=parseInt((r.total-1)/rows)+1;
                    if (totalPage>nextPage) {  //来判断是否有下一页数据
                        hasNextPage = true;
                        nextPage++
                    }else{
                        hasNextPage = false;
                    }
                    moreTopicsData=moreTopicsData.concat(r.rows);
                    topics[rows]={
                        hasNextPage:hasNextPage,
                        'nextPage': nextPage,
                        'data': moreTopicsData
                    }
                    //在这里请求完成以后  通知controller
                    $rootScope.$broadcast('ChuXing.portalsUpdated');
                })
            },
            hasNextPage: function() {
                if (topics[rows] === undefined) {
                    return false;
                }
                return topics[rows].hasNextPage;
            }
        }
    })
	 //出行详情
    .factory('ChuXingContentFactory', function($resource,$rootScope,ENV) {
        var queryUrl=ENV.baseUrl+"web/TT/TTChuXingXinXiServlet";
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            topic = {};
        var resource = $resource(queryUrl, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngChuXingXinXi_view',
                    id: '@id'
                },
                timeout: 20000
            }
        });	
        return {
            get: function(id) {				
                return resource.query({
                    id: id
                }, function(r) {
                    topic[1]={
                        'data': r.rows
                    }
                    $rootScope.$broadcast('chuXingContent.newsUpdated');
                });				
            },
            getBackTopics: function() {
                if(topic[1]===undefined){
                    return false
                }
                return topic[1].data;
            }
        };
    })
.factory('JiaoYiFactory',function($rootScope,$resource,ENV){
        var queryUrl=ENV.baseUrl+"web/CTP/CTPJiaoYiXinXiServlet";
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            topics = {}
        rows=5;   //一页显示5条
        var resource = $resource(queryUrl, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngJiaoYiXinXi_query',
                    page: '@page',
                    rows:'@rows'
                },
                timeout: 20000
            }
        });
        return {
            //获取第一页的数据
            getTopTopics:function(){
                var hasNextPage = false;   //是否有下一页
                resource.query({
                    page:1,
                    rows:rows
                }, function (r) {
                    totalPage=parseInt((r.total-1)/rows)+1;
                    if (totalPage > 1) {  //来判断是否有下一页数据
                        hasNextPage = true;
                    }else{
                        hasNextPage = false
                    }
                    topics[rows]={
                        hasNextPage:hasNextPage,
                        'nextPage': 2,
                        'data': r.rows
                    }
                    //在这里请求完成以后  通知controller
                    $rootScope.$broadcast('JiaoYi.portalsUpdated');
                })
            } ,
            //返回我们保存的数据
            getBackTopics:function(){
                if(topics[rows]===undefined){
                    return false
                }
                return topics[rows].data;
            },
            getMoreTopics:function(){
                //为了解决一步加载的时候数据还没有加载完成  然后请求loadMore的时候  找不到数据
                if(topics[rows]===undefined){
                    return false;
                }
                //获取以前的数据
                var hasNextPage=topics[rows].hasNextPage;
                var nextPage=topics[rows].nextPage;
                var moreTopicsData=topics[rows].data;
                resource.query({
                    rows:rows,
                    page:nextPage
                }, function (r) {
                    totalPage=parseInt((r.total-1)/rows)+1;
                    if (totalPage>nextPage) {  //来判断是否有下一页数据
                        hasNextPage = true;
                        nextPage++
                    }else{
                        hasNextPage = false;
                    }
                    moreTopicsData=moreTopicsData.concat(r.rows);
                    topics[rows]={
                        hasNextPage:hasNextPage,
                        'nextPage': nextPage,
                        'data': moreTopicsData
                    }
                    //在这里请求完成以后  通知controller
                    $rootScope.$broadcast('JiaoYi.portalsUpdated');
                })
            },
            hasNextPage: function() {
                if (topics[rows] === undefined) {
                    return false;
                }
                return topics[rows].hasNextPage;
            }
        }
    })
 //交易详情
.factory('JiaoYiContentFactory', function($resource,$rootScope,ENV) {
        var queryUrl=ENV.baseUrl+"web/CTP/CTPJiaoYiXinXiServlet";
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            topic = {};
        var resource = $resource(queryUrl, {}, {
            query: {
                method: 'get',
                params: {
                    action:'notSecurity_MngJiaoYiXinXi_view',
                    id: '@id'
                },
                timeout: 20000
            }
        });	
        return {
            get: function(id) {				
                return resource.query({
                    id: id
                }, function(r) {
                    topic[1]={
                        'data': r.rows
                    }
                    $rootScope.$broadcast('jiaoYiContent.newsUpdated');
                });				
            },
            getBackTopics: function() {
                if(topic[1]===undefined){
                    return false
                }
                return topic[1].data;
            }
        };
    })