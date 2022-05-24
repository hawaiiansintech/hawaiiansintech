module.exports = {
  async redirects() {
    return [
      {
        source: "/join",
        destination: "/join/01-you",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/p7338Z5MJQ",
        permanent: true,
      },
    ];
  },
};
