import { User, ROLES } from "../model/userModel.js";

// export const createUser = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       role,
//       managerIds,
//       ...otherFields // Collect remaining fields dynamically
//     } = req.body;

//     // Validate role
//     if (![ROLES.MANAGER, ROLES.USER].includes(role)) {
//       return res.status(400).json({ message: 'Invalid role' });
//     }

//     // If role is USER, validate manager IDs
//     if (role === ROLES.USER) {
//       if (!managerIds || !managerIds.length) {
//         return res.status(400).json({ message: 'At least one manager must be assigned to a user' });
//       }

//       // Validate provided manager IDs
//       const managers = await User.find({ _id: { $in: managerIds }, role: ROLES.MANAGER });
//       if (managers.length !== managerIds.length) {
//         return res.status(400).json({ message: 'One or more managers not found or invalid' });
//       }
//     }

//     // Create a new user dynamically with provided fields
//     const newUser = new User({
//       name,
//       email,
//       password,
//       role,
//       managers: managerIds || [],
//       ...otherFields, // Spread remaining fields (e.g., dateAmazon, uid, etc.)
//     });

//     await newUser.save();

//     res.status(201).json({ message: `${role} created successfully`, user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      managerIds,
      ...otherFields // Collect remaining fields dynamically
    } = req.body;

    // Validate role: Extend to include Accountant
    if (![ROLES.MANAGER, ROLES.USER, ROLES.ACCOUNTANT].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // If role is USER, validate manager IDs
    if (role === ROLES.USER) {
      if (!managerIds || !managerIds.length) {
        return res
          .status(400)
          .json({ message: "At least one manager must be assigned to a user" });
      }

      // Validate provided manager IDs
      const managers = await User.find({
        _id: { $in: managerIds },
        role: ROLES.MANAGER,
      });
      if (managers.length !== managerIds.length) {
        return res
          .status(400)
          .json({ message: "One or more managers not found or invalid" });
      }
    }

    // Handle specific logic for Accountants if needed (optional)
    if (role === ROLES.ACCOUNTANT) {
      // Example: Validate specific fields or relationships for accountants
      // Add validation or assignments if accountants require specific logic
    }

    // Create a new user dynamically with provided fields
    const newUser = new User({
      name,
      email,
      password,
      role,
      managers: managerIds || [],
      ...otherFields, // Spread remaining fields (e.g., dateAmazon, uid, etc.)
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: `${role} created successfully`, user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users or filter by role
// export const getUsers = async (req, res) => {
//   try {
//     const { role } = req.query;
//     const filter = role ? { role } : {};

//     const users = await User.find(filter).populate('managers', 'name email');
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getUsers = async (req, res) => {
  try {
    const { role, managerId } = req.query;

    // Construct the filter object
    const filter = {};
    if (role) {
      filter.role = role;
    }
    if (managerId) {
      filter.managers = managerId; // Match users assigned to the given manager
    }

    // Fetch users with optional filters and populate managers
    const users = await User.find(filter).populate("managers", "name email");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (assign/unassign managers)
export const assignManager = async (req, res) => {
  const { userId } = req.params; // Use 'userId' to match the route parameter
  const { managerIds } = req.body; // Extract manager IDs from the request body

  // Validate inputs
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }
  const user = await User.find({ _id: userId });
  // console.log(user);

  if (!Array.isArray(managerIds) || managerIds.length === 0) {
    return res
      .status(400)
      .json({ message: "Manager IDs are required and should be an array." });
  }

  try {
    // Fetch the manager users to validate the provided IDs
    const managers = await User.find({
      _id: managerIds,
      role: ROLES.MANAGER, // Ensure only valid manager roles are included
    });

    // If no valid managers are found, return an error
    if (managers.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid managers found with the provided IDs." });
    }

    // Extract manager IDs from the documents
    const managerObjectIds = managers.map((manager) => manager._id);

    // Update the user's managers field
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId }, // Use 'userId' for querying the user
      { $addToSet: { managers: { $each: managerObjectIds } } }, // Add managers without duplication
      { new: true } // Return the updated user document
    );

    // If the user is not found, return a 404 error
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with the updated user
    res
      .status(200)
      .json({ message: "Managers assigned successfully.", user: updatedUser });
  } catch (error) {
    // Handle server errors
    console.error("Error assigning managers:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateUser = async (req, res) => {
  const { uid } = req.params; // Extract user ID from URL
  console.log("User ID to update:", uid);

  // Validate if the UID is provided
  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  const {
    name,
    email,
    primaryContact,
    batchAmazon,
    batchWebsite,
    enrollmentIdAmazon,
    enrollmentIdWebsite,
  } = req.body;

  // Validate if required fields are present
  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  try {
    // Find the user by UID and update their data
    const user = await User.findOneAndUpdate(
      { uid }, // Find user by UID
      {
        name,
        email,
        primaryContact,
        batchAmazon,
        batchWebsite,
        enrollmentIdAmazon,
        enrollmentIdWebsite,
      },
      { new: true } // Return the updated document
    );

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send response with updated user data
    res.status(200).json(user);
  } catch (error) {
    // Log the error and send a response
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID to check service type (Amazon or Website)
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    // Find user by ObjectId
    const user = await User.findById(userId).populate("managers", "name email"); // Populate managers if needed

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Spread user object to include all fields, then add/modify based on role
    let responseData = {
      ...user.toObject(), // Convert Mongoose document to plain JavaScript object
    };

    // Additional data for specific roles
    if (user.role === ROLES.MANAGER) {
      responseData.service = user.service;
    }

    if (user.role === ROLES.USER) {
      responseData = {
        ...responseData,
        uid: user.uid,
        dateAmazon: user.dateAmazon,
        dateWebsite: user.dateWebsite,
        enrollmentIdAmazon: user.enrollmentIdAmazon,
        enrollmentIdWebsite: user.enrollmentIdWebsite,
        batch: user.batch,
      };
    }

    if (user.role === ROLES.ADMIN) {
      responseData.managers = user.managers;
    }

    // Send the full user data with modifications
    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
