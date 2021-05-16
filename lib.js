const MAGIC_NUMBER = 69;
const APPLICATION_VERSION_IDENTIFIER = "1A";

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

function buildPayloadString(url) {
  var obj = {};

  obj.magic_number = MAGIC_NUMBER;
  obj.application_version_identifier = APPLICATION_VERSION_IDENTIFIER;
  obj.uniform_resource_locator = url;
  obj.uniform_resource_locator_padding_length = 1024 - url.length - 3;
  obj.uniform_resource_locator_padding_length = obj.uniform_resource_locator_padding_length <= 0 ? 3 : obj.uniform_resource_locator_padding_length;
  obj.uniform_resource_locator_padding = "420";

  for (var i = 0; i < obj.uniform_resource_locator_padding.length - 3; i++) {
    obj.uniform_resource_locator_padding += Math.round(Math.random() * 10);
  }

  var json = JSON.stringify(obj);
  var jsonBytes = stringToUint(json);
  var encodedJsonBytes = base2048.encode(jsonBytes);

  return encodedJsonBytes;
}

function getUrlFromPayload(payload) {
  var decodedPayload = JSON.parse(uintToString(base2048.decode(payload)));

  var url = decodedPayload.url;
  var payloadFromUrl = buildPayloadString(url, true);
}
