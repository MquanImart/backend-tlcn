import RecentView from "../../models/RecentView.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ConvertUserMatrix = async () => {
    const recentViews = await RecentView.find();
    const allPossibleTags = [
        'mountain', 'beach', 'forest', 'grassland', 'desert', 'river', 'lake', 'waterfall', 'cave', 'rice_field',
        'flower_field', 'sky', 'island', 'volcano', 'national_park', 'canyon', 'snow', 'wildlife', 'bird',
        'livestock', 'marine_life', 'festival', 'traditional_costume', 'market', 'cuisine', 'village',
        'local_people', 'ceremony', 'street_art', 'historical_site', 'landmark', 'bridge', 'cityscape',
        'traditional_house', 'old_town', 'castle', 'trekking', 'diving', 'camping', 'kayaking',
        'hot_air_balloon', 'cycling', 'motorcycling', 'skiing', 'surfing', 'paragliding', 'street',
        'transport', 'tree', 'weather', 'light', 'signpost', 'season', 'sunset', 'sunrise', 'aurora',
        'night_sky', 'rock', 'lantern', 'photography', 'clouds'
    ];

    const userTagMatrix = {};

    recentViews.forEach(record => {
      const userId = record.idUser;
      if (!userTagMatrix[userId]) {
        userTagMatrix[userId] = {};
      }
      record.view.forEach(interaction => {
        interaction.tags.forEach(tag => {
          userTagMatrix[userId][tag] = (userTagMatrix[userId][tag] || 0) + 1;
        });
      });
    });

    const userTagFrequencies = {};

    recentViews.forEach(record => {
        const userId = record.idUser;
        if (!userTagFrequencies[userId]) {
          userTagFrequencies[userId] = {};
        }
        record.view.forEach(interaction => {
          interaction.tags.forEach(tag => {
            userTagFrequencies[userId][tag] = (userTagFrequencies[userId][tag] || 0) + 1;
          });
        });
      });
      
      // Tạo vector đặc trưng cho người dùng
      const userFeatureVectors = {};
      
      for (const userId in userTagFrequencies) {
        userFeatureVectors[userId] = {};
        allPossibleTags.forEach(tag => {
          userFeatureVectors[userId][tag] = userTagFrequencies[userId][tag] || 0;
        });
      }
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, 'tourist_destinations_v1.json');
    let locations = [];

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        locations = JSON.parse(fileData);
      
        const locationFeatureVectors = {};
      
        locations.forEach(location => {
          locationFeatureVectors[location.name] = {};
          allPossibleTags.forEach(tag => {
            locationFeatureVectors[location.name][tag] = location.tags.includes(tag) ? 1 : 0;
          });
        });
      
        return {
            userTagMatrix, userFeatureVectors, locationFeatureVectors
        }
    } catch (error) {
        return null;
    }
}

const pretreatmentService = {
    ConvertUserMatrix
}

export default pretreatmentService;