function updateNode (selectedNode) {
  if (selectedNode == "remote") {
    node.default = "remote";
    node.remote.address = document.querySelector("#remote_address").value
    node.remote.port = document.querySelector("#remote_apiPort").value
    node.remote.protocol = document.querySelector("#remoteProtocol").querySelector("li.active").innerText.toLowerCase()
  }

  if (selectedNode == "local") {
    node.default = "local";
    node.local.address = document.querySelector("#local_address").value
    node.local.port = document.querySelector("#local_apiPort").value
    node.local.protocol = document.querySelector("#localProtocol").querySelector("li.active").innerText.toLowerCase()
  }

  nodeConnect(selectedNode);
}


function requestJSON(url, data, callback) {
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
    }
  });
}

function nodeConnect (selectedNode) {
  if (selectedNode == "remote") {
    document.querySelector('button#buttonRemote').setAttribute('disabled', '')
    document.querySelector('button#buttonRemote').querySelector(".buttonContent div").innerText = "Connecting"
    document.querySelector('button#buttonRemote').querySelector(".buttonContent div").classList.add("connecting")
    document.querySelector('button#buttonLocal').querySelector(".buttonContent div").innerHTML = 'Connect <img src="img/connect.png"/>'
    document.querySelector('button#buttonRemote').querySelector(".buttonContent .min-loading").classList.remove('min-loading-hidden') //loading event
  }

  if (selectedNode == "local") {
    document.querySelector('button#buttonLocal').setAttribute('disabled', '')
    document.querySelector('button#buttonLocal').querySelector(".buttonContent div").innerText = "Connecting"
    document.querySelector('button#buttonLocal').querySelector(".buttonContent div").classList.add("connecting")
    document.querySelector('button#buttonRemote').querySelector(".buttonContent div").innerHTML = 'Connect <img src="img/connect.png"/>'
    document.querySelector('button#buttonLocal').querySelector(".buttonContent .min-loading").classList.remove('min-loading-hidden') //loading event
  }

  var status = "wait"

  var data = {"action": "version"};
  requestJSON ( node[node.default].protocol + "://" + node[node.default].address + ":" + node[node.default].port, data, function(json) {
    if (json == undefined) {
      alert ("Invalid Node.")
      offline(selectedNode);
      status = "offline"
    } else {
      if ( json.node_vendor.search("Nano") !== -1) {
        online(selectedNode);
        status = "online"
        nodeVersion = parseFloat(json.node_vendor.split(" ")[1])
        document.querySelector("#response").innerText = JSON.stringify(json, null, 2)
      } else {
        offline(selectedNode);
        status = "offline"
      }
    }

    document.querySelector('button#buttonRemote').removeAttribute("disabled");
    document.querySelector('button#buttonLocal').removeAttribute("disabled");
    document.querySelector('button#buttonRemote').querySelector('.buttonContent .min-loading').classList.add('min-loading-hidden') //loading event
    document.querySelector('button#buttonLocal').querySelector('.buttonContent .min-loading').classList.add('min-loading-hidden') //loading event
    return status
  /* }, function (reason) { */
    document.querySelector('button#buttonRemote').removeAttribute("disabled");
    document.querySelector('button#buttonLocal').removeAttribute("disabled");
    document.querySelector('button#buttonRemote').querySelector('.buttonContent .min-loading').classList.add('min-loading-hidden') //loading event
    document.querySelector('button#buttonLocal').querySelector('.buttonContent .min-loading').classList.add('min-loading-hidden') //loading event
    offline(selectedNode)
    return "offline"
  });
}

function online (selectedNode) {
  connected = 1
  progress(2)
  progress(1)
  if (selectedNode == "remote") {
    document.querySelector('button#buttonRemote').querySelector(".buttonContent div").classList.remove("connecting")
    document.querySelector('button#buttonRemote').querySelector(".buttonContent div").innerHTML = 'Node Online <img src="img/connected.png"/>'
    document.querySelector('button#buttonRemote').querySelector('.buttonContent .min-loading').classList.add('min-loading-hidden')
  }
  if (selectedNode == "local") {
    document.querySelector('button#buttonLocal').querySelector(".buttonContent div").classList.remove("connecting")
    document.querySelector('button#buttonLocal').querySelector(".buttonContent div").innerHTML = 'Node Online <img src="img/connected.png"/>'
    document.querySelector('button#buttonLocal').querySelector('.buttonContent .min-loading').classList.add('min-loading-hidden')
  }
}

