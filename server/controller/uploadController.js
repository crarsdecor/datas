
// import Contact from "../models/contactModel.js";
// import Manager from "../models/managerModel.js";
// import csv from 'csv-parser';
// import fs from 'fs';

// export const uploadContacts = (req, res) => {
//   const results = [];
//   let skippedEntriesCount = 0;
//   const skippedEntries = {};  // Dictionary to store skipped enrollment IDs with reasons

//   fs.createReadStream(req.file.path)
//     .pipe(csv())
//     .on('data', (data) => {
//       const formattedData = {
//         enrollmentId: data['Enrollment ID'],
//         date: data['Date'],
//         name: data['Name'],
//         email: data['Email'],
//         primaryContact: data['Primary Contact'],
//         secondaryContact: data['Secondary Contact'],
//         managerPosition: data['Manager Position'],
//         batch: data['Batch']
//       };

//       if (formattedData.date && formattedData.name && formattedData.email &&
//           formattedData.primaryContact && formattedData.managerPosition && formattedData.batch) {
//         results.push(formattedData);
//       } else {
//         skippedEntriesCount++;
//         skippedEntries[formattedData.enrollmentId] = "Missing required fields"; // Log reason for missing fields
//       }
//     })
//     .on('end', async () => {
//       try {
//         const uniqueResults = [];
//         const uids = new Map();

//         const primaryContacts = results.map(contact => contact.primaryContact);

//         const [existingContacts, managers] = await Promise.all([
//           Contact.find({ primaryContact: { $in: primaryContacts } }),
//           Manager.find({})
//         ]);

//         const contactMap = new Map(existingContacts.map(contact => [contact.primaryContact, contact]));
//         const managerMap = new Map(managers.map(manager => [manager.position, manager._id]));

//         // Get the latest UID and set the next UID number
//         const latestContact = await Contact.findOne({}).sort({ uid: -1 }) || { uid: 'UID0' };
//         let nextUidNumber = latestContact.uid ? parseInt(latestContact.uid.replace("UID", "")) + 1 : 1;

//         for (const contact of results) {
//           const existingContact = contactMap.get(contact.primaryContact);

//           const managerId = managerMap.get(contact.managerPosition);
//           if (!managerId) {
//             skippedEntriesCount++;
//             skippedEntries[contact.enrollmentId] = "Manager position not found"; // Log reason for missing manager
//             continue;
//           }

//           let uid;
//           if (uids.has(contact.primaryContact)) {
//             uid = uids.get(contact.primaryContact);
//           } else if (existingContact && existingContact.uid) {
//             uid = existingContact.uid;
//           } else {
//             uid = `UID${nextUidNumber++}`;
//             uids.set(contact.primaryContact, uid);
//           }

//           let updatedFields = {};
//           if (contact.enrollmentId.startsWith("AZ")) {
//             if (existingContact?.enrollmentIdAmazon === contact.enrollmentId &&
//                 existingContact?.batchAmazon === contact.batch &&
//                 existingContact?.dateAmazon?.toISOString().slice(0, 10) === contact.date) {
//               skippedEntriesCount++;
//               skippedEntries[contact.enrollmentId] = "Duplicate Amazon entry"; // Log reason for duplicate Amazon entry
//               continue;
//             }
//             updatedFields = {
//               enrollmentIdAmazon: contact.enrollmentId,
//               dateAmazon: new Date(contact.date),
//               batchAmazon: contact.batch,
//             };
//           } else if (contact.enrollmentId.startsWith("WB")) {
//             if (existingContact?.enrollmentIdWebsite === contact.enrollmentId &&
//                 existingContact?.batchWebsite === contact.batch &&
//                 existingContact?.dateWebsite?.toISOString().slice(0, 10) === contact.date) {
//               skippedEntriesCount++;
//               skippedEntries[contact.enrollmentId] = "Duplicate Website entry"; // Log reason for duplicate Website entry
//               continue;
//             }
//             updatedFields = {
//               enrollmentIdWebsite: contact.enrollmentId,
//               dateWebsite: new Date(contact.date),
//               batchWebsite: contact.batch,
//             };
//           } else {
//             skippedEntriesCount++;
//             skippedEntries[contact.enrollmentId] = "Unknown enrollment ID prefix"; // Log reason for unknown prefix
//             continue;
//           }

