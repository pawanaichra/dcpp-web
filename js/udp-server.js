var udpSocket = {

    socketId:null,
    myIP:null,
    port:null,

    recieve_callback:function(rc){
	    var decoder = new TextDecoder("utf-8");
	    var decodedString = decoder.decode(new Uint8Array(rc.data));
	    console.log("Data Received: "+decodedString);
	    parser(decodedString);
    },

    recieve_error_callback:function(info){
    	console.log("Error on socket with code "+info.resultCode);
    },

    bind_cb: function(s){
	    chrome.sockets.udp.getInfo(udpSocket.socketId, function(data){udpSocket.port=data.localPort;});
	    chrome.sockets.udp.onReceive.addListener(udpSocket.recieve_callback)
	    chrome.sockets.udp.onReceiveError.addListener(udpSocket.recieve_error_callback)
    },

    create_cb: function(s){
	    console.log("Socket seems to be created id is "+s.socketId);
	    udpSocket.socketId = s.socketId;
	    console.log(udpSocket.myIP);
	    chrome.sockets.udp.bind(s.socketId,udpSocket.myIP,0,udpSocket.bind_cb);
    },
    create: function(){
    	udpSocket.getIP();  
    },
    getIP: function(){
    	chrome.system.network.getNetworkInterfaces(udpSocket.getIP_cb);
    },
    getIP_cb: function(interfaces){
    	for(var interface of interfaces){
    		if(interface.address.split(".")[0]=="10"){
    			udpSocket.myIP=interface.address;
    			break;
    		}
    	}
    	chrome.sockets.udp.create({} ,udpSocket.create_cb); 
    }
};

udpSocket.create();