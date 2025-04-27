const { ipcRenderer } = window.require('electron');

const showNotification = (title, body) => {
  ipcRenderer.send('show-notification', { title, body });
};

export default showNotification;
