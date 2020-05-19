//
// BACnet device implementation.
// Example for using this module.
//




const BACnetDevice = require('./index.js');
const BE = require('@biancoroyal/bacstack').enum;
const debug = require('debug')

const dev = new BACnetDevice({
	// These parameters are all mandatory by the BACnet spec.
	deviceId: 123,
	name: 'Example device',
	databaseRevision: 1,
	// interface: '192.168.10.112',
});

// Set some properties on the device itself.  The BACnet standard mandates the
// presence of some properties, so these are all set to default values but they
// can be changed as shown here.
dev.addProperty(BE.PropertyIdentifier.MODEL_NAME).value = 'EXAMPLE123';
dev.addProperty(BE.PropertyIdentifier.APPLICATION_SOFTWARE_VERSION).value = 'v0.1';

// Add a new data point to our device.
// const exampleInput = dev.addObject(1, BE.ObjectType.ANALOG_INPUT, 'Example value');
// const exampleInput2 = dev.addObject(2, BE.ObjectType.ANALOG_INPUT, 'Example value 2');
const exampleOut = dev.addObject(1, BE.ObjectType.ANALOG_OUTPUT, 'Example value AO');

// Add some static properties
// exampleInput.addProperty(BE.PropertyIdentifier.DESCRIPTION).value = 'This is an example property';
// exampleInput2.addProperty(BE.PropertyIdentifier.DESCRIPTION).value = 'This is an example property 2';
exampleOut.addProperty(BE.PropertyIdentifier.DESCRIPTION).value = 'This is an example AO';

exampleOut.addProperty(BE.PropertyIdentifier.STATUS_FLAGS).value = 4; // this is a bit string
exampleOut.addProperty(BE.PropertyIdentifier.EVENT_STATE).value = 0; // this is a bit string
exampleOut.addProperty(BE.PropertyIdentifier.UNITS).value = BE.EngineeringUnits.AMPERES;


// pi.EVENT_STATE,
// pi.OUT_OF_SERVICE,
// pi.UNITS,   // PAGE 156 of spec Example milliamperes (2),  
// pi.PRIORITY_ARRAY,   //Type BACnetPriorityArray // PAGE 831 of spec
// pi.RELINQUISH_DEFAULT


// Add a property to the new data point.  Here we are manually specifying the
// data type (REAL) rather than going with the default type.  Not all properties
// have default types specified (yet), so if you use one of these properties you
// will either have to manually specify the type as we do here, or preferably
// add it to mandatory-properties.js and submit a patch.


const inpPresentValue2 = exampleOut.addProperty(
	BE.PropertyIdentifier.PRESENT_VALUE,
	BE.ApplicationTags.REAL,
);
inpPresentValue2.value = 33;

const inpPresentValue3 = exampleOut.addProperty(
	BE.PropertyIdentifier.PRIORITY_ARRAY,
	BE.ApplicationTags.REAL,
);

inpPresentValue3.value = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];

const inpPresentValue4 = exampleOut.addProperty(
	BE.PropertyIdentifier.RELINQUISH_DEFAULT,
	BE.ApplicationTags.REAL,
);
inpPresentValue4.value = 10;// Set an initial value for the data point's "present value" property.
// inpPresentValue.value = 1;
// in2pPresentValue.value = 1;





console.log("connected to broker")

console.log('Dumping objects contained within this device:');
// debug('booting %o');
Object.keys(dev.objects).forEach(objType => {
	const objectsOfType = dev.objects[objType];
	Object.keys(objectsOfType).forEach(objInstance => {
		const o = objectsOfType[objInstance];
		// console.log(`\nObject ${objType}#${o.instance}:`, o.dumpProperties());
	});
});


