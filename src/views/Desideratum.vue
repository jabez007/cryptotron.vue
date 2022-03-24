<template>
  <vs-card class="card">
    <div slot="header" class="header">
      <vs-row vs-type="flex" vs-justify="center" vs-align="center">
        <h3>Kerckhoffs's Desideratum of Cryptography</h3>
        <vs-button
          flat
          color="dark"
          icon="info"
          size="small"
          href="https://en.wikipedia.org/wiki/Kerckhoffs's_principle"
          target="_blank"
        >
        </vs-button>
      </vs-row>
    </div>
    <div class="main">
      <p>
        Stated by Netherlands born cryptographer Auguste Kerckhoffs in the 19th
        century:<br />
        <span style="font-style: italic">
          A cryptosystem should be secure even if everything about the system,
          except the key, is public knowledge.
        </span>
      </p>
      <p>
        This principle was reformulated (or possibly independently formulated)
        by American mathematician Claude Shannon as "the enemy knows the
        system",
        <br />
        i.e.,<br />
        <span style="font-style: italic">
          "one ought to design systems under the assumption that the enemy will
          immediately gain full familiarity with them".
        </span>
        <br />
        In that form, it is called Shannon's maxim.
      </p>
      <p>
        This concept is widely embraced by cryptographers, in contrast to
        "security through obscurity", which is not. The algorithm for a cipher
        may be kept secret though. However, it should not be part of the cipher
        algorithm's assumptions that it must be kept secret to maintain
        security. The decision to keep an algorithm secret should only be in
        keeping with a layered security posture.
      </p>
    </div>
  </vs-card>
</template>

<script>
export default {
  name: 'Desideratum',
};
</script>
