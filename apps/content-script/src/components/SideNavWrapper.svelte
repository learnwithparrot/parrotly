<script lang="ts">
  import { ExtensionSideNav } from '@parrotly.io/extension-components';
  import browser from 'webextension-polyfill';
  import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
  import type {
    MESSAGE_UPDATE_USER_SETTINGS,
    IUserSettings,
    MESSAGE_SHOW_SIDENAV,
  } from '@parrotly.io/types';

  let isModalVisible = false;
  let settings: IUserSettings;

  browser.runtime.onMessage.addListener(function (request) {
    switch (request.type) {
      case EXTENSION_MESSAGES.SHOW_SIDE_NAV: {
        settings = request.settings;
        toggleShowModal();
        break;
      }
      case EXTENSION_MESSAGES.ON_SIGN_OUT: {
        settings = undefined;
      }
      case EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS: {
        if (!isModalVisible) return;
        const message = { type: EXTENSION_MESSAGES.SHOW_SIDE_NAV };
        toggleShowModal();
        browser.runtime.sendMessage(message);
      }
    }
  });

  const toggleShowModal = () => {
    isModalVisible = !isModalVisible;
  };

  function saveUserSettings(data: IUserSettings, id: string) {
    const message: MESSAGE_UPDATE_USER_SETTINGS = {
      type: EXTENSION_MESSAGES.UPDATE_USER_SETTINGS,
      settings: data,
      id,
    };
    browser.runtime.sendMessage(message);
  }

  function handleClose() {
    isModalVisible = false;
  }
</script>

<template>
  {#if isModalVisible}
    <ExtensionSideNav
      on:close={handleClose}
      userSettings={settings}
      on:settings={(event) => saveUserSettings(event.detail, settings.id)}
    />
  {/if}
</template>
