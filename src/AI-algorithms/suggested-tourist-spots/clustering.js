import pkg from 'ml-kmeans';
const { kmeans } = pkg;

// Hàm tính khoảng cách Euclidean bình phương giữa hai vector
function squaredEuclideanDistance(v1, v2) {
    let sum = 0;
    for (let i = 0; i < v1.length; i++) {
        sum += (v1[i] - v2[i]) ** 2;
    }
    return sum;
}

const TrainingClustering = (userFeatureVectors) => {
    const userData = Object.values(userFeatureVectors).map(vector => Object.values(vector));
    const maxClusters = Math.floor(Math.sqrt(Object.keys(userFeatureVectors).length));

    const inertiaValues = [];
    const kValues = [];
    const allKMeansResults = {};

    for (let k = 2; k <= 7; k++) {
        console.log("Bắt đầu chạy KMeans với k =", k);
        const kmeansResult = kmeans(userData, k);
        allKMeansResults[k] = kmeansResult;

        let inertia = 0;
        if (kmeansResult.clusters && kmeansResult.centroids) {
            for (let i = 0; i < userData.length; i++) {
                const clusterIndex = kmeansResult.clusters[i];
                const centroid = kmeansResult.centroids[clusterIndex];
                inertia += squaredEuclideanDistance(userData[i], centroid);
            }
        }
        inertiaValues.push(inertia);

        console.log(`K=${k}, Inertia:`, inertia, `, Converged=${kmeansResult.converged}, Iterations=${kmeansResult.iterations}`);
    }
    console.log("Giá trị K:", kValues);
    console.log("Giá trị Inertia:", inertiaValues);

    // return allKMeansResults;
};

// ... (phần còn lại của code bạn gọi hàm này)

const clusteringService = {
    TrainingClustering
}

export default clusteringService;