//           const contactData = {
//             ...contact,
//             uid,
//             managerIds: existingContact ? [...new Set([...existingContact.managerIds, managerId])] : [managerId],
//             ...updatedFields
//           };

//           if (existingContact) {
//             await Contact.updateOne(
//               { primaryContact: contact.primaryContact },
//               { $set: contactData }
//             );
//           } else {
//             uniqueResults.push(contactData);
//           }
//         }

//         if (uniqueResults.length > 0) {
//           const contacts = await Contact.insertMany(uniqueResults);
//           res.status(200).json({ contacts, skippedEntriesCount, skippedEntries });
//         } else {
//           res.status(200).json({ message: 'No new contacts added.', skippedEntriesCount, skippedEntries });
//         }
//       } catch (error) {
//         console.error('Error inserting contacts:', error);
//         res.status(500).json({ error: 'Error importing contacts' });
//       } finally {
//         fs.unlinkSync(req.file.path);
//       }
//     })
//     .on('error', (error) => {
//       console.error('Error reading CSV file:', error);
//       res.status(500).json({ error: 'Error reading CSV file' });
//       fs.unlinkSync(req.file.path);
//     });
// };

















// import { User, ROLES } from "../model/userModel.js";
// import csv from "csv-parser";
// import fs from "fs";

// export const uploadContacts = (req, res) => {
//   const results = [];
//   let skippedEntriesCount = 0;
//   const skippedEntries = {}; // Dictionary to log skipped enrollment IDs with reasons

//   fs.createReadStream(req.file.path)
//     .pipe(csv())
//     .on("data", (data) => {
//       const formattedData = {
//         enrollmentId: data["Enrollment ID"],
//         date: data["Date"],
//         name: data["Name"],
//         email: data["Email"],
//         primaryContact: data["Primary Contact"],
//         secondaryContact: data["Secondary Contact"],
//         managerUid: data["Manager Position"], // Renaming to match your schema
//         batch: data["Batch"],
//       };

//       if (
//         formattedData.date &&
//         formattedData.name &&
//         formattedData.email &&
//         formattedData.primaryContact &&
//         formattedData.managerUid &&
//         formattedData.batch
//       ) {
//         results.push(formattedData);
//       } else {
//         skippedEntriesCount++;
//         skippedEntries[formattedData.enrollmentId] = "Missing required fields";
//       }
//     })
//     .on("end", async () => {
//       try {
//         const uniqueResults = [];
//         const uids = new Map();

//         const primaryContacts = results.map((contact) => contact.primaryContact);

//         const [existingContacts, managers] = await Promise.all([
//           User.find({ primaryContact: { $in: primaryContacts } }), // Fetch existing contacts
//           User.find({ role: ROLES.MANAGER }), // Fetch all managers
//         ]);

//         const contactMap = new Map(
//           existingContacts.map((contact) => [contact.primaryContact, contact])
//         );
//         const managerMap = new Map(
//           managers.map((manager) => [manager.uid, manager._id]) // Use 'uid' for mapping managers
//         );

//         // Get the latest UID and set the next UID number
//         const latestContact = await User.findOne({}).sort({ uid: -1 }) || { uid: "UID0" };
//         let nextUidNumber = latestContact.uid
//           ? parseInt(latestContact.uid.replace("UID", "")) + 1
//           : 1;

//         for (const contact of results) {
//           const existingContact = contactMap.get(contact.primaryContact);

//           const managerId = managerMap.get(contact.managerUid); // Map using UID
//           if (!managerId) {
//             skippedEntriesCount++;
//             skippedEntries[contact.enrollmentId] = "Manager UID not found";
//             continue;
//           }

//           let uid;
//           if (uids.has(contact.primaryContact)) {
//             uid = uids.get(contact.primaryContact);
//           } else if (existingContact?.uid) {
//             uid = existingContact.uid;
//           } else {
//             uid = `UID${nextUidNumber++}`;
//             uids.set(contact.primaryContact, uid);
//           }

