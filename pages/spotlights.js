import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Title from "../components/Title.js";
import MetaTags from "../components/Metatags.js";
import Nav from "../components/Nav.js";
import HitLogo from "../components/HitLogo.js";
import MainSpotlight from "../components/Spotlight/MainSpotlight.js"
import React from "react"; 

const item = {
  hidden: { opacity: 0, y: "15%" },
  show: { opacity: 1, y: "0%" },
  transition: {
    easing: "easeInOut",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const DISCORD_URL = "https://discord.gg/p7338Z5MJQ";

export default function Home({ technologists }) {
  return (
    <React.Fragment>
      <div className="container">
          <HitLogo />
          <Nav />
          <MainSpotlight />
        </div>
    </React.Fragment>

  );
}
