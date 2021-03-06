import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoomApi } from "../../rooms";

import { useIsVisible } from "../../../hooks/visibility";
import { generateDocument } from "../util/DocumentGenerator";

import { OxygenMeter } from "../../../OxygenMeter";
import { ExitHatch } from "../../ExitHatch";

// @ts-ignore
import FaxImg from "../../../assets/faxeri.png";

const TextDisplay = styled.div`
  width: 100%;
  background-color: ${({ background }: { background?: string }) =>
    background || "darkgreen"};
  color: lightgreen;
  font-family: "Courier New", Courier, monospace;
  font-size: 35px;
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
  margin: 8em;
  margin-top: 10px;
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

export const FaxImage = styled.img`
  top: ${(props) => (props.y ? props.y : 100)}%;
  left: ${(props) => (props.x ? props.x : 100)}%;
  filter: ${(props) => (props.completed ? "hue-rotate(90deg)" : null)};
  width: 16em;
  height: 16em;
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
  src: ${(props) => (props.src ? props.src : FaxImg)};
`;

const FaxMachine = styled(FaxImage)`
  position: absolute;
  top: ${(props) => (props.y ? props.y : 100)}%;
  left: ${(props) => (props.x ? props.x : 100)}%;
`;
/**
 * 
 *   background: ${(props) => (props.color ? props.color : "#00ff00")};
  border: ${(props) => (props.completed ? "2px solid #FFFFFF" : null)};

 */
const generateDocuments = () => {
  const starLogs = [];
  starLogs.push(generateDocument(14));
  return starLogs;
};

export const Fax = ({ onReady, onComplete, roomCompleted }: RoomApi) => {
  const [codes, setCodes] = useState(generateDocuments);
  const [selected, setSelected] = useState(null);
  const [visible] = useIsVisible();

  useEffect(() => {
    onReady();
  }, []);

  useEffect(() => {
    if (codes.every((c) => c.solved)) {
      onComplete();
    }
  }, [selected, codes]);

  useEffect(() => {
    navigator.clipboard.readText().then((clipText) => {
      if (clipText.startsWith("Log")) {
        setSelected(clipText);
      }
    });
  }, [visible]);

  const [status, setStatus] = useState<{ color: string; label: string } | null>(
    null
  );
  useEffect(() => {
    const timer = setTimeout(() => setStatus(null), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const solved = codes.every((c) => c.solved);

  return (
    <>
      <ExitHatch completed={roomCompleted} />
      <OxygenMeter roomId="fax" />
      <TextDisplay background={solved ? "#0074D9" : status && status.color}>
        {solved
          ? "All logs faxed!"
          : status
          ? status.label
          : "Send out document"}
      </TextDisplay>
      {codes.map((c) => {
        return (
          <>
            <FaxMachine
              key={c.code}
              x={20}
              y={30}
              completed={c.solved}
              src={FaxImg}
              onClick={() => {
                navigator.clipboard.readText().then((clipText) => {
                  if (c.code === clipText) {
                    const newCodes = codes.slice();
                    const ni = newCodes.indexOf(c);
                    newCodes[ni].solved = true;
                    setCodes(newCodes);
                    setStatus({ label: "Sending document..", color: "gray" });
                  } else {
                    setStatus({ label: "Wrong document", color: "#FF4136" });
                  }
                  navigator.clipboard.writeText("");
                  setSelected(null);
                });
              }}
            />
            <DokuText
              key={c.code}
              x={20}
              y={30}
              color={c.color}
              completed={c.solved}
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

*/