//           let updatedFields = {};
//           if (contact.enrollmentId.startsWith("AZ")) {
//             if (
//               existingContact?.enrollmentIdAmazon === contact.enrollmentId &&
//               existingContact?.batchAmazon === contact.batch &&
//               existingContact?.dateAmazon &&
//               new Date(existingContact.dateAmazon).toISOString().slice(0, 10) === contact.date
//             ) {
//               skippedEntriesCount++;
//               skippedEntries[contact.enrollmentId] = "Duplicate Amazon entry";
//               continue;
//             }
//             updatedFields = {
//               enrollmentIdAmazon: contact.enrollmentId,
//               dateAmazon: new Date(contact.date),
//               batchAmazon: contact.batch,
//             };
//           } else if (contact.enrollmentId.startsWith("WB")) {
//             if (
//               existingContact?.enrollmentIdWebsite === contact.enrollmentId &&
//               existingContact?.batchWebsite === contact.batch &&
//               existingContact?.dateWebsite &&
//               new Date(existingContact.dateWebsite).toISOString().slice(0, 10) === contact.date
//             ) {
//               skippedEntriesCount++;
//               skippedEntries[contact.enrollmentId] = "Duplicate Website entry";
//               continue;
//             }
//             updatedFields = {
//               enrollmentIdWebsite: contact.enrollmentId,
//               dateWebsite: new Date(contact.date),
//               batchWebsite: contact.batch,
//             };
          
//           } else {
//             skippedEntriesCount++;
//             skippedEntries[contact.enrollmentId] = "Unknown enrollment ID prefix";
//             continue;
//           }

//           const contactData = {
//             ...contact,
//             uid,
//             managerIds: existingContact
//               ? [...new Set([...existingContact.managerIds, managerId])]
//               : [managerId],
//             ...updatedFields,
//           };

//           if (existingContact) {
//             await User.updateOne(
//               { primaryContact: contact.primaryContact },
//               { $set: contactData }
//             );
//           } else {
//             uniqueResults.push(contactData);
//           }
//         }

//         if (uniqueResults.length > 0) {
//           const contacts = await User.insertMany(uniqueResults);
//           res.status(200).json({ contacts, skippedEntriesCount, skippedEntries });
//         } else {
//           res.status(200).json({ message: "No new contacts added.", skippedEntriesCount, skippedEntries });
//         }
//       } catch (error) {
//         console.error("Error inserting contacts:", error);
//         res.status(500).json({ error: "Error importing contacts" });
//       } finally {
//         fs.unlinkSync(req.file.path);
//       }
//     })
//     .on("error", (error) => {
//       console.error("Error reading CSV file:", error);
//       res.status(500).json({ error: "Error reading CSV file" });
//       fs.unlinkSync(req.file.path);
//     });
// };


import { User, ROLES } from "../model/userModel.js";
import csv from "csv-parser";
import fs from "fs";

