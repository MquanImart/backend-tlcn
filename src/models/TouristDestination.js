import mongoose from 'mongoose';

const { Schema } = mongoose;

const TouristDestinationSchema = new Schema({
  name: { type: String, required: true },
  pageId: {
    type: Schema.Types.ObjectId,
    ref: 'Page', 
  },
  province: { type: String, required: true },
  best_months: [{ 
    type: Number, 
    min: 1, 
    max: 12 
  }],
  tags: [{
    type: String,
    enum: [
      'mountain', 'beach', 'forest', 'grassland', 'desert', 'river', 'lake', 'waterfall', 'cave',
      'rice_field', 'flower_field', 'sky', 'island', 'volcano', 'national_park', 'canyon', 'snow',
      'wildlife', 'bird', 'livestock', 'marine_life', 'festival', 'traditional_costume', 'market',
      'cuisine', 'village', 'local_people', 'ceremony', 'street_art', 'historical_site', 'landmark',
      'bridge', 'cityscape', 'traditional_house', 'old_town', 'castle', 'trekking', 'diving', 'camping',
      'kayaking', 'hot_air_balloon', 'cycling', 'motorcycling', 'skiing', 'surfing', 'paragliding',
      'street', 'transport', 'tree', 'weather', 'light', 'signpost', 'season', 'sunset', 'sunrise',
      'aurora', 'night_sky', 'rock', 'lantern', 'photography', 'clouds'
    ],
    required: true,
  }],
  coordinates: {
    type: [Number], // [longitude, latitude]
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'Coordinates must be an array of [longitude, latitude]'
    },
    required: true,
  }
}, { timestamps: true }); // tự động thêm createdAt, updatedAt

const TouristDestination = mongoose.model('TouristDestination', TouristDestinationSchema);

export default TouristDestination;
