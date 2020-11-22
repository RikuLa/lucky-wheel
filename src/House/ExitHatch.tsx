import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 200;
  display: inline-block;
  width: 100px;
  padding: 10px;
  background-color: #121212;
  text-align: center;
  color: #888;
  border: 2px solid #666;
  font-family: monospace;
  font-size: 14pt;
  border-radius: 6px;

  h4 {
    margin: 0;
    margin-bottom: 8px;
  }
`;

const Button = styled.div`
  margin: 4px auto;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-color: red;
  border-bottom: 3px solid black;

  &:active {
    transform: translateY(2px);
  }
`;

export const ExitHatch = ({ completed }: { completed: boolean }) => {
  const exitRoom = () => {
    window.close();
  };
  return (
    <Container
      style={{
        backgroundColor: completed ? "green" : "yellow",
      }}
    >
      EXIT
      <Button onClick={exitRoom} />
    </Container>
  );
};
