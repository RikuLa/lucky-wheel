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

const Document = styled.div`
  width: 60px;
  height: 50px;
  position: absolute;
  top: ${(props) => (props.y ? props.y : 100)}%;
  left: ${(props) => (props.x ? props.x : 100)}%;
  background: ${(props) => (props.color ? props.color : "#00ff00")};
  border: ${(props) => (props.selected ? "6px solid #FFFFFF" : null)};
  font-size: 0.8em;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
`;
/*
  writing-mode: vertical-rl;
  text-orientation: upright;
*/

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
  for (let n = 0; n < 20; n++) {
    starLogs.push(generateDocument(n));
  }
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
    y: 10 + 5 * Math.round(Math.random() * 15),
  };
};

export const Printer = ({ onReady, onComplete }: RoomApi) => {
  const [codes, setCodes] = useState(generateDocuments);
  const [selected, setSelected] = useState(null);
  const [visible] = useIsVisible();

  useEffect(() => {
    onReady("Printer");
  }, []);

  React.useEffect(() => {
    onComplete();
  }, []);

  useEffect(() => {
    navigator.clipboard.readText().then((clipText) => {
      if (clipText.startsWith("Log")) {
        setSelected(clipText);
      } else {
        setSelected(null);
      }
    });
  }, [visible]);

  return (
    <>
      <OxygenMeter roomId="printer" />
      <TextDisplay>
        {selected ? "holding " + selected : "Pick the document"}
      </TextDisplay>
      {codes.map((c) => {
        return (
          <Document
            key={c.code}
            x={c.x}
            y={c.y}
            color={c.color}
            selected={selected === c.code}
            onClick={() => {
              navigator.clipboard.readText().then(() => {
                const newCodes = codes.slice().map((nc) => {
                  nc.x = 5 + 10 * Math.round(Math.random() * 7);
                  nc.y = 5 + 5 * Math.round(Math.random() * 16);
                  return nc;
                });
                setCodes(newCodes);
                navigator.clipboard.writeText(c.code);
                setSelected(c.code);
              });
            }}
          >
            {c.code}
          </Document>
        );
      })}
    </>
  );
};

/*

*/
