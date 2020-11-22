import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoomApi } from "../../rooms";
import { OxygenMeter } from "../../../OxygenMeter";

import { useIsVisible } from "../../../hooks/visibility";

const TextDisplay = styled.div`
  width: 100%;
  background-color: darkgreen;
  color: lightgreen;
  font-family: "Courier New", Courier, monospace;
  font-size: 50px;
  border-radius: 4px;
  line-height: 75px;
  height: 75px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

const FaxMachine = styled.div`
  width: 60px;
  height: 50px;
  position: absolute;
  top: ${(props) => (props.y ? props.y : 100)}%;
  left: ${(props) => (props.x ? props.x : 100)}%;
  background: ${(props) => (props.color ? props.color : "#00ff00")};
  border: ${(props) => (props.completed ? "6px solid #FFFFFF" : null)};
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

const generateDocuments = () => {
  const starLogs = [];
  starLogs.push(generateDocument(14));
  return starLogs;
};

const generateDocument = (n) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 10);
  const dd = targetDate.getDate() + n * 3;
  const mm = targetDate.getMonth() + 1 + (n % 2 === 0 ? 1 : 0) + 1;
  const yyyy = targetDate.getFullYear() + 231;
  const dateString = yyyy + "" + dd + "" + mm;
  const code = "Log" + dateString;
  console.log(code, yyyy, dd, mm);
  return {
    code: code,
    color: getRandomColor(),
    solved: false,
    x: 5 + 10 * Math.round(Math.random() * 7),
    y: 5 + 5 * Math.round(Math.random() * 17),
  };
};

export const Fax = ({ onReady, onComplete }: RoomApi) => {
  const [codes, setCodes] = useState(generateDocuments);
  const [selected, setSelected] = useState(null);
  const [visible] = useIsVisible();

  useEffect(() => {
    onReady("Fax");
  }, []);

  React.useEffect(() => {
    if (codes.every((c) => c.solved)) {
      onComplete();
    }
  }, [selected]);

  useEffect(() => {
    navigator.clipboard.readText().then((clipText) => {
      if (clipText.startsWith("Log")) {
        setSelected(clipText);
      }
    });
  }, [visible]);

  return (
    <>
      <OxygenMeter roomId="fax" />
      <TextDisplay>
        {codes.every((c) => c.solved)
          ? "Log has been faxed to base"
          : selected
          ? "holding " + selected
          : "Return " + codes[0].code + " To the fax machine"}
      </TextDisplay>
      {codes.map((c) => {
        return (
          <FaxMachine
            key={c.code}
            x={c.x}
            y={c.y}
            color={c.color}
            completed={c.solved}
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
            {c.code}
          </FaxMachine>
        );
      })}
    </>
  );
};

/*

*/
