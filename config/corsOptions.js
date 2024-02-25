//Cross origin resource sharing
const whitelist = [
    "https://www.google.com/",
    "http://localhost:3500",
    "http://127.0.1:5500",
  ];
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by CROS"));
      }
    },
    OptionSuccessStatus: 200,
  };

  module.exports = corsOptions;