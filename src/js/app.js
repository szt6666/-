App = {
  web3Provider: null,
  contracts: {},          //存储合约信息

  //async、await关键词搭配使用
  init: async function(){
      return await App.initWeb3();
  },

  initWeb3: async function(){
      App.web3Provider = window.web3.currentProvider;
      web3 = new Web3(App.web3Provider);//创建实例
      return App.initContract();
  },

  initContract: function() {
      //从build文件夹导出合约编译的ABI
      $.getJSON("Nft.json", function(contract) {
          //从artifact中初始化一个新的truffle合约
          App.contracts.Nft = TruffleContract(contract);
          //连接provider和合约交互
          App.contracts.Nft.setProvider(App.web3Provider);
          App.contracts.Nft.deployed().then(function(instance) {
              App.contractAddress = instance.address;
          });
          return App.getAccount(),
                  App.getYue(),
                  App.getCollectionNumber(),
                  App.getAuctionNumber();
                  
      });
      return App.buttonClick();
  },

  getAccount: function() {
      //加载账户数据
      web3.eth.getCoinbase(function(err, account) {
          if(err === null) {
              App.account = account;
              console.log("在线账户：" + account);
              //赋值给页面
              $("#accountAddress").html(account);
          }
      });
  },

  getYue: function() {
      //加载余额
      App.contracts.Nft.deployed().then(function(instance) {
          return instance.getBalance.call({ from: App.account });
      }).then(function(result) {
          $("#balance").html(result.c[0]);
          console.log("账户余额： " + result + "元.");
      }).catch(function(err) {
          console.log(err);
          if(window.location.href != "http://localhost:3000/index.html"){
              window.location.href = "index.html";
              window.alert("还未注册，请注册后再登录");
          };
      });
  },

  getCollectionNumber: function() {
    //查询订单数量
    console.log("查询拥有nft数量");
    App.contracts.Nft.deployed().then(function(instance) {
        return instance.getCollectionNumber.call({ from: App.account });
    }).then(function(result) {
        App.collectionNum = result.c[0];
        console.log(App.collectionNum)
        if(result.c[0] > 0) {
           App.loadCollection(result - 1);
        }
    }).catch(function(err) {
        console.log(err.message);
    });
  },

  loadCollection: function(index) {
    //查询单笔订单
    App.contracts.Nft.deployed().then(function(instance) {
        return instance.getCollection.call(index, { from: App.account });
    }).then(function(result) {
        console.log(result);
        if(result[0].c[0] != 1000)
        {
            var nftStatus;
            if(result[2] == 0) {
                nftStatus = "正常";
            }else if(result[2] == 1) {
                nftStatus = "拍卖中";
            }else if(result[2] == 2) {
                nftStatus = "已交易";
            }
            $("#collections").append(
                "<tr>"+
                    "<td width='25%'>" +
                        "<img src='.\\images\\nft.jfif' height='100' width='150'>" +
                    "</td>" + 
                    '<td>' + result[0].c[0] + '</td>' +
                    '<td>' + result[1] + '</td>' +
                    '<td>' + nftStatus + '</td>' +
                '</tr>'
            );
        }
        if(index - 1 >= 0) {
            App.loadCollection(index - 1);
        }
    }).catch(function(err) {
        console.log(err.message);
    });
  },

  getAuctionNumber: function() {
    //查询在拍品数量
    console.log("查询拍卖的nft数量");
    App.contracts.Nft.deployed().then(function(instance) {
        return instance.getAuctionNumber.call({ from: App.account });
    }).then(function(result) {
        App.auctionNum = result.c[0];
        //console.log(result);
        //console.log("number",App.auctionNum)
        if(result.c[0] > 0) {
            App.loadAuction(result - 1);
        }
    }).catch(function(err) {
        console.log(err.message);
    });
  },

  loadAuction: function(index) {
    //查询单个拍品信息

    App.contracts.Nft.deployed().then(function(instance) {
        return instance.getSingleAuction_part2.call(index, { from: App.account });
    }).then(function(result) {
        //console.log(result);
        console.log("最高价", result[0].c[0]);
        App.floorPrice = result[0].c[0];
        App.highestPrice = result[1].c[0];
        if(result[2])
        {
            App.status = "已结束";
        }
        else{
            App.status = "进行中";
        }
    }).catch(function(err) {
        console.log(err.message);
    });

    App.contracts.Nft.deployed().then(function(instance) {
        return instance.getSingleAuction_part1.call(index, { from: App.account });
    }).then(function(result) {
        var time = (new Date((result[1].c[0]+ 8 *3600) * 1000)).toUTCString();
        var now = new Date().getTime();
        console.log(result);    
        console.log(now);
        console.log(result[1].c[0]);
        console.log(result[1].c[0]*1 + result[2]*1);
        if (now > (result[1].c[0]*1 + result[2]*1)*1000)
        {
            App.status = "已结束";
            App.infor = "nft的ID:" + result[0].c[0] + ",名字为" + result[3] + "，起拍于" + time  +  ",已结束,";
            App.infor += "创造者为" + result[4].slice(0,15) + ",拥有者为" + result[5].slice(0,15) + ".";
        }
        else{
            var endTime = (result[1].c[0]*1 + result[2]*1)*1000 - now;
            App.infor = "nft的ID:" + result[0].c[0] + ",名字为" + result[3] + "，起拍于" + time + ", 于" + (endTime / 60000).toFixed(2) + "min后结束,";
            App.infor += "创造者为" + result[4].slice(0,15) + ",拥有者为" + result[5].slice(0,15) + ".";
        }
        $("#auctions").append(
            '<tr>'+
                "<td width='25%'>" +
                        "<img src='.\\images\\nft.jfif' height='100' width='150'>" +
                "</td>" + 
                '<td>' + index + '</td>' + 
                "<td width='30%'>" + App.infor + '</td>' +
                '<td>' + App.floorPrice + '</td>' +
                '<td>' + App.highestPrice + '</td>' +
                '<td>' + App.status + '</td>' +
            '</tr>'
        );
        if(index - 1 >= 0) {
            App.loadAuction(index - 1);
        }
    }).catch(function(err) {
        console.log(err.message);
    });
  },

  getHistoryLength: function(utfId) {
    //查询nft转手次数
    console.log("查询nft转手次数");
    App.contracts.Nft.deployed().then(function(instance) {
        return instance.getHistoryNumber.call(utfId, { from: App.account });
    }).then(function(result) {
        App.historyLength = result.c[0];
        console.log(App.historyLength);
        if(result > 0) {
           App.loadHistory(utfId, result - 1);
        }
    }).catch(function(err) {
        console.log(err.message);
    });
  },

  loadHistory: function(utfId, index) {
    //查询单笔订单
    App.contracts.Nft.deployed().then(function(instance) {
        return instance.getSingleHistory.call(utfId, index, { from: App.account });
    }).then(function(result) {
        console.log(result);
        
        var time = (new Date(result[0].c[0] * 1000)).toUTCString();
        //console.log(result[0].c[0]);
        $("#history").append(
            '<tr>'+
                '<td>' + time + '</td>' + 
                '<td>' + result[1].slice(0,15) + '</td>' +
                '<td>' + result[2].slice(0,15) + '</td>' +
                '<td>' + result[3].c[0] + '</td>' +
            '</tr>'
        );
        if(index - 1 >= 0) {
            App.loadHistory(utfId, index - 1);
        }
    }).catch(function(err) {
        console.log(err.message);
    });
  },

  buttonClick: function() {

      // 新用户注册按钮
      $("#toRegister").on("click", function() {
          console.log("新用户");
          App.contracts.Nft.deployed().then(function(instance) {
              return instance.register({ from: App.account });
          }).then(function(result) {
              console.log("注册成功");
              console.log(result);
              window.alert("注册成功！请重新登录.");
          }).catch(function(err) {
              console.log(err);
              window.alert("请勿重复注册.");
          });
      });

      // 老用户登录按钮
      $("#toLogin").on("click", function() {
        console.log("正在尝试登录...");
        App.contracts.Nft.deployed().then(function(instance) {
            return instance.getBalance.call({ from: App.account });
        }).then(function(result) {
            console.log("登录成功");
            window.location.href = "center.html";
        }).catch(function(err) {
            console.log(err);
            window.alert("您还未注册或已被冻结账户，请注册或解冻之后再尝试登录。");
        });
      });

      //充值按钮
      $("#recharge").on('click', function() {
          var number = $('#value').val();
          console.log("充值金额： " + number);
          web3.eth.sendTransaction({from: App.account, to: App.contractAddress, value: number}, function(err, transactionHash){
              if(!err){
                  $("#value").val(null);
                  //window.alert语句可以弹出一个对话框
                  window.alert("充值成功，请刷新！");
              }else{
                  console.log(err);
              }
          });
      });

      //nft铸造按钮
      $("#mint").on("click", function() {
        var nftName = $('#nftName').val();
        App.contracts.Nft.deployed().then(function(instance) {
            return instance.mintNFT(nftName, { from: App.account });
        }).then(function(result) {
            console.log("NFT铸造成功");
            window.alert("NFT铸造成功");
        }).catch(function(err) {
            console.log(err);
            window.alert(err);
        });
      });

      //拍卖按钮
      $("#confirmAuction").on("click", function() {
        var nftId = $('#nftAuction').val();
        var duration = $('#_duration').val() * 60;
        var floorPrice = $('#_floorPrice').val();
        App.contracts.Nft.deployed().then(function(instance) {
            return instance.listNFT(nftId, duration, floorPrice, { from: App.account });
        }).then(function(result) {
            console.log("成功发起拍卖！");
            window.alert("成功发起拍卖！");
        }).catch(function(err) {
            console.log(err);
            window.alert(err);
        });
      });

      //查询按钮
      $("#query").on("click", function() {
          var nftId = $('#query_nftId').val();
          $('#history').empty();
          App.getHistoryLength(nftId);
      });

      //竞拍按钮
      $("#confirmBid").on('click', function() {
        var nftId = $('#bid_nftId').val();
        var value = $('#bidvalue').val();
        App.contracts.Nft.deployed().then(function(instance) {
            return instance.bid(nftId, value, { from: App.account });
        }).then(function(result) {
            console.log(result);
            window.alert("出价成功！");
        }).catch(function(err) {
            console.log(err);
            window.alert("出价需高于底价！");
        });
      });

      //认领按钮
      $("#claim").on('click', function() {
        var claim_nftId = $('#claim_nftId').val();  // 这里是拍卖Id
        App.contracts.Nft.deployed().then(function(instance) {
            return instance.claim(claim_nftId, { from: App.account });
        }).then(function(result) {
            console.log("这里", result);
            window.alert("认领成功！");
        }).catch(function(err) {
            console.log(err);
        });
      });
  },

};

$(function() {
  $(window).load(function() {
      //加载窗口时进行App的初始化
      App.init();
  })
});

