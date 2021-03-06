import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoomApi } from "../../rooms";
import { generateDocument } from "../util/DocumentGenerator";

import { useIsVisible } from "../../../hooks/visibility";

import { OxygenMeter } from "../../../OxygenMeter";
import { ExitHatch } from "../../ExitHatch";

// @ts-ignore
import folder0 from "../../../assets/doku0.png";
// @ts-ignore
import folder0h from "../../../assets/doku0h.png";

const TextDisplay = styled.div`
  width: 100%;
  background-color: ${({ background }: { background?: string }) =>
    background || "darkgreen"};
  color: lightgreen;
  font-family: "Courier New", Courier, monospace;
  font-size: 40px;
  border-radius: 4px;
  line-height: 75px;
  height: 75px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DokuText = styled.div`
  top: ${(props) => (props.y ? props.y : 100)}%;
  left: ${(props) => (props.x ? props.x : 100)}%;
  transform: ${(props) => (props.selected ? "rotate(20deg)" : null)};
  width: 60px;
  height: 60px;
  margin: 10px;
  margin-top: 20px;
  position: absolute;
  font-size: 15px;
  font-weight: bolder;
  word-wrap: break-word;
  font-family: "Courier New", Courier, monospace;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #000;
  text-shadow: #000 0 0 3px;
  color: #fff;
  text-align: center;
  line-height: 25px;
`;

export const Document = styled.img`
  width: 80px;
  height: 80px;
  position: absolute;
  font-size: 15px;
  font-weight: bolder;
  word-wrap: break-word;
  font-family: "Courier New", Courier, monospace;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #000;
  text-shadow: #000 0 0 3px;
  color: #fff;
  text-align: center;
  line-height: 25px;
`;

const FloatingDocument = styled(Document)`
  top: ${(props) => (props.y ? props.y : 100)}%;
  left: ${(props) => (props.x ? props.x : 100)}%;
  transform: ${(props) => (props.selected ? "rotate(20deg)" : null)};
  src: ${(props) => (props.src ? props.src : folder0)};
`;
//   background: ${(props) => (props.color ? props.color : "#00ff00")};
//   border: ${(props) => (props.selected ? "2px solid #FFFFFF" : null)};

const generateDocuments = () => {
  const starLogs = [];
  for (let n = 0; n < 20; n++) {
    starLogs.push(generateDocument(n));
  }
  return starLogs;
};

export const Printer = ({ onReady, onComplete, roomCompleted }: RoomApi) => {
  const [codes, setCodes] = useState(generateDocuments);
  const [selected, setSelected] = useState(null);
  const [visible] = useIsVisible();

  useEffect(() => {
    onReady();
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
      <ExitHatch completed={roomCompleted} />
      <OxygenMeter roomId="printer" />
      <TextDisplay background={selected && "orange"}>
        {selected ? selected : "Copy a document"}
      </TextDisplay>
      {codes.map((c) => {
        return (
          <>
            <FloatingDocument
              key={c.code}
              x={c.x}
              y={c.y}
              color={c.color}
              selected={selected === c.code}
              src={selected === c.code ? folder0h : folder0}
            />
            <DokuText
              x={c.x}
              y={c.y}
              selected={selected === c.code}
              onClick={() => {
                navigator.clipboard.readText().then(() => {
                  const newCodes = codes.slice().map((nc) => {
                    if (nc.code !== c.code) {
                      nc.x = 5 + 10 * Math.round(Math.random() * 7);
                      nc.y = 10 + 5 * Math.round(Math.random() * 14);
                    }
                    return nc;
                  });
                  setCodes(newCodes);
                  navigator.clipboard.writeText(c.code);
                  setSelected(c.code);
                });
              }}
            >
              {c.code}
            </DokuText>
          </>
        );
      })}
    </>
  );
};

/*
          </FloatingDocument>

*/
