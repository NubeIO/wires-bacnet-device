const bacnet = require('@biancoroyal/bacstack');
const debug = require('debug')('bacstack-device');


const settings = {
  deviceId: 123,
  vendorId: 7

};

const client = new bacnet(

);   //192.168.10.112
// const client = new bacnet({interface: '10.0.75.1', deviceId: '47111880'});
const dataStore = {
  '1:0': {
    75: [{ value: { type: 1, instance: 0 }, type: 12 }], // PROP_OBJECT_IDENTIFIER  Type is 12 for a OBJECTIDENTIFIER: 12, // ASHRE 135-2016 - 20.2.1.4 Application Tags - Enumerators
    77: [{ value: 'Analog Output 1', type: 7 }],          // PROP_OBJECT_NAME
    79: [{ value: 1, type: 9 }],                          // PROP_OBJECT_TYPE
    85: [{ value: 5, type: 4 }], // PROP_PRESENT_VALUE Type 4 is  REAL: 4,
    87: [{
      1: [{ value: null, type: 4 }],
      2: [{ value: null, type: 4 }],
      3: [{ value: null, type: 4 }],
      4: [{ value: null, type: 4 }],
      5: [{ value: null, type: 4 }],
      6: [{ value: null, type: 4 }],
      7: [{ value: null, type: 4 }],
      8: [{ value: null, type: 4 }],
      9: [{ value: null, type: 4 }],
      10: [{ value: null, type: 4 }],
      11: [{ value: null, type: 4 }],
      12: [{ value: null, type: 4 }],
      13: [{ value: null, type: 4 }],
      14: [{ value: null, type: 4 }],
      15: [{ value: null, type: 4 }],
      16: [{ value: null, type: 4 }],
    }],
    104: [{ value: 17, type: 4 }], // RELINQUISH_DEFAULT  Should be 0 i think! NULL: 0,
  },
  '8:443': {
    75: [{ value: { type: 8, instance: 443 }, type: 12 }],  // PROP_OBJECT_IDENTIFIER
    76: [
      { value: { type: 8, instance: 443 }, type: 12 },
      { value: { type: 1, instance: 0 }, type: 12 }
    ],                                                  // PROP_OBJECT_IDENTIFIER
    77: [{ value: 'my-device-443', type: 7 }],            // PROP_OBJECT_NAME
    79: [{ value: 8, type: 9 }],                          // PROP_OBJECT_TYPE
    28: [{ value: 'Test Device #443', type: 7 }]          // PROP_DESCRIPTION
  }
};



client.on('whoIs', (data) => {
  debug(data);
  console.log("whoIs");
  if (data.lowLimit && data.lowLimit > settings.deviceId) return;
  if (data.highLimit && data.highLimit < settings.deviceId) return;
  client.iAmResponse(data.header.sender, settings.deviceId, bacnet.enum.Segmentation.SEGMENTED_BOTH, settings.vendorId);
});

client.on('readProperty', (data) => {
  console.log("readProperty");
  const object = dataStore[data.payload.objectId.type + ':' + data.payload.objectId.instance];
  debug('object', object);
  if (!object) return client.errorResponse(data.header.sender, bacnet.enum.ConfirmedServiceChoice.READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClass.OBJECT, bacnet.enum.ErrorCode.UNKNOWN_OBJECT);
  const property = object[data.payload.property.id];
  debug('object', property);
  if (!property) return client.errorResponse(data.header.sender, bacnet.enum.ConfirmedServiceChoice.READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClass.PROPERTY, bacnet.enum.ErrorCode.UNKNOWN_PROPERTY);
  if (data.payload.property.index === 0xFFFFFFFF) {
    client.readPropertyResponse(data.header.sender, data.invokeId, data.payload.objectId, data.payload.property, property);
  } else {
    const slot = property[data.payload.property.index];
    if (!slot) return client.errorResponse(data.header.sender, bacnet.enum.ConfirmedServiceChoice.READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClass.PROPERTY, bacnet.enum.ErrorCode.INVALID_ARRAY_INDEX);
    client.readPropertyResponse(data.header.sender, data.invokeId, data.payload.objectId, data.payload.property, [slot]);
  }
});

