//
// BACnet device implementation.
// Objects attached to devices.
//

const assert = require('assert');
const bacnet = require('@biancoroyal/bacstack');
const debug = require('debug')
// debug.error = debug.extend('error*');

const BACnetObjectProperty = require('./bacnet-object-property');
const MandatoryProperties = require('./mandatory-properties');
const Util = require('./util');

class BACnetObject
{
	constructor(dev, instance, typeId, name) {
		this.dev = dev;
		this.instance = instance;
		this.objects = {};
		this.properties = {};
		this.subscriptions = [];

		// This is a list of dynamic properties provided by getProperty().  It is
		// an instance variable so that subclasses can append to it if they override
		// getProperty().
		this.dynamicProperties = [
			bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER,
			bacnet.enum.PropertyIdentifier.PROPERTY_LIST,
			bacnet.enum.PropertyIdentifier.OBJECT_LIST,
			bacnet.enum.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED,
		];

		// Set some defaults to ensure we comply with BACnet standards
		this.addProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value = typeId;
		this.addProperty(bacnet.enum.PropertyIdentifier.OBJECT_NAME).value = name;
		// We don't set PRESENT_VALUE in case the user wants to, and wants to set
		// it to a different type to the one we might use (e.g. analogue values
		// are REAL while digital values are BOOLEAN.)
		this.addProperty(bacnet.enum.PropertyIdentifier.STATUS_FLAGS).value = [];
		this.addProperty(bacnet.enum.PropertyIdentifier.EVENT_STATE).value = bacnet.enum.EventState.NORMAL;
		this.addProperty(bacnet.enum.PropertyIdentifier.OUT_OF_SERVICE).value = false;
		this.addProperty(bacnet.enum.PropertyIdentifier.UNITS).value = bacnet.enum.EngineeringUnits.NO_UNITS;
	}

	/**
	 * Add a new property if it doesn't already exist, and return it either way.
	 */
	addProperty(propertyId, typeId = undefined) {
		propertyId = parseInt(propertyId);
		if (this.dynamicProperties.includes(propertyId)) {
			const propertyName = Util.getPropName(propertyId);
			throw new Error(`Property ${propertyName} is generated on-the-fly and `
				+ `cannot be set.`);
		}
		return (
			this.properties[propertyId]
			|| (
				this.properties[propertyId] = new BACnetObjectProperty(this, propertyId, typeId)
			)
		);
	}

	/**
	 * Add multiple properties and set their values at the same time.
	 *
	 * This is typically used to set static values like names and descriptions.
	 *
	 * @param object propList
	 *   Associative array.  Array key is PropertyIdentifier enum, and the array
	 *   value is used as the property value.
	 */
	addPropertyBulk(propList) {
		Object.keys(propList).forEach(p => {
			this.addProperty(p).value = propList[p];
		});
	}

	/**
	 * Remove a property, since properties can't have 'undefined' as a value.
	 */
	delProperty(propertyId, index = undefined) {
		if (index !== undefined) delete this.properties[propertyId][index];
		else delete this.properties[propertyId];
	}

