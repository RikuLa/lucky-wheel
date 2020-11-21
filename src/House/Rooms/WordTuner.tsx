import React from "react";
import styled from "styled-components";
import { MessageEmitter } from "./util/WordStream";
import { RoomApi } from "../rooms";
import { Silver } from "react-dial-knob";

const Radio = styled.div`
  height: 500px;
  width: 500px;
  background-color: #111111;
  border: 1px solid gray;
  border-radius: 6px;
  padding: 20px;
  font-family: "Courier New", Courier, monospace;
`;

const TextDisplay = styled.div`
  width: 100%;
  background-color: darkgreen;
  color: lightgreen;
  font-family: "Courier New", Courier, monospace;
  font-size: 50px;
  border-radius: 4px;
  line-height: 75px;
  height: 75px;
`;

const KnobContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled.div`
  margin-top: 40px;
  background-color: darkgreen;
  color: lightgreen;
  height: 50px;
  font-size: 50px;
  width: 50%;
  text-align: center;
  cursor: pointer;
`;

interface State {
  message: string;
  cipher: number;
  channel: number;
}

export class WordTuner extends React.PureComponent<RoomApi, State> {
  private onMessage = (value: string) => {
    const newValue = (this.state.message + value).substr(-this.messageLength);
    this.setState({ message: newValue });
  };

  private readonly messageLength = 16;

  private emitter = new MessageEmitter(this.onMessage);

  readonly state = {
    message: "",
    cipher: 0,
    channel: 0,
  };

  private updateCipher = (cipher: number) => {
    this.setState({ cipher });
    this.emitter.setCipher(cipher);
  };

  private updateChannel = (channel: number) => {
    this.setState({ channel });
    this.emitter.setActiveStream(channel);
  };

  componentDidMount() {
    this.props.onReady();
  }

  render() {
    return (
      <Radio>
        <TextDisplay>{this.state.message}</TextDisplay>
        <KnobContainer>
          <Silver
            diameter={180}
            min={6}
            max={20}
            step={1}
            onValueChange={this.updateCipher}
            value={this.state.cipher}
            style={{
              display: "inline-block",
              margin: "0px 20px",
            }}
          />
          <Silver
            diameter={180}
            min={0}
            max={2}
            step={1}
            onValueChange={this.updateChannel}
            value={this.state.channel}
            style={{
              display: "inline-block",
              margin: "0px 20px",
            }}
          />
        </KnobContainer>
        <SubmitButton onClick={() => console.log("Clickety Clack")}>
          SEND
        </SubmitButton>
      </Radio>
    );
  }
}
