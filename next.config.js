module.exports = {
  async redirects() {
    return [
      {
        source: "/join",
        destination: "/join/01-you",
        permanent: true,
      },
    ];
  },
};
