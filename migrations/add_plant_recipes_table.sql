-- migrations/add_plant_recipes_table.sql

-- Create the plant_recipes table
CREATE TABLE IF NOT EXISTS plant_recipes (
  recipe_id SERIAL PRIMARY KEY,
  plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  recipe_name VARCHAR(255) NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  preparation_time INTEGER,
  difficulty_level VARCHAR(50),
  yield VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on plant_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_plant_recipes_plant_id ON plant_recipes(plant_id);

-- Add a comment to the table
COMMENT ON TABLE plant_recipes IS 'Stores recipes that use plants as ingredients';
