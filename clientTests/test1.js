const bacnet = require('@biancoroyal/bacstack');
const enums = require("./enums");
const options = {
    port: 47808,
    apduTimeout: 6000,
    interface: '192.168.0.23',  //192.168.10.112 192.168.0.23
    // broadcastAddress: '0.0.0.0', 
    broadcastAddress: '255.255.255.255', 
  };


const client = new bacnet(options);
// // Read Device Object
const requestArray = [{
  objectId: {type: 1, instance: 1},
  properties: [{id: 85}]
}];
// client.readPropertyMultiple('192.168.10.105', requestArray, (err, value) => {
//   // console.log(JSON.stringify(value));
//   // console.log('err: ', err);
// });



client.on('iAm', (device) => {
    console.log(device);
    console.log(1111111);
  //   console.log('deviceId: ', device.deviceId);
  //   console.log('maxApdu: ', device.maxApdu);
  //   console.log('segmentation: ', device.segmentation);
  //   console.log('vendorId: ', device.vendorId);
  });
  client.whoIs();

// const client = new bacnet({ apduTimeout: 5000 });

// const enums = require("./enums");

// const getObjectList = (host, type, instance) => {
//   return new Promise((resolve, reject) => {
//     client.readProperty(
//       host,
//       { type: type, instance: instance },
//       enums.PropertyId.objectList,
//       (err, value) => {
//         if (err) reject(err);
//         else resolve(value.values);
//       }
//     );
//   });
// };


// getObjectList('192.168.0.202', 1, 1).then(e=> {
//     console.log(e)
// }).then(err => console.log(err))

// const getObjectName = (host, type, instance) => {
//   return new Promise((resolve, reject) => {
//     client.readProperty(
//       host,
//       { type: type, instance: instance },
//       enums.PropertyId.objectName,
//       (err, result) => {
//         if (err) reject(err);
//         else resolve(result.values[0].value);
//       }
//     );
//   });
// };

// const subscribeCOV = (host, type, instance, cancel) => {
//   cancel = cancel || false;
//   return new Promise((resolve, reject) => {
//     client.subscribeCOV(
//       host,
//       { type: type, instance: instance },
//       7,
//       cancel,
//       false,
//       0,
//       (err, value) => {
//         if (err) reject(err);
//         else resolve(value);
//       }
//     );
//   });
// };

// const onCOV = cb => {
//   client.on("covNotifyUnconfirmed", cb);
// };



// Discover Devices
// client.on('iAm', (device) => {
//   console.log('address: ', device.address);
//   console.log('deviceId: ', device.deviceId);
//   console.log('maxApdu: ', device.maxApdu);
//   console.log('segmentation: ', device.segmentation);
//   console.log('vendorId: ', device.vendorId);
// });
// client.whoIs();

// // Read Device Object
// const requestArray = [{
//   objectId: {type: 8, instance: 1},
//   properties: [{id: 8}]
// }];
// client.readPropertyMultiple('192.168.0.202', requestArray, (err, value) => {
//   console.log('value: ', value);
//   console.log('err: ', err);
// });