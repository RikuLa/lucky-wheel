import Chance from "chance";

export const getWordStream = (encrypted: string): ReadableStream => {
  const message = encrypted;

  let i = 0;

  return new ReadableStream<string>({
    start(controller) {
      for (const s of message) {
        controller.enqueue(s);
      }
    },
    pull(controller) {
      controller.enqueue(message[i % message.length]);
      i += 1;
    },
  });
};

export class MessageEmitter {
  private readonly correctCipher = 13;
  private cipher = 6;

  private readonly correctChannel = 2;
  private activeChannel = 0;

  private readonly message = "lucky///";

  private rotateCharacter = (s: string, by: number) => {
    return String.fromCharCode(s.charCodeAt(0) + by);
  };

  private shift = (str: string, by: number) =>
    Array.from(str)
      .map((s) => this.rotateCharacter(s, by))
      .join("");

  private buildStream = (seed: number) => {
    const chance = new Chance(seed);

    return getWordStream(
      this.shift(chance.shuffle(this.message), 13)
    ).getReader();
  };

  private channels = [
    this.buildStream(1),
    this.buildStream(2),
    getWordStream(this.shift(this.message, 13)).getReader(),
  ];

  private interval;

  constructor(private callback: (value: string) => void) {
    this.startListeningToStream();
  }

  private startListeningToStream = () => {
    this.interval = setInterval(async () => {
      const { value } = await this.channels[this.activeChannel].read();
      this.callback(this.shift(value, -this.cipher));
    }, 200);
  };

  public setCipher = (newCipher: number) => {
    this.cipher = newCipher;
  };

  public setActiveChannel = (channel: number) => {
    this.activeChannel = channel;
  };

  public checkAnswer = (): boolean => {
    return (
      this.activeChannel === this.correctChannel &&
      this.cipher === this.correctCipher
    );
  };
}
