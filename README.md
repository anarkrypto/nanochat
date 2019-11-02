# nanochat
A decentralized chat based on Nano transactions

## Demo: https://anarkrypto.github.io/nanochat/
(To connect to nodes without ssl, we cannot use this chat with https. So I am not using GitHub Pages as it uses https. Then use the link above or download the files )

### Introduction:

Imagine yourself using Nano Currency to Send messages!
In fact, you can't add extra bytes in a Nano Transaction.
But we can hack the system!

Nano supports 30 digits after the first comma.
For example, the minimum fraction of Nano is 1 raw:
0.000000000000000000000000000001 Nano

So, we can use all this numbers to save "flags".
For example:
0.000000004068757578005578817567 = "Hello World"

We use 2 digits for each character, so we we have 100 differents characters (10²)
And we can save 15 characters using less than 1 Nano (0,99999999999...)
Or, we can save 13 characters using less than 0.0001 Nano

For better use it was necessary to create a new coding method. We can call it base100. It is the representation of 100 different characters, with their respective decimal numerical values. Following the table base100 in the photo below, it was inspired by ASCII. They are the last 94 characters of the table ACII + ÃÉÇãéç. Totaling 100 characters, their decimal values start at 00 and go up to 99.

<img src="https://raw.githubusercontent.com/anarkrypto/nanochat/master/img/base100-table.png" width="50%"/>
