const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

async function setupOwner() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lets-be-friends');
    console.log('Connected to MongoDB');

    const ownerEmail = 'jason.martin999666@gmail.com';
    const ownerPassword = 'OwnerPassword123!'; // Change this to a secure password

    // Check if owner already exists
    let owner = await User.findOne({ email: ownerEmail });

    if (owner) {
      // Update existing user to owner
      owner.role = 'owner';
      owner.isVerified = true;
      owner.faceVerified = true;
      owner.isActive = true;
      owner.isBanned = false;
      await owner.save();
      console.log(`✓ Updated existing user ${ownerEmail} to owner role`);
    } else {
      // Create new owner account
      const hashedPassword = await bcrypt.hash(ownerPassword, 10);
      owner = await User.create({
        email: ownerEmail,
        password: hashedPassword,
        username: 'owner',
        firstName: 'Owner',
        lastName: 'Admin',
        role: 'owner',
        isVerified: true,
        faceVerified: true,
        isActive: true,
        isBanned: false,
        authProviders: {
          local: true
        }
      });
      console.log(`✓ Created new owner account: ${ownerEmail}`);
      console.log(`✓ Temporary password: ${ownerPassword}`);
      console.log('⚠️  IMPORTANT: Change this password immediately after first login!');
    }

    // Create an admin account for testing (optional)
    let admin = await User.findOne({ email: 'admin@dating-app.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
      admin = await User.create({
        email: 'admin@dating-app.com',
        password: hashedPassword,
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isVerified: true,
        faceVerified: true,
        isActive: true,
        isBanned: false,
        authProviders: {
          local: true
        }
      });
      console.log('✓ Created admin account: admin@dating-app.com');
      console.log('✓ Temporary password: AdminPassword123!');
    }

    console.log('\n✓ Setup completed successfully!');
    console.log('\nYou can now login with:');
    console.log(`  Email: ${ownerEmail}`);
    console.log(`  Password: ${ownerPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Setup failed:', error.message);
    process.exit(1);
  }
}

setupOwner();
