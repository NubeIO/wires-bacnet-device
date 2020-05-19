// import { SystemContext } from '../core/SystemContext';
// import { Node } from '../core/Node';
const bacnet = require('@biancoroyal/bacstack');
const PropertyIds = bacnet.enum.PropertyIdentifier;
const ObjectTypes = bacnet.enum.ObjectType;
const Segmentation = bacnet.enum.Segmentation;
//console.log("Enum is ", bacnet.enum);
/*
 '1:0' --> profile, object type, instance
 
 : {
    // from bacnet table
    [PropertyIds.PROP_OBJECT_IDENTIFIER]: [{value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 0}, type: 12}],    // PROP_OBJECT_IDENTIFIER
    // bacnet table
    [PropertyIds.PROP_OBJECT_NAME]: [{value: 'Analog Output 1', type: 7}],          // PROP_OBJECT_NAME
    [PropertyIds.PROP_OBJECT_TYPE]: [{value: 1, type: 9}],                          // PROP_OBJECT_TYPE
    [PropertyIds.PROP_PRESENT_VALUE]: [{value: 5, type: 4}]                           // PROP_PRESENT_VALUE
  },
 
 
 
 
 
*/
// PORT number
// optional ip address
//  deviceNumber : 444
// export class BacnetDevice extends SimulationDevice {
const client = new bacnet();
// const settings = {
//     deviceId: 123,
//     vendorId: 7
//   };

let config = {
    deviceId: 12,
    vendorId: 12234,
    port: 47808
};
let objectList = [
    { value: { type: ObjectTypes.DEVICE, instance: 443 }, type: 12 },
    { value: { type: ObjectTypes.ANALOG_OUTPUT, instance: 0 }, type: 12 },
    { value: { type: ObjectTypes.ANALOG_OUTPUT, instance: 1 }, type: 12 }
];
// FIXME: not a design

let dataStore = {
    '1:0': {
        [PropertyIds.OBJECT_IDENTIFIER]: [{ value: { type: ObjectTypes.ANALOG_OUTPUT, instance: 0 }, type: 12 }],
        [PropertyIds.OBJECT_NAME]: [{ value: 'Analog Output 1', type: 7 }],
        [PropertyIds.OBJECT_TYPE]: [{ value: 1, type: 9 }],
        [PropertyIds.PRESENT_VALUE]: [{ value: 5, type: 4 }] // PROP_PRESENT_VALUE
    },
    '1:1': {
        [PropertyIds.OBJECT_IDENTIFIER]: [{ value: { type: ObjectTypes.ANALOG_OUTPUT, instance: 1 }, type: 12 }],
        [PropertyIds.OBJECT_NAME]: [{ value: 'Analog Output 2', type: 7 }],
        [PropertyIds.OBJECT_TYPE]: [{ value: 1, type: 9 }],
        [PropertyIds.PRESENT_VALUE]: [{ value: 50, type: 4 }] // PROP_PRESENT_VALUE
    },
    '8:443': {
        [PropertyIds.OBJECT_IDENTIFIER]: [{ value: { type: ObjectTypes.DEVICE, instance: 443 }, type: 12 }],
        [PropertyIds.OBJECT_LIST]: objectList,
        [PropertyIds.OBJECT_NAME]: [{ value: 'my-device-443', type: 7 }],
        [PropertyIds.OBJECT_TYPE]: [{ value: 8, type: 9 }],
        [PropertyIds.DESCRIPTION]: [{ value: 'Test Device #443', type: 7 }] // PROP_DESCRIPTION
    },
};


client.on('whoIs', (data) => {
    console.log(data);
    console.log("whoIs");
    if (data.lowLimit && data.lowLimit > config.deviceId) return;
    if (data.highLimit && data.highLimit < config.deviceId) return;
    client.iAmResponse(data.header.sender, config.deviceId, Segmentation.SEGMENTED_BOTH, config.vendorId);
});