function offline (selectedNode) {
  connected = 0
  if (selectedNode == "remote") {
    document.querySelector('button#buttonRemote').querySelector(".buttonContent div").innerHTML = 'Node Offline! <img src="img/disconnected.png"/>'
  }
  if (selectedNode == "local") {
    document.querySelector('button#buttonLocal').querySelector(".buttonContent div").innerHTML = 'Node Offline! <img src="img/disconnected.png"/>'
  }
}



function reloadChat (account) {
  if (nodeVersion >= 19.0) {
    account = "nano_" + account.split("_")[1]
  } else {
    account = "xrb_" + account.split("_")[1]
  }
  var data = {
    "action": "accounts_pending",
    "accounts": [account],
    "count": "-1"
  }
  requestJSON ( node[node.default].protocol + "://" + node[node.default].address + ":" + node[node.default].port, data, function(json) {
    if (json.blocks == undefined){
      alert ("Invalid Account")
    } else {
      for (var block of json.blocks[account]) {
        data = {
          "action": "block_info",
          "hash": block
        }
        requestJSON ( node[node.default].protocol + "://" + node[node.default].address + ":" + node[node.default].port, data, function(json) {
          var liMsg = "<li id=\"ts" + json.local_timestamp + "\" class=\"msg\"><span class=\"info\">Message:</span> <span class=\"content\"></span> <br><br><span class=\"info\">From:</span> <span class=\"account\"></span><br><span class=\"info\">Spent:</span> <span class=\"spent\"></span><br><span class=\"info\">Node Timestamp:</span> <span class=\"timestamp\"></span><br><span class=\"info\">Block:</span> <a class=\"block\" href=\"\" target=\"_blank\"><a></li>"
          if (document.querySelector("#chat ul li#ts" + json.local_timestamp) === null) {
            document.querySelector("#chat ul").innerHTML += liMsg
            document.querySelector("li#ts" + json.local_timestamp + " span.content").innerText = base100_to_ascii(json.amount)
            document.querySelector("li#ts" + json.local_timestamp + " span.account").innerText = json.block_account
            document.querySelector("li#ts" + json.local_timestamp + " span.spent").innerText = RawTo(json.amount, MegaXRB)
            document.querySelector("li#ts" + json.local_timestamp + " span.timestamp").innerText = timeConverter(json.local_timestamp)
            document.querySelector("li#ts" + json.local_timestamp + " a.block").src += "https://nanode.co/block/" + block
            document.querySelector("li#ts" + json.local_timestamp + " a.block").innerText =  block.substr(0, 38) + "..."
          }
        });
      }
      progress(3)
      progress (2)
      chatLoop ()
    }
  });
}


function base100_to_ascii (base100) {
  var base100Table = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~ÃÉÇãéç"
  var stringBase = base100 + ""
  var stringASCII = ""
  var char

  for (c=0; c<stringBase.length; c+=2) {
    char = parseInt(stringBase.substr(c, 2))
    stringASCII = stringASCII + base100Table[char]
  }
  return (stringASCII)
}

function ascii_to_base100 (ascii) {
  var base100Table = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~ÃÉÇãéç"
  var stringASCII = ascii + ""
  var stringbase100 = ""
  var char

  for (c=0; c<stringASCII.length; c++) {
    if (base100Table.indexOf(stringASCII[c]) <= 9) {
      char = '0' + base100Table.indexOf(stringASCII[c])
    } else {
      char = base100Table.indexOf(stringASCII[c])
    }
    stringbase100 = stringbase100 + char
  }

  return (stringbase100)

}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}


const	RAW       = 0
const	MicroXRB  = 18
const	MiliXRB   = 18 + (3 * 1)
const	XRB       = 18 + (3 * 2)
const	KiloXRB   = 18 + (3 * 3)
const	MegaXRB   = 18 + (3 * 4)
const	GigaXRB   = 18 + (3 * 5)


function RawTo(rawValor, escala) {
	return left(rawValor, escala) + right(rawValor, escala);
}


function left(valor, escala) {
	if (escala == 0) {
		return valor
	}

	if (valor.length > escala) {
		return valor.substr(0, valor.length-escala)
	}

	return "0"
}

function right(valor, escala) {
	if (escala == 0) {
		return ""
	}

	if (valor.length >= escala) {
		return "." + valor.substr(valor.length-escala)
	}

	let r = "0".repeat(escala-valor.length);
  r += valor

	return "." + r
}


function chatLoop(){
  var status = document.querySelector("#chat #status")
  var counter = 15;
  var timer = setInterval(function() {
    if( counter == 0 ) {
      status.innerText = "Updating Chat Now..."
      reloadChat(walletAccount)
      clearInterval( timer );
    } else {
      status.innerText = "Updating Chat in " + counter-- + " seconds"
    }
  }, 1000);
}



var selectedNode = ""
var connected = 0
var nodeVersion = ""

//updateNode(node.default)
