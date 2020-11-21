import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoomApi } from "../../rooms";

const Card = styled.div`
  width: 100px;
  height: 60px;
  position: absolute;
  top: ${(props) => (props.y ? props.y : 100)}px;
  left: ${(props) => (props.x ? props.x : 100)}px;
  background: ${(props) => (props.color ? props.color : "#00ff00")};
`;

const Reader = styled.div`
  width: 60px;
  height: 50px;
  position: absolute;
  top: ${(props) => (props.y ? props.y : 100)}px;
  left: ${(props) => (props.x ? props.x : 100)}px;
  background: ${(props) => (props.color ? props.color : "#00ff00")};
`;

/*
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
*/

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const generateCards = () => [
  generateCard(),
  generateCard(),
  generateCard(),
  generateCard(),
];

const generateCard = () => {
  const code = Math.random().toString().substr(2, 8);
  return { code: code, color: getRandomColor(), solved: false };
};

export const Cards = ({ onReady, onComplete }: RoomApi) => {
  const [complete, setComplete] = useState(false);
  const [codes, setCodes] = useState(generateCards);

  useEffect(() => {
    onReady("Cards");
  }, []);

  React.useEffect(() => {
    if (complete) {
      onComplete();
    }
  }, [complete]);
  console.log("cide", codes);
  return (
    <>
      {codes.map((c, i) => {
        return (
          <Card
            key={c.code}
            x={10}
            y={100 + i * 100}
            color={c.color}
            onClick={() => {
              navigator.clipboard.writeText(c.code);
            }}
          >
            {c.code}
          </Card>
        );
      })}
      {codes.map((c, i) => {
        return (
          <Reader
            key={c.code}
            x={300}
            y={100 + i * 100}
            color={c.solved ? c.color : getRandomColor()}
            onClick={() => {
              navigator.clipboard.readText().then((clipText) => {
                if (c.code === clipText) {
                  console.log("yeyye");
                  const newCodes = codes.slice();
                  const ni = newCodes.indexOf(c);
                  newCodes[ni].solved = true;
                  setCodes(newCodes);
                } else {
                  console.log("ei oo", c.code, clipText);
                }
              });
            }}
          >
            {c.solved ? c.code : " ?????"}
          </Reader>
        );
      })}
    </>
  );
};

/*

*/
