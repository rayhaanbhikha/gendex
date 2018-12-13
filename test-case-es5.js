// const Datastore = require('@google-cloud/datastore')
// const datastore = Datastore();
// const { namespace } = require("../../../config");

// const updateApplicationStatus = async (newApplicationStatus) => {

//     if(newApplicationStatus !== 'active' && newApplicationStatus !== 'inactive') throw new Error("New application status requested, is incorrect.");

//     let query = datastore.createQuery(namespace, 'Application')
//         .filter('type', 'status')
//         .limit(1);

//     let queryResponse = await query.run();

//     // if no current application status is datastore.
//     if (queryResponse[0].length === 0) {
//         return await datastore.save({
//             key: datastore.key({
//                 namespace,
//                 path: ['Application', 1]
//             }),
//             data: {
//                 id: 1,
//                 type: 'status',
//                 value: newApplicationStatus
//             }
//         })
//     }


//     // The query will only return one entity, so extract configurations.
//     let applicationStatusConfig = queryResponse[0];
//     applicationStatusConfig = applicationStatusConfig[0];

//     // if configurations are not the same.
//     if (applicationStatusConfig.value !== newApplicationStatus) {
//         applicationStatusConfig.value = newApplicationStatus;
//         return await datastore.update(applicationStatusConfig);
//     }

// }

// let a = {
//     one: 2
// }

// let b = {
//     two: 3
// }
// 3 + a
// exports.a = {
//     one: 2
// };
// exports.b = class A {

// };
// module.exports = a
// module.exports = class A {

// }
// module.exports = 1
// module.exports = 2
// module.exports = {
//     cd: 1,
//     d: 2
// }



// var x

// console.log(a);
// module.exports = 3
// module.exports = 2
// exports.b = () => {
//     console.log("hello");
// }
// exports.c = class App{

// }

// module.exports = updateApplicationStatus