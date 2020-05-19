const PropertyId = {
    objectList: 76,
    objectName: 77
  };
  
  const idToObjectType = {
    0: "AnalogInput",
    1: "AnalogOutput",
    2: "AnalogValue",
    3: "BinaryInput",
    4: "BinaryOutput",
    5: "BinaryValue",
    8: "Device",
    9: "EventEnrollment",
    10: "File",
    12: "Loop",
    15: "NotificationClass",
    16: "Program",
    19: "MultiStateValue",
    29: "StructuredView",
    40: "CharacterStringValue"
  };
  
  module.exports = {
    PropertyId,
    idToObjectType
  };