import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'your-service-name',
  streams: [
    { level: 'info', stream: process.stdout },
    { level: 'error', path: 'error.log' },
    { level: 'info', path: 'combined.log' },
  ],
});

export default logger;