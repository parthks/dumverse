let countdown: any = null;
let combatCountdown: any = null;

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

  if (type === "combat_start") {
    const {  initialCountdown } = data;

    if (combatCountdown === null) {
      combatCountdown = initialCountdown;
    }

    const timer = setInterval(() => {
      if (combatCountdown > 0) {
        // combatCountdown -= 1;
        // if (combatCountdown == 0) {
        console.log("combatCountdown: "+combatCountdown);
          clearInterval(timer);
          combatCountdown = null;
        // }

        self.postMessage({ combatCountdown }); // Send updated countdown
      }

      //   if (countdown == 0) {
      //     clearInterval(timer);
      //     countdown = null;
      //     self.postMessage({ complete: true }); // Notify completion
      //   }
    }, initialCountdown);
  }

  if (type === "stop") {
    countdown = null;
    self.postMessage({ stopped: true });
  }

  if (type === "combat_stop") {
    combatCountdown = null;
    self.postMessage({ stopped: true });
  }
};

export {};
