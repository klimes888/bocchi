import React from "react";
import styled from "styled-components";

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  console.log("isLoading", isLoading);
  return <Layout $display={isLoading}></Layout>;
};

const Layout = styled.div<{ $display: boolean }>`
  display: ${({ $display }) => ($display ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 999;
`;

export default Loading;
