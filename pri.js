
let payload = {
    "len": 4,
    "type": 0,
    "service": 15,
    "maxSegments": 0,
    "maxApdu": 5,
    "invokeId": 1,
    "sequencenumber": 0,
    "proposedWindowNumber": 0,
    "header": {
        "func": 10,
        "sender": {
            "address": "192.168.10.105",
            "forwardedFrom": null
        },
        "apduType": 0,
        "expectingReply": true,
        "confirmedService": true
    },
    "payload": {
        "len": "15[object Object]",
        "objectId": {
            "type": 1,
            "instance": 1
        },
        "value": {
            "property": {
                "id": 85,
                "index": 4294967295
            },
            "value": [
                {
                    "type": 4,
                    "value": 19
                }
            ],
            "priority": 1
        }
    }
}

let pri = payload.payload.value.priority;
let aa = [{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: 22, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 },
{ value: null, type: 4 }]


console.log(aa)


// const objIndex = aa.forEach(a => a.type);
let Arr = [];
for (p in aa) {
  
    Arr.push(aa[p].value)
    // if (parseInt(p) === pri) {
    //     a[0][p][0].value = value
    //     break;
    // };
};

// console.log(Arr)


let priorityValue;
let priorityNum;
let priorityArr;

for (p in Arr){
    priorityValue = Arr[p]
    priorityHighest = parseInt(p) + 1
    priorityArr = {priorityNum: parseInt(p) + 1, val: Arr[p]}
 

    if(Arr[p] != null){
        break;
      };

};
console.log(priorityValue)
console.log(priorityArr)
console.log(priorityHighest)


    //   const highestPriority = this.priorityArray.findIndex(
    //     element => Object.entries(element).length > 0,
    //   );
// var projects = [
//     {
//         value: "jquery",
//         label: "jQuery",
//         desc: "the write less, do more, JavaScript library",
//         icon: "jquery_32x32.png"
//     },
//     {
//         value: "jquery-ui",
//         label: "jQuery UI",
//         desc: "the official user interface library for jQuery",
//         icon: "jqueryui_32x32.png"
//     }];

    //find the index of object from array that you want to update
    // const objIndex = projects.findIndex(obj => obj.value === 'jquery-ui');

    // make new object of updated object.   
    // const updatedObj = { ...projects[objIndex], desc: 'updated desc value'};

    // // make final new array of objects by combining updated object.
    // const updatedProjects = [
    //   ...projects.slice(0, objIndex),
    //   updatedObj,
    //   ...projects.slice(objIndex + 1),
    // ];

    // console.log("original data=", projects);
    // console.log("updated data=", updatedProjects);




// // let priorityArray; //16 level priority array
// // let payload = { priority: 16, value: 22 }
// let payload = {
//     "len": 4,
//     "type": 0,
//     "service": 15,
//     "maxSegments": 0,
//     "maxApdu": 5,
//     "invokeId": 1,
//     "sequencenumber": 0,
//     "proposedWindowNumber": 0,
//     "header": {
//         "func": 10,
//         "sender": {
//             "address": "192.168.10.105",
//             "forwardedFrom": null
//         },
//         "apduType": 0,
//         "expectingReply": true,
//         "confirmedService": true
//     },
//     "payload": {
//         "len": "15[object Object]",
//         "objectId": {
//             "type": 1,
//             "instance": 1
//         },
//         "value": {
//             "property": {
//                 "id": 85,
//                 "index": 4294967295
//             },
//             "value": [
//                 {
//                     "type": 4,
//                     "value": 19
//                 }
//             ],
//             "priority": 1
//         }
//     }
// }



// /**
//  msg comes in with [{"value":[{"type":4,"value":19}],"priority":10}]
//  add the value and priority to the priority object
//  set the present value to the highest priority
//  with the highestPriority func

//  */





// const dataStore = {
//     '1:0': {
//         75: [{ value: { type: 1, instance: 0 }, type: 12 }], // PROP_OBJECT_IDENTIFIER  Type is 12 for a OBJECTIDENTIFIER: 12, // ASHRE 135-2016 - 20.2.1.4 Application Tags - Enumerators
//         77: [{ value: 'Analog Output 1', type: 7 }],          // PROP_OBJECT_NAME
//         79: [{ value: 1, type: 9 }],                          // PROP_OBJECT_TYPE
//         85: [{ value: 5, type: 4 }], // PROP_PRESENT_VALUE Type 4 is  REAL: 4,
//         87: [{ type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null },
//         { type: 4, value: null }],
//         104: [{ value: 17, type: 4 }], // RELINQUISH_DEFAULT  Should be 0 i think! NULL: 0,
//     },
//     '8:443': {
//         75: [{ value: { type: 8, instance: 443 }, type: 12 }],  // PROP_OBJECT_IDENTIFIER
//         76: [
//             { value: { type: 8, instance: 443 }, type: 12 },
//             { value: { type: 1, instance: 0 }, type: 12 }
//         ],                                                  // PROP_OBJECT_IDENTIFIER
//         77: [{ value: 'my-device-443', type: 7 }],            // PROP_OBJECT_NAME
//         79: [{ value: 8, type: 9 }],                          // PROP_OBJECT_TYPE
//         28: [{ value: 'Test Device #443', type: 7 }]          // PROP_DESCRIPTION
//     }
// };

