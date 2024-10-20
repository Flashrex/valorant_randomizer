<script setup lang="ts">

</script>

<template>
  <div class="content">
    <section>
      <h1>About this website</h1>
      <p>This website enables you to select a random agent, map, or strategy for your next Valorant game.</p>
      <br>
      <p>Data utilized here is provided by <a class="link" href="https://valorant-api.com"
          target="_blank">valorant-api.com</a>.</p>
    </section>

    <!-- <section>
      <h1>Buy me a coffee</h1>
      <p>If you like this project and want to support me, consider buying me a coffee.</p>
      <a class="buy-coffee" href="https://www.buymeacoffee.com/flashrex" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"
          style="height: 60px !important;width: 217px !important;" />
      </a>
    </section> -->

    <!-- <section>
      <h1>Contribute</h1>
      <p>If you want to contribute to this project, you can find the source code on <a class="link"
          href="https://github.com/Flashrex/valorant_randomizer" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </section> -->

    <section>
      <h1>Disclaimer</h1>
      <p>Valorant is a registered trademark of Riot Games, Inc. </p>
      <p>Riot Games, Inc. does not endorse or sponsor this project.</p>
    </section>

    <section>
      <h1>Privacy Policy</h1>
      <p>This website does not collect any personal data.</p>
    </section>

    <section>
      <h1>Contact</h1>
      <p>If you have any questions or suggestions, feel free to contact me at <a class="link"
          href="mailto:flashrexwastaken@gmail.com">flashrexwastaken@gmail.com</a>
      </p>
    </section>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 80vh;
  color: var(--color-text);

  gap: 2rem;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 80vw;
  max-width: 800px;
  padding: 1rem;
  border-radius: 10px;
}

.buy-coffee {
  margin-top: 1rem;
}
</style>