client.on('writeProperty', (data) => {
  console.log(JSON.stringify(data))
  const object = dataStore[data.payload.objectId.type + ':' + data.payload.objectId.instance];
  if (!object) return client.errorResponse(data.header.sender, data.service, data.invokeId, bacnet.enum.ErrorClass.OBJECT, bacnet.enum.ErrorCode.UNKNOWN_OBJECT);
  let property = object[data.payload.value.property.id];
  if (!property) return client.errorResponse(data.header.sender, data.service, data.invokeId, bacnet.enum.ErrorClass.PROPERTY, bacnet.enum.ErrorCode.UNKNOWN_PROPERTY);
  if (data.payload.value.property.index === 0xFFFFFFFF) {
    property = data.payload.value.value;

 
    client.simpleAckResponse(data.header.sender, data.service, data.invokeId);
  } else {
    const slot = property[data.payload.property.index];
    if (!slot) return client.errorResponse(data.header.sender, data.service, data.invokeId, bacnet.enum.ErrorClass.PROPERTY, bacnet.enum.ErrorCode.INVALID_ARRAY_INDEX);
    slot = data.payload.value.value[0];
    client.simpleAckResponse(data.header.sender, data.service, data.invokeId);
  }
});


client.on('whoHas', (data) => {
  console.log("whoHas");
  debug(data);
  if (data.lowLimit && data.lowLimit > settings.deviceId) return;
  if (data.highLimit && data.highLimit < settings.deviceId) return;
  if (data.objId) {
    var object = dataStore[data.objId.type + ':' + data.objId.instance];
    if (!object) return;
    client.iHaveResponse(data.header.sender, settings.deviceId, { type: data.objId.type, instance: data.objId.instance }, object[77][0].value);
  }
  if (data.objName) {
    // TODO: Find stuff...
    client.iHaveResponse(data.header.sender, settings.deviceId, { type: 1, instance: 1 }, 'test');
  }
});

client.on('timeSync', (data) => {
  // TODO: Implement
});

client.on('timeSyncUTC', (data) => {
  // TODO: Implement
});

client.on('readPropertyMultiple', (data) => {
  console.log("readPropertyMultiple");
  debug(data.payload.properties);
  const responseList = [];
  const properties = data.payload.properties;

  properties.forEach((property) => {
    console.log(`${property.objectId.type} + ${bacnet.enum.ObjectTypesSupported.DEVICE} + ${property.objectId.instance}`)
    if (property.objectId.type === bacnet.enum.ObjectTypesSupported.DEVICE && property.objectId.instance === 4194303) {
      property.objectId.instance = settings.deviceId;
    }
    const object = dataStore[property.objectId.type + ':' + property.objectId.instance];
    if (!object) return; // TODO: Add error
    const propList = [];
    property.properties.forEach((item) => {
      if (item.id === bacnet.enum.PropertyIdentifier.ALL) {
        for (let key in object) {
          propList.push({ property: { id: key, index: 0xFFFFFFFF }, value: object[key] });
        }
        return;
      }
      const prop = object[item.id];
      let content;
      if (!prop) return; // TODO: Add error
      if (item.index === 0xFFFFFFFF) {
        content = prop;
      } else {
        const slot = prop[item.index];
        if (!prop) return; // TODO: Add error
        content = [slot];
      }
      propList.push({ property: { id: item.id, index: item.index }, value: content });
    });
    responseList.push({ objectId: { type: property.objectId.type, instance: property.objectId.instance }, values: propList });
  });
  client.readPropertyMultipleResponse(data.header.sender, data.invokeId, responseList);
});

client.on('writePropertyMultiple', (data) => {
  // TODO: Implement
  // TODO: valuesRefs
  //if () client.simpleAckResponse(data.header.sender, data.service, data.invokeId);
  //else client.errorResponse(data.header.sender, data.service, data.invokeId, bacnet.enum.ErrorClass.OBJECT, bacnet.enum.ErrorCode.UNKNOWN_OBJECT);
});

client.on('atomicWriteFile', (data) => {
});

client.on('atomicReadFile', (data) => {
});

client.on('subscribeCOV', (data) => {
});

client.on('subscribeProperty', (data) => {
});

client.on('deviceCommunicationControl', (data) => {
});

client.on('reinitializeDevice', (data) => {
});

client.on('readRange', (data) => {
  console.log("readRange")
});

client.on('createObject', (data) => {
});

client.on('deleteObject', (data) => {
});

console.log('Node BACstack Device started at ' + client._settings.interface);