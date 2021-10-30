<script lang="ts">
  import { ExtensionSideNav } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
  import type { IUser, IUserSettings } from '@parrotly.io/types';

  let isModalVisible = false;
  let settings: IUserSettings;
  let user: IUser;

  browser.runtime.onMessage.addListener(function (request) {
    if (request.type === EXTENSION_MESSAGES.SHOW_SIDE_NAV) {
      settings = request.settings;
      user = request.user;
      toggleShowModal();
    }
  });

  const toggleShowModal = () => {
    console.log({ isModalVisible });
    isModalVisible = !isModalVisible;
    console.log({ isModalVisible });
  };

  function saveUserSettings(data: IUserSettings, id: string) {
    browser.runtime.sendMessage({
      type: EXTENSION_MESSAGES.UPDATE_USER_SETTINGS,
      settings: data,
      id,
    });
  }
</script>

<template>
  {#if isModalVisible}
    <ExtensionSideNav
      on:close={() => (isModalVisible = false)}
      userSettings={settings}
      on:settings={(event) => saveUserSettings(event.detail, settings.id)}
    />
  {/if}
</template>

<style lang="scss">
</style>
