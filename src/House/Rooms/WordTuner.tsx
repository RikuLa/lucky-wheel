import React from "react";
import styled from "styled-components";
import { MessageEmitter } from "./util/WordStream";
import { RoomApi } from "../rooms";
import { Silver } from "react-dial-knob";
import { OxygenMeter } from "../../OxygenMeter";
import { ExitHatch } from "../ExitHatch";
import { TextBox } from "../Lobby";

const RadioContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.8);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;

  @media screen and (min-width: 550px) {
    height: 100vh;
    grid-template-columns: 175px auto;
    grid-template-rows: 1fr;
  }
`;

const Radio = styled.div`
  min-height: 350px;
  max-height: 100vh;
  max-width: 100vw;
  background-color: #222222;
  border: 1px solid gray;
  border-radius: 6px;
  padding: 20px;
  font-family: "Courier New", Courier, monospace;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 150px;
`;

const TextDisplay = styled.div`
  background-color: darkgreen;
  color: lightgreen;
  font-family: "Courier New", Courier, monospace;
  font-size: 50px;
  text-align: center;
  border-radius: 4px;
  line-height: 75px;
  height: 75px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
`;

const KnobContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  touch-action: none;
`;

const Knob = styled.div`
  font-family: "Courier New", Courier, monospace;
  font-size: 50px;
  color: #c0c0c0;
  text-align: center;
`;

const SubmitButton = styled.div`
  background-color: lightgray;
  color: darkgreen;
  border-radius: 4px;
  height: 50px;
  font-size: 50px;
  text-align: center;
  cursor: pointer;
`;

const Indicator = styled.div`
  height: 50px;
  width: 50px;
  background-color: ${(props) => (props.done ? "green" : "red")};
  border-radius: 50%;
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 50px;
  grid-column-gap: 20px;
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

  private readonly messageLength = 14;

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
    this.emitter.setActiveChannel(channel);
  };

  componentDidMount() {
    this.props.onReady();
  }

  submitSolution = () => {
    const isCorrect = this.emitter.checkAnswer();
    if (isCorrect) {
      this.props.onComplete();
    } else {
      console.error("Nope");
    }
  };

  render() {
    return (
      <>
        <RadioContainer>
          <TextBox>
            You go to check the comms, but somewhere along the way the radio
            settings have taken a beating.
          </TextBox>
          <Radio>
            <TextDisplay>{this.state.message}</TextDisplay>
            <KnobContainer>
              <Knob>
                <Silver
                  diameter={100}
                  min={6}
                  max={14}
                  step={1}
                  onValueChange={this.updateCipher}
                  value={this.state.cipher}
                  style={{
                    display: "inline-block",
                  }}
                />
              </Knob>
              <Knob>
                <Silver
                  diameter={100}
                  min={0}
                  max={2}
                  step={1}
                  onValueChange={this.updateChannel}
                  value={this.state.channel}
                  style={{
                    display: "inline-block",
                  }}
                />
              </Knob>
            </KnobContainer>
            <ControlsContainer>
              <SubmitButton onClick={this.submitSolution}>SEND</SubmitButton>
              <Indicator done={this.props.roomCompleted} />
            </ControlsContainer>
          </Radio>
        </RadioContainer>
        <ExitHatch completed={this.props.roomCompleted} />
        <OxygenMeter roomId="wordBox" />
      </>
    );
  }
}
