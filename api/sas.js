module.exports = {
    get: function (req, res, next) {
        var azure = require('azure-storage');

        var blob = req.query.blobName;
        var BlobUtilities = azure.BlobUtilities;
        var container = req.query.containerName.toLowerCase();

        var blobService = azure.createBlobService(process.env.STORAGE_ACCOUNT_NAME, process.env.STORAGE_ACCOUNT_ACCESS_KEY);

        blobService.createContainerIfNotExists(container, {
            publicAccessLevel: 'blob'
        }, function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Created the container ' + container);
                var expiryDate = new Date();
                expiryDate.setMinutes(expiryDate.getMinutes() + 30);

                var sharedAccessPolicy = {
                    AccessPolicy: {
                        Permissions: BlobUtilities.SharedAccessPermissions.READ + BlobUtilities.SharedAccessPermissions.WRITE + BlobUtilities.SharedAccessPermissions.LIST,
                        Expiry: expiryDate
                    },
                };

                var sas = blobService.generateSharedAccessSignature(container, blob, sharedAccessPolicy);
                
                var sharedBlobService = azure.createBlobServiceWithSas(blobService.host, sas);
                
                var sasQueryUrl = sharedBlobService.getUrl(container, blob, sas);
               
                res.status(200).send(JSON.stringify(sasQueryUrl));

            }
        });
    }
}