client.on('readPropertyMultiple', (data) => {
    console.log('*onReadPropertyMultiple * ');
    const responseList = [];
    const properties = data.payload.properties;
    console.log(JSON.stringify(data))
    properties.forEach((property) => { 
        console.log(0.10000)
        console.log(`${property.objectId.type} + ${ObjectTypes.DEVICE} + ${property.objectId.instance}` )
        if (property.objectId.type === ObjectTypes.DEVICE && property.objectId.instance === 4194303) {
            property.objectId.instance = config.deviceId;
            console.log(0.222220000)
        }
        const object = dataStore[property.objectId.type + ':' + property.objectId.instance];
        if (!object)
            return; // TODO: Add error
        const propList = [];
        console.log(2323)
        console.log(property.properties)
        console.log(434343)
        property.properties.forEach((item) => {
            console.log(item)
            console.log(111111)
            // if (item.id === PropertyIds.ALL) {
            //     for (let key in object) {
            //         console.log(22222)
            //         propList.push({ property: { id: key, index: 0xFFFFFFFF }, value: object[key] });
            //     }
            //     return;
            // }
            // const prop = object[item.id];
            // let content;
            // console.log(33333)

            // if (!prop)
            //     return; // TODO: Add error
            // if (item.index === 0xFFFFFFFF) {
            //     content = prop;
            //     console.log(44444)

            // }
            // else {
            //     const slot = prop[item.index];
            //     console.log(55555)
            //     if (!prop)
            //         return; // TODO: Add error
            //     content = [slot];
            // }
            // console.log(6666)
            // propList.push({ property: { id: item.id, index: item.index }, value: content });
        });
        console.log(777777)
        // responseList.push({ objectId: { type: property.objectId.type, instance: property.objectId.instance }, values: propList });
    });
    console.log(8888)
    // FIXME: hardcoded ip, need to take ip from data param
    // this.client.readPropertyMultipleResponse('192.168.178.255', data.invokeId, responseList);
    // client.readPropertyMultipleResponse(data.header.sender, data.invokeId, responseList);
});

//   client.on('readPropertyMultiple', (data) => {
//     console.log("readPropertyMultiple");
//     console.log(data.payload.properties);
//     const responseList = [];
//     const properties = data.payload.properties;
//     properties.forEach((property) => {
//       if (property.objectId.type === bacnet.enum.ObjectTypesSupported.DEVICE && property.objectId.instance === 4194303) {
//         property.objectId.instance = settings.deviceId;
//       }
//       const object = dataStore[property.objectId.type + ':' + property.objectId.instance];
//       if (!object) return; // TODO: Add error
//       const propList = [];
//       property.properties.forEach((item) => {
//         if (item.id === bacnet.enum.PropertyIdentifier.ALL) {
//           for (let key in object) {
//             propList.push({property: {id: key, index: 0xFFFFFFFF}, value: object[key]});
//           }
//           return;
//         }
//         const prop = object[item.id];
//         let content;
//         if (!prop) return; // TODO: Add error
//         if (item.index === 0xFFFFFFFF) {
//           content = prop;
//         } else {
//           const slot = prop[item.index];
//           if (!prop) return; // TODO: Add error
//           content = [slot];
//         }
//         propList.push({property: {id: item.id, index: item.index}, value: content});
//       });
//       responseList.push({objectId: {type: property.objectId.type, instance: property.objectId.instance}, values: propList});
//     });
//     client.readPropertyMultipleResponse(data.header.sender, data.invokeId, responseList);
//   });


