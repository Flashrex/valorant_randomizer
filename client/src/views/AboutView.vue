<script setup lang="ts">
</script>

<template>
  <div class="content">
    <section>
      <h1>{{ $t('About this website') }}</h1>
      <p>{{ $t("This website is a tool for generating random maps for the game 'Valorant'.") }}
      </p>
      <br>
      <p>{{ $t('Data utilized here is provided by') }} <a class="link" href="https://valorant-api.com"
          target="_blank">valorant-api.com</a>.</p>
    </section>

    <section>
      <h1>{{ $t('Buy me a coffee') }}</h1>
      <p>{{ $t('If you like this project and want to support me, consider buying me a coffee.') }}</p>
      <a href='https://ko-fi.com/I2I115AQ06' target='_blank'><img height='36'
          style='margin: 1rem;border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi4.png?v=6' border='0'
          alt='Buy Me a Coffee at ko-fi.com' /></a>
    </section>

    <!-- <section>
      <h1>Contribute</h1>
      <p>If you want to contribute to this project, you can find the source code on <a class="link"
          href="https://github.com/Flashrex/valorant_randomizer" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </section> -->

    <section>
      <h1>{{ $t('Disclaimer') }}</h1>
      <p>{{ $t('Valorant is a registered trademark of Riot Games, Inc.') }}</p>
      <p>{{ $t('Riot Games, Inc. does not endorse or sponsor this project.') }}</p>
    </section>

    <section>
      <h1>{{ $t('Privacy Policy') }}</h1>
      <p>{{ $t('This website does not collect any personal data.') }}</p>
    </section>

    <section>
      <h1>{{ $t('Contact') }}</h1>
      <p>{{ $t('If you have any questions or suggestions, feel free to contact me at') }} <a class="link"
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

p {
  text-align: center;
}
</style>
