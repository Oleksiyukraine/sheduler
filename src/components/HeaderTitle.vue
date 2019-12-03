<template>
  <div class="header-wrapper">
    <q-btn
      v-if="$route.name === 'board'"
      v-go-back=" '/' "
      color="secondary"
      icon="arrow_left"
      outline
      dense
      :label="$t('back')"
    />
    <div class="header-title">{{ text }}</div>
  </div>
</template>

<script>

export default {
  name: 'HeadTitle',
  props: ['text']
}
</script>

<style scoped lang="scss">
  .header-title {
    width: 100%;
    border-bottom: 1px solid lightgray;
    text-align: center;
    line-height: 50px;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: bold;
    color: $secondary;
    font-family: "Times New Roman", Times, serif;
    text-shadow: 1px 1px 1px rgba(darken($primary, 25%), .3);
  }
  .header-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    background-color: whitesmoke;
    button {
      top: 8px;
      left: 5px;
      position: absolute;
    }
  }
</style>
