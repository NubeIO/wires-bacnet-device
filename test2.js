const bacnet = require('@biancoroyal/bacstack');
const debug = require('debug')


const settings = {
  deviceId: 123,
  vendorId: 7
};

const client = new bacnet();

const dataStore = {
  '1:0': {
    75: [{ value: { type: 1, instance: 0 }, type: 12 }],    // PROP_OBJECT_IDENTIFIER  Type is 12 for a // ASHRE 135-2016 - 20.2.1.4 Application Tags - Enumerators
    77: [{ value: 'Analog Output 1', type: 7 }],          // PROP_OBJECT_NAME
    79: [{ value: 1, type: 9 }],                          // PROP_OBJECT_TYPE
    85: [{ value: 55, type: 4 }],                           // PROP_PRESENT_VALUE
    87: [{ type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null },
    { type: 4, value: null }]
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
  console.log("whoIs");
  //   console.log(data);
  //   if (data.lowLimit && data.lowLimit > settings.deviceId) return;
  //   if (data.highLimit && data.highLimit < settings.deviceId) return;
  client.iAmResponse(data.header.sender, 123, 0, 0); //SEGMENTATION_BOTH
});

client.on('readProperty', (data) => {
  console.log("readProperty");
  JSON.stringify(data)
  const object = dataStore[data.payload.objectId.type + ':' + data.payload.objectId.instance];
  debug('object', object);
  if (!object) return client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
  const property = object[data.payload.property.id];
  debug('object', property);
  if (!property) return client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_PROPERTY);
  if (data.payload.property.index === 0xFFFFFFFF) {
    client.readPropertyResponse(data.address, data.invokeId, data.payload.objectId, data.payload.property, property);
  } else {
    const slot = property[data.payload.property.index];
    if (!slot) return client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_INVALID_ARRAY_INDEX);
    client.readPropertyResponse(data.address, data.invokeId, data.payload.objectId, data.payload.property, [slot]);
  }
});

client.on('writeProperty', (data) => {

  console.log("writeProperty")
  const object = dataStore[data.payload.objectId.type + ':' + data.payload.objectId.instance];
  if (!object) return client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
  let property = object[data.payload.value.property.id];
  if (!property) return client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_PROPERTY);
  if (data.payload.value.property.index === 0xFFFFFFFF) {


    let pri = data.payload.value.priority;
    let val = data.payload.value.value[0].value;
    console.log(JSON.stringify(dataStore))
    function arrType(arr, pri, value) {
      let a = arr["1:0"][87]
      console.log(11111)
      // console.log(store[p].type)
      for (p in a) {
        let arrNum = parseInt(p) + 1
        // console.log(a[p])
        if (arrNum === pri) {
          a[p].value = value
          break;
        };
      };


    };
    arrType(dataStore, pri, val)
    console.log(JSON.stringify(dataStore))


    let priorityArray = dataStore["1:0"][87]

    let priorityValue;
    let priorityNum;
    let priorityArr;

    for (p in priorityArray) {
      priorityValue = priorityArray[p].value
      priorityHighest = parseInt(p) + 1
      priorityArr = { priorityNum: parseInt(p) + 1, arr: priorityArray[p] }

      if (priorityArray[p].value != null) {
        break;
      }

    }
    dataStore["1:0"][87] = priorityArray
    dataStore["1:0"][85][0].value = priorityValue
    

    console.log({priorityValue: priorityValue, priorityHighest:priorityHighest, priorityArr: priorityArr})
    console.log(priorityHighest)
    console.log(priorityArr)
    // console.log(JSON.stringify(dataStore))




    // property = data.payload.value.value[0].value;
    // let res = dataStore["1:0"][85][0].value =property
    // // console.log() 
    // console.log({data: data.payload.value.value[0].value,  priority: data.payload.value.priority}) 
    client.simpleAckResponse(data.address, data.service, data.invokeId);
    // console.log(JSON.stringify(dataStore))

  } else {
    const slot = property[data.payload.property.index];
    if (!slot) return client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_INVALID_ARRAY_INDEX);
    slot = data.payload.value.value[0];
    client.simpleAckResponse(data.address, data.service, data.invokeId);


  }
});


client.on('whoHas', (data) => {
  //   debug(data);
  console.log("whoHas");
  if (data.lowLimit && data.lowLimit > settings.deviceId) return;
  if (data.highLimit && data.highLimit < settings.deviceId) return;
  if (data.objId) {
    var object = dataStore[data.objId.type + ':' + data.objId.instance];
    if (!object) return;
    client.iHaveResponse(settings.deviceId, { type: data.objId.type, instance: data.objId.instance }, object[77][0].value);
  }
  if (data.objName) {
    // TODO: Find stuff...
    client.iHaveResponse(settings.deviceId, { type: 1, instance: 1 }, 'test');
  }
});

client.on('timeSync', (data) => {
  // TODO: Implement
});

client.on('timeSyncUTC', (data) => {
  // TODO: Implement
});

client.on('readPropertyMultiple', (data) => {
  //   debug(data.payload.properties);
  console.log("readPropertyMultiple")
  const responseList = [];
  const properties = data.payload.properties;
  //   bacnet.enum.ObjectTypes.OBJECT_DEVICE 
  properties.forEach((property) => {
    if (property.objectId.type === bacnet.enum.ObjectType.DEVICE && property.objectId.instance === 4194303) {
      property.objectId.instance = settings.deviceId;
    }
    const object = dataStore[property.objectId.type + ':' + property.objectId.instance];
    if (!object) return; // TODO: Add error
    const propList = [];
    property.properties.forEach((item) => {
      if (item.id === bacnet.enum.PropertyIds.PROP_ALL) {
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
    // console.log(JSON.stringify(responseList))
  });
  client.readPropertyMultipleResponse('192.168.0.235', data.invokeId, responseList);
});

client.on('writePropertyMultiple', (data) => {
  // TODO: Implement
  // TODO: valuesRefs
  //if () client.simpleAckResponse(data.address, data.service, data.invokeId);
  //else client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
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
});

client.on('createObject', (data) => {
});

client.on('deleteObject', (data) => {
});

console.log('Node BACstack Device startedaaa');