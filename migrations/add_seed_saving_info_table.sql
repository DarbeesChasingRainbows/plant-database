-- Migration: Add seed_saving_info table

-- Create seed_saving_info table
CREATE TABLE IF NOT EXISTS seed_saving_info (
  info_id SERIAL PRIMARY KEY,
  plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  pollination_type VARCHAR(100),
  life_cycle VARCHAR(50),
  isolation_distance_m INTEGER,
  seed_viability_years INTEGER,
  seed_collection_method TEXT,
  seed_cleaning_method TEXT,
  seed_storage_conditions TEXT,
  seeds_per_gram INTEGER,
  germination_test_method TEXT,
  seed_treatment_before_storage TEXT,
  minimum_population_size INTEGER,
  time_to_seed_maturity_days INTEGER,
  seed_saving_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on plant_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_seed_saving_info_plant_id ON seed_saving_info(plant_id);

-- Add a comment to the table
COMMENT ON TABLE seed_saving_info IS 'Stores information about seed saving for plants';
