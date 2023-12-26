const mongoose = require('mongoose');
const  User = require('./model/user'); // Replace with the correct path to your models
const Visitor = require('./model/visitor');
const Visit = require('./model/visit');
// Connect to MongoDB (make sure your MongoDB server is running)
mongoose.connect('mongodb+srv://codecinnpro:9qLtJIAG9k8G1Pe8@cluster0.egrjwh1.mongodb.net/vms_2?retryWrites=true&w=majority')

async function seedData() {
    try {
        await User.deleteMany({});
        await Visitor.deleteMany({});
        await Visit.deleteMany({});
        // Sample user data
        const user = new User({
            username: 'admin1',
            password: 'adminpassword',
            email: 'admin@example.com',
            phoneNumber: 1234567890,
            category: 'admin'
        });

        // Sample visitor data
        const visitor1 = new Visitor({
            name: 'Visitor434',
            phoneNumber: 1234567890,
        });
        const visit1 = new Visit({
            purposeOfVisit: 'Meeting',
            visitTime: new Date('2023-01-01T10:00:00Z'),
            visitor_id: visitor1._id,
        });
        visitor1.visits_id.push(visit1);
        // Connect the visitor data to the user schema
        user.visitors.push(visitor1);

        // Save the user data to the database
        await visit1.save();
        await visitor1.save();
        await user.save();

        // Sample host user data
        const hostUser = new User({
            username: 'host1',
            password: 'hostpassword',
            email: 'host@example.com',
            phoneNumber: 9876543210,
            category: 'host' 
        });

        const visitor2 = new Visitor({
            name: 'Visitor2',
            phoneNumber: 1234567890,
        })
        const visit2 = new Visit({
            purposeOfVisit: 'Interview',
            visitTime: new Date('2023-01-01T15:00:00Z'),
            visitor_id: visitor2._id,
        })
        visitor2.visits_id.push(visit2);
        hostUser.visitors.push(visitor2);
        // Save the host data to the database
        await visit2.save();
        await visitor2.save();
        await hostUser.save();


        console.log('Data seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        // Disconnect from the database after seeding
        mongoose.disconnect();
    }
}

// Call the seedData function to populate the database
seedData();