let countdown: any = null;

self.onmessage = (event) => {
  const { type, data } = event.data;

  if (type === "start") {
    const { interval, initialCountdown } = data;

    if (countdown === null) {
      countdown = initialCountdown;
    }

    const timer = setInterval(() => {
      if (countdown > 0) {
        countdown -= 1;
        if (countdown == 0) {
          clearInterval(timer);
          countdown = null;
        }

        self.postMessage({ countdown }); // Send updated countdown
      }

      //   if (countdown == 0) {
      //     clearInterval(timer);
      //     countdown = null;
      //     self.postMessage({ complete: true }); // Notify completion
      //   }
    }, interval);
  }

  if (type === "stop") {
    countdown = null;
    self.postMessage({ stopped: true });
  }
};

export {};