	getProperty(propertyId) {
		propertyId = parseInt(propertyId);
		// Some properties are generated dynamically
		switch (propertyId) {
			case bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER: {
				// Construct this one from the other properties.
				const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
				prop._value = {
					// Object type, e.g. BE.ObjectTypesSupported.DEVICE
					typeId: this.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value,
					// Instance number.
					instance: this.instance,
				};
				return prop;
			}

			case bacnet.enum.PropertyIdentifier.PROPERTY_LIST: {
				// Return a list of all properties.

				// These properties are not included per the BACnet standard.
				const ignoreProps = [
					bacnet.enum.PropertyIdentifier.OBJECT_NAME,
					bacnet.enum.PropertyIdentifier.OBJECT_TYPE,
					bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER,
					bacnet.enum.PropertyIdentifier.PROPERTY_LIST,
				];
				const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
				const propertyList = this.getAllPropertyIds();
				prop._value = propertyList
					.filter(p => !ignoreProps.includes(p))
				;

				// Check to ensure all the mandatory properties are included, and warn
				// the user if not.  This is not required but will help users of this
				// library create confirmant BACnet devices.
				const selfTypeId = this.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value;
				if (MandatoryProperties[selfTypeId]) {
					const missingProperties = MandatoryProperties[selfTypeId].filter(p => !prop._value.includes(p));
					if (missingProperties.length > 0) {
						const selfName = this.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_NAME).value;
						const missingPropertyNames = missingProperties.map(p => Util.getPropName(p));
						debug.error(`Object #${this.instance}("${selfName}") is missing these mandatory properties: %o`, missingPropertyNames);
					}
				} else {
					const typeName = Util.getEnumName(bacnet.enum.ObjectType, selfTypeId);
					debug.error(`TODO: No mandatory properties have been defined for the object type ${typeName}`);
				}
				return prop;
			}

			case bacnet.enum.PropertyIdentifier.OBJECT_LIST: {
				let objectList = [];
				Object.keys(this.objects).forEach(objType => {
					const objectsOfType = this.objects[objType];
					Object.keys(objectsOfType).forEach(objectInstance => {
						const obj = objectsOfType[objectInstance];
						objectList.push({
							typeId: obj.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value,
							instance: obj.instance,
						});
					});
				});
				const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
				prop._value = objectList;
				return prop;
			}

			case bacnet.enum.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED: {
				// Run through all our objects and return just the types in use.
				let typeList = {};
				Object.keys(this.objects).forEach(objType => {
					const objectsOfType = this.objects[objType];
					Object.keys(objectsOfType).forEach(objectInstance => {
						const obj = objectsOfType[objectInstance];
						const type = obj.getProperty(bacnet.enum.PropertyIdentifier.OBJECT_TYPE).value;
						typeList[type] = true;
					});
				});
				const prop = new BACnetObjectProperty(this, propertyId, undefined, true);
				prop._value = Object.keys(typeList).map(t => parseInt(t));
				return prop;
			}

			default:
				break;
		}
		return this.properties[propertyId];
	}

	getAllPropertyIds() {
		const propertyList = [
			...Object.keys(this.properties),
			// Also add the dynamic properties generated by this function, since
			// they won't be in this.properties.
			...this.dynamicProperties,
		];
		// Convert the string keys back into integer values that will match enums.
		return propertyList
			.map(p => parseInt(p))
		;
	}

	/**
	 * Called when a child property's value has changed, so that we can notify
	 * any object-level subscribers.
	 */
	onPropertyChanged(property) {
		if (!this.dev) return; // happens during init on Device object
		this.dev.onObjectPropertyChanged(this, property);
	}


	/**
	 * Return an object with the properties as string keys, suitable for passing
	 * to console.log() to check the current state of the object.
	 *
	 * This is more useful than dumping `this.properties`, as this function will
	 * convert the enums from integers into strings.
	 */
	dumpProperties() {
		let fullPropList = Object.keys(this.properties).map(p => parseInt(p));

		// Include dynamic props in the dump
		fullPropList.push(bacnet.enum.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED);
		fullPropList.push(bacnet.enum.PropertyIdentifier.OBJECT_IDENTIFIER);
		fullPropList.push(bacnet.enum.PropertyIdentifier.PROPERTY_LIST);
		fullPropList.push(bacnet.enum.PropertyIdentifier.OBJECT_LIST);

		let props = {};
		fullPropList.forEach(key => {
			const property = this.getProperty(key);
			const keyName = Util.getPropName(key);
			props[keyName] = property.valueAsString();
		});
		return props;
	}


	/**
	 * Add a new object to the device, such as a sensor reading.
	 *
	 * @param Number instance
	 *   ID number for the item.  Typically these start at 1.
	 *
	 * @param bacnet.enum.ObjectType objectTypeId
	 *   Object type, such as an analogue input or digital output.
	 *
	 * @param string name
	 *   User-friendly name for the object, such as "Room temperature".
	 */
	addObject(instance, objectTypeId, name) {
		assert(Number.isInteger(instance), 'Instance ID must be an integer.');
		assert(Number.isInteger(objectTypeId), 'Object type must be a bacnet.enum.ObjectType value.');

		if (!this.objects[objectTypeId]) this.objects[objectTypeId] = {};
		return this.objects[objectTypeId][instance] = new BACnetObject(this, instance, objectTypeId, name);
	}

	/**
	 * Get the sub-object identified by the given instance ID, optionally matching
	 * the given type as well.
	 *
	 * @param Number instance
	 *   ID number for the object.
	 *
	 * @param bacnet.enum.ObjectType objectTypeId
	 *   Object type, such as an analogue input or digital output.  This must be
	 *   specified because it is possible to have multiple objects with the same
	 *   instance ID, differing only by type (such as Analogue Input #1 and
	 *   Digital Output #1).
	 *
	 * @return If `instance` and `objectTypeId` are valid, the `BACnetObject` is
	 *   returned.  If `instance` or `objectTypeId` are invalid, `undefined` is
	 *   returned.
	 */
	getObject(instance, objectTypeId) {
		const typeGroup = this.objects[objectTypeId];
		if (!typeGroup) return undefined;

		return typeGroup[instance];
	}
};

module.exports = BACnetObject;
