const { 
    S3Client, 
    ListObjectsV2Command, 
    HeadObjectCommand, 
    ListBucketsCommand, 
    GetBucketLocationCommand, 
    GetBucketVersioningCommand, 
    GetBucketAclCommand, 
    GetObjectCommand, 
    CreateBucketCommand, 
    DeleteBucketCommand, 
    DeleteObjectsCommand 
} = require('@aws-sdk/client-s3');

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT,
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});

class DataController {
    async listAllBucket(req, res) {
        try {
            const command = new ListBucketsCommand({});
            const data = await s3.send(command);
            
            // Get the list of buckets
            const buckets = data.Buckets ? data.Buckets : [];

            res.json(buckets);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving list of buckets');
        }
    }

    async getBucketDetails() {
        const bucketName = "bucket-test"
        console.log(bucketName)
        try {
            // Check the value of bucketName
            // console.log('Inside getBucketDetails, Bucket Name:', bucketName, typeof bucketName);
    
            if (typeof bucketName !== 'string') {
                throw new Error(`Invalid bucketName: expected a string but got ${typeof bucketName}`);
            }
    
            let size = 0;
            let objectCount = 0;
    
            // Fetch bucket region
            const bucketLocationCommand = new GetBucketLocationCommand({ Bucket: bucketName });
            const locationResponse = await s3.send(bucketLocationCommand);
            const region = locationResponse.LocationConstraint || 'us-east-1';
    
            // Fetch versioning status
            const bucketVersioningCommand = new GetBucketVersioningCommand({ Bucket: bucketName });
            const versioningResponse = await s3.send(bucketVersioningCommand);
            const versioningStatus = versioningResponse.Status || 'Disabled';
    
            // Fetch bucket ACL
            const bucketAclCommand = new GetBucketAclCommand({ Bucket: bucketName });
            const aclResponse = await s3.send(bucketAclCommand);
    
            // Check if public access is blocked
            const publicAccessBlocked = !aclResponse.Grants.some(grant => grant.Permission === 'READ');
    
            // Calculate bucket size and object count
            const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucketName });
            let continuationToken;
    
            do {
                const response = await s3.send(listObjectsCommand);
                objectCount += response.Contents ? response.Contents.length : 0;
                size += response.Contents ? response.Contents.reduce((total, obj) => total + obj.Size, 0) : 0;
                continuationToken = response.NextContinuationToken;
                listObjectsCommand.input.ContinuationToken = continuationToken;
            } while (continuationToken);
    
            return {
                size, objectCount, region, versioningStatus, publicAccessBlocked
            };
        } catch (err) {
            console.error(`Error retrieving details for bucket ${bucketName}:`, err.message);
            // res.status(500).json(`Error retrieving details for bucket ${bucketName}:`, err.message);
            return null;
        }
    }
    

    async listObjects(req, res) {
        const { bucketName } = req.params;
    
        if (!bucketName) {
            return res.status(400).json({ error: 'Bucket name is required.' });
        }
    
        try {
            const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
            const data = await s3.send(listCommand);
    
            const files = data.Contents ? data.Contents.map(item => item.Key) : [];
            let totalSizeInBytes = 0;
    
            const filesWithDetails = await Promise.all(files.map(async (fileName) => {
                const headCommand = new HeadObjectCommand({ Bucket: bucketName, Key: fileName });
                const headData = await s3.send(headCommand);
                const sizeInBytes = headData.ContentLength;
                const sizeInKo = (sizeInBytes / 1024).toFixed(2); // Conversion en Ko
                const sizeInMo = (sizeInBytes / (1024 * 1024)).toFixed(2); // Conversion en Mo
                
                // Accumuler la taille totale
                totalSizeInBytes += sizeInBytes;
    
                return {
                    name: fileName,
                    type: headData.ContentType,
                    size: {
                        bytes: sizeInBytes,
                        ko: sizeInKo,
                        mo: sizeInMo
                    },
                    lastModified: headData.LastModified,
                };
            }));
    
            const totalSizeInMo = (totalSizeInBytes / (1024 * 1024)).toFixed(2);
    
            res.json({ files: filesWithDetails, totalSize: { bytes: totalSizeInBytes, mo: totalSizeInMo } });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: `Error retrieving files from bucket "${bucketName}"` });
        }
    }

    async viewFile(req, res) {
        const { bucketName, fileName } = req.params;
    
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: fileName,
            });
    
            // Generate a presigned URL valid for 1 hour
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            res.json({ url });
        } catch (error) {
            console.error('Error generating presigned URL:', error);
            res.status(500).send(`Error generating URL for file "${fileName}" in bucket "${bucketName}"`);
        }
    }

    async createBucket(req, res) {
        const { bucketName } = req.body;

        if (!bucketName) {
            return res.status(400).json({ error: 'Bucket name is required.' });
        }

        try {
            const command = new CreateBucketCommand({ Bucket: bucketName });
            await s3.send(command);
            res.status(201).json({ message: `Bucket "${bucketName}" created successfully.` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: `Error creating bucket "${bucketName}": ${err.message}` });
        }
    };

    async deleteBucket(req, res) {
        const { bucketName } = req.body;
    
        if (!bucketName) {
            return res.status(400).json({ error: 'Bucket name is required.' });
        }
    
        try {
            const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
            const listResponse = await s3.send(listCommand);
    
            if (listResponse.Contents && listResponse.Contents.length > 0) {
                const objectsToDelete = listResponse.Contents.map(item => ({ Key: item.Key }));
    
                const deleteCommand = new DeleteObjectsCommand({
                    Bucket: bucketName,
                    Delete: {
                        Objects: objectsToDelete,
                    },
                });
    
                await s3.send(deleteCommand);
                console.log(`Deleted ${objectsToDelete.length} objects from bucket "${bucketName}".`);
            }
    
            const deleteBucketCommand = new DeleteBucketCommand({ Bucket: bucketName });
            await s3.send(deleteBucketCommand);
            res.status(200).json({ message: `Bucket "${bucketName}" deleted successfully.` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: `Error deleting bucket "${bucketName}": ${err.message}` });
        }
    }
}

module.exports = new DataController();
