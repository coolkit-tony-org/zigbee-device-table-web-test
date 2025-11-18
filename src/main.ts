import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import '@/assets/style/index.scss';

dayjs.extend(utc);
dayjs.extend(timezone);

createApp(App).use(router).mount('#app');
