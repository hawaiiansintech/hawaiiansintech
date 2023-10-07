module.exports = {
  async redirects() {
    return [
      {
        source: "/join",
        destination: "/join/01-you",
        permanent: true,
      },
      {
        source: "/nominate",
        destination: "/join/01-you",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/WHpCrPqeqx",
        permanent: false,
      },
      {
        source: "/linkedin",
        destination:
          "https://www.linkedin.com/company/hawaiians-in-technology/",
        permanent: false,
      },
    ];
  },
};
