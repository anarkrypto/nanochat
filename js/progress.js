let walletAccount = "nano_1chat1cwn3qyabqbiti7gbxr714ntityxxyaoipwgpqd3hmegb6e457dimwm"

let els = document.getElementsByClassName('step')
let steps = []
Array.prototype.forEach.call(els, e => {
	steps.push(e)
	e.addEventListener('click', x => {
		console.log(x.target.id)
		progress(x.target.id)
	})
})

function progress(stepNum) {
	let p = stepNum * 50
	document.getElementsByClassName('percent')[0].style.width = `${p}%`
	steps.forEach(e => {
		if (e.id === stepNum) {
			e.classList.add('selected')
			e.classList.remove('completed')
		}
		if (e.id < stepNum) {
			e.classList.add('completed')
		}
		if (e.id > stepNum) {
			e.classList.remove('selected', 'completed')
		}
	})
}

var btnNext = document.querySelector('.btnNext')
var btnPrev = document.querySelector('.btnPrev')
var btnSendMessage = document.querySelector('.sendMessage')

var pages = []
pages[1] = document.querySelector('#page1')
pages[2] = document.querySelector('#page2')
pages[3] = document.querySelector('#page3')



//start in page1
var pageDisplay = 1


//show page1
pages[pageDisplay].classList.add('with-dalay')
pages[pageDisplay].classList.remove('hideTransition')

//inicialize progress bar
//progress(1)
//progress(0)

//hide prev in page1
btnPrev.classList.add("hide")

//next page when button next selected
btnNext.addEventListener('click', function() {
	if (pageDisplay == 2 && !connected ) {
		alert ("Connect on Nano node first!")
		return
	}
	pages[pageDisplay].classList.remove('with-dalay')
	pages[pageDisplay].classList.add('hideTransition')
	pageDisplay++
	pages[pageDisplay].classList.add('with-dalay')
	pages[pageDisplay].classList.remove('hideTransition')

	progress(pageDisplay - 1)

	if (pageDisplay == 1) {
		btnNext.classList.add("hide")
	}
	if (pageDisplay == 2) {
		btnPrev.classList.remove("hide")
	}
	if (pageDisplay == 3) {
		reloadChat(walletAccount)
		btnNext.classList.add("hide")
	}
})


//page before when button prev selected
btnPrev.addEventListener('click', function() {
	pages[pageDisplay].classList.remove('with-dalay')
	pages[pageDisplay].classList.add('hideTransition')
	pageDisplay--
	pages[pageDisplay].classList.add('with-dalay')
	pages[pageDisplay].classList.remove('hideTransition')
	if (pageDisplay == 1) {
		btnPrev.classList.add("hide")
	}
	if (pageDisplay == 2) {
		btnNext.classList.remove("hide")
	}
	if (pageDisplay == 3) {
		btnNext.classList.add("hide")
	}
})

btnSendMessage.addEventListener('click', function() {
	var message = document.querySelector("#myMessageBox input").value
	var spentAmount = RawTo(ascii_to_base100(message), MegaXRB)
	document.querySelector("div.popup div.content").innerHTML = "<p>Your word <strong>\"" + message + "\"</strong> has " + message.length + " characters.</p>" +
	"<p>To display this message in chat, send exactly this amount: <br><strong>" +	spentAmount + "</strong> Nano <br> to this account: <strong>" + walletAccount + "</strong>" +
	"</p><div id=\"qrcode\"></div><p><a href=\"nano:" + walletAccount + "?amount=" + ascii_to_base100(message) + "\">Or open URI in your Nano wallet</a>" +
	"<p>After that wait for the chat to reload. Remember that the message will be <strong>saved forever!</strong></p>" +
	"<p>Recommended wallets: <br>Online: <a href=\"https://nanovault.io\" target=\"_blank\">NanoVault.io</a> (minimum accepted is 0.000001)</p>"

	 var typeNumber = 6;
	 var errorCorrectionLevel = 'L';
	 var qr = qrcode(typeNumber, errorCorrectionLevel);
	 qr.addData("nano:" + walletAccount + "?amount=" + ascii_to_base100(message) );
	 qr.make();
	 document.getElementById('qrcode').innerHTML = qr.createImgTag();

})

var buttonChars1 = document.querySelector("#buttonChars1")
buttonChars1.addEventListener('click', function() {
	var sasCount = document.querySelector("span.short-and-sweet-counter")
	sasCount.parentNode.removeChild(sasCount)
	document.querySelector("#myMessageBox input#my-text-field").maxLength = 13
	document.querySelector(".howMuchSpend span.amount").innerText = "0.0001"
	shortAndSweet('input');
})

var buttonChars2 = document.querySelector("#buttonChars2")
buttonChars2.addEventListener('click', function() {
	var sasCount = document.querySelector("span.short-and-sweet-counter")
	sasCount.parentNode.removeChild(sasCount)
	document.querySelector("#myMessageBox input#my-text-field").maxLength = 15
	document.querySelector(".howMuchSpend span.amount").innerText = "1"
	shortAndSweet('input');
})

var buttonChars3 = document.querySelector("#buttonChars3")
buttonChars3.addEventListener('click', function() {
	var sasCount = document.querySelector("span.short-and-sweet-counter")
	sasCount.parentNode.removeChild(sasCount)
	document.querySelector("#myMessageBox input#my-text-field").maxLength = 16
	document.querySelector(".howMuchSpend span.amount").innerText = "100"
	shortAndSweet('input');
})




shortAndSweet('input');
