import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false, // replay as you scroll up and down
      mirror: true, // also animate out when scrolling past
      offset: 80,
      anchorPlacement: "top-bottom",
    });

    // Recalculate positions once fonts/images have settled
    window.addEventListener("load", () => AOS.refresh());
  });
});
