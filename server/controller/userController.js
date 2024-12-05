import { User, ROLES } from '../model/userModel.js';


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
      return res.status(400).json({ message: 'Invalid role' });
    }

    // If role is USER, validate manager IDs
    if (role === ROLES.USER) {
      if (!managerIds || !managerIds.length) {
        return res.status(400).json({ message: 'At least one manager must be assigned to a user' });
      }

      // Validate provided manager IDs
      const managers = await User.find({ _id: { $in: managerIds }, role: ROLES.MANAGER });
      if (managers.length !== managerIds.length) {
        return res.status(400).json({ message: 'One or more managers not found or invalid' });
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

    res.status(201).json({ message: `${role} created successfully`, user: newUser });
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
    const users = await User.find(filter).populate('managers', 'name email');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update user (assign/unassign managers)
// export const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { name, email, password, managerIds } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (managerIds) {
//       // Validate all provided manager IDs
//       const managers = await User.find({ _id: { $in: managerIds }, role: ROLES.MANAGER });
//       if (managers.length !== managerIds.length) {
//         return res.status(400).json({ message: 'One or more managers not found or invalid' });
//       }
//       user.managers = managerIds; // Assign new managers
//     }

//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (password) user.password = password;

//     await user.save();

//     res.status(200).json({ message: 'User updated successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body; // Get all fields to update from the request body

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (updates.managerIds) {
      // Validate all provided manager IDs
      const managers = await User.find({ _id: { $in: updates.managerIds }, role: ROLES.MANAGER });
      if (managers.length !== updates.managerIds.length) {
        return res.status(400).json({ message: 'One or more managers not found or invalid' });
      }
      updates.managers = updates.managerIds; // Ensure the correct field is updated
      delete updates.managerIds; // Remove from updates to avoid overriding unintentionally
    }

    // Update user with the provided fields
    Object.assign(user, updates);

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID to check service type (Amazon or Website)
// export const getUserById = async (req, res) => {
//   try {
//     const { userId } = req.params; // userId is the ObjectId

//     // Find user by ObjectId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if the user is a manager and return their service
//     if (user.role === ROLES.MANAGER) {
//       return res.status(200).json({ service: user.service });
//     }

//     // Return a message if the user is not a manager
//     return res.status(400).json({ message: 'User is not a manager' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // userId is the ObjectId

    // Find user by ObjectId
    const user = await User.findById(userId).populate('managers', 'name email'); // Populate managers if needed

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data, regardless of role
    let responseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      primaryContact: user.primaryContact,
      managers: user.managers, // Return managers for user role
    };

    // Additional data for specific roles (manager, admin, or user)
    if (user.role === ROLES.MANAGER) {
      // Add service field for managers
      responseData.service = user.service;
    }

    if (user.role === ROLES.USER) {
      // Add specific fields for users (Amazon or Website)
      responseData.uid = user.uid;
      responseData.dateAmazon = user.dateAmazon;
      responseData.dateWebsite = user.dateWebsite;
      responseData.enrollmentIdAmazon = user.enrollmentIdAmazon;
      responseData.enrollmentIdWebsite = user.enrollmentIdWebsite;
      responseData.batch = user.batch;
    }

    // For admins, you might want to return a full list of all users or just their data
    if (user.role === ROLES.ADMIN) {
      // Additional fields for admins (e.g., managers assigned)
      responseData.managers = user.managers;
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

