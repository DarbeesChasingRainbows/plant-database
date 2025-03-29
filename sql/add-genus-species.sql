-- Add genus and species columns to plants table
ALTER TABLE plants ADD COLUMN genus VARCHAR(100);
ALTER TABLE plants ADD COLUMN species VARCHAR(100);

-- Update existing plants if needed
-- Example: UPDATE plants SET genus = 'Extracted genus', species = 'Extracted species' WHERE botanical_name LIKE '%genus species%';

-- Add indexes for better performance
CREATE INDEX idx_plants_genus ON plants(genus);
CREATE INDEX idx_plants_species ON plants(species);

-- Comment explaining the migration
COMMENT ON COLUMN plants.genus IS 'Taxonomic genus of the plant';
COMMENT ON COLUMN plants.species IS 'Taxonomic species of the plant';
