import React from "react";
import styled from "styled-components";
import { MessageEmitter } from "./util/WordStream";

const Radio = styled.div`
  height: 500px;
  width: 500px;
  background-color: black;
  border: 1px solid gray;
  border-radius: 6px;
  padding: 20px;
`;

const TextDisplay = styled.div`
  width: 100%;
  background-color: darkgreen;
  color: lightgreen;
  font-family: "Courier New", Courier, monospace;
  font-size: 50px;
  border-radius: 2px;
  line-height: 75px;
  height: 75px;
`;

const CipherInput = styled.input`
  margin-top: 20px;
  width: 100%;
`;

interface State {
  message: string;
}

export class WordTuner extends React.PureComponent<unknown, State> {
  private onMessage = (value: string) => {
    const newValue = (this.state.message + value).substr(-this.messageLength);
    this.setState({ message: newValue });
  };

  private readonly messageLength = 16;

  private emitter = new MessageEmitter(this.onMessage);

  readonly state = {
    message: "",
  };

  private updateCipher = (foo) => {
    this.emitter.setCipher(foo.target.value);
  };

  render() {
    return (
      <Radio>
        <TextDisplay>{this.state.message}</TextDisplay>
        <CipherInput
          type={"range"}
          min="6"
          max="20"
          step="1"
          onChange={this.updateCipher}
          value={this.emitter.getCipher}
        />
      </Radio>
    );
  }
}
