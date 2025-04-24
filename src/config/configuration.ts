export default () => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
  secret: {
    access: process.env.ACCESS_SECRET || 'AccessSecret',
    refresh: process.env.REFRESH_SECRET || 'RefreshSecret',
  },
  folders: process.env.FOLDERS || './uploads',
});
