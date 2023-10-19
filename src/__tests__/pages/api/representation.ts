import * as fr from 'follow-redirects';
import fs from 'fs';

var options = {
  'method': 'POST',
  'hostname': 'localhost',
  'port': 3000,
  'path': '/api/representation',
  'headers': {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer clmzyzuc90003nu8qo6grzgrg'
  },
  'maxRedirects': 20
};

describe('upload representation file', () => {
  it('should upload representation file', async () => {
    var req = fr.http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });

    var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"assetId\"\r\n\r\necb9jeqjzdscqlnv457omdzr\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\"Fish_001.zip\"\r\nContent-Type: \"{Insert_File_Content_Type}\"\r\n\r\n" + fs.readFileSync('/home/noflame/repos/smaug/storage/Fish_001.zip') + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"type\"\r\n\r\nMODEL\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"uploaderId\"\r\n\r\nclmsnp9z40004nuxbkthaz8ne\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"format\"\r\n\r\nUSD\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";

    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

    req.write(postData);

    req.end();
  })
})