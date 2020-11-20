const getWordStream = (): ReadableStream => {
  const message = "ebin :D";

  const strat = new CountQueuingStrategy({ highWaterMark: message.length });

  return new ReadableStream<string>(
    {
      start(controller) {
        for (const s of message) {
          controller.enqueue(s);
        }
      },
      pull(controller) {
        controller.enqueue(Date.now().toString());
        console.log("Pull called");
      },
    },
    strat
  );
};

export const stream = getWordStream().getReader();
