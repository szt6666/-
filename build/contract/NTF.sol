pragma solidity ^0.5.0;

contract Nft {
    
    enum Status {normal, auctioning, deal}      // 用户拥有NFT的状态，正常，拍卖中，已成交
    
    struct NFT {
        uint nftId;         // NFT唯一标识
        string name;        // NFT名称
        address creator;    // 铸造者
        address owner;      // 当前拥有者
    }
    NFT[] NFTs;             // NFT列表
    
    struct Tx {
        uint time;          // 交易时间
        address _from;      // 原主人
        address _to;        // 现主人
        uint value;         // 成交额
    }
    
    struct singleAuction {
        uint nft;           // 拍卖NFT的id
        uint startTime;     // 起拍时间
        uint duration;      // 时间跨度
        uint floorPrice;    // 底价
        address _from;      // NFT拥有者
        
        uint bidTime;       // 竞拍时间
        uint highestPrice;  // 最高竞拍价格
        address bidder;     // 竞拍者地址
        bool closed;        // 拍卖是否结束
    }
    singleAuction[] auctions;   //拍卖列表
    
    struct ownerShip {      
        uint nftId;         // 拥有的NFT的id
        Status status;      // NFT拥有状态
    }
    
    mapping(address => uint) balanceOf;     // 平台余额映射
    mapping(address => bool) users;         // 平台用户映射
    mapping(address => ownerShip[]) nftsOf; // 用户拥有NFT列表映射
    mapping(uint => Tx[]) historyOf;        // NFT转手记录映射

     
    // 要求地址已注册
    modifier user() {
        require(users[msg.sender] == true, "You have not register, please register first.");
        _;
    }
    
    // 注册
    function register() public {
        // 要求访问者为未注册地址
        require(users[msg.sender] == false, "You have already registered.");
        // 初始化
        balanceOf[msg.sender] = 0;
        users[msg.sender] = true;
    }
    
    // 提供充值接口
    function () payable external{
        balanceOf[msg.sender] += msg.value;
    }
    
    // 查询余额
    function getBalance() public view user returns(uint){
        return balanceOf[msg.sender];
    } 

    // 铸造带名字的NFT
    function mintNFT(string memory _name) public user {
        
        NFT memory newNFT =  NFT(NFTs.length, _name, msg.sender, msg.sender);   // 初始化NTF结构体
        // 更新NFT转手记录
        historyOf[NFTs.length].push(
            Tx(now, address(this), msg.sender, 0)
            );
        // 添加至个人NFT仓库
        ownerShip memory ownership;
        ownership.nftId = NFTs.length;
        ownership.status = Status.normal;
        
        uint _index = ownership.nftId;
        uint pos = nftsOf[msg.sender].length;
        if(_index >= pos)
        {
            for (uint i = pos; i <= _index; i++) 
            {
                if (i == _index)
                {
                    nftsOf[msg.sender].push(ownership);
                }
                else
                {
                    nftsOf[msg.sender].push(ownerShip(1000, Status.normal));
                }
            }
        }
        
        NFTs.push(newNFT);
    }
    
    // 上架拍卖NFT
    function listNFT(uint _id, uint _duration, uint _floorPrice) public user {
        require(NFTs[_id].owner == msg.sender, "This NTF doesn't belong to you.");
        require(nftsOf[msg.sender][_id].status == Status.normal, "This NFT is auctioning.");
        singleAuction memory newAuction;
        newAuction.nft = _id;
        newAuction.startTime = now;
        newAuction.duration = _duration;
        newAuction.floorPrice = _floorPrice;
        newAuction._from = msg.sender;
        auctions.push(newAuction);

        nftsOf[msg.sender][_id].status = Status.auctioning;
    }
    
    // 竞价，采用英国式拍卖   
    function bid(uint _id, uint _value) public user {
        require(balanceOf[msg.sender] >= _value, "Your balance is not enough.");
        require(auctions[_id].startTime + auctions[_id].duration > now, "The auction was finished.");
        require(_value >= auctions[_id].floorPrice, "Your bid is too low.");
        require(_value > auctions[_id].highestPrice, "The value is not higher than the current bid.");
        auctions[_id].bidTime = now;
        auctions[_id].highestPrice = _value;
        auctions[_id].bidder = msg.sender;
    }
    
    // 原主人在流拍时认领，或者竞拍成功者认领
    // _id是拍卖id不是ntfId
    function claim(uint _id) public user {
        require((now - auctions[_id].startTime) > auctions[_id].duration, "The auction doesn't finish now.");
        require(auctions[_id].closed == false, "The auction has been claimed already.");
        if(auctions[_id].bidder == msg.sender)
        {
            NFTs[auctions[_id].nft].owner = msg.sender;
            balanceOf[msg.sender] -= auctions[_id].highestPrice;
            balanceOf[auctions[_id]._from] += auctions[_id].highestPrice;
            
            Tx memory _tx;
            _tx.time = now;
            _tx._from = auctions[_id]._from;
            _tx._to = msg.sender;
            _tx.value = auctions[_id].highestPrice;
            
            historyOf[auctions[_id].nft].push(_tx);
            
            ownerShip memory ownership;
            ownership.nftId = auctions[_id].nft;
            ownership.status = Status.normal;
            
            uint _index = ownership.nftId;
            uint pos = nftsOf[msg.sender].length;
            if(_index >= pos)
            {
                for (uint i = pos; i <= _index; i++) 
                {
                    if (i == _index)
                    {
                        nftsOf[msg.sender].push(ownership);
                    }
                    else
                    {
                        nftsOf[msg.sender].push(ownerShip(1000, Status.normal));
                    }
                }
            }
            else
            {
                nftsOf[msg.sender][_index] = ownership;
            }
            nftsOf[auctions[_id]._from][auctions[_id].nft].status = Status.deal;
            
            auctions[_id].closed = true;
        }
        if((auctions[_id]._from == msg.sender) && (auctions[_id].highestPrice == 0))
        {
            nftsOf[msg.sender][_id].status = Status.normal;
            auctions[_id].closed = true;
        }
    }
    
    // 获取用户NFT数量
    function getCollectionNumber() public view user returns(uint) {
        return nftsOf[msg.sender].length;
    }
    
    // 返回用户拥有NFT信息
    function getCollection(uint _id) public view user returns(uint, string memory, Status) {
        return (
            nftsOf[msg.sender][_id].nftId,
            NFTs[_id].name,
            nftsOf[msg.sender][_id].status);
    }
    
    // 获取NFT转手次数
    function getHistoryNumber(uint _id) public view user returns(uint) {
        return historyOf[_id].length;
    }
    
    // 获取单次转手具体信息
    function getSingleHistory(uint _nftId, uint _id) public view user returns(uint, address, address, uint) {
        return (
            historyOf[_nftId][_id].time,
            historyOf[_nftId][_id]._from,
            historyOf[_nftId][_id]._to,
            historyOf[_nftId][_id].value);
    }
    
    // 获取拍卖品数量
    function getAuctionNumber() public view user returns(uint) {
        return auctions.length;
    }
    
    // 获取单个拍品的信息，返回参数太多，分为了两个函数
    function getSingleAuction_part1(uint _index) public view user returns
    (
        uint,
        uint,
        uint,
        string memory,
        address,
        address) 
    {
        uint nftId = auctions[_index].nft;
        return (
            auctions[_index].nft,
            auctions[_index].startTime,
            auctions[_index].duration,
            NFTs[nftId].name,
            NFTs[nftId].creator,
            NFTs[nftId].owner);
    }
    
    function getSingleAuction_part2(uint _index) public view user returns
    (
        uint,
        uint,
        bool) 
    {
        return (
            auctions[_index].floorPrice,
            auctions[_index].highestPrice,
            auctions[_index].closed);
    }
}