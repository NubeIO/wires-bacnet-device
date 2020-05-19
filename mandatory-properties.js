const BE = require('@biancoroyal/bacstack').enum;
const pi = BE.PropertyIdentifier;

// Note that OBJECT_IDENTIFIER, OBJECT_NAME, OBJECT_TYPE and PROPERTY_LIST are
// not included in the lists below, as they are not returned by the
// PROPERTY_LIST request.  They are also handled internally so should never be
// omitted by accident.
module.exports = {
	[BE.ObjectType.ANALOG_OUTPUT]: [ // PAGE 161 of spec
		// Object_Identifier  PROP_OBJECT_IDENTIFIER  Type is 12 for a // ASHRE 135-2016 - 20.2.1.4 Application Tags - Enumerators
		// Object_Name  // CharacterString // type.CHARACTER_STRING,
		// Object_Type  // BACnetObjectType // type.ENUMERATED,
		pi.PRESENT_VALUE,   // PROP_PRESENT_VALUE Type 4 is  REAL: 4,
		pi.STATUS_FLAGS,  // BACnetStatusFlags  // type.BIT_STRING
		pi.EVENT_STATE,   // BACnetEventState  //  type.ENUMERATED,
		pi.OUT_OF_SERVICE,  //BOOLEAN  
		pi.UNITS,   // PAGE 156 of spec Example milliamperes (2),   // type.ENUMERATED
		pi.PRIORITY_ARRAY,   //Type BACnetPriorityArray // PAGE 831 of spec. // depands on the data type. So for an AO its type: 4 and the value is real
		pi.RELINQUISH_DEFAULT //REAL
	],
	[BE.ObjectType.ANALOG_INPUT]: [ // PAGE 156 of spec
		// Object_Identifier 
		// Object_Name
		// Object_Type
		pi.PRESENT_VALUE,
		pi.STATUS_FLAGS,
		pi.EVENT_STATE,
		pi.OUT_OF_SERVICE,
		pi.UNITS,
	],
	[BE.ObjectType.DEVICE]: [
		pi.SYSTEM_STATUS,
		pi.VENDOR_NAME,
		pi.VENDOR_IDENTIFIER,
		pi.MODEL_NAME,
		pi.FIRMWARE_REVISION,
		pi.APPLICATION_SOFTWARE_VERSION,
		pi.PROTOCOL_VERSION,
		pi.PROTOCOL_REVISION,
		pi.PROTOCOL_SERVICES_SUPPORTED,
		pi.PROTOCOL_OBJECT_TYPES_SUPPORTED,
		pi.OBJECT_LIST,
		pi.MAX_APDU_LENGTH_ACCEPTED,
		pi.SEGMENTATION_SUPPORTED,
		pi.APDU_TIMEOUT,
		pi.NUMBER_OF_APDU_RETRIES,
		pi.DEVICE_ADDRESS_BINDING,
		pi.DATABASE_REVISION,
	],
};
