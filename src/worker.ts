self.addEventListener("install", function (event) {
  // Perform install steps
  console.log("web worker installed:", event);
});

self.addEventListener("fetch", function (event: any) {
  // do nothing here, just log all the network requests
  console.log(event.request.url);
});
