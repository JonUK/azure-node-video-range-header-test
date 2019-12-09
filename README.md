
# Install  
  
- git clone  
- npm install  
- npm start  
- open browser in `localhost:3000`  
  
![Preview of video scrubbing tests page](https://raw.githubusercontent.com/JonUK/azure-node-video-range-header-test/master/design/screenshot.png)
  
## Example request & response headers  
```
curl --head -XGET --header Range:bytes=0-999 http://localhost:3000/video

HTTP/1.1 206 Partial Content
X-Powered-By: Express
Content-Range: bytes 0-999/31491130
Accept-Ranges: bytes
Content-Length: 1000
Content-Type: video/mp4
Date: Mon, 09 Dec 2019 14:54:14 GMT
Connection: keep-alive
```
