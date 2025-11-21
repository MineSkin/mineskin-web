<template>
    <div>
        <component is="script"
                   async
                   src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
                   crossorigin="anonymous"
        ></component>
        <component is="script">
            window.googletag = window.googletag || { cmd: [] };

            let rewardedSlot;
            let rewardPayload;

            googletag.cmd.push(() => {
            rewardedSlot = googletag.defineOutOfPageSlot(
            "/22639388115/rewarded_web_example",
            googletag.enums.OutOfPageFormat.REWARDED,
            );

            /* Slot returns null if the page or device does not support rewarded ads. */
            if (rewardedSlot) {
            rewardedSlot.addService(googletag.pubads());

            googletag.pubads().addEventListener("rewardedSlotReady", (event) => {
            updateStatus("Rewarded ad slot is ready.");

            document.getElementById("watchAdButton").onclick = () => {
            event.makeRewardedVisible();
            displayModal();
            updateStatus("Rewarded ad is active.");
            };

            displayModal("reward", "Watch an ad to receive a special reward?");
            });

            googletag.pubads().addEventListener("rewardedSlotVideoCompleted", (event) => {
            updateStatus("Video ad has finished playing.");
            });

            googletag.pubads().addEventListener("rewardedSlotClosed", dismissRewardedAd);

            googletag.pubads().addEventListener("rewardedSlotGranted", (event) => {
            rewardPayload = event.payload;
            updateStatus("Reward granted.");
            });

            googletag.pubads().addEventListener("slotRenderEnded", (event) => {
            if (event.slot === rewardedSlot && event.isEmpty) {
            updateStatus("No ad returned for rewarded ad slot.");
            }
            });

            googletag.enableServices();
            googletag.display(rewardedSlot);
            } else {
            updateStatus("Rewarded ads are not supported on this page.");
            }
            });

            function dismissRewardedAd() {
            if (rewardPayload) {
            /* User was granted a reward and closed the ad.*/
            displayModal(
            "grant",
            `You have been rewarded ${rewardPayload.amount} ${rewardPayload.type}!`,
            );
            rewardPayload = null;
            } else {
            /* User closed the ad without getting a reward.*/
            displayModal();
            }

            updateStatus("Rewarded ad has been closed.");

            if (rewardedSlot) {
            googletag.destroySlots([rewardedSlot]);
            }
            }

            function displayModal(type = "", message = "") {
            const modal = document.getElementById("modal");
            modal.removeAttribute("data-type");

            if (type) {
            document.getElementById("modalMessage").textContent = message;
            modal.setAttribute("data-type", type);
            }
            }

            function updateStatus(message) {
            document.getElementById("status").textContent = message;
            }
        </component>
        <component is="style">
            .modal {
                display: none;
                position: fixed;
                z-index: 1;
                padding-top: 300px;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.4);
            }

            .modal[data-type] {
                display: block;
            }

            .modalDialog {
                margin: auto;
                padding: 25px;
                background-color: white;
                text-align: center;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .grantButtons,
            .rewardButtons {
                display: none;
            }

            .modal[data-type="grant"] .grantButtons,
            .modal[data-type="reward"] .rewardButtons {
                display: block;
            }

            .modal input[type="button"] {
                padding: 0.5rem;
                background: blue;
                border: none;
                border-radius: 4px;
                margin: 4px;
                color: white;
            }
        </component>
        <div>
            <h1 id="status"></h1>
            <div id="modal" class="modal">
                <div class="modalDialog">
                    <p id="modalMessage"></p>

                    <span class="grantButtons">
                      <input id="closeButton" type="button" value="Close"/>
                    </span>

                                <span class="rewardButtons">
                      <input type="button" id="watchAdButton" value="Yes"/>
                      <input id="noRewardButton" type="button" value="No"/>
                    </span>

                    <component is="script" async
                               :src="'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + clientId"
                               crossorigin="anonymous"></component>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";

const runtimeConfig = useRuntimeConfig();
const isDev = runtimeConfig.public.isDev;
const clientId = runtimeConfig.public.google.adsense;

const ready = ref(false);
onMounted(() => {
    ready.value = true;
});
</script>