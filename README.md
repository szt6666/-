**项目：去中心化的NFT交易平台**  
**作者: szt6666**  
**日期: 2021-10-30** 

## 一、项目需求
在这个项目中，我实现了一个去中心化的数字货币交易平台，有如下功能：  
（1）用户可以铸造NFT，并且可以查看自己已经铸造的NFT，自己正在拍卖的NFT，目前拍卖进展和拍卖买入的NFT；  
（2）用户可以选择铸造NFT并进行拍卖，规定好起拍价格和截止时间。其他用户可以浏览正在拍卖中的NFT并且进行出价；  
（3）用户可以查看正在拍卖的NFT过去的所属权流转信息；  
（4）拍卖结束后，出价最高者需要手动去认领NFT，合约会将这个NFT的所有权转到该用户的地址下。  

## 二、如何运行我的项目
在这一部分，我将说明如何运行我的项目。  
（1）在cmd中输入'**truffle migrate**'，我们可以得到：  
<img src="https://user-images.githubusercontent.com/91237445/139519033-6babf23f-7869-493c-8661-589f92853c2e.png" width="500" height="300"/><br/>
（2）在cmd中输入'**npm run, dev in cmd**'，我们可以得到：  
<img src="https://user-images.githubusercontent.com/91237445/139519082-5d797e85-f33f-4dd3-a531-e535c85a31ab.png" width="500" height="300"/><br/>
这一操作将打开浏览器并到达项目界面：  
<img src="https://user-images.githubusercontent.com/91237445/139519106-e4256e84-1eb1-4317-b243-f8dea337d7cb.png" width="500" height="300"/><br/>

## 三、项目运行成功后的截图
（1）拍卖市场上的NFTs.  
<img src="https://user-images.githubusercontent.com/91237445/139520124-f99290cd-3a77-4208-8daa-67af3cfaf5b0.png" width="500" height="300"/><br/>   
<img src="https://user-images.githubusercontent.com/91237445/139519447-d1d1d1f9-7013-45a3-9dfa-6e694111a143.png" width="500" height="300"/><br/> 
我们在拍卖市场上可以看到正在拍卖、拍卖已结束或是拍卖买入的的NFTs以及其所有权的流转信息，同时我们对市场上正在拍卖的NFT进行出价。   
（2）个人主页  
<img src="https://user-images.githubusercontent.com/91237445/139519497-430ddcf4-926b-4f16-a4b5-7aa0eb536022.png" width="500" height="500"/><br/>
在个人主页中，我们可以查看已铸造的NFTs以及正在拍卖的自己的NFTs（包括拍卖进展：正常，拍卖中，已交易），同时我们也可以铸造自己的NFTs，并对自己的NFT设置起拍价格（底价）和截止时间用于拍卖。  

## 四、环境配置和注意事项
<img src="https://user-images.githubusercontent.com/91237445/139520233-2e6dfd1e-3b1b-45cc-b7a1-66c26966872d.png" width="500" height="200"/><br/> 
1.	npm
2.	Truffle
https://www.trufflesuite.com/truffle
https://learnblockchain.cn/docs/truffle/getting-started/installation.html
3.	Ganache
https://www.trufflesuite.com/ganache
4.	MetaMask浏览器插件
https://metamask.io/

注：对于流拍的nft，同样需要owner进行认领

***
**Project: decentralized trading platform  
**author: szt6666**  
**date: 2021-10-30** 

## 1.Requirement
In this project, I construct a decentralized trading platform, which has functions as follows:  
(1) Users can make their own NFT, and they can check NFTs they have already made, NFTs for auction, the progress of auction and NFTs they bought through auction.  
(2) Users can choose their NFTs for auction, and make rules of the price and deadline; others can view NFTs at the auction and offer a price.  
(3) Users can view the overall information of NFTs ownership transfer.  
(4) At the end of auction, the person who offer the highest price should claim the NFT manually; the contract will transfer the ownership of NFT to his address.  

## 2.Procedure
In the part, I will illustrate how to operate this project.  
(1) Enter '**truffle migrate**' in cmd, you will get:  
<img src="https://user-images.githubusercontent.com/91237445/139519033-6babf23f-7869-493c-8661-589f92853c2e.png" width="500" height="300"/><br/>
(2) Enter '**npm run dev in cmd**', you will get:  
<img src="https://user-images.githubusercontent.com/91237445/139519082-5d797e85-f33f-4dd3-a531-e535c85a31ab.png" width="500" height="300"/><br/>
and the browser will be open to:  
<img src="https://user-images.githubusercontent.com/91237445/139519106-e4256e84-1eb1-4317-b243-f8dea337d7cb.png" width="500" height="300"/><br/>
so you can enter interface of my project.  

**The following procedures are shown in the video that I submit to your emailbox for you to check.**  

## 3.Screenshot
In this part, I'd like to show some screenshots of operation success of my project.  

(1) the NFTs on the market. 
<img src="https://user-images.githubusercontent.com/91237445/139520124-f99290cd-3a77-4208-8daa-67af3cfaf5b0.png" width="500" height="300"/><br/>  
<img src="https://user-images.githubusercontent.com/91237445/139519447-d1d1d1f9-7013-45a3-9dfa-6e694111a143.png" width="500" height="300"/><br/>  
In the market, we can view the NFTs at the auction, the overall information of NFTs ownership transfer and the time.
(2) personal center.  
<img src="https://user-images.githubusercontent.com/91237445/139519497-430ddcf4-926b-4f16-a4b5-7aa0eb536022.png" width="500" height="500"/><br/>
in the personal center, we can check our own NFTs and NFTs for auction; besides, we can make our own NFTs.

## 4、Environment configuration and some hints
<img src="https://user-images.githubusercontent.com/91237445/139520233-2e6dfd1e-3b1b-45cc-b7a1-66c26966872d.png" width="500" height="200"/><br/> 
1.	npm
2.	Truffle
https://www.trufflesuite.com/truffle
https://learnblockchain.cn/docs/truffle/getting-started/installation.html
3.	Ganache
https://www.trufflesuite.com/ganache
4.	MetaMask
https://metamask.io/

