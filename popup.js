// $(function() {
//     $('#name').keyup(function() {
//         $('#greet').text('Hello ' + $('#name').val())
//     })
// });
$('a').click(function() {
    alert('You are about to go to ' + $(this).attr('href'))
})




let arr = []
let data;
let domain;

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {


    // var hostname = getHostname(tabs[0].url);
    console.log(tabs[0].url)
    let url = tabs[0].url.toString()



    // condition 1 : checking number in url
    let str = tabs[0].url
    str = str.toString().split("//")
    str = str[1].toString().split("/")
    console.log(str[0])
    domain = str[0];
    str = str[0].toString().split(":")
    ValidateIPaddress(str[0])
    console.log(arr)

    console.log(tabs[0].favIconUrl);



    // condition 2 : checking length in url
    let x = url.toString().length
    if (x > 54)
        arr.push(1)
    else
        arr.push(0)

    console.log(arr)

    // fetch(url).then(r => r.text()).then(result => {
    //     parser = new DOMParser();
    //     Doc = parser.parseFromString(result, "text/html");

    //     console.log(result);
    //     // console.log(Doc.getElementsByTagName("a")[0].childNodes[0].nodeValue);
    //     // var urls = Doc.getElementsByTagName("a")[0].childNodes[0].nodeValue;
    //     // for (url in urls) {
    //     //     console.log ( urls[url].href );
    //     // }
    //     // let datecreated = xmlDoc.getElementsByTagName("createdDate")[0].childNodes[0].nodeValue;
    //     // var diff = Math.abs(new Date() - datecreated);
    //     // console.log(diff);
    // });




    //condition 3 : checking tiny url
    if (url.toString().includes("t.co") || url.includes("bit.ly"))
        arr.push(1)
    else
        arr.push(0)

    // condition 4 : checking "//" more than 2
    let c4 = url.toString().split("//")
    if (c4.length > 2)
        arr.push(1)
    else
        arr.push(0)

    // condition 5 : checking . greater than 4
    let c5 = url.toString().split("//")
    c5 = c5[1].split(".")
    if (c4.length > 4)
        arr.push(1)
    else
        arr.push(0)

    // condition 6 : checking for https
    let c6 = url.toString().split("//")
    if (c6[0].includes("https"))
        arr.push(0)
    else
        arr.push(1)

    // condition 7 : https in the domain part
    let c7 = url.toString().split("//")
    if (c7[1].includes("https"))
        arr.push(1)
    else
        arr.push(0)

    // condition 8 : @ symbol

    if (url.toString().includes("@"))
        arr.push(1)
    else
        arr.push(0)
        // condition 9 : - symbol

    if (url.toString().includes("-"))
        arr.push(1)
    else
        arr.push(0)

    // condition 10 : favicon url domain check
    let favurl = tabs[0].favIconUrl;

    if (favurl) {
        favurl = favurl.toString().split("//")
        favurl = favurl[1].toString().split("/")
        console.log(favurl[0])
        if (domain != favurl[0])
            arr.push(1)
        else
            arr.push(0)
    } else
        arr.push(0)

    fetch('https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_W6RcSJvbpXymvJmyGwkTkvEODCWGQ&domainName=' + domain).then(r => r.text()).then(result => {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(result, "text/xml");

        console.log(result);
        console.log(xmlDoc.getElementsByTagName("createdDate")[0].childNodes[0].nodeValue);
        let datecreated = xmlDoc.getElementsByTagName("createdDate")[0].childNodes[0].nodeValue;
        lis = datecreated.split('-')
        lis = lis[0]
        var dt = new Date();
        console.log(lis)
        console.log(dt.getFullYear())
        var diff = Math.abs(dt.getFullYear() - lis);
        console.log(diff);
        // condition 11
        if (diff < 1)
            arr.push(1)
        else
            arr.push(0)
    });


    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            // LOG THE CONTENTS HERE
            console.log(request.content);
        });



    let sum = 0
    for (i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    fillTab();

    // if (sum >= 2)
    //     alert("its suspious")
    // else
    //     alert("its safe ")

});


function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        console.log("yeyes")
        arr.push(1)
    } else {
        console.log("no")
        arr.push(0)
    }

    let x = document.getElementById('tb')
    x.innerHTML += `
    <tr>
        
        <td>If website contains ip address</td>
        <td>${arr[0]}</td>
    </tr>
    `

}


function fillTab() {
    let x = document.getElementById('tb')
    x.innerHTML += `
    <tr>        
        <td>If URL > 75</td>
        <td>${arr[1]}</td>
    </tr>
    <tr>   
    <td>Uses url shortening method</td>
    <td>${arr[2]}</td>
    </tr>
    <tr>   
    <td>URL has more than 2 //</td>
    <td>${arr[3]}</td>
    </tr>
    <tr>   
    <td>URL has more than 2 .</td>
    <td>${arr[4]}</td>
    </tr>
    <tr>   
    <td>Is it http</td>
    <td>${arr[5]}</td>
    </tr>
    <tr>   
    <td>Is https in the domain part</td>
    <td>${arr[6]}</td>
    </tr>
    <tr>   
    <td>Contains @ symbol</td>
    <td>${arr[7]}</td>
    </tr>
    <tr>   
    <td>Contains - symbol</td>
    <td>${arr[8]}</td>
    </tr>
    `
}




// chrome.webNavigation.onCompleted.addListener(onCompleted);

// function onCompleted(details)
// {
//     if (details.frameId > 0)
//     {
//         // we don't care about activity occurring within a subframe of a tab
//         return;
//     }

//     chrome.tabs.get(details.tabId, function(tab) {
//         var url = tab.url ? tab.url.replace(/#.*$/, '') : ''; // drop #hash
//         var favicon;
//         var delay;

//         if (tab.favIconUrl && tab.favIconUrl != '' 
//             && tab.favIconUrl.indexOf('chrome://favicon/') == -1) {
//             // favicon appears to be a normal url
//             favicon = tab.favIconUrl;
//             delay = 0;
//         }
//         else {
//             // couldn't obtain favicon as a normal url, try chrome://favicon/url
//             favicon = 'chrome://favicon/' + url;
//             delay = 100; // larger values will probably be more reliable
//         }

//         setTimeout(function() {
//             /// set favicon wherever it needs to be set here
//             console.log('delay', delay, 'tabId', tab.id, 'favicon', favicon);
//         }, delay);
//     });
// }