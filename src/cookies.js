const COOKIE_ID = "FOOTBALL!";

let useCookies = false;
let showAccess = true;

(new URL(window.location.href)).searchParams.forEach((val, term) => {
  switch (term.toLowerCase()) {
    case "showaccess":
      showAccess = val.toLowerCase() == "true";
      break;
  }
});

function cook(v) {
  useCookies = v;
  saveCookie();
  document.getElementById("msg-wrapper").style.display = 'none';
}

function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function saveCookie() {
  if (!useCookies) {
    return;
  }
  let cookie = {version: '0.1'};
  setCookie(COOKIE_ID, JSON.stringify(cookie), 365 * 200);
}

function loadCookie() {
  let cookie = getCookie(COOKIE_ID);
  if (cookie) {
    cook(true);
    try {
      cookie = JSON.parse(cookie);
      console.log(`loaded cookie from version ${cookie.version}`);
    } catch (e) {}
  }
}
loadCookie();
if (!useCookies) {
  document.getElementById("msg-wrapper").style.display = 'block';
}
