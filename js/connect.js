socketId="";
function ab2str(buf) {
	var decoder = new TextDecoder("utf-8");
  	return decoder.decode(new Uint8Array(buf));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function connect(){
	chrome.sockets.tcp.create({}, function(createInfo) {
		socketId = createInfo.socketId;
  		chrome.sockets.tcp.connect(createInfo.socketId,
    	"10.103.7.103", 411, onConnectedCallback);
	});
}

function proceed(data){
	sendHub("Supports UserCommand NoGetINFO NoHello UserIP2 TTHSearch ZPipe0");
	  sendHub("Key "+lockMsgToKey(ab2str(data)));
	  sendHub("ValidateNick temp");
	  sendHub("MyPass temp");
	  sendHub("Version 1,0091");
	  sendHub("GetNickList");
	  sendHub("MyINFO $ALL temp <++ V:0.867,M:A,H:0/1/0,S:3>$ $1000$$0$");
}

function onConnectedCallback(resultCode){
	if(resultCode>0){
		console.log("connected");
	}
	chrome.sockets.tcp.onReceive.addListener(function(info) {
	  console.log(ab2str(info.data));
	  var result=ab2str(info.data).split(" ");
	  console.log(result[0]);
	  if(result[0]=="$Lock")
	  	proceed(info.data);
	  // sendHub("ConnectToMe 98765432 10.147.231.130:58060");
	});
}

function sendHub(msg){
	msg = "$" + msg + "|"
	chrome.sockets.tcp.send(socketId, str2ab(msg), function(resultCode){
		if(resultCode < 0)
			console.log("error");
		else
			console.log("msg sent");
	});
}

function lockMsgToKey(lockMsg){
	lockMsg = lockMsg.split(" ");
	var buffer = str2ab(lockMsg[1]);
	var lock = new Uint8Array(buffer);
	var key = new Uint8Array(lock.length);
	for(var i=1;i<lock.length;i++){
		key[i] = lock[i] ^ lock[i-1];
	}
	key[0] = lock[0] ^ lock[lock.length-1] ^ lock[lock.length-2] ^ 5;
	for(var i=0;i<lock.length;i++){
		key[i] = ((key[i] << 4) | (key[i] >> 4)) & 0xFF;
	}
	var result = new Array();
	for(const k of key){
		if(k==0 || k==5){
			const temp = new Uint8Array(str2ab("/%DCN00"+k+"%/"));
			z = temp.entries();
            x = z.next();
			while(!x.done){
				result.push(x.value[1]);
				x=z.next();
			}
		}
		else if(k==36||k==96){
			var temp = new Uint8Array(str2ab("/%DCN0"+k+"%/"));
			z = temp.entries();
            x = z.next();
			while(!x.done){
				result.push(x.value[1]);
				x=z.next();
			}
		}
		else if(k==124||k==126){
			var temp = new Uint8Array(str2ab("/%DCN"+k+"%/"));
			z = temp.entries();
            x = z.next();
			while(!x.done){
				result.push(x.value[1]);
				x=z.next();
			}
		}
		else
			result.push((k));
	}
	var r = Uint8Array.from(result);
	console.log(r);
	var decoder = new TextDecoder("utf-8");
	var res = decoder.decode(r);
	console.log(res);
	return res;
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#connect-btn').addEventListener('click', connect);
});