export const uploadContacts = (req, res) => {
  const results = [];
  let skippedEntriesCount = 0;
  const skippedEntries = {}; // Dictionary to log skipped enrollment IDs with reasons

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      const formattedData = {
        enrollmentId: data["Enrollment ID"],
        date: data["Date"],
        name: data["Name"],
        email: data["Email"],
        primaryContact: data["Primary Contact"],
        secondaryContact: data["Secondary Contact"],
        managerUids: data["Manager UIDs"] ? data["Manager UIDs"].split(",") : [], // Support multiple managers
        batch: data["Batch"],
      };

      if (
        formattedData.date &&
        formattedData.name &&
        formattedData.email &&
        formattedData.primaryContact &&
        formattedData.managerUids.length > 0 &&
        formattedData.batch
      ) {
        results.push(formattedData);
      } else {
        skippedEntriesCount++;
        skippedEntries[formattedData.enrollmentId] = "Missing required fields";
      }
    })
    .on("end", async () => {
      try {
        const uniqueResults = [];
        const uids = new Map();

        const primaryContacts = results.map((contact) => contact.primaryContact);

        const [existingContacts, managers] = await Promise.all([
          User.find({ primaryContact: { $in: primaryContacts } }), // Fetch existing contacts
          User.find({ role: ROLES.MANAGER }), // Fetch all managers
        ]);

        const contactMap = new Map(
          existingContacts.map((contact) => [contact.primaryContact, contact])
        );
        const managerMap = new Map(
          managers.map((manager) => [manager.uid, manager._id]) // Use 'uid' for mapping managers
        );

        // Get the latest UID and set the next UID number
        const latestContact = await User.findOne({}).sort({ uid: -1 }) || { uid: "UID0" };
        let nextUidNumber = latestContact.uid
          ? parseInt(latestContact.uid.replace("UID", "")) + 1
          : 1;

        for (const contact of results) {
          const existingContact = contactMap.get(contact.primaryContact);

          // Map manager UIDs to ObjectIds
          const managerIds = contact.managerUids
            .map((uid) => managerMap.get(uid))
            .filter(Boolean); // Only keep valid ObjectIds

          if (managerIds.length === 0) {
            skippedEntriesCount++;
            skippedEntries[contact.enrollmentId] = "Invalid manager UIDs";
            continue;
          }

          let uid;
          if (uids.has(contact.primaryContact)) {
            uid = uids.get(contact.primaryContact);
          } else if (existingContact?.uid) {
            uid = existingContact.uid;
          } else {
            uid = `UID${nextUidNumber++}`;
            uids.set(contact.primaryContact, uid);
          }

          let updatedFields = {};
          if (contact.enrollmentId.startsWith("AZ")) {
            if (
              existingContact?.enrollmentIdAmazon === contact.enrollmentId &&
              existingContact?.batchAmazon === contact.batch &&
              existingContact?.dateAmazon &&
              new Date(existingContact.dateAmazon).toISOString().slice(0, 10) === contact.date
            ) {
              skippedEntriesCount++;
              skippedEntries[contact.enrollmentId] = "Duplicate Amazon entry";
              continue;
            }
            updatedFields = {
              enrollmentIdAmazon: contact.enrollmentId,
              dateAmazon: new Date(contact.date),
              batchAmazon: contact.batch,
            };
          } else if (contact.enrollmentId.startsWith("WB")) {
            if (
              existingContact?.enrollmentIdWebsite === contact.enrollmentId &&
              existingContact?.batchWebsite === contact.batch &&
              existingContact?.dateWebsite &&
              new Date(existingContact.dateWebsite).toISOString().slice(0, 10) === contact.date
            ) {
              skippedEntriesCount++;
              skippedEntries[contact.enrollmentId] = "Duplicate Website entry";
              continue;
            }
            updatedFields = {
              enrollmentIdWebsite: contact.enrollmentId,
              dateWebsite: new Date(contact.date),
              batchWebsite: contact.batch,
            };
          } else {
            skippedEntriesCount++;
            skippedEntries[contact.enrollmentId] = "Unknown enrollment ID prefix";
            continue;
          }

          const contactData = {
            ...contact,
            uid,
            managers: existingContact
              ? [...new Set([...existingContact.managers, ...managerIds])]
              : managerIds, // Assign or update managers
            ...updatedFields,
          };

          if (existingContact) {
            await User.updateOne(
              { primaryContact: contact.primaryContact },
              { $set: contactData }
            );
          } else {
            uniqueResults.push(contactData);
          }
        }

        if (uniqueResults.length > 0) {
          const contacts = await User.insertMany(uniqueResults);
          res.status(200).json({ contacts, skippedEntriesCount, skippedEntries });
        } else {
          res.status(200).json({ message: "No new contacts added.", skippedEntriesCount, skippedEntries });
        }
      } catch (error) {
        console.error("Error inserting contacts:", error);
        res.status(500).json({ error: "Error importing contacts" });
      } finally {
        fs.unlinkSync(req.file.path);
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res.status(500).json({ error: "Error reading CSV file" });
      fs.unlinkSync(req.file.path);
    });
};