// // dataStore["1:0"][87][0][2][0].type

// // console.log(dataStore["1:0"][87])



// let pri = payload.payload.value.priority;
// let val = payload.payload.value.value[0].value;



// function arrType(arr, pri, value) {
//     let a = arr["1:0"][87]

//     // console.log(store[p].type)
//     for (p in a) {
//         let arrNum = parseInt(p) +1
//         console.log(a[p])
//         if (arrNum === pri) {
//             a[p].value = value
//             break;
//         };
//     };


// };
// arrType(dataStore, pri, val)
// // console.log(JSON.stringify(dataStore))


// let  priorityArray = dataStore["1:0"][87]

// let priorityValue;
// let priorityNum;
// let priorityArr;

// for (p in priorityArray){
//     priorityValue = priorityArray[p].value
//     priorityHighest = parseInt(p) + 1
//     priorityArr = {priorityNum: parseInt(p) + 1, arr: priorityArray[p]}

//     if(priorityArray[p].value != null){
//         break;
//       }

// }
// console.log(priorityValue)
// console.log(priorityHighest)
// console.log(priorityArr)
// console.log(JSON.stringify(dataStore))



// // const dataStore = {
// //     '1:0': {
// //         75: [{ value: { type: 1, instance: 0 }, type: 12 }], // PROP_OBJECT_IDENTIFIER  Type is 12 for a OBJECTIDENTIFIER: 12, // ASHRE 135-2016 - 20.2.1.4 Application Tags - Enumerators
// //         77: [{ value: 'Analog Output 1', type: 7 }],          // PROP_OBJECT_NAME
// //         79: [{ value: 1, type: 9 }],                          // PROP_OBJECT_TYPE
// //         85: [{ value: 5, type: 4 }], // PROP_PRESENT_VALUE Type 4 is  REAL: 4,
// //         87: [{
// //             1: [{ value: null, type: 4 }],
// //             2: [{ value: null, type: 4 }],
// //             3: [{ value: null, type: 4 }],
// //         }],
// //         104: [{ value: 17, type: 4 }], // RELINQUISH_DEFAULT  Should be 0 i think! NULL: 0,
// //     },
// //     '8:443': {
// //         75: [{ value: { type: 8, instance: 443 }, type: 12 }],  // PROP_OBJECT_IDENTIFIER
// //         76: [
// //             { value: { type: 8, instance: 443 }, type: 12 },
// //             { value: { type: 1, instance: 0 }, type: 12 }
// //         ],                                                  // PROP_OBJECT_IDENTIFIER
// //         77: [{ value: 'my-device-443', type: 7 }],            // PROP_OBJECT_NAME
// //         79: [{ value: 8, type: 9 }],                          // PROP_OBJECT_TYPE
// //         28: [{ value: 'Test Device #443', type: 7 }]          // PROP_DESCRIPTION
// //     }
// // };

// // // dataStore["1:0"][87][0][2][0].type



// // function arrType(arr, pri, value) {
// //     let a = arr["1:0"][87]
// //     for (p in a[0]) {
// //         if (parseInt(p) === pri) {
// //             a[0][p][0].value = value
// //             break;
// //         };
// //     };

// // };


// // arrType(dataStore, 1, 222)
// // arrType(dataStore, 1, 23)

// // let  priorityArray = dataStore["1:0"][87][0]

// // let priorityValue;
// // let priorityNum;
// // let priorityArr;

// // for (p in priorityArray){


// //     priorityValue = priorityArray[p][0].value
// //     priorityHighest = p
// //     priorityArr = {priorityNum:p, arr: priorityArray[p][0]}

// //     if(priorityArray[p][0].value != null){
// //         break;
// //       }

// // }
// // // console.log(priorityValue)
// // // console.log(priorityHighest)
// // console.log(JSON.stringify(dataStore))


// // let priorityArray =
// // {
// //     1: [{ value: null, type: 4 }],
// //     2: [{ value: null, type: 4 }],
// //     3: [{ value: null, type: 4 }],
// //     4: [{ value: null, type: 4 }],
// //     5: [{ value: null, type: 4 }],
// // }



// // function arrType(arr, pri, value) {
// //     arr[pri][0].value = value
// //     return arr
// // }


// // arrType(priorityArray, 5, 22)

// // arrType(priorityArray, 4, 23)
// // arrType(priorityArray, 3, 99)
// // let priorityValue;
// // let priorityNum;
// // let priorityArr;

// // for (p in priorityArray){

// //     priorityValue = priorityArray[p][0].value
// //     priorityHighest = p
// //     priorityArr = {priorityNum:p, arr: priorityArray[p][0]}

// //     if(priorityArray[p][0].value != null){
// //         break;
// //       }

// // }
// // console.log(priorityValue)
// // console.log(priorityHighest)
// // console.log(priorityArr)