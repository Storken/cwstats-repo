import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import WizardStatsComponent from './views/wizards/WizardStats';
import PlayerStatsComponent from './views/players/PlayerStats';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/wizards/:id',
      name: 'wizards',
      component: WizardStatsComponent,
    },
    {
      path: '/players/:address',
      name: 'players',
      component: PlayerStatsComponent,
    },
  ],
});
