const MAGIC_NUMBER = 69;
const APPLICATION_VERSION_IDENTIFIER = "1A";

async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);                    

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string                  
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function stringToUint(string) {
  var string = btoa(unescape(encodeURIComponent(string))),
    charList = string.split(''),
    uintArray = [];

  for (var i = 0; i < charList.length; i++) {
    uintArray.push(charList[i].charCodeAt(0));
  }

  return new Uint8Array(uintArray);
}

function uintToString(uintArray) {
  var encodedString = String.fromCharCode.apply(null, uintArray),
    decodedString = decodeURIComponent(escape(atob(encodedString)));

  return decodedString;
}

async function buildPayloadString(url, verify) {
  verify = (typeof verify !== 'undefined') ? verify : false;

  var obj = {};

  obj.magic_number = MAGIC_NUMBER;
  obj.application_version_identifier = APPLICATION_VERSION_IDENTIFIER;
  obj.uniform_resource_locator = url;
  
  if (!verify) {
    var payloadString = await buildPayloadString(url, true);
    obj.payload = payloadString;
    obj.payload_hash = await sha256(payloadString);
  }

  var json = JSON.stringify(obj);
  var jsonBytes = stringToUint(json);
  var encodedJsonBytes = base2048.encode(jsonBytes);

  return encodedJsonBytes;
}

async function getUrlFromPayload(payload) {
  var decodedPayload = JSON.parse(uintToString(base2048.decode(payload)));

  var url = decodedPayload.url;
  var payloadFromUrl = await buildPayloadString(url, true);

  // if (obj.payload_hash != await.
}
