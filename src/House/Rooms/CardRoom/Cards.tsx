import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoomApi } from "../../rooms";

const Card = styled.div`
  width: 3em;
  height: 8em;
  position: absolute;
  bottom: ${(props) => (props.y ? props.y : 100)}%;
  left: ${(props) => (props.x ? props.x : 100)}%;
  background: ${(props) => (props.color ? props.color : "#00ff00")};
  border: ${(props) => (props.selected ? "6px solid #FFFFFF" : null)};
  font-size: 0.8em;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  writing-mode: vertical-rl;
  text-orientation: upright;
`;

const Reader = styled.div`
  width: 60px;
  height: 50px;
  position: absolute;
  top: ${(props) => (props.y ? props.y : 100)}%;
  left: ${(props) => (props.x ? props.x : 100)}%;
  background: ${(props) => (props.color ? props.color : "#00ff00")};
  font-size: 0.8em;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
`;

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
  const code = Math.random().toString().substr(2, 6);
  return { code: code, color: getRandomColor(), solved: false };
};

export const Cards = ({ onReady, onComplete }: RoomApi) => {
  const [codes, setCodes] = useState(generateCards);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    onReady("Cards");
  }, []);

  React.useEffect(() => {
    if (codes.every((c) => c.solved)) {
      console.log("jee");
      onComplete();
    } else {
      console.log("yhyy", codes);
    }
  }, [selected]);
  return (
    <>
      {codes.map((c, i) => {
        return (
          <Card
            key={c.code}
            x={5 + i * 25}
            y={5}
            color={c.color}
            selected={selected === c.code}
            onClick={() => {
              navigator.clipboard.writeText(c.code);
              setSelected(c.code);
            }}
          >
            {c.code}
          </Card>
        );
      })}
      {codes.map((c) => {
        return (
          <Reader
            key={c.code}
            x={5 + 20 * Math.round(Math.random() * 4)}
            y={5 + 5 * Math.round(Math.random() * 5)}
            color={c.solved ? c.color : getRandomColor()}
            onClick={() => {
              navigator.clipboard.readText().then((clipText) => {
                if (c.code === clipText) {
                  const newCodes = codes.slice();
                  const ni = newCodes.indexOf(c);
                  newCodes[ni].solved = true;
                  setCodes(newCodes);
                }
                navigator.clipboard.writeText("");
                setSelected(null);
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
