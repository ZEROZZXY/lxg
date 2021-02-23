const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/index.php", {
      target: "http://qinqin.net",
      changeOrigin: true,
    })
  );
  app.use(
    proxy("/api", {
      target: "http://120.27.241.90:5000",
      changeOrigin: true,
    })
  );
};