//     constructor(context: SystemContext, node: Node) {
//           super(context, node);
//         console.log('**BacnetDevice created')
//     }
//     loadConfig() {
//       console.log('bacnet load config called');
//       this.bacnetDeviceProfile = this.context.configurationManager
//                   .loadBacnetDeviceProfile(this.fieldDevice.site_id, this.fieldDevice.profile_id);
//       console.log('bacnet profile is ', this.bacnetDeviceProfile);
//       // console.log("modbus Device profile is ", this.modbusDeviceProfile.registers)
//       for (const bacnetItem of this.bacnetDeviceProfile.objects) {
//         this.addObject(bacnetItem);
//       }
//   }
// function addObject(bacnetItem) {
//     const objectKey = `${bacnetItem.object_type}:${bacnetItem.instance_id}`;
//     const simulatedObject = { value: 50, type: 4 };
//     const objectDefinition = {
//         [PropertyIds.PROP_OBJECT_IDENTIFIER]: [{ value: { type: bacnetItem.object_type, instance: bacnetItem.instance_id }, type: 12 }],
//         [PropertyIds.PROP_OBJECT_NAME]: [{ value: bacnetItem.name, type: 7 }],
//         [PropertyIds.PROP_OBJECT_TYPE]: [{ value: 1, type: 9 }],
//         [PropertyIds.PROP_PRESENT_VALUE]: [simulatedObject] // PROP_PRESENT_VALUE
//     };
//     console.log('object key is ', objectKey);
//     this.dataStore[objectKey] = objectDefinition;
//     // for object listing
//     const obj = { value: { type: bacnetItem.object_type, instance: bacnetItem.instance_id }, type: 12 };
//     this.objectList.push(obj);
//     this.simulatedValues[bacnetItem.name] = simulatedObject;
//     console.log(this.dataStore);
// }
// //   init() {
// //     super.init();
// //     console.log("Bacnet Device Init ");
// //      this.loadConfig();
// //      this.connect();
// //      setInterval( () => {
// //       for (const itemName in this.simulatedValues) {
// //         this.simulatedValues[itemName].value = this.getDataValue(itemName).value;
// //       }
// //      }, 5000);
// //   }
// function connect() {
//     console.log('connecting/listening..');
//     // Initialize BACStack
//     this.client = new bacnet({
//         port: this.config.port || 47808,
//         apduTimeout: 6000
//     });
//     // Discover Devices
//     this.client.on('iAm', this.onIAm);
//     this.client.on('whoIs', this.onWhoIs);
//     this.client.on('readProperty', this.onReadProperty);
//     this.client.on('writeProperty', this.onWriteProperty);
//     this.client.on('whoHas', this.onWhoHas);
//     this.client.on('timeSync', this.onTimeSync);
//     this.client.on('timeSyncUTC', this.onTimeSyncUTC);
//     this.client.on('readPropertyMultiple', this.onReadPropertyMultiple);
//     this.client.on('writePropertyMultiple', this.onWritePropertyMultiple);
//     this.client.on('atomicWriteFile', this.onAtomicWriteFile);
//     this.client.on('atomicReadFile', this.onAtomicReadFile);
//     this.client.on('subscribeCOV', this.onSubscribeCOV);
//     this.client.on('subscribeProperty', this.onSubscribeProperty);
//     this.client.on('deviceCommunicationControl', this.onDeviceCommunicationControl);
//     this.client.on('reinitializeDevice', this.onReinitializeDevice);
//     this.client.on('readRange', this.onReadRange);
//     this.client.on('createObject', this.onCreateObject);
//     this.client.on('deleteObject', this.onDeleteObject);
// }
// let onIAm = (device) => {
//     console.log('iAM');
//     console.log('address: ', device.address);
//     console.log('deviceId: ', device.deviceId);
//     console.log('maxApdu: ', device.maxApdu);
//     console.log('segmentation: ', device.segmentation);
//     console.log('vendorId: ', device.vendorId);
// };
// let onWhoIs = (data) => {
//     console.log(data);
//     if (data.lowLimit && data.lowLimit > this.config.device_id)
//         return;
//     if (data.highLimit && data.highLimit < this.config.device_id)
//         return;
//     //this.client.iAmResponse(444, bacnet.enum.Segmentations.SEGMENTATION_BOTH, this.config.vendor_id);
//     this.client.iAmResponse(this.config.device_id, bacnet.enum.Segmentations.SEGMENTATION_BOTH, this.config.vendor_id);
//     // client.iAmResponse(settings2.deviceId, bacnet.enum.Segmentations.SEGMENTATION_BOTH, settings2.vendorId);
// };
// let onReadProperty = (data) => {
//     console.log('*onReadProperty * ', data);
//     const object = this.dataStore[data.request.objectId.type + ':' + data.request.objectId.instance];
//     console.log('object', object);
//     // if object not found
//     if (!object)
//         return this.client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
//     console.log("Read Object is", object);
//     console.log("Read Object Name Property ", object['77']);
//     const property = object[data.request.property.id];
//     console.log('object', property);
//     console.log("Read Object Property", property);
//     // if property not found
//     if (!property)
//         return this.client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_PROPERTY);
//     if (data.request.property.index === 0xFFFFFFFF) {
//         this.client.readPropertyResponse(data.address, data.invokeId, data.request.objectId, data.request.property, property);
//     }
//     else {
//         const slot = property[data.request.property.index];
//         if (!slot)
//             return this.client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_INVALID_ARRAY_INDEX);
//         this.client.readPropertyResponse(data.address, data.invokeId, data.request.objectId, data.request.property, [slot]);
//     }
// };
// let onWriteProperty = (data) => {
//     console.log('write data property ', data);
//     const object = this.dataStore[data.request.objectId.type + ':' + data.request.objectId.instance];
//     console.log("Write Req Object ", object);
//     if (!object)
//         return this.client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
//     let property = object[data.request.value.property.id];
//     let nameProperty = data.request.value.property;
//     console.log("Name Property is ", nameProperty);
//     if (!property)
//         return this.client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_PROPERTY);
//     if (data.request.value.property.index === 0xFFFFFFFF) {
//         console.log('INDEX FfFFFF');
//         let nameProperty = object[PropertyIds.PROP_OBJECT_NAME][0].value;
//         console.log("Name is ", nameProperty);
//         let valProperty = data.request.value.value;
//         let valueToWrite = valProperty[0].value;
//         console.log("New Value to write is ", valueToWrite);
//         console.log('Pre Val property is ', property);
//         this.setValue(nameProperty, valueToWrite);
//         this.client.simpleAckResponse(data.address, data.service, data.invokeId);
//     }
//     else {
//         console.log('INDEX Slot');
//         let slot = property[data.request.value.property.index];
//         if (!slot)
//             return this.client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_INVALID_ARRAY_INDEX);
//         slot = data.request.value.value[0];
//         this.client.simpleAckResponse(data.address, data.service, data.invokeId);
//     }
// };
// let onWhoHas = (data) => {
//     console.log('onWhoHas*****');
//     console.log(data);
//     if (data.lowLimit && data.lowLimit > this.config.device_id)
//         return;
//     if (data.highLimit && data.highLimit < this.config.device_id)
//         return;
//     if (data.objId) {
//         var object = this.dataStore[data.objId.type + ':' + data.objId.instance];
//         if (!object)
//             return;
//         this.client.iHaveResponse(this.config.device_id, { type: data.objId.type, instance: data.objId.instance }, object[77][0].value);
//     }
//     if (data.objName) {
//         // TODO: Find stuff...
//         this.client.iHaveResponse(this.config.device_id, { type: 1, instance: 1 }, 'test');
//     }
// };
// let onTimeSync = (data) => {
//     // TODO: Implement
//     console.log('timesync called *');
// };
// let onTimeSyncUTC = (data) => {
//     // TODO: Implement
//     console.log('timeSyncUTC called *');
// };
// let onReadPropertyMultiple = (data) => {
//     console.log('*onReadPropertyMultiple * ', data);
//     console.log(data.request.properties);
//     const responseList = [];
//     const properties = data.request.properties;
//     properties.forEach((property) => {
//         if (property.objectId.type === bacnet.enum.ObjectTypes.OBJECT_DEVICE && property.objectId.instance === 4194303) {
//             property.objectId.instance = this.config.device_id;
//         }
//         const object = this.dataStore[property.objectId.type + ':' + property.objectId.instance];
//         if (!object)
//             return; // TODO: Add error
//         const propList = [];
//         property.properties.forEach((item) => {
//             if (item.id === bacnet.enum.PropertyIds.PROP_ALL) {
//                 for (let key in object) {
//                     propList.push({ property: { id: key, index: 0xFFFFFFFF }, value: object[key] });
//                 }
//                 return;
//             }
//             const prop = object[item.id];
//             let content;
//             if (!prop)
//                 return; // TODO: Add error
//             if (item.index === 0xFFFFFFFF) {
//                 content = prop;
//             }
//             else {
//                 const slot = prop[item.index];
//                 if (!prop)
//                     return; // TODO: Add error
//                 content = [slot];
//             }
//             propList.push({ property: { id: item.id, index: item.index }, value: content });
//         });
//         responseList.push({ objectId: { type: property.objectId.type, instance: property.objectId.instance }, values: propList });
//     });
//     // FIXME: hardcoded ip, need to take ip from data param
//     this.client.readPropertyMultipleResponse('192.168.178.255', data.invokeId, responseList);
// };
// let onWritePropertyMultiple = (data) => {
//     // TODO: Implement
//     // TODO: valuesRefs
//     //if () client.simpleAckResponse(data.address, data.service, data.invokeId);
//     //else client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
// };
// let onAtomicWriteFile = (data) => {
// };
// let onAtomicReadFile = (data) => {
// };
// let onSubscribeCOV = (data) => {
//     console.log('subscribe CoV called', data);
// };
// let onSubscribeProperty = (data) => {
// };
// let onDeviceCommunicationControl = (data) => {
// };
// let onReinitializeDevice = (data) => {
// };
// let onReadRange = (data) => {
// };
// let onCreateObject = (data) => {
// };
// let onDeleteObject = (data) => {
// };
// connect();
