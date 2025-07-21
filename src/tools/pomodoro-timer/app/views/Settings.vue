<script setup>
import { useStore } from 'vuex';
import NumberInput from '../components/NumberInput.vue';
import AppColorPicker from '../components/AppColorPicker.vue';
import AlarmSoundToggle from '../components/AlarmSoundToggle.vue';

const store = useStore('pomodoro-store');

store.commit('setInitialTimer');
store.commit('setFirstVisitStatus', { propValue: false });
</script>

<template>
  <form @submit.prevent>
    <NumberInput id="workInterval" :min="1" :max="120" label="Work Interval" /><span>min</span><br>
    <NumberInput id="shortBreak" :min="1" :max="120" label="Short break" /><span>min</span><br>
    <NumberInput id="shortBreakCount" :min="1" :max="10" label="Short break count" /><span>breaks</span><br>
    <NumberInput id="longBreak" :min="1" :max="120" label="Long break" /><span>min</span><br>
    <AlarmSoundToggle id="prefersAlarmSound" label="Alarm Sound" /><br>
    <AppColorPicker id="appAccentColor" label="App color" /><br>
    <a class="lets-go" @click="store.commit('goToPage', 'home')">
      LET'S GO!
    </a>
    <button type="button" class="reset-btn" @click="store.commit('restoreDefaultSettings')">
      RESTORE DEFAULTS
    </button>
  </form>
</template>

<style scoped>
form {
    align-self: center;
    margin-top: -0.625rem;
    font-size: 1.25rem;
}
.lets-go {
    text-decoration: none;
    outline: none!important;
    border-style: none;
    border: white 0.0625rem solid;
    box-shadow: 1px 1px 7px -3px black;
    border-radius: 0.375rem;
    background-color: var(--pomodoro-app-accent-color);
    color: var(--pomodoro-text-contrast-color);
    padding: 10px 15px 9px 15px;
    cursor: pointer;
    margin: 0 auto;
    display: block;
    text-align: center;
    width: 90%;
    font-size: 1.125rem;
}
.reset-btn {
    display: block;
    margin: 0 auto;
    margin-top: 1.25rem;
    width: 90%;
    background-color: white;
    color: var(--pomodoro-app-accent-color);
    border: 0.0625rem solid var(--pomodoro-app-accent-color);
    box-shadow: none;
}
</style>
