const mongoose = require('mongoose');
require('dotenv').config();

const fixDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        // List indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        // Drop auth0Id index if it exists
        const auth0Index = indexes.find(idx => idx.name === 'auth0Id_1');
        if (auth0Index) {
            await collection.dropIndex('auth0Id_1');
            console.log('Dropped auth0Id_1 index');
        } else {
            console.log('auth0Id_1 index not found');
        }

        // Drop email index if it exists to recreate it properly (optional, but good practice if schema changed)
        // We defined email as unique in the new schema, so mongoose should handle it, 
        // but if there are duplicates, we might need to clean up. 
        // For now, let's just focus on the error causing index.

        console.log('Database fix complete');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing database:', error);
        process.exit(1);
    }
};

fixDb();
