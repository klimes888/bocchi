import React from "react";
import styled from "styled-components";
import Image from "next/image";

import LoadingImg from "@/assets/bocchi_vive.gif";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        background: "#FCFAFB",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "12em",
          height: "12em",
          overflow: "hidden",
        }}
      >
        <img
          src={LoadingImg.src}
          alt="loading"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

export default Loading;
