# MongoDB Atlas Setup Guide

## Connection Details

**Cluster URL**: `cluster0.0e8olu5.mongodb.net`  
**Username**: `FullStack`  
**Password**: `12345678S`  
**Database Name**: `ecommerce`

## Connection Strings

### Development/Testing
```
mongodb+srv://FullStack:12345678S@cluster0.0e8olu5.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### Staging
```
mongodb+srv://FullStack:12345678S@cluster0.0e8olu5.mongodb.net/ecommerce_staging?retryWrites=true&w=majority
```

### Production
```
mongodb+srv://FullStack:12345678S@cluster0.0e8olu5.mongodb.net/ecommerce_production?retryWrites=true&w=majority
```

## Environment Variables

### Local Development
Create a `.env` file in the backend directory:
```bash
MONGO_URI=mongodb+srv://FullStack:12345678S@cluster0.0e8olu5.mongodb.net/ecommerce?retryWrites=true&w=majority
NODE_ENV=development
PORT=3001
JWT_SECRET=your-jwt-secret
```

### Docker
The docker-compose files are configured to use the new MongoDB Atlas connection.

## Security Notes

1. **Network Access**: Ensure your IP address is whitelisted in MongoDB Atlas
2. **Password**: Consider using a more complex password for production
3. **Database Users**: Create separate users for different environments
4. **IP Whitelist**: Add your application server IPs to MongoDB Atlas Network Access

## Testing Connection

Run the test file to verify the connection:
```bash
cd backend
node test.js
```

You should see: "Connected to MongoDB!"

## Troubleshooting

1. **Connection Failed**: Check if your IP is whitelisted in MongoDB Atlas
2. **Authentication Failed**: Verify username and password
3. **Network Issues**: Ensure your firewall allows outbound connections to port 27017
4. **Cluster Status**: Check if your MongoDB Atlas cluster is running

## Next Steps

1. Test the connection using `node test.js`
2. Start your application: `npm start`
3. Verify data operations work correctly
4. Update any additional configuration files if needed 