

const bacnet = require('@biancoroyal/bacstack');
const enums = require("./enums");
const options = {
    port: 47809,
    apduTimeout: 6000,
    interface: '192.168.10.112',  //192.168.10.112 192.168.0.23
    broadcastAddress: '255.255.255.255',
  };


const client = new bacnet(options);
// console.log(client)
// Discover Devices
// client.on('iAm', (device) => {
// //   console.log(device);
// //   console.log('deviceId: ', device.deviceId);
// //   console.log('maxApdu: ', device.maxApdu);
// //   console.log('segmentation: ', device.segmentation);
// //   console.log('vendorId: ', device.vendorId);
// });
// client.whoIs();



// Read Device Object
const requestArray = [{
  objectId: {type: 1, instance: 1},
  properties: [{id: 85}]
}];
client.readPropertyMultiple('192.168.10.112:47808', requestArray, (err, value) => {
  console.log('value: ', JSON.stringify(value));
  console.log('err: ', err);
});




const getObjectList = (host, type, instance) => {
  return new Promise((resolve, reject) => {
    client.readProperty(
      host,
      { type: type, instance: instance },
      431,
      (err, value) => {
        if (err) reject(err);
        else resolve(value);
      }
    );
  });
};


getObjectList('192.168.0.202', 1, 1).then(e=> {
    console.log(e)
}).then(err => err)
