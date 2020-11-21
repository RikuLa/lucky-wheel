export const getWordStream = (encrypted: string): ReadableStream => {
  const message = encrypted;

  let i = 0;

  const strat = new CountQueuingStrategy({ highWaterMark: message.length });

  return new ReadableStream<string>(
    {
      start(controller) {
        for (const s of message) {
          controller.enqueue(s);
        }
      },
      pull(controller) {
        controller.enqueue(message[i % message.length]);
        i += 1;
      },
    },
    strat
  );
};

export class MessageEmitter {
  private interval;

  constructor(private callback: (value: string) => void) {
    this.startListeningToStream();
  }

  private cipher = 6;

  private rotateCharacter = (s: string, by: number) => {
    return String.fromCharCode(s.charCodeAt(0) + by);
  };

  private shift = (str: string, by: number) =>
    Array.from(str)
      .map((s) => this.rotateCharacter(s, by))
      .join("");

  private wordStream = getWordStream(
    this.shift("lucky-wheel///", 13)
  ).getReader();

  private startListeningToStream = () => {
    this.interval = setInterval(async () => {
      const { value } = await this.wordStream.read();
      this.callback(this.shift(value, -this.cipher));
    }, 200);
  };

  public setCipher = (newCipher: number) => {
    this.cipher = newCipher;
  };

  public get getCipher() {
    return this.cipher;
  }
}
