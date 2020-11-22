import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoomApi } from "../../rooms";
import { generateDocument } from "../util/DocumentGenerator";

import { useIsVisible } from "../../../hooks/visibility";

import { OxygenMeter } from "../../../OxygenMeter";

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

const generateDocuments = () => {
  const starLogs = [];
  for (let n = 0; n < 20; n++) {
    starLogs.push(generateDocument(n));
  }
  return starLogs;
};

export const Printer = ({ onReady, onComplete }: RoomApi) => {
  const [codes, setCodes] = useState(generateDocuments);
  const [selected, setSelected] = useState(null);
  const [visible] = useIsVisible();

  useEffect(() => {
    onReady("Printer");
  }, []);

  React.useEffect(() => {
    //Printer is completed the same time as the fax
    if (false) {
      onComplete();
    }
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
